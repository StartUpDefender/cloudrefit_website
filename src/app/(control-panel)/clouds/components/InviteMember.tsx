import {
  Box,
  Button,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

export default function InviteMember({ onNext, onBack }) {
  const options = [
    { value: "admin", label: "Admin" },
    { value: "edit", label: "Editor" },
    { value: "view", label: "View Only" },
  ];
  return (
    <Box>
      <Typography variant="h6" fontWeight={600} mb={1}>
        Invite a Member
      </Typography>

      <Typography color="text.secondary" mb={3}>
        Invite teammates and assign their access level.
      </Typography>

      <Stack direction="row" sx={{ columnGap: 4 }} mb={4}>
        <TextField
          fullWidth
          placeholder="example@gmail.com"
          label="Email Address"
          sx={{ width: "50%" }}
        />

        <TextField
          select
          label="Access"
          sx={{ width: 160 }}
          defaultValue="view"
          fullWidth
          variant="outlined"
        >
          {options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>

        <Button variant="contained" color="secondary" sx={{ px: 3 }}>
          Send Invitation
        </Button>
      </Stack>

      <Stack direction="row" justifyContent="flex-end" spacing={3}>
        <Button variant="outlined" onClick={onBack}>
          Back
        </Button>
        <Button variant="contained" color="secondary" onClick={onNext}>
          Next
        </Button>
      </Stack>
    </Box>
  );
}
