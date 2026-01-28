import React from 'react';
import { Transaction, TransactionType } from '../types';
import { Icons } from '../constants';

interface TransactionListProps {
  transactions: Transaction[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filterMonth: string;
  onMonthChange: (month: string) => void;
  onDelete: (id: string) => void;
  onShowInvoice: (transaction: Transaction) => void;
  lang: 'bn' | 'en';
}

const TransactionList: React.FC<TransactionListProps> = ({
  transactions, searchQuery, onSearchChange, filterMonth, onMonthChange, onDelete, onShowInvoice, lang
}) => {
  const t = {
    title: lang === 'bn' ? 'লেনদেন ও রিসিট ইতিহাস' : 'Transaction & Receipt History',
    search: lang === 'bn' ? 'সদস্য বা বিবরণ...' : 'Search member or description...',
    noData: lang === 'bn' ? 'কোনো লেনদেন পাওয়া যায়নি' : 'No transactions recorded',
    itemsLabel: lang === 'bn' ? 'টি আইটেম' : 'entries'
  };

  const filtered = transactions.filter(tr => {
    const itemTitles = tr.items.map(i => i.title.toLowerCase()).join(' ');
    const memberName = (tr.receivedFrom || '').toLowerCase();
    const matchSearch = itemTitles.includes(searchQuery.toLowerCase()) || 
                      memberName.includes(searchQuery.toLowerCase());
    const matchMonth = filterMonth === 'all' || tr.date.startsWith(filterMonth);
    return matchSearch && matchMonth;
  });

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 overflow-hidden">
      <div className="p-8 border-b border-slate-50 dark:border-slate-800">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">{t.title}</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{filtered.length} receipts</p>
          </div>
          <div className="flex flex-wrap gap-3 w-full lg:w-auto">
            <div className="relative grow md:grow-0">
              <span className="absolute inset-y-0 left-4 flex items-center text-slate-400"><Icons.Search /></span>
              <input type="text" placeholder={t.search} className="w-full md:w-64 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/10 transition-all" value={searchQuery} onChange={e => onSearchChange(e.target.value)} />
            </div>
          </div>
        </div>
      </div>

      <div className="divide-y divide-slate-50 dark:divide-slate-800">
        {filtered.length > 0 ? (
          filtered.map(tr => (
            <div key={tr.id} className="p-6 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
              <div className="flex items-center gap-5">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg ${tr.type === TransactionType.INCOME ? 'bg-teal-50 dark:bg-teal-500/10 text-teal-600' : 'bg-rose-50 dark:bg-rose-500/10 text-rose-600'}`}>
                  {tr.type === TransactionType.INCOME ? 'R' : 'P'}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm truncate max-w-[150px] md:max-w-[300px]">
                    <span className="text-slate-400 mr-2 text-[10px] font-black">{tr.receivedFrom}</span>
                    {tr.items.map(i => i.title).join(', ')}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{tr.items.length} {t.itemsLabel}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-200 dark:bg-slate-700"></span>
                    <span className="text-[10px] font-bold text-slate-400">{new Date(tr.date).toLocaleDateString(lang === 'bn' ? 'bn-BD' : 'en-US', { day: '2-digit', month: 'short' })}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-200 dark:bg-slate-700"></span>
                    <span className="text-[10px] font-black text-brand-500">{tr.id}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className={`font-black text-sm ${tr.type === TransactionType.INCOME ? 'text-teal-600' : 'text-rose-600'}`}>
                    {tr.type === TransactionType.INCOME ? '+' : '-'} ৳{tr.totalAmount.toLocaleString(lang === 'bn' ? 'bn-BD' : 'en-US')}
                  </p>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => onShowInvoice(tr)} title="View Receipt" className="p-2 text-slate-300 hover:text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-500/10 rounded-xl transition-all">
                    <Icons.Invoice />
                  </button>
                  <button onClick={() => onDelete(tr.id)} className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79" /></svg>
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="py-20 text-center text-slate-400 font-medium text-sm">{t.noData}</div>
        )}
      </div>
    </div>
  );
};

export default TransactionList;