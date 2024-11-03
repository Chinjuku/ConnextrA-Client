import React, { useState } from 'react'
import { Home, Search } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const NotFound = () => {
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = '/' + encodeURIComponent(searchQuery.trim())
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="space-y-2">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-primary">404</h1>
          <h2 className="text-2xl font-semibold tracking-tight text-primary">Page not found</h2>
          <p className="text-muted-foreground">Sorry, we couldn't find the page you're looking for.</p>
        </div>
        <div className="flex justify-center">
          <div className="w-16 h-16 relative">
            <div className="absolute inset-0 bg-primary opacity-20 rounded-full animate-ping"></div>
            <div className="absolute inset-0 bg-primary opacity-40 rounded-full animate-ping" style={{ animationDelay: '-0.5s' }}></div>
            <div className="absolute inset-0 bg-primary rounded-full"></div>
            <Search className="w-8 h-8 absolute inset-0 m-auto text-primary-foreground" />
          </div>
        </div>
        <form onSubmit={handleSearch} className="mt-8 space-y-4">
          <Input 
            type="text" 
            placeholder="Search for pages..." 
            className="w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search for pages"
          />
          <Button type="submit" className="w-full">Search</Button>
        </form>
        <div className="pt-4">
          <Button variant="outline" className="w-full" onClick={() => window.location.href = '/'}>
            <Home className="mr-2 h-4 w-4" /> Back to Home
          </Button>
        </div>
      </div>
    </div>
  )
}

export default NotFound