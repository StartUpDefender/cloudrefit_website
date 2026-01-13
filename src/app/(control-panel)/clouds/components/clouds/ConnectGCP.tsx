import { Card, CardContent, Typography, Stack, Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import GridViewIcon from "@mui/icons-material/GridView";
import AddIcon from "@mui/icons-material/Add";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

import {
  gcpConnectSchema,
  GcpConnectFormValues,
} from "@/types/gcpConnect.schema";

import { IconTextField } from "@/components/IconTextField";

type Props = {
  onBack: () => void;
};

export function GcpConnectCard({ onBack }: Props) {
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<GcpConnectFormValues>({
    resolver: zodResolver(gcpConnectSchema),
    mode: "onChange",
    defaultValues: {
      projectId: "",
      datasetId: "",
    },
  });

  async function onSubmit(data: GcpConnectFormValues) {
    setLoading(true);
    try {
      console.log("GCP data:", data);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Header */}
      <Stack spacing={1} mb={4}>
        <Typography variant="body2" color="text.secondary">
          Easily link your GCP projects via BigQuery billing exports.
        </Typography>
      </Stack>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Project ID */}
        <Stack spacing={1} mb={3}>
          <Typography fontWeight={500}>Add Project ID</Typography>
          <Typography variant="body2" color="text.secondary">
            Enter the project ID that you wish to initially onboard onto
            Economize. We recommend you enter the project ID of the main GCP
            project.
          </Typography>

          <IconTextField<GcpConnectFormValues>
            name="projectId"
            control={control}
            placeholder="Enter Project ID"
            icon={<GridViewIcon sx={{ fontSize: 20 }} color="secondary" />}
            label=""
          />
        </Stack>

        {/* Dataset ID */}
        <Stack spacing={1} mb={4}>
          <Typography fontWeight={500}>Add BigQuery Dataset ID</Typography>
          <Typography variant="body2" color="text.secondary">
            You can use an existing BigQuery dataset or create a new one
            dedicated specifically for importing cloud billing data.
          </Typography>

          <IconTextField<GcpConnectFormValues>
            name="datasetId"
            control={control}
            placeholder="bigquery.dataset.id"
            icon={<AddIcon sx={{ fontSize: 20 }} color="secondary" />}
            label=""
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
            {loading ? "Loading..." : "Next"}
          </Button>
        </Stack>
      </form>
    </>
  );
}
