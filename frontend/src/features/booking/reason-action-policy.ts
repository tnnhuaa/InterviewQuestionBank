const actionsRequiringReason = new Set(["REJECT", "CANCEL", "PROPOSE_RESCHEDULE", "REPORT_NO_SHOW"]);

export function actionRequiresReason(action: string | null) {
  return Boolean(action && actionsRequiringReason.has(action));
}
