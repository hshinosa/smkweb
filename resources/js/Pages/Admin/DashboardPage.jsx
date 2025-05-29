// FILE: resources/js/Pages/Admin/DashboardPage.jsx
import React, { useState, useEffect, useCallback } from 'react'; // Tambah useCallback
import { Head, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import axios from 'axios';
import Modal from '@/Components/Modal';
import { Search, X, CalendarDays, ChevronLeft, ChevronRight, ExternalLink, TrendingUp, AlertCircle, Info, Clock } from 'lucide-react'; // Tambah Clock

import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
ChartJS.register( CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler );


// Komponen Chart (bisa dipakai untuk harian atau per jam)
const VisitorStatsChart = ({ chartData, loading, error, periodType }) => {
  if (loading) {
    return <div className="w-full h-72 bg-gray-200 rounded-md flex items-center justify-center text-gray-500 animate-pulse">Memuat data chart...</div>;
  }
  if (error && (!chartData || !chartData.labels || chartData.labels.length === 0)) {
    return (
      <div className="w-full h-72 bg-red-50 border border-red-200 rounded-md flex flex-col items-center justify-center text-red-600 p-4 text-center">
        <AlertCircle className="w-10 h-10 text-red-400 mb-2" />
        <p className="font-semibold">Gagal memuat data chart.</p>
        <p className="text-xs mt-1">{error}</p>
      </div>
    );
  }
  if (!chartData || !chartData.labels || !chartData.data || chartData.labels.length === 0) {
    return (
        <div className="w-full h-72 bg-gray-100 rounded-md flex items-center justify-center text-gray-500 p-4 text-center">
            <Info size={24} className="mb-2 text-gray-400" />
            Tidak ada data kunjungan untuk periode ini.
        </div>
    );
  }

  const dataConfig = {
    labels: chartData.labels,
    datasets: [
      {
        label: `Kunjungan - ${periodType === 'hourly' ? 'Per Jam' : 'Per Hari'}`,
        data: chartData.data,
        fill: true,
        backgroundColor: 'rgba(21, 93, 160, 0.2)',
        borderColor: '#155DA0',
        tension: 0.3,
        pointBackgroundColor: '#155DA0',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#114B8C',
        borderWidth: 2, // Ketebalan garis
        pointRadius: 3, // Ukuran titik
        pointHoverRadius: 5,
      },
    ],
  };

  const optionsConfig = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: { beginAtZero: true, ticks: { precision: 0, color: '#4B5563' }, grid: { drawBorder: false, color: (context) => context.tick.value === 0 ? '#6B7280' : '#E5E7EB' } },
      x: { ticks: { color: '#4B5563' }, grid: { display: false } }
    },
    plugins: {
      legend: { display: true, position: 'bottom', labels: { boxWidth: 12, padding: 15, color: '#374151' } },
      tooltip: {
        mode: 'index', intersect: false, titleFont: { weight: 'bold'}, bodyFont: {size: 12},
        callbacks: { label: (context) => `${context.dataset.label || ''}: ${context.parsed.y !== null ? context.parsed.y.toLocaleString() : ''}` }
      }
    },
    interaction: { mode: 'index', intersect: false },
  };

  return <div className="h-72 md:h-80 lg:h-96"><Line options={optionsConfig} data={dataConfig} /></div>;
};


const ITEMS_PER_LOG_PAGE_MODAL = 10;

export default function DashboardPage() {
    const { auth } = usePage().props;
    // ... (state activity log sama)
    const [showActivityModal, setShowActivityModal] = useState(false);
    const [allActivityLogs, setAllActivityLogs] = useState([]);
    const [filteredActivityLogsInModal, setFilteredActivityLogsInModal] = useState([]);
    const [activitySearchTermModal, setActivitySearchTermModal] = useState('');
    const [activityDateRangeModal, setActivityDateRangeModal] = useState('all');
    const [currentActivityPageModal, setCurrentActivityPageModal] = useState(1);
    const [totalActivityPagesModal, setTotalActivityPagesModal] = useState(1);
    const [loadingLogsModal, setLoadingLogsModal] = useState(false);
    const [dashboardActivityLogs, setDashboardActivityLogs] = useState([]);
    const [loadingDashboardLogs, setLoadingDashboardLogs] = useState(false);

    const [visitorStats, setVisitorStats] = useState({
        total: null,
        totalMessage: "Memuat data...",
        totalLoading: true,
        totalError: null,
        dailyChart: null,
        chartLoading: true,
        chartError: null,
        lastCached: null,
        period: '7d', // Default periode ('1d', '7d', atau '8d')
        periodType: 'daily', // 'hourly' atau 'daily'
    });

    const fetchAllVisitorData = useCallback(async (currentPeriod) => {
        setVisitorStats(prev => ({
            ...prev,
            totalLoading: true,
            chartLoading: true,
            totalError: null,
            chartError: null,
            totalMessage: `Memuat data untuk periode ${currentPeriod}...`
        }));

        let totalData = null;
        let chartResponseData = null;
        let combinedMessage = `Data kunjungan untuk periode terakhir.`;
        let cachedTime = visitorStats.lastCached; // Pertahankan cache time jika salah satu gagal

        try {
            const periodValue = currentPeriod === '1d' ? 1 : (currentPeriod === '7d' ? 7 : '.');
            const totalResponse = await axios.get(route('admin.api.cloudflare.stats', { period: periodValue }));
            totalData = {
                value: totalResponse.data.unique_visitors_total !== undefined ? totalResponse.data.unique_visitors_total : 'N/A',
                message: totalResponse.data.message,
            };
            if (totalResponse.data.cached_at) cachedTime = new Date(totalResponse.data.cached_at).toLocaleString('id-ID', {dateStyle:'medium', timeStyle:'short'});
            if (totalResponse.data.message) combinedMessage = totalResponse.data.message;
        } catch (error) {
            console.error("Error fetching total visitors:", error.response?.data?.error || error.message);
            totalData = { value: 'Error', message: error.response?.data?.error || "Gagal mengambil data total kunjungan." };
            setVisitorStats(prev => ({ ...prev, totalError: totalData.message, totalLoading:false }));
        }

        try {
            const chartResponse = await axios.get(route('admin.api.cloudflare.chart.stats', { period: currentPeriod }));
            if (chartResponse.data && chartResponse.data.labels && chartResponse.data.data) {
                chartResponseData = {
                    labels: chartResponse.data.labels,
                    data: chartResponse.data.data,
                };
                if(!cachedTime && chartResponse.data.cached_at) {
                     cachedTime = new Date(chartResponse.data.cached_at).toLocaleString('id-ID', {dateStyle:'medium', timeStyle:'short'});
                }
                if (chartResponse.data.fetch_error_count > 0) {
                    const chartErrMessage = `Catatan Chart: ${chartResponse.data.fetch_error_count} ${currentPeriod === '1d' ? 'jam' : 'hari'} gagal dimuat.`;
                    setVisitorStats(prev => ({ ...prev, chartError: chartErrMessage }));
                    combinedMessage = `${combinedMessage.replace(/\.$/, '')}. ${chartErrMessage}`;
                }
            } else {
                throw new Error("Format data chart tidak sesuai dari API.");
            }
        } catch (error) {
            console.error("Error fetching chart data:", error.response?.data?.error || error.message);
            setVisitorStats(prev => ({ ...prev, chartError: error.response?.data?.error || "Gagal mengambil data untuk chart.", chartLoading:false }));
        }

        setVisitorStats(prev => ({
            ...prev,
            total: totalData ? totalData.value : 'Error',
            totalMessage: combinedMessage,
            totalLoading: false,
            dailyChart: chartResponseData,
            chartLoading: false,
            lastCached: cachedTime,
            periodType: currentPeriod === '1d' ? 'hourly' : 'daily',
            totalError: prev.totalError || (totalData && totalData.value === 'Error' ? totalData.message : null),
            chartError: prev.chartError || (!chartResponseData ? "Gagal memuat chart" : null),
        }));
    }, [visitorStats.lastCached]); // Hanya lastCached sebagai dependensi agar tidak re-fetch terus menerus saat state lain berubah

    useEffect(() => {
        fetchAllVisitorData(visitorStats.period);
    }, [visitorStats.period, fetchAllVisitorData]); // fetchAllVisitorData dimasukkan ke dependency array

    const handleChangePeriod = (newPeriod) => {
        setVisitorStats(prev => ({ ...prev, period: newPeriod }));
    };

    // --- Fungsi Activity Log tetap sama ---
    // ... (copy paste fungsi activity log dari kode sebelumnya) ...
    const fetchActivityLogs = async (page = 1, perPage = ITEMS_PER_LOG_PAGE_MODAL, forModal = false) => {
        if (forModal) setLoadingLogsModal(true);
        else setLoadingDashboardLogs(true);
        try {
            const response = await axios.get(route('admin.api.activitylogs.index', { page, per_page: perPage }));
            if (forModal) {
                setAllActivityLogs(response.data.data);
                setFilteredActivityLogsInModal(response.data.data);
                setTotalActivityPagesModal(response.data.last_page);
                setCurrentActivityPageModal(response.data.current_page);
            } else {
                setDashboardActivityLogs(response.data.data.slice(0, 5));
            }
        } catch (error) { console.error("Error fetching activity logs:", error); }
        finally { if (forModal) setLoadingLogsModal(false); else setLoadingDashboardLogs(false); }
    };
    useEffect(() => { fetchActivityLogs(1, 5, false); }, []);
    const openActivityModal = () => { fetchActivityLogs(1, ITEMS_PER_LOG_PAGE_MODAL, true); setShowActivityModal(true); };
    const closeActivityModal = () => { setShowActivityModal(false); setActivitySearchTermModal(''); setActivityDateRangeModal('all'); };
    useEffect(() => {
        if (!showActivityModal) return; let logs = [...allActivityLogs];
        if (activitySearchTermModal) { logs = logs.filter(log => (log.admin?.username?.toLowerCase() || '').includes(activitySearchTermModal.toLowerCase()) || log.action.toLowerCase().includes(activitySearchTermModal.toLowerCase()) || (log.description?.toLowerCase() || '').includes(activitySearchTermModal.toLowerCase()));}
        const now = new Date();
        if (activityDateRangeModal !== 'all') {
            let startDate;
            if (activityDateRangeModal === '24h') startDate = new Date(now.getTime() - (24 * 60 * 60 * 1000));
            else if (activityDateRangeModal === '7d') startDate = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));
            else if (activityDateRangeModal === '30d') startDate = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
            if (startDate) { logs = logs.filter(log => new Date(log.created_at) >= startDate); }
        }
        setFilteredActivityLogsInModal(logs); setTotalActivityPagesModal(Math.ceil(logs.length / ITEMS_PER_LOG_PAGE_MODAL)); setCurrentActivityPageModal(1);
    }, [activitySearchTermModal, activityDateRangeModal, showActivityModal, allActivityLogs]);
    const currentLogItemsInModal = filteredActivityLogsInModal.slice((currentActivityPageModal - 1) * ITEMS_PER_LOG_PAGE_MODAL, currentActivityPageModal * ITEMS_PER_LOG_PAGE_MODAL);
    const handleModalPageChange = (newPage) => { setCurrentActivityPageModal(newPage); };


    const periodOptions = [
        { value: '1d', label: '24 Jam', icon: <Clock size={14} className="mr-1" /> },
        { value: '7d', label: '7 Hari', icon: <CalendarDays size={14} className="mr-1" /> }
    ];    return (
        <AdminLayout headerTitle="Dashboard Utama">
            <Head title="Admin Dashboard" />
            
            <div className="max-w-screen-2xl mx-auto p-3 sm:p-4">
                {/* Kartu Gabungan Statistik Pengunjung */}
            {/* Layout diubah menjadi flex-col untuk mobile, dan md:flex-row untuk tablet ke atas */}
            <div className="bg-white p-4 md:p-6 rounded-lg shadow mb-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3">
                    <h2 className="text-xl font-semibold text-gray-800 mb-2 sm:mb-0">Statistik Pengunjung</h2>
                    <div className="flex items-center space-x-1 sm:space-x-2">
                        {periodOptions.map(opt => (
                            <button
                                key={opt.value}
                                onClick={() => handleChangePeriod(opt.value)}
                                className={`flex items-center px-2 py-1 sm:px-3 text-xs font-medium rounded-md transition-colors
                                            ${visitorStats.period === opt.value ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                            >
                                {opt.icon} {opt.label}
                            </button>
                         ))}
                    </div>
                </div>

                <p className="text-xs text-gray-500 mb-1">
                    {visitorStats.totalLoading ? 'Memuat...' : visitorStats.totalMessage}
                </p>
                {visitorStats.lastCached && <p className="text-xs text-gray-400 mb-4 italic">Cache: {visitorStats.lastCached}</p>}

                {/* Konten utama kartu: Total dan Chart */}
                {/* Dibuat menjadi grid agar bisa responsif */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 items-start">
                    {/* Angka Total - mengambil 1 kolom di lg, full width di mobile */}
                    <div className="lg:col-span-1 order-first lg:order-none text-center lg:text-left py-4 lg:pr-6">
                        {visitorStats.totalLoading && (
                            <div className="py-8">
                                <div className="inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
                                <p className="text-xs text-gray-500 mt-2">Memuat total...</p>
                            </div>
                        )}
                        {!visitorStats.totalLoading && visitorStats.totalError && visitorStats.total === 'Error' && (
                            <div className="py-8 bg-red-50 p-3 rounded-md border border-red-200">
                                <AlertCircle className="w-8 h-8 text-red-500 mx-auto lg:mx-0 mb-1" />
                                <p className="text-xs text-red-600 font-semibold">Gagal memuat total.</p>
                                <p className="text-xs text-red-500 mt-0.5">{visitorStats.totalError.substring(0,100)}</p>
                            </div>
                        )}
                        {!visitorStats.totalLoading && visitorStats.total !== 'Error' && visitorStats.total !== null && (
                            <>
                                <p className="text-4xl md:text-5xl font-bold text-primary">{typeof visitorStats.total === 'number' ? visitorStats.total.toLocaleString() : visitorStats.total}</p>
                                <p className="text-sm text-gray-600 mt-1">Total Kunjungan</p>
                                <p className="text-xs text-gray-500">Periode: {
                                    visitorStats.period === '1d' ? '24 Jam Terakhir' :
                                    visitorStats.period === '7d' ? '7 Hari Terakhir' : `.`
                                }</p>
                            </>
                        )}
                    </div>

                    {/* Chart - mengambil 2 kolom di lg, full width di mobile */}
                    <div className="lg:col-span-2 w-full">
                        <VisitorStatsChart
                            chartData={visitorStats.dailyChart}
                            loading={visitorStats.chartLoading}
                            error={visitorStats.chartError && !visitorStats.dailyChart ? visitorStats.chartError : null}
                            periodType={visitorStats.periodType}
                        />
                        {!visitorStats.chartLoading && visitorStats.chartError && visitorStats.dailyChart && (
                            <p className="text-xs text-center mt-2 text-yellow-600 bg-yellow-100 p-2 rounded-md">
                                <Info size={14} className="inline mr-1" /> {visitorStats.chartError}
                            </p>
                        )}
                    </div>
                </div>
            </div>


            {/* Riwayat Aktivitas Terbaru (Dashboard) */}
            {/* ... Konten riwayat aktivitas dashboard tetap sama, sudah cukup responsif dengan overflow-x-auto ... */}
            <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                    <h2 className="text-lg font-semibold text-gray-700 mb-2 sm:mb-0">Riwayat Aktivitas Terbaru</h2>
                    <button
                        onClick={openActivityModal}
                        className="flex items-center px-3 py-2 sm:px-4 bg-primary text-white text-xs font-medium rounded-md hover:bg-primary-darker transition-colors self-start sm:self-center"
                    >
                        Lihat Semua & Filter
                        <ExternalLink size={14} className="ml-2"/>
                    </button>
                </div>
                {loadingDashboardLogs && <p className="text-sm text-gray-500 text-center py-4">Memuat aktivitas...</p>}
                {!loadingDashboardLogs && dashboardActivityLogs.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Admin</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Waktu</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {dashboardActivityLogs.map((log) => (
                                    <tr key={log.id}>
                                        <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-700">{log.admin ? log.admin.username : 'Sistem'}</td>
                                        <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-700">{log.action}</td>
                                        <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-500">{new Date(log.created_at).toLocaleString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'})}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    !loadingDashboardLogs && <p className="text-center text-gray-500 py-4">Belum ada riwayat aktivitas.</p>
                )}
            </div>

            {/* Modal Riwayat Aktivitas */}
            {/* ... Konten modal tetap sama ... */}
            <Modal show={showActivityModal} onClose={closeActivityModal} maxWidth="full" closeable={false}>
                <div className="bg-white h-screen flex flex-col">
                    <div className="p-4 border-b flex justify-between items-center sticky top-0 bg-white z-20">
                        <h2 className="text-xl font-semibold text-primary">Riwayat Aktivitas Lengkap</h2>
                        <button onClick={closeActivityModal} className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100">
                            <X size={24} />
                        </button>
                    </div>
                    <div className="p-4 border-b space-y-3 sm:space-y-0 sm:flex sm:items-center sm:justify-between sticky top-[calc(3.5rem+1px)] bg-white z-10">
                        <div className="relative w-full sm:max-w-xs lg:max-w-md">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                <Search className="w-5 h-5 text-gray-400" />
                            </span>
                            <input
                                type="text"
                                placeholder="Cari admin, aksi, keterangan..."
                                value={activitySearchTermModal}
                                onChange={(e) => setActivitySearchTermModal(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary focus:outline-none text-sm"
                            />
                        </div>
                        <div className="flex items-center space-x-2 mt-2 sm:mt-0">
                            <CalendarDays size={18} className="text-gray-500"/>
                            <select
                                value={activityDateRangeModal}
                                onChange={(e) => setActivityDateRangeModal(e.target.value)}
                                className="text-sm border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                            >
                                <option value="all">Semua Waktu</option>
                                <option value="24h">24 Jam Terakhir</option>
                                <option value="7d">7 Hari Terakhir</option>
                                <option value="30d">30 Hari Terakhir</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex-grow overflow-y-auto p-4">
                        {loadingLogsModal && <p className="text-center text-gray-500 py-10">Memuat data aktivitas...</p>}
                        {!loadingLogsModal && currentLogItemsInModal.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 text-sm">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Admin</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Keterangan</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Waktu</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {currentLogItemsInModal.map((log, index) => (
                                            <tr key={log.id} className="hover:bg-gray-50">
                                                <td className="px-4 py-3 whitespace-nowrap text-xs">{(currentActivityPageModal - 1) * ITEMS_PER_LOG_PAGE_MODAL + index + 1}</td>
                                                <td className="px-4 py-3 whitespace-nowrap font-medium text-gray-700">{log.admin ? log.admin.username : <span className="italic text-gray-500">Sistem</span>}</td>
                                                <td className="px-4 py-3 whitespace-nowrap">{log.action}</td>
                                                <td className="px-4 py-3 break-words max-w-sm text-gray-600">{log.description || '-'}</td>
                                                <td className="px-4 py-3 whitespace-nowrap text-gray-500">{new Date(log.created_at).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            !loadingLogsModal && <p className="text-center text-gray-500 py-10">Tidak ada riwayat aktivitas yang sesuai dengan filter.</p>
                        )}
                    </div>
                    {totalActivityPagesModal > 1 && (
                        <div className="p-4 border-t flex justify-between items-center sticky bottom-0 bg-white z-10">
                             <span className="text-xs text-gray-600">
                                Menampilkan {currentLogItemsInModal.length} dari {filteredActivityLogsInModal.length} hasil
                            </span>
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => handleModalPageChange(currentActivityPageModal - 1)}
                                    disabled={currentActivityPageModal === 1}
                                    className="p-2 rounded-md border hover:bg-gray-100 disabled:opacity-50"
                                    aria-label="Halaman Sebelumnya"
                                > <ChevronLeft size={18} /> </button>
                                <span className="text-xs"> Halaman {currentActivityPageModal} dari {totalActivityPagesModal} </span>
                                <button
                                    onClick={() => handleModalPageChange(currentActivityPageModal + 1)}
                                    disabled={currentActivityPageModal === totalActivityPagesModal}
                                    className="p-2 rounded-md border hover:bg-gray-100 disabled:opacity-50"
                                    aria-label="Halaman Berikutnya"
                                > <ChevronRight size={18} /> </button>
                            </div>
                        </div>
                    )}                </div>
            </Modal>
            </div>
        </AdminLayout>
    );
}