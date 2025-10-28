import { DataGrid } from "@mui/x-data-grid";

type Props = {
  gridRows: readonly any[];
  columns: readonly any[];
};

export default function CustomTable({ gridRows, columns }: Props) {
  const column = columns.map((col) => ({
    ...col,
    flex: col.flex ?? 1, // auto-adjust width based on available space
    minWidth: col.minWidth ?? 150, // ensures readability, even on smaller screens
  }));

  return (
    <DataGrid
      rows={gridRows}
      columns={column}
      pageSizeOptions={[5, 10, 25]}
      disableRowSelectionOnClick
      initialState={{
        pagination: { paginationModel: { pageSize: 10, page: 0 } },
      }}
      sx={{
        flex: 1,
        border: "none",
        borderRadius: 1,
        boxShadow: 2,
        height: "100%",
        "& .MuiDataGrid-columnHeaders": {
          color: "#FFFFFF",
          fontWeight: "600",
          fontSize: "14px",
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
  );
}
