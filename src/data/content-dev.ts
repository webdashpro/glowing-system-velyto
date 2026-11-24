import type { ToolContent } from "./content-types";

export const CONTENT_DEV: Record<string, ToolContent> = {
  "json-formatter": {
    intro: [
      "The JSON Formatter validates, beautifies, minifies and sorts JSON in one place. Paste a messy API response, choose 2 spaces, 4 spaces or tabs, and get readable, indented output. If the JSON is invalid, the error message points to the position of the problem so you can fix it quickly.",
      "Parsing uses the browser's native JSON engine, so it's fast and private — API keys or customer data you paste never leave your device. Sorting keys alphabetically makes diffs and code reviews cleaner.",
    ],
    table: { caption: "Common JSON errors", head: ["Mistake", "Example", "Fix"], rows: [["Trailing comma", "{\"a\":1,}", "Remove the last comma"], ["Single quotes", "{'a':1}", "Use double quotes"], ["Unquoted key", "{a:1}", "Quote the key: \"a\""]] },
    tips: ["JSON doesn't allow comments or trailing commas; strip them before pasting.", "Large numbers beyond 2^53 lose precision in JavaScript; keep IDs as strings.", "Minify before sending payloads in URLs or storing in cookies.", "Sort keys to produce a stable output for diffing."],
    steps: ["Paste JSON into the input box.", "Choose indentation and optional key sorting.", "Press Format, Minify or Copy."],
    faqs: [["How do I fix 'Unexpected token' errors?", "Check for trailing commas, single quotes, or unquoted keys near the reported position."], ["Is my JSON uploaded?", "No — parsing happens locally."], ["Can it handle large files?", "Several megabytes are fine; very large files may slow the page."], ["Does sorting change my data?", "Only key order, which is not significant in JSON objects."]],
  },
  "base64-encoder-decoder": {
    intro: [
      "Encode text to Base64 or decode Base64 back to readable text with full UTF-8 support, so emoji, Hindi, Arabic and accented characters survive the round trip. A URL-safe option swaps + and / for - and _ and removes padding, as used in JWTs and query strings.",
      "Base64 is an encoding, not encryption — anyone can decode it. This tool runs locally and makes that visible: paste the encoded text and see it instantly. Use it for debugging email headers, data URIs, API tokens and config files.",
    ],
    table: { caption: "Examples", head: ["Text", "Base64"], rows: [["Hello", "SGVsbG8="], ["Velyto", "VmVseXRv"], ["नमस्ते", "4KSo4KSu4KS44KWN4KSk4KWH"]] },
    tips: ["Base64 increases size by about 33%.", "Never treat Base64 as a way to hide secrets.", "Use URL-safe mode for tokens placed in URLs.", "Padding '=' may be omitted in URL-safe variants; this tool accepts both."],
    steps: ["Paste your text or Base64 string.", "Choose Encode or Decode, and URL-safe if needed.", "Copy the result."],
    faqs: [["Is Base64 secure?", "No, it's reversible by anyone."], ["Why does decoding fail?", "The string may contain invalid characters or have been cut off."], ["Does it support Unicode?", "Yes, via UTF-8."], ["What is URL-safe Base64?", "A variant using - and _ instead of + and /."]],
  },
  "jwt-decoder": {
    intro: [
      "The JWT Decoder splits a JSON Web Token into its header, payload and signature and shows the decoded JSON. It converts exp, iat and nbf claims into readable dates and tells you whether the token has expired, so debugging authentication problems takes seconds.",
      "Decoding happens entirely in your browser. Important: this tool does not verify signatures — decoding a token proves nothing about whether it is authentic. Never paste production tokens into tools you don't trust; this one makes no network requests.",
    ],
    table: { caption: "Standard claims", head: ["Claim", "Meaning"], rows: [["iss", "Issuer of the token"], ["sub", "Subject (usually a user ID)"], ["exp", "Expiry time (Unix seconds)"], ["iat", "Issued-at time"]] },
    tips: ["A JWT is three Base64URL parts separated by dots: header.payload.signature.", "exp is in seconds, not milliseconds.", "Validate signatures on your server with the correct key.", "Don't put secrets in the payload; it's readable by anyone."],
    steps: ["Paste the JWT.", "Review the decoded header and payload.", "Check the expiry status."],
    faqs: [["Does this verify the signature?", "No. It only decodes."], ["Is it safe to paste my token?", "Decoding is local, but treat live tokens as secrets."], ["Why does it say expired?", "The exp claim is earlier than your device's current time."], ["Can it decode encrypted JWTs (JWE)?", "No, only signed JWTs (JWS)."]],
  },
  "regex-tester": {
    intro: [
      "The Regex Tester runs JavaScript regular expressions against your sample text and highlights every match live. Toggle flags like g, i, m, s and u, and inspect capture groups and named groups for each match.",
      "Patterns are evaluated locally with the browser's RegExp engine. If a pattern is invalid, you get the engine's message immediately. Be careful with nested quantifiers — patterns like (a+)+ can cause catastrophic backtracking and freeze a tab.",
    ],
    table: { caption: "Handy patterns", head: ["Goal", "Pattern"], rows: [["Email (simple)", "[\\w.+-]+@[\\w-]+\\.[\\w.-]+"], ["Indian PIN code", "\\b[1-9][0-9]{5}\\b"], ["Hex colour", "#(?:[0-9a-fA-F]{3}){1,2}\\b"]] },
    tips: ["Use the g flag to find all matches, not just the first.", "Escape special characters like . and ( with a backslash.", "Prefer lazy quantifiers (.*?) to stop greedy over-matching.", "Test edge cases: empty strings, line breaks, unicode."],
    steps: ["Enter a pattern and select flags.", "Paste test text.", "Review highlighted matches and groups."],
    faqs: [["Which regex flavour is used?", "JavaScript (ECMAScript)."], ["Why does it hang?", "Your pattern may have catastrophic backtracking; simplify nested quantifiers."], ["What do the flags mean?", "g global, i ignore case, m multiline, s dotAll, u unicode."], ["Are named groups supported?", "Yes, using (?<name>...)."]],
  },
  "markdown-preview": {
    intro: [
      "Write Markdown on the left and see sanitized HTML on the right. The preview supports headings, bold, italic, inline code, code blocks, links, lists, blockquotes, horizontal rules and tables — enough for READMEs, notes and blog drafts.",
      "All input is HTML-escaped before rendering and only http, https and mailto links are allowed, so pasted text can't run scripts. You can copy the generated HTML or keep editing; the preview updates as you type.",
    ],
    table: { caption: "Syntax cheat-sheet", head: ["Markdown", "Result"], rows: [["# Title", "Heading 1"], ["**bold**", "bold"], ["[Velyto](https://velyto.netlify.app)", "link"], ["- item", "bullet list"]] },
    tips: ["Leave a blank line between paragraphs and lists.", "Use triple backticks for code blocks.", "Escape special characters with a backslash.", "Copy HTML to paste into a CMS that accepts HTML."],
    steps: ["Type or paste Markdown.", "Watch the live preview.", "Copy the HTML if you need it."],
    faqs: [["Is it safe to paste untrusted Markdown?", "Yes, input is escaped and links are restricted."], ["Does it support GitHub-flavoured tables?", "Basic pipe tables are supported."], ["Can I export to PDF?", "Use your browser's print function on the preview."], ["Does it save my text?", "No."]],
  },
  "diff-checker": {
    intro: [
      "The Diff Checker compares two blocks of text or code line by line and highlights what was added, removed or left unchanged. Paste the original on the left and the changed version on the right to see a clear summary of changes with counts.",
      "It implements a longest-common-subsequence algorithm locally, so private code and contract drafts stay on your device. It's ideal for comparing configuration files, copy edits, translations and API responses.",
    ],
    table: { caption: "Reading the output", head: ["Marker", "Meaning"], rows: [["+ (green)", "Line added in the new version"], ["− (red)", "Line removed from the original"], ["Plain", "Unchanged line"]] },
    tips: ["Trim trailing whitespace if the diff shows many identical-looking lines as changed.", "Normalise line endings (CRLF vs LF) before comparing.", "For JSON, run both sides through the JSON Formatter with sorted keys first.", "Inputs above ~2,000 lines per side are truncated for speed."],
    steps: ["Paste the original and changed text.", "Press Compare.", "Review additions, removals and counts."],
    faqs: [["Does it show word-level changes?", "This version compares whole lines."], ["Is there a size limit?", "Up to roughly 2,000 lines per side."], ["Is my text uploaded?", "No."], ["Can I ignore whitespace?", "Yes, tick 'Ignore whitespace'."]],
  },
  "css-html-minifier": {
    intro: [
      "The CSS / HTML Minifier removes comments and unnecessary whitespace to make your code smaller. Paste CSS or HTML, choose the mode, and get minified output along with the bytes saved and the percentage reduction.",
      "For HTML, content inside <pre>, <textarea>, <script> and <style> blocks is protected so layouts and code aren't broken. It's a safe, conservative minifier rather than an aggressive rewrite, ideal for small pages and email templates.",
    ],
    table: { caption: "Typical savings", head: ["Input", "Before", "After", "Saved"], rows: [["Bootstrap-style CSS", "12.0 KB", "9.1 KB", "24%"], ["Landing page HTML", "8.4 KB", "6.9 KB", "18%"], ["Email template", "21 KB", "17 KB", "19%"]] },
    tips: ["Always keep the unminified source in version control.", "Minification isn't compression — gzip or Brotli at the server adds far more savings.", "Test the HTML in a browser after minifying, especially inline scripts.", "Avoid minifying already-minified files."],
    steps: ["Choose CSS or HTML.", "Paste your code and press Minify.", "Copy the output."],
    faqs: [["Will it break my code?", "It's conservative, but always test the output."], ["Does it rename variables?", "No, only whitespace and comments are removed."], ["Is it safe for inline scripts?", "Script contents are preserved as-is."], ["Does it upload my code?", "No."]],
  },
  "csv-viewer": {
    intro: [
      "The CSV Viewer opens CSV files in a clean, sortable table. Drop a file or paste text; the tool auto-detects the delimiter (comma, semicolon, tab or pipe), handles quoted fields with embedded commas and line breaks, and lets you sort columns and filter rows instantly.",
      "You can also convert the data to JSON in one click. Parsing happens locally, so spreadsheets with customer or financial data never leave your device. For performance, the table displays the first 500 rows while filters search all rows.",
    ],
    table: { caption: "Delimiter detection", head: ["File", "Delimiter"], rows: [["name,age,city", "Comma"], ["name;age;city", "Semicolon (common in EU Excel exports)"], ["name\tage\tcity", "Tab (TSV)"]] },
    tips: ["Excel in some locales exports with semicolons; the tool detects them.", "Use the filter box to search across all columns.", "Click a header to sort, click again to reverse.", "Convert to JSON to use data in code or APIs."],
    steps: ["Upload or paste CSV data.", "Sort columns or filter rows.", "Download as JSON if needed."],
    faqs: [["How big a CSV can I open?", "Several megabytes; the table renders 500 rows at a time."], ["Does it handle quoted fields?", "Yes, including embedded commas and newlines."], ["Is the first row a header?", "Yes by default; toggle to treat it as data."], ["Does it upload my file?", "No."]],
  },
  "text-analyzer": {
    intro: [
      "The Text Analyzer counts words, characters, sentences and paragraphs, estimates reading and speaking time, and lists your most-used keywords. Writers, students and marketers use it to meet word limits, tighten essays and check keyword balance.",
      "Common stop-words like 'the' and 'and' are filtered from the keyword list so the real topics surface. All analysis is done locally in your browser, so drafts and confidential documents stay private.",
    ],
    table: { caption: "Reading-time assumptions", head: ["Activity", "Words per minute"], rows: [["Silent reading", "≈ 238"], ["Speaking", "≈ 150"], ["Slow, careful reading", "≈ 150"]] },
    tips: ["Aim for an average sentence length of 15–20 words for readability.", "Check characters with and without spaces if a form specifies one of them.", "Look at top keywords to catch accidental repetition.", "Paragraph count uses blank lines as separators."],
    steps: ["Paste or type your text.", "See the live stats update.", "Review top keywords and reading time."],
    faqs: [["How are words counted?", "Sequences of characters separated by whitespace."], ["Does it support Hindi?", "Yes; words are counted by whitespace and characters by Unicode code points."], ["Is my text stored?", "No."], ["Why do character counts differ elsewhere?", "Tools differ on whether they count spaces, line breaks and emoji as one or two characters."]],
  },
  "case-converter": {
    intro: [
      "The Case Converter transforms text into UPPERCASE, lowercase, Title Case, Sentence case, camelCase, PascalCase, snake_case, kebab-case, CONSTANT_CASE or aLtErNaTiNg case with one click. It's useful for fixing text typed with caps lock on, formatting headings and renaming variables.",
      "It works locally and instantly, even on long documents. Smart title case keeps small words like 'of', 'and' and 'the' lowercase unless they begin the title, matching common editorial style.",
    ],
    table: { caption: "Same phrase, different cases", head: ["Style", "Output"], rows: [["Title Case", "Free Tools For Everyone"], ["camelCase", "freeToolsForEveryone"], ["snake_case", "free_tools_for_everyone"], ["kebab-case", "free-tools-for-everyone"]] },
    tips: ["Use kebab-case for URL slugs and snake_case for database columns.", "Check acronyms (e.g. 'API', 'GST') after title-casing.", "Sentence case capitalises after full stops, question marks and exclamation marks.", "Undo with Ctrl+Z in the text box."],
    steps: ["Paste your text.", "Click the case style you want.", "Copy the converted text."],
    faqs: [["Does it support non-English text?", "Case rules apply to scripts with case, like Latin and Cyrillic."], ["What is Title Case?", "Capitalising the main words of a heading."], ["Is there a length limit?", "No fixed limit."], ["Does it store my text?", "No."]],
  },
  "color-converter": {
    intro: [
      "The Color Converter translates colours between HEX, RGB and HSL and shows a live swatch. Type any value, use the colour picker, or adjust sliders, then copy ready-to-use CSS. It also calculates the WCAG contrast ratio against white and black so you can pick accessible text colours.",
      "Contrast ratios of at least 4.5:1 are needed for normal text under WCAG AA, and 3:1 for large text. The tool states clearly which levels each combination passes, making it handy for designers and developers building accessible interfaces.",
    ],
    table: { caption: "Brand blue example", head: ["Format", "Value"], rows: [["HEX", "#2563EB"], ["RGB", "rgb(37, 99, 235)"], ["HSL", "hsl(221, 83%, 53%)"], ["Contrast vs white", "5.17:1 (AA pass)"]] },
    tips: ["Check contrast for both text and UI-component borders.", "HSL is easiest for making lighter or darker variants — change only L.", "Shorthand #abc expands to #aabbcc.", "Dark mode needs its own contrast check."],
    steps: ["Enter a HEX, RGB or HSL value, or pick a colour.", "View the other formats and contrast results.", "Copy the CSS value you need."],
    faqs: [["What is WCAG AA?", "A contrast standard: 4.5:1 for normal text, 3:1 for large text."], ["Does it support alpha?", "Not in this version."], ["How is HSL computed?", "From normalised RGB using the standard algorithm."], ["Can I use the picker on mobile?", "Yes, your device's colour picker appears."]],
  },
};
