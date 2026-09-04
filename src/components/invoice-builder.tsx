"use client";

import { useState, useSyncExternalStore } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { CreditCard, Download, Loader2 } from "lucide-react";
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

export function InvoiceBuilder() {
  const [data, setData] = useState<InvoiceData>(() => createDefaultInvoice());
  const mounted = useIsMounted();
  const [isCreatingCheckout, setIsCreatingCheckout] = useState(false);
  const [checkoutStatus, setCheckoutStatus] = useState<StatusMessage>(null);
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);

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

        {checkoutStatus ? (
          <span
            className={
              (checkoutStatus.type === "error" ? "text-destructive" : "text-emerald-600") +
              " text-sm"
            }
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

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <InvoiceForm data={data} onChange={setData} />
        <InvoicePreview data={data} />
      </div>
    </div>
  );
}
