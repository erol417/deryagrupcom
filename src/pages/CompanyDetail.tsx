
import { useParams, Link, useNavigate } from "react-router-dom"
import { companies } from "../data/companies"
import { useEffect, useState } from "react"
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

export default function CompanyDetail() {
  const { id } = useParams()
  const navigate = useNavigate();

  // State for dynamic content
  // @ts-ignore
  const staticCompany = companies[id || "otomotiv"];
  const [currentCompany, setCurrentCompany] = useState<any>(staticCompany);

  // Sol menü için liste
  const [menuList, setMenuList] = useState([
    { id: 'otomotiv', name: 'Derya Otomotiv', icon: 'directions_car' },
    { id: 'sigorta', name: 'Derya Sigorta', icon: 'verified_user' },
    { id: 'insaat', name: 'Derya İnşaat', icon: 'apartment' },
    { id: 'elektronik', name: 'Derya Klima', icon: 'memory' },
    { id: 'chefmezze', name: 'Chef Mezze', icon: 'restaurant' },
    { id: 'marble', name: 'Derya MARBLE', icon: 'diamond' },
    { id: 'bilisim', name: 'Derya Bilişim', icon: 'laptop' },
    { id: 'yapi', name: 'D. Yapı Tasarım', icon: 'architecture' },
    { id: 'tasarim', name: 'Derya Yapı', icon: 'palette' },
  ]);

  useEffect(() => {
    window.scrollTo(0, 0);

    if (id && companies[id]) {
      // @ts-ignore
      setCurrentCompany(companies[id]);
    }

    if (id) {
      fetch(`http://localhost:3003/api/company-content/${id}`)
        .then(res => res.json())
        .then(data => {
          setCurrentCompany((prev: any) => ({ ...prev, ...data }));
        })
        .catch(err => console.error(err));
    }
  }, [id]);

  if (!currentCompany) {
    navigate("/sirket/otomotiv");
    return null;
  }

  return (
    <div className="bg-[#FAFAFA] min-h-screen font-sans">

      {/* Container */}
      <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">

        {/* Sidebar (Sol Menü) */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-8">
            <h3 className="font-bold text-gray-900 mb-2">Grup Şirketleri</h3>
            <p className="text-xs text-gray-400 mb-6">Detaylarını görüntülemek için şirket seçiniz.</p>

            <nav className="space-y-1">
              {menuList.map((item) => (
                <Link
                  key={item.id}
                  to={`/sirket/${item.id}`}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium",
                    id === item.id
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                  )}
                >
                  <span className="material-symbols-outlined text-lg">{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content (Sağ İçerik) */}
        <div className="flex-1 min-w-0 space-y-8">

          {/* HERO SECTION */}
          <div className="relative h-[400px] rounded-3xl overflow-hidden group">
            <img
              src={currentCompany.heroImage}
              alt={currentCompany.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

            <div className="absolute bottom-0 left-0 p-8 md:p-12 text-white max-w-3xl">
              <div className="inline-block bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4">
                {currentCompany.tag || 'Sektör Lideri'}
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">{currentCompany.heroTitle}</h1>
              <p className="text-gray-200 text-lg md:text-xl font-light">{currentCompany.heroSubtitle}</p>
            </div>
          </div>

          {/* INFO CARD (Hero Altı) */}
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm flex flex-col md:flex-row items-center md:items-start gap-8 -mt-4 relative z-10 mx-4 border border-gray-100">
            {/* Logo */}
            <div className="w-32 h-32 bg-white border border-gray-100 rounded-2xl flex items-center justify-center overflow-hidden p-4 shadow-lg shrink-0">
              {currentCompany.logoPath ? (
                <img src={`http://localhost:3003/uploads/${currentCompany.logoPath}`} className="w-full h-full object-contain" alt="Logo" />
              ) : (
                <span className="material-symbols-outlined text-4xl text-blue-600">business</span>
              )}
            </div>

            {/* Details */}
            <div className="flex-1 text-center md:text-left space-y-3 pt-2">
              <div>
                <h2 className="font-bold text-gray-900 text-xl md:text-2xl">{currentCompany.title}</h2>
                <p className="text-gray-500 mt-1 text-sm">{currentCompany.contact?.address?.split(',')[0] || 'İstanbul, Türkiye'}</p>
              </div>

              <div className="flex flex-wrap justify-center md:justify-start gap-6 md:gap-10 pt-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                    <span className="material-symbols-outlined">call</span>
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] text-gray-400 font-bold uppercase">İLETİŞİM</p>
                    <p className="text-sm font-bold text-gray-900">{currentCompany.contact?.phone || '+90 212 555 0000'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                    <span className="material-symbols-outlined">language</span>
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] text-gray-400 font-bold uppercase">WEB SİTESİ</p>
                    <p className="text-sm font-bold text-gray-900">{currentCompany.contact?.website || 'deryagrup.com.tr'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <div className="md:self-center shrink-0">
              <a href="#contact" className="bg-[#0f172a] text-white px-8 py-4 rounded-xl text-sm font-bold hover:bg-black transition-colors flex items-center gap-3 shadow-lg hover:shadow-xl hover:-translate-y-1 transform duration-300">
                <span>Hemen<br />İletişime Geç</span>
                <span className="material-symbols-outlined text-2xl">calendar_month</span>
              </a>
            </div>
          </div>

          {/* STATS */}
          {currentCompany.stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {currentCompany.stats.map((stat: any, i: number) => (
                <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 mb-4">
                    <span className="material-symbols-outlined">{stat.icon}</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                  <div className="text-xs text-gray-500 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          )}

          {/* ABOUT */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Şirket Hakkında</h3>
            <div className="text-gray-600 leading-relaxed text-lg [&>p]:mb-4 [&>ul]:list-disc [&>ul]:pl-5 [&>ol]:list-decimal [&>ol]:pl-5 [&>h1]:text-2xl [&>h1]:font-bold [&>h1]:mb-3 [&>h2]:text-xl [&>h2]:font-bold [&>h2]:mb-2">
              <div dangerouslySetInnerHTML={{ __html: currentCompany.description }} />
            </div>
          </div>

          {/* SERVICES / FAALİYET ALANLARI - GÜNCELLENDİ (DAHA BÜYÜK) */}
          {currentCompany.services && currentCompany.services.length > 0 && (
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6 px-2">Faaliyet Alanları</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {currentCompany.services.map((service: any, i: number) => (
                  <div key={i} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6 hover:shadow-xl transition-shadow group">
                    <div className="w-full md:w-48 h-48 bg-gray-200 rounded-2xl flex-shrink-0 overflow-hidden relative">
                      {service.image ? (
                        <img src={service.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={service.title} />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                          <span className="material-symbols-outlined text-4xl">{service.icon || 'image'}</span>
                        </div>
                      )}
                      <div className="absolute top-4 left-4 w-10 h-10 bg-white rounded-full flex items-center justify-center text-blue-600 shadow-md">
                        <span className="material-symbols-outlined">{service.icon}</span>
                      </div>
                    </div>
                    <div className="flex-1 py-1 flex flex-col justify-center">
                      <h4 className="font-bold text-xl text-gray-900 mb-3">{service.title}</h4>
                      <p className="text-gray-500 leading-relaxed">{service.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VIZYON KARTI */}
          <div className="bg-[#0f172a] rounded-3xl p-10 md:p-14 text-white flex flex-col md:flex-row gap-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[100px] -mr-32 -mt-32"></div>

            <div className="flex-1 relative z-10">
              <h3 className="text-3xl font-bold mb-4">Hedeflerimiz ve Vizyonumuz</h3>
              <p className="text-slate-400 mb-8 max-w-lg text-lg">
                {currentCompany.title} olarak hedefimiz, sektörde sürdürülebilir kalite ve yenilikçi çözümlerle öncü olmaktır.
              </p>

              <div className="space-y-5">
                <div className="flex items-center gap-4">
                  <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-[16px] text-white font-bold">check</span>
                  </div>
                  <p className="text-slate-300 text-lg">Sürdürülebilirlik odaklı büyüme stratejisi.</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-[16px] text-white font-bold">check</span>
                  </div>
                  <p className="text-slate-300 text-lg">Müşteri memnuniyetinde %100 başarı hedefi.</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-[16px] text-white font-bold">check</span>
                  </div>
                  <p className="text-slate-300 text-lg">İnovatif teknolojilerle sektöre yön vermek.</p>
                </div>
              </div>
            </div>

            <div className="w-full md:w-72 bg-white/5 rounded-2xl border border-white/10 flex flex-col items-center justify-center p-10 text-center relative z-10 hover:bg-white/10 transition-colors">
              <span className="material-symbols-outlined text-7xl text-white mb-6">rocket_launch</span>
              <h4 className="font-bold text-xl">Geleceğe Odaklı</h4>
              <p className="text-sm text-slate-400 mt-3">Yenilikçi adımlarla yarını inşa ediyoruz.</p>
            </div>
          </div>

          {/* BAŞARILAR (DİNAMİK) - GÜNCELLENDİ (DAHA BÜYÜK) */}
          {currentCompany.awards && currentCompany.awards.length > 0 && (
            <div>
              <div className="flex justify-between items-center mb-8 px-2">
                <h3 className="text-2xl font-bold text-gray-900">Başarılar ve Ödüller</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {currentCompany.awards.map((award: any, i: number) => (
                  <div key={i} className="bg-white p-8 rounded-3xl shadow-lg shadow-gray-100 border border-gray-100 hover:-translate-y-1 transition-transform duration-300 group">
                    <div className={`w-14 h-14 bg-${award.color || 'yellow'}-50 rounded-2xl flex items-center justify-center text-${award.color || 'yellow'}-600 mb-6 group-hover:scale-110 transition-transform`}>
                      <span className="material-symbols-outlined text-3xl">{award.icon || 'emoji_events'}</span>
                    </div>
                    <div className="text-sm font-bold text-gray-400 mb-2">{award.year}</div>
                    <h4 className="font-bold text-xl text-gray-900 mb-3">{award.title}</h4>
                    <p className="text-gray-500 leading-relaxed">{award.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* MARKALAR ALANI */}
          {currentCompany.brands && currentCompany.brands.length > 0 && (
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Temsil Ettiğimiz Markalar</h3>
                  <p className="text-sm text-gray-500 mt-1">Güçlü iş ortaklarımız ve dünya markaları.</p>
                </div>
                <Link to={`/sirket/${id}/markalar`} className="text-sm font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-4 py-2 rounded-full transition-colors flex items-center gap-1">
                  Tümünü Gör <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </Link>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {currentCompany.brands.slice(0, 12).map((brand: any) => (
                  <div key={brand.id} className="aspect-[3/2] bg-white rounded-xl border border-gray-100 p-4 flex items-center justify-center hover:border-blue-100 hover:shadow-lg transition-all group cursor-pointer" title={brand.name}>
                    {brand.logoPath ? (
                      <img src={`http://localhost:3003/uploads/${brand.logoPath}`} className="w-full h-full object-contain filter grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-105" alt={brand.name} />
                    ) : (
                      <span className="text-sm font-black text-gray-300 group-hover:text-blue-600 transition-colors uppercase tracking-wider">{brand.logoText?.substring(0, 6) || brand.name.substring(0, 3)}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CTA BOTTOM */}
          <div className="bg-blue-50 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-blue-600 shadow-md transform -rotate-12">
                <span className="material-symbols-outlined text-3xl">north_east</span>
              </div>
              <div>
                <h3 className="font-bold text-xl text-gray-900">Daha fazlasını keşfedin</h3>
                <p className="text-gray-500 text-sm">Web sitemizi ziyaret ederek güncel kampanyalardan haberdar olun.</p>
              </div>
            </div>
            <a href={`https://${currentCompany.contact?.website}`} target="_blank" className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/30">
              Web Sitesini Ziyaret Et
            </a>
          </div>

        </div>

      </div>
    </div>
  )
}