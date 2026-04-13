import { 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Globe, 
  Database,
  ChevronRight,
  ExternalLink,
  Save,
  Moon,
  Sun,
  Monitor
} from "lucide-react";
import { GlassCard, Button } from "../components/UI";
import { motion } from "motion/react";
import { toast } from "sonner";

const settingsGroups = [
  {
    title: "Account Information",
    icon: User,
    items: [
      { label: "Profile Settings", description: "Manage your name, avatar and email address", path: "#" },
      { label: "Security & Password", description: "Change password and enable 2FA", path: "#" },
    ]
  },
  {
    title: "Preferences",
    icon: Palette,
    items: [
      { label: "Appearance", description: "Customize colors and dark/light modes", path: "#" },
      { label: "Language & Region", description: "Set your default system language", path: "#" },
    ]
  },
  {
    title: "Notifications",
    icon: Bell,
    items: [
      { label: "Alert Configuration", description: "Email and push notifications settings", path: "#" },
      { label: "Quiet Hours", description: "Set periods of no notifications", path: "#" },
    ]
  },
  {
    title: "System & Data",
    icon: Database,
    items: [
      { label: "Data Backups", description: "Automatic backup configuration", path: "#" },
      { label: "API Integrations", description: "Manage connected services", path: "#" },
    ]
  }
];

export default function Settings() {
  const handleSave = () => {
    toast.success("Settings saved successfully!");
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">System <span className="gradient-text">Configuration</span></h2>
          <p className="text-muted-foreground mt-1">Control the nexus parameters and core preferences.</p>
        </div>
        <Button onClick={handleSave}>
           <Save size={18} />
           Save Changes
        </Button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Nav */}
        <div className="lg:col-span-1 space-y-2">
           {settingsGroups.map((group, i) => (
              <button 
                key={i}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 text-left ${i === 0 ? 'bg-primary/20 text-white border border-primary/20' : 'text-muted-foreground hover:text-white hover:bg-white/5'}`}
              >
                 <group.icon size={20} className={i === 0 ? "text-primary" : ""} />
                 <span className="font-bold text-sm">{group.title}</span>
              </button>
           ))}
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3 space-y-6">
           {settingsGroups.map((group, i) => (
              <GlassCard key={i} className="p-8">
                 <h3 className="font-bold mb-6 flex items-center gap-2">
                    <group.icon size={18} className="text-primary" />
                    {group.title}
                 </h3>
                 <div className="space-y-4">
                    {group.items.map((item, j) => (
                       <div key={j} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 group hover:bg-white/10 transition-all cursor-pointer">
                          <div>
                             <p className="font-bold text-sm group-hover:text-primary transition-colors">{item.label}</p>
                             <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
                          </div>
                          <ChevronRight size={18} className="text-muted-foreground group-hover:text-primary transition-all group-hover:translate-x-1" />
                       </div>
                    ))}
                 </div>
              </GlassCard>
           ))}

           <GlassCard className="p-8 border-destructive/10 bg-destructive/5 overflow-hidden relative">
              <div className="absolute -right-10 -bottom-10 opacity-10">
                 <Shield size={160} className="text-destructive" />
              </div>
              <h3 className="font-bold text-destructive mb-2 flex items-center gap-2">
                 <Shield size={18} />
                 Danger Zone
              </h3>
              <p className="text-muted-foreground text-xs leading-relaxed max-w-md">Once you delete your organization data or reset settings, there is no going back. Please be certain before taking these actions.</p>
              <div className="mt-8 flex gap-4">
                 <button className="px-6 py-3 rounded-xl bg-destructive text-white font-bold text-xs hover:bg-destructive/90 transition-all shadow-[0_4px_15px_rgba(212,24,61,0.3)]">
                    Reset All Settings
                 </button>
                 <button className="px-6 py-3 rounded-xl border border-destructive/20 text-destructive font-bold text-xs hover:bg-destructive/10 transition-all">
                    Deactivate Account
                 </button>
              </div>
           </GlassCard>
        </div>
      </div>
    </div>
  );
}
