import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, User, Bot, ChevronRight } from 'lucide-react';
import { router, usePage } from '@inertiajs/react';

export default function ChatWidget() {
    const page = usePage();
    if (!page) return null;
    const { siteSettings } = page.props;
    const siteName = siteSettings?.general?.site_name || 'SMAN 1 Baleendah';
    const [isOpen, setIsOpen] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [isHidden, setIsHidden] = useState(false);
    const messagesEndRef = useRef(null);

    // Initial Messages
    const [messages, setMessages] = useState([
        {
            id: 1,
            sender: 'bot',
            text: `Halo! 👋 Selamat datang di ${siteName}. Ada yang bisa kami bantu seputar PPDB atau Info Sekolah?`,
            type: 'text'
        },
        {
            id: 2,
            sender: 'bot',
            type: 'chips',
            options: [
                "Info PPDB 2025",
                "Program Studi",
                "Biaya Masuk",
                "Hubungi via WhatsApp"
            ]
        }
    ]);

    useEffect(() => {
        const checkHidden = () => {
            const path = window.location.pathname;
            // Sembunyikan jika URL diawali dengan /admin atau /login (halaman login admin)
            setIsHidden(path.startsWith('/admin') || path.startsWith('/login'));
        };

        // Cek saat pertama kali render
        checkHidden();

        // Cek setiap kali navigasi Inertia selesai
        const removeListener = router.on('finish', checkHidden);

        return () => {
            removeListener();
        };
    }, []);

    // Auto-scroll to bottom
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (!isHidden) {
            scrollToBottom();
        }
    }, [messages, isOpen, isTyping, isHidden]);

    if (isHidden) {
        return null;
    }

    // Handle Quick Action Click
    const handleChipClick = (option) => {
        // 1. Add User Message
        addMessage(option, 'user');

        // 2. Simulate Bot Response
        setIsTyping(true);
        
        setTimeout(() => {
            setIsTyping(false);
            generateBotResponse(option);
        }, 1000);
    };

    // Handle Text Input
    const handleSend = (e) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        addMessage(inputValue, 'user');
        setInputValue("");
        
        setIsTyping(true);
        setTimeout(() => {
            setIsTyping(false);
            // Simple default response for free text
            addMessage("Terima kasih atas pesan Anda. Admin kami akan segera membalas. Silakan gunakan menu cepat di atas untuk respon instan.", 'bot');
        }, 1500);
    };

    const addMessage = (text, sender) => {
        setMessages(prev => [...prev, {
            id: Date.now(),
            sender,
            text,
            type: 'text'
        }]);
    };

    const generateBotResponse = (query) => {
        let responseText = "";
        let nextAction = null;

        switch (query) {
            case "Info PPDB 2025":
                responseText = "Pendaftaran PPDB Tahun Ajaran 2025/2026 akan dibuka mulai bulan Juni 2025. Terdapat jalur Zonasi (50%), Prestasi (25%), Afirmasi (20%), dan Perpindahan Tugas (5%).";
                break;
            case "Program Studi":
                responseText = `${siteName} memiliki 3 program peminatan unggulan: MIPA (Matematika & IPA), IPS (Ilmu Pengetahuan Sosial), dan Bahasa & Budaya.`;
                break;
            case "Biaya Masuk":
                responseText = `Sesuai kebijakan Pemprov Jabar, ${siteName} tidak memungut biaya SPP bulanan (Gratis). Untuk biaya seragam dan kegiatan awal tahun, silakan hubungi Koperasi Sekolah.`;
                break;
            case "Hubungi via WhatsApp":
                responseText = "Anda akan dialihkan ke WhatsApp Admin kami untuk konsultasi lebih lanjut...";
                window.open('https://wa.me/6281234567890', '_blank');
                break;
            default:
                responseText = "Maaf, saya tidak mengerti. Silakan pilih menu yang tersedia.";
        }

        addMessage(responseText, 'bot');
    };

    return (
        <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end gap-4 font-sans">
            {/* 1. Chat Dialog Card */}
            {isOpen && (
                <div className="w-[350px] h-[450px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden animate-fade-in-up origin-bottom-right">
                    {/* Header */}
                    <div className="bg-primary p-4 flex items-center justify-between shadow-md">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center border border-white/20">
                                <Bot className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-white font-bold text-sm">Admin Smansa</h3>
                                <div className="flex items-center gap-1.5">
                                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                                    <span className="text-blue-100 text-xs">Online • Siap membantu</span>
                                </div>
                            </div>
                        </div>
                        <button 
                            onClick={() => setIsOpen(false)}
                            className="text-white/80 hover:text-white hover:bg-white/10 p-1 rounded-full transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Chat Body */}
                    <div className="flex-1 bg-gray-50 p-4 overflow-y-auto">
                        <div className="space-y-4">
                            {messages.map((msg) => (
                                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    {/* Avatar for Bot */}
                                    {msg.sender === 'bot' && (
                                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mr-2 flex-shrink-0">
                                            <Bot size={16} className="text-primary" />
                                        </div>
                                    )}

                                    <div className={`max-w-[80%] ${msg.type === 'chips' ? 'w-full' : ''}`}>
                                        {msg.type === 'text' && (
                                            <div className={`p-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                                                msg.sender === 'user' 
                                                ? 'bg-primary text-white rounded-tr-none' 
                                                : 'bg-white text-gray-700 rounded-tl-none border border-gray-100'
                                            }`}>
                                                {msg.text}
                                            </div>
                                        )}

                                        {msg.type === 'chips' && (
                                            <div className="flex flex-wrap gap-2 mt-1">
                                                {msg.options.map((opt, idx) => (
                                                    <button
                                                        key={idx}
                                                        onClick={() => handleChipClick(opt)}
                                                        className="bg-white border border-primary text-primary text-xs font-bold px-3 py-2 rounded-full hover:bg-primary hover:text-white transition-all shadow-sm active:scale-95"
                                                    >
                                                        {opt}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}

                            {/* Typing Indicator */}
                            {isTyping && (
                                <div className="flex justify-start">
                                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mr-2">
                                        <Bot size={16} className="text-primary" />
                                    </div>
                                    <div className="bg-white border border-gray-100 p-3 rounded-2xl rounded-tl-none shadow-sm flex gap-1">
                                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></span>
                                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></span>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                    </div>

                    {/* Footer Input */}
                    <div className="bg-white p-3 border-t border-gray-100">
                        <form onSubmit={handleSend} className="flex gap-2">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder="Ketik pesan..."
                                className="flex-1 bg-gray-100 border-0 rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-primary focus:bg-white transition-all"
                            />
                            <button 
                                type="submit"
                                disabled={!inputValue.trim()}
                                className="bg-primary text-white p-2 rounded-full hover:bg-primary-darker disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md"
                            >
                                <Send size={18} className={inputValue.trim() ? "ml-0.5" : ""} />
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* 2. Floating Action Button (Trigger) */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`${
                    isOpen ? 'bg-red-500 rotate-90' : 'bg-primary hover:bg-primary-darker'
                } text-white w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 transform hover:scale-110 z-[9999]`}
            >
                {isOpen ? <X size={24} /> : <MessageCircle size={28} />}
                
                {/* Notification Badge */}
                {!isOpen && (
                    <span className="absolute top-0 right-0 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border-2 border-white"></span>
                    </span>
                )}
            </button>
        </div>
    );
}
