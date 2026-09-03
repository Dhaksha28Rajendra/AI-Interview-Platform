"use client";

import {
  LayoutDashboard,
  MessageSquareText,
  Code2,
  BarChart3,
  FileText,
  Settings,
  LogOut,
  BrainCircuit,
} from "lucide-react";

type User = {
  id: number;
  email: string;
  full_name: string;
};

type SidebarProps = {
  user: User | null;
  onLogout: () => void;
};

export default function Sidebar({ user, onLogout }: SidebarProps) {
  const initial = user?.full_name?.charAt(0).toUpperCase() || "U";

  return (
    <aside
      style={{
        width: "255px",
        minHeight: "100vh",
        background: "#ffffff",
        borderRight: "1px solid #e2e8f0",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
      }}
    >
      {/* Logo */}
      <div
        style={{
          height: "80px",
          padding: "0 28px",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          borderBottom: "1px solid #e2e8f0",
        }}
      >
        <div
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "10px",
            background: "linear-gradient(135deg, #7c3aed, #6d28d9)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
          }}
        >
          <BrainCircuit size={23} />
        </div>

        <div>
          <div
            style={{
              fontSize: "17px",
              fontWeight: 700,
              color: "#0f172a",
            }}
          >
            InterviewAI
          </div>

          <div
            style={{
              fontSize: "12px",
              color: "#94a3b8",
              marginTop: "2px",
            }}
          >
            AI Interview Platform
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav
        style={{
          padding: "24px 20px",
          flex: 1,
        }}
      >
        <p
          style={{
            fontSize: "12px",
            fontWeight: 600,
            color: "#94a3b8",
            letterSpacing: "0.7px",
            margin: "0 0 12px 12px",
          }}
        >
          WORKSPACE
        </p>

        <SidebarItem
          icon={<LayoutDashboard size={20} />}
          label="Dashboard"
          active
        />

        <SidebarItem
          icon={<MessageSquareText size={20} />}
          label="Interviews"
        />

        <SidebarItem icon={<Code2 size={20} />} label="Practice" />

        <SidebarItem
          icon={<BarChart3 size={20} />}
          label="Performance"
        />

        <SidebarItem icon={<FileText size={20} />} label="Resume" />

        <p
          style={{
            fontSize: "12px",
            fontWeight: 600,
            color: "#94a3b8",
            letterSpacing: "0.7px",
            margin: "35px 0 12px 12px",
          }}
        >
          ACCOUNT
        </p>

        <SidebarItem icon={<Settings size={20} />} label="Settings" />

        <button
          onClick={onLogout}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: "14px",
            padding: "12px",
            border: "none",
            background: "transparent",
            borderRadius: "10px",
            fontSize: "14px",
            color: "#475569",
            cursor: "pointer",
            textAlign: "left",
          }}
        >
          <LogOut size={20} />
          Logout
        </button>
      </nav>

      {/* User */}
      <div
        style={{
          padding: "16px 20px",
          borderTop: "1px solid #e2e8f0",
        }}
      >
        <div
          style={{
            background: "#f8fafc",
            padding: "12px",
            borderRadius: "12px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <div
            style={{
              width: "38px",
              height: "38px",
              borderRadius: "50%",
              background: "#ede9fe",
              color: "#7c3aed",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontWeight: 700,
            }}
          >
            {initial}
          </div>

          <div style={{ overflow: "hidden" }}>
            <div
              style={{
                fontSize: "13px",
                fontWeight: 600,
                color: "#0f172a",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {user?.full_name || "User"}
            </div>

            <div
              style={{
                fontSize: "11px",
                color: "#94a3b8",
                marginTop: "3px",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {user?.email || ""}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

function SidebarItem({
  icon,
  label,
  active = false,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}) {
  return (
    <button
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        gap: "14px",
        padding: "12px",
        marginBottom: "4px",
        border: "none",
        borderRadius: "10px",
        background: active ? "#f3f0ff" : "transparent",
        color: active ? "#6d28d9" : "#475569",
        fontSize: "14px",
        cursor: "pointer",
        textAlign: "left",
      }}
    >
      {icon}
      {label}
    </button>
  );
}