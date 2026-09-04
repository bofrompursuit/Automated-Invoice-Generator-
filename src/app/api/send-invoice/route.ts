import { NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "RESEND_API_KEY is not configured on the server." },
      { status: 500 },
    );
  }

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

  const resend = new Resend(apiKey);
  const fromAddress = process.env.INVOICE_FROM_EMAIL ?? "invoices@resend.dev";

  const { data, error } = await resend.emails.send({
    from: fromAddress,
    to: clientEmail,
    subject: `Invoice ${invoiceNumber}`,
    text: `Please find attached invoice ${invoiceNumber}.`,
    attachments: [
      {
        filename: `${invoiceNumber}.pdf`,
        content: pdfBase64,
      },
    ],
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 502 });
  }

  return NextResponse.json({ id: data?.id });
}
