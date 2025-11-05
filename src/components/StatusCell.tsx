// src/components/common/StatusCell.tsx
import React from "react";
import { Box, Tooltip, useTheme } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import AutorenewIcon from "@mui/icons-material/Autorenew";

type StatusCellProps = {
  status: string;
  errorReason?: string;
};

const StatusCell: React.FC<StatusCellProps> = ({ status, errorReason }) => {
  const theme = useTheme();
  const normalized = status?.toLowerCase();

  let color = "inherit";
  let IconComponent: React.ElementType | null = null;

  switch (normalized) {
    case "completed":
      color = theme.palette.success.main;
      IconComponent = CheckCircleIcon;
      break;
    case "processing":
      color = theme.palette.info.main;
      IconComponent = AutorenewIcon;
      break;
    case "pending":
      color = theme.palette.warning.main;
      IconComponent = HourglassBottomIcon;
      break;
    case "error":
      color = theme.palette.error.main;
      IconComponent = ErrorOutlineIcon;
      break;
    default:
      color = theme.palette.text.secondary;
      IconComponent = null;
  }

  const content = (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 0.5,
        color,
        textTransform: "capitalize",
        fontWeight: 500,
      }}
    >
      {IconComponent && <IconComponent fontSize="small" />}
      {status}
    </Box>
  );

  return normalized === "error" && errorReason ? (
    <Tooltip title={errorReason} arrow placement="top">
      <span>{content}</span>
    </Tooltip>
  ) : (
    content
  );
};

export default StatusCell;
