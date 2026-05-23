import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency = "IDR", locale = "id-ID"): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getSectorKey(sector: string): string {
  const s = (sector || "").toLowerCase().trim();
  if (s.includes("finance") || s.includes("perbankan") || s.includes("banking")) return "perbankan";
  if (s.includes("tech") || s.includes("teknologi")) return "teknologi";
  if (s.includes("energy") || s.includes("energi")) return "energi";
  if (s.includes("consumer") || s.includes("konsumsi")) return "consumer";
  if (s.includes("tele") || s.includes("komunikasi")) return "telekomunikasi";
  if (s.includes("health") || s.includes("sehat") || s.includes("kesehatan")) return "kesehatan";
  if (s.includes("prop") || s.includes("real") || s.includes("properti")) return "properti";
  if (s.includes("indus") || s.includes("industri")) return "industri";
  if (s.includes("beragam") || s.includes("diversi") || s.includes("various")) return "beragam";
  return "lainnya";
}
