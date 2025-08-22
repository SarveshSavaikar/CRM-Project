import React, { useState, useMemo, useCallback } from "react";
import {
  SearchOutlined,
  MailOutlined,
  FilterOutlined,
  SortAscendingOutlined,
  PlusOutlined,
  ArrowRightOutlined,
  DownOutlined,
  CloseOutlined,
} from "@ant-design/icons";

// Dummy data for the inbox messages.
const initialMessages = [
  {
    id: "M001",
    sender: "Marketing Team (marketing@example.com)", // Added email to sender
    subject: "Your Weekly CRM Digest: New Feature Unveiled!",
    body: "Discover new insights from your sales data and optimize your client outreach strategies with our latest update...",
    timestamp: "2025-08-14 10:30 AM",
    type: "Email",
    read: false,
  },
  {
    id: "M002",
    sender: "Alex Johnson (+1-555-123-4567)", // Changed sender to include a phone number
    subject: "Regarding our meeting tomorrow",
    body: "Confirming our meeting for tomorrow at 2 PM. Please bring the client success report for review.",
    timestamp: "2025-08-14 09:45 AM",
    type: "WhatsApp",
    read: true,
  },
  {
    id: "M003",
    sender: "Sarah Connor (https://linkedin.com/in/sarahconnor)", // Added URL to sender
    subject: "Connection Request: John Doe - Sales Manager at Acme Corp",
    body: "John Doe sent you a connection request on LinkedIn. Accept or ignore?",
    timestamp: "2025-08-13 03:00 PM",
    type: "LinkedIn",
    read: false,
  },
  {
    id: "M004",
    sender: "Support Desk (support@example.com)",
    subject: "[Ticket #CRM-2024-005] Your CRM Login Issue Resolved",
    body: "Good news! We have successfully resolved the login issue you reported. Please try logging in again.",
    timestamp: "2025-08-12 11:00 AM",
    type: "Email",
    read: true,
  },
  {
    id: "M005",
    sender: "Project Alpha Team (alpha@example.com)",
    subject: "Urgent: Feedback on Q3 Campaign Draft",
    body: "Please review the attached Q3 campaign draft and provide your feedback by end of day today. Your input is crucial.",
    timestamp: "2025-08-11 02:00 PM",
    type: "Email",
    read: false,
  },
  {
    id: "M006",
    sender: "Billing Department (billing@example.com)",
    subject: "Your CRM Subscription Renewal Reminder",
    body: "Your annual CRM subscription is set to renew on September 15th. Please ensure your payment details are up to date.",
    timestamp: "2025-08-10 09:00 AM",
    type: "Email",
    read: true,
  },
  {
    id: "M007",
    sender: "Industry News Digest (news@example.com)",
    subject: "Top 5 Trends Shaping the SaaS Landscape in 2024",
    body: "Stay ahead of the curve with our latest report on the most impactful trends in the SaaS industry this year...",
    timestamp: "2025-08-09 08:00 AM",
    type: "Email",
    read: true,
  },
];

// --- Reusable Styles ---
const pageContainerStyle = {
  fontFamily: "Inter, sans-serif",
  minHeight: "100vh",
  padding: "28px",
  display: "flex",
  gap: "28px",
  position: "relative" as "relative",
  transition: "filter 0.3s ease-in-out",
  // Add pointer events for the background content
  // We'll set this dynamically
};
const inboxContainerStyle = {
  flex: 2,
  background: "#fff",
  borderRadius: "12px",
  boxShadow: "0 1px 6px 0 #f0f1f3",
  display: "flex",
  flexDirection: "column" as "column",
};
const messageDetailsContainerStyle = {
  flex: 1,
  background: "#fff",
  borderRadius: "12px",
  boxShadow: "0 1px 6px 0 #f0f1f3",
  display: "flex",
  flexDirection: "column" as "column",
  padding: "20px",
  overflowY: "auto" as "auto",
};
const emptyMessageDetailsContainerStyle = {
  flex: 1,
  background: "#fff",
  borderRadius: "12px",
  boxShadow: "0 1px 6px 0 #f0f1f3",
  display: "flex",
  flexDirection: "column" as "column",
  justifyContent: "center",
  alignItems: "center",
  color: "#a8b0c8",
  fontSize: "14px",
  padding: "20px",
  textAlign: "center" as "center",
};
const inboxHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "16px 24px",
  borderBottom: "1px solid #f0f1f3",
};

// --- NEW SEARCH INPUT STYLES ---
const searchInputContainerStyle = {
  flex: 1,
  position: "relative" as "relative",
  maxWidth: "300px",
  border: "1px solid #d9d9d9",
  borderRadius: "6px",
  display: "flex",
  overflow: "hidden",
};

const searchInputStyle = {
  border: "none",
  outline: "none",
  padding: "8px 12px",
  fontSize: "15px",
  flex: 1,
};

const searchButtonStyle = {
  background: "#1467fa",
  border: "none",
  padding: "8px 12px",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  color: "#fff",
};
// ------------------------------------

const newMessageButtonStyle = {
  padding: "8px 16px",
  borderRadius: "5px",
  background: "#1467fa",
  color: "#fff",
  border: "none",
  fontWeight: 500,
  fontSize: "15px",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: "8px",
};
const tabContainerStyle = {
  display: "flex",
  padding: "16px 24px",
  borderBottom: "1px solid #f0f1f3",
};
const tabStyle = (active: boolean) => ({
  padding: "8px 16px",
  borderRadius: "20px",
  fontWeight: 500,
  cursor: "pointer",
  transition: "background 0.2s",
  background: active ? "#eef2ff" : "transparent",
  color: active ? "#1467fa" : "#636b91",
  marginRight: "8px",
});

// --- MODIFIED filterSortContainerStyle
const filterSortContainerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "12px 24px",
  borderBottom: "1px solid #f0f1f3",
  color: "#a8b0c8",
  fontSize: "14px",
};
// ------------------------------------

const messageListStyle = {
  overflowY: "auto" as "auto",
  flex: 1,
};
const messageItemStyle = (read: boolean, selected: boolean) => ({
  padding: "18px 24px",
  borderBottom: "1px solid #f0f1f3",
  cursor: "pointer",
  background: selected ? "#f0f2f7" : "#fff",
  transition: "background 0.2s",
  position: "relative" as "relative",
  display: "flex",
  flexDirection: "column" as "column",
});
const messageHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  marginBottom: "4px",
};
const messageSenderStyle = (read: boolean) => ({
  fontWeight: read ? 400 : 600,
  fontSize: "15px",
  color: "#2d334a",
});
const messageSubjectStyle = (read: boolean) => ({
  fontWeight: read ? 400 : 600,
  fontSize: "15px",
  color: "#2d334a",
  display: "block",
  marginBottom: "4px",
});
const messageBodyStyle = {
  fontSize: "14px",
  color: "#636b91",
  whiteSpace: "nowrap" as "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  width: "100%",
};
const messageTimestampStyle = {
  fontSize: "13px",
  color: "#a8b0c8",
};
const unreadDotStyle = {
  width: "8px",
  height: "8px",
  borderRadius: "50%",
  background: "#1467fa",
  position: "absolute" as "absolute",
  left: "10px",
  top: "50%",
  transform: "translateY(-50%)",
};
const mailIconContainerStyle = {
  marginBottom: "16px",
};
const mailIconStyle = {
  fontSize: "48px",
  border: "2px solid #e0e7ff",
  borderRadius: "50%",
  padding: "12px",
  color: "#e0e7ff",
};
const messageDetailsHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  paddingBottom: "16px",
  borderBottom: "1px solid #f0f1f3",
  marginBottom: "16px",
};
const messageDetailsSubjectStyle = {
  fontSize: "20px",
  fontWeight: 600,
  color: "#2d334a",
  margin: 0,
};
const messageDetailsSenderStyle = {
  fontSize: "15px",
  fontWeight: 500,
  color: "#2d334a",
};
const messageDetailsTimestampStyle = {
  fontSize: "13px",
  color: "#a8b0c8",
};
const messageDetailsBodyStyle = {
  fontSize: "15px",
  color: "#517a49ff",
  lineHeight: "1.6",
  overflowY: "auto" as "auto",
};
const actionButtonContainerStyle = {
  display: "flex",
  gap: "10px",
};
const actionButtonStyle = {
  padding: "6px 12px",
  borderRadius: "20px",
  background: "#f0f2f7",
  color: "#636b91",
  border: "none",
  fontWeight: 500,
  fontSize: "13px",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: "6px",
};
const filterOptionStyle = (active: boolean) => ({
  cursor: "pointer",
  padding: "4px 10px",
  borderRadius: "16px",
  border: `1px solid ${active ? "#1467fa" : "transparent"}`,
  background: active ? "#eef2ff" : "transparent",
  color: active ? "#1467fa" : "#636b91",
  fontWeight: 500,
});
const sortDropdownStyle = {
  position: "relative" as "relative",
  display: "inline-block",
};
const sortDropdownButtonStyle = {
  display: "flex",
  alignItems: "center",
  gap: "4px",
  cursor: "pointer",
  color: "#a8b0c8",
  fontSize: "14px",
};
const sortDropdownMenuContainerStyle = {
  position: "absolute" as "absolute",
  top: "100%",
  right: 0,
  background: "#fff",
  border: "1px solid #f0f1f3",
  borderRadius: "8px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
  zIndex: 10,
  minWidth: "120px",
  padding: "4px 0",
};
const sortDropdownMenuItemStyle = (active: boolean) => ({
  padding: "8px 12px",
  cursor: "pointer",
  fontWeight: active ? 600 : 400,
  color: active ? "#1467fa" : "#636b91",
  backgroundColor: active ? "#eef2ff" : "transparent",
});

// New and updated styles for the message prompt form (modal)
const modalOverlayStyle = {
  position: "fixed" as "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: "rgba(0,0,0,0.4)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
  pointerEvents: "auto" as "auto",
};

const modalBoxStyle = {
  background: "#fff",
  borderRadius: "12px",
  padding: "24px",
  width: "400px",
  display: "flex",
  flexDirection: "column" as "column",
  gap: "16px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
  pointerEvents: "auto" as "auto", // Ensure the modal box is clickable
};

const newMessageHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  borderBottom: "1px solid #f0f1f3",
  paddingBottom: "16px",
  marginBottom: "20px",
};

const newMessageFormGroupStyle = {
  marginBottom: "16px",
};

const newMessageInputStyle = {
  width: "100%",
  padding: "10px",
  border: "1px solid #dbe4f3",
  borderRadius: "8px",
  fontSize: "15px",
};

const newMessageTextareaStyle = {
  ...newMessageInputStyle,
  minHeight: "100px",
  resize: "vertical" as "vertical",
};

const newMessageLabelStyle = {
  display: "block",
  marginBottom: "8px",
  fontWeight: 500,
  color: "#2d334a",
};

const newMessageSendButtonStyle = {
  padding: "12px 24px",
  borderRadius: "8px",
  background: "#1467fa",
  color: "#fff",
  border: "none",
  fontWeight: 600,
  fontSize: "16px",
  cursor: "pointer",
};

const platformDropdownStyle = {
  ...newMessageInputStyle,
  cursor: "pointer",
};

const newMessageDropdownContainerStyle = {
  position: "relative" as "relative",
  display: "inline-block",
};

const newMessageDropdownButtonStyle = {
  ...newMessageButtonStyle,
};

const newMessageDropdownMenuContainerStyle = {
  position: "absolute" as "absolute",
  top: "100%",
  left: 0,
  background: "#fff",
  border: "1px solid #f0f1f3",
  borderRadius: "8px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
  zIndex: 30,
  minWidth: "160px",
  padding: "4px 0",
};

const newMessageDropdownMenuItemStyle = {
  padding: "8px 12px",
  cursor: "pointer",
  fontWeight: 400,
  color: "#636b91",
  "&:hover": {
    backgroundColor: "#eef2ff",
    color: "#1467fa",
  },
};

// A simple debounce function to prevent excessive re-renders on search input
const debounce = (func: (...args: any[]) => void, delay: number) => {
  let timeout: ReturnType<typeof setTimeout>;
  return function (...args: any[]) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
};

// Function to extract contact information from the sender string
const extractContact = (sender: string) => {
  const match = sender.match(/\(([^)]+)\)/);
  return match ? match[1] : "";
};

export const InboxIndex = () => {
  const [messages, setMessages] = useState(initialMessages);
  const [activeTab, setActiveTab] = useState("All Messages");
  const [selectedMessage, setSelectedMessage] =
    useState<typeof initialMessages[number] | null>(null);
  const [readFilter, setReadFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const [isNewMessageDropdownOpen, setIsNewMessageDropdownOpen] =
    useState(false);
  const [isNewMessageModalOpen, setIsNewMessageModalOpen] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [isForwarding, setIsForwarding] = useState(false);
  const [replyInfo, setReplyInfo] = useState({ to: "", subject: "", body: "" }); // New state for pre-filled reply info

  // Debounced search term update
  const handleSearchChange = useCallback(
    debounce((value: string) => {
      setSearchTerm(value.toLowerCase());
    }, 300),
    []
  );

  const filteredAndSortedMessages = useMemo(() => {
    // 1. Filter by search term
    const bySearch = messages.filter(
      (msg) =>
        msg.sender.toLowerCase().includes(searchTerm) ||
        msg.subject.toLowerCase().includes(searchTerm) ||
        msg.body.toLowerCase().includes(searchTerm)
    );

    // 2. Filter by message type
    const byType = bySearch.filter(
      (msg) => activeTab === "All Messages" || msg.type.toLowerCase() === activeTab.toLowerCase()
    );

    // 3. Filter by read status
    const byReadStatus = byType.filter((msg) => {
      if (readFilter === "read") return msg.read;
      if (readFilter === "unread") return !msg.read;
      return true;
    });

    // 4. Sort by time
    return byReadStatus.sort((a, b) => {
      const dateA = new Date(a.timestamp);
      const dateB = new Date(b.timestamp);
      return sortOrder === "newest"
        ? dateB.getTime() - dateA.getTime()
        : dateA.getTime() - dateB.getTime();
    });
  }, [messages, activeTab, readFilter, searchTerm, sortOrder]);

  const handleMessageClick = (msgId: string) => {
    const newMessages = messages.map((msg) =>
      msg.id === msgId ? { ...msg, read: true } : msg
    );
    setMessages(newMessages);
    setSelectedMessage(newMessages.find((msg) => msg.id === msgId) || null);
  };

  const handleNewMessageClick = (platform: string) => {
    setSelectedPlatform(platform);
    setReplyInfo({ to: "", subject: "", body: "" }); // Clear reply info for new message
    setIsNewMessageModalOpen(true);
    setIsNewMessageDropdownOpen(false); // Close the platform dropdown
    setIsForwarding(false); // Not a forward
  };

  // --- NEW: handleForward function to set the state for the modal ---
  const handleReply = () => {
    if (!selectedMessage) return;

    const to = extractContact(selectedMessage.sender);
    const subject = `Re: ${selectedMessage.subject}`;
    const body = `\n\n--- Original Message ---\nFrom: ${selectedMessage.sender}\nSent: ${selectedMessage.timestamp}\nSubject: ${selectedMessage.subject}\n\n${selectedMessage.body}`;

    setSelectedPlatform(selectedMessage.type);
    setReplyInfo({ to, subject, body });
    setIsNewMessageModalOpen(true);
    setIsForwarding(false); // It's a reply, not a forward
  };

  // --- NEW: handleForward function to set the state for the modal ---
  const handleForward = () => {
    if (!selectedMessage) return;

    // Leave 'to' field empty for a new recipient
    const to = "";
    // Preserve the original subject and body for the forward
    const subject = selectedMessage.subject;
    const body = selectedMessage.body;

    setSelectedPlatform(selectedMessage.type);
    setReplyInfo({ to, subject, body });
    setIsNewMessageModalOpen(true);
    setIsForwarding(true); // Set state to true for forwarding
  };
  // -----------------------------------------------------------------

  const tabs = ["All Messages", "WhatsApp", "Email", "LinkedIn"];

  // --- MODIFIED: renderFormFields to use replyInfo and readOnly for forward ---
  const renderFormFields = () => {
    switch (selectedPlatform) {
      case "Email":
        return (
          <>
            <div style={newMessageFormGroupStyle}>
              <label style={newMessageLabelStyle}>To:</label>
              <input
                type="email"
                style={newMessageInputStyle}
                placeholder="Recipient's Email"
                value={replyInfo.to}
                onChange={(e) =>
                  setReplyInfo({ ...replyInfo, to: e.target.value })
                }
              />
            </div>
            <div style={newMessageFormGroupStyle}>
              <label style={newMessageLabelStyle}>Subject:</label>
              <input
                type="text"
                style={newMessageInputStyle}
                placeholder="Subject"
                value={replyInfo.subject}
                onChange={(e) =>
                  setReplyInfo({ ...replyInfo, subject: e.target.value })
                }
                readOnly={isForwarding} // Make subject non-editable for forward
              />
            </div>
            <div style={newMessageFormGroupStyle}>
              <label style={newMessageLabelStyle}>Message:</label>
              <textarea
                style={{
                  ...newMessageTextareaStyle,
                  cursor: isForwarding ? "not-allowed" : "text", // Add a visual cue
                }}
                placeholder="Write your message here..."
                value={replyInfo.body}
                onChange={(e) =>
                  setReplyInfo({ ...replyInfo, body: e.target.value })
                }
                readOnly={isForwarding} // Make body non-editable for forward
              />
            </div>
          </>
        );
      case "WhatsApp":
        return (
          <>
            <div style={newMessageFormGroupStyle}>
              <label style={newMessageLabelStyle}>To:</label>
              <input
                type="tel"
                style={newMessageInputStyle}
                placeholder="Recipient's Phone Number"
                value={replyInfo.to}
                onChange={(e) =>
                  setReplyInfo({ ...replyInfo, to: e.target.value })
                }
              />
            </div>
            <div style={newMessageFormGroupStyle}>
              <label style={newMessageLabelStyle}>Message:</label>
              <textarea
                style={{
                  ...newMessageTextareaStyle,
                  cursor: isForwarding ? "not-allowed" : "text",
                }}
                placeholder="Write your message here..."
                value={replyInfo.body}
                onChange={(e) =>
                  setReplyInfo({ ...replyInfo, body: e.target.value })
                }
                readOnly={isForwarding} // Make body non-editable for forward
              />
            </div>
          </>
        );
      case "LinkedIn":
        return (
          <>
            <div style={newMessageFormGroupStyle}>
              <label style={newMessageLabelStyle}>To:</label>
              <input
                type="text"
                style={newMessageInputStyle}
                placeholder="Recipient's Profile URL"
                value={replyInfo.to}
                onChange={(e) =>
                  setReplyInfo({ ...replyInfo, to: e.target.value })
                }
              />
            </div>
            <div style={newMessageFormGroupStyle}>
              <label style={newMessageLabelStyle}>Subject:</label>
              <input
                type="text"
                style={newMessageInputStyle}
                placeholder="Subject"
                value={replyInfo.subject}
                onChange={(e) =>
                  setReplyInfo({ ...replyInfo, subject: e.target.value })
                }
                readOnly={isForwarding} // Make subject non-editable for forward
              />
            </div>
            <div style={newMessageFormGroupStyle}>
              <label style={newMessageLabelStyle}>Message:</label>
              <textarea
                style={{
                  ...newMessageTextareaStyle,
                  cursor: isForwarding ? "not-allowed" : "text",
                }}
                placeholder="Write your message here..."
                value={replyInfo.body}
                onChange={(e) =>
                  setReplyInfo({ ...replyInfo, body: e.target.value })
                }
                readOnly={isForwarding} // Make body non-editable for forward
              />
            </div>
          </>
        );
      default:
        return null;
    }
  };
  // -----------------------------------------------------------------

  const mainContentStyle = {
    ...pageContainerStyle,
    filter: isNewMessageModalOpen ? " grayscale(50%)" : "none",
  };

  return (
    <>
      <div style={mainContentStyle}>
        {/* Left Pane (Message List) */}
        <div style={inboxContainerStyle}>
          {/* Inbox Header */}
          <div style={inboxHeaderStyle}>
            <h2
              style={{
                margin: 0,
                fontSize: "20px",
                fontWeight: 600,
                color: "#2d334a",
              }}
            >
              Inbox
            </h2>
            <div style={newMessageDropdownContainerStyle}>
              <button
                style={newMessageDropdownButtonStyle}
                onClick={() => setIsNewMessageDropdownOpen(!isNewMessageDropdownOpen)}
              >
                <PlusOutlined /> New Message <DownOutlined />
              </button>
              {isNewMessageDropdownOpen && (
                <div style={newMessageDropdownMenuContainerStyle}>
                  <div
                    style={newMessageDropdownMenuItemStyle}
                    onClick={() => handleNewMessageClick("Email")}
                  >
                    Email
                  </div>
                  <div
                    style={newMessageDropdownMenuItemStyle}
                    onClick={() => handleNewMessageClick("WhatsApp")}
                  >
                    WhatsApp
                  </div>
                  <div
                    style={newMessageDropdownMenuItemStyle}
                    onClick={() => handleNewMessageClick("LinkedIn")}
                  >
                    LinkedIn
                  </div>
                </div>
              )}
            </div>
          </div>
          {/* Tabs */}
          <div style={tabContainerStyle}>
            {tabs.map((tab) => (
              <div
                key={tab}
                style={tabStyle(activeTab === tab)}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </div>
            ))}
          </div>
          {/* Filter and Sort */}
          {/* UPDATED: Split the row into two sections */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 24px', borderBottom: '1px solid #f0f1f3', color: '#a8b0c8', fontSize: '14px' }}>
            {/* Left Section: Sort & Filter */}
            <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
              <div style={sortDropdownStyle}>
                <div
                  style={sortDropdownButtonStyle}
                  onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
                >
                  <SortAscendingOutlined />
                  Sort by: {sortOrder === "newest" ? "Newest" : "Oldest"}
                  <DownOutlined style={{ fontSize: "12px", marginLeft: "4px" }} />
                </div>
                {isSortDropdownOpen && (
                  <div style={sortDropdownMenuContainerStyle}>
                    <div
                      style={sortDropdownMenuItemStyle(sortOrder === "newest")}
                      onClick={() => {
                        setSortOrder("newest");
                        setIsSortDropdownOpen(false);
                      }}
                    >
                      Newest First
                    </div>
                    <div
                      style={sortDropdownMenuItemStyle(sortOrder === "oldest")}
                      onClick={() => {
                        setSortOrder("oldest");
                        setIsSortDropdownOpen(false);
                      }}
                    >
                      Oldest First
                    </div>
                  </div>
                )}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <FilterOutlined /> Filter by:
                <span
                  style={filterOptionStyle(readFilter === "all")}
                  onClick={() => setReadFilter("all")}
                >
                  All
                </span>
                <span
                  style={filterOptionStyle(readFilter === "unread")}
                  onClick={() => setReadFilter("unread")}
                >
                  Unread
                </span>
                <span
                  style={filterOptionStyle(readFilter === "read")}
                  onClick={() => setReadFilter("read")}
                >
                  Read
                </span>
              </div>
            </div>
            {/* Right Section: Search */}
            <div style={searchInputContainerStyle}>
              <input
                type="text"
                placeholder="Search messages..."
                style={searchInputStyle}
                onChange={(e) => handleSearchChange(e.target.value)}
              />
              <button
                style={searchButtonStyle}
                onClick={() => handleSearchChange("")}
              >
                <SearchOutlined />
              </button>
            </div>
          </div>
          {/* Message List */}
          <div style={messageListStyle}>
            {filteredAndSortedMessages.map((msg) => (
              <div
                key={msg.id}
                style={messageItemStyle(msg.read, selectedMessage?.id === msg.id)}
                onClick={() => handleMessageClick(msg.id)}
              >
                {!msg.read && <div style={unreadDotStyle} />}
                <div style={{ paddingLeft: !msg.read ? "12px" : 0 }}>
                  <div style={messageHeaderStyle}>
                    <span style={messageSenderStyle(msg.read)}>
                      {msg.sender}
                    </span>
                    <span style={messageTimestampStyle}>
                      {msg.timestamp.split(" ")[1]} {msg.timestamp.split(" ")[2]}
                    </span>
                  </div>
                  <div style={messageSubjectStyle(msg.read)}>{msg.subject}</div>
                  <div style={messageBodyStyle}>{msg.body}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Pane (Message Details) */}
        {selectedMessage ? (
          <div style={messageDetailsContainerStyle}>
            <div style={messageDetailsHeaderStyle}>
              <div>
                <div style={messageDetailsSenderStyle}>
                  {selectedMessage.sender}
                </div>
                <h3 style={messageDetailsSubjectStyle}>
                  {selectedMessage.subject}
                </h3>
              </div>
              <div style={messageDetailsTimestampStyle}>
                {selectedMessage.timestamp}
              </div>
            </div>
            <div style={messageDetailsBodyStyle}>{selectedMessage.body}</div>
            <div style={{ marginTop: "auto", paddingTop: "20px" }}>
              <div style={actionButtonContainerStyle}>
                <button
                  style={actionButtonStyle}
                  onClick={handleReply}
                >
                  <ArrowRightOutlined /> Reply
                </button>
                {/* --- MODIFIED: Added onClick to the Forward button --- */}
                <button
                  style={actionButtonStyle}
                  onClick={handleForward}
                >
                  <MailOutlined /> Forward
                </button>
                {/* --------------------------------------------------- */}
              </div>
            </div>
          </div>
        ) : (
          <div style={emptyMessageDetailsContainerStyle}>
            <div style={mailIconContainerStyle}>
              <MailOutlined style={mailIconStyle} />
            </div>
            <h3>Message Details</h3>
            <p>Select a message to view its details</p>
          </div>
        )}
      </div>

      {/* New Message Modal (Conditionally Rendered) */}
      {isNewMessageModalOpen && (
        <div style={modalOverlayStyle}>
          <div style={modalBoxStyle}>
            <div style={newMessageHeaderStyle}>
              <h3 style={{ margin: 0, fontWeight: 600 }}>
                {isForwarding ? `Forward ${selectedPlatform} Message` : `New ${selectedPlatform} Message`}
              </h3>
              <CloseOutlined
                style={{
                  fontSize: "18px",
                  cursor: "pointer",
                  color: "#636b91",
                }}
                onClick={() => setIsNewMessageModalOpen(false)}
              />
            </div>

            {renderFormFields()}

            <button
              style={newMessageSendButtonStyle}
              onClick={() => {
                alert("Message Sent ✅");
                setIsNewMessageModalOpen(false);
              }}
            >
              Send Message
            </button>
          </div>
        </div>
      )}
    </>
  );
};