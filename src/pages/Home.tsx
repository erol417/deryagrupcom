import { useState, useEffect, useRef } from 'react';
import { Link } from "react-router-dom"
import { API_BASE_URL } from '../config';
import HeroType1 from '../components/hero/HeroType1';
import HeroType2 from '../components/hero/HeroType2';
import HeroType3 from '../components/hero/HeroType3';

interface News {
  id: number;
  title: string;
  summary: string;
  date: string;
  imagePath: string | null;
}

export default function Home() {
  const [latestNews, setLatestNews] = useState<News | null>(null);
  const [brands, setBrands] = useState<any[]>([]);
  const [socialData, setSocialData] = useState<any>(null);
  const [homeSections, setHomeSections] = useState<any>(null);

  // Hero Data
  const [heroData, setHeroData] = useState<any>(null);

  // Scroll Animation State
  const companiesRef = useRef<HTMLDivElement>(null);
  const [isCompaniesVisible, setIsCompaniesVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Her giriş çıkışta tetiklensin (Repeat animation on every scroll)
        setIsCompaniesVisible(entry.isIntersecting);
      },
      { threshold: 0.2 } // %20'si görünür olduğunda başlat
    );

    if (companiesRef.current) observer.observe(companiesRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    // Hero Bilgilerini Getir
    fetch(`${API_BASE_URL}/api/hero`)
      .then(res => res.json())
      .then(data => {
        if (!data.activeDesign) data.activeDesign = 'type3'; // Fallback
        setHeroData(data);
      })
      .catch(err => console.error("Hero API Error", err));
  }, []);


  const companies = [
    { id: "otomotiv", title: "Derya Otomotiv", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuD8Di3Gl2leSYoYJXlA-chRLIJaSI_WcdrQHVwZ373IKCq7JwPaJ4d3ZeFhowjswi7uCKXoSJhB1ZH2MtD4ADtVp9qjPJq6wgdJpW-BJ4Mca2GATCg1i76cnbyAmpqU9UmO8CUtfyCy5BCpVCxBuBh_L5kjAulMwAKOREeGlnbJ_0dppZI3c5WX3dpvuftAeoCSP0ek5OuPXaBCcy3cz4SjvZTBlOhzPZm9P7XbcuMn8pXNHjZMdHaXHV5ahFMInbMzwgek4Q1s91g", tag: "Otomotiv" },
    { id: "insaat", title: "Derya İnşaat", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCXUwsnFWqwnLfRDpUYGLB9zO8ZoyfBEld9xNhdtJGvSQ2BKwrp-EY2SfiMeTHZYdQakE6Bq97IGFsJQWj-suheK_4IoZnqx_VvKQQU0O5KQEY-8wdQbx0ws_lpDUu3avfsoBJU5GRGZ7q0sZsl1OGHk76kf_-24fr4U3Y5HApI2FxX2oV0nRLtAYkc0Wdm6lhVtjkgOmuif3TKysPeIzAA7_kq6R2O6OUGhcwf5Dz-md_v9QNznDvib5HIZfKB0gTeeMYFJayqjco", tag: "İnşaat" },
    { id: "sigorta", title: "Derya Sigorta", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAuqifC2g5FLWPL1_LMTAAn1rcF-nw2PFnXUNjHJ2h6g6a1W5A-GDoiTGdtgUixiUdIDuM7oOX83DlLjkRVeKgLTQQPhHAPPDWWUfXXuOloqCywJ5fFgwwxLQzdZ2RjeodiLWvzRGf74ba-UkbXuj7Be682Zbs_1lBtBY6kFzQuKOf6DP2hGa1C5kP_Kr9fl7xHCtHRLGaz9vFoiJ1LFdxPqEbXBCsScbbxV906o8HReKglrl5-Z1-a-L7gaDeEiUCJjZbdX6DhQno", tag: "Sigorta" },
    { id: "elektronik", title: "Derya Klima", img: "https://images.unsplash.com/photo-1545259741-2ea3ebf61fa3?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", tag: "Elektronik" },
    { id: "chefmezze", title: "ChefMezze", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCHeGwkMJpGIFuBOwGMB795KVpnGoaF0Uhdq0m-NE2g_fpJAzK1Q5b7_sEKNzHytezxsgEqTuVLK9CIjynMnnn8y5PMWp19EeXwcZuvWOY1Bniz7c2qTB1Pf3piRmmgjppZHIu9nHzZraacqNbxX5mOsKUyN7r2M4DTF5tINftrKeLZ1W6pBeeMwSO--xkOtUTJGlkB-vAgzGMG0PWrB0_sVCzFEVrQncFWu8rRRKDVDwRNAKJyvtPnqSUbD5GrlnHK-wvo86NBvR4", tag: "Gıda & Hizmet" },
    { id: "marble", title: "Derya MARBLE", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDQTc_XhPBkW8yIfkzLDYgcUJu-bclX7V2bxdfp0oTRpa09_d9HdoArV-YSyq-evONl3dy3HbadxlLGUiUV1ChPQLK0b-SMu5uKP0unJ9SzU1SIiKCEDJseJFb-n380wwn0q13n870lj8Muoov_XS6n7PL_ZHTt-uEomiMUx0MUv3BrpfF9KQhKcYviFKTr2AkS0VMvWU0uSQw81HGAq15fWT1fxfqRLK2F2ioBq9JoiTlsaza45QG5LWb2FzdewbNCtk4WkR_wfNU", tag: "Madencilik" }
  ];

  useEffect(() => {


    // Haberleri Getir
    fetch(`${API_BASE_URL}/api/news`)
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          // API returns newest first, so take index 0
          setLatestNews(data[0]);
        }
      })
      .catch(err => console.error(err));

    // Markaları Getir (Tüm Şirketlerden)
    fetch(`${API_BASE_URL}/api/all-brands`)
      .then(res => res.json())
      .then(data => setBrands(data))
      .catch(err => console.error("Markalar yüklenirken hata:", err));

    // Sosyal Medya Verisini Getir
    fetch(`${API_BASE_URL}/api/social`)
      .then(res => res.json())
      .then(data => setSocialData(data))
      .catch(err => console.error("Sosyal medya hatası:", err));

    // Ana Sayfa Bölümlerini Getir
    fetch(`${API_BASE_URL}/api/home-sections`)
      .then(res => res.json())
      .then(data => setHomeSections(data))
      .catch(console.error);

  }, []);

  return (
    <>
      {/* DYNAMIC HERO SECTION */}
      {heroData && (
        <>
          {heroData.activeDesign === 'type1' && <HeroType1 data={heroData.type1} />}
          {heroData.activeDesign === 'type2' && <HeroType2 data={heroData.type2} />}
          {heroData.activeDesign === 'type3' && <HeroType3 data={heroData.type3} />}
        </>
      )}
      {!heroData && <div className="h-[85vh] flex items-center justify-center font-bold text-gray-400">Yükleniyor...</div>}

      {/* BRAND MARQUEE */}
      <section className="bg-gray-50 py-10 overflow-hidden border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 text-center">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Markalarımız & Çözüm Ortaklarımız</h3>
        </div>
        <div className="relative w-full flex overflow-hidden group">
          <div className="flex animate-marquee group-hover:[animation-play-state:paused] whitespace-nowrap items-center">
            {brands.map((brand, i) => (
              <div key={`s1-${i}`} className="mx-8 md:mx-16 flex-shrink-0 w-32 h-16 flex items-center justify-center opacity-60 hover:opacity-100 transition-all duration-300 grayscale hover:grayscale-0 cursor-pointer">
                {brand.logoPath ? (
                  <img src={`${API_BASE_URL}/uploads/${brand.logoPath}`} alt={brand.name} className="max-h-full max-w-full object-contain" />
                ) : (
                  <span className="text-xl font-bold text-gray-400">{brand.logoText || brand.name}</span>
                )}
              </div>
            ))}

            {/* LOGO SET 2 */}
            {brands.map((brand, i) => (
              <div key={`s2-${i}`} className="mx-8 md:mx-16 flex-shrink-0 w-32 h-16 flex items-center justify-center opacity-60 hover:opacity-100 transition-all duration-300 grayscale hover:grayscale-0 cursor-pointer">
                {brand.logoPath ? (
                  <img src={`${API_BASE_URL}/uploads/${brand.logoPath}`} alt={brand.name} className="max-h-full max-w-full object-contain" />
                ) : (
                  <span className="text-xl font-bold text-gray-400">{brand.logoText || brand.name}</span>
                )}
              </div>
            ))}

            {/* LOGO SET 3 */}
            {brands.map((brand, i) => (
              <div key={`s3-${i}`} className="mx-8 md:mx-16 flex-shrink-0 w-32 h-16 flex items-center justify-center opacity-60 hover:opacity-100 transition-all duration-300 grayscale hover:grayscale-0 cursor-pointer">
                {brand.logoPath ? (
                  <img src={`${API_BASE_URL}/uploads/${brand.logoPath}`} alt={brand.name} className="max-h-full max-w-full object-contain" />
                ) : (
                  <span className="text-xl font-bold text-gray-400">{brand.logoText || brand.name}</span>
                )}
              </div>
            ))}
          </div>

          {/* Fade Effect */}
          <div className="absolute top-0 left-0 w-20 md:w-40 h-full bg-gradient-to-r from-gray-50 to-transparent pointer-events-none z-10"></div>
          <div className="absolute top-0 right-0 w-20 md:w-40 h-full bg-gradient-to-l from-gray-50 to-transparent pointer-events-none z-10"></div>
        </div>
      </section>

      <section className="py-24 bg-[#0F172A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-16">
            <div className="flex-1">
              <span className="text-sm font-bold tracking-widest text-gray-500 uppercase mb-2 block">Kurumsal</span>
              <h2 className="text-3xl font-bold text-white mb-8">Vizyonumuz</h2>
              <div className="space-y-8">
                {homeSections?.visionMission?.vision?.items?.map((item: any, i: number) => (
                  <div key={i} className="flex gap-4 group">
                    <div className="size-12 rounded-full bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-primary transition-colors">
                      <span className="material-symbols-outlined text-white">{item.icon}</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white mb-1">{item.title}</h3>
                      <p className="text-gray-400">{item.text}</p>
                    </div>
                  </div>
                )) || <div className="text-gray-500">Yükleniyor...</div>}
              </div>
            </div>
            <div className="flex-1">
              <span className="text-sm font-bold tracking-widest text-gray-500 uppercase mb-2 block">Hedefimiz</span>
              <h2 className="text-3xl font-bold text-white mb-8">Misyonumuz</h2>
              <div className="bg-white/5 p-10 rounded-2xl h-full flex flex-col justify-center relative overflow-hidden group border border-white/5">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-150 duration-700"></div>
                <div className="relative z-10">
                  <span className="material-symbols-outlined text-6xl text-primary mb-6">format_quote</span>
                  <p className="text-xl md:text-2xl font-medium text-gray-200 leading-relaxed">
                    "{homeSections?.visionMission?.mission?.text || '...'}"
                  </p>
                  <div className="mt-8 flex items-center gap-3">
                    <div className="h-1 w-12 bg-primary"></div>
                    <span className="text-sm font-bold text-gray-400">{homeSections?.visionMission?.mission?.author || 'Derya Grup'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="companies" className="py-24 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-primary font-bold tracking-wider uppercase text-sm mb-2 block">Faaliyet Alanlarımız</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Grup Şirketlerimiz</h2>
            <p className="mt-4 text-gray-600 max-w-2xl mx-auto">Dokuz farklı sektörde öncü iştiraklerimizle hizmet veriyoruz.</p>
          </div>

          {/* STACKED CARD / ACCORDION ANIMATION */}
          <div ref={companiesRef} className="flex flex-col md:flex-row justify-center gap-4 md:gap-2 h-[600px] w-full perspective-1000">
            {companies.map((company, index) => (
              <Link
                key={company.id}
                to={`/sirket/${company.id}`}
                style={{ transitionDelay: `${index * 100}ms` }}
                className={`relative flex-1 group hover:flex-[3] transition-all duration-700 ease-out overflow-hidden rounded-2xl border border-white/10 transform ${isCompaniesVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-32 scale-75'} md:min-w-[80px]`}
              >
                {/* Background Image */}
                <div className="absolute inset-0">
                  <div className="absolute inset-0 bg-black/60 group-hover:bg-black/30 transition-colors duration-500 z-10" />
                  <img
                    src={company.img}
                    alt={company.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 filter grayscale group-hover:grayscale-0"
                  />
                </div>

                {/* Content Container */}
                <div className="absolute inset-0 z-20 flex flex-col justify-end p-6">

                  {/* Collapsed State Title (Bottom & Vertical) */}
                  <div className="absolute inset-0 flex items-center justify-center md:items-end md:pb-12 transition-all duration-300 group-hover:opacity-0 pointer-events-none">
                    <h3
                      className="hidden md:block text-lg md:text-xl font-bold text-white/90 tracking-widest uppercase whitespace-nowrap drop-shadow-md"
                      style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
                    >
                      {company.tag}
                    </h3>
                    <h3 className="md:hidden text-lg font-bold text-white/90 tracking-widest uppercase whitespace-nowrap drop-shadow-md">
                      {company.tag}
                    </h3>
                  </div>

                  {/* Expanded State Content */}
                  <div className="relative opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0 z-30">
                    <span className="text-primary font-bold tracking-widest uppercase text-xs mb-2 block md:hidden lg:block">{company.tag}</span>
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 whitespace-nowrap">{company.title}</h3>
                    <div className="inline-flex items-center gap-2 text-white font-bold bg-primary/90 px-5 py-2.5 rounded-full backdrop-blur-md shadow-lg hover:bg-primary transition-colors">
                      <span>İncele</span>
                      <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link to="/sirket/otomotiv" className="text-gray-900 font-bold hover:text-primary transition-colors flex items-center gap-2 mx-auto inline-flex">
              <span>Tüm Şirketleri İncele</span>
              <span className="material-symbols-outlined">arrow_forward</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-24 bg-[#0F172A] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)", backgroundSize: "32px 32px" }}></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
            <div>
              <span className="text-primary font-bold tracking-wider uppercase text-sm mb-2 block">Başarılarımız</span>
              <h2 className="text-3xl md:text-4xl font-bold">Ödüller ve Takdirler</h2>
            </div>
            <button className="border border-white/20 hover:bg-white/10 text-white px-6 py-3 rounded-full transition-colors text-sm font-bold flex items-center gap-2">
              Tüm Başarıları Gör
              <span className="material-symbols-outlined text-lg">expand_more</span>
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {homeSections?.achievements?.map((ach: any, i: number) => (
              <div key={i} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8 hover:bg-white/10 transition-all cursor-pointer">
                <div className="text-primary mb-4">
                  <span className="material-symbols-outlined text-4xl">{ach.icon}</span>
                </div>
                <div className="text-sm text-gray-400 mb-2">{ach.year}</div>
                <h3 className="text-xl font-bold mb-3">{ach.title}</h3>
                <p className="text-gray-300 text-sm leading-relaxed">{ach.description}</p>
              </div>
            )) || <div className="col-span-3 text-center text-gray-500">Yükleniyor...</div>}
          </div>
        </div>
      </section>

      <section id="social-wall" className={`py-24 bg-white border-t border-gray-100 ${socialData && !socialData.isVisible ? 'hidden' : ''}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
              <span className="text-primary font-bold tracking-wider uppercase text-sm mb-2 block">Sosyal Medyada Biz</span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Sosyal Medyadan Paylaşımlar</h2>
              <p className="mt-4 text-gray-600 max-w-2xl">
                Derya Grup dünyasındaki son gelişmeler, projeler ve etkinliklerden haberdar olun.
              </p>
            </div>
            <div className="flex gap-4">
              <a href={socialData?.linkedinUrl || '#'} target="_blank" className="bg-[#0077B5] hover:bg-[#005582] text-white px-5 py-2.5 rounded-full transition-colors text-sm font-bold flex items-center gap-2 shadow-lg hover:shadow-xl">
                <span>LinkedIn'de Takip Et</span>
                <span className="material-symbols-outlined text-lg">arrow_outward</span>
              </a>
              <a href={socialData?.instagramUrl || '#'} target="_blank" className="bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] hover:opacity-90 text-white px-5 py-2.5 rounded-full transition-opacity text-sm font-bold flex items-center gap-2 shadow-lg hover:shadow-xl">
                <span>Instagram'da Takip Et</span>
                <span className="material-symbols-outlined text-lg">arrow_outward</span>
              </a>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {socialData?.posts?.slice(0, 4).map((post: any) => (
              <div key={post.id} onClick={() => window.open(post.link, '_blank')} className="group flex flex-col bg-white dark:bg-white/5 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer border border-gray-100 dark:border-white/10">
                {/* Image Section */}
                <div className="relative aspect-square overflow-hidden bg-gray-100">
                  <img src={`${API_BASE_URL}/uploads/social/${post.imagePath}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={post.platform} />

                  {/* Platform Icon Badge */}
                  <div className="absolute top-3 right-3 z-10">
                    <div className="bg-white/90 backdrop-blur-md rounded-full p-2 text-gray-800 shadow-sm">
                      <span className="material-symbols-outlined text-lg">{post.platform === 'linkedin' ? 'work' : 'photo_camera'}</span>
                    </div>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded text-white ${post.platform === 'linkedin' ? 'bg-[#0077B5]' : 'bg-gradient-to-r from-[#833ab4] to-[#fd1d1d]'}`}>
                      {post.platform}
                    </span>
                    <span className="text-xs text-gray-500">{new Date(post.date).toLocaleDateString('tr-TR')}</span>
                  </div>

                  <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3 mb-4 flex-1 font-medium leading-relaxed">
                    {post.description}
                  </p>

                  <div className="mt-auto border-t border-gray-100 dark:border-white/10 pt-4 flex items-center justify-between group/link">
                    <span className="text-xs font-bold text-gray-900 dark:text-gray-100 group-hover/link:text-primary transition-colors flex items-center gap-1">
                      {post.platform === 'linkedin' ? 'LinkedIn\'de Gör' : 'Instagram\'da Gör'}
                      <span className="material-symbols-outlined text-sm transition-transform group-hover/link:translate-x-1">arrow_forward</span>
                    </span>
                  </div>
                </div>
              </div>
            ))}
            {(!socialData?.posts || socialData.posts.length === 0) && (
              <div className="col-span-full text-center py-12 bg-white rounded-2xl border border-dashed border-gray-300">
                <p className="text-gray-500">Henüz güncel bir paylaşım bulunmuyor.</p>
              </div>
            )}

          </div>
        </div>
      </section>

      <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {latestNews && (
            <div className="bg-secondary rounded-2xl p-8 md:p-12 relative overflow-hidden shadow-xl group">
              <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-2xl -ml-20 -mb-20 pointer-events-none"></div>
              <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10">
                <div className="flex-1 space-y-5">
                  <div className="flex items-center gap-3">
                    <span className="bg-primary text-secondary text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm">Bizden Haberler</span>
                    <div className="flex items-center gap-1.5 text-gray-400 text-sm">
                      <span className="material-symbols-outlined text-sm">calendar_month</span>
                      <span>{new Date(latestNews.date).toLocaleDateString('tr-TR')}</span>
                    </div>
                  </div>
                  <h3 className="text-2xl md:text-4xl font-bold text-white leading-tight">
                    {latestNews.title}
                  </h3>
                  <p className="text-gray-300 text-base md:text-lg leading-relaxed max-w-3xl font-light line-clamp-3">
                    {latestNews.summary}
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 shrink-0 w-full lg:w-auto">
                  <Link to={`/news/${latestNews.id}`} className="inline-flex items-center justify-center gap-2 bg-white text-secondary hover:bg-gray-100 font-bold py-4 px-8 rounded-full transition-all shadow-lg hover:shadow-xl hover:-translate-y-1">
                    Haberi İncele
                    <span className="material-symbols-outlined">arrow_forward</span>
                  </Link>
                  <Link to="/bizden-haberler" className="inline-flex items-center justify-center gap-2 bg-transparent border border-white/30 text-white hover:bg-white/10 font-bold py-4 px-8 rounded-full transition-all">
                    Tüm Haberler
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  )
}