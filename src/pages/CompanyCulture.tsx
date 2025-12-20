
import { useEffect, useState } from 'react';
import { API_BASE_URL } from '../config';

interface Value {
    title: string;
    desc: string;
    icon: string;
}

interface Perk {
    title: string;
    icon: string;
}

interface Quote {
    name: string;
    position: string;
    text: string;
    photo?: string;
}

interface CultureData {
    heroTitle: string;
    heroSubtitle: string;
    heroImage?: string; // Opsiyonel
    perksImage?: string; // Opsiyonel - Ayrıcalıklar resmi
    values: Value[];
    gallery: string[];
    perks: Perk[];
    quotes: Quote[];
}

export default function CompanyCulture() {
    const [data, setData] = useState<CultureData | null>(null);

    useEffect(() => {
        window.scrollTo(0, 0);
        fetch(`${API_BASE_URL}/api/culture`)
            .then(res => res.json())
            .then((resData) => {
                if (resData && Object.keys(resData).length > 0) {
                    setData(resData);
                }
            })
            .catch(err => {
                console.error("Kültür verisi çekilemedi, varsayılan veri kullanılıyor:", err);
                setData({
                    heroTitle: "Birlikte Büyüyoruz",
                    heroSubtitle: "Derya Grup'ta çalışmak sadece bir iş değil, bir tutkudur.",
                    values: [
                        { title: "Güven", desc: "İlişkilerimizin temeli güvene dayanır.", icon: "handshake" },
                        { title: "İnovasyon", desc: "Geleceği şekillendirmek için sürekli yenileniriz.", icon: "lightbulb" },
                        { title: "İnsan Odaklılık", desc: "En büyük değerimiz çalışanlarımızdır.", icon: "groups" }
                    ],
                    gallery: [],
                    perks: [
                        { title: "Sürekli Eğitim", icon: "school" },
                        { title: "Özel Sağlık Sigortası", icon: "health_and_safety" },
                        { title: "Sosyal Etkinlikler", icon: "celebration" },
                        { title: "Yemek & Ulaşım", icon: "restaurant" }
                    ],
                    quotes: [
                        { name: "Ayşe Yılmaz", position: "Proje Yöneticisi", text: "Burada her gün yeni bir şey öğreniyorum. Destekleyici bir ekip var." },
                        { name: "Mehmet Demir", position: "Satış Uzmanı", text: "Derya Grup ailesinin bir parçası olmak gurur verici." }
                    ]
                });
            });
    }, []);

    if (!data) return <div className="h-screen flex items-center justify-center">Yükleniyor...</div>;

    return (
        <div className="bg-white font-sans text-gray-900">
            {/* HERO SECTION */}
            <div className="relative h-[80vh] w-full overflow-hidden flex items-center justify-center text-center px-4">
                <div className="absolute inset-0 bg-gradient-to-b from-gray-900/70 to-gray-900/30 z-10"></div>
                <img
                    src={data.heroImage ? (data.heroImage.startsWith('http') ? data.heroImage : `${API_BASE_URL}/uploads/${data.heroImage}`) : "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2670&auto=format&fit=crop"}
                    alt="Company Culture"
                    className="absolute inset-0 w-full h-full object-cover"
                />

                <div className="relative z-20 max-w-4xl mx-auto space-y-6">
                    <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight leading-tight">
                        {data.heroTitle}
                    </h1>
                    <p className="text-xl text-gray-200 max-w-2xl mx-auto font-light leading-relaxed">
                        {data.heroSubtitle}
                    </p>
                    <div className="pt-8">
                        <span className="inline-block w-1 h-20 bg-gradient-to-b from-blue-500 to-transparent rounded-full animate-bounce"></span>
                    </div>
                </div>
            </div>

            {/* MANIFESTO (VALUES) */}
            <div className="py-24 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <span className="text-blue-600 font-bold tracking-widest uppercase text-sm">Değerlerimiz</span>
                        <h2 className="text-4xl font-bold mt-2">Bizi Biz Yapanlar</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {data.values?.map((val, i) => (
                            <div key={i} className="bg-white p-10 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 group border border-gray-100">
                                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 text-3xl group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                                    <span className="material-symbols-outlined">{val.icon}</span>
                                </div>
                                <h3 className="text-2xl font-bold mb-4">{val.title}</h3>
                                <p className="text-gray-500 leading-relaxed">{val.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* GALLERY (MASONRY) */}
            <div className="py-24 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 mb-16 flex justify-between items-end">
                    <div>
                        <span className="text-blue-600 font-bold tracking-widest uppercase text-sm">Yaşam</span>
                        <h2 className="text-4xl font-bold mt-2">Ofisten Kareler</h2>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-4 h-[600px] overflow-hidden">
                    {/* Static Placeholder Gallery if empty */}
                    {(!data.gallery || data.gallery.length === 0) ? (
                        <>
                            <div className="col-span-2 row-span-2 rounded-2xl overflow-hidden relative group">
                                <img src="https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=2670&auto=format&fit=crop" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Gallery 1" />
                            </div>
                            <div className="rounded-2xl overflow-hidden relative group">
                                <img src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2664&auto=format&fit=crop" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Gallery 2" />
                            </div>
                            <div className="rounded-2xl overflow-hidden relative group">
                                <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=2576&auto=format&fit=crop" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Gallery 3" />
                            </div>
                            <div className="col-span-2 rounded-2xl overflow-hidden relative group">
                                <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2671&auto=format&fit=crop" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Gallery 4" />
                            </div>
                        </>
                    ) : (
                        data.gallery.map((img, i) => (
                            <div key={i} className={`rounded-2xl overflow-hidden relative group ${i === 0 ? 'col-span-2 row-span-2' : ''}`}>
                                <img
                                    src={img.startsWith('http') ? img : `${API_BASE_URL}/uploads/${img}`}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    alt="Gallery"
                                />
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* PERKS */}
            <div className="py-24 bg-[#0f172a] text-white">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <span className="text-blue-500 font-bold tracking-widest uppercase text-sm">Ayrıcalıklar</span>
                            <h2 className="text-4xl font-bold mt-2 mb-6">Siz mutluysanız,<br />biz de mutluyuz.</h2>
                            <p className="text-gray-400 text-lg leading-relaxed mb-8">
                                Çalışanlarımızın refahını önemsiyor, iş-yaşam dengesini destekleyen paketler sunuyoruz.
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {data.perks?.map((perk, i) => (
                                    <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
                                        <span className="material-symbols-outlined text-blue-400">{perk.icon}</span>
                                        <span className="font-bold">{perk.title}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="relative">
                            <img
                                src={data.perksImage ? (data.perksImage.startsWith('http') ? data.perksImage : `${API_BASE_URL}/uploads/${data.perksImage}`) : "https://images.unsplash.com/photo-1553028826-f4804a6dba3b?q=80&w=2070&auto=format&fit=crop"}
                                className="rounded-3xl shadow-2xl transform md:rotate-3 hover:rotate-0 transition-transform duration-500"
                                alt="Perks"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* QUOTES (TESTIMONIALS) */}
            <div className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4">
                    <h2 className="text-center text-4xl font-bold mb-16">Ekibimizden Dinleyin</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {data.quotes?.map((quote, i) => (
                            <div key={i} className="bg-gray-50 p-8 rounded-3xl relative">
                                <span className="material-symbols-outlined text-6xl text-gray-200 absolute top-4 right-4">format_quote</span>
                                <p className="text-gray-600 text-lg italic mb-8 relative z-10 leading-relaxed">
                                    "{quote.text}"
                                </p>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl overflow-hidden">
                                        {quote.photo ? (
                                            <img src={`${API_BASE_URL}/uploads/${quote.photo}`} className="w-full h-full object-cover" />
                                        ) : (
                                            quote.name.charAt(0)
                                        )}
                                    </div>
                                    <div>
                                        <div className="font-bold text-gray-900">{quote.name}</div>
                                        <div className="text-sm text-gray-500">{quote.position}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* CTA */}
            <div className="py-20 bg-blue-600 text-center text-white">
                <h2 className="text-3xl font-bold mb-6">Sen de Aramıza Katıl!</h2>
                <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">Hikayemizin bir parçası olmak ve kariyerinde yeni bir sayfa açmak için açık pozisyonlarımıza göz at.</p>
                <a href="/kariyer" className="inline-block bg-white text-blue-600 px-8 py-4 rounded-full font-bold shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all">
                    Açık Pozisyonları İncele
                </a>
            </div>
        </div>
    );
}
