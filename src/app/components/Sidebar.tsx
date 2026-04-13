import { NavLink } from "react-router";
import { 
  LayoutDashboard, 
  Users, 
  CheckSquare, 
  IdCard, 
  BarChart3, 
  Settings, 
  LogOut,
  Zap
} from "lucide-react";
import { motion } from "motion/react";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/" },
  { icon: Users, label: "Employees", path: "/employees" },
  { icon: CheckSquare, label: "Tasks", path: "/tasks" },
  { icon: IdCard, label: "ID Cards", path: "/id-cards" },
  { icon: BarChart3, label: "Reports", path: "/reports" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

export default function Sidebar() {
  return (
    <motion.aside 
      initial={{ x: -280 }}
      animate={{ x: 0 }}
      className="w-64 glass-morphism flex flex-col z-50 border-r border-white/5 relative"
    >
      <div className="p-8 flex items-center gap-3">
        <div className="w-10 h-10 gradient-bg rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(123,47,247,0.4)]">
          <Zap className="text-white fill-white" size={24} />
        </div>
        <h1 className="text-xl font-bold tracking-tight">
          NEXUS<span className="text-primary">.</span>
        </h1>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden
              ${isActive 
                ? "bg-primary/20 text-white border border-primary/30" 
                : "text-muted-foreground hover:text-white hover:bg-white/5"}
            `}
          >
            {({ isActive }) => (
              <>
                <item.icon 
                  size={20} 
                  className={`transition-colors duration-300 ${isActive ? "text-primary drop-shadow-[0_0_8px_rgba(123,47,247,0.8)]" : "group-hover:text-white"}`} 
                />
                <span className="font-medium">{item.label}</span>
                {isActive && (
                  <motion.div 
                    layoutId="active-pill"
                    className="absolute left-0 w-1 h-6 gradient-bg rounded-r-full"
                  />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 mt-auto">
        <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:text-destructive transition-colors w-full group">
          <LogOut size={20} className="group-hover:rotate-180 transition-transform duration-500" />
          <span className="font-medium">Logout</span>
        </button>
      </div>

      {/* Decorative Blur */}
      <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-primary/20 blur-[100px] rounded-full -z-10" />
    </motion.aside>
  );
}
