export type KeyTakeaways = {
  title: string;
  items: string[];
  headingType?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
};

export function renderKeyTakeaways(data: KeyTakeaways): string {
  const items = data.items
    .map((item) => `    [key_takeaway]${item}[/key_takeaway]`)
    .join("\n");
  const headingAttr = data.headingType
    ? ` heading_type="${data.headingType}"`
    : "";
  return `[key_takeaways title="${data.title}"${headingAttr}]
  [key_takeaways_list]
${items}
  [/key_takeaways_list]
[/key_takeaways]`;
}
