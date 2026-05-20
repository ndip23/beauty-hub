import React, { useEffect, useState } from "react";
import { getAllTransactionsForAdmin } from "../api";
import { FaHistory, FaSpinner, FaCoins } from "react-icons/fa";

const AdminPayments = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

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
                   $ {tx.amount.toFixed(2)}
                </td>
                <td className="p-6 text-gray-500 font-bold">{tx.description}</td>
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