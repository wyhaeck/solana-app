import { TextField, styled } from "@mui/material";

export const StyledTextField = styled(TextField)(() => ({
  backgroundColor: "#512da8",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif",
  textTransform: "none",
  input: {
    color: "white",
    fontFamily:
      "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif",
  },
  color: "white",
}));
