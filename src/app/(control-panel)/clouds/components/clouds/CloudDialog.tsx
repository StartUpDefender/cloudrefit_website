import { useFuseDialogContext } from "@fuse/core/FuseDialog/contexts/FuseDialogContext/useFuseDialogContext";
import {
  Button,
  Card,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from "@mui/material";
import { motion } from "motion/react";
import Paper from "@mui/material/Paper";

export default function ConnectAzure({ item, cloud }) {
  const { openDialog, closeDialog } = useFuseDialogContext();

  const handleOpenDialog = () => {
    openDialog({
      id: "my-dialog",
      content: ({ handleClose }) => (
        <Card sx={{ p: 2 }}>
          <DialogTitle className="flex items-center ">
            <img className="h-6 w-6 me-2" src={cloud.icon} alt="cloud" />
            {cloud.title}
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              <cloud.content onBack={handleClose} />
            </DialogContentText>
          </DialogContent>
        </Card>
      ),
    });
  };

  return (
    <Paper
      onClick={handleOpenDialog}
      component={motion.div}
      variants={item}
      className="flex flex-auto flex-col items-center overflow-hidden rounded-xl shadow-sm"
      key={cloud.id}
      sx={{ cursor: "pointer" }}
    >
      <div className="flex w-full flex-auto flex-col p-2 text-center">
        <div className="mx-auto h-28 w-44">
          <img className="h-full w-full" src={cloud.logo} alt="cloud" />
        </div>
        <Typography className="mt-6 font-medium">
          Connect with {cloud.name}
        </Typography>
      </div>
    </Paper>
  );
}
