import { Box, Button, Stack, Typography } from "@mui/material";
import { motion } from "motion/react";
import CloudDialog from "./clouds/CloudDialog";
import {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { AzureConnectCard } from "./clouds/ConnectAzure";
import { GcpConnectCard } from "./clouds/ConnectGCP";
import { AwsConnectCard } from "./clouds/ConnectAWS";
export default function ConnectCloud({ onBack }) {
  const clouds = [
    {
      id: 1,
      logo: "assets/images/logo/aws.svg",
      name: "AWS",
      icon: "assets/icons/aws.svg",
      content: AwsConnectCard,
      title: " Connect your AWS account",
    },
    {
      id: 2,
      logo: "assets/images/logo/GCP.svg",
      icon: "assets/icons/gcp.svg",
      name: "GCP",
      content: GcpConnectCard,
      title: " Google Cloud Platform (GCP)",
    },
    {
      id: 3,
      logo: "assets/images/logo/azure.svg",
      icon: "assets/icons/azure.svg",
      name: "AZURE",
      content: AzureConnectCard,
      title: "Connect your Azure account",
    },
  ];
  const container = {
    show: {
      transition: {
        staggerChildren: 0.04,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };
  return (
    <Box>
      <Typography variant="h6" fontWeight={600} mb={1}>
        Connect your cloud
      </Typography>

      <Typography color="text.secondary" mb={4}>
        Securely connect your cloud provider to enable insights and cost
        optimization.
      </Typography>
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid w-full min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
      >
        {clouds.map((cloud) => (
          <CloudDialog item={item} cloud={cloud} />
        ))}
      </motion.div>
      <Typography color="text.secondary" mt={4}>
        Not ready yet? Try CloudRefit with sample data for a limited time.
      </Typography>
      <Stack direction="row" justifyContent="flex-end" spacing={3}>
        <Button variant="outlined" onClick={onBack}>
          Back
        </Button>
      </Stack>
    </Box>
  );
}
