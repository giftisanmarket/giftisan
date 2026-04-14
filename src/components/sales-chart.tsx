"use client";

import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";
import { format, subDays, isSameDay } from "date-fns";
import { useMemo } from "react";

interface SalesChartProps {
  sales: any[];
}

export function SalesChart({ sales }: SalesChartProps) {
  const chartData = useMemo(() => {
    const last7Days = [...Array(7)].map((_, i) => subDays(new Date(), i)).reverse();
    
    return last7Days.map(date => {
      const daySales = sales.filter(sale => 
        isSameDay(new Date(sale.order.createdAt), date)
      );
      
      const total = daySales.reduce((acc, sale) => acc + (sale.price * sale.quantity), 0);
      
      return {
        date: format(date, "MMM dd"),
        revenue: total
      };
    });
  }, [sales]);

  return (
    <div className="h-[300px] w-full mt-8">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#da7b5a" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#da7b5a" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
          <XAxis 
            dataKey="date" 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#9ca3af', fontSize: 12 }}
            dy={10}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#9ca3af', fontSize: 12 }}
            tickFormatter={(value) => `$${value}`}
          />
          <Tooltip 
            contentStyle={{ 
              borderRadius: '20px', 
              border: 'none', 
              boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
              padding: '12px'
            }}
            itemStyle={{ color: '#1a2c2c', fontWeight: 'bold' }}
          />
          <Area 
            type="monotone" 
            dataKey="revenue" 
            stroke="#da7b5a" 
            strokeWidth={4}
            fillOpacity={1} 
            fill="url(#colorRevenue)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
