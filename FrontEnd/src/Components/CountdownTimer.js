import React, { useEffect, useState } from "react";

function CountdownTimer({ createdAt, expiresAt }) {
  const [timeLeft, setTimeLeft] = useState(getRemainingSeconds());

  function getRemainingSeconds() {
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diff = Math.max(0, Math.floor((expiry - now) / 1000));
    return diff;
  }
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getRemainingSeconds());
    }, 1000);

    return () => clearInterval(timer);
  }, [createdAt, expiresAt]);

  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const sec = (seconds % 60).toString().padStart(2, "0");
    return `${min}:${sec}`;
  };

  return (
    <div
      style={{
        fontSize: "1.5rem",
        fontFamily: "monospace",
        color: timeLeft === 0 ? "red" : "black",
      }}
    >
      {formatTime(timeLeft)}
    </div>
  );
}

export default CountdownTimer;
