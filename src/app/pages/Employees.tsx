import { useState } from "react";
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Grid2X2, 
  List, 
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  UserCheck,
  UserX
} from "lucide-react";
import { GlassCard, Button } from "../components/UI";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "react-router";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

const employees = [
  { 
    id: "EMP-001", 
    name: "Rahul Sharma", 
    role: "Senior Developer", 
    department: "Engineering", 
    status: "active", 
    email: "rahul@nexus.ai", 
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop" 
  },
  { 
    id: "EMP-002", 
    name: "Jessica Lee", 
    role: "UI/UX Designer", 
    department: "Design", 
    status: "active", 
    email: "jess@nexus.ai", 
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop" 
  },
  { 
    id: "EMP-003", 
    name: "Mark Thompson", 
    role: "Cloud Architect", 
    department: "Engineering", 
    status: "inactive", 
    email: "mark@nexus.ai", 
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop" 
  },
  { 
    id: "EMP-004", 
    name: "Sofia Rodriguez", 
    role: "Marketing Manager", 
    department: "Marketing", 
    status: "active", 
    email: "sofia@nexus.ai", 
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop" 
  },
  { 
    id: "EMP-005", 
    name: "Alex Johnson", 
    role: "Backend Engineer", 
    department: "Engineering", 
    status: "active", 
    email: "alex@nexus.ai", 
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=200&auto=format&fit=crop" 
  },
  { 
    id: "EMP-006", 
    name: "Priya Patel", 
    role: "Sales Executive", 
    department: "Sales", 
    status: "active", 
    email: "priya@nexus.ai", 
    avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=200&auto=format&fit=crop" 
  },
];

export default function Employees() {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredEmployees = employees.filter(emp => 
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    emp.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Team <span className="gradient-text">Directory</span></h2>
          <p className="text-muted-foreground mt-1">Manage and monitor your futuristic workforce.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-white/5 border border-white/10 rounded-xl p-1">
             <button 
              onClick={() => setView("grid")}
              className={`p-2 rounded-lg transition-all ${view === "grid" ? "bg-primary text-white shadow-[0_0_15px_rgba(123,47,247,0.4)]" : "text-muted-foreground hover:text-white"}`}
             >
               <Grid2X2 size={18} />
             </button>
             <button 
              onClick={() => setView("list")}
              className={`p-2 rounded-lg transition-all ${view === "list" ? "bg-primary text-white shadow-[0_0_15px_rgba(123,47,247,0.4)]" : "text-muted-foreground hover:text-white"}`}
             >
               <List size={18} />
             </button>
          </div>
          <Link to="/employees/add">
            <Button className="h-11 shadow-[0_0_20px_rgba(123,47,247,0.3)]">
              <Plus size={18} />
              Add Employee
            </Button>
          </Link>
        </div>
      </header>

      <GlassCard className="p-2 border-white/5">
        <div className="flex items-center gap-4 px-4 py-2">
           <Search size={20} className="text-muted-foreground" />
           <input 
            type="text" 
            placeholder="Search by name, role or department..." 
            className="flex-1 bg-transparent border-none focus:ring-0 text-white placeholder:text-muted-foreground/60"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
           />
           <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm font-bold hover:bg-white/10 transition-all">
             <Filter size={16} />
             Filters
           </button>
        </div>
      </GlassCard>

      <AnimatePresence mode="wait">
        {view === "grid" ? (
          <motion.div 
            key="grid"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6"
          >
            {filteredEmployees.map((emp, i) => (
              <GlassCard key={emp.id} className="group p-0 overflow-hidden">
                <div className="h-24 gradient-bg/20 relative">
                   <div className="absolute top-4 right-4 flex gap-2">
                      <div className={`w-2 h-2 rounded-full ${emp.status === 'active' ? 'bg-chart-5 shadow-[0_0_8px_#00FF94]' : 'bg-muted shadow-none'}`} />
                   </div>
                </div>
                <div className="px-6 pb-6 relative">
                   <div className="absolute -top-10 left-6 w-20 h-20 rounded-2xl p-[2px] gradient-bg shadow-xl">
                      <div className="w-full h-full rounded-[14px] overflow-hidden bg-black/80">
                        <ImageWithFallback 
                          src={emp.avatar} 
                          alt={emp.name} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                   </div>
                   <div className="pt-12">
                      <div className="flex items-center justify-between">
                         <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{emp.name}</h3>
                         <button className="p-1.5 hover:bg-white/5 rounded-lg text-muted-foreground">
                            <MoreVertical size={16} />
                         </button>
                      </div>
                      <p className="text-primary text-xs uppercase font-bold tracking-[0.2em] mt-1">{emp.role}</p>
                      
                      <div className="mt-6 flex flex-wrap gap-2">
                         <span className="px-3 py-1 rounded-lg bg-white/5 border border-white/5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{emp.department}</span>
                         <span className="px-3 py-1 rounded-lg bg-white/5 border border-white/5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{emp.id}</span>
                      </div>

                      <div className="mt-8 flex gap-3">
                         <Link to={`/employees/${emp.id}`} className="flex-1">
                            <Button variant="outline" className="w-full py-2.5 rounded-xl border-white/10 text-xs">
                               View Profile
                            </Button>
                         </Link>
                         <button className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-primary/50 text-muted-foreground hover:text-primary transition-all">
                            <ShieldCheck size={18} />
                         </button>
                      </div>
                   </div>
                </div>
              </GlassCard>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            key="list"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass-morphism rounded-2xl border border-white/5 overflow-hidden"
          >
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-white/5 text-left">
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">Employee</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">Role / Dept</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">Status</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">ID Number</th>
                  <th className="px-6 py-4 text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredEmployees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl overflow-hidden p-[1px] gradient-bg/50">
                          <ImageWithFallback src={emp.avatar} alt={emp.name} className="w-full h-full object-cover rounded-[9px]" />
                        </div>
                        <div>
                          <p className="font-bold text-sm group-hover:text-primary transition-colors">{emp.name}</p>
                          <p className="text-xs text-muted-foreground">{emp.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium">{emp.role}</p>
                      <p className="text-xs text-muted-foreground">{emp.department}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {emp.status === 'active' ? (
                          <span className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-chart-5/10 text-chart-5 text-[10px] font-bold uppercase tracking-wider">
                            <UserCheck size={10} /> Active
                          </span>
                        ) : (
                          <span className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white/5 text-muted-foreground text-[10px] font-bold uppercase tracking-wider">
                            <UserX size={10} /> Inactive
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-mono text-muted-foreground bg-white/5 px-2 py-1 rounded">{emp.id}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                       <Link to={`/employees/${emp.id}`}>
                         <button className="p-2 hover:bg-primary/20 rounded-xl transition-all text-muted-foreground hover:text-primary">
                            <ExternalLink size={18} />
                         </button>
                       </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
