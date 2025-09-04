import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const ReviewLoan = () => {
  const { id } = useParams();
  const [loan, setLoan] = useState<any>(null);
  const [guarantors, setGuarantors] = useState<any[]>([]);
  const [analysisData, setAnalysisData] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLoanDetails();
  }, [id]);

  const fetchLoanDetails = async () => {
    try {
      // Fetch loan application
      const { data: loanData, error: loanError } = await supabase
        .from('loan_applications')
        .select('*')
        .eq('id', id)
        .single();

      if (loanError) throw loanError;
      setLoan(loanData);

      // Fetch guarantors
      const [guarantor1Response, guarantor2Response] = await Promise.all([
        supabase.from('guarantor1').select('*').eq('loan_id', id).single(),
        supabase.from('guarantor2').select('*').eq('loan_id', id).single()
      ]);

      const guarantorsList = [];
      if (guarantor1Response.data) guarantorsList.push(guarantor1Response.data);
      if (guarantor2Response.data) guarantorsList.push(guarantor2Response.data);
      setGuarantors(guarantorsList);

      // Fetch analysis data
      const [bankAnalysis, payslipAnalysis, callLogsAnalysis, mpesaAnalysis, assetsAnalysis] = await Promise.all([
        supabase.from('bank_statement_analysis').select('*').eq('loan_id', id),
        supabase.from('payslip_analysis').select('*').eq('loan_id', id),
        supabase.from('call_logs_analysis').select('*').eq('loan_id', id),
        supabase.from('mpesa_analysis_results').select('*').eq('loan_id', id),
        supabase.from('assets_analysis_results').select('*').eq('loan_id', id)
      ]);

      setAnalysisData({
        bank: bankAnalysis.data || [],
        payslip: payslipAnalysis.data || [],
        callLogs: callLogsAnalysis.data || [],
        mpesa: mpesaAnalysis.data || [],
        assets: assetsAnalysis.data || []
      });
    } catch (error) {
      console.error('Error fetching loan details');
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (path: string, bucket: string = 'assets') => {
    if (!path) return null;
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
  };

  const getDocumentUrl = (path: string) => {
    if (!path) return null;
    const { data } = supabase.storage.from('documents').getPublicUrl(path);
    return data.publicUrl;
  };

  if (loading) return <div className="p-8">Loading...</div>;
  if (!loan) return <div className="p-8">Loan not found</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Loan Application Review</h1>
        
        {/* Basic Info */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Application Details</h2>
          <div className="grid grid-cols-2 gap-4">
            <div><span className="font-medium">Amount:</span> ${loan.amount_requested?.toLocaleString()}</div>
            <div><span className="font-medium">Sector:</span> {loan.sector}</div>
            <div><span className="font-medium">Status:</span> <span className={`px-2 py-1 rounded text-sm ${
              loan.status === 'approved' ? 'bg-green-100 text-green-800' :
              loan.status === 'rejected' ? 'bg-red-100 text-red-800' :
              'bg-yellow-100 text-yellow-800'
            }`}>{loan.status}</span></div>
            <div><span className="font-medium">Repayment Date:</span> {loan.repayment_date}</div>
            <div><span className="font-medium">Has Bank Account:</span> {loan.has_bank_account ? 'Yes' : 'No'}</div>
            <div><span className="font-medium">Has Business:</span> {loan.has_retail_business ? 'Yes' : 'No'}</div>
            {loan.business_registration_number && (
              <div><span className="font-medium">Business Reg:</span> {loan.business_registration_number}</div>
            )}
            {loan.business_location && (
              <div><span className="font-medium">Business Location:</span> {loan.business_location}</div>
            )}
          </div>
        </div>

        {/* Credit Scores */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl shadow-lg p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Credit Assessment</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {[
              { score: loan.bank_statement_score || 0, label: 'Bank Statement', color: '#3B82F6', bgColor: 'bg-blue-50' },
              { score: loan.mpesa_score || 0, label: 'M-Pesa', color: '#10B981', bgColor: 'bg-green-50' },
              { score: loan.gps_score || 0, label: 'GPS', color: '#8B5CF6', bgColor: 'bg-purple-50' },
              { score: loan.assets_score || 0, label: 'Assets', color: '#F59E0B', bgColor: 'bg-yellow-50' },
              { score: loan.call_logs_score || 0, label: 'Call Logs', color: '#EF4444', bgColor: 'bg-red-50' },
              { score: loan.payslips_score || 0, label: 'Payslips', color: '#6366F1', bgColor: 'bg-indigo-50' }
            ].map((item, idx) => {
              const radius = 45;
              const circumference = Math.PI * radius; // Semi-circle circumference
              const strokeDasharray = circumference;
              const strokeDashoffset = circumference - (item.score / 100) * circumference;
              
              return (
                <div key={idx} className={`${item.bgColor} rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-shadow`}>
                  <div className="relative w-28 h-16 mx-auto mb-4">
                    <svg className="w-28 h-16" viewBox="0 0 100 50">
                      {/* Background semi-circle */}
                      <path
                        d="M 10 40 A 30 30 0 0 1 90 40"
                        stroke="#E5E7EB"
                        strokeWidth="6"
                        fill="none"
                      />
                      {/* Progress semi-circle */}
                      <path
                        d="M 10 40 A 30 30 0 0 1 90 40"
                        stroke={item.color}
                        strokeWidth="6"
                        fill="none"
                        strokeDasharray={`${(item.score / 100) * 94.25} 94.25`}
                        strokeLinecap="round"
                        className="transition-all duration-2000 ease-out"
                        style={{
                          strokeDasharray: `0 94.25`,
                          animation: `drawSemi${idx} 2s ease-out ${idx * 0.2}s forwards`
                        }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center mt-2">
                      <span className="text-xl font-bold" style={{ color: item.color }}>
                        {Math.round(item.score)}
                      </span>
                      <span className="text-xs text-gray-500">%</span>
                    </div>
                  </div>
                  <div className="text-sm font-medium text-gray-700">{item.label}</div>
                  <div className="mt-2">
                    <div className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                      item.score >= 80 ? 'bg-green-100 text-green-800' :
                      item.score >= 60 ? 'bg-yellow-100 text-yellow-800' :
                      item.score >= 40 ? 'bg-orange-100 text-orange-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {item.score >= 80 ? 'Excellent' :
                       item.score >= 60 ? 'Good' :
                       item.score >= 40 ? 'Fair' : 'Poor'}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Total Score */}
          <div className="mt-8 text-center">
            <div className="bg-white rounded-2xl p-8 shadow-lg inline-block">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Overall Credit Score</h3>
              <div className="relative w-40 h-24 mx-auto">
                <svg className="w-40 h-24" viewBox="0 0 160 80">
                  {/* Background semi-circle */}
                  <path
                    d="M 20 60 A 60 60 0 0 1 140 60"
                    stroke="#E5E7EB"
                    strokeWidth="12"
                    fill="none"
                  />
                  {/* Progress semi-circle */}
                  <path
                    d="M 20 60 A 60 60 0 0 1 140 60"
                    stroke={loan.total_credit_score >= 80 ? '#10B981' :
                           loan.total_credit_score >= 60 ? '#F59E0B' :
                           loan.total_credit_score >= 40 ? '#EF4444' : '#6B7280'}
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray={`${((loan.total_credit_score || 0) / 100) * 188.5} 188.5`}
                    strokeLinecap="round"
                    className="transition-all duration-3000 ease-out"
                    style={{
                      strokeDasharray: `0 188.5`,
                      animation: `drawTotalSemi 3s ease-out 1s forwards`
                    }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center mt-4">
                  <span className="text-4xl font-bold text-gray-800">
                    {Math.round(loan.total_credit_score || 0)}
                  </span>
                  <span className="text-lg text-gray-500">%</span>
                </div>
              </div>
              <div className={`mt-4 inline-flex px-4 py-2 rounded-full text-sm font-semibold ${
                (loan.total_credit_score || 0) >= 80 ? 'bg-green-100 text-green-800' :
                (loan.total_credit_score || 0) >= 60 ? 'bg-yellow-100 text-yellow-800' :
                (loan.total_credit_score || 0) >= 40 ? 'bg-orange-100 text-orange-800' :
                'bg-red-100 text-red-800'
              }`}>
                {(loan.total_credit_score || 0) >= 80 ? '🎉 Excellent Credit' :
                 (loan.total_credit_score || 0) >= 60 ? '👍 Good Credit' :
                 (loan.total_credit_score || 0) >= 40 ? '⚠️ Fair Credit' : '❌ Poor Credit'}
              </div>
            </div>
          </div>
        </div>
        
        <style jsx>{`
          @keyframes drawSemi0 {
            to { stroke-dasharray: ${((loan.bank_statement_score || 0) / 100) * 94.25} 94.25; }
          }
          @keyframes drawSemi1 {
            to { stroke-dasharray: ${((loan.mpesa_score || 0) / 100) * 94.25} 94.25; }
          }
          @keyframes drawSemi2 {
            to { stroke-dasharray: ${((loan.gps_score || 0) / 100) * 94.25} 94.25; }
          }
          @keyframes drawSemi3 {
            to { stroke-dasharray: ${((loan.assets_score || 0) / 100) * 94.25} 94.25; }
          }
          @keyframes drawSemi4 {
            to { stroke-dasharray: ${((loan.call_logs_score || 0) / 100) * 94.25} 94.25; }
          }
          @keyframes drawSemi5 {
            to { stroke-dasharray: ${((loan.payslips_score || 0) / 100) * 94.25} 94.25; }
          }
          @keyframes drawTotalSemi {
            to { stroke-dasharray: ${((loan.total_credit_score || 0) / 100) * 188.5} 188.5; }
          }
        `}</style>

        {/* Images */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Uploaded Images</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {loan.home_photo_url && (
              <div>
                <h3 className="font-medium mb-2">Home Photo</h3>
                <img src={getImageUrl(loan.home_photo_url)} alt="Home" className="w-full h-32 object-cover rounded" />
              </div>
            )}
            {loan.shop_photo_url && (
              <div>
                <h3 className="font-medium mb-2">Shop Photo</h3>
                <img src={getImageUrl(loan.shop_photo_url)} alt="Shop" className="w-full h-32 object-cover rounded" />
              </div>
            )}
            {loan.assets_urls?.map((url: string, idx: number) => (
              <div key={idx}>
                <h3 className="font-medium mb-2">Asset {idx + 1}</h3>
                <img src={getImageUrl(url)} alt={`Asset ${idx + 1}`} className="w-full h-32 object-cover rounded" />
              </div>
            ))}
          </div>
        </div>

        {/* Guarantors */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Guarantors</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {guarantors.map((guarantor, idx) => (
              <div key={idx} className="border rounded p-4">
                <h3 className="font-medium mb-2">Guarantor {idx + 1}</h3>
                <div className="space-y-1 text-sm">
                  <div><span className="font-medium">Name:</span> {guarantor.full_name}</div>
                  <div><span className="font-medium">Nationality:</span> {guarantor.nationality}</div>
                  <div><span className="font-medium">ID Number:</span> {guarantor.id_number}</div>
                  <div><span className="font-medium">Contact:</span> {guarantor.contact}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Analysis Results */}
        {analysisData.bank?.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Bank Statement Analysis</h2>
            {analysisData.bank.map((bank: any, idx: number) => (
              <div key={idx} className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div><span className="font-medium">Opening Balance:</span> ${bank.opening_balance?.toLocaleString()}</div>
                <div><span className="font-medium">Closing Balance:</span> ${bank.closing_balance?.toLocaleString()}</div>
                <div><span className="font-medium">Total Deposits:</span> ${bank.total_deposits?.toLocaleString()}</div>
                <div><span className="font-medium">Total Withdrawals:</span> ${bank.total_withdrawals?.toLocaleString()}</div>
              </div>
            ))}
          </div>
        )}

        {analysisData.payslip?.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Payslip Analysis</h2>
            {analysisData.payslip.map((payslip: any, idx: number) => (
              <div key={idx} className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div><span className="font-medium">Employee:</span> {payslip.employee_name}</div>
                <div><span className="font-medium">Employer:</span> {payslip.employer_name}</div>
                <div><span className="font-medium">Gross Salary:</span> ${payslip.gross_salary?.toLocaleString()}</div>
                <div><span className="font-medium">Net Salary:</span> ${payslip.net_salary?.toLocaleString()}</div>
              </div>
            ))}
          </div>
        )}

        {analysisData.assets?.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Assets Analysis</h2>
            {analysisData.assets.map((asset: any, idx: number) => (
              <div key={idx} className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div><span className="font-medium">Total Value:</span> ${asset.total_asset_value?.toLocaleString()}</div>
                <div><span className="font-medium">High Value Assets:</span> {asset.has_high_value_assets ? 'Yes' : 'No'}</div>
                <div><span className="font-medium">Transport Asset:</span> {asset.has_transport_asset ? 'Yes' : 'No'}</div>
                <div><span className="font-medium">Electronics:</span> {asset.has_electronics_asset ? 'Yes' : 'No'}</div>
              </div>
            ))}
          </div>
        )}

        <div className="flex space-x-4">
          <button 
            onClick={() => window.history.back()}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewLoan;