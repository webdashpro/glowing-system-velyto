"use client";
import { useEffect, useState } from "react";
import { Icon } from "./Icon";
import { Logo } from "./Header";

type BIPEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> };

export default function PwaClient() {
  const [evt, setEvt] = useState<BIPEvent | null>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
    let dismissed = false;
    try {
      dismissed = localStorage.getItem("velyto-install-dismissed") === "1";
    } catch {
      /* ignore */
    }
    const standalone = window.matchMedia("(display-mode: standalone)").matches;
    if (dismissed || standalone) return;
    const onBip = (e: Event) => {
      e.preventDefault();
      setEvt(e as BIPEvent);
      setShow(true);
    };
    window.addEventListener("beforeinstallprompt", onBip);
    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent);
    const t = ios ? setTimeout(() => setShow(true), 12000) : undefined;
    return () => {
      window.removeEventListener("beforeinstallprompt", onBip);
      if (t) clearTimeout(t);
    };
  }, []);

  if (!show) return null;
  const dismiss = () => {
    setShow(false);
    try {
      localStorage.setItem("velyto-install-dismissed", "1");
    } catch {
      /* ignore */
    }
  };
  return (
    <div role="region" aria-label="Install Velyto" className="no-print fixed inset-x-3 bottom-3 z-50 mx-auto flex max-w-md items-center gap-3 rounded-2xl border border-line bg-surface p-3 pr-2 shadow-pop">
      <Logo className="h-10 w-10 flex-none" />
      <div className="min-w-0 flex-1 text-sm">
        <p className="font-bold">Install Velyto App · Works Offline</p>
        <p className="text-xs text-muted">{evt ? "Add to your home screen for instant access." : "Tap Share, then “Add to Home Screen”."}</p>
      </div>
      {evt && (
        <button
          className="btn btn-primary btn-sm"
          onClick={async () => {
            await evt.prompt();
            await evt.userChoice.catch(() => null);
            dismiss();
          }}
        >
          Install
        </button>
      )}
      <button className="btn btn-ghost btn-sm" onClick={dismiss} aria-label="Dismiss install banner">
        <Icon name="x" className="h-4 w-4" />
      </button>
    </div>
  );
}
