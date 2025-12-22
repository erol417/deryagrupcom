import { Link } from "react-router-dom"

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-gray-100 dark:bg-background-dark/95 dark:border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex-shrink-0 cursor-pointer">
            <img
              src="/derya-grup-logo.png"
              alt="Derya Grup"
              className="h-16 w-auto object-contain"
            />
          </Link>
          <div className="hidden lg:flex items-center space-x-8">
            <Link to="/" className="text-sm font-medium text-gray-700 hover:text-black dark:text-gray-200 transition-colors">Anasayfa</Link>
            <Link to="/hakkimizda" className="text-sm font-medium text-gray-700 hover:text-black dark:text-gray-200 transition-colors">Hakkımızda</Link>
            <Link to="/sirket/otomotiv" className="text-sm font-medium text-gray-700 hover:text-black dark:text-gray-200 transition-colors">Grup Şirketleri</Link>
            <Link to="/kariyer" className="text-sm font-medium text-gray-700 hover:text-black dark:text-gray-200 transition-colors">İnsan Kaynakları</Link>
            <Link to="/bizden-haberler" className="text-sm font-medium text-gray-700 hover:text-black dark:text-gray-200 transition-colors">Bizden Haberler</Link>
            <Link to="/iletisim" className="text-sm font-medium text-gray-700 hover:text-black dark:text-gray-200 transition-colors">İletişim</Link>
          </div>
          <div className="hidden lg:flex items-center gap-4">
            <button className="flex items-center justify-center size-10 rounded-full bg-gray-100 hover:bg-black hover:text-white transition-colors text-secondary">
              <span className="material-symbols-outlined text-[20px]">language</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}