'use client'

import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from './../context/AuthContext'

import {
  Dialog,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  PopoverGroup,
} from '@headlessui/react'
import {
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { ChevronDownIcon, PhoneIcon, PlayCircleIcon } from '@heroicons/react/20/solid'


const callsToAction = [
  { name: 'Watch demo', href: '#', icon: PlayCircleIcon },
  { name: 'Contact sales', href: '#', icon: PhoneIcon },
]

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  // Hide navbar on login or register pages
  if (location.pathname === '/login' || location.pathname === '/register') {
    return null
  }

  return (
    <header className="bg-white shadow-sm">
      <nav aria-label="Global" className="mx-auto flex max-w-7xl items-center justify-between p-4 sm:p-8 lg:px-2">
        {/* Logo */}
        <div className="flex lg:flex-1">
          <Link to="/" className="-m-1.5 text-2xl sm:text-5xl font-semibold">
            TravelCo.
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon aria-hidden="true" className="h-6 w-6" />
          </button>
        </div>

        {/* Desktop Navigation */}
        <PopoverGroup className="hidden lg:flex lg:gap-x-12">
          {/* Main Navigation Links */}
          <Link to="/"   className="relative text-sm/6 font-semibold text-gray-900 after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[2px] after:bg-blue-500 after:transition-all after:duration-300 hover:after:w-full"
          >
            Home
          </Link>
          <Link to="/packages" className="relative text-sm/6 font-semibold text-gray-900 after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[2px] after:bg-blue-500 after:transition-all after:duration-300 hover:after:w-full"
          >
            Packages
          </Link>

            <Link
            to="contact" // The ID of the section to scroll to
            smooth={true} // Enables smooth scrolling
            duration={500} // Duration of the scroll in milliseconds
            offset={-70} // Offset for sticky headers, adjust as needed
            className="relative text-sm/6 font-semibold text-gray-900 after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[2px] after:bg-blue-500 after:transition-all after:duration-300 hover:after:w-full"
          >
            Contact Us
          </Link>
          <Link to="/blogs"   className="relative text-sm/6 font-semibold text-gray-900 after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[2px] after:bg-blue-500 after:transition-all after:duration-300 hover:after:w-full"
          >
            Blogs
          </Link>
        </PopoverGroup>

        {/* Authentication/User Section */}
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          {user ? (
            <div className="flex items-center space-x-4">
              <span className="text-sm/6 text-gray-900">
                Hi, <strong>{user.name || user.username || 'User'}</strong>
              </span>
              <button
                onClick={() => {
                  logout()
                  navigate('/login')
                }}
                className="text-sm/6 font-semibold text-gray-900 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex space-x-4">
              <button
                onClick={() => navigate('/login')}
                className="text-sm/6 font-semibold text-gray-900 bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
              >
                Log in
              </button>
              <button
                onClick={() => navigate('/register')}
                className="text-sm/6 font-semibold text-gray-900 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
              >
                Register
              </button>
            </div>
          )}
        </div>

        {/* Mobile Menu Dialog */}
        <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
          <div className="fixed inset-0 z-10" />
          <DialogPanel className="fixed inset-y-0 right-0 z-10 w-full max-w-xs sm:max-w-sm overflow-y-auto bg-white px-4 py-6 sm:px-6 sm:py-6 sm:ring-1 sm:ring-gray-900/10">
            <div className="flex items-center justify-between">
              <Link to="/" className="-m-1.5 p-1.5 text-2xl font-semibold">
                TravelCo.
              </Link>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="-m-2.5 rounded-md p-2.5 text-gray-700"
              >
                <span className="sr-only">Close menu</span>
                <XMarkIcon aria-hidden="true" className="size-6" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-500/10">
                <div className="space-y-2 py-6">
                  {/* Mobile Navigation Links */}
                  <Link
                    to="/"
                    className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                  >
                    Home
                  </Link>
                  <Link
                    to="/packages"
                    className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                  >
                    Packages
                  </Link>
                  <Link
                    to="/blogs"
                    className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                  >
                    Blogs
                  </Link>
                </div>

                {/* Mobile Authentication Section */}
                <div className="py-6">
                  {user ? (
                    <>
                      <span className="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-gray-900">
                        Hi, <strong>{user.name || user.username || 'User'}</strong>
                      </span>
                      <button
                        onClick={() => {
                          logout()
                          navigate('/login')
                          setMobileMenuOpen(false)
                        }}
                        className="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-gray-900 hover:bg-gray-50 bg-red-100"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          navigate('/login')
                          setMobileMenuOpen(false)
                        }}
                        className="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                      >
                        Log in
                      </button>
                      <button
                        onClick={() => {
                          navigate('/register')
                          setMobileMenuOpen(false)
                        }}
                        className="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-gray-900 hover:bg-gray-50 bg-green-100"
                      >
                        Register
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </DialogPanel>
        </Dialog>
      </nav>
    </header>
  )
}