const asyncHandler = require("express-async-handler");
const PDFDocument = require("pdfkit");
const QRCode = require("qrcode");
const Transaction = require("../models/transactionModel");

const formatDate = (date) =>
  new Date(date || Date.now()).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

const formatAmount = (transaction) =>
  `${transaction.currency || "USD"} ${Number(transaction.amount || 0).toFixed(2)}`;

const canAccessTransaction = (transaction, user) =>
  user?.role === "admin" || transaction.user?._id?.equals(user?._id);

const loadTransaction = async (id) =>
  Transaction.findById(id).populate("user", "name email phone").lean(false);

const getVerificationUrl = (req, transaction) =>
  `${req.protocol}://${req.get("host")}/api/transactions/${transaction._id}/verify`;

const drawKeyValue = (doc, label, value, x, y, width = 230) => {
  doc.fillColor("#6B7280").fontSize(8).text(label.toUpperCase(), x, y, { width });
  doc.fillColor("#111827").fontSize(10).text(value || "-", x, y + 14, { width });
};

const drawPaymentDocument = async ({ req, res, transaction, type }) => {
  const isInvoice = type === "invoice";
  const documentNumber = isInvoice
    ? transaction.invoiceNumber || `INV-${transaction._id.toString().slice(-8).toUpperCase()}`
    : transaction.receiptNumber || `RCPT-${transaction._id.toString().slice(-8).toUpperCase()}`;
  const title = isInvoice ? "Beautyhub Invoice" : "Beautyhub Receipt";
  const filePrefix = isInvoice ? "invoice" : "receipt";
  const verifyUrl = getVerificationUrl(req, transaction);
  const qrData = await QRCode.toDataURL(verifyUrl, {
    margin: 1,
    color: { dark: "#111827", light: "#FFFFFF" },
  });
  const qrBuffer = Buffer.from(qrData.split(",")[1], "base64");

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="${filePrefix}-${documentNumber}.pdf"`
  );

  const doc = new PDFDocument({ size: "A4", margin: 48 });
  doc.pipe(res);

  doc.rect(0, 0, doc.page.width, 116).fill("#4C1D95");
  doc.fillColor("#FFFFFF").fontSize(24).text(title, 48, 38);
  doc.fontSize(10).fillColor("#E9D5FF").text("Receipt and invoice management", 48, 70);
  doc.fillColor("#FFFFFF").fontSize(10).text(documentNumber, 380, 42, {
    width: 160,
    align: "right",
  });

  doc.fillColor("#111827").fontSize(14).text("Payment Record", 48, 148);
  doc.moveTo(48, 170).lineTo(547, 170).strokeColor("#E5E7EB").stroke();

  drawKeyValue(doc, isInvoice ? "Invoice No." : "Receipt No.", documentNumber, 48, 190);
  drawKeyValue(doc, "Transaction Ref.", transaction.transactionId, 300, 190);
  drawKeyValue(doc, "Date", formatDate(transaction.createdAt), 48, 245);
  drawKeyValue(doc, "Status", transaction.status || "PENDING", 300, 245);
  drawKeyValue(doc, "Gateway", transaction.gateway || "swychr", 48, 300);
  drawKeyValue(doc, "Type", transaction.type || "PAYMENT", 300, 300);

  doc.fillColor("#111827").fontSize(14).text("Customer", 48, 372);
  doc.moveTo(48, 394).lineTo(547, 394).strokeColor("#E5E7EB").stroke();
  drawKeyValue(doc, "Name", transaction.customerName || transaction.user?.name || "Customer", 48, 414);
  drawKeyValue(doc, "Email", transaction.customerEmail || transaction.user?.email, 300, 414);
  drawKeyValue(doc, "Phone", transaction.customerPhone || transaction.user?.phone, 48, 469);

  doc.fillColor("#111827").fontSize(14).text("Summary", 48, 542);
  doc.moveTo(48, 564).lineTo(547, 564).strokeColor("#E5E7EB").stroke();
  doc.fillColor("#6B7280").fontSize(9).text("Description", 48, 586);
  doc.fillColor("#111827").fontSize(11).text(transaction.description || "Beautyhub payment", 48, 604, {
    width: 300,
  });

  doc.roundedRect(380, 584, 167, 72, 12).fill("#F5F3FF");
  doc.fillColor("#6D28D9").fontSize(9).text("Total Amount", 400, 604);
  doc.fillColor("#111827").fontSize(18).text(formatAmount(transaction), 400, 624);

  doc.fillColor("#111827").fontSize(14).text("QR Verification", 48, 700);
  doc.image(qrBuffer, 48, 724, { width: 96, height: 96 });
  doc.fillColor("#4B5563").fontSize(9).text(
    "Scan to verify this payment record. The QR opens the transaction verification endpoint.",
    164,
    744,
    { width: 280 }
  );
  doc.fillColor("#6B7280").fontSize(8).text(verifyUrl, 164, 784, { width: 340 });

  doc.fillColor("#4C1D95").fontSize(9).text("Beautyhub", 48, 806, {
    width: 500,
    align: "right",
  });

  doc.end();
};

const generateReceiptPdf = asyncHandler(async (req, res) => {
  const transaction = await loadTransaction(req.params.id);
  if (!transaction) {
    res.status(404);
    throw new Error("Transaction not found");
  }

  if (!canAccessTransaction(transaction, req.user)) {
    res.status(403);
    throw new Error("Not authorized to access this receipt");
  }

  await drawPaymentDocument({ req, res, transaction, type: "receipt" });
});

const generateInvoicePdf = asyncHandler(async (req, res) => {
  const transaction = await loadTransaction(req.params.id);
  if (!transaction) {
    res.status(404);
    throw new Error("Transaction not found");
  }

  if (!canAccessTransaction(transaction, req.user)) {
    res.status(403);
    throw new Error("Not authorized to access this invoice");
  }

  await drawPaymentDocument({ req, res, transaction, type: "invoice" });
});

const verifyTransactionRecord = asyncHandler(async (req, res) => {
  const transaction = await loadTransaction(req.params.id);
  if (!transaction) {
    res.status(404);
    throw new Error("Transaction not found");
  }

  res.json({
    success: true,
    data: {
      transactionId: transaction.transactionId,
      receiptNumber: transaction.receiptNumber,
      invoiceNumber: transaction.invoiceNumber,
      amount: transaction.amount,
      currency: transaction.currency,
      status: transaction.status,
      type: transaction.type,
      gateway: transaction.gateway,
      date: transaction.createdAt,
    },
  });
});

module.exports = {
  generateReceiptPdf,
  generateInvoicePdf,
  verifyTransactionRecord,
};
