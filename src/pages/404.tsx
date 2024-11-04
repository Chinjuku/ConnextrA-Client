
import { MessageCircleCode, Search } from 'lucide-react'
import { Button } from "@/components/ui/button"

const NotFound = () => {

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-r from-indigo-50 to-blue-100">
      <div className="max-w-md w-full space-y-8 text-center bg-white shadow-lg rounded-lg p-8">
        <div className="flex justify-center items-center mb-6 relative">
          <div className="relative w-14 h-14 mr-2">
            <div className="absolute inset-0 bg-primary opacity-20 rounded-full animate-ping"></div>
            <div className="absolute inset-0 bg-primary opacity-40 rounded-full animate-ping" style={{ animationDelay: '-0.5s' }}></div>
            <div className="absolute inset-0 bg-primary rounded-full"></div>
            <Search className="w-8 h-8 absolute inset-0 m-auto text-primary-foreground opacity-80" />
          </div>
          <h1 className="text-5xl font-extrabold text-primary">404</h1>
        </div>

        <div className="space-y-2">
          <h2 className="text-3xl font-semibold tracking-tight text-gray-800">Page Not Found</h2>
          <p className="text-gray-500">Sorry, we couldn't find the page you're looking for.</p>
        </div>

      

        <div className="">
          <Button variant="outline" className="w-40" onClick={() => window.location.href = '/chat'}>
            <MessageCircleCode className="h-5 w-5" /> Back to Chat
          </Button>
        </div>
      </div>
    </div>
  )
}

export default NotFound
