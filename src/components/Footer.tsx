import { Link } from "react-router-dom"

export default function Footer() {
  return (
    <footer className="bg-background-dark text-white pt-20 pb-10 border-t border-white/5 bg-[#23220f]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <img
                src="/images/derya%20grup%20logo.png"
                alt="Derya Grup"
                className="h-16 w-auto object-contain"
              />
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              1979 dan beri güven ve kalite ile geleceği inşa ediyoruz.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-6">Hızlı Erişim</h3>
            <ul className="space-y-4">
              <li><Link to="/hakkimizda" className="text-gray-400 hover:text-primary transition-colors text-sm">Hakkımızda</Link></li>
              <li><Link to="/kariyer" className="text-gray-400 hover:text-primary transition-colors text-sm">İnsan Kaynakları</Link></li>
              <li><Link to="/iletisim" className="text-gray-400 hover:text-primary transition-colors text-sm">İletişim</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-6">Faal Olduğumuz Sektörler</h3>
            <ul className="space-y-4">
              <li><Link to="/sirket/otomotiv" className="text-gray-400 hover:text-primary transition-colors text-sm">Otomotiv</Link></li>
              <li><Link to="/sirket/insaat" className="text-gray-400 hover:text-primary transition-colors text-sm">İnsaat</Link></li>
              <li><Link to="/sirket/sigorta" className="text-gray-400 hover:text-primary transition-colors text-sm">Sigorta</Link></li>
              <li><Link to="/sirket/elektronik" className="text-gray-400 hover:text-primary transition-colors text-sm">Klima</Link></li>
              <li><Link to="/sirket/cheffmezze" className="text-gray-400 hover:text-primary transition-colors text-sm">Cheffmezze</Link></li>
              <li><Link to="/sirket/marble" className="text-gray-400 hover:text-primary transition-colors text-sm">Madencilik</Link></li>
              <li><Link to="/sirket/bilisim" className="text-gray-400 hover:text-primary transition-colors text-sm">Bilisim</Link></li>
            </ul>
          </div>
          <div className="space-y-6">
            <h3 className="text-lg font-bold mb-6">İletişim</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-gray-400 text-sm">
                <span className="material-symbols-outlined text-primary text-lg mt-0.5">location_on</span>
                <span>Zümrütevler Mah. Çilek Sokak no 33 <br />Maltepe, İstanbul</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <span className="material-symbols-outlined text-primary text-lg">call</span>
                <span>+90 216 706 01 90</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <span className="material-symbols-outlined text-primary text-lg">mail</span>
                <span>info@deryagrup.com</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-xs">© 2026 Derya Grup. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </footer>
  )
}