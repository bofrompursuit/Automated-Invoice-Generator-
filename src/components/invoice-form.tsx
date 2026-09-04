"use client";

import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { createLineItem, type InvoiceData, type LineItem } from "@/lib/invoice";

type InvoiceFormProps = {
  data: InvoiceData;
  onChange: (data: InvoiceData) => void;
};

export function InvoiceForm({ data, onChange }: InvoiceFormProps) {
  function update<K extends keyof InvoiceData>(key: K, value: InvoiceData[K]) {
    onChange({ ...data, [key]: value });
  }

  function updateItem(id: string, patch: Partial<LineItem>) {
    onChange({
      ...data,
      items: data.items.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    });
  }

  function addItem() {
    onChange({ ...data, items: [...data.items, createLineItem()] });
  }

  function removeItem(id: string) {
    if (data.items.length === 1) return;
    onChange({ ...data, items: data.items.filter((item) => item.id !== id) });
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Invoice Details</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="invoiceNumber">Invoice Number</Label>
            <Input
              id="invoiceNumber"
              value={data.invoiceNumber}
              onChange={(e) => update("invoiceNumber", e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="invoiceDate">Invoice Date</Label>
            <Input
              id="invoiceDate"
              type="date"
              value={data.invoiceDate}
              onChange={(e) => update("invoiceDate", e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="dueDate">Due Date</Label>
            <Input
              id="dueDate"
              type="date"
              value={data.dueDate}
              onChange={(e) => update("dueDate", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>From</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="fromName">Business Name</Label>
              <Input
                id="fromName"
                value={data.fromName}
                onChange={(e) => update("fromName", e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="fromEmail">Email</Label>
              <Input
                id="fromEmail"
                type="email"
                value={data.fromEmail}
                onChange={(e) => update("fromEmail", e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="fromAddress">Address</Label>
              <Textarea
                id="fromAddress"
                rows={2}
                value={data.fromAddress}
                onChange={(e) => update("fromAddress", e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Bill To</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="clientName">Client Name</Label>
              <Input
                id="clientName"
                value={data.clientName}
                onChange={(e) => update("clientName", e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="clientEmail">Client Email</Label>
              <Input
                id="clientEmail"
                type="email"
                value={data.clientEmail}
                onChange={(e) => update("clientEmail", e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="clientAddress">Address</Label>
              <Textarea
                id="clientAddress"
                rows={2}
                value={data.clientAddress}
                onChange={(e) => update("clientAddress", e.target.value)}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Line Items</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <div className="hidden grid-cols-[1fr_5rem_7rem_2.5rem] gap-2 px-1 text-xs font-medium text-muted-foreground sm:grid">
            <span>Description</span>
            <span className="text-right">Qty</span>
            <span className="text-right">Unit Price</span>
            <span />
          </div>
          {data.items.map((item) => (
            <div
              key={item.id}
              className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_5rem_7rem_2.5rem] sm:items-center"
            >
              <Input
                placeholder="Item description"
                value={item.description}
                onChange={(e) => updateItem(item.id, { description: e.target.value })}
              />
              <Input
                type="number"
                min={0}
                step="1"
                value={item.quantity}
                onChange={(e) =>
                  updateItem(item.id, { quantity: Number(e.target.value) || 0 })
                }
                className="text-right"
              />
              <Input
                type="number"
                min={0}
                step="0.01"
                value={item.unitPrice}
                onChange={(e) =>
                  updateItem(item.id, { unitPrice: Number(e.target.value) || 0 })
                }
                className="text-right"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeItem(item.id)}
                disabled={data.items.length === 1}
                aria-label="Remove line item"
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          ))}
          <Button type="button" variant="outline" size="sm" onClick={addItem} className="self-start">
            <Plus className="size-4" />
            Add Line Item
          </Button>

          <Separator className="my-2" />

          <div className="flex items-center justify-end gap-3">
            <Label htmlFor="taxRate" className="text-sm">
              Tax Rate (%)
            </Label>
            <Input
              id="taxRate"
              type="number"
              min={0}
              step="0.01"
              value={data.taxRate}
              onChange={(e) => update("taxRate", Number(e.target.value) || 0)}
              className="w-24 text-right"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            rows={3}
            placeholder="Payment terms, thank-you note, etc."
            value={data.notes}
            onChange={(e) => update("notes", e.target.value)}
          />
        </CardContent>
      </Card>
    </div>
  );
}
