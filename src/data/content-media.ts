import type { ToolContent } from "./content-types";

export const CONTENT_MEDIA: Record<string, ToolContent> = {
  "image-compressor": {
    intro: [
      "The Velyto Image Compressor reduces the file size of JPG, PNG and WebP photos until they fit a size you choose — for example 50 KB for a government form or 200 KB for a job portal. Instead of guessing a quality slider, you type the target in kilobytes and the tool searches for the highest quality that still fits.",
      "Everything runs in your browser using the Canvas API. Your pictures are decoded, re-encoded and offered back as a download without leaving your device, which makes it safe for ID photos, certificates and signed documents. If quality alone cannot reach the target, the tool gently scales the pixel dimensions down in small steps and tells you what it did.",
    ],
    table: { caption: "Typical results at a 100 KB target", head: ["Original", "Format", "Result", "Saving"], rows: [["4.2 MB phone photo (4000×3000)", "JPG", "≈ 98 KB at 1600×1200", "≈ 98%"], ["1.1 MB screenshot", "PNG → WebP", "≈ 70 KB, same size", "≈ 94%"], ["350 KB web banner", "JPG", "≈ 95 KB at quality 0.62", "≈ 73%"]] },
    tips: ["Photos compress far better than screenshots or text-heavy graphics; for those pick WebP.", "Transparent PNGs become white-backed when saved as JPG — keep WebP or PNG if you need transparency.", "If the result looks soft, set a larger target or raise the maximum dimension rather than repeatedly recompressing the output.", "Re-compressing an already compressed JPG compounds artefacts. Always start from the original file."],
    steps: ["Add one or more images by clicking the drop zone or dragging files in.", "Enter your target size in KB and choose JPG or WebP output.", "Press Compress, compare before and after sizes, then download each file."],
    faqs: [["How do I compress an image under 50 KB?", "Enter 50 as the target and keep JPG selected. The tool lowers quality step by step and, if needed, scales the image down until the file is at or below 50 KB."], ["Will my photos be uploaded to a server?", "No. Compression happens inside your browser tab using Canvas, and files never touch our servers."], ["Why is my PNG larger after converting?", "PNG is lossless, so photos can grow. Choose JPG or WebP output for photographs."], ["Is there a file limit?", "There is no server limit; the practical limit is your device memory. Very large photos (over 50 megapixels) may fail on older phones."]],
  },
  "exam-photo-resizer": {
    intro: [
      "Exam and visa portals reject uploads for tiny reasons: 12 KB too large, 10 pixels too wide, or the wrong DPI. The Exam Photo & Signature Resizer lets you set exact pixel width and height, a minimum and maximum file size in KB, and DPI — then produces a JPEG that satisfies all of them at once.",
      "Choose a ready-made preset for SSC, UPSC, NEET, JEE, IBPS, RRB, passport, PAN or US visa, or type your own numbers. Each preset links to a dedicated guide page with a checklist. Like every Velyto tool, it works entirely offline in the browser, so your face and signature stay private.",
    ],
    table: { caption: "Common upload specifications", head: ["Form", "Size (px)", "File size", "DPI"], rows: [["SSC CGL photo", "100 × 120", "20–50 KB", "200"], ["IBPS PO signature", "140 × 60", "10–20 KB", "200"], ["PAN card photo", "213 × 213", "≤ 50 KB", "200"], ["US visa DS-160", "600 × 600", "≤ 240 KB", "300"]] },
    tips: ["Use 'Cover' to crop to the exact aspect ratio, or 'Contain' to add white margins instead of cutting anything off.", "Always verify numbers against the current official notification — boards revise limits between cycles.", "Sign with a dark pen on plain white paper and photograph it in daylight; shadows inflate file size.", "When the file is below the minimum KB, the tool raises quality and then pads the JPEG; turn padding off if a portal complains."],
    steps: ["Pick a preset (or enter custom width, height, KB range and DPI).", "Choose your photo or signature and a fit mode.", "Check the green tick for size and dimensions, then download the JPEG."],
    faqs: [["How do I resize a photo to 20–50 KB?", "Set minimum 20 and maximum 50 KB with the required pixel size. The tool picks the best quality inside that window."], ["Does it change DPI?", "Yes. The DPI value is written to the JPEG header, which is what most portals read."], ["Why did the tool pad my file?", "Some portals demand a minimum size. Padding adds harmless trailing bytes after the image data so the file reaches the minimum."], ["Is this tool official?", "No. It follows commonly published specifications, but you must confirm against your exam's notification."]],
  },
  "image-cropper": {
    intro: [
      "The Image Cropper & Rotator trims pictures to a ratio and orientation you need — square for profile photos, 16:9 for thumbnails, 4:5 for social posts, or a free-form box. Instead of dragging handles that are hard to use on phones, it uses sliders for size and position, so adjustments are precise and keyboard accessible.",
      "Rotate in 90° steps, flip horizontally or vertically, preview the crop box with a dimmed overlay, and download as PNG, JPG or WebP at the original resolution. Processing is done on a Canvas in your browser; nothing is uploaded.",
    ],
    table: { caption: "Popular crop ratios", head: ["Use", "Ratio", "Example output"], rows: [["Profile picture", "1:1", "1080 × 1080"], ["YouTube thumbnail", "16:9", "1280 × 720"], ["Instagram portrait", "4:5", "1080 × 1350"], ["Passport style", "3:4", "900 × 1200"]] },
    tips: ["Rotate first, crop second — the crop box applies to the rotated picture.", "Crops are exported at the source resolution, so a small crop from a large photo stays sharp.", "Use PNG for graphics with sharp edges and JPG for photographs.", "Phone photos carry EXIF rotation; the browser handles it, but if a photo looks sideways use the rotate buttons."],
    steps: ["Load an image and choose an aspect ratio preset.", "Use the size and position sliders, plus rotate or flip as needed.", "Select a format and download the cropped image."],
    faqs: [["Can I crop to an exact pixel size?", "Pick a ratio, crop, then run the result through the Exam Photo Resizer for exact pixel dimensions."], ["Does cropping reduce quality?", "No. The crop is exported from the original pixels; only the output format may apply compression."], ["Can I rotate by a custom angle?", "Right now rotation is in 90° steps, which keeps images lossless and edges clean."], ["Does it work with HEIC?", "Only if your browser can decode HEIC (Safari can). Otherwise convert to JPG first."]],
  },
  "image-watermark": {
    intro: [
      "Add a text watermark to protect photos, mark drafts, or brand product images before posting them online. The Image Watermark Adder places your text in a corner, in the centre, or tiles it diagonally across the whole picture, with control over size, colour, opacity and rotation.",
      "Because the stamp is burned into the pixels on a Canvas in your browser, nothing leaves your device and there is no server-side logo or branding applied by Velyto. Export to PNG or high-quality JPG and share immediately.",
    ],
    table: { caption: "Recommended watermark settings", head: ["Scenario", "Style", "Opacity"], rows: [["Product photo for a shop", "Bottom-right, 4% size", "60%"], ["Draft contract scan", "Tiled diagonal, −30°", "25%"], ["Portfolio image", "Centre, 8% size", "35%"]] },
    tips: ["Lower opacity (25–40%) protects without ruining the image; very strong marks look spammy.", "Tiled watermarks are far harder to crop out than corner marks.", "Use white text on dark images and dark text on light ones for contrast.", "Keep the original file — a watermark cannot be removed once exported."],
    steps: ["Upload a photo and type your watermark text.", "Choose position or tile mode, size, colour, opacity and angle.", "Download the watermarked image as PNG or JPG."],
    faqs: [["Can I add a logo image?", "This version supports text watermarks. For logos, convert your logo to text-like branding or request the feature on the Requests board."], ["Is the watermark removable?", "It is flattened into the pixels, so it cannot be toggled off later."], ["Does it keep the image size?", "Yes, the output matches the original pixel dimensions."], ["Does it work offline?", "After the first visit the app shell is cached, and the tool itself needs no network."]],
  },
  "image-to-pdf": {
    intro: [
      "Turn photos, scans and screenshots into one tidy PDF. Add images, drag them into the right order with the up and down buttons, pick A4, US Letter or a page that fits each image, and download — ideal for submitting documents, assignments or receipts that must be a single file.",
      "The PDF is built locally using the open-source pdf-lib library, loaded only when you press the button so the page stays fast. Phone photos are normalised through the browser first so EXIF-rotated pictures appear upright.",
    ],
    table: { caption: "Page size options", head: ["Option", "Size", "Best for"], rows: [["A4", "595 × 842 pt", "Indian and international forms"], ["US Letter", "612 × 792 pt", "US/Canada submissions"], ["Fit to image", "Matches each image", "Photo albums and screenshots"]] },
    tips: ["Compress very large photos first to keep the PDF under portal limits like 2 MB.", "Use a 10–20 pt margin for printable documents; use 0 for full-bleed photos.", "Scan documents in good light and flat; shadows add visual noise and file size.", "Name your images 01, 02, 03 before adding — selection order follows the file picker."],
    steps: ["Add your images and reorder them with the arrows.", "Choose page size, orientation and margin.", "Press Create PDF and download the result."],
    faqs: [["How many images can I add?", "As many as your device memory allows; 50 typical phone photos is usually fine."], ["How do I make the PDF smaller?", "Run images through the Image Compressor first, then combine them."], ["Are my images uploaded?", "No. The PDF is generated in your browser."], ["Can I combine images and existing PDFs?", "Create the PDF here, then use Merge PDF to join it with others."]],
  },
  "merge-pdf": {
    intro: [
      "Merge PDF combines multiple PDF files into one document in the order you choose. Use it to bundle an application form with its supporting certificates, join chapters of a report, or stitch invoices for an accountant.",
      "Pages are copied losslessly — text stays selectable and images keep their original quality. All work happens inside your browser with pdf-lib, which means confidential contracts and ID scans are never uploaded anywhere.",
    ],
    table: { caption: "Merge examples", head: ["Inputs", "Output pages", "Typical time"], rows: [["Form (2 pages) + Aadhaar (1 page)", "3", "< 1 s"], ["5 invoices × 2 pages", "10", "≈ 1 s"], ["200-page report + cover", "201", "≈ 3 s"]] },
    tips: ["Password-protected PDFs must be unlocked in your PDF viewer first.", "Rename files with numbers so the starting order is already right.", "If the merged file is too large, compress images before building the source PDFs.", "Check page orientation — a landscape page merges fine, but prints rotated."],
    steps: ["Add two or more PDF files.", "Reorder them with the up and down buttons or remove extras.", "Press Merge and download the combined PDF."],
    faqs: [["Is there a page limit?", "No fixed limit; very large PDFs depend on device memory."], ["Does merging reduce quality?", "No. Pages are copied as-is."], ["Can I merge encrypted PDFs?", "Not directly. Remove the password using your viewer, then merge."], ["Will bookmarks survive?", "Page content is kept; document-level bookmarks may not be carried over."]],
  },
  "split-pdf": {
    intro: [
      "Split PDF extracts exactly the pages you need. Type ranges such as 1-3, 5, 8-10 and get a separate PDF for each range, or split every page into its own file when a portal needs single-page uploads.",
      "It runs locally with pdf-lib: choose a file, see the page count instantly, then download each result. Since nothing is uploaded, it is a safe way to pull a single page out of a sensitive document.",
    ],
    table: { caption: "Range syntax", head: ["Input", "Result"], rows: [["1-3", "One PDF with pages 1, 2, 3"], ["1-3, 7", "Two PDFs: pages 1–3 and page 7"], ["5-", "One PDF from page 5 to the end"], ["Every page", "One PDF per page"]] },
    tips: ["Open-ended ranges like 8- mean 'page 8 to the last page'.", "Each comma-separated range becomes its own file — use a single range for one combined output.", "Page numbers follow the PDF's physical order, not any printed page numbers.", "Use Merge PDF afterwards to rebuild a custom order."],
    steps: ["Choose a PDF; the page count appears.", "Enter ranges or press 'Every page'.", "Download each generated PDF."],
    faqs: [["Can I extract non-adjacent pages into one PDF?", "Split the pages you want, then combine those with Merge PDF."], ["Does it handle scanned PDFs?", "Yes — scanned pages are just images inside the PDF."], ["Are annotations preserved?", "Page content is copied; some interactive form fields may be flattened."], ["Is there a size limit?", "Only your device's memory."]],
  },
  "video-to-image": {
    intro: [
      "Video to Image extracts still frames from an MP4 or WebM file directly in your browser. Scrub through the timeline to capture the exact frame you want, or let the tool extract a frame every 1, 2 or 5 seconds and download them as sharp PNG or JPG images at the video's native resolution.",
      "It uses the HTML5 video element and Canvas — no upload, no watermark, no signup. This is a real extractor, not a placeholder: pick a file, move the slider, and the frame you see is the frame you get. Great for thumbnails, lecture slides, product shots and storyboards.",
    ],
    table: { caption: "Frame-extraction planning", head: ["Video length", "Interval", "Frames produced"], rows: [["30 seconds", "Every 1 s", "30"], ["5 minutes", "Every 5 s", "60"], ["1 hour lecture", "Every 5 s", "720 (capped at 120 per run)"]] },
    tips: ["Use PNG for lossless slides and diagrams, JPG for photographic frames to keep files small.", "Pause on the exact moment using the slider, then use the ±0.1 s buttons for fine control.", "Browser support depends on codecs: MP4 (H.264) and WebM play almost everywhere.", "For long videos, extract in segments so memory stays low."],
    steps: ["Choose a video file; it loads locally.", "Scrub and capture a frame, or choose an interval and extract all.", "Download individual frames in PNG or JPG."],
    faqs: [["Does it upload my video?", "No. The file is played from a local blob URL and never leaves your device."], ["Can I extract 4K frames?", "Yes, if your browser can decode the video; frames are saved at native resolution."], ["Why does my MOV or MKV not load?", "Your browser may lack the codec. Convert to MP4 or WebM and try again."], ["Is the number of frames limited?", "A single run is capped at 120 frames to protect memory; run again for other sections."]],
  },
  "image-to-video": {
    intro: [
      "Images to Video Maker turns a set of pictures into a real .webm video you can download. Reorder slides, choose 16:9, 9:16 or 1:1, set how many seconds each slide shows, and add a smooth cross-fade — perfect for Reels, Shorts, WhatsApp status and product showcases.",
      "Rendering uses a Canvas stream and the browser's MediaRecorder, so the video is genuinely encoded on your device. The tab must stay open while it renders in real time. If your browser cannot record WebM, the tool says so clearly instead of faking output.",
    ],
    table: { caption: "Output presets", head: ["Ratio", "Resolution", "Best for"], rows: [["16:9", "1280 × 720", "YouTube, presentations"], ["9:16", "720 × 1280", "Reels, Shorts, Stories"], ["1:1", "1080 × 1080", "Instagram and LinkedIn feed"]] },
    tips: ["Rendering runs in real time: 10 slides × 3 s takes about 30 seconds.", "Keep this tab visible while rendering — browsers throttle hidden tabs.", "Use 'Cover' to fill the frame or 'Contain' to keep the full picture with background bars.", "Use similar-ratio images to avoid awkward cropping."],
    steps: ["Add and reorder images; choose a ratio and seconds per slide.", "Pick fade on or off and press Render video.", "Preview the result and download the .webm file."],
    faqs: [["Why WebM and not MP4?", "MediaRecorder reliably produces WebM in Chrome, Edge and Firefox. Most social apps accept WebM or you can convert it later."], ["Can I add music?", "Not in this version. Record a voiceover with the Audio Recorder and combine it in a video editor."], ["Will Safari work?", "Recent Safari versions support WebM recording; older ones do not and will show a notice."], ["Is there a watermark?", "No."]],
  },
  "image-converter": {
    intro: [
      "Batch Image Format Converter converts many images between JPG, PNG and WebP in one go. Drop a folder's worth of pictures, pick the output format and quality, and download each converted file — handy when a site rejects WebP, or when you want to shrink PNGs into WebP.",
      "Conversion uses the Canvas encoder built into your browser, so it is fast and private. Transparent areas are filled with white when converting to JPG, and you can see old and new sizes side by side before downloading.",
    ],
    table: { caption: "Format cheat-sheet", head: ["Format", "Strength", "Watch out for"], rows: [["JPG", "Small photos, universal", "No transparency"], ["PNG", "Lossless, transparency", "Large for photos"], ["WebP", "Smallest at similar quality", "Older software may not open it"]] },
    tips: ["Convert PNG screenshots to WebP at quality 0.8 for big savings.", "Converting JPG → PNG will not restore lost detail; it only makes the file bigger.", "Pick JPG for forms that reject WebP.", "Check output sizes — not every conversion shrinks a file."],
    steps: ["Add images (multiple selection supported).", "Choose JPG, PNG or WebP and set quality.", "Convert and download the results."],
    faqs: [["Is conversion lossy?", "JPG and WebP are lossy at quality below 100%; PNG is lossless."], ["Does it keep transparency?", "PNG and WebP do; JPG fills transparent pixels with white."], ["Why can't I choose WebP?", "A few browsers cannot encode WebP; the tool detects this and warns you."], ["Is there a limit?", "Only your device memory."]],
  },
  "audio-recorder": {
    intro: [
      "Quick Audio Recorder captures your voice using the microphone and saves a clean recording you can download immediately. It is meant for voice notes, interview snippets, practice reading and quick narration — with live level meter, echo cancellation, noise suppression and auto-gain toggles.",
      "Recording uses the browser's MediaRecorder API, so audio is encoded locally; Velyto never receives it. The tool asks permission for the microphone once, and you can stop sharing at any time from your browser's address bar.",
    ],
    table: { caption: "Typical recording sizes", head: ["Length", "Approx. size (Opus)", "Use"], rows: [["1 minute", "≈ 0.4 MB", "Voice note"], ["10 minutes", "≈ 4 MB", "Interview"], ["60 minutes", "≈ 24 MB", "Lecture"]] },
    tips: ["Record in a quiet room and keep the mic about a fist-width from your mouth.", "Leave echo cancellation on when using speakers; turn it off for music.", "Browsers pick the format: WebM/Opus on Chrome and Firefox, MP4/AAC on Safari.", "Listen to the preview before leaving the page — recordings are not stored on a server."],
    steps: ["Allow microphone access and choose your noise options.", "Press Record, speak, then press Stop.", "Preview and download the recording."],
    faqs: [["Does it upload my voice?", "No, recordings stay in your browser until you download them."], ["Why does the browser ask for permission?", "Microphone access always needs explicit consent for privacy."], ["What file format do I get?", "Whatever your browser supports — usually .webm (Opus) or .m4a."], ["Can I record system audio?", "No, only microphone input."]],
  },
};
