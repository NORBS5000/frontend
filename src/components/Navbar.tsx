import React from 'react'
import { useAuth } from '../contexts/AuthContext'
import ProfileDropdown from './ProfileDropdown'
import { Heart } from 'lucide-react'

const Navbar = () => {
  const { user } = useAuth()

  if (!user) return null

  return (
    <nav className="bg-gradient-to-r from-blue-500 to-teal-600 shadow-lg border-b border-blue-400/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">MediLoan</h1>
              <p className="text-xs text-blue-100 hidden sm:block">Healthcare Financial Support</p>
            </div>
          </div>

          <div className="flex items-center">
            <ProfileDropdown />
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar