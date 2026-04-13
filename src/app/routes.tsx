import { createBrowserRouter, Outlet } from "react-router";
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import EmployeeDetail from "./pages/EmployeeDetail";
import AddEmployee from "./pages/AddEmployee";
import Tasks from "./pages/Tasks";
import IDCards from "./pages/IDCards";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import { Toaster } from "sonner";

const Layout = () => {
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col relative overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-4 lg:p-8 custom-scrollbar">
          <Outlet />
        </main>
      </div>
      <Toaster position="top-right" theme="dark" richColors />
    </div>
  );
};

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      {
        index: true,
        Component: Dashboard,
      },
      {
        path: "employees",
        Component: Employees,
      },
      {
        path: "employees/add",
        Component: AddEmployee,
      },
      {
        path: "employees/:id",
        Component: EmployeeDetail,
      },
      {
        path: "tasks",
        Component: Tasks,
      },
      {
        path: "id-cards",
        Component: IDCards,
      },
      {
        path: "reports",
        Component: Reports,
      },
      {
        path: "settings",
        Component: Settings,
      },
    ],
  },
]);
