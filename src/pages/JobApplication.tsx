
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config';
import ReCAPTCHA from 'react-google-recaptcha';

interface Job {
    id: number;
    title: string;
}

export default function JobApplication() {
    const navigate = useNavigate();
    const [file, setFile] = useState<File | null>(null);
    const [positions, setPositions] = useState<Job[]>([]);
    const [captchaToken, setCaptchaToken] = useState<string | null>("bypass");
    const recaptchaRef = useRef<ReCAPTCHA>(null);

    useEffect(() => {
        fetch(`${API_BASE_URL}/api/jobs`)
            .then(res => res.json())
            .then(data => setPositions(data))
            .catch(err => console.error("Pozisyonlar alınamadı:", err));
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);

        if (!captchaToken) {
            alert("Lütfen robot olmadığınızı doğrulayın.");
            return;
        }

        formData.append('captchaToken', captchaToken);

        // Consent (Checkbox) unchecked durumunda gitmez ama required oldugu icin isaretli olmali.
        // File input name="cv" olmalı. Aşağıda input elementine name ekledik.

        const button = form.querySelector('button[type="submit"]') as HTMLButtonElement;
        const originalText = button.innerText;
        button.disabled = true;
        button.innerText = "Gönderiliyor...";

        try {
            const response = await fetch(`${API_BASE_URL}/api/apply`, {
                method: 'POST',
                body: formData // Content-Type header'ı otomatik olarak multipart/form-data olur
            });

            const result = await response.json();

            if (response.ok) {
                alert(result.message || "Başvurunuz başarıyla alınmıştır!");
                recaptchaRef.current?.reset();
                setCaptchaToken(null);
                navigate('/kariyer');
            } else {
                alert("Hata: " + (result.message || "Bir şeyler ters gitti."));
            }
        } catch (error) {
            console.error("Submission error:", error);
            alert("Sunucuya bağlanılamadı. Lütfen sunucunun (node index.js) çalıştığından emin olun.");
        } finally {
            button.disabled = false;
            button.innerText = originalText;
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    return (
        <div className="bg-[#0B0F19] min-h-screen py-10 md:py-20 font-sans">

            {/* Header Area */}
            <div className="text-center mb-12 px-4">
                <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-4">Kariyer Başvuru Formu</h1>
                <p className="text-gray-400 max-w-2xl mx-auto text-sm md:text-base">
                    Yeteneklerinizle Derya Grup'un geleceğine yön verin. Aşağıdaki formu eksiksiz doldurarak başvurunuzu bize iletebilirsiniz.
                </p>
            </div>

            {/* Form Container */}
            <div className="max-w-3xl mx-auto px-4">
                <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 md:p-10 shadow-2xl">

                    {/* Form Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-6 border-b border-gray-100 gap-4">
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Kişisel Bilgiler & Özgeçmiş</h2>
                            <p className="text-sm text-gray-500 mt-1">Lütfen bilgilerinizi doğru ve eksiksiz girdiğinizden emin olun.</p>
                        </div>
                        <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide">
                            <span className="material-symbols-outlined text-sm">lock</span>
                            Güvenli Başvuru
                        </div>
                    </div>

                    {/* Inputs Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 flex items-center gap-1">Ad <span className="text-red-500">*</span></label>
                            <input required type="text" name="name" placeholder="Adınız" className="w-full h-12 px-4 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-sm" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 flex items-center gap-1">Soyad <span className="text-red-500">*</span></label>
                            <input required type="text" name="surname" placeholder="Soyadınız" className="w-full h-12 px-4 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-sm" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 flex items-center gap-1">E-posta Adresi <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl">mail</span>
                                <input required type="email" name="email" placeholder="ornek@email.com" className="w-full h-12 pl-12 pr-4 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-sm" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 flex items-center gap-1">Telefon Numarası <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl">phone</span>
                                <input required type="tel" name="phone" placeholder="(5XX) XXX XX XX" className="w-full h-12 pl-12 pr-4 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-sm" />
                            </div>
                        </div>
                    </div>

                    {/* Position Select */}
                    <div className="space-y-2 mb-6">
                        <label className="text-sm font-bold text-gray-700 flex items-center gap-1">İlgilenilen Pozisyon <span className="text-red-500">*</span></label>
                        <div className="relative">
                            <select name="position" className="w-full h-12 px-4 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-sm appearance-none bg-white">
                                <option value="">Lütfen bir pozisyon seçin</option>
                                <option value="Genel Başvuru">Genel Başvuru</option>
                                {positions.map((job) => (
                                    <option key={job.id} value={job.title}>{job.title}</option>
                                ))}
                            </select>
                            <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">expand_more</span>
                        </div>
                        <p className="text-xs text-gray-400">Aradığınız pozisyon listede yoksa 'Genel Başvuru' seçeneğini kullanabilirsiniz.</p>
                    </div>

                    {/* File Upload */}
                    <div className="space-y-2 mb-6">
                        <label className="text-sm font-bold text-gray-700 flex items-center gap-1">Özgeçmiş (CV) Yükle <span className="text-red-500">*</span></label>
                        <div className="border-2 border-dashed border-blue-100 rounded-xl p-8 text-center hover:bg-blue-50/50 transition-colors group cursor-pointer relative">
                            <input required type="file" name="cv" onChange={handleFileChange} accept=".pdf,.doc,.docx" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                            <div className="size-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined">{file ? 'check' : 'cloud_upload'}</span>
                            </div>
                            {file ? (
                                <div>
                                    <p className="text-sm font-bold text-blue-600">{file.name}</p>
                                    <p className="text-xs text-gray-400">Dosya yüklemeye hazır</p>
                                </div>
                            ) : (
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Dosyayı buraya sürükleyin veya <span className="text-blue-600 font-bold underline">seçin</span></p>
                                    <p className="text-xs text-gray-400 uppercase">PDF, DOCX veya DOC (Max. 5MB)</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Cover Letter */}
                    <div className="space-y-2 mb-8">
                        <label className="text-sm font-bold text-gray-700">Ön Yazı (Opsiyonel)</label>
                        <textarea name="coverLetter" placeholder="Kendinizden, deneyimlerinizden ve neden Derya Grup'ta çalışmak istediğinizden kısaca bahsedin..." className="w-full h-32 p-4 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-sm resize-none"></textarea>
                    </div>

                    {/* Consent & Submit */}
                    <div className="bg-blue-50/50 rounded-xl p-6 border border-blue-100 mb-8">
                        <label className="flex items-start gap-3 cursor-pointer group">
                            <input required type="checkbox" name="consent" value="true" className="mt-1 w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" />
                            <div className="text-xs text-gray-500 leading-relaxed">
                                <span className="font-bold text-gray-700 block mb-1">Kişisel Verilerin Korunması Kanunu (KVKK) Onayı</span>
                                Kişisel verilerimin, <a href="#" className="text-blue-600 font-bold hover:underline">Aydınlatma Metni</a> kapsamında işlenmesine, saklanmasına ve gerektiğinde ilgili üçüncü taraflarla paylaşılmasına rıza gösteriyorum.
                            </div>
                        </label>
                    </div>

                    <div className="flex justify-center mb-6">
                        {/* <ReCAPTCHA
                            ref={recaptchaRef}
                            sitekey={RECAPTCHA_SITE_KEY}
                            onChange={(token) => setCaptchaToken(token)}
                        /> */}
                    </div>

                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <p className="text-xs text-gray-400">*Başvuruyu Gönder butonuna tıklayarak yukarıdaki bilgilerin doğruluğunu beyan edersiniz.</p>
                        <button type="submit" className="w-full md:w-auto bg-blue-600 text-white px-8 py-4 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 active:scale-95">
                            Başvuruyu Gönder <span className="material-symbols-outlined">send</span>
                        </button>
                    </div>

                </form>
            </div>

        </div>
    );
}
