import { Search, Bell, User, MessageCircle } from "lucide-react";
import { motion } from "motion/react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export default function Navbar() {
  return (
    <header className="h-20 glass-morphism border-b border-white/5 flex items-center justify-between px-8 relative z-40 backdrop-blur-xl bg-black/40">
      <div className="flex-1 max-w-xl">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search dashboard, employees, tasks..." 
            className="w-full pl-12 pr-4 h-11 bg-white/5 border border-white/5 rounded-2xl focus:bg-white/10 focus:border-primary/50 transition-all focus:ring-4 focus:ring-primary/10"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button className="relative p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-muted-foreground hover:text-white transition-all">
          <MessageCircle size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-secondary rounded-full shadow-[0_0_8px_rgba(255,46,159,0.8)]" />
        </button>

        <button className="relative p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-muted-foreground hover:text-white transition-all">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full shadow-[0_0_8px_rgba(123,47,247,0.8)] animate-pulse" />
        </button>

        <div className="h-10 w-px bg-white/10 mx-2" />

        <div className="flex items-center gap-4 group cursor-pointer p-1.5 rounded-2xl transition-all">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold tracking-wide">Alex Rivers</p>
            <p className="text-[10px] uppercase font-bold text-primary/80 tracking-[0.2em]">Super Admin</p>
          </div>
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-11 h-11 rounded-xl p-[2px] gradient-bg shadow-[0_0_15px_rgba(123,47,247,0.3)] overflow-hidden"
          >
            <div className="w-full h-full rounded-[10px] overflow-hidden bg-black/80">
               <ImageWithFallback 
                src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=100&auto=format&fit=crop" 
                alt="Admin Avatar"
                className="w-full h-full object-cover grayscale-[20%]"
               />
            </div>
          </motion.div>
        </div>
      </div>
    </header>
  );
}
