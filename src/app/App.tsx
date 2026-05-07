import React, { useState, useEffect } from 'react';
import { apiClient } from '../api/client';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'employee' | 'admin' | 'superadmin' | 'ai-developer' | 'telecaller' | 'hr' | 'editor';
}

interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  position?: string;
  department?: string;
  password?: string;
  role?: 'employee' | 'ai-developer' | 'telecaller' | 'hr' | 'editor';
  createdBy?: string;
  createdAt?: string;
}

interface Attendance {
  id: string;
  userId: string;
  date: string;
  status: 'present' | 'absent' | 'pending';
  requestedStatus?: 'present' | 'absent';
  approvedBy?: string;
  approvedAt?: string;
  employeeName?: string;
  location?: { lat: number; lng: number; accuracy?: number; timestamp?: string };
  distanceMeters?: number;
  locationStatus?: 'verified' | 'gps-unavailable' | 'out-of-range';
  locationMessage?: string;
}

interface BankDetails {
  userId: string;
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  ifscCode: string;
}

interface MoneyTransaction {
  id: string;
  transactionId?: string;
  date: string;
  type: 'credit' | 'debit';
  amount: number;
  mode: 'cash' | 'phonepe' | 'gpay' | 'bank' | 'card' | 'other';
  category?: string;
  notes?: string;
  proofImageUrl?: string;
  createdBy?: string;
  createdByName?: string;
  createdByRole?: 'employee' | 'admin' | 'superadmin';
  createdAt?: string;
  updatedAt?: string;
}

interface CompanyExpense {
  id: string;
  date: string;
  category: 'food' | 'rent' | 'utilities' | 'equipment' | 'supplies' | 'travel' | 'other';
  description: string;
  amount: number;
  photoUrls: string[];
  notes?: string;
  approvedBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

type ReportAttachment = {
  name: string;
  type: string;
  dataUrl: string;
};

const OFFICE_LOCATION = { lat: 16.9938889, lng: 82.2428611 };
const OFFICE_LOCATION_LABEL = `16°59'38.0"N 82°14'34.3"E`;
const OFFICE_RADIUS_METERS = 200;
const viteEnv = (import.meta as any).env || {};
const CLOUDINARY_CLOUD_NAME = viteEnv.VITE_CLOUDINARY_CLOUD_NAME || '';
const CLOUDINARY_UPLOAD_PRESET = viteEnv.VITE_CLOUDINARY_UPLOAD_PRESET || '';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  const [email, setEmail] = useState('admin@company.com');
  const [password, setPassword] = useState('Admin@123');
  const [forgotEmail, setForgotEmail] = useState('');
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [moneyTransactions, setMoneyTransactions] = useState<MoneyTransaction[]>([]);
  const [bankData, setBankData] = useState<BankDetails | null>(null);
  const [bankForm, setBankForm] = useState({
    bankName: '', accountNumber: '', accountHolder: '', ifscCode: '',
  });
  const [employeeBankDetails, setEmployeeBankDetails] = useState<any[]>([]);
  const [newEmployee, setNewEmployee] = useState({
    name: '', email: '', phone: '', position: '', department: '', monthlySalary: '', password: '', role: 'employee' as 'employee' | 'ai-developer' | 'telecaller' | 'hr' | 'editor',
  });
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [todayDate] = useState(new Date().toISOString().split('T')[0]);
  const [salaryData, setSalaryData] = useState<any>(null);
  const [editingReport, setEditingReport] = useState<any>(null);
  const [selectedEmployeeForBank, setSelectedEmployeeForBank] = useState<string>('');
  const [userProfileImage, setUserProfileImage] = useState<string | null>(null);
  const [profileImages, setProfileImages] = useState<any>({});
  const [selectedEmployeeForSalary, setSelectedEmployeeForSalary] = useState<string>('');
  const [reportForm, setReportForm] = useState({
    calls: '0',
    leads: '0',
    conversions: '0',
    revenue: '0',
    clientName: '',
    companyName: '',
    phones: '',
    clientEmail: '',
    clientAddress: '',
    clientNotes: '',
  });
  const [reportFiles, setReportFiles] = useState<ReportAttachment[]>([]);
  const [reportFileInputKey, setReportFileInputKey] = useState(0);
  const [editingMoneyId, setEditingMoneyId] = useState<string | null>(null);
  const [moneyProofFile, setMoneyProofFile] = useState<File | null>(null);
  const [moneyProofPreview, setMoneyProofPreview] = useState<string>('');
  const [moneyProofUploading, setMoneyProofUploading] = useState(false);
  const [moneyFilters, setMoneyFilters] = useState({
    query: '',
    type: 'all' as 'all' | 'credit' | 'debit',
    mode: 'all' as 'all' | 'cash' | 'phonepe' | 'gpay' | 'bank' | 'card' | 'other',
    startDate: '',
    endDate: '',
    proofOnly: false,
    submittedByRole: 'all' as 'all' | 'employee' | 'admin' | 'superadmin',
  });
  const [moneyForm, setMoneyForm] = useState({
    date: new Date().toISOString().split('T')[0],
    type: 'credit' as 'credit' | 'debit',
    amount: '',
    mode: 'phonepe' as 'cash' | 'phonepe' | 'gpay' | 'bank' | 'card' | 'other',
    category: '',
    notes: '',
    proofImageUrl: '',
  });

  // Company Expense Management State
  const [companyExpenses, setCompanyExpenses] = useState<CompanyExpense[]>([]);
  const [editingExpenseId, setEditingExpenseId] = useState<string | null>(null);
  const [companyExpenseForm, setCompanyExpenseForm] = useState({
    date: new Date().toISOString().split('T')[0],
    category: 'food' as 'food' | 'rent' | 'utilities' | 'equipment' | 'supplies' | 'travel' | 'other',
    description: '',
    amount: '',
    notes: '',
  });
  const [expensePhotoFile, setExpensePhotoFile] = useState<File | null>(null);
  const [expensePhotoPreview, setExpensePhotoPreview] = useState<string>('');
  const [expensePhotoUploading, setExpensePhotoUploading] = useState(false);
  const [expensePhotos, setExpensePhotos] = useState<string[]>([]);
  const [companyExpenseFilters, setCompanyExpenseFilters] = useState({
    query: '',
    category: 'all' as 'all' | 'food' | 'rent' | 'utilities' | 'equipment' | 'supplies' | 'travel' | 'other',
    startDate: '',
    endDate: '',
  });
  const [dashboardFilter, setDashboardFilter] = useState<'today' | 'month'>('month');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedImages = JSON.parse(localStorage.getItem('profileImages') || '{}');
    setProfileImages(savedImages);
    if (token) fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await apiClient.getProfile() as any;
      setUser(response.user);
      setIsLoggedIn(true);
      // Load user's profile image
      const savedImages = JSON.parse(localStorage.getItem('profileImages') || '{}');
      if (savedImages[response.user.id]) {
        setUserProfileImage(savedImages[response.user.id]);
      } else {
        setUserProfileImage(null);
      }
      loadDashboard();
    } catch (err) {
      localStorage.removeItem('token');
      setIsLoggedIn(false);
    }
  };

  const handleProfileImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && user?.id) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageData = reader.result as string;
        setUserProfileImage(imageData);
        const updated = {...profileImages, [user.id]: imageData};
        setProfileImages(updated);
        localStorage.setItem('profileImages', JSON.stringify(updated));
        setSuccess('Profile image updated successfully.');
      };
      reader.readAsDataURL(file);
    }
  };

  const getDistanceMeters = (fromLat: number, fromLng: number, toLat: number, toLng: number) => {
    const toRad = (value: number) => (value * Math.PI) / 180;
    const earthRadius = 6371000;
    const dLat = toRad(toLat - fromLat);
    const dLng = toRad(toLng - fromLng);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(fromLat)) * Math.cos(toRad(toLat)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(earthRadius * c);
  };

  const getCurrentPosition = () =>
    new Promise<GeolocationPosition>((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported'));
        return;
      }
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      });
    });

  const handleReportFilesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) {
      setReportFiles([]);
      return;
    }
    const fileData = await Promise.all(
      files.map((file) =>
        new Promise<ReportAttachment>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve({ name: file.name, type: file.type, dataUrl: reader.result as string });
          reader.onerror = () => reject(new Error('Failed to read file'));
          reader.readAsDataURL(file);
        })
      )
    );
    setReportFiles(fileData);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoginLoading(true);
    try {
      const response = await apiClient.login(email, password) as any;
      apiClient.setToken(response.token);
      setUser(response.user);
      setIsLoggedIn(true);
      const savedImages = JSON.parse(localStorage.getItem('profileImages') || '{}');
      setUserProfileImage(savedImages[response.user.id] || null);
      loadDashboard();
    } catch (err: any) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoginLoading(false);
    }
  };

  const loadDashboard = async () => {
    try {
      const empResponse = await apiClient.getEmployees().catch(() => ({ employees: [] })) as any;
      const reportResponse = await apiClient.getAllReports().catch(() => ({ reports: [] })) as any;
      const attResponse = await apiClient.getLogs().catch(() => []) as any;
      const moneyResponse = await apiClient.getMoneyTransactions().catch(() => ({ transactions: [] })) as any;
      
      setEmployees(empResponse.employees || []);
      setReports(reportResponse.reports || []);
      if (Array.isArray(attResponse)) setAttendance(attResponse);
      setMoneyTransactions(Array.isArray(moneyResponse?.transactions) ? moneyResponse.transactions : []);

      // Load employee bank details
      const empBankDetails = JSON.parse(localStorage.getItem('employeeBankDetails') || '[]');
      setEmployeeBankDetails(empBankDetails);

      if (user?.id) {
        const bankResponse = await apiClient.getBankDetails(user.id).catch(() => null) as any;
        if (bankResponse?.bankDetails) setBankData(bankResponse.bankDetails);

        if (user.role === 'employee') {
          const employeeRecord = (empResponse.employees || []).find((emp: any) => emp.id === user.id || emp.email === user.email);
          const monthlySalary = parseInt(employeeRecord?.monthlySalary || '0');
          const approvedAttendance = Array.isArray(attResponse)
            ? attResponse.filter((record: any) => record.userId === user.id && record.status !== 'pending')
            : [];
          const daysPresent = approvedAttendance.filter((record: any) => record.status === 'present').length;
          const daysAbsent = approvedAttendance.filter((record: any) => record.status === 'absent').length;

          if (monthlySalary > 0 && approvedAttendance.length > 0) {
            setSalaryData({
              daysPresent,
              daysAbsent,
              monthlySalary,
              finalSalary: calculateFinalSalary(monthlySalary, daysPresent, daysAbsent),
            });
          } else {
            setSalaryData(null);
          }
        }
      }
    } catch (err) {
      console.error('Failed to load dashboard:', err);
    }
  };

  const handleLogout = () => {
    apiClient.clearToken();
    setIsLoggedIn(false);
    setUser(null);
    setUserProfileImage(null);
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      if (!forgotEmail) {
        setError('Please enter your email address');
        return;
      }
      // Simulating password reset - in real app, send to backend
      setSuccess('Password reset link has been sent to ' + forgotEmail + '\n\nTemporary Password: Welcome@123\n\nPlease change it after login.');
      setForgotEmail('');
      setTimeout(() => setShowForgotPassword(false), 3000);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      if (!newEmployee.name || !newEmployee.email || !newEmployee.phone) {
        setError('Name, Email, and Phone are required');
        return;
      }
      if (!newEmployee.password || newEmployee.password.length < 6) {
        setError('Password must be at least 6 characters');
        return;
      }
      await apiClient.addEmployee({...newEmployee, createdBy: user?.id, createdAt: new Date().toISOString()});
      setSuccess('Employee created successfully. Password: ' + newEmployee.password);
      setNewEmployee({ name: '', email: '', phone: '', position: '', department: '', monthlySalary: '', password: '', role: 'employee' });
      loadDashboard();
    } catch (err: any) {
      setError(err.message || 'Failed to add employee');
    }
  };

  const handleDeleteEmployee = async (id: string) => {
    if (!confirm('Delete this employee?')) return;
    try {
      await apiClient.deleteEmployee(id);
      setSuccess('Employee deleted');
      loadDashboard();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleEditEmployee = (emp: Employee) => {
    setEditingEmployee(emp);
    setNewEmployee({ name: emp.name, email: emp.email, phone: emp.phone, position: emp.position || '', department: emp.department || '', monthlySalary: (emp as any).monthlySalary || '', password: emp.password || '', role: (emp as any).role || 'employee' });
  };

  const handleUpdateEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEmployee) return;
    setError('');
    setSuccess('');
    try {
      if (!newEmployee.name || !newEmployee.email || !newEmployee.phone) {
        setError('Name, Email, and Phone are required');
        return;
      }
      const updated = employees.map(emp => emp.id === editingEmployee.id ? {...emp, ...newEmployee} : emp);
      setEmployees(updated);
      localStorage.setItem('mockEmployees', JSON.stringify(updated));
      setSuccess('Employee updated successfully.');
      setEditingEmployee(null);
      setNewEmployee({ name: '', email: '', phone: '', position: '', department: '', monthlySalary: '', password: '', role: 'employee' });
      loadDashboard();
    } catch (err: any) {
      setError(err.message || 'Failed to update employee');
    }
  };

  const handleMarkAttendance = async (status: 'present' | 'absent') => {
    setError('');
    setSuccess('');
    try {
      if (!user?.id) {
        setError('User not found');
        return;
      }
      const alreadyMarked = attendance.some(a => a.userId === user.id && a.date === todayDate);
      if (alreadyMarked) {
        setError('You have already marked attendance for today');
        return;
      }
      let locationStatus: Attendance['locationStatus'] = 'gps-unavailable';
      let locationMessage = 'Location unavailable. Attendance marked with warning.';
      let location: Attendance['location'] | undefined;
      let distanceMeters: number | undefined;

      try {
        const position = await getCurrentPosition();
        const { latitude, longitude, accuracy } = position.coords;
        distanceMeters = getDistanceMeters(latitude, longitude, OFFICE_LOCATION.lat, OFFICE_LOCATION.lng);
        location = { lat: latitude, lng: longitude, accuracy, timestamp: new Date(position.timestamp).toISOString() };

        if (distanceMeters <= OFFICE_RADIUS_METERS) {
          locationStatus = 'verified';
          locationMessage = 'Location verified at office.';
        } else {
          locationStatus = 'out-of-range';
          locationMessage = `Outside office range (${distanceMeters}m away). Attendance not marked.`;
          setError(locationMessage);
          return;
        }
      } catch (geoErr) {
        locationStatus = 'gps-unavailable';
      }

      await apiClient.markAttendance({
        date: todayDate,
        status: 'pending',
        requestedStatus: status,
        userId: user.id,
        employeeName: user.name,
        location,
        distanceMeters,
        locationStatus,
        locationMessage,
      });
      setSuccess(`Marked as ${status}. Waiting for admin approval. ${locationMessage}`);
      loadDashboard();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleApproveAttendance = async (id: string, approve: boolean) => {
    setError('');
    setSuccess('');
    try {
      const status = approve ? 'present' : 'absent';
      const updated = attendance.map(a => 
        a.id === id ? {...a, status: (approve ? (a.requestedStatus || 'present') : 'absent') as any, approvedBy: user?.id, approvedAt: new Date().toISOString()} : a
      );
      setAttendance(updated);
      localStorage.setItem('mockAttendance', JSON.stringify(updated));
      setSuccess(approve ? 'Attendance approved.' : 'Attendance rejected.');
      loadDashboard();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleSaveBankDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      if (!user?.id) {
        setError('User not found');
        return;
      }
      if (!bankForm.bankName || !bankForm.accountNumber || !bankForm.accountHolder || !bankForm.ifscCode) {
        setError('All bank details are required');
        return;
      }
      await apiClient.updateBankDetails({
        userId: user.id,
        ...bankForm
      });
      setSuccess('Bank details saved successfully.');
      setBankData({ userId: user.id, ...bankForm });
      setBankForm({ bankName: '', accountNumber: '', accountHolder: '', ifscCode: '' });
      loadDashboard();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleSaveEmployeeBankDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      if (!selectedEmployeeForBank) {
        setError('Please select an employee');
        return;
      }
      if (!bankForm.bankName || !bankForm.accountNumber || !bankForm.accountHolder || !bankForm.ifscCode) {
        setError('All bank details are required');
        return;
      }
      const existing = employeeBankDetails.findIndex(b => b.userId === selectedEmployeeForBank);
      const bankDetails = {
        userId: selectedEmployeeForBank,
        ...bankForm
      };
      let updated: any[] = [];
      if (existing >= 0) {
        updated = employeeBankDetails.map((b, i) => i === existing ? bankDetails : b);
      } else {
        updated = [...employeeBankDetails, bankDetails];
      }
      setEmployeeBankDetails(updated);
      localStorage.setItem('employeeBankDetails', JSON.stringify(updated));
      setSuccess('Employee bank details saved successfully.');
      setBankForm({ bankName: '', accountNumber: '', accountHolder: '', ifscCode: '' });
      setSelectedEmployeeForBank('');
    } catch (err: any) {
      setError(err.message);
    }
  };

  useEffect(() => {
    if (!user || user.role !== 'employee') return;
    const employeeRecord = employees.find((emp) => emp.id === user.id || emp.email === user.email);
    const monthlySalary = parseInt((employeeRecord as any)?.monthlySalary || '0');
    const approvedAttendance = attendance.filter(
      (record) => record.userId === user.id && record.status !== 'pending'
    );
    const daysPresent = approvedAttendance.filter((record) => record.status === 'present').length;
    const daysAbsent = approvedAttendance.filter((record) => record.status === 'absent').length;

    if (monthlySalary > 0 && approvedAttendance.length > 0) {
      setSalaryData({
        daysPresent,
        daysAbsent,
        monthlySalary,
        finalSalary: calculateFinalSalary(monthlySalary, daysPresent, daysAbsent),
      });
    } else {
      setSalaryData(null);
    }
  }, [attendance, employees, user]);

  // Load company expenses from API
  useEffect(() => {
    const loadExpenses = async () => {
      try {
        const expenses = await apiClient.getCompanyExpenses() as any;
        setCompanyExpenses(expenses);
      } catch (err) {
        console.error('Failed to load company expenses:', err);
      }
    };
    loadExpenses();
  }, []);

  const handleEditReport = (report: any, idx: number) => {
    setEditingReport({...report, idx});
  };

  const handleUpdateReport = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const updated = reports.map((r, idx) => idx === editingReport.idx ? {...editingReport} : r);
      setReports(updated);
      localStorage.setItem('mockReports', JSON.stringify(updated));
      setSuccess('Report updated successfully.');
      setEditingReport(null);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDeleteReport = (idx: number) => {
    if (!confirm('Delete this report?')) return;
    try {
      const updated = reports.filter((_, i) => i !== idx);
      setReports(updated);
      localStorage.setItem('mockReports', JSON.stringify(updated));
      setSuccess('Report deleted.');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleAddReport = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const reportData = {
        leads: parseInt(reportForm.leads) || 0,
        calls: parseInt(reportForm.calls) || 0,
        conversions: parseInt(reportForm.conversions) || 0,
        revenue: parseFloat(reportForm.revenue) || 0,
        userId: user?.id,
        employeeName: user?.name,
        clientName: reportForm.clientName.trim(),
        companyName: reportForm.companyName.trim(),
        phones: reportForm.phones.trim(),
        clientEmail: reportForm.clientEmail.trim(),
        clientAddress: reportForm.clientAddress.trim(),
        clientNotes: reportForm.clientNotes.trim(),
        clientFiles: reportFiles,
      };
      await apiClient.addReport(reportData);
      setSuccess('Report submitted successfully.');
      setReportForm({
        calls: '0',
        leads: '0',
        conversions: '0',
        revenue: '0',
        clientName: '',
        companyName: '',
        phones: '',
        clientEmail: '',
        clientAddress: '',
        clientNotes: '',
      });
      setReportFiles([]);
      setReportFileInputKey((prev) => prev + 1);
      loadDashboard();
    } catch (err: any) {
      setError(err.message || 'Failed to submit report');
    }
  };

  const resetMoneyForm = () => {
    setMoneyForm({
      date: new Date().toISOString().split('T')[0],
      type: 'credit',
      amount: '',
      mode: 'phonepe',
      category: '',
      notes: '',
      proofImageUrl: '',
    });
    setMoneyProofFile(null);
    setMoneyProofPreview('');
    setEditingMoneyId(null);
  };

  const uploadMoneyProofToCloudinary = async (file: File) => {
    // Instead of uploading to Cloudinary, convert to base64 and store locally
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        console.log('Image converted to base64, size:', base64String.length);
        resolve(base64String);
      };
      reader.onerror = () => {
        reject(new Error('Failed to read image file'));
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSaveMoneyTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      if (!user?.id) {
        setError('User not found');
        return;
      }
      if (!moneyForm.date) {
        setError('Date is required');
        return;
      }
      const amount = parseFloat(moneyForm.amount);
      if (!Number.isFinite(amount) || amount <= 0) {
        setError('Enter a valid amount greater than 0');
        return;
      }

      let proofImageUrl = moneyForm.proofImageUrl;
      if (moneyProofFile) {
        setMoneyProofUploading(true);
        try {
          proofImageUrl = await uploadMoneyProofToCloudinary(moneyProofFile);
          console.log('Image uploaded successfully:', proofImageUrl);
        } catch (uploadErr: any) {
          setMoneyProofUploading(false);
          setError('Failed to upload image: ' + uploadErr.message);
          return;
        }
      }
      if (user.role === 'employee' && !proofImageUrl) {
        setError('Payment screenshot is required for employee submissions');
        setMoneyProofUploading(false);
        return;
      }

      const payload = {
        date: moneyForm.date,
        type: user.role === 'employee' ? 'credit' : moneyForm.type,
        amount,
        mode: moneyForm.mode,
        category: (user.role === 'employee' ? (moneyForm.category.trim() || 'Client Payment') : moneyForm.category.trim()),
        notes: moneyForm.notes.trim(),
        proofImageUrl,
        createdBy: user.id,
        createdByName: user.name,
        createdByRole: user.role,
      };

      console.log('Saving transaction with payload:', payload);

      if (editingMoneyId) {
        const result = await apiClient.updateMoneyTransaction(editingMoneyId, payload);
        console.log('Update result:', result);
        setSuccess('Money transaction updated successfully.');
      } else {
        const result = await apiClient.addMoneyTransaction(payload);
        console.log('Add result:', result);
        setSuccess('Money transaction added successfully.');
      }
      
      // Wait a bit to ensure localStorage is updated
      await new Promise(resolve => setTimeout(resolve, 500));
      
      resetMoneyForm();
      await loadDashboard();
      
      console.log('Transaction saved and dashboard reloaded');
    } catch (err: any) {
      console.error('Error saving transaction:', err);
      setError(err.message || 'Failed to save money transaction');
    } finally {
      setMoneyProofUploading(false);
    }
  };

  const handleEditMoneyTransaction = (transaction: MoneyTransaction) => {
    // Only superadmin can edit all, or employees can edit their own
    const canEdit = isSuperadmin || (isEmployee && transaction.createdBy === user?.id);
    if (!canEdit) {
      setError('You can only edit your own transactions');
      return;
    }
    setEditingMoneyId(transaction.id);
    setMoneyForm({
      date: transaction.date,
      type: transaction.type,
      amount: String(transaction.amount),
      mode: transaction.mode,
      category: transaction.category || '',
      notes: transaction.notes || '',
      proofImageUrl: transaction.proofImageUrl || '',
    });
    setMoneyProofFile(null);
    setMoneyProofPreview(transaction.proofImageUrl || '');
  };

  const handleMoneyProofFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setMoneyProofFile(file);
    if (file) {
      setMoneyProofPreview(URL.createObjectURL(file));
    } else {
      setMoneyProofPreview(moneyForm.proofImageUrl || '');
    }
  };

  const handleDeleteMoneyTransaction = async (id: string) => {
    const transaction = moneyTransactions.find(t => t.id === id);
    const canDelete = isSuperadmin || (isEmployee && transaction?.createdBy === user?.id);
    if (!canDelete) {
      setError('You can only delete your own transactions');
      return;
    }
    if (!confirm('Delete this transaction?')) return;
    setError('');
    setSuccess('');
    try {
      await apiClient.deleteMoneyTransaction(id);
      setSuccess('Money transaction deleted.');
      if (editingMoneyId === id) {
        resetMoneyForm();
      }
      loadDashboard();
    } catch (err: any) {
      setError(err.message || 'Failed to delete transaction');
    }
  };

  // ===== COMPANY EXPENSE HANDLERS =====
  const uploadExpensePhotoToCloudinary = async (file: File) => {
    if (!file) return null;
    
    // Convert to base64 instead of uploading to Cloudinary
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        console.log('Expense photo converted to base64, size:', base64String.length);
        resolve(base64String);
      };
      reader.onerror = () => {
        setError('Failed to read photo file');
        reject(new Error('Failed to read photo file'));
      };
      reader.readAsDataURL(file);
    });
  };

  const handleExpensePhotoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setExpensePhotoFile(file);
    if (file) {
      setExpensePhotoPreview(URL.createObjectURL(file));
    } else {
      setExpensePhotoPreview('');
    }
  };

  const handleAddExpensePhoto = async () => {
    if (!expensePhotoFile) {
      setError('Please select a photo');
      return;
    }
    setExpensePhotoUploading(true);
    try {
      const photoUrl = await uploadExpensePhotoToCloudinary(expensePhotoFile);
      if (photoUrl) {
        setExpensePhotos([...expensePhotos, photoUrl]);
        setExpensePhotoFile(null);
        setExpensePhotoPreview('');
        setSuccess('Photo added successfully');
      }
    } catch (err) {
      setError('Failed to add photo');
    } finally {
      setExpensePhotoUploading(false);
    }
  };

  const handleRemoveExpensePhoto = (url: string) => {
    setExpensePhotos(expensePhotos.filter(p => p !== url));
  };

  const resetExpenseForm = () => {
    setCompanyExpenseForm({
      date: new Date().toISOString().split('T')[0],
      category: 'food',
      description: '',
      amount: '',
      notes: '',
    });
    setExpensePhotos([]);
    setExpensePhotoFile(null);
    setExpensePhotoPreview('');
    setEditingExpenseId(null);
  };

  const handleSaveCompanyExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyExpenseForm.date) {
      setError('Date is required');
      return;
    }
    const amount = parseFloat(companyExpenseForm.amount);
    if (!amount || amount <= 0) {
      setError('Amount must be greater than 0');
      return;
    }
    if (!companyExpenseForm.description.trim()) {
      setError('Description is required');
      return;
    }

    setError('');
    setSuccess('');

    try {
      if (editingExpenseId) {
        // Update expense
        const result = await apiClient.updateCompanyExpense(editingExpenseId, {
          date: companyExpenseForm.date,
          category: companyExpenseForm.category,
          description: companyExpenseForm.description,
          amount,
          notes: companyExpenseForm.notes,
          photoUrls: expensePhotos,
        }) as any;
        if (result.success) {
          const updated = companyExpenses.map(e => e.id === editingExpenseId ? result.expense : e);
          setCompanyExpenses(updated);
          setSuccess('Expense updated successfully');
        }
      } else {
        // Add new expense
        const result = await apiClient.addCompanyExpense({
          date: companyExpenseForm.date,
          category: companyExpenseForm.category,
          description: companyExpenseForm.description,
          amount,
          photoUrls: expensePhotos,
          notes: companyExpenseForm.notes,
        }) as any;
        if (result.success) {
          setCompanyExpenses([...companyExpenses, result.expense]);
          setSuccess('Expense added successfully');
        }
      }
      resetExpenseForm();
    } catch (err: any) {
      setError(err.message || 'Failed to save expense');
    }
  };

  const handleEditExpense = (expense: CompanyExpense) => {
    // Only admin can manage (not superadmin in CRUD-only mode)
    if (!isAdmin || isSuperadmin) return;
    setEditingExpenseId(expense.id);
    setCompanyExpenseForm({
      date: expense.date,
      category: expense.category,
      description: expense.description,
      amount: String(expense.amount),
      notes: expense.notes || '',
    });
    setExpensePhotos(expense.photoUrls || []);
  };

  const handleDeleteExpense = async (id: string) => {
    // Only admin can delete (not superadmin in CRUD-only mode)
    if (!isAdmin || isSuperadmin) {
      setError('You cannot delete expenses');
      return;
    }
    if (!confirm('Delete this expense?')) return;
    try {
      const result = await apiClient.deleteCompanyExpense(id) as any;
      if (result.success) {
        const updated = companyExpenses.filter(e => e.id !== id);
        setCompanyExpenses(updated);
        setSuccess('Expense deleted successfully');
        if (editingExpenseId === id) {
          resetExpenseForm();
        }
      }
    } catch (err: any) {
      setError(err.message || 'Failed to delete expense');
    }
  };

  const calculateFinalSalary = (baseSalary: number, daysPresent: number, daysAbsent: number) => {
    const totalDays = daysPresent + daysAbsent || 30;
    const perDaySalary = baseSalary / 30;
    return Math.round(perDaySalary * daysPresent);
  };

  const pendingApprovals = attendance.filter(a => a.status === 'pending');
  const isSuperadmin = user?.role === 'superadmin';
  const isAdminReadOnly = user?.role === 'admin';
  const isAdmin = user?.role === 'admin' || user?.role === 'superadmin';
  const isEmployee = user?.role === 'employee';
  const isAIDeveloper = user?.role === 'ai-developer';
  const isTelecaller = user?.role === 'telecaller';
  const isHR = user?.role === 'hr';
  const isEditor = user?.role === 'editor';
  const visibleTabs = isAdmin
    ? ['dashboard', 'attendance', 'employees', 'reports', 'salary', 'bank', 'money-management', 'company-management', 'settings']
    : isAIDeveloper
    ? ['dashboard', 'reports', 'settings']
    : isTelecaller
    ? ['dashboard', 'reports', 'settings']
    : isHR
    ? ['dashboard', 'employees', 'attendance', 'salary', 'bank', 'settings']
    : isEditor
    ? ['dashboard', 'reports', 'settings']
    : ['dashboard', 'attendance', 'reports', 'salary', 'bank', 'money-management', 'settings'];
  const visibleReports = isAdmin
    ? reports
    : reports.filter((report) => report.userId && report.userId === user?.id);
  const visibleAttendance = isAdmin
    ? attendance
    : attendance.filter((record) => record.userId === user?.id);
  const sortedMoneyTransactions = [...moneyTransactions].sort((a, b) => {
    if (a.date !== b.date) return b.date.localeCompare(a.date);
    return (b.createdAt || '').localeCompare(a.createdAt || '');
  });
  const visibleMoneyTransactions = isAdmin
    ? sortedMoneyTransactions
    : sortedMoneyTransactions.filter((item) => item.createdBy === user?.id);
  const filteredMoneyTransactions = visibleMoneyTransactions.filter((item) => {
    const query = moneyFilters.query.trim().toLowerCase();
    const matchesQuery =
      !query ||
      (item.transactionId || '').toLowerCase().includes(query) ||
      item.date.toLowerCase().includes(query) ||
      (item.category || '').toLowerCase().includes(query) ||
      (item.notes || '').toLowerCase().includes(query) ||
      (item.createdByName || '').toLowerCase().includes(query);
    const matchesType = moneyFilters.type === 'all' || item.type === moneyFilters.type;
    const matchesMode = moneyFilters.mode === 'all' || item.mode === moneyFilters.mode;
    const matchesStart = !moneyFilters.startDate || item.date >= moneyFilters.startDate;
    const matchesEnd = !moneyFilters.endDate || item.date <= moneyFilters.endDate;
    const matchesProof = !moneyFilters.proofOnly || !!item.proofImageUrl;
    const matchesRole = !isAdmin || moneyFilters.submittedByRole === 'all' || item.createdByRole === moneyFilters.submittedByRole;
    return matchesQuery && matchesType && matchesMode && matchesStart && matchesEnd && matchesProof && matchesRole;
  });
  const moneyTotals = filteredMoneyTransactions.reduce(
    (acc, item) => {
      if (item.type === 'credit') acc.totalCredit += item.amount;
      else acc.totalDebit += item.amount;
      return acc;
    },
    { totalCredit: 0, totalDebit: 0 }
  );
  const moneyBalance = moneyTotals.totalCredit - moneyTotals.totalDebit;
  const todayMoneyDate = new Date().toISOString().split('T')[0];
  const todayMoneyTotals = filteredMoneyTransactions
    .filter((item) => item.date === todayMoneyDate)
    .reduce(
      (acc, item) => {
        if (item.type === 'credit') acc.credit += item.amount;
        else acc.debit += item.amount;
        return acc;
      },
      { credit: 0, debit: 0 }
    );
  const modeTotals = filteredMoneyTransactions.reduce((acc, item) => {
    const key = item.mode || 'other';
    if (!acc[key]) acc[key] = { credit: 0, debit: 0 };
    if (item.type === 'credit') acc[key].credit += item.amount;
    else acc[key].debit += item.amount;
    return acc;
  }, {} as Record<string, { credit: number; debit: number }>);
  const dailyTotals = Object.values(
    filteredMoneyTransactions.reduce((acc, item) => {
      if (!acc[item.date]) {
        acc[item.date] = { date: item.date, credit: 0, debit: 0, count: 0 };
      }
      if (item.type === 'credit') acc[item.date].credit += item.amount;
      else acc[item.date].debit += item.amount;
      acc[item.date].count += 1;
      return acc;
    }, {} as Record<string, { date: string; credit: number; debit: number; count: number }>)
  ).sort((a, b) => b.date.localeCompare(a.date));
  const currentEditingMoney = visibleMoneyTransactions.find((item) => item.id === editingMoneyId) || null;

  // ===== COMPANY EXPENSE CALCULATIONS =====
  const filteredExpenses = companyExpenses.filter((item) => {
    const matchesQuery = item.description.toLowerCase().includes(companyExpenseFilters.query.toLowerCase()) ||
                         item.notes?.toLowerCase().includes(companyExpenseFilters.query.toLowerCase());
    const matchesCategory = companyExpenseFilters.category === 'all' || item.category === companyExpenseFilters.category;
    const itemDate = new Date(item.date);
    const startDate = companyExpenseFilters.startDate ? new Date(companyExpenseFilters.startDate) : null;
    const endDate = companyExpenseFilters.endDate ? new Date(companyExpenseFilters.endDate) : null;
    const matchesDateRange = (!startDate || itemDate >= startDate) && (!endDate || itemDate <= endDate);
    return matchesQuery && matchesCategory && matchesDateRange;
  });

  const expenseTotals = filteredExpenses.reduce(
    (acc, item) => {
      acc.totalExpenses += item.amount;
      if (!acc.byCategory[item.category]) acc.byCategory[item.category] = 0;
      acc.byCategory[item.category] += item.amount;
      return acc;
    },
    { totalExpenses: 0, byCategory: {} as Record<string, number> }
  );

  const dailyExpenses = Object.values(
    filteredExpenses.reduce((acc, item) => {
      if (!acc[item.date]) {
        acc[item.date] = { date: item.date, total: 0, count: 0 };
      }
      acc[item.date].total += item.amount;
      acc[item.date].count += 1;
      return acc;
    }, {} as Record<string, { date: string; total: number; count: number }>)
  ).sort((a, b) => b.date.localeCompare(a.date));

  // Today's expenses
  const today = new Date().toISOString().split('T')[0];
  const todayExpenses = filteredExpenses.filter(e => e.date === today).reduce((sum, e) => sum + e.amount, 0);

  // Calculate daily revenue vs expense
  const revenueVsExpenseByDay = Object.entries(
    filteredMoneyTransactions
      .filter(t => t.type === 'credit')
      .reduce((acc, item) => {
        if (!acc[item.date]) acc[item.date] = { revenue: 0, expense: 0 };
        acc[item.date].revenue += item.amount;
        return acc;
      }, {} as Record<string, { revenue: number; expense: number }>)
  ).map(([date, data]) => {
    const dayExpense = filteredExpenses.filter(e => e.date === date).reduce((sum, e) => sum + e.amount, 0);
    return { date, revenue: data.revenue, expense: dayExpense };
  }).sort((a, b) => b.date.localeCompare(a.date));

  // LOGIN PAGE
  if (!isLoggedIn) {
    return (
      <div style={{width: '100%', minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", padding: '20px', boxSizing: 'border-box'}}>
        <div style={{background: '#fff', padding: '50px 40px', borderRadius: '20px', boxShadow: '0 25px 50px rgba(0,0,0,0.3)', width: '100%', maxWidth: '450px'}}>
          {!showForgotPassword ? (
            <>
              <h1 style={{fontSize: '32px', fontWeight: '800', marginBottom: '8px', textAlign: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>Employee Portal</h1>
              <p style={{color: '#6b7280', marginBottom: '32px', textAlign: 'center', fontSize: '14px'}}>Manage employees, attendance & salaries</p>

              {error && <div style={{background: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)', color: '#fff', padding: '14px 16px', borderRadius: '10px', marginBottom: '20px', fontSize: '14px', fontWeight: '500'}}>{error}</div>}
              {success && <div style={{background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)', color: '#fff', padding: '14px 16px', borderRadius: '10px', marginBottom: '20px', fontSize: '14px', fontWeight: '500'}}>{success}</div>}

              <form onSubmit={handleLogin}>
                <div style={{marginBottom: '20px'}}>
                  <label style={{display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '8px', color: '#374151', textTransform: 'uppercase', letterSpacing: '0.5px'}}>Email Address</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={{width: '100%', padding: '13px 16px', border: '2px solid #e5e7eb', borderRadius: '10px', fontSize: '14px', boxSizing: 'border-box', transition: 'all 0.3s'}} required />
                </div>
                <div style={{marginBottom: '32px'}}>
                  <label style={{display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '8px', color: '#374151', textTransform: 'uppercase', letterSpacing: '0.5px'}}>Password</label>
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={{width: '100%', padding: '13px 16px', border: '2px solid #e5e7eb', borderRadius: '10px', fontSize: '14px', boxSizing: 'border-box', transition: 'all 0.3s'}} required />
                </div>
                <button type="submit" disabled={loginLoading} style={{width: '100%', padding: '14px 24px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '700', fontSize: '15px', transition: 'all 0.3s', opacity: loginLoading ? 0.7 : 1}}>
                  {loginLoading ? 'Signing in...' : 'Sign In'}
                </button>
              </form>

              <p style={{textAlign: 'center', marginTop: '20px', fontSize: '13px', color: '#6b7280'}}>
                Forgot your password?{' '}
                <button onClick={() => {setShowForgotPassword(true); setError(''); setSuccess('');}} style={{background: 'none', border: 'none', color: '#667eea', cursor: 'pointer', fontWeight: '700', textDecoration: 'underline', fontSize: '13px'}}>
                  Reset here
                </button>
              </p>

            </>
          ) : (
            <>
              <h1 style={{fontSize: '28px', fontWeight: '800', marginBottom: '8px', textAlign: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>Reset Password</h1>
              <p style={{color: '#6b7280', marginBottom: '24px', textAlign: 'center', fontSize: '14px'}}>Enter your email to receive a reset link</p>

              {error && <div style={{background: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)', color: '#fff', padding: '14px 16px', borderRadius: '10px', marginBottom: '20px', fontSize: '14px', fontWeight: '500'}}>{error}</div>}
              {success && <div style={{background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)', color: '#fff', padding: '14px 16px', borderRadius: '10px', marginBottom: '20px', fontSize: '13px', fontWeight: '500', whiteSpace: 'pre-line'}}>{success}</div>}

              <form onSubmit={handleForgotPassword}>
                <div style={{marginBottom: '24px'}}>
                  <label style={{display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '8px', color: '#374151', textTransform: 'uppercase', letterSpacing: '0.5px'}}>Email Address</label>
                  <input type="email" value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} style={{width: '100%', padding: '13px 16px', border: '2px solid #e5e7eb', borderRadius: '10px', fontSize: '14px', boxSizing: 'border-box', transition: 'all 0.3s'}} required />
                </div>
                <button type="submit" style={{width: '100%', padding: '14px 24px', background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '700', fontSize: '15px', marginBottom: '12px'}}>
                  Send Reset Link
                </button>
              </form>

              <button onClick={() => {setShowForgotPassword(false); setForgotEmail(''); setError(''); setSuccess('');}} style={{width: '100%', padding: '12px 24px', background: '#e5e7eb', color: '#374151', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '700', fontSize: '14px', transition: 'all 0.3s'}}>
                Back to Login
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  // MAIN APP
  return (
    <div style={{width: '100%', minHeight: '100vh', background: '#f8f9fa', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"}}>
      {/* Header */}
      <header style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '20px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 10px 30px rgba(102, 126, 234, 0.2)', flexWrap: 'wrap', gap: '16px'}}>
        <div style={{minWidth: '0'}}>
          <h1 style={{fontSize: 'clamp(24px, 5vw, 28px)', fontWeight: '800', color: '#fff', margin: 0}}>Employee Portal</h1>
          <p style={{fontSize: '13px', color: 'rgba(255,255,255,0.9)', marginTop: '4px', margin: 0}}>Welcome, {user?.name} • {user?.role}</p>
        </div>
        <button onClick={handleLogout} style={{padding: '12px 24px', background: 'rgba(255,255,255,0.2)', color: '#fff', border: '2px solid rgba(255,255,255,0.4)', borderRadius: '10px', cursor: 'pointer', fontWeight: '700', fontSize: '14px', transition: 'all 0.3s', whiteSpace: 'nowrap'}}>Logout</button>
      </header>

      {/* Navigation */}
      <nav style={{background: '#fff', borderBottom: '2px solid #f0f0f0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', padding: '16px 20px', display: 'flex', gap: '8px', flexWrap: 'wrap', overflowX: 'auto', scrollBehavior: 'smooth'}}>
        {visibleTabs.map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{padding: '12px 16px', border: 'none', borderBottom: activeTab === tab ? '4px solid #667eea' : '4px solid transparent', background: 'transparent', color: activeTab === tab ? '#667eea' : '#6b7280', cursor: 'pointer', fontSize: '13px', fontWeight: activeTab === tab ? '700' : '600', textTransform: 'capitalize', transition: 'all 0.3s', whiteSpace: 'nowrap'}}>
            {tab === 'money-management' ? 'Money Management' : tab}
          </button>
        ))}
      </nav>

      {/* Main Content */}
      <main style={{maxWidth: '1400px', margin: '0 auto', padding: '40px 20px', boxSizing: 'border-box'}}>
        {success && <div style={{background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)', color: '#fff', padding: '16px 20px', borderRadius: '12px', marginBottom: '20px', fontSize: '14px', fontWeight: '600', boxShadow: '0 4px 12px rgba(79, 70, 229, 0.2)', whiteSpace: 'pre-line'}}>{success}</div>}
        {error && <div style={{background: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)', color: '#fff', padding: '16px 20px', borderRadius: '12px', marginBottom: '20px', fontSize: '14px', fontWeight: '600', boxShadow: '0 4px 12px rgba(75, 85, 99, 0.2)'}}>{error}</div>}

        {/* DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px'}}>
              <h2 style={{fontSize: 'clamp(28px, 5vw, 36px)', fontWeight: '800', margin: 0, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>Dashboard Overview</h2>
              <div style={{display: 'flex', gap: '12px'}}>
                <button 
                  onClick={() => setDashboardFilter('today')}
                  style={{
                    padding: '10px 20px', 
                    background: dashboardFilter === 'today' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#fff', 
                    border: dashboardFilter === 'today' ? 'none' : '2px solid #e5e7eb', 
                    borderRadius: '10px', 
                    cursor: 'pointer', 
                    fontWeight: '600', 
                    fontSize: '14px', 
                    color: dashboardFilter === 'today' ? '#fff' : '#6b7280', 
                    boxShadow: dashboardFilter === 'today' ? '0 4px 12px rgba(102, 126, 234, 0.3)' : 'none',
                    transition: 'all 0.3s'
                  }}
                >
                  Today
                </button>
                <button 
                  onClick={() => setDashboardFilter('month')}
                  style={{
                    padding: '10px 20px', 
                    background: dashboardFilter === 'month' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#fff', 
                    border: dashboardFilter === 'month' ? 'none' : '2px solid #e5e7eb', 
                    borderRadius: '10px', 
                    cursor: 'pointer', 
                    fontWeight: '600', 
                    fontSize: '14px', 
                    color: dashboardFilter === 'month' ? '#fff' : '#6b7280', 
                    boxShadow: dashboardFilter === 'month' ? '0 4px 12px rgba(102, 126, 234, 0.3)' : 'none',
                    transition: 'all 0.3s'
                  }}
                >
                  This Month
                </button>
              </div>
            </div>

            {/* Modern Gradient Cards with Progress Bars */}
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '32px'}}>
              {/* Card 1 - Purple/Violet Gradient */}
              <div style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '32px', borderRadius: '20px', boxShadow: '0 20px 40px rgba(102, 126, 234, 0.3)', position: 'relative', overflow: 'hidden', transition: 'transform 0.3s', cursor: 'pointer'}} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-8px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                <div style={{position: 'absolute', top: '-50px', right: '-50px', width: '150px', height: '150px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%'}}></div>
                <p style={{fontSize: '14px', color: 'rgba(255,255,255,0.9)', marginBottom: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px', position: 'relative', zIndex: 1}}>Total Employees</p>
                <p style={{fontSize: '48px', fontWeight: '900', color: '#fff', marginBottom: '16px', lineHeight: '1', position: 'relative', zIndex: 1}}>{employees.length}</p>
                <div style={{width: '100%', height: '6px', background: 'rgba(255,255,255,0.3)', borderRadius: '10px', overflow: 'hidden', position: 'relative', zIndex: 1}}>
                  <div style={{width: '90%', height: '100%', background: '#fff', borderRadius: '10px', transition: 'width 1s ease'}}></div>
                </div>
                <p style={{fontSize: '12px', color: 'rgba(255,255,255,0.8)', marginTop: '8px', position: 'relative', zIndex: 1}}>90% Active</p>
              </div>

              {/* Card 2 - Cyan/Blue Gradient */}
              <div style={{background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)', padding: '32px', borderRadius: '20px', boxShadow: '0 20px 40px rgba(6, 182, 212, 0.3)', position: 'relative', overflow: 'hidden', transition: 'transform 0.3s', cursor: 'pointer'}} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-8px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                <div style={{position: 'absolute', top: '-50px', right: '-50px', width: '150px', height: '150px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%'}}></div>
                <p style={{fontSize: '14px', color: 'rgba(255,255,255,0.9)', marginBottom: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px', position: 'relative', zIndex: 1}}>Total Reports</p>
                <p style={{fontSize: '48px', fontWeight: '900', color: '#fff', marginBottom: '16px', lineHeight: '1', position: 'relative', zIndex: 1}}>{visibleReports.length}</p>
                <div style={{width: '100%', height: '6px', background: 'rgba(255,255,255,0.3)', borderRadius: '10px', overflow: 'hidden', position: 'relative', zIndex: 1}}>
                  <div style={{width: '30%', height: '100%', background: '#fff', borderRadius: '10px', transition: 'width 1s ease'}}></div>
                </div>
                <p style={{fontSize: '12px', color: 'rgba(255,255,255,0.8)', marginTop: '8px', position: 'relative', zIndex: 1}}>30% This Week</p>
              </div>

              {/* Card 3 - Orange/Red Gradient */}
              <div style={{background: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)', padding: '32px', borderRadius: '20px', boxShadow: '0 20px 40px rgba(245, 158, 11, 0.3)', position: 'relative', overflow: 'hidden', transition: 'transform 0.3s', cursor: 'pointer'}} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-8px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                <div style={{position: 'absolute', top: '-50px', right: '-50px', width: '150px', height: '150px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%'}}></div>
                <p style={{fontSize: '14px', color: 'rgba(255,255,255,0.9)', marginBottom: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px', position: 'relative', zIndex: 1}}>Pending Approvals</p>
                <p style={{fontSize: '48px', fontWeight: '900', color: '#fff', marginBottom: '16px', lineHeight: '1', position: 'relative', zIndex: 1}}>{pendingApprovals.length}</p>
                <div style={{width: '100%', height: '6px', background: 'rgba(255,255,255,0.3)', borderRadius: '10px', overflow: 'hidden', position: 'relative', zIndex: 1}}>
                  <div style={{width: '70%', height: '100%', background: '#fff', borderRadius: '10px', transition: 'width 1s ease'}}></div>
                </div>
                <p style={{fontSize: '12px', color: 'rgba(255,255,255,0.8)', marginTop: '8px', position: 'relative', zIndex: 1}}>70% Urgent</p>
              </div>

              {/* Card 4 - Green Gradient */}
              <div style={{background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', padding: '32px', borderRadius: '20px', boxShadow: '0 20px 40px rgba(16, 185, 129, 0.3)', position: 'relative', overflow: 'hidden', transition: 'transform 0.3s', cursor: 'pointer'}} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-8px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                <div style={{position: 'absolute', top: '-50px', right: '-50px', width: '150px', height: '150px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%'}}></div>
                <p style={{fontSize: '14px', color: 'rgba(255,255,255,0.9)', marginBottom: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px', position: 'relative', zIndex: 1}}>Your Role</p>
                <p style={{fontSize: '36px', fontWeight: '900', color: '#fff', marginBottom: '16px', lineHeight: '1', position: 'relative', zIndex: 1}}>{user ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'N/A'}</p>
                <div style={{width: '100%', height: '6px', background: 'rgba(255,255,255,0.3)', borderRadius: '10px', overflow: 'hidden', position: 'relative', zIndex: 1}}>
                  <div style={{width: '100%', height: '100%', background: '#fff', borderRadius: '10px', transition: 'width 1s ease'}}></div>
                </div>
                <p style={{fontSize: '12px', color: 'rgba(255,255,255,0.8)', marginTop: '8px', position: 'relative', zIndex: 1}}>Full Access</p>
              </div>
            </div>

            {isAdmin && (
              <>
                {/* Revenue Analytics with Circular Progress */}
                <div style={{background: '#fff', padding: '32px', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.08)', marginBottom: '32px'}}>
                  <h3 style={{fontSize: '24px', fontWeight: '800', marginBottom: '24px', color: '#1f2937'}}>Revenue Analytics</h3>
                  <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '32px'}}>
                    {/* Circular Progress 1 - Total Revenue */}
                    <div style={{textAlign: 'center'}}>
                      <div style={{position: 'relative', width: '140px', height: '140px', margin: '0 auto 16px'}}>
                        <svg width="140" height="140" style={{transform: 'rotate(-90deg)'}}>
                          <circle cx="70" cy="70" r="60" fill="none" stroke="#e5e7eb" strokeWidth="12"/>
                          <circle cx="70" cy="70" r="60" fill="none" stroke="url(#gradient1)" strokeWidth="12" strokeDasharray="377" strokeDashoffset="75" strokeLinecap="round" style={{transition: 'stroke-dashoffset 1s ease'}}/>
                          <defs>
                            <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#667eea"/>
                              <stop offset="100%" stopColor="#764ba2"/>
                            </linearGradient>
                          </defs>
                        </svg>
                        <div style={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center'}}>
                          <p style={{fontSize: '28px', fontWeight: '900', color: '#667eea', margin: 0}}>60%</p>
                        </div>
                      </div>
                      <p style={{fontSize: '14px', fontWeight: '700', color: '#1f2937', marginBottom: '4px'}}>Total Revenue</p>
                      <p style={{fontSize: '20px', fontWeight: '900', color: '#667eea'}}>₹{moneyTotals.totalCredit.toLocaleString()}</p>
                    </div>

                    {/* Circular Progress 2 - Total Expense */}
                    <div style={{textAlign: 'center'}}>
                      <div style={{position: 'relative', width: '140px', height: '140px', margin: '0 auto 16px'}}>
                        <svg width="140" height="140" style={{transform: 'rotate(-90deg)'}}>
                          <circle cx="70" cy="70" r="60" fill="none" stroke="#e5e7eb" strokeWidth="12"/>
                          <circle cx="70" cy="70" r="60" fill="none" stroke="url(#gradient2)" strokeWidth="12" strokeDasharray="377" strokeDashoffset="151" strokeLinecap="round" style={{transition: 'stroke-dashoffset 1s ease'}}/>
                          <defs>
                            <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#f59e0b"/>
                              <stop offset="100%" stopColor="#ef4444"/>
                            </linearGradient>
                          </defs>
                        </svg>
                        <div style={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center'}}>
                          <p style={{fontSize: '28px', fontWeight: '900', color: '#f59e0b', margin: 0}}>40%</p>
                        </div>
                      </div>
                      <p style={{fontSize: '14px', fontWeight: '700', color: '#1f2937', marginBottom: '4px'}}>Total Expense</p>
                      <p style={{fontSize: '20px', fontWeight: '900', color: '#f59e0b'}}>₹{expenseTotals.totalExpenses.toLocaleString()}</p>
                    </div>

                    {/* Circular Progress 3 - Net Profit */}
                    <div style={{textAlign: 'center'}}>
                      <div style={{position: 'relative', width: '140px', height: '140px', margin: '0 auto 16px'}}>
                        <svg width="140" height="140" style={{transform: 'rotate(-90deg)'}}>
                          <circle cx="70" cy="70" r="60" fill="none" stroke="#e5e7eb" strokeWidth="12"/>
                          <circle cx="70" cy="70" r="60" fill="none" stroke="url(#gradient3)" strokeWidth="12" strokeDasharray="377" strokeDashoffset="113" strokeLinecap="round" style={{transition: 'stroke-dashoffset 1s ease'}}/>
                          <defs>
                            <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#10b981"/>
                              <stop offset="100%" stopColor="#059669"/>
                            </linearGradient>
                          </defs>
                        </svg>
                        <div style={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center'}}>
                          <p style={{fontSize: '28px', fontWeight: '900', color: '#10b981', margin: 0}}>70%</p>
                        </div>
                      </div>
                      <p style={{fontSize: '14px', fontWeight: '700', color: '#1f2937', marginBottom: '4px'}}>Net Profit</p>
                      <p style={{fontSize: '20px', fontWeight: '900', color: '#10b981'}}>₹{(moneyTotals.totalCredit - expenseTotals.totalExpenses).toLocaleString()}</p>
                    </div>

                    {/* Circular Progress 4 - Today's Revenue */}
                    <div style={{textAlign: 'center'}}>
                      <div style={{position: 'relative', width: '140px', height: '140px', margin: '0 auto 16px'}}>
                        <svg width="140" height="140" style={{transform: 'rotate(-90deg)'}}>
                          <circle cx="70" cy="70" r="60" fill="none" stroke="#e5e7eb" strokeWidth="12"/>
                          <circle cx="70" cy="70" r="60" fill="none" stroke="url(#gradient4)" strokeWidth="12" strokeDasharray="377" strokeDashoffset="189" strokeLinecap="round" style={{transition: 'stroke-dashoffset 1s ease'}}/>
                          <defs>
                            <linearGradient id="gradient4" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#06b6d4"/>
                              <stop offset="100%" stopColor="#3b82f6"/>
                            </linearGradient>
                          </defs>
                        </svg>
                        <div style={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center'}}>
                          <p style={{fontSize: '28px', fontWeight: '900', color: '#06b6d4', margin: 0}}>50%</p>
                        </div>
                      </div>
                      <p style={{fontSize: '14px', fontWeight: '700', color: '#1f2937', marginBottom: '4px'}}>Today's Revenue</p>
                      <p style={{fontSize: '20px', fontWeight: '900', color: '#06b6d4'}}>₹{todayMoneyTotals.credit.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* ATTENDANCE */}
        {activeTab === 'attendance' && (
          <div>
            <h2 style={{fontSize: '28px', fontWeight: '800', marginBottom: '32px'}}>Attendance Management</h2>
            
            {/* Employee Mark Attendance */}
            {user?.role === 'employee' && (
              <div style={{background: '#fff', padding: '32px', borderRadius: '16px', marginBottom: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.08)'}}>
                <h3 style={{fontSize: '20px', fontWeight: '800', marginBottom: '20px'}}>Mark Your Attendance</h3>
                <p style={{color: '#6b7280', marginBottom: '20px', fontSize: '14px'}}>Today: {new Date().toLocaleDateString('en-US', {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'})}</p>
                <p style={{color: '#4f46e5', marginBottom: '20px', fontSize: '13px', fontWeight: '600'}}>
                  Office location signal: {OFFICE_LOCATION_LABEL} ({OFFICE_LOCATION.lat}, {OFFICE_LOCATION.lng})
                </p>
                {(() => {
                  const todayRecord = attendance.find(a => a.userId === user.id && a.date === todayDate);
                  if (!todayRecord) return null;
                  const label = todayRecord.status === 'pending' ? 'Pending approval' : `Marked ${todayRecord.status}`;
                  return (
                    <div style={{marginBottom: '16px', padding: '12px 16px', background: '#f0f9ff', borderRadius: '10px', border: '2px solid #bfdbfe', color: '#1e40af', fontSize: '13px', fontWeight: '600'}}>
                      {label} for today.
                    </div>
                  );
                })()}
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', maxWidth: '500px'}}>
                  <button onClick={() => handleMarkAttendance('present')} style={{padding: '18px 24px', background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)', color: '#fff', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: '700', fontSize: '16px', transition: 'all 0.3s', boxShadow: '0 4px 12px rgba(79, 70, 229, 0.2)', opacity: attendance.some(a => a.userId === user.id && a.date === todayDate) ? 0.6 : 1}} disabled={attendance.some(a => a.userId === user.id && a.date === todayDate)}>Mark Present</button>
                  <button onClick={() => handleMarkAttendance('absent')} style={{padding: '18px 24px', background: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)', color: '#fff', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: '700', fontSize: '16px', transition: 'all 0.3s', boxShadow: '0 4px 12px rgba(75, 85, 99, 0.2)', opacity: attendance.some(a => a.userId === user.id && a.date === todayDate) ? 0.6 : 1}} disabled={attendance.some(a => a.userId === user.id && a.date === todayDate)}>Mark Absent</button>
                </div>
              </div>
            )}

            {/* Admin Approval Panel */}
            {isAdmin && (
              <div style={{background: '#fff', padding: '32px', borderRadius: '16px', marginBottom: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.08)'}}>
                <h3 style={{fontSize: '20px', fontWeight: '800', marginBottom: '20px'}}>Pending Approvals ({pendingApprovals.length})</h3>
                {pendingApprovals.length === 0 ? (
                    <p style={{color: '#6b7280', fontSize: '14px'}}>All attendance records approved.</p>
                ) : (
                  <div style={{overflowX: 'auto'}}>
                    <table style={{width: '100%', borderCollapse: 'collapse'}}>
                      <thead>
                        <tr style={{background: '#f9fafb', borderBottom: '2px solid #e5e7eb'}}>
                          <th style={{textAlign: 'left', padding: '16px', fontWeight: '700', fontSize: '13px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px'}}>Date</th>
                          <th style={{textAlign: 'left', padding: '16px', fontWeight: '700', fontSize: '13px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px'}}>Employee</th>
                          <th style={{textAlign: 'left', padding: '16px', fontWeight: '700', fontSize: '13px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px'}}>Status</th>
                          <th style={{textAlign: 'left', padding: '16px', fontWeight: '700', fontSize: '13px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px'}}>Location</th>
                          <th style={{textAlign: 'left', padding: '16px', fontWeight: '700', fontSize: '13px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px'}}>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pendingApprovals.map((record) => (
                          <tr key={record.id} style={{borderBottom: '1px solid #e5e7eb', transition: 'all 0.3s'}}>
                            <td style={{padding: '16px', fontSize: '14px'}}>{record.date}</td>
                            <td style={{padding: '16px', fontSize: '14px'}}>{record.employeeName || 'Unknown'}</td>
                            <td style={{padding: '16px'}}>
                              <span style={{background: '#eef2ff', color: '#4338ca', padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: '700'}}>Pending</span>
                            </td>
                            <td style={{padding: '16px'}}>
                              {(() => {
                                const label = record.locationStatus === 'verified'
                                  ? 'In range'
                                  : record.locationStatus === 'out-of-range'
                                    ? 'Out of range'
                                    : 'GPS unavailable';
                                const color = record.locationStatus === 'verified' ? '#0f766e' : '#6b7280';
                                const bg = record.locationStatus === 'verified' ? '#ccfbf1' : '#f3f4f6';
                                return (
                                  <span style={{background: bg, color, padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700'}}>
                                    {label}
                                  </span>
                                );
                              })()}
                            </td>
                            <td style={{padding: '16px', display: 'flex', gap: '8px'}}>
                              <button onClick={() => handleApproveAttendance(record.id, true)} style={{padding: '8px 16px', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '12px', transition: 'all 0.3s'}}>Approve</button>
                              <button onClick={() => handleApproveAttendance(record.id, false)} style={{padding: '8px 16px', background: '#6b7280', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '12px', transition: 'all 0.3s'}}>Reject</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Attendance History */}
            <div style={{background: '#fff', padding: '32px', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.08)'}}>
              <h3 style={{fontSize: '20px', fontWeight: '800', marginBottom: '20px'}}>Attendance History</h3>
              {visibleAttendance.length === 0 ? (
                <p style={{color: '#6b7280'}}>No attendance records yet</p>
              ) : (
                <div style={{display: 'grid', gap: '12px'}}>
                  {visibleAttendance.slice(0, 15).map((record) => (
                    <div key={record.id} style={{padding: '16px', background: '#f9fafb', borderRadius: '12px', border: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                      <div>
                        <p style={{fontWeight: '700', color: '#1f2937', fontSize: '14px'}}>{record.date}</p>
                        <p style={{fontSize: '12px', color: '#6b7280'}}>{record.employeeName || user?.name}</p>
                        {record.locationStatus && (
                          <p style={{fontSize: '11px', color: '#6b7280'}}>
                            {record.locationStatus === 'verified'
                              ? 'Location verified'
                              : record.locationStatus === 'out-of-range'
                                ? 'Location out of range'
                                : 'GPS unavailable'}
                          </p>
                        )}
                      </div>
                      <span style={{background: record.status === 'present' ? '#eef2ff' : record.status === 'absent' ? '#f3f4f6' : '#e0e7ff', color: record.status === 'present' ? '#4338ca' : record.status === 'absent' ? '#374151' : '#4f46e5', padding: '8px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', textTransform: 'capitalize'}}>
                        {record.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* EMPLOYEES */}
        {activeTab === 'employees' && isAdmin && (
          <div>
            <h2 style={{fontSize: '28px', fontWeight: '800', marginBottom: '32px'}}>Manage Employees</h2>
            
            {/* Add/Edit Employee Form */}
            <div style={{background: '#fff', padding: '32px', borderRadius: '16px', marginBottom: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.08)'}}>
              <h3 style={{fontSize: '20px', fontWeight: '800', marginBottom: '20px'}}>{editingEmployee ? 'Edit Employee' : 'Add New Employee'}</h3>
              <form onSubmit={editingEmployee ? handleUpdateEmployee : handleAddEmployee}>
                <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '20px'}}>
                  <input type="text" placeholder="Full Name *" value={newEmployee.name} onChange={(e) => setNewEmployee({...newEmployee, name: e.target.value})} style={{padding: '12px 14px', border: '2px solid #e5e7eb', borderRadius: '10px', fontSize: '14px', transition: 'all 0.3s', boxSizing: 'border-box'}} required />
                  <input type="email" placeholder="Email *" value={newEmployee.email} onChange={(e) => setNewEmployee({...newEmployee, email: e.target.value})} style={{padding: '12px 14px', border: '2px solid #e5e7eb', borderRadius: '10px', fontSize: '14px', transition: 'all 0.3s', boxSizing: 'border-box'}} required />
                  <input type="tel" placeholder="Phone *" value={newEmployee.phone} onChange={(e) => setNewEmployee({...newEmployee, phone: e.target.value})} style={{padding: '12px 14px', border: '2px solid #e5e7eb', borderRadius: '10px', fontSize: '14px', transition: 'all 0.3s', boxSizing: 'border-box'}} required />
                  {!editingEmployee && <input type="password" placeholder="Password *" value={newEmployee.password} onChange={(e) => setNewEmployee({...newEmployee, password: e.target.value})} style={{padding: '12px 14px', border: '2px solid #667eea', borderRadius: '10px', fontSize: '14px', transition: 'all 0.3s', boxSizing: 'border-box', backgroundColor: '#f0f4ff'}} required pattern=".{6,}" title="Password must be at least 6 characters" />}
                  <select value={newEmployee.role} onChange={(e) => setNewEmployee({...newEmployee, role: e.target.value as 'employee' | 'ai-developer' | 'telecaller' | 'hr' | 'editor'})} style={{padding: '12px 14px', border: '2px solid #e5e7eb', borderRadius: '10px', fontSize: '14px', transition: 'all 0.3s', boxSizing: 'border-box', background: '#fff'}}>
                    <option value="employee">Employee</option>
                    <option value="ai-developer">AI Developer</option>
                    <option value="telecaller">Telecaller</option>
                    <option value="hr">HR</option>
                    <option value="editor">Editor</option>
                  </select>
                  <input type="text" placeholder="Position" value={newEmployee.position} onChange={(e) => setNewEmployee({...newEmployee, position: e.target.value})} style={{padding: '12px 14px', border: '2px solid #e5e7eb', borderRadius: '10px', fontSize: '14px', transition: 'all 0.3s', boxSizing: 'border-box'}} />
                  <input type="text" placeholder="Department" value={newEmployee.department} onChange={(e) => setNewEmployee({...newEmployee, department: e.target.value})} style={{padding: '12px 14px', border: '2px solid #e5e7eb', borderRadius: '10px', fontSize: '14px', transition: 'all 0.3s', boxSizing: 'border-box'}} />
                  <input type="number" placeholder="Monthly Salary (₹)" value={newEmployee.monthlySalary} onChange={(e) => setNewEmployee({...newEmployee, monthlySalary: e.target.value})} style={{padding: '12px 14px', border: '2px solid #e5e7eb', borderRadius: '10px', fontSize: '14px', transition: 'all 0.3s', boxSizing: 'border-box'}} />
                </div>
                <div style={{display: 'flex', gap: '12px'}}>
                  <button type="submit" style={{padding: '12px 28px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '700', fontSize: '14px', transition: 'all 0.3s'}}>
                    {editingEmployee ? 'Update Employee' : 'Add Employee'}
                  </button>
                  {editingEmployee && <button type="button" onClick={() => {setEditingEmployee(null); setNewEmployee({ name: '', email: '', phone: '', position: '', department: '', monthlySalary: '', password: '', role: 'employee' });}} style={{padding: '12px 28px', background: '#e5e7eb', color: '#374151', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '700', fontSize: '14px'}}>Cancel</button>}
                </div>
              </form>
            </div>

            {/* Employees List */}
            <div style={{background: '#fff', padding: '32px', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.08)'}}>
              <h3 style={{fontSize: '20px', fontWeight: '800', marginBottom: '20px'}}>All Employees ({employees.length})</h3>
              {employees.length === 0 ? <p style={{color: '#6b7280'}}>No employees found</p> : (
                <div style={{overflowX: 'auto'}}>
                  <table style={{width: '100%', borderCollapse: 'collapse'}}>
                    <thead>
                      <tr style={{background: '#f9fafb', borderBottom: '2px solid #e5e7eb'}}>
                        <th style={{textAlign: 'left', padding: '16px', fontWeight: '700', fontSize: '13px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px'}}>Name</th>
                        <th style={{textAlign: 'left', padding: '16px', fontWeight: '700', fontSize: '13px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px'}}>Email</th>
                        <th style={{textAlign: 'left', padding: '16px', fontWeight: '700', fontSize: '13px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px'}}>Phone</th>
                        <th style={{textAlign: 'left', padding: '16px', fontWeight: '700', fontSize: '13px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px'}}>Role</th>
                        <th style={{textAlign: 'left', padding: '16px', fontWeight: '700', fontSize: '13px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px'}}>Position</th>
                        <th style={{textAlign: 'left', padding: '16px', fontWeight: '700', fontSize: '13px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px'}}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {employees.map((emp) => {
                        const empRole = (emp as any).role || 'employee';
                        const roleColors = {
                          'employee': { bg: '#f3f4f6', text: '#4b5563', label: 'Employee' },
                          'ai-developer': { bg: '#dbeafe', text: '#1e40af', label: 'AI Developer' },
                          'telecaller': { bg: '#fef3c7', text: '#92400e', label: 'Telecaller' },
                          'hr': { bg: '#dcfce7', text: '#166534', label: 'HR' },
                          'editor': { bg: '#fce7f3', text: '#9f1239', label: 'Editor' }
                        };
                        const roleStyle = roleColors[empRole as keyof typeof roleColors] || roleColors.employee;
                        
                        return (
                          <tr key={emp.id} style={{borderBottom: '1px solid #e5e7eb'}}>
                            <td style={{padding: '16px', fontSize: '14px', fontWeight: '600'}}>{emp.name}</td>
                            <td style={{padding: '16px', fontSize: '14px'}}>{emp.email}</td>
                            <td style={{padding: '16px', fontSize: '14px'}}>{emp.phone}</td>
                            <td style={{padding: '16px', fontSize: '14px'}}>
                              <span style={{
                                padding: '4px 12px', 
                                borderRadius: '999px', 
                                fontSize: '12px', 
                                fontWeight: '700',
                                background: roleStyle.bg,
                                color: roleStyle.text
                              }}>
                                {roleStyle.label}
                              </span>
                            </td>
                            <td style={{padding: '16px', fontSize: '14px'}}>{emp.position || '-'}</td>
                            <td style={{padding: '16px'}}>
                              <div style={{display: 'flex', gap: '8px'}}>
                                <button onClick={() => handleEditEmployee(emp)} style={{padding: '8px 12px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '12px'}}>Edit</button>
                                <button onClick={() => handleDeleteEmployee(emp.id)} style={{padding: '8px 12px', background: '#6b7280', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '12px'}}>Delete</button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* REPORTS */}
        {activeTab === 'reports' && (
          <div>
            <h2 style={{fontSize: '28px', fontWeight: '800', marginBottom: '32px'}}>Daily Reports</h2>
            
            {/* Employee Submit Report */}
            {(user?.role === 'employee' || user?.role === 'ai-developer' || user?.role === 'telecaller' || user?.role === 'editor') && (
              <div style={{background: '#fff', padding: '32px', borderRadius: '16px', marginBottom: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.08)'}}>
                <h3 style={{fontSize: '20px', fontWeight: '800', marginBottom: '20px'}}>Submit Daily Report</h3>
                <form onSubmit={handleAddReport}>
                  <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px', marginBottom: '20px'}}>
                    <div>
                      <label style={{fontSize: '12px', color: '#6b7280', fontWeight: '700', marginBottom: '8px', display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px'}}>Calls</label>
                      <input type="number" min="0" value={reportForm.calls} onChange={(e) => setReportForm({...reportForm, calls: e.target.value})} style={{width: '100%', padding: '12px 14px', border: '2px solid #e5e7eb', borderRadius: '10px', fontSize: '14px', boxSizing: 'border-box'}} />
                    </div>
                    <div>
                      <label style={{fontSize: '12px', color: '#6b7280', fontWeight: '700', marginBottom: '8px', display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px'}}>Leads</label>
                      <input type="number" min="0" value={reportForm.leads} onChange={(e) => setReportForm({...reportForm, leads: e.target.value})} style={{width: '100%', padding: '12px 14px', border: '2px solid #e5e7eb', borderRadius: '10px', fontSize: '14px', boxSizing: 'border-box'}} />
                    </div>
                    <div>
                      <label style={{fontSize: '12px', color: '#6b7280', fontWeight: '700', marginBottom: '8px', display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px'}}>Conversions</label>
                      <input type="number" min="0" value={reportForm.conversions} onChange={(e) => setReportForm({...reportForm, conversions: e.target.value})} style={{width: '100%', padding: '12px 14px', border: '2px solid #e5e7eb', borderRadius: '10px', fontSize: '14px', boxSizing: 'border-box'}} />
                    </div>
                    <div>
                      <label style={{fontSize: '12px', color: '#6b7280', fontWeight: '700', marginBottom: '8px', display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px'}}>Revenue (₹)</label>
                      <input type="number" min="0" step="0.01" value={reportForm.revenue} onChange={(e) => setReportForm({...reportForm, revenue: e.target.value})} style={{width: '100%', padding: '12px 14px', border: '2px solid #e5e7eb', borderRadius: '10px', fontSize: '14px', boxSizing: 'border-box'}} />
                    </div>
                  </div>
                  <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '20px'}}>
                    <div>
                      <label style={{fontSize: '12px', color: '#6b7280', fontWeight: '700', marginBottom: '8px', display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px'}}>Client Name</label>
                      <input type="text" value={reportForm.clientName} onChange={(e) => setReportForm({...reportForm, clientName: e.target.value})} style={{width: '100%', padding: '12px 14px', border: '2px solid #e5e7eb', borderRadius: '10px', fontSize: '14px', boxSizing: 'border-box'}} />
                    </div>
                    <div>
                      <label style={{fontSize: '12px', color: '#6b7280', fontWeight: '700', marginBottom: '8px', display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px'}}>Company</label>
                      <input type="text" value={reportForm.companyName} onChange={(e) => setReportForm({...reportForm, companyName: e.target.value})} style={{width: '100%', padding: '12px 14px', border: '2px solid #e5e7eb', borderRadius: '10px', fontSize: '14px', boxSizing: 'border-box'}} />
                    </div>
                    <div>
                      <label style={{fontSize: '12px', color: '#6b7280', fontWeight: '700', marginBottom: '8px', display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px'}}>Phone Numbers</label>
                      <input type="text" placeholder="Comma separated" value={reportForm.phones} onChange={(e) => setReportForm({...reportForm, phones: e.target.value})} style={{width: '100%', padding: '12px 14px', border: '2px solid #e5e7eb', borderRadius: '10px', fontSize: '14px', boxSizing: 'border-box'}} />
                    </div>
                    <div>
                      <label style={{fontSize: '12px', color: '#6b7280', fontWeight: '700', marginBottom: '8px', display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px'}}>Email</label>
                      <input type="email" value={reportForm.clientEmail} onChange={(e) => setReportForm({...reportForm, clientEmail: e.target.value})} style={{width: '100%', padding: '12px 14px', border: '2px solid #e5e7eb', borderRadius: '10px', fontSize: '14px', boxSizing: 'border-box'}} />
                    </div>
                    <div style={{gridColumn: '1 / -1'}}>
                      <label style={{fontSize: '12px', color: '#6b7280', fontWeight: '700', marginBottom: '8px', display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px'}}>Address</label>
                      <input type="text" value={reportForm.clientAddress} onChange={(e) => setReportForm({...reportForm, clientAddress: e.target.value})} style={{width: '100%', padding: '12px 14px', border: '2px solid #e5e7eb', borderRadius: '10px', fontSize: '14px', boxSizing: 'border-box'}} />
                    </div>
                    <div style={{gridColumn: '1 / -1'}}>
                      <label style={{fontSize: '12px', color: '#6b7280', fontWeight: '700', marginBottom: '8px', display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px'}}>Notes</label>
                      <textarea value={reportForm.clientNotes} onChange={(e) => setReportForm({...reportForm, clientNotes: e.target.value})} rows={3} style={{width: '100%', padding: '12px 14px', border: '2px solid #e5e7eb', borderRadius: '10px', fontSize: '14px', boxSizing: 'border-box', resize: 'vertical'}} />
                    </div>
                    <div style={{gridColumn: '1 / -1'}}>
                      <label style={{fontSize: '12px', color: '#6b7280', fontWeight: '700', marginBottom: '8px', display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px'}}>Client Files (Photos/Documents)</label>
                      <input key={reportFileInputKey} type="file" multiple accept="image/*,application/pdf,.doc,.docx" onChange={handleReportFilesChange} style={{width: '100%', padding: '10px', border: '2px solid #e5e7eb', borderRadius: '10px', fontSize: '13px', boxSizing: 'border-box'}} />
                      {reportFiles.length > 0 && (
                        <p style={{fontSize: '12px', color: '#6b7280', marginTop: '8px'}}>{reportFiles.length} file(s) selected</p>
                      )}
                    </div>
                  </div>
                  <button type="submit" style={{padding: '12px 28px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '700', fontSize: '14px'}}>Submit Report</button>
                </form>
              </div>
            )}

            {/* Admin Edit Report */}
            {editingReport && isAdmin && (
              <div style={{background: '#fff', padding: '32px', borderRadius: '16px', marginBottom: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.08)', border: '2px solid #3b82f6'}}>
                <h3 style={{fontSize: '20px', fontWeight: '800', marginBottom: '20px'}}>Edit Report</h3>
                <form onSubmit={handleUpdateReport}>
                  <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px', marginBottom: '20px'}}>
                    <div>
                      <label style={{fontSize: '12px', color: '#6b7280', fontWeight: '700', marginBottom: '8px', display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px'}}>Calls</label>
                      <input type="number" min="0" value={editingReport.calls || 0} onChange={(e) => setEditingReport({...editingReport, calls: parseInt(e.target.value) || 0})} style={{width: '100%', padding: '12px 14px', border: '2px solid #3b82f6', borderRadius: '10px', fontSize: '14px', boxSizing: 'border-box'}} />
                    </div>
                    <div>
                      <label style={{fontSize: '12px', color: '#6b7280', fontWeight: '700', marginBottom: '8px', display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px'}}>Leads</label>
                      <input type="number" min="0" value={editingReport.leads || 0} onChange={(e) => setEditingReport({...editingReport, leads: parseInt(e.target.value) || 0})} style={{width: '100%', padding: '12px 14px', border: '2px solid #3b82f6', borderRadius: '10px', fontSize: '14px', boxSizing: 'border-box'}} />
                    </div>
                    <div>
                      <label style={{fontSize: '12px', color: '#6b7280', fontWeight: '700', marginBottom: '8px', display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px'}}>Conversions</label>
                      <input type="number" min="0" value={editingReport.conversions || 0} onChange={(e) => setEditingReport({...editingReport, conversions: parseInt(e.target.value) || 0})} style={{width: '100%', padding: '12px 14px', border: '2px solid #3b82f6', borderRadius: '10px', fontSize: '14px', boxSizing: 'border-box'}} />
                    </div>
                    <div>
                      <label style={{fontSize: '12px', color: '#6b7280', fontWeight: '700', marginBottom: '8px', display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px'}}>Revenue (₹)</label>
                      <input type="number" min="0" step="0.01" value={editingReport.revenue || 0} onChange={(e) => setEditingReport({...editingReport, revenue: parseFloat(e.target.value) || 0})} style={{width: '100%', padding: '12px 14px', border: '2px solid #3b82f6', borderRadius: '10px', fontSize: '14px', boxSizing: 'border-box'}} />
                    </div>
                  </div>
                  <div style={{display: 'flex', gap: '12px'}}>
                    <button type="submit" style={{padding: '12px 28px', background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '700', fontSize: '14px'}}>Save Changes</button>
                    <button type="button" onClick={() => setEditingReport(null)} style={{padding: '12px 28px', background: '#e5e7eb', color: '#374151', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '700', fontSize: '14px'}}>Cancel</button>
                  </div>
                </form>
              </div>
            )}

            {/* Reports Display */}
            <div style={{background: '#fff', padding: '32px', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.08)'}}>
              {(() => {
                const totals = visibleReports.reduce((acc, report) => ({
                  calls: acc.calls + (report.calls || 0),
                  leads: acc.leads + (report.leads || 0),
                  conversions: acc.conversions + (report.conversions || 0),
                  revenue: acc.revenue + (report.revenue || 0),
                }), { calls: 0, leads: 0, conversions: 0, revenue: 0 });

                return (
                  <>
                    <h3 style={{fontSize: '20px', fontWeight: '800', marginBottom: '20px'}}>
                      {isAdmin ? `All Reports (${visibleReports.length})` : `Your Reports (${visibleReports.length})`}
                    </h3>
                    {visibleReports.length === 0 ? (
                      <p style={{color: '#6b7280'}}>No reports yet</p>
                    ) : (
                      <div style={{overflowX: 'auto'}}>
                        <table style={{width: '100%', borderCollapse: 'collapse'}}>
                          <thead>
                            <tr style={{background: '#f9fafb', borderBottom: '2px solid #e5e7eb'}}>
                              <th style={{textAlign: 'left', padding: '14px', fontWeight: '700', fontSize: '12px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px'}}>Date</th>
                              {isAdmin && (
                                <th style={{textAlign: 'left', padding: '14px', fontWeight: '700', fontSize: '12px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px'}}>Employee</th>
                              )}
                              <th style={{textAlign: 'left', padding: '14px', fontWeight: '700', fontSize: '12px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px'}}>Calls</th>
                              <th style={{textAlign: 'left', padding: '14px', fontWeight: '700', fontSize: '12px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px'}}>Leads</th>
                              <th style={{textAlign: 'left', padding: '14px', fontWeight: '700', fontSize: '12px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px'}}>Conversions</th>
                              <th style={{textAlign: 'left', padding: '14px', fontWeight: '700', fontSize: '12px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px'}}>Revenue (₹)</th>
                              <th style={{textAlign: 'left', padding: '14px', fontWeight: '700', fontSize: '12px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px'}}>Client Details</th>
                              {isAdmin && (
                                <th style={{textAlign: 'left', padding: '14px', fontWeight: '700', fontSize: '12px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px'}}>Actions</th>
                              )}
                            </tr>
                          </thead>
                          <tbody>
                            {visibleReports.map((report, idx) => (
                              <tr key={report.id || idx} style={{borderBottom: '1px solid #e5e7eb'}}>
                                <td style={{padding: '14px', fontSize: '13px', color: '#374151'}}>{report.date || '-'}</td>
                                {isAdmin && (
                                  <td style={{padding: '14px', fontSize: '13px', color: '#374151'}}>{report.employeeName || 'Employee'}</td>
                                )}
                                <td style={{padding: '14px', fontSize: '13px', fontWeight: '700', color: '#4f46e5'}}>{report.calls || 0}</td>
                                <td style={{padding: '14px', fontSize: '13px', fontWeight: '700', color: '#4f46e5'}}>{report.leads || 0}</td>
                                <td style={{padding: '14px', fontSize: '13px', fontWeight: '700', color: '#4f46e5'}}>{report.conversions || 0}</td>
                                <td style={{padding: '14px', fontSize: '13px', fontWeight: '700', color: '#4338ca'}}>₹{(report.revenue || 0).toLocaleString()}</td>
                                <td style={{padding: '14px', fontSize: '12px', color: '#374151', maxWidth: '280px'}}>
                                  <div style={{display: 'grid', gap: '4px'}}>
                                    <span style={{fontWeight: '700'}}>{report.clientName || 'Client'}</span>
                                    {report.companyName && <span>{report.companyName}</span>}
                                    {report.phones && <span>{report.phones}</span>}
                                    {report.clientEmail && <span>{report.clientEmail}</span>}
                                    {report.clientAddress && <span>{report.clientAddress}</span>}
                                    {report.clientNotes && <span style={{color: '#6b7280'}}>{report.clientNotes}</span>}
                                    {Array.isArray(report.clientFiles) && report.clientFiles.length > 0 && (
                                      <span style={{color: '#6b7280'}}>{report.clientFiles.length} file(s) attached</span>
                                    )}
                                  </div>
                                </td>
                                {isAdmin && (
                                  <td style={{padding: '14px'}}>
                                    <div style={{display: 'flex', gap: '8px'}}>
                                      <button onClick={() => handleEditReport(report, idx)} style={{padding: '6px 10px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '12px'}}>Edit</button>
                                      <button onClick={() => handleDeleteReport(idx)} style={{padding: '6px 10px', background: '#6b7280', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '12px'}}>Delete</button>
                                    </div>
                                  </td>
                                )}
                              </tr>
                            ))}
                            <tr style={{background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.08) 0%, rgba(118, 75, 162, 0.08) 100%)'}}>
                              <td style={{padding: '14px', fontSize: '13px', fontWeight: '800', color: '#4338ca'}}>Totals</td>
                              {isAdmin && <td style={{padding: '14px'}} />}
                              <td style={{padding: '14px', fontSize: '13px', fontWeight: '800', color: '#4338ca'}}>{totals.calls}</td>
                              <td style={{padding: '14px', fontSize: '13px', fontWeight: '800', color: '#4338ca'}}>{totals.leads}</td>
                              <td style={{padding: '14px', fontSize: '13px', fontWeight: '800', color: '#4338ca'}}>{totals.conversions}</td>
                              <td style={{padding: '14px', fontSize: '13px', fontWeight: '800', color: '#4338ca'}}>₹{totals.revenue.toLocaleString()}</td>
                              <td style={{padding: '14px'}} />
                              {isAdmin && <td style={{padding: '14px'}} />}
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          </div>
        )}

        {/* SALARY */}
        {activeTab === 'salary' && (
          <div>
            <h2 style={{fontSize: '28px', fontWeight: '800', marginBottom: '32px'}}>Salary Management</h2>
            
            {/* ADMIN VIEW - Employee Salary Information */}
            {isAdmin && (
              <div style={{background: '#fff', padding: '32px', borderRadius: '16px', marginBottom: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.08)'}}>
                <h3 style={{fontSize: '20px', fontWeight: '800', marginBottom: '20px'}}>View Employee Salary</h3>
                <div style={{marginBottom: '20px'}}>
                  <label style={{fontSize: '12px', color: '#6b7280', fontWeight: '700', marginBottom: '8px', display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px'}}>Select Employee</label>
                  <select value={selectedEmployeeForSalary} onChange={(e) => setSelectedEmployeeForSalary(e.target.value)} style={{width: '100%', maxWidth: '400px', padding: '12px 14px', border: '2px solid #e5e7eb', borderRadius: '10px', fontSize: '14px', transition: 'all 0.3s'}}>
                    <option value="">-- Choose an employee --</option>
                    {employees.map((emp) => (
                      <option key={emp.id} value={emp.id}>{emp.name} - {emp.position || 'Employee'}</option>
                    ))}
                  </select>
                </div>

                {selectedEmployeeForSalary && (() => {
                  const emp = employees.find(e => e.id === selectedEmployeeForSalary);
                  const empAttendance = attendance.filter(a => a.userId === selectedEmployeeForSalary && a.status !== 'pending');
                  const daysPresent = empAttendance.filter(a => a.status === 'present').length;
                  const daysAbsent = empAttendance.filter(a => a.status === 'absent').length;
                  const salary = parseInt((emp as any)?.monthlySalary || '0');
                  const finalSalary = salary > 0 ? calculateFinalSalary(salary, daysPresent, daysAbsent) : 0;
                  
                  return (
                    <div>
                      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '28px'}}>
                        <div style={{padding: '24px', background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)', borderRadius: '12px', border: '2px solid #667eea', borderLeft: '6px solid #667eea'}}>
                          <p style={{fontSize: '12px', color: '#6b7280', fontWeight: '700', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px'}}>Employee</p>
                          <p style={{fontSize: '18px', fontWeight: '800', color: '#667eea'}}>{emp?.name}</p>
                        </div>
                        <div style={{padding: '24px', background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)', borderRadius: '12px', border: '2px solid #667eea', borderLeft: '6px solid #667eea'}}>
                          <p style={{fontSize: '12px', color: '#6b7280', fontWeight: '700', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px'}}>Days Present</p>
                          <p style={{fontSize: '32px', fontWeight: '800', color: '#667eea'}}>{daysPresent}</p>
                        </div>
                        <div style={{padding: '24px', background: 'linear-gradient(135deg, rgba(107, 114, 128, 0.1) 0%, rgba(75, 85, 99, 0.1) 100%)', borderRadius: '12px', border: '2px solid #6b7280', borderLeft: '6px solid #6b7280'}}>
                          <p style={{fontSize: '12px', color: '#6b7280', fontWeight: '700', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px'}}>Days Absent</p>
                          <p style={{fontSize: '32px', fontWeight: '800', color: '#4b5563'}}>{daysAbsent}</p>
                        </div>
                        <div style={{padding: '24px', background: 'linear-gradient(135deg, rgba(67, 56, 202, 0.1) 0%, rgba(99, 102, 241, 0.1) 100%)', borderRadius: '12px', border: '2px solid #4338ca', borderLeft: '6px solid #4338ca'}}>
                          <p style={{fontSize: '12px', color: '#6b7280', fontWeight: '700', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px'}}>Base Salary</p>
                          <p style={{fontSize: '32px', fontWeight: '800', color: '#4338ca'}}>₹{salary.toLocaleString()}</p>
                        </div>
                        <div style={{padding: '24px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: '12px', color: '#fff', borderLeft: '6px solid #667eea'}}>
                          <p style={{fontSize: '12px', opacity: 0.9, fontWeight: '700', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px'}}>Final Salary</p>
                          <p style={{fontSize: '32px', fontWeight: '800'}}>₹{finalSalary.toLocaleString()}</p>
                        </div>
                      </div>
                      <div style={{padding: '20px', background: '#f0f9ff', borderRadius: '12px', border: '2px solid #bfdbfe'}}>
                        <p style={{fontSize: '13px', color: '#1e40af', fontWeight: '600'}}>Salary uses approved attendance only. For every day absent, ₹{Math.round(salary / 30)} is deducted from the base salary.</p>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* EMPLOYEE VIEW - Own Salary Information */}
            {user?.role === 'employee' && (
              <div style={{background: '#fff', padding: '32px', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.08)'}}>
                <h3 style={{fontSize: '20px', fontWeight: '800', marginBottom: '20px'}}>Your Salary Information</h3>
                {salaryData ? (
                  <div>
                    <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '28px'}}>
                      <div style={{padding: '24px', background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)', borderRadius: '12px', border: '2px solid #667eea', borderLeft: '6px solid #667eea'}}>
                        <p style={{fontSize: '12px', color: '#6b7280', fontWeight: '700', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px'}}>Days Present</p>
                        <p style={{fontSize: '32px', fontWeight: '800', color: '#667eea'}}>{salaryData.daysPresent}</p>
                      </div>
                      <div style={{padding: '24px', background: 'linear-gradient(135deg, rgba(107, 114, 128, 0.1) 0%, rgba(75, 85, 99, 0.1) 100%)', borderRadius: '12px', border: '2px solid #6b7280', borderLeft: '6px solid #6b7280'}}>
                        <p style={{fontSize: '12px', color: '#6b7280', fontWeight: '700', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px'}}>Days Absent</p>
                        <p style={{fontSize: '32px', fontWeight: '800', color: '#4b5563'}}>{salaryData.daysAbsent}</p>
                      </div>
                      <div style={{padding: '24px', background: 'linear-gradient(135deg, rgba(67, 56, 202, 0.1) 0%, rgba(99, 102, 241, 0.1) 100%)', borderRadius: '12px', border: '2px solid #4338ca', borderLeft: '6px solid #4338ca'}}>
                        <p style={{fontSize: '12px', color: '#6b7280', fontWeight: '700', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px'}}>Base Salary</p>
                        <p style={{fontSize: '32px', fontWeight: '800', color: '#4338ca'}}>₹{salaryData.monthlySalary.toLocaleString()}</p>
                      </div>
                      <div style={{padding: '24px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: '12px', color: '#fff', borderLeft: '6px solid #667eea'}}>
                        <p style={{fontSize: '12px', opacity: 0.9, fontWeight: '700', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px'}}>Final Salary</p>
                        <p style={{fontSize: '32px', fontWeight: '800'}}>₹{salaryData.finalSalary.toLocaleString()}</p>
                      </div>
                    </div>
                    <div style={{padding: '20px', background: '#f0f9ff', borderRadius: '12px', border: '2px solid #bfdbfe', marginBottom: '20px'}}>
                      <p style={{fontSize: '13px', color: '#1e40af', fontWeight: '600'}}>Salary is automatically calculated based on your attendance. For every day absent, ₹{Math.round(salaryData.monthlySalary / 30)} is deducted.</p>
                    </div>
                    <button onClick={() => window.print()} style={{padding: '12px 28px', background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '700', fontSize: '14px'}}>Generate Certificate</button>
                  </div>
                ) : (
                  <p style={{color: '#6b7280'}}>Salary information not available yet</p>
                )}
              </div>
            )}
          </div>
        )}

        {/* BANK DETAILS */}
        {activeTab === 'bank' && (
          <div>
            <h2 style={{fontSize: '28px', fontWeight: '800', marginBottom: '32px'}}>Bank Information</h2>
            
            {user?.role === 'employee' && (
              <div style={{background: '#fff', padding: '32px', borderRadius: '16px', marginBottom: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.08)'}}>
                <h3 style={{fontSize: '20px', fontWeight: '800', marginBottom: '20px'}}>Your Bank Details</h3>
                {bankData ? (
                  <div style={{padding: '24px', background: 'linear-gradient(135deg, rgba(67, 56, 202, 0.08) 0%, rgba(99, 102, 241, 0.08) 100%)', borderRadius: '12px', border: '2px solid #4338ca'}}>
                    <div style={{display: 'grid', gap: '14px', fontSize: '14px'}}>
                      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '12px', borderBottom: '1px solid rgba(67, 56, 202, 0.2)'}}>
                        <strong style={{color: '#4338ca'}}>Bank Name</strong> <span style={{color: '#1f2937'}}>{bankData.bankName}</span>
                      </div>
                      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '12px', borderBottom: '1px solid rgba(67, 56, 202, 0.2)'}}>
                        <strong style={{color: '#4338ca'}}>Account Holder</strong> <span style={{color: '#1f2937'}}>{bankData.accountHolder}</span>
                      </div>
                      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '12px', borderBottom: '1px solid rgba(67, 56, 202, 0.2)'}}>
                        <strong style={{color: '#4338ca'}}>Account Number</strong> <span style={{color: '#1f2937', fontFamily: 'monospace'}}>****{bankData.accountNumber.slice(-4)}</span>
                      </div>
                      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                        <strong style={{color: '#4338ca'}}>IFSC Code</strong> <span style={{color: '#1f2937', fontFamily: 'monospace'}}>{bankData.ifscCode}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p style={{color: '#6b7280'}}>No bank details saved yet. Contact admin to update.</p>
                )}
              </div>
            )}

            {/* Admin Manage Employee Bank Details */}
            {isAdmin && (
              <div>
                <div style={{background: '#fff', padding: '32px', borderRadius: '16px', marginBottom: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.08)'}}>
                  <h3 style={{fontSize: '20px', fontWeight: '800', marginBottom: '20px'}}>Manage Employee Bank Details</h3>
                  <form onSubmit={handleSaveEmployeeBankDetails}>
                    <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', marginBottom: '20px'}}>
                      <select value={selectedEmployeeForBank} onChange={(e) => setSelectedEmployeeForBank(e.target.value)} style={{padding: '12px 14px', border: '2px solid #e5e7eb', borderRadius: '10px', fontSize: '14px', transition: 'all 0.3s'}} required>
                        <option value="">-- Select Employee --</option>
                        {employees.map((emp) => (
                          <option key={emp.id} value={emp.id}>{emp.name} ({emp.email})</option>
                        ))}
                      </select>
                      <input type="text" placeholder="Bank Name (e.g., HDFC, ICICI)" value={bankForm.bankName} onChange={(e) => setBankForm({...bankForm, bankName: e.target.value})} style={{padding: '12px 14px', border: '2px solid #e5e7eb', borderRadius: '10px', fontSize: '14px', transition: 'all 0.3s'}} required />
                      <input type="text" placeholder="Account Holder Name" value={bankForm.accountHolder} onChange={(e) => setBankForm({...bankForm, accountHolder: e.target.value})} style={{padding: '12px 14px', border: '2px solid #e5e7eb', borderRadius: '10px', fontSize: '14px', transition: 'all 0.3s'}} required />
                      <input type="text" placeholder="Account Number" value={bankForm.accountNumber} onChange={(e) => setBankForm({...bankForm, accountNumber: e.target.value})} style={{padding: '12px 14px', border: '2px solid #e5e7eb', borderRadius: '10px', fontSize: '14px', transition: 'all 0.3s'}} required />
                      <input type="text" placeholder="IFSC Code" value={bankForm.ifscCode} onChange={(e) => setBankForm({...bankForm, ifscCode: e.target.value})} style={{padding: '12px 14px', border: '2px solid #e5e7eb', borderRadius: '10px', fontSize: '14px', transition: 'all 0.3s'}} required />
                    </div>
                    <button type="submit" style={{padding: '12px 28px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '700', fontSize: '14px'}}>Save Employee Bank Details</button>
                  </form>
                </div>

                <div style={{background: '#fff', padding: '32px', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.08)'}}>
                  <h3 style={{fontSize: '20px', fontWeight: '800', marginBottom: '20px'}}>All Employee Bank Records ({employeeBankDetails.length})</h3>
                  {employeeBankDetails.length === 0 ? (
                    <p style={{color: '#6b7280'}}>No bank details saved yet</p>
                  ) : (
                    <div style={{overflowX: 'auto'}}>
                      <table style={{width: '100%', borderCollapse: 'collapse'}}>
                        <thead>
                          <tr style={{background: '#f9fafb', borderBottom: '2px solid #e5e7eb'}}>
                            <th style={{textAlign: 'left', padding: '16px', fontWeight: '700', fontSize: '13px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px'}}>Employee</th>
                            <th style={{textAlign: 'left', padding: '16px', fontWeight: '700', fontSize: '13px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px'}}>Bank Name</th>
                            <th style={{textAlign: 'left', padding: '16px', fontWeight: '700', fontSize: '13px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px'}}>Account Holder</th>
                            <th style={{textAlign: 'left', padding: '16px', fontWeight: '700', fontSize: '13px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px'}}>Account Number</th>
                            <th style={{textAlign: 'left', padding: '16px', fontWeight: '700', fontSize: '13px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px'}}>IFSC</th>
                          </tr>
                        </thead>
                        <tbody>
                          {employeeBankDetails.map((bank, idx) => {
                            const emp = employees.find(e => e.id === bank.userId);
                            return (
                              <tr key={idx} style={{borderBottom: '1px solid #e5e7eb'}}>
                                <td style={{padding: '16px', fontSize: '14px', fontWeight: '600'}}>{emp?.name || 'Unknown'}</td>
                                <td style={{padding: '16px', fontSize: '14px'}}>{bank.bankName}</td>
                                <td style={{padding: '16px', fontSize: '14px'}}>{bank.accountHolder}</td>
                                <td style={{padding: '16px', fontSize: '14px', fontFamily: 'monospace'}}>****{bank.accountNumber.slice(-4)}</td>
                                <td style={{padding: '16px', fontSize: '14px'}}>{bank.ifscCode}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* MONEY MANAGEMENT */}
        {activeTab === 'money-management' && (
          <div>
            <div style={{padding: '20px 24px', borderRadius: '16px', marginBottom: '24px', background: 'linear-gradient(120deg, rgba(30, 58, 138, 0.1) 0%, rgba(79, 70, 229, 0.1) 45%, rgba(15, 118, 110, 0.08) 100%)', border: '1px solid rgba(79, 70, 229, 0.2)'}}>
              <h2 style={{fontSize: '30px', fontWeight: '900', letterSpacing: '0.2px', marginBottom: '6px', color: '#1e3a8a'}}>Money Management</h2>
              <p style={{fontSize: '14px', color: '#1f2937'}}>
                {isAdmin
                  ? 'Track company incoming and outgoing amounts with transaction IDs, screenshot proofs, daily summaries, and payment mode analytics.'
                  : 'Upload client payment screenshots and amounts. Admin can review your submitted payment proofs in real time.'}
              </p>
            </div>

            {/* MONEY MANAGEMENT FORM - Show based on role */}
            {(isSuperadmin || isEmployee) && (
              <div style={{background: '#fff', padding: '28px', borderRadius: '16px', marginBottom: '24px', boxShadow: '0 12px 28px rgba(0,0,0,0.08)', border: '1px solid #eef2ff'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '10px'}}>
                  <h3 style={{fontSize: '21px', fontWeight: '900'}}>{editingMoneyId ? 'Edit Transaction' : 'Add Transaction'}</h3>
                  <span style={{fontSize: '12px', color: '#4f46e5', background: '#eef2ff', padding: '6px 12px', borderRadius: '999px', fontWeight: '700'}}>
                    {editingMoneyId ? `Transaction ID: ${currentEditingMoney?.transactionId || currentEditingMoney?.id}` : 'Transaction ID will be auto-generated'}
                  </span>
                </div>
                <form onSubmit={handleSaveMoneyTransaction}>
                  <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginBottom: '14px'}}>
                    <input type="date" value={moneyForm.date} onChange={(e) => setMoneyForm({...moneyForm, date: e.target.value})} style={{padding: '12px', border: '2px solid #e5e7eb', borderRadius: '10px', fontSize: '14px'}} required />
                    <select value={isSuperadmin ? moneyForm.type : 'credit'} onChange={(e) => setMoneyForm({...moneyForm, type: e.target.value as 'credit' | 'debit'})} disabled={!isSuperadmin} style={{padding: '12px', border: '2px solid #e5e7eb', borderRadius: '10px', fontSize: '14px', background: isSuperadmin ? '#fff' : '#f3f4f6'}}>
                      <option value="credit">Credit</option>
                      <option value="debit">Debit</option>
                    </select>
                    <input type="number" step="0.01" min="0.01" placeholder="Amount" value={moneyForm.amount} onChange={(e) => setMoneyForm({...moneyForm, amount: e.target.value})} style={{padding: '12px', border: '2px solid #e5e7eb', borderRadius: '10px', fontSize: '14px'}} required />
                    <select value={moneyForm.mode} onChange={(e) => setMoneyForm({...moneyForm, mode: e.target.value as 'cash' | 'phonepe' | 'gpay' | 'bank' | 'card' | 'other'})} style={{padding: '12px', border: '2px solid #e5e7eb', borderRadius: '10px', fontSize: '14px'}}>
                      <option value="phonepe">PhonePe</option>
                      <option value="gpay">GPay</option>
                      <option value="bank">Bank Transfer</option>
                      <option value="card">Card</option>
                      <option value="cash">Cash</option>
                      <option value="other">Other</option>
                    </select>
                    <input type="text" placeholder={isSuperadmin ? 'Category (Salary, Sales, Rent...)' : 'Category (default: Client Payment)'} value={moneyForm.category} onChange={(e) => setMoneyForm({...moneyForm, category: e.target.value})} style={{padding: '12px', border: '2px solid #e5e7eb', borderRadius: '10px', fontSize: '14px'}} />
                    <input type="text" placeholder="Notes" value={moneyForm.notes} onChange={(e) => setMoneyForm({...moneyForm, notes: e.target.value})} style={{padding: '12px', border: '2px solid #e5e7eb', borderRadius: '10px', fontSize: '14px'}} />
                  </div>
                  <div style={{marginBottom: '14px'}}>
                    <label style={{display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '8px', color: '#374151', textTransform: 'uppercase', letterSpacing: '0.5px'}}>
                      Payment Screenshot {isEmployee ? '*' : '(optional)'}
                    </label>
                    <input type="file" accept="image/*" onChange={handleMoneyProofFileChange} style={{padding: '10px', border: '2px solid #e5e7eb', borderRadius: '10px', width: '100%', maxWidth: '380px', fontSize: '13px'}} />
                    {moneyProofPreview && (
                      <div style={{marginTop: '10px'}}>
                        <a href={moneyProofPreview} target="_blank" rel="noreferrer" style={{display: 'inline-block'}}>
                          <img src={moneyProofPreview} alt="Payment proof" style={{width: '180px', height: '120px', objectFit: 'cover', borderRadius: '10px', border: '1px solid #cbd5e1'}} />
                        </a>
                      </div>
                    )}
                  </div>
                  <div style={{display: 'flex', gap: '10px', flexWrap: 'wrap'}}>
                    <button type="submit" disabled={moneyProofUploading} style={{padding: '12px 24px', background: 'linear-gradient(135deg, #1d4ed8 0%, #4338ca 100%)', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: '800', cursor: moneyProofUploading ? 'not-allowed' : 'pointer', opacity: moneyProofUploading ? 0.7 : 1}}>
                      {moneyProofUploading ? 'Uploading screenshot...' : (editingMoneyId ? 'Update Transaction' : (isEmployee ? 'Submit Client Payment' : 'Add Transaction'))}
                    </button>
                    {editingMoneyId && isSuperadmin && <button type="button" onClick={resetMoneyForm} style={{padding: '12px 24px', background: '#e5e7eb', color: '#374151', border: 'none', borderRadius: '10px', fontWeight: '700', cursor: 'pointer'}}>Cancel Edit</button>}
                  </div>
                </form>
              </div>
            )}

            {/* ADMIN READ-ONLY VIEW */}
            {isAdminReadOnly && (
              <div style={{background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.05) 0%, rgba(79, 70, 229, 0.05) 100%)', padding: '20px 24px', borderRadius: '14px', marginBottom: '24px', border: '2px dashed #4f46e5'}}>
                <p style={{fontSize: '14px', color: '#4f46e5', fontWeight: '700', margin: 0}}>📊 Admin View: You can monitor all transactions below. Use filters to search and analyze. To make changes, contact your superadmin.</p>
              </div>
            )}

            <div style={{background: '#fff', padding: '20px', borderRadius: '14px', marginBottom: '24px', border: '1px solid #e5e7eb', boxShadow: '0 8px 20px rgba(0,0,0,0.05)'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '10px'}}>
                <h3 style={{fontSize: '16px', fontWeight: '800'}}>Filters</h3>
                <button
                  type="button"
                  onClick={() => setMoneyFilters({ query: '', type: 'all', mode: 'all', startDate: '', endDate: '', proofOnly: false, submittedByRole: 'all' })}
                  style={{padding: '8px 14px', background: '#eef2ff', color: '#3730a3', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: '700'}}
                >
                  Reset Filters
                </button>
              </div>
              <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '10px'}}>
                <input
                  type="text"
                  placeholder="Search Txn ID / category / notes"
                  value={moneyFilters.query}
                  onChange={(e) => setMoneyFilters({ ...moneyFilters, query: e.target.value })}
                  style={{padding: '10px 12px', border: '2px solid #e5e7eb', borderRadius: '10px', fontSize: '13px'}}
                />
                <select
                  value={moneyFilters.type}
                  onChange={(e) => setMoneyFilters({ ...moneyFilters, type: e.target.value as 'all' | 'credit' | 'debit' })}
                  style={{padding: '10px 12px', border: '2px solid #e5e7eb', borderRadius: '10px', fontSize: '13px'}}
                >
                  <option value="all">All Types</option>
                  <option value="credit">Credit</option>
                  <option value="debit">Debit</option>
                </select>
                <select
                  value={moneyFilters.mode}
                  onChange={(e) => setMoneyFilters({ ...moneyFilters, mode: e.target.value as 'all' | 'cash' | 'phonepe' | 'gpay' | 'bank' | 'card' | 'other' })}
                  style={{padding: '10px 12px', border: '2px solid #e5e7eb', borderRadius: '10px', fontSize: '13px'}}
                >
                  <option value="all">All Modes</option>
                  <option value="phonepe">PhonePe</option>
                  <option value="gpay">GPay</option>
                  <option value="bank">Bank Transfer</option>
                  <option value="card">Card</option>
                  <option value="cash">Cash</option>
                  <option value="other">Other</option>
                </select>
                <input
                  type="date"
                  value={moneyFilters.startDate}
                  onChange={(e) => setMoneyFilters({ ...moneyFilters, startDate: e.target.value })}
                  style={{padding: '10px 12px', border: '2px solid #e5e7eb', borderRadius: '10px', fontSize: '13px'}}
                />
                <input
                  type="date"
                  value={moneyFilters.endDate}
                  onChange={(e) => setMoneyFilters({ ...moneyFilters, endDate: e.target.value })}
                  style={{padding: '10px 12px', border: '2px solid #e5e7eb', borderRadius: '10px', fontSize: '13px'}}
                />
                <label style={{display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px', border: '2px solid #e5e7eb', borderRadius: '10px', fontSize: '13px', color: '#374151'}}>
                  <input
                    type="checkbox"
                    checked={moneyFilters.proofOnly}
                    onChange={(e) => setMoneyFilters({ ...moneyFilters, proofOnly: e.target.checked })}
                  />
                  Proof Only
                </label>
                {isAdmin && (
                  <select
                    value={moneyFilters.submittedByRole}
                    onChange={(e) => setMoneyFilters({ ...moneyFilters, submittedByRole: e.target.value as 'all' | 'employee' | 'admin' | 'superadmin' })}
                    style={{padding: '10px 12px', border: '2px solid #e5e7eb', borderRadius: '10px', fontSize: '13px'}}
                  >
                    <option value="all">All Roles</option>
                    <option value="employee">Employee</option>
                    <option value="admin">Admin</option>
                    <option value="superadmin">Super Admin</option>
                  </select>
                )}
              </div>
            </div>

            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '24px'}}>
              <div style={{padding: '22px', borderRadius: '14px', background: '#ffffff', border: '1px solid #ccfbf1', boxShadow: '0 12px 24px rgba(15, 118, 110, 0.08)'}}>
                <p style={{fontSize: '11px', fontWeight: '800', color: '#0f766e', textTransform: 'uppercase', marginBottom: '10px', letterSpacing: '0.7px'}}>Total Credit</p>
                <p style={{fontSize: '32px', fontWeight: '900', color: '#115e59'}}>₹{moneyTotals.totalCredit.toLocaleString()}</p>
              </div>
              <div style={{padding: '22px', borderRadius: '14px', background: '#ffffff', border: '1px solid #e5e7eb', boxShadow: '0 12px 24px rgba(107, 114, 128, 0.1)'}}>
                <p style={{fontSize: '11px', fontWeight: '800', color: '#4b5563', textTransform: 'uppercase', marginBottom: '10px', letterSpacing: '0.7px'}}>Total Debit</p>
                <p style={{fontSize: '32px', fontWeight: '900', color: '#374151'}}>₹{moneyTotals.totalDebit.toLocaleString()}</p>
              </div>
              <div style={{padding: '22px', borderRadius: '14px', background: '#ffffff', border: moneyBalance >= 0 ? '1px solid #c7d2fe' : '1px solid #e5e7eb', boxShadow: moneyBalance >= 0 ? '0 12px 24px rgba(67, 56, 202, 0.12)' : '0 12px 24px rgba(107, 114, 128, 0.1)'}}>
                <p style={{fontSize: '11px', fontWeight: '800', color: moneyBalance >= 0 ? '#4338ca' : '#4b5563', textTransform: 'uppercase', marginBottom: '10px', letterSpacing: '0.7px'}}>Net Balance</p>
                <p style={{fontSize: '32px', fontWeight: '900', color: moneyBalance >= 0 ? '#3730a3' : '#374151'}}>₹{moneyBalance.toLocaleString()}</p>
              </div>
              <div style={{padding: '22px', borderRadius: '14px', background: '#ffffff', border: '1px solid #dbeafe', boxShadow: '0 12px 24px rgba(29, 78, 216, 0.1)'}}>
                <p style={{fontSize: '11px', fontWeight: '800', color: '#1d4ed8', textTransform: 'uppercase', marginBottom: '10px', letterSpacing: '0.7px'}}>Today (Credit / Debit)</p>
                <p style={{fontSize: '28px', fontWeight: '900', color: '#1e3a8a'}}>₹{todayMoneyTotals.credit.toLocaleString()} / ₹{todayMoneyTotals.debit.toLocaleString()}</p>
              </div>
            </div>

            {/* MONEY MANAGEMENT FORM - Show based on role */}
            {(isSuperadmin || isEmployee) && (
              <div style={{background: '#fff', padding: '28px', borderRadius: '16px', marginBottom: '24px', boxShadow: '0 12px 28px rgba(0,0,0,0.08)', border: '1px solid #eef2ff'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '10px'}}>
                  <h3 style={{fontSize: '21px', fontWeight: '900'}}>{editingMoneyId ? 'Edit Transaction' : 'Add Transaction'}</h3>
                  <span style={{fontSize: '12px', color: '#4f46e5', background: '#eef2ff', padding: '6px 12px', borderRadius: '999px', fontWeight: '700'}}>
                    {editingMoneyId ? `Transaction ID: ${currentEditingMoney?.transactionId || currentEditingMoney?.id}` : 'Transaction ID will be auto-generated'}
                  </span>
                </div>
                <form onSubmit={handleSaveMoneyTransaction}>
                  <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginBottom: '14px'}}>
                    <input type="date" value={moneyForm.date} onChange={(e) => setMoneyForm({...moneyForm, date: e.target.value})} style={{padding: '12px', border: '2px solid #e5e7eb', borderRadius: '10px', fontSize: '14px'}} required />
                    <select value={isSuperadmin ? moneyForm.type : 'credit'} onChange={(e) => setMoneyForm({...moneyForm, type: e.target.value as 'credit' | 'debit'})} disabled={!isSuperadmin} style={{padding: '12px', border: '2px solid #e5e7eb', borderRadius: '10px', fontSize: '14px', background: isSuperadmin ? '#fff' : '#f3f4f6'}}>
                      <option value="credit">Credit</option>
                      <option value="debit">Debit</option>
                    </select>
                    <input type="number" step="0.01" min="0.01" placeholder="Amount" value={moneyForm.amount} onChange={(e) => setMoneyForm({...moneyForm, amount: e.target.value})} style={{padding: '12px', border: '2px solid #e5e7eb', borderRadius: '10px', fontSize: '14px'}} required />
                    <select value={moneyForm.mode} onChange={(e) => setMoneyForm({...moneyForm, mode: e.target.value as 'cash' | 'phonepe' | 'gpay' | 'bank' | 'card' | 'other'})} style={{padding: '12px', border: '2px solid #e5e7eb', borderRadius: '10px', fontSize: '14px'}}>
                      <option value="phonepe">PhonePe</option>
                      <option value="gpay">GPay</option>
                      <option value="bank">Bank Transfer</option>
                      <option value="card">Card</option>
                      <option value="cash">Cash</option>
                      <option value="other">Other</option>
                    </select>
                    <input type="text" placeholder={isSuperadmin ? 'Category (Salary, Sales, Rent...)' : 'Category (default: Client Payment)'} value={moneyForm.category} onChange={(e) => setMoneyForm({...moneyForm, category: e.target.value})} style={{padding: '12px', border: '2px solid #e5e7eb', borderRadius: '10px', fontSize: '14px'}} />
                    <input type="text" placeholder="Notes" value={moneyForm.notes} onChange={(e) => setMoneyForm({...moneyForm, notes: e.target.value})} style={{padding: '12px', border: '2px solid #e5e7eb', borderRadius: '10px', fontSize: '14px'}} />
                  </div>
                  <div style={{marginBottom: '14px'}}>
                    <label style={{display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '8px', color: '#374151', textTransform: 'uppercase', letterSpacing: '0.5px'}}>
                      Payment Screenshot {isEmployee ? '*' : '(optional)'}
                    </label>
                    <input type="file" accept="image/*" onChange={handleMoneyProofFileChange} style={{padding: '10px', border: '2px solid #e5e7eb', borderRadius: '10px', width: '100%', maxWidth: '380px', fontSize: '13px'}} />
                    {moneyProofPreview && (
                      <div style={{marginTop: '10px'}}>
                        <a href={moneyProofPreview} target="_blank" rel="noreferrer" style={{display: 'inline-block'}}>
                          <img src={moneyProofPreview} alt="Payment proof" style={{width: '180px', height: '120px', objectFit: 'cover', borderRadius: '10px', border: '1px solid #cbd5e1'}} />
                        </a>
                      </div>
                    )}
                  </div>
                  <div style={{display: 'flex', gap: '10px', flexWrap: 'wrap'}}>
                    <button type="submit" disabled={moneyProofUploading} style={{padding: '12px 24px', background: 'linear-gradient(135deg, #1d4ed8 0%, #4338ca 100%)', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: '800', cursor: moneyProofUploading ? 'not-allowed' : 'pointer', opacity: moneyProofUploading ? 0.7 : 1}}>
                      {moneyProofUploading ? 'Uploading screenshot...' : (editingMoneyId ? 'Update Transaction' : (isEmployee ? 'Submit Client Payment' : 'Add Transaction'))}
                    </button>
                    {editingMoneyId && isSuperadmin && <button type="button" onClick={resetMoneyForm} style={{padding: '12px 24px', background: '#e5e7eb', color: '#374151', border: 'none', borderRadius: '10px', fontWeight: '700', cursor: 'pointer'}}>Cancel Edit</button>}
                  </div>
                </form>
              </div>
            )}

            {/* ADMIN READ-ONLY VIEW */}
            {isAdminReadOnly && (
              <div style={{background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.05) 0%, rgba(79, 70, 229, 0.05) 100%)', padding: '20px 24px', borderRadius: '14px', marginBottom: '24px', border: '2px dashed #4f46e5'}}>
                <p style={{fontSize: '14px', color: '#4f46e5', fontWeight: '700', margin: 0}}>📊 Admin View: You can monitor all transactions below. Use filters to search and analyze. To make changes, contact your superadmin.</p>
              </div>
            )}

            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '24px'}}>
              <div style={{background: '#fff', padding: '24px', borderRadius: '16px', boxShadow: '0 12px 28px rgba(0,0,0,0.08)', border: '1px solid #e5e7eb'}}>
                <h3 style={{fontSize: '18px', fontWeight: '900', marginBottom: '14px'}}>Mode Summary</h3>
                {Object.keys(modeTotals).length === 0 ? (
                  <p style={{color: '#6b7280'}}>No transactions yet</p>
                ) : (
                  <div style={{display: 'grid', gap: '10px'}}>
                    {Object.entries(modeTotals).map(([mode, values]) => (
                      <div key={mode} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '10px'}}>
                        <span style={{fontWeight: '700', textTransform: 'capitalize'}}>{mode}</span>
                        <span style={{fontSize: '13px', color: '#374151'}}>C: ₹{values.credit.toLocaleString()} | D: ₹{values.debit.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div style={{background: '#fff', padding: '24px', borderRadius: '16px', boxShadow: '0 12px 28px rgba(0,0,0,0.08)', border: '1px solid #e5e7eb'}}>
                <h3 style={{fontSize: '18px', fontWeight: '900', marginBottom: '14px'}}>Daily Summary</h3>
                {dailyTotals.length === 0 ? (
                  <p style={{color: '#6b7280'}}>No daily records yet</p>
                ) : (
                  <div style={{display: 'grid', gap: '10px', maxHeight: '300px', overflowY: 'auto'}}>
                    {dailyTotals.map((day) => (
                      <div key={day.date} style={{padding: '10px 12px', borderRadius: '10px', background: '#f9fafb', border: '1px solid #e5e7eb'}}>
                        <p style={{fontSize: '13px', fontWeight: '800', marginBottom: '6px'}}>{day.date} ({day.count} entries)</p>
                        <p style={{fontSize: '12px', color: '#374151'}}>Credit: ₹{day.credit.toLocaleString()} | Debit: ₹{day.debit.toLocaleString()} | Balance: ₹{(day.credit - day.debit).toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div style={{background: '#fff', padding: '28px', borderRadius: '16px', boxShadow: '0 12px 28px rgba(0,0,0,0.08)', border: '1px solid #e5e7eb'}}>
              <h3 style={{fontSize: '20px', fontWeight: '900', marginBottom: '16px'}}>Transaction Ledger ({filteredMoneyTransactions.length})</h3>
              {filteredMoneyTransactions.length === 0 ? (
                <p style={{color: '#6b7280'}}>No transactions added yet</p>
              ) : (
                <div style={{overflowX: 'auto'}}>
                  <table style={{width: '100%', borderCollapse: 'separate', borderSpacing: 0}}>
                    <thead>
                      <tr style={{background: '#f8fafc'}}>
                        <th style={{textAlign: 'left', padding: '12px', fontSize: '11px', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px'}}>Txn ID</th>
                        <th style={{textAlign: 'left', padding: '12px', fontSize: '11px', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px'}}>Date</th>
                        <th style={{textAlign: 'left', padding: '12px', fontSize: '11px', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px'}}>Type</th>
                        <th style={{textAlign: 'left', padding: '12px', fontSize: '11px', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px'}}>Amount</th>
                        <th style={{textAlign: 'left', padding: '12px', fontSize: '11px', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px'}}>Mode</th>
                        <th style={{textAlign: 'left', padding: '12px', fontSize: '11px', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px'}}>Category</th>
                        <th style={{textAlign: 'left', padding: '12px', fontSize: '11px', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px'}}>Notes</th>
                        <th style={{textAlign: 'left', padding: '12px', fontSize: '11px', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px'}}>Proof</th>
                        {isAdmin && <th style={{textAlign: 'left', padding: '12px', fontSize: '11px', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px'}}>Submitted By</th>}
                        {(isSuperadmin || isEmployee) && <th style={{textAlign: 'left', padding: '12px', fontSize: '11px', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px'}}>Actions</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredMoneyTransactions.map((item) => (
                        <tr key={item.id} style={{borderBottom: '1px solid #eef2f7'}}>
                          <td style={{padding: '12px', fontSize: '12px', fontFamily: 'monospace', fontWeight: '700', color: '#334155'}}>{item.transactionId || item.id}</td>
                          <td style={{padding: '12px', fontSize: '13px'}}>{item.date}</td>
                          <td style={{padding: '12px'}}>
                            <span style={{fontSize: '12px', fontWeight: '700', padding: '5px 10px', borderRadius: '999px', background: item.type === 'credit' ? '#ccfbf1' : '#f3f4f6', color: item.type === 'credit' ? '#0f766e' : '#4b5563'}}>{item.type}</span>
                          </td>
                          <td style={{padding: '12px', fontSize: '13px', fontWeight: '800', color: item.type === 'credit' ? '#0f766e' : '#4b5563'}}>₹{item.amount.toLocaleString()}</td>
                          <td style={{padding: '12px', fontSize: '13px', textTransform: 'capitalize'}}>{item.mode}</td>
                          <td style={{padding: '12px', fontSize: '13px'}}>{item.category || '-'}</td>
                          <td style={{padding: '12px', fontSize: '13px'}}>{item.notes || '-'}</td>
                          <td style={{padding: '12px', fontSize: '12px'}}>
                            {item.proofImageUrl ? (
                              <a href={item.proofImageUrl} target="_blank" rel="noreferrer">
                                <img src={item.proofImageUrl} alt="Proof" style={{width: '64px', height: '44px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #cbd5e1'}} />
                              </a>
                            ) : '-'}
                          </td>
                          {isAdmin && <td style={{padding: '12px', fontSize: '13px'}}>{item.createdByName || '-'} ({item.createdByRole || '-'})</td>}
                          {(isSuperadmin || isEmployee) && (
                            <td style={{padding: '12px'}}>
                              <div style={{display: 'flex', gap: '8px'}}>
                                {(isSuperadmin || (isEmployee && item.createdBy === user?.id)) && (
                                  <>
                                    <button onClick={() => handleEditMoneyTransaction(item)} style={{padding: '6px 10px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: '700', cursor: 'pointer'}}>Edit</button>
                                    <button onClick={() => handleDeleteMoneyTransaction(item.id)} style={{padding: '6px 10px', background: '#6b7280', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: '700', cursor: 'pointer'}}>Delete</button>
                                  </>
                                )}
                              </div>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* COMPANY MANAGEMENT */}
        {activeTab === 'company-management' && (
          <div>
            <div style={{padding: '20px 24px', borderRadius: '16px', marginBottom: '24px', background: 'linear-gradient(120deg, rgba(30, 58, 138, 0.1) 0%, rgba(79, 70, 229, 0.1) 45%, rgba(15, 118, 110, 0.08) 100%)', border: '1px solid rgba(79, 70, 229, 0.2)'}}>
              <h2 style={{fontSize: '30px', fontWeight: '900', letterSpacing: '0.2px', marginBottom: '6px', color: '#1e3a8a'}}>Company Management</h2>
              <p style={{fontSize: '14px', color: '#1f2937'}}>
                Track company revenue, expenses by category (food, rent, utilities, etc.), and manage financial records with photo proof. Analyze daily revenue vs expenses.
              </p>
            </div>

            {/* ROLE INDICATOR */}
            {isSuperadmin && (
              <div style={{background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.05) 0%, rgba(79, 70, 229, 0.05) 100%)', padding: '20px 24px', borderRadius: '14px', marginBottom: '24px', border: '2px dashed #4f46e5'}}>
                <p style={{fontSize: '14px', color: '#4f46e5', fontWeight: '700', margin: 0}}>📋 Superadmin View: Revenue and expense analytics are visible. Admin-only controls remain restricted where applicable.</p>
              </div>
            )}

            {/* EXPENSE FORM - Only for Admin (not superadmin) */}
            {isAdminReadOnly && (
              <div style={{background: '#fff', padding: '28px', borderRadius: '16px', marginBottom: '24px', boxShadow: '0 12px 28px rgba(0,0,0,0.08)', border: '1px solid #eef2ff'}}>
                <h3 style={{fontSize: '20px', fontWeight: '900', marginBottom: '20px'}}>{editingExpenseId ? 'Edit Expense' : 'Add Company Expense'}</h3>
                <form onSubmit={handleSaveCompanyExpense}>
                  <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginBottom: '14px'}}>
                    <input type="date" value={companyExpenseForm.date} onChange={(e) => setCompanyExpenseForm({...companyExpenseForm, date: e.target.value})} style={{padding: '12px', border: '2px solid #e5e7eb', borderRadius: '10px', fontSize: '14px'}} required />
                    <select value={companyExpenseForm.category} onChange={(e) => setCompanyExpenseForm({...companyExpenseForm, category: e.target.value as any})} style={{padding: '12px', border: '2px solid #e5e7eb', borderRadius: '10px', fontSize: '14px'}}>
                      <option value="food">Food</option>
                      <option value="rent">Rent</option>
                      <option value="utilities">Utilities</option>
                      <option value="equipment">Equipment</option>
                      <option value="supplies">Supplies</option>
                      <option value="travel">Travel</option>
                      <option value="other">Other</option>
                    </select>
                    <input type="text" placeholder="Description (e.g., Office lunch)" value={companyExpenseForm.description} onChange={(e) => setCompanyExpenseForm({...companyExpenseForm, description: e.target.value})} style={{padding: '12px', border: '2px solid #e5e7eb', borderRadius: '10px', fontSize: '14px'}} required />
                    <input type="number" step="0.01" min="0.01" placeholder="Amount (₹)" value={companyExpenseForm.amount} onChange={(e) => setCompanyExpenseForm({...companyExpenseForm, amount: e.target.value})} style={{padding: '12px', border: '2px solid #e5e7eb', borderRadius: '10px', fontSize: '14px'}} required />
                  </div>
                  <div style={{marginBottom: '14px'}}>
                    <label style={{display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '8px', color: '#374151', textTransform: 'uppercase', letterSpacing: '0.5px'}}>
                      Notes
                    </label>
                    <textarea value={companyExpenseForm.notes} onChange={(e) => setCompanyExpenseForm({...companyExpenseForm, notes: e.target.value})} placeholder="Add notes about this expense" style={{padding: '12px', border: '2px solid #e5e7eb', borderRadius: '10px', fontSize: '14px', width: '100%', minHeight: '80px', boxSizing: 'border-box'}} />
                  </div>

                  <div style={{marginBottom: '14px', background: '#f9fafb', padding: '16px', borderRadius: '10px', border: '1px solid #e5e7eb'}}>
                    <p style={{fontSize: '12px', fontWeight: '700', marginBottom: '10px', color: '#374151', textTransform: 'uppercase'}}>Add Receipt/Proof Photos</p>
                    <div style={{display: 'flex', gap: '10px', alignItems: 'flex-end', marginBottom: '12px', flexWrap: 'wrap'}}>
                      <div style={{flex: 1, minWidth: '200px'}}>
                        <input type="file" accept="image/*" onChange={handleExpensePhotoFileChange} style={{padding: '10px', border: '2px solid #e5e7eb', borderRadius: '10px', width: '100%', fontSize: '13px'}} />
                      </div>
                      <button type="button" onClick={handleAddExpensePhoto} disabled={expensePhotoUploading || !expensePhotoFile} style={{padding: '10px 16px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '700', whiteSpace: 'nowrap', opacity: (expensePhotoUploading || !expensePhotoFile) ? 0.6 : 1}}>
                        {expensePhotoUploading ? 'Uploading...' : 'Add Photo'}
                      </button>
                    </div>
                    {expensePhotoPreview && (
                      <div style={{marginBottom: '10px'}}>
                        <img src={expensePhotoPreview} alt="Preview" style={{width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #cbd5e1'}} />
                      </div>
                    )}
                    {expensePhotos.length > 0 && (
                      <div>
                        <p style={{fontSize: '11px', color: '#6b7280', fontWeight: '600', marginBottom: '8px'}}>Photos Added ({expensePhotos.length})</p>
                        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: '8px'}}>
                          {expensePhotos.map((url, idx) => (
                            <div key={idx} style={{position: 'relative', borderRadius: '8px', overflow: 'hidden', border: '1px solid #e5e7eb'}}>
                              <img src={url} alt={`Receipt ${idx + 1}`} style={{width: '100%', height: '80px', objectFit: 'cover'}} />
                              <button type="button" onClick={() => handleRemoveExpensePhoto(url)} style={{position: 'absolute', top: '2px', right: '2px', background: '#ef4444', color: '#fff', border: 'none', width: '20px', height: '20px', borderRadius: '50%', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold'}}>×</button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div style={{display: 'flex', gap: '10px', flexWrap: 'wrap'}}>
                    <button type="submit" style={{padding: '12px 24px', background: 'linear-gradient(135deg, #1d4ed8 0%, #4338ca 100%)', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: '800', cursor: 'pointer'}}>
                      {editingExpenseId ? 'Update Expense' : 'Add Expense'}
                    </button>
                    {editingExpenseId && <button type="button" onClick={resetExpenseForm} style={{padding: '12px 24px', background: '#e5e7eb', color: '#374151', border: 'none', borderRadius: '10px', fontWeight: '700', cursor: 'pointer'}}>Cancel Edit</button>}
                  </div>
                </form>
              </div>
            )}

            {/* REVENUE VS EXPENSE SUMMARY */}
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '24px'}}>
              <div style={{padding: '22px', borderRadius: '14px', background: '#ffffff', border: '1px solid #ccfbf1', boxShadow: '0 12px 24px rgba(15, 118, 110, 0.08)'}}>
                <p style={{fontSize: '11px', fontWeight: '800', color: '#0f766e', textTransform: 'uppercase', marginBottom: '10px', letterSpacing: '0.7px'}}>Total Revenue</p>
                <p style={{fontSize: '32px', fontWeight: '900', color: '#115e59'}}>₹{moneyTotals.totalCredit.toLocaleString()}</p>
              </div>
              <div style={{padding: '22px', borderRadius: '14px', background: '#ffffff', border: '1px solid #fecaca', boxShadow: '0 12px 24px rgba(220, 38, 38, 0.08)'}}>
                <p style={{fontSize: '11px', fontWeight: '800', color: '#dc2626', textTransform: 'uppercase', marginBottom: '10px', letterSpacing: '0.7px'}}>Total Expenses</p>
                <p style={{fontSize: '32px', fontWeight: '900', color: '#b91c1c'}}>₹{expenseTotals.totalExpenses.toLocaleString()}</p>
              </div>
              <div style={{padding: '22px', borderRadius: '14px', background: '#ffffff', border: '1px solid #c7d2fe', boxShadow: '0 12px 24px rgba(67, 56, 202, 0.12)'}}>
                <p style={{fontSize: '11px', fontWeight: '800', color: '#4338ca', textTransform: 'uppercase', marginBottom: '10px', letterSpacing: '0.7px'}}>Net Profit</p>
                <p style={{fontSize: '32px', fontWeight: '900', color: '#3730a3'}}>₹{(moneyTotals.totalCredit - expenseTotals.totalExpenses).toLocaleString()}</p>
              </div>
              <div style={{padding: '22px', borderRadius: '14px', background: '#ffffff', border: '1px solid #dbeafe', boxShadow: '0 12px 24px rgba(29, 78, 216, 0.1)'}}>
                <p style={{fontSize: '11px', fontWeight: '800', color: '#1d4ed8', textTransform: 'uppercase', marginBottom: '10px', letterSpacing: '0.7px'}}>Today (Revenue / Expense)</p>
                <p style={{fontSize: '26px', fontWeight: '900', color: '#1e3a8a'}}>₹{todayMoneyTotals.credit.toLocaleString()} / ₹{todayExpenses.toLocaleString()}</p>
              </div>
            </div>

            {/* FILTERS */}
            <div style={{background: '#fff', padding: '20px', borderRadius: '14px', marginBottom: '24px', border: '1px solid #e5e7eb', boxShadow: '0 8px 20px rgba(0,0,0,0.05)'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '10px'}}>
                <h3 style={{fontSize: '16px', fontWeight: '800'}}>Filters</h3>
                <button type="button" onClick={() => setCompanyExpenseFilters({query: '', category: 'all', startDate: '', endDate: ''})} style={{padding: '8px 14px', background: '#eef2ff', color: '#3730a3', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: '700'}}>Reset Filters</button>
              </div>
              <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '10px'}}>
                <input type="text" placeholder="Search description / notes" value={companyExpenseFilters.query} onChange={(e) => setCompanyExpenseFilters({...companyExpenseFilters, query: e.target.value})} style={{padding: '10px 12px', border: '2px solid #e5e7eb', borderRadius: '10px', fontSize: '13px'}} />
                <select value={companyExpenseFilters.category} onChange={(e) => setCompanyExpenseFilters({...companyExpenseFilters, category: e.target.value as any})} style={{padding: '10px 12px', border: '2px solid #e5e7eb', borderRadius: '10px', fontSize: '13px'}}>
                  <option value="all">All Categories</option>
                  <option value="food">Food</option>
                  <option value="rent">Rent</option>
                  <option value="utilities">Utilities</option>
                  <option value="equipment">Equipment</option>
                  <option value="supplies">Supplies</option>
                  <option value="travel">Travel</option>
                  <option value="other">Other</option>
                </select>
                <input type="date" value={companyExpenseFilters.startDate} onChange={(e) => setCompanyExpenseFilters({...companyExpenseFilters, startDate: e.target.value})} style={{padding: '10px 12px', border: '2px solid #e5e7eb', borderRadius: '10px', fontSize: '13px'}} />
                <input type="date" value={companyExpenseFilters.endDate} onChange={(e) => setCompanyExpenseFilters({...companyExpenseFilters, endDate: e.target.value})} style={{padding: '10px 12px', border: '2px solid #e5e7eb', borderRadius: '10px', fontSize: '13px'}} />
              </div>
            </div>

            {/* EXPENSE CATEGORIES SUMMARY */}
            <div style={{background: '#fff', padding: '24px', borderRadius: '16px', marginBottom: '24px', boxShadow: '0 12px 28px rgba(0,0,0,0.08)', border: '1px solid #e5e7eb'}}>
              <h3 style={{fontSize: '18px', fontWeight: '900', marginBottom: '14px'}}>Expense by Category</h3>
              {Object.keys(expenseTotals.byCategory).length === 0 ? (
                <p style={{color: '#6b7280'}}>No expenses yet</p>
              ) : (
                <div style={{display: 'grid', gap: '10px'}}>
                  {Object.entries(expenseTotals.byCategory).map(([cat, amount]) => (
                    <div key={cat} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '10px'}}>
                      <span style={{fontWeight: '700', textTransform: 'capitalize', color: '#374151'}}>{cat}</span>
                      <span style={{fontSize: '14px', fontWeight: '800', color: '#4f46e5'}}>₹{(amount as number).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* DAILY REVENUE VS EXPENSE */}
            <div style={{background: '#fff', padding: '24px', borderRadius: '16px', marginBottom: '24px', boxShadow: '0 12px 28px rgba(0,0,0,0.08)', border: '1px solid #e5e7eb'}}>
              <h3 style={{fontSize: '18px', fontWeight: '900', marginBottom: '14px'}}>Daily Revenue vs Expenses</h3>
              {revenueVsExpenseByDay.length === 0 ? (
                <p style={{color: '#6b7280'}}>No data available</p>
              ) : (
                <div style={{display: 'grid', gap: '10px', maxHeight: '350px', overflowY: 'auto'}}>
                  {revenueVsExpenseByDay.map((day) => (
                    <div key={day.date} style={{padding: '12px', borderRadius: '10px', background: '#f9fafb', border: '1px solid #e5e7eb'}}>
                      <p style={{fontSize: '13px', fontWeight: '800', marginBottom: '6px', color: '#1e3a8a'}}>{day.date}</p>
                      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '12px'}}>
                        <span><span style={{color: '#0f766e', fontWeight: '700'}}>Revenue:</span> ₹{day.revenue.toLocaleString()}</span>
                        <span><span style={{color: '#dc2626', fontWeight: '700'}}>Expense:</span> ₹{day.expense.toLocaleString()}</span>
                      </div>
                      <p style={{fontSize: '12px', color: '#374151', marginTop: '6px'}}>Net: <span style={{fontWeight: '800', color: day.revenue - day.expense >= 0 ? '#0f766e' : '#dc2626'}}>₹{(day.revenue - day.expense).toLocaleString()}</span></p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* EXPENSE LEDGER */}
            <div style={{background: '#fff', padding: '28px', borderRadius: '16px', boxShadow: '0 12px 28px rgba(0,0,0,0.08)', border: '1px solid #e5e7eb'}}>
              <h3 style={{fontSize: '20px', fontWeight: '900', marginBottom: '16px'}}>Expense Ledger ({filteredExpenses.length})</h3>
              {filteredExpenses.length === 0 ? (
                <p style={{color: '#6b7280'}}>No expenses found</p>
              ) : (
                <div style={{overflowX: 'auto'}}>
                  <table style={{width: '100%', borderCollapse: 'separate', borderSpacing: 0}}>
                    <thead>
                      <tr style={{background: '#f8fafc'}}>
                        <th style={{textAlign: 'left', padding: '12px', fontSize: '11px', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px'}}>Date</th>
                        <th style={{textAlign: 'left', padding: '12px', fontSize: '11px', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px'}}>Category</th>
                        <th style={{textAlign: 'left', padding: '12px', fontSize: '11px', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px'}}>Description</th>
                        <th style={{textAlign: 'left', padding: '12px', fontSize: '11px', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px'}}>Amount</th>
                        <th style={{textAlign: 'left', padding: '12px', fontSize: '11px', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px'}}>Photos</th>
                        <th style={{textAlign: 'left', padding: '12px', fontSize: '11px', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px'}}>Notes</th>
                        {isAdminReadOnly && <th style={{textAlign: 'left', padding: '12px', fontSize: '11px', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px'}}>Actions</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredExpenses.map((item) => (
                        <tr key={item.id} style={{borderBottom: '1px solid #eef2f7'}}>
                          <td style={{padding: '12px', fontSize: '13px'}}>{item.date}</td>
                          <td style={{padding: '12px'}}>
                            <span style={{fontSize: '12px', fontWeight: '700', padding: '5px 10px', borderRadius: '999px', background: '#f3f4f6', color: '#374151', textTransform: 'capitalize'}}>{item.category}</span>
                          </td>
                          <td style={{padding: '12px', fontSize: '13px', fontWeight: '600'}}>{item.description}</td>
                          <td style={{padding: '12px', fontSize: '13px', fontWeight: '800', color: '#dc2626'}}>₹{item.amount.toLocaleString()}</td>
                          <td style={{padding: '12px', fontSize: '12px'}}>
                            {item.photoUrls && item.photoUrls.length > 0 ? (
                              <div style={{display: 'flex', gap: '6px', flexWrap: 'wrap'}}>
                                {item.photoUrls.slice(0, 3).map((url, idx) => (
                                  <a key={idx} href={url} target="_blank" rel="noreferrer" style={{display: 'inline-block'}}>
                                    <img src={url} alt={`Receipt ${idx}`} style={{width: '50px', height: '40px', objectFit: 'cover', borderRadius: '5px', border: '1px solid #cbd5e1'}} />
                                  </a>
                                ))}
                                {item.photoUrls.length > 3 && (
                                  <div style={{width: '50px', height: '40px', borderRadius: '5px', border: '1px solid #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f9fafb', fontSize: '11px', fontWeight: '700', color: '#6b7280'}}>
                                    +{item.photoUrls.length - 3}
                                  </div>
                                )}
                              </div>
                            ) : '-'}
                          </td>
                          <td style={{padding: '12px', fontSize: '12px', color: '#6b7280'}}>{item.notes || '-'}</td>
                          {isAdminReadOnly && (
                            <td style={{padding: '12px'}}>
                              <div style={{display: 'flex', gap: '8px'}}>
                                <button onClick={() => handleEditExpense(item)} style={{padding: '6px 10px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: '700', cursor: 'pointer'}}>Edit</button>
                                <button onClick={() => handleDeleteExpense(item.id)} style={{padding: '6px 10px', background: '#6b7280', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: '700', cursor: 'pointer'}}>Delete</button>
                              </div>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* SETTINGS */}
        {activeTab === 'settings' && (
          <div>
            <h2 style={{fontSize: '28px', fontWeight: '800', marginBottom: '32px'}}>Account Settings</h2>
            <div style={{background: '#fff', padding: '32px', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.08)', marginBottom: '24px'}}>
              <h3 style={{fontSize: '20px', fontWeight: '800', marginBottom: '24px'}}>Your Profile</h3>
              
              {/* Profile Image Section */}
              <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', marginBottom: '32px'}}>
                <div style={{padding: '24px', background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)', borderRadius: '12px', border: '2px solid #667eea', textAlign: 'center'}}>
                  <div style={{width: '120px', height: '120px', borderRadius: '50%', background: userProfileImage ? 'none' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', backgroundImage: userProfileImage ? `url('${userProfileImage}')` : 'none', backgroundSize: 'cover', backgroundPosition: 'center', margin: '0 auto 16px', border: '4px solid #667eea', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '48px'}}>
                    {!userProfileImage && 'Photo'}
                  </div>
                  <label style={{display: 'block', marginBottom: '12px', fontSize: '12px', fontWeight: '700', color: '#667eea', textTransform: 'uppercase', cursor: 'pointer', letterSpacing: '0.5px'}}>
                    Upload Photo
                    <input type="file" accept="image/*" onChange={handleProfileImageUpload} style={{display: 'none'}} />
                  </label>
                  <p style={{fontSize: '12px', color: '#6b7280'}}>JPG, PNG (Max 5MB)</p>
                </div>

                <div style={{padding: '24px', background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)', borderRadius: '12px', border: '2px solid #667eea', borderLeft: '6px solid #667eea'}}>
                  <p style={{fontSize: '12px', color: '#6b7280', fontWeight: '700', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px'}}>Full Name</p>
                  <p style={{fontSize: '20px', fontWeight: '800', color: '#667eea'}}>{user?.name}</p>
                </div>
                <div style={{padding: '24px', background: 'linear-gradient(135deg, rgba(67, 56, 202, 0.1) 0%, rgba(99, 102, 241, 0.1) 100%)', borderRadius: '12px', border: '2px solid #4338ca', borderLeft: '6px solid #4338ca'}}>
                  <p style={{fontSize: '12px', color: '#6b7280', fontWeight: '700', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px'}}>Email Address</p>
                  <p style={{fontSize: '16px', fontWeight: '700', color: '#4338ca'}}>{user?.email}</p>
                </div>
                <div style={{padding: '24px', background: 'linear-gradient(135deg, rgba(107, 114, 128, 0.1) 0%, rgba(75, 85, 99, 0.1) 100%)', borderRadius: '12px', border: '2px solid #6b7280', borderLeft: '6px solid #6b7280'}}>
                  <p style={{fontSize: '12px', color: '#6b7280', fontWeight: '700', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px'}}>Your Role</p>
                  <p style={{fontSize: '18px', fontWeight: '800', color: '#4b5563', textTransform: 'uppercase'}}>{user?.role}</p>
                </div>
              </div>
            </div>

            {isAdmin && (
              <div style={{background: '#fff', padding: '32px', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.08)'}}>
                <h3 style={{fontSize: '18px', fontWeight: '800', marginBottom: '20px', color: '#667eea'}}>Admin Privileges</h3>
                <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px'}}>
                  <div style={{padding: '16px', background: '#f9fafb', borderRadius: '12px', border: '1px solid #e5e7eb'}}>
                    <p style={{fontSize: '14px', fontWeight: '700', color: '#667eea', marginBottom: '8px'}}>Manage Employees</p>
                    <p style={{fontSize: '12px', color: '#6b7280'}}>Add, edit, and delete employees</p>
                  </div>
                  <div style={{padding: '16px', background: '#f9fafb', borderRadius: '12px', border: '1px solid #e5e7eb'}}>
                    <p style={{fontSize: '14px', fontWeight: '700', color: '#667eea', marginBottom: '8px'}}>Approve Attendance</p>
                    <p style={{fontSize: '12px', color: '#6b7280'}}>Review and approve attendance records</p>
                  </div>
                  <div style={{padding: '16px', background: '#f9fafb', borderRadius: '12px', border: '1px solid #e5e7eb'}}>
                    <p style={{fontSize: '14px', fontWeight: '700', color: '#667eea', marginBottom: '8px'}}>View Reports</p>
                    <p style={{fontSize: '12px', color: '#6b7280'}}>Monitor all employee reports</p>
                  </div>
                  <div style={{padding: '16px', background: '#f9fafb', borderRadius: '12px', border: '1px solid #e5e7eb'}}>
                    <p style={{fontSize: '14px', fontWeight: '700', color: '#667eea', marginBottom: '8px'}}>Salary Management</p>
                    <p style={{fontSize: '12px', color: '#6b7280'}}>View all employee salaries</p>
                  </div>
                </div>
              </div>
            )}

            {user?.role === 'employee' && (
              <div style={{background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(5, 150, 105, 0.05) 100%)', padding: '24px', borderRadius: '16px', border: '2px solid #d1fae5', marginTop: '24px'}}>
                <p style={{fontSize: '14px', color: '#065f46', fontWeight: '600'}}>
                  Your account was created by your admin. You can view your bank details and salary information in the respective sections.
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'employees' && !isAdmin && (
          <div style={{background: 'linear-gradient(135deg, rgba(107, 114, 128, 0.1) 0%, rgba(75, 85, 99, 0.1) 100%)', padding: '24px', borderRadius: '12px', border: '2px solid #6b7280'}}>
            <p style={{color: '#4b5563', fontWeight: '700', fontSize: '14px'}}>Only admins can manage employees</p>
          </div>
        )}
      </main>
    </div>
  );
}
