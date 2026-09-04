export type LineItem = {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
};

export type InvoiceData = {
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  fromName: string;
  fromEmail: string;
  fromAddress: string;
  clientName: string;
  clientEmail: string;
  clientAddress: string;
  items: LineItem[];
  taxRate: number;
  notes: string;
};

export function createLineItem(): LineItem {
  return {
    id: crypto.randomUUID(),
    description: "",
    quantity: 1,
    unitPrice: 0,
  };
}

export function createDefaultInvoice(): InvoiceData {
  const today = new Date();
  const due = new Date(today);
  due.setDate(due.getDate() + 14);

  return {
    invoiceNumber: `INV-${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, "0")}-001`,
    invoiceDate: today.toISOString().slice(0, 10),
    dueDate: due.toISOString().slice(0, 10),
    fromName: "",
    fromEmail: "",
    fromAddress: "",
    clientName: "",
    clientEmail: "",
    clientAddress: "",
    items: [createLineItem()],
    taxRate: 0,
    notes: "",
  };
}

export function calcSubtotal(items: LineItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
}

export function calcTax(subtotal: number, taxRate: number): number {
  return subtotal * (taxRate / 100);
}

export function calcTotal(items: LineItem[], taxRate: number): number {
  const subtotal = calcSubtotal(items);
  return subtotal + calcTax(subtotal, taxRate);
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  const date = new Date(`${dateStr}T00:00:00`);
  if (Number.isNaN(date.getTime())) return dateStr;
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}
