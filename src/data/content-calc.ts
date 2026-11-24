import type { ToolContent } from "./content-types";

export const CONTENT_CALC: Record<string, ToolContent> = {
  "gst-calculator": {
    intro: [
      "The GST Calculator works out Goods and Services Tax for any amount. Add GST to a base price to get the invoice total, or remove GST from a tax-inclusive price to find the original value. It shows the CGST + SGST split for intra-state sales and the single IGST for inter-state sales.",
      "India's common slabs — 0%, 3%, 5%, 12%, 18% and 28% — are one tap away, and you can type any custom rate. Calculations are instant and never leave your browser, so you can safely test prices for a client or a shop.",
    ],
    table: { caption: "Worked examples (GST-exclusive amounts)", head: ["Base price", "Rate", "GST", "Total"], rows: [["₹10,000", "18%", "₹1,800 (CGST 900 + SGST 900)", "₹11,800"], ["₹2,500", "5%", "₹125", "₹2,625"], ["₹50,000", "28%", "₹14,000", "₹64,000"]] },
    tips: ["To remove GST from an inclusive price, divide by (1 + rate) — not subtract the rate from the total.", "Intra-state sale = CGST + SGST (each half the rate). Inter-state = IGST (full rate).", "Round only at the final invoice total to avoid paise drift across line items.", "Confirm HSN/SAC rates on the official GST portal; rates change by notification."],
    steps: ["Enter the amount and pick a GST slab (or type your own).", "Choose Add GST or Remove GST, and intra- or inter-state.", "Read the breakdown and copy the figures into your invoice."],
    faqs: [["How do I calculate 18% GST on ₹1,000?", "GST = 1,000 × 0.18 = ₹180, so the total is ₹1,180."], ["How do I find the base price from ₹1,180 inclusive of 18% GST?", "Divide by 1.18: 1,180 ÷ 1.18 = ₹1,000, so GST was ₹180."], ["What is the difference between CGST, SGST and IGST?", "CGST and SGST are the central and state shares charged on sales within a state. IGST is charged on sales between states."], ["Is this tool official advice?", "No. It is an arithmetic helper; consult a chartered accountant for compliance."]],
  },
  "emi-calculator": {
    intro: [
      "The EMI Calculator shows the equated monthly instalment for a home, car, education or personal loan. Enter the principal, annual interest rate and tenure in years or months, and see your monthly EMI, total interest and total repayment instantly, with a visual split between principal and interest.",
      "The tool uses the standard reducing-balance formula EMI = P × r × (1+r)^n ÷ ((1+r)^n − 1), where r is the monthly rate. An amortisation table reveals how much of each year's payments goes to interest versus principal, helping you decide if a shorter tenure is worth it.",
    ],
    table: { caption: "EMI examples at 9% annual interest", head: ["Loan", "Tenure", "EMI", "Total interest"], rows: [["₹5,00,000", "5 years", "₹10,379", "₹1,22,745"], ["₹20,00,000", "15 years", "₹20,284", "₹16,51,100"], ["₹50,00,000", "20 years", "₹44,986", "₹57,96,700"]] },
    tips: ["A 1% lower rate often saves more than a longer tenure; compare scenarios side by side.", "Prepaying early in the tenure cuts far more interest than prepaying near the end.", "Add processing fees and insurance separately — they are not part of the EMI formula.", "Floating-rate loans change; treat results as an estimate for today's rate."],
    steps: ["Enter loan amount, interest rate and tenure.", "Read EMI, total interest and total payable.", "Open the yearly breakdown to compare principal and interest."],
    faqs: [["How is EMI calculated?", "EMI = P × r × (1+r)^n ÷ ((1+r)^n − 1), where P is principal, r is the monthly interest rate and n the number of months."], ["Does EMI change if I pay extra?", "The standard EMI stays fixed, but prepayments reduce the principal so tenure or interest shrinks."], ["Is interest flat or reducing?", "This calculator uses the reducing balance method used by most banks."], ["Can I use it for credit cards?", "Only approximately. Card EMIs often add fees and different compounding."]],
  },
  "cgpa-to-percentage": {
    intro: [
      "The CGPA to Percentage converter turns your grade point average into the percentage required on applications and forms. CBSE's official multiplier is 9.5, so a 8.4 CGPA becomes 79.8%. Other universities use different rules, so the tool includes a generic ×10 option, VTU's (CGPA − 0.75) × 10 formula, and a custom multiplier.",
      "You can also reverse the conversion — enter a percentage and see the approximate CGPA — and convert a 4.0-scale GPA to percent. Always confirm which formula your university or employer accepts; the right answer is the one they publish.",
    ],
    table: { caption: "CBSE formula (CGPA × 9.5)", head: ["CGPA", "Percentage"], rows: [["10.0", "95.0%"], ["8.4", "79.8%"], ["7.0", "66.5%"], ["6.2", "58.9%"]] },
    tips: ["CBSE's multiplier (9.5) applies to CBSE grades; it is not universal for all boards or universities.", "Many institutions let you submit the official certificate's conversion — prefer that over any calculator.", "Round the result to two decimal places only when the form requires it.", "For 4.0-scale GPAs, percentages vary by country; use the school's guidelines."],
    steps: ["Enter your CGPA and scale.", "Choose the conversion formula your institution uses.", "Copy the percentage or reverse-convert a percentage."],
    faqs: [["How do I convert CGPA to percentage for CBSE?", "Multiply your CGPA by 9.5. For example, 8.6 × 9.5 = 81.7%."], ["What is the VTU formula?", "Percentage = (CGPA − 0.75) × 10."], ["Can I convert percentage to CGPA?", "Divide the percentage by 9.5 for CBSE-style conversion."], ["Is this accepted everywhere?", "Not always. Use the formula your university or employer publishes."]],
  },
  "percentage-calculator": {
    intro: [
      "The Percentage Calculator answers the three questions people actually ask: what is X% of Y, X is what percent of Y, and what is the percentage change from X to Y. It also adds or subtracts a percentage from a number, which covers discounts, tips, markups and tax.",
      "Results update as you type and include the working, so you can understand and verify each answer. It is useful for shopping discounts, exam marks, salary hikes, business margins and anything involving proportions.",
    ],
    table: { caption: "Quick examples", head: ["Question", "Calculation", "Answer"], rows: [["20% of 850", "850 × 0.20", "170"], ["68 is what % of 80", "68 ÷ 80 × 100", "85%"], ["Change from 400 to 520", "(520 − 400) ÷ 400 × 100", "+30%"], ["Price 1,200 after 15% off", "1,200 × 0.85", "1,020"]] },
    tips: ["Percentage change is always relative to the starting value, so +50% then −50% does not return to the start.", "A 20% discount followed by a 10% discount is 28% total, not 30%.", "To reverse a markup, divide by (1 + rate) instead of subtracting the percentage.", "Percentage points and percent are different: 10% to 12% is +2 points but +20%."],
    steps: ["Choose the type of question.", "Enter your two numbers.", "Read the answer and the formula shown below it."],
    faqs: [["How do I calculate percentage increase?", "(New − Old) ÷ Old × 100."], ["How do I take 15% off a price?", "Multiply by 0.85."], ["Can the result exceed 100%?", "Yes. If the new value is more than double the old one, the increase is over 100%."], ["How many decimals are shown?", "Up to four, trimmed for readability."]],
  },
  "unit-converter": {
    intro: [
      "The Unit Converter converts between common units of length, mass, temperature, volume, area, speed, time and digital storage. Pick a category, choose the from and to units, type a value and see the answer immediately with sensible rounding.",
      "Everything is calculated locally using exact conversion factors, so it works offline once the page is cached. It's helpful for recipes, travel, construction measurements, school homework and data-size comparisons between MB, GB and TB.",
    ],
    table: { caption: "Handy conversions", head: ["From", "To", "Value"], rows: [["1 mile", "kilometres", "1.609344"], ["1 kg", "pounds", "2.204623"], ["37 °C", "°F", "98.6"], ["1 GB", "MB (binary)", "1,024"]] },
    tips: ["Temperature conversions are not simple multipliers, so use the dedicated selector rather than manual maths.", "Storage has two systems: decimal (1 GB = 1000 MB) and binary (1 GiB = 1024 MiB). This tool uses 1024 for MB/GB/TB as most operating systems do.", "Area conversions square the linear factor — 1 m² is 10.764 ft², not 3.281.", "Check significant figures when converting measurements for engineering."],
    steps: ["Select a category such as length or mass.", "Choose from and to units and enter a value.", "Copy the converted result."],
    faqs: [["How many centimetres are in an inch?", "Exactly 2.54 cm."], ["How do I convert Celsius to Fahrenheit?", "Multiply by 9/5 and add 32."], ["Is 1 GB 1000 MB or 1024 MB?", "Marketing uses 1000; most operating systems display 1024. This tool uses 1024."], ["Does it work offline?", "Yes, after the page has loaded once."]],
  },
  "age-calculator": {
    intro: [
      "The Age Calculator tells you your exact age in years, months and days between a date of birth and any date you choose — today by default. It also shows total days lived, total weeks, and how many days remain until your next birthday.",
      "It handles month-length differences and leap years correctly, which is why simple year subtraction often gets exam and form eligibility wrong. Use it for entrance-exam age limits, insurance, school admissions and just for fun.",
    ],
    table: { caption: "Example (as on 1 Jan 2026)", head: ["Date of birth", "Age"], rows: [["15 Aug 2000", "25 years, 4 months, 17 days"], ["29 Feb 2004", "21 years, 10 months, 3 days"], ["31 Dec 2010", "15 years, 0 months, 1 day"]] },
    tips: ["Exam age limits usually count age 'as on' a fixed cut-off date — set that date, not today's.", "Born on 29 February? Non-leap years count the birthday as 1 March in most legal systems.", "Dates are interpreted in your local time zone.", "Use the 'as on' field to calculate age at a future event, like an exam date."],
    steps: ["Enter a date of birth.", "Optionally change the 'age as on' date.", "Read years, months, days and the next-birthday countdown."],
    faqs: [["How is age in months and days calculated?", "The tool subtracts calendar fields and borrows days from the previous month when needed."], ["Does it support leap years?", "Yes."], ["Can I check age on a future date?", "Yes, set the 'as on' date to any day."], ["Is my date of birth stored?", "No. It stays in your browser tab."]],
  },
  "bmi-calculator": {
    intro: [
      "The BMI Calculator estimates your body-mass index from height and weight in metric or imperial units. It classifies the result using the WHO adult categories and shows the weight range that corresponds to a BMI of 18.5–24.9 for your height.",
      "BMI is a screening number, not a diagnosis. It doesn't distinguish muscle from fat and varies by age, sex and ethnicity, so treat it as a conversation starter with a healthcare professional rather than a verdict.",
    ],
    table: { caption: "WHO adult BMI categories", head: ["BMI", "Category"], rows: [["< 18.5", "Underweight"], ["18.5 – 24.9", "Normal range"], ["25 – 29.9", "Overweight"], ["≥ 30", "Obesity"]] },
    tips: ["Athletes with high muscle mass may show 'overweight' despite low body fat.", "For South Asian adults, some guidelines use lower thresholds (e.g. 23 for overweight).", "Measure height without shoes and weight at the same time of day for consistent tracking.", "Use waist circumference alongside BMI for a fuller picture."],
    steps: ["Choose metric or imperial.", "Enter height and weight.", "Read your BMI, category and healthy weight range."],
    faqs: [["How is BMI calculated?", "BMI = weight (kg) ÷ height (m)²."], ["What is a healthy BMI?", "The WHO normal range for adults is 18.5–24.9."], ["Is BMI accurate for children?", "No. Children use age- and sex-specific percentile charts."], ["Is this medical advice?", "No — it is informational only."]],
  },
  "qr-code-generator": {
    intro: [
      "The QR Code Generator creates scannable codes for URLs, text, Wi-Fi details, phone numbers or UPI links. Customise foreground and background colours, size and error-correction level, then download a crisp PNG or a vector SVG that prints perfectly on posters and menus.",
      "Codes are generated locally with the open-source qrcode library, loaded only when needed. They never expire and are not routed through a tracking redirect, so what you scan is exactly what you typed.",
    ],
    table: { caption: "Error-correction levels", head: ["Level", "Recovers up to", "Use"], rows: [["L", "7%", "Clean digital screens"], ["M", "15%", "Default, general use"], ["Q", "25%", "Printed material"], ["H", "30%", "Logos or rough surfaces"]] },
    tips: ["Keep strong contrast: dark foreground on a light background scans best.", "Test with two different phones before printing 500 flyers.", "Use SVG for print sizes; PNG for web and chat.", "Shorter content gives simpler, easier-to-scan codes."],
    steps: ["Type or paste your link or text.", "Choose size, colours and error-correction.", "Download PNG or SVG."],
    faqs: [["Do QR codes expire?", "Static codes like these never expire."], ["Can I add a logo?", "Use level H and place a logo on top in an image editor, keeping it under 20% of the code."], ["Can I make a Wi-Fi QR?", "Yes — enter WIFI:T:WPA;S:NetworkName;P:Password;; as the text."], ["Is there tracking?", "No. The code contains your data directly."]],
  },
  "password-generator": {
    intro: [
      "The Password Generator creates strong, random passwords using your browser's cryptographically secure random number generator (crypto.getRandomValues). Choose a length from 8 to 64, include or exclude lowercase, uppercase, numbers and symbols, and avoid look-alike characters if you need to read the password aloud.",
      "Nothing is sent over the network and nothing is stored. A built-in strength meter estimates entropy in bits so you can see why longer passwords beat clever substitutions. Pair generated passwords with a reputable password manager.",
    ],
    table: { caption: "Approximate entropy", head: ["Length", "Character set", "Entropy"], rows: [["8", "Letters + digits (62)", "≈ 48 bits"], ["12", "Letters + digits + symbols (94)", "≈ 79 bits"], ["16", "Letters + digits + symbols (94)", "≈ 105 bits"], ["20", "Letters + digits (62)", "≈ 119 bits"]] },
    tips: ["Use a unique password for every account.", "Length matters more than complexity — 16+ characters is a strong default.", "Turn on 'avoid similar characters' for passwords you will type from paper.", "Enable two-factor authentication wherever possible."],
    steps: ["Pick a length and character types.", "Press Generate for a new password.", "Copy it into your password manager."],
    faqs: [["Is it safe to generate passwords online?", "Here, yes: generation happens locally and nothing is transmitted."], ["How long should a password be?", "At least 14–16 characters for important accounts."], ["Are the passwords truly random?", "Yes, they use the Web Crypto API."], ["Do you store them?", "No."]],
  },
  "text-to-speech": {
    intro: [
      "The Text-to-Speech Reader reads any text aloud using the voices installed on your device through the Web Speech API. Paste an article, an essay or your own notes, choose a voice and language, adjust speed and pitch, and listen — useful for proofreading, accessibility and revising while you walk.",
      "No audio is sent to a server: the browser's built-in speech engine does the work, so the available voices depend on your device and browser. If Hindi or another language isn't available, install the language pack in your system settings.",
    ],
    table: { caption: "Speed guide", head: ["Rate", "Words per minute (approx.)", "Use"], rows: [["0.8×", "≈ 130", "Language learning"], ["1.0×", "≈ 165", "Normal listening"], ["1.5×", "≈ 250", "Quick review"]] },
    tips: ["Long texts can stall some browsers; read in chunks of a few paragraphs.", "Add punctuation to control pauses — commas and full stops matter.", "Pick a voice that matches the text language to avoid odd pronunciation.", "Use headphones in shared spaces; there is no recording here."],
    steps: ["Paste or type your text.", "Choose a voice, speed and pitch.", "Press Speak; use Pause, Resume or Stop."],
    faqs: [["Why are there no voices?", "Some browsers load voices after a moment; reload or check system speech settings."], ["Can I download the audio?", "Browsers don't expose speech output as a file. Use the Audio Recorder with speakers if you need a recording."], ["Does it work offline?", "Many system voices work offline; online voices need a connection."], ["Is my text uploaded?", "No."]],
  },
  "stopwatch": {
    intro: [
      "A simple, precise stopwatch with lap times for workouts, study sessions, presentations and experiments. Start, pause, record laps and reset with large, accessible buttons — and use the keyboard: Space to start or stop, L for a lap, R to reset.",
      "Timing uses the browser's high-resolution clock, so it stays accurate even if the tab lags. Laps show both split and total time, and you can copy all laps as text. Nothing is stored or sent anywhere.",
    ],
    table: { caption: "Lap example", head: ["Lap", "Split", "Total"], rows: [["1", "00:42.31", "00:42.31"], ["2", "00:40.88", "01:23.19"], ["3", "00:41.05", "02:04.24"]] },
    tips: ["Keep the tab open for visual updates, but time stays accurate even if rendering is throttled.", "Use laps for intervals, e.g. practice-test sections.", "Copy laps into a spreadsheet to analyse pacing.", "Pair with the Focus Timer in Velyto Study for Pomodoro sessions."],
    steps: ["Press Start (or Space).", "Press Lap to mark splits.", "Stop, copy laps, or Reset."],
    faqs: [["How accurate is it?", "It uses performance.now(), accurate to a few milliseconds."], ["Does it keep running in the background?", "Yes — time is computed from timestamps, not frame counts."], ["Can I save sessions?", "Copy the laps; sessions aren't stored."], ["Are there keyboard shortcuts?", "Space, L and R."]],
  },
  "todo-list": {
    intro: [
      "A fast, private To-Do List that lives in your browser. Add tasks, tick them off, filter active or completed items and clear what's done. Tasks are saved on your device with localStorage, so they're still there tomorrow without an account.",
      "It is deliberately simple: no notifications, no tracking, no clutter. If you need study-specific planning, the Velyto Study planner offers a weekly timetable that syncs to your account when signed in.",
    ],
    table: { caption: "Example daily list", head: ["Task", "Status"], rows: [["Resize exam photo", "Done"], ["Revise chapter 4 flashcards", "Active"], ["Send invoice to client", "Active"]] },
    tips: ["Write tasks as actions ('Email supplier') rather than topics ('Supplier').", "Keep the daily list under seven items to finish what you start.", "Clear completed tasks weekly to stay focused.", "Clearing browser data will delete your list, so export important lists elsewhere."],
    steps: ["Type a task and press Enter.", "Tick tasks as you finish them.", "Filter or clear completed tasks."],
    faqs: [["Where are my tasks stored?", "In your browser's localStorage only."], ["Will tasks sync between devices?", "Not in this tool. For synced planning use the Study planner with an account."], ["Is there a task limit?", "No practical limit."], ["Can I reorder tasks?", "Not yet; request it on the Requests board."]],
  },
};
