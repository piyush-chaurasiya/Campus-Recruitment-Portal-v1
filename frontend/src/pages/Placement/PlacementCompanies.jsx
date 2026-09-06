import { useEffect, useMemo, useState } from "react";
import api from "../../api/axios";

function PlacementCompanies() {
  const [drives, setDrives] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [drivesRes, appsRes] = await Promise.all([
        api.get("/api/placement/jobs"),
        api.get("/api/placement/applications"),
      ]);

      setDrives(drivesRes.data || []);
      setApplications(appsRes.data || []);
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to load companies."
      );
    } finally {
      setLoading(false);
    }
  };

  const companies = useMemo(() => {
    const map = new Map();

    drives.forEach((d) => {
      if (!map.has(d.companyName)) {
        map.set(d.companyName, {
          name: d.companyName,
          drives: [],
          totalApplications: 0,
          totalSelected: 0,
        });
      }
      map.get(d.companyName).drives.push(d);
    });

    applications.forEach((a) => {
      const entry = map.get(a.companyName);
      if (entry) {
        entry.totalApplications += 1;
        if (a.status === "SELECTED") entry.totalSelected += 1;
      }
    });

    return Array.from(map.values()).sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  }, [drives, applications]);

  const filtered = useMemo(() => {
    const text = search.toLowerCase().trim();
    if (!text) return companies;
    return companies.filter((c) => c.name.toLowerCase().includes(text));
  }, [companies, search]);

  return (
    <div className="space-y-7">
      <div>
        <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-2">
          COMPANIES
        </p>
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
          Recruiting Companies
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">
          Companies that have posted placement drives, with hiring activity.
        </p>
      </div>

      {error && (
        <div className="px-5 py-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400">
          ⚠️ {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <p className="text-sm text-slate-500 dark:text-slate-400">Total Companies</p>
          <p className="text-2xl font-bold mt-1 text-slate-900 dark:text-white">{companies.length}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <p className="text-sm text-slate-500 dark:text-slate-400">Total Drives Posted</p>
          <p className="text-2xl font-bold mt-1 text-slate-900 dark:text-white">{drives.length}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <p className="text-sm text-slate-500 dark:text-slate-400">Total Selections</p>
          <p className="text-2xl font-bold mt-1 text-slate-900 dark:text-white">
            {applications.filter((a) => a.status === "SELECTED").length}
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search company..."
          className="input"
        />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-40 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse"
            />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl py-20 text-center">
          <div className="text-5xl mb-4">🏢</div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">No companies found</h3>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            Companies appear here once a drive is posted for them.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((c) => (
            <div
              key={c.name}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm"
            >
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-2xl shadow-md shadow-blue-500/20">
                  🏢
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">{c.name}</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                    {c.drives.length} drive
                    {c.drives.length !== 1 ? "s" : ""} posted
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-5">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <p className="text-xs text-slate-400 dark:text-slate-500">Applications</p>
                  <p className="font-semibold mt-1 text-slate-900 dark:text-white">
                    {c.totalApplications}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <p className="text-xs text-slate-400 dark:text-slate-500">Selected</p>
                  <p className="font-semibold mt-1 text-slate-900 dark:text-white">{c.totalSelected}</p>
                </div>
              </div>

              <div className="mt-5 pt-5 border-t border-slate-200 dark:border-slate-800 space-y-2">
                {c.drives.map((d) => (
                  <div
                    key={d.id}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-slate-700 dark:text-slate-300 font-medium">{d.title}</span>
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                        d.status === "APPROVED"
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                          : d.status === "PENDING"
                          ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                      }`}
                    >
                      {d.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PlacementCompanies;
