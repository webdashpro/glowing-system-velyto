export type ToolContent = {
  intro: string[];
  table: { caption: string; head: string[]; rows: string[][] };
  tips: string[];
  steps: [string, string, string];
  faqs: [string, string][];
};
