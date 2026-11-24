export type ExamTarget = {
  label: string;
  w: number;
  h: number;
  minKB: number;
  maxKB: number;
  dpi: number;
  note?: string;
};

export type Exam = {
  slug: string;
  name: string;
  full: string;
  body: string;
  targets: ExamTarget[];
  format: string;
  background: string;
  checklist: string[];
  faqs: [string, string][];
  tip: string;
};

export const EXAMS: Exam[] = [
  {
    slug: "ssc-cgl",
    name: "SSC CGL",
    full: "SSC CGL (Combined Graduate Level)",
    body: "Staff Selection Commission",
    format: "JPEG / JPG",
    background: "Plain white or light-coloured, no shadows",
    targets: [
      { label: "Photograph", w: 100, h: 120, minKB: 20, maxKB: 50, dpi: 200, note: "3.5 cm × 4.5 cm, face covering about 75% of the frame" },
      { label: "Signature", w: 140, h: 60, minKB: 10, maxKB: 20, dpi: 200, note: "Black or blue ink on white paper, full signature visible" },
    ],
    checklist: ["Recent colour photo (taken within the last 3 months)", "Plain light background, no cap or sunglasses", "Face centred, both ears visible, looking straight at the camera", "Signature in your own handwriting — capital-letter signatures are rejected", "File saved as .jpg / .jpeg only"],
    faqs: [
      ["What is the SSC CGL photo size in pixels?", "The commonly requested size is 100 × 120 px (about 3.5 × 4.5 cm) with a file size between 20 KB and 50 KB. Always compare with the current notification."],
      ["What is the SSC CGL signature size?", "Signature uploads are typically 140 × 60 px and 10–20 KB in JPEG format."],
      ["Does SSC accept PNG?", "No. The portal expects JPEG/JPG files, so export as JPG after resizing."],
      ["Can I use a mobile selfie?", "Yes, if it is sharp, evenly lit and taken against a plain wall. Crop it to head-and-shoulders before resizing."],
    ],
    tip: "SSC rejects photos that are blurry after compression — if the result looks soft, start from a larger original instead of re-compressing a small one.",
  },
  {
    slug: "upsc-cse",
    name: "UPSC CSE",
    full: "UPSC Civil Services Examination (OTR)",
    body: "Union Public Service Commission",
    format: "JPEG / JPG",
    background: "Plain white or off-white",
    targets: [
      { label: "Photograph", w: 350, h: 350, minKB: 20, maxKB: 300, dpi: 300, note: "Recent photo, face clearly visible, name and date not required on the image" },
      { label: "Signature", w: 350, h: 150, minKB: 20, maxKB: 300, dpi: 300, note: "Signed on white paper with black ink" },
    ],
    checklist: ["Photograph taken in the last 10 days when instructed by the notification", "Face covers at least 75% of the frame, front-facing", "No dark glasses, caps or heavy filters", "Signature in running handwriting, not block capitals", "JPEG files within 20–300 KB"],
    faqs: [
      ["What are the UPSC photo dimensions?", "The online application generally asks for a JPEG between 20 KB and 300 KB. A 350 × 350 px square works as a safe preset, but confirm in the latest notice."],
      ["Is the UPSC signature required in colour?", "Black or dark blue ink on white paper scans best; the file is saved as JPEG."],
      ["Can I upload a scanned photo?", "Yes, but a direct digital photo gives sharper results. Scan at 300 DPI if you must."],
      ["Why does the portal reject my file?", "The most common causes are wrong format (PNG/HEIC), size above 300 KB, or a very small image under 20 KB."],
    ],
    tip: "UPSC's OTR is reused across years — save the final resized files in a folder so you don't need to redo them every attempt.",
  },
  {
    slug: "neet-ug",
    name: "NEET UG",
    full: "NEET UG (National Eligibility cum Entrance Test)",
    body: "National Testing Agency (NTA)",
    format: "JPG / JPEG",
    background: "White background, 80% face visibility",
    targets: [
      { label: "Passport photo", w: 413, h: 531, minKB: 10, maxKB: 200, dpi: 300, note: "35 × 45 mm at 300 DPI" },
      { label: "Signature", w: 350, h: 150, minKB: 4, maxKB: 30, dpi: 300, note: "Black ink on white paper" },
    ],
    checklist: ["Passport-size colour photo with white background", "Face (not hat or glasses) is 80% of the frame", "Signature by the candidate, not typed", "Photo file between 10 KB and 200 KB", "Signature file between 4 KB and 30 KB"],
    faqs: [
      ["What is the NEET UG photo size in KB?", "NTA typically allows 10–200 KB for the photograph and 4–30 KB for the signature in JPG/JPEG format."],
      ["Which pixel size should I use?", "A 413 × 531 px passport-size image (35 × 45 mm at 300 DPI) is a reliable preset."],
      ["Can I upload a photo with glasses?", "Avoid glasses and caps where possible; if you wear prescription glasses daily, make sure there is no glare on the lenses."],
      ["Do I also need a postcard-size photo?", "NTA often asks you to keep unsigned postcard photos for the exam centre. Those are printed, not uploaded."],
    ],
    tip: "NTA's rules change slightly between cycles. Use this preset to get close, then check the Information Bulletin's exact numbers before uploading.",
  },
  {
    slug: "jee-main",
    name: "JEE Main",
    full: "JEE Main (Joint Entrance Examination)",
    body: "National Testing Agency (NTA)",
    format: "JPG / JPEG",
    background: "White, no shadows",
    targets: [
      { label: "Passport photo", w: 413, h: 531, minKB: 10, maxKB: 200, dpi: 300, note: "White background, about 80% face" },
      { label: "Signature", w: 350, h: 150, minKB: 4, maxKB: 30, dpi: 300, note: "Black ink, white paper" },
    ],
    checklist: ["Recent photograph with name and date not required on the image", "White background with no shadows", "Signature in running handwriting", "Photo 10–200 KB, signature 4–30 KB", "JPG or JPEG format only"],
    faqs: [
      ["What size is the JEE Main photo?", "NTA specifies a JPG/JPEG passport-size photo between 10 KB and 200 KB; 413 × 531 px is a good preset."],
      ["What is the JEE Main signature size?", "4–30 KB in JPG format. A 350 × 150 px canvas gives a clean, legible result."],
      ["Do I need to upload a thumb impression?", "JEE Main does not ask for a thumb impression, but other exams do — check your own notification."],
      ["Can I reuse my NEET files?", "Because both exams are run by NTA with similar rules, the same files often work. Verify the KB limits for each cycle."],
    ],
    tip: "If your signature is thin, scan it darker (increase contrast) before resizing so it survives compression at 4–30 KB.",
  },
  {
    slug: "ibps-po",
    name: "IBPS PO",
    full: "IBPS PO (Probationary Officer)",
    body: "Institute of Banking Personnel Selection",
    format: "JPG / JPEG",
    background: "Plain light background",
    targets: [
      { label: "Photograph", w: 200, h: 230, minKB: 20, maxKB: 50, dpi: 200, note: "4.5 cm × 3.5 cm" },
      { label: "Signature", w: 140, h: 60, minKB: 10, maxKB: 20, dpi: 200, note: "Black ink on white paper" },
      { label: "Left thumb impression", w: 240, h: 240, minKB: 20, maxKB: 50, dpi: 200, note: "Black or blue ink on white paper" },
      { label: "Handwritten declaration", w: 800, h: 400, minKB: 50, maxKB: 100, dpi: 200, note: "Written in English, black ink on white paper" },
    ],
    checklist: ["Photo 200 × 230 px, 20–50 KB", "Signature 140 × 60 px, 10–20 KB", "Left thumb impression 240 × 240 px, 20–50 KB", "Handwritten declaration 800 × 400 px, 50–100 KB", "All four documents are the candidate's own, in JPG format"],
    faqs: [
      ["What are the IBPS PO photo and signature sizes?", "Photo: 200 × 230 px (20–50 KB). Signature: 140 × 60 px (10–20 KB). Both in JPG/JPEG."],
      ["How do I resize the thumb impression?", "Use the thumb preset above: 240 × 240 px, 20–50 KB, ideally at 200 DPI."],
      ["Is the declaration typed or handwritten?", "It must be handwritten by the candidate on white paper in black ink, then photographed and resized to 800 × 400 px."],
      ["Why was my file rejected?", "Most rejections are for exceeding the KB limit, wrong aspect ratio or a cropped signature."],
    ],
    tip: "Do all four IBPS documents in one sitting using the tabs above so they share the same lighting and look consistent.",
  },
  {
    slug: "rrb-ntpc",
    name: "RRB NTPC",
    full: "RRB NTPC (Non-Technical Popular Categories)",
    body: "Railway Recruitment Boards",
    format: "JPG / JPEG",
    background: "White or light blue, plain",
    targets: [
      { label: "Photograph", w: 350, h: 450, minKB: 30, maxKB: 70, dpi: 300, note: "35 × 45 mm, face about 70–80%" },
      { label: "Signature", w: 350, h: 150, minKB: 30, maxKB: 70, dpi: 300, note: "Black ink on white paper" },
    ],
    checklist: ["Recent passport-size colour photo, face forward", "Light plain background with no shadows", "Signature on white paper in black or blue ink", "Files within the notification's KB range", "JPG/JPEG format only"],
    faqs: [
      ["What size is the RRB NTPC photo?", "Recent cycles requested a 35 × 45 mm photo of roughly 30–70 KB. 350 × 450 px is a safe preset."],
      ["What about the signature?", "A 350 × 150 px signature between 30 and 70 KB works for most RRB cycles."],
      ["Do RRB photos need a name board?", "Not for the online upload; follow the notification for the exact requirement."],
      ["Which format should I use?", "JPEG. Convert PNG or HEIC from phones first."],
    ],
    tip: "RRB uploads are strict about minimum KB too — if your file is too small the tool raises the quality, then pads, until it fits the range.",
  },
  {
    slug: "indian-passport",
    name: "Indian Passport",
    full: "Indian Passport (Passport Seva) photo",
    body: "Ministry of External Affairs",
    format: "JPEG",
    background: "Plain white",
    targets: [{ label: "Passport photo", w: 413, h: 531, minKB: 10, maxKB: 300, dpi: 300, note: "35 × 45 mm, head 70–80% of the frame" }],
    checklist: ["White background with no shadows or patterns", "Full face, both eyes open, neutral expression", "No glasses glare, no cap (religious headwear allowed if the face is clear)", "Photo taken within the last 6 months", "Colour JPEG at 300 DPI"],
    faqs: [
      ["What size is the Indian passport photo?", "The physical standard is 35 × 45 mm (413 × 531 px at 300 DPI). Digital uploads are JPEG within a modest KB limit."],
      ["Is a white background mandatory?", "Yes — plain white with no shadows is the standard for passport photos."],
      ["Can I smile?", "A neutral expression with closed mouth is expected."],
      ["Do I need to print on glossy paper?", "For in-person submission, yes, but online uploads use the digital file."],
    ],
    tip: "Face the window for even daylight and hold the phone at eye level; avoid the 'wide angle' selfie lens that distorts the face.",
  },
  {
    slug: "pan-card",
    name: "PAN Card",
    full: "PAN Card application photo & signature",
    body: "Income Tax Department / NSDL / UTIITSL",
    format: "JPEG",
    background: "White or light, plain",
    targets: [
      { label: "Photograph", w: 213, h: 213, minKB: 5, maxKB: 50, dpi: 200, note: "3.5 cm × 2.5 cm at 200 DPI" },
      { label: "Signature", w: 354, h: 157, minKB: 5, maxKB: 50, dpi: 200, note: "4.5 cm × 2.0 cm at 200 DPI" },
    ],
    checklist: ["Photo 213 × 213 px at 200 DPI", "Signature 354 × 157 px at 200 DPI", "Each file under 50 KB", "Signature inside the box with no overlap", "JPEG format"],
    faqs: [
      ["What size is the PAN card photo?", "NSDL e-PAN uploads commonly use 213 × 213 px (3.5 × 2.5 cm at 200 DPI) under 50 KB."],
      ["What about the signature?", "354 × 157 px (4.5 × 2.0 cm at 200 DPI), under 50 KB."],
      ["Which colour ink for the signature?", "Black or dark blue ink on plain white paper."],
      ["Does DPI matter?", "Yes, the portal checks it. This tool writes the DPI into the JPEG header for you."],
    ],
    tip: "PAN photo and signature are often rejected for DPI mismatches — this tool embeds 200 DPI so you don't need desktop software.",
  },
  {
    slug: "cbse-board",
    name: "CBSE Board",
    full: "CBSE Board registration / LOC photo & signature",
    body: "Central Board of Secondary Education",
    format: "JPG / JPEG",
    background: "White or light, plain",
    targets: [
      { label: "Photograph", w: 413, h: 531, minKB: 10, maxKB: 50, dpi: 300, note: "Passport size, recent colour photo" },
      { label: "Signature", w: 350, h: 150, minKB: 5, maxKB: 30, dpi: 300, note: "Black ink on white paper" },
    ],
    checklist: ["Recent colour photo with plain background", "Name and date are not required on the image", "Signature by the student, matching school records", "File sizes within the portal's displayed limits", "JPG/JPEG format"],
    faqs: [
      ["What size is the CBSE photo for LOC?", "Schools typically upload a passport-size JPG under about 50 KB. Check the school login instructions for the exact figure."],
      ["Who uploads the photo?", "In most cases the school uploads on behalf of the student, but the same file works for private candidates."],
      ["Can I use a scanned school ID photo?", "Only if it is clear and recent; otherwise take a fresh photo."],
      ["What if the portal says 'file too large'?", "Lower the maximum KB in the preset or compress with the Image Compressor first."],
    ],
    tip: "CBSE limits differ by year and by LOC screen; treat these values as safe defaults and adjust the KB fields if your portal states otherwise.",
  },
  {
    slug: "us-visa",
    name: "US Visa (DS-160)",
    full: "US Visa DS-160 photo",
    body: "U.S. Department of State",
    format: "JPEG (sRGB colour)",
    background: "Plain white or off-white",
    targets: [{ label: "DS-160 photo", w: 600, h: 600, minKB: 10, maxKB: 240, dpi: 300, note: "Square, 600–1200 px per side, under 240 KB" }],
    checklist: ["Square image between 600 × 600 and 1200 × 1200 px", "File under 240 KB, JPEG, sRGB colour", "Head height 50–69% of the image height", "Plain white or off-white background, no shadows", "Neutral expression, eyeglasses not allowed"],
    faqs: [
      ["What is the US visa photo size?", "The digital photo must be square, between 600 × 600 and 1200 × 1200 px, in JPEG format and no larger than 240 KB."],
      ["Are glasses allowed?", "Eyeglasses are generally not allowed in US visa photos taken after 2016."],
      ["Does the head need to be centred?", "Yes. Head height should be 50–69% of the image height with eyes between 56–69% from the bottom."],
      ["Can I use a phone photo?", "Yes, as long as it meets the requirements and has no filters or edits."],
    ],
    tip: "Use 'Cover' fit with a square crop, then check head size visually against the 50–69% rule before submitting.",
  },
];

export const examBySlug = (s: string) => EXAMS.find((e) => e.slug === s);
