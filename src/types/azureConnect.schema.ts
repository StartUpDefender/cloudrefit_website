import { z } from "zod";

const guidRegex =
  /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;

export const azureConnectSchema = z.object({
  tenantId: z.string().regex(guidRegex, "Invalid Tenant ID format"),

  clientId: z.string().regex(guidRegex, "Invalid Client ID format"),

  clientSecret: z
    .string()
    .min(10, "Client Secret must be at least 10 characters"),
});

export type AzureConnectFormValues = z.infer<typeof azureConnectSchema>;
