import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')     // Replace spaces with -
    .replace(/[^\w-]+/g, '')  // Remove all non-word chars
    .replace(/--+/g, '-')     // Replace multiple - with single -
    .replace(/^-+/, '')       // Trim - from start of text
    .replace(/-+$/, '');      // Trim - from end of text
}

export function getOptimizedImageUrl(
  url?: string | null,
  options: { width?: number; height?: number; quality?: string | number } = {}
): string {
  if (!url) return "/icon.png";
  if (!url.includes("res.cloudinary.com")) return url;
  if (url.includes("/upload/f_auto") || url.includes("/upload/q_auto")) return url;

  const { width = 600, height, quality = "auto" } = options;
  const transforms = [`f_auto`, `q_${quality}`];

  if (width) transforms.push(`w_${width}`);
  if (height) transforms.push(`h_${height}`, `c_fill`);

  const transformString = transforms.join(",");
  return url.replace("/upload/", `/upload/${transformString}/`);
}
