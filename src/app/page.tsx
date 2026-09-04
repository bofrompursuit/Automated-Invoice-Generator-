import { InvoiceBuilder } from "@/components/invoice-builder";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-muted/30">
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight">Invoice Generator</h1>
          <p className="text-muted-foreground">
            Fill in the details, preview the invoice live, then export, email, or request payment.
          </p>
        </div>
        <InvoiceBuilder />
      </main>
    </div>
  );
}
