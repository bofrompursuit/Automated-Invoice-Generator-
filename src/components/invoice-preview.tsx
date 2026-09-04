import { Card, CardContent } from "@/components/ui/card";
import {
  calcSubtotal,
  calcTax,
  calcTotal,
  formatCurrency,
  formatDate,
  type InvoiceData,
} from "@/lib/invoice";

export function InvoicePreview({ data }: { data: InvoiceData }) {
  const subtotal = calcSubtotal(data.items);
  const tax = calcTax(subtotal, data.taxRate);
  const total = calcTotal(data.items, data.taxRate);

  return (
    <Card className="sticky top-6">
      <CardContent className="p-8 text-sm">
        <div className="flex items-start justify-between">
          <h2 className="text-2xl font-semibold tracking-tight">Invoice</h2>
          <div className="text-right text-muted-foreground">
            <p className="text-xs uppercase tracking-wide">Invoice Number</p>
            <p className="mb-2 font-medium text-foreground">{data.invoiceNumber || "—"}</p>
            <p className="text-xs uppercase tracking-wide">Invoice Date</p>
            <p className="mb-2 font-medium text-foreground">{formatDate(data.invoiceDate)}</p>
            <p className="text-xs uppercase tracking-wide">Due Date</p>
            <p className="font-medium text-foreground">{formatDate(data.dueDate)}</p>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-6">
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">From</p>
            <p className="mt-1 font-medium">{data.fromName || "Your Business Name"}</p>
            <p className="text-muted-foreground">{data.fromEmail}</p>
            <p className="whitespace-pre-line text-muted-foreground">{data.fromAddress}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Bill To</p>
            <p className="mt-1 font-medium">{data.clientName || "Client Name"}</p>
            <p className="text-muted-foreground">{data.clientEmail}</p>
            <p className="whitespace-pre-line text-muted-foreground">{data.clientAddress}</p>
          </div>
        </div>

        <div className="mt-8">
          <div className="grid grid-cols-[1fr_3rem_5rem_5rem] gap-2 border-b pb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            <span>Description</span>
            <span className="text-right">Qty</span>
            <span className="text-right">Price</span>
            <span className="text-right">Amount</span>
          </div>
          {data.items.map((item) => (
            <div
              key={item.id}
              className="grid grid-cols-[1fr_3rem_5rem_5rem] gap-2 border-b py-2 last:border-b-0"
            >
              <span className="truncate">{item.description || "—"}</span>
              <span className="text-right">{item.quantity}</span>
              <span className="text-right">{formatCurrency(item.unitPrice)}</span>
              <span className="text-right font-medium">
                {formatCurrency(item.quantity * item.unitPrice)}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end">
          <div className="w-56 space-y-1.5">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Tax ({data.taxRate}%)</span>
              <span>{formatCurrency(tax)}</span>
            </div>
            <div className="flex justify-between border-t pt-2 text-base font-semibold">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>
        </div>

        {data.notes ? (
          <div className="mt-8 border-t pt-4 text-muted-foreground whitespace-pre-line">
            {data.notes}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
