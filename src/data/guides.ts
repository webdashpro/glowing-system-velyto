export type Guide = {
  slug: string;
  title: string;
  description: string;
  readMins: number;
  updated: string;
  updatedLabel: string;
  sections: { h: string; p: string[] }[];
  tools: string[];
};

export const GUIDES: Guide[] = [
  {
    slug: "ssc-cgl-upsc-photo-signature-size-guide",
    title: "SSC CGL & UPSC Photo and Signature Size Guide (2026)",
    description: "Exact pixel, KB and DPI specs for SSC CGL and UPSC photo and signature uploads, plus a step-by-step method to resize them without rejection.",
    readMins: 5,
    updated: "2026-05-12",
    updatedLabel: "12 May 2026",
    tools: ["exam-photo-resizer", "image-compressor", "image-cropper"],
    sections: [
      { h: "Why photo and signature uploads get rejected", p: ["Every year thousands of aspirants lose time — and sometimes attempts — because an online application portal says 'invalid file'. The causes are almost always small: a file that is 3 KB over the limit, a signature that is 150 pixels wide instead of 140, a PNG renamed to .jpg, or a photo with a shadow behind the head. Knowing the exact numbers and having a repeatable method removes the stress.", "This guide collects the commonly published specifications for SSC CGL and UPSC Civil Services, explains what each number means, and shows how to hit them using the free [Exam Photo & Signature Resizer](/tools/exam-photo-resizer). Specifications are revised between cycles, so always confirm against the latest official notification before you submit."] },
      { h: "SSC CGL specifications at a glance", p: ["For SSC CGL the photograph is typically 100 × 120 pixels (about 3.5 cm wide and 4.5 cm tall) with a file size between 20 KB and 50 KB, saved as JPEG. The signature is typically 140 × 60 pixels and 10 to 20 KB. The photo should be a recent colour image with a plain light background, the face centred and looking at the camera, with both ears visible and no cap or dark glasses.", "The signature must be in your own handwriting using black or blue ink on white paper. Block-capital signatures and typed names are a common reason for rejection. You can open the dedicated [SSC CGL preset](/tools/exam-photo-resizer/ssc-cgl) to load these numbers automatically."] },
      { h: "UPSC Civil Services specifications at a glance", p: ["UPSC's online application accepts JPEG files, generally between 20 KB and 300 KB for both the photograph and signature. A square 350 × 350 pixel photograph is a safe starting point, with the face covering at least three quarters of the frame. The signature is written on plain white paper with black ink and photographed or scanned in good light.", "Because UPSC's One Time Registration is reused across attempts, it is worth keeping the final approved files in a clearly named folder. Use the [UPSC CSE preset](/tools/exam-photo-resizer/upsc-cse) to generate them in one go."] },
      { h: "A repeatable five-step method", p: ["1. Take the photo in daylight facing a window, against a plain wall, with the phone at eye level. 2. Crop to head and shoulders using the [Image Cropper](/tools/image-cropper). 3. Open the resizer, choose the exam preset and select 'Cover' so the picture is cropped to the exact aspect ratio without stretching. 4. Check that the result shows a green tick for pixel size and file size. 5. Download the JPEG and rename it clearly, for example photo-ssc-cgl.jpg.", "If the size ends up below the minimum, raise the quality or let the tool pad the file. If it is above the maximum, start again from a larger original rather than compressing an already small image repeatedly — repeated compression creates blocky artefacts that can make the photo look poor on the admit card."] },
      { h: "Common mistakes and how to avoid them", p: ["Do not use selfie filters or beauty modes; portals and later verification officers compare your photo with documents. Avoid stretching an image to fit — a distorted face is as bad as a wrong size. Do not upload a photo of a printed photo, because reflections and moiré patterns are obvious.", "Finally, keep your DPI consistent. Some portals read the DPI value stored in the JPEG header. The resizer writes 200 or 300 DPI as required, so you do not need desktop software. When in doubt, compare your final file's size, dimensions and format against the notification one more time before pressing submit."] },
    ],
  },
  {
    slug: "compress-images-under-50kb",
    title: "How to Compress Images Under 50KB Without Losing Quality",
    description: "A practical guide to compressing photos, signatures and scans under 50 KB in your browser while keeping them sharp enough for forms.",
    readMins: 5,
    updated: "2026-05-12",
    updatedLabel: "12 May 2026",
    tools: ["image-compressor", "image-converter", "exam-photo-resizer"],
    sections: [
      { h: "What actually controls an image's file size", p: ["File size depends on three things: the number of pixels, the format, and the compression quality. A 4000 × 3000 phone photo has twelve million pixels and typically weighs 3–6 MB. Reducing it to under 50 KB means being smart about all three, not just dragging a quality slider to zero.", "Pixel dimensions have the biggest effect. Halving both width and height cuts the pixel count to a quarter, which often reduces file size by roughly the same amount. Quality settings matter next, and the format determines how efficiently those pixels are stored."] },
      { h: "Pick the right format first", p: ["JPEG is the best all-round choice for photographs and is accepted by nearly every upload form. WebP is usually 25–35% smaller at similar quality but some older portals reject it. PNG is lossless, which makes photographs huge, so avoid PNG for pictures unless you need transparency.", "If a form says 'JPG only', convert first using the [Batch Image Format Converter](/tools/image-converter), then compress. Doing it in the other order can undo your savings."] },
      { h: "A step-by-step method that works", p: ["Open the [Image Compressor](/tools/image-compressor), add your picture, and type 50 as the target size in KB. The tool tests qualities from high to low using a binary search, finds the highest quality that fits, and only scales down the dimensions if quality alone cannot reach 50 KB. You then compare before and after sizes and download.", "For signatures and scanned text, choose a higher target dimension but expect to use lower quality — black ink on white compresses very well. For portraits, avoid going below quality 0.5, where faces start to show blocky artefacts around the eyes and hair."] },
      { h: "Worked examples", p: ["A 3.8 MB phone portrait at 4032 × 3024 compresses to about 48 KB at 800 × 600 and quality around 0.7 — sharp enough for most application forms. A 900 KB scanned signature at 1500 × 600 compresses to about 14 KB at quality 0.6. A 1.2 MB PNG screenshot becomes roughly 45 KB as WebP at quality 0.75.", "If you also need exact pixel dimensions and a minimum size, use the [Exam Photo & Signature Resizer](/tools/exam-photo-resizer), which handles both limits together."] },
      { h: "Tips to keep quality high", p: ["Always compress from the original, never from an already compressed copy. Crop away empty background before compressing, because every pixel you remove is a pixel you do not pay for. Shoot in good light — noisy low-light photos compress poorly because noise looks like detail.", "Finally, keep your files private. Velyto compresses in your browser, so IDs, certificates and signatures are never uploaded to a server."] },
    ],
  },
  {
    slug: "create-whatsapp-shop-catalogue-qr-code",
    title: "How to Create a Free WhatsApp Shop Catalogue & QR Code",
    description: "Build a mobile product catalogue, share it with a link or QR poster, and receive pre-filled WhatsApp orders — free, with no app or website needed.",
    readMins: 5,
    updated: "2026-05-12",
    updatedLabel: "12 May 2026",
    tools: ["qr-code-generator", "image-compressor", "image-watermark"],
    sections: [
      { h: "Why a catalogue link beats sending photos", p: ["Many small businesses sell through WhatsApp by forwarding product photos and typing prices again and again. It works, but customers cannot browse, you cannot track interest, and updating a price means resending everything. A catalogue page puts every product, price and description at one link that you update once.", "With Velyto Shop you can build that page for free, keep the ordering conversation on WhatsApp where customers already are, and see how many people viewed the catalogue and tapped the order button."] },
      { h: "Step 1: Add your shop details and products", p: ["Open [Velyto Shop](/shop) and press 'Load Demo Shop' if you want to see an example first. Enter your shop name, city, category, currency and WhatsApp number in international format (for example 919876543210 without plus signs). Then add products with a name, price and short description. Clear names such as 'Handmade soy candle — lavender, 200 g' convert better than clever ones.", "Choose your currency — US dollar, euro, pound, rupee, dirham or Canadian dollar — so international customers see familiar prices."] },
      { h: "Step 2: Publish and share the link", p: ["Create a free account and press Publish. Your catalogue goes live at a short address of the form /s/your-shop-name. Anyone can open it on any phone without an app. Each product has an 'Order on WhatsApp' button that opens a chat with your number and a ready-written message containing the product and price, so customers do not have to type anything.", "Add the link to your Instagram bio, Google Business profile, email signature and WhatsApp Business profile. If you choose to list your shop in the public [Shop Directory](/shops), customers can also discover you by city and category."] },
      { h: "Step 3: Make a QR poster for the real world", p: ["QR codes bridge the physical shop and the digital catalogue. Print the Shop QR Poster from the builder and stick it at your counter, on packaging or on a delivery bag. Customers scan, browse and order without asking for your number. You can also generate a custom colour code with the [QR Code Generator](/tools/qr-code-generator).", "Use error-correction level Q or H for printed material and test the poster with two different phones before printing a large batch."] },
      { h: "Photos, tracking and improving over time", p: ["Keep product pictures small and bright. Use the [Image Compressor](/tools/image-compressor) to keep them light so the catalogue loads fast on mobile data, and add a subtle brand mark using the [Watermark tool](/tools/image-watermark) if copycats are a worry.", "After a week, check your dashboard: views show how many people saw the catalogue, and WhatsApp clicks show how many wanted to buy. If views are high but clicks are low, improve your product names, prices and descriptions. If both are low, share the link in more places."] },
    ],
  },
  {
    slug: "gst-invoice-calculations-freelancers",
    title: "Complete Guide to GST & Invoice Calculations for Freelancers",
    description: "How GST works for freelancers and small businesses, with formulas, worked examples and an invoice compliance checklist.",
    readMins: 6,
    updated: "2026-05-12",
    updatedLabel: "12 May 2026",
    tools: ["gst-calculator", "percentage-calculator", "emi-calculator"],
    sections: [
      { h: "GST basics every freelancer should know", p: ["Goods and Services Tax (GST) in India is a destination-based tax charged on supplies of goods and services. If your aggregate turnover crosses the applicable threshold — which differs for services and goods and can change by notification — you must register, charge GST on invoices and file returns. Below the threshold, registration is optional, though some clients prefer GST-registered vendors.", "This guide is educational and not tax advice. Rates, thresholds and rules are set by the GST Council and change, so confirm details on the official portal or with a chartered accountant."] },
      { h: "The two formulas you need", p: ["To add GST: GST amount = base price × rate ÷ 100, and invoice total = base price + GST. For ₹10,000 at 18%, GST is ₹1,800 and the total is ₹11,800. To remove GST from a tax-inclusive price: base price = total ÷ (1 + rate ÷ 100). For ₹11,800 inclusive of 18%, the base is ₹10,000.", "A common mistake is subtracting 18% of the total, which gives ₹9,676 — wrong. Use the [GST Calculator](/tools/gst-calculator) to avoid it and to see the split between components."] },
      { h: "CGST, SGST and IGST: which applies?", p: ["If you and your client are in the same state, GST is split equally into CGST (central) and SGST (state): for 18%, that is 9% + 9%. If the client is in a different state, you charge a single IGST of 18%. Exports of services may be zero-rated under conditions such as receiving payment in convertible foreign exchange and having a Letter of Undertaking.", "Your invoice must show which components apply, so make sure your place-of-supply logic is right before issuing the document."] },
      { h: "What a compliant invoice contains", p: ["A tax invoice normally shows your name, address and GSTIN; the client's name and address (and GSTIN for B2B); a unique, sequential invoice number; the date; description of services with SAC code; quantity and rate; taxable value; GST rate and amount split into CGST, SGST or IGST; and the total. Keep invoice numbers continuous within the financial year.", "Create professional PDFs in seconds with the [Velyto Business invoice generator](/business/invoice-generator), which supports multiple currencies and saves documents to your account when you are signed in. Review the compliance checklist on the Business page before sending."] },
      { h: "Practical habits that save trouble", p: ["Issue the invoice at the right time — generally when service is completed or payment is received, whichever the rules require for your case. Record every invoice in one place, reconcile against bank statements monthly, and set aside the GST you collect, because it is not your income. Use the [Percentage Calculator](/tools/percentage-calculator) for quick discounts and margins.", "If you take a business loan for equipment, compare options with the [EMI Calculator](/tools/emi-calculator) so repayments fit your cash flow. When rules or amounts are unclear, ask a qualified professional before filing."] },
    ],
  },
  {
    slug: "flashcards-active-recall-pomodoro-exam-guide",
    title: "How to Use Flashcards, Active Recall & Pomodoro to Score Higher in Exams",
    description: "Evidence-backed study techniques — active recall, spaced flashcards and Pomodoro — and how to put them into practice with free tools.",
    readMins: 6,
    updated: "2026-05-12",
    updatedLabel: "12 May 2026",
    tools: ["todo-list", "stopwatch", "text-analyzer"],
    sections: [
      { h: "Why re-reading notes does not work", p: ["Highlighting and re-reading feel productive because material becomes familiar, but familiarity is not the same as knowing. Cognitive-science research on the 'testing effect' consistently finds that retrieving information from memory strengthens it more than reviewing it again. The effort of remembering is the learning.", "That is the foundation of active recall: close the book and force yourself to produce the answer. Flashcards, practice questions and teaching a concept out loud are all forms of it."] },
      { h: "Turning notes into flashcards", p: ["Good flashcards are small. One card should test one fact or idea, phrased as a question with a short answer. Instead of 'Photosynthesis', ask 'What are the inputs and outputs of photosynthesis?'. In [Velyto Study](/study), write notes in the form 'Term: definition' and generate flashcards from them automatically, then flip through them and mark the ones you got right.", "Press 'Load Sample Chapter' to see the format. Aim for 10–20 new cards per study session; creating them yourself is itself a learning activity."] },
      { h: "Spaced repetition in practice", p: ["Memory fades along a curve, and each successful recall flattens it. Reviewing a card after one day, three days, a week and a month is far more efficient than cramming. A simple approach: keep cards you missed in a 'again tomorrow' pile and let cards you knew wait longer before reappearing.", "You do not need complicated software. A consistent daily 15-minute review beats a four-hour session the night before the exam."] },
      { h: "Pomodoro: structure your focus", p: ["The Pomodoro technique splits work into 25-minute focused blocks separated by 5-minute breaks, with a longer break after four blocks. The short deadline reduces procrastination and the breaks protect concentration. Put your phone in another room, pick one task for the block, and write down distractions to deal with later.", "Use the Focus Timer in [Velyto Study](/study), which counts completed sessions and builds a streak. A streak makes studying a visible habit; even one Pomodoro on a bad day keeps the chain alive."] },
      { h: "A weekly plan you can start today", p: ["Block your week with the [Study Planner](/study/planner): assign subjects to time slots, alternate hard and easy topics, and leave one slot for review. Each session, spend the first five minutes recalling what you studied last time without notes, then learn new material, then finish with ten self-test questions.", "Take a timed MCQ quiz weekly using the quiz builder to rehearse exam pressure. Track results over time, share your score if it motivates you, and focus the next week on the weak areas. Small, consistent, tested practice is what moves marks."] },
    ],
  },
];

export const guideBySlug = (s: string) => GUIDES.find((g) => g.slug === s);
