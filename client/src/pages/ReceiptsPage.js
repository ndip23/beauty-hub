import React, { useEffect, useState } from "react";
import { FaDownload, FaFileInvoiceDollar, FaReceipt, FaSpinner } from "react-icons/fa";
import { downloadTransactionDocument, getMyTransactions } from "../api";

const ReceiptsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloadingKey, setDownloadingKey] = useState(null);

  useEffect(() => {
    const loadTransactions = async () => {
      try {
        const response = await getMyTransactions();
        setTransactions(response.data?.data || []);
      } catch (error) {
        console.error("Failed to load receipts:", error);
      } finally {
        setLoading(false);
      }
    };

    loadTransactions();
  }, []);

  const handleDownload = async (transaction, type) => {
    const key = `${transaction._id}-${type}`;
    setDownloadingKey(key);
    try {
      const response = await downloadTransactionDocument(transaction._id, type);
      const blobUrl = window.URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }));
      const link = document.createElement("a");
      const documentNumber = type === "invoice" ? transaction.invoiceNumber : transaction.receiptNumber;
      link.href = blobUrl;
      link.download = `${type}-${documentNumber || transaction.transactionId || transaction._id}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error(`Failed to download ${type}:`, error);
    } finally {
      setDownloadingKey(null);
    }
  };

  if (loading) {
    return (
      <div className="p-20 text-center">
        <FaSpinner className="animate-spin text-5xl text-primary-purple mx-auto" />
        <p className="mt-6 text-gray-500 font-medium">Loading your payment receipts...</p>
      </div>
    );
  }

  return (
    <div className="p-10 space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col gap-3 border-b pb-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-gray-900 flex items-center gap-3">
            <FaReceipt className="text-purple-600" /> Receipts & Invoices
          </h1>
          <p className="text-gray-500 max-w-2xl">
            Download PDF receipts for every payment. Each receipt contains a secure QR code and all transaction details.
          </p>
        </div>
      </header>

      {transactions.length === 0 ? (
        <div className="bg-white p-16 rounded-[2rem] shadow-xl border border-gray-100 text-center">
          <p className="text-xl font-semibold text-gray-900">No receipts found yet.</p>
          <p className="text-gray-500 mt-3">Once you complete a payment, your receipts will appear here automatically.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {transactions.map((transaction) => (
            <div key={transaction._id} className="bg-white rounded-[2rem] p-8 shadow-lg border border-gray-100 hover:shadow-2xl transition">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.25em] text-purple-600 font-black">Receipt</p>
                  <h2 className="text-2xl font-black text-gray-900">{transaction.transactionId}</h2>
                  <p className="text-sm text-gray-500 mt-2">{transaction.description || "Subscription payment"}</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-full bg-green-50 text-green-700 px-4 py-2 text-sm font-semibold">
                    {transaction.status}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleDownload(transaction, "receipt")}
                    disabled={downloadingKey === `${transaction._id}-receipt`}
                    className="inline-flex items-center gap-2 rounded-full bg-purple-600 px-5 py-3 text-white font-bold hover:bg-purple-700 transition disabled:opacity-70"
                  >
                    {downloadingKey === `${transaction._id}-receipt` ? <FaSpinner className="animate-spin" /> : <FaDownload />}
                    Receipt PDF
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDownload(transaction, "invoice")}
                    disabled={downloadingKey === `${transaction._id}-invoice`}
                    className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-white font-bold hover:bg-slate-800 transition disabled:opacity-70"
                  >
                    {downloadingKey === `${transaction._id}-invoice` ? <FaSpinner className="animate-spin" /> : <FaFileInvoiceDollar />}
                    Invoice PDF
                  </button>
                </div>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-3">
                <div className="rounded-3xl bg-purple-50 p-5">
                  <p className="text-xs uppercase tracking-[0.25em] text-gray-400">Amount</p>
                  <p className="text-2xl font-black text-gray-900 mt-2">{transaction.currency} {Number(transaction.amount).toFixed(2)}</p>
                </div>
                <div className="rounded-3xl bg-slate-50 p-5">
                  <p className="text-xs uppercase tracking-[0.25em] text-gray-400">Date</p>
                  <p className="mt-2 text-base font-semibold text-gray-900">{new Date(transaction.createdAt).toLocaleString()}</p>
                </div>
                <div className="rounded-3xl bg-slate-50 p-5">
                  <p className="text-xs uppercase tracking-[0.25em] text-gray-400">Gateway</p>
                  <p className="mt-2 text-base font-semibold text-gray-900">{transaction.gateway || "swychr"}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReceiptsPage;
