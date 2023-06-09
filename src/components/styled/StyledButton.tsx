import { Button, styled } from "@mui/material";

export const StyledButton = styled(Button)(() => ({
  backgroundColor: "#512da8",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif",
  textTransform: "none",
  "&:hover": {
    backgroundColor: "#707070",
  },
}));
