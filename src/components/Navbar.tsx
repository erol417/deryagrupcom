import { Link } from "react-router-dom"
import { useState } from "react"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <nav className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-gray-100 dark:bg-background-dark/95 dark:border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex-shrink-0 cursor-pointer z-50">
            <img
              src="/derya-grup-logo.png"
              alt="Derya Grup"
              className="h-12 md:h-16 w-auto object-contain transition-all"
            />
          </Link>

          {/* Desktop Menu */}
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

          {/* Mobile Menu Button */}
          <div className="lg:hidden z-50">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors"
            >
              <span className="material-symbols-outlined text-3xl">
                {isOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 bg-white dark:bg-[#0f172a] z-40 transition-transform duration-300 ease-in-out lg:hidden pt-24 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col items-center gap-6 p-4">
          <Link onClick={() => setIsOpen(false)} to="/" className="text-xl font-bold text-gray-800 dark:text-white">Anasayfa</Link>
          <Link onClick={() => setIsOpen(false)} to="/hakkimizda" className="text-xl font-bold text-gray-800 dark:text-white">Hakkımızda</Link>
          <Link onClick={() => setIsOpen(false)} to="/sirket/otomotiv" className="text-xl font-bold text-gray-800 dark:text-white">Grup Şirketleri</Link>
          <Link onClick={() => setIsOpen(false)} to="/kariyer" className="text-xl font-bold text-gray-800 dark:text-white">İnsan Kaynakları</Link>
          <Link onClick={() => setIsOpen(false)} to="/bizden-haberler" className="text-xl font-bold text-gray-800 dark:text-white">Bizden Haberler</Link>
          <Link onClick={() => setIsOpen(false)} to="/iletisim" className="text-xl font-bold text-gray-800 dark:text-white">İletişim</Link>
        </div>
      </div>
    </nav>
  )
}