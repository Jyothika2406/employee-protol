import { BarChart3, TrendingUp, PieChart as PieChartIcon, Download } from "lucide-react";
import { GlassCard, Button } from "../components/UI";

export default function Reports() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Analytical <span className="gradient-text">Reports</span></h2>
          <p className="text-muted-foreground mt-1">Deep dive into organizational performance data.</p>
        </div>
        <Button>
           <Download size={18} />
           Export All Data
        </Button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         <GlassCard className="p-8 h-64 flex flex-col justify-between">
            <div>
               <BarChart3 className="text-primary mb-4" size={32} />
               <h3 className="font-bold">Efficiency Report</h3>
               <p className="text-muted-foreground text-xs mt-2">Monthly productivity metrics across all departments.</p>
            </div>
            <button className="text-primary text-xs font-bold uppercase tracking-widest text-left">View Analysis</button>
         </GlassCard>
         <GlassCard className="p-8 h-64 flex flex-col justify-between">
            <div>
               <TrendingUp className="text-secondary mb-4" size={32} />
               <h3 className="font-bold">Growth Projection</h3>
               <p className="text-muted-foreground text-xs mt-2">Forecasting workforce expansion and resource needs.</p>
            </div>
            <button className="text-secondary text-xs font-bold uppercase tracking-widest text-left">View Projections</button>
         </GlassCard>
         <GlassCard className="p-8 h-64 flex flex-col justify-between">
            <div>
               <PieChartIcon className="text-chart-5 mb-4" size={32} />
               <h3 className="font-bold">Resource Allocation</h3>
               <p className="text-muted-foreground text-xs mt-2">Budget distribution and personnel utilization.</p>
            </div>
            <button className="text-chart-5 text-xs font-bold uppercase tracking-widest text-left">View Allocation</button>
         </GlassCard>
      </div>
    </div>
  );
}
