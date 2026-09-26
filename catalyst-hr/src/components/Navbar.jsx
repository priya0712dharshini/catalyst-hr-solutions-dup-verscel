import { useState, useEffect } from "react";
import { T } from "../data/config";
import { LogoFull } from "./Logo";
import { Btn } from "./UI";

const NAV_LINKS = [
  { id: "home",     l: "Home"     },
  { id: "jobs",     l: "Jobs"     },
  { id: "about",    l: "About"    },
  { id: "services", l: "Services" },
  { id: "contact",  l: "Contact"  },
];

export default function Navbar({ page, nav, user, openAuth, doLogout }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <nav style={{
      position:     "sticky", top: 0, zIndex: 200, transition: "all .3s",
      background:   scrolled ? "rgba(255,255,255,.96)" : T.white,
      backdropFilter: scrolled ? "blur(20px)" : "none",
      borderBottom: `1px solid ${scrolled ? "rgba(0,0,0,.07)" : T.border}`,
      boxShadow:    scrolled ? "0 4px 28px rgba(0,0,0,.06)" : "none",
    }}>
      <div style={{ maxWidth: 1240, margin: "0 auto", padding: "0 28px", display: "flex", alignItems: "center", height: 70, gap: 8 }}>
        <button onClick={() => nav("home")} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, marginRight: 24 }}>
          <LogoFull size={34} vertical={false} />
        </button>

        {/* Nav Links */}
        <div style={{ display: "flex", gap: 2, flex: 1 }}>
          {NAV_LINKS.map(lk => (
            <button
              key={lk.id}
              className={`nav-link ${page === lk.id ? "on" : ""}`}
              onClick={() => nav(lk.id)}
              style={{ background: "none", border: "none", cursor: "pointer", padding: "7px 14px", fontSize: 14, fontWeight: 600, color: page === lk.id ? T.teal : T.grey, borderRadius: 8, transition: "color .2s,background .2s" }}
              onMouseEnter={e => e.currentTarget.style.background = T.off}
              onMouseLeave={e => e.currentTarget.style.background = "none"}
            >
              {lk.l}
            </button>
          ))}
        </div>

        {/* Auth Controls */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {user ? (
            <>
              {user.role === "admin" && <Btn sz="sm" onClick={() => nav("admin")}>⚙ Admin Panel</Btn>}
              {user.role === "user"  && (
                <>
                  <Btn sz="sm" v="ghost" onClick={() => nav("profile")}>Profile</Btn>
                  <Btn sz="sm" v="outline" onClick={() => nav("myapps")}>My Applications</Btn>
                </>
              )}
              <div 
                onClick={() => nav("profile")}
                style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 12px", background: T.off, borderRadius: 24, cursor: "pointer", transition: "background .2s" }}
                onMouseEnter={e => e.currentTarget.style.background = T.tealPale}
                onMouseLeave={e => e.currentTarget.style.background = T.off}
              >
                <div style={{ width: 30, height: 30, borderRadius: "50%", background: `linear-gradient(135deg,${T.teal},${T.tealLt})`, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700 }}>
                  {user.name?.[0]?.toUpperCase() || "U"}
                </div>
                <span style={{ fontSize: 13, fontWeight: 600, color: T.dark }}>{user.name?.split(" ")[0]}</span>
                <button onClick={(e) => { e.stopPropagation(); doLogout(); }} style={{ background: "none", border: "none", fontSize: 11, color: T.greyLt, cursor: "pointer", fontWeight: 600 }}>sign out</button>
              </div>
            </>
          ) : (
            <>
              <Btn sz="sm" v="ghost" onClick={() => openAuth("user")}>Sign In</Btn>
              <Btn sz="sm"          onClick={() => openAuth("user")}>Get Started →</Btn>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
