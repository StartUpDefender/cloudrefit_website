"use client";
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
import BusinessIcon from "@mui/icons-material/Business";
import { useTranslation } from "react-i18next";

type FormValues = {
  cloudName: string;
  organization: string;
};

export default function AccountDetailsForm({
  onNext,
}: {
  onNext?: (data: FormValues) => void;
}) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      cloudName: "",
      organization: "",
    },
  });

  const { t } = useTranslation("cloudPage");

  const submitHandler = (data: FormValues) => {
    onNext?.(data);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(submitHandler)}
      sx={{
        maxWidth: "100%",
        p: 4,
        borderRadius: 2,
      }}
    >
      <Typography variant="h6" fontWeight={600} mb={3}>
        {t("TITLE")}
      </Typography>

      <Stack spacing={3}>
        <Controller
          name="cloudName"
          control={control}
          rules={{ required: t("CLOUD_NAME_REQUIRED") }}
          render={({ field }) => (
            <TextField
              {...field}
              label={t("CLOUD_NAME_LABEL")}
              placeholder={t("CLOUD_NAME_PLACEHOLDER")}
              error={!!errors.cloudName}
              helperText={errors.cloudName?.message}
              fullWidth
              className="pt-3"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <CloudIcon sx={{ fontSize: 20 }} color="secondary" />
                    </InputAdornment>
                  ),
                },
              }}
              variant="standard"
            />
          )}
        />

        <Controller
          name="organization"
          control={control}
          rules={{ required: t("ORG_NAME_REQUIRED") }}
          render={({ field }) => (
            <TextField
              {...field}
              label={t("ORG_NAME_LABEL")}
              placeholder={t("ORG_NAME_PLACEHOLDER")}
              error={!!errors.organization}
              helperText={errors.organization?.message}
              fullWidth
              className="pt-3"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <BusinessIcon sx={{ fontSize: 20 }} color="secondary" />
                    </InputAdornment>
                  ),
                },
              }}
              variant="standard"
            />
          )}
        />
      </Stack>

      <Box display="flex" justifyContent="flex-end" mt={4}>
        <Button
          type="submit"
          variant="contained"
          color="secondary"
          sx={{
            px: 4,
            py: 1.2,
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 600,
          }}
        >
          {t("NEXT_BUTTON")}
        </Button>
      </Box>
    </Box>
  );
}
