
import { useEffect, useState } from 'react';
import { API_BASE_URL } from '../../config';
import { useNavigate } from 'react-router-dom';

interface User {
    id: number;
    username: string;
    name: string;
    email?: string;
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
    const [formData, setFormData] = useState({ username: '', password: '', name: '', email: '', role: 'manager', scope: 'all' });

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
                            <h3 className="font-bold text-gray-800">Admin Paneli</h3>
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


            </div>
        </div>
    );
}
