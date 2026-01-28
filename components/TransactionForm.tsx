import React, { useState, useEffect, useRef } from 'react';
import { Category, TransactionType, PaymentMethod, Transaction, TransactionItem } from '../types';
import { Icons } from '../constants';

interface TransactionFormProps {
  onAdd: (transaction: Transaction) => void;
  onClose: () => void;
  lang: 'bn' | 'en';
  transactionCount: number;
}

export interface SocietyScheme {
  name: string;
  price: number;
  category: Category;
  code: string;
}

export const SOCIETY_SCHEMES: SocietyScheme[] = [
  { name: 'Monthly Savings', price: 2000, category: Category.SAVINGS, code: 'MS-01' },
  { name: 'Initial Membership Fee', price: 2000, category: Category.MEMBERSHIP_FEE, code: 'MF-01' },
  { name: 'Loan Installment', price: 0, category: Category.LOAN_REPAYMENT, code: 'LR-01' },
  { name: 'Emergency Fund Contribution', price: 100, category: Category.OTHERS, code: 'EF-01' },
  { name: 'General Donation', price: 0, category: Category.DONATION, code: 'GD-01' },
];

const TransactionForm: React.FC<TransactionFormProps> = ({ onAdd, onClose, lang, transactionCount }) => {
  const [type, setType] = useState<TransactionType>(TransactionType.INCOME);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.CASH);
  const [receivedFrom, setReceivedFrom] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [cart, setCart] = useState<TransactionItem[]>([]);
  const [currentItem, setCurrentItem] = useState({
    title: '',
    pricePerUnit: '',
    quantity: '1',
    category: Category.SAVINGS,
  });
  
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  const currentYear = 2026; 
  const sequence = (transactionCount + 1).toString().padStart(3, '0');
  const generatedReceiptId = `USS-${currentYear}-${sequence}`;

  const t = {
    title: lang === 'bn' ? 'মানি রিসিট তৈরি' : 'Create Money Receipt',
    receivedFrom: lang === 'bn' ? 'সদস্যের নাম' : 'Member Name',
    mobile: lang === 'bn' ? 'মোবাইল নম্বর' : 'Mobile Number',
    receiptNo: lang === 'bn' ? 'রিসিট নং' : 'Receipt No',
    paymentMethod: lang === 'bn' ? 'পরিশোধের মাধ্যম' : 'Payment Method',
    desc: lang === 'bn' ? 'বিবরণ' : 'Description',
    amount: lang === 'bn' ? 'পরিমাণ' : 'Amount',
    qty: lang === 'bn' ? 'টি' : 'Qty',
    addToCart: lang === 'bn' ? 'যুক্ত করুন' : 'Add to Receipt',
    save: lang === 'bn' ? 'রিসিট সম্পন্ন করুন' : 'Finish Receipt',
    cartEmpty: lang === 'bn' ? 'রিসিট খালি' : 'Receipt is empty',
    total: lang === 'bn' ? 'সর্বমোট:' : 'Grand Total:',
    income: lang === 'bn' ? 'জমা / আয়' : 'Deposit / Income',
    expense: lang === 'bn' ? 'উত্তোলন / ব্যয়' : 'Withdrawal / Expense'
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const addItemToCart = () => {
    if (!currentItem.title || !currentItem.pricePerUnit) return;
    
    const newItem: TransactionItem = {
      id: crypto.randomUUID().slice(0, 8),
      title: currentItem.title,
      category: currentItem.category,
      quantity: parseInt(currentItem.quantity) || 1,
      pricePerUnit: parseFloat(currentItem.pricePerUnit),
      total: (parseFloat(currentItem.pricePerUnit) * (parseInt(currentItem.quantity) || 1))
    };

    setCart([...cart, newItem]);
    setCurrentItem({
      title: '',
      pricePerUnit: '',
      quantity: '1',
      category: Category.SAVINGS,
    });
  };

  const removeItem = (id: string) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const handleFinalSubmit = () => {
    if (cart.length === 0) return;
    
    const totalAmount = cart.reduce((acc, item) => acc + item.total, 0);

    onAdd({
      id: generatedReceiptId,
      date: new Date().toISOString().split('T')[0],
      type: type,
      items: cart,
      totalAmount: totalAmount,
      paymentMethod: paymentMethod,
      receivedFrom: receivedFrom || (lang === 'bn' ? 'সাধারণ সদস্য' : 'General Member'),
      mobileNumber: mobileNumber
    });
    onClose();
  };

  const grandTotal = cart.reduce((acc, item) => acc + item.total, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[3rem] p-8 md:p-10 shadow-3xl border border-slate-100 dark:border-slate-800 relative flex flex-col max-h-[90vh]">
        
        <div className="flex justify-between items-center mb-8 shrink-0">
          <div className="flex items-center gap-4">
             <div className="bg-slate-900 text-white px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">
               {generatedReceiptId}
             </div>
             <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{t.title}</h2>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-rose-500 transition-colors">
             <Icons.Plus className="rotate-45" />
          </button>
        </div>

        <div className="flex p-1 bg-slate-100 dark:bg-slate-950 rounded-2xl mb-6 shrink-0">
          <button onClick={() => setType(TransactionType.INCOME)} className={`flex-1 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${type === TransactionType.INCOME ? 'bg-white dark:bg-slate-800 text-teal-600 shadow-sm' : 'text-slate-400'}`}>{t.income}</button>
          <button onClick={() => setType(TransactionType.EXPENSE)} className={`flex-1 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${type === TransactionType.EXPENSE ? 'bg-white dark:bg-slate-800 text-rose-600 shadow-sm' : 'text-slate-400'}`}>{t.expense}</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 shrink-0">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">{t.receivedFrom}</label>
            <input 
              type="text" 
              placeholder={lang === 'bn' ? "যেমন: আব্দুর রহমান" : "e.g. Abdur Rahman"} 
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl px-6 py-4 text-slate-900 dark:text-white font-bold focus:ring-4 focus:ring-brand-500/10 outline-none"
              value={receivedFrom}
              onChange={e => setReceivedFrom(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">{t.mobile}</label>
            <input 
              type="tel" 
              placeholder={lang === 'bn' ? "যেমন: ০১৭১২-৩৪৫৬৭৮" : "e.g. 01712-345678"} 
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl px-6 py-4 text-slate-900 dark:text-white font-bold focus:ring-4 focus:ring-brand-500/10 outline-none"
              value={mobileNumber}
              onChange={e => setMobileNumber(e.target.value)}
            />
          </div>
        </div>

        <div className="mb-6 shrink-0">
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">{t.paymentMethod}</label>
          <div className="flex flex-wrap gap-2">
            {Object.values(PaymentMethod).map((method) => (
              <button
                key={method}
                type="button"
                onClick={() => setPaymentMethod(method)}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                  paymentMethod === method
                    ? 'bg-slate-900 dark:bg-brand-600 text-white border-transparent shadow-lg'
                    : 'bg-slate-50 dark:bg-slate-950 text-slate-400 border-slate-100 dark:border-slate-800'
                }`}
              >
                {method}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4 shrink-0 mb-8 border-b border-slate-100 dark:border-slate-800 pb-8">
          <div className="relative" ref={suggestionsRef}>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block ml-1">{t.desc}</label>
            <input 
              type="text" 
              placeholder={lang === 'bn' ? "যেমন: মাসিক সঞ্চয়" : "e.g. Monthly Savings"} 
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl px-6 py-4 text-slate-900 dark:text-white font-bold"
              value={currentItem.title}
              onFocus={() => setShowSuggestions(true)}
              onChange={e => setCurrentItem({...currentItem, title: e.target.value})}
            />
            {showSuggestions && (
              <div className="absolute z-50 left-0 right-0 mt-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden max-h-48 overflow-y-auto">
                {SOCIETY_SCHEMES.map((item, idx) => (
                  <button key={idx} type="button" onClick={() => {
                    setCurrentItem({...currentItem, title: item.name, category: item.category, pricePerUnit: item.price > 0 ? item.price.toString() : ''});
                    setShowSuggestions(false);
                  }} className="w-full px-6 py-4 text-left hover:bg-slate-50 dark:hover:bg-slate-800 flex justify-between items-center border-b last:border-0 border-slate-50 dark:border-slate-800">
                    <span className="text-sm font-bold">{item.name}</span>
                    {item.price > 0 && <span className="text-xs font-black text-teal-600">৳{item.price}</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block ml-1">{t.qty}</label>
              <input type="number" min="1" className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl px-6 py-4 font-bold" value={currentItem.quantity} onChange={e => setCurrentItem({...currentItem, quantity: e.target.value})} />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block ml-1">{t.amount}</label>
              <input type="number" className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl px-6 py-4 font-bold" value={currentItem.pricePerUnit} onChange={e => setCurrentItem({...currentItem, pricePerUnit: e.target.value})} />
            </div>
            <div className="flex items-end">
              <button onClick={addItemToCart} className="w-full bg-slate-900 dark:bg-brand-600 text-white h-[58px] rounded-2xl font-bold uppercase tracking-widest text-[10px] hover:scale-105 active:scale-95 transition-all">
                {t.addToCart}
              </button>
            </div>
          </div>
        </div>

        <div className="flex-grow overflow-y-auto no-scrollbar space-y-3 mb-8">
          {cart.length > 0 ? (
            cart.map(item => (
              <div key={item.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl">
                <div>
                  <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase">{item.title}</h4>
                  <p className="text-[10px] font-bold text-slate-400">৳{item.pricePerUnit.toFixed(2)} {item.quantity > 1 ? `x ${item.quantity}` : ''}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-black text-slate-900 dark:text-white">৳{item.total.toFixed(2)}</span>
                  <button onClick={() => removeItem(item.id)} className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79" /></svg>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="h-20 flex items-center justify-center text-slate-400 text-xs font-bold uppercase tracking-widest border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-3xl">
              {t.cartEmpty}
            </div>
          )}
        </div>

        <div className="shrink-0 pt-6 border-t border-slate-100 dark:border-slate-800">
          <div className="flex justify-between items-center mb-6 px-2">
            <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{t.total}</span>
            <span className="text-2xl font-black text-slate-900 dark:text-white">৳{grandTotal.toFixed(2)}</span>
          </div>
          <button 
            disabled={cart.length === 0}
            onClick={handleFinalSubmit} 
            className="w-full bg-teal-600 hover:bg-teal-500 disabled:opacity-50 disabled:bg-slate-300 text-white font-black py-5 rounded-2xl shadow-xl transition-all active:scale-95 text-sm uppercase tracking-[0.2em]"
          >
            {t.save}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionForm;