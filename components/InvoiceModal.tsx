import React, { useEffect } from 'react';
import { Transaction, TransactionType } from '../types';

interface InvoiceModalProps {
  transaction: Transaction;
  onClose: () => void;
  lang: 'bn' | 'en';
  storeName: string;
}

const InvoiceModal: React.FC<InvoiceModalProps> = ({ transaction, onClose, lang, storeName }) => {
  const isIncome = transaction.type === TransactionType.INCOME;
  const memberDisplayName = transaction.receivedFrom || (lang === 'bn' ? 'সাধারণ সদস্য' : 'General Member');
  
  // Update document title for PDF print filename
  useEffect(() => {
    const originalTitle = document.title;
    const safeName = memberDisplayName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    document.title = `${safeName}_${transaction.id}`;
    
    return () => {
      document.title = originalTitle;
    };
  }, [memberDisplayName, transaction.id]);

  const t = {
    receiptTitle: lang === 'bn' ? 'মানি রিসিট' : 'Money Receipt',
    paymentTitle: lang === 'bn' ? 'পেমেন্ট ভাউচার' : 'Payment Voucher',
    tagline: lang === 'bn' ? 'ক্ষুদ্র সঞ্চয়, সুদৃঢ় ঐক্য' : 'Small Savings, Strong Unity',
    memberName: lang === 'bn' ? 'সদস্যের নাম' : 'Member Name',
    recipientName: lang === 'bn' ? 'গ্রহীতার নাম' : 'Recipient Name',
    mobile: lang === 'bn' ? 'মোবাইল' : 'Mobile',
    date: lang === 'bn' ? 'তারিখ' : 'Date',
    desc: lang === 'bn' ? 'বিবরণ' : 'Description',
    qty: lang === 'bn' ? 'টি' : 'Qty',
    total: lang === 'bn' ? 'পরিমাণ' : 'Amount',
    grandTotal: lang === 'bn' ? 'সর্বমোট টাকা:' : 'Total Amount:',
    thankYou: lang === 'bn' ? 'আমাদের সাথে সঞ্চয় করার জন্য ধন্যবাদ!' : 'Thank you for saving with us.',
    print: lang === 'bn' ? 'প্রিন্ট' : 'Print',
    close: lang === 'bn' ? 'বন্ধ' : 'Close',
    receiptNo: lang === 'bn' ? 'রিসিট নং' : 'Receipt No',
    time: lang === 'bn' ? 'সময়' : 'Time',
    collectorSign: lang === 'bn' ? 'কোষাধ্যক্ষ / পরিচালক' : 'Treasurer / Director',
    memberSign: lang === 'bn' ? 'সদস্যের স্বাক্ষর' : 'Member Signature',
    paymentMethod: lang === 'bn' ? 'পরিশোধের মাধ্যম' : 'Payment Method',
    cashStamp: lang === 'bn' ? 'নগদ গ্রহণ' : 'CASH RECEIVED',
    systemGenerated: lang === 'bn' ? 'এটি একটি কম্পিউটার জেনারেটেড রিসিট, কোন স্বাক্ষরের প্রয়োজন নেই।' : 'This is a system generated receipt and requires no physical signature.',
    devName: lang === 'bn' ? 'ডেভেলপার: মামুন' : 'Developed by Mamun',
    email: 'society2k26@gmail.com'
  };

  const currentTime = new Date().toLocaleTimeString(lang === 'bn' ? 'bn-BD' : 'en-US', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm print:bg-white print:p-0 overflow-y-auto">
      <div className="bg-white w-full max-w-[360px] rounded-[2rem] shadow-2xl overflow-hidden print:shadow-none print:rounded-none animate-in fade-in zoom-in duration-300 my-auto">
        
        <div className="flex justify-between items-center px-5 py-3 border-b border-slate-100 print:hidden bg-slate-50">
          <h3 className="text-[9px] font-black text-slate-900 uppercase tracking-widest">{isIncome ? t.receiptTitle : t.paymentTitle}</h3>
          <div className="flex gap-2">
            <button onClick={() => window.print()} className="bg-teal-600 hover:bg-teal-700 text-white px-3 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all shadow-lg shadow-teal-600/20">
              {t.print}
            </button>
            <button onClick={onClose} className="bg-white border border-slate-200 text-slate-500 px-3 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all hover:bg-slate-50">
              {t.close}
            </button>
          </div>
        </div>

        <div className="p-8 print:p-10 text-black bg-white relative" id="printable-invoice">
          {/* CASH RECEIVED RUBBER STAMP - SCALED FOR SMALL SIZE */}
          {isIncome && (
            <div className="absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.12] print:opacity-[0.18] pointer-events-none select-none -rotate-[22deg] z-0">
               <div className="border-[4px] border-double border-rose-600 rounded-[1.5rem] p-6 flex flex-col items-center justify-center min-w-[240px]">
                  <span className="text-rose-600 font-black text-3xl tracking-tighter uppercase leading-none mb-2">{t.cashStamp}</span>
                  <div className="w-full h-[2px] bg-rose-600 mb-2"></div>
                  <div className="flex items-center gap-3">
                    <span className="text-rose-600 font-black text-[11px] uppercase tracking-[0.3em]">OFFICIAL SEAL</span>
                    <div className="w-1.5 h-1.5 rounded-full bg-rose-600"></div>
                    <span className="text-rose-600 font-black text-[11px] uppercase tracking-[0.3em]">2026</span>
                  </div>
               </div>
            </div>
          )}

          {/* Receipt Header */}
          <div className="flex flex-col items-center mb-6 text-center relative z-10">
            <h1 className="text-xl font-black tracking-tighter uppercase leading-none text-slate-900 mb-1">{storeName}</h1>
            <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest leading-tight">{t.tagline}</p>
            <div className="mt-3 inline-flex flex-col items-center">
               <span className="text-[7px] font-black text-slate-400 uppercase tracking-[0.3em] mb-1">{isIncome ? t.receiptTitle : t.paymentTitle}</span>
               <div className="bg-brand-600 text-white px-4 py-1 rounded-full text-[9px] font-black tracking-[0.2em] shadow-lg shadow-brand-500/20">
                  {t.receiptNo}: {transaction.id}
               </div>
            </div>
          </div>

          {/* Primary Identity Section */}
          <div className="bg-slate-50 print:bg-transparent border border-slate-100 print:border-slate-900 rounded-2xl p-4 mb-6 relative z-10 text-center">
             <div className="mb-1">
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em]">{isIncome ? t.memberName : t.recipientName}</span>
                <h2 className="text-lg font-black text-slate-900 uppercase leading-tight mt-0.5">
                  {memberDisplayName}
                </h2>
                {transaction.mobileNumber && (
                   <p className="text-[9px] font-black text-slate-900 mt-1 flex items-center justify-center gap-1.5">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-2.5 h-2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" /></svg>
                      {t.mobile}: {transaction.mobileNumber}
                   </p>
                )}
             </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-y-3 gap-x-4 mb-6 text-[10px] font-bold py-1 relative z-10">
            <div className="flex flex-col">
              <span className="text-slate-400 uppercase text-[7px] mb-0.5 tracking-widest">{t.date}</span>
              <span className="font-black text-slate-900 leading-none">{new Date(transaction.date).toLocaleDateString(lang === 'bn' ? 'bn-BD' : 'en-US', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
            </div>
            <div className="flex flex-col text-right">
              <span className="text-slate-400 uppercase text-[7px] mb-0.5 tracking-widest">{t.time}</span>
              <span className="text-slate-900 leading-none">{currentTime}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-slate-400 uppercase text-[7px] mb-0.5 tracking-widest">{t.paymentMethod}</span>
              <span className="font-black text-teal-600 uppercase tracking-wider leading-none">{transaction.paymentMethod}</span>
            </div>
            <div className="flex flex-col text-right">
               <span className="text-slate-400 uppercase text-[7px] mb-0.5 tracking-widest">{t.receiptNo}</span>
               <span className="font-black text-brand-600 tracking-tight leading-none">{transaction.id}</span>
            </div>
          </div>

          {/* Items Table */}
          <table className="w-full mb-6 relative z-10">
            <thead>
              <tr className="border-b border-slate-900 text-[8px] font-black uppercase text-slate-400">
                <th className="text-left py-2">{t.desc}</th>
                <th className="text-center py-2">{t.qty}</th>
                <th className="text-right py-2">{t.total}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {transaction.items.map((item, idx) => (
                <tr key={idx} className="text-slate-900">
                  <td className="py-3 font-bold text-[11px] leading-tight">{item.title}</td>
                  <td className="text-center py-3 text-[11px] font-bold leading-tight">{item.quantity}</td>
                  <td className="text-right py-3 font-black text-[12px] leading-tight">৳{item.total.toLocaleString(lang === 'bn' ? 'bn-BD' : 'en-US', { minimumFractionDigits: 2 })}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Grand Total Card */}
          <div className="border-t border-slate-900 pt-5 mb-12 relative z-10">
            <div className="flex justify-between items-center p-4 rounded-2xl bg-slate-900 text-white print:bg-transparent print:text-black print:border-2 print:border-slate-900">
              <span className="font-black uppercase text-[9px] tracking-[0.2em]">{t.grandTotal}</span>
              <span className="text-2xl font-black">৳{transaction.totalAmount.toLocaleString(lang === 'bn' ? 'bn-BD' : 'en-US', { minimumFractionDigits: 2 })}</span>
            </div>
          </div>

          {/* Signature Sections */}
          <div className="grid grid-cols-2 gap-8 mb-8 relative z-10">
            <div className="text-center pt-3 border-t border-slate-200 print:border-slate-900">
              <p className="font-black uppercase text-[7px] text-slate-400 print:text-black tracking-[0.2em]">{t.memberSign}</p>
            </div>
            <div className="text-center pt-3 border-t border-slate-200 print:border-slate-900">
              <p className="font-black uppercase text-[7px] text-slate-400 print:text-black tracking-[0.2em]">{t.collectorSign}</p>
            </div>
          </div>

          {/* System Note & Branding */}
          <div className="text-center relative z-10 border-t border-dashed border-slate-200 pt-6">
            <p className="text-[6.5px] font-bold text-slate-400 italic uppercase print:text-black tracking-widest mb-4">
              {t.systemGenerated}
            </p>
            
            <p className="font-black uppercase mb-3 text-[9px] text-teal-600 print:text-black tracking-[0.1em] leading-none">{t.thankYou}</p>
            
            <div className="flex flex-col items-center gap-1 opacity-60 print:opacity-100">
              <p className="text-[7px] font-black tracking-[0.3em] uppercase text-slate-500 print:text-black leading-none">Unity Savings Society &bull; Enterprise System</p>
              <p className="text-[7px] font-bold text-slate-400 print:text-black lowercase leading-none">{t.email}</p>
              <p className="text-[8px] font-black text-brand-600 print:text-black uppercase tracking-[0.3em] mt-2">{t.devName}</p>
              <div className="flex items-center gap-2 mt-2">
                <div className="px-1.5 py-0.5 border border-slate-200 rounded text-[6px] font-black uppercase text-slate-400">ID: {transaction.id}</div>
                <div className="w-1 h-1 rounded-full bg-slate-300"></div>
                <span className="text-[6px] font-black uppercase tracking-widest text-slate-400">V: {(transaction.totalAmount * 1.5).toFixed(0)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          @page { margin: 0; size: portrait; }
          body { margin: 0; padding: 0; background: white !important; }
          #printable-invoice { 
            width: 100% !important; 
            max-width: none !important; 
            padding: 40px !important;
            min-height: auto;
            position: relative;
          }
          * { color: black !important; -webkit-print-color-adjust: exact; }
          .print\\:hidden { display: none !important; }
        }
      `}} />
    </div>
  );
};

export default InvoiceModal;