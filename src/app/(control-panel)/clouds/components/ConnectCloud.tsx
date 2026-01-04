import { Box, Button, Stack, Typography } from "@mui/material";
import Paper from "@mui/material/Paper";
import { motion } from "motion/react";
export default function ConnectCloud({ onBack }) {
  const clouds = [
    { id: 1, logo: "assets/images/logo/aws.svg", name: "AWS" },
    { id: 2, logo: "assets/images/logo/GCP.svg", name: "GCP" },
    { id: 3, logo: "assets/images/logo/azure.svg", name: "AZURE" },
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
          <a href="#">
            <Paper
              component={motion.div}
              variants={item}
              className="flex flex-auto flex-col items-center overflow-hidden rounded-xl shadow-sm"
              key={cloud.id}
            >
              <div className="flex w-full flex-auto flex-col p-2 text-center">
                <div className="mx-auto h-32 w-52">
                  <img className="h-full w-full" src={cloud.logo} alt="cloud" />
                </div>
                <Typography className="mt-6 font-medium">
                  Connect with {cloud.name}
                </Typography>
              </div>
            </Paper>
          </a>
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
