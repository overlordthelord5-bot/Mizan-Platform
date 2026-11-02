/**
 * Booking State Machine & Slot Availability Rules for MEEZAN Platform
 */

import { BookingStatus, AvailabilitySlot } from '../types';

export const ALLOWED_TRANSITIONS: Record<BookingStatus, BookingStatus[]> = {
  requested: ['awaiting_payment', 'cancelled'],
  awaiting_payment: ['paid', 'cancelled'],
  paid: ['accepted', 'cancelled', 'refunded'],
  accepted: ['in_progress', 'cancelled', 'disputed'],
  in_progress: ['completed', 'disputed'],
  completed: ['disputed'], // Can open dispute within grace period
  cancelled: [], // Terminal
  disputed: ['completed', 'refunded', 'in_progress'], // Resolved by admin
  refunded: [], // Terminal
};

/**
 * Validates whether a booking status transition is permitted by the state machine.
 */
export function canTransitionStatus(
  currentStatus: BookingStatus,
  targetStatus: BookingStatus
): boolean {
  if (currentStatus === targetStatus) return true;
  const allowed = ALLOWED_TRANSITIONS[currentStatus] || [];
  return allowed.includes(targetStatus);
}

/**
 * Checks for slot availability and collision prevention.
 * Returns true if the slot is free and doesn't collide with existing booked slots for this accountant.
 */
export function isSlotAvailable(
  slotId: string,
  allSlots: AvailabilitySlot[],
  existingBookingsSlots: string[]
): boolean {
  const targetSlot = allSlots.find((s) => s.id === slotId);
  if (!targetSlot) return false;
  if (targetSlot.is_booked) return false;
  if (existingBookingsSlots.includes(slotId)) return false;

  // Check for time overlap with any already booked slot of the same accountant
  const targetStart = new Date(targetSlot.start_time).getTime();
  const targetEnd = new Date(targetSlot.end_time).getTime();

  const bookedSlots = allSlots.filter(
    (s) => s.accountant_id === targetSlot.accountant_id && s.is_booked && s.id !== slotId
  );

  for (const booked of bookedSlots) {
    const bStart = new Date(booked.start_time).getTime();
    const bEnd = new Date(booked.end_time).getTime();
    // Overlap condition: startA < endB and endA > startB
    if (targetStart < bEnd && targetEnd > bStart) {
      return false; // Collision detected!
    }
  }

  return true;
}
