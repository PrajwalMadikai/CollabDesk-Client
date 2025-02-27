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

 

interface Stats {
  totalRevenue: number;
  monthlyGrowth: number;
  activeSubscribers: number;
}

interface MonthlyData {
  month: string;
  revenue: number;
  subscribers: number;
}

interface PlanData {
  plan: string;
  count: number;
  revenue: number;
}

interface DateRange {
  startDate: string;
  endDate: string;
}

interface FormattedMonthlyData {
  month: string;
  revenue: number;
  subscribers: number;
}

interface FormattedPlanData {
  plan: string;
  count: number;
  revenue: number;
}

const COLORS = ['#0088FE', '#00C49F'];

 

export default function Home() {
  const [stats, setStats] = useState<Stats>({
    totalRevenue: 0,
    monthlyGrowth: 0,
    activeSubscribers: 0
  });
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [planDistribution, setPlanDistribution] = useState<PlanData[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 6)).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });

  const formattedMonthlyData: FormattedMonthlyData[] = monthlyData.map(data => ({
    month: data.month,
    revenue: data.revenue,
    subscribers: data.subscribers
  }));

  const formattedPlanDistribution: FormattedPlanData[] = planDistribution.map(data => ({
    plan: data.plan,
    count: data.count,
    revenue: data.revenue
  }));

  const fetchData = async () => {
    try {
      setLoading(true);
      const queryParams = `startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`;
  
      const [statsRes, monthlyRes, plansRes] = await Promise.all([
        ADMIN_API.get(`/payment-stats?${queryParams}`, { withCredentials: true }),
        ADMIN_API.get(`/monthly-payments?${queryParams}`, { withCredentials: true }),
        ADMIN_API.get(`/plan-distribution?${queryParams}`, { withCredentials: true })
      ]);
  
  
      const statsData = statsRes.data.data || { totalRevenue: 0, monthlyGrowth: 0, activeSubscribers: 0 };
      setStats({
        totalRevenue: statsData.totalRevenue || 0,
        monthlyGrowth: statsData.monthlyGrowth || 0,
        activeSubscribers: statsData.activeSubscribers || 0
      });
  
      const months: MonthlyData[] = monthlyRes.data.data.map((item: any) => ({
        month: item.month,
        revenue: item.revenue,
        subscribers: item.subscribers
      }));
  
      setMonthlyData(months);
  
      const plans = plansRes.data.data.map((item: any) => ({
        plan: item.plan,
        count: item.count,
        revenue: item.revenue
      }));
  
      setPlanDistribution(plans);
    } catch (error) {
      console.error('Error in data fetching:', error);
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
    <div className="p-4 md:p-6 bg-gray-900 min-h-screen">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-0 text-white">Payment Analytics</h1>
        <div className="flex items-center space-x-4   p-3 rounded-lg shadow">
          <Calendar className="text-gray-400" size={20} />
          <input
            type="date"
            value={dateRange.startDate}
            onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
            className="border rounded p-1 bg-gray-700 text-white border-gray-600"
          />
          <span className="text-gray-400">to</span>
          <input
            type="date"
            value={dateRange.endDate}
            onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
            className="border rounded p-1 bg-gray-700 text-white border-gray-600"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
        <div className="bg-gray-800 p-4 md:p-6 rounded-xl shadow-md">
          <div className="flex items-center mb-4">
            <CircleDollarSign className="text-green-400 w-6 md:w-8 h-6 md:h-8 mr-3" />
            <h2 className="text-lg md:text-xl font-semibold text-white">Total Revenue</h2>
          </div>
          <p className="text-2xl md:text-3xl font-bold text-white">₹{stats.totalRevenue.toLocaleString()}</p>
        </div>

        <div className="bg-gray-800 p-4 md:p-6 rounded-xl shadow-md">
          <div className="flex items-center mb-4">
            <TrendingUp className="text-blue-400 w-6 md:w-8 h-6 md:h-8 mr-3" />
            <h2 className="text-lg md:text-xl font-semibold text-white">Monthly Growth</h2>
          </div>
          <p className="text-2xl md:text-3xl font-bold text-white">{stats.monthlyGrowth}%</p>
        </div>

        <div className="bg-gray-800 p-4 md:p-6 rounded-xl shadow-md">
          <div className="flex items-center mb-4">
            <Users className="text-purple-400 w-6 md:w-8 h-6 md:h-8 mr-3" />
            <h2 className="text-lg md:text-xl font-semibold text-white">Active Subscribers</h2>
          </div>
          <p className="text-2xl md:text-3xl font-bold text-white">{stats.activeSubscribers}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-800 p-4 md:p-6 rounded-xl shadow-md">
          <h2 className="text-lg md:text-xl font-semibold mb-6 text-white">Monthly Revenue</h2>
          <div className="h-64 md:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={formattedMonthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1F2937', border: 'none' }}
                  labelStyle={{ color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Legend wrapperStyle={{ color: '#fff' }} />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#60A5FA" 
                  strokeWidth={2}
                  name="Revenue"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-gray-800 p-4 md:p-6 rounded-xl shadow-md">
          <h2 className="text-lg md:text-xl font-semibold mb-6 text-white">Monthly Subscribers</h2>
          <div className="h-64 md:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={formattedMonthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1F2937', border: 'none' }}
                  labelStyle={{ color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Legend wrapperStyle={{ color: '#fff' }} />
                <Bar 
                  dataKey="subscribers" 
                  fill="#A78BFA"
                  name="Subscribers"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-gray-800 p-4 md:p-6 rounded-xl shadow-md">
          <h2 className="text-lg md:text-xl font-semibold mb-6 text-white">Plan Distribution</h2>
          <div className="h-64 md:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={formattedPlanDistribution}
                  dataKey="count"
                  nameKey="plan"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={{ fill: '#fff' }}
                >
                  {formattedPlanDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1F2937', border: 'none' }}
                  labelStyle={{ color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Legend wrapperStyle={{ color: '#fff' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-gray-800 p-4 md:p-6 rounded-xl shadow-md">
          <h2 className="text-lg md:text-xl font-semibold mb-6 text-white">Plan Revenue Distribution</h2>
          <div className="h-64 md:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={formattedPlanDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="plan" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1F2937', border: 'none' }}
                  labelStyle={{ color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Legend wrapperStyle={{ color: '#fff' }} />
                <Bar 
                  dataKey="revenue" 
                  fill="#34D399"
                  name="Revenue"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}