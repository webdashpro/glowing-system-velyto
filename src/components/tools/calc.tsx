"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { downloadBlob, useLocalState } from "@/lib/client";
import { CopyBtn, Field, Notice, Num, Panel, Range, Stat, newId } from "./ui";
import { Icon } from "../Icon";

const inr = (n: number) => (Number.isFinite(n) ? n.toLocaleString("en-IN", { maximumFractionDigits: 2, minimumFractionDigits: 2 }) : "—");
const num = (n: number, d = 2) => (Number.isFinite(n) ? n.toLocaleString("en-US", { maximumFractionDigits: d }) : "—");

/* ===================== GST ===================== */
export function GstCalculator() {
  const [amount, setAmount] = useState(10000);
  const [rate, setRate] = useState(18);
  const [mode, setMode] = useState<"add" | "remove">("add");
  const [inter, setInter] = useState(false);
  const r = Number.isFinite(rate) ? rate : 0;
  const a = Number.isFinite(amount) ? amount : 0;
  const base = mode === "add" ? a : a / (1 + r / 100);
  const gst = (base * r) / 100;
  const total = base + gst;
  return (
    <Panel className="grid gap-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <Num label={mode === "add" ? "Amount (excluding GST)" : "Amount (including GST)"} suffix="₹" value={amount} onChange={setAmount} min={0} />
        <Num label="GST rate" suffix="%" value={rate} onChange={setRate} min={0} max={100} step="any" />
      </div>
      <div className="flex flex-wrap gap-2" role="group" aria-label="GST slabs">
        {[0, 3, 5, 12, 18, 28].map((v) => <button key={v} className="chip" aria-pressed={rate === v} onClick={() => setRate(v)}>{v}%</button>)}
      </div>
      <div className="flex flex-wrap gap-2">
        <button className="chip" aria-pressed={mode === "add"} onClick={() => setMode("add")}>Add GST</button>
        <button className="chip" aria-pressed={mode === "remove"} onClick={() => setMode("remove")}>Remove GST</button>
        <button className="chip" aria-pressed={!inter} onClick={() => setInter(false)}>Same state (CGST+SGST)</button>
        <button className="chip" aria-pressed={inter} onClick={() => setInter(true)}>Other state (IGST)</button>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <Stat label="Base price" value={`₹${inr(base)}`} />
        <Stat label="Total GST" value={`₹${inr(gst)}`} sub={inter ? `IGST ${r}%` : `CGST ${r / 2}% + SGST ${r / 2}%`} />
        <Stat label="Invoice total" value={`₹${inr(total)}`} />
      </div>
      {!inter && <div className="grid gap-3 sm:grid-cols-2"><Stat label={`CGST @ ${r / 2}%`} value={`₹${inr(gst / 2)}`} /><Stat label={`SGST @ ${r / 2}%`} value={`₹${inr(gst / 2)}`} /></div>}
      <CopyBtn text={`Base ₹${inr(base)} | GST ₹${inr(gst)} (${r}%) | Total ₹${inr(total)}`} label="Copy summary" />
    </Panel>
  );
}

/* ===================== EMI ===================== */
export function EmiCalculator() {
  const [p, setP] = useState(1000000);
  const [rate, setRate] = useState(9);
  const [ten, setTen] = useState(10);
  const [unit, setUnit] = useState<"y" | "m">("y");
  const n = Math.max(1, Math.round(unit === "y" ? ten * 12 : ten));
  const r = rate / 12 / 100;
  const emi = r === 0 ? p / n : (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  const totalPay = emi * n;
  const interest = totalPay - p;
  const yearly = useMemo(() => {
    const rows: { y: number; principal: number; interest: number; balance: number }[] = [];
    let bal = p;
    let ip = 0;
    let pp = 0;
    for (let m = 1; m <= n && Number.isFinite(emi); m++) {
      const i = bal * r;
      const pr = emi - i;
      bal = Math.max(0, bal - pr);
      ip += i;
      pp += pr;
      if (m % 12 === 0 || m === n) {
        rows.push({ y: Math.ceil(m / 12), principal: pp, interest: ip, balance: bal });
        ip = 0;
        pp = 0;
      }
    }
    return rows;
  }, [p, r, n, emi]);
  const pct = totalPay > 0 ? Math.round((p / totalPay) * 100) : 0;
  return (
    <Panel className="grid gap-4">
      <div className="grid gap-3 sm:grid-cols-3">
        <Num label="Loan amount" suffix="₹" value={p} onChange={setP} min={0} step={10000} />
        <Num label="Interest rate (p.a.)" suffix="%" value={rate} onChange={setRate} min={0} step="any" />
        <div className="grid grid-cols-[1fr_auto] items-end gap-2">
          <Num label="Tenure" value={ten} onChange={setTen} min={1} />
          <select className="input w-auto" aria-label="Tenure unit" value={unit} onChange={(e) => setUnit(e.target.value as "y" | "m")}><option value="y">years</option><option value="m">months</option></select>
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <Stat label="Monthly EMI" value={`₹${inr(emi)}`} />
        <Stat label="Total interest" value={`₹${inr(interest)}`} />
        <Stat label="Total payable" value={`₹${inr(totalPay)}`} />
      </div>
      <div>
        <div className="flex h-4 overflow-hidden rounded-full bg-brand-soft" role="img" aria-label={`Principal ${pct}%, interest ${100 - pct}%`}>
          <div className="bg-brand" style={{ width: `${pct}%` }} />
          <div className="bg-sky-400" style={{ width: `${100 - pct}%` }} />
        </div>
        <p className="mt-1 text-xs text-muted"><span className="font-semibold text-brand-link">■ Principal {pct}%</span> · <span className="font-semibold text-sky-500">■ Interest {100 - pct}%</span></p>
      </div>
      <div className="table-wrap max-h-72 overflow-y-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-soft text-left"><tr><th className="p-2">Year</th><th className="p-2">Principal</th><th className="p-2">Interest</th><th className="p-2">Balance</th></tr></thead>
          <tbody>{yearly.map((y) => <tr key={y.y} className="border-t border-line"><td className="p-2">{y.y}</td><td className="p-2">₹{inr(y.principal)}</td><td className="p-2">₹{inr(y.interest)}</td><td className="p-2">₹{inr(y.balance)}</td></tr>)}</tbody>
        </table>
      </div>
    </Panel>
  );
}

/* ===================== CGPA ===================== */
export function CgpaConverter() {
  const [cgpa, setCgpa] = useState(8.4);
  const [scheme, setScheme] = useState("cbse");
  const [mult, setMult] = useState(9.5);
  const [pctIn, setPctIn] = useState(75);
  const to = (c: number) => (scheme === "cbse" ? c * 9.5 : scheme === "ten" ? c * 10 : scheme === "vtu" ? (c - 0.75) * 10 : scheme === "gpa4" ? (c / 4) * 100 : c * mult);
  const from = (p: number) => (scheme === "cbse" ? p / 9.5 : scheme === "ten" ? p / 10 : scheme === "vtu" ? p / 10 + 0.75 : scheme === "gpa4" ? (p / 100) * 4 : p / (mult || 1));
  const pct = to(cgpa);
  return (
    <Panel className="grid gap-4">
      <Field label="Conversion formula">
        <select className="input" value={scheme} onChange={(e) => setScheme(e.target.value)}>
          <option value="cbse">CBSE — CGPA × 9.5</option>
          <option value="ten">Generic — CGPA × 10</option>
          <option value="vtu">VTU — (CGPA − 0.75) × 10</option>
          <option value="gpa4">4.0 scale — GPA ÷ 4 × 100</option>
          <option value="custom">Custom multiplier</option>
        </select>
      </Field>
      {scheme === "custom" && <Num label="Multiplier" value={mult} onChange={setMult} step="any" min={0} />}
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="grid gap-3">
          <Num label={scheme === "gpa4" ? "GPA (out of 4.0)" : "CGPA (out of 10)"} value={cgpa} onChange={setCgpa} min={0} max={10} step="any" />
          <Stat label="Percentage" value={`${num(pct, 2)}%`} />
        </div>
        <div className="grid gap-3">
          <Num label="Reverse: percentage" suffix="%" value={pctIn} onChange={setPctIn} min={0} max={100} step="any" />
          <Stat label="Approx. CGPA" value={num(from(pctIn), 2)} />
        </div>
      </div>
      <p className="text-xs text-muted">Use the formula your university or employer publishes — official rules always win.</p>
    </Panel>
  );
}

/* ===================== Percentage ===================== */
export function PercentageCalculator() {
  const [mode, setMode] = useState("of");
  const [x, setX] = useState(20);
  const [y, setY] = useState(850);
  const res: [string, string] =
    mode === "of" ? [`${num((x / 100) * y, 4)}`, `${x}% of ${y} = ${x} ÷ 100 × ${y}`]
    : mode === "what" ? [`${num((x / y) * 100, 4)}%`, `${x} is ${num((x / y) * 100, 4)}% of ${y}`]
    : mode === "change" ? [`${num(((y - x) / Math.abs(x)) * 100, 4)}%`, `(${y} − ${x}) ÷ ${x} × 100`]
    : mode === "plus" ? [`${num(x * (1 + y / 100), 4)}`, `${x} + ${y}%`]
    : [`${num(x * (1 - y / 100), 4)}`, `${x} − ${y}%`];
  const labels: Record<string, [string, string]> = { of: ["Percent", "Of number"], what: ["Number", "Out of"], change: ["From", "To"], plus: ["Number", "Add percent"], minus: ["Number", "Subtract percent"] };
  return (
    <Panel className="grid gap-4">
      <div className="flex flex-wrap gap-2" role="group" aria-label="Calculation type">
        {[["of", "X% of Y"], ["what", "X is what % of Y"], ["change", "% change X → Y"], ["plus", "Add %"], ["minus", "Subtract %"]].map(([k, l]) => <button key={k} className="chip" aria-pressed={mode === k} onClick={() => setMode(k)}>{l}</button>)}
      </div>
      <div className="grid gap-3 sm:grid-cols-2"><Num label={labels[mode][0]} value={x} onChange={setX} step="any" /><Num label={labels[mode][1]} value={y} onChange={setY} step="any" /></div>
      <Stat label="Answer" value={res[0]} sub={res[1]} />
    </Panel>
  );
}

/* ===================== Unit converter ===================== */
const UNITS: Record<string, Record<string, number>> = {
  Length: { Metre: 1, Kilometre: 1000, Centimetre: 0.01, Millimetre: 0.001, Mile: 1609.344, Yard: 0.9144, Foot: 0.3048, Inch: 0.0254 },
  Mass: { Kilogram: 1, Gram: 0.001, Milligram: 1e-6, Tonne: 1000, Pound: 0.45359237, Ounce: 0.028349523125 },
  Volume: { Litre: 1, Millilitre: 0.001, "Cubic metre": 1000, "US gallon": 3.785411784, "US cup": 0.2365882365, "Fluid ounce (US)": 0.0295735295625 },
  Area: { "Square metre": 1, "Square kilometre": 1e6, "Square foot": 0.09290304, "Square yard": 0.83612736, Acre: 4046.8564224, Hectare: 10000 },
  Speed: { "m/s": 1, "km/h": 1 / 3.6, mph: 0.44704, Knot: 0.514444 },
  Time: { Second: 1, Minute: 60, Hour: 3600, Day: 86400, Week: 604800, Year: 31557600 },
  Data: { Byte: 1, Kilobyte: 1024, Megabyte: 1048576, Gigabyte: 1073741824, Terabyte: 1099511627776 },
  Temperature: { Celsius: 1, Fahrenheit: 1, Kelvin: 1 },
};

export function UnitConverter() {
  const [cat, setCat] = useState("Length");
  const names = Object.keys(UNITS[cat]);
  const [from, setFrom] = useState("Kilometre");
  const [to, setTo] = useState("Mile");
  const [v, setV] = useState(1);
  const f = names.includes(from) ? from : names[0];
  const t = names.includes(to) ? to : names[1] ?? names[0];
  let out: number;
  if (cat === "Temperature") {
    const c = f === "Celsius" ? v : f === "Fahrenheit" ? ((v - 32) * 5) / 9 : v - 273.15;
    out = t === "Celsius" ? c : t === "Fahrenheit" ? (c * 9) / 5 + 32 : c + 273.15;
  } else out = (v * UNITS[cat][f]) / UNITS[cat][t];
  return (
    <Panel className="grid gap-4">
      <div className="flex flex-wrap gap-2">{Object.keys(UNITS).map((c) => <button key={c} className="chip" aria-pressed={cat === c} onClick={() => { setCat(c); const n = Object.keys(UNITS[c]); setFrom(n[0]); setTo(n[1] ?? n[0]); }}>{c}</button>)}</div>
      <div className="grid items-end gap-3 sm:grid-cols-[1fr_1fr_1fr]">
        <Num label="Value" value={v} onChange={setV} step="any" />
        <Field label="From"><select className="input" value={f} onChange={(e) => setFrom(e.target.value)}>{names.map((n) => <option key={n}>{n}</option>)}</select></Field>
        <Field label="To"><select className="input" value={t} onChange={(e) => setTo(e.target.value)}>{names.map((n) => <option key={n}>{n}</option>)}</select></Field>
      </div>
      <Stat label={`${num(v, 6)} ${f} =`} value={`${num(out, 8)} ${t}`} />
      <button className="btn btn-secondary btn-sm w-fit" onClick={() => { setFrom(t); setTo(f); }}>⇄ Swap units</button>
    </Panel>
  );
}

/* ===================== Age ===================== */
function diffYMD(from: Date, to: Date) {
  let y = to.getFullYear() - from.getFullYear();
  let m = to.getMonth() - from.getMonth();
  let d = to.getDate() - from.getDate();
  if (d < 0) {
    m--;
    d += new Date(to.getFullYear(), to.getMonth(), 0).getDate();
  }
  if (m < 0) {
    y--;
    m += 12;
  }
  return { y, m, d };
}
const toISO = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const parseISO = (s: string) => {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
};

export function AgeCalculator() {
  const [dob, setDob] = useState("");
  const [asOn, setAsOn] = useState("");
  useEffect(() => setAsOn(toISO(new Date())), []);
  const valid = dob && asOn && parseISO(dob) <= parseISO(asOn);
  const a = valid ? parseISO(asOn) : null;
  const b = valid ? parseISO(dob) : null;
  const age = a && b ? diffYMD(b, a) : null;
  const days = a && b ? Math.round((a.getTime() - b.getTime()) / 86400000) : 0;
  let next = 0;
  if (a && b) {
    let nb = new Date(a.getFullYear(), b.getMonth(), b.getDate());
    if (nb < a) nb = new Date(a.getFullYear() + 1, b.getMonth(), b.getDate());
    next = Math.round((nb.getTime() - a.getTime()) / 86400000);
  }
  return (
    <Panel className="grid gap-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Date of birth"><input type="date" className="input" value={dob} onChange={(e) => setDob(e.target.value)} max={asOn || undefined} /></Field>
        <Field label="Age as on"><input type="date" className="input" value={asOn} onChange={(e) => setAsOn(e.target.value)} /></Field>
      </div>
      {dob && !valid && <Notice kind="error">Date of birth must be on or before the “age as on” date.</Notice>}
      {age ? (
        <>
          <div className="grid gap-3 sm:grid-cols-3"><Stat label="Years" value={age.y} /><Stat label="Months" value={age.m} /><Stat label="Days" value={age.d} /></div>
          <div className="grid gap-3 sm:grid-cols-3"><Stat label="Total days" value={days.toLocaleString()} /><Stat label="Total weeks" value={Math.floor(days / 7).toLocaleString()} /><Stat label="Next birthday in" value={`${next} days`} /></div>
        </>
      ) : <p className="text-sm text-muted">Enter a date of birth to see your exact age.</p>}
    </Panel>
  );
}

/* ===================== BMI ===================== */
export function BmiCalculator() {
  const [unit, setUnit] = useState<"metric" | "imperial">("metric");
  const [cm, setCm] = useState(170);
  const [kg, setKg] = useState(68);
  const [ft, setFt] = useState(5);
  const [inch, setInch] = useState(7);
  const [lb, setLb] = useState(150);
  const hM = unit === "metric" ? cm / 100 : (ft * 12 + inch) * 0.0254;
  const wKg = unit === "metric" ? kg : lb * 0.45359237;
  const bmi = hM > 0 ? wKg / (hM * hM) : NaN;
  const cat = !Number.isFinite(bmi) ? "—" : bmi < 18.5 ? "Underweight" : bmi < 25 ? "Normal range" : bmi < 30 ? "Overweight" : "Obesity";
  const lo = 18.5 * hM * hM;
  const hi = 24.9 * hM * hM;
  const show = (k: number) => (unit === "metric" ? `${k.toFixed(1)} kg` : `${(k / 0.45359237).toFixed(0)} lb`);
  return (
    <Panel className="grid gap-4">
      <div className="flex gap-2"><button className="chip" aria-pressed={unit === "metric"} onClick={() => setUnit("metric")}>Metric</button><button className="chip" aria-pressed={unit === "imperial"} onClick={() => setUnit("imperial")}>Imperial</button></div>
      {unit === "metric" ? (
        <div className="grid gap-3 sm:grid-cols-2"><Num label="Height" suffix="cm" value={cm} onChange={setCm} min={50} max={250} /><Num label="Weight" suffix="kg" value={kg} onChange={setKg} min={10} max={400} step="any" /></div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-3"><Num label="Feet" value={ft} onChange={setFt} min={2} max={8} /><Num label="Inches" value={inch} onChange={setInch} min={0} max={11} /><Num label="Weight" suffix="lb" value={lb} onChange={setLb} min={20} /></div>
      )}
      <div className="grid gap-3 sm:grid-cols-3"><Stat label="Your BMI" value={Number.isFinite(bmi) ? bmi.toFixed(1) : "—"} /><Stat label="Category (WHO)" value={cat} /><Stat label="Healthy weight range" value={Number.isFinite(bmi) ? `${show(lo)} – ${show(hi)}` : "—"} /></div>
      <p className="text-xs text-muted">BMI is a screening number, not a diagnosis. Talk to a healthcare professional for personal advice.</p>
    </Panel>
  );
}

/* ===================== QR ===================== */
export function QrGenerator() {
  const [text, setText] = useState("https://velyto.netlify.app");
  const [size, setSize] = useState(320);
  const [fg, setFg] = useState("#0a1630");
  const [bg, setBg] = useState("#ffffff");
  const [ec, setEc] = useState<"L" | "M" | "Q" | "H">("M");
  const [png, setPng] = useState("");
  const [err, setErr] = useState("");
  useEffect(() => {
    let dead = false;
    if (!text) return setPng("");
    (async () => {
      try {
        const QR = (await import("qrcode")).default;
        const u = await QR.toDataURL(text, { width: size, margin: 2, errorCorrectionLevel: ec, color: { dark: fg, light: bg } });
        if (!dead) {
          setPng(u);
          setErr("");
        }
      } catch {
        if (!dead) setErr("This text is too long for a QR code. Shorten it or lower the error-correction level.");
      }
    })();
    return () => {
      dead = true;
    };
  }, [text, size, fg, bg, ec]);
  const svg = async () => {
    const QR = (await import("qrcode")).default;
    const s = await QR.toString(text, { type: "svg", margin: 2, errorCorrectionLevel: ec, color: { dark: fg, light: bg } });
    downloadBlob(new Blob([s], { type: "image/svg+xml" }), "qr-code.svg");
  };
  return (
    <Panel className="grid gap-5 lg:grid-cols-[1fr_20rem]">
      <div className="grid content-start gap-3">
        <Field label="Text or URL"><textarea className="input min-h-[6rem]" value={text} onChange={(e) => setText(e.target.value)} maxLength={1200} /></Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Foreground"><input type="color" className="input h-10 p-1" value={fg} onChange={(e) => setFg(e.target.value)} /></Field>
          <Field label="Background"><input type="color" className="input h-10 p-1" value={bg} onChange={(e) => setBg(e.target.value)} /></Field>
          <Field label="Error correction"><select className="input" value={ec} onChange={(e) => setEc(e.target.value as typeof ec)}><option value="L">L — 7%</option><option value="M">M — 15%</option><option value="Q">Q — 25%</option><option value="H">H — 30%</option></select></Field>
          <Range label="Size" value={size} onChange={setSize} min={128} max={1024} step={16} unit="px" />
        </div>
      </div>
      <div className="grid content-start justify-items-center gap-3">
        {err ? <Notice kind="error">{err}</Notice> : png ? /* eslint-disable-next-line @next/next/no-img-element */ <img src={png} alt="Generated QR code" className="h-auto w-full max-w-[18rem] rounded-xl border border-line" /> : <p className="text-sm text-muted">Type something to generate a code.</p>}
        <div className="flex gap-2">
          <button className="btn btn-primary btn-sm" disabled={!png} onClick={async () => png && downloadBlob(await (await fetch(png)).blob(), "qr-code.png")}><Icon name="download" className="h-4 w-4" />PNG</button>
          <button className="btn btn-secondary btn-sm" disabled={!png} onClick={svg}><Icon name="download" className="h-4 w-4" />SVG</button>
        </div>
      </div>
    </Panel>
  );
}

/* ===================== Password ===================== */
export function PasswordGenerator() {
  const [len, setLen] = useState(16);
  const [opt, setOpt] = useState({ lower: true, upper: true, digit: true, sym: true, similar: true });
  const [pw, setPw] = useState("");
  const sets = useMemo(() => {
    const ex = opt.similar ? /[Il1O0o]/g : /$^/;
    const s: string[] = [];
    if (opt.lower) s.push("abcdefghijklmnopqrstuvwxyz".replace(ex, ""));
    if (opt.upper) s.push("ABCDEFGHIJKLMNOPQRSTUVWXYZ".replace(ex, ""));
    if (opt.digit) s.push("0123456789".replace(ex, ""));
    if (opt.sym) s.push("!@#$%^&*()-_=+[]{};:,.?");
    return s;
  }, [opt]);
  const generate = () => {
    if (!sets.length) return setPw("");
    const pool = sets.join("");
    const rnd = (n: number) => {
      const lim = Math.floor(0x100000000 / n) * n;
      const b = new Uint32Array(1);
      do crypto.getRandomValues(b);
      while (b[0] >= lim);
      return b[0] % n;
    };
    const chars = sets.map((s) => s[rnd(s.length)]);
    while (chars.length < len) chars.push(pool[rnd(pool.length)]);
    for (let i = chars.length - 1; i > 0; i--) {
      const j = rnd(i + 1);
      [chars[i], chars[j]] = [chars[j], chars[i]];
    }
    setPw(chars.slice(0, len).join(""));
  };
  useEffect(generate, [len, sets]); // eslint-disable-line react-hooks/exhaustive-deps
  const entropy = pw ? Math.round(len * Math.log2(sets.join("").length || 1)) : 0;
  const label = entropy < 50 ? "Weak" : entropy < 70 ? "Fair" : entropy < 100 ? "Strong" : "Excellent";
  return (
    <Panel className="grid gap-4">
      <div className="flex items-center gap-2 rounded-xl border border-line bg-soft p-3">
        <output className="min-w-0 flex-1 break-all font-mono text-lg" aria-live="polite">{pw || "Select at least one character type"}</output>
        <CopyBtn text={pw} />
        <button className="btn btn-primary btn-sm" onClick={generate}>Generate</button>
      </div>
      <Range label="Length" value={len} onChange={setLen} min={8} max={64} />
      <div className="flex flex-wrap gap-4 text-sm">
        {([["lower", "a–z"], ["upper", "A–Z"], ["digit", "0–9"], ["sym", "Symbols"], ["similar", "Avoid look-alikes (l, 1, O, 0)"]] as const).map(([k, l]) => (
          <label key={k} className="flex items-center gap-2"><input type="checkbox" checked={opt[k]} onChange={(e) => setOpt({ ...opt, [k]: e.target.checked })} />{l}</label>
        ))}
      </div>
      <Stat label="Strength" value={label} sub={`≈ ${entropy} bits of entropy`} />
    </Panel>
  );
}

/* ===================== TTS ===================== */
export function TextToSpeech() {
  const [text, setText] = useState("Welcome to Velyto. Paste any text here and I will read it aloud.");
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [vi, setVi] = useState(0);
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [ok, setOk] = useState(true);
  useEffect(() => {
    if (!("speechSynthesis" in window)) return setOk(false);
    const load = () => setVoices(window.speechSynthesis.getVoices());
    load();
    window.speechSynthesis.addEventListener("voiceschanged", load);
    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", load);
      window.speechSynthesis.cancel();
    };
  }, []);
  const speak = () => {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    if (voices[vi]) {
      u.voice = voices[vi];
      u.lang = voices[vi].lang;
    }
    u.rate = rate;
    u.pitch = pitch;
    window.speechSynthesis.speak(u);
  };
  if (!ok) return <Panel><Notice kind="warn">Your browser does not support speech synthesis.</Notice></Panel>;
  return (
    <Panel className="grid gap-4">
      <Field label="Text to read"><textarea className="input min-h-[10rem]" value={text} onChange={(e) => setText(e.target.value)} /></Field>
      <div className="grid gap-3 sm:grid-cols-3">
        <Field label="Voice"><select className="input" value={vi} onChange={(e) => setVi(Number(e.target.value))}>{voices.length === 0 && <option>Default voice</option>}{voices.map((v, i) => <option key={v.voiceURI + i} value={i}>{v.name} ({v.lang})</option>)}</select></Field>
        <Range label="Speed" value={rate} onChange={setRate} min={0.5} max={2} step={0.1} unit="×" />
        <Range label="Pitch" value={pitch} onChange={setPitch} min={0.5} max={2} step={0.1} />
      </div>
      <div className="flex flex-wrap gap-2">
        <button className="btn btn-primary" onClick={speak}><Icon name="play" className="h-4 w-4" />Speak</button>
        <button className="btn btn-secondary" onClick={() => window.speechSynthesis.pause()}>Pause</button>
        <button className="btn btn-secondary" onClick={() => window.speechSynthesis.resume()}>Resume</button>
        <button className="btn btn-secondary" onClick={() => window.speechSynthesis.cancel()}>Stop</button>
      </div>
    </Panel>
  );
}

/* ===================== Stopwatch ===================== */
const fmtT = (ms: number) => {
  const cs = Math.floor(ms / 10) % 100;
  const s = Math.floor(ms / 1000) % 60;
  const m = Math.floor(ms / 60000);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}.${String(cs).padStart(2, "0")}`;
};

export function Stopwatch() {
  const [run, setRun] = useState(false);
  const [el, setEl] = useState(0);
  const [laps, setLaps] = useState<number[]>([]);
  const base = useRef(0);
  const elRef = useRef(0);
  useEffect(() => {
    elRef.current = el;
  }, [el]);
  useEffect(() => {
    if (!run) return;
    base.current = performance.now() - elRef.current;
    let id = 0;
    const tick = () => {
      setEl(performance.now() - base.current);
      id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [run]);
  const lap = () => setLaps((l) => [...l, elRef.current]);
  const reset = () => {
    setRun(false);
    setEl(0);
    setLaps([]);
  };
  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || tag === "BUTTON") return;
      if (e.code === "Space") { e.preventDefault(); setRun((r) => !r); }
      else if (e.key.toLowerCase() === "l" && run) lap();
      else if (e.key.toLowerCase() === "r") reset();
    };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [run]);
  const text = laps.map((t, i) => `Lap ${i + 1}: split ${fmtT(t - (laps[i - 1] ?? 0))}, total ${fmtT(t)}`).join("\n");
  return (
    <Panel className="grid gap-4 text-center">
      <output className="font-display text-6xl font-extrabold tabular-nums sm:text-7xl" aria-live="off">{fmtT(el)}</output>
      <div className="flex flex-wrap justify-center gap-2">
        <button className="btn btn-primary" onClick={() => setRun(!run)}><Icon name={run ? "pause" : "play"} className="h-4 w-4" />{run ? "Stop" : el ? "Resume" : "Start"}</button>
        <button className="btn btn-secondary" onClick={lap} disabled={!run}>Lap</button>
        <button className="btn btn-secondary" onClick={reset}>Reset</button>
      </div>
      <p className="text-xs text-muted">Shortcuts: Space start/stop · L lap · R reset</p>
      {laps.length > 0 && (
        <div className="text-left">
          <div className="table-wrap max-h-60 overflow-y-auto"><table className="w-full text-sm"><thead className="bg-soft"><tr><th className="p-2">Lap</th><th className="p-2">Split</th><th className="p-2">Total</th></tr></thead><tbody>{laps.map((t, i) => <tr key={i} className="border-t border-line"><td className="p-2">{i + 1}</td><td className="p-2 tabular-nums">{fmtT(t - (laps[i - 1] ?? 0))}</td><td className="p-2 tabular-nums">{fmtT(t)}</td></tr>)}</tbody></table></div>
          <div className="mt-2"><CopyBtn text={text} label="Copy laps" /></div>
        </div>
      )}
    </Panel>
  );
}

/* ===================== To-do ===================== */
type Todo = { id: string; text: string; done: boolean };
export function TodoList() {
  const [todos, setTodos, ready] = useLocalState<Todo[]>("velyto.todo", []);
  const [text, setText] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "done">("all");
  const shown = todos.filter((t) => (filter === "all" ? true : filter === "done" ? t.done : !t.done));
  const add = () => {
    if (!text.trim()) return;
    setTodos([{ id: newId(), text: text.trim(), done: false }, ...todos]);
    setText("");
  };
  return (
    <Panel className="grid gap-4">
      <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); add(); }}>
        <input className="input" placeholder="Add a task and press Enter" value={text} onChange={(e) => setText(e.target.value)} maxLength={200} aria-label="New task" />
        <button className="btn btn-primary" type="submit"><Icon name="plus" className="h-4 w-4" />Add</button>
      </form>
      <div className="flex flex-wrap items-center gap-2">
        {(["all", "active", "done"] as const).map((f) => <button key={f} className="chip capitalize" aria-pressed={filter === f} onClick={() => setFilter(f)}>{f}</button>)}
        <span className="ml-auto text-xs text-muted">{todos.filter((t) => !t.done).length} remaining</span>
        <button className="btn btn-ghost btn-sm" onClick={() => setTodos(todos.filter((t) => !t.done))}>Clear completed</button>
      </div>
      <ul className="grid gap-2">
        {shown.map((t) => (
          <li key={t.id} className="flex items-center gap-3 rounded-xl border border-line p-3">
            <input type="checkbox" className="h-5 w-5 accent-[var(--brand)]" checked={t.done} onChange={() => setTodos(todos.map((x) => (x.id === t.id ? { ...x, done: !x.done } : x)))} aria-label={`Mark “${t.text}” done`} />
            <span className={`flex-1 break-words ${t.done ? "text-muted line-through" : ""}`}>{t.text}</span>
            <button className="btn btn-ghost btn-sm text-bad" onClick={() => setTodos(todos.filter((x) => x.id !== t.id))} aria-label="Delete task"><Icon name="trash" className="h-4 w-4" /></button>
          </li>
        ))}
        {ready && shown.length === 0 && <li className="rounded-xl border border-dashed border-line p-6 text-center text-sm text-muted">Nothing here yet.</li>}
      </ul>
    </Panel>
  );
}
