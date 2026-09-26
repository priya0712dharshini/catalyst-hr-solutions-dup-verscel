import { T, PHOTOS } from "../data/config";
import { LogoFull } from "../components/Logo";
import { useCountUp } from "../hooks/useCountUp";
import { Btn, Card, Tag } from "../components/UI";

function Count({ n, s = "" }) {
  const v = useCountUp(n);
  return <>{v}{s}</>;
}

const SERVICES = [
  { icon: "🏥", t: "Healthcare RCM",   d: "Medical Coding, AR Calling & Billing specialists" },
  { icon: "💻", t: "IT Recruitment",   d: "Tech talent for your digital transformation" },
  { icon: "🏦", t: "Banking & BFSI",   d: "Finance domain talent acquisition" },
  { icon: "👥", t: "Non-IT Staffing",  d: "Operational and administrative talent" },
  { icon: "🔍", t: "Executive Search", d: "C-suite and leadership placement" },
  { icon: "📋", t: "Contract Staffing",d: "Flexible workforce solutions" },
];

const GALLERY = [
  { src: PHOTOS.office1,  caption: "Modern Workspace"     },
  { src: PHOTOS.office2,  caption: "Team Collaboration"   },
  { src: PHOTOS.medical1, caption: "Healthcare Coding"    },
  { src: PHOTOS.office3,  caption: "Boardroom Sessions"   },
  { src: PHOTOS.office4,  caption: "Candidate Interviews" },
  { src: PHOTOS.medical2, caption: "RCM Excellence"       },
];

const STATS = [
  { n: 500, s: "+", l: "Placements"   },
  { n: 100, s: "+", l: "Happy Clients" },
  { n:  10, s: "+", l: "Years"        },
  { n:  95, s: "%", l: "Satisfaction" },
];

export default function HomePage({ jobs, nav, openAuth }) {
  const urgentJobs = jobs.filter(j => j.urgent);

  return (
    <div className="page">

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <div style={{ position: "relative", minHeight: "92vh", display: "flex", alignItems: "center", overflow: "hidden" }}>
        <img src={PHOTOS.hero1} alt="office" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 0 }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(105deg, rgba(0,60,50,.88) 0%, rgba(0,80,68,.72) 45%, rgba(0,30,24,.55) 100%)", zIndex: 1 }} />
        <div className="dot-bg" style={{ position: "absolute", inset: 0, zIndex: 1, opacity: .35 }} />

        <div style={{ position: "relative", zIndex: 2, maxWidth: 1240, margin: "0 auto", padding: "60px 28px", display: "grid", gridTemplateColumns: "1fr 420px", gap: 60, alignItems: "center", width: "100%" }}>
          <div>
            <div className="fade-up" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,.12)", border: "1px solid rgba(255,255,255,.22)", borderRadius: 24, padding: "5px 14px", marginBottom: 24 }}>
              <span className="pulse-dot" style={{ width: 8, height: 8, borderRadius: "50%", background: T.amber, display: "inline-block" }} />
              <span style={{ color: "rgba(255,255,255,.9)", fontSize: 11, fontWeight: 700, letterSpacing: 1.2 }}>URGENT OPENINGS — APPLY NOW</span>
            </div>
            <h1 className="fade-up s1" style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(38px,5vw,64px)", fontWeight: 800, color: "#fff", margin: "0 0 20px", lineHeight: 1.1 }}>
              Connecting<br />
              <span className="shimmer-txt">Exceptional Talent</span><br />
              with Opportunity
            </h1>
            <p className="fade-up s2" style={{ color: "rgba(255,255,255,.78)", fontSize: 18, lineHeight: 1.78, marginBottom: 36, maxWidth: 500 }}>
              India's trusted HR partner for Healthcare RCM, IT, Banking &amp; Non-IT domains.
            </p>
            <div className="fade-up s3" style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
              <Btn onClick={() => nav("jobs")} sz="lg">Browse All Jobs →</Btn>
              <Btn onClick={() => openAuth("user")} sz="lg" v="outline">Create Free Account</Btn>
            </div>
          </div>

          {/* Stats glass card */}
          <div className="slide-r s2" style={{ background: "rgba(255,255,255,.1)", backdropFilter: "blur(24px)", border: "1px solid rgba(255,255,255,.18)", borderRadius: 20, padding: 36 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28 }}>
              {STATS.map((st, i) => (
                <div key={i} className="fade-up" style={{ animationDelay: `${.3 + i * .08}s` }}>
                  <div style={{ fontSize: 38, fontWeight: 800, color: "#fff", lineHeight: 1, fontFamily: "'Playfair Display',serif" }}><Count n={st.n} s={st.s} /></div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,.6)", marginTop: 5, fontWeight: 500 }}>{st.l}</div>
                </div>
              ))}
            </div>
            <div style={{ borderTop: "1px solid rgba(255,255,255,.12)", marginTop: 24, paddingTop: 20 }}>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,.5)", letterSpacing: 1.2, marginBottom: 10, fontWeight: 700 }}>SPECIALIZED IN</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                {["Medical Coding","AR Calling","Medical Billing","IT","Banking"].map(s => (
                  <span key={s} style={{ background: "rgba(255,255,255,.12)", color: "rgba(255,255,255,.82)", borderRadius: 16, padding: "4px 11px", fontSize: 11, fontWeight: 600 }}>{s}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── URGENT BANNER ──────────────────────────────────────────── */}
      {urgentJobs.length > 0 && (
        <div style={{ background: "#FFFBEB", borderBottom: `4px solid ${T.amber}`, padding: "36px 28px" }}>
          <div style={{ maxWidth: 1240, margin: "0 auto" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 22 }}>
              <span style={{ fontSize: 26 }} className="float">🔥</span>
              <div>
                <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: T.dark, fontFamily: "'Playfair Display',serif" }}>Urgent Openings</h2>
                <p style={{ margin: 0, fontSize: 13, color: T.greyMd }}>Fill fast — apply immediately</p>
              </div>
              <Tag color="#D97706" sx={{ marginLeft: "auto" }}>⚡ HIRING NOW</Tag>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 16 }}>
              {urgentJobs.map((job, i) => (
                <div key={job.id} className={`hover-card fade-up s${Math.min(i + 1, 4)}`}
                  onClick={() => nav("job", job.id)}
                  style={{ background: T.white, border: `1px solid ${T.amber}55`, borderRadius: 14, padding: 22, borderLeft: `4px solid ${T.amber}`, cursor: "pointer", position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", top: 12, right: 12 }}><Tag color="#D97706">URGENT</Tag></div>
                  <div style={{ fontWeight: 700, fontSize: 16, color: T.dark, marginBottom: 6, paddingRight: 70 }}>{job.title}</div>
                  <div style={{ fontSize: 13, color: T.greyMd, marginBottom: 10, lineHeight: 1.7 }}>
                    📍 {job.loc}<br />💼 {job.exp}
                    {job.cert && <><br /><span style={{ color: "#D97706", fontWeight: 600 }}>⚠ Certification Required</span></>}
                  </div>
                  <div style={{ fontSize: 12, color: T.greyLt, marginBottom: 14 }}>📞 {job.phones[0]}</div>
                  <Btn sz="sm" sx={{ width: "100%", justifyContent: "center" }}>View & Apply →</Btn>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── PHOTO GALLERY ──────────────────────────────────────────── */}
      <div style={{ padding: "72px 28px", background: T.dark }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 56, alignItems: "center" }}>
          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ marginBottom: 16 }}><LogoFull size={54} white vertical /></div>
            <Tag color="rgba(255,255,255,.9)" sx={{ background: "rgba(255,255,255,.14)", border: "1px solid rgba(255,255,255,.25)", marginBottom: 14 }}>ABOUT US</Tag>
            <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(30px,5vw,52px)", fontWeight: 800, color: "#fff", margin: "0 0 14px", lineHeight: 1.15 }}>Catalyst HR Solutions</h1>
            <p style={{ color: "rgba(255,255,255,.5)", fontSize: 15 }}>Where talent meets opportunity every day</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gridTemplateRows: "220px 220px", gap: 14 }}>
            {GALLERY.map((ph, i) => (
              <div key={i} className={`hover-card fade-up`} style={{ borderRadius: 14, overflow: "hidden", position: "relative", gridColumn: i === 0 ? "span 1" : undefined, gridRow: i === 0 ? "span 2" : undefined, animationDelay: `${i * .07}s` }}>
                <img src={ph.src} alt={ph.caption} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform .6s ease" }}
                  onMouseEnter={e => e.currentTarget.style.transform = "scale(1.06)"}
                  onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"} />
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "28px 18px 16px", background: "linear-gradient(transparent,rgba(0,0,0,.65))" }}>
                  <span style={{ color: "#fff", fontSize: 13, fontWeight: 600 }}>{ph.caption}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── SERVICES ───────────────────────────────────────────────── */}
<div
  id="services"
  style={{
    padding: "72px 28px",
    background: T.off,
    scrollMarginTop: "90px"
  }}
>
  <div style={{ maxWidth: 1240, margin: "0 auto" }}>

    {/* Section Heading */}
    <div style={{ textAlign: "center", marginBottom: 52 }}>
      <Tag color={T.teal}>OUR EXPERTISE</Tag>

      <h2
        className="fade-up"
        style={{
          fontFamily: "'Playfair Display',serif",
          fontSize: "clamp(26px,3.5vw,40px)",
          fontWeight: 800,
          color: T.dark,
          margin: "14px 0 10px"
        }}
      >
        Comprehensive HR Solutions
      </h2>

      <p
        style={{
          color: T.greyMd,
          fontSize: 15,
          maxWidth: 500,
          margin: "0 auto"
        }}
      >
        Bridging the talent gap with precision, speed, and deep domain expertise.
      </p>
    </div>

    {/* Service Cards */}
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill,minmax(270px,1fr))",
        gap: 20
      }}
    >

      {/* Existing Services */}
      {SERVICES.map((svc, i) => (
        <Card
          key={svc.t}
          cls="fade-up"
          sx={{
            padding: 28,
            animationDelay: `${i * .07}s`
          }}
        >
          <div
            style={{
              width: 54,
              height: 54,
              borderRadius: 14,
              background: T.tealPale,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 28,
              marginBottom: 18
            }}
          >
            {svc.icon}
          </div>

          <div
            style={{
              fontWeight: 700,
              fontSize: 16,
              color: T.dark,
              marginBottom: 7
            }}
          >
            {svc.t}
          </div>

          <div
            style={{
              fontSize: 14,
              color: T.greyMd,
              lineHeight: 1.7
            }}
          >
            {svc.d}
          </div>
        </Card>
      ))}

      {/* Healthcare Services */}
      <Card
        key="Healthcare Services"
        cls="fade-up"
        sx={{
          padding: 28,
          animationDelay: `${SERVICES.length * .07}s`
        }}
      >
        <div
          style={{
            width: 54,
            height: 54,
            borderRadius: 14,
            background: T.tealPale,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 28,
            marginBottom: 18
          }}
        >
         ⚕️
        </div>

        <div
          style={{
            fontWeight: 700,
            fontSize: 16,
            color: T.dark,
            marginBottom: 7
          }}
        >
          Healthcare Services
        </div>

        <div
          style={{
            fontSize: 14,
            color: T.greyMd,
            lineHeight: 1.7
          }}
        >
          Healthcare staffing and workforce solutions.
        </div>
      </Card>

    </div>
  </div>
</div>

      {/* ── TEAM ───────────────────────────────────────────────────── */}
      <div style={{ padding: "72px 28px", background: T.white }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 56, alignItems: "center" }}>
          <div className="slide-l">
            <Tag color={T.teal}>WHY CHOOSE US</Tag>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(26px,3.5vw,38px)", fontWeight: 800, color: T.dark, margin: "14px 0 18px", lineHeight: 1.2 }}>10+ Years of Placing the Right Talent</h2>
            <p style={{ color: T.grey, lineHeight: 1.85, fontSize: 15, marginBottom: 20 }}>With deep roots in Healthcare RCM and growing strength across IT and BFSI, we've built a reputation for placements that stick.</p>
            {[["500+","Successful Placements"],["100+","Enterprise Clients"],["95%","Retention Rate"],["48hrs","Average Time to Shortlist"]].map(([n, l]) => (
              <div key={l} style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 14 }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: T.teal, fontFamily: "'Playfair Display',serif", minWidth: 60 }}>{n}</div>
                <div style={{ fontSize: 14, color: T.grey }}>{l}</div>
              </div>
            ))}
            <Btn onClick={() => nav("about")} sx={{ marginTop: 12 }}>Our Story →</Btn>
          </div>
          <div className="slide-r" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {[PHOTOS.team1, PHOTOS.team2, PHOTOS.office2, PHOTOS.office4].map((src, i) => (
              <div key={i} style={{ borderRadius: 14, overflow: "hidden", height: 200 }}>
                <img src={src} alt="team" style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform .5s" }}
                  onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"}
                  onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── MARQUEE TICKER ─────────────────────────────────────────── */}
      <div style={{ background: T.teal, padding: "14px 0", overflow: "hidden" }}>
        <div className="marquee-track">
          {[...Array(2)].flatMap(() =>
            ["🏥 Healthcare RCM","💻 IT Staffing","🏦 Banking & BFSI","👥 Non-IT","📋 Contract Hiring","🔍 Executive Search","✅ 500+ Placements","⚡ Urgent Openings"].map((t, i) => (
              <span key={`${t}-${i}`} style={{ color: "#fff", fontWeight: 700, fontSize: 14, whiteSpace: "nowrap", padding: "0 24px", borderRight: "1px solid rgba(255,255,255,.25)" }}>{t}</span>
            ))
          )}
        </div>
      </div>

      {/* ── CTA ────────────────────────────────────────────────────── */}
      <div style={{ background: T.dark, padding: "80px 28px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "relative", zIndex: 1, maxWidth: 680, margin: "0 auto", textAlign: "center" }}>
          <div style={{ marginBottom: 24, display: "flex", justifyContent: "center" }}>
            <LogoFull size={64} white vertical />
          </div>
          <h2 className="fade-up" style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(26px,4vw,44px)", fontWeight: 800, color: "#fff", margin: "0 0 14px" }}>Ready to Take the Next Step?</h2>
          <p style={{ color: "rgba(255,255,255,.6)", fontSize: 17, marginBottom: 36 }}>Join thousands of professionals who found their dream role through Catalyst HR.</p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <Btn onClick={() => nav("jobs")} sz="lg">View All Openings →</Btn>
            <Btn onClick={() => openAuth("user")} sz="lg" v="outline">Create Free Account</Btn>
          </div>
        </div>
      </div>

    </div>
  );
}
