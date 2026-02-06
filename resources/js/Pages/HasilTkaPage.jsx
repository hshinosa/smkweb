import React, { useState, useMemo } from 'react';
import { Head } from '@inertiajs/react';
import {
    BarChart3,
    Calendar,
    Award,
    BookOpen,
    TrendingUp,
    Filter,
    ChevronRight,
    Search,
    AlertCircle
} from 'lucide-react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';
import SEOHead from '@/Components/SEOHead';
import { TYPOGRAPHY } from '@/Utils/typography';
import { getNavigationData } from '@/Utils/navigationData';
import { usePage } from '@inertiajs/react';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export default function HasilTkaPage({ tkaGroups = [] }) {
    const { siteSettings } = usePage().props;
    const navigationData = getNavigationData(siteSettings);
    const siteName = siteSettings?.general?.site_name || 'SMAN 1 Baleendah';
    const heroImage = siteSettings?.general?.hero_image || '/images/hero-bg-sman1baleendah.jpeg';

    const [selectedGroupIndex, setSelectedGroupIndex] = useState(0);
    const activeGroup = tkaGroups[selectedGroupIndex] || null;

    // Transform data for Chart
    const chartData = useMemo(() => {
        if (!activeGroup) return null;

        const subjects = activeGroup.subjects.sort((a, b) => b.average_score - a.average_score);
        
        return {
            labels: subjects.map(s => s.subject_name),
            datasets: [
                {
                    label: 'Nilai Rata-rata',
                    data: subjects.map(s => s.average_score),
                    // Gradient-like solid color for cleaner look, or use pattern
                    backgroundColor: '#0D47A1', 
                    borderRadius: 6,
                    barThickness: 32,
                    maxBarThickness: 40,
                },
            ],
        };
    }, [activeGroup]);

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            title: { display: false },
            tooltip: {
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                titleColor: '#0f172a',
                bodyColor: '#334155',
                borderColor: '#e2e8f0',
                borderWidth: 1,
                padding: 12,
                cornerRadius: 8,
                callbacks: {
                    label: (context) => ` Rata-rata: ${context.raw}`
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: { color: '#f1f5f9', drawBorder: false },
                ticks: { font: { family: "'Plus Jakarta Sans', sans-serif" } },
                border: { display: false }
            },
            x: {
                grid: { display: false, drawBorder: false },
                ticks: { 
                    autoSkip: false,
                    maxRotation: 45,
                    minRotation: 0,
                    font: { size: 11, family: "'Plus Jakarta Sans', sans-serif" }
                },
                border: { display: false }
            }
        },
        layout: { padding: { top: 20 } }
    };

    const formatImagePath = (path) => {
        if (!path) return null;
        if (path.startsWith('http') || path.startsWith('/')) return path;
        return `/storage/${path}`;
    };

    const renderHighlightedTitle = (title) => {
        if (!title) return null;
        const words = title.split(' ');
        if (words.length <= 1) return title;
        const lastWord = words.pop();
        return (
            <>
                {words.join(' ')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-yellow to-yellow-200">{lastWord}</span>
            </>
        );
    };

    return (
        <div className="bg-[#FAFAFA] font-sans text-gray-800 min-h-screen flex flex-col">
            <SEOHead 
                title={`Hasil TKA - ${siteName}`}
                description={`Rekapitulasi nilai rata-rata Tes Kompetensi Akademik (TKA) siswa ${siteName}.`}
                keywords="hasil tka, nilai rata-rata, statistik akademik, utbk, try out"
                image={heroImage}
            />

            <Navbar
                logoSman1={navigationData.logoSman1}
                profilLinks={navigationData.profilLinks}
                akademikLinks={navigationData.akademikLinks}
                programStudiLinks={navigationData.programStudiLinks}
            />

            <main id="main-content" className="pt-20 flex-grow" tabIndex="-1">
                {/* HERO SECTION */}
                <section className="relative h-[35vh] min-h-[350px] flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 z-0">
                        <img 
                            src={formatImagePath(heroImage)} 
                            alt="Background" 
                            className="w-full h-full object-cover scale-105"
                            loading="eager"
                            fetchpriority="high"
                        />
                        <div className="absolute inset-0 bg-primary/90 mix-blend-multiply"></div>
                        <div className="absolute inset-0 bg-black/40"></div>
                        
                        {/* Decorative pattern */}
                        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                    </div>

                    <div className="relative z-10 container mx-auto px-4 text-center text-white">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur border border-white/20 mb-4">
                            <BookOpen className="w-4 h-4 text-accent-yellow" />
                            <span className="text-xs font-bold tracking-widest uppercase">Evaluasi Akademik</span>
                        </div>
                        <h1 className={`${TYPOGRAPHY.heroTitle} mb-4`}>
                            {renderHighlightedTitle('Hasil Nilai TKA')}
                        </h1>
                        <p className={`${TYPOGRAPHY.heroText} max-w-2xl mx-auto opacity-90 text-lg font-light`}>
                            Pemetaan kemampuan akademik siswa melalui analisis nilai rata-rata per mata pelajaran.
                        </p>
                    </div>
                </section>

                {/* CONTENT SECTION */}
                <section className="py-12 sm:py-16 -mt-10 relative z-20">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        
                        {tkaGroups.length > 0 ? (
                            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
                                
                                {/* SIDEBAR FILTER */}
                                <div className="lg:col-span-1 lg:sticky lg:top-28">
                                    <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-100 overflow-hidden">
                                        <div className="p-5 border-b border-gray-100 bg-gray-50/50">
                                            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                                                <Filter className="w-4 h-4 text-primary" />
                                                Pilih Periode
                                            </h3>
                                        </div>
                                        <div className="p-2 space-y-1 max-h-[400px] overflow-y-auto custom-scrollbar">
                                            {tkaGroups.map((group, idx) => (
                                                <button
                                                    key={`${group.academic_year}-${group.exam_type}`}
                                                    onClick={() => setSelectedGroupIndex(idx)}
                                                    className={`w-full text-left p-3 rounded-xl text-sm font-medium transition-all duration-200 group flex items-center justify-between ${
                                                        selectedGroupIndex === idx 
                                                        ? 'bg-primary text-white shadow-md shadow-blue-500/20' 
                                                        : 'text-gray-600 hover:bg-gray-50 hover:text-primary'
                                                    }`}
                                                >
                                                    <div className="flex flex-col">
                                                        <span className="font-bold">{group.exam_type}</span>
                                                        <span className={`text-xs mt-0.5 ${selectedGroupIndex === idx ? 'text-blue-200' : 'text-gray-400'}`}>
                                                            Tahun {group.academic_year}
                                                        </span>
                                                    </div>
                                                    {selectedGroupIndex === idx && <ChevronRight className="w-4 h-4" />}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    
                                    {/* Info Card */}
                                    <div className="mt-6 bg-blue-50 rounded-2xl p-5 border border-blue-100 hidden lg:block">
                                        <h4 className="text-blue-900 font-bold text-sm mb-2 flex items-center gap-2">
                                            <AlertCircle className="w-4 h-4" /> Informasi
                                        </h4>
                                        <p className="text-xs text-blue-700/80 leading-relaxed">
                                            Grafik menampilkan nilai rata-rata gabungan seluruh siswa pada periode ujian yang dipilih.
                                        </p>
                                    </div>
                                </div>

                                {/* MAIN CONTENT CHART */}
                                <div className="lg:col-span-3 space-y-8">
                                    {activeGroup && chartData ? (
                                        <>
                                            {/* CHART CARD */}
                                            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden p-6 sm:p-8">
                                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                                                    <div>
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wide">
                                                                Grafik Analisis
                                                            </span>
                                                        </div>
                                                        <h2 className="text-2xl font-bold text-gray-900">
                                                            {activeGroup.exam_type}
                                                        </h2>
                                                        <p className="text-gray-500">Tahun Akademik {activeGroup.academic_year}</p>
                                                    </div>
                                                    <div className="text-left sm:text-right bg-gray-50 px-4 py-2 rounded-xl border border-gray-100">
                                                        <p className="text-2xl font-black text-primary">
                                                            {activeGroup.subjects.length}
                                                        </p>
                                                        <p className="text-xs text-gray-400 font-semibold uppercase">Mata Pelajaran</p>
                                                    </div>
                                                </div>
                                                
                                                <div className="h-[350px] sm:h-[450px] w-full relative">
                                                    <Bar data={chartData} options={chartOptions} />
                                                </div>
                                            </div>

                                            {/* DETAIL TABLE CARD */}
                                            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                                                <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                                                    <h3 className="text-base font-bold text-gray-800 flex items-center gap-2">
                                                        <BookOpen className="w-5 h-5 text-primary" />
                                                        Rincian Nilai Per Mapel
                                                    </h3>
                                                </div>
                                                <div className="overflow-x-auto">
                                                    <table className="w-full text-sm text-left">
                                                        <thead className="bg-white border-b border-gray-100 text-gray-400 uppercase text-xs font-bold tracking-wider">
                                                            <tr>
                                                                <th className="px-6 py-4">Mata Pelajaran</th>
                                                                <th className="px-6 py-4">Kategori</th>
                                                                <th className="px-6 py-4 text-right">Nilai Rata-rata</th>
                                                                <th className="px-6 py-4 text-right w-24">Status</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="divide-y divide-gray-50">
                                                            {activeGroup.subjects.sort((a,b) => b.average_score - a.average_score).map((subject, idx) => (
                                                                <tr key={idx} className="group hover:bg-blue-50/30 transition-colors">
                                                                    <td className="px-6 py-4 font-bold text-gray-800 group-hover:text-primary transition-colors">
                                                                        {subject.subject_name}
                                                                    </td>
                                                                    <td className="px-6 py-4 text-gray-500">
                                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                                            Akademik
                                                                        </span>
                                                                    </td>
                                                                    <td className="px-6 py-4 text-right font-black text-gray-900 text-base">
                                                                        {subject.average_score}
                                                                    </td>
                                                                    <td className="px-6 py-4 text-right">
                                                                        <div className="flex justify-end">
                                                                            {parseFloat(subject.average_score) >= 75 ? (
                                                                                <TrendingUp className="w-5 h-5 text-emerald-500" />
                                                                            ) : (
                                                                                <div className="w-5 h-1 bg-gray-200 rounded-full mt-2"></div>
                                                                            )}
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="h-96 flex flex-col items-center justify-center bg-white rounded-3xl border-2 border-dashed border-gray-200 text-center p-8">
                                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                                <BarChart3 className="w-8 h-8 text-gray-300" />
                                            </div>
                                            <h3 className="text-lg font-bold text-gray-900">Pilih Data</h3>
                                            <p className="text-gray-500 mt-1 max-w-xs mx-auto">
                                                Silakan pilih periode ujian di sebelah kiri untuk menampilkan grafik nilai.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-24 bg-white rounded-3xl shadow-sm border border-gray-100">
                                <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-6">
                                    <BarChart3 className="w-10 h-10 text-gray-300" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">Belum Ada Data TKA</h2>
                                <p className="text-gray-600 max-w-md mx-auto">
                                    Admin sekolah belum mengunggah data hasil TKA. Data akan muncul di sini setelah dipublikasikan.
                                </p>
                            </div>
                        )}

                    </div>
                </section>
            </main>

            <Footer
                logoSman1={navigationData.logoSman1}
                googleMapsEmbedUrl={navigationData.googleMapsEmbedUrl}
                socialMediaLinks={navigationData.socialMediaLinks}
            />
        </div>
    );
}
