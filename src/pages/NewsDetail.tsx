import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

interface NewsDetail {
    id: number;
    title: string;
    content: string;
    summary: string;
    date: string;
    imagePath: string | null;
    category?: string;
}

export default function NewsDetail() {
    const { id } = useParams();
    const [news, setNews] = useState<NewsDetail | null>(null);
    const [relatedNews, setRelatedNews] = useState<NewsDetail[]>([]);
    const [allNews, setAllNews] = useState<NewsDetail[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch all news to handle next/prev and related logic
        fetch('http://localhost:3003/api/news')
            .then(res => res.json())
            .then((data: any[]) => {
                setAllNews(data);

                const currentNews = data.find((n: any) => n.id === Number(id));
                if (currentNews) {
                    setNews(currentNews);
                    setRelatedNews(data.filter((n: any) => n.id !== Number(id)).slice(0, 3));
                }
            })
            .catch(err => {
                console.warn("Using mock data due to API error:", err);
                const MOCK_DETAIL_DATA = [
                    { id: 1, title: 'Yılın En Başarılı Otomotiv Grubu Ödülü', summary: 'Sektördeki yenilikçi yaklaşımımız ödül getirdi.', content: '<p>Sektördeki yenilikçi yaklaşımımız ve müşteri memnuniyeti odaklı çalışmalarımız ödüle layık görüldü.</p><p>Törende konuşan Yönetim Kurulu Başkanımız, "Bu başarı tüm ekibimizin emeğidir" dedi.</p>', date: '2024-03-15', imagePath: null, category: 'BASINDA BİZ' },
                    { id: 2, title: 'Geleceğe Nefes: 1000 Fidan', summary: 'Hatıra ormanı oluşturduk.', content: '<p>Sosyal sorumluluk projelerimiz kapsamında çalışanlarımızla birlikte 1000 fidanı toprakla buluşturduk.</p>', date: '2024-02-20', imagePath: null, category: 'SOSYAL SORUMLULUK' },
                    { id: 3, title: 'Teknoloji ve İnovasyon Zirvesi', summary: 'Dijital dönüşüm vizyonu.', content: '<p>Dijital dönüşüm vizyonumuzu paylaştığımız sektör buluşmasında yoğun ilgi gördük.</p>', date: '2024-01-10', imagePath: null, category: 'ETKİNLİK' }
                ];

                setAllNews(MOCK_DETAIL_DATA as any);

                const currentNews = MOCK_DETAIL_DATA.find((n: any) => n.id === Number(id));
                if (currentNews) {
                    setNews((currentNews as unknown) as NewsDetail); // Double cast to avoid TS issues if types mismatch
                    setRelatedNews((MOCK_DETAIL_DATA.filter((n: any) => n.id !== Number(id)).slice(0, 3) as unknown) as NewsDetail[]);
                }
            })
            .finally(() => setLoading(false));

        // Scroll to top on id change
        window.scrollTo(0, 0);
    }, [id]);

    const currentIndex = allNews.findIndex(n => n.id === Number(id));
    const nextNews = currentIndex >= 0 && currentIndex < allNews.length - 1 ? allNews[currentIndex + 1] : null;
    const prevNews = currentIndex > 0 ? allNews[currentIndex - 1] : null;

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
    );

    if (!news) return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-white">
            <h2 className="text-2xl font-bold text-gray-800">Haber Bulunamadı</h2>
            <Link to="/bizden-haberler" className="text-blue-600 font-bold hover:underline">Listeye Dön</Link>
        </div>
    );

    return (
        <div className="bg-white font-sans flex flex-col min-h-screen">
            <Helmet>
                <title>{news.title} - Derya Grup</title>
                <meta property="og:title" content={news.title} />
                <meta property="og:description" content={news.summary} />
                {news.imagePath && <meta property="og:image" content={`http://localhost:3003/uploads/${news.imagePath}`} />}
                <meta property="og:url" content={window.location.href} />
                <meta name="twitter:card" content="summary_large_image" />
            </Helmet>
            {/* BREADCRUMB */}
            <div className="bg-gray-50 border-b border-gray-100 py-4">
                <div className="max-w-4xl mx-auto px-6 text-xs text-gray-500 font-medium">
                    <Link to="/" className="hover:text-blue-600 transition-colors">Ana Sayfa</Link>
                    <span className="mx-2 text-gray-300">/</span>
                    <Link to="/bizden-haberler" className="hover:text-blue-600 transition-colors">Bizden Haberler</Link>
                    <span className="mx-2 text-gray-300">/</span>
                    <span className="text-gray-900 line-clamp-1 align-bottom inline-block max-w-[200px]">{news.title}</span>
                </div>
            </div>

            <main className="flex-1 w-full bg-white pb-20">
                <article className="max-w-4xl mx-auto px-6 py-12">

                    {/* HEADER */}
                    <header className="mb-10">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                {news.category || 'Duyuru'}
                            </span>
                            <span className="text-gray-400 text-xs font-medium flex items-center gap-1">
                                <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                                {new Date(news.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </span>
                        </div>

                        <h1 className="text-3xl md:text-5xl font-black text-gray-900 leading-tight mb-8">
                            {news.title}
                        </h1>

                        <div className="flex items-center justify-between border-t border-b border-gray-100 py-6">
                            <div className="flex items-center gap-3">
                                <div className="size-10 rounded-full bg-gray-200 overflow-hidden">
                                    {/* Dummy Avatar */}
                                    <img src="https://ui-avatars.com/api/?name=Admin+User&background=0D8ABC&color=fff" alt="Yazar" className="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <div className="text-sm font-bold text-gray-900">Kurumsal İletişim</div>
                                    <div className="text-xs text-gray-500">Derya Grup</div>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <button className="size-9 rounded-full bg-gray-50 hover:bg-blue-50 text-gray-500 hover:text-blue-600 flex items-center justify-center transition-colors">
                                    <span className="material-symbols-outlined text-lg">share</span>
                                </button>
                                <button className="size-9 rounded-full bg-gray-50 hover:bg-blue-50 text-gray-500 hover:text-blue-600 flex items-center justify-center transition-colors">
                                    <span className="material-symbols-outlined text-lg">bookmark</span>
                                </button>
                                <button className="size-9 rounded-full bg-gray-50 hover:bg-blue-50 text-gray-500 hover:text-blue-600 flex items-center justify-center transition-colors">
                                    <span className="material-symbols-outlined text-lg">print</span>
                                </button>
                            </div>
                        </div>
                    </header>

                    {/* MAIN IMAGE */}
                    <div className="mb-12 rounded-2xl overflow-hidden shadow-sm bg-gray-100">
                        {news.imagePath ? (
                            <img
                                src={`http://localhost:3003/uploads/news/${news.imagePath}`}
                                alt={news.title}
                                className="w-full h-auto object-cover max-h-[600px]"
                            />
                        ) : (
                            <div className="h-96 w-full flex items-center justify-center text-gray-400">
                                <span className="material-symbols-outlined text-6xl">image</span>
                            </div>
                        )}
                        <div className="bg-gray-50 px-4 py-2 text-xs text-gray-500 text-center italic border-t border-gray-100">
                            {news.title} - Basın Görseli
                        </div>
                    </div>

                    {/* CONTENT */}
                    <div className="prose prose-lg prose-blue max-w-none text-gray-600 leading-relaxed font-normal">
                        {/* Intro / Summary */}
                        <p className="text-xl font-medium text-gray-900 mb-8 leading-relaxed">
                            {news.summary}
                        </p>

                        {/* Actual Content (Assuming plain text, rendering with line breaks) */}
                        {/* Actual Content (Rendered from HTML) */}
                        <div
                            className="font-sans space-y-4 [&>p]:mb-4 [&>h1]:text-3xl [&>h1]:font-bold [&>h2]:text-2xl [&>h2]:font-bold [&>h3]:text-xl [&>h3]:font-bold [&>ul]:list-disc [&>ul]:pl-5 [&>ol]:list-decimal [&>ol]:pl-5 [&>blockquote]:border-l-4 [&>blockquote]:border-blue-500 [&>blockquote]:pl-4 [&>blockquote]:italic"
                            dangerouslySetInnerHTML={{ __html: news.content }}
                        />
                    </div>



                    {/* FOOTER ACTIONS */}
                    <div className="mt-16 flex flex-col md:flex-row items-center justify-between gap-6 border-t border-gray-100 pt-8">
                        <div className="text-sm font-bold text-gray-900">Bu haberi paylaş:</div>
                        <div className="flex gap-4">
                            <div className="flex gap-4">
                                {/* LinkedIn */}
                                <a
                                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="size-10 rounded-full border border-gray-200 hover:border-blue-700 hover:text-white hover:bg-blue-700 text-gray-400 flex items-center justify-center transition-all"
                                    title="LinkedIn'de Paylaş">
                                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                                </a>

                                {/* X (Twitter) */}
                                <a
                                    href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(news.title)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="size-10 rounded-full border border-gray-200 hover:border-black hover:text-white hover:bg-black text-gray-400 flex items-center justify-center transition-all"
                                    title="X'te Paylaş">
                                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                                </a>

                                {/* Facebook */}
                                <a
                                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="size-10 rounded-full border border-gray-200 hover:border-blue-600 hover:text-white hover:bg-blue-600 text-gray-400 flex items-center justify-center transition-all"
                                    title="Facebook'ta Paylaş">
                                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                                </a>

                                {/* Copy Link */}
                                <button
                                    onClick={() => { navigator.clipboard.writeText(window.location.href); alert('Bağlantı kopyalandı!'); }}
                                    className="size-10 rounded-full border border-gray-200 hover:border-gray-600 hover:text-white hover:bg-gray-600 text-gray-400 flex items-center justify-center transition-all"
                                    title="Bağlantıyı Kopyala">
                                    <span className="material-symbols-outlined text-lg">link</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* NAVIGATION - PREV / NEXT */}
                    <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-4">
                        {prevNews ? (
                            <Link to={`/news/${prevNews.id}`} className="group p-6 rounded-xl border border-gray-100 hover:border-blue-100 hover:bg-blue-50/50 transition-all text-left">
                                <div className="text-xs font-bold text-gray-400 mb-2 flex items-center gap-1 group-hover:text-blue-600">
                                    <span className="material-symbols-outlined text-sm">arrow_back</span>
                                    Önceki Haber
                                </div>
                                <div className="text-sm font-bold text-gray-900 line-clamp-2">
                                    {prevNews.title}
                                </div>
                            </Link>
                        ) : <div></div>}

                        {nextNews ? (
                            <Link to={`/news/${nextNews.id}`} className="group p-6 rounded-xl border border-gray-100 hover:border-blue-100 hover:bg-blue-50/50 transition-all text-right">
                                <div className="text-xs font-bold text-gray-400 mb-2 flex items-center justify-end gap-1 group-hover:text-blue-600">
                                    Sonraki Haber
                                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                </div>
                                <div className="text-sm font-bold text-gray-900 line-clamp-2">
                                    {nextNews.title}
                                </div>
                            </Link>
                        ) : <div></div>}
                    </div>

                </article>

                {/* RELATED NEWS SECTION */}
                <div className="bg-gray-50 py-16 border-t border-gray-100">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-2xl font-bold text-gray-900">İlginizi Çekebilecek Diğer Haberler</h3>
                            <Link to="/bizden-haberler" className="text-sm font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1">
                                Tümünü Gör
                                <span className="material-symbols-outlined text-lg">arrow_forward</span>
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {relatedNews.map(item => (
                                <Link to={`/news/${item.id}`} key={item.id} className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
                                    <div className="h-48 overflow-hidden relative">
                                        <div className="absolute top-3 left-3 z-10">
                                            <span className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider text-gray-800">
                                                {item.category}
                                            </span>
                                        </div>
                                        {item.imagePath ? (
                                            <img src={`http://localhost:3003/uploads/news/${item.imagePath}`} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                        ) : (
                                            <div className="bg-gray-200 w-full h-full flex items-center justify-center">
                                                <span className="material-symbols-outlined text-gray-400">image</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-5">
                                        <div className="text-xs text-gray-400 mb-2">
                                            {new Date(item.date).toLocaleDateString('tr-TR')}
                                        </div>
                                        <h4 className="font-bold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                                            {item.title}
                                        </h4>
                                        <div className="mt-4 flex items-center text-blue-600 text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0">
                                            Haberi Oku <span className="material-symbols-outlined text-sm ml-1">arrow_forward</span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
