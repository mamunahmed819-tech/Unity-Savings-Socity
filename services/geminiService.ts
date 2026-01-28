
import { GoogleGenAI } from "@google/genai";
import { Transaction } from "../types";

export const getFinancialAdvice = async (transactions: Transaction[], language: 'bn' | 'en'): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const summary = transactions.map(t => ({
      type: t.type,
      totalAmount: t.totalAmount,
      date: t.date,
      itemCount: t.items.length,
      items: t.items.map(i => i.title).join(', ')
    }));

    const langName = language === 'bn' ? 'Bengali (বাংলা)' : 'English';

    const prompt = `Analyze these community savings society transactions and provide 3-4 professional financial tips in ${langName}. 
    Focus on fund growth, loan management risks, and encouraging member participation. Keep it under 100 words.
    
    Transactions Data: ${JSON.stringify(summary)}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: language === 'bn' 
          ? "আপনি একজন অভিজ্ঞ আর্থিক সমিতি উপদেষ্টা। আপনি সঞ্চয় বৃদ্ধি এবং ঋণ ঝুঁকি হ্রাসের পরামর্শ দেন।"
          : "You are an experienced savings society advisor. You provide advice on fund growth and loan risk mitigation.",
        temperature: 0.7,
      },
    });

    return response.text || (language === 'bn' ? "এই মুহূর্তে কোনো আর্থিক ইনসাইট পাওয়া যায়নি।" : "No financial insights available at this moment.");
  } catch (error) {
    console.error("AI Insight Error:", error);
    return language === 'bn' 
      ? "পরামর্শ পেতে সমস্যা হচ্ছে। অনুগ্রহ করে আপনার ইন্টারনেট সংযোগ চেক করুন।"
      : "Error getting society advice. Please check your internet connection.";
  }
};
