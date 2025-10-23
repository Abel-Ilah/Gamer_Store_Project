import "./Title.css";

export default function Title({ title }) {
  return (
    <div className="title">
      <h5 className="main-title">{title ? title : null}</h5>
      <span className="line"></span>
    </div>
  );
}
