import type { AgreementProposal } from "@/lib/types/marketplace.types";
import { parseMoneyText } from "./money";
export type AgreementTerms = Pick<AgreementProposal, "scope" | "deliverables" | "deadline" | "budget" | "milestones">;
export function agreementChanges(before: AgreementTerms, after: AgreementTerms) {
  const terms = (value: AgreementTerms) => ({
    scope: value.scope.trim(), deliverables: value.deliverables.trim(), deadline: value.deadline.trim(),
    budget: parseMoneyText(value.budget) ?? value.budget.trim(),
    milestones: value.milestones.map(item => ({ id: item.id, name: item.name, deliverable: item.deliverable, deadline: item.deadline, amount: item.amountValue ?? parseMoneyText(item.amount) ?? item.amount, allowance: item.revisionAllowance?.allowed, custom: item.revisionAllowance?.customTerms, criteria: item.acceptanceCriteria })),
  });
  const a = terms(before), b = terms(after);
  return (Object.keys(a) as (keyof AgreementTerms)[]).filter(key => JSON.stringify(a[key]) !== JSON.stringify(b[key]));
}
