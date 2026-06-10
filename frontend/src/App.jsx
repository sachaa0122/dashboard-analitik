import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [penduduk, setPenduduk] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resPenduduk, resSummary] = await Promise.all([
          axios.get("http://localhost:3000/api/penduduk"),
          axios.get("http://localhost:3000/api/summary"),
        ]);
        setPenduduk(resPenduduk.data.data);
        setSummary(resSummary.data.data);
      } catch (error) {
        console.error("Gagal fetch data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <p className="text-gray-500 text-lg">Memuat data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Dashboard Analitik Penduduk Indonesia
        </h1>
        <p className="text-gray-500 mt-1">Data BPS 2023</p>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow p-5">
            <p className="text-sm text-gray-500">Total Penduduk</p>
            <p className="text-2xl font-bold text-blue-600">
              {summary.total_penduduk.toLocaleString("id-ID")}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow p-5">
            <p className="text-sm text-gray-500">Provinsi Terbanyak</p>
            <p className="text-2xl font-bold text-green-600">
              {summary.provinsi_terbanyak}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow p-5">
            <p className="text-sm text-gray-500">Jumlah Provinsi</p>
            <p className="text-2xl font-bold text-purple-600">
              {summary.jumlah_provinsi}
            </p>
          </div>
        </div>
      )}

      {/* Tabel Data */}
      <div className="bg-white rounded-xl shadow p-5">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          Data Penduduk Per Provinsi
        </h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-left">
              <th className="p-3 text-gray-600">Provinsi</th>
              <th className="p-3 text-gray-600">Pulau</th>
              <th className="p-3 text-gray-600">Jumlah Penduduk</th>
            </tr>
          </thead>
          <tbody>
            {penduduk.map((item, index) => (
              <tr key={index} className="border-t hover:bg-gray-50">
                <td className="p-3 text-gray-800">{item.provinsi}</td>
                <td className="p-3 text-gray-500">{item.pulau}</td>
                <td className="p-3 text-gray-800">
                  {item.jumlah.toLocaleString("id-ID")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;