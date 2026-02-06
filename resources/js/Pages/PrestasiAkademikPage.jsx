import React, { useState, useMemo } from 'react';
import { Head, Link } from '@inertiajs/react';
import {
    GraduationCap,
    TrendingUp,
    Award,
    Building2,
    ChevronDown,
    ChevronUp,
    Users,
    BarChart3,
    PieChart as PieChartIcon,
    Calendar,
    ArrowUpRight,
    Trophy,
    AlertCircle,
    CheckCircle2
} from 'lucide-react';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    Title,
    BarElement,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';
import SEOHead from '@/Components/SEOHead';
import { TYPOGRAPHY } from '@/Utils/typography';
import { getNavigationData } from '@/Utils/navigationData';
import { usePage } from '@inertiajs/react';

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    Title,
    BarElement
);

// --- COMPONENTS ---

const StatCard = ({ icon: Icon, label, value, color = 'primary', delay = 0 }) => {
    const colorStyles = {
        primary: 'bg-blue-50 text-blue-700 border-blue-100',
        success: 'bg-green-50 text-green-700 border-green-100',
        warning: 'bg-amber-50 text-amber-700 border-amber-100',
        info: 'bg-indigo-50 text-indigo-700 border-indigo-100',
    };

    return (
        <div 
            className={`bg-white rounded-3xl p-6 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 animate-fade-in-up`}
            style={{ animationDelay: `${delay}ms` }}
        >
            <div className="flex items-center gap-4 mb-4">
                <div className={`w-12 h-12 rounded-2xl ${colorStyles[color]} flex items-center justify-center shadow-sm`}>
                    <Icon className="w-6 h-6" />
                </div>
                <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">{label}</span>
            </div>
            <div>
                <p className="text-4xl font-extrabold text-gray-900 tracking-tight">{value}</p>
            </div>
        </div>
    );
};

const AdmissionCard = ({ data, isExpanded, onToggle, index }) => {
    // Chart Config
    const chartData = {
        labels: data.byPTN?.slice(0, 15).map(item => item.name) || [],
        datasets: [{
            label: 'Jumlah Siswa',
            data: data.byPTN?.slice(0, 15).map(item => item.count) || [],
            backgroundColor: data.byPTN?.slice(0, 15).map(item => item.color) || [],
            borderRadius: 6,
            barThickness: 24,
            maxBarThickness: 32,
        }],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                titleColor: '#1e293b',
                bodyColor: '#475569',
                borderColor: '#e2e8f0',
                borderWidth: 1,
                padding: 12,
                boxPadding: 4,
                usePointStyle: true,
                callbacks: {
                    label: (context) => {
                        const value = context.raw;
                        const percentage = ((value / data.total) * 100).toFixed(1);
                        return `  ${value} Siswa (${percentage}%)`;
                    },
                },
            },
        },
        scales: {
            x: {
                beginAtZero: true,
                grid: { display: false, drawBorder: false },
                ticks: { display: false } // Hide x-axis numbers for cleaner look
            },
            y: {
                grid: { display: false, drawBorder: false },
                ticks: { 
                    font: { size: 12, family: "'Plus Jakarta Sans', sans-serif", weight: 500 },
                    color: '#64748b',
                    autoSkip: false 
                }
            }
        },
        layout: { padding: { left: 0, right: 20, top: 0, bottom: 0 } }
    };

    const typeColor = data.type === 'SNBP' ? 'bg-blue-100 text-blue-700 ring-blue-500/20' :
                      data.type === 'SNBT' ? 'bg-emerald-100 text-emerald-700 ring-emerald-500/20' :
                      'bg-purple-100 text-purple-700 ring-purple-500/20';

    const [activePtn, setActivePtn] = useState(null);

    const togglePtn = (id) => {
        if (activePtn === id) {
            setActivePtn(null);
        } else {
            setActivePtn(id);
        }
    };

    return (
        <div 
            className="group bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md"
            style={{ animationDelay: `${index * 100}ms` }}
        >
            <div 
                className="p-6 sm:p-8 cursor-pointer hover:bg-gray-50/50 transition-colors relative"
                onClick={onToggle}
            >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div className="flex items-center gap-5">
                        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br from-white to-gray-50 border border-gray-100 shadow-sm flex items-center justify-center shrink-0`}>
                            <GraduationCap className="w-8 h-8 text-primary" />
                        </div>
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <span className={`px-3 py-1 text-xs font-bold rounded-full ring-1 ring-inset ${typeColor}`}>
                                    {data.type}
                                </span>
                                <span className="text-sm text-gray-400 font-medium">Tahun {data.year}</span>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 group-hover:text-primary transition-colors">{data.name}</h3>
                        </div>
                    </div>
                    
                    <div className="flex items-center justify-between sm:justify-end gap-6 sm:gap-10 w-full sm:w-auto">
                        <div className="text-left sm:text-right">
                            <p className="text-3xl font-black text-gray-900">{data.total}</p>
                            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Siswa Diterima</p>
                        </div>
                        <div className={`w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center transition-transform duration-300 ${isExpanded ? 'rotate-180 bg-primary/10 text-primary' : 'text-gray-400'}`}>
                            <ChevronDown className="w-5 h-5" />
                        </div>
                    </div>
                </div>
            </div>

            {isExpanded && (
                <div className="px-6 sm:px-8 pb-8 pt-2 border-t border-gray-100 bg-gray-50/30">
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-10 mt-6">
                        {/* CHART SECTION */}
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h4 className="text-base font-bold text-gray-800 mb-6 flex items-center gap-2">
                                <BarChart3 className="w-5 h-5 text-primary" />
                                Distribusi Top 15 PTN
                            </h4>
                            {data.byPTN?.length > 0 ? (
                                <div className="h-[400px] w-full">
                                    <Bar data={chartData} options={chartOptions} />
                                </div>
                            ) : (
                                <div className="h-[300px] flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-100 rounded-xl">
                                    <BarChart3 className="w-10 h-10 mb-2 opacity-20" />
                                    <span className="text-sm">Belum ada data grafik</span>
                                </div>
                            )}
                        </div>
                        
                        {/* LIST SECTION */}
                        <div className="flex flex-col h-[480px]">
                            <h4 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2 px-1">
                                <Building2 className="w-5 h-5 text-primary" />
                                Rincian Penerimaan ({data.byPTN?.length} PTN)
                            </h4>
                            <div className="flex-1 overflow-y-auto pr-2 space-y-3 scrollbar-thin scrollbar-thumb-gray-200 hover:scrollbar-thumb-gray-300 scrollbar-track-transparent">
                                {data.byPTN?.map((ptn) => (
                                    <div key={ptn.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden transition-all hover:border-primary/30 hover:shadow-sm">
                                        <button 
                                            className="w-full flex items-center justify-between p-4 text-left group/btn"
                                            onClick={() => togglePtn(ptn.id)}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div 
                                                    className="w-2 h-8 rounded-full" 
                                                    style={{ backgroundColor: ptn.color }}
                                                ></div>
                                                <span className="font-bold text-gray-800 text-sm group-hover/btn:text-primary transition-colors">{ptn.name}</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="px-2.5 py-1 rounded-md bg-gray-50 text-gray-900 text-xs font-bold border border-gray-100 group-hover/btn:bg-primary group-hover/btn:text-white group-hover/btn:border-primary transition-all">
                                                    {ptn.count}
                                                </span>
                                                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${activePtn === ptn.id ? 'rotate-180 text-primary' : ''}`} />
                                            </div>
                                        </button>
                                        
                                        {/* Dropdown Jurusan */}
                                        {activePtn === ptn.id && (
                                            <div className="bg-gray-50/50 p-4 border-t border-gray-100 animate-in slide-in-from-top-1 duration-200">
                                                {ptn.majors && ptn.majors.length > 0 ? (
                                                    <div className="grid grid-cols-1 gap-2">
                                                        {ptn.majors.map((major, idx) => (
                                                            <div key={idx} className="flex justify-between items-center text-xs p-2 rounded-lg bg-white border border-gray-100/50 hover:border-gray-200">
                                                                <span className="text-gray-600 font-medium">{major.name}</span>
                                                                <span className="font-bold text-primary bg-primary/5 px-2 py-0.5 rounded">{major.count}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <p className="text-xs text-gray-400 italic text-center py-2">Rincian jurusan tidak tersedia</p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// --- MAIN PAGE ---

export default function PrestasiAkademikPage({ batches = [], universities = [], stats = {}, ptnFavorites = [] }) {
    const { siteSettings } = usePage().props;
    const navigationData = getNavigationData(siteSettings);
    const siteName = siteSettings?.general?.site_name || 'SMAN 1 Baleendah';
    const heroImage = siteSettings?.general?.hero_image || '/images/hero-bg-sman1baleendah.jpeg';

    const [expandedCards, setExpandedCards] = useState(() => {
        const initial = {};
        if (batches.length > 0) {
            initial[batches[0].id] = true; // Open first card by default
        }
        return initial;
    });

    const toggleCard = (id) => {
        setExpandedCards(prev => ({
            ...prev,
            [id]: !prev[id],
        }));
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
                {words.join(' ')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-yellow to-yellow-200 inline-block relative">
                    {lastWord}
                    <svg className="absolute w-full h-2 bottom-1 left-0 text-accent-yellow/30 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                        <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
                    </svg>
                </span>
            </>
        );
    };

    const totalAdmissions = stats.totalAdmissions || 0;
    const totalPTN = stats.totalPtn || 0;

    const yearlyTrend = useMemo(() => {
        const yearData = {};
        batches.forEach(batch => {
            if (!yearData[batch.year]) {
                yearData[batch.year] = { year: batch.year.toString(), snbp: 0, snbt: 0, mandiri: 0 };
            }
            if (batch.type === 'SNBP') yearData[batch.year].snbp += batch.total;
            else if (batch.type === 'SNBT') yearData[batch.year].snbt += batch.total;
            else yearData[batch.year].mandiri += batch.total;
        });
        return Object.values(yearData).sort((a, b) => a.year - b.year);
    }, [batches]);

    const trendChartData = {
        labels: yearlyTrend.map(y => y.year),
        datasets: [
            {
                label: 'SNBP',
                data: yearlyTrend.map(y => y.snbp),
                backgroundColor: '#0D47A1', // Primary
                borderRadius: 4,
                stack: 'Stack 0',
            },
            {
                label: 'SNBT',
                data: yearlyTrend.map(y => y.snbt),
                backgroundColor: '#FFC107', // Accent
                borderRadius: 4,
                stack: 'Stack 0',
            },
        ],
    };

    const trendChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                align: 'end',
                labels: { usePointStyle: true, boxWidth: 8, font: { size: 11 } },
            },
            tooltip: {
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                titleColor: '#0f172a',
                bodyColor: '#334155',
                borderColor: '#e2e8f0',
                borderWidth: 1,
                padding: 10,
                boxPadding: 4,
            }
        },
        scales: {
            y: { 
                beginAtZero: true, 
                stacked: true,
                grid: { color: '#f1f5f9' },
                border: { display: false }
            },
            x: { 
                stacked: true,
                grid: { display: false },
                border: { display: false }
            },
        },
    };

    const latestSnbp = batches.find(b => b.type === 'SNBP');
    const latestSnbt = batches.find(b => b.type === 'SNBT');
    const hasData = batches.length > 0;

    return (
        <div className="bg-[#FAFAFA] font-sans text-gray-800 min-h-screen">
            <SEOHead 
                title={`Data Serapan PTN - ${siteName}`}
                description={`Data statistik penerimaan siswa ${siteName} di Perguruan Tinggi Negeri. Total ${totalAdmissions} siswa diterima.`}
                keywords="prestasi akademik, SNBP, SNBT, statistik PTN, alumni sukses, SMAN 1 Baleendah"
                image={heroImage}
            />

            <Navbar
                logoSman1={navigationData.logoSman1}
                profilLinks={navigationData.profilLinks}
                akademikLinks={navigationData.akademikLinks}
                programStudiLinks={navigationData.programStudiLinks}
            />

            <main id="main-content" className="pt-20" tabIndex="-1">
                {/* HERO SECTION - Modern Gradient */}
                <section className="relative h-[45vh] min-h-[400px] flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 z-0">
                        <img 
                            src={formatImagePath(heroImage)} 
                            alt="Background" 
                            className="w-full h-full object-cover scale-105"
                            loading="eager"
                            fetchpriority="high"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/70 mix-blend-multiply"></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                        
                        {/* Animated Abstract Shapes */}
                        <div className="absolute top-10 left-10 w-32 h-32 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
                        <div className="absolute bottom-10 right-10 w-40 h-40 bg-accent-yellow/10 rounded-full blur-3xl animate-float-slow"></div>
                    </div>

                    <div className="relative z-10 container mx-auto px-4 text-center text-white">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-6 animate-fade-in-up">
                            <Award className="w-4 h-4 text-accent-yellow" />
                            <span className="text-sm font-semibold tracking-wide uppercase">Prestasi Akademik</span>
                        </div>
                        <h1 className={`${TYPOGRAPHY.heroTitle} mb-6 max-w-4xl mx-auto drop-shadow-lg`}>
                            {renderHighlightedTitle('Jejak Sukses Menuju PTN')}
                        </h1>
                        <p className={`${TYPOGRAPHY.heroText} max-w-2xl mx-auto text-white/90 font-light`}>
                            Transparansi data penerimaan siswa di Perguruan Tinggi Negeri terbaik Indonesia melalui jalur SNBP dan SNBT.
                        </p>
                    </div>
                </section>

                {/* CONTENT WRAPPER - Overlap Effect */}
                <div className="relative z-20 container mx-auto px-4 sm:px-6 lg:px-8 -mt-20">
                    
                    {/* STATISTICS CARDS */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
                        <StatCard 
                            icon={GraduationCap} 
                            label="Total Diterima" 
                            value={totalAdmissions}
                            color="primary"
                            delay={100}
                        />
                        <StatCard 
                            icon={Building2} 
                            label="PTN Tujuan" 
                            value={totalPTN > 0 ? `${totalPTN}+` : '0'}
                            color="info"
                            delay={200}
                        />
                        <StatCard 
                            icon={TrendingUp} 
                            label={latestSnbp ? `SNBP ${latestSnbp.year}` : 'SNBP'} 
                            value={latestSnbp?.total || 0}
                            color="success"
                            delay={300}
                        />
                        <StatCard 
                            icon={CheckCircle2} 
                            label={latestSnbt ? `SNBT ${latestSnbt.year}` : 'SNBT'} 
                            value={latestSnbt?.total || 0}
                            color="warning"
                            delay={400}
                        />
                    </div>

                    {hasData ? (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
                            {/* LEFT: YEARLY TREND */}
                            <div className="lg:col-span-1 space-y-8">
                                {/* Trend Chart */}
                                {yearlyTrend.length > 0 && (
                                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                                        <div className="mb-6">
                                            <h3 className="text-lg font-bold text-gray-900">Trend Penerimaan</h3>
                                            <p className="text-sm text-gray-500">Perkembangan jumlah siswa lolos per tahun</p>
                                        </div>
                                        <div className="h-[250px]">
                                            <Bar data={trendChartData} options={trendChartOptions} />
                                        </div>
                                    </div>
                                )}

                                {/* Top PTN Widget */}
                                {ptnFavorites.length > 0 && (
                                    <div className="bg-gradient-to-br from-primary to-primary-darker rounded-3xl p-6 text-white shadow-lg overflow-hidden relative">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
                                        
                                        <div className="relative z-10">
                                            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                                <Trophy className="w-5 h-5 text-accent-yellow" />
                                                PTN Favorit
                                            </h3>
                                            <div className="space-y-4">
                                                {ptnFavorites.slice(0, 3).map((ptn, idx) => (
                                                    <div key={idx} className="flex items-center gap-3 bg-white/10 p-3 rounded-xl backdrop-blur-sm border border-white/5">
                                                        <div className="w-8 h-8 rounded-full bg-white text-primary font-bold flex items-center justify-center text-sm shrink-0">
                                                            #{idx + 1}
                                                        </div>
                                                        <div className="min-w-0 flex-1">
                                                            <p className="font-bold text-sm truncate">{ptn.name}</p>
                                                            <p className="text-xs text-white/70">{ptn.total} Siswa</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* RIGHT: MAIN LIST */}
                            <div className="lg:col-span-2 space-y-6">
                                <div className="flex items-center justify-between mb-2">
                                    <h2 className="text-xl font-bold text-gray-900">Rincian Data Angkatan</h2>
                                    <div className="flex gap-2">
                                        <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500 bg-white px-3 py-1 rounded-full border border-gray-100 shadow-sm">
                                            <div className="w-2 h-2 rounded-full bg-blue-500"></div> SNBP
                                        </div>
                                        <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500 bg-white px-3 py-1 rounded-full border border-gray-100 shadow-sm">
                                            <div className="w-2 h-2 rounded-full bg-emerald-500"></div> SNBT
                                        </div>
                                    </div>
                                </div>

                                {batches.map((batch, idx) => (
                                    <AdmissionCard 
                                        key={batch.id}
                                        index={idx}
                                        data={batch} 
                                        isExpanded={expandedCards[batch.id]}
                                        onToggle={() => toggleCard(batch.id)}
                                    />
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-3xl p-16 text-center border border-gray-100 shadow-sm">
                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <AlertCircle className="w-10 h-10 text-gray-300" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Data Belum Tersedia</h3>
                            <p className="text-gray-500 max-w-md mx-auto">
                                Admin belum mengunggah data serapan PTN untuk tahun ini. Silakan hubungi sekolah untuk informasi lebih lanjut.
                            </p>
                        </div>
                    )}

                    {/* CTA Section */}
                    <div className="bg-white rounded-3xl p-8 sm:p-12 mb-20 border border-gray-100 shadow-sm text-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-blue-400 to-accent-yellow"></div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Siap Menjadi Bagian dari Kami?</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto mb-8 text-lg">
                            Bergabunglah dengan {siteName} dan raih impianmu masuk ke Perguruan Tinggi Negeri favorit.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Link 
                                href="/informasi-spmb" 
                                className="inline-flex items-center justify-center px-8 py-3.5 text-base font-bold text-white bg-primary rounded-full hover:bg-primary-darker transition-all shadow-lg hover:shadow-primary/30"
                            >
                                Informasi PPDB
                            </Link>
                            <Link 
                                href="/alumni" 
                                className="inline-flex items-center justify-center px-8 py-3.5 text-base font-bold text-gray-700 bg-white border border-gray-200 rounded-full hover:bg-gray-50 transition-all"
                            >
                                Lihat Cerita Alumni
                            </Link>
                        </div>
                    </div>
                </div>
            </main>

            <Footer
                logoSman1={navigationData.logoSman1}
                googleMapsEmbedUrl={navigationData.googleMapsEmbedUrl}
                socialMediaLinks={navigationData.socialMediaLinks}
            />
        </div>
    );
}
