
import React from 'react';
import { FinancialSummary } from '../types';

interface SummaryCardsProps {
  summary: FinancialSummary;
  lang: 'bn' | 'en';
}

const SummaryCards: React.FC<SummaryCardsProps> = ({ summary, lang }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat(lang === 'bn' ? 'bn-BD' : 'en-US', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const t = {
    balance: lang === 'bn' ? 'সমিতির মোট তহবিল' : 'Total Society Fund',
    income: lang === 'bn' ? 'মোট জমা / আয়' : 'Total Deposits',
    expense: lang === 'bn' ? 'মোট ঋণ / ব্যয়' : 'Total Disbursements',
    items: lang === 'bn' ? 'মোট রিসিট' : 'Total Receipts'
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-3xl shadow-sm">
        <h3 className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-2">{t.balance}</h3>
        <p className="text-2xl font-black text-slate-900 dark:text-white">{formatCurrency(summary.currentBalance)}</p>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-3xl shadow-sm">
        <h3 className="text-teal-500 text-[10px] font-bold uppercase tracking-widest mb-2">{t.income}</h3>
        <p className="text-2xl font-black text-teal-600">{formatCurrency(summary.totalIncome)}</p>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-3xl shadow-sm">
        <h3 className="text-rose-500 text-[10px] font-bold uppercase tracking-widest mb-2">{t.expense}</h3>
        <p className="text-2xl font-black text-rose-600">{formatCurrency(summary.totalExpense)}</p>
      </div>

      <div className="bg-slate-900 dark:bg-brand-600 p-6 rounded-3xl shadow-xl shadow-brand-500/10">
        <h3 className="text-brand-100 text-[10px] font-bold uppercase tracking-widest mb-2">{t.items}</h3>
        <p className="text-2xl font-black text-white">{summary.totalItemsSold.toLocaleString(lang === 'bn' ? 'bn-BD' : 'en-US')} <span className="text-xs font-medium opacity-60">items</span></p>
      </div>
    </div>
  );
};

export default SummaryCards;
