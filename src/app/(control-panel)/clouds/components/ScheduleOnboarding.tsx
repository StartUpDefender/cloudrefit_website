"use client";
import { useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import { Box, Button, Stack, Typography, Paper, Chip } from "@mui/material";
import {
  CalendarIcon,
  DateCalendar,
  LocalizationProvider,
  StaticDateTimePicker,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { useTranslation } from "react-i18next";

const TIME_SLOTS = [
  "9:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "12:00 PM",
  "12:30 PM",
  "1:00 PM",
];

export default function ScheduleOnboarding({
  onNext,
  onBack,
}: {
  onNext: () => void;
  onBack: () => void;
}) {
  const { t } = useTranslation("cloudPage");
  const [date, setDate] = useState<Dayjs | null>(dayjs());
  const [time, setTime] = useState<string | null>(null);
  const [email, setEmail] = useState("");

  const isValid = date && time && email;

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" mb={2}>
        <Typography variant="h6" fontWeight={600}>
          {t("SCHEDULE_TITLE")}
        </Typography>

        <Button variant="text" onClick={onNext}>
          {t("SKIP_BUTTON")}
        </Button>
      </Stack>

      <Typography color="text.secondary" mb={4}>
        {t("SCHEDULE_SUBTITLE")}
      </Typography>

      <Stack direction={{ xs: "column", md: "row" }} sx={{ columnGap: 3 }}>
        <Paper variant="outlined" sx={{ p: 2, display: "flex" }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateCalendar
              className="border-0 rounded-b-none"
              value={date}
              onChange={(newDate: Dayjs | null) => setDate(newDate)}
            />
          </LocalizationProvider>
          <Box padding={2}>
            <Typography fontWeight={600} mb={2}>
              {t("AVAILABLE_TIMES")}
            </Typography>

            <Stack spacing={1}>
              {TIME_SLOTS.map((slot) => (
                <Chip
                  key={slot}
                  label={slot}
                  clickable
                  onClick={() => setTime(slot)}
                  sx={{
                    justifyContent: "flex-start",
                    borderRadius: 1,
                    fontWeight: 500,
                    backgroundColor: "transparent",
                    border:
                      time === slot ? "1px solid #000" : "1px solid #E0E3EB",
                  }}
                />
              ))}
            </Stack>
          </Box>
        </Paper>
        <Box minWidth={260}>
          <Stack spacing={2}>
            <Box>
              <Typography fontWeight={600} mb={1}>
                {t("SESSION_DURATION")}
              </Typography>
              <Chip
                sx={{
                  display: "Flex",
                  justifyContent: "flex-start",
                  width: "200px",
                  p: 2,
                }}
                icon={<AccessTimeIcon />}
                label={t("SESSION_20_MIN")}
                variant="outlined"
              />
            </Box>

            <Box>
              <Typography fontWeight={600} mb={1}>
                {t("DATE_TIME_SELECTION")}
              </Typography>
              <Chip
                sx={{
                  display: "Flex",
                  justifyContent: "flex-start",
                  width: "400px",
                  p: 2,
                }}
                icon={<CalendarIcon />}
                label={
                  date && time
                    ? `${date.format("dddd DD MMM YYYY")} ${time}`
                    : t("NOT_SELECTED")
                }
                variant="outlined"
              />
            </Box>

            <Box>
              <Typography fontWeight={600} mb={1}>
                {t("EMAIL_INFO")}
              </Typography>
            </Box>
          </Stack>
        </Box>
      </Stack>

      <Stack
        direction="row"
        justifyContent="flex-end"
        sx={{ columnGap: 3 }}
        mt={4}
      >
        <Button variant="outlined" onClick={onBack}>
          {t("BACK_BUTTON")}
        </Button>
        <Button variant="contained" color="secondary" onClick={onNext}>
          {t("CONFIRM_BUTTON")}
        </Button>
      </Stack>
    </Box>
  );
}
