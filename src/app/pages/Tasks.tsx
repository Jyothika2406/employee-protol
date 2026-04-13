import { useState } from "react";
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Users,
  LayoutGrid,
  List as ListIcon,
  Filter,
  ArrowRight,
  GripVertical
} from "lucide-react";
import { GlassCard, Button } from "../components/UI";
import { motion, Reorder } from "motion/react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

const initialTasks = {
  todo: [
    { id: "T-101", title: "Redesign Employee Onboarding", priority: "High", deadline: "12 Apr", assignedTo: "Jessica Lee", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop" },
    { id: "T-102", title: "Fix Dashboard Sidebar Glow", priority: "Medium", deadline: "14 Apr", assignedTo: "Rahul Sharma", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop" },
  ],
  inProgress: [
    { id: "T-103", title: "API Integration for ID Generator", priority: "High", deadline: "Today", assignedTo: "Alex Johnson", avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=100&auto=format&fit=crop" },
  ],
  done: [
    { id: "T-104", title: "Setup Database Schema", priority: "Low", deadline: "8 Apr", assignedTo: "Mark Thompson", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100&auto=format&fit=crop" },
  ]
};

const PriorityBadge = ({ priority }: { priority: string }) => {
  const colors = {
    High: "bg-destructive/10 text-destructive border-destructive/20",
    Medium: "bg-chart-4/10 text-chart-4 border-chart-4/20",
    Low: "bg-chart-5/10 text-chart-5 border-chart-5/20",
  };
  return (
    <span className={`px-2 py-0.5 rounded-lg text-[9px] font-bold uppercase tracking-widest border ${colors[priority as keyof typeof colors]}`}>
      {priority}
    </span>
  );
};

export default function Tasks() {
  const [tasks, setTasks] = useState(initialTasks);
  const [view, setView] = useState<"kanban" | "list">("kanban");

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Mission <span className="gradient-text">Control</span></h2>
          <p className="text-muted-foreground mt-1">Track and assign tasks to your elite squad.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-white/5 border border-white/10 rounded-xl p-1">
             <button 
              onClick={() => setView("kanban")}
              className={`p-2 rounded-lg transition-all ${view === "kanban" ? "bg-primary text-white" : "text-muted-foreground"}`}
             >
               <LayoutGrid size={18} />
             </button>
             <button 
              onClick={() => setView("list")}
              className={`p-2 rounded-lg transition-all ${view === "list" ? "bg-primary text-white" : "text-muted-foreground"}`}
             >
               <ListIcon size={18} />
             </button>
          </div>
          <Button>
            <Plus size={18} />
            Create Task
          </Button>
        </div>
      </header>

      <GlassCard className="p-2 border-white/5">
        <div className="flex items-center gap-4 px-4 py-2">
           <Search size={20} className="text-muted-foreground" />
           <input 
            type="text" 
            placeholder="Search tasks, IDs, or members..." 
            className="flex-1 bg-transparent border-none focus:ring-0 text-white"
           />
           <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm font-bold hover:bg-white/10 transition-all">
             <Filter size={16} />
             Filters
           </button>
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
        {/* Todo Column */}
        <div className="space-y-4">
           <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-2">
                 <div className="w-2.5 h-2.5 rounded-full bg-chart-4" />
                 <h3 className="font-bold text-sm uppercase tracking-widest">To Do</h3>
                 <span className="px-2 py-0.5 rounded-lg bg-white/5 border border-white/10 text-[10px] font-bold text-muted-foreground">{tasks.todo.length}</span>
              </div>
              <button className="p-1 hover:bg-white/5 rounded-lg"><Plus size={16} className="text-muted-foreground" /></button>
           </div>
           
           <div className="space-y-4 h-[calc(100vh-420px)] overflow-y-auto custom-scrollbar pr-2">
              {tasks.todo.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
           </div>
        </div>

        {/* In Progress Column */}
        <div className="space-y-4">
           <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-2">
                 <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                 <h3 className="font-bold text-sm uppercase tracking-widest">In Progress</h3>
                 <span className="px-2 py-0.5 rounded-lg bg-white/5 border border-white/10 text-[10px] font-bold text-muted-foreground">{tasks.inProgress.length}</span>
              </div>
              <button className="p-1 hover:bg-white/5 rounded-lg"><Plus size={16} className="text-muted-foreground" /></button>
           </div>
           
           <div className="space-y-4 h-[calc(100vh-420px)] overflow-y-auto custom-scrollbar pr-2">
              {tasks.inProgress.map((task) => (
                <TaskCard key={task.id} task={task} isProgress />
              ))}
           </div>
        </div>

        {/* Done Column */}
        <div className="space-y-4">
           <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-2">
                 <div className="w-2.5 h-2.5 rounded-full bg-chart-5" />
                 <h3 className="font-bold text-sm uppercase tracking-widest">Done</h3>
                 <span className="px-2 py-0.5 rounded-lg bg-white/5 border border-white/10 text-[10px] font-bold text-muted-foreground">{tasks.done.length}</span>
              </div>
              <button className="p-1 hover:bg-white/5 rounded-lg"><Plus size={16} className="text-muted-foreground" /></button>
           </div>
           
           <div className="space-y-4 h-[calc(100vh-420px)] overflow-y-auto custom-scrollbar pr-2">
              {tasks.done.map((task) => (
                <TaskCard key={task.id} task={task} isDone />
              ))}
           </div>
        </div>
      </div>
    </div>
  );
}

function TaskCard({ task, isProgress, isDone }: { task: any, isProgress?: boolean, isDone?: boolean }) {
   return (
      <GlassCard className={`p-5 group cursor-grab active:cursor-grabbing border-l-4 ${isProgress ? 'border-l-primary' : isDone ? 'border-l-chart-5' : 'border-l-chart-4'}`}>
         <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-mono text-muted-foreground bg-white/5 px-2 py-0.5 rounded">{task.id}</span>
            <PriorityBadge priority={task.priority} />
         </div>
         <h4 className={`font-bold mb-4 leading-relaxed ${isDone ? 'line-through opacity-50' : ''}`}>
            {task.title}
         </h4>
         
         <div className="flex items-center justify-between pt-4 border-t border-white/5">
            <div className="flex items-center gap-2">
               <div className="w-7 h-7 rounded-lg overflow-hidden border border-white/10">
                  <ImageWithFallback src={task.avatar} alt={task.assignedTo} className="w-full h-full object-cover" />
               </div>
               <span className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">{task.assignedTo.split(' ')[0]}</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
               <Clock size={12} />
               <span className="text-[10px] font-bold uppercase tracking-widest">{task.deadline}</span>
            </div>
         </div>
      </GlassCard>
   );
}
