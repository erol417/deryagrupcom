
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config';

interface Job {
    id: number;
    title: string;
    department: string;
    location: string;
    type: string;
    description: string;
    responsibilities: string;
    qualifications: string;
    experience: string;
    education: string;
}

export default function JobDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [job, setJob] = useState<Job | null>(null);

    useEffect(() => {
        if (!id) return;
        fetch(`${API_BASE_URL}/api/jobs/${id}`)
            .then(res => {
                if (!res.ok) throw new Error("İlan bulunamadı");
                return res.json();
            })
            .then((data: Job) => setJob(data))
            .catch(err => {
                console.error(err);
                // navigate('/kariyer'); // İsteğe bağlı
            });
    }, [id]);

    if (!job) return <div className="text-center py-20">Yükleniyor...</div>;

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 font-sans">
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Header */}
                <div className="bg-gray-900 text-white p-8 md:p-12 text-center md:text-left">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div>
                            <div className="inline-block bg-blue-600/20 text-blue-300 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4 border border-blue-500/30">
                                {job.department}
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold mb-2">{job.title}</h1>
                            <div className="flex flex-wrap gap-4 text-gray-400 text-sm mt-2">
                                <div className="flex items-center gap-1">
                                    <span className="material-symbols-outlined text-lg">location_on</span> {job.location}
                                </div>
                                <div className="flex items-center gap-1">
                                    <span className="material-symbols-outlined text-lg">schedule</span> {job.type}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-8 md:p-12">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        {/* Main Info */}
                        <div className="lg:col-span-2 space-y-10">
                            {job.description && (
                                <section>
                                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-blue-600">info</span> İş Tanımı
                                    </h2>
                                    <p className="text-gray-600 leading-relaxed whitespace-pre-line">{job.description}</p>
                                </section>
                            )}

                            {job.responsibilities && (
                                <section>
                                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-blue-600">task</span> Sorumluluklar
                                    </h2>
                                    <ul className="space-y-2">
                                        {job.responsibilities.split('\n').map((item, i) => (
                                            item.trim() && (
                                                <li key={i} className="flex items-start gap-3 text-gray-600">
                                                    <span className="mt-1.5 size-1.5 rounded-full bg-blue-600 flex-shrink-0"></span>
                                                    <span className="leading-relaxed">{item}</span>
                                                </li>
                                            )
                                        ))}
                                    </ul>
                                </section>
                            )}

                            {job.qualifications && (
                                <section>
                                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-blue-600">check_circle</span> Aranan Nitelikler
                                    </h2>
                                    <ul className="space-y-2">
                                        {job.qualifications.split('\n').map((item, i) => (
                                            item.trim() && (
                                                <li key={i} className="flex items-start gap-3 text-gray-600">
                                                    <span className="mt-1.5 size-1.5 rounded-full bg-blue-600 flex-shrink-0"></span>
                                                    <span className="leading-relaxed">{item}</span>
                                                </li>
                                            )
                                        ))}
                                    </ul>
                                </section>
                            )}
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                                <h3 className="font-bold text-gray-900 mb-4">Aday Kriterleri</h3>
                                <div className="space-y-4">
                                    {job.experience && (
                                        <div>
                                            <div className="text-xs text-gray-500 uppercase font-bold mb-1">Tecrübe</div>
                                            <div className="text-sm font-medium text-gray-900">{job.experience}</div>
                                        </div>
                                    )}
                                    {job.education && (
                                        <div>
                                            <div className="text-xs text-gray-500 uppercase font-bold mb-1">Eğitim Seviyesi</div>
                                            <div className="text-sm font-medium text-gray-900">{job.education}</div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <button
                                onClick={() => navigate('/kariyer/basvuru')}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2 group"
                            >
                                Bu İlana Başvur <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
