import React, { useEffect, useState } from "react";
import { downloadTransactionDocument, getAllTransactionsForAdmin } from "../api";
import { FaCoins, FaFileInvoiceDollar, FaReceipt, FaSpinner } from "react-icons/fa";

const AdminPayments = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloadingKey, setDownloadingKey] = useState(null);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const { data } = await getAllTransactionsForAdmin();
        setLogs(data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  const handleDownload = async (tx, type) => {
    const key = `${tx._id}-${type}`;
    setDownloadingKey(key);
    try {
      const response = await downloadTransactionDocument(tx._id, type);
      const blobUrl = window.URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }));
      const link = document.createElement("a");
      const documentNumber = type === "invoice" ? tx.invoiceNumber : tx.receiptNumber;
      link.href = blobUrl;
      link.download = `${type}-${documentNumber || tx.transactionId || tx._id}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error(`Failed to download ${type}:`, err);
    } finally {
      setDownloadingKey(null);
    }
  };

  if (loading) return <div className="p-20 text-center"><FaSpinner className="animate-spin text-4xl text-primary-purple mx-auto" /></div>;

  return (
    <div className="p-10 space-y-8 animate-in fade-in duration-500">
      <header className="flex justify-between items-end border-b pb-6">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-gray-900 flex items-center gap-3">
            <FaCoins className="text-yellow-500" /> Financial Monitor
          </h1>
          <p className="text-gray-500 font-medium">Real-time deposit and commission tracking.</p>
        </div>
      </header>

      <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-xl border border-gray-100">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-[10px] uppercase font-black tracking-widest text-gray-400">
            <tr>
              <th className="p-6">User / Salon</th>
              <th className="p-6">Type</th>
              <th className="p-6">Amount</th>
              <th className="p-6">Description</th>
              <th className="p-6">Documents</th>
              <th className="p-6 text-right">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 text-sm font-medium">
            {logs.map((tx) => (
              <tr key={tx._id} className="hover:bg-purple-50/20">
                <td className="p-6">
                  <p className="font-bold text-gray-900">{tx.user?.name || "System"}</p>
                  <p className="text-xs text-gray-400">{tx.user?.email}</p>
                </td>
                <td className="p-6">
                  <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase ${
                    tx.type === "DEPOSIT" ? "bg-green-100 text-green-700" : "bg-red-50 text-red-600"
                  }`}>
                    {tx.type}
                  </span>
                </td>
                <td className={`p-6 font-black ${tx.type === "DEPOSIT" ? "text-green-600" : "text-gray-800"}`}>
                   $ {Number(tx.amount || 0).toFixed(2)}
                </td>
                <td className="p-6 text-gray-500 font-bold">{tx.description}</td>
                <td className="p-6">
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => handleDownload(tx, "receipt")}
                      disabled={downloadingKey === `${tx._id}-receipt`}
                      className="inline-flex items-center gap-2 rounded-full bg-purple-50 px-3 py-2 text-[10px] font-black uppercase text-purple-700 hover:bg-purple-100 disabled:opacity-70"
                    >
                      {downloadingKey === `${tx._id}-receipt` ? <FaSpinner className="animate-spin" /> : <FaReceipt />}
                      Receipt
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDownload(tx, "invoice")}
                      disabled={downloadingKey === `${tx._id}-invoice`}
                      className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2 text-[10px] font-black uppercase text-slate-700 hover:bg-slate-200 disabled:opacity-70"
                    >
                      {downloadingKey === `${tx._id}-invoice` ? <FaSpinner className="animate-spin" /> : <FaFileInvoiceDollar />}
                      Invoice
                    </button>
                  </div>
                </td>
                <td className="p-6 text-right text-gray-400 text-xs">
                   {new Date(tx.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPayments;
