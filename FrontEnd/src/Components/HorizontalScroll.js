import "./HorizontalScroll.css";
import React, { useRef } from "react";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

export function HorizontalScroll({ children }) {
  const containerRef = useRef(null);

  const scrollLeft = () => {
    containerRef.current.scrollBy({
      left: -400,
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    containerRef.current.scrollBy({
      left: 400,
      behavior: "smooth",
    });
  };

  return (
    <div className="scroll-container">
      <button className="btn left" onClick={() => scrollLeft()}>
        <ArrowBackIosNewIcon />
      </button>
      <button className="btn right" onClick={() => scrollRight()}>
        <ArrowForwardIosIcon />
      </button>
      <div className="scroll-content" ref={containerRef}>
        {children}
      </div>
    </div>
  );
}
