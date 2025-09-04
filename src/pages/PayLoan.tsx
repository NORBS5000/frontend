import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface LoanApplication {
  id: string;
  amount_requested: number;
  repayment_date: string;
  status: string;
  sector: string;
  created_at: string;
}

const PayLoan: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loans, setLoans] = useState<LoanApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState<LoanApplication | null>(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (user) {
      fetchActiveLoans();
    }
  }, [user]);

  const fetchActiveLoans = async () => {
    try {
      const { data, error } = await supabase
        .from('loan_applications')
        .select('*')
        .eq('user_id', user?.id)
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLoans(data || []);
    } catch (error) {
      console.error('Error fetching loans:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePayNow = (loan: LoanApplication) => {
    setSelectedLoan(loan);
    setPaymentAmount(loan.amount_requested.toString());
    setShowPaymentModal(true);
  };

  const processPayment = async () => {
    if (!selectedLoan || !paymentAmount) return;

    setIsProcessing(true);
    
    try {
      // Update loan status to completed
      const { error } = await supabase
        .from('loan_applications')
        .update({ status: 'completed' })
        .eq('id', selectedLoan.id);

      if (error) throw error;

      alert(`Payment of $${paymentAmount} processed successfully!`);
      setShowPaymentModal(false);
      fetchActiveLoans(); // Refresh data
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
      setSelectedLoan(null);
      setPaymentAmount('');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Pay Loan</h1>
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              ← Back to Home
            </button>
          </div>

          {loans.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Loans</h3>
              <p className="text-gray-500">You don't have any approved loans to pay at the moment.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {loans.map((loan) => {
                const daysUntilDue = getDaysUntilDue(loan.repayment_date);
                const isOverdue = daysUntilDue < 0;
                
                return (
                  <div
                    key={loan.id}
                    className={`border rounded-lg p-6 ${
                      isOverdue ? 'border-red-300 bg-red-50' : 'border-gray-200'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            Loan #{loan.id.slice(0, 8)}
                          </h3>
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                            {loan.sector}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Amount:</span>
                            <div className="font-medium text-lg">{formatCurrency(loan.amount_requested)}</div>
                          </div>
                          <div>
                            <span className="text-gray-500">Due Date:</span>
                            <div className={`font-medium ${isOverdue ? 'text-red-600' : ''}`}>
                              {formatDate(loan.repayment_date)}
                            </div>
                            {isOverdue ? (
                              <div className="text-red-600 text-xs">
                                {Math.abs(daysUntilDue)} days overdue
                              </div>
                            ) : (
                              <div className="text-gray-500 text-xs">
                                {daysUntilDue} days remaining
                              </div>
                            )}
                          </div>
                          <div>
                            <span className="text-gray-500">Applied:</span>
                            <div className="font-medium">{formatDate(loan.created_at)}</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="ml-6">
                        <button
                          onClick={() => handlePayNow(loan)}
                          className={`px-6 py-2 rounded-md font-medium ${
                            isOverdue
                              ? 'bg-red-600 hover:bg-red-700 text-white'
                              : 'bg-blue-600 hover:bg-blue-700 text-white'
                          }`}
                        >
                          Pay Now
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && selectedLoan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">
              Pay Loan #{selectedLoan.id.slice(0, 8)}
            </h3>
            
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between font-semibold">
                  <span>Amount:</span>
                  <span>{formatCurrency(selectedLoan.amount_requested)}</span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Amount
                </label>
                <input
                  type="number"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter amount"
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  disabled={isProcessing}
                >
                  Cancel
                </button>
                <button
                  onClick={processPayment}
                  disabled={isProcessing || !paymentAmount}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? 'Processing...' : 'Pay Now'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PayLoan;