
import { useEffect, useState } from 'react';
import { API_BASE_URL } from '../../config';
import { useNavigate } from 'react-router-dom';

interface User {
    id: number;
    username: string;
    name: string;
    role: 'super' | 'hr' | 'manager';
    scope: string;
    password?: string;
}

export default function SuperAdminDashboard() {
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [users, setUsers] = useState<User[]>([]);

    // Form States
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [formData, setFormData] = useState({ username: '', password: '', name: '', role: 'manager', scope: 'all' });

    useEffect(() => {
        const userData = localStorage.getItem('adminUser');
        if (!userData) {
            navigate('/admin/login');
            return;
        }
        const parsedUser = JSON.parse(userData);
        if (parsedUser.role !== 'super') {
            navigate('/admin/login');
            return;
        }
        setCurrentUser(parsedUser);
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/users`);
            const data = await res.json();
            setUsers(data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('adminUser');
        navigate('/admin/login');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const method = editingUser ? 'PUT' : 'POST';
        const url = editingUser
            ? `${API_BASE_URL}/api/users/${editingUser.id}`
            : `${API_BASE_URL}/api/users`;

        // Şifre boşsa gönderme (Update modunda)
        const body: any = { ...formData };
        if (editingUser && !body.password) delete body.password;

        await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        fetchUsers();
        resetForm();
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Kullanıcıyı silmek istediğinize emin misiniz?')) return;
        await fetch(`${API_BASE_URL}/api/users/${id}`, { method: 'DELETE' });
        fetchUsers();
    };

    const handleEdit = (user: User) => {
        setEditingUser(user);
        setFormData({
            username: user.username,
            password: '', // Güvenlik için şifre boş gelir, isterse değiştirir
            name: user.name,
            role: user.role,
            scope: user.scope
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const resetForm = () => {
        setEditingUser(null);
        setFormData({ username: '', password: '', name: '', role: 'manager', scope: 'all' });
    };

    // Navigasyon Yardımcıları
    const goToPanel = () => {
        // Super Admin olduğumuz için aslında diğer panellerin rotasına gidebiliriz ama
        // o sayfalar rol kontrolü yapıyor. Bu yüzden o sayfalardaki rol kontrolünü 
        // "role === 'super' || role === 'ilgili_rol'" şeklinde güncellememiz gerek.
        // Şimdilik sadece yönlendirme yapalım.
    };

    if (!currentUser) return <div>Yükleniyor...</div>;

    return (
        <div className="min-h-screen bg-gray-100 font-sans">
            {/* Navbar */}
            <nav className="bg-[#1a202c] text-white px-6 py-4 flex items-center justify-between sticky top-0 z-20 shadow-lg">
                <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-yellow-400 text-4xl">admin_panel_settings</span>
                    <div>
                        <h1 className="font-bold text-xl leading-none">Genel Yönetim Paneli</h1>
                        <span className="text-xs text-gray-400">Tüm sistem kontrolü</span>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-right hidden md:block">
                        <div className="font-bold">{currentUser.name}</div>
                        <div className="text-xs text-gray-400">Super Admin</div>
                    </div>
                    <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-sm font-bold transition-colors">
                        Çıkış
                    </button>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-6 py-8">

                {/* Hızlı Erişim Kartları */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                    {/* HR Link */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer group"
                        onClick={() => navigate('/admin/dashboard')}>
                        <div className="bg-blue-50 p-3 rounded-full text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                            <span className="material-symbols-outlined text-3xl">hr_resting</span>
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-800">İK Paneli</h3>
                            <p className="text-xs text-gray-500">Başvurular & İlanlar</p>
                        </div>
                    </div>

                    {/* Dynamic Manager Links */}
                    {[
                        { id: 'otomotiv', name: 'Otomotiv', icon: 'directions_car', color: 'orange' },
                        { id: 'insaat', name: 'İnşaat', icon: 'apartment', color: 'red' },
                        { id: 'sigorta', name: 'Sigorta', icon: 'security', color: 'purple' },
                        { id: 'elektronik', name: 'Elektronik', icon: 'memory', color: 'cyan' },
                        { id: 'bilisim', name: 'Bilişim', icon: 'laptop', color: 'indigo' },
                        { id: 'chefmezze', name: 'Chef Mezze', icon: 'restaurant', color: 'amber' },
                        { id: 'yapi', name: 'Yapı', icon: 'architecture', color: 'orange' },
                        { id: 'tasarim', name: 'Tasarım', icon: 'palette', color: 'pink' },
                        { id: 'marble', name: 'Marble', icon: 'diamond', color: 'teal' },
                    ].map(scope => (
                        <div key={scope.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer group"
                            onClick={() => navigate(`/admin/manager?scope=${scope.id}`)}>
                            <div className={`bg-${scope.color}-50 p-3 rounded-full text-${scope.color}-600 group-hover:bg-${scope.color}-600 group-hover:text-white transition-colors`}>
                                <span className="material-symbols-outlined text-3xl">{scope.icon}</span>
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-800">{scope.name}</h3>
                                <p className="text-xs text-gray-500">Manager Paneli</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* User List */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                                <h2 className="font-bold text-gray-800 text-lg">Kullanıcı Listesi ({users.length})</h2>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-gray-50 text-gray-500 uppercase font-bold text-xs">
                                        <tr>
                                            <th className="px-6 py-4">Kullanıcı</th>
                                            <th className="px-6 py-4">Rol</th>
                                            <th className="px-6 py-4">Sorumluluk</th>
                                            <th className="px-6 py-4 text-right">İşlemler</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {users.map(user => (
                                            <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="font-bold text-gray-800">{user.name}</div>
                                                    <div className="text-gray-400 text-xs">@{user.username}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${user.role === 'super' ? 'bg-purple-50 text-purple-600' :
                                                        user.role === 'hr' ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'
                                                        }`}>
                                                        {user.role}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-gray-600 font-medium">
                                                    {user.scope === 'all' ? 'Tüm Sistem' : user.scope}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <button onClick={() => handleEdit(user)} className="text-blue-500 hover:text-blue-700 mx-1">
                                                        <span className="material-symbols-outlined text-lg">edit</span>
                                                    </button>
                                                    {user.username !== 'super' && ( // Kendini silemez
                                                        <button onClick={() => handleDelete(user.id)} className="text-red-500 hover:text-red-700 mx-1">
                                                            <span className="material-symbols-outlined text-lg">delete</span>
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Add/Edit Form */}
                    <div>
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 sticky top-24">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-bold text-gray-800 border-l-4 border-yellow-400 pl-3">
                                    {editingUser ? 'Kullanıcı Düzenle' : 'Yeni Kullanıcı'}
                                </h3>
                                {editingUser && (
                                    <button onClick={resetForm} className="text-xs text-red-500 hover:underline">Vazgeç</button>
                                )}
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">Ad Soyad</label>
                                    <input required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-yellow-400 outline-none"
                                        value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="Örn: Ahmet Yılmaz" />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">Kullanıcı Adı</label>
                                    <input required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-yellow-400 outline-none"
                                        value={formData.username} onChange={e => setFormData({ ...formData, username: e.target.value })} placeholder="Örn: ahmet123" />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">Şifre {editingUser && '(Boş bırakılırsa değişmez)'}</label>
                                    <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-yellow-400 outline-none"
                                        type="password"
                                        value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })}
                                        required={!editingUser}
                                        placeholder="******" />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 mb-1">Rol</label>
                                        <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-yellow-400 outline-none bg-white"
                                            value={formData.role}
                                            // @ts-ignore
                                            onChange={e => setFormData({ ...formData, role: e.target.value })}>
                                            <option value="manager">Manager</option>
                                            <option value="hr">HR (İK)</option>
                                            <option value="super">Super Admin</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 mb-1">Kapsam (Scope)</label>
                                        <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-yellow-400 outline-none bg-white"
                                            value={formData.scope}
                                            // @ts-ignore
                                            onChange={e => setFormData({ ...formData, scope: e.target.value })}>
                                            <option value="all">Tümü (İK/Super)</option>
                                            <option value="otomotiv">Otomotiv</option>
                                            <option value="insaat">İnşaat</option>
                                            <option value="sigorta">Sigorta</option>
                                            <option value="elektronik">Elektronik</option>
                                            <option value="bilisim">Bilişim</option>
                                            <option value="chefmezze">Chef Mezze</option>
                                            <option value="yapi">Yapı</option>
                                            <option value="tasarim">Tasarım</option>
                                            <option value="marble">Marble (Mermer)</option>
                                        </select>
                                        <p className="text-[10px] text-gray-400 mt-1">Sadece Manager için bölüm seçin.</p>
                                    </div>
                                </div>

                                <button type="submit" className={`w-full font-bold text-white py-3 rounded-lg mt-2 transition-colors ${editingUser ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-900 hover:bg-black'}`}>
                                    {editingUser ? 'Güncelle' : 'Kullanıcı Oluştur'}
                                </button>
                            </form>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
