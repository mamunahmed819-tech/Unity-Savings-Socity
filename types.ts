export enum Category {
  SAVINGS = 'Monthly Savings',
  LOAN_REPAYMENT = 'Loan Repayment',
  MEMBERSHIP_FEE = 'Membership Fee',
  DONATION = 'Donation',
  LOAN_DISBURSEMENT = 'Loan Disbursement',
  WITHDRAWAL = 'Withdrawal',
  OTHERS = 'Others'
}

export enum TransactionType {
  INCOME = 'Deposit/Income',
  EXPENSE = 'Withdrawal/Expense'
}

export enum PaymentMethod {
  CASH = 'Cash',
  BANK = 'Bank',
  BKASH = 'bKash',
  NAGAD = 'Nagad',
  ROCKET = 'Rocket'
}

export interface TransactionItem {
  id: string;
  title: string;
  category: Category;
  quantity: number;
  pricePerUnit: number;
  total: number;
}

export interface Transaction {
  id: string;
  date: string;
  type: TransactionType;
  items: TransactionItem[];
  totalAmount: number;
  paymentMethod: PaymentMethod;
  receivedFrom?: string; // Member Name
  mobileNumber?: string; // Added for Contact Info
}

export interface FinancialSummary {
  currentBalance: number;
  totalIncome: number;
  totalExpense: number;
  totalItemsSold: number; 
}