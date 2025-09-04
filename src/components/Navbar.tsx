import React from 'react'
import { useAuth } from '../contexts/AuthContext'
import ProfileDropdown from './ProfileDropdown'

const Navbar = () => {
  const { user } = useAuth()

  if (!user) return null

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-900">Loan App</h1>
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