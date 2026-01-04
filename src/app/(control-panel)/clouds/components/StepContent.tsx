import { useForm, Controller } from "react-hook-form";
import {
  Box,
  Button,
  TextField,
  Typography,
  InputAdornment,
  Stack,
} from "@mui/material";
import CloudIcon from "@mui/icons-material/Cloud";
import EmailIcon from "@mui/icons-material/Email";
import BusinessIcon from "@mui/icons-material/Business";
import AccountDetailsForm from "./AccountDetails";

interface Props {
  step: number;
  onNext: (step) => void;
}

export function StepContent({ step, onNext }: Props) {
  switch (step) {
    case 0:
      return (
        <AccountDetailsForm
          onNext={(data) => {
            console.log(data);
            onNext(1);
          }}
        />
      );
    case 1:
      return <Typography>Pick your onboarding date</Typography>;
    case 2:
      return <Typography>Invite team members</Typography>;
    case 3:
      return <Typography>Connect your cloud provider</Typography>;
    default:
      return null;
  }
}
