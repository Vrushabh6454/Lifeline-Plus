import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DoctorRegister from "./pages/Doctorregister";
import PatientRegister from "./pages/PatientRegister";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// 🔥 New Imports
import DoctorLogin from "./pages/DoctorLogin";
import PatientLogin from "./pages/PatientLogin";
import Header from "./components/Header";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/register/doctor" element={<DoctorRegister />} />

            {/* ✅ Add login pages before wildcard */}
            <Route path="/register/patient" element={<PatientRegister />} />
            <Route path="/login/doctor" element={<DoctorLogin />} />
          <Route path="/login/patient" element={<PatientLogin />} />
          
          {/* ⛔️ Keep this last */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        </main>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
