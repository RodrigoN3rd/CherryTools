export type CaptionInput = {
  niche: string;
  tone: string;
  goal: string;
  cta: string;
  length: "curta" | "média" | "longa";
};

const normalizeWhitespace = (value: string) => value.trim().replace(/\s+/g, " ");

export function buildCaptionVariations({ niche, tone, goal, cta, length }: CaptionInput): string[] {
  const topic = normalizeWhitespace(niche) || "sua comunidade";
  const voice = normalizeWhitespace(tone) || "direto";
  const intent = normalizeWhitespace(goal) || "compartilhar uma ideia";
  const action = normalizeWhitespace(cta) || "conte o que você achou";
  const detail = length === "curta"
    ? ""
    : length === "média"
      ? " Separei um ponto prático para você aplicar hoje."
      : " Salve esta ideia, adapte ao seu contexto e volte quando precisar de um novo começo.";

  return [
    `Para ${topic}: hoje vamos ${intent} com um tom ${voice}.${detail} ${action}.`,
    `Uma nota ${voice} para quem acompanha ${topic}: ${intent}.${detail} ${action}.`,
    `${topic} merece espaço para ${intent}. Fica aqui uma versão ${voice} para testar.${detail} ${action}.`
  ];
}

export function organizeHashtags(value: string): string[] {
  const seen = new Set<string>();
  const tokens = value.match(/#[\p{L}\p{N}_-]+|[\p{L}\p{N}_-]+/gu) ?? [];
  return tokens.reduce<string[]>((hashtags, token) => {
    const tag = `#${token.replace(/^#/, "").toLocaleLowerCase("pt-BR")}`;
    if (tag.length > 1 && !seen.has(tag)) {
      seen.add(tag);
      hashtags.push(tag);
    }
    return hashtags;
  }, []);
}

export type UtmFields = { source?: string; medium?: string; campaign?: string; term?: string; content?: string };

export function buildUtmUrl(value: string, fields: UtmFields): string {
  const url = new URL(value.trim());
  const pairs: Array<[keyof UtmFields, string]> = [
    ["source", "utm_source"],
    ["medium", "utm_medium"],
    ["campaign", "utm_campaign"],
    ["term", "utm_term"],
    ["content", "utm_content"]
  ];
  pairs.forEach(([key, parameter]) => {
    const field = normalizeWhitespace(fields[key] ?? "");
    if (field) url.searchParams.set(parameter, field);
    else url.searchParams.delete(parameter);
  });
  return url.toString();
}

export function isSafeExternalUrl(value: string): boolean {
  try {
    const url = new URL(value.trim());
    return (url.protocol === "https:" || url.protocol === "http:") && Boolean(url.hostname);
  } catch {
    return false;
  }
}

export function normalizeHandle(value: string): string {
  return value.toLocaleLowerCase("pt-BR").trim().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "").slice(0, 48);
}
