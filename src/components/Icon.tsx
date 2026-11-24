import type { ReactNode } from "react";

export type IconName =
  | "image" | "compress" | "crop" | "stamp" | "filepdf" | "merge" | "split" | "calc" | "percent" | "graduation"
  | "ruler" | "calendar" | "heart" | "qr" | "key" | "speaker" | "timer" | "check" | "braces" | "lock" | "shield"
  | "regex" | "markdown" | "diff" | "minify" | "table" | "type" | "case" | "palette" | "video" | "film" | "convert"
  | "mic" | "store" | "book" | "briefcase" | "search" | "sun" | "moon" | "menu" | "star" | "arrow" | "download"
  | "upload" | "chat" | "globe" | "zap" | "user" | "trash" | "plus" | "x" | "checkcircle" | "bank" | "receipt"
  | "clock" | "file" | "camera" | "id" | "gst" | "offline" | "free" | "users" | "pen" | "up" | "down" | "link"
  | "copy" | "print" | "play" | "pause" | "layers" | "chart";

const P: Record<IconName, ReactNode> = {
  image: <><rect x="3" y="4" width="18" height="16" rx="3" /><circle cx="9" cy="10" r="1.6" /><path d="m21 16-5-5-9 9" /></>,
  compress: <path d="M4 14h6v6M20 10h-6V4M14 10l7-7M3 21l7-7" />,
  crop: <path d="M6 2v14a2 2 0 0 0 2 2h14M18 22V8a2 2 0 0 0-2-2H2" />,
  stamp: <><path d="M5 21h14M6 17h12v-2a4 4 0 0 0-3-3.9V9a3 3 0 1 0-6 0v2.1A4 4 0 0 0 6 15z" /></>,
  filepdf: <><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" /><path d="M14 3v5h5M9 14h6M9 17h4" /></>,
  merge: <><circle cx="6" cy="6" r="2" /><circle cx="6" cy="18" r="2" /><circle cx="18" cy="12" r="2" /><path d="M6 8v8M8 6c6 0 8 2 8 6M8 18c6 0 8-2 8-6" /></>,
  split: <><circle cx="12" cy="5" r="2" /><circle cx="6" cy="19" r="2" /><circle cx="18" cy="19" r="2" /><path d="M12 7v4c0 3-6 3-6 6M12 11c0 3 6 3 6 6" /></>,
  calc: <><rect x="5" y="3" width="14" height="18" rx="2" /><path d="M8 7h8M8 12h2M14 12h2M8 16h2M14 16h2" /></>,
  percent: <><path d="M19 5 5 19" /><circle cx="7" cy="7" r="2.2" /><circle cx="17" cy="17" r="2.2" /></>,
  graduation: <><path d="m2 9 10-5 10 5-10 5z" /><path d="M6 11v5c0 1.5 3 3 6 3s6-1.500 6-3v-5" /></>,
  ruler: <><rect x="2" y="8" width="20" height="8" rx="1.500" /><path d="M6 8v3M10 8v4M14 8v3M18 8v4" /></>,
  calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M8 3v4M16 3v4M3 10h18" /></>,
  heart: <path d="M12 20s-7-4.500-7-10a4 4 0 0 1 7-2.500A4 4 0 0 1 19 10c0 5.500-7 10-7 10z" />,
  qr: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><path d="M14 14h3v3h-3zM20 14v1M14 20h1M18 18h3v3" /></>,
  key: <><circle cx="8" cy="15" r="4" /><path d="m11 12 9-9M16 7l3 3" /></>,
  speaker: <><path d="M4 9v6h4l5 4V5L8 9z" /><path d="M16 9a4 4 0 0 1 0 6M19 6a8 8 0 0 1 0 12" /></>,
  timer: <><circle cx="12" cy="13" r="8" /><path d="M12 9v4l2 2M9 2h6" /></>,
  check: <><rect x="3" y="3" width="18" height="18" rx="4" /><path d="m8 12 3 3 5-6" /></>,
  braces: <path d="M8 3H7a2 2 0 0 0-2 2v4a2 2 0 0 1-2 2 2 2 0 0 1 2 2v4a2 2 0 0 0 2 2h1M16 3h1a2 2 0 0 1 2 2v4a2 2 0 0 0 2 2 2 2 0 0 0-2 2v4a2 2 0 0 1-2 2h-1" />,
  lock: <><rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></>,
  shield: <><path d="M12 3 5 6v5c0 5 3 8 7 10 4-2 7-5 7-10V6z" /><path d="m9 12 2 2 4-4" /></>,
  regex: <path d="M12 4v10M7.500 6.500l9 5M16.500 6.500l-9 5M6 20h.01" />,
  markdown: <><rect x="2" y="5" width="20" height="14" rx="2" /><path d="M6 15V9l3 3 3-3v6M17 9v6m-2-2 2 2 2-2" /></>,
  diff: <><path d="M8 3v12M4 7l4-4 4 4M16 21V9M12 17l4 4 4-4" /></>,
  minify: <path d="M4 8h16M4 12h10M4 16h16M18 11l3 1-3 1" />,
  table: <><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M3 10h18M3 15h18M9 4v16" /></>,
  type: <path d="M5 6V4h14v2M12 4v16M9 20h6" />,
  case: <><path d="M3 18 8 6l5 12M5 14h6M15 18v-6a3 3 0 0 1 6 0v6M15 15h6" /></>,
  palette: <><path d="M12 3a9 9 0 1 0 0 18c1.500 0 2-1 1.500-2s0-2 1.500-2h2a4 4 0 0 0 4-4c0-5-4-10-9-10z" /><circle cx="7.500" cy="11" r="1" /><circle cx="11" cy="7" r="1" /><circle cx="16" cy="8" r="1" /></>,
  video: <><rect x="3" y="6" width="13" height="12" rx="2" /><path d="m16 10 5-3v10l-5-3" /></>,
  film: <><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M7 4v16M17 4v16M3 9h4M3 15h4M17 9h4M17 15h4" /></>,
  convert: <path d="M4 12a8 8 0 0 1 14-5l2 2M20 4v5h-5M20 12a8 8 0 0 1-14 5l-2-2M4 20v-5h5" />,
  mic: <><rect x="9" y="3" width="6" height="12" rx="3" /><path d="M5 11a7 7 0 0 0 14 0M12 18v3" /></>,
  store: <><path d="M4 9 5.500 4h13L20 9M4 9a2.500 2.500 0 0 0 5 0 2.500 2.500 0 0 0 5 0 2.500 2.500 0 0 0 5 0 2.500 2.500 0 0 0 1 0M5 11v9h14v-9M10 20v-5h4v5" /></>,
  book: <><path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z" /><path d="M4 19V5M8 7h7" /></>,
  briefcase: <><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M3 13h18" /></>,
  search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
  sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.900 4.900l1.400 1.400M17.700 17.700l1.400 1.400M2 12h2M20 12h2M4.900 19.100l1.400-1.400M17.700 6.300l1.400-1.400" /></>,
  moon: <path d="M20 14.500A8 8 0 0 1 9.500 4a8 8 0 1 0 10.500 10.500z" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  star: <path d="m12 3 2.700 5.600 6.100.9-4.400 4.300 1 6.100L12 17l-5.400 2.900 1-6.100L3.200 9.500l6.100-.9z" />,
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  download: <path d="M12 4v11M7 11l5 5 5-5M5 20h14" />,
  upload: <path d="M12 16V5M7 9l5-5 5 5M5 20h14" />,
  chat: <path d="M4 5h16v11H9l-5 4z" />,
  globe: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" /></>,
  zap: <path d="M13 2 4 14h7l-1 8 9-12h-7z" />,
  user: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
  trash: <path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" />,
  plus: <path d="M12 5v14M5 12h14" />,
  x: <path d="M6 6l12 12M18 6 6 18" />,
  checkcircle: <><circle cx="12" cy="12" r="9" /><path d="m8 12 3 3 5-6" /></>,
  bank: <path d="M3 10 12 4l9 6M5 10v8M9 10v8M15 10v8M19 10v8M3 21h18" />,
  receipt: <><path d="M6 3h12v18l-3-2-3 2-3-2-3 2z" /><path d="M9 8h6M9 12h6" /></>,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  file: <><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" /><path d="M14 3v5h5M9 13h6M9 17h6" /></>,
  camera: <><path d="M4 8h3l2-3h6l2 3h3v12H4z" /><circle cx="12" cy="13" r="3.500" /></>,
  id: <><rect x="3" y="5" width="18" height="14" rx="2" /><circle cx="9" cy="11" r="2" /><path d="M6 16c0-2 6-2 6 0M15 10h3M15 14h3" /></>,
  gst: <><rect x="4" y="3" width="16" height="18" rx="2" /><path d="M8 8h8M9 14l6-3M9 12h.01M15 15h.01" /></>,
  offline: <path d="M4 14a8 8 0 0 1 16 0M8 17a5 5 0 0 1 8 0M12 20h.01M3 3l18 18" />,
  free: <><circle cx="12" cy="12" r="9" /><path d="M9 15V9h5M9 12h4" /></>,
  users: <><circle cx="9" cy="8" r="3.500" /><path d="M2 20a7 7 0 0 1 14 0M17 5a3.500 3.500 0 0 1 0 7M22 20a6 6 0 0 0-4-5.500" /></>,
  pen: <path d="M4 20h4L19 9l-4-4L4 16zM14 6l4 4" />,
  up: <path d="m6 15 6-6 6 6" />,
  down: <path d="m6 9 6 6 6-6" />,
  link: <path d="M10 14a4 4 0 0 0 5.700 0l3-3a4 4 0 0 0-5.700-5.700l-1 1M14 10a4 4 0 0 0-5.700 0l-3 3A4 4 0 0 0 11 18.700l1-1" />,
  copy: <><rect x="8" y="8" width="12" height="12" rx="2" /><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" /></>,
  print: <><path d="M7 9V3h10v6M7 17H5a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2" /><rect x="7" y="14" width="10" height="7" /></>,
  play: <path d="M7 4v16l13-8z" />,
  pause: <path d="M8 4v16M16 4v16" />,
  layers: <path d="m12 3 9 5-9 5-9-5zM3 13l9 5 9-5" />,
  chart: <path d="M4 20V4M4 20h16M8 16v-5M12 16V8M16 16v-3" />,
};

export function Icon({ name, className = "h-5 w-5", strokeWidth = 1.75 }: { name: IconName; className?: string; strokeWidth?: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {P[name]}
    </svg>
  );
}
