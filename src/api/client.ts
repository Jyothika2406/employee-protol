export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Default users for demo
const DEFAULT_USERS = [
  { id: '1', name: 'Admin User', email: 'svljyothikanookala@gmail.com', password: 'Jyothika@2406', role: 'admin' as const },
  { id: '2', name: 'Super Admin', email: 'abhi@mentineo.com', password: 'abhi@123456', role: 'superadmin' as const },
];

// Mock database in localStorage
const initializeMockData = () => {
  if (!localStorage.getItem('mockUsers')) {
    localStorage.setItem('mockUsers', JSON.stringify(DEFAULT_USERS));
  } else {
    const existing = JSON.parse(localStorage.getItem('mockUsers') || '[]');
    const filtered = existing.filter((u: any) => u.email !== 'admin@company.com' && u.email !== 'superadmin@company.com');
    const next = [
      ...filtered.filter((u: any) => u.email !== DEFAULT_USERS[0].email && u.email !== DEFAULT_USERS[1].email),
      DEFAULT_USERS[0],
      DEFAULT_USERS[1],
    ];
    localStorage.setItem('mockUsers', JSON.stringify(next));
  }
  if (!localStorage.getItem('mockEmployees')) {
    localStorage.setItem('mockEmployees', JSON.stringify([]));
  }
  if (!localStorage.getItem('mockAttendance')) {
    localStorage.setItem('mockAttendance', JSON.stringify([]));
  }
  if (!localStorage.getItem('mockReports')) {
    localStorage.setItem('mockReports', JSON.stringify([]));
  }
  if (!localStorage.getItem('mockMoneyTransactions')) {
    localStorage.setItem('mockMoneyTransactions', JSON.stringify([]));
  }
};

class ApiClient {
  private token: string | null = localStorage.getItem('token');

  private generateTransactionId() {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    const random = Math.floor(1000 + Math.random() * 9000);
    return `TXN-${y}${m}${d}-${random}`;
  }

  constructor() {
    initializeMockData();
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('token');
  }

  // Auth endpoints
  async login(email: string, password: string) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = JSON.parse(localStorage.getItem('mockUsers') || '[]');
        let user = users.find((u: any) => u.email === email && u.password === password);

        if (!user) {
          const employees = JSON.parse(localStorage.getItem('mockEmployees') || '[]');
          const employee = employees.find((e: any) => e.email === email && e.password === password);
          if (employee) {
            user = { id: employee.id, name: employee.name, email: employee.email, password: employee.password, role: 'employee' };
            users.push(user);
            localStorage.setItem('mockUsers', JSON.stringify(users));
          }
        }

        if (user) {
          const token = 'mock_token_' + user.id;
          this.setToken(token);
          resolve({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
        } else {
          reject(new Error('Invalid email or password'));
        }
      }, 500);
    });
  }

  async getProfile() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!this.token) {
          reject(new Error('No token'));
          return;
        }
        const users = JSON.parse(localStorage.getItem('mockUsers') || '[]');
        const userToken = this.token;
        const tokenId = userToken.split('_')[2];
        const user = users.find((u: any) => u.id === tokenId);

        if (user) {
          resolve({ user: { id: user.id, name: user.name, email: user.email, role: user.role } });
          return;
        }

        const employees = JSON.parse(localStorage.getItem('mockEmployees') || '[]');
        const employee = employees.find((e: any) => e.id === tokenId);
        if (employee) {
          const normalized = { id: employee.id, name: employee.name, email: employee.email, password: employee.password, role: 'employee' };
          users.push(normalized);
          localStorage.setItem('mockUsers', JSON.stringify(users));
          resolve({ user: { id: normalized.id, name: normalized.name, email: normalized.email, role: normalized.role } });
        } else {
          reject(new Error('User not found'));
        }
      }, 300);
    });
  }

  // Auth endpoints (legacy)
  // Employee endpoints
  async getEmployees() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const employees = JSON.parse(localStorage.getItem('mockEmployees') || '[]');
        resolve({ employees });
      }, 300);
    });
  }

  async addEmployee(data: any) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const employees = JSON.parse(localStorage.getItem('mockEmployees') || '[]');
        const newEmp = {
          id: Date.now().toString(),
          ...data,
          createdAt: new Date().toISOString(),
        };
        employees.push(newEmp);
        localStorage.setItem('mockEmployees', JSON.stringify(employees));

        const users = JSON.parse(localStorage.getItem('mockUsers') || '[]');
        const alreadyExists = users.some((u: any) => u.email === newEmp.email);
        if (!alreadyExists) {
          users.push({ id: newEmp.id, name: newEmp.name, email: newEmp.email, password: newEmp.password, role: 'employee' });
          localStorage.setItem('mockUsers', JSON.stringify(users));
        }
        resolve({ success: true, employee: newEmp });
      }, 300);
    });
  }

  async updateEmployee(id: string, data: any) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const employees = JSON.parse(localStorage.getItem('mockEmployees') || '[]');
        const idx = employees.findIndex((e: any) => e.id === id);
        if (idx > -1) {
          employees[idx] = { ...employees[idx], ...data };
          localStorage.setItem('mockEmployees', JSON.stringify(employees));

          const users = JSON.parse(localStorage.getItem('mockUsers') || '[]');
          const userIdx = users.findIndex((u: any) => u.id === id);
          if (userIdx > -1) {
            users[userIdx] = { ...users[userIdx], name: employees[idx].name, email: employees[idx].email, password: employees[idx].password };
            localStorage.setItem('mockUsers', JSON.stringify(users));
          }
          resolve({ success: true });
        }
      }, 300);
    });
  }

  async deleteEmployee(id: string) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const employees = JSON.parse(localStorage.getItem('mockEmployees') || '[]');
        const filtered = employees.filter((e: any) => e.id !== id);
        localStorage.setItem('mockEmployees', JSON.stringify(filtered));

        const users = JSON.parse(localStorage.getItem('mockUsers') || '[]');
        const filteredUsers = users.filter((u: any) => u.id !== id);
        localStorage.setItem('mockUsers', JSON.stringify(filteredUsers));
        resolve({ success: true });
      }, 300);
    });
  }

  // Report endpoints
  async getReports() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const reports = JSON.parse(localStorage.getItem('mockReports') || '[]');
        resolve({ reports });
      }, 300);
    });
  }

  async getAllReports() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const reports = JSON.parse(localStorage.getItem('mockReports') || '[]');
        resolve({ reports });
      }, 300);
    });
  }

  async addReport(data: any) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const reports = JSON.parse(localStorage.getItem('mockReports') || '[]');
        const newReport = {
          id: Date.now().toString(),
          ...data,
          date: new Date().toISOString().split('T')[0],
        };
        reports.push(newReport);
        localStorage.setItem('mockReports', JSON.stringify(reports));
        resolve({ success: true });
      }, 300);
    });
  }

  async deleteReport(id: string) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const reports = JSON.parse(localStorage.getItem('mockReports') || '[]');
        const filtered = reports.filter((r: any) => r.id !== id);
        localStorage.setItem('mockReports', JSON.stringify(filtered));
        resolve({ success: true });
      }, 300);
    });
  }

  // Attendance endpoints
  async markAttendance(data: any) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const attendance = JSON.parse(localStorage.getItem('mockAttendance') || '[]');
        const existingIndex = attendance.findIndex((record: any) => record.userId === data.userId && record.date === data.date);
        const newAtt = {
          id: existingIndex >= 0 ? attendance[existingIndex].id : Date.now().toString(),
          ...data,
          status: data.status || 'pending',
        };
        if (existingIndex >= 0) {
          attendance[existingIndex] = newAtt;
        } else {
          attendance.push(newAtt);
        }
        localStorage.setItem('mockAttendance', JSON.stringify(attendance));
        resolve({ success: true });
      }, 300);
    });
  }

  async getAttendance() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const attendance = JSON.parse(localStorage.getItem('mockAttendance') || '[]');
        resolve(attendance);
      }, 300);
    });
  }

  // Salary endpoints
  async getSalary(userId: string) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ salary: null });
      }, 300);
    });
  }

  async setSalary(data: any) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true });
      }, 300);
    });
  }

  // Bank endpoints
  async getBankDetails(userId: string) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const banks = JSON.parse(localStorage.getItem('mockBankDetails') || '{}');
        resolve({ bankDetails: banks[userId] || null });
      }, 300);
    });
  }

  async updateBankDetails(data: any) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const banks = JSON.parse(localStorage.getItem('mockBankDetails') || '{}');
        banks[data.userId] = data;
        localStorage.setItem('mockBankDetails', JSON.stringify(banks));
        resolve({ success: true });
      }, 300);
    });
  }

  // Money management endpoints
  async getMoneyTransactions() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const transactions = JSON.parse(localStorage.getItem('mockMoneyTransactions') || '[]');
        const normalized = transactions.map((transaction: any) => ({
          ...transaction,
          transactionId: transaction.transactionId || `TXN-${String(transaction.id || '').slice(-8).padStart(8, '0')}`,
        }));
        localStorage.setItem('mockMoneyTransactions', JSON.stringify(normalized));
        resolve({ transactions: normalized });
      }, 300);
    });
  }

  async addMoneyTransaction(data: any) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const transactions = JSON.parse(localStorage.getItem('mockMoneyTransactions') || '[]');
        const newTransaction = {
          id: Date.now().toString(),
          transactionId: this.generateTransactionId(),
          ...data,
          createdAt: new Date().toISOString(),
        };
        transactions.push(newTransaction);
        localStorage.setItem('mockMoneyTransactions', JSON.stringify(transactions));
        resolve({ success: true, transaction: newTransaction });
      }, 300);
    });
  }

  async updateMoneyTransaction(id: string, data: any) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const transactions = JSON.parse(localStorage.getItem('mockMoneyTransactions') || '[]');
        const index = transactions.findIndex((t: any) => t.id === id);
        if (index > -1) {
          transactions[index] = {
            ...transactions[index],
            ...data,
            updatedAt: new Date().toISOString(),
          };
          localStorage.setItem('mockMoneyTransactions', JSON.stringify(transactions));
          resolve({ success: true, transaction: transactions[index] });
        } else {
          resolve({ success: false, error: 'Transaction not found' });
        }
      }, 300);
    });
  }

  async deleteMoneyTransaction(id: string) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const transactions = JSON.parse(localStorage.getItem('mockMoneyTransactions') || '[]');
        const filtered = transactions.filter((t: any) => t.id !== id);
        localStorage.setItem('mockMoneyTransactions', JSON.stringify(filtered));
        resolve({ success: true });
      }, 300);
    });
  }

  // Company Expenses endpoints
  async getCompanyExpenses() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const expenses = JSON.parse(localStorage.getItem('mockCompanyExpenses') || '[]');
        resolve(expenses);
      }, 300);
    });
  }

  async addCompanyExpense(data: any) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const expenses = JSON.parse(localStorage.getItem('mockCompanyExpenses') || '[]');
        const newExpense = {
          id: `EXP-${Date.now()}`,
          ...data,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        expenses.push(newExpense);
        localStorage.setItem('mockCompanyExpenses', JSON.stringify(expenses));
        resolve({ success: true, expense: newExpense });
      }, 300);
    });
  }

  async updateCompanyExpense(id: string, data: any) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const expenses = JSON.parse(localStorage.getItem('mockCompanyExpenses') || '[]');
        const index = expenses.findIndex((e: any) => e.id === id);
        if (index >= 0) {
          expenses[index] = {
            ...expenses[index],
            ...data,
            updatedAt: new Date().toISOString(),
          };
          localStorage.setItem('mockCompanyExpenses', JSON.stringify(expenses));
          resolve({ success: true, expense: expenses[index] });
        } else {
          resolve({ success: false, error: 'Expense not found' });
        }
      }, 300);
    });
  }

  async deleteCompanyExpense(id: string) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const expenses = JSON.parse(localStorage.getItem('mockCompanyExpenses') || '[]');
        const filtered = expenses.filter((e: any) => e.id !== id);
        localStorage.setItem('mockCompanyExpenses', JSON.stringify(filtered));
        resolve({ success: true });
      }, 300);
    });
  }

  // Logs endpoints
  async getLogs() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const attendance = JSON.parse(localStorage.getItem('mockAttendance') || '[]');
        resolve(attendance);
      }, 300);
    });
  }
}

export const apiClient = new ApiClient();
