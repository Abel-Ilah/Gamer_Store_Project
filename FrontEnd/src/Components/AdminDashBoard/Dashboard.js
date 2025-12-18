import "./Dashboard.css";
import "./styles/StyledScrollbar.css";
import "./styles/StyledTextInput.css";
import "./styles/StyledSelect.css";
import "./styles/StyledInputErrors.css";
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
      <main className="main">
        <DashboardHeader
          toggleSidebar={() => {
            setIsSidebarFixed(!isSidebarFixed);
          }}
          isSidebarFixed={isSidebarFixed}
        />
        <section className="content styled-scrollbar">
          <Outlet />
        </section>
      </main>
    </main>
  );
}
