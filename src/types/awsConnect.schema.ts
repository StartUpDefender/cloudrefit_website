import { z } from "zod";

export const awsConnectSchema = z.object({
  curOption: z.enum(["new", "existing"], {
    required_error: "Please select a CUR option",
  }),
});

export type AwsConnectFormValues = z.infer<typeof awsConnectSchema>;
