import "./StatCard.css";
import React from "react";
import FilterIcon from "@mui/icons-material/Filter";
import NorthIcon from "@mui/icons-material/North";
import SouthIcon from "@mui/icons-material/South";
import settings from "../../appsettings.json";
export const StatCard = ({
  Icon = { FilterIcon },
  iconStyle = {},
  title = "title",
  value = 100,
  progress = 20,
  currency = false,
}) => {
  return (
    <div className="statcard">
      <div className="box1">
        <Icon className="icon" style={iconStyle} />
        <span className="card-title">{title}</span>
        <h3 className="value">
          {value} {currency && settings.currrency}
        </h3>
      </div>
      <div className="box2">
        <span
          className={`progress-value ${
            progress >= 0 ? "increase" : "decrease"
          }`}
        >
          {progress >= 0 ? (
            <NorthIcon className="icon" />
          ) : (
            <SouthIcon className="icon" />
          )}{" "}
          {Math.abs(progress)}%
        </span>
      </div>
    </div>
  );
};
