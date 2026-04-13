import { 
  Users, 
  CheckCircle2, 
  Clock, 
  UserPlus, 
  TrendingUp,
  Activity,
  ArrowUpRight,
  MoreVertical
} from "lucide-react";
import { motion } from "motion/react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { GlassCard } from "../components/UI";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

const stats = [
  { label: "Total Employees", value: "2,543", change: "+12.5%", icon: Users, color: "primary" },
  { label: "Active Now", value: "1,204", change: "+3.2%", icon: Activity, color: "secondary" },
  { label: "Tasks Done", value: "45,892", change: "+18.4%", icon: CheckCircle2, color: "chart-5" },
  { label: "Pending Tasks", value: "128", change: "-5.1%", icon: Clock, color: "chart-4" },
];

const growthData = [
  { name: "Jan", value: 4000 },
  { name: "Feb", value: 3000 },
  { name: "Mar", value: 2000 },
  { name: "Apr", value: 2780 },
  { name: "May", value: 1890 },
  { name: "Jun", value: 2390 },
  { name: "Jul", value: 3490 },
];

const taskDistribution = [
  { name: "Completed", value: 400, color: "#7B2FF7" },
  { name: "In Progress", value: 300, color: "#FF2E9F" },
  { name: "Pending", value: 300, color: "#FFB800" },
];

const recentActivity = [
  { 
    id: 1, 
    user: "Rahul Sharma", 
    action: "completed Task #23", 
    time: "2 mins ago", 
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop" 
  },
  { 
    id: 2, 
    user: "Jessica Lee", 
    action: "joined as Developer", 
    time: "1 hour ago", 
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop" 
  },
  { 
    id: 3, 
    user: "Mark Thompson", 
    action: "updated Task #104", 
    time: "3 hours ago", 
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100&auto=format&fit=crop" 
  },
];

export default function Dashboard() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <header className="flex items-end justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">System <span className="gradient-text">Overview</span></h2>
          <p className="text-muted-foreground mt-1">Real-time pulse of your organization metrics.</p>
        </div>
        <div className="flex gap-3">
          <GlassCard className="px-4 py-2 flex items-center gap-2 cursor-pointer border-white/10 hover:border-primary/50 transition-colors">
            <span className="text-xs font-bold uppercase tracking-widest text-primary">Export Report</span>
            <ArrowUpRight size={14} className="text-primary" />
          </GlassCard>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <GlassCard key={i} className="p-6 group relative overflow-hidden">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/20 transition-all duration-500" />
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-2xl bg-${stat.color}/10 text-${stat.color} group-hover:scale-110 transition-transform duration-500 shadow-[0_0_15px_rgba(0,0,0,0.2)]`}>
                <stat.icon size={24} />
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${stat.change.startsWith('+') ? 'text-chart-5 bg-chart-5/10' : 'text-destructive bg-destructive/10'}`}>
                {stat.change}
              </span>
            </div>
            <h4 className="text-muted-foreground text-sm font-medium">{stat.label}</h4>
            <p className="text-3xl font-bold mt-1 tracking-tight">{stat.value}</p>
          </GlassCard>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GlassCard className="lg:col-span-2 p-8 h-[400px]">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold flex items-center gap-2">
              <TrendingUp size={18} className="text-primary" />
              Employee Growth
            </h3>
            <div className="flex gap-2">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-xs font-medium cursor-pointer hover:bg-white/10">
                Weekly
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/20 border border-primary/20 text-primary text-xs font-bold cursor-pointer">
                Monthly
              </div>
            </div>
          </div>
          <div className="w-full h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={growthData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7B2FF7" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#7B2FF7" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#666', fontSize: 12}} 
                  dy={10}
                />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(26,26,26,0.95)', 
                    borderColor: 'rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#7B2FF7" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorValue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard className="p-8 h-[400px]">
          <h3 className="font-bold mb-8">Task Distribution</h3>
          <div className="w-full h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={taskDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {taskDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3 mt-4">
            {taskDistribution.map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-muted-foreground">{item.name}</span>
                </div>
                <span className="text-sm font-bold">{item.value}%</span>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         <GlassCard className="p-8">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-bold">Recent Activity</h3>
              <button className="text-primary text-sm font-bold hover:underline">View All</button>
            </div>
            <div className="space-y-6">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl overflow-hidden border border-white/10 p-[1px] gradient-bg/50">
                    <ImageWithFallback 
                      src={activity.avatar} 
                      alt={activity.user} 
                      className="w-full h-full object-cover rounded-[10px]"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm">
                      <span className="font-bold text-white">{activity.user}</span>
                      {" "}
                      <span className="text-muted-foreground">{activity.action}</span>
                    </p>
                    <p className="text-[10px] text-muted-foreground/60 uppercase font-bold tracking-widest mt-1">
                      {activity.time}
                    </p>
                  </div>
                  <button className="p-1 hover:bg-white/5 rounded-lg">
                    <MoreVertical size={16} className="text-muted-foreground" />
                  </button>
                </div>
              ))}
            </div>
         </GlassCard>

         <GlassCard className="p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8">
               <UserPlus size={48} className="text-primary/10 group-hover:text-primary/20 group-hover:scale-110 transition-all duration-500" />
            </div>
            <h3 className="font-bold mb-2">Hire New Talent</h3>
            <p className="text-muted-foreground mb-8 max-w-[280px]">Expand your futuristic workforce and assign tasks instantly.</p>
            <div className="flex flex-col gap-3">
               <button className="gradient-bg px-6 py-4 rounded-2xl font-bold flex items-center justify-between group shadow-[0_10px_20px_rgba(123,47,247,0.3)]">
                  Add New Employee
                  <ArrowUpRight className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
               </button>
               <button className="bg-white/5 border border-white/10 px-6 py-4 rounded-2xl font-bold text-center hover:bg-white/10 transition-colors">
                  Post Job Opening
               </button>
            </div>
         </GlassCard>
      </div>
    </div>
  );
}
