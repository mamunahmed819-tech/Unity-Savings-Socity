
import React from 'react';

interface DeleteConfirmationModalProps {
  onConfirm: () => void;
  onCancel: () => void;
  lang: 'bn' | 'en';
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({ onConfirm, onCancel, lang }) => {
  const t = {
    title: lang === 'bn' ? 'লেনদেনটি মুছে ফেলবেন?' : 'Delete Transaction?',
    desc: lang === 'bn' 
      ? 'আপনি কি নিশ্চিত যে এই লেনদেনটি চিরতরে ডিলিট করতে চান? এই কাজটি আর ফিরিয়ে আনা সম্ভব হবে না।'
      : 'Are you sure you want to permanently delete this transaction? This action cannot be undone.',
    confirm: lang === 'bn' ? 'হ্যাঁ, ডিলিট করুন' : 'Yes, Delete It',
    cancel: lang === 'bn' ? 'ফিরে যান' : 'Go Back'
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4 bg-slate-950/90 backdrop-blur-md">
      <div className="bg-slate-900 w-full max-w-sm rounded-[2rem] border border-slate-800 shadow-3xl p-8 animate-in fade-in zoom-in duration-300">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-rose-500/10 rounded-2xl text-rose-500 mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a10.855 10.855 0 0 0-5.207-4.02M9.263 4.846a10.86 10.86 0 0 1 5.207-4.02M6.399 3.744c.34-.059.68-.114 1.022-.165m0 0a10.844 10.844 0 0 1 11.662 0" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white mb-3">{t.title}</h2>
          <p className="text-slate-400 text-sm leading-relaxed px-4">{t.desc}</p>
        </div>
        <div className="flex flex-col gap-3">
          <button onClick={onConfirm} className="w-full bg-rose-600 hover:bg-rose-500 text-white font-bold py-4 rounded-2xl shadow-xl shadow-rose-600/20 transition-all active:scale-[0.98]">
            {t.confirm}
          </button>
          <button onClick={onCancel} className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-4 rounded-2xl transition-all active:scale-[0.98]">
            {t.cancel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
