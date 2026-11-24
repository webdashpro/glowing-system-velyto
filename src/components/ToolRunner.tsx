"use client";
import dynamic from "next/dynamic";
import { useEffect, type ComponentType } from "react";
import { recordUse } from "@/lib/client";
import type { ExamTarget } from "@/data/exams";

type P = { targets?: ExamTarget[]; examName?: string };

const Sk = () => <div className="card h-72 animate-pulse bg-soft" aria-hidden="true" />;

const MAP: Record<string, ComponentType<P>> = {
  "image-compressor": dynamic(() => import("./tools/imagepdf").then((m) => m.ImageCompressor), { loading: Sk }),
  "exam-photo-resizer": dynamic(() => import("./tools/imagepdf").then((m) => m.ExamResizer), { loading: Sk }) as ComponentType<P>,
  "image-cropper": dynamic(() => import("./tools/imagepdf").then((m) => m.ImageCropper), { loading: Sk }),
  "image-watermark": dynamic(() => import("./tools/imagepdf").then((m) => m.ImageWatermark), { loading: Sk }),
  "image-to-pdf": dynamic(() => import("./tools/imagepdf").then((m) => m.ImageToPdf), { loading: Sk }),
  "merge-pdf": dynamic(() => import("./tools/imagepdf").then((m) => m.MergePdf), { loading: Sk }),
  "split-pdf": dynamic(() => import("./tools/imagepdf").then((m) => m.SplitPdf), { loading: Sk }),
  "gst-calculator": dynamic(() => import("./tools/calc").then((m) => m.GstCalculator), { loading: Sk }),
  "emi-calculator": dynamic(() => import("./tools/calc").then((m) => m.EmiCalculator), { loading: Sk }),
  "cgpa-to-percentage": dynamic(() => import("./tools/calc").then((m) => m.CgpaConverter), { loading: Sk }),
  "percentage-calculator": dynamic(() => import("./tools/calc").then((m) => m.PercentageCalculator), { loading: Sk }),
  "unit-converter": dynamic(() => import("./tools/calc").then((m) => m.UnitConverter), { loading: Sk }),
  "age-calculator": dynamic(() => import("./tools/calc").then((m) => m.AgeCalculator), { loading: Sk }),
  "bmi-calculator": dynamic(() => import("./tools/calc").then((m) => m.BmiCalculator), { loading: Sk }),
  "qr-code-generator": dynamic(() => import("./tools/calc").then((m) => m.QrGenerator), { loading: Sk }),
  "password-generator": dynamic(() => import("./tools/calc").then((m) => m.PasswordGenerator), { loading: Sk }),
  "text-to-speech": dynamic(() => import("./tools/calc").then((m) => m.TextToSpeech), { loading: Sk }),
  stopwatch: dynamic(() => import("./tools/calc").then((m) => m.Stopwatch), { loading: Sk }),
  "todo-list": dynamic(() => import("./tools/calc").then((m) => m.TodoList), { loading: Sk }),
  "json-formatter": dynamic(() => import("./tools/dev").then((m) => m.JsonFormatter), { loading: Sk }),
  "base64-encoder-decoder": dynamic(() => import("./tools/dev").then((m) => m.Base64Tool), { loading: Sk }),
  "jwt-decoder": dynamic(() => import("./tools/dev").then((m) => m.JwtDecoder), { loading: Sk }),
  "regex-tester": dynamic(() => import("./tools/dev").then((m) => m.RegexTester), { loading: Sk }),
  "markdown-preview": dynamic(() => import("./tools/dev").then((m) => m.MarkdownPreview), { loading: Sk }),
  "diff-checker": dynamic(() => import("./tools/dev").then((m) => m.DiffChecker), { loading: Sk }),
  "css-html-minifier": dynamic(() => import("./tools/dev").then((m) => m.Minifier), { loading: Sk }),
  "csv-viewer": dynamic(() => import("./tools/dev").then((m) => m.CsvViewer), { loading: Sk }),
  "text-analyzer": dynamic(() => import("./tools/dev").then((m) => m.TextAnalyzer), { loading: Sk }),
  "case-converter": dynamic(() => import("./tools/dev").then((m) => m.CaseConverter), { loading: Sk }),
  "color-converter": dynamic(() => import("./tools/dev").then((m) => m.ColorConverter), { loading: Sk }),
  "video-to-image": dynamic(() => import("./tools/media").then((m) => m.VideoToImage), { loading: Sk }),
  "image-to-video": dynamic(() => import("./tools/media").then((m) => m.ImageToVideo), { loading: Sk }),
  "image-converter": dynamic(() => import("./tools/media").then((m) => m.ImageConverter), { loading: Sk }),
  "audio-recorder": dynamic(() => import("./tools/media").then((m) => m.AudioRecorder), { loading: Sk }),
};

export default function ToolRunner({ slug, targets, examName }: { slug: string; targets?: ExamTarget[]; examName?: string }) {
  useEffect(() => recordUse(slug), [slug]);
  const C = MAP[slug];
  if (!C) return null;
  return <C targets={targets} examName={examName} />;
}
