import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface LoanApplication {
  id: string;
  user_id: string;
  sector: string;
  amount_requested: number;
  repayment_date: string;
  status: string;
  created_at: string;
  user_email?: string;
  user_name?: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState<LoanApplication[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0
  });
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const [searchTerm, setSearchTerm] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  useEffect(() => {
    fetchApplications();

    // Set up real-time subscription
    const subscription = supabase
      .channel('loan_applications_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'loan_applications' },
        (payload) => {
          console.log('Real-time update:', payload);
          fetchApplications(); // Refresh data when changes occur
        }
      )
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, [sortBy, sortOrder]);

  const fetchApplications = async () => {
    try {
      const { data, error } = await supabase
        .from('loan_applications')
        .select('*')
        .order(sortBy, { ascending: sortOrder === 'asc' });

      if (error) throw error;

      // Get profiles separately
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, email, full_name');

      const appsWithEmail = data.map(app => {
        const profile = profiles?.find(p => p.id === app.user_id);
        return {
          ...app,
          user_email: profile?.email || 'Unknown',
          user_name: profile?.full_name || 'Unknown User'
        };
      });

      setApplications(appsWithEmail);

      // Calculate stats
      const total = appsWithEmail.length;
      const pending = appsWithEmail.filter(app => app.status === 'pending').length;
      const approved = appsWithEmail.filter(app => app.status === 'approved').length;
      const rejected = appsWithEmail.filter(app => app.status === 'rejected').length;

      setStats({ total, pending, approved, rejected });
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      // Validate status to prevent injection
      const validStatuses = ['pending', 'approved', 'rejected'];
      if (!validStatuses.includes(status)) {
        throw new Error('Invalid status value');
      }

      // Validate UUID format for id
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(id)) {
        throw new Error('Invalid ID format');
      }

      setUpdatingStatus(id);

      // Update UI immediately
      setApplications(prev =>
        prev.map(app =>
          app.id === id ? { ...app, status } : app
        )
      );

      const { error } = await supabase
        .from('loan_applications')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating status');
      // Revert UI change on error
      fetchApplications();
    } finally {
      setUpdatingStatus(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 flex items-center justify-center">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-gray-600 mt-4 text-center">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-teal-50 p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 -z-10 opacity-20">
        <div className="w-[600px] h-[600px] bg-gradient-to-br from-purple-400 via-blue-400 to-teal-400 rounded-full blur-3xl animate-float"></div>
      </div>
      <div className="absolute bottom-0 left-0 -z-10 opacity-20">
        <div className="w-[500px] h-[500px] bg-gradient-to-tr from-teal-400 via-purple-400 to-blue-400 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <div className="text-center">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gradient-primary mb-4 animate-glow">
              Loan Dashboard
            </h1>
            <p className="text-xl sm:text-2xl text-gray-700 font-medium">Manage and review loan applications</p>
          </div>
          <div className="mt-10 flex flex-col lg:flex-row gap-6">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search applications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input pl-12 pr-12 py-4 text-lg shadow-lg focus:shadow-xl"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-2 transition-all duration-200 hover:scale-110"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              )}
            </div>
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('-');
                setSortBy(field);
                setSortOrder(order);
              }}
              className="form-input py-4 text-lg shadow-lg focus:shadow-xl font-medium"
            >
              <option value="created_at-desc">📅 Newest First</option>
              <option value="created_at-asc">📅 Oldest First</option>
              <option value="amount_requested-desc">💰 Highest Amount</option>
              <option value="amount_requested-asc">💰 Lowest Amount</option>
              <option value="status-asc">📊 Status A-Z</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div className="group bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl shadow-lg hover:shadow-xl p-6 border border-blue-200/50 transform hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center">
              <div className="p-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
              </div>
              <div className="ml-5">
                <p className="text-sm font-bold text-blue-700 uppercase tracking-wide">Total Applications</p>
                <p className="text-4xl font-bold text-blue-900 group-hover:scale-110 transition-transform duration-300">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="group bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl shadow-lg hover:shadow-xl p-6 border border-yellow-200/50 transform hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center">
              <div className="p-4 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-2xl shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div className="ml-5">
                <p className="text-sm font-bold text-yellow-700 uppercase tracking-wide">Pending</p>
                <p className="text-4xl font-bold text-yellow-900 group-hover:scale-110 transition-transform duration-300">{stats.pending}</p>
              </div>
            </div>
          </div>

          <div className="group bg-gradient-to-br from-green-50 to-green-100 rounded-2xl shadow-lg hover:shadow-xl p-6 border border-green-200/50 transform hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center">
              <div className="p-4 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div className="ml-5">
                <p className="text-sm font-bold text-green-700 uppercase tracking-wide">Approved</p>
                <p className="text-4xl font-bold text-green-900 group-hover:scale-110 transition-transform duration-300">{stats.approved}</p>
              </div>
            </div>
          </div>

          <div className="group bg-gradient-to-br from-red-50 to-red-100 rounded-2xl shadow-lg hover:shadow-xl p-6 border border-red-200/50 transform hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center">
              <div className="p-4 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div className="ml-5">
                <p className="text-sm font-bold text-red-700 uppercase tracking-wide">Rejected</p>
                <p className="text-4xl font-bold text-red-900 group-hover:scale-110 transition-transform duration-300">{stats.rejected}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="glass rounded-3xl shadow-2xl border border-white/30 overflow-hidden">
          <div className="px-8 py-6 border-b border-gray-200/50 bg-gradient-to-r from-blue-50/80 to-teal-50/80">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Recent Applications</h2>
            <p className="text-gray-700 text-lg font-medium">Review and manage loan applications</p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200/50 text-sm sm:text-base">
              <thead className="bg-gradient-to-r from-blue-50/80 to-teal-50/80">
                <tr>
                  <th className="px-8 py-5 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">Loan ID</th>
                  <th className="px-8 py-5 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">Applicant</th>
                  <th className="px-8 py-5 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">Amount</th>
                  <th className="px-8 py-5 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">Sector</th>
                  <th className="px-8 py-5 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">Date</th>
                  <th className="px-8 py-5 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">Status</th>
                  <th className="px-8 py-5 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white/50 divide-y divide-gray-100">
                {applications.filter(app =>
                  app.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  app.user_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  app.id.toLowerCase().includes(searchTerm.toLowerCase())
                ).map((app) => (
                  <tr key={app.id} className="hover:bg-gradient-to-r hover:from-blue-50/80 hover:to-teal-50/80 transition-all duration-300 hover:shadow-lg">
                    <td className="px-8 py-5 whitespace-nowrap text-sm text-gray-900">
                      <button
                        onClick={() => navigator.clipboard.writeText(app.id)}
                        className="flex items-center gap-3 hover:bg-blue-100/80 px-4 py-3 rounded-xl transition-all duration-300 hover:shadow-md hover:scale-105"
                        title="Click to copy full ID"
                      >
                        <span className="font-mono text-sm font-bold">{app.id.slice(0, 8)}...</span>
                        <svg className="h-5 w-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                        </svg>
                      </button>
                    </td>
                    <td className="px-8 py-5 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-14 w-14 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-teal-600 flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300">
                          <span className="text-white font-bold text-lg">
                            {app.user_name?.charAt(0).toUpperCase() || 'U'}
                          </span>
                        </div>
                        <div className="ml-5">
                          <div className="text-base font-bold text-gray-900">{app.user_name}</div>
                          <div className="text-sm text-gray-600 font-medium">{app.user_email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5 whitespace-nowrap text-lg font-bold text-gray-900">
                      ${app.amount_requested.toLocaleString()}
                    </td>
                    <td className="px-8 py-5 whitespace-nowrap">
                      <span className={`inline-flex px-4 py-2 text-sm font-bold rounded-full shadow-lg ${
                        app.sector === 'formal' ? 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800' : 'bg-gradient-to-r from-green-100 to-green-200 text-green-800'
                      }`}>
                        {app.sector}
                      </span>
                    </td>
                    <td className="px-8 py-5 whitespace-nowrap text-sm text-gray-700 font-medium">
                      {new Date(app.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-8 py-5 whitespace-nowrap">
                      <span className={`inline-flex px-4 py-2 text-sm font-bold rounded-full shadow-lg ${getStatusColor(app.status)}`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="px-6 sm:px-8 py-5 whitespace-nowrap text-sm font-medium">
                      <div className="flex flex-col sm:flex-row gap-3">
                        <button
                          onClick={() => navigate(`/review/${app.id}`)}
                          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 hover:scale-105"
                        >
                          👁️ Review
                        </button>
                        {app.status === 'pending' && (
                          <>
                            <button
                              onClick={() => updateStatus(app.id, 'approved')}
                              disabled={updatingStatus === app.id}
                              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-4 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 hover:scale-105 disabled:transform-none disabled:hover:shadow-none flex items-center justify-center"
                            >
                              {updatingStatus === app.id ? (
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                              ) : (
                                '✅ Approve'
                              )}
                            </button>
                            <button
                              onClick={() => updateStatus(app.id, 'rejected')}
                              disabled={updatingStatus === app.id}
                              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-4 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 hover:scale-105 disabled:transform-none disabled:hover:shadow-none flex items-center justify-center"
                            >
                              {updatingStatus === app.id ? (
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                              ) : (
                                '❌ Reject'
                              )}
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;