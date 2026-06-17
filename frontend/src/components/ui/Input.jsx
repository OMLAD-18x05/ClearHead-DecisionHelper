
export default function Input({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder = "",
  error = "",
  disabled = false,
  required = false,
  helperText = "",
}) {
  const id = name || label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="flex items-center gap-1.5 justify-between">
      {label && (
        <label htmlFor={id} className="text-sm font-bold pr-3 text-indigo-900 tracking-wide">
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}

      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : helperText ? `${id}-helper` : undefined}
        className={`
          w-80 px-3.5 py-2.5 rounded-lg text-sm text-indigo-500 bg-blue-100
          border outline-none transition-all placeholder:text-gray-600 
          ${error
            ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
            : "border-gray-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
          }
          ${disabled ? "opacity-40 cursor-not-allowed" : ""}
        `}
      />

      {error && (
        <span id={`${id}-error`} role="alert" className="text-xs text-red-400">
          {error}
        </span>
      )}
      {!error && helperText && (
        <span id={`${id}-helper`} className="text-xs text-gray-500">
          {helperText}
        </span>
      )}
    </div>
  );
}