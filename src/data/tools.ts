import type { IconName } from "@/components/Icon";

export type CategoryId = "image-pdf" | "calculators" | "developer" | "media";

export type Tool = {
  slug: string;
  name: string;
  short: string;
  category: CategoryId;
  icon: IconName;
  isNew?: boolean;
  popular?: boolean;
  keywords: string;
  related: string[];
};

export const CATEGORIES: { id: CategoryId; label: string; blurb: string }[] = [
  { id: "image-pdf", label: "Image & PDF", blurb: "Resize, compress, crop, watermark and convert images and PDFs without uploading." },
  { id: "calculators", label: "Calculators & Everyday", blurb: "GST, EMI, grades, units, QR codes, passwords and daily utilities." },
  { id: "developer", label: "Developer & Text", blurb: "Format, decode, test, diff and minify code and text instantly." },
  { id: "media", label: "Media", blurb: "Real browser-side video, image and audio tools built on Canvas and MediaRecorder." },
];

export const TOOLS: Tool[] = [
  // Image & PDF
  { slug: "image-compressor", name: "Image Compressor", short: "Shrink JPG, PNG and WebP to a target size in KB.", category: "image-pdf", icon: "compress", popular: true, keywords: "compress image reduce size kb jpg png webp under 50kb", related: ["exam-photo-resizer", "image-converter", "image-to-pdf"] },
  { slug: "exam-photo-resizer", name: "Exam Photo & Signature Resizer", short: "Exact px, KB and DPI presets for exam and visa forms.", category: "image-pdf", icon: "id", popular: true, keywords: "exam photo signature resize ssc upsc neet jee passport pan visa", related: ["image-compressor", "image-cropper", "image-to-pdf"] },
  { slug: "image-cropper", name: "Image Cropper & Rotator", short: "Crop to any ratio, rotate and flip with sliders.", category: "image-pdf", icon: "crop", keywords: "crop rotate flip image aspect ratio", related: ["exam-photo-resizer", "image-watermark", "image-compressor"] },
  { slug: "image-watermark", name: "Image Watermark Adder", short: "Stamp text watermarks — single or tiled — on photos.", category: "image-pdf", icon: "stamp", isNew: true, keywords: "watermark text image protect logo", related: ["image-cropper", "image-compressor", "image-converter"] },
  { slug: "image-to-pdf", name: "Image to PDF", short: "Combine photos into one tidy PDF in any order.", category: "image-pdf", icon: "filepdf", popular: true, keywords: "image to pdf jpg png convert document scan", related: ["merge-pdf", "split-pdf", "image-compressor"] },
  { slug: "merge-pdf", name: "Merge PDF", short: "Join several PDFs into a single file.", category: "image-pdf", icon: "merge", popular: true, keywords: "merge pdf combine join files", related: ["split-pdf", "image-to-pdf", "image-compressor"] },
  { slug: "split-pdf", name: "Split PDF", short: "Extract page ranges or split every page.", category: "image-pdf", icon: "split", keywords: "split pdf extract pages range", related: ["merge-pdf", "image-to-pdf", "exam-photo-resizer"] },
  // Calculators & Everyday
  { slug: "gst-calculator", name: "GST Calculator", short: "Add or remove GST with CGST / SGST / IGST split.", category: "calculators", icon: "gst", popular: true, keywords: "gst calculator india tax cgst sgst igst invoice", related: ["percentage-calculator", "emi-calculator", "unit-converter"] },
  { slug: "emi-calculator", name: "EMI Calculator", short: "Monthly EMI, total interest and amortisation.", category: "calculators", icon: "bank", popular: true, keywords: "emi loan calculator home car personal interest", related: ["gst-calculator", "percentage-calculator", "age-calculator"] },
  { slug: "cgpa-to-percentage", name: "CGPA to Percentage", short: "Convert CGPA to percentage with CBSE and custom formulas.", category: "calculators", icon: "graduation", popular: true, keywords: "cgpa to percentage converter cbse 9.5 gpa", related: ["percentage-calculator", "age-calculator", "text-analyzer"] },
  { slug: "percentage-calculator", name: "Percentage Calculator", short: "X% of Y, percent change, and what-percent answers.", category: "calculators", icon: "percent", keywords: "percentage calculator percent change increase decrease", related: ["gst-calculator", "cgpa-to-percentage", "emi-calculator"] },
  { slug: "unit-converter", name: "Unit Converter", short: "Length, weight, temperature, area, data and more.", category: "calculators", icon: "ruler", keywords: "unit converter length weight temperature area volume speed data", related: ["percentage-calculator", "bmi-calculator", "age-calculator"] },
  { slug: "age-calculator", name: "Age Calculator", short: "Exact age in years, months and days.", category: "calculators", icon: "calendar", keywords: "age calculator date of birth years months days", related: ["bmi-calculator", "cgpa-to-percentage", "stopwatch"] },
  { slug: "bmi-calculator", name: "BMI Calculator", short: "Body-mass index with healthy weight range.", category: "calculators", icon: "heart", keywords: "bmi calculator body mass index weight height", related: ["age-calculator", "unit-converter", "percentage-calculator"] },
  { slug: "qr-code-generator", name: "QR Code Generator", short: "Custom-colour QR codes as PNG or SVG.", category: "calculators", icon: "qr", popular: true, keywords: "qr code generator url wifi text png svg", related: ["password-generator", "image-watermark", "base64-encoder-decoder"] },
  { slug: "password-generator", name: "Password Generator", short: "Strong random passwords using your browser's crypto.", category: "calculators", icon: "key", keywords: "password generator strong random secure", related: ["qr-code-generator", "jwt-decoder", "base64-encoder-decoder"] },
  { slug: "text-to-speech", name: "Text-to-Speech Reader", short: "Read any text aloud with your device voices.", category: "calculators", icon: "speaker", keywords: "text to speech reader tts voice read aloud", related: ["text-analyzer", "audio-recorder", "case-converter"] },
  { slug: "stopwatch", name: "Stopwatch", short: "Precise stopwatch with laps.", category: "calculators", icon: "timer", keywords: "stopwatch timer laps", related: ["age-calculator", "todo-list", "text-to-speech"] },
  { slug: "todo-list", name: "To-Do List", short: "A private to-do list saved on your device.", category: "calculators", icon: "check", keywords: "todo list tasks checklist", related: ["stopwatch", "text-analyzer", "age-calculator"] },
  // Developer & Text
  { slug: "json-formatter", name: "JSON Formatter", short: "Validate, beautify, minify and sort JSON.", category: "developer", icon: "braces", popular: true, keywords: "json formatter validator beautify minify pretty print", related: ["base64-encoder-decoder", "jwt-decoder", "csv-viewer"] },
  { slug: "base64-encoder-decoder", name: "Base64 Encoder / Decoder", short: "UTF-8 safe Base64 and URL-safe Base64.", category: "developer", icon: "lock", keywords: "base64 encode decode url safe utf-8", related: ["jwt-decoder", "json-formatter", "password-generator"] },
  { slug: "jwt-decoder", name: "JWT Decoder", short: "Inspect JWT header, payload and expiry locally.", category: "developer", icon: "shield", keywords: "jwt decoder token header payload exp", related: ["base64-encoder-decoder", "json-formatter", "regex-tester"] },
  { slug: "regex-tester", name: "Regex Tester", short: "Live matches, groups and flags for JavaScript regex.", category: "developer", icon: "regex", isNew: true, keywords: "regex tester regular expression match groups", related: ["text-analyzer", "case-converter", "diff-checker"] },
  { slug: "markdown-preview", name: "Markdown Preview", short: "Write Markdown and see sanitized HTML live.", category: "developer", icon: "markdown", keywords: "markdown preview editor html", related: ["css-html-minifier", "text-analyzer", "case-converter"] },
  { slug: "diff-checker", name: "Code / Text Diff Checker", short: "Line-by-line diff with added and removed counts.", category: "developer", icon: "diff", isNew: true, keywords: "diff checker compare text code lines", related: ["json-formatter", "regex-tester", "text-analyzer"] },
  { slug: "css-html-minifier", name: "CSS / HTML Minifier", short: "Strip whitespace and comments safely.", category: "developer", icon: "minify", keywords: "css minifier html minifier compress code", related: ["markdown-preview", "json-formatter", "diff-checker"] },
  { slug: "csv-viewer", name: "CSV Viewer", short: "Open, sort, filter and convert CSV to JSON.", category: "developer", icon: "table", keywords: "csv viewer table sort filter json convert", related: ["json-formatter", "text-analyzer", "diff-checker"] },
  { slug: "text-analyzer", name: "Text Analyzer", short: "Word count, reading time and top keywords.", category: "developer", icon: "type", keywords: "word count character count reading time keywords text analyzer", related: ["case-converter", "text-to-speech", "regex-tester"] },
  { slug: "case-converter", name: "Case Converter", short: "UPPER, lower, Title, camelCase, snake_case and more.", category: "developer", icon: "case", keywords: "case converter uppercase lowercase title camel snake kebab", related: ["text-analyzer", "regex-tester", "markdown-preview"] },
  { slug: "color-converter", name: "Color Converter", short: "HEX ↔ RGB ↔ HSL with WCAG contrast.", category: "developer", icon: "palette", keywords: "color converter hex rgb hsl contrast wcag", related: ["css-html-minifier", "case-converter", "image-cropper"] },
  // Media
  { slug: "video-to-image", name: "Video to Image / Frame Extractor", short: "Scrub a video or grab frames every 1–5 seconds.", category: "media", icon: "video", isNew: true, popular: true, keywords: "video to image frame extractor screenshot mp4 webm png jpg", related: ["image-to-video", "image-converter", "image-compressor"] },
  { slug: "image-to-video", name: "Images to Video Maker", short: "Turn images into a real .webm slideshow video.", category: "media", icon: "film", isNew: true, keywords: "images to video slideshow maker webm 16:9 9:16 reels", related: ["video-to-image", "image-converter", "audio-recorder"] },
  { slug: "image-converter", name: "Batch Image Format Converter", short: "Convert JPG, PNG and WebP in bulk.", category: "media", icon: "convert", isNew: true, keywords: "image converter jpg png webp batch format", related: ["image-compressor", "video-to-image", "image-to-pdf"] },
  { slug: "audio-recorder", name: "Quick Audio Recorder", short: "Record clean voice notes and download them.", category: "media", icon: "mic", isNew: true, keywords: "audio recorder voice note microphone record download", related: ["text-to-speech", "image-to-video", "video-to-image"] },
];

export const toolBySlug = (slug: string) => TOOLS.find((t) => t.slug === slug);
export const toolsByCategory = (c: CategoryId) => TOOLS.filter((t) => t.category === c);
export const POPULAR = TOOLS.filter((t) => t.popular && t.category !== "media").slice(0, 8);
export const categoryLabel = (c: CategoryId) => CATEGORIES.find((x) => x.id === c)?.label ?? c;
