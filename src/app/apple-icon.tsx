import { ImageResponse } from "next/og";
import { InvoiceIconMark } from "@/lib/app-icon";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  // iOS applies its own corner-rounding mask to home-screen icons, so this
  // one is deliberately a full-bleed square, unlike icon.tsx.
  return new ImageResponse(<InvoiceIconMark size={180} rounded={false} />, size);
}
