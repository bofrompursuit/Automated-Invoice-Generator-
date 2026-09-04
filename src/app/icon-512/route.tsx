import { ImageResponse } from "next/og";
import { InvoiceIconMark } from "@/lib/app-icon";

export async function GET() {
  return new ImageResponse(<InvoiceIconMark size={512} />, { width: 512, height: 512 });
}
