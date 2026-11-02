import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateBookingSplit,
  validateDoubleEntryBalance,
  createBookingPaymentEntries,
  createPayoutSettlementEntries,
  createReversalEntries,
  formatEGP,
} from '../lib/accounting.ts';
import {
  canTransitionStatus,
  isSlotAvailable,
} from '../lib/bookingStateMachine.ts';
import { AvailabilitySlot } from '../types/index.ts';

test('calculateBookingSplit computes 15% platform commission and 85% accountant share correctly', () => {
  // 1,000 EGP = 100,000 piasters
  const split1000 = calculateBookingSplit(100000, 0.15);
  assert.equal(split1000.platformFeePiasters, 15000); // 150 EGP
  assert.equal(split1000.accountantPayoutPiasters, 85000); // 850 EGP
  assert.equal(split1000.platformFeePiasters + split1000.accountantPayoutPiasters, 100000);

  // Odd amount test (e.g. 333.33 EGP = 33,333 piasters)
  const splitOdd = calculateBookingSplit(33333, 0.15);
  assert.equal(splitOdd.platformFeePiasters + splitOdd.accountantPayoutPiasters, 33333);
});

test('validateDoubleEntryBalance verifies strict debit and credit equality', () => {
  const balancedEntries = [
    { id: '1', transaction_id: 'tx-1', account_number: 1000, entry_type: 'debit' as const, amount_piasters: 100000 },
    { id: '2', transaction_id: 'tx-1', account_number: 2000, entry_type: 'credit' as const, amount_piasters: 85000 },
    { id: '3', transaction_id: 'tx-1', account_number: 4000, entry_type: 'credit' as const, amount_piasters: 15000 },
  ];
  assert.equal(validateDoubleEntryBalance(balancedEntries), true);

  const unbalancedEntries = [
    { id: '1', transaction_id: 'tx-1', account_number: 1000, entry_type: 'debit' as const, amount_piasters: 100000 },
    { id: '2', transaction_id: 'tx-1', account_number: 2000, entry_type: 'credit' as const, amount_piasters: 80000 },
  ];
  assert.equal(validateDoubleEntryBalance(unbalancedEntries), false);
});

test('createBookingPaymentEntries generates valid double-entry set', () => {
  const { transaction, entries } = createBookingPaymentEntries('tx-test-01', 100000, 0.15);
  assert.equal(transaction.reference_type, 'booking_payment');
  assert.equal(entries.length, 3);
  assert.equal(validateDoubleEntryBalance(entries), true);
});

test('createPayoutSettlementEntries balances debit to liability and credit to bank', () => {
  const { transaction, entries } = createPayoutSettlementEntries(
    'payout-tx-1',
    'payout-1',
    85000,
    'أحمد عبد الرحمن'
  );
  assert.equal(transaction.reference_type, 'payout_settlement');
  assert.equal(validateDoubleEntryBalance(entries), true);
});

test('createReversalEntries correctly flips debit and credit while maintaining balance', () => {
  const { transaction, entries } = createBookingPaymentEntries('tx-test-02', 200000, 0.15);
  const { reversalTransaction, reversalEntries } = createReversalEntries(
    transaction,
    entries,
    'rev-02',
    'إلغاء واسترداد حجز'
  );
  assert.equal(reversalTransaction.reference_type, 'adjustment');
  assert.equal(validateDoubleEntryBalance(reversalEntries), true);
});

test('formatEGP produces accurate currency string in Arabic and English', () => {
  const arabicStr = formatEGP(100000, 'ar');
  assert.match(arabicStr, /ج\.م/);
  const englishStr = formatEGP(100000, 'en');
  assert.match(englishStr, /EGP/);
});

test('canTransitionStatus enforces valid booking lifecycle paths', () => {
  assert.equal(canTransitionStatus('requested', 'awaiting_payment'), true);
  assert.equal(canTransitionStatus('awaiting_payment', 'paid'), true);
  assert.equal(canTransitionStatus('paid', 'accepted'), true);
  assert.equal(canTransitionStatus('accepted', 'in_progress'), true);
  assert.equal(canTransitionStatus('in_progress', 'completed'), true);

  // Invalid leaps
  assert.equal(canTransitionStatus('requested', 'completed'), false);
  assert.equal(canTransitionStatus('completed', 'requested'), false);
});

test('isSlotAvailable detects occupied slots and overlapping time collisions', () => {
  const slots: AvailabilitySlot[] = [
    {
      id: 'slot-1',
      accountant_id: 'acc-1',
      start_time: '2026-11-02T10:00:00Z',
      end_time: '2026-11-02T11:00:00Z',
      is_booked: true,
    },
    {
      id: 'slot-2',
      accountant_id: 'acc-1',
      start_time: '2026-11-02T11:30:00Z',
      end_time: '2026-11-02T12:30:00Z',
      is_booked: false,
    },
    {
      id: 'slot-3',
      accountant_id: 'acc-1',
      start_time: '2026-11-02T10:30:00Z', // Overlaps with slot-1
      end_time: '2026-11-02T11:30:00Z',
      is_booked: false,
    },
  ];

  // slot-1 is already booked
  assert.equal(isSlotAvailable('slot-1', slots, []), false);

  // slot-2 has no collision
  assert.equal(isSlotAvailable('slot-2', slots, []), true);

  // slot-3 is free itself, but collides with booked slot-1 (10:00-11:00 vs 10:30-11:30)
  assert.equal(isSlotAvailable('slot-3', slots, []), false);
});
