import type { IconName } from "@/components/Icon";

export type DocType = "invoice" | "bill" | "quotation" | "receipt" | "expense";

export type BusinessDoc = {
  slug: string;
  type: DocType;
  name: string;
  short: string;
  pdfTitle: string;
  icon: IconName;
  intro: string;
  faqs: [string, string][];
};

export const BUSINESS_DOCS: BusinessDoc[] = [
  {
    slug: "invoice-generator",
    type: "invoice",
    name: "Invoice Generator",
    short: "Professional tax invoices in any currency with instant PDF.",
    pdfTitle: "INVOICE",
    icon: "file",
    intro: "Create a clean, professional invoice with your business details, client details, line items, tax and discount — then download it as a PDF in one click. Works in USD, EUR, GBP, INR, AED and CAD. Sign in to save every invoice and client to your account and reopen them later from any device.",
    faqs: [["Is the invoice generator free?", "Yes — creating and downloading invoices is 100% free, with no watermark."], ["Do I need an account?", "No. Guests can create PDFs instantly. Sign in only if you want to save invoices and clients in the cloud."], ["Can I add GST or VAT?", "Yes. Set a tax percentage per line item; the PDF shows the tax total separately."], ["Is the invoice legally compliant?", "It includes the standard fields, but rules differ by country. See the compliance checklist and confirm with an accountant."]],
  },
  {
    slug: "bill-generator",
    type: "bill",
    name: "Bill Generator",
    short: "Simple cash or retail bills for shops and services.",
    pdfTitle: "BILL",
    icon: "receipt",
    intro: "Generate a simple retail or service bill for walk-in customers. Add items with quantity and rate, apply a discount and download a neat PDF you can print or share on WhatsApp. Signed-in users can save bills to the cloud.",
    faqs: [["What is the difference between a bill and an invoice?", "A bill is usually a simple cash memo for immediate payment; an invoice is a formal request for payment, often with tax details and due dates."], ["Can I print it?", "Yes, download the PDF and print on A4."], ["Does it support multiple currencies?", "Yes: USD, EUR, GBP, INR, AED and CAD."], ["Are bills stored?", "Only if you sign in and press Save to cloud."]],
  },
  {
    slug: "quotation-generator",
    type: "quotation",
    name: "Quotation Generator",
    short: "Win clients with polished quotes and validity dates.",
    pdfTitle: "QUOTATION",
    icon: "pen",
    intro: "Prepare a professional quotation with itemised pricing, tax and a validity date. Send the PDF to clients before the work begins, then convert it to an invoice once they accept. Save quotes to the cloud when signed in.",
    faqs: [["How long should a quote be valid?", "Commonly 7–30 days. Set the validity date to match."], ["Can I convert a quote to an invoice?", "Open the saved quote in the Invoice Generator and reuse the items."], ["Is a quotation legally binding?", "It depends on local law and your wording; add clear terms."], ["Can I add terms and conditions?", "Yes, use the notes field."]],
  },
  {
    slug: "receipt-generator",
    type: "receipt",
    name: "Payment Receipt Generator",
    short: "Acknowledge payments with a clear, printable receipt.",
    pdfTitle: "PAYMENT RECEIPT",
    icon: "checkcircle",
    intro: "Issue a payment receipt that confirms who paid, how much, by which method and for what. Add the invoice reference, show any balance due and download a PDF in seconds. Signed-in users can store receipts and look them up later.",
    faqs: [["What should a receipt include?", "Receipt number, date, payer, amount, payment method, purpose and the issuer's details."], ["Can I show a balance due?", "Yes — enter the amount received and the invoice total; the balance is calculated."], ["Is it free?", "Yes."], ["Are receipts saved?", "Only when you sign in and save them."]],
  },
  {
    slug: "expense-calculator",
    type: "expense",
    name: "Expense Calculator",
    short: "Track expenses by category and export a PDF summary.",
    pdfTitle: "EXPENSE REPORT",
    icon: "chart",
    intro: "Log expenses by date, category and amount, see totals per category and a grand total, and export a clean PDF report for reimbursements or bookkeeping. Sign in to save reports in the cloud.",
    faqs: [["Can I categorise expenses?", "Yes: add any category name; totals are grouped automatically."], ["Does it handle multiple currencies?", "One currency per report, selectable from six."], ["Can I export?", "Yes, as a PDF."], ["Is my data private?", "Guest data stays in your browser; saved reports are stored in your account only."]],
  },
];

export const docBySlug = (s: string) => BUSINESS_DOCS.find((d) => d.slug === s);

export const COMPLIANCE_CHECKLIST: [string, string][] = [
  ["Unique, sequential invoice number", "Keep numbers continuous within the financial year (e.g. INV-2026-001)."],
  ["Your legal name, address and tax ID", "GSTIN in India, VAT number in the EU/UK, TRN in the UAE, or EIN/tax ID where relevant."],
  ["Client's name, address and tax ID (B2B)", "Business customers usually need their tax ID printed to claim input credit."],
  ["Date of issue and due date", "State payment terms clearly, such as Net 15 or Due on receipt."],
  ["Clear description, quantity and rate", "Add HSN/SAC codes in India or product codes where required."],
  ["Taxable value, tax rate and tax amount", "Split CGST/SGST/IGST in India; show VAT separately elsewhere."],
  ["Currency and total in figures", "Mention the currency code for international clients."],
  ["Payment details and notes", "Bank, UPI or payment-link details reduce back-and-forth."],
];
