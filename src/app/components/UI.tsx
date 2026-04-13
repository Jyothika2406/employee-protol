import { motion } from "motion/react";
import { ReactNode } from "react";
import { cn } from "../../lib/utils";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hoverGlow?: boolean;
}

export function GlassCard({ children, className, hoverGlow = true }: GlassCardProps) {
  return (
    <motion.div
      whileHover={hoverGlow ? { 
        translateY: -4, 
        borderColor: "rgba(123, 47, 247, 0.4)",
        boxShadow: "0 10px 40px -20px rgba(123, 47, 247, 0.5)"
      } : {}}
      className={cn(
        "glass-morphism rounded-2xl border border-white/5 relative overflow-hidden transition-all duration-300",
        className
      )}
    >
      {children}
    </motion.div>
  );
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  children: ReactNode;
}

export function Button({ variant = 'primary', children, className, ...props }: ButtonProps) {
  const variants = {
    primary: "gradient-bg text-white shadow-[0_4px_15px_rgba(123,47,247,0.4)] hover:shadow-[0_8px_25px_rgba(123,47,247,0.6)]",
    secondary: "bg-white text-black hover:bg-white/90",
    outline: "bg-transparent border border-white/10 hover:border-primary/50 hover:bg-primary/5 text-white",
    ghost: "bg-transparent hover:bg-white/5 text-muted-foreground hover:text-white"
  };

  return (
    <button
      className={cn(
        "px-6 py-2.5 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
