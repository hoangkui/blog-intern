import * as React from "react";
import TextField from "@mui/material/TextField";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import Stack from "@mui/material/Stack";
interface DateTimeValidationProps {
  value: Date | null;
  setValue: React.Dispatch<React.SetStateAction<Date | null>>;
}
export default function DateTimeValidation({
  value,
  setValue,
}: DateTimeValidationProps) {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Stack spacing={3}>
        <DateTimePicker
          renderInput={(params) => <TextField {...params} />}
          label="Time to publish"
          value={value}
          onChange={(newValue) => {
            setValue(newValue);
          }}
          disableMaskedInput
          minDateTime={new Date()}
        />
      </Stack>
    </LocalizationProvider>
  );
}
