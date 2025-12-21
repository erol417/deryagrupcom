import { useParams, useNavigate } from "react-router-dom"
import { API_BASE_URL } from '../config';
import { companies } from "../data/companies"
import { useEffect, useState } from "react"

interface Brand {
    id: number;
    name: string;
    logoText: string;
    description: string;
    tags: string[];
    url: string;
    logoPath?: string;
}

export default function CompanyBrands() {
    const { id } = useParams()
    const navigate = useNavigate()


    // @ts-ignore
    const staticCompany = companies[id || "otomotiv"];
    const [companyData, setCompanyData] = useState<any>(staticCompany);
    const [brands, setBrands] = useState<Brand[]>([]);

    useEffect(() => {
        window.scrollTo(0, 0);
        // ID değişince veya ilk açılışta statik veriyi resetle
        // @ts-ignore
        if (id && companies[id]) {
            // @ts-ignore
            setCompanyData(companies[id]);
        }

        if (id) {
            fetch(`${API_BASE_URL}/api/company-content/${id}`)
                .then(res => res.json())
                .then(data => {
                    // API'den gelen veriyi (brands, title, description vb.) merge et
                    // Eğer API'de title yoksa statik veriyi koru
                    setBrands(data.brands || []);
                    setCompanyData((prev: any) => ({ ...prev, ...data }));
                })
                .catch(err => console.error(err));
        }
    }, [id]);

    if (!companyData) return <div>Şirket bulunamadı</div>

    return (
        <div className="bg-gray-50">
            <div className="bg-[#0B0F19] text-white py-20 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
                        <span>Ana Sayfa</span> / <span>Markalar</span> / <span className="text-yellow-400 font-bold">{companyData.title}</span>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-black mb-2">{companyData.title}</h1>
                    <h2 className="text-5xl md:text-6xl font-black text-yellow-400 mb-8">Markaları</h2>

                    <p className="max-w-xl text-gray-400 leading-relaxed text-right ml-auto">
                        {companyData.heroSubtitle || companyData.description}
                    </p>
                </div>
            </div>

            <div className="bg-[#f8f9fa] min-h-screen py-20 px-4">
                <div className="max-w-7xl mx-auto">

                    <div className="mb-12">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Temsil Ettiğimiz Markalar</h3>
                        <p className="text-gray-500">{companyData.title} güvencesiyle sunduğumuz markalar ve şirketler .</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {brands.map((brand) => (
                            <div key={brand.id} className="bg-white p-10 rounded-xl shadow-sm hover:shadow-xl transition-all group flex flex-col items-center text-center h-full">

                                {/* Logo Area */}
                                <div className="mb-8 w-full flex items-center justify-center py-6 border-b border-gray-100 min-h-[120px]">
                                    {brand.logoPath ? (
                                        <img src={`${API_BASE_URL}/uploads/${brand.logoPath}`} alt={brand.name} className="max-h-[100px] object-contain" />
                                    ) : (
                                        <h3 className="text-4xl font-black text-gray-900 uppercase tracking-tighter">{brand.logoText}</h3>
                                    )}
                                </div>

                                <div className="flex gap-2 mb-6">
                                    {brand.tags && brand.tags.map((tag, i) => (
                                        <span key={i} className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded ${i === 0 ? "bg-blue-50 text-blue-600" : "bg-green-50 text-green-600"}`}>
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                <h4 className="text-2xl font-bold text-gray-900 mb-3">{brand.name}</h4>
                                <p className="text-gray-500 mb-8 leading-relaxed text-sm flex-1">{brand.description}</p>

                                <a
                                    href={brand.url}
                                    target="_blank"
                                    className="bg-[#1a202c] hover:bg-gray-800 text-white font-bold py-4 px-8 rounded-lg w-full flex items-center justify-center gap-2 transition-colors mt-auto"
                                >
                                    Web Sitesini İncele <span className="material-symbols-outlined text-sm">north_east</span>
                                </a>
                            </div>
                        ))}
                    </div>

                    {/* Back Button */}
                    <div className="mt-20 text-center">
                        <button onClick={() => navigate(-1)} className="bg-white border border-gray-200 text-gray-700 px-8 py-3 rounded-full font-bold hover:bg-gray-50 flex items-center gap-2 mx-auto transition-colors">
                            <span className="material-symbols-outlined">arrow_back</span> Diğer Grup Şirketlerini İncele
                        </button>
                    </div>

                </div>
            </div>
        </div>
    )
}
