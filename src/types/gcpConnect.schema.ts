import { z } from "zod";

export const gcpConnectSchema = z.object({
  projectId: z.string().min(1, "Project ID is required"),

  datasetId: z.string().min(1, "BigQuery Dataset ID is required"),
});

export type GcpConnectFormValues = z.infer<typeof gcpConnectSchema>;
