
import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';
import { useNavigate } from 'react-router-dom';

interface Job {
    id: number;
    title: string;
    department: string;
    location: string;
    type: string;
}

export default function HumanResources() {
    const navigate = useNavigate();
    const [positions, setPositions] = useState<Job[]>([]);

    const stats = [
        { value: "47+", label: "Yıllık Tecrübe", icon: "calendar_month" },
        { value: "400+", label: "Çalışan Sayısı", icon: "groups" },
        { value: "9", label: "Sektör", icon: "task_alt" },
        { value: "100.000+", label: "Mutlu Müşteri", icon: "sentiment_satisfied" }
    ];

    const features = [
        { title: "Sürekli Gelişim", desc: "Eğitim programları ve mentorluk ile kariyer yolculuğunuzda sizi destekliyoruz.", icon: "trending_up" },
        { title: "Takım Ruhu", desc: "Birlikte başarmanın gücüne inanıyor, şeffaf ve destekleyici bir ortam sunuyoruz.", icon: "diversity_3" },
        { title: "İnovasyon", desc: "En yeni teknolojileri ve yöntemleri kullanarak sektörde öncü olmaya devam ediyoruz.", icon: "lightbulb" }
    ];

    useEffect(() => {
        fetch(`${API_BASE_URL}/api/jobs?active=true`)
            .then(res => res.json())
            .then(data => setPositions(data))
            .catch(err => console.error("İlanlar çekilemedi:", err));
    }, []);

    return (
        <div className="bg-gray-50 min-h-screen font-sans">

            {/* HERO SECTION */}
            <div className="relative h-[600px] w-full overflow-hidden">
                <div className="absolute inset-0 bg-black/40 z-10"></div>
                <img
                    src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2669&auto=format&fit=crop"
                    alt="Office"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4">
                    <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight max-w-4xl">
                        Geleceği Derya Grup ile <br /> Şekillendirin
                    </h1>
                    <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl">
                        İnovasyon ve mükemmelliğe adanmış bir ekibe katılın. Kariyerinizde yeni bir sayfa açmak için fırsatları keşfedin.
                    </p>
                    <div className="flex gap-4">
                        <button
                            onClick={() => document.getElementById('positions')?.scrollIntoView({ behavior: 'smooth' })}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-bold transition-all shadow-lg hover:shadow-blue-500/30"
                        >
                            Açık Pozisyonları İncele
                        </button>
                        <button
                            onClick={() => navigate('/kariyer/kultur')}
                            className="bg-white/10 backdrop-blur-md hover:bg-white/20 text-white border border-white/30 px-8 py-4 rounded-lg font-bold transition-all"
                        >
                            Kültürümüzü Tanı
                        </button>
                    </div>
                </div>
            </div>

            {/* STATS */}
            <div className="max-w-7xl mx-auto px-4 -mt-16 relative z-30">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {stats.map((stat, i) => (
                        <div key={i} className="bg-white p-8 rounded-xl shadow-lg hover:-translate-y-1 transition-transform duration-300">
                            <div className="size-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                                <span className="material-symbols-outlined text-2xl">{stat.icon}</span>
                            </div>
                            <div className="text-gray-500 text-sm font-medium mb-1">{stat.label}</div>
                            <div className="text-3xl font-extrabold text-gray-900">{stat.value}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* WHY US */}
            <div className="py-24 max-w-7xl mx-auto px-4">
                <div className="flex flex-col lg:flex-row gap-16 items-center">
                    <div className="lg:w-1/3">
                        <h2 className="text-3xl font-bold text-gray-900 mb-6">Neden Derya Grup?</h2>
                        <p className="text-gray-600 leading-relaxed mb-8">
                            Çalışanlarımıza değer veriyor, sürekli gelişim ve yenilikçilik ilkeleriyle hareket ediyoruz. Derya Grup'ta kariyeriniz sadece bir iş değil, bir yolculuktur.
                        </p>
                        <button className="flex items-center gap-2 text-sm font-bold text-gray-900 border border-gray-300 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors">
                            Kültürümüz Hakkında Daha Fazla <span className="material-symbols-outlined text-base">arrow_forward</span>
                        </button>
                    </div>
                    <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-3 gap-6">
                        {features.map((feature, i) => (
                            <div key={i} className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
                                <div className="size-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mb-6">
                                    <span className="material-symbols-outlined">{feature.icon}</span>
                                </div>
                                <h3 className="font-bold text-lg mb-3">{feature.title}</h3>
                                <p className="text-sm text-gray-500 leading-relaxed">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* HIRING PROCESS */}
            <div className="bg-white py-24 border-y border-gray-100">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">İşe Alım Sürecimiz</h2>
                    <p className="text-gray-500 max-w-2xl mx-auto mb-16">Adil, şeffaf ve yetenek odaklı bir değerlendirme süreci yürütüyoruz.</p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                        <div className="relative z-10">
                            <div className="size-20 mx-auto rounded-full bg-white border-2 border-blue-100 text-blue-600 flex items-center justify-center mb-6 shadow-sm">
                                <span className="material-symbols-outlined text-3xl">assignment_ind</span>
                            </div>
                            <h3 className="font-bold text-lg mb-2">Başvuru</h3>
                            <p className="text-sm text-gray-500 max-w-xs mx-auto">Web sitemiz veya kariyer portalları üzerinden CV'nizi gönderin.</p>
                        </div>
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden md:block absolute top-10 left-1/6 right-1/6 h-0.5 bg-gray-100 -z-0"></div>

                        <div className="relative z-10">
                            <div className="size-20 mx-auto rounded-full bg-white border-2 border-blue-600 text-blue-600 flex items-center justify-center mb-6 shadow-md ring-4 ring-blue-50">
                                <span className="material-symbols-outlined text-3xl">forum</span>
                            </div>
                            <h3 className="font-bold text-lg mb-2">Görüşme</h3>
                            <p className="text-sm text-gray-500 max-w-xs mx-auto">İK ve ilgili departman yöneticileri ile tanışın ve kendinizi anlatın.</p>
                        </div>

                        <div className="relative z-10">
                            <div className="size-20 mx-auto rounded-full bg-white border-2 border-blue-100 text-blue-600 flex items-center justify-center mb-6 shadow-sm">
                                <span className="material-symbols-outlined text-3xl">verified</span>
                            </div>
                            <h3 className="font-bold text-lg mb-2">Değerlendirme & Teklif</h3>
                            <p className="text-sm text-gray-500 max-w-xs mx-auto">Süreci olumlu tamamlayan adaylara teklifimizi sunuyoruz.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* OPEN POSITIONS */}
            <div id="positions" className="py-24 max-w-7xl mx-auto px-4">
                <div className="flex items-center justify-between mb-10">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Açık Pozisyonlar</h2>
                        <p className="text-gray-500">Ekibimize katılmak için size en uygun pozisyonu seçin.</p>
                    </div>
                    <button className="text-blue-600 font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all">
                        Tüm İlanları Gör <span className="material-symbols-outlined text-base">arrow_forward</span>
                    </button>
                </div>

                {/* Filters */}
                <div className="flex gap-3 mb-8 overflow-x-auto pb-4">
                    {["Tüm Departmanlar", "Tüm Lokasyonlar", "Çalışma Tipi"].map((filter, i) => (
                        <button key={i} className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:border-gray-400 hover:text-gray-900 transition-colors whitespace-nowrap">
                            {filter}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {positions.map((pos, i) => (
                        <div key={i} className="bg-white p-6 rounded-xl border border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all group">
                            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded bg-blue-50 text-blue-600 mb-4 inline-block ${pos.department === 'Finans' ? 'bg-orange-50 text-orange-600' : pos.department === 'İnsan Kaynakları' ? 'bg-purple-50 text-purple-600' : pos.department === 'Satış & Pazarlama' ? 'bg-green-50 text-green-600' : ''}`}>
                                {pos.department}
                            </span>
                            <h3 className="font-bold text-lg text-gray-900 mb-1">{pos.title}</h3>
                            <div className="flex flex-col gap-1 mb-6">
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <span className="material-symbols-outlined text-base">location_on</span>
                                    {pos.location}
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <span className="material-symbols-outlined text-base">schedule</span>
                                    {pos.type}
                                </div>
                            </div>

                            <div className="flex gap-3 mt-auto">
                                <button
                                    onClick={() => navigate(`/kariyer/ilan/${pos.id}`)}
                                    className="flex-1 py-3 bg-white border border-gray-200 text-gray-700 rounded-lg font-bold hover:border-gray-900 transition-colors"
                                >
                                    İlanı İncele
                                </button>
                                <button
                                    onClick={() => navigate('/kariyer/basvuru')}
                                    className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors"
                                >
                                    Başvur
                                </button>
                            </div>
                        </div>
                    ))}

                    {/* General Application Card */}
                    <div className="bg-gray-50 p-6 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-center hover:border-blue-300 transition-colors">
                        <h3 className="font-bold text-lg text-gray-900 mb-2">Aradığınız pozisyonu bulamadınız mı?</h3>
                        <p className="text-sm text-gray-500 mb-6">Genel başvuru yaparak CV'nizi veritabanımıza ekleyebilir, uygun pozisyonlar açıldığında değerlendirilme şansı yakalayabilirsiniz.</p>
                        <button
                            onClick={() => navigate('/kariyer/basvuru')}
                            className="px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg font-bold text-sm hover:border-gray-900 hover:text-gray-900 transition-colors"
                        >
                            Genel Başvuru Yap
                        </button>
                    </div>
                </div>
            </div>

        </div>
    );
}
