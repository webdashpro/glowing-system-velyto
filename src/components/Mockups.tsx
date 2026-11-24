/* Lightweight, crisp SVG product mockups — zero external images. */

export function HeroCollage({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 560 450" className={className} role="img" aria-label="Illustration of Velyto: an image compressor, a shop catalogue on a phone, an invoice and a flashcard">
      <defs>
        <linearGradient id="hg1" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#60a5fa" /><stop offset="1" stopColor="#1d4ed8" /></linearGradient>
        <linearGradient id="hg2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#bfdbfe" /><stop offset="1" stopColor="#3b82f6" /></linearGradient>
        <filter id="hsh" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="14" stdDeviation="14" floodColor="#1e3a8a" floodOpacity="0.22" /></filter>
      </defs>
      <circle cx="300" cy="230" r="200" className="fill-brand-soft" />
      {/* browser window */}
      <g filter="url(#hsh)" className="float-slow">
        <rect x="14" y="40" width="340" height="245" rx="16" className="fill-surface stroke-line" />
        <path d="M14 56a16 16 0 0 1 16-16h308a16 16 0 0 1 16 16v22H14z" className="fill-soft" />
        <circle cx="34" cy="59" r="4.500" fill="#f87171" /><circle cx="49" cy="59" r="4.500" fill="#fbbf24" /><circle cx="64" cy="59" r="4.500" fill="#34d399" />
        <rect x="90" y="52" width="170" height="14" rx="7" className="fill-line" />
        <text x="34" y="104" fontSize="13" fontWeight="800" className="fill-fg">Image Compressor</text>
        <rect x="34" y="116" width="130" height="100" rx="10" fill="url(#hg2)" />
        <circle cx="62" cy="144" r="10" fill="#fff" opacity="0.9" />
        <path d="M34 216l42-48 30 32 20-18 38 34z" fill="#1e40af" opacity="0.55" />
        <text x="184" y="132" fontSize="11" className="fill-muted">Original</text>
        <text x="184" y="150" fontSize="17" fontWeight="800" className="fill-fg">4.2 MB</text>
        <text x="184" y="172" fontSize="11" className="fill-muted">Compressed</text>
        <text x="184" y="192" fontSize="17" fontWeight="800" className="fill-brand-link">48 KB</text>
        <rect x="262" y="176" width="68" height="22" rx="11" fill="#10b981" opacity="0.18" />
        <text x="272" y="191" fontSize="11" fontWeight="800" fill="#059669">−98%</text>
        <rect x="184" y="206" width="146" height="10" rx="5" className="fill-line" />
        <rect x="184" y="206" width="132" height="10" rx="5" fill="url(#hg1)" />
        <rect x="34" y="236" width="296" height="34" rx="10" fill="url(#hg1)" />
        <text x="182" y="258" fontSize="13" fontWeight="700" fill="#fff" textAnchor="middle">Download · stays on your device</text>
      </g>
      {/* phone */}
      <g filter="url(#hsh)" className="float-slow-2">
        <rect x="372" y="12" width="172" height="336" rx="28" fill="#0f1b3d" />
        <rect x="380" y="22" width="156" height="316" rx="22" className="fill-surface" />
        <rect x="448" y="28" width="20" height="5" rx="2.500" fill="#0f1b3d" />
        <rect x="380" y="38" width="156" height="50" fill="url(#hg1)" />
        <text x="392" y="60" fontSize="12" fontWeight="800" fill="#fff">Maya&apos;s Bakery</text>
        <text x="392" y="76" fontSize="9" fill="#dbeafe">Mumbai · Open till 9pm</text>
        {[0, 1].map((i) => (
          <g key={i} transform={`translate(0 ${i * 78})`}>
            <rect x="390" y="98" width="136" height="68" rx="10" className="fill-soft stroke-line" />
            <rect x="398" y="106" width="42" height="42" rx="8" fill={i ? "#fde68a" : "#fbcfe8"} />
            <circle cx="419" cy="127" r="11" fill={i ? "#f59e0b" : "#ec4899"} opacity="0.7" />
            <text x="448" y="120" fontSize="10" fontWeight="700" className="fill-fg">{i ? "Sourdough loaf" : "Berry cake"}</text>
            <text x="448" y="136" fontSize="11" fontWeight="800" className="fill-brand-link">{i ? "₹320" : "₹1,450"}</text>
            <rect x="448" y="142" width="70" height="16" rx="8" fill="#16a34a" />
            <text x="483" y="153.500" fontSize="8" fontWeight="700" fill="#fff" textAnchor="middle">Order on WhatsApp</text>
          </g>
        ))}
        <rect x="390" y="262" width="136" height="60" rx="10" className="fill-brand-soft" />
        <rect x="400" y="274" width="60" height="6" rx="3" className="fill-brand" opacity="0.5" />
        <rect x="400" y="288" width="100" height="6" rx="3" className="fill-line" />
        <rect x="400" y="302" width="80" height="6" rx="3" className="fill-line" />
      </g>
      {/* invoice */}
      <g filter="url(#hsh)" className="float-slow-2">
        <rect x="36" y="268" width="196" height="166" rx="14" className="fill-surface stroke-line" />
        <text x="52" y="292" fontSize="12" fontWeight="800" className="fill-fg">INVOICE</text>
        <text x="52" y="306" fontSize="9" className="fill-muted">INV-2026-014 · USD</text>
        <rect x="190" y="280" width="30" height="18" rx="9" className="fill-brand" />
        <text x="205" y="292.500" fontSize="8" fontWeight="800" fill="#fff" textAnchor="middle">PDF</text>
        {[0, 1, 2].map((i) => (<g key={i}><rect x="52" y={322 + i * 18} width={90 - i * 12} height="6" rx="3" className="fill-line" /><rect x="176" y={322 + i * 18} width="38" height="6" rx="3" className="fill-line" /></g>))}
        <line x1="52" y1="380" x2="214" y2="380" className="stroke-line" />
        <text x="52" y="404" fontSize="10" className="fill-muted">Total</text>
        <text x="214" y="406" fontSize="16" fontWeight="800" className="fill-brand-link" textAnchor="end">$1,180.00</text>
      </g>
      {/* flashcard */}
      <g filter="url(#hsh)" transform="rotate(-5 330 370)" className="float-slow">
        <rect x="256" y="318" width="164" height="104" rx="14" fill="url(#hg1)" />
        <text x="272" y="342" fontSize="9" fontWeight="700" fill="#bfdbfe">FLASHCARD · BIOLOGY</text>
        <text x="272" y="366" fontSize="12" fontWeight="800" fill="#fff">What is active recall?</text>
        <rect x="272" y="380" width="110" height="5" rx="2.500" fill="#fff" opacity="0.35" />
        <rect x="272" y="392" width="76" height="5" rx="2.500" fill="#fff" opacity="0.35" />
      </g>
      {/* privacy pill */}
      <g>
        <rect x="236" y="4" width="152" height="28" rx="14" className="fill-surface stroke-line" />
        <path d="M254 11l-7 3v5c0 4 3 6 7 8 4-2 7-4 7-8v-5z" className="fill-brand" />
        <text x="268" y="22" fontSize="11" fontWeight="800" className="fill-fg">0 bytes uploaded</text>
      </g>
    </svg>
  );
}

export type PillarKind = "tools" | "media" | "shop" | "study" | "business";

export function PillarMock({ kind }: { kind: PillarKind }) {
  return (
    <svg viewBox="0 0 320 170" className="h-auto w-full" role="img" aria-label={`${kind} product preview`}>
      <rect width="320" height="170" rx="14" className="fill-soft" />
      {kind === "tools" && (
        <g>
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <g key={i} transform={`translate(${16 + (i % 3) * 98} ${16 + Math.floor(i / 3) * 62})`}>
              <rect width="90" height="54" rx="10" className="fill-surface stroke-line" />
              <rect x="10" y="10" width="20" height="20" rx="6" className="fill-brand" opacity={0.9 - i * 0.1} />
              <rect x="10" y="38" width="52" height="6" rx="3" className="fill-line" />
              <rect x="38" y="16" width="38" height="5" rx="2.500" className="fill-line" />
            </g>
          ))}
          <rect x="16" y="146" width="288" height="8" rx="4" className="fill-line" /><rect x="16" y="146" width="196" height="8" rx="4" className="fill-brand" />
        </g>
      )}
      {kind === "media" && (
        <g>
          <rect x="16" y="14" width="288" height="104" rx="10" fill="#0f1b3d" />
          <circle cx="160" cy="66" r="20" fill="#fff" opacity="0.14" /><path d="M153 55v22l19-11z" fill="#fff" />
          {[0, 1, 2, 3, 4].map((i) => <rect key={i} x={16 + i * 58} y="124" width="52" height="30" rx="6" className={i === 2 ? "fill-brand" : "fill-line"} opacity={i === 2 ? 1 : 0.8} />)}
          <rect x="16" y="108" width="288" height="4" rx="2" fill="#fff" opacity="0.2" /><rect x="16" y="108" width="140" height="4" rx="2" className="fill-brand" />
        </g>
      )}
      {kind === "shop" && (
        <g>
          <rect x="22" y="12" width="92" height="146" rx="14" fill="#0f1b3d" /><rect x="27" y="20" width="82" height="132" rx="10" className="fill-surface" />
          <rect x="27" y="20" width="82" height="24" rx="10" className="fill-brand" />
          {[0, 1].map((i) => <rect key={i} x="33" y={50 + i * 38} width="70" height="32" rx="6" className="fill-soft stroke-line" />)}
          <rect x="136" y="26" width="170" height="38" rx="12" className="fill-surface stroke-line" /><text x="148" y="43" fontSize="10" className="fill-fg" fontWeight="700">Hi! Is the berry cake available?</text><text x="148" y="56" fontSize="8" className="fill-muted">10:42</text>
          <rect x="166" y="76" width="140" height="38" rx="12" fill="#dcfce7" /><text x="178" y="93" fontSize="10" fill="#14532d" fontWeight="700">Yes! Ready by 5 pm ✓✓</text>
          <rect x="136" y="128" width="170" height="26" rx="13" fill="#16a34a" /><text x="221" y="145" fontSize="10" fontWeight="800" fill="#fff" textAnchor="middle">Order on WhatsApp</text>
        </g>
      )}
      {kind === "study" && (
        <g>
          <rect x="20" y="18" width="150" height="100" rx="12" fill="url(#pg1)" /><defs><linearGradient id="pg1" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#60a5fa" /><stop offset="1" stopColor="#1d4ed8" /></linearGradient></defs>
          <text x="34" y="42" fontSize="9" fill="#bfdbfe" fontWeight="700">CARD 4 / 12</text><text x="34" y="68" fontSize="13" fill="#fff" fontWeight="800">Mitochondria are…</text>
          <rect x="34" y="82" width="96" height="5" rx="2.500" fill="#fff" opacity="0.35" /><rect x="34" y="94" width="70" height="5" rx="2.500" fill="#fff" opacity="0.35" />
          <circle cx="238" cy="62" r="38" className="fill-none stroke-line" strokeWidth="9" /><circle cx="238" cy="62" r="38" className="fill-none stroke-brand" strokeWidth="9" strokeDasharray="150 240" strokeLinecap="round" transform="rotate(-90 238 62)" />
          <text x="238" y="68" fontSize="16" fontWeight="800" className="fill-fg" textAnchor="middle">18:24</text>
          {[0, 1, 2, 3, 4, 5, 6].map((i) => <rect key={i} x={20 + i * 22} y="132" width="16" height="22" rx="5" className={i < 5 ? "fill-brand" : "fill-line"} />)}
          <text x="186" y="148" fontSize="10" className="fill-muted" fontWeight="700">5-day streak 🔥</text>
        </g>
      )}
      {kind === "business" && (
        <g>
          <rect x="20" y="12" width="170" height="146" rx="12" className="fill-surface stroke-line" />
          <text x="32" y="34" fontSize="11" fontWeight="800" className="fill-fg">INVOICE</text>
          {[0, 1, 2, 3].map((i) => <g key={i}><rect x="32" y={46 + i * 17} width={86 - i * 8} height="6" rx="3" className="fill-line" /><rect x="140" y={46 + i * 17} width="36" height="6" rx="3" className="fill-line" /></g>)}
          <line x1="32" y1="120" x2="178" y2="120" className="stroke-line" /><text x="32" y="142" fontSize="9" className="fill-muted">Total</text><text x="178" y="143" fontSize="14" fontWeight="800" className="fill-brand-link" textAnchor="end">€2,400</text>
          <rect x="206" y="22" width="96" height="30" rx="10" className="fill-brand" /><text x="254" y="42" fontSize="11" fontWeight="800" fill="#fff" textAnchor="middle">Download PDF</text>
          <rect x="206" y="62" width="96" height="44" rx="10" className="fill-brand-soft" /><text x="218" y="80" fontSize="9" className="fill-muted" fontWeight="700">USD · EUR · GBP</text><text x="218" y="96" fontSize="9" className="fill-muted" fontWeight="700">INR · AED · CAD</text>
          <rect x="206" y="116" width="96" height="42" rx="10" className="fill-surface stroke-line" /><text x="218" y="134" fontSize="9" fontWeight="800" className="fill-good">☁ Saved</text><text x="218" y="148" fontSize="8" className="fill-muted">Synced to account</text>
        </g>
      )}
    </svg>
  );
}
