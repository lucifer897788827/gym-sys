import { whatsappTemplates } from "./templates";

export function buildWhatsappMessage(
  template: keyof typeof whatsappTemplates,
  values: Record<string, string>,
) {
  return Object.entries(values).reduce<string>(
    (message, [key, value]) => message.replaceAll(`{{${key}}}`, value),
    whatsappTemplates[template],
  );
}
