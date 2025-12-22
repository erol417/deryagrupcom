
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const multer = require('multer');
const multler = require('multer');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const rateLimit = require('express-rate-limit');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 3003;

// Veri Dosyalarının Yolları
const JOBS_FILE = path.join(__dirname, 'data', 'jobs.json');
const APPS_FILE = path.join(__dirname, 'data', 'applications.json');
const CULTURE_FILE = path.join(__dirname, 'data', 'culture.json');
const ANALYTICS_FILE = path.join(__dirname, 'data', 'analytics.json');

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- MAIL TRANSPORTER AYARLARI ---
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'deryagrupcom@gmail.com',
        pass: 'yutxmbkawrpdnzlv' // Boşluksuz yazıldı
    }
});

// --- RATE LIMITING (GÜVENLİK) ---
// Proxy arkasında çalışıyorsa IP'yi doğru almak için
app.set('trust proxy', 1);

// 1. Genel API Limiti (DDoS Koruması): Her IP için 15 dakikada 300 istek
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: 'Çok fazla istek gönderdiniz, lütfen 15 dakika sonra tekrar deneyin.' }
});

// 2. Hassas İşlem Limiti (Brute-Force & Spam Koruması): 15 dakikada max 10 deneme
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: 'Çok fazla işlem denemesi yaptınız. Lütfen 15 dakika bekleyin.' }
});

// Genel limiti tüm /api endpointlerine uygula
app.use('/api/', apiLimiter);

// Dosya yükleme ayarları (Disk'e kaydetme)
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, 'uploads'))
    },
    filename: function (req, file, cb) {
        // Dosya adı çakışmasını önlemek için tarih ekliyoruz
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        // Türkçe karakter ve boşluk sorununu çözmek için sanitize et
        const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9.]/g, '_');
        cb(null, uniqueSuffix + '-' + sanitizedName)
    }
});

// Güvenlik: 5MB Limit ve Dosya Tipi Filtresi
const limits = { fileSize: 5 * 1024 * 1024 }; // 5MB

const fileFilter = (req, file, cb) => {
    const allowedMimes = [
        'image/jpeg', 'image/png', 'image/webp', // Görseller
        'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' // Dokümanlar
    ];
    if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Geçersiz dosya türü! Sadece resim ve belge (PDF, DOC) yüklenebilir.'), false);
    }
};

const upload = multer({ storage, limits, fileFilter });

// Eski transporter tanımını siliyoruz veya yukarı taşıdık, burayı boş geçiyoruz.
// (Not: Yukarıdaki chunk zaten tanımladı)

// Yardımcı Fonksiyonlar: JSON Okuma/Yazma
const readData = (filePath) => {
    if (!fs.existsSync(filePath)) return [];
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
};

const writeData = (filePath, data) => {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

// --- CAPTCHA MIDDLEWARE ---
const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY || '6LdPFjEsAAAAAHztYqa_6SYCTQQHoMsEErOOB1hx';

const verifyCaptcha = async (req, res, next) => {
    // Domain sorunu nedeniyle Captcha geçici olarak devre dışı bırakıldı
    next();
};

// --- ENDPOINTS ---



// 2. BAŞVURULAR (Applications)
app.post('/api/apply', upload.single('cv'), authLimiter, verifyCaptcha, async (req, res) => {
    try {
        const { name, surname, email, phone, position, coverLetter, consent } = req.body;
        const cvFile = req.file;

        if (!cvFile) {
            return res.status(400).json({ success: false, message: 'Lütfen CV dosyanızı yükleyin.' });
        }

        // 1. Veritabanına Kaydet
        const applications = readData(APPS_FILE);
        const newApp = {
            id: Date.now(),
            date: new Date().toISOString(),
            name, surname, email, phone, position, coverLetter, consent,
            cvPath: cvFile.filename // Dosya adını saklıyoruz
        };
        applications.push(newApp);
        writeData(APPS_FILE, applications);

        // 2. Mail Gönder (Opsiyonel: İK isteğine göre mail gitmese de olur ama "hem mail gitsin" dendi)
        // Not: Eğer gerçek mail ayarı yapılmadıysa burası hata verebilir, try-catch içinde logluyoruz ama akışı bozmuyoruz.
        try {
            const mailOptions = {
                from: `"Derya Grup Kariyer" <${process.env.EMAIL_USER}>`,
                to: 'deryagrupcom@gmail.com',
                subject: `Yeni İş Başvurusu: ${name} ${surname} - ${position}`,
                html: `
                    <h3>Yeni İş Başvurusu</h3>
                    <p><strong>Aday:</strong> ${name} ${surname}</p>
                    <p><strong>Pozisyon:</strong> ${position}</p>
                    <p>Yönetim paneline giderek CV'yi inceleyebilirsiniz.</p>
                `,
                attachments: [{ path: cvFile.path }]
            };
            await transporter.sendMail(mailOptions);
            console.log('Mail gönderildi.');
        } catch (mailError) {
            console.error('Mail gönderilemedi (Veritabanına kaydedildi):', mailError.message);
        }

        res.status(200).json({ success: true, message: 'Başvurunuz başarıyla alındı.' });

    } catch (error) {
        console.error('Başvuru hatası:', error);
        res.status(500).json({ success: false, message: 'Sunucu hatası.' });
    }
});

// 2.1 İLETİŞİM FORMU (Contact)
app.post('/api/contact', authLimiter, verifyCaptcha, async (req, res) => {
    try {
        const { name, surname, email, message } = req.body;

        const mailOptions = {
            from: `"Derya Grup İletişim" <${process.env.EMAIL_USER}>`,
            to: 'deryagrupcom@gmail.com',
            subject: `İletişim Formu: ${name} ${surname}`,
            html: `
                <h3>Yeni İletişim Mesajı</h3>
                <p><strong>Ad Soyad:</strong> ${name} ${surname}</p>
                <p><strong>E-posta:</strong> ${email}</p>
                <p><strong>Mesaj:</strong></p>
                <p>${message}</p>
            `
        };

        await transporter.sendMail(mailOptions);
        res.json({ success: true, message: 'Mesajınız başarıyla iletildi.' });

    } catch (error) {
        console.error('Contact Error:', error);
        res.status(500).json({ success: false, message: 'Mesaj gönderilemedi.' });
    }
});

app.get('/api/applications', (req, res) => {
    const apps = readData(APPS_FILE);
    // Yeni başvurular üstte olsun
    res.json(apps.reverse());
});

app.put('/api/applications/:id', (req, res) => {
    const apps = readData(APPS_FILE);
    const appId = parseInt(req.params.id);
    const appIndex = apps.findIndex(a => a.id === appId);

    if (appIndex === -1) {
        return res.status(404).json({ success: false, message: 'Başvuru bulunamadı.' });
    }

    // Mevcut veriyi koru, gelen verilerle (not, puan vb.) güncelle
    apps[appIndex] = { ...apps[appIndex], ...req.body };

    writeData(APPS_FILE, apps);
    res.json({ success: true, message: 'Başvuru güncellendi.', application: apps[appIndex] });
});

// 3. LOGİN (Admin & Managers & Super) & CONTENT
const CONTENT_FILE = path.join(__dirname, 'data', 'company_content.json');
const USERS_FILE = path.join(__dirname, 'data', 'users.json');

// LOGİN (1. Adım: Kullanıcı Adı/Şifre Kontrolü ve Kod Gönderimi)
app.post('/api/login', authLimiter, verifyCaptcha, async (req, res) => {
    const { username, password } = req.body;
    const users = readData(USERS_FILE);
    const userIndex = users.findIndex(u => u.username === username && u.password === password);

    if (userIndex !== -1) {
        const user = users[userIndex];

        // 6 haneli kod üret
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        const expires = Date.now() + 5 * 60 * 1000; // 5 dakika geçerli

        // Kodu kullanıcı verisine (dosyaya) kaydet
        users[userIndex].twoFactorCode = code;
        users[userIndex].twoFactorExpires = expires;
        writeData(USERS_FILE, users);

        // Mail Gönder
        try {
            await transporter.sendMail({
                from: `"Derya Grup Güvenlik" <${process.env.EMAIL_USER}>`,
                to: user.email || 'deryagrupcom@gmail.com', // Kullanıcının maili yoksa default maile gönder
                subject: 'Giriş Doğrulama Kodu',
                html: `<h3>Doğrulama Kodunuz: <span style="font-size: 24px; color: blue;">${code}</span></h3><p>Bu kod 5 dakika süreyle geçerlidir.</p>`
            });

            // Frontend'e "2FA Gerekli" cevabı dön
            // Güvenlik: Email'in tamamını gösterme, maskele (örn: d****@gmail.com)
            const maskedEmail = user.email ? user.email.replace(/(.{2})(.*)(@.*)/, "$1****$3") : 'mail adresinize';
            res.json({ success: true, require2FA: true, userId: user.id, message: `Doğrulama kodu ${maskedEmail} adresine gönderildi.` });

        } catch (error) {
            console.error('Mail Hatası:', error);
            res.status(500).json({ success: false, message: 'Kod gönderilemedi. SMTP ayarlarını kontrol edin.' });
        }

    } else {
        res.status(401).json({ success: false, message: 'Hatalı kullanıcı adı veya şifre.' });
    }
});

// LOGİN (2. Adım: Kod Doğrulama)
app.post('/api/verify-2fa', authLimiter, (req, res) => {
    const { userId, code } = req.body;
    const users = readData(USERS_FILE);
    const user = users.find(u => u.id === userId);

    if (!user) return res.status(404).json({ success: false, message: 'Kullanıcı bulunamadı.' });

    if (user.twoFactorCode === code && user.twoFactorExpires > Date.now()) {
        // Kod doğru ve süresi dolmamış

        // Kodu temizle
        delete user.twoFactorCode;
        delete user.twoFactorExpires;
        // Dosyayı güncelle (user referans olduğu için users arrayi güncellenir mi? Evet find referans döner ama emin olmak için index bulup update edelim)
        const index = users.findIndex(u => u.id === userId);
        users[index] = user;
        writeData(USERS_FILE, users);

        const { password, twoFactorCode, twoFactorExpires, ...tokenData } = user;
        res.json({ success: true, user: tokenData });
    } else {
        res.status(400).json({ success: false, message: 'Geçersiz veya süresi dolmuş kod!' });
    }
});

// --- KULLANICI YÖNETİMİ (Sadece Super Admin) ---
app.get('/api/users', (req, res) => {
    const users = readData(USERS_FILE);
    // Şifreleri frontend'e gönderme
    const safeUsers = users.map(({ password, ...u }) => u);
    res.json(safeUsers);
});

app.post('/api/users', (req, res) => {
    const users = readData(USERS_FILE);
    const { username, name, password, role, scope, email } = req.body;

    if (users.find(u => u.username === username)) {
        return res.status(400).json({ success: false, message: 'Bu kullanıcı adı zaten kullanılıyor.' });
    }

    const newUser = {
        id: Date.now(),
        username,
        password, // Gerçek projede hashlenmeli
        name,
        email,
        role,
        scope: scope || 'all'
    };

    users.push(newUser);
    writeData(USERS_FILE, users);
    res.json({ success: true, user: newUser });
});

app.put('/api/users/:id', (req, res) => {
    const users = readData(USERS_FILE);
    const userId = parseInt(req.params.id);
    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex === -1) return res.status(404).json({ success: false });

    // Mevcut verilerle birleştir (Şifre boş gelirse güncelleme)
    const updatedUser = {
        ...users[userIndex],
        ...req.body,
        password: req.body.password || users[userIndex].password
    };

    users[userIndex] = updatedUser;
    writeData(USERS_FILE, users);
    res.json({ success: true });
});

app.delete('/api/users/:id', (req, res) => {
    let users = readData(USERS_FILE);
    users = users.filter(u => u.id != req.params.id);
    writeData(USERS_FILE, users);
    res.json({ success: true });
});

// Şirket İçeriklerini Getir
app.get('/api/company-content/:id', (req, res) => {
    const content = readData(CONTENT_FILE);
    const companyData = content[req.params.id] || { brands: [], projects: [] };
    res.json(companyData);
});

// --- YASAL METİNLER (Legal) ---
const LEGAL_FILE = path.join(__dirname, 'company_content_legal.json');

app.get('/api/legal', (req, res) => {
    // Dosya yoksa oluştur (Boş obje)
    if (!fs.existsSync(LEGAL_FILE)) {
        fs.writeFileSync(LEGAL_FILE, JSON.stringify({ kvkk: '', cookiePolicy: '', cookiePreferences: '' }));
    }
    const data = readData(LEGAL_FILE);
    res.json(data);
});

app.put('/api/legal', (req, res) => {
    try {
        writeData(LEGAL_FILE, req.body);
        res.json({ success: true, message: 'Yasal metinler güncellendi.' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Güncelleme hatası.' });
    }
});

// --- İLETİŞİM BİLGİLERİ (Contact Info) ---
const CONTACT_INFO_FILE = path.join(__dirname, 'contact_info.json');

app.get('/api/contact-info', (req, res) => {
    if (!fs.existsSync(CONTACT_INFO_FILE)) {
        // Varsayılan dosya oluştur
        const defaultInfo = {
            address: "Adres giriniz",
            phone: "+90 216 000 00 00",
            email: "info@ornek.com",
            mapUrl: ""
        };
        fs.writeFileSync(CONTACT_INFO_FILE, JSON.stringify(defaultInfo));
    }
    const data = readData(CONTACT_INFO_FILE);
    res.json(data);
});

app.post('/api/contact-info', (req, res) => {
    try {
        writeData(CONTACT_INFO_FILE, req.body);
        res.json({ success: true, message: 'İletişim bilgileri güncellendi.' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Güncelleme hatası.' });
    }
});

// --- ANA SAYFA BÖLÜMLERİ (Vision/Mission/Achievements) ---
const HOME_SECTIONS_FILE = path.join(__dirname, 'home_sections.json');

app.get('/api/home-sections', (req, res) => {
    if (!fs.existsSync(HOME_SECTIONS_FILE)) {
        res.json({ achievements: [], visionMission: {} });
    } else {
        res.json(readData(HOME_SECTIONS_FILE));
    }
});

app.post('/api/home-sections', (req, res) => {
    try {
        writeData(HOME_SECTIONS_FILE, req.body);
        res.json({ success: true, message: 'Ana sayfa bölümleri güncellendi.' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Güncelleme hatası.' });
    }
});

const sharp = require('sharp'); // Resim işleme kütüphanesi

// Marka Logoları İçin Storage Ayarı
const brandStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        // __dirname: server klasörünü gösterir. Buradan uploads/brands'e gidiyoruz.
        const dir = path.join(__dirname, 'uploads', 'brands');
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname.replace(/[^a-zA-Z0-9.]/g, '_'));
    }
});
const uploadBrand = multer({ storage: brandStorage, limits, fileFilter });

// Yardımcı Fonksiyon: Resmi Boyutlandır (400x200, Contain, Transparent)
const processBrandLogo = async (filePath) => {
    try {
        const image = sharp(filePath);
        const metadata = await image.metadata();

        // Geçici dosya yolu
        const tempPath = filePath + '.tmp.png';

        await image
            .resize(400, 200, {
                fit: 'contain', // Resmi kutuya sığdır (Kesme yapmaz, boşluk bırakır)
                background: { r: 0, g: 0, b: 0, alpha: 0 } // Şeffaf arka plan
            })
            .toFormat('png') // Her zaman PNG'ye çevir (Şeffaflık için)
            .toFile(tempPath);

        // Orijinal dosyayı silip işlenmiş olanı yerine koy
        fs.unlinkSync(filePath);
        fs.renameSync(tempPath, filePath); // Uzantı orijinal kalabilir veya .png yapılabilir ama basitlik için yol aynı kalsın
    } catch (error) {
        console.error("Resim işleme hatası:", error);
    }
};

// Yeni Marka Ekle (Resimli)
app.post('/api/company-content/:id/brand', uploadBrand.single('logo'), async (req, res) => {
    const content = readData(CONTENT_FILE);
    const companyId = req.params.id;
    const { name, logoText, description, url, tags } = req.body;

    // Resmi otomatik boyutlandır
    if (req.file) {
        await processBrandLogo(req.file.path);
    }

    const newBrand = {
        id: Date.now(),
        name,
        logoText,
        description,
        url,
        tags: tags ? (tags.trim().startsWith('[') ? JSON.parse(tags) : tags.split(',').map(t => t.trim())) : [], // Frontend stringify edilmiş array gönderir
        logoPath: req.file ? `brands/${req.file.filename}` : null
    };

    if (!content[companyId]) {
        content[companyId] = { brands: [], projects: [] };
    }

    content[companyId].brands.push(newBrand);
    writeData(CONTENT_FILE, content);

    res.json({ success: true, brand: newBrand });
});

// Marka Güncelle (Resimli/Resimsiz)
app.put('/api/company-content/:id/brand/:brandId', uploadBrand.single('logo'), async (req, res) => {
    const content = readData(CONTENT_FILE);
    const companyId = req.params.id;
    const brandId = parseInt(req.params.brandId);
    const { name, logoText, description, url, tags } = req.body;

    if (!content[companyId] || !content[companyId].brands) {
        return res.status(404).json({ success: false, message: 'Şirket veya marka bulunamadı.' });
    }

    const brandIndex = content[companyId].brands.findIndex(b => b.id === brandId);
    if (brandIndex === -1) {
        return res.status(404).json({ success: false, message: 'Marka bulunamadı.' });
    }

    // Resmi otomatik boyutlandır
    if (req.file) {
        await processBrandLogo(req.file.path);
    }

    const currentBrand = content[companyId].brands[brandIndex];

    const updatedBrand = {
        ...currentBrand,
        name,
        logoText,
        description,
        url,
        tags: tags ? (tags.trim().startsWith('[') ? JSON.parse(tags) : tags.split(',').map(t => t.trim())) : currentBrand.tags,
        // Yeni dosya varsa güncelle, yoksa eskisini koru
        logoPath: req.file ? `brands/${req.file.filename}` : currentBrand.logoPath
    };

    content[companyId].brands[brandIndex] = updatedBrand;
    writeData(CONTENT_FILE, content);

    res.json({ success: true, brand: updatedBrand });
});

// Şirket İçeriklerini Güncelle (Silme ve Düzenleme İçin - Resimsiz)
app.post('/api/company-content/:id', (req, res) => {
    const allContent = readData(CONTENT_FILE);
    const companyId = req.params.id;

    // Sadece ilgili alanı güncelle, diğerlerini koru
    allContent[companyId] = {
        ...allContent[companyId],
        ...req.body
    };

    writeData(CONTENT_FILE, allContent);
    res.json({ success: true, message: 'İçerik güncellendi.' });
});

// Tüm Şirketlerin Markalarını Tek Listede Getir (Ana Sayfa Marquee için)
app.get('/api/all-brands', (req, res) => {
    const content = readData(CONTENT_FILE);
    let allBrands = [];

    // Her şirketin içindeki 'brands' arrayini topla
    Object.values(content).forEach(company => {
        if (company.brands && Array.isArray(company.brands)) {
            allBrands = [...allBrands, ...company.brands];
        }
    });

    res.json(allBrands);
});

// --- HABERLER (News) ---
const NEWS_FILE = path.join(__dirname, 'data', 'news.json');

// Haber Resimleri İçin Storage
const newsStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = path.join(__dirname, 'uploads', 'news');
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        const sanitized = file.originalname.replace(/[^a-zA-Z0-9.]/g, '_');
        cb(null, `news-${Date.now()}-${sanitized}`);
    }
});
const uploadNews = multer({ storage: newsStorage, limits, fileFilter });

// Tüm Haberleri Getir
app.get('/api/news', (req, res) => {
    const news = readData(NEWS_FILE);
    // En yeni en üstte
    res.json(news.sort((a, b) => new Date(b.date) - new Date(a.date)));
});

// Tek Haber Getir
app.get('/api/news/:id', (req, res) => {
    const news = readData(NEWS_FILE);
    const item = news.find(n => n.id == req.params.id);
    if (item) res.json(item);
    else res.status(404).json({ message: 'Haber bulunamadı' });
});

// Haber Ekle
app.post('/api/news', uploadNews.single('image'), (req, res) => {
    const news = readData(NEWS_FILE);
    const { title, summary, content, date, category, imagePath } = req.body;

    const newItem = {
        id: Date.now(),
        title,
        summary,
        content,
        category: category || 'Genel',
        date: date || new Date().toISOString(),
        imagePath: req.file ? req.file.filename : (imagePath || null)
    };

    news.push(newItem);
    writeData(NEWS_FILE, news);
    res.json({ success: true, news: newItem });
});

// Haber Güncelle
app.put('/api/news/:id', uploadNews.single('image'), (req, res) => {
    const news = readData(NEWS_FILE);
    const id = parseInt(req.params.id);
    const index = news.findIndex(n => n.id === id);

    if (index === -1) return res.status(404).json({ success: false, message: 'Haber bulunamadı' });

    const currentItem = news[index];
    const { title, summary, content, date, category, imagePath } = req.body;

    const updatedItem = {
        ...currentItem,
        title: title || currentItem.title,
        summary: summary || currentItem.summary,
        content: content || currentItem.content,
        category: category || currentItem.category || 'Genel',
        date: date || currentItem.date,
        imagePath: req.file ? req.file.filename : (imagePath || currentItem.imagePath)
    };

    news[index] = updatedItem;
    writeData(NEWS_FILE, news);
    res.json({ success: true, news: updatedItem });
});

// Haber Sil
app.delete('/api/news/:id', (req, res) => {
    let news = readData(NEWS_FILE);
    const id = parseInt(req.params.id);
    const item = news.find(n => n.id === id);

    if (item && item.imagePath) {
        // Resmi de silebiliriz (Opsiyonel, şimdilik kalsın)
    }

    news = news.filter(n => n.id !== id);
    writeData(NEWS_FILE, news);
    res.json({ success: true });
});

// --- SOCIAL MEDIA (Admin Managed) ---
const SOCIAL_FILE = path.join(__dirname, 'data', 'social.json');

// Storage
const socialStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = path.join(__dirname, 'uploads', 'social');
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        cb(null, `social-${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9.]/g, '_')}`);
    }
});
const uploadSocial = multer({ storage: socialStorage, limits, fileFilter });

// Get All
app.get('/api/social', (req, res) => {
    let data = readData(SOCIAL_FILE);
    // Dosya boşsa veya array dönmüşse (readData default) init et
    if (Array.isArray(data) || !data.posts) {
        data = { isVisible: true, posts: [] };
        writeData(SOCIAL_FILE, data);
    }
    res.json(data);
});

// Update Settings (Visibility & Links)
app.put('/api/social/settings', (req, res) => {
    let data = readData(SOCIAL_FILE);
    if (Array.isArray(data)) data = { isVisible: true, posts: [] };

    if (req.body.isVisible !== undefined) data.isVisible = req.body.isVisible;
    if (req.body.instagramUrl !== undefined) data.instagramUrl = req.body.instagramUrl;
    if (req.body.linkedinUrl !== undefined) data.linkedinUrl = req.body.linkedinUrl;

    writeData(SOCIAL_FILE, data);
    res.json(data);
});

// Add Post
app.post('/api/social', uploadSocial.single('image'), (req, res) => {
    let data = readData(SOCIAL_FILE);
    if (Array.isArray(data) || !data.posts) data = { isVisible: true, posts: [] };

    const { platform, date, description, link, imagePath } = req.body;

    const newPost = {
        id: Date.now(),
        platform, // 'instagram' | 'linkedin'
        date,
        description,
        link,
        imagePath: req.file ? req.file.filename : (imagePath || null)
    };

    data.posts.unshift(newPost);
    writeData(SOCIAL_FILE, data);
    res.json({ success: true, post: newPost });
});

// Delete Post
app.delete('/api/social/:id', (req, res) => {
    let data = readData(SOCIAL_FILE);
    if (data && data.posts) {
        data.posts = data.posts.filter(p => p.id != req.params.id);
        writeData(SOCIAL_FILE, data);
    }
    res.json({ success: true });
});

// --- JOBS MANAGEMENT ---
// JOBS_FILE already declared at top

app.get('/api/jobs', (req, res) => {
    let jobs = readData(JOBS_FILE);
    if (!Array.isArray(jobs)) jobs = [];

    // Eğer 'active' parametresi varsa filtrele
    if (req.query.active === 'true') {
        jobs = jobs.filter(j => j.isActive !== false);
    }
    // Ters kronolojik sırala (En yeni en üstte)
    res.json(jobs.reverse());
});

app.get('/api/jobs/:id', (req, res) => {
    let jobs = readData(JOBS_FILE);
    if (!Array.isArray(jobs)) jobs = [];
    const job = jobs.find(j => j.id == req.params.id);
    if (job) res.json(job);
    else res.status(404).json({ message: 'İlan bulunamadı' });
});

app.post('/api/jobs', (req, res) => {
    let jobs = readData(JOBS_FILE);
    if (!Array.isArray(jobs)) jobs = [];

    const newJob = {
        id: Date.now(),
        isActive: true, // Varsayılan aktif
        ...req.body
    };
    jobs.push(newJob);
    writeData(JOBS_FILE, jobs);
    res.json({ success: true, job: newJob });
});

app.put('/api/jobs/:id', (req, res) => {
    let jobs = readData(JOBS_FILE);
    if (!Array.isArray(jobs)) jobs = [];

    const id = parseInt(req.params.id);
    const index = jobs.findIndex(j => j.id === id);

    if (index === -1) return res.status(404).json({ message: 'İlan bulunamadı' });

    jobs[index] = { ...jobs[index], ...req.body };
    writeData(JOBS_FILE, jobs);
    res.json({ success: true, job: jobs[index] });
});

app.delete('/api/jobs/:id', (req, res) => {
    let jobs = readData(JOBS_FILE);
    if (!Array.isArray(jobs)) jobs = [];

    const id = parseInt(req.params.id);
    jobs = jobs.filter(j => j.id !== id);
    writeData(JOBS_FILE, jobs);
    res.json({ success: true });
});

// Generic Upload Endpoint
app.post('/api/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: 'Dosya yüklenemedi.' });
    }
    res.json({ success: true, filePath: req.file.filename });
});

// COMPANY CULTURE API
app.get('/api/culture', (req, res) => {
    let data = readData(CULTURE_FILE);
    // readData returns [] if file not exists, ensuring it is object
    if (Array.isArray(data)) {
        data = {
            heroTitle: "Birlikte Büyüyoruz",
            heroSubtitle: "Derya Grup'ta çalışmak sadece bir iş değil, bir tutkudur.",
            values: [], gallery: [], perks: [], quotes: []
        };
    }
    res.json(data);
});

app.post('/api/culture', (req, res) => {
    writeData(CULTURE_FILE, req.body);
    res.json({ success: true });
});

// HOMEPAGE HERO API
app.get('/api/hero', (req, res) => {
    try {
        const HERO_FILE = path.join(__dirname, 'data', 'hero.json');
        let data = readData(HERO_FILE);
        // Default data if empty
        if (!data || Object.keys(data).length === 0 || Array.isArray(data) || !data.activeDesign) {
            data = {
                activeDesign: "type3",
                type1: {
                    slides: [
                        {
                            image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2670&auto=format&fit=crop",
                            title: "Geleceği İnşa Ediyoruz",
                            subtitle: "Modern mimari ve sürdürülebilir yaşam alanları."
                        },
                        {
                            image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=2672&auto=format&fit=crop",
                            title: "Yolculuğunuzda Yanınızdayız",
                            subtitle: "Otomotiv sektöründeki deneyimimizle güvenli sürüş."
                        }
                    ]
                },
                type2: {
                    slides: [
                        {
                            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA3CJDlMRpSHDez1hCYt5KdQcrgp3B-XPBqznh18s_XaMYlDkvclvUusSz0lrtiiFxdCv5WHwanlEGw87oYmoNbrCkAGIznFgh1zMMFCmWDDs1I5bxzUPOPDtEHgMCjWSRf8YdjxfIr38r47ZsvVpsdlCVAsWil63D8PWPAyVIuGjFF8BBQzCRKD3ijowWQplX8R_w9qTdHRzlK0mLBUikTPTpc9UWAJqLWn2n5cULMpFWHAdyzEd7Bav3IZsqzd_CKjdGoDWrI8lo",
                            title: "Sürekli Kalite",
                            description: "Güven, İnşaat ve Otomotiv Sektörlerinde Öncü."
                        },
                        {
                            image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2670&auto=format&fit=crop",
                            title: "Modern Mimari",
                            description: "Şehrin silüetine değer katan projeler."
                        },
                        {
                            image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=2672&auto=format&fit=crop",
                            title: "Güvenli Sürüş",
                            description: "En yeni teknolojilerle donatılmış araçlar."
                        }
                    ]
                },
                type3: {
                    words: ["İnşa Ediyoruz.", "Güçlendiriyoruz.", "Büyütüyoruz.", "Tasarlıyoruz."],
                    description: "İnşaat, Otomotiv, Sigorta ve daha fazlası. 9 farklı ana sektör, 9 şirket ve 40 yıllık tecrübe ile hayatınıza değer katıyoruz.",
                    rightImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2670&auto=format&fit=crop",
                    floatingBox: {
                        title: "Sürdürülebilir",
                        text: "Doğaya, insanlara ve topluma değer katıyoruz.",
                        icon: "eco"
                    }
                }
            };
        }
        res.json(data);
    } catch (error) {
        console.error("Hero API Error:", error);
        res.status(500).json({ error: "Veri okunamadı" });
    }
});

app.post('/api/hero', (req, res) => {
    try {
        const HERO_FILE = path.join(__dirname, 'data', 'hero.json');
        writeData(HERO_FILE, req.body);
        res.json({ success: true });
    } catch (error) {
        console.error("Hero Save Error:", error);
        res.status(500).json({ error: "Veri kaydedilemedi" });
    }
});

// --- ABOUT (HISTORY) API ---
const ABOUT_FILE = path.join(__dirname, 'data', 'about.json');

app.get('/api/about', (req, res) => {
    try {
        let data = readData(ABOUT_FILE);
        // Varsayılan yapı kontrolü
        if (!data || Object.keys(data).length === 0) {
            data = { history: [] };
        }
        res.json(data);
    } catch (error) {
        console.error("About API Error:", error);
        res.status(500).json({ error: "Veri okunamadı" });
    }
});

app.post('/api/about', (req, res) => {
    try {
        writeData(ABOUT_FILE, req.body);
        res.json({ success: true });
    } catch (error) {
        console.error("About Save Error:", error);
        res.status(500).json({ error: "Veri kaydedilemedi" });
    }
});

// --- ANALYTICS MODÜLÜ ---
// 1. Veri Toplama Endpoint'i
app.post('/api/analytics/collect', (req, res) => {
    try {
        const { type, path, action, meta } = req.body;
        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        const userAgent = req.headers['user-agent'];

        const log = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            type, // 'pageview' | 'click'
            path,
            action, // 'viewed_home', 'clicked_apply' vb.
            ip, // Hashlenerek saklanabilir, şimdilik raw
            userAgent,
            meta // { device: 'mobile', city: 'Istanbul' - client side'dan gelirse }
        };

        const logs = readData(ANALYTICS_FILE);
        // Aşırı büyümeyi önlemek için son 10.000 kaydı tut (Basit bir log rotasyonu)
        if (logs.length > 10000) logs.shift();
        logs.push(log);

        writeData(ANALYTICS_FILE, logs);
        res.status(200).json({ success: true });
    } catch (e) {
        console.error('Analytics Error:', e);
        // Analytics hatası kullanıcı deneyimini bozmamalı
        res.status(200).json({ success: false });
    }
});

// 2. Raporlama Endpoint'i (Admin)
app.get('/api/analytics/report', (req, res) => {
    try {
        // Analytics dosyası yoksa oluştur
        if (!fs.existsSync(ANALYTICS_FILE)) writeData(ANALYTICS_FILE, []);

        const logs = readData(ANALYTICS_FILE);
        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
        const oneHourAgo = now.getTime() - (60 * 60 * 1000);

        // 1. Özet Kartlar
        const totalVisits = logs.filter(l => l.type === 'pageview').length;
        const dailyVisits = logs.filter(l => l.type === 'pageview' && new Date(l.timestamp).getTime() > startOfDay).length;
        const activeUsers = new Set(logs.filter(l => new Date(l.timestamp).getTime() > oneHourAgo).map(l => l.ip)).size;

        // 2. Saatlik Kırılım (Son 24 Saat)
        const hourlyStats = {};
        logs.forEach(l => {
            if (l.type === 'pageview') {
                const date = new Date(l.timestamp);
                const key = `${date.getHours()}:00`;
                hourlyStats[key] = (hourlyStats[key] || 0) + 1;
            }
        });
        const graphData = Object.keys(hourlyStats).map(k => ({ name: k, count: hourlyStats[k] }));

        // 3. En Çok Görüntülenen Sayfalar
        const pageCounts = {};
        logs.filter(l => l.type === 'pageview').forEach(l => {
            pageCounts[l.path] = (pageCounts[l.path] || 0) + 1;
        });
        const topPages = Object.entries(pageCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([path, count]) => ({ path, count }));

        // 4. En Çok Tıklananlar (Aksiyonlar)
        const actionCounts = {};
        logs.filter(l => l.type === 'click').forEach(l => {
            const key = l.action || 'Bilinmeyen Tıklama';
            actionCounts[key] = (actionCounts[key] || 0) + 1;
        });
        const topActions = Object.entries(actionCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([action, count]) => ({ action, count }));

        // 5. Cihaz/Tarayıcı (User Agent analizi - basit)
        const devices = { Mobile: 0, Desktop: 0, Other: 0 };
        logs.forEach(l => {
            const ua = (l.userAgent || '').toLowerCase();
            if (ua.includes('mobile') || ua.includes('android') || ua.includes('iphone')) devices.Mobile++;
            else if (ua.includes('windows') || ua.includes('macintosh') || ua.includes('linux')) devices.Desktop++;
            else devices.Other++;
        });

        // 6. Konumlar (Meta'dan geliyorsa)
        const locations = {};
        logs.forEach(l => {
            if (l.meta && l.meta.city) {
                const city = l.meta.city;
                locations[city] = (locations[city] || 0) + 1;
            }
        });
        const topLocations = Object.entries(locations)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([city, count]) => ({ city, count }));


        res.json({
            summary: { totalVisits, dailyVisits, activeUsers },
            graph: graphData,
            topPages,
            topActions,
            devices,
            topLocations
        });

    } catch (e) {
        console.error('Analytics Report Error:', e);
        res.status(500).json({ message: 'Rapor oluşturulamadı.' });
    }
});


// --- RSS HABERLERİ API (CANLI BESLEME) ---
app.get('/api/news', async (req, res) => {
    const https = require('https');

    // Basit RSS Parser 
    const parseRSS = (xml) => {
        const items = [];
        const itemRegex = /<item>([\s\S]*?)<\/item>/g;
        let match;
        let count = 0;

        while ((match = itemRegex.exec(xml)) !== null && count < 6) {
            const content = match[1];

            let title = "";
            const titleMatch = /<title>(?:<!\[CDATA\[(.*?)]]>|(.*?))<\/title>/s.exec(content);
            if (titleMatch) title = (titleMatch[1] || titleMatch[2] || "").trim();

            let link = "";
            const linkMatch = /<link>(.*?)<\/link>/s.exec(content);
            if (linkMatch) link = (linkMatch[1] || "").trim();

            if (title && link) {
                items.push({ title, link });
                count++;
            }
        }
        return items;
    };

    const fetchRSS = (url) => {
        return new Promise((resolve) => {
            const req = https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (resp) => {
                let data = '';
                resp.on('data', (chunk) => { data += chunk; });
                resp.on('end', () => { resolve(parseRSS(data)); });
            });
            req.on('error', (err) => {
                console.error("RSS Error:", err.message);
                resolve([]);
            });
        });
    };

    try {
        const [economy, finance, personal] = await Promise.all([
            fetchRSS('https://www.bloomberght.com/rss'),
            fetchRSS('https://www.ntv.com.tr/ekonomi.rss'),
            fetchRSS('https://www.uplifers.com/feed/')
        ]);

        res.json({ economy, finance, personal });
    } catch (e) {
        res.status(500).json({ error: 'News Error' });
    }
});

// Global Error Handler (Multer hatalarını yakalamak için)
app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        return res.status(400).json({ success: false, message: `Dosya Yükleme Hatası: ${err.message}` });
    } else if (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
    next();
});

// --- STATİK DOSYALAR (Tek Çatı Modeli) ---
// Node.js sadece API değil, react uygulamasını da sunsun.
app.use(express.static(path.join(__dirname, '../dist')));

// React Router için her isteği index.html'e yönlendir (API hariç)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
