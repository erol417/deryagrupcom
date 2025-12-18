export default function About() {
  return (
    <>
      {/* 1. Header Section */}
      <section className="relative h-[400px] flex items-center justify-center text-center text-white bg-gray-900">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2670&auto=format&fit=crop')] bg-cover bg-center opacity-40"></div>
        <div className="relative z-10 px-4">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">Hakkımızda</h1>
          <p className="text-xl md:text-2xl text-gray-200 font-light max-w-3xl mx-auto">
            1995'ten beri güven, kalite ve yenilikçi çözümlerle sektörde fark yaratıyoruz.
          </p>
        </div>
      </section>

      {/* 2. Derya Grup Kimdir? */}
      <section className="py-24 bg-white dark:bg-background-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <div className="w-full lg:w-1/2">
              <h2 className="text-3xl md:text-4xl font-bold text-secondary dark:text-white mb-2">
                Derya Grup Kimdir?
              </h2>
              <div className="h-1 w-20 bg-primary mb-6"></div>

              <h3 className="text-xl font-bold text-primary mb-4">Köklü Geçmiş, Güçlü Gelecek</h3>

              <div className="text-gray-600 dark:text-gray-300 space-y-4 leading-relaxed mb-8">
                <p>
                  1979 yılından bu yana inşaat, otomotiv ve sigorta gibi farklı sektörde öncü adımlar atan Derya Grup, kalite standartlarını sürekli yükselterek müşterilerine en iyi hizmeti sunmayı amaçlamaktadır.
                </p>
                <p>
                  Modern vizyonumuz ve uzman kadromuzla, sadece bugünü değil geleceği de inşa ediyoruz. Sürdürülebilirlik ilkelerine bağlı kalarak, topluma ve çevreye değer katan projeler geliştiriyoruz. Şeffaflık ve dürüstlük, ticari ilişkilerimizin temelini oluşturmaktadır.
                </p>
              </div>

              <div className="flex gap-6">
                <div className="bg-gray-50 dark:bg-white/5 p-6 rounded-xl border border-gray-100 dark:border-white/10 min-w-[160px]">
                  <span className="block text-3xl font-bold text-secondary dark:text-white mb-1">47+</span>
                  <span className="text-sm text-gray-500">Yıllık Tecrübe</span>
                </div>
                <div className="bg-gray-50 dark:bg-white/5 p-6 rounded-xl border border-gray-100 dark:border-white/10 min-w-[160px]">
                  <span className="block text-3xl font-bold text-secondary dark:text-white mb-1">100.000+</span>
                  <span className="text-sm text-gray-500">Hizmet Verilmiş Müşteri </span>
                </div>
              </div>
            </div>
            <div className="w-full lg:w-1/2">
              <img
                src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2670&auto=format&fit=crop"
                alt="Meeting"
                className="rounded-2xl shadow-xl w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 3. Değerlerimiz */}
      <section className="py-24 bg-gray-50 dark:bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-secondary dark:text-white mb-4">Değerlerimiz</h2>
          <p className="text-gray-500 mb-16 max-w-2xl mx-auto">Bizi biz yapan, her projede rehber edindiğimiz temel prensiplerimiz.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Card 1 */}
            <div className="bg-white dark:bg-white/5 p-8 rounded-xl shadow-sm hover:shadow-lg transition-all text-left group">
              <div className="size-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-primary flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                <span className="material-symbols-outlined">verified_user</span>
              </div>
              <h3 className="text-xl font-bold text-secondary dark:text-white mb-3">Güven</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                İş ortaklarımız ve müşterilerimize sunduğumuz hizmette dürüstlük ve şeffaflık esastır.
              </p>
            </div>
            {/* Card 2 */}
            <div className="bg-white dark:bg-white/5 p-8 rounded-xl shadow-sm hover:shadow-lg transition-all text-left group">
              <div className="size-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-primary flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                <span className="material-symbols-outlined">lightbulb</span>
              </div>
              <h3 className="text-xl font-bold text-secondary dark:text-white mb-3">İnovasyon</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                En yeni teknolojileri takip ederek, süreçlerimizi ve hizmet kalitemizi sürekli geliştiriyoruz.
              </p>
            </div>
            {/* Card 3 */}
            <div className="bg-white dark:bg-white/5 p-8 rounded-xl shadow-sm hover:shadow-lg transition-all text-left group">
              <div className="size-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-primary flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                <span className="material-symbols-outlined">diversity_3</span>
              </div>
              <h3 className="text-xl font-bold text-secondary dark:text-white mb-3">Müşteri Odaklılık</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                Müşterilerimizin ihtiyaçlarını doğru anlayıp, onlara en uygun ve etkili çözümleri sunarız.
              </p>
            </div>
            {/* Card 4 */}
            <div className="bg-white dark:bg-white/5 p-8 rounded-xl shadow-sm hover:shadow-lg transition-all text-left group">
              <div className="size-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-primary flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                <span className="material-symbols-outlined">eco</span>
              </div>
              <h3 className="text-xl font-bold text-secondary dark:text-white mb-3">Sürdürülebilirlik</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                Çevreye duyarlı projeler geliştirerek, gelecek nesillere yaşanabilir bir dünya bırakmayı hedefliyoruz.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Tarihçemiz */}
      <section className="py-24 bg-white dark:bg-background-dark">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-secondary dark:text-white mb-16">Tarihçemiz</h2>
          <div className="relative border-l-2 border-gray-200 dark:border-gray-700 ml-6 md:ml-12 space-y-12">
            {/* Item 1 */}
            <div className="relative pl-8 md:pl-12">
              <div className="absolute -left-[9px] top-0 size-4 rounded-full bg-primary border-4 border-white dark:border-background-dark"></div>
              <div>
                <span className="text-primary font-bold text-sm tracking-widest block mb-1">1979</span>
                <h3 className="text-xl font-bold text-secondary dark:text-white mb-2">Derya İnşaat Kuruluşu</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  Derya Grup, küçük bir aile şirketi olarak inşaat malzemeleri satışı ile ticari hayatına başladı. İlk dükkanımız Mersin'de açıldı.
                </p>
              </div>
            </div>
            {/* Item 11 */}
            <div className="relative pl-8 md:pl-12">
              <div className="absolute -left-[9px] top-0 size-4 rounded-full bg-primary border-4 border-white dark:border-background-dark"></div>
              <div>
                <span className="text-primary font-bold text-sm tracking-widest block mb-1">1997</span>
                <h3 className="text-xl font-bold text-secondary dark:text-white mb-2">Derya Otomotiv Kuruluşu</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  İnşaat sektöründe ki başarıları ile otomotiv sektörüne geçiş yapmıştır.
                </p>
              </div>
            </div>
            {/* Item 12 */}
            <div className="relative pl-8 md:pl-12">
              <div className="absolute -left-[9px] top-0 size-4 rounded-full bg-primary border-4 border-white dark:border-background-dark"></div>
              <div>
                <span className="text-primary font-bold text-sm tracking-widest block mb-1">1997</span>
                <h3 className="text-xl font-bold text-secondary dark:text-white mb-2">Hyundai Bayiliği</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  Derya Otomotiv bünyesinde ilk markamız Hyundai Mersin Yetkili Satıcı ve Servisi hizmeti başladı.
                </p>
              </div>
            </div>
            {/* Item 2 */}
            <div className="relative pl-8 md:pl-12">
              <div className="absolute -left-[9px] top-0 size-4 rounded-full bg-primary border-4 border-white dark:border-background-dark"></div>
              <div>
                <span className="text-primary font-bold text-sm tracking-widest block mb-1">2001</span>
                <h3 className="text-xl font-bold text-secondary dark:text-white mb-2">Hyundai Derya Otomotiv'in Kendi Plazasına Taşınması</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  Hyundai Derya Otomotiv Kendi Plazasına taşındı.
                </p>
              </div>
            </div>
            {/* Item 21 */}
            <div className="relative pl-8 md:pl-12">
              <div className="absolute -left-[9px] top-0 size-4 rounded-full bg-primary border-4 border-white dark:border-background-dark"></div>
              <div>
                <span className="text-primary font-bold text-sm tracking-widest block mb-1">2001</span>
                <h3 className="text-xl font-bold text-secondary dark:text-white mb-2">Derya Sigorta Kuruluşu</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  Hem Sağlık Hem de Elemanter Sigorta Ürünlerinde Hizmert Sunan Firmamız Kuruldu
                </p>
              </div>
            </div>
            {/* Item 3 */}
            <div className="relative pl-8 md:pl-12">
              <div className="absolute -left-[9px] top-0 size-4 rounded-full bg-primary border-4 border-white dark:border-background-dark"></div>
              <div>
                <span className="text-primary font-bold text-sm tracking-widest block mb-1">2007</span>
                <h3 className="text-xl font-bold text-secondary dark:text-white mb-2">Derya Klima Kuruldu </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  Bugün, Haier Distribütörlüğü, Samsung, Siemnes, Karaca, Regal gibi markalara ev sahipliği yapan şirketimiz kuruldu
                </p>
              </div>
            </div>
            {/* Item 4 */}
            <div className="relative pl-8 md:pl-12">
              <div className="absolute -left-[9px] top-0 size-4 rounded-full bg-primary border-4 border-white dark:border-background-dark"></div>
              <div>
                <span className="text-primary font-bold text-sm tracking-widest block mb-1">2024</span>
                <h3 className="text-xl font-bold text-secondary dark:text-white mb-2">Global Vizyon</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  Bugün Derya Grup, uluslararası projelerde yer alan, 500'den fazla çalışanıyla dev bir organizasyon haline gelmiştir.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Yönetim Kurulu Mesajı */}
      <section className="py-24 bg-gray-50 dark:bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-16 items-start">
            <div className="w-full lg:w-5/12 relative">
              <div className="relative rounded-lg overflow-hidden shadow-2xl">
                <img
                  src="/images/huseyin_kis.png"
                  alt="Hüseyin Kış"
                  className="w-full h-auto object-cover aspect-[4/5]"
                />
                <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/90 via-black/50 to-transparent p-8">
                  <h3 className="text-2xl font-bold text-white">Hüseyin Kış</h3>
                  <p className="text-primary font-medium">Yönetim Kurulu Başkanı</p>
                </div>
              </div>
              {/* Decorative border matching design */}
              <div className="absolute top-4 -left-4 w-full h-full border-2 border-primary/30 rounded-lg -z-10 hidden lg:block"></div>
            </div>

            <div className="w-full lg:w-7/12">
              <h2 className="text-3xl font-bold text-secondary dark:text-white mb-8">Yönetim Kurulu Başkanının Mesajı</h2>
              <span className="material-symbols-outlined text-6xl text-gray-200 mb-6 block">format_quote</span>

              <div className="space-y-6 text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
                <p className="font-medium text-secondary dark:text-white">
                  Değerli İş Ortaklarımız ve Çalışanlarımız,
                </p>
                <p>
                  Derya Grup olarak çıktığımız bu yolda, her zaman daha iyisini hedefleyerek, sadece binalar değil, güven ve sürdürülebilir yaşam alanları inşa ettik. Bizim için başarı, yalnızca finansal rakamlardan ibaret değil; dokunduğumuz hayatlara kattığımız değerdir.
                </p>
                <p>
                  Değişen dünya dinamiklerine uyum sağlarken, köklerimizden aldığımız güçle geleceği şekillendiriyoruz. Yenilikçi bakış açımız ve dürüst ticaret ilkemizle, sektörde standartları belirleyen bir marka olmaya devam edeceğiz. Hedefimiz, sadece Türkiye'de değil, global ölçekte de iz bırakan projelere imza atmaktır.
                </p>
                <p>
                  Bize duydugünüz güven için teşekkür eder, birlikte nice başarılara imza atmayı dilerim.
                </p>
              </div>

              <div className="mt-8 opacity-70">
                {/* Placeholder for Signature */}
                <span className="font-handwriting text-4xl text-secondary dark:text-white">Hüseyin Kış</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CTA Section */}
      <section className="py-20 bg-primary text-white text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Geleceği Birlikte İnşa Edelim</h2>
          <p className="text-blue-100 text-lg mb-10">
            Projelerinizde profesyonel bir ortak arıyorsanız, Derya Grup tecrübesiyle yanınızda.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-white text-primary font-bold rounded-lg hover:bg-gray-100 transition-colors shadow-lg">
              Bize Ulaşın
            </button>
            <button className="px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-lg hover:bg-white/10 transition-colors">
              Projelerimizi İnceleyin
            </button>
          </div>
        </div>
      </section>
    </>
  )
}