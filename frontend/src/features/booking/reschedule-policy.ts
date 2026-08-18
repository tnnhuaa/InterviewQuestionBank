export function isRescheduleProposalRecipient(
  proposedBy: string | undefined,
  currentUserId: string | undefined,
) {
  return Boolean(proposedBy && currentUserId && proposedBy !== currentUserId);
}
