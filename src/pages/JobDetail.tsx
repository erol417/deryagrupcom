
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
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

    const shareUrl = window.location.href;
    const imageUrl = `${window.location.origin}/derya-grup-logo.png`;

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 font-sans">
            <Helmet>
                <title>{job.title} - Derya Grup Kariyer</title>
                <meta property="og:title" content={`${job.title} - Derya Grup Kariyer`} />
                <meta property="og:description" content={job.description.substring(0, 200) + "..."} />
                <meta property="og:image" content={imageUrl} />
                <meta property="og:url" content={shareUrl} />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:image" content={imageUrl} />
            </Helmet>
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

                            {/* Share Section */}
                            <div className="bg-white rounded-xl p-6 border border-gray-200">
                                <h3 className="font-bold text-gray-900 mb-4 text-sm">İlanı Paylaş</h3>
                                <div className="flex gap-2 justify-between">
                                    <a
                                        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1 aspect-square flex items-center justify-center bg-[#0077b5]/10 text-[#0077b5] hover:bg-[#0077b5] hover:text-white rounded-lg transition-colors"
                                        title="LinkedIn'de Paylaş"
                                    >
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                                    </a>
                                    <a
                                        href={`https://wa.me/?text=${encodeURIComponent(`Derya Grup'ta harika bir iş ilanına göz at: ${job.title} ${window.location.href}`)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1 aspect-square flex items-center justify-center bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366] hover:text-white rounded-lg transition-colors"
                                        title="WhatsApp'ta Paylaş"
                                    >
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
                                    </a>
                                    <a
                                        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Derya Grup'ta harika bir iş ilanına göz at: ${job.title}`)}&url=${encodeURIComponent(window.location.href)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1 aspect-square flex items-center justify-center bg-black/10 text-black hover:bg-black hover:text-white rounded-lg transition-colors"
                                        title="X'te Paylaş"
                                    >
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                                    </a>
                                    <a
                                        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1 aspect-square flex items-center justify-center bg-[#1877F2]/10 text-[#1877F2] hover:bg-[#1877F2] hover:text-white rounded-lg transition-colors"
                                        title="Facebook'ta Paylaş"
                                    >
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036c-2.148 0-2.971.956-2.971 3.594v.803h3.428l-.534 3.667h-2.894v7.98h-2.614c-1.31-.667-1.31-.667-2.229-.426z" /></svg>
                                    </a>
                                    <a
                                        href={`mailto:?subject=${encodeURIComponent(`İş Fırsatı: ${job.title}`)}&body=${encodeURIComponent(`Merhaba,\n\nDerya Grup'ta ilgini çekebilecek bir iş ilanı buldum:\n\n${job.title}\n\nDetaylar için: ${window.location.href}`)}`}
                                        className="flex-1 aspect-square flex items-center justify-center bg-gray-600/10 text-gray-600 hover:bg-gray-600 hover:text-white rounded-lg transition-colors"
                                        title="E-posta ile Gönder"
                                    >
                                        <span className="material-symbols-outlined text-xl">mail</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
