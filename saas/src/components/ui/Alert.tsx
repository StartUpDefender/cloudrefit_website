import { ReactNode } from "react";
import { FiAlertCircle, FiCheckCircle, FiInfo, FiX } from "react-icons/fi";

export type AlertVariant = "error" | "success" | "warning" | "info";

interface AlertProps {
  variant?: AlertVariant;
  title?: string;
  message: string;
  onClose?: () => void;
  className?: string;
}

const variantStyles: Record<AlertVariant, string> = {
  error: "bg-rose-50 border-rose-200 text-rose-700",
  success: "bg-emerald-50 border-emerald-200 text-emerald-700",
  warning: "bg-amber-50 border-amber-200 text-amber-600",
  info: "bg-blue-50 border-blue-200 text-blue-700",
};

const iconMap: Record<AlertVariant, ReactNode> = {
  error: <FiAlertCircle className="h-5 w-5" />,
  success: <FiCheckCircle className="h-5 w-5" />,
  warning: <FiAlertCircle className="h-5 w-5" />,
  info: <FiInfo className="h-5 w-5" />,
};

export default function Alert({
  variant = "error",
  title,
  message,
  onClose,
  className = "",
}: AlertProps) {
  return (
    <div
      className={`rounded-lg border p-3 text-sm ${variantStyles[variant]} animate-slide-in-down ${className}`}
      role="alert"
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">{iconMap[variant]}</div>
        <div className="flex-1 min-w-0">
          {title && (
            <h4 className="font-semibold mb-1 text-sm">{title}</h4>
          )}
          <p className="text-sm leading-relaxed">{message}</p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="flex-shrink-0 text-current opacity-60 hover:opacity-100 transition"
            aria-label="Close alert"
          >
            <FiX className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}


