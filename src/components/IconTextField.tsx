import { Controller, Control, FieldValues, Path } from "react-hook-form";
import { TextField, InputAdornment, Box } from "@mui/material";

type IconTextFieldProps<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  label: string;
  placeholder?: string;
  icon: React.ReactNode;
  type?: string;
  disabled?: boolean;
};

export function IconTextField<T extends FieldValues>({
  name,
  control,
  label,
  placeholder,
  icon,
  type = "text",
  disabled = false,
}: IconTextFieldProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <TextField
          {...field}
          type={type}
          label={label}
          placeholder={placeholder}
          disabled={disabled}
          error={!!fieldState.error}
          helperText={fieldState.error?.message}
          fullWidth
          variant="standard"
          className="pt-3"
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">{icon}</InputAdornment>
              ),
            },
          }}
        />
      )}
    />
  );
}
