import Link from "next/link";

export default function Navbar() {
  return (
    <header className="bg-gray-100 shadow-lg">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Left Side: Branding */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/">
              <div className="text-3xl font-bold text-blue-600 cursor-pointer flex items-center relative left-0">
                Slide
                <span className="text-xs text-gray-500 ml-2 relative top-5 right-10">
                  file share
                </span>
              </div>
            </Link>
          </div>
        
          <div className="flex space-x-6">
           
            <Link href="/file">
              <div className="text-gray-700 hover:text-blue-600 cursor-pointer transition duration-300">
                Files
              </div>
            </Link>
            <Link href="/recieving">
              <div className="text-gray-700 hover:text-blue-600 cursor-pointer transition duration-300">
                Receive Files
              </div>
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
