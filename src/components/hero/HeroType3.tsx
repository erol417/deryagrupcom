import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function HeroType3({ data }: { data: any }) {
    const [text, setText] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);
    const [loopNum, setLoopNum] = useState(0);
    const [typingSpeed, setTypingSpeed] = useState(150);

    const title = data?.title || "Geleceği";
    const words = data?.words || ["Gelecek", "İnovasyon"];
    const description = data?.description || "Açıklama yükleniyor...";
    const rightImage = data?.rightImage || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2670&auto=format&fit=crop";
    const floatBox = data?.floatingBox || { title: "Sürdürülebilir", text: "Doğaya değer katıyoruz.", icon: "eco" };

    // Font Size Logic
    const sizeMap: any = {
        large: "text-5xl md:text-7xl lg:text-8xl",
        medium: "text-4xl md:text-6xl lg:text-7xl",
        small: "text-3xl md:text-5xl lg:text-6xl"
    };
    const fontSizeClass = sizeMap[data?.titleSize || "large"];

    const stats = data?.stats || [
        { value: "40+", label: "Yıllık Tecrübe" },
        { value: "9", label: "Grup Şirketi" },
        { value: "1000+", label: "Mutlu Çalışan" }
    ];

    useEffect(() => {
        if (!words || words.length === 0) return;
        const handleTyping = () => {
            const i = loopNum % words.length;
            const fullText = words[i];

            setText(isDeleting
                ? fullText.substring(0, text.length - 1)
                : fullText.substring(0, text.length + 1)
            );

            setTypingSpeed(isDeleting ? 50 : 150);

            if (!isDeleting && text === fullText) {
                setTimeout(() => setIsDeleting(true), 2000);
            } else if (isDeleting && text === "") {
                setIsDeleting(false);
                setLoopNum(loopNum + 1);
            }
        };

        const timer = setTimeout(handleTyping, typingSpeed);
        return () => clearTimeout(timer);
    }, [text, isDeleting, loopNum, words, typingSpeed]);

    return (
        <section className="relative h-[85vh] w-full bg-white overflow-hidden flex items-center">
            <div className="absolute top-0 right-0 w-2/3 h-full bg-gray-50 -skew-x-12 transform origin-top-right z-0"></div>
            <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-primary/5 rounded-full blur-3xl z-0"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
                <div className="space-y-8 animate-fade-in-up">
                    <div className="relative z-20">
                        <span className="text-primary font-bold tracking-[0.2em] uppercase text-sm mb-4 block">Derya Grup</span>
                        <h1 className={`${fontSizeClass} font-black text-secondary leading-[1.1] mb-6 transition-all duration-300`}>
                            {title} <br />
                            <span className="text-primary">{text}</span>
                            <span className="animate-pulse text-gray-400 font-light">|</span>
                        </h1>
                        <p className="text-xl text-gray-500 max-w-lg leading-relaxed font-light">
                            {description}
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-4 pt-4">
                        <Link to="/hakkimizda" className="group bg-secondary hover:bg-primary text-white px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1 flex items-center gap-2">
                            <span>Bizi Tanıyın</span>
                            <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                        </Link>
                        <Link to="/iletisim" className="group bg-white hover:bg-gray-50 text-secondary border-2 border-gray-100 px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 flex items-center gap-2">
                            <span>İletişime Geçin</span>
                        </Link>
                    </div>

                    <div className="grid grid-cols-3 gap-8 pt-8 border-t border-gray-100/50">
                        {stats.map((stat: any, index: number) => (
                            <div key={index}>
                                <h4 className="text-3xl font-black text-secondary">{stat.value}</h4>
                                <span className="text-sm text-gray-400 font-bold uppercase tracking-wider">{stat.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="hidden lg:block relative h-[600px] w-full animate-fade-in-up animation-delay-300">
                    <div className="absolute top-10 right-10 w-4/5 h-4/5 rounded-[3rem] overflow-hidden shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-700 z-10">
                        <img src={rightImage} alt="Architecture" className="w-full h-full object-cover scale-110 hover:scale-100 transition-transform duration-1000" />
                        <div className="absolute inset-0 bg-gradient-to-t from-secondary/40 to-transparent"></div>
                    </div>

                    <div className="absolute bottom-20 left-0 bg-white p-6 rounded-2xl shadow-xl z-20 max-w-xs animate-bounce" style={{ animationDuration: '3s' }}>
                        <div className="flex items-center gap-4 mb-3">
                            <div className="size-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                <span className="material-symbols-outlined">{floatBox.icon}</span>
                            </div>
                            <span className="font-bold text-secondary">{floatBox.title}</span>
                        </div>
                        <p className="text-xs text-gray-500">{floatBox.text}</p>
                    </div>

                    <div className="absolute top-0 right-0 grid grid-cols-6 gap-2 opacity-20">
                        {[...Array(36)].map((_, i) => (
                            <div key={i} className="size-1 rounded-full bg-secondary"></div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce text-gray-300 hidden md:block">
                <span className="material-symbols-outlined text-4xl">keyboard_arrow_down</span>
            </div>
        </section>
    );
}
