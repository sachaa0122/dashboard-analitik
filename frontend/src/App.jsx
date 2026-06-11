import { useState, useEffect } from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

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

  const chartData = {
    labels: penduduk.map((item) => item.provinsi),
    datasets: [
      {
        label: "Jumlah Penduduk",
        data: penduduk.map((item) => item.jumlah),
        backgroundColor: [
          "#3B82F6", "#10B981", "#8B5CF6", "#F59E0B",
          "#EF4444", "#06B6D4", "#84CC16", "#F97316",
          "#EC4899", "#6366F1",
        ],
        borderRadius: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: "Jumlah Penduduk Per Provinsi (2023)",
        font: { size: 14 },
      },
    },
    scales: {
      y: {
        ticks: {
          callback: (value) => value.toLocaleString("id-ID"),
        },
      },
    },
  };

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

      {/* Bar Chart */}
      <div className="bg-white rounded-xl shadow p-5 mb-6">
        <Bar data={chartData} options={chartOptions} />
      </div>

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