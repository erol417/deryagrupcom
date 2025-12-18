
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Veri Dosyalarının Yolları
const JOBS_FILE = path.join(__dirname, 'data', 'jobs.json');
const APPS_FILE = path.join(__dirname, 'data', 'applications.json');
const CULTURE_FILE = path.join(__dirname, 'data', 'culture.json');

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // CV'lere erişim için

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

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 } // Max 5MB
});

// Mail Ayarları
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER || 'test@gmail.com',
        pass: process.env.EMAIL_PASS || 'password'
    }
});

// Yardımcı Fonksiyonlar: JSON Okuma/Yazma
const readData = (filePath) => {
    if (!fs.existsSync(filePath)) return [];
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
};

const writeData = (filePath, data) => {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

// --- ENDPOINTS ---



// 2. BAŞVURULAR (Applications)
app.post('/api/apply', upload.single('cv'), async (req, res) => {
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
                to: 'ik@deryagrup.com.tr',
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

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const users = readData(USERS_FILE);
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        const { password, ...tokenData } = user;
        res.json({ success: true, user: tokenData });
    } else {
        res.status(401).json({ success: false, message: 'Hatalı kullanıcı adı veya şifre.' });
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
    const { username, name, password, role, scope } = req.body;

    if (users.find(u => u.username === username)) {
        return res.status(400).json({ success: false, message: 'Bu kullanıcı adı zaten kullanılıyor.' });
    }

    const newUser = {
        id: Date.now(),
        username,
        password, // Gerçek projede hashlenmeli
        name,
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
const uploadBrand = multer({ storage: brandStorage });

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
const uploadNews = multer({ storage: newsStorage });

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
    const { title, summary, content, date, category } = req.body;

    const newItem = {
        id: Date.now(),
        title,
        summary,
        content,
        category: category || 'Genel',
        date: date || new Date().toISOString(),
        imagePath: req.file ? req.file.filename : null
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
    const { title, summary, content, date, category } = req.body;

    const updatedItem = {
        ...currentItem,
        title: title || currentItem.title,
        summary: summary || currentItem.summary,
        content: content || currentItem.content,
        category: category || currentItem.category || 'Genel',
        date: date || currentItem.date,
        imagePath: req.file ? req.file.filename : currentItem.imagePath
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
const uploadSocial = multer({ storage: socialStorage });

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

    const { platform, date, description, link } = req.body;

    const newPost = {
        id: Date.now(),
        platform, // 'instagram' | 'linkedin'
        date,
        description,
        link,
        imagePath: req.file ? req.file.filename : null
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

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
