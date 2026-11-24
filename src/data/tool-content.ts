import type { CategoryId } from "./tools";
import type { ToolContent } from "./content-types";
import { CONTENT_MEDIA } from "./content-media";
import { CONTENT_CALC } from "./content-calc";
import { CONTENT_DEV } from "./content-dev";

export type { ToolContent };

const ALL: Record<string, ToolContent> = { ...CONTENT_MEDIA, ...CONTENT_CALC, ...CONTENT_DEV };

export const getToolContent = (slug: string): ToolContent | undefined => ALL[slug];

/** Category-level sections that add genuinely useful context to every tool page. */
export const CATEGORY_NOTES: Record<CategoryId, { how: string; who: string; edge: string }> = {
  "image-pdf": {
    how: "Files you choose are read straight into your browser's memory using the File API. Decoding, resizing and re-encoding are done with the Canvas element, and PDFs are assembled with the pdf-lib library, which is only downloaded when you press the action button. There is no upload step, no queue and no temporary copy on a server, which is why results appear in a second or two even on a slow connection.",
    who: "Students filling in exam and scholarship forms, job seekers attaching documents, small shop owners preparing product pictures, and freelancers sending scanned paperwork all use these tools. They are designed for phones as much as desktops, because most real-world uploads start with a photo taken on a phone.",
    edge: "Edge cases worth knowing: very large photos (above roughly 40–50 megapixels) can exceed a phone's canvas limits; HEIC pictures only open in browsers that can decode them; and transparent areas turn white when saving as JPG. If an output looks wrong, try a smaller original or a different format.",
  },
  calculators: {
    how: "Every calculation is plain arithmetic executed by JavaScript in your browser the moment you type. The formulas used are shown on the page or in the explanation, so you can check the logic yourself instead of trusting a black box. Inputs are never sent to a server, and the page keeps working offline after it has been loaded once.",
    who: "Shop owners and freelancers use the money tools to prepare quotes, students use the grade and age tools for forms and eligibility, and everyone uses the everyday utilities for quick answers without installing an app or creating an account.",
    edge: "Edge cases worth knowing: floating-point rounding can differ from your bank or accountant by a paisa or a cent, regional rules (such as tax slabs or grading formulas) change over time, and official documents always override any calculator. Use the results as a fast, transparent estimate and confirm important figures at the source.",
  },
  developer: {
    how: "Text and code you paste are processed by your browser's own engines — the native JSON parser, the RegExp engine, TextEncoder and TextDecoder — with small, readable helper functions on top. Nothing is transmitted, so it is safe to inspect payloads and snippets that contain internal names or sample customer data.",
    who: "Developers debugging API responses, students learning web fundamentals, content writers cleaning up copy and designers checking colours all use these tools. They load quickly, need no extension and work in any modern browser.",
    edge: "Edge cases worth knowing: extremely large inputs (many megabytes) can make any in-browser tool slow, character encodings matter when you move text between systems, and security-sensitive values such as production tokens should still be treated as secrets even though nothing leaves your device.",
  },
  media: {
    how: "Media tools use real browser APIs: the HTML5 video element and Canvas for frames, Canvas for image conversion, and MediaRecorder for encoding video and audio. The heavy lifting happens on your device's CPU or GPU, so there is no upload wait, no watermark and no daily limit — but speed depends on your hardware and browser.",
    who: "Creators making short clips and thumbnails, teachers extracting slides from recorded lectures, small businesses producing product slideshows, and anyone who needs a quick voice note use these tools without installing editing software.",
    edge: "Edge cases worth knowing: browsers support different codecs, so a file that plays in one browser may not load in another; recording stops if the tab is closed; and hidden tabs are throttled, so keep the tab visible while a video renders. We tell you plainly when your browser cannot do something instead of faking an output.",
  },
};

export const PRIVACY_NOTE =
  "Privacy by design: Velyto tools are browser-first. Your files and text are processed on your own device, there are no third-party trackers by default, and nothing is uploaded unless you explicitly sign in and choose to save or publish something in Velyto Shop, Business or Study.";

/** Additional genuinely useful guidance rendered on every tool page, by category. */
export const CATEGORY_EXTRA: Record<CategoryId, { mistakes: string[]; support: string }> = {
  "image-pdf": {
    mistakes: [
      "Compressing an already compressed copy. Every pass loses detail, so always return to the original photo or scan.",
      "Ignoring the file format a form asks for. A PNG renamed to .jpg is still a PNG and many portals reject it.",
      "Stretching a photo to fit instead of cropping it. A distorted face or signature is as likely to be rejected as a wrong size.",
      "Forgetting to check the result at 100% zoom before uploading. Compression artefacts that are invisible in a thumbnail can be obvious on an admit card.",
    ],
    support: "These tools work in current versions of Chrome, Edge, Firefox and Safari on Windows, macOS, Android and iOS. On phones you can choose a photo from the gallery or take one with the camera. Very old browsers may lack Canvas encoding for WebP; in that case choose JPG. The page is keyboard accessible, supports dark mode and keeps working offline after your first visit thanks to the installable web app.",
  },
  calculators: {
    mistakes: [
      "Mixing up inclusive and exclusive amounts. A price that already contains tax or interest must be handled differently from a base price.",
      "Rounding too early. Keep full precision through the calculation and round only the final figure that appears on a document.",
      "Using the wrong formula for your institution or country. Boards, banks and tax authorities publish their own rules, which always take priority.",
      "Typing a percentage as a decimal, or the other way round. Check the unit label beside each field before reading the answer.",
    ],
    support: "Calculators respond instantly on any modern phone, tablet or computer and need no installation. Number fields open the numeric keypad on mobile, labels are announced by screen readers, and every result can be copied. Preferences such as dark mode are remembered on your device, and the page remains usable offline once it has been opened.",
  },
  developer: {
    mistakes: [
      "Pasting production secrets into any online tool without thinking. This one runs locally, but treat tokens and keys as sensitive regardless.",
      "Assuming whitespace does not matter. Trailing spaces, tabs and different line endings (CRLF versus LF) change diffs, hashes and regex matches.",
      "Forgetting character encoding. Text moved between systems should be UTF-8 so that accented letters, Hindi and emoji survive.",
      "Testing with only one happy-path example. Try empty input, very long input and unusual characters before trusting a pattern or a transformation.",
    ],
    support: "The tools use only standard web platform features, so they work in any current browser, including on mobile. Text areas use a monospace font where it helps readability, outputs can be copied with one click, and the layout adapts to small screens. Everything keeps working offline after the first visit.",
  },
  media: {
    mistakes: [
      "Switching tabs while a video renders. Browsers throttle hidden tabs, which can stall real-time recording, so keep the tab visible until the download appears.",
      "Choosing a very high resolution on a low-memory phone. If a tool slows down or fails, try a smaller source file or fewer items at once.",
      "Expecting every codec to play everywhere. If a video will not load, convert it to MP4 (H.264) or WebM first.",
      "Closing the page before downloading. Results live in memory only, so save your files before you leave.",
    ],
    support: "Media tools depend on APIs such as Canvas, HTML5 video and MediaRecorder, which are available in recent Chrome, Edge, Firefox and Safari. When your browser cannot do something, the tool explains this plainly instead of producing a fake result. Microphone access is requested only when you press record and can be revoked at any time from your browser settings.",
  },
};
