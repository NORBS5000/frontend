import React from 'react'
import { useAuth } from '../contexts/AuthContext'
import ProfileDropdown from './ProfileDropdown'
import { Heart, Bell, Search } from 'lucide-react'

const Navbar = () => {
  const { user } = useAuth()

  if (!user) return null

  return (
    <nav className="glass sticky top-0 z-50 border-b border-white/20 shadow-soft">
      <div className="container-fluid">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg hover:shadow-glow transition-all duration-300 hover:scale-110">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gradient-primary">MediLoan</h1>
              <p className="text-xs text-gray-600 hidden sm:block font-medium">Healthcare Financial Support</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-3">
              <div className="relative">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 bg-white/60 backdrop-blur-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 w-64"
                />
              </div>
              <button className="relative p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
              </button>
            </div>
            <ProfileDropdown />
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar