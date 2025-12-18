import { useState, useEffect } from 'react';
import { Link } from "react-router-dom"

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

  useEffect(() => {
    // Haberleri Getir
    fetch('http://localhost:3003/api/news')
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          // API returns newest first, so take index 0
          setLatestNews(data[0]);
        }
      })
      .catch(err => console.error(err));

    // Markaları Getir (Tüm Şirketlerden)
    fetch('http://localhost:3003/api/all-brands')
      .then(res => res.json())
      .then(data => setBrands(data))
      .catch(err => console.error("Markalar yüklenirken hata:", err));

    // Sosyal Medya Verisini Getir
    fetch('http://localhost:3003/api/social')
      .then(res => res.json())
      .then(data => setSocialData(data))
      .catch(err => console.error("Sosyal medya hatası:", err));

  }, []);

  return (
    <>
      <section className="relative h-[85vh] w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url(\"https://lh3.googleusercontent.com/aida-public/AB6AXuA3CJDlMRpSHDez1hCYt5KdQcrgp3B-XPBqznh18s_XaMYlDkvclvUusSz0lrtiiFxdCv5WHwanlEGw87oYmoNbrCkAGIznFgh1zMMFCmWDDs1I5bxzUPOPDtEHgMCjWSRf8YdjxfIr38r47ZsvVpsdlCVAsWil63D8PWPAyVIuGjFF8BBQzCRKD3ijowWQplX8R_w9qTdHRzlK0mLBUikTPTpc9UWAJqLWn2n5cULMpFWHAdyzEd7Bav3IZsqzd_CKjdGoDWrI8lo\")" }}></div>
        <div className="absolute inset-0 bg-gradient-to-r from-secondary/90 to-secondary/40"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
              Sürekli kalite hedefimiz, <br />
              <span className="text-primary">müşteri geleceğimiz.</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl font-light">
              Güven, İnşaat ve Otomotiv Sektörlerinde Öncü. Geleceği inşa ederken değerlerimizden ödün vermiyoruz.
            </p>
            <Link to="/hakkimizda" className="bg-primary hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-full transition-all transform hover:scale-105 inline-flex items-center gap-2 shadow-lg hover:shadow-primary/50">
              <span>Bizi Tanıyın</span>
              <span className="material-symbols-outlined text-xl">arrow_forward</span>
            </Link>
          </div>
        </div>
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce text-white/50">
          <span className="material-symbols-outlined text-4xl">keyboard_arrow_down</span>
        </div>
      </section>

      {/* BRAND MARQUEE */}
      <section className="bg-gray-50 py-10 overflow-hidden border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 text-center">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Markalarımız & Çözüm Ortaklarımız</h3>
        </div>
        <div className="relative w-full flex overflow-hidden group">
          <div className="flex animate-marquee group-hover:[animation-play-state:paused] whitespace-nowrap items-center">
            {brands.map((brand, i) => (
              <div key={`s1-${i}`} className="mx-8 md:mx-16 flex-shrink-0 w-32 h-16 flex items-center justify-center opacity-60 hover:opacity-100 transition-all duration-300 grayscale hover:grayscale-0 cursor-pointer">
                {brand.logoPath ? (
                  <img src={`http://localhost:3003/uploads/${brand.logoPath}`} alt={brand.name} className="max-h-full max-w-full object-contain" />
                ) : (
                  <span className="text-xl font-bold text-gray-400">{brand.logoText || brand.name}</span>
                )}
              </div>
            ))}

            {/* LOGO SET 2 */}
            {brands.map((brand, i) => (
              <div key={`s2-${i}`} className="mx-8 md:mx-16 flex-shrink-0 w-32 h-16 flex items-center justify-center opacity-60 hover:opacity-100 transition-all duration-300 grayscale hover:grayscale-0 cursor-pointer">
                {brand.logoPath ? (
                  <img src={`http://localhost:3003/uploads/${brand.logoPath}`} alt={brand.name} className="max-h-full max-w-full object-contain" />
                ) : (
                  <span className="text-xl font-bold text-gray-400">{brand.logoText || brand.name}</span>
                )}
              </div>
            ))}

            {/* LOGO SET 3 */}
            {brands.map((brand, i) => (
              <div key={`s3-${i}`} className="mx-8 md:mx-16 flex-shrink-0 w-32 h-16 flex items-center justify-center opacity-60 hover:opacity-100 transition-all duration-300 grayscale hover:grayscale-0 cursor-pointer">
                {brand.logoPath ? (
                  <img src={`http://localhost:3003/uploads/${brand.logoPath}`} alt={brand.name} className="max-h-full max-w-full object-contain" />
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

      <section className="py-24 bg-white dark:bg-background-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-16">
            <div className="flex-1">
              <span className="text-sm font-bold tracking-widest text-gray-500 uppercase mb-2 block">Kurumsal</span>
              <h2 className="text-3xl font-bold text-secondary dark:text-white mb-8">Vizyonumuz</h2>
              <div className="space-y-8">
                <div className="flex gap-4 group">
                  <div className="size-12 rounded-full bg-background-light dark:bg-white/10 flex items-center justify-center shrink-0 group-hover:bg-primary transition-colors">
                    <span className="material-symbols-outlined text-secondary dark:text-white">lightbulb</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-secondary dark:text-white mb-1">Yenilikçilik</h3>
                    <p className="text-gray-600 dark:text-gray-400">Sektördeki en yeni teknolojileri takip ederek sürekli gelişim sağlıyoruz.</p>
                  </div>
                </div>
                <div className="flex gap-4 group">
                  <div className="size-12 rounded-full bg-background-light dark:bg-white/10 flex items-center justify-center shrink-0 group-hover:bg-primary transition-colors">
                    <span className="material-symbols-outlined text-secondary dark:text-white">eco</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-secondary dark:text-white mb-1">Sürdürülebilirlik</h3>
                    <p className="text-gray-600 dark:text-gray-400">Gelecek nesillere yaşanabilir bir dünya bırakmak için çevre dostu çözümler.</p>
                  </div>
                </div>
                <div className="flex gap-4 group">
                  <div className="size-12 rounded-full bg-background-light dark:bg-white/10 flex items-center justify-center shrink-0 group-hover:bg-primary transition-colors">
                    <span className="material-symbols-outlined text-secondary dark:text-white">diversity_3</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-secondary dark:text-white mb-1">Müşteri Odaklılık</h3>
                    <p className="text-gray-600 dark:text-gray-400">Müşteri memnuniyetini işimizin merkezine koyarak güven inşa ediyoruz.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-1">
              <span className="text-sm font-bold tracking-widest text-gray-500 uppercase mb-2 block">Hedefimiz</span>
              <h2 className="text-3xl font-bold text-secondary dark:text-white mb-8">Misyonumuz</h2>
              <div className="bg-background-light dark:bg-white/5 p-10 rounded-2xl h-full flex flex-col justify-center relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-150 duration-700"></div>
                <div className="relative z-10">
                  <span className="material-symbols-outlined text-6xl text-primary mb-6">format_quote</span>
                  <p className="text-xl md:text-2xl font-medium text-secondary dark:text-gray-200 leading-relaxed">
                    "Topluma ve çevreye duyarlı, güvenilir ve kaliteli hizmet anlayışıyla sektörde fark yaratarak, ülkemizin ekonomik kalkınmasına değer katmak."
                  </p>
                  <div className="mt-8 flex items-center gap-3">
                    <div className="h-1 w-12 bg-primary"></div>
                    <span className="text-sm font-bold text-gray-500">Derya Grup Yönetim Kurulu</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="companies" className="py-24 bg-background-light dark:bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-primary font-bold tracking-wider uppercase text-sm mb-2 block">Faaliyet Alanlarımız</span>
            <h2 className="text-3xl md:text-4xl font-bold text-secondary dark:text-white">Grup Şirketlerimiz</h2>
            <p className="mt-4 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">Dokuz farklı sektörde öncü iştiraklerimizle hizmet veriyoruz.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { id: "otomotiv", title: "Derya Otomotiv", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuD8Di3Gl2leSYoYJXlA-chRLIJaSI_WcdrQHVwZ373IKCq7JwPaJ4d3ZeFhowjswi7uCKXoSJhB1ZH2MtD4ADtVp9qjPJq6wgdJpW-BJ4Mca2GATCg1i76cnbyAmpqU9UmO8CUtfyCy5BCpVCxBuBh_L5kjAulMwAKOREeGlnbJ_0dppZI3c5WX3dpvuftAeoCSP0ek5OuPXaBCcy3cz4SjvZTBlOhzPZm9P7XbcuMn8pXNHjZMdHaXHV5ahFMInbMzwgek4Q1s91g", tag: "Otomotiv" },
              { id: "insaat", title: "Derya İnşaat", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCXUwsnFWqwnLfRDpUYGLB9zO8ZoyfBEld9xNhdtJGvSQ2BKwrp-EY2SfiMeTHZYdQakE6Bq97IGFsJQWj-suheK_4IoZnqx_VvKQQU0O5KQEY-8wdQbx0ws_lpDUu3avfsoBJU5GRGZ7q0sZsl1OGHk76kf_-24fr4U3Y5HApI2FxX2oV0nRLtAYkc0Wdm6lhVtjkgOmuif3TKysPeIzAA7_kq6R2O6OUGhcwf5Dz-md_v9QNznDvib5HIZfKB0gTeeMYFJayqjco", tag: "İnşaat" },
              { id: "sigorta", title: "Derya Sigorta", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAuqifC2g5FLWPL1_LMTAAn1rcF-nw2PFnXUNjHJ2h6g6a1W5A-GDoiTGdtgUixiUdIDuM7oOX83DlLjkRVeKgLTQQPhHAPPDWWUfXXuOloqCywJ5fFgwwxLQzdZ2RjeodiLWvzRGf74ba-UkbXuj7Be682Zbs_1lBtBY6kFzQuKOf6DP2hGa1C5kP_Kr9fl7xHCtHRLGaz9vFoiJ1LFdxPqEbXBCsScbbxV906o8HReKglrl5-Z1-a-L7gaDeEiUCJjZbdX6DhQno", tag: "Sigorta" },
              { id: "elektronik", title: "Derya Klima", img: "https://images.unsplash.com/photo-1545259741-2ea3ebf61fa3?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", tag: "Elektronik" },
              { id: "chefmezze", title: "ChefMezze", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCHeGwkMJpGIFuBOwGMB795KVpnGoaF0Uhdq0m-NE2g_fpJAzK1Q5b7_sEKNzHytezxsgEqTuVLK9CIjynMnnn8y5PMWp19EeXwcZuvWOY1Bniz7c2qTB1Pf3piRmmgjppZHIu9nHzZraacqNbxX5mOsKUyN7r2M4DTF5tINftrKeLZ1W6pBeeMwSO--xkOtUTJGlkB-vAgzGMG0PWrB0_sVCzFEVrQncFWu8rRRKDVDwRNAKJyvtPnqSUbD5GrlnHK-wvo86NBvR4", tag: "Gıda & Hizmet" },
              { id: "marble", title: "Derya MARBLE", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDQTc_XhPBkW8yIfkzLDYgcUJu-bclX7V2bxdfp0oTRpa09_d9HdoArV-YSyq-evONl3dy3HbadxlLGUiUV1ChPQLK0b-SMu5uKP0unJ9SzU1SIiKCEDJseJFb-n380wwn0q13n870lj8Muoov_XS6n7PL_ZHTt-uEomiMUx0MUv3BrpfF9KQhKcYviFKTr2AkS0VMvWU0uSQw81HGAq15fWT1fxfqRLK2F2ioBq9JoiTlsaza45QG5LWb2FzdewbNCtk4WkR_wfNU", tag: "Madencilik" }
            ].map((company) => (
              <div key={company.id} className="group relative overflow-hidden rounded-2xl bg-white dark:bg-white/5 shadow-sm hover:shadow-xl transition-all duration-300">
                <div className="h-64 overflow-hidden relative">
                  <div className="absolute inset-0 bg-secondary/20 group-hover:bg-secondary/0 transition-colors z-10"></div>
                  <img alt={company.title} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" src={company.img} />
                </div>
                <div className="p-6 relative z-20">
                  <div className="flex justify-between items-end">
                    <div>
                      <span className="text-xs font-bold text-primary uppercase tracking-wider mb-1 block">{company.tag}</span>
                      <h3 className="text-xl font-bold text-secondary dark:text-white">{company.title}</h3>
                    </div>
                    <Link to={`/sirket/${company.id}`} className="size-10 rounded-full bg-background-light dark:bg-white/10 group-hover:bg-primary flex items-center justify-center transition-colors">
                      <span className="material-symbols-outlined text-secondary text-xl">arrow_outward</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link to="/sirket/otomotiv" className="text-secondary dark:text-white font-bold hover:text-primary transition-colors flex items-center gap-2 mx-auto inline-flex">
              <span>Tüm Şirketleri İncele</span>
              <span className="material-symbols-outlined">arrow_forward</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-24 bg-secondary text-white relative overflow-hidden">
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
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8 hover:bg-white/10 transition-all cursor-pointer">
              <div className="text-primary mb-4">
                <span className="material-symbols-outlined text-4xl">trophy</span>
              </div>
              <div className="text-sm text-gray-400 mb-2">2023</div>
              <h3 className="text-xl font-bold mb-3">Yılın En İyi Otomotiv Bayisi</h3>
              <p className="text-gray-300 text-sm leading-relaxed">Müşteri memnuniyeti ve satış performansı kategorisinde bölge birinciliği ödülü.</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8 hover:bg-white/10 transition-all cursor-pointer">
              <div className="text-primary mb-4">
                <span className="material-symbols-outlined text-4xl">verified</span>
              </div>
              <div className="text-sm text-gray-400 mb-2">2022</div>
              <h3 className="text-xl font-bold mb-3">Güvenilir İnşaat Markası</h3>
              <p className="text-gray-300 text-sm leading-relaxed">Kalite standartları ve proje teslim sürelerindeki başarı ile sektör ödülü.</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8 hover:bg-white/10 transition-all cursor-pointer">
              <div className="text-primary mb-4">
                <span className="material-symbols-outlined text-4xl">workspace_premium</span>
              </div>
              <div className="text-sm text-gray-400 mb-2">2021</div>
              <h3 className="text-xl font-bold mb-3">Kurumsal Sorumluluk Ödülü</h3>
              <p className="text-gray-300 text-sm leading-relaxed">Eğitime destek ve çevre projeleri kapsamında verilen onur ödülü.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="social-wall" className={`py-24 bg-background-light dark:bg-neutral-900 border-t border-gray-100 dark:border-white/5 ${socialData && !socialData.isVisible ? 'hidden' : ''}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
              <span className="text-primary font-bold tracking-wider uppercase text-sm mb-2 block">Sosyal Medyada Biz</span>
              <h2 className="text-3xl md:text-4xl font-bold text-secondary dark:text-white">Sosyal Medyadan Paylaşımlar</h2>
              <p className="mt-4 text-gray-600 dark:text-gray-400 max-w-2xl">
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
                  <img src={`http://localhost:3003/uploads/social/${post.imagePath}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={post.platform} />

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

      <section className="py-16 bg-white dark:bg-background-dark border-t border-gray-100 dark:border-white/5">
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