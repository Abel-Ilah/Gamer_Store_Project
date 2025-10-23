import "./Dashboard.css";
import { Sidebar } from "./Sidebar";
import { DashboardHeader } from "./DashboardHeader";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";

export function Dashboard() {
  const [isSidebarFixed, setIsSidebarFixed] = useState(false);

  const darkMode = useSelector((state) => state.theme.darkMode);

  return (
    <main className={`dashboard ${darkMode ? "dark" : ""}`}>
      <Sidebar isSidebarFixed={isSidebarFixed} />
      <main
        className="main"
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <DashboardHeader
          toggleSidebar={() => {
            setIsSidebarFixed(!isSidebarFixed);
          }}
          isSidebarFixed={isSidebarFixed}
        />
        <section className="content">
          <Outlet />
        </section>
      </main>
    </main>
  );
}
