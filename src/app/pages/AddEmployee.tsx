import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { ArrowLeft, Upload, Save } from "lucide-react";
import { GlassCard, Button } from "../components/UI";
import { motion } from "motion/react";
import { toast } from "sonner";

export default function AddEmployee() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    role: "",
    department: "",
    joiningDate: "",
    status: "active",
    address: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Employee added successfully!");
    setTimeout(() => {
      navigate("/employees");
    }, 1000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
      {/* Header */}
      <header className="flex items-center gap-4">
        <Link to="/employees">
          <button className="p-3 rounded-xl bg-white/5 border border-white/5 text-muted-foreground hover:text-white hover:bg-white/10 transition-all">
            <ArrowLeft size={20} />
          </button>
        </Link>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Add New <span className="gradient-text">Employee</span></h2>
          <p className="text-muted-foreground mt-1">Onboard a new team member to the system.</p>
        </div>
      </header>

      {/* Form */}
      <GlassCard className="p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Profile Image Upload */}
          <div>
            <label className="block mb-3 font-bold uppercase text-[10px] tracking-widest text-muted-foreground">Profile Photo</label>
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-[0_0_20px_rgba(123,47,247,0.3)]">
                <Upload size={32} className="text-white" />
              </div>
              <div>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  id="profilePhoto"
                />
                <label htmlFor="profilePhoto">
                  <Button type="button" variant="outline" className="cursor-pointer" onClick={() => document.getElementById('profilePhoto')?.click()}>
                    <Upload size={18} />
                    Upload Photo
                  </Button>
                </label>
                <p className="text-xs text-muted-foreground mt-2">Recommended: Square image, at least 400x400px</p>
              </div>
            </div>
          </div>

          {/* Full Name */}
          <div>
            <label htmlFor="fullName" className="block mb-2 font-bold uppercase text-[10px] tracking-widest text-muted-foreground">
              Full Name *
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              required
              value={formData.fullName}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
              placeholder="Enter full name"
            />
          </div>

          {/* Email & Phone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="email" className="block mb-2 font-bold uppercase text-[10px] tracking-widest text-muted-foreground">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                placeholder="email@nexus.ai"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block mb-2 font-bold uppercase text-[10px] tracking-widest text-muted-foreground">
                Phone Number *
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                placeholder="+91 98765 43210"
              />
            </div>
          </div>

          {/* Role & Department */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="role" className="block mb-2 font-bold uppercase text-[10px] tracking-widest text-muted-foreground">
                Job Role *
              </label>
              <select
                id="role"
                name="role"
                required
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all appearance-none"
              >
                <option value="">Select role</option>
                <option value="Senior Developer">Senior Developer</option>
                <option value="Developer">Developer</option>
                <option value="UI/UX Designer">UI/UX Designer</option>
                <option value="Product Manager">Product Manager</option>
                <option value="Cloud Architect">Cloud Architect</option>
                <option value="Marketing Manager">Marketing Manager</option>
                <option value="Sales Executive">Sales Executive</option>
                <option value="HR Manager">HR Manager</option>
              </select>
            </div>

            <div>
              <label htmlFor="department" className="block mb-2 font-bold uppercase text-[10px] tracking-widest text-muted-foreground">
                Department *
              </label>
              <select
                id="department"
                name="department"
                required
                value={formData.department}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all appearance-none"
              >
                <option value="">Select department</option>
                <option value="Engineering">Engineering</option>
                <option value="Design">Design</option>
                <option value="Product">Product</option>
                <option value="Marketing">Marketing</option>
                <option value="Sales">Sales</option>
                <option value="Human Resources">Human Resources</option>
              </select>
            </div>
          </div>

          {/* Joining Date & Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="joiningDate" className="block mb-2 font-bold uppercase text-[10px] tracking-widest text-muted-foreground">
                Joining Date *
              </label>
              <input
                type="date"
                id="joiningDate"
                name="joiningDate"
                required
                value={formData.joiningDate}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
              />
            </div>

            <div>
              <label htmlFor="status" className="block mb-2 font-bold uppercase text-[10px] tracking-widest text-muted-foreground">
                Status *
              </label>
              <select
                id="status"
                name="status"
                required
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all appearance-none"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* Address */}
          <div>
            <label htmlFor="address" className="block mb-2 font-bold uppercase text-[10px] tracking-widest text-muted-foreground">
              Address
            </label>
            <textarea
              id="address"
              name="address"
              rows={3}
              value={formData.address}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 resize-none transition-all"
              placeholder="Enter full address"
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4 pt-4">
            <Button type="submit" className="flex-1">
              <Save size={18} />
              Add Employee
            </Button>
            <Link to="/employees" className="flex-1">
              <Button type="button" variant="outline" className="w-full">
                Cancel
              </Button>
            </Link>
          </div>
        </form>
      </GlassCard>
    </div>
  );
}
