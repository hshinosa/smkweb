// FILE: resources/js/Pages/Admin/DashboardPage.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout'; // Gunakan layout admin baru
import axios from 'axios';
import Modal from '@/Components/Modal'; // Pastikan Modal diimpor
import { Search, X, CalendarDays, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react'; // Ikon yang relevan

// Placeholder untuk Chart (Anda perlu memilih dan menginstal library chart)
const PlaceholderChart = ({ data, error }) => {
    if (error) {
        return (
            <div className="w-full h-64 bg-red-100 border border-red-300 rounded-md flex flex-col items-center justify-center text-red-600 p-4">
                <p className="font-semibold">Gagal memuat data pengunjung.</p>
                <p className="text-xs">{error}</p>
            </div>
        );
    }
    if (data === null) {
        return (
             <div className="w-full h-64 bg-gray-200 rounded-md flex items-center justify-center text-gray-500 animate-pulse">
                Memuat data pengunjung...
            </div>
        );
    }
    // Jika data ada, Anda akan merender chart di sini. Untuk sekarang, tampilkan angka.
    return (
        <div className="w-full h-64 bg-blue-50 border border-blue-200 rounded-md flex flex-col items-center justify-center text-blue-700 p-4">
            <p className="text-4xl font-bold">{typeof data === 'number' ? data.toLocaleString() : data}</p>
            <p className="text-sm mt-2">Total Pengunjung Unik (Simulasi)</p>
            {/* <div className="text-xs text-gray-500 mt-1">(Implementasi chart akan menggantikan ini)</div> */}
        </div>
    );
};

const ITEMS_PER_LOG_PAGE_MODAL = 10; // Item per halaman untuk modal log

export default function DashboardPage() {
    const { auth } = usePage().props; // Ambil admin dari props auth global jika sudah di-setup
    const admin = auth.admin;

    const [uniqueVisitors, setUniqueVisitors] = useState(null);
    const [visitorError, setVisitorError] = useState(null);

    // State untuk modal aktivitas
    const [showActivityModal, setShowActivityModal] = useState(false);
    const [allActivityLogs, setAllActivityLogs] = useState([]);
    const [filteredActivityLogsInModal, setFilteredActivityLogsInModal] = useState([]);
    const [activitySearchTermModal, setActivitySearchTermModal] = useState('');
    const [activityDateRangeModal, setActivityDateRangeModal] = useState('all'); // '24h', '7d', '30d', 'all'
    const [currentActivityPageModal, setCurrentActivityPageModal] = useState(1);
    const [totalActivityPagesModal, setTotalActivityPagesModal] = useState(1);
    const [loadingLogsModal, setLoadingLogsModal] = useState(false);

    // Log untuk ditampilkan di dashboard (5 terbaru)
    const [dashboardActivityLogs, setDashboardActivityLogs] = useState([]);
    const [loadingDashboardLogs, setLoadingDashboardLogs] = useState(false);


    // --- PENGAMBILAN DATA PENGUNJUNG UNIK DARI CLOUDFLARE (VIA BACKEND) ---
    useEffect(() => {
        const fetchCloudflareData = async () => {
            setVisitorError(null); // Reset error
            setUniqueVisitors(null); // Set ke null untuk loading state
            try {
                // Ganti dengan endpoint backend Anda yang memanggil Cloudflare
                const response = await axios.get(route('admin.api.cloudflare.stats'));
                setUniqueVisitors(response.data.unique_visitors_total || 'Data tidak tersedia');
            } catch (error) {
                console.error("Error fetching Cloudflare data via backend:", error.response?.data?.error || error.message);
                setVisitorError(error.response?.data?.details || error.response?.data?.error || "Terjadi kesalahan saat mengambil data.");
                setUniqueVisitors('Error'); // Atau null untuk tidak menampilkan angka jika error
            }
        };
        // fetchCloudflareData(); // Aktifkan jika endpoint backend sudah siap

        // --- SIMULASI DATA (HAPUS JIKA MENGGUNAKAN API ASLI) ---
        const timeoutId = setTimeout(() => {
            // Simulasi sukses
            setUniqueVisitors(Math.floor(Math.random() * 1000) + 1500);
            setVisitorError(null);

            // Simulasi error (uncomment untuk tes)
            // setVisitorError("Gagal terhubung ke server Cloudflare (simulasi).");
            // setUniqueVisitors('Error');
        }, 1500);
        return () => clearTimeout(timeoutId); // Cleanup timeout
        // --- AKHIR SIMULASI ---

    }, []);


    // --- PENGAMBILAN DATA RIWAYAT AKTIVITAS (UNTUK DASHBOARD & MODAL) ---
    const fetchActivityLogs = async (page = 1, perPage = ITEMS_PER_LOG_PAGE_MODAL, forModal = false) => {
        if (forModal) setLoadingLogsModal(true);
        else setLoadingDashboardLogs(true);

        try {
            const response = await axios.get(route('admin.api.activitylogs.index', {
                page: page,
                per_page: perPage,
                // Anda bisa menambahkan parameter filter ke backend di sini jika backend mendukung
                // search: forModal ? activitySearchTermModal : undefined,
                // date_range: forModal ? activityDateRangeModal : undefined,
            }));

            if (forModal) {
                setAllActivityLogs(response.data.data); // Simpan semua log yang diambil untuk modal saat ini
                setFilteredActivityLogsInModal(response.data.data); // Set initial filtered data
                setTotalActivityPagesModal(response.data.last_page);
                setCurrentActivityPageModal(response.data.current_page);
            } else {
                setDashboardActivityLogs(response.data.data.slice(0, 5)); // Hanya 5 untuk dashboard
            }
        } catch (error) {
            console.error("Error fetching activity logs:", error);
            if (forModal) alert("Gagal memuat riwayat aktivitas untuk modal.");
            else alert("Gagal memuat riwayat aktivitas untuk dashboard.");
        } finally {
            if (forModal) setLoadingLogsModal(false);
            else setLoadingDashboardLogs(false);
        }
    };

    // Ambil log untuk dashboard saat komponen mount
    useEffect(() => {
        fetchActivityLogs(1, 5, false); // Ambil 5 log terbaru untuk dashboard
    }, []);

    const openActivityModal = () => {
        fetchActivityLogs(1, ITEMS_PER_LOG_PAGE_MODAL, true); // Ambil data untuk halaman pertama modal
        setShowActivityModal(true);
    };

    const closeActivityModal = () => {
        setShowActivityModal(false);
        setActivitySearchTermModal('');
        setActivityDateRangeModal('all');
        // Tidak perlu reset current page karena akan di-fetch ulang saat buka
    };

    // Logika filter & pagination untuk modal
    useEffect(() => {
        // Jika filter dilakukan di frontend:
        if (!showActivityModal) return; // Hanya filter jika modal terbuka

        let logs = [...allActivityLogs]; // Mulai dengan semua log yang sudah di-fetch untuk modal

        if (activitySearchTermModal) {
            logs = logs.filter(log =>
                (log.admin?.username?.toLowerCase() || '').includes(activitySearchTermModal.toLowerCase()) ||
                log.action.toLowerCase().includes(activitySearchTermModal.toLowerCase()) ||
                (log.description?.toLowerCase() || '').includes(activitySearchTermModal.toLowerCase())
            );
        }

        const now = new Date();
        if (activityDateRangeModal !== 'all') {
            let startDate;
            if (activityDateRangeModal === '24h') startDate = new Date(now.getTime() - (24 * 60 * 60 * 1000));
            else if (activityDateRangeModal === '7d') startDate = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));
            else if (activityDateRangeModal === '30d') startDate = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
            if (startDate) {
                logs = logs.filter(log => new Date(log.created_at) >= startDate);
            }
        }
        setFilteredActivityLogsInModal(logs);
        setTotalActivityPagesModal(Math.ceil(logs.length / ITEMS_PER_LOG_PAGE_MODAL));
        setCurrentActivityPageModal(1);

        // Jika filter dilakukan di backend:
        // if (showActivityModal) {
        //     fetchActivityLogs(1, ITEMS_PER_LOG_PAGE_MODAL, true);
        // }

    }, [activitySearchTermModal, activityDateRangeModal, showActivityModal, allActivityLogs]); // Tambahkan allActivityLogs jika filter frontend

    const currentLogItemsInModal = filteredActivityLogsInModal.slice(
        (currentActivityPageModal - 1) * ITEMS_PER_LOG_PAGE_MODAL,
        currentActivityPageModal * ITEMS_PER_LOG_PAGE_MODAL
    );

    const handleModalPageChange = (newPage) => {
        setCurrentActivityPageModal(newPage);
        // Jika filter di backend, panggil API:
        // fetchActivityLogs(newPage, ITEMS_PER_LOG_PAGE_MODAL, true);
    }


    return (
        <AdminLayout headerTitle="Dashboard Utama">
            <Head title="Admin Dashboard" />

            <div className="space-y-6">
                {/* Card Pengunjung Unik */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-lg font-semibold text-gray-700 mb-1">Pengunjung Unik</h2>
                    <p className="text-xs text-gray-500 mb-4">Data pengunjung unik selama periode tertentu (Contoh: 30 hari terakhir).</p>
                    <PlaceholderChart data={uniqueVisitors} error={visitorError} />
                </div>

                {/* Card Riwayat Aktivitas Terbaru (Dashboard) */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold text-gray-700">Riwayat Aktivitas Terbaru</h2>
                        <button
                            onClick={openActivityModal}
                            className="flex items-center px-4 py-2 bg-primary text-white text-xs font-medium rounded-md hover:bg-primary-darker transition-colors"
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
            </div>

            {/* Modal Riwayat Aktivitas Layar Penuh */}
            <Modal show={showActivityModal} onClose={closeActivityModal} maxWidth="full" closeable={false}>
                <div className="bg-white h-screen flex flex-col">
                    <div className="p-4 border-b flex justify-between items-center sticky top-0 bg-white z-20"> {/* Tambah z-20 */}
                        <h2 className="text-xl font-semibold text-primary">Riwayat Aktivitas Lengkap</h2>
                        <button onClick={closeActivityModal} className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100">
                            <X size={24} />
                        </button>
                    </div>

                    <div className="p-4 border-b space-y-3 sm:space-y-0 sm:flex sm:items-center sm:justify-between sticky top-[calc(3.5rem+1px)] bg-white z-10"> {/* Sesuaikan top jika header modal berbeda tinggi */}
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
                                >
                                    <ChevronLeft size={18} />
                                </button>
                                <span className="text-xs">
                                    Halaman {currentActivityPageModal} dari {totalActivityPagesModal}
                                </span>
                                <button
                                    onClick={() => handleModalPageChange(currentActivityPageModal + 1)}
                                    disabled={currentActivityPageModal === totalActivityPagesModal}
                                    className="p-2 rounded-md border hover:bg-gray-100 disabled:opacity-50"
                                    aria-label="Halaman Berikutnya"
                                >
                                    <ChevronRight size={18} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </Modal>
        </AdminLayout>
    );
}