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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 flex items-center justify-center">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-gray-600 mt-4 text-center">Loading loan details...</p>
        </div>
      </div>
    );
  }

  if (!loan) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 flex items-center justify-center">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 text-center">
          <div className="text-6xl mb-4">📄</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Loan Not Found</h2>
          <p className="text-gray-600">The loan application you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-500 to-teal-600 bg-clip-text text-transparent mb-2">
            Loan Application Review
          </h1>
          <p className="text-gray-600">Review and analyze loan application details</p>
        </div>
        
        {/* Basic Info */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 p-6 sm:p-8 mb-8">
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-teal-600 rounded-xl flex items-center justify-center mr-4">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Application Details</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 hover:shadow-md transition-all duration-200">
              <div className="text-sm font-semibold text-blue-700 mb-1">Amount Requested</div>
              <div className="text-2xl font-bold text-blue-900">${loan.amount_requested?.toLocaleString()}</div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 hover:shadow-md transition-all duration-200">
              <div className="text-sm font-semibold text-green-700 mb-1">Employment Sector</div>
              <div className="text-lg font-semibold text-green-900">{loan.sector}</div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 hover:shadow-md transition-all duration-200">
              <div className="text-sm font-semibold text-purple-700 mb-1">Application Status</div>
              <div className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold ${
                loan.status === 'approved' ? 'bg-green-100 text-green-800' :
                loan.status === 'rejected' ? 'bg-red-100 text-red-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {loan.status}
              </div>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 hover:shadow-md transition-all duration-200">
              <div className="text-sm font-semibold text-orange-700 mb-1">Repayment Date</div>
              <div className="text-lg font-semibold text-orange-900">{loan.repayment_date}</div>
            </div>
            <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-xl p-4 hover:shadow-md transition-all duration-200">
              <div className="text-sm font-semibold text-teal-700 mb-1">Bank Account</div>
              <div className="text-lg font-semibold text-teal-900">{loan.has_bank_account ? '✅ Yes' : '❌ No'}</div>
            </div>
            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-4 hover:shadow-md transition-all duration-200">
              <div className="text-sm font-semibold text-indigo-700 mb-1">Business Owner</div>
              <div className="text-lg font-semibold text-indigo-900">{loan.has_retail_business ? '✅ Yes' : '❌ No'}</div>
            </div>
            {loan.business_registration_number && (
              <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl p-4 hover:shadow-md transition-all duration-200 sm:col-span-2 lg:col-span-1">
                <div className="text-sm font-semibold text-pink-700 mb-1">Business Registration</div>
                <div className="text-lg font-semibold text-pink-900">{loan.business_registration_number}</div>
              </div>
            )}
            {loan.business_location && (
              <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-xl p-4 hover:shadow-md transition-all duration-200 sm:col-span-2 lg:col-span-1">
                <div className="text-sm font-semibold text-cyan-700 mb-1">Business Location</div>
                <div className="text-lg font-semibold text-cyan-900">{loan.business_location}</div>
              </div>
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
        {(loan.home_photo_url || loan.shop_photo_url || loan.assets_urls?.length > 0) && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 p-6 sm:p-8 mb-8">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mr-4">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Uploaded Images</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {loan.home_photo_url && (
                <div className="group">
                  <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl p-4 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                    <h3 className="font-semibold text-blue-800 mb-3 flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                      </svg>
                      Home Photo
                    </h3>
                    <div className="relative overflow-hidden rounded-lg">
                      {getImageUrl(loan.home_photo_url) && (
                        <img
                          src={getImageUrl(loan.home_photo_url)!}
                          alt="Home"
                          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  </div>
                </div>
              )}
              {loan.shop_photo_url && (
                <div className="group">
                  <div className="bg-gradient-to-br from-green-100 to-green-200 rounded-xl p-4 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                    <h3 className="font-semibold text-green-800 mb-3 flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                      </svg>
                      Shop Photo
                    </h3>
                    <div className="relative overflow-hidden rounded-lg">
                      {getImageUrl(loan.shop_photo_url) && (
                        <img
                          src={getImageUrl(loan.shop_photo_url)!}
                          alt="Shop"
                          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  </div>
                </div>
              )}
              {loan.assets_urls?.map((url: string, idx: number) => (
                <div key={idx} className="group">
                  <div className="bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl p-4 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                    <h3 className="font-semibold text-orange-800 mb-3 flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                      </svg>
                      Asset {idx + 1}
                    </h3>
                    <div className="relative overflow-hidden rounded-lg">
                      {getImageUrl(url) && (
                        <img
                          src={getImageUrl(url)!}
                          alt={`Asset ${idx + 1}`}
                          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Guarantors */}
        {guarantors.length > 0 && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 p-6 sm:p-8 mb-8">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mr-4">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Guarantors</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {guarantors.map((guarantor, idx) => (
                <div key={idx} className="group bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-slate-200/50">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-teal-600 rounded-full flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                      <span className="text-white font-bold text-lg">
                        {guarantor.full_name?.charAt(0).toUpperCase() || 'G'}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">Guarantor {idx + 1}</h3>
                      <p className="text-sm text-gray-600">{guarantor.full_name}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center p-3 bg-white/60 rounded-lg">
                      <svg className="w-4 h-4 text-blue-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064"></path>
                      </svg>
                      <div>
                        <div className="text-xs font-semibold text-blue-700 uppercase tracking-wide">Nationality</div>
                        <div className="text-sm text-gray-900">{guarantor.nationality}</div>
                      </div>
                    </div>
                    <div className="flex items-center p-3 bg-white/60 rounded-lg">
                      <svg className="w-4 h-4 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0m-4 0V5a2 2 0 104 0m-4 0h4m0 0V3a2 2 0 00-2-2h-2a2 2 0 00-2 2v2z"></path>
                      </svg>
                      <div>
                        <div className="text-xs font-semibold text-green-700 uppercase tracking-wide">ID Number</div>
                        <div className="text-sm text-gray-900">{guarantor.id_number}</div>
                      </div>
                    </div>
                    <div className="flex items-center p-3 bg-white/60 rounded-lg">
                      <svg className="w-4 h-4 text-purple-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                      </svg>
                      <div>
                        <div className="text-xs font-semibold text-purple-700 uppercase tracking-wide">Contact</div>
                        <div className="text-sm text-gray-900">{guarantor.contact}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Analysis Results */}
        {analysisData.bank?.length > 0 && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 p-6 sm:p-8 mb-8">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center mr-4">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Bank Statement Analysis</h2>
            </div>
            {analysisData.bank.map((bank: any, idx: number) => (
              <div key={idx} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 hover:shadow-md transition-all duration-200">
                  <div className="text-sm font-semibold text-blue-700 mb-1">Opening Balance</div>
                  <div className="text-lg font-bold text-blue-900">${bank.opening_balance?.toLocaleString()}</div>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 hover:shadow-md transition-all duration-200">
                  <div className="text-sm font-semibold text-green-700 mb-1">Closing Balance</div>
                  <div className="text-lg font-bold text-green-900">${bank.closing_balance?.toLocaleString()}</div>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 hover:shadow-md transition-all duration-200">
                  <div className="text-sm font-semibold text-purple-700 mb-1">Total Deposits</div>
                  <div className="text-lg font-bold text-purple-900">${bank.total_deposits?.toLocaleString()}</div>
                </div>
                <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-4 hover:shadow-md transition-all duration-200">
                  <div className="text-sm font-semibold text-red-700 mb-1">Total Withdrawals</div>
                  <div className="text-lg font-bold text-red-900">${bank.total_withdrawals?.toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {analysisData.payslip?.length > 0 && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 p-6 sm:p-8 mb-8">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center mr-4">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Payslip Analysis</h2>
            </div>
            {analysisData.payslip.map((payslip: any, idx: number) => (
              <div key={idx} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-4 hover:shadow-md transition-all duration-200">
                  <div className="text-sm font-semibold text-indigo-700 mb-1">Employee</div>
                  <div className="text-lg font-bold text-indigo-900">{payslip.employee_name}</div>
                </div>
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 hover:shadow-md transition-all duration-200">
                  <div className="text-sm font-semibold text-orange-700 mb-1">Employer</div>
                  <div className="text-lg font-bold text-orange-900">{payslip.employer_name}</div>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 hover:shadow-md transition-all duration-200">
                  <div className="text-sm font-semibold text-green-700 mb-1">Gross Salary</div>
                  <div className="text-lg font-bold text-green-900">${payslip.gross_salary?.toLocaleString()}</div>
                </div>
                <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-xl p-4 hover:shadow-md transition-all duration-200">
                  <div className="text-sm font-semibold text-teal-700 mb-1">Net Salary</div>
                  <div className="text-lg font-bold text-teal-900">${payslip.net_salary?.toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {analysisData.assets?.length > 0 && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 p-6 sm:p-8 mb-8">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl flex items-center justify-center mr-4">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Assets Analysis</h2>
            </div>
            {analysisData.assets.map((asset: any, idx: number) => (
              <div key={idx} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-4 hover:shadow-md transition-all duration-200">
                  <div className="text-sm font-semibold text-emerald-700 mb-1">Total Value</div>
                  <div className="text-lg font-bold text-emerald-900">${asset.total_asset_value?.toLocaleString()}</div>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 hover:shadow-md transition-all duration-200">
                  <div className="text-sm font-semibold text-blue-700 mb-1">High Value Assets</div>
                  <div className="text-lg font-bold text-blue-900">{asset.has_high_value_assets ? '✅ Yes' : '❌ No'}</div>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 hover:shadow-md transition-all duration-200">
                  <div className="text-sm font-semibold text-purple-700 mb-1">Transport Asset</div>
                  <div className="text-lg font-bold text-purple-900">{asset.has_transport_asset ? '✅ Yes' : '❌ No'}</div>
                </div>
                <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl p-4 hover:shadow-md transition-all duration-200">
                  <div className="text-sm font-semibold text-pink-700 mb-1">Electronics</div>
                  <div className="text-lg font-bold text-pink-900">{asset.has_electronics_asset ? '✅ Yes' : '❌ No'}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => window.history.back()}
            className="group bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold text-base sm:text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 flex items-center justify-center"
          >
            <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            Back to Dashboard
          </button>
          <button
            onClick={() => window.print()}
            className="group bg-gradient-to-r from-blue-500 to-teal-600 hover:from-blue-600 hover:to-teal-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold text-base sm:text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 flex items-center justify-center"
          >
            <svg className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path>
            </svg>
            Print Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewLoan;