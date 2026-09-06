import { useEffect, useMemo, useState } from "react";
import api from "../../api/axios";

function AdminUsers({ defaultRole = "ALL" }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [search, setSearch] = useState("");
  const [role, setRole] = useState(defaultRole);
  const [status, setStatus] = useState("ALL");

  const [showCreate, setShowCreate] = useState(false);
  const [resetModalData, setResetModalData] = useState(null);

  const [creating, setCreating] = useState(false);
  const [resettingId, setResettingId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "STUDENT",
  });

  useEffect(() => {
    setRole(defaultRole);
  }, [defaultRole]);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/api/admin/users");

      setUsers(response.data || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load users."
      );
    } finally {
      setLoading(false);
    }
  };

  // ================= CREATE USER =================

  const createUser = async (e) => {
    e.preventDefault();

    try {
      setCreating(true);
      setError("");
      setSuccess("");

      await api.post("/api/admin/users", form);

      setSuccess(
        `${form.role.replaceAll("_", " ")} account created successfully.`
      );

      setForm({
        name: "",
        email: "",
        password: "",
        role: "STUDENT",
      });

      setShowCreate(false);

      await loadUsers();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to create user."
      );
    } finally {
      setCreating(false);
    }
  };

  // ================= STATUS =================

  const changeStatus = async (user) => {
    if (user.role === "ADMIN") {
      setError("Admin accounts cannot be modified.");
      return;
    }

    try {
      setError("");
      setSuccess("");

      await api.put(
        `/api/admin/users/${user.id}/status`,
        null,
        {
          params: {
            enabled: !user.enabled,
          },
        }
      );

      setSuccess(
        `${user.name} is now ${
          !user.enabled ? "active" : "disabled"
        }.`
      );

      await loadUsers();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to change account status."
      );
    }
  };

  // ================= PASSWORD RESET =================

  const handleResetPassword = async (user) => {
    if (user.role === "ADMIN") {
      setError("Admin passwords cannot be reset by another admin.");
      return;
    }

    try {
      setResettingId(user.id);
      setError("");
      setSuccess("");

      const response = await api.post(`/api/admin/users/${user.id}/reset-password`);
      const token = response.data?.resetToken;
      const link = response.data?.resetLink || `/reset-password?token=${token}`;

      setResetModalData({
        user,
        resetToken: token,
        resetLink: window.location.origin + link,
      });

      setSuccess(`Password reset link generated for ${user.name}.`);
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to generate password reset link."
      );
    } finally {
      setResettingId(null);
    }
  };

  // ================= DELETE =================

  const deleteUser = async (user) => {
    if (user.role === "ADMIN") {
      setError("Admin accounts cannot be deleted.");
      return;
    }

    const confirmed = window.confirm(
      `Delete ${user.name}'s account? This action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      setError("");
      setSuccess("");

      await api.delete(
        `/api/admin/users/${user.id}`
      );

      setSuccess(
        `${user.name}'s account deleted successfully.`
      );

      await loadUsers();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to delete user."
      );
    }
  };

  // ================= FILTER =================

  const filteredUsers = useMemo(() => {
    const q = search.toLowerCase().trim();

    return users.filter((user) => {
      const searchMatch =
        !q ||
        user.name?.toLowerCase().includes(q) ||
        user.email?.toLowerCase().includes(q);

      const roleMatch =
        role === "ALL" || user.role === role;

      const statusMatch =
        status === "ALL" ||
        (status === "ACTIVE"
          ? user.enabled
          : !user.enabled);

      return (
        searchMatch &&
        roleMatch &&
        statusMatch
      );
    });
  }, [users, search, role, status]);

  // ================= COUNTS =================

  const counts = {
    total: users.length,

    students: users.filter(
      (u) => u.role === "STUDENT"
    ).length,

    recruiters: users.filter(
      (u) => u.role === "RECRUITER"
    ).length,

    officers: users.filter(
      (u) => u.role === "PLACEMENT_OFFICER"
    ).length,

    admins: users.filter(
      (u) => u.role === "ADMIN"
    ).length,
  };

  return (
    <div className="space-y-7">

      {/* HEADER */}

      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">

        <div>
          <p className="text-sm font-bold text-blue-600 dark:text-blue-400">
            ADMINISTRATION
          </p>

          <h1 className="text-3xl md:text-4xl font-bold mt-1">
            User Management
          </h1>

          <p className="text-slate-500 dark:text-slate-400 mt-2">
            Create and manage all platform accounts.
          </p>
        </div>

        <button
          onClick={() => {
            setError("");
            setShowCreate(true);
          }}
          className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-600/20 transition"
        >
          + Create User
        </button>

      </div>

      {/* ALERTS */}

      {error && (
        <Alert
          type="error"
          message={error}
        />
      )}

      {success && (
        <Alert
          type="success"
          message={success}
        />
      )}

      {/* STATS */}

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">

        <MiniStat
          icon="👥"
          title="Total"
          value={counts.total}
        />

        <MiniStat
          icon="🎓"
          title="Students"
          value={counts.students}
        />

        <MiniStat
          icon="🏢"
          title="Recruiters"
          value={counts.recruiters}
        />

        <MiniStat
          icon="👨‍💼"
          title="TPO"
          value={counts.officers}
        />

        <MiniStat
          icon="🛡️"
          title="Admins"
          value={counts.admins}
        />

      </div>

      {/* FILTERS */}

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4">

        <div className="grid md:grid-cols-3 gap-3">

          <input
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search name or email..."
            className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-900 dark:text-white"
          />

          <select
            value={role}
            onChange={(e) =>
              setRole(e.target.value)
            }
            className="px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-white"
          >
            <option value="ALL">All Roles</option>
            <option value="STUDENT">Students</option>
            <option value="RECRUITER">Recruiters</option>
            <option value="PLACEMENT_OFFICER">
              Placement Officers
            </option>
            <option value="ADMIN">Administrators</option>
          </select>

          <select
            value={status}
            onChange={(e) =>
              setStatus(e.target.value)
            }
            className="px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-white"
          >
            <option value="ALL">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="DISABLED">Disabled</option>
          </select>

        </div>

      </div>

      {/* USERS */}

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">

        <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">

          <div>
            <h2 className="font-bold text-lg">
              Platform Users
            </h2>

            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {filteredUsers.length} account
              {filteredUsers.length !== 1 ? "s" : ""} found
            </p>
          </div>

          <button
            onClick={loadUsers}
            className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            ↻ Refresh
          </button>

        </div>

        {loading ? (
          <div className="p-5 space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-20 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse"
              />
            ))}
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="py-20 text-center">

            <div className="text-5xl">
              👥
            </div>

            <h3 className="font-bold text-lg mt-4">
              No users found
            </h3>

            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              Try changing your filters or create a new account.
            </p>

          </div>
        ) : (
          <div className="divide-y divide-slate-200 dark:divide-slate-800">

            {filteredUsers.map((user) => (
              <UserRow
                key={user.id}
                user={user}
                onStatusChange={changeStatus}
                onResetPassword={handleResetPassword}
                onDelete={deleteUser}
                resetting={resettingId === user.id}
              />
            ))}

          </div>
        )}

      </div>

      {/* CREATE */}

      {showCreate && (
        <CreateUserModal
          form={form}
          setForm={setForm}
          creating={creating}
          onClose={() => setShowCreate(false)}
          onSubmit={createUser}
        />
      )}

      {/* PASSWORD RESET MODAL */}

      {resetModalData && (
        <ResetPasswordModal
          data={resetModalData}
          onClose={() => setResetModalData(null)}
        />
      )}

    </div>
  );
}

/* =====================================================
   USER ROW
===================================================== */

function UserRow({
  user,
  onStatusChange,
  onResetPassword,
  onDelete,
  resetting = false,
}) {
  const isAdmin = user.role === "ADMIN";

  return (
    <div className="p-5 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">

      <div className="flex items-center gap-4 min-w-0">

        <div className="w-12 h-12 shrink-0 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold text-lg">
          {user.name?.charAt(0)?.toUpperCase()}
        </div>

        <div className="min-w-0">

          <div className="flex items-center gap-2">

            <p className="font-bold truncate">
              {user.name}
            </p>

            {isAdmin && (
              <span className="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400">
                Protected
              </span>
            )}

          </div>

          <p className="text-sm text-slate-500 dark:text-slate-400 truncate">
            {user.email}
          </p>

        </div>

      </div>

      <div className="flex flex-wrap items-center gap-2">

        <Badge text={formatRole(user.role)} />

        <Badge
          text={user.enabled ? "ACTIVE" : "DISABLED"}
          status
        />

        {!isAdmin && (
          <>
            <button
              onClick={() =>
                onStatusChange(user)
              }
              className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            >
              {user.enabled ? "Disable" : "Enable"}
            </button>

            <button
              onClick={() =>
                onResetPassword(user)
              }
              disabled={resetting}
              className="px-3 py-2 rounded-lg border border-blue-200 dark:border-blue-500/30 text-blue-600 dark:text-blue-400 text-sm font-semibold hover:bg-blue-50 dark:hover:bg-blue-500/10 transition cursor-pointer disabled:opacity-50"
            >
              {resetting ? "Generating..." : "🔑 Reset Password"}
            </button>

            <button
              onClick={() =>
                onDelete(user)
              }
              className="px-3 py-2 rounded-lg text-sm font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition cursor-pointer"
            >
              Delete
            </button>
          </>
        )}

        {isAdmin && (
          <span className="px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-500 dark:text-slate-400">
            Admin protected
          </span>
        )}

      </div>

    </div>
  );
}

/* =====================================================
   CREATE MODAL
===================================================== */

function CreateUserModal({
  form,
  setForm,
  creating,
  onClose,
  onSubmit,
}) {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">

      <form
        onSubmit={onSubmit}
        className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-7 shadow-2xl max-h-[90vh] overflow-y-auto"
      >

        <div className="flex justify-between gap-4">

          <div>
            <p className="text-sm font-bold text-blue-600 dark:text-blue-400">
              ADMIN CONTROL
            </p>

            <h2 className="text-2xl font-bold mt-1">
              Create User
            </h2>

            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              Create credentials for a new platform account.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-xl"
          >
            ×
          </button>

        </div>

        <div className="space-y-4 mt-7">

          <Input
            label="Full Name"
            value={form.name}
            onChange={(value) =>
              setForm({
                ...form,
                name: value,
              })
            }
          />

          <Input
            label="Email Address"
            type="email"
            value={form.email}
            onChange={(value) =>
              setForm({
                ...form,
                email: value,
              })
            }
          />

          <Input
            label="Initial Password"
            type="password"
            value={form.password}
            onChange={(value) =>
              setForm({
                ...form,
                password: value,
              })
            }
          />

          <div>

            <label className="block text-sm font-semibold mb-2">
              Account Type
            </label>

            <select
              value={form.role}
              onChange={(e) =>
                setForm({
                  ...form,
                  role: e.target.value,
                })
              }
              className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:border-blue-500 text-slate-900 dark:text-white"
            >

              <option value="STUDENT">
                🎓 Student
              </option>

              <option value="RECRUITER">
                🏢 Recruiter
              </option>

              <option value="PLACEMENT_OFFICER">
                👨‍💼 Placement Officer
              </option>

              <option value="ADMIN">
                🛡️ Administrator
              </option>

            </select>

          </div>

          {form.role === "ADMIN" && (
            <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/20">
              <p className="text-sm font-semibold text-purple-700 dark:text-purple-400">
                🛡️ Protected Admin Account
              </p>

              <p className="text-xs text-purple-600/80 dark:text-purple-300/70 mt-1">
                Other administrators cannot disable, delete or change the password of this account.
              </p>
            </div>
          )}

        </div>

        <div className="flex gap-3 mt-7">

          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={creating}
            className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold disabled:opacity-50 transition"
          >
            {creating ? "Creating..." : "Create Account"}
          </button>

        </div>

      </form>

    </div>
  );
}

/* =====================================================
   PASSWORD MODAL
===================================================== */

function ResetPasswordModal({ data, onClose }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(data.resetLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-7 shadow-2xl">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-bold text-blue-600 dark:text-blue-400">
              SECURITY
            </p>
            <h2 className="text-2xl font-bold mt-1 text-slate-900 dark:text-white">
              Password Reset Link
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-xl cursor-pointer"
          >
            ×
          </button>
        </div>

        <div className="mt-5 p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-900 dark:text-white">{data.user.name}</p>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{data.user.email}</p>
        </div>

        <div className="mt-5 space-y-2">
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
            Secure Single-Use Reset Link
          </label>
          <div className="flex gap-2">
            <input
              readOnly
              value={data.resetLink}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-white text-xs font-mono select-all flex-1"
            />
            <button
              type="button"
              onClick={handleCopy}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition cursor-pointer shrink-0"
            >
              {copied ? "✓ Copied!" : "📋 Copy"}
            </button>
          </div>
        </div>

        <div className="mt-5 p-4 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 text-xs text-amber-800 dark:text-amber-300 space-y-1">
          <p className="font-bold">🔒 Security Policy</p>
          <p>
            Share this link with the user to allow them to create a new password. The link is single-use and expires in 24 hours. Administrators cannot view or hold user passwords.
          </p>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-sm font-semibold transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

/* =====================================================
   INPUT
===================================================== */

function Input({
  label,
  type = "text",
  value,
  onChange,
}) {
  return (
    <div>

      <label className="block text-sm font-semibold mb-2">
        {label}
      </label>

      <input
        required
        type={type}
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-900 dark:text-white"
      />

    </div>
  );
}

/* =====================================================
   BADGE
===================================================== */

function Badge({
  text,
  status = false,
}) {
  return (
    <span
      className={`px-2.5 py-1 rounded-full text-xs font-bold ${
        status
          ? text === "ACTIVE"
            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
            : "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400"
          : "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400"
      }`}
    >
      {text}
    </span>
  );
}

/* =====================================================
   MINI STAT
===================================================== */

function MiniStat({
  icon,
  title,
  value,
}) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 hover:-translate-y-0.5 transition">

      <div className="text-2xl">
        {icon}
      </div>

      <p className="text-sm text-slate-500 dark:text-slate-400 mt-3">
        {title}
      </p>

      <p className="text-2xl font-bold mt-1">
        {value}
      </p>

    </div>
  );
}

/* =====================================================
   ALERT
===================================================== */

function Alert({
  type,
  message,
}) {
  const ok = type === "success";

  return (
    <div
      className={`p-4 rounded-xl border ${
        ok
          ? "bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-400"
          : "bg-red-50 border-red-200 text-red-700 dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-400"
      }`}
    >
      {ok ? "✓" : "⚠️"} {message}
    </div>
  );
}

/* =====================================================
   ROLE FORMAT
===================================================== */

function formatRole(role) {
  const names = {
    ADMIN: "ADMIN",
    STUDENT: "STUDENT",
    RECRUITER: "RECRUITER",
    PLACEMENT_OFFICER: "TPO",
  };

  return names[role] || role;
}

export default AdminUsers;