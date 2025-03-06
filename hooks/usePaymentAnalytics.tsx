import { ADMIN_API } from '@/app/api/handle-token-expire';
import { useEffect, useState } from 'react';

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

export const usePaymentAnalytics = () => {
  const [stats, setStats] = useState<Stats>({
    totalRevenue: 0,
    monthlyGrowth: 0,
    activeSubscribers: 0,
  });
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [planDistribution, setPlanDistribution] = useState<PlanData[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 6)).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  });

  const formattedMonthlyData: FormattedMonthlyData[] = monthlyData.map((data) => ({
    month: data.month,
    revenue: data.revenue,
    subscribers: data.subscribers,
  }));

  const formattedPlanDistribution: FormattedPlanData[] = planDistribution.map((data) => ({
    plan: data.plan,
    count: data.count,
    revenue: data.revenue,
  }));

  const fetchData = async () => {
    try {
      setLoading(true);
      const queryParams = `startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`;

      const [statsRes, monthlyRes, plansRes] = await Promise.all([
        ADMIN_API.get(`/payment-stats?${queryParams}`, { withCredentials: true }),
        ADMIN_API.get(`/monthly-payments?${queryParams}`, { withCredentials: true }),
        ADMIN_API.get(`/plan-distribution?${queryParams}`, { withCredentials: true }),
      ]);

      const statsData = statsRes.data.data || { totalRevenue: 0, monthlyGrowth: 0, activeSubscribers: 0 };
      setStats({
        totalRevenue: statsData.totalRevenue || 0,
        monthlyGrowth: statsData.monthlyGrowth || 0,
        activeSubscribers: statsData.activeSubscribers || 0,
      });

      const months: MonthlyData[] = monthlyRes.data.data.map((item: any) => ({
        month: item.month,
        revenue: item.revenue,
        subscribers: item.subscribers,
      }));

      setMonthlyData(months);

      const plans: PlanData[] = plansRes.data.data.map((item: any) => ({
        plan: item.plan,
        count: item.count,
        revenue: item.revenue,
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

  return {
    stats,
    formattedMonthlyData,
    formattedPlanDistribution,
    loading,
    dateRange,
    setDateRange,
  };
};