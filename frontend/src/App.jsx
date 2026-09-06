import { Navigate, Route, Routes } from "react-router-dom";

import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ProtectedRoute from "./components/ProtectedRoute";

import StudentDashboard from "./pages/Student/StudentDashboard";
import RecruiterDashboard from "./pages/Recruiter/RecruiterDashboard";
import PlacementDashboard from "./pages/Placement/PlacementDashboard";
import PlacementDrives from "./pages/Placement/PlacementDrives";
import PlacementApplications from "./pages/Placement/PlacementApplications";
import PlacementStudents from "./pages/Placement/PlacementStudents";
import PlacementRecords from "./pages/Placement/PlacementRecords";
import PlacementCompanies from "./pages/Placement/PlacementCompanies";
import PlacementReports from "./pages/Placement/PlacementReports";
import PlacementNotifications from "./pages/Placement/PlacementNotifications";
import AdminDashboard from "./pages/Admin/AdminDashboard";

import StudentLayout from "./pages/Student/StudentLayout";
import RecruiterLayout from "./pages/Recruiter/RecruiterLayout";
import PlacementLayout from "./pages/Placement/PlacementLayout";
import AdminLayout from "./pages/Admin/AdminLayout";
import StudentJobs from "./pages/Student/StudentJobs";
import StudentJobDetails from "./pages/Student/StudentJobDetails";
import StudentApplications from "./pages/Student/StudentApplications";
import StudentResume from "./pages/Student/StudentResume";
import StudentInterviews from "./pages/Student/StudentInterviews";
import StudentNotifications from "./pages/Student/StudentNotifications";
import StudentSettings from "./pages/Student/StudentSettings";

import AdminAcademicVerification from "./pages/Admin/AdminAcademicVerification";
import AdminJobVerification from "./pages/Admin/AdminJobVerification";
import AdminUsers from "./pages/Admin/AdminUsers";
import AdminSettings from "./pages/Admin/AdminSettings";
import AdminNotifications from "./pages/Admin/AdminNotifications";
import AdminAuditLogs from "./pages/Admin/AdminAuditLogs";
import Profile from "./pages/Student/Profile";

import CompanyProfile from "./pages/Recruiter/CompanyProfile";
import CreateJob from "./pages/Recruiter/CreateJob";
import ManageJobs from "./pages/Recruiter/ManageJobs";
import Applicants from "./pages/Recruiter/Applicants";
import Interviews from "./pages/Recruiter/Interviews";
import RecruiterNotifications from "./pages/Recruiter/Notifications";
import RecruiterSettings from "./pages/Recruiter/RecruiterSettings";
import PlacementSettings from "./pages/Placement/PlacementSettings";


function Unauthorized() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-5xl font-bold">403</h1>

        <p className="text-slate-400 mt-3">
          You are not authorized to access this page.
        </p>
      </div>
    </div>
  );
}

function App() {
  return (
    <Routes>

      {/* LOGIN & AUTH */}
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* STUDENT */}
      <Route
          path="/student"
          element={
            <ProtectedRoute allowedRoles={["STUDENT"]}>
              <StudentLayout />
            </ProtectedRoute>
          }
        >
          <Route
            index
            element={<StudentDashboard />}
          />

          <Route
            path="profile"
            element={<Profile />}
          />

          <Route
            path="jobs"
            element={<StudentJobs />}
          />

          <Route
            path="jobs/:id"
            element={<StudentJobDetails />}
          />

          <Route
            path="applications"
            element={<StudentApplications />}
          />

          <Route
            path="resume"
            element={<StudentResume />}
          />

          <Route
            path="interviews"
            element={<StudentInterviews />}
          />

          <Route
            path="notifications"
            element={<StudentNotifications />}
          />

          <Route
            path="settings"
            element={<StudentSettings />}
          />
        </Route>

      {/* RECRUITER */}
      <Route
        path="/recruiter"
        element={
          <ProtectedRoute allowedRoles={["RECRUITER"]}>
            <RecruiterLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<RecruiterDashboard />} />
        <Route path="profile" element={<CompanyProfile />} />
        <Route path="jobs/create" element={<CreateJob />} />
        <Route path="jobs" element={<ManageJobs />} />
        <Route path="applicants" element={<Applicants />} />
        <Route path="interviews" element={<Interviews />} />
        <Route path="notifications" element={<RecruiterNotifications />} />
        <Route path="settings" element={<RecruiterSettings />} />
      </Route>

      {/* PLACEMENT OFFICER */}
      <Route
        path="/placement"
        element={
          <ProtectedRoute allowedRoles={["PLACEMENT_OFFICER"]}>
            <PlacementLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<PlacementDashboard />} />
        <Route path="drives" element={<PlacementDrives />} />
        <Route path="applications" element={<PlacementApplications />} />
        <Route path="students" element={<PlacementStudents />} />
        <Route path="placements" element={<PlacementRecords />} />
        <Route path="companies" element={<PlacementCompanies />} />
        <Route path="reports" element={<PlacementReports />} />
        <Route path="notifications" element={<PlacementNotifications />} />
        <Route path="settings" element={<PlacementSettings />} />
      </Route>

      {/* ADMIN */}    
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route
          index
          element={<AdminDashboard />}
        />

        <Route
          path="users"
          element={<AdminUsers />}
        />

        <Route
          path="students"
          element={
            <AdminUsers defaultRole="STUDENT" />
          }
        />

        <Route
          path="recruiters"
          element={
            <AdminUsers defaultRole="RECRUITER" />
          }
        />

        <Route
          path="officers"
          element={
            <AdminUsers
              defaultRole="PLACEMENT_OFFICER"
            />
          }
        />

        <Route
          path="academic-verification"
          element={<AdminAcademicVerification />}
        />

        <Route
          path="job-verification"
          element={<AdminJobVerification />}
        />

        <Route
          path="notifications"
          element={<AdminNotifications />}
        />

        <Route
          path="logs"
          element={<AdminAuditLogs />}
        />

        <Route
          path="settings"
          element={<AdminSettings />}
        />
      </Route>

      {/* UNAUTHORIZED */}
      <Route
        path="/unauthorized"
        element={<Unauthorized />}
      />

      {/* UNKNOWN URL */}
      <Route
        path="*"
        element={<Navigate to="/login" replace />}
      />

    </Routes>
  );
}

export default App;