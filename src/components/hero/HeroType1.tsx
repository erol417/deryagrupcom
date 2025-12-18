import { useState, useEffect } from 'react';

export default function HeroType1({ data }: { data: any }) {
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        if (!data?.slides || data.slides.length === 0) return;
        const interval = setInterval(() => {
            setCurrentSlide(prev => (prev + 1) % data.slides.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [data]);

    if (!data?.slides) return null;

    return (
        <section className="relative h-screen w-full bg-black overflow-hidden">
            {data.slides.map((slide: any, i: number) => (
                <div key={i} className={`absolute inset-0 transition-opacity duration-1000 ${currentSlide === i ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
                    <img src={slide.image} className="w-full h-full object-cover opacity-60" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40"></div>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4">
                        <h1 className={`text-5xl md:text-7xl font-black mb-6 uppercase tracking-wider transform transition-all duration-1000 ${currentSlide === i ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                            {slide.title}
                        </h1>
                        <p className={`text-xl md:text-3xl font-light max-w-2xl transform transition-all duration-1000 delay-300 ${currentSlide === i ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                            {slide.subtitle}
                        </p>
                    </div>
                </div>
            ))}

            {/* Indicators */}
            <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20 flex gap-2">
                {data.slides.map((_: any, i: number) => (
                    <button key={i} onClick={() => setCurrentSlide(i)} className={`h-2 rounded-full transition-all duration-300 ${currentSlide === i ? 'bg-white w-8' : 'bg-white/40 w-2 hover:bg-white/60'}`} />
                ))}
            </div>
        </section>
    );
}
