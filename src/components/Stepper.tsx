"use client";
import * as React from "react";
import { styled } from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import InfoIcon from "@mui/icons-material/Info";
import EventNoteIcon from "@mui/icons-material/EventNote";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import CloudDoneIcon from "@mui/icons-material/CloudDone";
import StepConnector, {
  stepConnectorClasses,
} from "@mui/material/StepConnector";
import { StepIconProps } from "@mui/material/StepIcon";
import { useTranslation } from "react-i18next";

const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
  },
  [`&.${stepConnectorClasses.active} .${stepConnectorClasses.line}`]: {
    backgroundImage: `linear-gradient(135deg, ${theme.palette.secondary.light}, ${theme.palette.secondary.dark})`,
  },
  [`&.${stepConnectorClasses.completed} .${stepConnectorClasses.line}`]: {
    backgroundImage: `linear-gradient(135deg, ${theme.palette.secondary.light}, ${theme.palette.secondary.dark})`,
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    borderRadius: 1,
    backgroundColor: theme.palette.grey[300],
    ...theme.applyStyles("dark", {
      backgroundColor: theme.palette.grey[800],
    }),
  },
}));

const ColorlibStepIconRoot = styled("div")<{
  ownerState: { completed?: boolean; active?: boolean };
}>(({ theme, ownerState }) => ({
  backgroundColor: theme.palette.grey[400],
  zIndex: 1,
  color: "#fff",
  width: 50,
  height: 50,
  display: "flex",
  borderRadius: "50%",
  justifyContent: "center",
  alignItems: "center",
  ...(ownerState.active && {
    backgroundImage: `linear-gradient(135deg, ${theme.palette.secondary.light}, ${theme.palette.secondary.dark})`,
    boxShadow: `0 6px 14px rgba(26, 26, 63, 0.35)`,
  }),
  ...(ownerState.completed && {
    backgroundColor: theme.palette.secondary.main,
  }),
  ...theme.applyStyles("dark", {
    backgroundColor: theme.palette.grey[700],
    ...(ownerState.completed && {
      backgroundColor: theme.palette.secondary.dark,
    }),
  }),
}));

function ColorlibStepIcon(props: StepIconProps) {
  const { active, completed, className, icon } = props;
  const icons: Record<string, React.ReactElement> = {
    1: <InfoIcon />,
    2: <EventNoteIcon />,
    3: <GroupAddIcon />,
    4: <CloudDoneIcon />,
  };
  return (
    <ColorlibStepIconRoot
      ownerState={{ completed, active }}
      className={className}
    >
      {icons[String(icon)]}
    </ColorlibStepIconRoot>
  );
}

interface Props {
  activeStep: number;
}

export function CustomStepper({ activeStep }: Props) {
  const { t } = useTranslation("cloudPage");

  const steps = [
    t("STEP_ACCOUNT_DETAILS"),
    t("STEP_SCHEDULE_ONBOARDING"),
    t("STEP_INVITE_MEMBER"),
    t("STEP_CONNECT_CLOUD"),
  ];

  return (
    <Stack sx={{ width: "100%" }} spacing={4}>
      <Stepper
        alternativeLabel
        activeStep={activeStep}
        connector={<ColorlibConnector />}
      >
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel StepIconComponent={ColorlibStepIcon}>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
    </Stack>
  );
}
