/**
 * Double-Entry Accounting Engine for MEEZAN Platform
 * All monetary amounts are handled strictly in piasters (1 EGP = 100 piasters) to avoid floating-point errors.
 */

import { LedgerAccount, LedgerTransaction, LedgerEntry } from '../types';

export const INITIAL_CHART_OF_ACCOUNTS: LedgerAccount[] = [
  {
    account_number: 1000,
    name_ar: 'أموال لدى مزود الدفع',
    name_en: 'Funds with Payment Gateway',
    type: 'asset',
    balance_piasters: 25000000, // 250,000 EGP
  },
  {
    account_number: 1100,
    name_ar: 'البنك / حساب التسوية',
    name_en: 'Bank / Settlement Account',
    type: 'asset',
    balance_piasters: 50000000, // 500,000 EGP
  },
  {
    account_number: 2000,
    name_ar: 'مستحقات المحاسبين',
    name_en: 'Accountant Payouts Payable',
    type: 'liability',
    balance_piasters: 8500000, // 85,000 EGP
  },
  {
    account_number: 2100,
    name_ar: 'التزامات الاسترداد',
    name_en: 'Refund Liabilities',
    type: 'liability',
    balance_piasters: 0,
  },
  {
    account_number: 4000,
    name_ar: 'إيرادات عمولة المنصة',
    name_en: 'Platform Commission Revenue',
    type: 'revenue',
    balance_piasters: 1500000, // 15,000 EGP
  },
  {
    account_number: 5000,
    name_ar: 'رسوم بوابة الدفع',
    name_en: 'Payment Gateway Fees',
    type: 'expense',
    balance_piasters: 250000, // 2,500 EGP
  },
  {
    account_number: 5100,
    name_ar: 'مصروفات تشغيلية',
    name_en: 'Operating Expenses',
    type: 'expense',
    balance_piasters: 400000, // 4,000 EGP
  },
];

/**
 * Calculates platform fee and accountant share in integer piasters.
 * Assures platform_fee + accountant_share === total_amount strictly.
 */
export function calculateBookingSplit(
  totalAmountPiasters: number,
  commissionRate: number = 0.15
): { platformFeePiasters: number; accountantPayoutPiasters: number } {
  if (totalAmountPiasters < 0) {
    throw new Error('Total amount cannot be negative');
  }
  if (commissionRate < 0 || commissionRate > 1) {
    throw new Error('Commission rate must be between 0 and 1');
  }

  // Integer rounding
  const platformFeePiasters = Math.round(totalAmountPiasters * commissionRate);
  const accountantPayoutPiasters = totalAmountPiasters - platformFeePiasters;

  return {
    platformFeePiasters,
    accountantPayoutPiasters,
  };
}

/**
 * Validates that total debits strictly equal total credits.
 */
export function validateDoubleEntryBalance(entries: LedgerEntry[]): boolean {
  if (!entries || entries.length < 2) return false;

  const totalDebits = entries
    .filter((e) => e.entry_type === 'debit')
    .reduce((sum, e) => sum + e.amount_piasters, 0);

  const totalCredits = entries
    .filter((e) => e.entry_type === 'credit')
    .reduce((sum, e) => sum + e.amount_piasters, 0);

  return totalDebits === totalCredits && totalDebits > 0;
}

/**
 * Generates balanced double-entry ledger entries for a successful booking payment.
 * Dr. 1000 (Funds with Payment Gateway) - Full Amount
 *   Cr. 2000 (Accountant Payouts Payable) - 85%
 *   Cr. 4000 (Platform Commission Revenue) - 15%
 */
export function createBookingPaymentEntries(
  transactionId: string,
  totalPiasters: number,
  commissionRate: number = 0.15
): { transaction: LedgerTransaction; entries: LedgerEntry[] } {
  const { platformFeePiasters, accountantPayoutPiasters } = calculateBookingSplit(
    totalPiasters,
    commissionRate
  );

  const transaction: LedgerTransaction = {
    id: transactionId,
    reference_type: 'booking_payment',
    reference_id: transactionId,
    description: `تحصيل حجز استشارة - قيمة ${totalPiasters / 100} ج.م (عمولة ${Math.round(commissionRate * 100)}%)`,
    posted_at: new Date().toISOString(),
    is_reversed: false,
  };

  const entries: LedgerEntry[] = [
    {
      id: `${transactionId}-dr-1000`,
      transaction_id: transactionId,
      account_number: 1000, // Asset
      entry_type: 'debit',
      amount_piasters: totalPiasters,
    },
    {
      id: `${transactionId}-cr-2000`,
      transaction_id: transactionId,
      account_number: 2000, // Liability
      entry_type: 'credit',
      amount_piasters: accountantPayoutPiasters,
    },
    {
      id: `${transactionId}-cr-4000`,
      transaction_id: transactionId,
      account_number: 4000, // Revenue
      entry_type: 'credit',
      amount_piasters: platformFeePiasters,
    },
  ];

  if (!validateDoubleEntryBalance(entries)) {
    throw new Error('Unbalanced journal entries generated!');
  }

  return { transaction, entries };
}

/**
 * Generates balanced entries for an accountant payout settlement.
 * Dr. 2000 (Accountant Payouts Payable)
 *   Cr. 1100 (Bank / Settlement Account)
 */
export function createPayoutSettlementEntries(
  transactionId: string,
  payoutId: string,
  amountPiasters: number,
  accountantName: string
): { transaction: LedgerTransaction; entries: LedgerEntry[] } {
  const transaction: LedgerTransaction = {
    id: transactionId,
    reference_type: 'payout_settlement',
    reference_id: payoutId,
    description: `تسوية تحويل بنكي للمحاسب: ${accountantName} - مبلغ ${amountPiasters / 100} ج.م`,
    posted_at: new Date().toISOString(),
    is_reversed: false,
  };

  const entries: LedgerEntry[] = [
    {
      id: `${transactionId}-dr-2000`,
      transaction_id: transactionId,
      account_number: 2000,
      entry_type: 'debit',
      amount_piasters: amountPiasters,
    },
    {
      id: `${transactionId}-cr-1100`,
      transaction_id: transactionId,
      account_number: 1100,
      entry_type: 'credit',
      amount_piasters: amountPiasters,
    },
  ];

  if (!validateDoubleEntryBalance(entries)) {
    throw new Error('Unbalanced payout settlement entries!');
  }

  return { transaction, entries };
}

/**
 * Generates reversal entries (قيد عكسي) for a reversed transaction.
 */
export function createReversalEntries(
  originalTransaction: LedgerTransaction,
  originalEntries: LedgerEntry[],
  newTxId: string,
  reason: string
): { reversalTransaction: LedgerTransaction; reversalEntries: LedgerEntry[] } {
  const reversalTransaction: LedgerTransaction = {
    id: newTxId,
    reference_type: 'adjustment',
    reference_id: originalTransaction.id,
    description: `قيد عكسي للمعاملة #${originalTransaction.id} - السبب: ${reason}`,
    posted_at: new Date().toISOString(),
    is_reversed: false,
  };

  // Flip debit <-> credit
  const reversalEntries: LedgerEntry[] = originalEntries.map((entry, idx) => ({
    id: `${newTxId}-rev-${idx}`,
    transaction_id: newTxId,
    account_number: entry.account_number,
    entry_type: entry.entry_type === 'debit' ? 'credit' : 'debit',
    amount_piasters: entry.amount_piasters,
  }));

  if (!validateDoubleEntryBalance(reversalEntries)) {
    throw new Error('Unbalanced reversal entries!');
  }

  return { reversalTransaction, reversalEntries };
}

/**
 * Formats piasters to Egyptian Pound string (e.g. 100000 -> 1,000.00 ج.م or EGP 1,000.00).
 */
export function formatEGP(piasters: number, lang: 'ar' | 'en' = 'ar'): string {
  const egp = (piasters / 100).toLocaleString(lang === 'ar' ? 'ar-EG' : 'en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return lang === 'ar' ? `${egp} ج.م` : `${egp} EGP`;
}

/**
 * Converts EGP float input from user to piasters integer.
 */
export function egpToPiasters(egp: number): number {
  return Math.round(egp * 100);
}
