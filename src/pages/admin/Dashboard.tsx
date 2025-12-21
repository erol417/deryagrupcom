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

// HELPER: Upload file to server and return filename
const uploadFileToServer = async (file: File): Promise<string | null> => {
    const formData = new FormData();
    formData.append('file', file);
    try {
        const res = await fetch(`${API_BASE_URL}/api/upload`, { method: 'POST', body: formData });
        const result = await res.json();
        if (result.success) return result.filePath;
    } catch (error) { console.error("Upload error:", error); }
    return null;
};

// COMPONENT: Image Input (URL + File)
const ImageInput = ({ value, onChange, label, recommendedSize }: { value: string, onChange: (val: string) => void, label: string, recommendedSize?: string }) => {
    return (
        <div className="space-y-2 mb-4">
            {label && <label className="block text-xs font-bold text-gray-500 mb-1">{label} {recommendedSize && <span className="font-normal text-gray-400">({recommendedSize})</span>}</label>}

            {value && (
                <div className="relative group w-full h-32 bg-gray-100 rounded-lg overflow-hidden border mb-2">
                    <img src={value.startsWith('http') ? value : `${API_BASE_URL}/uploads/${value}`} className="w-full h-full object-cover" alt="Preview" />
                    <button type="button" onClick={() => onChange('')} className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:scale-110 transition-transform"><span className="material-symbols-outlined text-sm block">close</span></button>
                </div>
            )}

            <input
                className="w-full border rounded p-2 text-sm"
                placeholder="URL Yapıştır (https://...)"
                value={value && value.startsWith('http') ? value : ''}
                onChange={(e) => onChange(e.target.value)}
                onBlur={(e) => {
                    const fixed = convertToDirectLink(e.target.value);
                    if (fixed !== e.target.value) onChange(fixed);
                }}
            />
            <div className="text-[10px] text-gray-400 text-center font-bold flex items-center gap-2 justify-center before:h-px before:flex-1 before:bg-gray-200 after:h-px after:flex-1 after:bg-gray-200">VEYA</div>
            <input type="file" className="text-xs w-full text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" onChange={async (e) => {
                if (e.target.files?.[0]) {
                    const fileName = await uploadFileToServer(e.target.files[0]);
                    if (fileName) onChange(fileName);
                }
            }} />
        </div>
    );
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
    const [activeTab, setActiveTab] = useState<'home' | 'applications' | 'jobs' | 'news' | 'social' | 'culture' | 'hero' | 'about' | 'legal' | 'contact_settings' | 'home_content' | 'users' | 'reports'>('home');
    const [currentUser, setCurrentUser] = useState<any>(null);

    const [jobs, setJobs] = useState<Job[]>([]);
    const [applications, setApplications] = useState<Application[]>([]);
    const [isJobModalOpen, setIsJobModalOpen] = useState(false);

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
        setIsJobModalOpen(false); // Close Modal
        fetchJobs(); // Yenile
    };

    // İlan Silme
    const handleDeleteJob = async (id: number) => {
        if (!confirm("İlanı silmek istediğinize emin misiniz?")) return;
        await fetch(`${API_BASE_URL}/api/jobs/${id}`, { method: 'DELETE' });
        fetchJobs();
    };

    const handleToggleJobStatus = async (id: number, currentStatus: boolean | undefined) => {
        // const newStatus = currentStatus === false; // If currently false, make true. If undefined (default true) or true, make false? No, wait.
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
        localStorage.removeItem('user');
        navigate('/login');
    };

    const menuGroups = [
        {
            title: "Genel Bakış",
            items: [
                { id: "home", label: "Ana Sayfa", icon: "dashboard" },
                { id: "reports", label: "Raporlar & Analiz", icon: "analytics" }
            ]
        },
        {
            title: "İnsan Kaynakları",
            items: [
                { id: "applications", label: "Başvuru Havuzu", icon: "folder_shared" },
                { id: "jobs", label: "İlan Yönetimi", icon: "work" },
                { id: "culture", label: "Kültür & Yaşam", icon: "diversity_3" }
            ]
        },
        {
            title: "Ana Sayfa",
            items: [
                { id: "hero", label: "Manşet (Hero) Yönetimi", icon: "view_carousel" },
                { id: "home_content", label: "İçerik (Vizyon/Başarı)", icon: "edit_document" }
            ]
        },
        {
            title: "Kurumsal",
            items: [
                { id: "about", label: "Hakkımızda Sayfası", icon: "business" },
            ]
        },
        {
            title: "Medya & Haberler",
            items: [
                { id: "news", label: "Haber Yönetimi", icon: "newspaper" },
                { id: "social", label: "Sosyal Medya", icon: "share" },
            ]
        },
        {
            title: "Site Ayarları",
            items: [
                { id: "contact_settings", label: "İletişim Ayarları", icon: "contact_phone" },
                { id: "legal", label: "Yasal Metinler", icon: "gavel" },
            ]
        },
    ];

    if (currentUser?.role === 'super' || currentUser?.role === 'superadmin') {
        menuGroups.push({
            title: "Genel Ayarlar",
            items: [
                { id: "users", label: "Kullanıcı Yönetimi", icon: "manage_accounts" },
            ]
        });
    }

    return (
        <div className="min-h-screen bg-gray-50 flex font-sans text-gray-800">
            {/* SIDEBAR */}
            <aside className="w-72 bg-[#0f172a] text-gray-300 flex flex-col fixed h-full overflow-y-auto border-r border-[#1e293b] z-50">
                <div className="p-6 flex items-center gap-3 border-b border-white/10">
                    <div className="size-10 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary/20">D</div>
                    <div>
                        <h1 className="text-white font-bold text-lg tracking-wide">YÖNETİM</h1>
                        <p className="text-xs text-gray-500 uppercase tracking-widest">Genel Panel</p>
                    </div>
                </div>

                <nav className="flex-1 py-6 px-3 space-y-8">
                    {menuGroups.map((group, gIndex) => (
                        <div key={gIndex}>
                            <h3 className="px-3 text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">{group.title}</h3>
                            <ul className="space-y-1">
                                {group.items.map((item) => (
                                    <li key={item.id}>
                                        <button
                                            onClick={() => setActiveTab(item.id as any)}
                                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === item.id
                                                ? 'bg-primary text-white shadow-lg shadow-primary/20 translate-x-1'
                                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                                                }`}
                                        >
                                            <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                                            {item.label}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </nav>

                <div className="p-4 border-t border-white/10 bg-[#0b1120]">
                    <div className="flex items-center gap-3 mb-4 px-2">
                        <div className="size-8 rounded-full bg-gray-700 flex items-center justify-center text-white font-bold">
                            {currentUser?.username?.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-white truncate">{currentUser?.username}</p>
                            <p className="text-xs text-gray-500 truncate capitalize">{currentUser?.role}</p>
                        </div>
                    </div>
                    {currentUser?.role === 'super' && (
                        <button
                            onClick={() => navigate('/admin/super')}
                            className="w-full flex items-center justify-center gap-2 bg-blue-600/10 hover:bg-blue-600 hover:text-white text-blue-500 p-2 rounded-lg transition-colors text-sm font-bold mb-2"
                        >
                            <span className="material-symbols-outlined text-lg">arrow_back</span>
                            Panel Ana Sayfası
                        </button>
                    )}
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500 hover:text-white text-red-500 p-2 rounded-lg transition-colors text-sm font-bold"
                    >
                        <span className="material-symbols-outlined text-lg">logout</span>
                        Çıkış Yap
                    </button>
                </div>
            </aside>

            {/* CONTENT AREA */}
            <main className="ml-72 flex-1 min-w-0">
                {/* Header Section */}
                <header className="bg-white border-b border-gray-200 sticky top-0 z-30 px-8 py-5 flex items-center justify-between shadow-sm/50">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">
                            {menuGroups.flatMap(g => g.items).find(i => i.id === activeTab)?.label || 'Panel'}
                        </h2>
                    </div>
                </header>

                <div className="p-8 max-w-7xl mx-auto">
                    {activeTab === 'home' && <OverviewTab />}
                    {activeTab === 'applications' && <ApplicationsTab applications={applications} />}
                    {activeTab === 'jobs' && (
                        <div>
                            <div className="flex justify-end mb-6">
                                <button
                                    onClick={() => setIsJobModalOpen(true)}
                                    className="bg-green-600 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-green-700 shadow-lg shadow-green-200 flex items-center gap-2 transition-all hover:-translate-y-1"
                                >
                                    <span className="material-symbols-outlined">add_circle</span>
                                    Yeni İlan Oluştur
                                </button>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                {jobs.map(job => (
                                    <div key={job.id} className={`bg-white p-6 rounded-xl border shadow-sm flex items-center justify-between ${job.isActive === false ? 'opacity-60 border-red-200' : 'border-gray-100 hover:border-blue-200 transition-colors'}`}>
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500 font-bold text-xl uppercase">
                                                {job.title.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h3 className="font-bold text-lg text-gray-800">{job.title}</h3>
                                                    {job.isActive === false && <span className="bg-red-100 text-red-600 text-[10px] px-2 py-0.5 rounded font-bold">PASİF</span>}
                                                </div>
                                                <p className="text-sm text-gray-500 flex items-center gap-3">
                                                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">domain</span> {job.department}</span>
                                                    <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">location_on</span> {job.location}</span>
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => handleToggleJobStatus(job.id, job.isActive)} className="text-gray-400 hover:text-blue-600 p-2 rounded hover:bg-blue-50 transition-colors" title={job.isActive === false ? "Aktif Yap" : "Pasif Yap"}>
                                                <span className="material-symbols-outlined">{job.isActive === false ? 'visibility_off' : 'visibility'}</span>
                                            </button>
                                            <button onClick={() => handleDeleteJob(job.id)} className="text-red-400 hover:text-red-600 p-2 rounded hover:bg-red-50 transition-colors" title="Sil">
                                                <span className="material-symbols-outlined">delete</span>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                {jobs.length === 0 && (
                                    <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
                                        <span className="material-symbols-outlined text-4xl text-gray-400 mb-2">work_off</span>
                                        <p className="text-gray-500 font-medium">Henüz aktif bir iş ilanı bulunmuyor.</p>
                                    </div>
                                )}
                            </div>

                            {/* Job Modal */}
                            {isJobModalOpen && (
                                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                                    <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl animate-fadeIn">
                                        <div className="sticky top-0 bg-white px-8 py-5 border-b border-gray-100 flex justify-between items-center z-10">
                                            <h3 className="font-bold text-xl text-gray-800 flex items-center gap-2">
                                                <span className="material-symbols-outlined text-green-600">add_circle</span>
                                                Yeni İlan Ekle
                                            </h3>
                                            <button onClick={() => setIsJobModalOpen(false)} className="bg-gray-100 hover:bg-gray-200 text-gray-500 rounded-full p-2 transition-colors">
                                                <span className="material-symbols-outlined">close</span>
                                            </button>
                                        </div>

                                        <form onSubmit={handleAddJob} className="p-8 space-y-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="md:col-span-2">
                                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">İlan Başlığı</label>
                                                    <input
                                                        required
                                                        className="w-full border rounded-lg p-3 text-sm font-bold text-gray-800 focus:ring-2 focus:ring-green-100 outline-none"
                                                        placeholder="Örn: Satış Temsilcisi"
                                                        value={newJob.title}
                                                        onChange={e => setNewJob({ ...newJob, title: e.target.value })}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Departman</label>
                                                    <input
                                                        required
                                                        className="w-full border rounded-lg p-3 text-sm focus:ring-2 focus:ring-green-100 outline-none"
                                                        placeholder="Örn: Pazarlama"
                                                        value={newJob.department}
                                                        onChange={e => setNewJob({ ...newJob, department: e.target.value })}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Lokasyon</label>
                                                    <input
                                                        required
                                                        className="w-full border rounded-lg p-3 text-sm focus:ring-2 focus:ring-green-100 outline-none"
                                                        placeholder="Örn: İstanbul"
                                                        value={newJob.location}
                                                        onChange={e => setNewJob({ ...newJob, location: e.target.value })}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Çalışma Şekli</label>
                                                    <select
                                                        className="w-full border rounded-lg p-3 text-sm bg-white focus:ring-2 focus:ring-green-100 outline-none"
                                                        value={newJob.type}
                                                        onChange={e => setNewJob({ ...newJob, type: e.target.value })}
                                                    >
                                                        <option value="Tam Zamanlı">Tam Zamanlı</option>
                                                        <option value="Yarı Zamanlı">Yarı Zamanlı</option>
                                                        <option value="Uzaktan">Uzaktan</option>
                                                        <option value="Staj">Staj</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="border-t border-gray-100 pt-6 space-y-6">
                                                <div>
                                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">İş Tanımı</label>
                                                    <textarea
                                                        required
                                                        rows={4}
                                                        className="w-full border rounded-lg p-3 text-sm focus:ring-2 focus:ring-green-100 outline-none"
                                                        placeholder="Pozisyon hakkında genel bilgilendirme..."
                                                        value={newJob.description}
                                                        onChange={e => setNewJob({ ...newJob, description: e.target.value })}
                                                    />
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div>
                                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Sorumluluklar</label>
                                                        <textarea
                                                            required
                                                            rows={6}
                                                            className="w-full border rounded-lg p-3 text-sm focus:ring-2 focus:ring-green-100 outline-none font-mono text-xs"
                                                            placeholder="- Sorumluluk 1&#10;- Sorumluluk 2&#10;- Sorumluluk 3"
                                                            value={newJob.responsibilities}
                                                            onChange={e => setNewJob({ ...newJob, responsibilities: e.target.value })}
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Aranan Nitelikler</label>
                                                        <textarea
                                                            required
                                                            rows={6}
                                                            className="w-full border rounded-lg p-3 text-sm focus:ring-2 focus:ring-green-100 outline-none font-mono text-xs"
                                                            placeholder="- Nitelik 1&#10;- Nitelik 2&#10;- Nitelik 3"
                                                            value={newJob.qualifications}
                                                            onChange={e => setNewJob({ ...newJob, qualifications: e.target.value })}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="bg-blue-50 text-blue-800 p-4 rounded-lg text-sm flex items-start gap-2">
                                                    <span className="material-symbols-outlined text-blue-600 mt-0.5">info</span>
                                                    Gireceğiniz maddeler (sorumluluklar vb.), detay sayfasında otomatik olarak madde işaretli (bullet point) liste haline dönüşecek. Her maddeyi yeni bir satıra yazınız.
                                                </div>
                                            </div>

                                            <div className="border-t border-gray-100 pt-6">
                                                <h4 className="font-bold text-gray-700 mb-4">Aday Kriterleri (Opsiyonel)</h4>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div>
                                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Minimum Tecrübe</label>
                                                        <input
                                                            className="w-full border rounded-lg p-3 text-sm focus:ring-2 focus:ring-green-100 outline-none"
                                                            placeholder="Örn: En az 2 yıl"
                                                            value={newJob.experience}
                                                            onChange={e => setNewJob({ ...newJob, experience: e.target.value })}
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Eğitim Seviyesi</label>
                                                        <input
                                                            className="w-full border rounded-lg p-3 text-sm focus:ring-2 focus:ring-green-100 outline-none"
                                                            placeholder="Örn: Lisans Mezunu"
                                                            value={newJob.education}
                                                            onChange={e => setNewJob({ ...newJob, education: e.target.value })}
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex justify-end gap-4 pt-4 border-t border-gray-100">
                                                <button
                                                    type="button"
                                                    onClick={() => setIsJobModalOpen(false)}
                                                    className="px-6 py-3 text-gray-500 font-bold hover:bg-gray-100 rounded-lg transition-colors"
                                                >
                                                    İptal
                                                </button>
                                                <button
                                                    type="submit"
                                                    className="px-8 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 shadow-lg shadow-green-200 transition-all hover:-translate-y-1"
                                                >
                                                    İlanı Yayınla
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                    {activeTab === 'news' && <NewsTab />}
                    {activeTab === 'social' && <SocialTab />}
                    {activeTab === 'culture' && <CultureTab />}
                    {activeTab === 'hero' && <HeroTab />}
                    {activeTab === 'about' && <AboutTab />}
                    {activeTab === 'legal' && <LegalTab />}
                    {activeTab === 'contact_settings' && <ContactTab />}
                    {activeTab === 'home_content' && <HomeContentTab />}
                    {activeTab === 'users' && <UsersTab />}
                    {activeTab === 'reports' && <ReportsTab />}
                </div>
            </main>
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


    const handleSave = async () => {
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

                                <ImageInput
                                    label="Slide Görseli"
                                    recommendedSize="1920x1080px"
                                    value={slide.image}
                                    onChange={(val) => {
                                        const newSlides = [...data.type1.slides];
                                        newSlides[i].image = val;
                                        setData({ ...data, type1: { ...data.type1, slides: newSlides } });
                                    }}
                                />
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

                                <ImageInput
                                    label="Slide Görseli"
                                    recommendedSize="1920x1080px"
                                    value={slide.image}
                                    onChange={(val) => {
                                        const newSlides = [...data.type2.slides];
                                        newSlides[i].image = val;
                                        setData({ ...data, type2: { ...data.type2, slides: newSlides } });
                                    }}
                                />
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
                            <ImageInput
                                label="Sağ Görsel"
                                recommendedSize="800x1200px / Dikey"
                                value={data.type3.rightImage}
                                onChange={(val) => setData({ ...data, type3: { ...data.type3, rightImage: val } })}
                            />
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
                                    <input className="w-full border rounded p-2 text-sm" placeholder="örn: eco" value={data.type3.floatingBox?.icon} onChange={e => setData({ ...data, type3: { ...data.type3.floatingBox, icon: e.target.value } })} />
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
    const [imagePath, setImagePath] = useState('');
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
        setImagePath(item?.imagePath || '');
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', title);
        formData.append('summary', summary);
        formData.append('content', content);
        formData.append('category', category);
        formData.append('imagePath', imagePath);

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
                                <ImageInput
                                    label="Haber Görseli"
                                    value={imagePath}
                                    onChange={setImagePath}
                                />
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
    const [imagePath, setImagePath] = useState('');

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
        fd.append('imagePath', imagePath);

        await fetch(`${API_BASE_URL}/api/social`, {
            method: 'POST',
            body: fd
        });

        setNewItem({ platform: 'instagram', date: '', description: '', link: '' });
        setImagePath('');
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
                            <ImageInput
                                label="Görsel (Dikey/Portrait Önerilir)"
                                value={imagePath}
                                onChange={setImagePath}
                            />
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
    const [galleryUrl, setGalleryUrl] = useState('');

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
                <div className="bg-blue-50 p-4 rounded-lg flex items-start gap-3 text-blue-800 text-sm">
                    <span className="material-symbols-outlined text-blue-600 mt-0.5">info</span>
                    <div>
                        <span className="font-bold block mb-1">Bilgi:</span>
                        Buraya eklediğiniz görseller, <strong>Kültür & Yaşam</strong> sayfasındaki <strong>"Ofisten Kareler"</strong> bölümünde sergilenir.
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-4 items-end bg-gray-50 p-4 rounded-xl border border-dashed border-gray-300">
                    <div className="flex-1 w-full">
                        <label className="block text-xs font-bold text-gray-500 mb-1">URL (Link) ile Ekle</label>
                        <div className="flex gap-2">
                            <input
                                className="flex-1 border rounded-lg p-2 text-sm"
                                placeholder="https://..."
                                value={galleryUrl}
                                onChange={e => setGalleryUrl(e.target.value)}
                            />
                            <button
                                onClick={() => {
                                    if (!galleryUrl) return;
                                    setData({ ...data, gallery: [...(data.gallery || []), galleryUrl] });
                                    setGalleryUrl('');
                                }}
                                className="bg-green-600 text-white px-4 rounded-lg font-bold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={!galleryUrl}
                            >
                                Ekle
                            </button>
                        </div>
                    </div>
                    <div className="flex items-center justify-center p-2 text-gray-400 font-bold text-xs uppercase self-center">VEYA</div>
                    <div className="flex-1 w-full">
                        <label className="block text-xs font-bold text-gray-500 mb-1">Dosya Yükle</label>
                        <input type="file" className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 bg-white border border-gray-200 rounded-full"
                            onChange={e => handleFileUpload(e, 'gallery')}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-4 md:grid-cols-6 gap-4">
                    {data.gallery?.map((img: string, i: number) => (
                        <div key={i} className="relative group aspect-square bg-gray-100 rounded overflow-hidden">
                            <img src={img.startsWith('http') ? img : `${API_BASE_URL}/uploads/${img}`} className="w-full h-full object-cover" />
                            <button onClick={() => { const n = [...data.gallery]; n.splice(i, 1); setData({ ...data, gallery: n }) }} className="absolute top-1 right-1 bg-white/80 p-1 rounded-full text-red-500 hover:bg-white shadow-sm hover:scale-110 transition-all"><span className="material-symbols-outlined text-sm">close</span></button>
                        </div>
                    ))}
                    {(!data.gallery || data.gallery.length === 0) && <p className="col-span-4 text-gray-500 italic text-sm text-center py-4">Henüz görsel eklenmemiş.</p>}
                </div>
            </div>

            {/* PERKS */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
                <div className="flex justify-between">
                    <h4 className="font-bold border-l-4 border-orange-500 pl-3">Ayrıcalıklar</h4>
                    <button onClick={() => setData({ ...data, perks: [...(data.perks || []), { title: '', icon: 'star' }] })} className="text-sm bg-orange-50 text-orange-600 px-3 py-1 rounded font-bold">+ Ekle</button>
                </div>

                <div className="p-4 bg-orange-50/50 rounded-xl border border-orange-100">
                    <ImageInput
                        label="Ayrıcalıklar Yan Görseli"
                        recommendedSize="Dikey / Portrait"
                        value={data.perksImage || ''}
                        onChange={val => setData({ ...data, perksImage: val })}
                    />
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
    const [data, setData] = useState<any>({
        hero: { title: 'Hakkımızda', subtitle: 'Biz Kimiz?', image: '' },
        whoWeAre: { title: 'Derya Grup Kimdir?', content: '' },
        videoUrl: '',
        stats: [],
        values: [],
        chairman: { name: '', title: 'Yönetim Kurulu Başkanı', message: '', image: '' },
        history: []
    });
    const [loading, setLoading] = useState(false);
    const [activeSection, setActiveSection] = useState<'hero' | 'who' | 'video' | 'stats' | 'values' | 'chairman' | 'history'>('hero');

    useEffect(() => {
        fetch(`${API_BASE_URL}/api/about`)
            .then(res => res.json())
            .then(d => {
                const def = {
                    hero: { title: 'Hakkımızda', subtitle: 'Biz Kimiz?', image: '' },
                    whoWeAre: { title: 'Derya Grup Kimdir?', content: '' },
                    videoUrl: '',
                    stats: [{ value: '47+', label: 'Yıllık Tecrübe' }, { value: '100.000+', label: 'Hizmet Verilmiş Müşteri' }],
                    values: [],
                    chairman: { name: 'Hüseyin Kış', title: 'Yönetim Kurulu Başkanı', message: '', image: '' },
                    history: []
                };
                // Merge loaded data with defaults to ensure all fields exist
                setData({ ...def, ...d });
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

    const handleFileUpload = async (file: File, callback: (path: string) => void) => {
        if (!file) return;
        const formData = new FormData();
        formData.append('file', file);
        try {
            const res = await fetch(`${API_BASE_URL}/api/upload`, { method: 'POST', body: formData });
            const result = await res.json();
            if (result.success) callback(result.filePath);
        } catch (error) { console.error(error); alert('Resim yüklenemedi.'); }
    };

    // Helper functions for updating state
    const updateHero = (key: string, val: string) => setData((prev: any) => ({ ...prev, hero: { ...prev.hero, [key]: val } }));
    const updateWho = (key: string, val: string) => setData((prev: any) => ({ ...prev, whoWeAre: { ...prev.whoWeAre, [key]: val } }));
    const updateChairman = (key: string, val: string) => setData((prev: any) => ({ ...prev, chairman: { ...prev.chairman, [key]: val } }));

    // Stats Management
    const addStat = () => setData((prev: any) => ({ ...prev, stats: [...(prev.stats || []), { value: '', label: '' }] }));
    const removeStat = (index: number) => setData((prev: any) => {
        const n = [...prev.stats]; n.splice(index, 1); return { ...prev, stats: n };
    });
    const updateStat = (index: number, key: string, val: string) => setData((prev: any) => {
        const n = [...prev.stats]; n[index] = { ...n[index], [key]: val }; return { ...prev, stats: n };
    });

    // Values Management
    const addValue = () => setData((prev: any) => ({ ...prev, values: [...(prev.values || []), { title: '', desc: '', icon: 'star' }] }));
    const removeValue = (index: number) => setData((prev: any) => {
        const n = [...prev.values]; n.splice(index, 1); return { ...prev, values: n };
    });
    const updateValue = (index: number, key: string, val: string) => setData((prev: any) => {
        const n = [...prev.values]; n[index] = { ...n[index], [key]: val }; return { ...prev, values: n };
    });

    // History Management
    const addHistory = () => {
        setData((prev: any) => {
            const newHistory = [...(prev.history || [])];
            newHistory.push({
                id: Date.now(),
                year: new Date().getFullYear().toString(),
                title: '',
                description: '',
                image: null // Changed from 'null' string to null value
            });
            return { ...prev, history: newHistory };
        });
    };

    const removeHistory = (index: number) => {
        setData((prev: any) => {
            const newHistory = [...prev.history];
            newHistory.splice(index, 1);
            return { ...prev, history: newHistory };
        });
    };

    const updateHistory = (index: number, field: string, value: any) => {
        setData((prev: any) => {
            const newHistory = [...prev.history];
            newHistory[index] = { ...newHistory[index], [field]: value };
            return { ...prev, history: newHistory };
        });
    };

    const getEmbedUrl = (url: string) => {
        if (!url) return '';
        let id = '';
        try {
            if (url.includes('embed/')) id = url.split('embed/')[1].split('?')[0];
            else if (url.includes('watch?v=')) id = url.split('watch?v=')[1].split('&')[0];
            else if (url.includes('youtu.be/')) id = url.split('youtu.be/')[1].split('?')[0];
        } catch (e) { return ''; }
        if (id) return `https://www.youtube.com/embed/${id}?rel=0`;
        return '';
    };


    return (
        <div className="space-y-8 pb-20">
            <div className="flex justify-between items-center border-b border-gray-200 pb-4">
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <span className="material-symbols-outlined text-purple-600">apartment</span>
                    Kurumsal / Hakkımızda Yönetimi
                </h3>
                <button onClick={handleSave} disabled={loading} className="bg-purple-900 text-white px-6 py-2 rounded-lg font-bold hover:bg-purple-950 transition-colors shadow-lg disabled:opacity-50 flex items-center gap-2">
                    {loading ? <span className="material-symbols-outlined animate-spin text-sm">refresh</span> : <span className="material-symbols-outlined text-sm">save</span>}
                    {loading ? 'Kaydediliyor...' : 'Tümünü Kaydet'}
                </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {[
                    { id: 'hero', label: 'Sayfa Başlığı (Hero)', icon: 'image' },
                    { id: 'who', label: 'Biz Kimiz?', icon: 'info' },
                    { id: 'video', label: 'Tanıtım Videosu', icon: 'play_circle' },
                    { id: 'stats', label: 'İstatistikler', icon: 'bar_chart' },
                    { id: 'values', label: 'Değerlerimiz', icon: 'diamond' },
                    { id: 'chairman', label: 'Yön. Kurulu Başkanı', icon: 'person_celebrate' },
                    { id: 'history', label: 'Tarihçe', icon: 'history' },
                ].map(tab => (
                    <button key={tab.id} onClick={() => setActiveSection(tab.id as any)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold whitespace-nowrap transition-all ${activeSection === tab.id ? 'bg-purple-100 text-purple-700 shadow-sm ring-1 ring-purple-200' : 'bg-white text-gray-500 hover:bg-gray-50 border border-transparent'}`}>
                        <span className="material-symbols-outlined text-lg">{tab.icon}</span>
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm min-h-[400px]">

                {/* HERO SECTION */}
                {activeSection === 'hero' && (
                    <div className="space-y-6">
                        <h4 className="font-bold border-l-4 border-purple-500 pl-3 text-lg">Sayfa Üst Bölümü (Hero)</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Başlık</label>
                                <input className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-purple-200 outline-none"
                                    value={data.hero?.title || ''} onChange={e => updateHero('title', e.target.value)} placeholder="Örn: Hakkımızda" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Alt Başlık</label>
                                <input className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-purple-200 outline-none"
                                    value={data.hero?.subtitle || ''} onChange={e => updateHero('subtitle', e.target.value)} placeholder="Örn: Biz Kimiz?" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Arkaplan Görseli</label>
                                <div className="flex items-start gap-4 p-4 border border-dashed border-gray-300 rounded-xl bg-gray-50">
                                    {data.hero?.image ? (
                                        <div className="relative group shrink-0">
                                            <img src={data.hero.image.startsWith('http') ? data.hero.image : `${API_BASE_URL}/uploads/${data.hero.image}`} className="h-32 rounded-lg object-cover shadow-sm" />
                                            <button onClick={() => updateHero('image', '')} className="absolute -top-2 -right-2 bg-white text-red-500 rounded-full p-1 shadow-md hover:bg-red-50"><span className="material-symbols-outlined text-sm">close</span></button>
                                        </div>
                                    ) : (
                                        <div className="h-32 w-48 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 text-xs shrink-0">Görsel Yok</div>
                                    )}
                                    <div className="flex-1 space-y-3">
                                        <div>
                                            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Dosya Yükle</label>
                                            <input type="file" className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                                                onChange={e => handleFileUpload(e.target.files?.[0] as File, path => updateHero('image', path))} />
                                        </div>
                                        <div className="relative flex items-center py-1">
                                            <div className="grow border-t border-gray-200"></div>
                                            <span className="shrink-0 mx-2 text-[10px] font-bold text-gray-400 uppercase">VEYA</span>
                                            <div className="grow border-t border-gray-200"></div>
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Görsel URL (Link)</label>
                                            <div className="flex items-center gap-2">
                                                <span className="material-symbols-outlined text-gray-400">link</span>
                                                <input className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-purple-200 outline-none"
                                                    value={data.hero?.image || ''}
                                                    onChange={e => updateHero('image', e.target.value)}
                                                    placeholder="https://..." />
                                            </div>
                                        </div>
                                        <p className="text-[10px] text-gray-500">Önerilen Boyut: 1920x600px. JPG veya PNG.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* WHO WE ARE */}
                {activeSection === 'who' && (
                    <div className="space-y-6">
                        <h4 className="font-bold border-l-4 border-purple-500 pl-3 text-lg">Derya Grup Kimdir?</h4>
                        <div>
                            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Başlık</label>
                            <input className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-purple-200 outline-none mb-4"
                                value={data.whoWeAre?.title || ''} onChange={e => updateWho('title', e.target.value)} placeholder="Örn: Derya Grup Kimdir?" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">İçerik Metni</label>
                            <textarea className="w-full border border-gray-300 rounded-lg p-3 text-sm h-64 focus:ring-2 focus:ring-purple-200 outline-none resize-none leading-relaxed"
                                value={data.whoWeAre?.content || ''} onChange={e => updateWho('content', e.target.value)} placeholder="Şirket hakkında detaylı bilgi..." />
                        </div>
                    </div>
                )}

                {/* VIDEO SECTION */}
                {activeSection === 'video' && (
                    <div className="space-y-6">
                        <h4 className="font-bold border-l-4 border-purple-500 pl-3 text-lg">Tanıtım Videosu</h4>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">YouTube Video URL</label>
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-gray-400">link</span>
                                    <input className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-red-200 outline-none"
                                        value={data.videoUrl || ''} onChange={e => setData({ ...data, videoUrl: e.target.value })} placeholder="https://www.youtube.com/watch?v=..." />
                                </div>
                                <p className="text-[10px] text-gray-500 mt-2">YouTube video linkini olduğu gibi yapıştırın. Sistem otomatik olarak algılayacaktır.</p>
                            </div>

                            {data.videoUrl && (
                                <div className="mt-4">
                                    <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Önizleme</label>
                                    <div className="aspect-video w-full md:w-2/3 bg-black rounded-xl overflow-hidden shadow-lg mx-auto md:mx-0">
                                        {getEmbedUrl(data.videoUrl) ? (
                                            <iframe src={getEmbedUrl(data.videoUrl)} className="w-full h-full" allowFullScreen></iframe>
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-white/50 text-sm">Geçersiz URL</div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* STATS SECTION */}
                {activeSection === 'stats' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h4 className="font-bold border-l-4 border-purple-500 pl-3 text-lg">İstatistikler</h4>
                            <button onClick={addStat} className="bg-green-100 text-green-700 px-3 py-1.5 rounded-lg text-sm font-bold hover:bg-green-200 flex items-center gap-1 transition-colors">
                                <span className="material-symbols-outlined text-sm">add</span> Yeni İstatistik Ekle
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {data.stats?.map((stat: any, i: number) => (
                                <div key={i} className="border border-gray-200 p-4 rounded-xl bg-gray-50 relative group hover:shadow-md transition-all">
                                    <button onClick={() => removeStat(i)} className="absolute top-2 right-2 text-red-400 hover:text-red-600 bg-white rounded-full p-1 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"><span className="material-symbols-outlined text-lg">delete</span></button>
                                    <div className="space-y-3">
                                        <div>
                                            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Değer (Sayı)</label>
                                            <input className="w-full border border-gray-300 rounded-lg p-2 text-sm font-bold text-gray-800"
                                                value={stat.value} onChange={e => updateStat(i, 'value', e.target.value)} placeholder="Örn: 47+" />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Etiket (Açıklama)</label>
                                            <input className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                                                value={stat.label} onChange={e => updateStat(i, 'label', e.target.value)} placeholder="Örn: Yıllık Tecrübe" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {(!data.stats || data.stats.length === 0) && <p className="text-gray-500 italic text-sm md:col-span-2">Henüz istatistik eklenmemiş.</p>}
                        </div>
                    </div>
                )}

                {/* VALUES */}
                {activeSection === 'values' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h4 className="font-bold border-l-4 border-purple-500 pl-3 text-lg">Değerlerimiz</h4>
                            <button onClick={addValue} className="bg-green-100 text-green-700 px-3 py-1.5 rounded-lg text-sm font-bold hover:bg-green-200 flex items-center gap-1 transition-colors">
                                <span className="material-symbols-outlined text-sm">add</span> Yeni Değer Ekle
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {data.values?.map((val: any, i: number) => (
                                <div key={i} className="border border-gray-200 p-4 rounded-xl bg-gray-50 relative group hover:shadow-md transition-all">
                                    <button onClick={() => removeValue(i)} className="absolute top-2 right-2 text-red-400 hover:text-red-600 bg-white rounded-full p-1 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"><span className="material-symbols-outlined text-lg">delete</span></button>
                                    <div className="space-y-3">
                                        <div>
                                            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">İkon</label>
                                            <div className="flex items-center gap-2">
                                                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border shadow-sm text-purple-600">
                                                    <span className="material-symbols-outlined">{val.icon}</span>
                                                </div>
                                                <input className="w-full border border-gray-300 rounded-lg p-2 text-sm font-mono"
                                                    value={val.icon} onChange={e => updateValue(i, 'icon', e.target.value)} placeholder="star" />
                                            </div>
                                            <a href="https://fonts.google.com/icons" target="_blank" className="text-[10px] text-blue-500 hover:underline mt-1 block">Google Fonts Icon isimleri</a>
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Başlık</label>
                                            <input className="w-full border border-gray-300 rounded-lg p-2 text-sm font-bold"
                                                value={val.title} onChange={e => updateValue(i, 'title', e.target.value)} placeholder="Değer Başlığı" />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Açıklama</label>
                                            <textarea className="w-full border border-gray-300 rounded-lg p-2 text-xs h-20 resize-none"
                                                value={val.desc} onChange={e => updateValue(i, 'desc', e.target.value)} placeholder="Kısa açıklama..." />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* CHAIRMAN */}
                {activeSection === 'chairman' && (
                    <div className="space-y-6">
                        <h4 className="font-bold border-l-4 border-purple-500 pl-3 text-lg">Yönetim Kurulu Başkanı Mesajı</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="md:col-span-1">
                                <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Fotoğraf</label>
                                <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:bg-gray-50 transition-colors bg-gray-50">
                                    {data.chairman?.image ? (
                                        <img src={`${API_BASE_URL}/uploads/${data.chairman.image}`} className="w-full h-auto rounded-lg shadow-md mb-4 object-cover" />
                                    ) : (
                                        <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center mb-4 text-gray-400">
                                            <div className="text-center">
                                                <span className="material-symbols-outlined text-4xl block mb-2">add_photo_alternate</span>
                                                <span className="text-xs">Görsel Seçin</span>
                                            </div>
                                        </div>
                                    )}
                                    <input type="file" className="block w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                                        onChange={e => handleFileUpload(e.target.files?.[0] as File, path => updateChairman('image', path))} />
                                </div>
                            </div>
                            <div className="md:col-span-2 space-y-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Ad Soyad</label>
                                    <input className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-purple-200 outline-none"
                                        value={data.chairman?.name || ''} onChange={e => updateChairman('name', e.target.value)} placeholder="Örn: Hüseyin Kış" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Ünvan</label>
                                    <input className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-purple-200 outline-none"
                                        value={data.chairman?.title || ''} onChange={e => updateChairman('title', e.target.value)} placeholder="Örn: Yönetim Kurulu Başkanı" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Mesaj Metni</label>
                                    <textarea className="w-full border border-gray-300 rounded-lg p-3 text-sm h-64 focus:ring-2 focus:ring-purple-200 outline-none resize-none leading-relaxed"
                                        value={data.chairman?.message || ''} onChange={e => updateChairman('message', e.target.value)} placeholder="Başkanın mesajı..." />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* HISTORY */}
                {activeSection === 'history' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h4 className="font-bold border-l-4 border-purple-500 pl-3 text-lg">Tarihçe</h4>
                            <button onClick={addHistory} className="bg-blue-100 text-blue-700 px-3 py-1.5 rounded-lg text-sm font-bold hover:bg-blue-200 flex items-center gap-1 transition-colors">
                                <span className="material-symbols-outlined text-sm">add</span> Yeni Dönem Ekle
                            </button>
                        </div>
                        <div className="space-y-4">
                            {data.history?.sort((a: any, b: any) => parseInt(a.year) - parseInt(b.year)).map((item: any, i: number) => (
                                <div key={item.id} className="border border-gray-200 p-4 rounded-xl bg-gray-50 relative flex flex-col md:flex-row gap-6 items-start hover:shadow-md transition-all">
                                    <button onClick={() => removeHistory(i)} className="absolute top-2 right-2 text-white bg-red-400 hover:bg-red-600 p-1.5 rounded-lg shadow-sm transition-colors text-xs z-10" title="Kaldır"><span className="material-symbols-outlined text-sm">delete</span></button>

                                    <div className="w-full md:w-32 shrink-0">
                                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Görsel</label>
                                        <div className="relative">
                                            {item.image ? (
                                                <img src={`${API_BASE_URL}/uploads/${item.image}`} className="w-full h-24 object-cover rounded-lg border shadow-sm mb-2" />
                                            ) : <div className="w-full h-24 bg-gray-200 rounded-lg border mb-2 flex items-center justify-center text-xs text-gray-500">Görsel Yok</div>}
                                            <input type="file" className="text-[10px] w-full file:mr-2 file:py-1 file:px-2 file:rounded-lg file:border-0 file:text-[10px] file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
                                                onChange={e => handleFileUpload(e.target.files?.[0] as File, path => updateHistory(i, 'image', path))} />
                                        </div>
                                    </div>

                                    <div className="flex-1 w-full space-y-3">
                                        <div className="grid grid-cols-4 gap-4">
                                            <div className="col-span-1">
                                                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Yıl</label>
                                                <input className="w-full border border-gray-300 rounded-lg p-2 text-sm font-bold bg-white focus:ring-2 focus:ring-blue-100 outline-none"
                                                    value={item.year} onChange={e => updateHistory(i, 'year', e.target.value)} placeholder="1979" />
                                            </div>
                                            <div className="col-span-3">
                                                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Başlık</label>
                                                <input className="w-full border border-gray-300 rounded-lg p-2 text-sm bg-white focus:ring-2 focus:ring-blue-100 outline-none"
                                                    value={item.title} onChange={e => updateHistory(i, 'title', e.target.value)} placeholder="Olay Başlığı" />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Açıklama</label>
                                            <textarea className="w-full border border-gray-300 rounded-lg p-2 text-sm h-20 bg-white focus:ring-2 focus:ring-blue-100 outline-none resize-none"
                                                value={item.description} onChange={e => updateHistory(i, 'description', e.target.value)} placeholder="Detaylı açıklama..." />
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {(!data.history || data.history.length === 0) && (
                                <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-300 text-gray-400">
                                    <span className="material-symbols-outlined text-3xl mb-2 opacity-50">history_edu</span>
                                    <p className="text-sm">Henüz tarihçe kaydı bulunmuyor.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

// --- YASAL METİNLER (LEGAL) ---
function LegalTab() {
    const [data, setData] = useState({ kvkk: '', cookiePolicy: '', cookiePreferences: '' });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetch(`${API_BASE_URL}/api/legal`)
            .then(res => res.json())
            .then(d => {
                // Eğer null gelirse boş string ver
                setData({
                    kvkk: d.kvkk || '',
                    cookiePolicy: d.cookiePolicy || '',
                    cookiePreferences: d.cookiePreferences || ''
                });
            })
            .catch(e => console.error(e));
    }, []);

    const handleSave = async () => {
        setLoading(true);
        try {
            await fetch(`${API_BASE_URL}/api/legal`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            alert("Yasal metinler güncellendi!");
        } catch (error) {
            console.error(error);
            alert("Hata oluştu.");
        }
        setLoading(false);
    };

    return (
        <div className="space-y-8 pb-20">
            <div className="flex justify-between items-center bg-white p-6 rounded-xl border border-gray-200 shadow-sm sticky top-24 z-10">
                <h3 className="font-bold text-lg text-gray-800">Yasal Metin Yönetimi</h3>
                <button
                    onClick={handleSave}
                    disabled={loading}
                    className="bg-gray-900 text-white px-6 py-2 rounded-lg font-bold hover:bg-black transition-colors shadow-lg disabled:opacity-50"
                >
                    {loading ? 'Kaydediliyor...' : 'Tümünü Kaydet'}
                </button>
            </div>

            <div className="grid grid-cols-1 gap-8">
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <h4 className="font-bold text-gray-800 mb-2 border-l-4 border-blue-500 pl-3">KVKK & Aydınlatma Metni</h4>
                    <p className="text-xs text-gray-400 mb-4">"/kvkk" sayfasında görünür.</p>
                    <textarea
                        className="w-full border rounded-lg p-4 font-mono text-sm min-h-[400px] focus:ring-2 focus:ring-blue-500/20 outline-none"
                        value={data.kvkk}
                        onChange={e => setData({ ...data, kvkk: e.target.value })}
                        placeholder="KVKK metni..."
                    />
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <h4 className="font-bold text-gray-800 mb-2 border-l-4 border-orange-500 pl-3">Çerez (Cookie) Politikası</h4>
                    <p className="text-xs text-gray-400 mb-4">"/cerez-politikasi" sayfasında görünür.</p>
                    <textarea
                        className="w-full border rounded-lg p-4 font-mono text-sm min-h-[300px] focus:ring-2 focus:ring-orange-500/20 outline-none"
                        value={data.cookiePolicy}
                        onChange={e => setData({ ...data, cookiePolicy: e.target.value })}
                    />
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <h4 className="font-bold text-gray-800 mb-2 border-l-4 border-green-500 pl-3">Çerez Tercihleri Metni</h4>
                    <p className="text-xs text-gray-400 mb-4">"/cerez-tercihleri" sayfasında görünür veya banner içerisinde kullanılır.</p>
                    <textarea
                        className="w-full border rounded-lg p-4 font-mono text-sm min-h-[200px] focus:ring-2 focus:ring-green-500/20 outline-none"
                        value={data.cookiePreferences}
                        onChange={e => setData({ ...data, cookiePreferences: e.target.value })}
                    />
                </div>
            </div>
        </div>
    );
}

// --- İLETİŞİM BİLGİLERİ ---
function ContactTab() {
    const [data, setData] = useState({ address: '', phone: '', email: '', mapUrl: '', workingHoursWeekdays: '', workingHoursWeekend: '' });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetch(`${API_BASE_URL}/api/contact-info`)
            .then(res => res.json())
            .then(d => setData(d))
            .catch(console.error);
    }, []);

    const handleSave = async () => {
        setLoading(true);
        try {
            await fetch(`${API_BASE_URL}/api/contact-info`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            alert('İletişim bilgileri güncellendi!');
        } catch (e) {
            alert('Hata!');
        }
        setLoading(false);
    };

    return (
        <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm max-w-2xl mx-auto space-y-6">
            <h3 className="text-xl font-bold text-gray-800 border-b pb-4 mb-6">Site İletişim Bilgileri</h3>

            <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Adres</label>
                <textarea className="w-full border rounded-lg p-3 text-sm h-24" value={data.address} onChange={e => setData({ ...data, address: e.target.value })} />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Telefon</label>
                    <input className="w-full border rounded-lg p-3 text-sm" value={data.phone} onChange={e => setData({ ...data, phone: e.target.value })} />
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">E-Posta (Görünen)</label>
                    <input className="w-full border rounded-lg p-3 text-sm" value={data.email} onChange={e => setData({ ...data, email: e.target.value })} />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Hafta İçi Çalışma Saatleri</label>
                    <input className="w-full border rounded-lg p-3 text-sm" placeholder="Hafta içi: 09:00 - 18:00" value={data.workingHoursWeekdays || ''} onChange={e => setData({ ...data, workingHoursWeekdays: e.target.value })} />
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Hafta Sonu Çalışma Saatleri</label>
                    <input className="w-full border rounded-lg p-3 text-sm" placeholder="Cumartesi: 09:00 - 13:00" value={data.workingHoursWeekend || ''} onChange={e => setData({ ...data, workingHoursWeekend: e.target.value })} />
                </div>
            </div>

            <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Google Maps Embed Linki (iframe src)</label>
                <input className="w-full border rounded-lg p-3 text-sm font-mono text-xs" value={data.mapUrl} onChange={e => setData({ ...data, mapUrl: e.target.value })} />
                <p className="text-[10px] text-gray-400 mt-1">Google Maps - Paylaş - Harita Yerleştir - src içindeki linki kopyalayın.</p>
            </div>

            <button onClick={handleSave} disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors">
                {loading ? 'Kaydediliyor...' : 'Kaydet'}
            </button>
        </div>
    )
}

// --- ANA SAYFA İÇERİK YÖNETİMİ ---
function HomeContentTab() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetch(`${API_BASE_URL}/api/home-sections`)
            .then(res => res.json())
            .then(d => setData(d))
            .catch(console.error);
    }, []);

    const handleSave = async () => {
        setLoading(true);
        try {
            await fetch(`${API_BASE_URL}/api/home-sections`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            alert("İçerik güncellendi!");
        } catch (error) {
            console.error(error);
            alert("Hata oluştu.");
        }
        setLoading(false);
    };

    if (!data) return <div className="p-10 text-center">Yükleniyor...</div>;

    // Helpers
    const updateMission = (field: string, val: string) => {
        setData({ ...data, visionMission: { ...data.visionMission, mission: { ...data.visionMission.mission, [field]: val } } });
    };

    const updateVisionItem = (index: number, field: string, val: string) => {
        const newItems = [...data.visionMission.vision.items];
        newItems[index] = { ...newItems[index], [field]: val };
        setData({ ...data, visionMission: { ...data.visionMission, vision: { ...data.visionMission.vision, items: newItems } } });
    };

    const updateAchievement = (index: number, field: string, val: string) => {
        const newList = [...data.achievements];
        newList[index] = { ...newList[index], [field]: val };
        setData({ ...data, achievements: newList });
    };

    const addAchievement = () => {
        const newAch = { year: new Date().getFullYear().toString(), title: "Yeni Ödül", description: "Açıklama...", icon: "trophy" };
        setData({ ...data, achievements: [newAch, ...data.achievements] });
    };

    const removeAchievement = (index: number) => {
        if (!confirm("Bu başarıyı silmek istediğinize emin misiniz?")) return;
        const newList = data.achievements.filter((_: any, i: number) => i !== index);
        setData({ ...data, achievements: newList });
    };

    return (
        <div className="space-y-12 pb-20">
            {/* Sticky Header */}
            <div className="flex justify-between items-center bg-white p-6 rounded-xl border border-gray-200 shadow-sm sticky top-24 z-10 transition-all">
                <h3 className="font-bold text-lg text-gray-800">Ana Sayfa İçerik Yönetimi</h3>
                <button
                    onClick={handleSave}
                    disabled={loading}
                    className="bg-purple-900 text-white px-6 py-2 rounded-lg font-bold hover:bg-purple-950 transition-colors shadow-lg disabled:opacity-50 flex items-center gap-2"
                >
                    <span className="material-symbols-outlined">save</span>
                    {loading ? 'Kaydediliyor...' : 'Kaydet'}
                </button>
            </div>

            {/* MİSYON */}
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <h4 className="font-bold text-gray-800 mb-6 border-b pb-2 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">target</span>
                    Misyon Bölümü
                </h4>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Misyon Metni</label>
                        <textarea
                            className="w-full border rounded-lg p-3 text-sm h-24 focus:ring-2 focus:ring-purple-500/20 outline-none"
                            value={data.visionMission?.mission?.text || ''}
                            onChange={e => updateMission('text', e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">İmza (Alt Metin)</label>
                        <input
                            className="w-full border rounded-lg p-3 text-sm focus:ring-2 focus:ring-purple-500/20 outline-none"
                            value={data.visionMission?.mission?.author || ''}
                            onChange={e => updateMission('author', e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* VİZYON */}
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <h4 className="font-bold text-gray-800 mb-6 border-b pb-2 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">visibility</span>
                    Vizyon Maddeleri
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {data.visionMission?.vision?.items?.map((item: any, i: number) => (
                        <div key={i} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <div className="mb-2">
                                <label className="text-xs font-bold text-gray-500 uppercase">Başlık</label>
                                <input
                                    className="w-full border rounded p-2 text-sm font-bold"
                                    value={item.title}
                                    onChange={e => updateVisionItem(i, 'title', e.target.value)}
                                />
                            </div>
                            <div className="mb-2">
                                <label className="text-xs font-bold text-gray-500 uppercase">İçerik</label>
                                <textarea
                                    className="w-full border rounded p-2 text-xs h-20"
                                    value={item.text}
                                    onChange={e => updateVisionItem(i, 'text', e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase">İkon (Material Symbol)</label>
                                <div className="flex items-center gap-2">
                                    <input
                                        className="flex-1 border rounded p-2 text-sm font-mono"
                                        value={item.icon}
                                        onChange={e => updateVisionItem(i, 'icon', e.target.value)}
                                    />
                                    <span className="material-symbols-outlined text-gray-600 bg-white p-1 rounded border">{item.icon}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* BAŞARILAR */}
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <div className="flex justify-between items-center mb-6 border-b pb-2">
                    <h4 className="font-bold text-gray-800 flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">trophy</span>
                        Başarılar & Ödüller
                    </h4>
                    <button onClick={addAchievement} className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1.5 rounded-lg transition-colors font-bold">
                        + Yeni Ekle
                    </button>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    {data.achievements?.map((ach: any, i: number) => (
                        <div key={i} className="flex flex-col md:flex-row gap-4 items-start bg-gray-50 p-4 rounded-xl border border-gray-200 group relative">
                            <button
                                onClick={() => removeAchievement(i)}
                                className="absolute top-2 right-2 text-red-400 hover:text-red-600 p-1 hover:bg-red-50 rounded"
                                title="Sil"
                            >
                                <span className="material-symbols-outlined text-lg">delete</span>
                            </button>

                            <div className="w-full md:w-32 shrink-0">
                                <label className="text-[10px] font-bold text-gray-400 uppercase">Yıl</label>
                                <input
                                    className="w-full border rounded p-2 text-sm font-bold"
                                    value={ach.year}
                                    onChange={e => updateAchievement(i, 'year', e.target.value)}
                                />
                                <div className="mt-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase">İkon</label>
                                    <div className="flex items-center gap-1">
                                        <input
                                            className="w-full border rounded p-1 text-xs font-mono"
                                            value={ach.icon}
                                            onChange={e => updateAchievement(i, 'icon', e.target.value)}
                                        />
                                        <span className="material-symbols-outlined text-lg text-primary">{ach.icon}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 w-full space-y-2">
                                <div>
                                    <label className="text-[10px] font-bold text-gray-400 uppercase">Ödül Başlığı</label>
                                    <input
                                        className="w-full border rounded p-2 text-sm font-bold text-gray-800"
                                        value={ach.title}
                                        onChange={e => updateAchievement(i, 'title', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-gray-400 uppercase">Açıklama</label>
                                    <textarea
                                        className="w-full border rounded p-2 text-sm text-gray-600 h-16 resize-none"
                                        value={ach.description}
                                        onChange={e => updateAchievement(i, 'description', e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                    {data.achievements?.length === 0 && <p className="text-gray-500 italic text-sm p-4">Listed başarı bulunmuyor.</p>}
                </div>
            </div>
        </div>
    );
}

// --- KULLANICI YÖNETİMİ ---
function UsersTab() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    // Form States
    const [editingUser, setEditingUser] = useState<any>(null);
    const [formData, setFormData] = useState({ username: '', password: '', name: '', email: '', role: 'manager', scope: 'all' });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = () => {
        fetch(`${API_BASE_URL}/api/users`)
            .then(res => res.json())
            .then(d => setUsers(d))
            .catch(console.error);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const method = editingUser ? 'PUT' : 'POST';
        const url = editingUser ? `${API_BASE_URL}/api/users/${editingUser.id}` : `${API_BASE_URL}/api/users`;

        const body: any = { ...formData };
        if (editingUser && !body.password) delete body.password;

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            const result = await res.json();

            if (res.ok) {
                alert(editingUser ? "Kullanıcı güncellendi!" : "Kullanıcı oluşturuldu!");
                fetchUsers();
                resetForm();
            } else {
                alert(result.message || "İşlem başarısız.");
            }
        } catch (e) {
            console.error(e);
            alert("Sunucu hatası.");
        }
        setLoading(false);
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Kullanıcıyı silmek istediğinize emin misiniz?')) return;
        try {
            await fetch(`${API_BASE_URL}/api/users/${id}`, { method: 'DELETE' });
            fetchUsers();
        } catch (e) { console.error(e); }
    };

    const handleEdit = (user: any) => {
        setEditingUser(user);
        setFormData({
            username: user.username,
            password: '',
            name: user.name,
            email: user.email || '',
            role: user.role,
            scope: user.scope
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const resetForm = () => {
        setEditingUser(null);
        setFormData({ username: '', password: '', name: '', email: '', role: 'manager', scope: 'all' });
    };

    return (
        <div className="space-y-8 pb-20">
            <h3 className="text-xl font-bold border-b pb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-gray-400">manage_accounts</span>
                Kullanıcı Yönetimi
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* LİSTE */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                        <h2 className="font-bold text-gray-800 text-lg">Kullanıcı Listesi ({users.length})</h2>
                        <button onClick={fetchUsers} className="text-gray-500 hover:text-blue-600 transition-colors" title="Yenile">
                            <span className="material-symbols-outlined">refresh</span>
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-white text-gray-500 uppercase font-bold text-xs border-b">
                                <tr>
                                    <th className="px-6 py-4">Kullanıcı</th>
                                    <th className="px-6 py-4">Rol</th>
                                    <th className="px-6 py-4">Kapsam</th>
                                    <th className="px-6 py-4 text-right">İşlem</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {users.map(u => (
                                    <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-gray-800">{u.name || u.username}</div>
                                            <div className="text-gray-400 text-xs text-nowrap">@{u.username}</div>
                                            {u.email && <div className="text-blue-500 text-[10px] mt-0.5">{u.email}</div>}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${u.role === 'super' || u.role === 'superadmin' ? 'bg-purple-100 text-purple-700' :
                                                u.role === 'hr' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                                                }`}>
                                                {u.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 font-medium text-xs">
                                            {u.scope === 'all' ? 'Tüm Sistem' : <span className="capitalize">{u.scope}</span>}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-1">
                                                <button onClick={() => handleEdit(u)} className="p-2 text-blue-500 hover:bg-blue-50 rounded transition-colors" title="Düzenle">
                                                    <span className="material-symbols-outlined text-lg">edit</span>
                                                </button>
                                                {u.role !== 'super' && u.role !== 'superadmin' && (
                                                    <button onClick={() => handleDelete(u.id)} className="p-2 text-red-500 hover:bg-red-50 rounded transition-colors" title="Sil">
                                                        <span className="material-symbols-outlined text-lg">delete</span>
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* FORM */}
                <div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 sticky top-24">
                        <div className="flex justify-between items-center mb-6 pb-4 border-b">
                            <h3 className="font-bold text-gray-800 border-l-4 border-yellow-400 pl-3">
                                {editingUser ? 'Kullanıcı Düzenle' : 'Yeni Kullanıcı'}
                            </h3>
                            {editingUser && (
                                <button onClick={resetForm} className="text-xs text-red-500 hover:underline font-bold">VAZGEÇ</button>
                            )}
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Ad Soyad</label>
                                <input required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-yellow-400 outline-none"
                                    value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="Örn: Ahmet Yılmaz" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Kullanıcı Adı</label>
                                <input required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-yellow-400 outline-none"
                                    value={formData.username} onChange={e => setFormData({ ...formData, username: e.target.value })} placeholder="ahmet123" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">E-posta</label>
                                <input type="email" required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-yellow-400 outline-none"
                                    value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} placeholder="mail@derya.com" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Şifre {editingUser && '(Opsiyonel)'}</label>
                                <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-yellow-400 outline-none"
                                    type="password"
                                    value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })}
                                    required={!editingUser} placeholder="******" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Rol</label>
                                    <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
                                        value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })}>
                                        <option value="manager">Manager</option>
                                        <option value="hr">HR</option>
                                        <option value="super">Super Admin</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Kapsam</label>
                                    <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
                                        value={formData.scope} onChange={e => setFormData({ ...formData, scope: e.target.value })}>
                                        <option value="all">Tümü</option>
                                        <option value="otomotiv">Otomotiv</option>
                                        <option value="insaat">İnşaat</option>
                                        <option value="sigorta">Sigorta</option>
                                        <option value="elektronik">Elektronik</option>
                                        <option value="bilisim">Bilişim</option>
                                        <option value="chefmezze">Chef Mezze</option>
                                        <option value="yapi">Yapı</option>
                                        <option value="tasarim">Tasarım</option>
                                        <option value="marble">Marble</option>
                                    </select>
                                </div>
                            </div>
                            <button type="submit" disabled={loading} className={`w-full font-bold text-white py-3 rounded-lg mt-2 transition-colors shadow-lg ${editingUser ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-900 hover:bg-black'}`}>
                                {loading ? 'İşleniyor...' : (editingUser ? 'Bilgileri Güncelle' : 'Kullanıcı Oluştur')}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

function OverviewTab() {
    return (
        <div className="space-y-8 animate-fade-in pb-10">
            <div className="bg-gradient-to-r from-gray-900 to-blue-900 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
                <div className="relative z-10 max-w-3xl">
                    <h2 className="text-3xl font-bold mb-3">Yönetim Paneline Hoş Geldiniz</h2>
                    <p className="text-blue-100 text-lg font-light">
                        Tüm operasyonel süreçlerinizi buradan yönetebilirsiniz.
                    </p>
                </div>
                <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
            </div>
        </div>
    );
}

// --- REPORTS TAB ---
function ReportsTab() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        fetch(`${API_BASE_URL}/api/analytics/report`)
            .then(res => res.json())
            .then(d => {
                setData(d);
                setLoading(false);
            })
            .catch(e => {
                console.error(e);
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="p-10 text-center"><span className="material-symbols-outlined animate-spin text-4xl text-gray-300">progress_activity</span></div>;
    if (!data) return <div className="p-10 text-center">Veri alınamadı.</div>;

    const { summary, graph, topPages, topActions, devices, topLocations } = data;

    // Basit Bar Chart (SVG veya CSS)
    const maxGraphVal = Math.max(...graph.map((g: any) => g.count), 1);

    return (
        <div className="space-y-8 animate-fadeIn">
            {/* Header */}
            <div className="bg-gradient-to-r from-teal-800 to-teal-600 p-8 rounded-2xl text-white shadow-xl relative overflow-hidden">
                <div className="relative z-10">
                    <h2 className="text-3xl font-bold mb-2">Analiz Raporları</h2>
                    <p className="text-teal-100">Ziyaretçi trafiği, kullanıcı davranışları ve demografik veriler.</p>
                </div>
                <span className="material-symbols-outlined absolute right-0 bottom-0 text-[150px] text-white/10 -rotate-12 translate-x-10 translate-y-10">monitoring</span>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                        <span className="material-symbols-outlined text-3xl">visibility</span>
                    </div>
                    <div>
                        <span className="block text-gray-500 text-xs font-bold uppercase tracking-wider">Toplam Görüntülenme</span>
                        <span className="text-3xl font-bold text-gray-800">{summary.totalVisits}</span>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-green-50 text-green-600 flex items-center justify-center">
                        <span className="material-symbols-outlined text-3xl">today</span>
                    </div>
                    <div>
                        <span className="block text-gray-500 text-xs font-bold uppercase tracking-wider">Bugünkü Ziyaretçi</span>
                        <span className="text-3xl font-bold text-gray-800">{summary.dailyVisits}</span>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center">
                        <span className="material-symbols-outlined text-3xl">group</span>
                    </div>
                    <div>
                        <span className="block text-gray-500 text-xs font-bold uppercase tracking-wider">Anlık Aktif (Tahmini)</span>
                        <span className="text-3xl font-bold text-gray-800">{summary.activeUsers}</span>
                        <span className="text-xs text-gray-400 ml-2">(Son 1 saat)</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Traffic Graph */}
                <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-100 shadow-sm max-h-[400px]">
                    <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                        <span className="material-symbols-outlined text-gray-400">bar_chart</span>
                        Saatlik Trafik (Son 24 Saat)
                    </h3>
                    <div className="h-48 flex items-end justify-between gap-1 overflow-x-auto pb-2 px-2">
                        {graph.map((item: any, i: number) => (
                            <div key={i} className="flex flex-col items-center gap-2 group w-full min-w-[20px]">
                                <div
                                    className="w-full bg-teal-500 rounded-t-sm hover:bg-teal-600 transition-all relative group-hover:scale-110 origin-bottom"
                                    style={{ height: `${(item.count / maxGraphVal) * 100}%`, minHeight: '4px' }}
                                >
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                                        {item.count} Via
                                    </div>
                                </div>
                                <span className="text-[10px] text-gray-400 rotate-0 whitespace-nowrap">{item.name}</span>
                            </div>
                        ))}
                        {graph.length === 0 && <div className="w-full h-full flex items-center justify-center text-gray-400">Veri yok</div>}
                    </div>
                </div>

                {/* Devices */}
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                        <span className="material-symbols-outlined text-gray-400">devices</span>
                        Cihaz Dağılımı
                    </h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-gray-600">smartphone</span>
                                <span className="font-bold text-gray-700">Mobil</span>
                            </div>
                            <span className="font-bold text-lg">{devices.Mobile}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-gray-600">computer</span>
                                <span className="font-bold text-gray-700">Masaüstü</span>
                            </div>
                            <span className="font-bold text-lg">{devices.Desktop}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-gray-600">help</span>
                                <span className="font-bold text-gray-700">Diğer</span>
                            </div>
                            <span className="font-bold text-lg">{devices.Other}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Top Pages */}
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                        <span className="material-symbols-outlined text-teal-600">pages</span>
                        En Çok Gezilen Sayfalar
                    </h3>
                    <div className="overflow-hidden rounded-lg border border-gray-100">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold text-left">
                                <tr>
                                    <th className="px-4 py-3">Sayfa</th>
                                    <th className="px-4 py-3 text-right">Görüntülenme</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {topPages.map((p: any, i: number) => (
                                    <tr key={i} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 font-medium text-teal-700 truncate max-w-[200px]">{p.path}</td>
                                        <td className="px-4 py-3 text-right font-bold text-gray-700">{p.count}</td>
                                    </tr>
                                ))}
                                {topPages.length === 0 && <tr><td colSpan={2} className="p-4 text-center text-gray-400">Veri yok</td></tr>}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Locations */}
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                        <span className="material-symbols-outlined text-red-500">public</span>
                        Ziyaretçi Konumları
                    </h3>
                    <div className="overflow-hidden rounded-lg border border-gray-100">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold text-left">
                                <tr>
                                    <th className="px-4 py-3">Şehir / Bölge</th>
                                    <th className="px-4 py-3 text-right">Ziyaret</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {topLocations.map((l: any, i: number) => (
                                    <tr key={i} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 font-medium text-gray-700">{l.city}</td>
                                        <td className="px-4 py-3 text-right font-bold text-gray-700">{l.count}</td>
                                    </tr>
                                ))}
                                {topLocations.length === 0 && <tr><td colSpan={2} className="p-4 text-center text-gray-400">Konum verisi henüz toplanmadı</td></tr>}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Actions / Clicks */}
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-purple-500">touch_app</span>
                    En Çok Tıklanan Alanlar (Aksiyonlar)
                </h3>
                <div className="flex flex-wrap gap-2">
                    {topActions.map((a: any, i: number) => (
                        <div key={i} className="px-3 py-1.5 bg-purple-50 text-purple-700 rounded-lg text-sm font-medium border border-purple-100 flex items-center gap-2">
                            <span>{a.action}</span>
                            <span className="bg-purple-200 px-1.5 rounded text-xs font-bold text-purple-800">{a.count}</span>
                        </div>
                    ))}
                    {topActions.length === 0 && <span className="text-gray-400 italic">Henüz etkileşim verisi yok.</span>}
                </div>
            </div>
        </div>
    );
}




