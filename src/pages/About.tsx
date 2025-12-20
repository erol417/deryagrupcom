import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';

const getEmbedUrl = (url: string) => {
  if (!url) return '';
  let id = '';
  try {
    if (url.includes('embed/')) id = url.split('embed/')[1].split('?')[0];
    else if (url.includes('watch?v=')) id = url.split('watch?v=')[1].split('&')[0];
    else if (url.includes('youtu.be/')) id = url.split('youtu.be/')[1].split('?')[0];
  } catch (e) { console.error('Video ID parse error', e); }

  if (id) return `https://www.youtube.com/embed/${id}?rel=0`;
  return url;
}

export default function About() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/about`)
      .then(res => res.json())
      .then(d => setData(d))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const history = data?.history?.sort((a: any, b: any) => parseInt(a.year) - parseInt(b.year)) || [];

  return (
    <>
      {/* 1. Header Section (Hero) */}
      <section className="relative h-[400px] flex items-center justify-center text-center text-white bg-gray-900">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40 transition-all duration-1000"
          style={{ backgroundImage: `url('${data?.hero?.image ? (data.hero.image.startsWith('http') ? data.hero.image : `${API_BASE_URL}/uploads/${data.hero.image}`) : 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2670&auto=format&fit=crop'}')` }}
        ></div>
        <div className="relative z-10 px-4 animate-fade-in-up">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 drop-shadow-lg">{data?.hero?.title || 'Hakkımızda'}</h1>
          <p className="text-xl md:text-2xl text-gray-200 font-light max-w-3xl mx-auto drop-shadow-md">
            {data?.hero?.subtitle || "1995'ten beri güven, kalite ve yenilikçi çözümlerle sektörde fark yaratıyoruz."}
          </p>
        </div>
      </section>

      {/* 2. Derya Grup Kimdir? */}
      <section className="py-24 bg-white dark:bg-background-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <div className="w-full lg:w-1/2">
              <h2 className="text-3xl md:text-4xl font-bold text-secondary dark:text-white mb-2">
                {data?.whoWeAre?.title || 'Derya Grup Kimdir?'}
              </h2>
              <div className="h-1 w-20 bg-primary mb-6"></div>

              <div className="text-gray-600 dark:text-gray-300 space-y-4 leading-relaxed mb-8 whitespace-pre-line text-lg">
                {data?.whoWeAre?.content ? data.whoWeAre.content : (
                  <>
                    <p>1979 yılından bu yana inşaat, otomotiv ve sigorta gibi farklı sektörde öncü adımlar atan Derya Grup, kalite standartlarını sürekli yükselterek müşterilerine en iyi hizmeti sunmayı amaçlamaktadır.</p>
                    <p>Modern vizyonumuz ve uzman kadromuzla, sadece bugünü değil geleceği de inşa ediyoruz.</p>
                  </>
                )}
              </div>

              <div className="flex flex-wrap gap-6">
                {data?.stats && data.stats.length > 0 ? (
                  data.stats.map((stat: any, i: number) => (
                    <div key={i} className="bg-gray-50 dark:bg-white/5 p-6 rounded-xl border border-gray-100 dark:border-white/10 min-w-[160px] flex-1">
                      <span className="block text-3xl font-bold text-secondary dark:text-white mb-1">{stat.value}</span>
                      <span className="text-sm text-gray-500">{stat.label}</span>
                    </div>
                  ))
                ) : (
                  <>
                    <div className="bg-gray-50 dark:bg-white/5 p-6 rounded-xl border border-gray-100 dark:border-white/10 min-w-[160px]">
                      <span className="block text-3xl font-bold text-secondary dark:text-white mb-1">47+</span>
                      <span className="text-sm text-gray-500">Yıllık Tecrübe</span>
                    </div>
                    <div className="bg-gray-50 dark:bg-white/5 p-6 rounded-xl border border-gray-100 dark:border-white/10 min-w-[160px]">
                      <span className="block text-3xl font-bold text-secondary dark:text-white mb-1">100.000+</span>
                      <span className="text-sm text-gray-500">Hizmet Verilmiş Müşteri</span>
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="w-full lg:w-1/2 relative">
              {/* Decorative Background Elements */}
              <div className="absolute -top-6 -right-6 w-full h-full bg-primary/10 rounded-3xl -z-10 transform rotate-3 hidden md:block"></div>
              <div className="absolute -bottom-6 -left-6 w-full h-full bg-secondary/5 dark:bg-white/5 rounded-3xl -z-10 transform -rotate-2 hidden md:block"></div>

              {/* Video Container (16:9 Aspect Ratio) */}
              <div className="relative aspect-video rounded-2xl shadow-2xl overflow-hidden border-4 border-white dark:border-white/10 group bg-black">
                <iframe
                  className="w-full h-full"
                  src={getEmbedUrl(data?.videoUrl) || "https://www.youtube.com/embed/ZVaR0TnPf1Q?si=xHJ_OvNF6qC7FFpR&rel=0"}
                  title="Derya Grup Tanıtım Filmi"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Değerlerimiz */}
      <section className="py-24 bg-gray-50 dark:bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-secondary dark:text-white mb-4">Değerlerimiz</h2>
          <p className="text-gray-500 mb-16 max-w-2xl mx-auto">Bizi biz yapan, her projede rehber edindiğimiz temel prensiplerimiz.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {data?.values && data.values.length > 0 ? (
              data.values.map((val: any, i: number) => (
                <div key={i} className="bg-white dark:bg-white/5 p-8 rounded-xl shadow-sm hover:shadow-lg transition-all text-left group">
                  <div className="size-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-primary flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                    <span className="material-symbols-outlined">{val.icon || 'star'}</span>
                  </div>
                  <h3 className="text-xl font-bold text-secondary dark:text-white mb-3">{val.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {val.desc}
                  </p>
                </div>
              ))
            ) : (
              // Fallback Defaults if no values set
              <>
                <div className="bg-white dark:bg-white/5 p-8 rounded-xl shadow-sm hover:shadow-lg transition-all text-left group">
                  <div className="size-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-primary flex items-center justify-center mb-6"><span className="material-symbols-outlined">verified_user</span></div>
                  <h3 className="text-xl font-bold text-secondary dark:text-white mb-3">Güven</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">İş ortaklarımız ve müşterilerimize sunduğumuz hizmette dürüstlük ve şeffaflık esastır.</p>
                </div>
                <div className="bg-white dark:bg-white/5 p-8 rounded-xl shadow-sm hover:shadow-lg transition-all text-left group">
                  <div className="size-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-primary flex items-center justify-center mb-6"><span className="material-symbols-outlined">lightbulb</span></div>
                  <h3 className="text-xl font-bold text-secondary dark:text-white mb-3">İnovasyon</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">En yeni teknolojileri takip ederek, süreçlerimizi ve hizmet kalitemizi sürekli geliştiriyoruz.</p>
                </div>
                <div className="bg-white dark:bg-white/5 p-8 rounded-xl shadow-sm hover:shadow-lg transition-all text-left group">
                  <div className="size-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-primary flex items-center justify-center mb-6"><span className="material-symbols-outlined">eco</span></div>
                  <h3 className="text-xl font-bold text-secondary dark:text-white mb-3">Sürdürülebilirlik</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Çevreye duyarlı projeler geliştirerek, gelecek nesillere yaşanabilir bir dünya bırakmayı hedefliyoruz.</p>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* 4. Tarihçemiz - Modern Slider */}
      <section className="py-24 bg-white dark:bg-background-dark overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-secondary dark:text-white mb-16">Tarihçemiz</h2>

          {loading ? (
            <div className="text-center py-10">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-500">Tarihçe yükleniyor...</p>
            </div>
          ) : history.length === 0 ? (
            <div className="text-center py-20 bg-gray-50 dark:bg-white/5 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
              <span className="material-symbols-outlined text-5xl text-gray-300 dark:text-gray-600 mb-4 block mx-auto">history_edu</span>
              <p className="text-lg font-medium text-gray-500 dark:text-gray-400 italic">"Henüz tarihçe eklenmemiş."</p>
            </div>
          ) : (
            <div className="flex flex-col gap-12 select-none">

              {/* Timeline Navigation */}
              <div className="flex items-center gap-3 overflow-x-auto pb-6 no-scrollbar snap-x justify-start md:justify-center px-4">
                {history.map((item: any, index: number) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveIndex(index)}
                    className={`
                                px-6 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap snap-center border-2
                                ${activeIndex === index
                        ? 'bg-primary border-primary text-white shadow-lg scale-110 z-10'
                        : 'bg-white dark:bg-transparent border-gray-100 dark:border-gray-700 text-gray-500 hover:border-primary/50 hover:text-primary'
                      }
                            `}
                  >
                    {item.year}
                  </button>
                ))}
              </div>

              {/* Active Content Area */}
              <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center min-h-[400px]">
                {/* Left: Image */}
                <div className="relative group order-2 lg:order-1 w-full flex justify-center lg:block">
                  <div className="absolute inset-0 bg-primary/10 transform -rotate-2 rounded-2xl -z-10 transition-transform group-hover:rotate-0 duration-500 hidden lg:block"></div>
                  <div className="absolute inset-0 bg-secondary/5 transform rotate-2 rounded-2xl -z-20 transition-transform group-hover:rotate-0 duration-500 hidden lg:block"></div>
                  <img
                    key={history[activeIndex].id}
                    src={history[activeIndex].image
                      ? (history[activeIndex].image.startsWith('http') || history[activeIndex].image.startsWith('blob:')
                        ? history[activeIndex].image
                        : `${API_BASE_URL}/uploads/${history[activeIndex].image}`)
                      : `https://placehold.co/800x600/e2e8f0/475569?text=${history[activeIndex].year}`
                    }
                    alt={history[activeIndex].title}
                    className="w-full max-w-lg lg:max-w-full h-[300px] sm:h-[400px] object-cover rounded-2xl shadow-xl animate-fade-in transition-all"
                  />
                </div>

                {/* Right: Text */}
                <div className="space-y-6 order-1 lg:order-2 text-center lg:text-left animate-slide-up">
                  <div className="relative inline-block">
                    <span className="text-9xl font-black text-gray-50 dark:text-white/5 absolute -top-10 -left-10 -z-10 select-none hidden lg:block">
                      {history[activeIndex].year}
                    </span>
                    <h3 className="text-3xl md:text-5xl font-bold text-secondary dark:text-white leading-tight relative z-10">
                      {history[activeIndex].title}
                    </h3>
                  </div>
                  <div className="h-1.5 w-24 bg-primary rounded-full mx-auto lg:mx-0"></div>
                  <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                    {history[activeIndex].description}
                  </p>

                  {/* Navigation Arrows */}
                  <div className="flex items-center justify-center lg:justify-start gap-4 pt-4">
                    <button
                      onClick={() => setActiveIndex(prev => prev > 0 ? prev - 1 : history.length - 1)}
                      className="p-3 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors border border-gray-200 dark:border-gray-700 bg-white dark:bg-transparent group"
                    >
                      <span className="material-symbols-outlined text-gray-400 group-hover:text-primary transition-colors">arrow_back</span>
                    </button>
                    <span className="text-sm font-medium text-gray-400">
                      {activeIndex + 1} / {history.length}
                    </span>
                    <button
                      onClick={() => setActiveIndex(prev => prev < history.length - 1 ? prev + 1 : 0)}
                      className="p-3 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors border border-gray-200 dark:border-gray-700 bg-white dark:bg-transparent group"
                    >
                      <span className="material-symbols-outlined text-gray-400 group-hover:text-primary transition-colors">arrow_forward</span>
                    </button>
                  </div>
                </div>
              </div>

            </div>
          )}
        </div>
      </section>

      {/* Slogan Separator */}
      <section className="py-20 bg-primary/5 dark:bg-white/5 border-y border-primary/10 dark:border-white/5">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <span className="material-symbols-outlined text-4xl text-primary mb-6 animate-pulse">diamond</span>
          <h2 className="text-3xl md:text-5xl font-light text-secondary dark:text-white leading-tight font-serif italic">
            "Sürekli Kalite Hedefimiz;<br className="hidden md:block" />
            <span className="font-bold text-primary not-italic mt-2 block">Müşteri Geleceğimizdir"</span>
          </h2>
        </div>
      </section>

      {/* 5. Yönetim Kurulu Mesajı */}
      <section className="py-24 bg-gray-50 dark:bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-16 items-start">
            <div className="w-full lg:w-5/12 relative">
              <div className="relative rounded-lg overflow-hidden shadow-2xl">
                <img
                  src={data?.chairman?.image ? `${API_BASE_URL}/uploads/${data.chairman.image}` : "/images/huseyin_kis.png"}
                  alt={data?.chairman?.name || "Hüseyin Kış"}
                  className="w-full h-auto object-cover aspect-[4/5]"
                />
                <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/90 via-black/50 to-transparent p-8">
                  <h3 className="text-2xl font-bold text-white">{data?.chairman?.name || "Hüseyin Kış"}</h3>
                  <p className="text-primary font-medium">{data?.chairman?.title || "Yönetim Kurulu Başkanı"}</p>
                </div>
              </div>
              {/* Decorative border matching design */}
              <div className="absolute top-4 -left-4 w-full h-full border-2 border-primary/30 rounded-lg -z-10 hidden lg:block"></div>
            </div>

            <div className="w-full lg:w-7/12">
              <h2 className="text-3xl font-bold text-secondary dark:text-white mb-8">Yönetim Kurulu Başkanının Mesajı</h2>
              <span className="material-symbols-outlined text-6xl text-gray-200 mb-6 block">format_quote</span>

              <div className="space-y-6 text-gray-600 dark:text-gray-300 leading-relaxed text-lg whitespace-pre-line">
                {data?.chairman?.message ? data.chairman.message : (
                  <p>Değerli İş Ortaklarımız ve Çalışanlarımız...</p>
                )}
              </div>

              <div className="mt-8 opacity-70">
                {/* Placeholder for Signature */}
                <span className="font-handwriting text-4xl text-secondary dark:text-white">{data?.chairman?.name || "Hüseyin Kış"}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CTA Section */}
      <section className="py-20 bg-primary text-white text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Geleceği Birlikte İnşa Edelim</h2>
          <p className="text-blue-100 text-lg mb-10">
            Projelerinizde profesyonel bir ortak arıyorsanız, Derya Grup tecrübesiyle yanınızda.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-white text-primary font-bold rounded-lg hover:bg-gray-100 transition-colors shadow-lg">
              Bize Ulaşın
            </button>
            <button className="px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-lg hover:bg-white/10 transition-colors">
              Projelerimizi İnceleyin
            </button>
          </div>
        </div>
      </section>
    </>
  )
}