"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";



const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: "📊", color: "var(--accent-cyan)" },
  { href: "/leads", label: "Leads", icon: "🎯", color: "var(--accent-electric)" },
  { href: "/members", label: "Members", icon: "💪", color: "var(--accent-lime)" },
  { href: "/attendance", label: "Attendance", icon: "🔥", color: "var(--accent-amber)" },
  { href: "/recovery", label: "Recovery", icon: "🚨", color: "var(--accent-red)" },
  { href: "/imports", label: "Imports", icon: "📥", color: "var(--accent-orange)" },
  { href: "/settings/whatsapp", label: "WhatsApp", icon: "💬", color: "var(--accent-emerald)" },
] as const;

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <>
      {/* ── Desktop Sidebar ─────────────────────────────────── */}
      <aside className="hidden lg:flex lg:w-[240px] lg:flex-col lg:fixed lg:inset-y-0 lg:z-40">
        <div
          className="flex h-full flex-col gap-4 border-r px-4 py-6"
          style={{
            background: "var(--bg-secondary)",
            borderColor: "var(--glass-border)",
          }}
        >
          {/* Logo */}
          <div className="px-3 pb-4" style={{ borderBottom: "1px solid var(--glass-border)" }}>
            <div className="flex items-center gap-3">
              <div
                className="flex h-9 w-9 items-center justify-center rounded-xl text-lg"
                style={{
                  background: "linear-gradient(135deg, var(--accent-electric), var(--accent-cyan))",
                }}
              >
                🏋️
              </div>
              <div>
                <p className="text-sm font-bold font-display" style={{ color: "var(--text-primary)" }}>
                  Gym Growth OS
                </p>
                <p className="text-[10px] font-medium uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
                  Command Center
                </p>
              </div>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="flex-1 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href as string}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  href={item.href as any}
                  className="group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all"
                  style={{
                    color: isActive ? "var(--text-primary)" : "var(--text-secondary)",
                    background: isActive ? "var(--bg-surface-hover)" : "transparent",
                  }}
                >
                  {/* Active indicator */}
                  {isActive && (
                    <div
                      className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full"
                      style={{
                        background: item.color,
                        boxShadow: `0 0 10px ${item.color}`,
                      }}
                    />
                  )}
                  <span className="text-base">{item.icon}</span>
                  <span>{item.label}</span>
                  {isActive && (
                    <div
                      className="ml-auto h-1.5 w-1.5 rounded-full"
                      style={{
                        background: item.color,
                        boxShadow: `0 0 6px ${item.color}`,
                      }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div
            className="flex items-center gap-3 rounded-xl px-3 py-3"
            style={{
              background: "var(--bg-surface)",
              borderTop: "1px solid var(--glass-border)",
            }}
          >
            <div
              className="flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold"
              style={{
                background: "linear-gradient(135deg, var(--accent-electric), var(--accent-cyan))",
                color: "white",
              }}
            >
              K
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold truncate" style={{ color: "var(--text-primary)" }}>
                Gym Owner
              </p>
              <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>
                Owner / Admin
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Mobile Bottom Tab Bar ───────────────────────────── */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-50 flex lg:hidden"
        style={{
          background: "var(--bg-secondary)",
          borderTop: "1px solid var(--glass-border)",
          backdropFilter: "blur(20px)",
        }}
      >
        {navItems.slice(0, 5).map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href as string}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              href={item.href as any}
              className="flex flex-1 flex-col items-center gap-0.5 py-2.5 text-center transition-all"
              style={{ color: isActive ? item.color : "var(--text-muted)" }}
            >
              {/* Active top indicator */}
              <div
                className="absolute top-0 h-[2px] w-10 rounded-b-full transition-opacity"
                style={{
                  background: item.color,
                  boxShadow: `0 2px 8px ${item.color}`,
                  opacity: isActive ? 1 : 0,
                }}
              />
              <span className="text-lg">{item.icon}</span>
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
