import { usePaymentAnalytics } from '@/hooks/usePaymentAnalytics';
import { Calendar, CircleDollarSign, TrendingUp, Users } from 'lucide-react';
import {
  Bar, BarChart, CartesianGrid,
  Cell,
  Legend, Line, LineChart,
  Pie,
  PieChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis
} from 'recharts';
import { LoadingSpinner } from '../LoadingSpinner';
 

const COLORS = ['#0088FE', '#00C49F'];


export default function Home() {
 const{
  stats,
  formattedMonthlyData,
  formattedPlanDistribution,
  loading,
  dateRange,
  setDateRange,
 }=usePaymentAnalytics()

 if(loading)
 {
  return <LoadingSpinner/>
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