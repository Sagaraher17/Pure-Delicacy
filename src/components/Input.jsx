
function Input({
  id,
  label,
  type = "text",
  className = "form-control",
  ...props
}) {
  return (
    <div>
      {label && (
        <label htmlFor={id} className="form-label">
          {label}
        </label>
      )}
      <input
        id={id}
        name={id}
        type={type}
        className={className}
        {...props}
      />
    </div>
  );
}

export default Input;
