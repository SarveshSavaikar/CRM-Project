import React, { useState } from "react";
import { CSSProperties } from "react";
// Add the useNavigate hook to your imports.
import { useNavigate } from "react-router-dom";

// Define the interfaces for the updated data structure
interface ChangesDetail {
  assignedDate: string;
  dueDate: string;
}

interface DetailedAuditLogEntry {
  user: string;
  role: "Admin" | "Editor" | "Viewer";
  teamName: string;
  teamId: number;
  action: "Create" | "Update" | "Delete";
  entity: string;
  entityId: number;
  changes: ChangesDetail;
  date: string;
}

// Dummy Audit Log Data. Note the date format is now YYYY-MM-DD for easier handling with date inputs.
const initialAuditLogData: DetailedAuditLogEntry[] = [
  {
    user: "Michael Scott",
    role: "Admin",
    teamName: "Sales",
    teamId: 101,
    action: "Create",
    entity: "Task",
    entityId: 18,
    changes: {
      assignedDate: "2023-06-13",
      dueDate: "2023-07-20",
    },
    date: "06.13.2023 - 10:28",
  },
  {
    user: "Michael Scott",
    role: "Admin",
    teamName: "Sales",
    teamId: 101,
    action: "Update",
    entity: "Task",
    entityId: 18,
    changes: {
      assignedDate: "2023-06-13",
      dueDate: "2023-07-20",
    },
    date: "06.13.2023 - 10:26",
  },
  {
    user: "Meredith Palmer",
    role: "Editor",
    teamName: "Marketing",
    teamId: 102,
    action: "Create",
    entity: "ContactNote",
    entityId: 205,
    changes: {
      assignedDate: "2024-11-06",
      dueDate: "",
    },
    date: "11.06.2024 - 05:51",
  },
  {
    user: "Andy Bernard",
    role: "Editor",
    teamName: "Marketing",
    teamId: 102,
    action: "Create",
    entity: "CompanyNote",
    entityId: 70,
    changes: {
      assignedDate: "2024-11-06",
      dueDate: "2024-11-15",
    },
    date: "11.06.2024 - 05:50",
  },
  {
    user: "Kevin Malone",
    role: "Viewer",
    teamName: "Accounting",
    teamId: 103,
    action: "Create",
    entity: "Contact",
    entityId: 53,
    changes: {
      assignedDate: "2024-11-06",
      dueDate: "",
    },
    date: "11.06.2024 - 05:07",
  },
  {
    user: "Stanley Hudson",
    role: "Viewer",
    teamName: "Sales",
    teamId: 101,
    action: "Create",
    entity: "Contact",
    entityId: 98,
    changes: {
      assignedDate: "2024-11-05",
      dueDate: "",
    },
    date: "11.05.2024 - 05:15",
  },
];

// Reused Box styling
export const boxStyle: CSSProperties = {
  borderRadius: 8,
  padding: 16,
  background: "#fff",
  boxShadow: "0 1px 6px 0 #f0f1f3",
  minWidth: 185,
  flex: 1,
};

// Form field styling
const formFieldStyle: CSSProperties = {
  marginBottom: "16px",
  display: "flex",
  flexDirection: "column",
};

const inputStyle: CSSProperties = {
  padding: "8px 12px",
  borderRadius: "6px",
  border: "1px solid #dbe4f3",
  fontSize: "15px",
};

// Define a type for the new record form state to ensure type safety
type NewRecordFormState = {
  user: string;
  role: "Admin" | "Editor" | "Viewer";
  teamName: string;
  teamId: number;
  changes: ChangesDetail;
};

// Initial state for a new record form
const initialNewRecordState: NewRecordFormState = {
  user: "",
  role: "Viewer",
  teamName: "",
  teamId: 0,
  changes: {
    assignedDate: "",
    dueDate: "",
  },
};

export function AuditLog() {
  const [selectedLogEntry, setSelectedLogEntry] = useState<DetailedAuditLogEntry | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [newRecord, setNewRecord] = useState<NewRecordFormState>(initialNewRecordState);
  const [auditLogs, setAuditLogs] = useState(initialAuditLogData);

  // Initialize the useNavigate hook
  const navigate = useNavigate();

  const getMostActiveUser = () => {
    const userCounts: { [key: string]: number } = {};
    let maxCount = 0;
    let mostActiveUser = "N/A";
    auditLogs.forEach(log => {
      userCounts[log.user] = (userCounts[log.user] || 0) + 1;
      if (userCounts[log.user] > maxCount) {
        maxCount = userCounts[log.user];
        mostActiveUser = log.user;
      }
    });
    return mostActiveUser;
  };

  const handleDetailsClick = (log: DetailedAuditLogEntry) => {
    setSelectedLogEntry(log);
  };

  const handleCloseDetailsModal = () => {
    setSelectedLogEntry(null);
  };
  
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name in newRecord.changes) {
      setNewRecord(prev => ({
        ...prev,
        changes: {
          ...prev.changes,
          [name]: value,
        },
      }));
    } else {
      setNewRecord(prev => ({
        ...prev,
        [name]: name === "teamId" ? Number(value) : value as "Admin" | "Editor" | "Viewer" | string,
      }));
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const now = new Date();
    const formattedDate = `${now.toLocaleDateString('en-GB')} - ${now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}`;

    const newEntry: DetailedAuditLogEntry = {
      ...newRecord,
      action: "Create",
      entity: "New Entry",
      entityId: Math.floor(Math.random() * 1000),
      date: formattedDate,
    };

    setAuditLogs(prevLogs => [...prevLogs, newEntry]);

    setIsFormModalOpen(false);
    setNewRecord(initialNewRecordState);
  };

  // Function to handle navigation
  const handleGoBack = () => {
    // Replace '/admin' with the actual path to your admin page
    navigate('/admin');
  };

  return (
    <div
      style={{
        fontFamily: "Inter, sans-serif",
        background: "#f4f6fb",
        minHeight: "100vh",
        padding: "28px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 0,
        }}
      >
        <h1
          style={{
            fontSize: 25,
            fontWeight: 700,
            margin: 0,
            letterSpacing: 0,
          }}
        >
          Audit Log
        </h1>
        {/* Add the "Go Back" button here */}
        <button
          onClick={handleGoBack}
          style={{
            padding: "8px 12px",
            background: "#1467fa",
            color: "#fff",
            border: "1px solid #dbe4f3",
            borderRadius: "6px",
            fontWeight: 500,
            cursor: "pointer",
          }}
        >
          Go Back
        </button>
      </div>

      <div style={{ display: "flex", gap: 24, margin: "30px 0 23px 0" }}>
        <div style={boxStyle}>
          <div style={{ color: "#888fac", fontSize: 13, marginBottom: 6 }}>
            Total Logs
          </div>
          <div style={{ fontWeight: 700, fontSize: 23 }}>
            {auditLogs.length}
          </div>
        </div>
        <div style={boxStyle}>
          <div style={{ color: "#888fac", fontSize: 13, marginBottom: 6 }}>
            Most Active User
          </div>
          <div style={{ fontWeight: 700, fontSize: 23 }}>{getMostActiveUser()}</div>
        </div>
      </div>

      <div
        style={{
          background: "#fff",
          borderRadius: 10,
          boxShadow: "0 1px 6px #f0f1f3",
          padding: 0,
          marginTop: 0,
          overflowX: "auto",
        }}
      >
        <div
          style={{
            padding: "16px 18px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ fontWeight: 600, fontSize: 18 }}>
            Audit Log
          </div>
          <button 
            onClick={() => setIsFormModalOpen(true)}
            style={{
              padding: "8px 12px",
              background: "#1467fa",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            Add More Records
          </button>
        </div>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: 15,
          }}
        >
          <thead>
            <tr style={{ background: "#f8fafd", color: "#7b849a" }}>
              <th style={{ textAlign: "left", padding: "13px 18px" }}>USER</th>
              <th style={{ textAlign: "left", padding: "13px 8px" }}>ROLE</th>
              <th style={{ textAlign: "left", padding: "13px 8px" }}>TEAM (ID)</th>
              <th style={{ textAlign: "left", padding: "13px 8px" }}>CHANGES</th>
            </tr>
          </thead>
          <tbody>
            {auditLogs.length > 0 ? (
              auditLogs.map((log, index) => (
                <tr key={index} style={{ borderBottom: "1px solid #f2f3f7" }}>
                  <td style={{ padding: "14px 18px", fontWeight: 500 }}>{log.user}</td>
                  <td style={{ padding: "14px 8px" }}>
                    <span style={{
                      display: "inline-block",
                      padding: "4px 8px",
                      borderRadius: "16px",
                      fontSize: "12px",
                      fontWeight: "bold",
                      color: "#fff",
                      background: log.role === "Admin" ? "#28a745" : log.role === "Editor" ? "#ffc107" : "#007bff"
                    }}>
                      {log.role}
                    </span>
                  </td>
                  <td style={{ padding: "14px 8px" }}>{log.teamName} ({log.teamId})</td>
                  <td style={{ padding: "14px 8px" }}>
                    <button
                      onClick={() => handleDetailsClick(log)}
                      style={{
                        padding: "6px 12px",
                        background: "#f0f2f7",
                        color: "#636b91",
                        border: "none",
                        borderRadius: "6px",
                        fontWeight: 500,
                        cursor: "pointer",
                      }}
                    >
                      Details
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={4}
                  style={{
                    textAlign: "center",
                    padding: "32px 0",
                    color: "#9e9fad",
                    fontSize: 18,
                  }}
                >
                  No audit log entries found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Details Modal Prompt Card */}
      {selectedLogEntry && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
          onClick={handleCloseDetailsModal}
        >
          <div
            style={{
              background: "#fff",
              padding: "24px",
              borderRadius: "8px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
              position: "relative",
              minWidth: "300px",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ margin: "0 0 16px 0", fontSize: "18px", fontWeight: "600" }}>
              Changes Details
            </h2>
            <div style={{ lineHeight: "1.5" }}>
              <div style={{ marginBottom: "8px" }}>
                <strong>Assigned Date:</strong> {selectedLogEntry.changes.assignedDate}
              </div>
              <div>
                <strong>Due Date:</strong> {selectedLogEntry.changes.dueDate}
              </div>
            </div>
            <button
              onClick={handleCloseDetailsModal}
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                border: "none",
                background: "transparent",
                fontSize: "20px",
                cursor: "pointer",
              }}
            >
              &times;
            </button>
          </div>
        </div>
      )}

      {/* Add New Record Modal Form */}
      {isFormModalOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
          onClick={() => setIsFormModalOpen(false)}
        >
          <div
            style={{
              background: "#fff",
              padding: "24px",
              borderRadius: "8px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
              position: "relative",
              minWidth: "400px",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ margin: "0 0 16px 0", fontSize: "18px", fontWeight: "600" }}>
              Add New Audit Record
            </h2>
            <form onSubmit={handleFormSubmit}>
              <div style={formFieldStyle}>
                <label style={{ marginBottom: "4px" }}>User</label>
                <input
                  type="text"
                  name="user"
                  value={newRecord.user}
                  onChange={handleFormChange}
                  style={inputStyle}
                  required
                />
              </div>
              <div style={formFieldStyle}>
                <label style={{ marginBottom: "4px" }}>Role</label>
                <select
                  name="role"
                  value={newRecord.role}
                  onChange={handleFormChange}
                  style={inputStyle}
                  required
                >
                  <option value="Admin">Admin</option>
                  <option value="Editor">Editor</option>
                  <option value="Viewer">Viewer</option>
                </select>
              </div>
              <div style={{ display: "flex", gap: "16px" }}>
                <div style={{ ...formFieldStyle, flex: 1 }}>
                  <label style={{ marginBottom: "4px" }}>Team Name</label>
                  <input
                    type="text"
                    name="teamName"
                    value={newRecord.teamName}
                    onChange={handleFormChange}
                    style={inputStyle}
                    required
                  />
                </div>
                <div style={{ ...formFieldStyle, flex: 1 }}>
                  <label style={{ marginBottom: "4px" }}>Team ID</label>
                  <input
                    type="number"
                    name="teamId"
                    value={newRecord.teamId}
                    onChange={handleFormChange}
                    style={inputStyle}
                    required
                  />
                </div>
              </div>
              <div style={{ display: "flex", gap: "16px" }}>
                <div style={{ ...formFieldStyle, flex: 1 }}>
                  <label style={{ marginBottom: "4px" }}>Assigned Date</label>
                  <input
                    type="date"
                    name="assignedDate"
                    value={newRecord.changes.assignedDate}
                    onChange={handleFormChange}
                    style={inputStyle}
                    required
                  />
                </div>
                <div style={{ ...formFieldStyle, flex: 1 }}>
                  <label style={{ marginBottom: "4px" }}>Due Date</label>
                  <input
                    type="date"
                    name="dueDate"
                    value={newRecord.changes.dueDate}
                    onChange={handleFormChange}
                    style={inputStyle}
                    required
                  />
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "16px" }}>
                <button
                  type="button"
                  onClick={() => setIsFormModalOpen(false)}
                  style={{
                    padding: "8px 16px",
                    border: "1px solid #dbe4f3",
                    borderRadius: "6px",
                    background: "none",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: "8px 16px",
                    border: "none",
                    borderRadius: "6px",
                    background: "#4e79ff",
                    color: "#fff",
                    cursor: "pointer",
                  }}
                >
                  Submit
                </button>
              </div>
            </form>
            <button
              onClick={() => setIsFormModalOpen(false)}
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                border: "none",
                background: "transparent",
                fontSize: "20px",
                cursor: "pointer",
              }}
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AuditLog;