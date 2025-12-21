import { useEffect, useState } from 'react';
import { API_BASE_URL } from '../config';
// import ReactMarkdown from 'react-markdown'; // Eğer kuruluysa harika olur ama değilse düz text.

// Markdown kurulu olmayabilir, risk almayalım. Düz text + regex ile basit format (Bold vb.)
// Veya sadece whitespace-pre-wrap yeterli. Kullanıcıya "Markdown yaz" demek zor.
// Ama ben json'a markdown yazdım (## Başlık). O yüzden basit bir parser veya sadece replace yapabilirim.
// Şimdilik olduğu gibi basalım.

interface Props {
    type: 'kvkk' | 'cookiePolicy' | 'cookiePreferences';
    title: string;
}

export default function LegalPage({ type, title }: Props) {
    const [content, setContent] = useState<string>('Yükleniyor...');

    useEffect(() => {
        window.scrollTo(0, 0);
        fetch(`${API_BASE_URL}/api/legal`)
            .then(res => res.json())
            .then(data => {
                if (data && data[type]) setContent(data[type]);
                else setContent('İçerik bulunamadı.');
            })
            .catch(err => {
                console.error(err);
                setContent('Bir hata oluştu.');
            });
    }, [type]);

    // Basit Markdown Parser (Sadece Başlıklar ve Bold için)
    const renderContent = (text: string) => {
        return text.split('\n').map((line, index) => {
            if (line.startsWith('## ')) {
                return <h2 key={index} className="text-xl font-bold mt-6 mb-3 text-secondary">{line.replace('## ', '')}</h2>;
            }
            if (line.startsWith('* ')) {
                return <li key={index} className="ml-4 list-disc text-gray-700 mb-1">{line.replace('* ', '')}</li>;
            }
            // Bold (**text**) replace
            const parts = line.split(/(\*\*.*?\*\*)/g);
            return (
                <p key={index} className="mb-4 text-gray-600 leading-relaxed">
                    {parts.map((part, i) => {
                        if (part.startsWith('**') && part.endsWith('**')) {
                            return <strong key={i} className="text-gray-900">{part.slice(2, -2)}</strong>;
                        }
                        return part;
                    })}
                </p>
            );
        });
    };

    return (
        <div className="pt-32 pb-20 min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto px-6">
                <h1 className="text-3xl md:text-4xl font-extrabold mb-8 text-secondary border-b pb-4">{title}</h1>
                <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100">
                    {renderContent(content)}
                </div>
            </div>
        </div>
    );
}
