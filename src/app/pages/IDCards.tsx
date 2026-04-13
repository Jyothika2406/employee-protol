import { useState } from "react";
import { 
  Download, 
  Printer, 
  Search, 
  Plus, 
  QrCode, 
  MoreHorizontal, 
  ExternalLink,
  ShieldCheck,
  UserPlus,
  RefreshCw,
  Zap
} from "lucide-react";
import { GlassCard, Button } from "../components/UI";
import { motion, AnimatePresence } from "motion/react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { toast } from "sonner";

const employees = [
  { id: "EMP-001", name: "Rahul Sharma", role: "Senior Developer", dept: "Engineering", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop" },
  { id: "EMP-002", name: "Jessica Lee", role: "UI/UX Designer", dept: "Design", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop" },
  { id: "EMP-003", name: "Mark Thompson", role: "Cloud Architect", dept: "Engineering", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop" },
];

export default function IDCards() {
  const [selectedEmployee, setSelectedEmployee] = useState(employees[0]);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      toast.success("ID Card Generated Successfully!");
    }, 1500);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Access <span className="gradient-text">Protocol</span></h2>
          <p className="text-muted-foreground mt-1">Generate and manage digital identity access cards.</p>
        </div>
        <div className="flex items-center gap-3">
           <Button variant="outline" onClick={() => toast.info("Printing multiple cards...")}>
              <Printer size={18} />
              Bulk Print
           </Button>
           <Button onClick={() => toast.success("Preparing PDF download...")}>
              <Download size={18} />
              Export All
           </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left: Generation Controls */}
        <div className="lg:col-span-2 space-y-6">
           <GlassCard className="p-8">
              <h3 className="font-bold mb-6 flex items-center gap-2">
                 <ShieldCheck size={18} className="text-primary" />
                 ID Card Generator
              </h3>
              
              <div className="space-y-6">
                 <div>
                    <label className="block mb-2 font-bold uppercase text-[10px] tracking-widest text-muted-foreground">Select Employee</label>
                    <div className="grid grid-cols-1 gap-2">
                       {employees.map((emp) => (
                          <div 
                            key={emp.id}
                            onClick={() => setSelectedEmployee(emp)}
                            className={`p-3 rounded-xl border cursor-pointer flex items-center gap-3 transition-all ${
                               selectedEmployee.id === emp.id 
                               ? 'bg-primary/20 border-primary shadow-[0_0_15px_rgba(123,47,247,0.2)]' 
                               : 'bg-white/5 border-white/5 hover:bg-white/10'
                            }`}
                          >
                             <div className="w-8 h-8 rounded-lg overflow-hidden border border-white/10">
                                <ImageWithFallback src={emp.avatar} alt={emp.name} className="w-full h-full object-cover" />
                             </div>
                             <div className="flex-1">
                                <p className="text-xs font-bold">{emp.name}</p>
                                <p className="text-[10px] text-muted-foreground">{emp.id}</p>
                             </div>
                             {selectedEmployee.id === emp.id && <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(123,47,247,1)]" />}
                          </div>
                       ))}
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div>
                       <label className="block mb-2 font-bold uppercase text-[10px] tracking-widest text-muted-foreground">Access Level</label>
                       <select className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-2 text-xs focus:ring-1 focus:ring-primary outline-none appearance-none">
                          <option>Level 01 - Guest</option>
                          <option>Level 02 - Staff</option>
                          <option>Level 03 - Management</option>
                          <option>Level 04 - Admin</option>
                       </select>
                    </div>
                    <div>
                       <label className="block mb-2 font-bold uppercase text-[10px] tracking-widest text-muted-foreground">Expiry Date</label>
                       <input type="date" className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-2 text-xs focus:ring-1 focus:ring-primary outline-none" defaultValue="2027-01-01" />
                    </div>
                 </div>

                 <Button 
                   className="w-full h-12 shadow-[0_0_20px_rgba(123,47,247,0.3)] mt-4"
                   onClick={handleGenerate}
                   disabled={isGenerating}
                 >
                    {isGenerating ? (
                       <RefreshCw className="animate-spin" size={18} />
                    ) : (
                       <>
                         <Plus size={18} />
                         Generate New Card
                       </>
                    )}
                 </Button>
              </div>
           </GlassCard>

           <GlassCard className="p-8 group relative overflow-hidden bg-secondary/5 border-secondary/10">
              <div className="absolute top-0 right-0 p-8">
                 <Zap size={32} className="text-secondary/10 group-hover:text-secondary/20 transition-all" />
              </div>
              <h3 className="font-bold mb-2">QR Authentication</h3>
              <p className="text-muted-foreground text-xs leading-relaxed max-w-[200px]">Enable QR-based entry protocols for high-security areas within Nexus Hub.</p>
              <button className="mt-6 text-xs font-bold text-secondary uppercase tracking-[0.2em] flex items-center gap-2 group-hover:gap-3 transition-all cursor-pointer">
                 Configure QR Protocol <ExternalLink size={12} />
              </button>
           </GlassCard>
        </div>

        {/* Right: ID Card Preview */}
        <div className="lg:col-span-3">
           <GlassCard className="p-12 min-h-[500px] flex items-center justify-center relative overflow-hidden bg-black/40 border-white/5">
              <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                 <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary to-transparent animate-pulse" />
                 <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-secondary to-transparent animate-pulse delay-75" />
              </div>

              <AnimatePresence mode="wait">
                <motion.div 
                  key={selectedEmployee.id}
                  initial={{ opacity: 0, rotateY: 90, scale: 0.8 }}
                  animate={{ opacity: 1, rotateY: 0, scale: 1 }}
                  exit={{ opacity: 0, rotateY: -90, scale: 0.8 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="w-[320px] h-[500px] rounded-[32px] p-px gradient-bg shadow-[0_40px_100px_-20px_rgba(123,47,247,0.5)] relative z-10"
                >
                   <div className="w-full h-full rounded-[31px] bg-black overflow-hidden flex flex-col relative">
                      {/* Card Header */}
                      <div className="p-8 flex items-center justify-between">
                         <div className="flex items-center gap-2">
                            <div className="w-8 h-8 gradient-bg rounded-lg flex items-center justify-center shadow-lg">
                               <Zap className="text-white fill-white" size={16} />
                            </div>
                            <span className="text-sm font-bold tracking-tighter">NEXUS.</span>
                         </div>
                         <div className="w-10 h-10 rounded-full bg-white/5 border border-white/5 flex items-center justify-center">
                            <ShieldCheck size={18} className="text-primary" />
                         </div>
                      </div>

                      {/* Photo Section */}
                      <div className="flex-1 px-8 flex flex-col items-center">
                         <div className="w-32 h-32 rounded-3xl p-1 bg-gradient-to-tr from-primary to-secondary shadow-2xl mt-4">
                            <div className="w-full h-full rounded-[22px] overflow-hidden bg-black">
                               <ImageWithFallback 
                                 src={selectedEmployee.avatar} 
                                 alt={selectedEmployee.name} 
                                 className="w-full h-full object-cover grayscale-[30%]"
                               />
                            </div>
                         </div>
                         
                         <div className="mt-8 text-center">
                            <h3 className="text-2xl font-bold tracking-tight">{selectedEmployee.name}</h3>
                            <p className="text-primary text-xs font-bold uppercase tracking-[0.3em] mt-2">{selectedEmployee.role}</p>
                         </div>

                         <div className="mt-12 w-full space-y-4">
                            <div className="flex justify-between items-end border-b border-white/10 pb-2">
                               <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Employee ID</p>
                               <p className="text-sm font-mono">{selectedEmployee.id}</p>
                            </div>
                            <div className="flex justify-between items-end border-b border-white/10 pb-2">
                               <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Department</p>
                               <p className="text-sm font-medium">{selectedEmployee.dept}</p>
                            </div>
                         </div>
                      </div>

                      {/* Footer / QR */}
                      <div className="p-8 bg-gradient-to-t from-white/5 to-transparent flex items-center justify-between">
                         <div className="flex flex-col gap-1">
                            <div className="flex gap-1">
                               <div className="w-1 h-1 rounded-full bg-primary" />
                               <div className="w-1 h-1 rounded-full bg-primary/50" />
                               <div className="w-1 h-1 rounded-full bg-primary/20" />
                            </div>
                            <p className="text-[8px] font-bold uppercase text-muted-foreground tracking-[0.2em]">Authorized Personnel</p>
                         </div>
                         <div className="p-2 rounded-xl bg-white text-black shadow-lg">
                            <QrCode size={40} />
                         </div>
                      </div>

                      {/* Holographic Overlays */}
                      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
                        <div className="absolute top-1/4 -left-10 w-40 h-40 bg-primary rounded-full blur-[80px]" />
                        <div className="absolute bottom-1/4 -right-10 w-40 h-40 bg-secondary rounded-full blur-[80px]" />
                      </div>
                   </div>
                </motion.div>
              </AnimatePresence>

              {/* Action Buttons Overlay */}
              <div className="absolute bottom-8 flex gap-4">
                 <button className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/50 hover:bg-primary/10 transition-all group backdrop-blur-xl">
                    <Download size={20} className="text-muted-foreground group-hover:text-primary" />
                 </button>
                 <button className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/50 hover:bg-primary/10 transition-all group backdrop-blur-xl">
                    <Printer size={20} className="text-muted-foreground group-hover:text-primary" />
                 </button>
                 <button className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/50 hover:bg-primary/10 transition-all group backdrop-blur-xl">
                    <RefreshCw size={20} className="text-muted-foreground group-hover:text-primary" />
                 </button>
              </div>
           </GlassCard>
        </div>
      </div>
    </div>
  );
}
