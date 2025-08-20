import React, { useRef, useState, useEffect } from "react";
import "./ExpandableText.css";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

const ExpandableText = ({ children }) => {
  const textRef = useRef(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showToggle, setShowToggle] = useState(false);
  const [isClamped, setIsClamped] = useState(false);

  useEffect(() => {
    const element = textRef.current;
    if (!element) return;

    // Temporarily remove clamping to measure full height
    element.classList.remove("clamp-text");

    const lineHeight = parseFloat(getComputedStyle(element).lineHeight);
    const lines = element.scrollHeight / lineHeight;

    if (lines > 4) {
      setShowToggle(true);
      setIsClamped(true); // Apply clamping after measuring
    }
  }, [children]);

  return (
    <div className="expandable">
      <p
        ref={textRef}
        className={isExpanded || !isClamped ? "full-text" : "clamp-text"}
      >
        {children}
      </p>

      {showToggle && (
        <span className="read-more" onClick={() => setIsExpanded(!isExpanded)}>
          {!isExpanded ? (
            <>
              read more <KeyboardArrowDownIcon />
            </>
          ) : (
            <>
              read less <KeyboardArrowUpIcon />
            </>
          )}
        </span>
      )}
    </div>
  );
};

export default ExpandableText;
