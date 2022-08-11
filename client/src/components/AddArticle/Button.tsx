import React from "react";
import ButtonMUI from "@mui/material/Button";

interface ButtonProps {
  isSchedule: boolean;
  setIsSchedule: React.Dispatch<React.SetStateAction<boolean>>;
  condition: boolean;
}
const Button = ({ isSchedule, setIsSchedule, condition }: ButtonProps) => {
  return (
    <>
      <div className="flex gap-2">
        <ButtonMUI
          color="primary"
          variant="contained"
          fullWidth
          disabled={condition}
          type="submit"
          sx={{ paddingY: "0.75rem", textTransform: "none" }}
        >
          {isSchedule ? "Schedule to publish" : "Publish now"}
        </ButtonMUI>
        <ButtonMUI
          color="primary"
          variant="outlined"
          fullWidth
          onClick={() => setIsSchedule((pre) => !pre)}
          sx={{ paddingY: "0.75rem", textTransform: "none" }}
          className="capitalize"
        >
          {isSchedule ? "Cancel scheduling" : "Schedule for later"}
        </ButtonMUI>
      </div>
    </>
  );
};

export default Button;
