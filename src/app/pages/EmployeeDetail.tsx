import { useParams, Link } from "react-router";
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Briefcase, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Download,
  Printer,
  Edit,
  MoreHorizontal
} from "lucide-react";
import { GlassCard, Button } from "../components/UI";
import { motion } from "motion/react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";

const performanceData = [
  { name: "Week 1", value: 12 },
  { name: "Week 2", value: 18 },
  { name: "Week 3", value: 15 },
  { name: "Week 4", value: 24 },
  { name: "Week 5", value: 21 },
  { name: "Week 6", value: 30 },
];

export default function EmployeeDetail() {
  const { id } = useParams();

  // Mock fetching employee data based on ID
  const employee = {
    id: id || "EMP-001",
    name: "Rahul Sharma",
    role: "Senior Developer",
    department: "Engineering",
    status: "active",
    email: "rahul@nexus.ai",
    phone: "+91 98765 43210",
    address: "B-201, Cyber Heights, Bangalore, India",
    joiningDate: "12 March 2024",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop",
    stats: {
      tasksCompleted: 156,
      pendingTasks: 4,
      attendance: "98.5%",
      leaves: 2,
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link to="/employees">
            <button className="p-3 rounded-xl bg-white/5 border border-white/5 text-muted-foreground hover:text-white hover:bg-white/10 transition-all">
              <ArrowLeft size={20} />
            </button>
          </Link>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Employee <span className="gradient-text">Profile</span></h2>
            <p className="text-muted-foreground mt-1">Detailed overview of {employee.name}'s performance and info.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
           <Button variant="outline" className="border-white/10">
              <Printer size={18} />
              Print Profile
           </Button>
           <Button>
              <Edit size={18} />
              Edit Details
           </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <GlassCard className="lg:col-span-1 p-0 overflow-hidden">
           <div className="h-32 gradient-bg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
           </div>
           <div className="px-8 pb-8 relative">
              <div className="absolute -top-16 left-8 w-32 h-32 rounded-3xl p-1 gradient-bg shadow-2xl">
                 <div className="w-full h-full rounded-[22px] overflow-hidden bg-black/80">
                    <ImageWithFallback src={employee.avatar} alt={employee.name} className="w-full h-full object-cover" />
                 </div>
              </div>
              <div className="pt-20">
                 <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-bold">{employee.name}</h3>
                    <div className="px-3 py-1 rounded-lg bg-chart-5/10 text-chart-5 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                       <span className="w-1.5 h-1.5 rounded-full bg-chart-5 shadow-[0_0_8px_#00FF94]" />
                       Active
                    </div>
                 </div>
                 <p className="text-primary text-sm font-bold uppercase tracking-[0.2em] mt-2">{employee.role}</p>
                 <p className="text-muted-foreground text-xs font-mono mt-1 opacity-70">UID: {employee.id}</p>

                 <div className="mt-8 space-y-4">
                    <div className="flex items-center gap-4 group">
                       <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-muted-foreground group-hover:text-primary transition-colors">
                          <Mail size={18} />
                       </div>
                       <div>
                          <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Email Address</p>
                          <p className="text-sm font-medium">{employee.email}</p>
                       </div>
                    </div>
                    <div className="flex items-center gap-4 group">
                       <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-muted-foreground group-hover:text-primary transition-colors">
                          <Phone size={18} />
                       </div>
                       <div>
                          <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Phone Number</p>
                          <p className="text-sm font-medium">{employee.phone}</p>
                       </div>
                    </div>
                    <div className="flex items-center gap-4 group">
                       <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-muted-foreground group-hover:text-primary transition-colors">
                          <MapPin size={18} />
                       </div>
                       <div>
                          <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Office Location</p>
                          <p className="text-sm font-medium">{employee.address}</p>
                       </div>
                    </div>
                 </div>

                 <div className="mt-8 pt-8 border-t border-white/5">
                    <div className="grid grid-cols-2 gap-4">
                       <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                          <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Joining Date</p>
                          <p className="text-sm font-bold mt-1">{employee.joiningDate}</p>
                       </div>
                       <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                          <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Department</p>
                          <p className="text-sm font-bold mt-1 text-secondary">{employee.department}</p>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </GlassCard>

        {/* Work Info and Performance */}
        <div className="lg:col-span-2 space-y-8">
           {/* Quick Stats */}
           <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { label: "Completed", value: employee.stats.tasksCompleted, icon: CheckCircle2, color: "text-chart-5" },
                { label: "Pending", value: employee.stats.pendingTasks, icon: AlertCircle, color: "text-chart-4" },
                { label: "Attendance", value: employee.stats.attendance, icon: Clock, color: "text-primary" },
                { label: "Leaves", value: employee.stats.leaves, icon: Briefcase, color: "text-secondary" },
              ].map((stat, i) => (
                <GlassCard key={i} className="p-4 text-center border-white/10">
                   <stat.icon size={20} className={`${stat.color} mx-auto mb-3 opacity-80`} />
                   <p className="text-2xl font-bold tracking-tight">{stat.value}</p>
                   <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest mt-1">{stat.label}</p>
                </GlassCard>
              ))}
           </div>

           {/* Performance Chart */}
           <GlassCard className="p-8">
              <div className="flex items-center justify-between mb-8">
                <h3 className="font-bold flex items-center gap-2">
                   <TrendingUp size={18} className="text-primary" />
                   Performance Velocity
                </h3>
                <div className="flex gap-2">
                   <button className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground hover:text-white transition-all">Last 6 Weeks</button>
                   <button className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground hover:text-white transition-all">Download CSV</button>
                </div>
              </div>
              <div className="w-full h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={performanceData}>
                    <defs>
                      <linearGradient id="performanceGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#FF2E9F" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#FF2E9F" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                    <XAxis dataKey="name" hide />
                    <YAxis hide />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '12px' }}
                    />
                    <Area type="monotone" dataKey="value" stroke="#FF2E9F" strokeWidth={3} fillOpacity={1} fill="url(#performanceGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
           </GlassCard>

           {/* Tasks and Documents */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <GlassCard className="p-6">
                 <h3 className="font-bold mb-6 flex items-center gap-2 text-sm">
                   Recent Tasks
                 </h3>
                 <div className="space-y-4">
                    {[
                      { title: "UI Redesign for Dashboard", status: "Done", date: "Yesterday" },
                      { title: "API Integration for Login", status: "In Progress", date: "Today" },
                      { title: "Database Schema Update", status: "Pending", date: "In 2 days" },
                    ].map((task, i) => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 group hover:bg-white/10 transition-all cursor-pointer">
                         <div>
                            <p className="text-sm font-medium">{task.title}</p>
                            <p className="text-[10px] text-muted-foreground uppercase font-bold mt-1">{task.date}</p>
                         </div>
                         <div className={`px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-widest ${
                            task.status === 'Done' ? 'bg-chart-5/10 text-chart-5' : 
                            task.status === 'In Progress' ? 'bg-primary/10 text-primary' : 'bg-chart-4/10 text-chart-4'
                         }`}>
                            {task.status}
                         </div>
                      </div>
                    ))}
                 </div>
              </GlassCard>

              <GlassCard className="p-6">
                 <h3 className="font-bold mb-6 flex items-center gap-2 text-sm">
                   Documents
                 </h3>
                 <div className="space-y-4">
                    {[
                      { name: "Resume_Rahul.pdf", size: "1.2 MB" },
                      { name: "Aadhar_Verification.pdf", size: "450 KB" },
                      { name: "Joining_Letter.pdf", size: "890 KB" },
                    ].map((doc, i) => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 group hover:border-primary/50 transition-all">
                         <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-white/5 text-muted-foreground">
                               <Calendar size={16} />
                            </div>
                            <div>
                               <p className="text-sm font-medium">{doc.name}</p>
                               <p className="text-[10px] text-muted-foreground uppercase font-bold mt-1">{doc.size}</p>
                            </div>
                         </div>
                         <button className="p-2 hover:bg-white/10 rounded-lg text-primary">
                            <Download size={16} />
                         </button>
                      </div>
                    ))}
                 </div>
              </GlassCard>
           </div>
        </div>
      </div>
    </div>
  );
}
