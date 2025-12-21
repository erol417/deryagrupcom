import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config';

interface Job {
  id: number;
  title: string;
  department: string;
  location: string;
  type: string;
}

export default function Career() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/jobs?active=true`)
      .then(res => res.json())
      .then(data => setJobs(data))
      .catch(err => console.error(err));
  }, []);

  const getDeptColorClass = (dept: string) => {
    const d = dept.toLowerCase();
    if (d.includes('yazılım') || d.includes('it')) return 'bg-blue-50 text-blue-700';
    if (d.includes('insan') || d.includes('kaynak')) return 'bg-purple-50 text-purple-700';
    if (d.includes('finans') || d.includes('muhasebe')) return 'bg-orange-50 text-orange-700';
    if (d.includes('satış') || d.includes('pazarlama')) return 'bg-green-50 text-green-700';
    return 'bg-gray-50 text-gray-700';
  };

  return (
    <>
      <section className="relative py-24 bg-gradient-to-r from-blue-900 to-secondary text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=2084&auto=format&fit=crop')] bg-cover bg-center opacity-20"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Kariyer</h1>
          <p className="text-xl text-gray-200 max-w-2xl mx-auto font-light">
            Derya Grup ailesinin bir parçası olun, geleceği birlikte inşa edelim.
          </p>
        </div>
      </section>

      <section className="py-20 bg-white dark:bg-background-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="bg-gray-50 dark:bg-white/5 p-8 rounded-2xl border border-gray-100 dark:border-white/10 h-fit sticky top-24">
              <h3 className="text-xl font-bold text-secondary dark:text-white mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">work</span>
                Derya Grup İK
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm leading-relaxed">
                Derya Grup olarak, çalışan memnuniyetini ve kariyer gelişimini ön planda tutan bir çalışma kültürü sunuyoruz.
              </p>

              <h4 className="font-bold text-secondary dark:text-white mb-4 text-sm uppercase tracking-wider">Hızlı İletişim</h4>
              <ul className="space-y-4 text-sm text-gray-600 dark:text-gray-300">
                <li className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary">mail</span>
                  <span>ik@deryagrup.com</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary">call</span>
                  <span>+90 212 555 00 00</span>
                </li>
              </ul>
            </div>

            <div className="lg:col-span-2">
              <h2 className="text-3xl font-bold text-secondary dark:text-white mb-8">Açık Pozisyonlar</h2>
              <div className="space-y-4">
                {jobs.map((job) => (
                  <div key={job.id} onClick={() => navigate(`/kariyer/ilan/${job.id}`)} className="group bg-white dark:bg-white/5 p-6 rounded-xl border border-gray-200 dark:border-white/10 hover:border-primary transition-all cursor-pointer shadow-sm hover:shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-2 ${getDeptColorClass(job.department)}`}>
                        {job.department}
                      </span>
                      <h3 className="text-lg font-bold text-secondary dark:text-white group-hover:text-primary transition-colors">{job.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mt-2">
                        <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">location_on</span> {job.location}</span>
                        <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">schedule</span> {job.type}</span>
                      </div>
                    </div>
                    <button className="w-full sm:w-auto px-6 py-2.5 bg-primary text-white font-bold rounded-lg hover:bg-blue-700 transition-colors text-sm">
                      Başvur
                    </button>
                  </div>
                ))}

                {jobs.length === 0 && (
                  <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                    <p className="text-gray-500">Şu anda açık pozisyon bulunmamaktadır.</p>
                  </div>
                )}
              </div>

              <div className="mt-12 bg-primary/5 border border-primary/20 border-dashed rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <h3 className="text-xl font-bold text-secondary dark:text-white mb-2">Aradığınız pozisyonu bulamadınız mı?</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm max-w-lg">
                    Genel başvuru yaparak CV'nizi veritabanımıza ekleyebilir, uygun pozisyonlar açıldığında değerlendirilme şansı yakalayabilirsiniz.
                  </p>
                </div>
                <button onClick={() => navigate('/kariyer/basvuru')} className="bg-white border border-primary text-primary hover:bg-blue-50 font-bold py-3 px-8 rounded-lg transition-colors whitespace-nowrap">
                  Genel Başvuru Yap
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}