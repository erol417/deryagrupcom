import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface News {
    id: number;
    title: string;
    summary: string;
    date: string;
    imagePath: string | null;
    category?: string; // Mock category
}

export default function NewsList() {
    const [news, setNews] = useState<News[]>([]);
    const [filteredNews, setFilteredNews] = useState<News[]>([]);
    const [activeTab, setActiveTab] = useState('Tümü');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetch('http://localhost:3003/api/news')
            .then(res => res.json())
            .then(data => {
                setNews(data);
                setFilteredNews(data);
            })
            .catch(err => {
                console.error("API Error, using mock data:", err);
                const MOCK_DATA = [
                    { id: 1, title: 'Yılın En Başarılı Otomotiv Grubu Ödülü', summary: 'Sektördeki yenilikçi yaklaşımımız ve müşteri memnuniyeti odaklı çalışmalarımız ödüle layık görüldü.', date: '2024-03-15', imagePath: null, category: 'BASINDA BİZ' },
                    { id: 2, title: 'Geleceğe Nefes: 1000 Fidan Toprakla Buluştu', summary: 'Sosyal sorumluluk projelerimiz kapsamında çalışanlarımızla birlikte hatıra ormanı oluşturduk.', date: '2024-02-20', imagePath: null, category: 'SOSYAL SORUMLULUK' },
                    { id: 3, title: 'Teknoloji ve İnovasyon Zirvesi', summary: 'Dijital dönüşüm vizyonumuzu paylaştığımız sektör buluşmasında yoğun ilgi gördük.', date: '2024-01-10', imagePath: null, category: 'ETKİNLİK' },
                    { id: 4, title: 'Genç Yetenekler Staj Programı Başlıyor', summary: 'Üniversite öğrencilerine yönelik kariyer ve gelişim programımız için başvurular açıldı.', date: '2023-12-05', imagePath: null, category: 'DUYURU' },
                ];
                setNews(MOCK_DATA);
                setFilteredNews(MOCK_DATA);
            });
    }, []);

    useEffect(() => {
        let result = news;

        // Filter by Tab
        if (activeTab !== 'Tümü') {
            const mapTabToCat: any = {
                'Etkinlikler': 'ETKİNLİK',
                'Basında Biz': 'BASINDA BİZ',
                'Sosyal Sorumluluk': 'SOSYAL SORUMLULUK',
                'Duyurular': 'DUYURU'
            };
            if (mapTabToCat[activeTab]) {
                result = result.filter(item => item.category === mapTabToCat[activeTab]);
            }
        }

        // Filter by Search
        if (searchTerm) {
            result = result.filter(n => n.title.toLowerCase().includes(searchTerm.toLowerCase()));
        }

        setFilteredNews(result);
    }, [activeTab, searchTerm, news]);

    return (
        <div className="bg-white font-sans flex flex-col min-h-screen">
            {/* HEADER SECTION */}
            <div className="bg-white pt-24 pb-12 border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <span className="text-blue-600 font-bold tracking-widest uppercase text-sm mb-3 block">MEDYA MERKEZİ</span>
                    <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 tracking-tight">
                        Bizden Haberler
                    </h1>
                    <p className="text-gray-500 text-lg max-w-2xl leading-relaxed">
                        Derya Grup'un en güncel etkinliklerini, sosyal sorumluluk projelerini ve
                        basındaki yansımalarını buradan takip edebilirsiniz.
                    </p>
                </div>
            </div>

            {/* FILTER & SEARCH BAR */}
            <div className="bg-gray-50/50 border-b border-gray-100 sticky top-20 z-10 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        {/* Tabs */}
                        <div className="flex gap-1 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
                            {['Tümü', 'Etkinlikler', 'Basında Biz', 'Sosyal Sorumluluk', 'Duyurular'].map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap ${activeTab === tab
                                        ? 'bg-blue-700 text-white shadow-md shadow-blue-200'
                                        : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-100'
                                        }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        {/* Search & Date */}
                        <div className="flex gap-3">
                            <div className="relative group min-w-[240px]">
                                <input
                                    type="text"
                                    placeholder="Haberlerde ara..."
                                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <span className="material-symbols-outlined absolute left-3 top-2.5 text-gray-400 group-focus-within:text-blue-500 transition-colors text-[20px]">search</span>
                            </div>
                            <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors">
                                <span className="material-symbols-outlined text-[20px]">calendar_today</span>
                                2024
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* NEWS GRID */}
            <main className="flex-1 w-full bg-gray-50 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredNews.map((item) => (
                            <Link to={`/news/${item.id}`} key={item.id} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full border border-gray-100">
                                {/* Image Container */}
                                <div className="h-60 overflow-hidden relative bg-gray-200">
                                    <div className="absolute top-4 left-4 z-10">
                                        <span className={`px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider text-white shadow-sm ${item.category === 'ETKİNLİK' ? 'bg-blue-600' :
                                            item.category === 'BASINDA BİZ' ? 'bg-purple-600' : 'bg-green-600'
                                            }`}>
                                            {item.category}
                                        </span>
                                    </div>
                                    {item.imagePath ? (
                                        <img
                                            src={`http://localhost:3003/uploads/news/${item.imagePath}`}
                                            alt={item.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                                            <span className="material-symbols-outlined text-5xl">newspaper</span>
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="p-8 flex flex-col flex-1">
                                    <div className="flex items-center gap-2 text-gray-400 text-xs font-medium mb-3">
                                        <span className="material-symbols-outlined text-[16px]">calendar_month</span>
                                        {new Date(item.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                                    </div>

                                    <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-700 transition-colors leading-snug line-clamp-2">
                                        {item.title}
                                    </h2>

                                    <p className="text-gray-500 mb-6 line-clamp-3 text-sm leading-relaxed font-normal">
                                        {item.summary}
                                    </p>

                                    <div className="mt-auto">
                                        <span className="inline-flex items-center text-blue-600 font-bold text-sm group/btn transition-all group-hover:gap-1">
                                            Devamını Oku
                                            <span className="material-symbols-outlined text-lg ml-1 transition-transform group-hover/btn:translate-x-1">arrow_forward</span>
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* Empty State */}
                    {filteredNews.length === 0 && (
                        <div className="text-center py-24">
                            <div className="inline-flex items-center justify-center size-20 rounded-full bg-gray-100 mb-4">
                                <span className="material-symbols-outlined text-gray-400 text-4xl">search_off</span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">Haber Bulunamadı</h3>
                            <p className="text-gray-500">Arama kriterlerinize uygun bir haber kaydı yok.</p>
                        </div>
                    )}

                    {/* Pagination (Visual Only) */}
                    {filteredNews.length > 0 && (
                        <div className="flex justify-center mt-16 gap-2">
                            <button className="size-10 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors disabled:opacity-50" disabled>
                                <span className="material-symbols-outlined text-sm">chevron_left</span>
                            </button>
                            <button className="size-10 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-md shadow-blue-200">1</button>
                            <button className="size-10 rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 font-bold text-sm hover:bg-gray-50 hover:text-blue-600 transition-colors">2</button>
                            <button className="size-10 rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 font-bold text-sm hover:bg-gray-50 hover:text-blue-600 transition-colors">3</button>
                            <div className="flex items-end px-1 pb-2">
                                <span className="text-gray-400 text-xl tracking-widest">...</span>
                            </div>
                            <button className="size-10 rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 font-bold text-sm hover:bg-gray-50 hover:text-blue-600 transition-colors">8</button>
                            <button className="size-10 rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors hover:text-blue-600">
                                <span className="material-symbols-outlined text-sm">chevron_right</span>
                            </button>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
