import { ADMIN_API } from '@/app/api/handle-token-expire';
import { Calendar, CircleDollarSign, TrendingUp, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  Bar, BarChart, CartesianGrid,
  Cell,
  Legend, Line, LineChart,
  Pie,
  PieChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F'];

export default function Home() {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    monthlyGrowth: 0,
    activeSubscribers: 0
  });
  const [monthlyData, setMonthlyData] = useState([]);
  const [planDistribution, setPlanDistribution] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 6)).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const queryParams = `startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`;

      const [statsRes, monthlyRes, plansRes] = await Promise.all([
        ADMIN_API.get(`/payment-stats?${queryParams}`, { withCredentials: true }),
        ADMIN_API.get(`/monthly-payments?${queryParams}`, { withCredentials: true }),
        ADMIN_API.get(`/plan-distribution?${queryParams}`, { withCredentials: true })
      ]);

      setStats(statsRes.data);
      setMonthlyData(monthlyRes.data);
      setPlanDistribution(plansRes.data);
    } catch (error) {
      console.error('Error fetching payment data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [dateRange]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      {/* Date Filter */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-0">Payment Analytics</h1>
        <div className="flex items-center space-x-4 bg-white p-3 rounded-lg shadow">
          <Calendar className="text-gray-500" size={20} />
          <input
            type="date"
            value={dateRange.startDate}
            onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
            className="border rounded p-1"
          />
          <span>to</span>
          <input
            type="date"
            value={dateRange.endDate}
            onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
            className="border rounded p-1"
          />
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
        <div className="bg-white p-4 md:p-6 rounded-xl shadow-md">
          <div className="flex items-center mb-4">
            <CircleDollarSign className="text-green-500 w-6 md:w-8 h-6 md:h-8 mr-3" />
            <h2 className="text-lg md:text-xl font-semibold">Total Revenue</h2>
          </div>
          <p className="text-2xl md:text-3xl font-bold">₹{stats.totalRevenue.toLocaleString()}</p>
        </div>

        <div className="bg-white p-4 md:p-6 rounded-xl shadow-md">
          <div className="flex items-center mb-4">
            <TrendingUp className="text-blue-500 w-6 md:w-8 h-6 md:h-8 mr-3" />
            <h2 className="text-lg md:text-xl font-semibold">Monthly Growth</h2>
          </div>
          <p className="text-2xl md:text-3xl font-bold">{stats.monthlyGrowth}%</p>
        </div>

        <div className="bg-white p-4 md:p-6 rounded-xl shadow-md">
          <div className="flex items-center mb-4">
            <Users className="text-purple-500 w-6 md:w-8 h-6 md:h-8 mr-3" />
            <h2 className="text-lg md:text-xl font-semibold">Active Subscribers</h2>
          </div>
          <p className="text-2xl md:text-3xl font-bold">{stats.activeSubscribers}</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Revenue Chart */}
        <div className="bg-white p-4 md:p-6 rounded-xl shadow-md">
          <h2 className="text-lg md:text-xl font-semibold mb-6">Monthly Revenue</h2>
          <div className="h-64 md:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Subscribers Chart */}
        <div className="bg-white p-4 md:p-6 rounded-xl shadow-md">
          <h2 className="text-lg md:text-xl font-semibold mb-6">Monthly Subscribers</h2>
          <div className="h-64 md:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="subscribers" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Plan Distribution */}
        <div className="bg-white p-4 md:p-6 rounded-xl shadow-md">
          <h2 className="text-lg md:text-xl font-semibold mb-6">Plan Distribution</h2>
          <div className="h-64 md:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={planDistribution}
                  dataKey="count"
                  nameKey="plan"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {planDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Plan Revenue */}
        <div className="bg-white p-4 md:p-6 rounded-xl shadow-md">
          <h2 className="text-lg md:text-xl font-semibold mb-6">Plan Revenue Distribution</h2>
          <div className="h-64 md:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={planDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="plan" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="revenue" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}