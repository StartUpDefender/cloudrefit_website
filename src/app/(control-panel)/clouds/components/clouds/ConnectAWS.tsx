import {
  Card,
  CardContent,
  Typography,
  Stack,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  Box,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

import {
  awsConnectSchema,
  AwsConnectFormValues,
} from "@/types/awsConnect.schema";

type Props = {
  onBack: () => void;
};

export function AwsConnectCard({ onBack }: Props) {
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<AwsConnectFormValues>({
    resolver: zodResolver(awsConnectSchema),
    mode: "onChange",
    defaultValues: {
      curOption: "new",
    },
  });

  async function onSubmit(data: AwsConnectFormValues) {
    setLoading(true);
    try {
      console.log("AWS CUR option:", data);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Header */}
      <Stack spacing={1} mb={4}>
        <Typography variant="body2" color="text.secondary">
          You have chosen to onboard your AWS account. Ensure to use the{" "}
          <Box
            component="span"
            fontWeight={600}
            sx={{ textDecoration: "underline" }}
          >
            management account
          </Box>{" "}
          while onboarding, to onboard other accounts later on.
        </Typography>
      </Stack>

      {/* CUR Section */}
      <Stack spacing={2} mb={5}>
        <Typography fontWeight={600}>
          Connect with CUR (Cost & Usage Report)
        </Typography>

        <Typography variant="body2" color="text.secondary">
          For Economize to connect with your AWS account, it will need access to
          the Cost and Usage Report (CUR) through an IAM role.
        </Typography>

        <Controller
          name="curOption"
          control={control}
          render={({ field }) => (
            <RadioGroup {...field}>
              <FormControlLabel
                value="new"
                control={<Radio />}
                label="Create and use a new CUR (Recommended)"
              />
              <FormControlLabel
                value="existing"
                control={<Radio />}
                label="Use an existing CUR"
              />
            </RadioGroup>
          )}
        />
      </Stack>

      {/* Actions */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mt={6}
      >
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={onBack}
          sx={{ px: 4, borderRadius: 2 }}
        >
          Back
        </Button>

        <Button
          type="submit"
          variant="contained"
          disabled={!isValid || loading}
          sx={{
            px: 5,
            borderRadius: 2,
            bgcolor: "#15153A",
            "&:hover": { bgcolor: "#1E1E55" },
          }}
        >
          {loading ? "Creating..." : "Create Stack"}
        </Button>
      </Stack>
    </form>
  );
}
