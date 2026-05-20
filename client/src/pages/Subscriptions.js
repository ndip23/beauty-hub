import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { 
  FaSpinner, 
  FaWallet, 
  FaPlus, 
  FaCheckCircle, 
  FaExclamationTriangle, 
  FaHistory 
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getMyTransactions } from "../api"; // 🚀 Imported API helper

const Subscriptions = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [depositAmount, setDepositAmount] = useState(10); // Default to $10
  const [transactions, setTransactions] = useState([]);
  const [fetchingTransactions, setFetchingTransactions] = useState(true);

  // 🚀 1. LOAD TRANSACTIONS HISTORY ON PORTAL LOAD
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setFetchingTransactions(true);
        const { data } = await getMyTransactions();
        // Since API returns { success: true, data: [...] }
        setTransactions(data?.data || data || []);
      } catch (err) {
        console.error("Failed to load transaction history:", err);
      } finally {
        setFetchingTransactions(false);
      }
    };
    fetchHistory();
  }, []);

  const handleDeposit = () => {
    if (depositAmount < 5) {
      return alert("Minimum deposit amount is $5");
    }
    // Navigate to the internal payment page we created earlier
    navigate(`/salon-owner/pay?plan=basic-plan`, { 
      state: { 
        customAmount: depositAmount 
      } 
    });
  };

  return (
    <div className="bg-[#FAF9F6] min-h-full font-sans p-6 md:p-10 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">My Wallet & Billing</h1>
        <p className="text-gray-500 mt-1 text-lg">Manage your balance and complete manual deposits.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Balance & Deposit Form */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Card 1: Available Balance */}
          <div className="bg-gradient-to-br from-purple-700 to-indigo-800 text-white p-10 rounded-[2.5rem] shadow-xl relative overflow-hidden">
            <p className="text-purple-200 text-xs font-black uppercase tracking-widest">Available Balance</p>
            <div className="flex items-baseline gap-2 mt-4 relative z-10">
              <h2 className="text-6xl font-black tracking-tighter">$ {user?.walletBalance?.toFixed(2) || "0.00"}</h2>
              <span className="text-purple-200 font-bold text-lg">USD</span>
            </div>
            
            {user?.walletBalance < 0.50 && (
              <p className="mt-4 text-xs font-bold text-red-300 flex items-center gap-1.5 animate-pulse relative z-10">
                <FaExclamationTriangle /> Bookings are disabled. Please top up at least $5 to activate your salon.
              </p>
            )}

            {/* Background design */}
            <div className="absolute -bottom-10 -right-10 text-white/5 font-black text-[12rem] select-none">$</div>
          </div>

          {/* Card 2: Quick Deposit Form */}
          <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-sm border border-gray-100">
            <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
              <FaWallet className="text-primary-purple" /> Top up Wallet
            </h3>

            <div className="space-y-6">
              {/* Quick Select Buttons */}
              <div>
                <p className="text-xs font-black uppercase text-gray-400 tracking-widest mb-3 ml-1">Quick Select Amount</p>
                <div className="grid grid-cols-3 gap-4">
                  {[5, 10, 20].map((amt) => (
                    <button
                      key={amt}
                      onClick={() => setDepositAmount(amt)}
                      className={`py-4 rounded-2xl font-black text-lg transition-all border-2 ${
                        depositAmount === amt
                          ? "border-primary-purple bg-purple-50 text-primary-purple"
                          : "border-gray-100 text-gray-400 hover:border-gray-200"
                      }`}
                    >
                      $ {amt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Input */}
              <div>
                <label className="block text-xs font-black uppercase text-gray-400 tracking-widest mb-3 ml-1">Or Enter Custom Amount (Min $5)</label>
                <div className="relative">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 font-black text-gray-400 text-xl">$</span>
                  <input
                    type="number"
                    min="5"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-full pl-10 p-5 bg-gray-50 rounded-2xl font-black text-xl outline-none focus:ring-2 focus:ring-primary-purple border-none"
                  />
                </div>
              </div>

              <button
                onClick={handleDeposit}
                className="w-full bg-gradient-to-r from-primary-pink to-primary-purple text-white py-5 rounded-full text-xl font-black shadow-lg flex items-center justify-center gap-3 active:scale-[0.98] transition-all"
              >
                <FaPlus /> Top up $ {depositAmount} Now
              </button>
            </div>
          </div>

        </div>

        {/* Right Side: Simple Pricing info card */}
        <div className="lg:col-span-1">
          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm sticky top-24">
             <h3 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
               <FaCheckCircle className="text-green-500" /> Pay-As-You-Go Rules
             </h3>
             <ul className="space-y-4 text-sm text-gray-500 font-medium">
               <li>&bull; Minimum deposit allowed is <strong>$5.00</strong>.</li>
               <li>&bull; We deduct exactly <strong>$0.50</strong> per successful customer booking.</li>
               <li>&bull; You are never charged a monthly fee—you only pay when you actually get clients.</li>
               <li>&bull; If your balance hits $0.00, your booking button automatically closes.</li>
             </ul>
          </div>
        </div>
      </div>

      {/* 🚀 2. TRANSACTION HISTORY TABLE */}
      <div className="mt-12 bg-white p-8 md:p-10 rounded-[2.5rem] shadow-sm border border-gray-100">
        <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
          <FaHistory className="text-primary-purple" /> Transaction History
        </h3>

        {fetchingTransactions ? (
          <div className="text-center py-10">
            <FaSpinner className="animate-spin text-3xl text-primary-purple mx-auto" />
            <p className="text-xs font-black uppercase text-gray-400 mt-2">Loading Ledger...</p>
          </div>
        ) : transactions.length === 0 ? (
          <p className="text-gray-400 italic text-center py-6">No transactions recorded yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] font-black uppercase tracking-widest text-gray-400 border-b">
                  <th className="pb-4">Type</th>
                  <th className="pb-4">Description</th>
                  <th className="pb-4">Amount</th>
                  <th className="pb-4">Balance After</th>
                  <th className="pb-4 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-sm font-medium">
                {transactions.map((tx) => (
                  <tr key={tx._id} className="hover:bg-gray-50/50">
                    <td className="py-4">
                      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase ${
                        tx.type === "DEPOSIT" ? "bg-emerald-100 text-emerald-700" : "bg-red-50 text-red-600"
                      }`}>
                        {tx.type}
                      </span>
                    </td>
                    <td className="py-4 text-gray-700 font-bold">{tx.description}</td>
                    <td className={`py-4 font-black ${tx.type === "DEPOSIT" ? "text-emerald-600" : "text-gray-800"}`}>
                      {tx.type === "DEPOSIT" ? "+" : "-"} $ {tx.amount?.toFixed(2)}
                    </td>
                    <td className="py-4 text-gray-400 font-bold">$ {tx.balanceAfter?.toFixed(2)}</td>
                    <td className="py-4 text-right text-gray-400 text-xs">
                      {new Date(tx.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};

export default Subscriptions;