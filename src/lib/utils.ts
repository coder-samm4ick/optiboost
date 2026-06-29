import type { AppFile } from "@/types";

export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / k ** i).toFixed(decimals))} ${sizes[i]}`;
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatNumber(num: number): string {
  return num.toLocaleString("ru-RU");
}

export function getFileExtension(name: string): string {
  return name.split(".").pop()?.toLowerCase() || "";
}

export function getFileIconClass(file: AppFile): string {
  const ext = getFileExtension(file.name);
  if (["exe", "msi"].includes(ext)) return "windows";
  if (["dmg", "pkg"].includes(ext)) return "apple";
  if (["zip", "rar", "7z", "tar", "gz"].includes(ext)) return "archive";
  if (["apk"].includes(ext)) return "smartphone";
  return "file";
}

export function generateId(): string {
  return crypto.randomUUID();
}
