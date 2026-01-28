
import React, { useState } from 'react';
import { SOCIETY_SCHEMES } from './TransactionForm';
import { Category } from '../types';
import { Icons } from '../constants';

interface MedicineListModalProps {
  onClose: () => void;
  lang: 'bn' | 'en';
}

const MedicineListModal: React.FC<MedicineListModalProps> = ({ onClose, lang }) => {
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState<Category | 'all'>('all');

  const t = {
    title: lang === 'bn' ? 'স্কিম ও ফি তালিকা' : 'Scheme & Fee Directory',
    search: lang === 'bn' ? 'নাম অথবা শর্ট কোড খুজুন...' : 'Search name or short code...',
    all: lang === 'bn' ? 'সব ক্যাটাগরি' : 'All Categories',
    name: lang === 'bn' ? 'স্কিমের নাম' : 'Scheme Name',
    price: lang === 'bn' ? 'মূল্য/ফি' : 'Price/Fee',
    cat: lang === 'bn' ? 'ধরণ' : 'Type',
    close: lang === 'bn' ? 'বন্ধ করুন' : 'Close',
    categories: {
      // Fix: Using correct Category enum keys from types.ts
      [Category.SAVINGS]: lang === 'bn' ? 'সঞ্চয়' : 'Savings',
      [Category.LOAN_REPAYMENT]: lang === 'bn' ? 'ঋণ পরিশোধ' : 'Loan Repayment',
      [Category.MEMBERSHIP_FEE]: lang === 'bn' ? 'সদস্যপদ ফি' : 'Membership Fee',
      [Category.DONATION]: lang === 'bn' ? 'দান' : 'Donation',
      [Category.LOAN_DISBURSEMENT]: lang === 'bn' ? 'ঋণ বিতরণ' : 'Loan Disbursement',
      [Category.WITHDRAWAL]: lang === 'bn' ? 'উত্তোলন' : 'Withdrawal',
      [Category.OTHERS]: lang === 'bn' ? 'অন্যান্য' : 'Others',
    }
  };

  const filtered = SOCIETY_SCHEMES.filter(m => {
    const q = search.toLowerCase();
    const matchSearch = m.name.toLowerCase().includes(q) || m.code.toLowerCase().includes(q);
    const matchCat = filterCat === 'all' || m.category === filterCat;
    return matchSearch && matchCat;
  }).sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="bg-white dark:bg-slate-900 w-full max-w-4xl h-[85vh] rounded-[3rem] shadow-3xl border border-slate-100 dark:border-slate-800 flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="p-8 md:p-10 border-b border-slate-50 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{t.title}</h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{SOCIETY_SCHEMES.length} schemes tracked</p>
            </div>
            <button onClick={onClose} className="p-3 bg-white dark:bg-slate-800 text-slate-400 hover:text-rose-500 rounded-2xl border border-slate-100 dark:border-slate-700 transition-all shadow-sm">
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <span className="absolute inset-y-0 left-5 flex items-center text-slate-400"><Icons.Search /></span>
              <input 
                type="text" 
                placeholder={t.search} 
                className="w-full bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl pl-12 pr-6 py-4 text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-brand-500/5 transition-all"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <select 
              className="bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-500 focus:outline-none focus:ring-4 focus:ring-brand-500/5 transition-all"
              value={filterCat}
              onChange={e => setFilterCat(e.target.value as any)}
            >
              <option value="all">{t.all}</option>
              {Object.values(Category).map(cat => (
                <option key={cat} value={cat}>{t.categories[cat]}</option>
              ))}
            </select>
          </div>
        </div>

        {/* List Content */}
        <div className="flex-grow overflow-y-auto p-8 no-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((item, idx) => (
              <div key={idx} className="bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800/50 p-6 rounded-[2rem] group hover:border-brand-500/30 transition-all hover:shadow-lg hover:shadow-brand-500/5">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex flex-col gap-1">
                    <div className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                      // Fix: Styling based on correct Category enum keys
                      item.category === Category.SAVINGS ? 'bg-teal-100 text-teal-700' : 
                      item.category === Category.MEMBERSHIP_FEE ? 'bg-indigo-100 text-indigo-700' :
                      item.category === Category.LOAN_REPAYMENT ? 'bg-amber-100 text-amber-700' : 'bg-slate-200 text-slate-600'
                    }`}>
                      {t.categories[item.category]}
                    </div>
                    <span className="text-[10px] font-black text-brand-600 bg-brand-50 dark:bg-brand-900/20 px-2 py-0.5 rounded border border-brand-100 dark:border-brand-800 w-fit">
                      {item.code}
                    </span>
                  </div>
                  <span className="text-lg font-black text-slate-900 dark:text-white">৳{item.price.toFixed(2)}</span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-brand-500 transition-colors">{item.name}</h4>
                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Policy: Enterprise</span>
                  <div className="flex gap-1">
                     <div className="w-1.5 h-1.5 rounded-full bg-brand-500"></div>
                     <div className="w-1.5 h-1.5 rounded-full bg-brand-200"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {filtered.length === 0 && (
            <div className="py-20 text-center">
              <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No items found matching "{search}"</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-8 border-t border-slate-50 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-center">
           <button onClick={onClose} className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
             {t.close}
           </button>
        </div>
      </div>
    </div>
  );
};

export default MedicineListModal;
