
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
      {/* Emergency Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-teal-600 text-white py-3 px-4 sm:py-2 animate-pulse">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-center text-xs sm:text-sm font-medium gap-2 sm:gap-0">
          <AlertCircle className="w-4 h-4 mr-2 animate-bounce" />
          Medical Emergency? Get instant approval in under 2 minutes
          <button
            onClick={() => setShowSectorModal(true)}
            className="sm:ml-4 bg-white text-blue-600 px-4 py-2 rounded-full text-xs font-semibold hover:bg-gray-100 hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Apply Now
          </button>
        </div>
      </div>

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3 sm:py-4">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-teal-600 rounded-xl flex items-center justify-center">
                <Heart className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-500 to-teal-600 bg-clip-text text-transparent">
                  MediLoan
                </h1>
                <p className="text-xs text-gray-500 hidden sm:block">Healthcare Financial Support</p>
              </div>
            </div>
            <div className="flex items-center">
              <nav className="hidden md:flex items-center space-x-4 lg:space-x-6">
                <button 
                  onClick={() => navigate('/loans')} 
                  className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
                >
                  Loan History
                </button>
                <button 
                  onClick={() => navigate('/loan/pay')} 
                  className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
                >
                  Pay Loan
                </button>
              </nav>
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="md:hidden p-2 text-gray-600 hover:text-blue-600 transition-colors"
              >
                {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="md:hidden bg-white border-t border-gray-100">
            <div className="px-4 py-3 space-y-3">
              <button 
                onClick={() => {
                  navigate('/loans');
                  setShowMobileMenu(false);
                }} 
                className="block w-full text-left text-gray-600 hover:text-blue-600 font-medium transition-colors py-2"
              >
                Loan History
              </button>
              <button 
                onClick={() => {
                  navigate('/loan/pay');
                  setShowMobileMenu(false);
                }} 
                className="block w-full text-left text-gray-600 hover:text-blue-600 font-medium transition-colors py-2"
              >
                Pay Loan
              </button>
              <button 
                onClick={() => {
                  setShowSectorModal(true);
                  setShowMobileMenu(false);
                }} 
                className="block w-full text-left bg-blue-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Apply for Loan
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 rounded-full text-blue-700 text-sm font-medium mb-6">
              <Stethoscope className="w-4 h-4 mr-2" />
              Trusted by 15,000+ patients
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
              Medical Care
              <span className="block bg-gradient-to-r from-blue-500 to-teal-600 bg-clip-text text-transparent">
                When You Need It
              </span>
            </h1>
            
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 mb-8 sm:mb-10 max-w-3xl mx-auto leading-relaxed px-4 sm:px-0">
              Don't let financial barriers prevent you from getting the medical care you need. 
              Quick, compassionate loans for patients and families facing health emergencies.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-12 sm:mb-16 px-4 sm:px-0">
              <button
                onClick={() => setShowSectorModal(true)}
                className="group bg-gradient-to-r from-blue-500 to-teal-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold text-base sm:text-lg shadow-lg hover:shadow-2xl transform hover:-translate-y-2 hover:scale-105 transition-all duration-300 flex items-center w-full sm:w-auto justify-center animate-pulse hover:animate-none"
              >
                Get Medical Loan
                <Heart className="w-5 h-5 ml-2 group-hover:scale-125 group-hover:rotate-12 transition-all duration-300" />
              </button>

              <button
                onClick={() => navigate('/assess-medical-needs')}
                className="group bg-gradient-to-r from-teal-500 to-green-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold text-base sm:text-lg shadow-lg hover:shadow-2xl transform hover:-translate-y-2 hover:scale-105 transition-all duration-300 flex items-center w-full sm:w-auto justify-center"
              >
                <Stethoscope className="w-5 h-5 mr-2 group-hover:scale-125 group-hover:rotate-12 transition-all duration-300" />
                Assess Medical Needs
              </button>

              <button
                onClick={() => navigate('/loan/pay')}
                className="group bg-white text-gray-700 px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold text-base sm:text-lg border-2 border-gray-200 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 flex items-center w-full sm:w-auto justify-center shadow-lg hover:shadow-2xl transform hover:-translate-y-2 hover:scale-105"
              >
                <DollarSign className="w-5 h-5 mr-2 group-hover:scale-125 group-hover:rotate-12 transition-all duration-300" />
                Pay Medical Loan
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-12 max-w-5xl mx-auto px-4 sm:px-0">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-1 sm:mb-2">
                    {stat.number}
                  </div>
                  <div className="text-sm sm:text-base text-gray-600 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Background decoration */}
        <div className="absolute top-0 right-0 -z-10 opacity-20">
          <div className="w-96 h-96 bg-gradient-to-br from-blue-400 to-teal-400 rounded-full blur-3xl"></div>
        </div>
        <div className="absolute bottom-0 left-0 -z-10 opacity-20">
          <div className="w-96 h-96 bg-gradient-to-tr from-teal-400 to-blue-400 rounded-full blur-3xl"></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white animate-fade-in">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 animate-slide-up">
              Why Choose MediLoan?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto animate-slide-up animation-delay-200">
              We understand medical emergencies can't wait. Fast, compassionate financial support when health matters most.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className={`group p-8 rounded-3xl bg-gray-50 hover:bg-white hover:shadow-2xl transition-all duration-500 border border-transparent hover:border-blue-100 transform hover:-translate-y-2 hover:scale-105 animate-slide-up`} style={{ animationDelay: `${index * 100}ms` }}>
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-teal-600 rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-125 group-hover:rotate-6 transition-all duration-300 shadow-lg group-hover:shadow-xl">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600 group-hover:text-gray-800 transition-colors">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 bg-gradient-to-r from-blue-50 to-teal-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Get your medical loan in 3 simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 relative">
            {[
              {
                step: "01",
                title: "Tell Us Your Need",
                description: "Describe your medical situation and select your employment type for personalized requirements"
              },
              {
                step: "02", 
                title: "Upload Medical & Financial Docs",
                description: "Provide medical bills, insurance info, and basic financial documents"
              },
              {
                step: "03",
                title: "Get Emergency Approval",
                description: "Receive approval within 2 minutes for urgent cases and get funds immediately"
              }
            ].map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-white p-10 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
                  <div className="text-5xl font-bold text-blue-100 mb-4">{step.step}</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
                {index < 2 && (
                  <div className="hidden md:flex absolute top-1/2 -right-6 transform -translate-y-1/2 z-10 items-center justify-center">
                    <div className="bg-white rounded-full p-2 shadow-md border">
                      <ArrowRight className="w-4 h-4 text-blue-500" />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-500 to-teal-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            Need Medical Care Now?
          </h2>
          <p className="text-xl text-blue-100 mb-10">
            Join thousands of patients who got the medical care they needed with MediLoan
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button
              onClick={() => setShowSectorModal(true)}
              className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-50 transition-colors flex items-center justify-center"
            >
              Apply for Medical Loan
              <Heart className="w-5 h-5 ml-2" />
            </button>
            <button
              onClick={() => navigate('/')}
              className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white hover:text-blue-600 transition-colors flex items-center justify-center"
            >
              <FileText className="w-5 h-5 mr-2" />
              Upload Medical Bills
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-teal-600 rounded-lg flex items-center justify-center">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">MediLoan</span>
              </div>
              <p className="text-gray-400 mb-4">
                Ensuring no one is denied medical care due to financial constraints. Your health is our priority.
              </p>
              <div className="flex space-x-4">
                {['Facebook', 'Twitter', 'LinkedIn'].map((social) => (
                  <button key={social} className="text-gray-400 hover:text-white transition-colors">
                    {social}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Services</h3>
              <ul className="space-y-2 text-gray-400">
                <li><button onClick={() => setShowSectorModal(true)} className="hover:text-white transition-colors">Medical Loans</button></li>
                <li><button onClick={() => navigate('/loan/pay')} className="hover:text-white transition-colors">Payment Portal</button></li>
                <li><button onClick={() => navigate('/loans')} className="hover:text-white transition-colors">Loan History</button></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 MediLoan. All rights reserved. Healthcare Financial Solutions.</p>
          </div>
        </div>
      </footer>

      {/* Sector Selection Modal */}
      {showSectorModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl max-w-sm sm:max-w-md w-full p-6 sm:p-8 lg:p-10 transform animate-in fade-in duration-200 border border-gray-100">
            <div className="text-center mb-6">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Activity className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Select Your Employment Type</h3>
              <p className="text-sm sm:text-base text-gray-600">This helps us customize your medical loan application process</p>
            </div>
            
            <div className="space-y-3 sm:space-y-4 mb-6">
              <button
                onClick={() => handleSectorSelect('formal')}
                className="w-full p-4 sm:p-6 text-left border-2 border-gray-200 rounded-2xl hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 group shadow-sm hover:shadow-md"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                    <Activity className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900 mb-1">Employed/Salaried</div>
                    <div className="text-sm text-gray-600">
                      Regular job with salary, bank statements, and payslips available
                    </div>
                  </div>
                </div>
              </button>
              
              <button
                onClick={() => handleSectorSelect('informal')}
                className="w-full p-4 sm:p-6 text-left border-2 border-gray-200 rounded-2xl hover:border-teal-300 hover:bg-teal-50 transition-all duration-200 group shadow-sm hover:shadow-md"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center group-hover:bg-teal-200 transition-colors">
                    <Users className="w-6 h-6 text-teal-600" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900 mb-1">Self-Employed/Freelance</div>
                    <div className="text-sm text-gray-600">
                      Own business, freelance work, or irregular income
                    </div>
                  </div>
                </div>
              </button>
            </div>
            
            <button
              onClick={() => setShowSectorModal(false)}
              className="w-full py-2 sm:py-3 text-sm sm:text-base text-gray-600 hover:text-gray-800 font-medium transition-colors"
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