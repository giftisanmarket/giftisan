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
    .replace(/\s+/g, '-')                     // Replace spaces with -
    .replace(/[^\w\u0600-\u06FF-]+/g, '')    // Preserve ASCII & Arabic characters
    .replace(/--+/g, '-')                     // Replace multiple - with single -
    .replace(/^-+/, '')                       // Trim - from start
    .replace(/-+$/, '');                      // Trim - from end
}

export function getOptimizedImageUrl(
  url?: string | null,
  options: { width?: number; height?: number; quality?: string | number; crop?: string } = {}
): string {
  if (!url || typeof url !== "string") return "/icon.png";
  if (!url.includes("res.cloudinary.com")) return url;

  const { width, height, quality = "auto", crop } = options;
  const transforms: string[] = ["f_auto", `q_${quality}`];

  if (width) transforms.push(`w_${Math.round(width)}`);
  if (height) transforms.push(`h_${Math.round(height)}`);
  if (crop) {
    transforms.push(`c_${crop}`);
  } else if (width && height) {
    transforms.push("c_fill");
  } else if (width || height) {
    transforms.push("c_limit");
  }

  const transformString = transforms.join(",");

  // Matches /image/upload/ followed by an optional existing transformation block (e.g. f_auto,q_auto,w_600/)
  const match = url.match(/\/image\/upload\/(?:(?:[a-z]_[^/]+,?[^/]*)\/)?/i);
  if (match) {
    return url.replace(match[0], `/image/upload/${transformString}/`);
  }

  return url.replace("/upload/", `/upload/${transformString}/`);
}
