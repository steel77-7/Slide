import Link from "next/link";

export default function Navbar() {
  return (
    <header className="bg-gray-100 shadow-lg">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0">
            <Link href="/">
              <div className="text-2xl font-bold text-blue-600 cursor-pointer">FileShare</div>
            </Link>
          </div>
          <div className="flex space-x-4">
            <Link href="/">
              <div className="text-gray-700 hover:text-blue-600 cursor-pointer">Home</div>
            </Link>
            <Link href="file">
              <div className="text-gray-700 hover:text-blue-600 cursor-pointer">Files</div>
            </Link>
            <Link href="recieving">
              <div className="text-gray-700 hover:text-blue-600 cursor-pointer">Recieve files</div>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/login">
              <div className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 cursor-pointer">Login</div>
            </Link>
            <Link href="/signup">
              <div className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 cursor-pointer">Sign Up</div>
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
