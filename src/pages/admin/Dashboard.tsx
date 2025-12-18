import { useEffect, useState } from 'react';
import { API_BASE_URL } from '../../config';
import { useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

// HELPER: Convert Google Drive / OneDrive links to direct image links
const convertToDirectLink = (url: string) => {
    if (!url) return '';
    try {
        if (url.includes('drive.google.com') && (url.includes('/d/') || url.includes('id='))) {
            let id = '';
            if (url.includes('/d/')) id = url.split('/d/')[1].split('/')[0];
            else if (url.includes('id=')) id = url.split('id=')[1].split('&')[0];

            // Format: lh3.googleusercontent.com/d/ID (More reliable/faster for direct viewing)
            if (id) return `https://lh3.googleusercontent.com/d/${id}`;
        }
        // Dropbox (dl=0 -> dl=1)
        if (url.includes('dropbox.com') && url.includes('dl=0')) {
            return url.replace('dl=0', 'dl=1');
        }
    } catch (e) { console.error('Link conversion error', e); }
    return url;
};

interface Job {
    id: number;
    title: string;
    department: string;
    location: string;
    type: string;
    isActive?: boolean;
}

interface Application {
    id: number;
    date: string;
    name: string;
    surname: string;
    email: string;
    position: string;
    cvPath: string;
    phone?: string;
    status?: string;
    note?: string;
    rating?: number;
}

export default function AdminDashboard() {


    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'applications' | 'jobs' | 'news' | 'social' | 'culture' | 'hero' | 'about'>('applications');
    const [currentUser, setCurrentUser] = useState<any>(null);

    const [jobs, setJobs] = useState<Job[]>([]);
    const [applications, setApplications] = useState<Application[]>([]);

    const [newJob, setNewJob] = useState({
        title: '',
        department: '',
        location: '',
        type: 'Tam Zamanlı',
        description: '',
        responsibilities: '',
        qualifications: '',
        experience: '',
        education: ''
    });

    const fetchJobs = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/jobs`);
            const data = await res.json();
            setJobs(data);
        } catch (err) { console.error(err); }
    };

    const fetchApplications = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/applications`);
            const data = await res.json();
            setApplications(data);
        } catch (err) { console.error(err); }
    };

    // Veri Çekme ve Auth Kontrolü
    useEffect(() => {
        const userData = localStorage.getItem('adminUser');
        if (!userData) {
            console.warn("Kullanıcı verisi bulunamadı, login'e yönlendiriliyor.");
            navigate('/admin/login');
            return;
        }

        let user;
        try {
            user = JSON.parse(userData);
        } catch (e) {
            console.error("JSON parse hatası", e);
            navigate('/admin/login');
            return;
        }

        setCurrentUser(user);

        // Rol kontrolü: Sadece HR ve Super girebilir
        if (user.role !== 'hr' && user.role !== 'super') {
            console.warn("Yetkisiz rol:", user.role);
            navigate('/admin/login');
            return;
        }

        fetchJobs();
        fetchApplications();
    }, []);

    // İlan Ekleme
    const handleAddJob = async (e: React.FormEvent) => {
        e.preventDefault();
        await fetch(`${API_BASE_URL}/api/jobs`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newJob)
        });
        setNewJob({
            title: '',
            department: '',
            location: '',
            type: 'Tam Zamanlı',
            description: '',
            responsibilities: '',
            qualifications: '',
            experience: '',
            education: ''
        }); // Reset
        fetchJobs(); // Yenile
    };

    // İlan Silme
    const handleDeleteJob = async (id: number) => {
        if (!confirm("İlanı silmek istediğinize emin misiniz?")) return;
        await fetch(`${API_BASE_URL}/api/jobs/${id}`, { method: 'DELETE' });
        fetchJobs();
    };

    const handleToggleJobStatus = async (id: number, currentStatus: boolean | undefined) => {
        const newStatus = currentStatus === false; // If currently false, make true. If undefined (default true) or true, make false? No, wait.
        // Logic: if isActive is false, become true. If true/undefined, become false.
        // Actually: currentStatus !== false.
        const targetStatus = currentStatus === false ? true : false;

        // Optimistic
        setJobs(jobs.map(j => j.id === id ? { ...j, isActive: targetStatus } : j));

        await fetch(`${API_BASE_URL}/api/jobs/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ isActive: targetStatus })
        });
    };

    const handleLogout = () => {
        localStorage.removeItem('adminUser');
        navigate('/admin/login');
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            {/* Navbar */}
            <nav className="bg-white px-6 py-4 shadow-sm flex items-center justify-between sticky top-0 z-10">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-blue-600 text-3xl">admin_panel_settings</span>
                        <span className="font-bold text-lg text-gray-800">İK Yönetim Paneli</span>
                    </div>
                    {currentUser?.role === 'super' && (
                        <button onClick={() => navigate('/admin/super')} className="bg-gray-800 text-white px-3 py-1 rounded text-xs font-bold hover:bg-black transition-colors flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm">arrow_back</span> Genel Yönetim
                        </button>
                    )}
                </div>
                <button onClick={handleLogout} className="text-red-500 hover:bg-red-50 px-3 py-2 rounded-lg text-sm font-bold transition-colors">
                    Çıkış Yap
                </button>
            </nav>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-6 py-8">

                {/* Tabs */}
                <div className="flex gap-4 mb-8 border-b border-gray-200">
                    <button
                        onClick={() => setActiveTab('applications')}
                        className={`pb-3 px-4 text-sm font-bold border-b-2 transition-colors ${activeTab === 'applications' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                    >
                        Başvuru Havuzu
                    </button>
                    <button
                        onClick={() => setActiveTab('jobs')}
                        className={`pb-3 px-4 text-sm font-bold border-b-2 transition-colors ${activeTab === 'jobs' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                    >
                        İlan Yönetimi
                    </button>
                    <button
                        onClick={() => setActiveTab('news')}
                        className={`pb-3 px-4 text-sm font-bold border-b-2 transition-colors ${activeTab === 'news' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                    >
                        Haber Yönetimi
                    </button>
                    <button
                        onClick={() => setActiveTab('social')}
                        className={`pb-3 px-4 text-sm font-bold border-b-2 transition-colors ${activeTab === 'social' ? 'border-orange-600 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                    >
                        Sosyal Medya
                    </button>
                    <button
                        onClick={() => setActiveTab('culture')}
                        className={`pb-3 px-4 text-sm font-bold border-b-2 transition-colors ${activeTab === 'culture' ? 'border-purple-600 text-purple-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                    >
                        Kültür & Yaşam
                    </button>
                    <button
                        onClick={() => setActiveTab('hero')}
                        className={`pb-3 px-4 text-sm font-bold border-b-2 transition-colors ${activeTab === 'hero' ? 'border-purple-600 text-purple-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                    >
                        Hero Yönetimi
                    </button>
                    <button
                        onClick={() => setActiveTab('about')}
                        className={`pb-3 px-4 text-sm font-bold border-b-2 transition-colors ${activeTab === 'about' ? 'border-cyan-600 text-cyan-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                    >
                        Hakkımızda
                    </button>
                </div>

                {/* TAB: APPLICATIONS */}
                {activeTab === 'applications' && (
                    <ApplicationsTab applications={applications} />
                )}
                {/* TAB: JOBS */}
                {activeTab === 'jobs' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Job List */}
                        <div className="md:col-span-2 space-y-4">
                            {jobs.map(job => (
                                <div key={job.id} className={`bg-white p-6 rounded-xl border shadow-sm flex items-center justify-between ${job.isActive === false ? 'opacity-60 border-red-200' : 'border-gray-100'}`}>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="font-bold text-lg text-gray-800">{job.title}</h3>
                                            {job.isActive === false && <span className="bg-red-100 text-red-600 text-[10px] px-2 py-0.5 rounded font-bold">PASİF</span>}
                                        </div>
                                        <p className="text-sm text-gray-500">{job.department} • {job.location}</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <button
                                            // @ts-ignore
                                            onClick={() => handleToggleJobStatus(job.id, job.isActive)}
                                            className={`w-12 h-6 rounded-full p-1 transition-colors ${job.isActive !== false ? 'bg-green-500' : 'bg-gray-300'}`}
                                            title={job.isActive !== false ? 'İlan Yayında' : 'İlan Gizli'}
                                        >
                                            <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${job.isActive !== false ? 'translate-x-6' : 'translate-x-0'}`}></div>
                                        </button>
                                        <button onClick={() => handleDeleteJob(job.id)} className="text-red-500 bg-red-50 p-2 rounded-lg hover:bg-red-100 transition-colors">
                                            <span className="material-symbols-outlined">delete</span>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Add Job Form */}
                        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm h-fit sticky top-24 overflow-y-auto max-h-[80vh]">
                            <h3 className="font-bold text-gray-800 mb-4">Yeni İlan Ekle</h3>
                            <form onSubmit={handleAddJob} className="space-y-4">
                                <input required placeholder="Pozisyon Adı (Örn: Mimar)" className="w-full px-4 py-2 border rounded-lg text-sm"
                                    value={newJob.title} onChange={e => setNewJob({ ...newJob, title: e.target.value })} />

                                <select className="w-full px-4 py-2 border rounded-lg text-sm bg-white"
                                    value={newJob.department} onChange={e => setNewJob({ ...newJob, department: e.target.value })}>
                                    <option value="">Departman Seçin</option>
                                    <option value="Yazılım & IT">Yazılım & IT</option>
                                    <option value="Satış & Pazarlama">Satış & Pazarlama</option>
                                    <option value="İnsan Kaynakları">İnsan Kaynakları</option>
                                    <option value="Finans">Finans</option>
                                    <option value="Mimari">Mimari</option>
                                    <option value="Mühendislik">Mühendislik</option>
                                    <option value="Operasyon">Operasyon</option>
                                </select>

                                <input required placeholder="Lokasyon (Örn: İstanbul)" className="w-full px-4 py-2 border rounded-lg text-sm"
                                    value={newJob.location} onChange={e => setNewJob({ ...newJob, location: e.target.value })} />

                                <select className="w-full px-4 py-2 border rounded-lg text-sm bg-white"
                                    value={newJob.type} onChange={e => setNewJob({ ...newJob, type: e.target.value })}>
                                    <option value="Tam Zamanlı">Tam Zamanlı</option>
                                    <option value="Yarı Zamanlı">Yarı Zamanlı</option>
                                    <option value="Staj">Staj</option>
                                </select>

                                <textarea placeholder="İş Tanımı" className="w-full px-4 py-2 border rounded-lg text-sm min-h-[80px]"
                                    value={newJob.description} onChange={e => setNewJob({ ...newJob, description: e.target.value })} />

                                <textarea placeholder="Sorumluluklar (Her satıra bir madde)" className="w-full px-4 py-2 border rounded-lg text-sm min-h-[80px]"
                                    value={newJob.responsibilities} onChange={e => setNewJob({ ...newJob, responsibilities: e.target.value })} />

                                <textarea placeholder="Aranan Nitelikler (Her satıra bir madde)" className="w-full px-4 py-2 border rounded-lg text-sm min-h-[80px]"
                                    value={newJob.qualifications} onChange={e => setNewJob({ ...newJob, qualifications: e.target.value })} />

                                <div className="grid grid-cols-2 gap-2">
                                    <input placeholder="Tecrübe (Örn: 3-5 Yıl)" className="w-full px-4 py-2 border rounded-lg text-sm"
                                        value={newJob.experience} onChange={e => setNewJob({ ...newJob, experience: e.target.value })} />
                                    <input placeholder="Eğitim (Örn: Lisans)" className="w-full px-4 py-2 border rounded-lg text-sm"
                                        value={newJob.education} onChange={e => setNewJob({ ...newJob, education: e.target.value })} />
                                </div>

                                <button type="submit" className="w-full bg-blue-600 text-white font-bold py-2 rounded-lg hover:bg-blue-700">
                                    Yayınla
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                {/* TAB: NEWS */}
                {activeTab === 'news' && (
                    <NewsTab />
                )}

                {/* TAB: SOCIAL */}
                {activeTab === 'social' && (
                    <SocialTab />
                )}
                {/* TAB: CULTURE */}
                {activeTab === 'culture' && (
                    <CultureTab />
                )}
                {/* TAB: HERO */}
                {activeTab === 'hero' && (
                    <HeroTab />
                )}
                {/* TAB: ABOUT */}
                {activeTab === 'about' && (
                    <AboutTab />
                )}

            </div>
        </div>
    );
}

function HeroTab() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetch(`${API_BASE_URL}/api/hero`)
            .then(res => res.json())
            .then(d => {
                if (!d.type1) d.type1 = { slides: [] };
                if (!d.type2) d.type2 = { slides: [] };
                if (!d.type3) d.type3 = { title: "Geleceği", titleSize: "large", words: [], description: "", rightImage: "", floatingBox: { title: "", text: "", icon: "" }, stats: [{ value: "40+", label: "Yıllık Tecrübe" }, { value: "9", label: "Grup Şirketi" }, { value: "1000+", label: "Mutlu Çalışan" }] };
                else {
                    if (!d.type3.stats) d.type3.stats = [{ value: "40+", label: "Yıllık Tecrübe" }, { value: "9", label: "Grup Şirketi" }, { value: "1000+", label: "Mutlu Çalışan" }];
                    if (!d.type3.title) d.type3.title = "Geleceği";
                    if (!d.type3.titleSize) d.type3.titleSize = "large";
                }
                if (!d.activeDesign) d.activeDesign = "type3";
                setData(d);
            })
            .catch(e => console.error(e));
    }, []);

    const handleSave = () => {
        setLoading(true);
        fetch(`${API_BASE_URL}/api/hero`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
            .then(res => {
                if (res.ok) alert("Tasarım ve içerik güncellendi!");
                else alert("Hata oluştu.");
            })
            .finally(() => setLoading(false));
    };

    if (!data) return <div>Yükleniyor...</div>;

    return (
        <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm max-w-4xl mx-auto">
            <h3 className="text-xl font-bold bg-gray-50 border-b p-4 -mx-8 -mt-8 mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-purple-600">style</span>
                Hero Tasarım ve İçerik Yönetimi
            </h3>

            {/* DESIGN SELECTION */}
            <div className="mb-8">
                <label className="block text-sm font-bold text-gray-700 mb-4">Aktif Tasarım Seçimi</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {['type1', 'type2', 'type3'].map((type) => (
                        <div
                            key={type}
                            onClick={() => setData({ ...data, activeDesign: type })}
                            className={`cursor-pointer rounded-xl border-2 p-4 flex flex-col items-center gap-2 transition-all ${data.activeDesign === type ? 'border-purple-600 bg-purple-50' : 'border-gray-200 hover:border-purple-300'}`}
                        >
                            <div className="w-full h-24 bg-gray-200 rounded-lg mb-2 flex items-center justify-center text-gray-400 font-bold">
                                {type === 'type1' ? 'Klasik Slider' : type === 'type2' ? '3D Carousel' : 'Modern Daktilo'}
                            </div>
                            <div className="flex items-center gap-2">
                                <span className={`material-symbols-outlined ${data.activeDesign === type ? 'text-purple-600' : 'text-gray-400'}`}>
                                    {data.activeDesign === type ? 'radio_button_checked' : 'radio_button_unchecked'}
                                </span>
                                <span className={`font-bold ${data.activeDesign === type ? 'text-purple-900' : 'text-gray-500'}`}>
                                    {type === 'type1' ? 'Tip 1: Klasik' : type === 'type2' ? 'Tip 2: 3D Animasyon' : 'Tip 3: Minimal'}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
                <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-gray-500">edit</span>
                    {data.activeDesign === 'type1' ? 'Klasik Slider İçeriği' : data.activeDesign === 'type2' ? '3D Carousel İçeriği' : 'Modern Tasarım İçeriği'}
                </h4>

                {/* TYPE 1 FORM */}
                {data.activeDesign === 'type1' && (
                    <div className="space-y-4">
                        {data.type1.slides.map((slide: any, i: number) => (
                            <div key={i} className="bg-gray-50 p-4 rounded-lg relative border border-gray-200">
                                <button onClick={() => {
                                    const newSlides = [...data.type1.slides];
                                    newSlides.splice(i, 1);
                                    setData({ ...data, type1: { ...data.type1, slides: newSlides } });
                                }} className="absolute top-2 right-2 text-red-500"><span className="material-symbols-outlined">delete</span></button>

                                <label className="block text-xs font-bold text-gray-500 mb-1">Slide Görseli (1920x1080px)</label>
                                <input className="w-full mb-2 p-2 border rounded text-sm" placeholder="Resim URL" value={slide.image} onChange={e => {
                                    const newSlides = [...data.type1.slides];
                                    newSlides[i].image = e.target.value;
                                    setData({ ...data, type1: { ...data.type1, slides: newSlides } });
                                }} onBlur={e => {
                                    const fixed = convertToDirectLink(e.target.value);
                                    if (fixed !== e.target.value) {
                                        const newSlides = [...data.type1.slides];
                                        newSlides[i].image = fixed;
                                        setData({ ...data, type1: { ...data.type1, slides: newSlides } });
                                    }
                                }} />
                                <label className="block text-xs font-bold text-gray-500 mb-1">Başlık</label>
                                <input className="w-full mb-2 p-2 border rounded text-sm font-bold" placeholder="Başlık" value={slide.title} onChange={e => {
                                    const newSlides = [...data.type1.slides];
                                    newSlides[i].title = e.target.value;
                                    setData({ ...data, type1: { ...data.type1, slides: newSlides } });
                                }} />
                                <label className="block text-xs font-bold text-gray-500 mb-1">Alt Başlık</label>
                                <input className="w-full p-2 border rounded text-sm" placeholder="Alt Başlık" value={slide.subtitle} onChange={e => {
                                    const newSlides = [...data.type1.slides];
                                    newSlides[i].subtitle = e.target.value;
                                    setData({ ...data, type1: { ...data.type1, slides: newSlides } });
                                }} />
                            </div>
                        ))}
                        <button onClick={() => setData({ ...data, type1: { ...data.type1, slides: [...data.type1.slides, { image: '', title: '', subtitle: '' }] } })} className="text-sm font-bold text-blue-600 hover:underline">+ Yeni Slayt Ekle</button>
                    </div>
                )}

                {/* TYPE 2 FORM */}
                {data.activeDesign === 'type2' && (
                    <div className="space-y-4">
                        {data.type2.slides.map((slide: any, i: number) => (
                            <div key={i} className="bg-gray-50 p-4 rounded-lg relative border border-gray-200">
                                <button onClick={() => {
                                    const newSlides = [...data.type2.slides];
                                    newSlides.splice(i, 1);
                                    setData({ ...data, type2: { ...data.type2, slides: newSlides } });
                                }} className="absolute top-2 right-2 text-red-500"><span className="material-symbols-outlined">delete</span></button>

                                <label className="block text-xs font-bold text-gray-500 mb-1">Slide Görseli (1920x1080px)</label>
                                <input className="w-full mb-2 p-2 border rounded text-sm" placeholder="Resim URL" value={slide.image} onChange={e => {
                                    const newSlides = [...data.type2.slides];
                                    newSlides[i].image = e.target.value;
                                    setData({ ...data, type2: { ...data.type2, slides: newSlides } });
                                }} onBlur={e => {
                                    const fixed = convertToDirectLink(e.target.value);
                                    if (fixed !== e.target.value) {
                                        const newSlides = [...data.type2.slides];
                                        newSlides[i].image = fixed;
                                        setData({ ...data, type2: { ...data.type2, slides: newSlides } });
                                    }
                                }} />
                                <label className="block text-xs font-bold text-gray-500 mb-1">Başlık</label>
                                <input className="w-full mb-2 p-2 border rounded text-sm font-bold" placeholder="Başlık" value={slide.title} onChange={e => {
                                    const newSlides = [...data.type2.slides];
                                    newSlides[i].title = e.target.value;
                                    setData({ ...data, type2: { ...data.type2, slides: newSlides } });
                                }} />
                                <label className="block text-xs font-bold text-gray-500 mb-1">Açıklama</label>
                                <input className="w-full p-2 border rounded text-sm" placeholder="Açıklama" value={slide.description} onChange={e => {
                                    const newSlides = [...data.type2.slides];
                                    newSlides[i].description = e.target.value;
                                    setData({ ...data, type2: { ...data.type2, slides: newSlides } });
                                }} />
                            </div>
                        ))}
                        <button onClick={() => setData({ ...data, type2: { ...data.type2, slides: [...data.type2.slides, { image: '', title: '', description: '' }] } })} className="text-sm font-bold text-blue-600 hover:underline">+ Yeni Slayt Ekle</button>
                    </div>
                )}

                {/* TYPE 3 FORM (Extensive) */}
                {data.activeDesign === 'type3' && (
                    <div className="space-y-6">
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label className="block text-sm font-bold text-gray-700 mb-2">Sabit Başlık (İlk Satır)</label>
                                <input className="w-full border rounded p-2" value={data.type3.title || ''} placeholder="Varsayılan: Geleceği" onChange={e => setData({ ...data, type3: { ...data.type3, title: e.target.value } })} />
                            </div>
                            <div className="w-1/3">
                                <label className="block text-sm font-bold text-gray-700 mb-2">Yazı Boyutu</label>
                                <select
                                    className="w-full border rounded p-2 bg-white"
                                    value={data.type3.titleSize || "large"}
                                    onChange={e => setData({ ...data, type3: { ...data.type3, titleSize: e.target.value } })}
                                >
                                    <option value="large">Büyük (Varsayılan)</option>
                                    <option value="medium">Orta</option>
                                    <option value="small">Küçük (Uzun Yazılar)</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Animasyonlu Kelimeler (Virgülle)</label>
                            <input className="w-full border rounded p-2" value={data.type3.words?.join(', ')} onChange={e => setData({ ...data, type3: { ...data.type3, words: e.target.value.split(',').map((s: string) => s.trim()) } })} />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Genel Açıklama</label>
                            <textarea className="w-full border rounded p-2 h-20" value={data.type3.description} onChange={e => setData({ ...data, type3: { ...data.type3, description: e.target.value } })} />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Sağ Görsel URL <span className="text-xs font-normal text-gray-500">(Önerilen: 800x1200px / Dikey)</span></label>
                            <input className="w-full border rounded p-2 text-sm" value={data.type3.rightImage} onChange={e => setData({ ...data, type3: { ...data.type3, rightImage: e.target.value } })} onBlur={e => {
                                const fixed = convertToDirectLink(e.target.value);
                                if (fixed !== e.target.value) setData({ ...data, type3: { ...data.type3, rightImage: fixed } });
                            }} />
                        </div>

                        <div className="bg-gray-50 p-4 rounded border border-gray-200">
                            <h5 className="font-bold text-sm mb-2 text-gray-600">Yüzen Kutu İçeriği (Resim Önündeki)</h5>
                            <div className="grid grid-cols-2 gap-2 mb-2">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">Kutu Başlığı</label>
                                    <input className="w-full border rounded p-2 text-sm" placeholder="örn: Sürdürülebilir" value={data.type3.floatingBox?.title} onChange={e => setData({ ...data, type3: { ...data.type3, floatingBox: { ...data.type3.floatingBox, title: e.target.value } } })} />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">İkon <a href="https://fonts.google.com/icons" target="_blank" className="text-blue-500 font-normal hover:underline ml-1">(Google Fonts)</a></label>
                                    <input className="w-full border rounded p-2 text-sm" placeholder="örn: eco" value={data.type3.floatingBox?.icon} onChange={e => setData({ ...data, type3: { ...data.type3, floatingBox: { ...data.type3.floatingBox, icon: e.target.value } } })} />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">Kutu Metni</label>
                                <input className="w-full border rounded p-2 text-sm" placeholder="Kısa açıklama..." value={data.type3.floatingBox?.text} onChange={e => setData({ ...data, type3: { ...data.type3, floatingBox: { ...data.type3.floatingBox, text: e.target.value } } })} />
                            </div>
                        </div>

                        <div className="bg-gray-50 p-4 rounded border border-gray-200">
                            <div className="flex justify-between items-center mb-2">
                                <h5 className="font-bold text-sm text-gray-600">İstatistikler (Alt Yan Yana 3 Kutu)</h5>
                                <button onClick={() => {
                                    const currentStats = data.type3.stats || [];
                                    if (currentStats.length >= 3) return alert("En fazla 3 adet eklenebilir (Tasarım kısıtı).");
                                    setData({ ...data, type3: { ...data.type3, stats: [...currentStats, { value: "", label: "" }] } });
                                }} className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded font-bold hover:bg-blue-200 transition">+ Ekle</button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {(data.type3.stats || []).map((stat: any, i: number) => (
                                    <div key={i} className="p-3 border rounded bg-white relative">
                                        <button onClick={() => {
                                            const newStats = [...(data.type3.stats || [])];
                                            newStats.splice(i, 1);
                                            setData({ ...data, type3: { ...data.type3, stats: newStats } });
                                        }} className="absolute top-1 right-1 text-red-400 hover:text-red-600"><span className="material-symbols-outlined text-sm">close</span></button>

                                        <label className="block text-xs font-bold text-gray-500 mb-1">Değer {i + 1}</label>
                                        <input
                                            className="w-full border rounded p-1 mb-2 text-sm font-bold"
                                            placeholder="örn: 40+"
                                            value={stat.value}
                                            onChange={e => {
                                                const newStats = [...(data.type3.stats || [])];
                                                newStats[i] = { ...newStats[i], value: e.target.value };
                                                setData({ ...data, type3: { ...data.type3, stats: newStats } });
                                            }}
                                        />
                                        <label className="block text-xs font-bold text-gray-500 mb-1">Etiket</label>
                                        <input
                                            className="w-full border rounded p-1 text-xs"
                                            placeholder="örn: Yıllık Tecrübe"
                                            value={stat.label}
                                            onChange={e => {
                                                const newStats = [...(data.type3.stats || [])];
                                                newStats[i] = { ...newStats[i], label: e.target.value };
                                                setData({ ...data, type3: { ...data.type3, stats: newStats } });
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
                <button onClick={handleSave} disabled={loading} className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2">
                    {loading ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet ve Yayınla'}
                    {!loading && <span className="material-symbols-outlined">save</span>}
                </button>
            </div>
        </div>
    );
}

// --- NEWS MANAGEMENT COMPONENT ---
interface News {
    id: number;
    title: string;
    summary: string;
    content: string;
    date: string;
    imagePath: string | null;
    category?: string;
}

function NewsTab() {
    const [newsList, setNewsList] = useState<News[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<News | null>(null);

    // Form State
    const [title, setTitle] = useState('');
    const [summary, setSummary] = useState('');
    const [content, setContent] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [category, setCategory] = useState('ETKİNLİK');

    const fetchNews = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/news`);
            const data = await res.json();
            setNewsList(data);
        } catch (error) {
            console.error('Haberler alınamadı:', error);
        }
    };

    useEffect(() => {
        fetchNews();
    }, []);

    const handleOpenModal = (item?: News) => {
        if (item) {
            setEditingItem(item);
            setTitle(item.title);
            setSummary(item.summary);
            setContent(item.content);
            setCategory(item.category || 'ETKİNLİK');
        } else {
            setEditingItem(null);
            setTitle('');
            setSummary('');
            setContent('');
            setCategory('ETKİNLİK');
        }
        setImageFile(null);
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', title);
        formData.append('summary', summary);
        formData.append('content', content);
        formData.append('category', category);
        if (imageFile) {
            formData.append('image', imageFile);
        }

        try {
            let res;
            if (editingItem) {
                // Update
                res = await fetch(`${API_BASE_URL}/api/news/${editingItem.id}`, {
                    method: 'PUT',
                    body: formData
                });
            } else {
                // Create
                res = await fetch(`${API_BASE_URL}/api/news`, {
                    method: 'POST',
                    body: formData
                });
            }

            if (res.ok) {
                alert(editingItem ? 'Haber güncellendi!' : 'Haber eklendi!');
                setIsModalOpen(false);
                fetchNews();
            } else {
                alert('İşlem başarısız.');
            }
        } catch (error) {
            console.error(error);
            alert('Sunucu hatası.');
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Haberi silmek istiyor musunuz?')) return;
        try {
            await fetch(`${API_BASE_URL}/api/news/${id}`, { method: 'DELETE' });
            fetchNews();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-end">
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700 transition-all shadow-md"
                >
                    <span className="material-symbols-outlined">add</span>
                    Yeni Haber Ekle
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {newsList.map(item => (
                    <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col group hover:shadow-md transition-shadow">
                        <div className="h-48 overflow-hidden bg-gray-100 relative">
                            {item.imagePath ? (
                                <img src={`${API_BASE_URL}/uploads/news/${item.imagePath}`} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                    <span className="material-symbols-outlined text-4xl">image_not_supported</span>
                                </div>
                            )}
                            <div className="absolute top-2 right-2 flex gap-1">
                                <button onClick={() => handleOpenModal(item)} className="bg-white/90 p-1.5 rounded-full hover:bg-blue-100 text-blue-600 shadow-sm backdrop-blur-sm transition-colors">
                                    <span className="material-symbols-outlined text-sm">edit</span>
                                </button>
                                <button onClick={() => handleDelete(item.id)} className="bg-white/90 p-1.5 rounded-full hover:bg-red-100 text-red-500 shadow-sm backdrop-blur-sm transition-colors">
                                    <span className="material-symbols-outlined text-sm">delete</span>
                                </button>
                            </div>
                        </div>
                        <div className="p-4 flex-1 flex flex-col">
                            <div className="text-xs text-blue-600 font-bold mb-1">{new Date(item.date).toLocaleDateString()}</div>
                            <h3 className="font-bold text-gray-800 text-lg mb-2 line-clamp-2">{item.title}</h3>
                            <p className="text-sm text-gray-500 line-clamp-3 mb-4 flex-1">{item.summary}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* MODAL */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-fade-in-up">
                        <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center sticky top-0 md:static z-10">
                            <h3 className="font-bold text-lg text-gray-800">{editingItem ? 'Haberi Düzenle' : 'Yeni Haber Ekle'}</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-red-500">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Başlık</label>
                                <input
                                    className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-100 outline-none"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                    placeholder="Haber başlığı..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Kategori</label>
                                <select
                                    className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-100 outline-none bg-white"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                >
                                    <option value="ETKİNLİK">ETKİNLİK</option>
                                    <option value="BASINDA BİZ">BASINDA BİZ</option>
                                    <option value="SOSYAL SORUMLULUK">SOSYAL SORUMLULUK</option>
                                    <option value="DUYURU">DUYURU</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Özet (Kısa Açıklama)</label>
                                <textarea
                                    className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-100 outline-none h-20"
                                    value={summary}
                                    onChange={(e) => setSummary(e.target.value)}
                                    required
                                    placeholder="Listeleme sayfasında görünecek kısa özet..."
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-bold text-gray-700 mb-1">Haber İçeriği</label>
                                <div className="bg-white rounded-lg overflow-hidden border border-gray-200 focus-within:ring-2 focus-within:ring-blue-100">
                                    <ReactQuill
                                        theme="snow"
                                        value={content}
                                        onChange={setContent}
                                        className="h-60 mb-12"
                                        modules={{
                                            toolbar: [
                                                [{ 'header': [1, 2, false] }],
                                                ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                                                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                                                ['link'],
                                                ['clean']
                                            ],
                                        }}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Görsel Yukle</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setImageFile(e.target.files ? e.target.files[0] : null)}
                                    className="w-full border border-gray-200 rounded-lg text-sm file:mr-4 file:py-2 file:px-4 file:rounded-l-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                />
                                {editingItem?.imagePath && !imageFile && (
                                    <div className="mt-2 text-xs text-green-600 flex items-center gap-1">
                                        <span className="material-symbols-outlined text-sm">check_circle</span>
                                        Mevcut görsel korunacak. Değiştirmek isterseniz yeni dosya seçin.
                                    </div>
                                )}
                            </div>

                            <div className="pt-4 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-gray-500 font-bold hover:bg-gray-200 rounded-lg transition-colors"
                                >
                                    İptal
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 shadow-md transition-all"
                                >
                                    Kaydet
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

// Sub-component for Applications Tab to keep main file cleaner
function ApplicationsTab({ applications: initialApps }: { applications: Application[] }) {
    // Local state for apps to handle instant updates without refetching parent if possible
    // But ideally we should lift state up or use context. For simplicity, we'll sync with props.
    const [localApps, setLocalApps] = useState<Application[]>(initialApps);

    useEffect(() => {
        setLocalApps(initialApps);
    }, [initialApps]);

    // Search & Filter
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // Modal
    const [selectedApp, setSelectedApp] = useState<Application | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Edit Form State
    const [editNote, setEditNote] = useState('');
    const [editRating, setEditRating] = useState<number>(0);
    const [editStatus, setEditStatus] = useState('');

    // --- FILTER LOGIC ---
    const filteredApps = localApps.filter(app => {
        const matchesSearch =
            (app.name + ' ' + app.surname).toLowerCase().includes(searchTerm.toLowerCase()) ||
            app.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
            app.email.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = filterStatus === 'all' ? true : (app.status === filterStatus);

        return matchesSearch && matchesStatus;
    });

    // --- PAGINATION LOGIC ---
    const totalPages = Math.ceil(filteredApps.length / itemsPerPage);
    const currentApps = filteredApps.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleOpenModal = (app: Application) => {
        setSelectedApp(app);
        setEditNote(app.note || '');
        setEditRating(app.rating || 0);
        setEditStatus(app.status || 'Yeni');
        setIsModalOpen(true);
    };

    const handleSave = async () => {
        if (!selectedApp) return;

        try {
            const res = await fetch(`${API_BASE_URL}/api/applications/${selectedApp.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    note: editNote,
                    rating: editRating,
                    status: editStatus
                })
            });

            if (res.ok) {
                // Update local list
                setLocalApps(prev => prev.map(a =>
                    a.id === selectedApp.id
                        ? { ...a, note: editNote, rating: editRating, status: editStatus }
                        : a
                ));
                setIsModalOpen(false);
                alert("Değerlendirme kaydedildi.");
            } else {
                alert("Kaydedilirken hata oluştu.");
            }
        } catch (error) {
            console.error(error);
            alert("Sunucu hatası.");
        }
    };

    return (
        <div className="space-y-6">
            {/* SEARCH & FILTERS */}
            <div className="flex flex-col md:flex-row gap-4 justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="relative flex-1">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
                    <input
                        type="text"
                        placeholder="İsim, e-posta veya pozisyon ara..."
                        className="w-full pl-10 pr-4 py-2 border rounded-lg md:max-w-md focus:outline-none focus:ring-2 focus:ring-blue-100"
                        value={searchTerm}
                        onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                    />
                </div>
                <div className="flex gap-2">
                    <select
                        className="border rounded-lg px-4 py-2 text-sm bg-gray-50"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <option value="all">Tüm Durumlar</option>
                        <option value="Yeni">Yeni</option>
                        <option value="İncelendi">İncelendi</option>
                        <option value="Görüşüldü">Görüşüldü</option>
                        <option value="Olumlu">Olumlu</option>
                        <option value="Olumsuz">Olumsuz</option>
                    </select>
                </div>
            </div>

            {/* TABLE */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 text-xs text-gray-500 uppercase font-bold border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-4">Aday</th>
                            <th className="px-6 py-4">Pozisyon</th>
                            <th className="px-6 py-4">Durum</th>
                            <th className="px-6 py-4">Puan</th>
                            <th className="px-6 py-4 text-right">İşlemler</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {currentApps.map(app => (
                            <tr key={app.id} className="hover:bg-blue-50/30 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="font-bold text-gray-800">{app.name} {app.surname}</div>
                                    <div className="text-xs text-gray-400">{app.email}</div>
                                    <div className="text-xs text-gray-400">{app.phone}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-sm font-medium text-blue-600 block">{app.position}</span>
                                    <span className="text-xs text-gray-400">{new Date(app.date).toLocaleDateString()}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${app.status === 'Olumlu' ? 'bg-green-100 text-green-700' :
                                        app.status === 'Olumsuz' ? 'bg-red-100 text-red-700' :
                                            app.status === 'Görüşüldü' ? 'bg-purple-100 text-purple-700' :
                                                'bg-gray-100 text-gray-600'
                                        }`}>
                                        {app.status || 'Yeni'}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    {app.rating ? (
                                        <div className="flex items-center text-yellow-500 gap-1">
                                            <span className="font-bold">{app.rating}</span>
                                            <span className="material-symbols-outlined text-sm">star</span>
                                        </div>
                                    ) : (
                                        <span className="text-gray-300">-</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-right space-x-2">
                                    <a
                                        href={`${API_BASE_URL}/uploads/${app.cvPath}`}
                                        target="_blank"
                                        className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
                                        title="CV Görüntüle"
                                    >
                                        <span className="material-symbols-outlined text-lg">description</span>
                                    </a>
                                    <button
                                        onClick={() => handleOpenModal(app)}
                                        className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-600 transition-colors"
                                        title="Değerlendir / Not Al"
                                    >
                                        <span className="material-symbols-outlined text-lg">edit_note</span>
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {currentApps.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-10 text-center text-gray-400">
                                    Sonuç bulunamadı.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* PAGINATION CONTROLS */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2">
                    <button
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        className="px-3 py-1 rounded border hover:bg-gray-50 disabled:opacity-50"
                    >
                        Önceki
                    </button>
                    <span className="text-sm font-bold text-gray-600">
                        Sayfa {currentPage} / {totalPages}
                    </span>
                    <button
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        className="px-3 py-1 rounded border hover:bg-gray-50 disabled:opacity-50"
                    >
                        Sonraki
                    </button>
                </div>
            )}

            {/* EDIT/REVIEW MODAL */}
            {isModalOpen && selectedApp && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-fade-in-up">
                        <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center">
                            <h3 className="font-bold text-lg text-gray-800">Aday Değerlendirmesi</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-red-500">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl">
                                    {selectedApp.name.charAt(0)}
                                </div>
                                <div>
                                    <h4 className="font-bold text-lg">{selectedApp.name} {selectedApp.surname}</h4>
                                    <p className="text-sm text-gray-500">{selectedApp.position}</p>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Durum</label>
                                <select
                                    className="w-full border rounded-lg p-2 bg-white"
                                    value={editStatus}
                                    onChange={(e) => setEditStatus(e.target.value)}
                                >
                                    <option value="Yeni">Yeni</option>
                                    <option value="İncelendi">İncelendi</option>
                                    <option value="Görüşüldü">Görüşüldü</option>
                                    <option value="Olumlu">Olumlu</option>
                                    <option value="Olumsuz">Olumsuz</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Puan (1-10)</label>
                                <div className="flex gap-1 overflow-x-auto pb-2">
                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                                        <button
                                            key={num}
                                            onClick={() => setEditRating(num)}
                                            className={`size-8 rounded-full font-bold text-sm shrink-0 border transition-all ${editRating === num
                                                ? 'bg-yellow-400 border-yellow-500 text-white shadow-md transform scale-110'
                                                : 'bg-white border-gray-200 text-gray-500 hover:border-yellow-400 hover:text-yellow-500'
                                                }`}
                                        >
                                            {num}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">İnsan Kaynakları Notu</label>
                                <textarea
                                    className="w-full border rounded-lg p-3 text-sm min-h-[100px] focus:ring-2 focus:ring-blue-100 outline-none"
                                    placeholder="Aday hakkında mülakat notları, izlenimler..."
                                    value={editNote}
                                    onChange={(e) => setEditNote(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 text-gray-500 font-bold hover:bg-gray-200 rounded-lg transition-colors"
                            >
                                İptal
                            </button>
                            <button
                                onClick={handleSave}
                                className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 shadow-md transition-all hover:translate-y-px"
                            >
                                Kaydet
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function SocialTab() {
    const [data, setData] = useState<{ isVisible: boolean, posts: any[], instagramUrl?: string, linkedinUrl?: string }>({ isVisible: true, posts: [] });
    const [loading, setLoading] = useState(false);

    // Form
    const [newItem, setNewItem] = useState({ platform: 'instagram', date: '', description: '', link: '' });
    const [imageFile, setImageFile] = useState<File | null>(null);

    useEffect(() => {
        fetchSocial();
    }, []);

    const fetchSocial = () => {
        fetch(`${API_BASE_URL}/api/social`)
            .then(res => res.json())
            .then(d => setData(d));
    };

    const updateSettings = async (payload: any) => {
        setData(prev => ({ ...prev, ...payload }));
        await fetch(`${API_BASE_URL}/api/social/settings`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Silmek istediğinize emin misiniz?')) return;
        await fetch(`${API_BASE_URL}/api/social/${id}`, { method: 'DELETE' });
        fetchSocial();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const fd = new FormData();
        // @ts-ignore
        fd.append('platform', newItem.platform);
        fd.append('date', newItem.date);
        fd.append('description', newItem.description);
        fd.append('link', newItem.link);
        if (imageFile) fd.append('image', imageFile);

        await fetch(`${API_BASE_URL}/api/social`, {
            method: 'POST',
            body: fd
        });

        setNewItem({ platform: 'instagram', date: '', description: '', link: '' });
        setImageFile(null);
        setLoading(false);
        fetchSocial();
    };

    return (
        <div className="space-y-8">
            {/* Header & Settings */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="font-bold text-lg text-gray-800">Sosyal Medya Akışı</h3>
                        <p className="text-sm text-gray-500">Ana sayfadaki "Güncel Paylaşımlar" alanını yönetin.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border">
                        <span className="text-sm font-bold text-gray-700">Bu Bölümü Göster</span>
                        <button
                            onClick={() => updateSettings({ isVisible: !data.isVisible })}
                            className={`w-12 h-7 rounded-full p-1 transition-colors ${data.isVisible ? 'bg-green-500' : 'bg-gray-300'}`}
                        >
                            <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${data.isVisible ? 'translate-x-5' : 'translate-x-0'}`}></div>
                        </button>
                    </div>
                    <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg border focus-within:ring-2 focus-within:ring-pink-500 transition-all">
                        <span className="material-symbols-outlined text-pink-600">photo_camera</span>
                        <input
                            placeholder="Instagram Profil Linki"
                            className="bg-transparent border-none outline-none text-sm w-full font-medium"
                            value={data.instagramUrl || ''}
                            onChange={e => setData({ ...data, instagramUrl: e.target.value })}
                            onBlur={() => updateSettings({ instagramUrl: data.instagramUrl })}
                        />
                    </div>
                    <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg border focus-within:ring-2 focus-within:ring-blue-600 transition-all">
                        <span className="material-symbols-outlined text-blue-600">work</span>
                        <input
                            placeholder="LinkedIn Profil Linki"
                            className="bg-transparent border-none outline-none text-sm w-full font-medium"
                            value={data.linkedinUrl || ''}
                            onChange={e => setData({ ...data, linkedinUrl: e.target.value })}
                            onBlur={() => updateSettings({ linkedinUrl: data.linkedinUrl })}
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* List */}
                <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {data.posts.map((post: any) => (
                        <div key={post.id} className="relative group bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all">
                            <div className="aspect-[4/5] relative bg-gray-100">
                                {post.imagePath && <img src={`${API_BASE_URL}/uploads/social/${post.imagePath}`} className="w-full h-full object-cover" />}
                                <div className="absolute top-2 right-2 bg-white/90 rounded-full p-1 shadow-sm">
                                    <span className="material-symbols-outlined text-sm">{post.platform === 'linkedin' ? 'work' : 'photo_camera'}</span>
                                </div>
                            </div>
                            <div className="p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded text-white ${post.platform === 'linkedin' ? 'bg-blue-600' : 'bg-gradient-to-r from-purple-500 to-pink-500'}`}>
                                        {post.platform}
                                    </span>
                                    <button onClick={() => handleDelete(post.id)} className="text-red-500 hover:bg-red-50 p-1 rounded"><span className="material-symbols-outlined text-lg">delete</span></button>
                                </div>
                                <p className="text-xs text-gray-600 line-clamp-3 mb-2">{post.description}</p>
                                <a href={post.link} target="_blank" className="text-xs text-blue-600 font-bold hover:underline truncate block">{post.link}</a>
                            </div>
                        </div>
                    ))}
                    {data.posts.length === 0 && <div className="col-span-2 text-center py-10 text-gray-400">Henüz paylaşım eklenmemiş.</div>}
                </div>

                {/* Form */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-fit sticky top-24">
                    <h3 className="font-bold text-gray-800 mb-4 border-l-4 border-orange-500 pl-3">Yeni Paylaşım Ekle</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">Platform</label>
                            <select className="w-full border rounded-lg p-2 text-sm bg-white" value={newItem.platform} onChange={e => setNewItem({ ...newItem, platform: e.target.value })}>
                                <option value="instagram">Instagram</option>
                                <option value="linkedin">LinkedIn</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">Tarih</label>
                            <input type="date" required className="w-full border rounded-lg p-2 text-sm" value={newItem.date} onChange={e => setNewItem({ ...newItem, date: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">Görsel (Dikey/Portrait Önerilir)</label>
                            <input type="file" required accept="image/*" className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" onChange={e => setImageFile(e.target.files ? e.target.files[0] : null)} />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">Açıklama</label>
                            <textarea required rows={4} className="w-full border rounded-lg p-2 text-sm" value={newItem.description} onChange={e => setNewItem({ ...newItem, description: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">Link</label>
                            <input type="url" required placeholder="https://..." className="w-full border rounded-lg p-2 text-sm" value={newItem.link} onChange={e => setNewItem({ ...newItem, link: e.target.value })} />
                        </div>
                        <button disabled={loading} type="submit" className="w-full bg-gray-900 text-white font-bold py-3 rounded-lg hover:bg-black transition-colors disabled:opacity-50">
                            {loading ? 'Yükleniyor...' : 'Paylaşımı Ekle'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

function CultureTab() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetch(`${API_BASE_URL}/api/culture`)
            .then(res => res.json())
            .then(resData => {
                let finalData = resData;
                if (!finalData || Object.keys(finalData).length === 0 || Array.isArray(finalData)) {
                    finalData = {
                        heroTitle: "", heroSubtitle: "",
                        values: [], gallery: [], perks: [], quotes: []
                    };
                }

                if (!finalData.perks || finalData.perks.length === 0) {
                    finalData.perks = [
                        { title: "Sürekli Eğitim", icon: "school" },
                        { title: "Özel Sağlık Sigortası", icon: "health_and_safety" },
                        { title: "Sosyal Etkinlikler", icon: "celebration" },
                        { title: "Yemek & Ulaşım", icon: "restaurant" }
                    ];
                }
                setData(finalData);
            })
            .catch(err => {
                console.error(err);
                setData({
                    heroTitle: "", heroSubtitle: "",
                    values: [], gallery: [],
                    perks: [
                        { title: "Sürekli Eğitim", icon: "school" },
                        { title: "Özel Sağlık Sigortası", icon: "health_and_safety" },
                        { title: "Sosyal Etkinlikler", icon: "celebration" },
                        { title: "Yemek & Ulaşım", icon: "restaurant" }
                    ],
                    quotes: []
                });
            });
    }, []);

    const handleSave = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/api/culture`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (res.ok) alert("Kültür sayfası güncellendi!");
            else alert("Hata oluştu.");
        } catch (e) {
            console.error(e);
            alert("Sunucu hatası.");
        }
        setLoading(false);
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: string, index?: number, subField?: string) => {
        if (!e.target.files || !e.target.files[0]) return;
        const file = e.target.files[0];
        const fd = new FormData();
        fd.append('file', file);

        try {
            const res = await fetch(`${API_BASE_URL}/api/upload`, { method: 'POST', body: fd });
            const json = await res.json();
            if (json.success) {
                if (field === 'heroImage') {
                    setData({ ...data, heroImage: json.filePath });
                } else if (field === 'gallery') {
                    setData({ ...data, gallery: [...(data.gallery || []), json.filePath] });
                } else if (field === 'quotes' && typeof index === 'number' && subField) {
                    const newQuotes = [...data.quotes];
                    newQuotes[index] = { ...newQuotes[index], [subField]: json.filePath };
                    setData({ ...data, quotes: newQuotes });
                }
            }
        } catch (error) {
            console.error(error);
            alert("Dosya yüklenemedi.");
        }
    };

    if (!data) return <div>Yükleniyor...</div>;

    return (
        <div className="space-y-8 pb-20">
            <div className="flex justify-between items-center bg-white p-6 rounded-xl border border-gray-200 shadow-sm sticky top-24 z-10">
                <h3 className="font-bold text-lg">Kültür Sayfası İçeriği</h3>
                <button
                    onClick={handleSave}
                    disabled={loading}
                    className="bg-purple-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-purple-700 transition-colors shadow-lg disabled:opacity-50"
                >
                    {loading ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
                </button>
            </div>

            {/* HERO */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
                <h4 className="font-bold border-l-4 border-purple-500 pl-3">Hero Bölümü</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Başlık</label>
                        <input className="w-full border rounded p-2" value={data.heroTitle || ''} onChange={e => setData({ ...data, heroTitle: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Alt Başlık</label>
                        <input className="w-full border rounded p-2" value={data.heroSubtitle || ''} onChange={e => setData({ ...data, heroSubtitle: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Arkaplan Görseli <span className="text-xs font-normal text-gray-500">(Önerilen: 1920x600px)</span></label>
                        <input type="file" onChange={e => handleFileUpload(e, 'heroImage')} className="mb-2" />
                        {data.heroImage && <img src={`${API_BASE_URL}/uploads/${data.heroImage}`} className="h-24 rounded object-cover" />}
                    </div>
                </div>
            </div>

            {/* VALUES */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
                <div className="flex justify-between">
                    <h4 className="font-bold border-l-4 border-blue-500 pl-3">Değerlerimiz</h4>
                    <button onClick={() => setData({ ...data, values: [...(data.values || []), { title: '', desc: '', icon: 'star' }] })} className="text-sm bg-blue-50 text-blue-600 px-3 py-1 rounded font-bold">+ Ekle</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {data.values?.map((val: any, i: number) => (
                        <div key={i} className="border p-4 rounded-lg relative bg-gray-50">
                            <button onClick={() => { const n = [...data.values]; n.splice(i, 1); setData({ ...data, values: n }) }} className="absolute top-2 right-2 text-red-500"><span className="material-symbols-outlined">delete</span></button>
                            <input className="w-full border rounded p-2 mb-2 text-sm font-bold" placeholder="Başlık" value={val.title} onChange={e => { const n = [...data.values]; n[i].title = e.target.value; setData({ ...data, values: n }) }} />
                            <textarea className="w-full border rounded p-2 mb-2 text-xs" placeholder="Açıklama" value={val.desc} onChange={e => { const n = [...data.values]; n[i].desc = e.target.value; setData({ ...data, values: n }) }} />
                            <input className="w-full border rounded p-2 text-xs" placeholder="Icon (Google Font)" value={val.icon} onChange={e => { const n = [...data.values]; n[i].icon = e.target.value; setData({ ...data, values: n }) }} />
                            <a href="https://fonts.google.com/icons" target="_blank" className="text-[10px] text-blue-500 block hover:underline">İkon Listesi</a>
                        </div>
                    ))}
                </div>
            </div>

            {/* GALLERY */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
                <h4 className="font-bold border-l-4 border-green-500 pl-3">Galeri</h4>
                <div className="flex gap-4 items-center">
                    <input type="file" onChange={e => handleFileUpload(e, 'gallery')} />
                    <span className="text-xs text-gray-500">Yeni fotoğraf ekleyin (Önerilen: 800x800px)</span>
                </div>
                <div className="grid grid-cols-4 md:grid-cols-6 gap-4">
                    {data.gallery?.map((img: string, i: number) => (
                        <div key={i} className="relative group aspect-square bg-gray-100 rounded overflow-hidden">
                            <img src={`${API_BASE_URL}/uploads/${img}`} className="w-full h-full object-cover" />
                            <button onClick={() => { const n = [...data.gallery]; n.splice(i, 1); setData({ ...data, gallery: n }) }} className="absolute top-1 right-1 bg-white/80 p-1 rounded-full text-red-500 hover:bg-white"><span className="material-symbols-outlined text-sm">close</span></button>
                        </div>
                    ))}
                </div>
            </div>

            {/* PERKS */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
                <div className="flex justify-between">
                    <h4 className="font-bold border-l-4 border-orange-500 pl-3">Ayrıcalıklar</h4>
                    <button onClick={() => setData({ ...data, perks: [...(data.perks || []), { title: '', icon: 'star' }] })} className="text-sm bg-orange-50 text-orange-600 px-3 py-1 rounded font-bold">+ Ekle</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {data.perks?.map((p: any, i: number) => (
                        <div key={i} className="border p-4 rounded-lg relative bg-gray-50 flex items-center gap-4">
                            <button onClick={() => { const n = [...data.perks]; n.splice(i, 1); setData({ ...data, perks: n }) }} className="absolute top-2 right-2 text-red-500"><span className="material-symbols-outlined">delete</span></button>
                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center border text-orange-500">
                                <span className="material-symbols-outlined">{p.icon}</span>
                            </div>
                            <div className="flex-1 space-y-2">
                                <input className="w-full border rounded p-2 text-sm font-bold" placeholder="Başlık" value={p.title} onChange={e => { const n = [...data.perks]; n[i].title = e.target.value; setData({ ...data, perks: n }) }} />
                                <input className="w-full border rounded p-2 text-xs" placeholder="Icon (Google Font)" value={p.icon} onChange={e => { const n = [...data.perks]; n[i].icon = e.target.value; setData({ ...data, perks: n }) }} />
                                <a href="https://fonts.google.com/icons" target="_blank" className="text-[10px] text-blue-500 block hover:underline">İkon Listesi</a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* QUOTES */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
                <div className="flex justify-between">
                    <h4 className="font-bold border-l-4 border-yellow-500 pl-3">Çalışan Yorumları</h4>
                    <button onClick={() => setData({ ...data, quotes: [...(data.quotes || []), { name: '', position: '', text: '' }] })} className="text-sm bg-yellow-50 text-yellow-600 px-3 py-1 rounded font-bold">+ Ekle</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {data.quotes?.map((q: any, i: number) => (
                        <div key={i} className="border p-4 rounded-lg relative bg-gray-50 flex gap-4">
                            <div className="w-20 shrink-0">
                                {q.photo ? <img src={`${API_BASE_URL}/uploads/${q.photo}`} className="w-20 h-20 rounded-full object-cover mb-2" /> : <div className="w-20 h-20 bg-gray-200 rounded-full mb-2"></div>}
                                <input type="file" className="text-[10px] w-full" onChange={e => handleFileUpload(e, 'quotes', i, 'photo')} />
                            </div>
                            <div className="flex-1 space-y-2">
                                <button onClick={() => { const n = [...data.quotes]; n.splice(i, 1); setData({ ...data, quotes: n }) }} className="absolute top-2 right-2 text-red-500"><span className="material-symbols-outlined">delete</span></button>
                                <input className="w-full border rounded p-2 text-sm font-bold" placeholder="İsim" value={q.name} onChange={e => { const n = [...data.quotes]; n[i].name = e.target.value; setData({ ...data, quotes: n }) }} />
                                <input className="w-full border rounded p-2 text-xs" placeholder="Pozisyon" value={q.position} onChange={e => { const n = [...data.quotes]; n[i].position = e.target.value; setData({ ...data, quotes: n }) }} />
                                <textarea className="w-full border rounded p-2 text-xs" placeholder="Yorum" value={q.text} onChange={e => { const n = [...data.quotes]; n[i].text = e.target.value; setData({ ...data, quotes: n }) }} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// --- ABOUT MANAGEMENT ---
function AboutTab() {
    const [data, setData] = useState<any>({ history: [] });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetch(`${API_BASE_URL}/api/about`)
            .then(res => res.json())
            .then(d => {
                if (!d.history) d.history = [];
                setData(d);
            })
            .catch(err => console.error(err));
    }, []);

    const handleSave = async () => {
        setLoading(true);
        try {
            await fetch(`${API_BASE_URL}/api/about`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            alert('Değişiklikler kaydedildi.');
        } catch (error) {
            console.error(error);
            alert('Hata oluştu.');
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = async (e: any, index: number) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch(`${API_BASE_URL}/api/upload`, {
                method: 'POST',
                body: formData
            });
            const result = await res.json();
            if (result.success) {
                const newHistory = [...data.history];
                newHistory[index].image = result.filePath;
                setData({ ...data, history: newHistory });
            }
        } catch (error) {
            console.error(error);
            alert('Resim yüklenemedi.');
        }
    };

    const handleMove = (index: number, direction: 'up' | 'down') => {
        const newHistory = [...data.history];
        if (direction === 'up' && index > 0) {
            [newHistory[index], newHistory[index - 1]] = [newHistory[index - 1], newHistory[index]];
        } else if (direction === 'down' && index < newHistory.length - 1) {
            [newHistory[index], newHistory[index + 1]] = [newHistory[index + 1], newHistory[index]];
        }
        setData({ ...data, history: newHistory });
    };

    const handleSort = (direction: 'asc' | 'desc') => {
        if (!confirm('Tüm listeyi yıla göre yeniden sıralamak istediğinize emin misiniz?')) return;
        const newHistory = [...data.history].sort((a: any, b: any) => {
            return direction === 'asc'
                ? parseInt(a.year) - parseInt(b.year)
                : parseInt(b.year) - parseInt(a.year);
        });
        setData({ ...data, history: newHistory });
    };

    return (
        <div className="space-y-8">
            {/* Video Settings */}
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">play_circle</span>
                    Tanıtım Videosu
                </h3>
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">YouTube Video Linki</label>
                    <input
                        type="text"
                        className="w-full border rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                        placeholder="https://www.youtube.com/watch?v=..."
                        value={data.videoUrl || ''}
                        onChange={(e) => setData({ ...data, videoUrl: e.target.value })}
                    />
                    <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs">info</span>
                        Örnek: https://www.youtube.com/watch?v=ZVaR0TnPf1Q (veya tarayıcıdaki linki direkt yapıştırın)
                    </p>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-gray-800">Tarihçe Yönetimi</h3>
                    <div className="flex items-center gap-2">
                        <div className="flex bg-gray-100 rounded-lg p-1 mr-2">
                            <button onClick={() => handleSort('asc')} className="text-xs text-gray-600 px-2 py-1 rounded hover:bg-white hover:shadow-sm transition flex items-center gap-1" title="Eskiden Yeniye Sırala"><span className="material-symbols-outlined text-sm">arrow_upward</span> 1-9</button>
                            <button onClick={() => handleSort('desc')} className="text-xs text-gray-600 px-2 py-1 rounded hover:bg-white hover:shadow-sm transition flex items-center gap-1" title="Yeniden Eskiye Sırala"><span className="material-symbols-outlined text-sm">arrow_downward</span> 9-1</button>
                        </div>
                        <button onClick={() => setData({ ...data, history: [...data.history, { id: Date.now(), year: "", title: "", description: "", image: null }] })} className="text-sm bg-blue-100 text-blue-600 px-3 py-1.5 rounded-lg font-bold hover:bg-blue-200 transition flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm">add</span> Yeni Dönem
                        </button>
                    </div>
                </div>

                <div className="space-y-6">
                    {data.history.map((item: any, i: number) => (
                        <div key={i} className="bg-gray-50 p-4 rounded-lg relative border border-gray-200 grid grid-cols-1 md:grid-cols-12 gap-4 group hover:border-blue-200 hover:shadow-md transition-all">

                            {/* Action Buttons */}
                            <div className="absolute top-2 right-2 flex items-center gap-1 bg-white/80 backdrop-blur-sm p-1 rounded-lg border border-gray-100 shadow-sm opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                <button onClick={() => handleMove(i, 'up')} type="button" disabled={i === 0} className="text-gray-400 hover:text-primary hover:bg-gray-100 rounded p-1 disabled:opacity-30 transition-colors" title="Yukarı Taşı"><span className="material-symbols-outlined text-base">arrow_upward</span></button>
                                <button onClick={() => handleMove(i, 'down')} type="button" disabled={i === data.history.length - 1} className="text-gray-400 hover:text-primary hover:bg-gray-100 rounded p-1 disabled:opacity-30 transition-colors" title="Aşağı Taşı"><span className="material-symbols-outlined text-base">arrow_downward</span></button>
                                <div className="w-px h-4 bg-gray-200 mx-1"></div>
                                <button onClick={() => {
                                    if (!confirm('Silmek istediğinize emin misiniz?')) return;
                                    const newHistory = [...data.history];
                                    newHistory.splice(i, 1);
                                    setData({ ...data, history: newHistory });
                                }} type="button" className="text-red-500 hover:bg-red-50 rounded p-1 transition-colors" title="Sil"><span className="material-symbols-outlined text-base">delete</span></button>
                            </div>

                            {/* Yıl ve Başlık */}
                            <div className="md:col-span-3 space-y-2">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">Yıl</label>
                                    <input className="w-full border rounded p-2 text-sm font-bold" value={item.year} onChange={e => {
                                        const newHistory = [...data.history];
                                        newHistory[i].year = e.target.value;
                                        setData({ ...data, history: newHistory });
                                    }} placeholder="1979" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">Başlık</label>
                                    <input className="w-full border rounded p-2 text-sm" value={item.title} onChange={e => {
                                        const newHistory = [...data.history];
                                        newHistory[i].title = e.target.value;
                                        setData({ ...data, history: newHistory });
                                    }} placeholder="Kuruluş" />
                                </div>
                            </div>

                            {/* Açıklama */}
                            <div className="md:col-span-6">
                                <label className="block text-xs font-bold text-gray-500 mb-1">Açıklama</label>
                                <textarea className="w-full border rounded p-2 text-sm h-full min-h-[100px]" value={item.description} onChange={e => {
                                    const newHistory = [...data.history];
                                    newHistory[i].description = e.target.value;
                                    setData({ ...data, history: newHistory });
                                }} placeholder="Detaylı açıklama..." />
                            </div>

                            {/* Resim Alanı (URL veya Upload) */}
                            <div className="md:col-span-3 space-y-2">
                                <label className="block text-xs font-bold text-gray-500">Görsel <span className="font-normal text-gray-400">(Önerilen: 600x400px)</span></label>

                                {item.image && (
                                    <div className="relative group mb-1">
                                        <img
                                            src={item.image.startsWith('http') ? item.image : `${API_BASE_URL}/uploads/${item.image}`}
                                            className="w-full h-24 object-cover rounded border bg-white"
                                            alt="Preview"
                                        />
                                        <button onClick={() => {
                                            const newHistory = [...data.history];
                                            newHistory[i].image = null;
                                            setData({ ...data, history: newHistory });
                                        }} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity transform hover:scale-110"><span className="material-symbols-outlined text-xs">close</span></button>
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <input
                                        className="w-full border rounded p-2 text-xs bg-white"
                                        placeholder="URL Yapıştır (https://...)"
                                        value={item.image && item.image.startsWith('http') ? item.image : ''}
                                        onChange={e => {
                                            const newHistory = [...data.history];
                                            newHistory[i].image = e.target.value;
                                            setData({ ...data, history: newHistory });
                                        }}
                                        onBlur={e => {
                                            const fixed = convertToDirectLink(e.target.value);
                                            if (fixed !== e.target.value) {
                                                const newHistory = [...data.history];
                                                newHistory[i].image = fixed;
                                                setData({ ...data, history: newHistory });
                                            }
                                        }}
                                    />
                                    <div className="text-[10px] text-gray-400 text-center font-bold">- VEYA -</div>
                                    <input type="file" className="text-xs w-full text-gray-500" onChange={(e) => handleImageUpload(e, i)} />
                                </div>
                            </div>
                        </div>
                    ))}

                    {data.history.length === 0 && (
                        <div className="text-center py-10 text-gray-400 italic">
                            Henüz kayıt yok. "Yeni Dönem Ekle" diyerek başlayabilirsiniz.
                        </div>
                    )}
                </div>
            </div>

            <div className="flex justify-end sticky bottom-6">
                <button onClick={handleSave} disabled={loading} className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg transition-all flex items-center gap-2">
                    {loading ? 'Kaydediliyor...' : 'Tüm Değişiklikleri Kaydet'}
                    {!loading && <span className="material-symbols-outlined">save</span>}
                </button>
            </div>
        </div>
    );
}



