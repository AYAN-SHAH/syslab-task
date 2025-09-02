export default function FormField({ label, children, hint, error }) {
  return (
    <label className="form-field">
      <span className="label-text">{label}</span>
      {children}
      {hint && <span className="hint">{hint}</span>}
      {error && <span className="error">{error}</span>}
    </label>
  )
}


