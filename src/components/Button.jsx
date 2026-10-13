
function Button({
  children,
  buttonText,
  className = "btn btn-primary",
  type = "button",
  disabled = false,
  ...props
}) {
  return (
    <button
      type={type}
      className={className}
      disabled={disabled}
      {...props}
    >
      {children ?? buttonText}
    </button>
  );
}

export default Button;
