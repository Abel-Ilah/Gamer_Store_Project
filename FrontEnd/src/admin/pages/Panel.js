import "./Panel.css";
import "../styles/StyledScrollbar.css";
import "../styles/StyledTextInput.css";
import "../styles/StyledSelect.css";
import "../styles/StyledInputErrors.css";
import { Sidebar } from "../components/Sidebar";
import { PanelHeader } from "../components/PanelHeader";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";

export function Panel() {
  const [isSidebarFixed, setIsSidebarFixed] = useState(false);

  const darkMode = useSelector((state) => state.theme.darkMode);

  return (
    <main className={`panel ${darkMode ? "dark" : ""}`}>
      <Sidebar isSidebarFixed={isSidebarFixed} />

      <main className="main">
        <PanelHeader
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
