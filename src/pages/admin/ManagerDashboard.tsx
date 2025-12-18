
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface Brand {
    id: number;
    name: string;
    logoText: string;
    description: string;
    tags: string[];
    url: string;
    logoPath?: string;
}

interface Service {
    id: number;
    title: string;
    desc: string;
    icon: string;
    image: string;
}

interface Award {
    id: number;
    year: string;
    title: string;
    desc: string;
    icon: string;
    color: string;
}

interface CompanyInfo {
    title: string;
    heroTitle: string;
    heroSubtitle: string;
    description: string;
    heroImage: string;
    logoPath?: string;
    services?: Service[];
    awards?: Award[];
    contact?: {
        phone: string;
        address: string;
        website: string;
        buttonText?: string;
    };
}

export default function ManagerDashboard() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const [brands, setBrands] = useState<Brand[]>([]);
    const [companyInfo, setCompanyInfo] = useState<CompanyInfo>({
        title: '',
        heroTitle: '',
        heroSubtitle: '',
        description: '',
        heroImage: '',
        services: [],
        awards: []
    });

    // Form States
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [newBrand, setNewBrand] = useState({ name: '', logoText: '', description: '', url: '', tags: '' });

    const [newService, setNewService] = useState<Service>({ id: 0, title: '', desc: '', icon: 'star', image: '' });
    const [newAward, setNewAward] = useState<Award>({ id: 0, year: '2023', title: '', desc: '', icon: 'emoji_events', color: 'yellow' });

    const [activeTab, setActiveTab] = useState<'info' | 'brands' | 'services' | 'awards'>('info');

    // Admin User Info
    const adminUser = JSON.parse(localStorage.getItem('adminUser') || '{}');

    // Scope Belirleme: URL parametresi öncelikli, yoksa kullanıcı scope'u.
    // Eğer kullanıcı 'super' ise ve URL'de scope yoksa varsayılan 'otomotiv' olsun (hata vermemesi için).
    const urlScope = searchParams.get('scope');
    const scope = urlScope || (adminUser.scope === 'all' ? 'otomotiv' : adminUser.scope);

    useEffect(() => {
        if (!adminUser.username || (adminUser.role !== 'manager' && adminUser.role !== 'super')) {
            navigate('/admin/login');
            return;
        }

        fetchCompanyData();
    }, [scope]);

    const fetchCompanyData = () => {
        fetch(`http://localhost:3003/api/company-content/${scope}`)
            .then(res => res.json())
            .then(data => {
                setCompanyInfo(data);
                setBrands(data.brands || []);
            })
            .catch(err => {
                console.error(err);
                alert("Veriler yüklenirken hata oluştu! Sunucunun çalıştığından emin olun.");
            });
    };

    // --- BRAND OPERATIONS ---
    const handleBrandSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', newBrand.name);
        formData.append('logoText', newBrand.logoText);
        formData.append('description', newBrand.description);
        formData.append('url', newBrand.url);
        formData.append('tags', newBrand.tags);

        if (logoFile) {
            formData.append('logo', logoFile);
        }

        try {
            let url = `http://localhost:3003/api/company-content/${scope}/brand`;
            let method = 'POST';

            if (editingId) {
                url = `http://localhost:3003/api/company-content/${scope}/brand/${editingId}`;
                method = 'PUT';
            }

            const res = await fetch(url, {
                method: method,
                body: formData
            });

            if (res.ok) {
                fetchCompanyData();
                setNewBrand({ name: '', logoText: '', description: '', url: '', tags: '' });
                setLogoFile(null);
                setEditingId(null);
                alert(editingId ? "Marka güncellendi!" : "Marka eklendi!");
            }
        } catch (error) {
            console.error(error);
            alert("Bir hata oluştu.");
        }
    };

    const handleEditBrand = (brand: Brand) => {
        setNewBrand({
            name: brand.name,
            logoText: brand.logoText,
            description: brand.description,
            url: brand.url,
            tags: brand.tags.join(', ')
        });
        setEditingId(brand.id);
        setActiveTab('brands');
    };

    const deleteBrand = async (id: number) => {
        if (!confirm("Markayı silmek istediğinize emin misiniz?")) return;
        // Backend delete endpoint olmadığı için (şimdilik) simüle ediyoruz veya ekleyebiliriz.
        // Ama kullanıcı istememiş, sadece düzenleme istemiş. Biz yine de API'yi tam yapmalıyız.
        // Hızlı çözüm: Mevcut API delete desteklemiyor olabilir, bu adımı atlıyorum veya JSON'dan siliyorum.
        // Şimdilik sadece frontend'den filtreleyip update atalım (tehlikeli ama hızlı)
        // Veya backend'e DELETE endpoint ekletmek gerek.
        // Basitlik adina: Şimdilik silme butonu koymuyorum veya sadece UI'dan kaldırıyorum.
    };

    // --- INFO OPERATIONS ---
    const handleInfoUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        // Sadece info alanlarını gönder, brands/services/awards'ı koru (backend zaten merge ediyor mu? Evet)
        try {
            const res = await fetch(`http://localhost:3003/api/company-content/${scope}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(companyInfo)
            });
            if (res.ok) alert("Bilgiler güncellendi!");
        } catch (error) {
            console.error(error);
        }
    };

    const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('http://localhost:3003/api/upload', {
                method: 'POST',
                body: formData
            });
            const data = await res.json();
            if (data.success) {
                setCompanyInfo(prev => ({ ...prev, logoPath: data.filePath }));
            } else {
                alert('Yükleme başarısız: ' + data.message);
            }
        } catch (err) {
            console.error(err);
            alert('Yükleme sırasında hata oluştu.');
        }
    };

    // --- SERVICE OPERATIONS ---
    const handleServiceAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        const updatedServices = [...(companyInfo.services || [])];
        if (newService.id !== 0) {
            // Edit
            const index = updatedServices.findIndex(s => s.id === newService.id);
            updatedServices[index] = newService;
        } else {
            // Add
            updatedServices.push({ ...newService, id: Date.now() });
        }

        // Update via API
        updateFullCompanyData({ ...companyInfo, services: updatedServices });
        setNewService({ id: 0, title: '', desc: '', icon: 'star', image: '' });
    };

    const deleteService = (id: number) => {
        if (!confirm("Hizmeti silmek istiyor musunuz?")) return;
        const updatedServices = (companyInfo.services || []).filter(s => s.id !== id);
        updateFullCompanyData({ ...companyInfo, services: updatedServices });
    }

    // --- AWARD OPERATIONS ---
    const handleAwardAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        const updatedAwards = [...(companyInfo.awards || [])];
        if (newAward.id !== 0) {
            // Edit
            const index = updatedAwards.findIndex(a => a.id === newAward.id);
            updatedAwards[index] = newAward;
        } else {
            updatedAwards.push({ ...newAward, id: Date.now() });
        }

        updateFullCompanyData({ ...companyInfo, awards: updatedAwards });
        setNewAward({ id: 0, year: '', title: '', desc: '', icon: 'emoji_events', color: 'yellow' });
    };

    const deleteAward = (id: number) => {
        if (!confirm("Ödülü silmek istiyor musunuz?")) return;
        const updatedAwards = (companyInfo.awards || []).filter(a => a.id !== id);
        updateFullCompanyData({ ...companyInfo, awards: updatedAwards });
    }

    // Generic Update
    const updateFullCompanyData = async (newData: CompanyInfo) => {
        setCompanyInfo(newData); // Optimistic UI
        try {
            await fetch(`http://localhost:3003/api/company-content/${scope}`, {
                method: 'POST', // Backend bu endpointte içeriği merge'liyorsa sorun yok.
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newData)
            });
        } catch (err) {
            console.error(err);
            alert("Kaydedilemedi!");
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Yönetim Paneli</h1>
                        <p className="text-gray-500">
                            Yönetilen Şirket: <span className="font-bold text-blue-600 uppercase">{scope}</span>
                        </p>
                    </div>
                    <div className="flex gap-4">
                        {adminUser.role === 'super' && (
                            <button onClick={() => navigate('/admin/super')} className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900">
                                Süper Admin'e Dön
                            </button>
                        )}
                        <button onClick={() => { localStorage.removeItem('adminUser'); navigate('/admin/login'); }} className="text-red-600 hover:text-red-700 font-medium">
                            Çıkış Yap
                        </button>
                    </div>
                </div>

                {/* TABS */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
                    <div className="flex border-b border-gray-200">
                        <button onClick={() => setActiveTab('info')} className={`flex-1 py-4 text-center font-medium transition-colors ${activeTab === 'info' ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:bg-gray-50'}`}>
                            Genel Bilgiler
                        </button>
                        <button onClick={() => setActiveTab('brands')} className={`flex-1 py-4 text-center font-medium transition-colors ${activeTab === 'brands' ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:bg-gray-50'}`}>
                            Markalar
                        </button>
                        <button onClick={() => setActiveTab('services')} className={`flex-1 py-4 text-center font-medium transition-colors ${activeTab === 'services' ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:bg-gray-50'}`}>
                            Faaliyet Alanları
                        </button>
                        <button onClick={() => setActiveTab('awards')} className={`flex-1 py-4 text-center font-medium transition-colors ${activeTab === 'awards' ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:bg-gray-50'}`}>
                            Başarılar ve Ödüller
                        </button>
                    </div>

                    <div className="p-8">
                        {/* TAB 1: INFO */}
                        {activeTab === 'info' && (
                            <form onSubmit={handleInfoUpdate} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Şirket Adı</label>
                                        <input type="text" className="w-full border rounded-lg p-2" value={companyInfo.title} onChange={e => setCompanyInfo({ ...companyInfo, title: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Şirket Logosu</label>
                                        <div className="flex items-center gap-2">
                                            <input type="file" accept="image/*" onChange={handleLogoUpload} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                                            {companyInfo.logoPath && (
                                                <img src={`http://localhost:3003/uploads/${companyInfo.logoPath}`} className="h-10 w-10 object-contain border rounded" alt="Logo" />
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Hero Resim URL</label>
                                        <input type="text" className="w-full border rounded-lg p-2" value={companyInfo.heroImage} onChange={e => setCompanyInfo({ ...companyInfo, heroImage: e.target.value })} />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Hero Başlık</label>
                                        <input type="text" className="w-full border rounded-lg p-2" value={companyInfo.heroTitle} onChange={e => setCompanyInfo({ ...companyInfo, heroTitle: e.target.value })} />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Hero Alt Başlık</label>
                                        <input type="text" className="w-full border rounded-lg p-2" value={companyInfo.heroSubtitle} onChange={e => setCompanyInfo({ ...companyInfo, heroSubtitle: e.target.value })} />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Hakkımızda Metni</label>
                                        <div className="bg-white">
                                            <ReactQuill
                                                theme="snow"
                                                value={companyInfo.description}
                                                onChange={val => setCompanyInfo({ ...companyInfo, description: val })}
                                                className="h-64 mb-12"
                                            />
                                        </div>
                                    </div>

                                    {/* YENİ: İLETİŞİM BİLGİLERİ */}
                                    <div className="md:col-span-2 mt-2 border-t pt-6">
                                        <h4 className="font-bold text-gray-900 mb-4 bg-yellow-50 p-2 rounded block w-full">İletişim ve Kart Bilgileri (Hero Altı)</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
                                                <input type="text" className="w-full border rounded-lg p-2" value={companyInfo.contact?.phone || ''} onChange={e => setCompanyInfo({ ...companyInfo, contact: { ...companyInfo.contact, phone: e.target.value } as any })} placeholder="+90 ..." />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Web Sitesi (Görünen ve Link)</label>
                                                <input type="text" className="w-full border rounded-lg p-2" value={companyInfo.contact?.website || ''} onChange={e => setCompanyInfo({ ...companyInfo, contact: { ...companyInfo.contact, website: e.target.value } as any })} placeholder="www.ornek.com" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Adres (Özet Konum)</label>
                                                <input type="text" className="w-full border rounded-lg p-2" value={companyInfo.contact?.address || ''} onChange={e => setCompanyInfo({ ...companyInfo, contact: { ...companyInfo.contact, address: e.target.value } as any })} placeholder="Derya Plaza, Kat: 2" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Buton Metni</label>
                                                <input type="text" className="w-full border rounded-lg p-2" value={companyInfo.contact?.buttonText || ''} onChange={e => setCompanyInfo({ ...companyInfo, contact: { ...companyInfo.contact, buttonText: e.target.value } as any })} placeholder="Randevu Al / İletişime Geç" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">Bilgileri Güncelle</button>
                            </form>
                        )}

                        {/* TAB 2: BRANDS */}
                        {activeTab === 'brands' && (
                            <div>
                                <h3 className="text-lg font-bold mb-4">{editingId ? 'Marka Düzenle' : 'Yeni Marka Ekle'}</h3>
                                <form onSubmit={handleBrandSubmit} className="bg-gray-50 p-6 rounded-xl border border-gray-200 mb-8 space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <input placeholder="Marka Adı" className="border p-2 rounded" value={newBrand.name} onChange={e => setNewBrand({ ...newBrand, name: e.target.value })} required />
                                        <input placeholder="Logo Metni (Resim yoksa görünür)" className="border p-2 rounded" value={newBrand.logoText} onChange={e => setNewBrand({ ...newBrand, logoText: e.target.value })} required />
                                        <input placeholder="Web Sitesi" className="border p-2 rounded" value={newBrand.url} onChange={e => setNewBrand({ ...newBrand, url: e.target.value })} />
                                        <input placeholder="Etiketler (virgülle ayırın)" className="border p-2 rounded" value={newBrand.tags} onChange={e => setNewBrand({ ...newBrand, tags: e.target.value })} />
                                        <div className="col-span-2">
                                            <label className="block text-sm text-gray-700 mb-1">Logo Yükle (400x200px önerilir)</label>
                                            <input type="file" accept="image/*" onChange={e => setLogoFile(e.target.files ? e.target.files[0] : null)} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                                        </div>
                                        <textarea placeholder="Açıklama" className="col-span-2 border p-2 rounded" rows={3} value={newBrand.description} onChange={e => setNewBrand({ ...newBrand, description: e.target.value })} />
                                    </div>
                                    <div className="flex gap-2">
                                        <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700">{editingId ? 'Güncelle' : 'Ekle'}</button>
                                        {editingId && <button type="button" onClick={() => { setEditingId(null); setNewBrand({ name: '', logoText: '', description: '', url: '', tags: '' }); }} className="bg-gray-400 text-white px-4 py-2 rounded-lg">İptal</button>}
                                    </div>
                                </form>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {brands.map(brand => (
                                        <div key={brand.id} className="border p-4 rounded-xl flex flex-col justify-between bg-white relative group">
                                            <div className="absolute top-2 right-2 hidden group-hover:flex gap-2">
                                                <button onClick={() => handleEditBrand(brand)} className="bg-blue-100 text-blue-600 p-1 rounded-md"><span className="material-symbols-outlined text-sm">edit</span></button>
                                            </div>
                                            <div className="h-20 flex items-center justify-center bg-gray-50 rounded-lg mb-3">
                                                {brand.logoPath ? (
                                                    <img src={`http://localhost:3003/uploads/${brand.logoPath}`} className="max-h-16 max-w-full object-contain" alt={brand.name} />
                                                ) : (
                                                    <span className="font-bold text-gray-400">{brand.logoText}</span>
                                                )}
                                            </div>
                                            <h4 className="font-bold">{brand.name}</h4>
                                            <p className="text-sm text-gray-500 line-clamp-2">{brand.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* TAB 3: SERVICES */}
                        {activeTab === 'services' && (
                            <div>
                                <h3 className="text-lg font-bold mb-4">{newService.id !== 0 ? 'Hizmet Düzenle' : 'Yeni Hizmet Ekle'}</h3>
                                <form onSubmit={handleServiceAdd} className="bg-gray-50 p-6 rounded-xl border border-gray-200 mb-8 space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <input placeholder="Hizmet Başlığı" className="border p-2 rounded" value={newService.title} onChange={e => setNewService({ ...newService, title: e.target.value })} required />
                                        <input placeholder="İkon Kodu (örn. directions_car)" className="border p-2 rounded" value={newService.icon} onChange={e => setNewService({ ...newService, icon: e.target.value })} />
                                        <input placeholder="Resim URL (Opsiyonel)" className="col-span-2 border p-2 rounded" value={newService.image} onChange={e => setNewService({ ...newService, image: e.target.value })} />
                                        <textarea placeholder="Kısa Açıklama" className="col-span-2 border p-2 rounded" rows={2} value={newService.desc} onChange={e => setNewService({ ...newService, desc: e.target.value })} required />
                                    </div>
                                    <div className="flex gap-2">
                                        <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700">{newService.id !== 0 ? 'Güncelle' : 'Ekle'}</button>
                                        {newService.id !== 0 && <button type="button" onClick={() => setNewService({ id: 0, title: '', desc: '', icon: 'star', image: '' })} className="bg-gray-400 text-white px-4 py-2 rounded-lg">İptal</button>}
                                    </div>
                                </form>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {companyInfo.services?.map(service => (
                                        <div key={service.id} className="border p-4 rounded-xl flex gap-4 items-start bg-white relative group">
                                            <div className="absolute top-2 right-2 hidden group-hover:flex gap-2">
                                                <button onClick={() => setNewService(service)} className="bg-blue-100 text-blue-600 p-1 rounded-md"><span className="material-symbols-outlined text-sm">edit</span></button>
                                                <button onClick={() => deleteService(service.id)} className="bg-red-100 text-red-600 p-1 rounded-md"><span className="material-symbols-outlined text-sm">delete</span></button>
                                            </div>
                                            <span className="material-symbols-outlined text-3xl text-blue-600">{service.icon}</span>
                                            <div>
                                                <h4 className="font-bold">{service.title}</h4>
                                                <p className="text-sm text-gray-500">{service.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* TAB 4: AWARDS */}
                        {activeTab === 'awards' && (
                            <div>
                                <h3 className="text-lg font-bold mb-4">{newAward.id !== 0 ? 'Ödül Düzenle' : 'Yeni Ödül Ekle'}</h3>
                                <form onSubmit={handleAwardAdd} className="bg-gray-50 p-6 rounded-xl border border-gray-200 mb-8 space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <input placeholder="Yıl" className="border p-2 rounded" value={newAward.year} onChange={e => setNewAward({ ...newAward, year: e.target.value })} required />
                                        <input placeholder="Ödül Adı" className="col-span-2 border p-2 rounded" value={newAward.title} onChange={e => setNewAward({ ...newAward, title: e.target.value })} required />
                                        <select className="border p-2 rounded" value={newAward.color} onChange={e => setNewAward({ ...newAward, color: e.target.value })}>
                                            <option value="yellow">Sarı (Altın)</option>
                                            <option value="blue">Mavi</option>
                                            <option value="green">Yeşil</option>
                                            <option value="purple">Mor</option>
                                        </select>
                                        <input placeholder="İkon (emoji_events, verified vb.)" className="border p-2 rounded" value={newAward.icon} onChange={e => setNewAward({ ...newAward, icon: e.target.value })} />
                                        <textarea placeholder="Açıklama" className="col-span-3 border p-2 rounded" rows={2} value={newAward.desc} onChange={e => setNewAward({ ...newAward, desc: e.target.value })} />
                                    </div>
                                    <div className="flex gap-2">
                                        <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700">{newAward.id !== 0 ? 'Güncelle' : 'Ekle'}</button>
                                        {newAward.id !== 0 && <button type="button" onClick={() => setNewAward({ id: 0, year: '', title: '', desc: '', icon: 'emoji_events', color: 'yellow' })} className="bg-gray-400 text-white px-4 py-2 rounded-lg">İptal</button>}
                                    </div>
                                </form>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {companyInfo.awards?.map(award => (
                                        <div key={award.id} className="border p-4 rounded-xl relative group bg-white">
                                            <div className="absolute top-2 right-2 hidden group-hover:flex gap-2">
                                                <button onClick={() => setNewAward(award)} className="bg-blue-100 text-blue-600 p-1 rounded-md"><span className="material-symbols-outlined text-sm">edit</span></button>
                                                <button onClick={() => deleteAward(award.id)} className="bg-red-100 text-red-600 p-1 rounded-md"><span className="material-symbols-outlined text-sm">delete</span></button>
                                            </div>
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 bg-${award.color}-100 text-${award.color}-600`}>
                                                <span className="material-symbols-outlined">{award.icon}</span>
                                            </div>
                                            <div className="text-xs font-bold text-gray-400">{award.year}</div>
                                            <h4 className="font-bold">{award.title}</h4>
                                            <p className="text-xs text-gray-500">{award.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
}
