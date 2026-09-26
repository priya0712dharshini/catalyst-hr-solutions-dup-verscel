import { useState, useEffect, useCallback, useRef } from "react";
import { JOBS, APPS_SEED, INITIAL_USERS } from "./data/jobs";
import { injectStyles } from "./utils/styles";
import { useToast } from "./hooks/useToast";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { Toast } from "./components/UI";

import AuthPage from "./pages/AuthPage";
import HomePage from "./pages/HomePage";
import JobsPage from "./pages/JobsPage";
import JobDetailPage from "./pages/JobDetailPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import MyAppsPage from "./pages/MyAppsPage";
import AdminDashboard from "./pages/AdminDashboard";
import ProfilePage from "./pages/ProfilePage";

const API_URL = process.env.REACT_APP_API_URL || "/api";
const LS_PAGE = "catalyst_page";
const LS_JOB = "catalyst_jobid";
const LS_USERS = "catalyst_users";
const LS_APPS = "catalyst_apps";
const LS_JOBS = "catalyst_jobs";
const LS_USER = "catalyst_user";
const LS_TOKEN = "catalyst_token";

/* ── Helpers ─────────────────────────────────────────────────── */
const load = (key, fallback) => {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch { return fallback; }
};
const save = (key, val) => {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch { }
};

export default function App() {
  useEffect(() => injectStyles(), []);

  // ── Restore page from localStorage so refresh stays on same page ──
  const savedUser = load(LS_USER, null);
  const defaultPage = savedUser?.role === "admin" ? "admin" : (load(LS_PAGE, "home") || "home");

  const [page, setPageState] = useState(defaultPage);
  const [jobId, setJobId] = useState(() => load(LS_JOB, null));
  const [authMode, setAuthMode] = useState(null);
  const [user, setUser] = useState(savedUser);

  const [jobs, setJobsFn] = useState(() => load(LS_JOBS, JOBS));
  const [apps, setAppsFn] = useState(() => load(LS_APPS, APPS_SEED));
  const [users, setUsersFn] = useState(() => load(LS_USERS, INITIAL_USERS));

  const toast = useToast();

  // ── Persist page on every nav ──────────────────────────────────
  const nav = useCallback((p, id) => {

  // Services is a section on the Home page
  if (p === "services") {
    save(LS_PAGE, "home");
    setPageState("home");

    setTimeout(() => {
      document.getElementById("services")?.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }, 100);

    return;
  }

  // Don't persist "job" detail page — restore to "jobs" instead
  save(LS_PAGE, p === "job" ? "jobs" : p);

  if (id !== undefined) {
    setJobId(id);
    save(LS_JOB, id);
  }

  setPageState(p);

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

}, []);

  // ── BroadcastChannel: create ONCE, attach listener in same effect ──
  const bc = useRef(null);
  useEffect(() => {
    let channel = null;
    try {
      channel = new BroadcastChannel("catalyst_sync");
      bc.current = channel;

      // Attach listener inside SAME effect so bc.current is guaranteed set
      channel.onmessage = (msg) => {
        if (!msg?.data?.type) return;
        const { type, data } = msg.data;
        if (type === "apps") setAppsFn(data);
        if (type === "jobs") setJobsFn(data);
        if (type === "users") setUsersFn(data);
      };
    } catch { }

    // Also handle cross-window (different browser windows)
    const storageHandler = (e) => {
      if (e.key === LS_APPS && e.newValue) setAppsFn(JSON.parse(e.newValue));
      if (e.key === LS_JOBS && e.newValue) setJobsFn(JSON.parse(e.newValue));
      if (e.key === LS_USERS && e.newValue) setUsersFn(JSON.parse(e.newValue));
    };
    window.addEventListener("storage", storageHandler);

    return () => {
      try { channel?.close(); } catch { }
      window.removeEventListener("storage", storageHandler);
    };
  }, []); // one-time setup only

  // ── Broadcast helper ────────────────────────────────────────────
  const broadcast = useCallback((type, data) => {
    try { bc.current?.postMessage({ type, data }); } catch { }
  }, []);

  // ── Persistent setters: save + broadcast on every change ────────
  const setJobs = useCallback(upd => setJobsFn(prev => { const n = typeof upd === "function" ? upd(prev) : upd; save(LS_JOBS, n); broadcast("jobs", n); return n; }), [broadcast]);
  const setApps = useCallback(upd => setAppsFn(prev => { const n = typeof upd === "function" ? upd(prev) : upd; save(LS_APPS, n); broadcast("apps", n); return n; }), [broadcast]);
  const setUsers = useCallback(upd => setUsersFn(prev => { const n = typeof upd === "function" ? upd(prev) : upd; save(LS_USERS, n); broadcast("users", n); return n; }), [broadcast]);

  // ── Optional backend sync (graceful fallback) ────────────────────
  useEffect(() => {
    const sync = async () => {
      try {
        const jRes = await fetch(`${API_URL}/jobs`);
        if (jRes.ok) { const d = await jRes.json(); if (d?.length) { save(LS_JOBS, d); setJobsFn(d); broadcast("jobs", d); } }

        const token = localStorage.getItem(LS_TOKEN);
        const usr = load(LS_USER, null);
        if (token && usr) {
          const ep = usr.role === "admin" ? "/apps/all" : "/apps/user";
          const aRes = await fetch(`${API_URL}${ep}`, { headers: { Authorization: `Bearer ${token}` } });
          if (aRes.ok) { const d = await aRes.json(); if (d?.length) { save(LS_APPS, d); setAppsFn(d); broadcast("apps", d); } }
        }
      } catch { /* backend offline — localStorage is source of truth */ }
    };
    sync();
  }, []); // eslint-disable-line

  // ── Auth ─────────────────────────────────────────────────────────
  const login = (u, token) => {
    setUser(u);
    save(LS_USER, u);
    if (token) save(LS_TOKEN, token);

    // Auto-register new user in admin panel
    setUsers(prev => {
      const exists = prev.some(x => x.email === u.email);
      if (exists) return prev;
      return [...prev, {
        id: Date.now(),
        name: u.name || u.email.split("@")[0],
        email: u.email,
        role: u.role || "user",
        status: "Approved",
        joined: new Date().toISOString().split("T")[0],
        uid: u.uid || null,
      }];
    });

    setAuthMode(null);
    nav(u.role === "admin" ? "admin" : "home");
    toast.add(`Welcome${u.name ? `, ${u.name.split(" ")[0]}` : ""}! 👋`, "success");
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(LS_USER);
    localStorage.removeItem(LS_TOKEN);
    save(LS_PAGE, "home");
    nav("home");
    toast.add("Signed out successfully.", "success");
  };

  const updateProfile = data => {
    const updated = { ...user, ...data };
    setUser(updated);
    save(LS_USER, updated);
    setUsers(us => us.map(u => u.email === updated.email ? { ...u, ...data } : u));
  };

  // ── User Management (Admin) ──────────────────────────────────────
  const updateUserStatus = (id, status) => setUsers(us => us.map(u => u.id === id ? { ...u, status } : u));
  const deleteUser = id => setUsers(us => us.filter(u => u.id !== id));
  const resetUserPassword = () => toast.add("Password reset email sent to user.", "info");

  // ── Job Application (immediate sync to admin) ────────────────────
  const apply = async (data) => {
    const job = jobs.find(j => j.id === data.jobId);
    const newApp = {
      id: Date.now(),
      job_id: data.jobId,
      jobId: data.jobId,
      jobTitle: job?.title || data.jobTitle || "Unknown",
      name: data.name,
      email: data.email,
      phone: data.phone,
      experience: data.exp || "",
      exp: data.exp || "",
      resume_url: data.resume ? (data.resume.name || String(data.resume)) : "",
      status: "Applied",
      timeline: ["Applied"],
      tl: ["Applied"],
      date: new Date().toISOString().split("T")[0],
      applied_at: new Date().toISOString(),
    };

    // Immediately visible in BOTH user portal AND admin panel (same localStorage + broadcast)
    setApps(prev => [...prev, newApp]);
    toast.add("Application submitted! 🎉", "success");
    nav("myapps");

    // Also try backend
    try {
      const tok = localStorage.getItem(LS_TOKEN);
      if (tok) await fetch(`${API_URL}/apps`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${tok}` },
        body: JSON.stringify(newApp),
      });
    } catch { }
  };

  // ── Status Update (admin → immediately reflects in user view) ────
  const updateStatus = async (id, status) => {
    const appItem = apps.find(a => a.id === id);
    if (!appItem) return;
    const timeline = [...new Set([...(appItem.timeline || appItem.tl || ["Applied"]), status])];
    setApps(prev => prev.map(x => x.id !== id ? x : { ...x, status, timeline, tl: timeline }));
    try {
      const tok = localStorage.getItem(LS_TOKEN);
      if (tok) await fetch(`${API_URL}/apps/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${tok}` },
        body: JSON.stringify({ status, timeline }),
      });
    } catch { }
  };

  // ── Job CRUD ─────────────────────────────────────────────────────
  const addOrUpdateJob = job => setJobs(js => {
    const exists = js.find(x => x.id === job.id);
    return exists ? js.map(x => x.id === job.id ? job : x) : [...js, { ...job, id: job.id || Date.now() }];
  });
  const deleteJob = id => setJobs(js => js.filter(j => j.id !== id));

  const selectedJob = jobs.find(j => j.id === jobId);

  // ── Full-screen Auth ─────────────────────────────────────────────
  if (authMode) {
    return (
      <>
        <AuthPage mode={authMode} onBack={() => setAuthMode(null)} onLogin={login} toast={toast} />
        <Toast items={toast.items} rm={toast.rm} />
      </>
    );
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar page={page} nav={nav} user={user} openAuth={m => setAuthMode(m)} doLogout={logout} />

      <div style={{ flex: 1 }}>
        {page === "home" && <HomePage jobs={jobs} nav={nav} openAuth={m => setAuthMode(m)} />}
        {page === "jobs" && <JobsPage jobs={jobs} nav={nav} />}
        {page === "job" && <JobDetailPage job={selectedJob} nav={nav} onApply={apply} user={user} openAuth={m => setAuthMode(m)} />}
        {page === "about" && <AboutPage />}
        {page === "contact" && <ContactPage toast={toast} />}
        {page === "myapps" && <MyAppsPage apps={apps.filter(a => a.email === user?.email)} user={user} />}
        {page === "profile" && <ProfilePage user={user} onUpdateProfile={updateProfile} toast={toast} />}

        {page === "admin" && user?.role === "admin" && (
          <AdminDashboard
            jobs={jobs} apps={apps} users={users}
            onUpdateStatus={updateStatus}
            onUpdateUserStatus={updateUserStatus}
            onDeleteUser={deleteUser}
            onResetUserPassword={resetUserPassword}
            onAddJob={addOrUpdateJob}
            onDeleteJob={deleteJob}
            toast={toast}
          />
        )}
        {page === "admin" && user?.role !== "admin" && (
          <div style={{ textAlign: "center", padding: 80 }}>
            <div style={{ fontSize: 52 }}>🔒</div>
            <div style={{ fontWeight: 700, fontSize: 20, marginTop: 16 }}>Admin access required</div>
          </div>
        )}
      </div>

      <Footer nav={nav} onAdminAccess={() => setAuthMode("admin")} />
      <Toast items={toast.items} rm={toast.rm} />
    </div>
  );
}
