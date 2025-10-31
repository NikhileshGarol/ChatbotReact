import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  IconButton,
  Alert,
  Tabs,
  Tab,
  Paper,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import RefreshIcon from "@mui/icons-material/Refresh";
import {
  getWidgetKey,
  regenerateWidgetKey,
} from "../../services/company.service";
import { useSnackbar } from "../../contexts/SnackbarContext";
import { GridCloseIcon } from "@mui/x-data-grid";

interface WidgetConfigDialogProps {
  open: boolean;
  onClose: () => void;
  tenantCode: string;
  companyName: string;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`widget-tabpanel-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 2 }}>{children}</Box>}
    </div>
  );
}

export default function WidgetConfigDialog({
  open,
  onClose,
  tenantCode,
  companyName,
}: WidgetConfigDialogProps) {
  const [widgetKey, setWidgetKey] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const { showSnackbar } = useSnackbar();

  const apiUrl = import.meta.env.VITE_API_BASE_URL; // Update this with your actual API URL

  useEffect(() => {
    if (open) {
      fetchWidgetKey();
    }
  }, [open, tenantCode]);

  const fetchWidgetKey = async () => {
    try {
      setLoading(true);
      const response = await getWidgetKey(tenantCode);
      setWidgetKey(response.widget_key);
    } catch (error: any) {
      const message =
        error?.response?.data?.detail ||
        error?.message ||
        "Failed to fetch widget key";
      showSnackbar("error", message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerateKey = async () => {
    if (
      !window.confirm("This will invalidate your existing widget. Continue?")
    ) {
      return;
    }

    try {
      setLoading(true);
      const response = await regenerateWidgetKey(tenantCode);
      setWidgetKey(response.widget_key);
      showSnackbar("success", "Widget key regenerated successfully");
    } catch (error: any) {
      const message =
        error?.response?.data?.detail ||
        error?.message ||
        "Failed to regenerate widget key";
      showSnackbar("error", message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    showSnackbar("success", `${label} copied to clipboard`);
  };

  const embedCode = `<!-- RAG Chatbot Widget -->
<script>
  window.WIDGET_CONFIG = {
    apiUrl: '${apiUrl}',
    widgetKey: '${widgetKey}'
    tenant_code: '${tenantCode}'
  };
</script>
<script src="${apiUrl}/static/chatbot-widget.js"></script>`;

  const standaloneHTML = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${companyName} - Chat Support</title>
</head>
<body>
  <!-- Copy chatbot-widget.html content here -->
  <!-- Update WIDGET_CONFIG with your values: -->
  <script>
    const WIDGET_CONFIG = {
      apiUrl: '${apiUrl}',
      widgetKey: '${widgetKey}'
      tenant_code: '${tenantCode}'
    };
  </script>
</body>
</html>`;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          backgroundColor: "primary.main",
          paddingY: "2px",
          alignItems: "center",
          color: "background.default",
        }}
      >
        <Box>
          <Typography variant="h6">Chatbot Widget Configuration</Typography>
          <Typography variant="body2">
           {companyName} ({tenantCode})
          </Typography>
        </Box>
        <IconButton sx={{ color: "background.default" }}>
          <GridCloseIcon onClick={onClose} />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ my: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Widget Key
          </Typography>
          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            <TextField
              fullWidth
              value={widgetKey || "Loading..."}
              InputProps={{
                readOnly: true,
              }}
              size="small"
            />
            <IconButton
              onClick={() => copyToClipboard(widgetKey, "Widget key")}
              disabled={!widgetKey}
              color="primary"
            >
              <ContentCopyIcon />
            </IconButton>
            <IconButton
              onClick={handleRegenerateKey}
              disabled={loading}
              color="warning"
              title="Regenerate widget key"
            >
              <RefreshIcon />
            </IconButton>
          </Box>
          <Alert severity="warning" sx={{ mt: 1 }}>
            Keep this key secure. Anyone with this key can query your company
            data.
          </Alert>
        </Box>

        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)}>
            <Tab label="Embed Code" />
            <Tab label="Standalone Widget" />
            <Tab label="Instructions" />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Copy and paste this code into your website's HTML:
          </Typography>
          <Paper sx={{ p: 2, bgcolor: "#f5f5f5", position: "relative" }}>
            <IconButton
              sx={{ position: "absolute", top: 8, right: 8 }}
              onClick={() => copyToClipboard(embedCode, "Embed code")}
              size="small"
            >
              <ContentCopyIcon fontSize="small" />
            </IconButton>
            <pre
              style={{
                margin: 0,
                fontSize: "12px",
                overflow: "auto",
                whiteSpace: "pre-wrap",
              }}
            >
              {embedCode}
            </pre>
          </Paper>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Download chatbot-widget.html from the server and update the
            WIDGET_CONFIG:
          </Typography>
          <Paper sx={{ p: 2, bgcolor: "#f5f5f5", position: "relative" }}>
            <IconButton
              sx={{ position: "absolute", top: 8, right: 8 }}
              onClick={() => copyToClipboard(standaloneHTML, "Standalone HTML")}
              size="small"
            >
              <ContentCopyIcon fontSize="small" />
            </IconButton>
            <pre
              style={{
                margin: 0,
                fontSize: "12px",
                overflow: "auto",
                whiteSpace: "pre-wrap",
              }}
            >
              {standaloneHTML}
            </pre>
          </Paper>
          <Alert severity="info" sx={{ mt: 2 }}>
            Get the widget file from: {apiUrl}/static/chatbot-widget.html
          </Alert>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Typography variant="h6" gutterBottom>
            Integration Instructions
          </Typography>
          <Box component="ol" sx={{ pl: 2 }}>
            <li>
              <Typography variant="body2" paragraph>
                <strong>Copy your widget key</strong> from above
              </Typography>
            </li>
            <li>
              <Typography variant="body2" paragraph>
                <strong>Choose integration method:</strong>
                <ul>
                  <li>
                    <strong>Embed Code:</strong> Easiest - Just paste the embed
                    code before the closing {`</body>`} tag
                  </li>
                  <li>
                    <strong>Standalone:</strong> Download chatbot-widget.html
                    and host it yourself
                  </li>
                </ul>
              </Typography>
            </li>
            <li>
              <Typography variant="body2" paragraph>
                <strong>Update API URL:</strong> Replace {apiUrl}
                with your production API URL
              </Typography>
            </li>
            <li>
              <Typography variant="body2" paragraph>
                <strong>Test:</strong> Open your website and click the chat
                bubble in the bottom-right corner
              </Typography>
            </li>
          </Box>
        </TabPanel>
      </DialogContent>

      <DialogActions sx={{ boxShadow: 2 }}>
        <Button variant="outlined" onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
