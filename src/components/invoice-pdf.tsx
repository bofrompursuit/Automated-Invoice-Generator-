"use client";

import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import {
  calcSubtotal,
  calcTax,
  calcTotal,
  formatCurrency,
  formatDate,
  type InvoiceData,
} from "@/lib/invoice";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: "Helvetica",
    color: "#18181b",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontFamily: "Helvetica-Bold",
  },
  metaLabel: {
    color: "#71717a",
    fontSize: 9,
  },
  metaValue: {
    marginBottom: 6,
  },
  partiesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  partyBlock: {
    width: "45%",
  },
  partyLabel: {
    color: "#71717a",
    fontSize: 9,
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  partyName: {
    fontFamily: "Helvetica-Bold",
    fontSize: 11,
    marginBottom: 2,
  },
  table: {
    marginTop: 8,
  },
  tableHeaderRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#18181b",
    paddingBottom: 6,
    marginBottom: 6,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e4e4e7",
    paddingVertical: 6,
  },
  colDescription: { width: "50%" },
  colQty: { width: "15%", textAlign: "right" },
  colUnitPrice: { width: "17.5%", textAlign: "right" },
  colAmount: { width: "17.5%", textAlign: "right" },
  headerText: {
    fontFamily: "Helvetica-Bold",
    fontSize: 9,
    textTransform: "uppercase",
    color: "#71717a",
    letterSpacing: 0.5,
  },
  totalsBlock: {
    marginTop: 16,
    alignItems: "flex-end",
  },
  totalsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 200,
    paddingVertical: 3,
  },
  totalsLabel: {
    color: "#71717a",
  },
  grandTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 200,
    paddingTop: 8,
    marginTop: 4,
    borderTopWidth: 1,
    borderTopColor: "#18181b",
  },
  grandTotalLabel: {
    fontFamily: "Helvetica-Bold",
    fontSize: 12,
  },
  grandTotalValue: {
    fontFamily: "Helvetica-Bold",
    fontSize: 12,
  },
  notes: {
    marginTop: 32,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#e4e4e7",
    color: "#52525b",
  },
});

export function InvoicePDF({ data }: { data: InvoiceData }) {
  const subtotal = calcSubtotal(data.items);
  const tax = calcTax(subtotal, data.taxRate);
  const total = calcTotal(data.items, data.taxRate);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>INVOICE</Text>
          <View>
            <Text style={styles.metaLabel}>Invoice Number</Text>
            <Text style={styles.metaValue}>{data.invoiceNumber}</Text>
            <Text style={styles.metaLabel}>Invoice Date</Text>
            <Text style={styles.metaValue}>{formatDate(data.invoiceDate)}</Text>
            <Text style={styles.metaLabel}>Due Date</Text>
            <Text>{formatDate(data.dueDate)}</Text>
          </View>
        </View>

        <View style={styles.partiesRow}>
          <View style={styles.partyBlock}>
            <Text style={styles.partyLabel}>From</Text>
            <Text style={styles.partyName}>{data.fromName || "Your Business Name"}</Text>
            <Text>{data.fromEmail}</Text>
            <Text>{data.fromAddress}</Text>
          </View>
          <View style={styles.partyBlock}>
            <Text style={styles.partyLabel}>Bill To</Text>
            <Text style={styles.partyName}>{data.clientName || "Client Name"}</Text>
            <Text>{data.clientEmail}</Text>
            <Text>{data.clientAddress}</Text>
          </View>
        </View>

        <View style={styles.table}>
          <View style={styles.tableHeaderRow}>
            <Text style={[styles.colDescription, styles.headerText]}>Description</Text>
            <Text style={[styles.colQty, styles.headerText]}>Qty</Text>
            <Text style={[styles.colUnitPrice, styles.headerText]}>Unit Price</Text>
            <Text style={[styles.colAmount, styles.headerText]}>Amount</Text>
          </View>
          {data.items.map((item) => (
            <View style={styles.tableRow} key={item.id}>
              <Text style={styles.colDescription}>{item.description || "—"}</Text>
              <Text style={styles.colQty}>{item.quantity}</Text>
              <Text style={styles.colUnitPrice}>{formatCurrency(item.unitPrice)}</Text>
              <Text style={styles.colAmount}>
                {formatCurrency(item.quantity * item.unitPrice)}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.totalsBlock}>
          <View style={styles.totalsRow}>
            <Text style={styles.totalsLabel}>Subtotal</Text>
            <Text>{formatCurrency(subtotal)}</Text>
          </View>
          <View style={styles.totalsRow}>
            <Text style={styles.totalsLabel}>Tax ({data.taxRate}%)</Text>
            <Text>{formatCurrency(tax)}</Text>
          </View>
          <View style={styles.grandTotalRow}>
            <Text style={styles.grandTotalLabel}>Total</Text>
            <Text style={styles.grandTotalValue}>{formatCurrency(total)}</Text>
          </View>
        </View>

        {data.notes ? (
          <View style={styles.notes}>
            <Text>{data.notes}</Text>
          </View>
        ) : null}
      </Page>
    </Document>
  );
}
