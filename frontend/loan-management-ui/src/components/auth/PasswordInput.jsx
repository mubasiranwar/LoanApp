"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Input from "../common/Input";

// A password field with a show / hide toggle.
export default function PasswordInput({ label = "Password", ...props }) {
  const [visible, setVisible] = useState(false);

  return (
    <Input
      {...props}
      label={label}
      variant="auth"
      type={visible ? "text" : "password"}
      endAdornment={
        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
          className="absolute inset-y-0 right-1 flex w-11 items-center justify-center rounded-lg text-slate-400 transition hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/30"
        >
          {visible ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
        </button>
      }
    />
  );
}
