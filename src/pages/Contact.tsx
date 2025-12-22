import { useState, useRef, useEffect } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { API_BASE_URL } from '../config';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', surname: '', email: '', message: '' });
  const [captchaToken, setCaptchaToken] = useState<string | null>("bypass");
  const [contactInfo, setContactInfo] = useState<any>(null);
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/contact-info`)
      .then(res => res.json())
      .then(data => setContactInfo(data))
      .catch(console.error);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!captchaToken) {
      alert("Lütfen robot olmadığınızı doğrulayın.");
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, captchaToken })
      });
      const result = await res.json();
      if (result.success) {
        alert(result.message);
        setFormData({ name: '', surname: '', email: '', message: '' });
        recaptchaRef.current?.reset();
        setCaptchaToken(null);
      } else {
        alert(result.message);
      }
    } catch (err) {
      alert("Mesaj gönderilemedi.");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  return (
    <>
      <section className="bg-secondary text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)", backgroundSize: "32px 32px" }}></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Bize Ulaşın</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">Sorularınız, önerileriniz veya iş birlikleri için bizimle iletişime geçebilirsiniz.</p>
        </div>
      </section>

      <section className="py-20 bg-white dark:bg-background-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div className="space-y-10">
              <div>
                <h2 className="text-2xl font-bold text-secondary dark:text-white mb-6">İletişim Bilgileri</h2>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="size-12 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center shrink-0 text-primary">
                      <span className="material-symbols-outlined text-2xl">location_on</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-secondary dark:text-white text-lg">Merkez Ofis</h3>
                      <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{contactInfo?.address || 'Yükleniyor...'}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="size-12 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center shrink-0 text-primary">
                      <span className="material-symbols-outlined text-2xl">call</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-secondary dark:text-white text-lg">Telefon</h3>
                      <p className="text-gray-600 dark:text-gray-400">{contactInfo?.phone || '...'}</p>
                      <p className="text-gray-400 text-sm">{contactInfo?.workingHoursWeekdays || 'Hafta içi: 09:00 - 18:00'}</p>
                      {contactInfo?.workingHoursWeekend && <p className="text-gray-400 text-sm">{contactInfo?.workingHoursWeekend}</p>}
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="size-12 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center shrink-0 text-primary">
                      <span className="material-symbols-outlined text-2xl">mail</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-secondary dark:text-white text-lg">E-posta</h3>
                      <p className="text-gray-600 dark:text-gray-400">{contactInfo?.email || '...'}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="h-80 bg-gray-200 rounded-2xl overflow-hidden relative shadow-lg">
                <iframe
                  src={contactInfo?.mapUrl || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1!2d29.0!3d41.0!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTPCsDA2JzEzLjQiTiAyOcKwMDAnNTIuMyJF!5e0!3m2!1str!2str!4v1634567890123!5m2!1str!2str"}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Google Maps"
                ></iframe>
              </div>
            </div>

            <div className="bg-white dark:bg-black/20 p-8 md:p-10 rounded-3xl shadow-xl border border-gray-100 dark:border-white/5">
              <h2 className="text-2xl font-bold text-secondary dark:text-white mb-2">İletişim Formu</h2>
              <p className="text-gray-500 mb-8">Bize yazın, en kısa sürede size dönüş yapalım.</p>
              <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">Adınız</label>
                    <input name="name" value={formData.name} onChange={handleChange} required type="text" className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors" placeholder="Adınız" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">Soyadınız</label>
                    <input name="surname" value={formData.surname} onChange={handleChange} required type="text" className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors" placeholder="Soyadınız" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">E-posta</label>
                  <input name="email" value={formData.email} onChange={handleChange} required type="email" className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors" placeholder="ornek@mail.com" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">Mesajınız</label>
                  <textarea name="message" value={formData.message} onChange={handleChange} required rows={4} className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors" placeholder="Konut projesi hakkında bilgi almak istiyorum..."></textarea>
                </div>

                <div className="flex justify-center">
                  {/* <ReCAPTCHA ref={recaptchaRef} sitekey={RECAPTCHA_SITE_KEY} onChange={(t) => setCaptchaToken(t)} /> */}
                </div>
                <button type="submit" className="w-full bg-primary hover:bg-blue-700 text-white font-bold py-4 rounded-lg transition-colors shadow-lg shadow-primary/30 flex items-center justify-center gap-2">
                  <span>Mesajı Gönder</span>
                  <span className="material-symbols-outlined text-lg">send</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}