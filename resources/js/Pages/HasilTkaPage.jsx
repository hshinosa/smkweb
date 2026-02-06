import React, { useState, useMemo } from 'react';
import { Head } from '@inertiajs/react';
import {
    BarChart3,
    Calendar,
    Award,
    BookOpen,
    TrendingUp,
    Filter
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

    // State untuk filter aktif
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
                    backgroundColor: 'rgba(59, 130, 246, 0.8)', // Blue-500
                    borderColor: 'rgb(37, 99, 235)',
                    borderWidth: 1,
                    borderRadius: 6,
                },
            ],
        };
    }, [activeGroup]);

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                display: false,
            },
            title: {
                display: true,
                text: activeGroup ? `Rata-rata Nilai ${activeGroup.exam_type} (${activeGroup.academic_year})` : '',
                font: { size: 16 },
                padding: { bottom: 20 }
            },
            tooltip: {
                callbacks: {
                    label: (context) => `Nilai: ${context.raw}`
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Nilai Rata-rata'
                }
            },
            x: {
                ticks: {
                    autoSkip: false,
                    maxRotation: 45,
                    minRotation: 45
                }
            }
        },
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
                {words.join(' ')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">{lastWord}</span>
            </>
        );
    };

    return (
        <div className="bg-gray-50 font-sans text-gray-800">
            <SEOHead 
                title={`Hasil TKA - ${siteName}`}
                description={`Hasil Tes Kompetensi Akademik siswa ${siteName}. Lihat rata-rata nilai per mata pelajaran.`}
                keywords="hasil tka, nilai rata-rata, statistik akademik, SMAN 1 Baleendah"
                image={heroImage}
            />

            <Navbar
                logoSman1={navigationData.logoSman1}
                profilLinks={navigationData.profilLinks}
                akademikLinks={navigationData.akademikLinks}
                programStudiLinks={navigationData.programStudiLinks}
            />

            <main id="main-content" className="pt-20" tabIndex="-1">
                {/* HERO SECTION */}
                <section className="relative h-[35vh] min-h-[350px] flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 z-0">
                        <img 
                            src={formatImagePath(heroImage)} 
                            alt="Background" 
                            className="w-full h-full object-cover"
                            loading="eager"
                            fetchpriority="high"
                        />
                        <div className="absolute inset-0 bg-black/60"></div>
                    </div>

                    <div className="relative z-10 container mx-auto px-4 text-center text-white">
                        <h1 className={`${TYPOGRAPHY.heroTitle} mb-4`}>
                            {renderHighlightedTitle('Hasil TKA')}
                        </h1>
                        <p className={`${TYPOGRAPHY.heroText} max-w-2xl mx-auto opacity-90`}>
                            Rekapitulasi nilai rata-rata Tes Kompetensi Akademik Siswa
                        </p>
                    </div>
                </section>

                {/* CONTENT SECTION */}
                <section className="py-12 bg-white">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        
                        {tkaGroups.length > 0 ? (
                            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                                {/* SIDEBAR FILTER */}
                                <div className="lg:col-span-1">
                                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 sticky top-24">
                                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                            <Filter className="w-5 h-5 text-primary" />
                                            Pilih Data
                                        </h3>
                                        <div className="space-y-2">
                                            {tkaGroups.map((group, idx) => (
                                                <button
                                                    key={`${group.academic_year}-${group.exam_type}`}
                                                    onClick={() => setSelectedGroupIndex(idx)}
                                                    className={`w-full text-left p-3 rounded-lg text-sm font-medium transition-all ${
                                                        selectedGroupIndex === idx 
                                                        ? 'bg-primary text-white shadow-md' 
                                                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                                                    }`}
                                                >
                                                    <div className="flex justify-between items-center">
                                                        <span>{group.exam_type}</span>
                                                        <span className={`text-xs px-2 py-0.5 rounded-full ${selectedGroupIndex === idx ? 'bg-white/20' : 'bg-gray-200'}`}>
                                                            {group.academic_year}
                                                        </span>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* MAIN CONTENT CHART */}
                                <div className="lg:col-span-3">
                                    {activeGroup && chartData ? (
                                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                                                <div>
                                                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                                        <TrendingUp className="w-5 h-5 text-green-600" />
                                                        Grafik Nilai Rata-rata
                                                    </h2>
                                                    <p className="text-sm text-gray-500 mt-1">
                                                        {activeGroup.exam_type} - Tahun {activeGroup.academic_year}
                                                    </p>
                                                </div>
                                                <div className="text-right hidden sm:block">
                                                    <p className="text-2xl font-bold text-primary">
                                                        {activeGroup.subjects.length}
                                                    </p>
                                                    <p className="text-xs text-gray-400">Mata Pelajaran</p>
                                                </div>
                                            </div>
                                            
                                            <div className="p-6">
                                                <div className="h-[400px] w-full">
                                                    <Bar data={chartData} options={chartOptions} />
                                                </div>
                                            </div>

                                            {/* TABEL DETAIL */}
                                            <div className="bg-gray-50 p-6 border-t border-gray-100">
                                                <h3 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
                                                    <BookOpen className="w-4 h-4" />
                                                    Rincian Nilai
                                                </h3>
                                                <div className="overflow-x-auto">
                                                    <table className="w-full text-sm text-left">
                                                        <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                                                            <tr>
                                                                <th className="px-4 py-3 rounded-l-lg">Mata Pelajaran</th>
                                                                <th className="px-4 py-3 rounded-r-lg text-right">Nilai Rata-rata</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="divide-y divide-gray-100">
                                                            {activeGroup.subjects.sort((a,b) => b.average_score - a.average_score).map((subject, idx) => (
                                                                <tr key={idx} className="hover:bg-white transition-colors">
                                                                    <td className="px-4 py-3 font-medium text-gray-900">
                                                                        {subject.subject_name}
                                                                    </td>
                                                                    <td className="px-4 py-3 text-right font-bold text-primary">
                                                                        {subject.average_score}
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="h-64 flex items-center justify-center bg-gray-50 rounded-2xl border border-dashed border-gray-300">
                                            <p className="text-gray-500">Pilih data untuk menampilkan grafik</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-16">
                                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                                    <BarChart3 className="w-8 h-8 text-gray-400" />
                                </div>
                                <h2 className="text-xl font-bold text-gray-900 mb-2">Belum Ada Data TKA</h2>
                                <p className="text-gray-600 max-w-md mx-auto">
                                    Data hasil TKA belum tersedia saat ini.
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
