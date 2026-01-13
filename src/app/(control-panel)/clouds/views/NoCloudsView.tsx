"use client";
import DemoContent from "@fuse/core/DemoContent";
import FusePageSimple from "@fuse/core/FusePageSimple";
import { useTranslation } from "react-i18next";
import { styled } from "@mui/material/styles";
import "../i18n";
import { Box, Stack, Typography } from "@mui/material";
import { useState } from "react";
import { CustomStepper } from "@/components/Stepper";
import AccountDetailsForm from "../components/AccountDetails";
import ScheduleOnboarding from "../components/ScheduleOnboarding";
import InviteMember from "../components/InviteMember";
import ConnectCloud from "../components/ConnectCloud";

const Root = styled(FusePageSimple)(({ theme }) => ({
  "& .FusePageSimple-header": {
    borderBottomWidth: 1,
    borderStyle: "solid",
    borderColor: theme.vars.palette.divider,
  },
}));

function NoCloudsView() {
  const { t } = useTranslation("cloudPage");
  const [activeStep, setActiveStep] = useState(0);

  const next = () => setActiveStep((s) => s + 1);
  const back = () => setActiveStep((s) => s - 1);

  return (
    <Root
      header={
        <div className="p-6">
          <Typography className="font-bold">{t("TITLE")}</Typography>
          <br />
          <Typography>{t("SUB")}</Typography>
        </div>
      }
      content={
        <Box
          sx={{
            margin: 4,
            padding: 4,
            borderRadius: 5,
          }}
        >
          <Stack spacing={5}>
            <CustomStepper activeStep={activeStep} />
            <div>
              {activeStep === 0 && <AccountDetailsForm onNext={next} />}
              {activeStep === 1 && (
                <ScheduleOnboarding onNext={next} onBack={back} />
              )}
              {activeStep === 2 && <InviteMember onNext={next} onBack={back} />}
              {activeStep === 3 && <ConnectCloud onBack={back} />}
            </div>
          </Stack>
        </Box>
      }
    />
  );
}

export default NoCloudsView;
