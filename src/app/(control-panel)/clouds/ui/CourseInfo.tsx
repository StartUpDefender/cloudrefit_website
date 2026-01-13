import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import clsx from "clsx";
import CourseCategory from "./CourseCategory";
import { Project } from "../api/types";

type CourseInfoProps = {
  project: Project;
  className?: string;
};

/**
 * The CourseInfo component.
 */
const STATUS_CONFIG = {
  connected: {
    bg: "bg-green-50",
    text: "text-green-600",
    icon: "lucide:badge-check",
  },
  issued: {
    bg: "bg-red-50",
    text: "text-red-600",
    icon: "lucide:alert-circle",
  },
  malfunctioned: {
    bg: "bg-orange-50",
    text: "text-orange-600",
    icon: "lucide:alert-triangle",
  },
} as const;

function CourseInfo(props: CourseInfoProps) {
  const { project, className } = props;
  const statusConfig = STATUS_CONFIG[project.status];
  if (!project) {
    return null;
  }

  return (
    <div className={clsx("w-full", className)}>
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <Typography className="text-lg font-semibold">
          {project.name}
        </Typography>

        {statusConfig && (
          <div
            className={clsx(
              "flex items-center gap-1 rounded-full px-3 py-1 text-sm",
              statusConfig.bg,
              statusConfig.text
            )}
          >
            {/* <FuseSvgIcon size={16}>{statusConfig.icon}</FuseSvgIcon> */}
            <span className="font-medium">{project.statusLabel}</span>
          </div>
        )}
      </div>

      {/* Info rows */}
      <div className="space-y-3 text-sm text-gray-500">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FuseSvgIcon size={18}>lucide:sparkles</FuseSvgIcon>
            <span>Potential savings:</span>
          </div>
          <span className="font-medium text-gray-900">
            {project.potentialSavings.amount}
            <span> {project.potentialSavings.percentage}</span>
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FuseSvgIcon size={18}>lucide:dollar-sign</FuseSvgIcon>
            <span>Monthly cost:</span>
          </div>
          <span className="font-medium text-gray-900">
            {project.monthlyCost}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FuseSvgIcon size={18}>lucide:file-text</FuseSvgIcon>
            <span>Reports:</span>
          </div>
          <span className="font-medium text-gray-900">{project.reports}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FuseSvgIcon size={18}>lucide:clock</FuseSvgIcon>
            <span>Data freshness:</span>
          </div>
          <span className="font-medium text-green-600">
            {project.dataFreshness}
          </span>
        </div>
      </div>
    </div>
  );
}

export default CourseInfo;
