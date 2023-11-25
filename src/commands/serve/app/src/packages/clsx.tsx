import clsxLib from "clsx";
import { twMerge } from "tailwind-merge";

export default function clsx(...args: Parameters<typeof clsxLib>): string {
  return twMerge(clsxLib(...args));
}
