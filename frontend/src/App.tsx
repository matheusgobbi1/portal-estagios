import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import Login from "./pages/Login";
import StudentDashboard from "./pages/student/Dashboard";
import { UserRole } from "./interfaces";
import RegisterStudent from "./pages/RegisterStudent";
import RegisterCompany from "./pages/RegisterCompany";
import Home from "./pages/Home";
import CompanyDashboard from "./pages/company/Dashboard";
import NewJobOffer from "./pages/company/NewJobOffer";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminAreas from "./pages/admin/Areas";
import StudentProfile from "./pages/student/Profile";

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div style={{ backgroundColor: "#0f172a", minHeight: "100vh" }}>
          <Routes>
            {/* Rotas públicas */}
            <Route path="/login" element={<Login />} />
            <Route path="/registro/estudante" element={<RegisterStudent />} />
            <Route path="/registro/empresa" element={<RegisterCompany />} />
            <Route path="/" element={<Home />} />

            {/* Rotas protegidas para Admin */}
            <Route element={<PrivateRoute allowedRoles={[UserRole.ADMIN]} />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/areas" element={<AdminAreas />} />
            </Route>

            {/* Rotas protegidas para Empresa */}
            <Route element={<PrivateRoute allowedRoles={[UserRole.COMPANY]} />}>
              <Route path="/empresa" element={<CompanyDashboard />} />
              <Route path="/empresa/nova-vaga" element={<NewJobOffer />} />
            </Route>

            {/* Rotas protegidas para Estudante */}
            <Route element={<PrivateRoute allowedRoles={[UserRole.STUDENT]} />}>
              <Route path="/estudante" element={<StudentDashboard />} />
              <Route path="/estudante/perfil" element={<StudentProfile />} />
              <Route path="/estudante/*" element={<StudentDashboard />} />
            </Route>

            {/* Rota padrão - redireciona para a página inicial */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
