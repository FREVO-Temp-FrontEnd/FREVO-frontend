/** Raw whole-dong digits, kept separate from the displayed thousands separators. */
export function moneyDigits(value: string | number): string {
  return String(value).replace(/\D/g, "");
}

export function formatMoneyInput(value: string | number): string {
  return moneyDigits(value).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

/** Expand existing shorthand amounts, while preserving ambiguous ranges. */
export function formatMoneyText(value: string): string {
  const amount = parseMoneyText(value);
  if (amount !== undefined) return formatMoneyInput(amount);
  return value.replace(/\d[\d.]*/g, amount => formatMoneyInput(amount));
}

/** Only parse an unambiguous amount; never merge the ends of a budget range. */
export function parseMoneyText(value: string): number | undefined {
  const normalized = value.trim().toLocaleLowerCase("vi").replace(/\s*(vnđ|vnd|đ|₫)$/u, "").trim();
  const match = normalized.match(/^(\d[\d.]*(?:,\d+)?)\s*(triệu|tr|nghìn|ngàn|tỷ)?$/u);
  if (!match) return undefined;
  const amount = Number(match[1].replace(/\./g, "").replace(",", "."));
  const multiplier = match[2] === "tỷ" ? 1_000_000_000 : match[2] === "triệu" || match[2] === "tr" ? 1_000_000 : match[2] ? 1_000 : 1;
  const result = amount * multiplier;
  return Number.isSafeInteger(result) && result >= 0 ? result : undefined;
}
