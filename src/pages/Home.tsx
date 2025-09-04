import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Heart, 
  DollarSign, 
  FileText, 
  Shield, 
  ArrowRight,
  Users,
  Activity,
  Stethoscope,
  Zap,
  Phone,
  AlertCircle,
  Menu,
  X
} from 'lucide-react';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [showSectorModal, setShowSectorModal] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleSectorSelect = (sector: 'formal' | 'informal') => {
    setShowSectorModal(false);
    navigate(`/loan/request/${sector}`);
  };

  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Emergency Approval",
      description: "Get approved in under 2 minutes for urgent medical needs"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Patient Privacy",
      description: "Your medical and financial data is fully protected"
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: "Healthcare Focus",
      description: "Specialized loans for medical treatments and emergencies"
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: "24/7 Medical Support",
      description: "Round-the-clock assistance for medical loan emergencies"
    }
  ];

  const stats = [
    { number: "15K+", label: "Patients Helped" },
    { number: "$75M+", label: "Medical Loans" },
    { number: "99%", label: "Emergency Approval" },
    { number: "4.9★", label: "Patient Rating" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-teal-50 relative overflow-hidden">
      {/* Enhanced background decorations */}
      <div className="absolute top-0 right-0 -z-10 opacity-30">
        <div className="w-[600px] h-[600px] bg-gradient-to-br from-blue-400 via-purple-400 to-teal-400 rounded-full blur-3xl animate-float"></div>
      </div>
      <div className="absolute bottom-0 left-0 -z-10 opacity-30">
        <div className="w-[500px] h-[500px] bg-gradient-to-tr from-teal-400 via-blue-400 to-purple-400 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      </div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -z-10 opacity-20">
        <div className="w-[800px] h-[400px] bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Emergency Banner */}
      <div className="bg-gradient-to-r from-red-500 via-pink-500 to-orange-500 text-white py-4 px-4 sm:py-3 shadow-lg animate-glow">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-center text-xs sm:text-sm font-medium gap-2 sm:gap-0">
          <AlertCircle className="w-5 h-5 mr-2 animate-bounce-gentle" />
          <span className="font-bold">🚨 Medical Emergency?</span> Get instant approval in under 2 minutes
          <button
            onClick={() => setShowSectorModal(true)}
            className="sm:ml-6 bg-white text-red-600 px-6 py-2 rounded-full text-xs font-bold hover:bg-gray-100 hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl animate-pulse hover:animate-none"
          >
            🏥 Apply Now
          </button>
        </div>
      </div>

      {/* Header */}
      <header className="glass shadow-soft border-b border-white/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4 sm:py-5">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg hover:shadow-glow transition-all duration-300 hover:scale-110 hover:rotate-3">
                <Heart className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gradient-primary">
                  MediLoan
                </h1>
                <p className="text-xs text-gray-600 hidden sm:block font-medium">Healthcare Financial Support</p>
              </div>
            </div>
            <div className="flex items-center">
              <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
                <button 
                  onClick={() => navigate('/loans')} 
                  className="text-gray-700 hover:text-blue-600 font-semibold transition-all duration-200 hover:scale-105 px-3 py-2 rounded-lg hover:bg-blue-50"
                >
                  Loan History
                </button>
                <button 
                  onClick={() => navigate('/loan/pay')} 
                  className="text-gray-700 hover:text-blue-600 font-semibold transition-all duration-200 hover:scale-105 px-3 py-2 rounded-lg hover:bg-blue-50"
                >
                  Pay Loan
                </button>
              </nav>
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="md:hidden p-3 text-gray-600 hover:text-blue-600 transition-all duration-200 hover:bg-blue-50 rounded-xl"
              >
                {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="md:hidden glass border-t border-white/20 animate-slide-down">
            <div className="px-6 py-4 space-y-4">
              <button 
                onClick={() => {
                  navigate('/loans');
                  setShowMobileMenu(false);
                }} 
                className="block w-full text-left text-gray-700 hover:text-blue-600 font-semibold transition-all duration-200 py-3 px-4 rounded-xl hover:bg-blue-50"
              >
                Loan History
              </button>
              <button 
                onClick={() => {
                  navigate('/loan/pay');
                  setShowMobileMenu(false);
                }} 
                className="block w-full text-left text-gray-700 hover:text-blue-600 font-semibold transition-all duration-200 py-3 px-4 rounded-xl hover:bg-blue-50"
              >
                Pay Loan
              </button>
              <button 
                onClick={() => {
                  setShowSectorModal(true);
                  setShowMobileMenu(false);
                }} 
                className="btn-primary w-full text-center"
              >
                Apply for Loan
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="container-fluid section-padding">
          <div className="text-center">
            <div className="inline-flex items-center px-6 py-3 glass rounded-full text-blue-700 text-sm font-bold mb-8 shadow-lg hover:shadow-glow transition-all duration-300 hover:scale-105">
              <Stethoscope className="w-4 h-4 mr-2" />
              ✨ Trusted by 15,000+ patients worldwide
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 sm:mb-8 leading-tight text-balance">
              <span className="block mb-2">Medical Care</span>
              <span className="block text-gradient-primary animate-glow">
                When You Need It
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl lg:text-2xl text-gray-700 mb-10 sm:mb-12 max-w-4xl mx-auto leading-relaxed px-4 sm:px-0 font-medium text-balance">
              Don't let financial barriers prevent you from getting the medical care you need. 
              <span className="text-gradient-secondary font-bold">Quick, compassionate loans</span> for patients and families facing health emergencies.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 justify-center items-center mb-16 sm:mb-20 px-4 sm:px-0">
              <button
                onClick={() => setShowSectorModal(true)}
                className="group bg-gradient-to-r from-blue-500 via-purple-500 to-teal-600 text-white px-8 sm:px-10 py-4 sm:py-5 rounded-2xl font-bold text-lg sm:text-xl shadow-xl hover:shadow-2xl transform hover:-translate-y-3 hover:scale-110 transition-all duration-400 flex items-center w-full sm:w-auto justify-center animate-glow hover:animate-none relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center">
                  🏥 Get Medical Loan
                  <Heart className="w-6 h-6 ml-3 group-hover:scale-125 group-hover:rotate-12 transition-all duration-300" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              </button>

              <button
                onClick={() => navigate('/assess-medical-needs')}
                className="group bg-gradient-to-r from-teal-500 via-green-500 to-emerald-600 text-white px-8 sm:px-10 py-4 sm:py-5 rounded-2xl font-bold text-lg sm:text-xl shadow-xl hover:shadow-2xl transform hover:-translate-y-3 hover:scale-110 transition-all duration-400 flex items-center w-full sm:w-auto justify-center relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center">
                  <Stethoscope className="w-6 h-6 mr-3 group-hover:scale-125 group-hover:rotate-12 transition-all duration-300" />
                  🔍 Assess Medical Needs
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              </button>

              <button
                onClick={() => navigate('/loan/pay')}
                className="group glass text-gray-700 px-8 sm:px-10 py-4 sm:py-5 rounded-2xl font-bold text-lg sm:text-xl border-2 border-gray-200/50 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50/50 transition-all duration-400 flex items-center w-full sm:w-auto justify-center shadow-xl hover:shadow-2xl transform hover:-translate-y-3 hover:scale-110 relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center">
                  <DollarSign className="w-6 h-6 mr-3 group-hover:scale-125 group-hover:rotate-12 transition-all duration-300" />
                  💳 Pay Medical Loan
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/10 to-blue-500/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-16 max-w-6xl mx-auto px-4 sm:px-0">
              {stats.map((stat, index) => (
                <div key={index} className="text-center group">
                  <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-2 sm:mb-3 group-hover:text-gradient-primary transition-all duration-300 group-hover:scale-110">
                    {stat.number}
                  </div>
                  <div className="text-sm sm:text-base lg:text-lg text-gray-700 font-semibold">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding glass animate-fade-in relative">
        <div className="container-fluid">
          <div className="text-center mb-20">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 animate-slide-up text-balance">
              Why Choose MediLoan?
            </h2>
            <p className="text-xl sm:text-2xl text-gray-700 max-w-4xl mx-auto animate-slide-up delay-200 font-medium text-balance">
              We understand medical emergencies can't wait. <span className="text-gradient-secondary font-bold">Fast, compassionate financial support</span> when health matters most.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
            {features.map((feature, index) => (
              <div key={index} className={`group card-interactive p-10 rounded-3xl bg-gradient-to-br from-white/80 to-gray-50/80 hover:from-white hover:to-blue-50/50 hover:shadow-2xl transition-all duration-500 border border-gray-200/50 hover:border-blue-300/50 transform hover:-translate-y-4 hover:scale-110 animate-slide-up hover:shadow-glow`} style={{ animationDelay: `${index * 150}ms` }}>
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 via-purple-500 to-teal-600 rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-125 group-hover:rotate-12 transition-all duration-400 shadow-xl group-hover:shadow-glow">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-gradient-primary transition-all duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-700 group-hover:text-gray-900 transition-all duration-300 font-medium leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="section-padding bg-gradient-to-br from-blue-50/80 via-indigo-50/80 to-teal-50/80 relative">
        <div className="container-fluid">
          <div className="text-center mb-20">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 text-balance">
              How It Works
            </h2>
            <p className="text-xl sm:text-2xl text-gray-700 font-medium">
              Get your medical loan in <span className="text-gradient-primary font-bold">3 simple steps</span>
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-16 relative">
            {[
              {
                step: "01",
                title: "🏥 Tell Us Your Need",
                description: "Describe your medical situation and select your employment type for personalized requirements",
                color: "from-blue-500 to-blue-600"
              },
              {
                step: "02", 
                title: "📋 Upload Medical & Financial Docs",
                description: "Provide medical bills, insurance info, and basic financial documents",
                color: "from-purple-500 to-purple-600"
              },
              {
                step: "03",
                title: "⚡ Get Emergency Approval",
                description: "Receive approval within 2 minutes for urgent cases and get funds immediately",
                color: "from-teal-500 to-teal-600"
              }
            ].map((step, index) => (
              <div key={index} className="relative">
                <div className="card p-12 rounded-3xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4 hover:scale-105 border border-gray-200/50 hover:border-blue-300/50 group relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100/50 to-teal-100/50 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-500"></div>
                  <div className="relative z-10">
                    <div className={`text-6xl font-bold bg-gradient-to-r ${step.color} bg-clip-text text-transparent mb-6 group-hover:scale-110 transition-transform duration-300`}>{step.step}</div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-gradient-primary transition-all duration-300">{step.title}</h3>
                    <p className="text-gray-700 font-medium leading-relaxed text-lg">{step.description}</p>
                  </div>
                </div>
                {index < 2 && (
                  <div className="hidden md:flex absolute top-1/2 -right-8 transform -translate-y-1/2 z-10 items-center justify-center">
                    <div className="glass rounded-full p-4 shadow-lg border border-white/30 hover:scale-110 transition-all duration-300 hover:shadow-glow">
                      <ArrowRight className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gradient-to-r from-blue-500 via-purple-600 to-teal-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 max-w-5xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-8 text-balance animate-glow">
            Need Medical Care Now?
          </h2>
          <p className="text-2xl sm:text-3xl text-blue-100 mb-12 font-medium text-balance">
            Join <span className="font-bold text-white">thousands of patients</span> who got the medical care they needed with MediLoan
          </p>
          <div className="flex flex-col sm:flex-row gap-8 justify-center">
            <button
              onClick={() => setShowSectorModal(true)}
              className="group bg-white text-blue-600 px-10 py-5 rounded-2xl font-bold text-xl hover:bg-gray-50 transition-all duration-300 flex items-center justify-center shadow-xl hover:shadow-2xl transform hover:-translate-y-2 hover:scale-110 relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center">
                🚀 Apply for Medical Loan
                <Heart className="w-6 h-6 ml-3 group-hover:scale-125 group-hover:rotate-12 transition-all duration-300" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/10 to-blue-500/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            </button>
            <button
              onClick={() => navigate('/')}
              className="group border-3 border-white text-white px-10 py-5 rounded-2xl font-bold text-xl hover:bg-white hover:text-blue-600 transition-all duration-300 flex items-center justify-center shadow-xl hover:shadow-2xl transform hover:-translate-y-2 hover:scale-110 relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center">
                <FileText className="w-6 h-6 mr-3 group-hover:scale-125 group-hover:rotate-12 transition-all duration-300" />
                📄 Upload Medical Bills
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 to-teal-900/20"></div>
        <div className="relative z-10 container-fluid">
          <div className="grid md:grid-cols-4 gap-12">
            <div className="col-span-2 space-y-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold">MediLoan</span>
              </div>
              <p className="text-gray-300 mb-6 text-lg leading-relaxed">
                Ensuring no one is denied medical care due to financial constraints. Your health is our priority.
              </p>
              <div className="flex space-x-6">
                {['Facebook', 'Twitter', 'LinkedIn'].map((social) => (
                  <button key={social} className="text-gray-400 hover:text-white transition-all duration-200 hover:scale-110 font-medium">
                    {social}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-bold mb-6 text-lg">Services</h3>
              <ul className="space-y-4 text-gray-300">
                <li><button onClick={() => setShowSectorModal(true)} className="hover:text-white transition-all duration-200 hover:translate-x-2 font-medium">Medical Loans</button></li>
                <li><button onClick={() => navigate('/loan/pay')} className="hover:text-white transition-all duration-200 hover:translate-x-2 font-medium">Payment Portal</button></li>
                <li><button onClick={() => navigate('/loans')} className="hover:text-white transition-all duration-200 hover:translate-x-2 font-medium">Loan History</button></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-6 text-lg">Support</h3>
              <ul className="space-y-4 text-gray-300">
                <li><a href="#" className="hover:text-white transition-all duration-200 hover:translate-x-2 font-medium">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-all duration-200 hover:translate-x-2 font-medium">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-all duration-200 hover:translate-x-2 font-medium">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700/50 mt-12 pt-8 text-center text-gray-400">
            <p className="font-medium">&copy; 2025 MediLoan. All rights reserved. Healthcare Financial Solutions.</p>
          </div>
        </div>
      </footer>

      {/* Sector Selection Modal */}
      {showSectorModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="glass rounded-3xl sm:rounded-4xl shadow-2xl max-w-lg w-full p-8 sm:p-10 lg:p-12 transform animate-scale-in border border-white/30">
            <div className="text-center mb-8">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-blue-500 via-purple-500 to-teal-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl animate-glow">
                <Activity className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 text-balance">Select Your Employment Type</h3>
              <p className="text-base sm:text-lg text-gray-700 font-medium text-balance">This helps us customize your medical loan application process</p>
            </div>
            
            <div className="space-y-5 sm:space-y-6 mb-8">
              <button
                onClick={() => handleSectorSelect('formal')}
                className="w-full p-6 sm:p-8 text-left border-2 border-gray-200/50 rounded-3xl hover:border-blue-400 hover:bg-blue-50/50 transition-all duration-300 group shadow-lg hover:shadow-xl transform hover:-translate-y-2 hover:scale-105"
              >
                <div className="flex items-start space-x-6">
                  <div className="w-14 h-14 bg-gradient-to-r from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center group-hover:from-blue-200 group-hover:to-blue-300 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-lg">
                    <Activity className="w-7 h-7 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-gray-900 mb-2 text-lg">💼 Employed/Salaried</div>
                    <div className="text-sm text-gray-700 font-medium leading-relaxed">
                      Regular job with salary, bank statements, and payslips available
                    </div>
                  </div>
                </div>
              </button>
              
              <button
                onClick={() => handleSectorSelect('informal')}
                className="w-full p-6 sm:p-8 text-left border-2 border-gray-200/50 rounded-3xl hover:border-teal-400 hover:bg-teal-50/50 transition-all duration-300 group shadow-lg hover:shadow-xl transform hover:-translate-y-2 hover:scale-105"
              >
                <div className="flex items-start space-x-6">
                  <div className="w-14 h-14 bg-gradient-to-r from-teal-100 to-teal-200 rounded-2xl flex items-center justify-center group-hover:from-teal-200 group-hover:to-teal-300 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-lg">
                    <Users className="w-7 h-7 text-teal-600" />
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-gray-900 mb-2 text-lg">🏪 Self-Employed/Freelance</div>
                    <div className="text-sm text-gray-700 font-medium leading-relaxed">
                      Own business, freelance work, or irregular income
                    </div>
                  </div>
                </div>
              </button>
            </div>
            
            <button
              onClick={() => setShowSectorModal(false)}
              className="w-full py-3 sm:py-4 text-base sm:text-lg text-gray-600 hover:text-gray-800 font-semibold transition-all duration-200 hover:scale-105"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;