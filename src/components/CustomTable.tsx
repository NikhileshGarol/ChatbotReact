import { Box, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

type Props = {
  gridRows: readonly any[];
  columns: readonly any[];
  isLoading?: boolean;
};

export default function CustomTable({ gridRows, columns, isLoading }: Props) {
  const CustomNoRowsOverlay = () => (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        flexDirection: "column",
        color: "text.secondary",
        fontSize: "16px",
      }}
    >
      <Typography variant="body1" sx={{ fontWeight: 500 }}>
        No records found
      </Typography>
    </Box>
  );

  const adjustedColumns = columns.map((col) => {
    // ✅ If explicit width is provided → fixed column
    if (col.width) {
      return {
        ...col,
        minWidth: col.minWidth ?? col.width,
        flex: 0, // prevent expansion when width is defined
      };
    }

    // ✅ Otherwise → flexible column with sensible defaults
    return {
      ...col,
      flex: col.flex ?? 1,
      minWidth: col.minWidth ?? 150,
    };
  });

  return (
    <Box
      sx={{
        // width: "fit-content", // 👈 Only take as much width as needed
        maxWidth: "100%",
        overflowX: "auto",
        // ✅ Hide scrollbar visually on all browsers
        "&::-webkit-scrollbar": { display: "none" }, // Chrome, Safari
        msOverflowStyle: "none", // IE, Edge
        scrollbarWidth: "none", // Firefox

        // ✅ Specifically target the DataGrid’s internal virtual scroller
        "& .MuiDataGrid-virtualScroller": {
          overflowY: "hidden !important",
        },
        "& .MuiDataGrid-main": {
          overflowY: "hidden !important",
        },
      }}
    >
      <DataGrid
        rows={gridRows}
        columns={adjustedColumns}
        pageSizeOptions={[5, 10, 25]}
        disableRowSelectionOnClick
        loading={isLoading}
        initialState={{
          pagination: { paginationModel: { pageSize: 10, page: 0 } },
        }}
        slots={{
          noRowsOverlay: CustomNoRowsOverlay, // Custom message for empty data
        }}
        autoHeight
        scrollbarSize={0}
        sx={{
          flex: 1,
          border: "none",
          borderRadius: 1,
          boxShadow: 2,
          "& .MuiDataGrid-columnHeaders": {
            color: "#FFFFFF",
            fontWeight: "600",
            fontSize: "14px",
            height: "45px",
          },
          "& .MuiDataGrid-columnHeader": {
            backgroundColor: "primary.main",
            borderRight: "1px solid lightgrey",
          },
          ".MuiDataGrid-row:hover": {
            backgroundColor: "#f0f8ff",
          },
          ".MuiDataGrid-cell": {
            borderBottom: "1px solid #e0e0e0",
            borderRight: "1px solid #e0e0e0",
          },
          ".MuiDataGrid-footerContainer": {
            backgroundColor: "#f9f9f9",
          },
          ".MuiDataGrid-columnSeparator": {
            display: "none",
          },
          ".MuiDataGrid-sortIcon": {
            color: "#FFFFFF",
          },
        }}
      />
    </Box>
  );
}
