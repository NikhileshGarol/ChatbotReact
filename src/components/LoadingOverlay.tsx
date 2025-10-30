import { Backdrop, Box, CircularProgress, Typography } from "@mui/material";

type Props = {
  loading: boolean;
  content?: string;
};

export default function LoadingOverlay({ loading, content }: Props) {
  return (
    <Box>
      <Backdrop
        sx={{
          color: "#fff",
          zIndex: (theme) => theme.zIndex.drawer + 1,
          display: "flex",
          flexDirection: "column",
        }}
        open={loading}
      >
        <CircularProgress color="inherit" />
        <Typography>{content}</Typography>
      </Backdrop>
    </Box>
  );
}
