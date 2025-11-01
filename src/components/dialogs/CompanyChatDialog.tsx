import React, { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  TextField,
  IconButton,
  Typography,
  Paper,
  CircularProgress,
  Avatar,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import CloseIcon from "@mui/icons-material/Close";
import { queryCompanyData } from "../../services/company.service";
import { useSnackbar } from "../../contexts/SnackbarContext";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import { useAuth } from "../../contexts/AuthContext";

interface CompanyChatDialogProps {
  open: boolean;
  onClose: () => void;
  tenantCode: string;
  companyName: string;
}

interface Message {
  content: string;
  isUser: boolean;
  sources?: string[];
}

export default function CompanyChatDialog({
  open,
  onClose,
  tenantCode,
  companyName,
}: CompanyChatDialogProps) {
  const { user, profileImage } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      content: `Hi! I'm connected to ${companyName}'s knowledge base. Ask me anything about their documents and websites.`,
      isUser: false,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { showSnackbar } = useSnackbar();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    const question = input.trim();
    if (!question || loading) return;

    // Add user message
    setMessages((prev) => [...prev, { content: question, isUser: true }]);
    setInput("");
    setLoading(true);

    try {
      const response = await queryCompanyData(tenantCode, question);

      setMessages((prev) => [
        ...prev,
        {
          content: response.answer,
          isUser: false,
          sources: response.sources,
        },
      ]);
    } catch (error: any) {
      const message =
        error?.response?.data?.detail ||
        error?.message ||
        "Failed to get response";
      showSnackbar("error", message);

      setMessages((prev) => [
        ...prev,
        {
          content: "Sorry, I encountered an error. Please try again.",
          isUser: false,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Dialog open={open} maxWidth="md" fullWidth>
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          //   background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          backgroundColor: "primary.main",
          color: "white",
          paddingY: "2px",
        }}
      >
        <Box>
          <Typography variant="h6">Company Chatbot</Typography>
          <Typography variant="body2">
            {companyName} ({tenantCode})
          </Typography>
        </Box>
        <IconButton onClick={onClose} sx={{ color: "white" }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent
        sx={{ p: 0, height: "600px", display: "flex", flexDirection: "column" }}
      >
        {/* Messages Area */}
        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            p: 2,
            bgcolor: "#f8f9fa",
          }}
        >
          {messages.map((msg, idx) => (
            <Box
              key={idx}
              sx={{
                display: "flex",
                justifyContent: msg.isUser ? "flex-end" : "flex-start",
                mb: 2,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "end", mx: 1 }}>
                {msg.isUser ? (
                  <Avatar
                    sx={{ height: "30px", width: "30px" }}
                    alt={user.display_name}
                    src={profileImage || "http://www.gravatar.com/avatar/?d=mp"}
                  />
                ) : (
                  <Avatar sx={{ height: "30px", width: "30px", bgcolor: 'primary.main' }} alt="Bot">
                    <SmartToyIcon />
                  </Avatar>
                )}
              </Box>
              <Paper
                sx={{
                  maxWidth: "75%",
                  py: 1,
                  px: 1.5,
                  //   bgcolor: msg.isUser
                  //     ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                  //     : "white",
                  //   background: msg.isUser
                  //     ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                  //     : undefined,#0b76ef
                  background: msg.isUser ? "#0b76ef" : undefined,
                  color: msg.isUser ? "white" : "inherit",
                }}
              >
                <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
                  {msg.content}
                </Typography>

                {/* {msg.sources && msg.sources.length > 0 && (
                  <Box sx={{ mt: 1, pt: 1, borderTop: "1px solid #e0e0e0" }}>
                    <Typography variant="caption" display="block" gutterBottom>
                      <strong>Sources:</strong>
                    </Typography>
                    <Box component="ul" sx={{ m: 0, pl: 2 }}>
                      {msg.sources.map((source, i) => (
                        <li key={i}>
                          <Typography variant="caption">{source}</Typography>
                        </li>
                      ))}
                    </Box>
                  </Box>
                )} */}
              </Paper>
            </Box>
          ))}

          {loading && (
            <Box sx={{ display: "flex", justifyContent: "flex-start", mb: 2 }}>
              <Paper sx={{ p: 2 }}>
                <CircularProgress size={20} />
              </Paper>
            </Box>
          )}

          <div ref={messagesEndRef} />
        </Box>

        {/* Input Area */}
        <Box
          sx={{
            p: 2,
            borderTop: "1px solid #e0e0e0",
            bgcolor: "white",
            display: "flex",
            gap: 1,
          }}
        >
          <TextField
            fullWidth
            // multiline
            // maxRows={3}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            disabled={loading}
            size="medium"
          />
          <IconButton
            onClick={handleSendMessage}
            disabled={loading || !input.trim()}
            color="primary"
            sx={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              "&:hover": {
                background: "linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)",
              },
              "&:disabled": {
                background: "#ccc",
              },
            }}
          >
            <SendIcon />
          </IconButton>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
