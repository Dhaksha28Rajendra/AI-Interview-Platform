"use client";

import { Bell } from "lucide-react";

type User = {
  id: number;
  email: string;
  full_name: string;
};

type DashboardHeaderProps = {
  user: User | null;
  title?: string;
  subtitle?: string;
};

export default function DashboardHeader({
  user,
  title = "Dashboard",
  subtitle = "Your interview preparation workspace",
}: DashboardHeaderProps) {
  const initial = user?.full_name?.charAt(0).toUpperCase() || "U";

  return (
    <header
      style={{
        height: "80px",
        background: "#ffffff",
        borderBottom: "1px solid #e2e8f0",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 32px",
        flexShrink: 0,
      }}
    >
      {/* Page information */}
      <div>
        <div
          style={{
            fontSize: "16px",
            fontWeight: 700,
            color: "#0f172a",
          }}
        >
          {title}
        </div>

        <div
          style={{
            fontSize: "12px",
            color: "#94a3b8",
            marginTop: "3px",
          }}
        >
          {subtitle}
        </div>
      </div>

      {/* Right side */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
        }}
      >
        {/* Notification button */}
        <button
          type="button"
          aria-label="Notifications"
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "10px",
            border: "1px solid #e2e8f0",
            background: "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#64748b",
            cursor: "pointer",
          }}
        >
          <Bell size={19} />
        </button>

        {/* Divider */}
        <div
          style={{
            width: "1px",
            height: "32px",
            background: "#e2e8f0",
          }}
        />

        {/* User */}
        <div
          style={{
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
              alignItems: "center",
              justifyContent: "center",
              fontSize: "13px",
              fontWeight: 700,
            }}
          >
            {initial}
          </div>

          <div>
            <div
              style={{
                fontSize: "13px",
                fontWeight: 600,
                color: "#0f172a",
              }}
            >
              {user?.full_name || "User"}
            </div>

            <div
              style={{
                fontSize: "11px",
                color: "#94a3b8",
                marginTop: "2px",
              }}
            >
              Candidate
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}