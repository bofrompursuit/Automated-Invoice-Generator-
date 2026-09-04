import { NextResponse } from "next/server";
import { sendMailViaGraph } from "@/lib/microsoft-graph";

export async function POST(request: Request) {
  const body = await request.json();
  const { clientEmail, invoiceNumber, pdfBase64 } = body as {
    clientEmail?: string;
    invoiceNumber?: string;
    pdfBase64?: string;
  };

  if (!clientEmail || !invoiceNumber || !pdfBase64) {
    return NextResponse.json(
      { error: "clientEmail, invoiceNumber, and pdfBase64 are required." },
      { status: 400 },
    );
  }

  try {
    await sendMailViaGraph({
      to: clientEmail,
      subject: `Invoice ${invoiceNumber}`,
      text: `Please find attached invoice ${invoiceNumber}.`,
      attachment: { filename: `${invoiceNumber}.pdf`, contentBase64: pdfBase64 },
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to send invoice." },
      { status: 502 },
    );
  }
}
