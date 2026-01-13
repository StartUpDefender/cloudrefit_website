import { Card, CardContent, Typography, Stack, Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import FolderIcon from "@mui/icons-material/Folder";
import AppsIcon from "@mui/icons-material/Apps";
import KeyIcon from "@mui/icons-material/Key";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  azureConnectSchema,
  AzureConnectFormValues,
} from "@/types/azureConnect.schema";

import { IconTextField } from "@/components/IconTextField";
import { useState } from "react";

type Props = {
  onBack: () => void;
};
export function AzureConnectCard({ onBack }: Props) {
  const [loading, setLoading] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<AzureConnectFormValues>({
    resolver: zodResolver(azureConnectSchema),
    mode: "onChange",
    defaultValues: {
      tenantId: "",
      clientId: "",
      clientSecret: "",
    },
  });

  async function onSubmit(data: AzureConnectFormValues) {
    alert(data);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Header */}
      <Stack spacing={1} mb={4}>
        <Typography variant="body2" color="text.secondary">
          You've chosen to onboard your Azure subscription. Ensure that Reader
          role is added to the billing account before onboarding. The
          application would use billing exports at subscription level if not
          present in the billing account.
        </Typography>
      </Stack>

      {/* Fields */}
      <Stack spacing={4}>
        <IconTextField<AzureConnectFormValues>
          name="tenantId"
          control={control}
          label="Directory (Tenant) ID"
          placeholder="Directory (tenant) ID"
          icon={<FolderIcon sx={{ fontSize: 20 }} color="secondary" />}
        />

        <IconTextField<AzureConnectFormValues>
          name="clientId"
          control={control}
          label="Application (Client) ID"
          placeholder="Application (client) ID"
          icon={<AppsIcon sx={{ fontSize: 20 }} color="secondary" />}
        />

        <IconTextField<AzureConnectFormValues>
          name="clientSecret"
          control={control}
          label="Client Secret Value"
          placeholder="Client secret value"
          type="password"
          icon={<KeyIcon sx={{ fontSize: 20 }} color="secondary" />}
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
          {loading ? "Connecting..." : "Connect"}
        </Button>
      </Stack>
    </form>
  );
}
