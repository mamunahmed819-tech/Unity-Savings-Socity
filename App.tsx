
import React, { useState, useEffect, useMemo } from 'react';
import { Transaction, TransactionType, FinancialSummary, Category } from './types.ts';
import SummaryCards from './components/SummaryCards.tsx';
import ChartsSection from './components/ChartsSection.tsx';
import TransactionList from './components/TransactionList.tsx';
import TransactionForm from './components/TransactionForm.tsx';
import DeleteConfirmationModal from './components/DeleteConfirmationModal.tsx';
import InvoiceModal from './components/InvoiceModal.tsx';
import Auth from './components/Auth.tsx';
import { Icons } from './constants.tsx';
import { getFinancialAdvice } from './services/geminiService.ts';
import { supabase } from './services/supabaseClient.ts';

const App: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<string | null>(null);
  const [invoiceTransaction, setInvoiceTransaction] = useState<Transaction | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMonth, setFilterMonth] = useState('all');
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true);
  
  const [lang, setLang] = useState<'bn' | 'en'>(() => {
    return (localStorage.getItem('medstore_lang') as 'bn' | 'en') || 'en';
  });
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('medstore_theme') as 'light' | 'dark') || 'dark';
  });

  const [loggedUser, setLoggedUser] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('medstore_lang', lang);
  }, [lang]);

  useEffect(() => {
    localStorage.setItem('medstore_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Load session and initial data from Supabase
  useEffect(() => {
    const sessionUserName = sessionStorage.getItem('medstore_session');
    
    const verifyAndFetch = async () => {
      setIsDataLoading(true);
      
      if (sessionUserName) {
        // Verify user exists in cloud
        const { data: userData } = await supabase
          .from('profiles')
          .select('username')
          .eq('username', sessionUserName)
          .single();
          
        if (userData) {
          setLoggedUser(userData.username);
        } else {
          sessionStorage.removeItem('medstore_session');
        }
      }

      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('date', { ascending: false });

      if (error) {
        console.error("Error fetching transactions:", error);
      } else if (data) {
        const mappedData: Transaction[] = data.map(t => ({
          id: t.id,
          date: t.date,
          type: t.type as TransactionType,
          items: t.items,
          totalAmount: t.total_amount,
          paymentMethod: t.payment_method,
          receivedFrom: t.received_from,
          mobileNumber: t.mobile_number
        }));
        setTransactions(mappedData);
      }
      setIsDataLoading(false);
    };

    verifyAndFetch();
  }, []);

  const summary: FinancialSummary = useMemo(() => {
    const now = new Date();
    const currentMonth = now.toISOString().slice(0, 7);

    const totalIncome = transactions
      .filter(t => t.type === TransactionType.INCOME && t.date.startsWith(currentMonth))
      .reduce((acc, t) => acc + t.totalAmount, 0);

    const totalExpense = transactions
      .filter(t => t.type === TransactionType.EXPENSE && t.date.startsWith(currentMonth))
      .reduce((acc, t) => acc + t.totalAmount, 0);

    const totalItemsSold = transactions.length;

    const currentBalance = transactions.reduce((acc, t) => {
      return t.type === TransactionType.INCOME ? acc + t.totalAmount : acc - t.totalAmount;
    }, 0);

    return { currentBalance, totalIncome, totalExpense, totalItemsSold };
  }, [transactions]);

  const handleAddTransaction = async (newTransaction: Transaction) => {
    setTransactions(prev => [newTransaction, ...prev]);
    setInvoiceTransaction(newTransaction);

    const { error } = await supabase
      .from('transactions')
      .insert([{
        id: newTransaction.id,
        date: newTransaction.date,
        type: newTransaction.type,
        items: newTransaction.items,
        total_amount: newTransaction.totalAmount,
        payment_method: newTransaction.paymentMethod,
        received_from: newTransaction.receivedFrom,
        mobile_number: newTransaction.mobileNumber
      }]);

    if (error) {
      console.error("Error adding transaction:", error);
      setTransactions(prev => prev.filter(t => t.id !== newTransaction.id));
      alert(lang === 'bn' ? "তথ্য সেভ করতে সমস্যা হয়েছে।" : "Error saving to cloud.");
    }
  };

  const handleConfirmDelete = async () => {
    if (transactionToDelete) {
      const id = transactionToDelete;
      setTransactions(prev => prev.filter(t => t.id !== id));
      setTransactionToDelete(null);

      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id);

      if (error) {
        console.error("Error deleting transaction:", error);
        alert(lang === 'bn' ? "মুছে ফেলতে সমস্যা হয়েছে।" : "Error deleting from cloud.");
      }
    }
  };

  const handleFetchAiInsights = async () => {
    if (transactions.length === 0) return;
    setIsAiLoading(true);
    const advice = await getFinancialAdvice(transactions, lang);
    setAiInsight(advice);
    setIsAiLoading(false);
  };

  const toggleLang = () => setLang(prev => prev === 'bn' ? 'en' : 'bn');
  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  const t = {
    appTitle: 'Unity Savings Society',
    logout: lang === 'bn' ? 'লগ আউট' : 'Logout',
    aiAdvice: lang === 'bn' ? 'আর্থিক ইনসাইট' : 'Financial Insights',
    analyzing: lang === 'bn' ? 'বিশ্লেষণ হচ্ছে...' : 'Analyzing...',
    support: lang === 'bn' ? 'সাপোর্ট:' : 'Support:',
    phone: '01744810248',
    email: 'society2k26@gmail.com',
    suffix: lang === 'bn' ? ' এর সোসাইটি' : "'s Society",
    loading: lang === 'bn' ? 'লোড হচ্ছে...' : 'Loading Data...'
  };

  if (!loggedUser && !isDataLoading) {
    return <Auth onLogin={setLoggedUser} lang={lang} onLangToggle={toggleLang} theme={theme} onThemeToggle={toggleTheme} />;
  }

  return (
    <div className="min-h-screen pb-12 flex flex-col bg-[#fcfcfc] dark:bg-slate-950 transition-colors">
      <header className="sticky top-0 z-50 glass border-b border-slate-200/50 dark:border-slate-800/50 print:hidden">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-slate-900 dark:bg-brand-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
              <Icons.Wallet />
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight dark:text-white leading-none">{t.appTitle}</h1>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-1.5 truncate max-w-[120px] md:max-w-none">
                {loggedUser}{t.suffix}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button onClick={toggleTheme} className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-500">
              {theme === 'light' ? <Icons.Moon /> : <Icons.Sun />}
            </button>
            <button onClick={toggleLang} className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-500">
              <Icons.Globe />
            </button>
            <div className="w-px h-6 bg-slate-200 dark:bg-slate-800 mx-1"></div>
            <button 
              onClick={() => {
                setLoggedUser(null);
                sessionStorage.removeItem('medstore_session');
              }}
              className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-rose-500 bg-rose-50 dark:bg-rose-500/10 rounded-xl hover:bg-rose-100 dark:hover:bg-rose-500/20 transition-all"
            >
              {t.logout}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10 w-full flex-grow print:p-0 print:max-w-none">
        <div className="print:hidden">
          {isDataLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">{t.loading}</p>
            </div>
          ) : (
            <>
              <SummaryCards summary={summary} lang={lang} />
              {aiInsight && (
                <div className="bg-brand-50/50 dark:bg-brand-500/5 border border-brand-100 dark:border-brand-500/20 rounded-3xl p-8 mb-10 relative animate-fade-in">
                  <button onClick={() => setAiInsight(null)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                  <div className="flex gap-6">
                    <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-900 border border-brand-100 dark:border-brand-500/20 flex items-center justify-center text-brand-600 shrink-0 shadow-sm">
                      <Icons.Sparkles />
                    </div>
                    <div>
                      <span className="text-[10px] font-black text-brand-700 dark:text-brand-400 uppercase tracking-[0.2em] block mb-2">Society Advisor AI</span>
                      <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed max-w-2xl whitespace-pre-line font-medium">{aiInsight}</p>
                    </div>
                  </div>
                </div>
              )}
              <ChartsSection transactions={transactions} lang={lang} />
              <div className="mt-8">
                <TransactionList 
                  transactions={transactions}
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  filterMonth={filterMonth}
                  onMonthChange={setFilterMonth}
                  onDelete={setTransactionToDelete}
                  onShowInvoice={setInvoiceTransaction}
                  lang={lang}
                />
              </div>
            </>
          )}
        </div>
      </main>

      <footer className="max-w-6xl mx-auto px-6 py-12 w-full border-t border-slate-100 dark:border-slate-900 mt-auto print:hidden">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center md:items-start gap-1">
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em]">© {new Date().getFullYear()} Unity Savings Society – Cloud Enterprise</p>
            <p className="text-brand-600 dark:text-brand-400 text-[10px] font-black uppercase tracking-[0.4em]">Developed by Mamun</p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 bg-slate-50 dark:bg-slate-900 px-6 py-4 rounded-3xl border border-slate-100 dark:border-slate-800">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest sm:mr-2">{t.support}</span>
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6">
              <a href={`tel:${t.phone}`} className="flex items-center gap-2 text-xs font-black text-slate-900 dark:text-brand-400 hover:underline">
                <Icons.Plus className="w-3.5 h-3.5 rotate-45" /> {t.phone}
              </a>
              <div className="hidden sm:block w-px h-3 bg-slate-200 dark:bg-slate-700"></div>
              <a href={`mailto:${t.email}`} className="flex items-center gap-2 text-xs font-black text-slate-900 dark:text-brand-400 hover:underline">
                <Icons.Invoice className="w-3.5 h-3.5" /> {t.email}
              </a>
            </div>
          </div>
        </div>
      </footer>

      <div className="fixed bottom-10 right-10 flex flex-col gap-4 z-40 print:hidden">
        <button 
          onClick={handleFetchAiInsights}
          disabled={isAiLoading || transactions.length === 0}
          className="bg-white dark:bg-slate-800 w-14 h-14 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 flex items-center justify-center text-brand-600 hover:border-brand-500 transition-all disabled:opacity-50 group relative"
        >
          {isAiLoading ? ( <div className="w-5 h-5 border-2 border-brand-500 border-t-transparent rounded-full animate-spin"></div> ) : ( <Icons.Sparkles /> )}
        </button>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-slate-900 dark:bg-brand-600 hover:bg-slate-800 dark:hover:bg-brand-500 text-white w-14 h-14 rounded-2xl shadow-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-95"
        >
          <Icons.Plus />
        </button>
      </div>

      {isModalOpen && (
        <TransactionForm 
          onAdd={handleAddTransaction} 
          onClose={() => setIsModalOpen(false)} 
          lang={lang} 
          transactionCount={transactions.length} 
        />
      )}
      {transactionToDelete && <DeleteConfirmationModal onConfirm={handleConfirmDelete} onCancel={() => setTransactionToDelete(null)} lang={lang} />}
      {invoiceTransaction && <InvoiceModal transaction={invoiceTransaction} onClose={() => setInvoiceTransaction(null)} lang={lang} storeName={t.appTitle} />}
    </div>
  );
};

export default App;
