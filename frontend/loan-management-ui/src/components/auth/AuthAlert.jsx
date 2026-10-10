export default function AuthAlert({ message }) {
  if (!message) return null;

  return (
    <p
      role="alert"
      className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm leading-5 text-rose-700"
    >
      {message}
    </p>
  );
}
