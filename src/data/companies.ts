export const companies = {
    otomotiv: {
        id: "otomotiv",
        title: "Derya Otomotiv",
        tag: "Otomotiv Sektörü",
        heroImage: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=2583&auto=format&fit=crop",

        heroTitle: "Geleceğin Yollarında Güven",
        heroSubtitle: "Derya Otomotiv olarak, 1995'ten bu yana satış, servis ve yedek parça hizmetlerinde mükemmelliği hedefliyoruz.",

        contact: {
            address: "Genel Müdürlük, İstanbul",
            phone: "+90 212 555 0000",
            website: "deryaotomotiv.com.tr",
            email: "info@deryaotomotiv.com.tr"
        },

        stats: [
            { value: "28", label: "Yıllık Tecrübe", icon: "calendar_month" },
            { value: "250+", label: "Çalışan", icon: "groups" },
            { value: "12", label: "Şube", icon: "location_on" },
            { value: "50k+", label: "Mutlu Müşteri", icon: "sentiment_satisfied" }
        ],

        description: "Derya Otomotiv, Türkiye'nin önde gelen otomotiv perakendecilerinden biri olarak, sektördeki yolculuğuna 28 yıl önce başlamıştır. Kuruluşumuzdan bu yana değişmeyen tek ilkemiz, koşulsuz müşteri memnuniyeti ve kaliteli hizmet anlayışıdır.\n\nGeniş araç portföyümüz, son teknoloji ile donatılmış servis istasyonlarımız ve alanında uzman teknik kadromuz ile müşterilerimize A'dan Z'ye komple bir otomotiv deneyimi sunuyoruz surdürülebilirlik ve inovasyon vizyonumuzla, elektrikli araç dönüşümüne de öncülük ediyor, çevre dostu çözümleri portföyümüze entegre ediyoruz.",

        services: [
            {
                title: "Sıfır Araç Satışı",
                desc: "Dünyaca ünlü markaların en yeni modellerini, avantajlı ödeme seçenekleri ve kurumsal güvenceyle sunuyoruz.",
                icon: "directions_car",
                image: "https://images.unsplash.com/photo-1550355291-bbee04a92027?q=80&w=2536&auto=format&fit=crop"
            },
            {
                title: "Yetkili Servis & Bakım",
                desc: "Uzman teknisyenlerimiz ve orijinal yedek parça garantisiyle aracınızın performansını ilk günkü gibi koruyoruz.",
                icon: "build",
                image: "https://images.unsplash.com/photo-1487754180451-c456f719a1fc?q=80&w=2670&auto=format&fit=crop"
            },
            {
                title: "Sigorta ve Finansman",
                desc: "Kasko, trafik sigortası ve taşıt kredisi süreçlerinde size özel çözümlerle işlemlerinizi kolaylaştırıyoruz.",
                icon: "verified_user",
                image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2670&auto=format&fit=crop"
            },
            {
                title: "Filo ve E-Mobilite",
                desc: "Kurumsal filo kiralama ve elektrikli şarj istasyonu kurulum hizmetlerimizle geleceğe yatırım yapıyoruz.",
                icon: "electric_car",
                image: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?q=80&w=2672&auto=format&fit=crop"
            }
        ],

        vision: {
            title: "Hedeflerimiz ve Vizyonumuz",
            desc: "Derya Otomotiv olarak hedefimiz, sadece araç satan bir bayi olmak değil, müşterilerimizin yaşam kalitesini artıran bir mobilite partneri olmaktır.",
            items: [
                "2025 yılına kadar %100 dijital entegre servis deneyimi sunmak.",
                "Karbon ayak izimizi %40 oranında azaltarak çevre dostu bayicilikte lider olmak.",
                "Bölgesel pazar payımızı %25 artırarak sektördeki liderliğimizi pekiştirmek."
            ]
        },

        awards: [
            { year: "2023", title: "Yılın En İyi Bayisi", desc: "Müşteri memnuniyeti anketlerinde Türkiye genelinde birincilik ödülü.", icon: "emoji_events" },
            { year: "2022", title: "ISO 9001 Sertifikası", desc: "Hizmet kalitesi ve yönetim sistemlerinde uluslararası standart onayı.", icon: "verified" },
            { year: "2021", title: "Satış Rekoru", desc: "Bölge tarihinde tek yılda en yüksek araç satış adedine ulaşılması.", icon: "trending_up" }
        ]
    },

    // Diğer şirketler için varsayılan yapı (Typescript hatası olmaması için dolduruldu, içerikleri daha sonra detaylandırılabilir)
    // Pratik olması açısında şuan Otomotiv detaylı, diğerleri standart veriden türetilecek.
    // Gerçek uygulamada her biri için bu detayda veri girilmeli.
    insaat: {
        id: "insaat",
        title: "Derya İnşaat A.Ş.",
        tag: "İNŞAAT SEKTÖRÜ",
        heroImage: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=2670&auto=format&fit=crop",
        heroTitle: "Yaşamı Şekillendiren Projeler",
        heroSubtitle: "Estetik, güvenli ve çevreye duyarlı modern yaşam alanları inşa ederek geleceğin şehirlerini kuruyoruz.",
        contact: {
            address: "Genel Müdürlük, İstanbul",
            phone: "+90 212 555 0001",
            website: "deryainsaat.com.tr",
            email: "insaat@deryagrup.com.tr",
            buttonText: "Katalog İndir",
            buttonIcon: "download"
        },
        stats: [
            { value: "45+", label: "Tamamlanan Proje", icon: "apartment" },
            { value: "150k+", label: "m² İnşaat Alanı", icon: "architecture" },
            { value: "20", label: "Yıllık Tecrübe", icon: "history" },
            { value: "2000+", label: "Mutlu Aile", icon: "groups" }
        ],
        description: "Derya İnşaat, sektördeki 20 yılı aşkın deneyimiyle konut, ticari ve altyapı projelerinde güvenilirliğin simgesi haline gelmiştir. \"İnsan odaklı tasarım\" felsefemizle, sadece binalar değil, komşuluk ilişkilerinin geliştiği, doğayla uyumlu yaşam alanları tasarlıyoruz.\n\nModern mimari teknikleri, birinci sınıf malzemeler ve yenilikçi mühendislik çözümlerini bir araya getirerek, her projemizde kalite standartlarını yeniden tanımlıyoruz. Deprem güvenliği ve sürdürülebilirlik, tüm projelerimizin temelini oluşturan değişmez önceliklerimizdir.",
        services: [
            { title: "Konut Projeleri", desc: "Yüksek yaşam standartları sunan, estetik mimari ve fonksiyonelliğin buluştuğu, doğa ile uyumlu modern konut projeleri.", icon: "home", image: "https://images.unsplash.com/photo-1600596542815-e495d915998d?q=80&w=2675&auto=format&fit=crop" },
            { title: "Ticari Projeler", desc: "Global iş dünyasının gereksinimlerine uygun, akıllı bina teknolojileriyle donatılmış prestijli ticaret merkezleri.", icon: "domain", image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2670&auto=format&fit=crop" },
            { title: "Altyapı Projeleri", desc: "Şehirlerin ulaşım ağını güçlendiren, mühendislik ve teknolojinin sınırlarını zorlayan dev altyapı yatırımları.", icon: "construction", image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=2670&auto=format&fit=crop" },
            { title: "Kentsel Dönüşüm", desc: "Geleceğin şehirlerini inşa ederken, güvenli, dayanıklı ve çevreye duyarlı modern dönüşüm çözümleri.", icon: "change_circle", image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=2689&auto=format&fit=crop" }
        ],
        vision: {
            title: "Sürdürülebilirlik ve Kalite",
            desc: "Derya İnşaat olarak, gelecek nesillere daha yaşanabilir bir dünya bırakma sorumluluğuyla hareket ediyoruz.",
            items: [
                "LEED ve BREEAM standartlarına uygun, çevre dostu malzeme kullanımı.",
                "Her zevk ve ihtiyaca yönelik, yüksek güvenlikli statik projeler.",
                "İş güvenliğinde 'Sıfır Kaza' hedefiyle titiz şantiye yönetimi."
            ],
            iconLabel: "Doğa Dostu Yapılar",
            icon: "eco"
        },
        awards: [
            { year: "2023", title: "En İyi Konut Projesi", desc: "Derya Vista Projesi ile 'Yılın En İyi Konut Tasarımı' ödülü.", icon: "emoji_events" },
            { year: "2022", title: "ISO 14001 Sertifikası", desc: "Çevre yönetim sistemlerinde uluslararası standart onayı.", icon: "verified" },
            { year: "2021", title: "Güvenli Şantiye", desc: "İş sağlığı ve güvenliği alanında sektör liderliği ödülü.", icon: "security" }
        ]
    },
    sigorta: {
        id: "sigorta",
        title: "Derya Sigorta Ltd. Şti.",
        tag: "SİGORTA SEKTÖRÜ",
        heroImage: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=2670&auto=format&fit=crop",
        heroTitle: "Geleceğiniz Güvence Altında",
        heroSubtitle: "Derya Sigorta olarak, hayatın her anında karşılaşabileceğiniz risklere karşı size ve sevdiklerinize özel çözümler sunuyoruz.",

        contact: {
            address: "Merkez Ofisi, İstanbul",
            phone: "+90 212 555 1111",
            website: "deryasigorta.com.tr",
            email: "sigorta@deryagrup.com.tr",
            buttonText: "Teklif Al",
            buttonIcon: "calculate"
        },

        stats: [
            { value: "20+", label: "Sigorta Şirketi", icon: "shield" },
            { value: "15k+", label: "Düzenlenen Poliçe", icon: "description" },
            { value: "7/24", label: "Destek Hizmeti", icon: "support_agent" },
            { value: "%98", label: "Müşteri Memnuniyeti", icon: "sentiment_satisfied" }
        ],

        description: "Derya Sigorta, Derya Grup bünyesinde 2005 yılında faaliyetlerine başlamış köklü bir sigorta acentesidir. \"Önce Güven\" ilkesiyle yola çıkan şirketimiz, Türkiye'nin önde gelen sigorta şirketlerinin yetkili acentesi olarak hizmet vermektedir.\n\nUzman kadromuz ile bireysel ve kurumsal müşterilerimizin ihtiyaçlarını doğru analiz ederek, en uygun teminatları en avantajlı fiyatlarla sunmayı hedefliyoruz. Kasko, Trafik, Konut, DASK, Sağlık, Seyahat ve İşyeri sigortaları başta olmak üzere tüm branşlarda profesyonel çözümler üretiyoruz. Hasar anında müşterimizin yanında olarak sürecin hızlı ve sorunsuz tamamlanmasını sağlıyoruz.",

        services: [
            {
                title: "Bireysel Sigortalar",
                desc: "Kendinizi, ailenizi, evinizi ve aracınızı beklenmedik risklere karşı koruma altına alın.",
                features: ["Kasko & Trafik", "Konut & DASK", "Tamamlayıcı Sağlık"],
                icon: "person",
                image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=2670&auto=format&fit=crop"
            },
            {
                title: "Kurumsal Sigortalar",
                desc: "İşletmenizin devamlılığı ve çalışanlarınızın güvenliği için kapsamlı çözümler.",
                features: ["İşyeri Paket Sigortası", "Nakliyat Sigortaları", "Siber Güvenlik"],
                icon: "business_center",
                image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2670&auto=format&fit=crop"
            },
            {
                title: "Danışmanlık Hizmetleri",
                desc: "Risk analizi ve poliçe yönetimi konularında profesyonel danışmanlık.",
                features: ["Risk Analizi", "Hasar Yönetimi", "Poliçe Optimizasyonu"],
                icon: "support_agent",
                image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2670&auto=format&fit=crop"
            }
        ],

        vision: {
            title: "Müşteri Odaklı Yaklaşımımız",
            desc: "Sigortacılığı sadece bir poliçe satışı olarak değil, güvene dayalı uzun vadeli bir dostluk olarak görüyoruz. Sizin için en doğru teminatı belirlerken, bütçenizi de koruyoruz.",
            items: [
                "7/24 ulaşılabilir hasar destek hattı ile her an yanınızdayız.",
                "Sektörün en güvenilir 20+ sigorta şirketiyle çalışarak en iyi fiyat garantisi sunuyoruz.",
                "Poliçe yenileme dönemlerinde proaktif takip ve bilgilendirme yapıyoruz."
            ],
            iconLabel: "Güvenilir Partner",
            icon: "verified_user"
        },

        awards: [
            { year: "2023", title: "Yılın Acentesi", desc: "Bölgesel üretim ve karlılık kategorisinde birincilik ödülü.", icon: "emoji_events" },
            { year: "2022", title: "Mükemmel Hizmet", desc: "Müşteri memnuniyeti ve bağlılığı kategorisinde başarı ödülü.", icon: "favorite" },
            { year: "2021", title: "Dijital Dönüşüm", desc: "Online poliçe sistemlerine entegrasyon başarısı.", icon: "rocket_launch" }
        ],

        bottomCTA: {
            title: "Hemen teklif alın",
            desc: "İhtiyaçlarınıza en uygun sigorta teklifini hazırlayalım.",
            buttonText: "Online Teklif Formu",
            link: "#teklif-al"
        }
    },
    elektronik: {
        id: "elektronik",
        title: "Derya Elektronik A.Ş.",
        tag: "ELEKTRONİK",
        heroImage: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2670&auto=format&fit=crop",
        heroTitle: "Geleceği Şekillendiren Akıllı Teknolojiler",
        heroSubtitle: "Derya Elektronik, yenilikçi ürünler ve endüstriyel çözümlerle dijital dönüşümün öncüsü olarak hayatı kolaylaştıran teknolojiler üretiyor.",
        contact: {
            address: "Teknopark Ar-Ge Merkezi, İstanbul",
            phone: "+90 212 444 0000",
            website: "deryaelektronik.com.tr",
            email: "info@deryaelektronik.com",
            buttonText: "Ürün Kataloğu",
            buttonIcon: "download"
        },
        stats: [
            { value: "15+", label: "Yıllık Tecrübe", icon: "calendar_month" },
            { value: "60+", label: "Uzman Mühendis", icon: "engineering" },
            { value: "25", label: "Ülkeye İhracat", icon: "public" },
            { value: "120+", label: "Tescilli Patent", icon: "workspace_premium" }
        ],
        description: "Derya Elektronik, 2008 yılından bu yana tüketici elektroniği ve endüstriyel otomasyon alanlarında katma değerli çözümler sunmaktadır. Teknoloji dünyasındaki hızlı değişime ayak uyduran dinamik yapımız ve güçlü Ar-Ge merkezimiz ile sektörde fark yaratıyoruz.\n\nGeliştirdiğimiz akıllı ev sistemleri, IoT tabanlı endüstriyel sensörler ve enerji verimliliği sağlayan otomasyon yazılımları ile hem bireysel kullanıcıların hem de sanayi kuruluşlarının ihtiyaçlarına yanıt veriyoruz. \"Yerli Üretim, Küresel Vizyon\" mottomuzla teknolojiyi sadece tüketen değil, üreten bir toplum olma yolunda emin adımlarla ilerliyoruz.",
        services: [
            { title: "Tüketici Elektroniği", desc: "Akıllı ev asistanları, giyilebilir teknolojiler ve yeni nesil mobil aksesuarlarla günlük yaşamı kolaylaştıran estetik çözümler.", icon: "smartphone", image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=2664&auto=format&fit=crop" },
            { title: "Endüstriyel Çözümler", desc: "Fabrika otomasyon sistemleri, robotik kollar ve üretim verimliliğini artıran endüstriyel sensör teknolojileri.", icon: "precision_manufacturing", image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2670&auto=format&fit=crop" },
            { title: "Ar-Ge Faaliyetleri", desc: "Gömülü sistemler, yapay zeka destekli görüntü işleme ve devre tasarımı alanlarında geleceğin teknolojilerini geliştiriyoruz.", icon: "biotech", image: "https://images.unsplash.com/photo-1581093458891-9f302dea76bd?q=80&w=2662&auto=format&fit=crop" },
            { title: "Yazılım & Entegrasyon", desc: "Donanımlarımızla tam uyumlu çalışan, kullanıcı dostu mobil uygulamalar ve bulut tabanlı yönetim panelleri.", icon: "integration_instructions", image: "https://images.unsplash.com/photo-1555421689-d68471e189f2?q=80&w=2670&auto=format&fit=crop" }
        ],
        vision: {
            title: "Teknoloji Vizyonumuz",
            desc: "Derya Elektronik olarak amacımız, teknolojiyi sadece takip eden değil, ona yön veren bir marka olmaktır.",
            items: [
                "2026'ya kadar Ar-Ge bütçemizi %50 oranında artırarak patent sayımızı ikiye katlamak.",
                "Üretim süreçlerinde sıfır atık prensibini uygulayarak çevre dostu elektronik üretimi sağlamak.",
                "Küresel pazarda \"Türk Teknolojisi\" algısını güçlendirerek ihracat ağımızı genişletmek."
            ],
            iconLabel: "İnovasyon Odaklı",
            icon: "rocket_launch"
        },
        awards: [
            { year: "2023", title: "Yılın Teknoloji Markası", desc: "TechTurkey Ödülleri kapsamında tüketici elektroniği kategorisinde birincilik.", icon: "emoji_events" },
            { year: "2022", title: "ISO 27001 Belgesi", desc: "Bilgi güvenliği yönetim sistemlerinde uluslararası standartlara tam uyum.", icon: "verified_user" },
            { year: "2021", title: "İhracat Şampiyonu", desc: "Bölgesel teknoloji ihracatında en yüksek büyümeyi kaydeden şirket ödülü.", icon: "trending_up" }
        ]
    },
    chefmezze: {
        id: "chefmezze",
        title: "ChefMezze Gıda A.Ş.",
        tag: "GIDA & HORECA",
        heroImage: "https://images.unsplash.com/photo-1544148103-0773bf10d330?q=80&w=2670&auto=format&fit=crop",
        heroTitle: "Geleneksel Lezzetin Modern Yüzü",
        heroSubtitle: "ChefMezze ile sofralarınıza değer katıyor, endüstriyel gıda çözümlerinde kalite ve lezzeti buluşturuyoruz.",

        contact: {
            address: "Üretim Tesisleri, İstanbul",
            phone: "+90 212 555 0000",
            website: "chefmezze.com.tr",
            email: "info@chefmezze.com.tr"
        },

        stats: [
            { value: "150+", label: "Ürün Çeşidi", icon: "restaurant_menu" },
            { value: "20", label: "Ton Günlük Kapasite", icon: "scale" },
            { value: "2000+", label: "Dağıtım Noktası", icon: "local_shipping" },
            { value: "%100", label: "Hijyen & Kalite", icon: "verified_user" }
        ],

        description: "Derya Grup bünyesinde faaliyet gösteren ChefMezze, gıda sektöründe \"tazelik, lezzet ve güven\" ilkeleriyle yola çıkmıştır. HoReCa (Otel, Restoran, Kafe) sektörünün ihtiyaçlarına yönelik profesyonel çözümler sunan markamız, geleneksel Türk mezelerini ve dünya mutfağından seçkin lezzetleri endüstriyel standartlarda üretmektedir.\n\nYüksek hijyen standartlarına sahip modern tesislerimizde, katkı maddesi kullanmadan, günlük ve taze hammadde ile üretim yapıyoruz. Soğuk zincir lojistik ağımız sayesinde, ürettiğimiz lezzetleri ilk günkü tazeliğinde Türkiye'nin dört bir yanındaki iş ortaklarımıza ulaştırıyoruz.",

        services: [
            { title: "Gurme Mezeler", desc: "Humus, Girit Ezmesi, Atom ve onlarca farklı çeşit, orjinal reçetelerle hazırlanıp sofralara ulaşıyor.", icon: "tapas", image: "https://images.unsplash.com/photo-1541529086526-db283c563270?q=80&w=2670&auto=format&fit=crop" },
            { title: "Hazır Yemek Çözümleri", desc: "İşletmeler için pratik, ısıl-servis et formatında, maliyet avantajı sağlayan lezzetli ana yemekler.", icon: "lunch_dining", image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=2680&auto=format&fit=crop" },
            { title: "Catering ve Etkinlik", desc: "Özel davetler, kurumsal etkinlikler ve organizasyonlar için toplu üretim ve menü planlama desteği.", icon: "room_service", image: "https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=2670&auto=format&fit=crop" },
            { title: "AR-GE ve İnovasyon", desc: "Sürekli yeni tatlar geliştiren mutfak ekibimizle, pazar trendlerine uygun yenilikçi ürün çalışmaları.", icon: "science", image: "https://images.unsplash.com/photo-1606787366850-de6330128bfc?q=80&w=2670&auto=format&fit=crop" }
        ],

        vision: {
            title: "Mutfak Vizyonumuz",
            desc: "ChefMezze olarak hedefimiz, Türk gastronomisinin zengin meze kültürünü dünyaya tanıtmak ve endüstriyel üretimde ev yapımı lezzet standartlarını korumaktır.",
            items: [
                "Sürdürülebilir tarım kaynaklarını destekleyerek doğal hammadde tedariği.",
                "Koruyucu içermeyen, temiz etiketli (clean label) ürün gamını genişletmek.",
                "Avrupa ve Ortadoğu pazarında ihracat lideri olmak."
            ]
        },

        awards: [
            { year: "2023", title: "ISO 22000", desc: "Gıda Güvenliği Yönetim Sistemi sertifikası ile tescilli üretim kalitesi.", icon: "verified" },
            { year: "2022", title: "%100 Doğal", desc: "Ürünlerimizde hiçbir yapay renklendirici ve koruyucu kullanılmamaktadır.", icon: "eco" },
            { year: "2021", title: "Lezzet Ödülü", desc: "Uluslararası Lezzet Enstitüsü tarafından verilen 'Üstün Lezzet Ödülü'.", icon: "star" }
        ]
    },
    marble: {
        id: "marble",
        title: "Derya Marble A.Ş.",
        tag: "DOĞAL TAŞ & MERMER",
        heroImage: "https://images.unsplash.com/photo-1618221639257-2eec3c734493?q=80&w=2574&auto=format&fit=crop",
        heroTitle: "Doğanın Sanata Dönüştüğü Yer",
        heroSubtitle: "Derya MARBLE, Anadolu'nun eşsiz doğal taşlarını modern teknolojiyle işleyerek dünya projelerine değer katıyor.",
        contact: {
            address: "İscehisar, Afyonkarahisar",
            phone: "+90 272 000 0000",
            website: "deryamarble.com",
            email: "info@deryamarble.com",
            buttonText: "Katalog İndir",
            buttonIcon: "download"
        },
        stats: [
            { value: "35+", label: "Ülkeye İhracat", icon: "public" },
            { value: "600k", label: "Yıllık Üretim (m²)", icon: "conveyor_belt" },
            { value: "6", label: "Aktif Ocak", icon: "landscape" },
            { value: "20+", label: "Yıllık Deneyim", icon: "history" }
        ],
        description: "Derya MARBLE, sektördeki 20 yıllık tecrübesiyle Türkiye'nin en zengin mermer rezervlerine sahip bölgelerinde faaliyet göstermektedir. Afyonkarahisar'daki modern tesislerimizde, doğanın bize sunduğu eşsiz taşları sanatla buluşturuyor; blok, plaka ve ebatlı ürünler olarak dünya pazarına sunuyoruz.\n\nSürdürülebilir madencilik ilkelerine bağlı kalarak, ocaklarımızdan çıkardığımız her bir taşı en verimli şekilde değerlendiriyoruz. İtalya, ABD, Çin ve Orta Doğu başta olmak üzere 35'ten fazla ülkeye gerçekleştirdiğimiz ihracatla, Türk mermerinin kalitesini ve estetiğini global ölçekte temsil etmekten gurur duyuyoruz.",
        services: [
            { title: "Blok Mermer", desc: "Kendi ocaklarımızdan özenle seçilen, yüksek kaliteli ve farklı seleksiyonlardaki ham mermer blokları.", icon: "view_in_ar", image: "https://images.unsplash.com/photo-1629196914375-f7e48f477b6d?q=80&w=2588&auto=format&fit=crop" },
            { title: "Plaka Mermer", desc: "Son teknoloji katraklarda kesilen, epoksi ve cila işlemleri tamamlanmış, uygulamaya hazır plaka mermerler.", icon: "layers", image: "https://images.unsplash.com/photo-1618221639257-2eec3c734493?q=80&w=2574&auto=format&fit=crop" },
            { title: "Özel Kesim & Tasarım", desc: "Waterjet teknolojisi ile mimari projelerinize özel ölçülerde kesim ve desen uygulamaları.", icon: "design_services", image: "https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=2600&auto=format&fit=crop" }
        ],
        vision: {
            title: "Mermer Vizyonumuz",
            desc: "Doğal taşın zarafetini yaşam alanlarına taşımak.",
            items: ["Global pazar payını artırmak.", "Çevreye duyarlı madencilik.", "Katma değerli ürün ihracatı."]
        },
        awards: [
            { year: "2023", title: "İhracat Yıldızı", desc: "Madencilik sektörü ödülü.", icon: "emoji_events" },
            { year: "2022", title: "Kalite Ödülü", desc: "Ürün kalitesi tescili.", icon: "verified" },
            { year: "2021", title: "Çevre Ödülü", desc: "Doğa dostu üretim.", icon: "eco" }
        ]
    },
    bilisim: {
        id: "bilisim",
        title: "Derya Bilişim",
        tag: "BİLİŞİM & TEKNOLOJİ",
        heroImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2672&auto=format&fit=crop",
        heroTitle: "Derya Bilişim",
        heroSubtitle: "Geleceği şekillendiren teknolojik inovasyonlar ve müşteri odaklı yazılım çözümleri ile işletmenizi dijital çağa taşıyın.",
        contact: {
            address: "Teknopark, İstanbul",
            phone: "+90 212 555 0000",
            website: "deryabilisim.com",
            email: "info@deryagrup.com",
            buttonText: "Hizmetlerimizi Keşfedin",
            buttonIcon: "arrow_forward"
        },
        stats: [
            { value: "100+", label: "Başarılı Proje", icon: "task_alt" },
            { value: "50+", label: "Uzman Yazılımcı", icon: "code" },
            { value: "%99.9", label: "Uptime Garantisi", icon: "cloud_done" },
            { value: "7/24", label: "Teknik Destek", icon: "headset_mic" }
        ],
        description: "Derya Bilişim, dijital dönüşüm yolculuğunuzda size rehberlik eden, yenilikçi ve güvenilir bir teknoloji ortağıdır. İşletmelerin verimliliğini artıran özel yazılım çözümleri, siber güvenlik stratejileri ve güvenli altyapı hizmetleri sunuyoruz.\n\nTeknolojinin hızla geliştiği dünyada, müşterilerimize en güncel ve etkili çözümleri sunarak rekabet avantajı sağlıyoruz. Uzman ekibimizle, iş süreçlerinizi optimize ediyor ve geleceğe güvenle bakmanızı sağlıyoruz.",
        services: [
            { title: "Yazılım Geliştirme", desc: "İhtiyaçlarınıza özel web ve mobil uygulamalar ile iş süreçlerinizi dijitalleştirin.", icon: "code", image: "https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?q=80&w=2670&auto=format&fit=crop" },
            { title: "Siber Güvenlik", desc: "Verilerinizi koruyan, tehditleri önleyen ve güvenli bir dijital altyapı oluşturun.", icon: "security", image: "https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?q=80&w=2670&auto=format&fit=crop" },
            { title: "Bulut Çözümleri", desc: "Esnek, ölçeklenebilir ve erişilebilir bulut mimarileri ile maliyetleri düşürün.", icon: "cloud", image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=2670&auto=format&fit=crop" },
            { title: "IT Danışmanlığı", desc: "Stratejik planlama ve teknoloji yol haritası ile dijital dönüşümünüzü hızlandırın.", icon: "psychology", image: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2670&auto=format&fit=crop" }
        ],
        vision: {
            title: "İşletmenize Değer Katan Çözümler",
            desc: "Sadece yazılım üretmiyoruz; iş modelinizi güçlendiren stratejik ortaklıklar kuruyoruz.",
            items: ["Yapay zeka destekli analiz araçları", "Endüstri 4.0 uyumlu entegrasyonlar", "Kesintisiz teknik destek"]
        },
        awards: [
            { year: "2023", title: "İnovasyon", desc: "Yazılım ödülü.", icon: "lightbulb" },
            { year: "2022", title: "Büyüme", desc: "En hızlı büyüyen teknoloji şirketi.", icon: "trending_up" },
            { year: "2021", title: "Güvenlik", desc: "Veri güvenliği ödülü.", icon: "shield" }
        ],
        bottomCTA: {
            title: "Dijital Dönüşümünüzü Başlatın",
            desc: "Projelerinizi hayata geçirmek için bizimle iletişime geçin.",
            buttonText: "Bize Ulaşın",
            link: "#contact"
        }
    },
    tasarim: {
        id: "tasarim",
        title: "D Yapı Tasarım",
        tag: "MİMARİ & İÇ MEKAN TASARIMI",
        theme: "dark",
        heroImage: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2653&auto=format&fit=crop",
        heroTitle: "Estetik ve Fonksiyonun Buluşma Noktası",
        heroSubtitle: "D Yapı Tasarım olarak, sanatsal vizyonu mühendislik hassasiyetiyle birleştiriyor, yaşam alanlarına modern bir dokunuş katıyoruz.",
        contact: {
            address: "Nişantaşı, İstanbul",
            phone: "+90 212 555 0123",
            website: "dyapitasarim.com.tr",
            email: "info@dyapyapi.com.tr",
            buttonText: "Projelerimizi İnceleyin",
            buttonIcon: "design_services"
        },
        stats: [
            { value: "15+", label: "YILLIK TECRÜBE", icon: "history" },
            { value: "200+", label: "TAMAMLANAN PROJE", icon: "task_alt" },
            { value: "45", label: "ÖDÜL & BAŞARI", icon: "emoji_events" },
            { value: "%100", label: "MÜŞTERİ MEMNUNİYETİ", icon: "favorite" }
        ],
        description: "D Yapı Tasarım, Derya Grup bünyesinde mimari proje ve uygulama hizmetleri veren bir tasarım stüdyosudur. Her projeyi kendine özgü bir hikaye olarak ele alıyor, mekanın ruhunu, işlevsellikle harmanlıyoruz.\n\nOfis, konut, otel ve ticari alanlardan, kamusal alan düzenlemelerine kadar geniş bir yelpazede hizmet vermekteyiz. Amacımız sadece bina inşa etmek değil, yaşam kalitesini artıran deneyimler tasarlamaktır.",
        services: [
            { title: "Mimari Projelendirme", desc: "Konut, ticari ve karma kullanım projeleri için kapsamlı mimari tasarım ve ruhsatlandırma süreçleri.", icon: "architecture", image: "https://images.unsplash.com/photo-1486325212027-8081e485255e?q=80&w=2670&auto=format&fit=crop" },
            { title: "İç Mimari", desc: "Yaşam alanlarınıza karakter katan, ergonomik ve şık iç mekan tasarımları.", icon: "chair", image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2500&auto=format&fit=crop" },
            { title: "Kentsel Tasarım", desc: "Şehirlerin dokusunu geliştiren, kamusal alanlar ve meydanlar için sürdürülebilir çevre düzenleme projeleri.", icon: "park", image: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=2744&auto=format&fit=crop" }
        ],
        vision: {
            title: "Detaylarda Gizli Mükemmellik",
            desc: "Vizyonumuz, her detayda kaliteyi hissettiren, zamansız tasarımlar yaratmaktır.",
            items: [
                "Sürdürülebilir Tasarım: Doğal ışığı ve enerjiyi verimli kullanan yapılar tasarlıyoruz.",
                "Yenilikçi Yaklaşım: En son teknoloji ve tasarım trendlerini el işçiliğiyle birleştiriyoruz."
            ],
            iconLabel: "Tasarım Gücü",
            icon: "brush"
        },
        awards: [
            { year: "2023", title: "Tasarım Ödülü", desc: "Yılın iç mimari projesi.", icon: "design_services" },
            { year: "2022", title: "Yaratıcılık", desc: "Tasarım haftası ödülü.", icon: "palette" },
            { year: "2021", title: "Uygulama", desc: "Proje uygulama başarısı.", icon: "construction" }
        ],
        projects: [
            { title: "Vadi Konakları", image: "https://images.unsplash.com/photo-1600596542815-e495d915998d?q=80&w=2675&auto=format&fit=crop" },
            { title: "Derya Plaza", image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2669&auto=format&fit=crop" },
            { title: "Luna Cafe & Bistro", image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=2694&auto=format&fit=crop" },
            { title: "Merkez Park Projesi", image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b91d?q=80&w=2574&auto=format&fit=crop" }
        ],
        bottomCTA: {
            title: "Hayalinizdeki Projeyi Birlikte Gerçekleştirelim",
            desc: "Mimari ve iç mimari ihtiyaçlarınız için profesyonel ekibimizle tanışın.",
            buttonText: "Bize Ulaşın",
            link: "#contact"
        }
    },
    yapi: {
        id: "yapi",
        title: "Derya Yapı",
        tag: "YAPI & İNŞAAT",
        heroImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2670&auto=format&fit=crop",
        heroTitle: "Geleceği Temelinden İnşa Ediyoruz",
        heroSubtitle: "Derya Yapı olarak, çeyrek asrı aşkın tecrübemizle modern mimari anlayışını, mühendislik çözümleri ve estetik tasarım ile buluşturuyoruz. Güvenli, sürdürülebilir ve kaliteli yapılarımızla yaşam standartlarını yükseltmeyi hedefliyoruz.",
        contact: {
            address: "Merkez Ofis, İstanbul",
            phone: "+90 212 555 0008",
            website: "deryayapi.com",
            email: "info@deryayapi.com",
            buttonText: "Projemizi İnceleyin",
            buttonIcon: "arrow_forward"
        },
        stats: [
            { value: "25+", label: "Yıl Sektörel Tecrübe", icon: "calendar_month" },
            { value: "150+", label: "Tamamlanan Proje", icon: "apartment" },
            { value: "5000+", label: "Mutlu Aile", icon: "groups" },
            { value: "1M+ m²", label: "İnşaat Alanı", icon: "straighten" }
        ],
        description: "Derya Grup bünyesinde faaliyet gösteren Derya Yapı, büyük ölçekli inşaat ve gayrimenkul geliştirme projelerinde sektörün öncü markalarından biridir. İnsan odaklı yaklaşımımızla, sadece bina değil, yaşam kalitesini artıran sürdürülebilir ekosistemler kuruyoruz. Teknolojiyi ve doğayı harmanlayan projelerimizle şehirlere değer katıyoruz.",
        services: [
            { title: "Konut Projeleri", desc: "Ailenizin güvenle, sosyal olanakları zengin, modern ve konforlu yaşam merkezleri tasarlıyoruz.", icon: "home", image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=2670&auto=format&fit=crop" },
            { title: "Ticari Yapılar", desc: "İş dünyasının ihtiyaçlarına uygun, prestijli ofisler, alışveriş merkezleri ve karma kullanım projeleri.", icon: "business", image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2669&auto=format&fit=crop" },
            { title: "Altyapı Projeleri", desc: "Şehirlerin gelişimine katkı sağlayan köprü, yol ve kamusal alan düzenlemeleri ile sağlam altyapılar.", icon: "bridge", image: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=2744&auto=format&fit=crop" }
        ],
        vision: {
            title: "Güven ve Kalite ile Yükselen Değerler",
            desc: "Derya Yapı olarak, sektördeki standartları belirleyen bir vizyonla hareket ediyoruz.",
            items: ["Yüksek Standartlı Malzeme", "Zamanında Teslimat", "Uzman Mühendislik Kadrosu", "Sürdürülebilir Mimari"]
        },
        awards: [
            { year: "2023", title: "Sürdürülebilirlik", desc: "Çevreye duyarlı proje ödülü.", icon: "eco" },
            { year: "2022", title: "Güvenlik", desc: "İSG standartlarına tam uyum ödülü.", icon: "security" },
            { year: "2021", title: "Yenilikçilik", desc: "En inovatif inşaat projesi.", icon: "tips_and_updates" }
        ],
        bottomCTA: {
            title: "Hayalinizdeki Projeyi Birlikte Gerçekleştirelim",
            desc: "Konut, ofis veya büyük ölçekli yatırım projeleriniz için uzman ekibimizle tanışın.",
            buttonText: "Bize Ulaşın",
            link: "#contact"
        }
    }
}
