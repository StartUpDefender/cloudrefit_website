import { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonProps = {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  children: ReactNode;
  fullWidth?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({
  variant = "primary",
  size = "md",
  children,
  fullWidth = false,
  className = "",
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center rounded-lg font-semibold shadow-sm transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100";

  const variants = {
    primary:
      "bg-gradient-to-r from-[var(--brand)] via-[var(--brand-strong)] to-[var(--brand)] text-white hover:from-[var(--brand-strong)] hover:via-[var(--brand)] hover:to-[var(--brand-strong)] focus:ring-[var(--brand)]/50",
    secondary:
      "bg-[var(--brand-soft)] text-[var(--brand-strong)] hover:bg-[var(--brand-soft)]/80 focus:ring-[var(--brand)]/20",
    outline:
      "border-2 border-[var(--brand)] text-[var(--brand-strong)] hover:bg-[var(--brand-soft)] focus:ring-[var(--brand)]/20",
    ghost:
      "text-[var(--brand-strong)] hover:bg-[var(--brand-soft)] focus:ring-[var(--brand)]/20",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2.5 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${
        fullWidth ? "w-full" : ""
      } ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

