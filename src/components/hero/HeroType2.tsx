import { useState, useEffect } from 'react';

export default function HeroType2({ data }: { data: any }) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [displayedTitle, setDisplayedTitle] = useState("");
    const [isPaused, setIsPaused] = useState(false);

    // Drag / Swipe States
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    if (!data?.slides || data.slides.length === 0) return null;

    const handleNext = () => setActiveIndex((prev) => (prev + 1) % data.slides.length);
    const handlePrev = () => setActiveIndex((prev) => (prev - 1 + data.slides.length) % data.slides.length);

    // Autoplay
    useEffect(() => {
        let interval: any;
        if (!isPaused && !isDragging) {
            interval = setInterval(() => {
                setActiveIndex((prev) => (prev + 1) % data.slides.length);
            }, 6000);
        }
        return () => clearInterval(interval);
    }, [isPaused, isDragging, data.slides.length]);

    // Typewriter
    useEffect(() => {
        let typingInterval: any;
        let startTimeout: any;
        const targetTitle = data.slides[activeIndex].title;
        setDisplayedTitle("");

        startTimeout = setTimeout(() => {
            let charIndex = 0;
            typingInterval = setInterval(() => {
                if (charIndex <= targetTitle.length) {
                    setDisplayedTitle(targetTitle.slice(0, charIndex));
                    charIndex++;
                } else {
                    clearInterval(typingInterval);
                }
            }, 80);
        }, 500);

        return () => {
            clearTimeout(startTimeout);
            clearInterval(typingInterval);
        };
    }, [activeIndex, data.slides]);

    // --- SWIPE LOGIC ---
    const minSwipeDistance = 50;

    const onDragStart = (e: any) => {
        setIsDragging(true);
        setIsPaused(true);
        setTouchEnd(null);
        const clientX = e.targetTouches ? e.targetTouches[0].clientX : e.clientX;
        setTouchStart(clientX);
    }

    const onDragMove = (e: any) => {
        if (!isDragging) return;
        const clientX = e.targetTouches ? e.targetTouches[0].clientX : e.clientX;
        setTouchEnd(clientX);
    }

    const onDragEnd = () => {
        if (!touchStart || !touchEnd) {
            setIsDragging(false);
            return;
        }
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        if (isLeftSwipe) handleNext();
        if (isRightSwipe) handlePrev();

        setIsDragging(false);
        setIsPaused(false);
    }

    return (
        <section
            className={`relative h-screen w-full bg-gray-50 overflow-hidden flex flex-col justify-center items-center select-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => { setIsPaused(false); onDragEnd(); }}

            onMouseDown={onDragStart}
            onMouseMove={onDragMove}
            onMouseUp={onDragEnd}

            onTouchStart={onDragStart}
            onTouchMove={onDragMove}
            onTouchEnd={onDragEnd}
        >
            {/* Background Image */}
            <div className="absolute inset-0 z-0 opacity-10 transition-all duration-1000 transform scale-110"
                style={{ backgroundImage: `url(${data.slides[activeIndex].image})`, backgroundSize: 'cover', backgroundPosition: 'center', filter: 'blur(80px) grayscale(100%)' }}></div>
            <div className="absolute inset-0 bg-white/60 z-0"></div>

            {/* Carousel Container (Fixed: Only one container) */}
            <div className="relative z-10 w-full h-full flex items-center justify-center perspective-[1200px]">
                {data.slides.map((slide: any, index: number) => {
                    const isActive = index === activeIndex;
                    const isPrev = index === (activeIndex - 1 + data.slides.length) % data.slides.length;
                    const isNext = index === (activeIndex + 1) % data.slides.length;

                    const handleClick = (e: any) => {
                        e.stopPropagation();
                        if (!isDragging && (Math.abs((touchStart || 0) - (touchEnd || 0)) < 10)) {
                            setActiveIndex(index);
                        }
                    };

                    // w-[85vw] md:w-[40vw] h-[55vh] md:h-[65vh]
                    let className = "absolute top-1/2 left-1/2 rounded-3xl overflow-hidden shadow-2xl transition-all duration-700 ease-out border border-white/20 w-[85vw] md:w-[40vw] h-[55vh] md:h-[65vh]";

                    let style: any = {};

                    if (isActive) {
                        style = {
                            transform: 'translate3d(-50%, -50%, 0) scale(1.35)',
                            zIndex: 30,
                            opacity: 1,
                            boxShadow: '0 40px 80px -20px rgba(0, 0, 0, 0.4)',
                            pointerEvents: 'auto'
                        };
                    } else if (isPrev) {
                        style = {
                            transform: 'translate3d(-150%, -50%, -200px) rotateY(20deg) scale(0.9)',
                            zIndex: 20,
                            opacity: 0.5,
                            filter: 'grayscale(0.8) brightness(0.6) blur(1px)',
                            pointerEvents: 'auto',
                            cursor: 'pointer'
                        };
                    } else if (isNext) {
                        style = {
                            transform: 'translate3d(50%, -50%, -200px) rotateY(-20deg) scale(0.9)',
                            zIndex: 20,
                            opacity: 0.5,
                            filter: 'grayscale(0.8) brightness(0.6) blur(1px)',
                            pointerEvents: 'auto',
                            cursor: 'pointer'
                        };
                    } else {
                        style = { transform: 'translate3d(-50%, -50%, -800px)', opacity: 0, zIndex: 0, display: 'none' };
                    }

                    return (
                        <div key={index} className={className} style={style}
                            onMouseDown={(e) => { e.preventDefault(); }}
                            onClick={handleClick}>

                            <img src={slide.image} className="w-full h-full object-cover transition-transform duration-1000 hover:scale-105 pointer-events-none" alt={slide.title} />

                            <div className={`absolute bottom-0 left-0 right-0 pt-48 pb-16 px-8 bg-gradient-to-t from-black via-black/80 to-transparent text-white text-center z-40 flex flex-col justify-end items-center h-full transition-opacity duration-500 ${isActive ? 'opacity-100' : 'opacity-0'}`}>

                                <div className="h-16 md:h-20 flex items-end justify-center">
                                    <h3 className="text-3xl md:text-5xl font-bold mb-4 drop-shadow-lg tracking-tight leading-tight select-none">
                                        {isActive ? displayedTitle : slide.title}
                                        {isActive && <span className="animate-pulse text-white ml-1">|</span>}
                                    </h3>
                                </div>

                                {slide.description && (
                                    <p className={`text-sm md:text-lg opacity-90 drop-shadow-md font-light leading-relaxed max-w-2xl mx-auto transform transition-all duration-1000 ease-out delay-700 select-none ${isActive ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>{slide.description}</p>
                                )}

                                <div className={`w-24 h-1 bg-white/30 rounded-full mt-6 transform transition-all duration-1000 ease-out delay-1000 ${isActive ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0'}`}></div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Controls */}
            <div className="absolute bottom-12 flex gap-12 z-50">
                <button onClick={(e) => { e.stopPropagation(); handlePrev(); }} className="bg-white hover:bg-black text-black hover:text-white p-4 rounded-full transition-all border border-gray-200 hover:border-black shadow-2xl cursor-pointer transform hover:scale-110 flex items-center justify-center group">
                    <span className="material-symbols-outlined text-2xl group-hover:-translate-x-1 transition-transform">arrow_back</span>
                </button>
                <button onClick={(e) => { e.stopPropagation(); handleNext(); }} className="bg-white hover:bg-black text-black hover:text-white p-4 rounded-full transition-all border border-gray-200 hover:border-black shadow-2xl cursor-pointer transform hover:scale-110 flex items-center justify-center group">
                    <span className="material-symbols-outlined text-2xl group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </button>
            </div>
        </section>
    );
}
