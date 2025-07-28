'use client'

import Link from 'next/link'
import { useAuth } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { 
  Settings, 
  LogOut, 
  Shield,
  Menu,
  PlusCircle,
  BookOpen,
  Home,
  Sparkles,
  User,
  BarChart3,
  FileText,
  Bell,
  Search,
  X
} from 'lucide-react'
import { useState } from 'react'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'

export function Navigation() {
  const { user, logout, isAdmin } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/blog', label: 'Blog', icon: BookOpen },
  ]

  if (user) {
    navItems.push(
      { href: '/create-post', label: 'Create', icon: PlusCircle },
      { href: '/admin', label: 'Dashboard', icon: BarChart3 }
    )
  }

  const UserMenu = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-12 w-12 rounded-full p-0 hover:bg-white/10 transition-all duration-300 group">
          <div className="w-10 h-10 bg-gradient-brand rounded-full flex items-center justify-center ring-2 ring-white/20 group-hover:ring-white/40 transition-all">
            <User className="w-5 h-5 text-white" />
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64 bg-white/95 backdrop-blur-lg border border-white/20 shadow-xl rounded-2xl p-2" align="end">
        <div className="px-4 py-3 bg-gradient-to-r from-brand-50 to-accent-50 rounded-xl mb-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-brand rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-dark-900 truncate">
                {user?.firstName || user?.username || 'User'}
              </p>
              <p className="text-xs text-dark-600 truncate">
                {user?.email}
              </p>
            </div>
          </div>
          <div className="flex gap-2 mt-3">
            <Badge variant="secondary" className="text-xs px-2 py-1 bg-brand-100 text-brand-700 border-brand-200">
              {user?.role}
            </Badge>
            {isAdmin && (
              <Badge variant="secondary" className="text-xs px-2 py-1 bg-accent-100 text-accent-700 border-accent-200">
                <Shield className="w-3 h-3 mr-1" />
                Admin
              </Badge>
            )}
          </div>
        </div>
        
        <DropdownMenuItem asChild>
          <Link href="/create-post" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-brand-50 transition-colors group">
            <PlusCircle className="w-4 h-4 text-brand-600 group-hover:scale-110 transition-transform" />
            <span className="font-medium">Create Post</span>
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuItem asChild>
          <Link href="/admin" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-brand-50 transition-colors group">
            <BarChart3 className="w-4 h-4 text-brand-600 group-hover:scale-110 transition-transform" />
            <span className="font-medium">Dashboard</span>
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuItem asChild>
          <Link href="/blog" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-brand-50 transition-colors group">
            <FileText className="w-4 h-4 text-brand-600 group-hover:scale-110 transition-transform" />
            <span className="font-medium">My Posts</span>
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator className="my-2" />
        
        <DropdownMenuItem asChild>
          <Link href="/settings" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-dark-50 transition-colors group">
            <Settings className="w-4 h-4 text-dark-600 group-hover:scale-110 transition-transform" />
            <span className="font-medium">Settings</span>
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuItem
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors cursor-pointer group"
        >
          <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform" />
          <span className="font-medium">Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )

  const MobileMenu = () => (
    <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="md:hidden p-2 hover:bg-white/10 rounded-xl transition-all group">
          <Menu className="h-5 w-5 group-hover:scale-110 transition-transform" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-80 bg-white/95 backdrop-blur-lg border-l border-white/20">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-brand rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gradient">CodexCMS</span>
            </div>
            <button 
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <nav className="flex-1">
            <div className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-brand-50 transition-all duration-300 group"
                  >
                    <Icon className="w-5 h-5 text-brand-600 group-hover:text-brand-700 group-hover:scale-110 transition-transform" />
                    <span className="font-medium text-dark-700 group-hover:text-dark-900">{item.label}</span>
                  </Link>
                )
              })}
            </div>
            
            {user && (
              <div className="mt-8 pt-6 border-t border-dark-200">
                <div className="px-4 py-3 bg-gradient-to-r from-brand-50 to-accent-50 rounded-xl mb-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-gradient-brand rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-dark-900 truncate">
                        {user?.firstName || user?.username || 'User'}
                      </p>
                      <p className="text-xs text-dark-600 truncate">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="secondary" className="text-xs px-2 py-1 bg-brand-100 text-brand-700 border-brand-200">
                      {user?.role}
                    </Badge>
                    {isAdmin && (
                      <Badge variant="secondary" className="text-xs px-2 py-1 bg-accent-100 text-accent-700 border-accent-200">
                        <Shield className="w-3 h-3 mr-1" />
                        Admin
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Link
                    href="/settings"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-dark-50 transition-all duration-300 group"
                  >
                    <Settings className="w-5 h-5 text-dark-600 group-hover:scale-110 transition-transform" />
                    <span className="font-medium text-dark-700">Settings</span>
                  </Link>
                  
                  <button
                    onClick={() => {
                      logout()
                      setMobileMenuOpen(false)
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 text-red-600 transition-all duration-300 group"
                  >
                    <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    <span className="font-medium">Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </nav>
          
          {!user && (
            <div className="border-t border-dark-200 pt-6 space-y-3">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="btn-ghost w-full group"
              >
                <span className="group-hover:translate-x-1 transition-transform">Sign In</span>
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="btn-primary w-full group"
              >
                <span className="group-hover:translate-x-1 transition-transform">Get Started</span>
              </Link>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )

  return (
    <nav className="nav">
      <div className="container">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-brand rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gradient">CodexCMS</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.slice(0, 2).map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-dark-600 hover:text-brand-600 hover:bg-brand-50 transition-all duration-300 group"
                >
                  <Icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            {/* Search Button */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 hover:bg-white/10 rounded-lg transition-all group"
            >
              <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </button>

            {/* Notifications */}
            <button className="p-2 hover:bg-white/10 rounded-lg transition-all group relative">
              <Bell className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
            </button>

            {user ? (
              <div className="flex items-center gap-3">
                {user && (
                  <Link href="/create-post" className="btn-primary btn-sm group">
                    <PlusCircle className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    Create
                  </Link>
                )}
                <UserMenu />
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/login" className="btn-ghost btn-sm group">
                  <span className="group-hover:translate-x-1 transition-transform">Sign In</span>
                </Link>
                <Link href="/register" className="btn-primary btn-sm group">
                  <span className="group-hover:translate-x-1 transition-transform">Get Started</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu */}
          <MobileMenu />
        </div>

        {/* Search Bar */}
        {searchOpen && (
          <div className="py-4 border-t border-slate-200 animate-in slide-in-from-top-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search posts, users, or content..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                autoFocus
              />
            </div>
          </div>
        )}
      </div>
    </nav>
  )
} 