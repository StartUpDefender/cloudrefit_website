import { useFuseDialogContext } from "@fuse/core/FuseDialog/contexts/FuseDialogContext/useFuseDialogContext";
import {
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

function Dialog() {
  const { openDialog, closeDialog } = useFuseDialogContext();

  const handleOpenDialog = () => {
    openDialog({
      id: "my-dialog",
      content: ({ handleClose }) => (
        <>
          <DialogTitle>Use Google's location service?</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Let Google help apps determine location. This means sending
              anonymous location data to Google, even when no apps are running.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Disagree
            </Button>
            <Button onClick={handleClose} color="primary" autoFocus>
              Agree
            </Button>
          </DialogActions>
        </>
      ),
    });
  };

  return (
    <Button onClick={handleOpenDialog} variant="contained" color="secondary">
      Open Dialog
    </Button>
  );
}
