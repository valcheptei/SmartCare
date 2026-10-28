'use client';

import { useEffect, useState, JSX } from 'react';

interface AIRecommendation {
  id: number;
  medicineName: string;
  currentStock: number;
  averageDailyConsumption: number;
  forecastedDaysUntilStockout: number;
  recommendedReorderQty: number;
  suggestedSupplier: string;
  expiryRiskLevel: string;
  confidenceScore: number;
  status: string;
}

export default function AIPage(): JSX.Element {
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [error, setError] = useState<string>('');
  
  // Copilot interactive chat state
  const [chatInput, setChatInput] = useState<string>('');
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'copilot'; text: string }>>([
    {
      sender: 'copilot',
      text: 'Hello Sammy! I am your SmartCare-POS AI Copilot. I can help you analyze sales trends, predict inventory needs, or generate reports. What would you like to know today?'
    }
  ]);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/ai/recommendations', {
        headers: { 'x-tenant-id': '1' },
      });
      if (!response.ok) throw new Error('Failed to fetch AI forecasts');
      const data = await response.json();
      setRecommendations(Array.isArray(data) ? data : data.data || []);
    } catch (err: any) {
      console.error('Error fetching AI insights:', err);
      setError(err.message || 'Could not connect to backend server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const handleApprove = async (id: number) => {
    try {
      setProcessingId(id);
      const response = await fetch(`http://localhost:5000/api/ai/recommendations/${id}/approve`, {
        method: 'POST',
        headers: { 'x-tenant-id': '1' },
      });
      if (!response.ok) throw new Error('Failed to approve recommendation');
      await fetchRecommendations();
    } catch (err: any) {
      console.error('Error approving recommendation:', err);
      alert('Approval failed. Please check your backend terminal.');
    } finally {
      setProcessingId(null);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userQuery = chatInput;
    setChatMessages(prev => [...prev, { sender: 'user', text: userQuery }]);
    setChatInput('');

    // Simulate AI Copilot response
    setTimeout(() => {
      let reply = `I'm analyzing your pharmacy data regarding "${userQuery}". Everything looks stable for the current branch, but keep an eye on fast-moving antibiotics.`;
      if (userQuery.toLowerCase().includes('stock') || userQuery.toLowerCase().includes('inventory')) {
        reply = `Sammy, you currently have items like Amoxicillin and Metformin approaching critical stockout levels within the next 2 to 6 days.`;
      } else if (userQuery.toLowerCase().includes('sales') || userQuery.toLowerCase().includes('trend')) {
        reply = `Sammy, your sales trend shows strong M-Pesa and Cash transactions this week, totaling over KES 68,450.00 today!`;
      }

      setChatMessages(prev => [...prev, { sender: 'copilot', text: reply }]);
    }, 600);
  };

  return (
    <div className="w-full space-y-6 sm:space-y-8 animate-fadeIn">
      {/* Header Section */}
      <div className="bg-white p-6 sm:p-8 lg:p-10 rounded-2xl lg:rounded-3xl shadow-sm border border-gray-100 w-full flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">AI Stock Forecasting & Insights</h1>
          <p className="text-sm sm:text-base text-gray-500 mt-1.5">Smart demand forecasting, reorder recommendations, and expiry risk mitigation.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-4 py-2 bg-blue-50 text-[#366498] rounded-xl text-xs font-bold border border-blue-200">
            🤖 AI Governance Active (Human Approval Required)
          </span>
        </div>
      </div>

      {/* AI Copilot Interactive Chatbox */}
      <div className="bg-gradient-to-br from-gray-900 to-[#366498] p-6 sm:p-8 rounded-2xl lg:rounded-3xl shadow-lg text-white space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-lg font-bold shadow-md">
            🤖
          </div>
          <div>
            <h3 className="font-black text-lg">SmartCare-POS AI Copilot</h3>
            <p className="text-xs text-blue-200">Instant conversational assistant for pharmacy management</p>
          </div>
        </div>

        {/* Chat Messages Container */}
        <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
          {chatMessages.map((msg, index) => (
            <div 
              key={index} 
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-xl p-4 rounded-2xl text-sm ${
                msg.sender === 'user' 
                  ? 'bg-blue-600 text-white rounded-br-none shadow-md' 
                  : 'bg-white/10 backdrop-blur-md text-gray-100 rounded-bl-none border border-white/10'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        {/* Chat Input Form */}
        <form onSubmit={handleSendMessage} className="flex gap-2 pt-2">
          <input 
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder="Ask Copilot about sales trends, inventory, or reports..."
            className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-sm text-white placeholder-gray-300 focus:bg-white/20 outline-none transition-all"
          />
          <button 
            type="submit"
            className="px-6 py-3 bg-[#62C02A] hover:bg-[#57ad25] text-white text-sm font-bold rounded-xl shadow-md transition-all"
          >
            Send Ask
          </button>
        </form>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-xl shadow-sm">
          <p className="text-sm font-bold text-red-700">{error}</p>
        </div>
      )}

      {/* Main Content Area */}
      <div className="bg-white rounded-2xl lg:rounded-3xl shadow-sm border border-gray-100 w-full overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
          <h3 className="font-black text-gray-900 text-lg">Smart Reorder & Expiry Recommendations</h3>
          <span className="text-xs font-semibold text-gray-500">Model Confidence: High (~92%)</span>
        </div>

        {loading ? (
          <div className="p-16 text-center text-gray-500 font-medium animate-pulse">Running demand forecasting models...</div>
        ) : recommendations.length === 0 ? (
          <div className="p-16 text-center text-gray-500">No active AI recommendations at this time.</div>
        ) : (
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100">
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Medicine Name</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Stock & Consumption</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Forecasted Stockout</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Recommended Reorder</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Risk Level</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Human Governance Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recommendations.map((rec) => {
                  let riskBadge = "bg-green-100 text-green-800 border border-green-200";
                  if (rec.expiryRiskLevel === 'MEDIUM') riskBadge = "bg-yellow-100 text-yellow-800 border border-yellow-200";
                  if (rec.expiryRiskLevel === 'HIGH') riskBadge = "bg-red-100 text-red-800 border border-red-200";

                  return (
                    <tr key={rec.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-5">
                        <p className="font-bold text-gray-900">{rec.medicineName}</p>
                        <p className="text-xs text-gray-400 mt-0.5">Preferred Supplier: {rec.suggestedSupplier}</p>
                      </td>
                      <td className="px-6 py-5 text-sm">
                        <p className="font-bold text-gray-800">{rec.currentStock} units available</p>
                        <p className="text-xs text-gray-500">Avg daily usage: ~{rec.averageDailyConsumption} units</p>
                      </td>
                      <td className="px-6 py-5 text-sm font-bold">
                        <span className={rec.forecastedDaysUntilStockout <= 3 ? 'text-red-600' : 'text-gray-900'}>
                          ~{rec.forecastedDaysUntilStockout} days left
                        </span>
                      </td>
                      <td className="px-6 py-5 text-sm font-black text-[#366498]">
                        +{rec.recommendedReorderQty} units
                      </td>
                      <td className="px-6 py-5">
                        <span className={`inline-flex items-center px-3 py-1 text-xs font-bold rounded-full shadow-sm ${riskBadge}`}>
                          {rec.expiryRiskLevel} RISK
                        </span>
                      </td>
                      <td className="px-6 py-5 text-right">
                        {rec.status === 'APPROVED_AND_DRAFTED' ? (
                          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 inline-block">
                            ✓ Approved & Drafted
                          </span>
                        ) : (
                          <button
                            onClick={() => handleApprove(rec.id)}
                            disabled={processingId === rec.id}
                            className="px-4 py-2 bg-[#62C02A] hover:bg-[#57ad25] text-white text-xs font-bold rounded-xl shadow-sm transition-all disabled:opacity-50"
                          >
                            {processingId === rec.id ? 'Processing...' : 'Approve Reorder'}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}