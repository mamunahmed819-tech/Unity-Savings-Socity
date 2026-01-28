
import React from 'react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';
import { Transaction, TransactionType, Category } from '../types';
import { COLORS } from '../constants';

interface ChartsSectionProps {
  transactions: Transaction[];
  lang: 'bn' | 'en';
}

const ChartsSection: React.FC<ChartsSectionProps> = ({ transactions, lang }) => {
  const isDarkMode = document.documentElement.classList.contains('dark');

  const t = {
    expDist: lang === 'bn' ? 'আর্থিক বণ্টনের ধরণ' : 'Fund Distribution',
    weeklySpend: lang === 'bn' ? 'সাপ্তাহিক লেনদেন ট্রেন্ড' : 'Weekly Transaction Trends',
    noData: lang === 'bn' ? 'কোনো তথ্য নেই' : 'No analytics available',
    categories: {
      // Fix: Mapping correctly to Category enum keys defined in types.ts
      [Category.SAVINGS]: lang === 'bn' ? 'সঞ্চয়' : 'Savings',
      [Category.LOAN_REPAYMENT]: lang === 'bn' ? 'ঋণ পরিশোধ' : 'Loan Repayment',
      [Category.MEMBERSHIP_FEE]: lang === 'bn' ? 'সদস্যপদ ফি' : 'Membership Fee',
      [Category.DONATION]: lang === 'bn' ? 'দান' : 'Donation',
      [Category.LOAN_DISBURSEMENT]: lang === 'bn' ? 'ঋণ বিতরণ' : 'Loan Disbursement',
      [Category.WITHDRAWAL]: lang === 'bn' ? 'উত্তোলন' : 'Withdrawal',
      [Category.OTHERS]: lang === 'bn' ? 'অন্যান্য' : 'Others',
    }
  };

  const pieDataRaw = transactions
    // Fix: Using TransactionType.INCOME instead of non-existent SALE
    .filter(t => t.type === TransactionType.INCOME)
    .reduce((acc, trans) => {
      trans.items.forEach(item => {
        acc[item.category] = (acc[item.category] || 0) + item.total;
      });
      return acc;
    }, {} as Record<string, number>);

  const pieData = Object.keys(pieDataRaw).map(key => ({
    name: t.categories[key as Category] || key,
    value: pieDataRaw[key]
  }));

  const barDataRaw = transactions
    // Fix: Using TransactionType.INCOME instead of non-existent SALE
    .filter(t => t.type === TransactionType.INCOME)
    .reduce((acc, trans) => {
      acc[trans.date] = (acc[trans.date] || 0) + trans.totalAmount;
      return acc;
    }, {} as Record<string, number>);

  const barData = Object.keys(barDataRaw)
    .sort()
    .slice(-7)
    .map(date => ({
      date: new Date(date).toLocaleDateString(lang === 'bn' ? 'bn-BD' : 'en-US', { weekday: 'short' }),
      amount: barDataRaw[date]
    }));

  const renderCustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-3 rounded-xl shadow-xl">
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">{`${payload[0].name || payload[0].payload.date}`}</p>
          <p className="text-lg font-bold text-teal-600">
            {`৳${payload[0].value.toLocaleString(lang === 'bn' ? 'bn-BD' : 'en-US')}`}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
        <h3 className="text-slate-900 dark:text-white font-bold text-sm uppercase tracking-widest mb-8">{t.expDist}</h3>
        <div className="h-[280px] w-full">
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={65} outerRadius={95} paddingAngle={8} dataKey="value">
                  {pieData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS.pieColors[index % COLORS.pieColors.length]} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip content={renderCustomTooltip} />
                <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', fontWeight: 500 }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-slate-400 italic text-sm">{t.noData}</div>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
        <h3 className="text-slate-900 dark:text-white font-bold text-sm uppercase tracking-widest mb-8">{t.weeklySpend}</h3>
        <div className="h-[280px] w-full">
          {barData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#1e293b" : "#f1f5f9"} vertical={false} />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(value) => `৳${value}`} />
                <Tooltip cursor={{fill: isDarkMode ? '#1e293b' : '#f8fafc', radius: 4}} content={renderCustomTooltip} />
                <Bar dataKey="amount" fill="#0d9488" radius={[4, 4, 4, 4]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
             <div className="flex items-center justify-center h-full text-slate-400 italic text-sm">{t.noData}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChartsSection;
