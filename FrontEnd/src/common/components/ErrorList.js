import ErrorMessage from "../components/ErrorMessage";
function ErrorList({ errors = [] }) {
  if (!errors || errors.length === 0) return null;
  return (
    <>
      {errors.map((err) => (
        <ErrorMessage message={err} />
      ))}
    </>
  );
}

export default ErrorList;
