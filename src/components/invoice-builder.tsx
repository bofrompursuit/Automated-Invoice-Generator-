"use client";

import { useState, useSyncExternalStore } from "react";
import { pdf, PDFDownloadLink } from "@react-pdf/renderer";
import { CreditCard, Download, Loader2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InvoiceForm } from "@/components/invoice-form";
import { InvoicePreview } from "@/components/invoice-preview";
import { InvoicePDF } from "@/components/invoice-pdf";
import { calcTotal, createDefaultInvoice, type InvoiceData } from "@/lib/invoice";

type StatusMessage = { type: "success" | "error"; text: string } | null;

function noopSubscribe() {
  return () => {};
}

function useIsMounted() {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}

async function blobToBase64(blob: Blob): Promise<string> {
  const buffer = await blob.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  let binary = "";
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }
  return btoa(binary);
}

export function InvoiceBuilder() {
  const [data, setData] = useState<InvoiceData>(() => createDefaultInvoice());
  const mounted = useIsMounted();
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [isCreatingCheckout, setIsCreatingCheckout] = useState(false);
  const [emailStatus, setEmailStatus] = useState<StatusMessage>(null);
  const [checkoutStatus, setCheckoutStatus] = useState<StatusMessage>(null);
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);

  async function handleSendEmail() {
    if (!data.clientEmail) {
      setEmailStatus({ type: "error", text: "Add a client email address first." });
      return;
    }
    setIsSendingEmail(true);
    setEmailStatus(null);
    try {
      const blob = await pdf(<InvoicePDF data={data} />).toBlob();
      const pdfBase64 = await blobToBase64(blob);
      const res = await fetch("/api/send-invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientEmail: data.clientEmail,
          invoiceNumber: data.invoiceNumber,
          pdfBase64,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Failed to send invoice.");
      setEmailStatus({ type: "success", text: `Invoice emailed to ${data.clientEmail}.` });
    } catch (err) {
      setEmailStatus({
        type: "error",
        text: err instanceof Error ? err.message : "Failed to send invoice.",
      });
    } finally {
      setIsSendingEmail(false);
    }
  }

  async function handleCreateCheckout() {
    setIsCreatingCheckout(true);
    setCheckoutStatus(null);
    setCheckoutUrl(null);
    try {
      const totalAmount = calcTotal(data.items, data.taxRate);
      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invoiceNumber: data.invoiceNumber, totalAmount }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Failed to create payment link.");
      setCheckoutUrl(json.url);
      setCheckoutStatus({ type: "success", text: "Payment link ready." });
    } catch (err) {
      setCheckoutStatus({
        type: "error",
        text: err instanceof Error ? err.message : "Failed to create payment link.",
      });
    } finally {
      setIsCreatingCheckout(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-3 rounded-lg border bg-card p-4">
        {mounted ? (
          <PDFDownloadLink
            document={<InvoicePDF data={data} />}
            fileName={`${data.invoiceNumber || "invoice"}.pdf`}
          >
            {({ loading }) => (
              <Button type="button" variant="default" disabled={loading}>
                {loading ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Download className="size-4" />
                )}
                Download PDF
              </Button>
            )}
          </PDFDownloadLink>
        ) : (
          <Button type="button" disabled>
            <Download className="size-4" />
            Download PDF
          </Button>
        )}

        <Button type="button" variant="outline" onClick={handleSendEmail} disabled={isSendingEmail}>
          {isSendingEmail ? <Loader2 className="size-4 animate-spin" /> : <Mail className="size-4" />}
          Email Invoice
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={handleCreateCheckout}
          disabled={isCreatingCheckout}
        >
          {isCreatingCheckout ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <CreditCard className="size-4" />
          )}
          Generate Payment Link
        </Button>

        <div className="flex flex-col gap-1 text-sm">
          {emailStatus ? (
            <span className={emailStatus.type === "error" ? "text-destructive" : "text-emerald-600"}>
              {emailStatus.text}
            </span>
          ) : null}
          {checkoutStatus ? (
            <span
              className={checkoutStatus.type === "error" ? "text-destructive" : "text-emerald-600"}
            >
              {checkoutStatus.text}{" "}
              {checkoutUrl ? (
                <a href={checkoutUrl} target="_blank" rel="noreferrer" className="underline">
                  Open payment link
                </a>
              ) : null}
            </span>
          ) : null}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <InvoiceForm data={data} onChange={setData} />
        <InvoicePreview data={data} />
      </div>
    </div>
  );
}
