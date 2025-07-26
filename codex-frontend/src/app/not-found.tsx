'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Home, ArrowLeft, Search } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-grid-pattern" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2xl relative z-10 text-center"
      >
        <Card className="shadow-2xl border-0 bg-card/95 backdrop-blur">
          <CardContent className="p-12">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-8"
            >
              <div className="text-8xl md:text-9xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
                404
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                Page Not Found
              </h1>
              <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
                Sorry, we couldn&apos;t find the page you&apos;re looking for. It might have been moved, deleted, or doesn&apos;t exist.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button size="lg" asChild>
                <Link href="/">
                  <Home className="w-5 h-5 mr-2" />
                  Go Home
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/blog">
                  <Search className="w-5 h-5 mr-2" />
                  Browse Blog
                </Link>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mt-8"
            >
              <Link 
                href="/" 
                className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground group"
              >
                <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                Back to homepage
              </Link>
            </motion.div>
          </CardContent>
        </Card>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-8 text-center"
        >
          <h3 className="text-xl font-semibold mb-4">Popular Pages</h3>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/blog" className="text-primary hover:underline">
              Blog
            </Link>
            <Link href="/categories" className="text-primary hover:underline">
              Categories
            </Link>
            <Link href="/contact" className="text-primary hover:underline">
              Contact
            </Link>
            <Link href="/admin" className="text-primary hover:underline">
              Admin Panel
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
} 