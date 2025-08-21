import React, { useState, ChangeEvent } from "react";
import {
  HomeOutlined,
  PhoneOutlined,
  MailOutlined,
  GlobalOutlined,
  UploadOutlined,
  AreaChartOutlined,
  PieChartOutlined,
  LineChartOutlined,
  FilterOutlined,
  TeamOutlined,
  DeploymentUnitOutlined,
  AppstoreAddOutlined,
  CheckCircleOutlined,
  SyncOutlined,
  DisconnectOutlined,
  PlusOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import {
  DndContext,
  useSensors,
  useSensor,
  PointerSensor,
  closestCenter,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Link } from "react-router-dom"; // Added for navigation

// --- Dashboard Filter Controls ---
const DashboardFilterControls: React.FC = () => (
  <div
    style={{
      border: "1px solid #eee",
      padding: 24,
      borderRadius: 12,
      marginBottom: 32,
      background: "#fff",
      display: "flex",
      gap: 24,
      flexWrap: "wrap",
    }}
  >
    {[
      { label: "Time Range", options: ["Last 7 Days", "Last 30 Days", "This Month", "This Year"] },
      { label: "Team", options: ["All Teams", "Sales", "Marketing"] },
      { label: "Campaign", options: ["All Campaigns", "Q3 Launch", "Black Friday"] },
    ].map((filter) => (
      <div key={filter.label} style={{ flex: 1, minWidth: 200 }}>
        <label style={{ fontWeight: 500, color: "#000" }}>{filter.label}</label>
        <br />
        <select
          style={{
            width: "100%",
            padding: 8,
            borderRadius: 6,
            marginTop: 6,
            background: "#fff",
            color: "#000",
            border: "1px solid #ccc",
          }}
        >
          {filter.options.map((opt) => (
            <option key={opt}>{opt}</option>
          ))}
        </select>
      </div>
    ))}
    <div style={{ flex: 1, minWidth: 240, display: "flex", alignItems: "center", gap: 24 }}>
      <div style={{ flex: 1 }}>
        <label style={{ fontWeight: 500, color: "#000" }}>Region</label>
        <br />
        <select
          style={{
            width: "100%",
            padding: 8,
            borderRadius: 6,
            marginTop: 6,
            background: "#fff",
            color: "#000",
            border: "1px solid #ccc",
          }}
        >
          <option>All Regions</option>
          <option>North America</option>
          <option>Europe</option>
        </select>
      </div>
    </div>
  </div>
);

// --- Contact Types & Data ---
type Contact = {
  name: string;
  title: string;
  role: "Sales Manager" | "Sales Person";
  avatarUrl?: string;
};

// Initial data for contacts
const initialContacts: Contact[] = [
  { name: "Michael Scott", title: "Central Mobility Specialist", role: "Sales Manager", avatarUrl: "https://randomuser.me/api/portraits/men/1.jpg" },
  { name: "Meredith Palmer", title: "Senior Factors Coordinator", role: "Sales Person", avatarUrl: "https://randomuser.me/api/portraits/women/2.jpg" },
  { name: "Jim Halpert", title: "Central Optimization Executive", role: "Sales Person", avatarUrl: "https://randomuser.me/api/portraits/men/3.jpg" },
  { name: "Dwight Schrute", title: "Internal Intranet Facilitator", role: "Sales Manager", avatarUrl: "https://randomuser.me/api/portraits/men/4.jpg" },
];

const badgeColor = (role: Contact["role"]) =>
  role === "Sales Manager"
    ? { color: "#169E6C", background: "#E6F9F1" }
    : { color: "#537FE7", background: "#F2F5FB" };

// Changed to accept contacts as a prop
const ContactsTable: React.FC<{ contacts: Contact[] }> = ({ contacts }) => (
  <table
    style={{
      width: "100%",
      background: "#fff",
      borderRadius: 8,
      color: "#000",
      borderCollapse: "separate",
      borderSpacing: 0,
    }}
  >
    <thead>
      <tr>
        {["Name", "Title", "Role"].map((header) => (
          <th
            key={header}
            style={{
              textAlign: "left",
              padding: 8,
              fontWeight: 600,
              color: "#1467fa",
              borderBottom: "1px solid #eef0f2",
            }}
          >
            {header}
          </th>
        ))}
      </tr>
    </thead>
    <tbody>
      {contacts.map((c, idx) => (
        <tr
          key={c.name}
          style={{
            borderBottom: idx !== contacts.length - 1 ? "1px solid #eef0f2" : "none",
          }}
        >
          <td style={{ padding: 8, display: "flex", alignItems: "center", gap: 8 }}>
            <img
              src={c.avatarUrl}
              alt={c.name}
              style={{ width: 28, height: 28, borderRadius: "50%" }}
            />
            {c.name}
          </td>
          <td style={{ padding: 8 }}>{c.title}</td>
          <td style={{ padding: 8 }}>
            <span
              style={{
                ...badgeColor(c.role),
                padding: "2px 12px",
                borderRadius: 16,
                fontWeight: 600,
                fontSize: 13,
                display: "inline-block",
              }}
            >
              {c.role}
            </span>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

// --- Custom Widget Button ---
interface CustomWidgetButtonProps {
  icon: React.ReactNode;
  label: string;
}

const CustomWidgetButton: React.FC<CustomWidgetButtonProps> = ({ icon, label }) => (
  <div
    style={{
      background: "#fafcff",
      border: "1.5px solid #e6e9f1",
      borderRadius: 10,
      padding: "18px 24px 12px 24px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 7,
      minWidth: 128,
      minHeight: 75,
      position: "relative",
    }}
  >
    {icon}
    <span style={{ fontWeight: 500, color: "#2a3253", fontSize: 15 }}>{label}</span>
  </div>
);

// --- Sortable Widget Component ---
const SortableWidgetButton = ({ id, icon, label }: { id: string; icon: React.ReactNode; label: string }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: "grab",
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <CustomWidgetButton icon={icon} label={label} />
    </div>
  );
};

// --- Widget Customization ---
const WidgetCustomization: React.FC = () => {
  interface Widget {
    icon: React.ReactElement;
    label: string;
  }

  const allWidgets: Widget[] = [
    { icon: <AreaChartOutlined style={{ fontSize: 24, color: "#377afd" }} />, label: "Sales Overview" },
    { icon: <PieChartOutlined style={{ fontSize: 24, color: "#377afd" }} />, label: "Lead Source" },
    { icon: <LineChartOutlined style={{ fontSize: 24, color: "#377afd" }} />, label: "Revenue Trend" },
    { icon: <FilterOutlined style={{ fontSize: 24, color: "#377afd" }} />, label: "Task Progress" },
    { icon: <TeamOutlined style={{ fontSize: 24, color: "#377afd" }} />, label: "Team Performance" },
    { icon: <DeploymentUnitOutlined style={{ fontSize: 24, color: "#377afd" }} />, label: "Deal Stages" },
    { icon: <AppstoreAddOutlined style={{ fontSize: 24, color: "#377afd" }} />, label: "New Widget 1" },
    { icon: <CheckCircleOutlined style={{ fontSize: 24, color: "#377afd" }} />, label: "New Widget 2" },
    { icon: <DisconnectOutlined style={{ fontSize: 24, color: "#377afd" }} />, label: "New Widget 3" },
  ];

  const [activeWidgets, setActiveWidgets] = useState<Widget[]>(allWidgets.slice(0, 6));
  const [showAddWidgetModal, setShowAddWidgetModal] = useState(false);

  const availableWidgets = allWidgets.filter(
    (widget) => !activeWidgets.some((w) => w.label === widget.label)
  );

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      setActiveWidgets((items) => {
        const oldIndex = items.findIndex((item) => item.label === active.id);
        const newIndex = items.findIndex((item) => item.label === over?.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleAddNewWidget = (newWidget: Widget) => {
    setActiveWidgets((prevWidgets) => [...prevWidgets, newWidget]);
  };

  const handleRemoveWidget = (widgetToRemove: Widget) => {
    setActiveWidgets((prevWidgets) =>
      prevWidgets.filter((widget) => widget.label !== widgetToRemove.label)
    );
  };

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 12,
        boxShadow: "0 2px 16px #e6e9f1",
        padding: 28,
        color: "#222",
        width: "100%",
        maxWidth: 800,
        marginRight: "auto",
        marginLeft: 0,
        minWidth: 340,
      }}
    >
      <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 18 }}>Widget Customization</div>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={activeWidgets.map(w => w.label)} strategy={verticalListSortingStrategy}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 18, marginBottom: 18 }}>
            {activeWidgets.map(({ icon, label }) => (
              <SortableWidgetButton
                key={label}
                id={label}
                icon={icon}
                label={label}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
      <button
        onClick={() => setShowAddWidgetModal(true)}
        style={{
          border: "1px solid #377afd",
          color: "#377afd",
          borderRadius: 8,
          background: "#f6f7fb",
          padding: "10px 16px",
          display: "flex",
          alignItems: "center",
          fontWeight: 600,
          gap: 8,
          fontSize: 15,
          cursor: "pointer",
        }}
      >
        <AppstoreAddOutlined />
        Add/Remove Widgets
      </button>

      {showAddWidgetModal && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "rgba(0,0,0,0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1000,
        }}>
          <div style={{
            background: "#fff",
            padding: 32,
            borderRadius: 12,
            width: "90%",
            maxWidth: 800,
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h3 style={{ margin: 0, fontWeight: 700 }}>Manage Widgets</h3>
              <button
                onClick={() => setShowAddWidgetModal(false)}
                style={{
                  border: "none",
                  background: "transparent",
                  fontSize: 20,
                  cursor: "pointer",
                  color: "#999",
                }}
              >
                <CloseOutlined />
              </button>
            </div>

            {/* Current Active Widgets Section */}
            <div style={{ marginBottom: 24, paddingBottom: 24, borderBottom: "1px solid #eef0f2" }}>
              <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 10 }}>Current Widgets</div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                  gap: 12,
                  maxHeight: "300px",
                  overflowY: "auto",
                }}
              >
                {activeWidgets.length > 0 ? (
                  activeWidgets.map((widget) => (
                    <div
                      key={widget.label}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        background: "#fafcff",
                        border: "1px solid #e6e9f1",
                        borderRadius: 8,
                        padding: 12,
                        position: 'relative',
                      }}
                    >
                      <div style={{ color: "#377afd", fontSize: 20 }}>
                        {widget.icon}
                      </div>
                      <span style={{ fontWeight: 600, fontSize: 14 }}>
                        {widget.label}
                      </span>
                      <button
                        onClick={() => handleRemoveWidget(widget)}
                        style={{
                          marginLeft: "auto",
                          border: "none",
                          background: "transparent",
                          cursor: "pointer",
                          color: "#888",
                        }}
                      >
                        <CloseOutlined />
                      </button>
                    </div>
                  ))
                ) : (
                  <div style={{ textAlign: "center", width: "100%", color: "#888", padding: "12px 0" }}>
                    No widgets on the dashboard.
                  </div>
                )}
              </div>
            </div>

            {/* Available Widgets Section */}
            <div>
              <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 10 }}>Available Widgets</div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                  gap: 12,
                  maxHeight: "300px",
                  overflowY: "auto",
                }}
              >
                {availableWidgets.length > 0 ? (
                  availableWidgets.map((widget) => (
                    <div
                      key={widget.label}
                      onClick={() => handleAddNewWidget(widget)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        background: "#f6f7fb",
                        border: "1px solid #e6e9f1",
                        borderRadius: 8,
                        padding: 12,
                        cursor: "pointer",
                        transition: "background 0.2s",
                      }}
                    >
                      <div style={{ color: "#377afd", fontSize: 20 }}>
                        {widget.icon}
                      </div>
                      <span style={{ fontWeight: 600, fontSize: 14 }}>
                        {widget.label}
                      </span>
                      <PlusOutlined style={{ marginLeft: "auto", color: "#377afd" }} />
                    </div>
                  ))
                ) : (
                  <div style={{ textAlign: "center", width: "100%", color: "#888", padding: "24px 0" }}>
                    All widgets have been added.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- CompanyCard with Logo Upload ---
const CompanyCard: React.FC<{
  contacts: Contact[];
  onAddContact: (newContact: Omit<Contact, "avatarUrl">) => void;
}> = ({ contacts, onAddContact }) => {
  const [logo, setLogo] = useState<string | null>(null);
  const [isAddRecordModalOpen, setIsAddRecordModalOpen] = useState(false);
  const [newContact, setNewContact] = useState<Omit<Contact, "avatarUrl">>({
    name: "",
    title: "",
    role: "Sales Person",
  });

  const handleUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (typeof event.target?.result === "string") setLogo(event.target.result);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleFormChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewContact(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddContact(newContact);
    setNewContact({ name: "", title: "", role: "Sales Person" }); // Reset form
    setIsAddRecordModalOpen(false); // Close the modal
  };

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 12,
        boxShadow: "0 2px 16px #e6e9f1",
        padding: 32,
        flex: 5,
        minWidth: 650,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24, justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ position: "relative" }}>
            <img
              src={logo || "https://cdn-icons-png.flaticon.com/512/431/431803.png"}
              alt="Globex Logo"
              style={{
                width: 52,
                height: 52,
                borderRadius: 8,
                border: "1px solid #e6e9f1",
                background: "#fafbfc",
                objectFit: "cover",
              }}
            />
            <label
              htmlFor="logo-upload"
              style={{
                position: "absolute",
                right: -12,
                bottom: -12,
                background: "#377afd",
                color: "#fff",
                borderRadius: "50%",
                width: 30,
                height: 30,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                fontSize: 16,
              }}
            >
              <UploadOutlined />
              <input
                id="logo-upload"
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleUpload}
              />
            </label>
          </div>
          <div>
            <h2 style={{ margin: 0, fontWeight: 700, fontSize: 22, color: "#2d3648" }}>
              Globex Corporation
            </h2>
            <span style={{ color: "#888", fontWeight: 500, fontSize: 14 }}>
              CRM Platform
            </span>
          </div>
        </div>
        <button
          onClick={() => setIsAddRecordModalOpen(true)}
          style={{
            padding: "8px 16px",
            background: "#1467fa",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            fontWeight: 500,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 8,
            boxShadow: "0 2px 8px rgba(20, 103, 250, 0.2)",
          }}
        >
          <PlusOutlined /> Add Record
        </button>
      </div>

      <ContactsTable contacts={contacts} />

      {isAddRecordModalOpen && (
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
          onClick={() => setIsAddRecordModalOpen(false)}
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
              Add New Record
            </h2>
            <form onSubmit={handleFormSubmit}>
              <div style={{ marginBottom: "16px", display: "flex", flexDirection: "column" }}>
                <label style={{ marginBottom: "4px" }}>Name</label>
                <input
                  type="text"
                  name="name"
                  value={newContact.name}
                  onChange={handleFormChange}
                  style={{ padding: "8px 12px", borderRadius: "6px", border: "1px solid #dbe4f3", fontSize: "15px" }}
                  required
                />
              </div>
              <div style={{ marginBottom: "16px", display: "flex", flexDirection: "column" }}>
                <label style={{ marginBottom: "4px" }}>Title</label>
                <input
                  type="text"
                  name="title"
                  value={newContact.title}
                  onChange={handleFormChange}
                  style={{ padding: "8px 12px", borderRadius: "6px", border: "1px solid #dbe4f3", fontSize: "15px" }}
                  required
                />
              </div>
              <div style={{ marginBottom: "16px", display: "flex", flexDirection: "column" }}>
                <label style={{ marginBottom: "4px" }}>Role</label>
                <select
                  name="role"
                  value={newContact.role}
                  onChange={handleFormChange}
                  style={{ padding: "8px 12px", borderRadius: "6px", border: "1px solid #dbe4f3", fontSize: "15px" }}
                  required
                >
                  <option value="Sales Person">Sales Person</option>
                  <option value="Sales Manager">Sales Manager</option>
                </select>
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "16px" }}>
                <button
                  type="button"
                  onClick={() => setIsAddRecordModalOpen(false)}
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
                    background: "#1467fa",
                    color: "#fff",
                    cursor: "pointer",
                  }}
                >
                  Submit
                </button>
              </div>
            </form>
            <button
              onClick={() => setIsAddRecordModalOpen(false)}
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
              <CloseOutlined />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};


// --- Company Info Card ---
const CompanyInfoCard: React.FC = () => (
  <div
    style={{
      background: "#fff",
      borderRadius: 12,
      boxShadow: "0 2px 16px #e6e9f1",
      padding: 32,
      flex: 3,
      minWidth: 500,
      color: "#222",
    }}
  >
    <h3 style={{ margin: 0, fontWeight: 600, fontSize: 20, marginBottom: 10 }}>
      Company info
    </h3>
    {[
      { icon: <HomeOutlined />, label: "Address", value: "2158 Mount Tabor, Westbury, New York, USA 11590" },
      { icon: <PhoneOutlined />, label: "Phone", value: "+123 456 789 01 23" },
      { icon: <MailOutlined />, label: "Email", value: "info@globex.com" },
      { icon: <GlobalOutlined />, label: "Website", value: "www.globex.com" },
    ].map((item, idx, arr) => (
      <React.Fragment key={item.label}>
        <div style={{ display: "flex", alignItems: "start", gap: 16, padding: "12px 0" }}>
          <div style={{ color: "#377afd", fontSize: 22 }}>{item.icon}</div>
          <div>
            <div style={{ color: "#777", fontSize: 13, fontWeight: 500 }}>{item.label}</div>
            <div style={{ color: "#222", fontSize: 15, fontWeight: 500 }}>{item.value}</div>
          </div>
        </div>
        {idx !== arr.length - 1 && <div style={{ borderBottom: "1px solid #eef0f2", width: "100%" }} />}
      </React.Fragment>
    ))}
  </div>
);

// --- System Alerts ---
interface AlertItem {
  label: string;
  status: "connected" | "disconnected" | "syncing";
  lastSync: string;
}

const alerts: AlertItem[] = [
  { label: "Mail API", status: "connected", lastSync: "2024-07-26 14:30" },
  { label: "Call API", status: "disconnected", lastSync: "2024-07-26 10:15" },
  { label: "CRM Sync", status: "syncing", lastSync: "2024-07-26 15:05" },
  { label: "Analytics Data", status: "connected", lastSync: "2024-07-26 15:10" },
];

const statusDisplay: Record<AlertItem["status"], { text: string; color: string; icon: React.ReactNode; bg: string }> = {
  connected: { text: "Connected", color: "#32be6a", icon: <CheckCircleOutlined />, bg: "#e8f8ef" },
  disconnected: { text: "Disconnected", color: "#fff", icon: <DisconnectOutlined />, bg: "#f96868" },
  syncing: { text: "Syncing...", color: "#377afd", icon: <SyncOutlined spin />, bg: "#e5f0ff" },
};

const SystemAlerts: React.FC = () => (
  <div
    style={{
      background: "#fff",
      borderRadius: 12,
      boxShadow: "0 2px 16px #e6e9f1",
      padding: 28,
      maxWidth: 390,
      width: "100%",
      minWidth: 275,
      color: "#1a2433",
      display: "flex",
      flexDirection: "column",
    }}
  >
    <div style={{ fontWeight: 700, fontSize: 19, marginBottom: 14 }}>System Alerts</div>
    {alerts.map((a, idx) => {
      const d = statusDisplay[a.status];
      return (
        <div
          key={a.label}
          style={{
            display: "flex",
            alignItems: "center",
            padding: "18px 12px",
            borderBottom: idx !== alerts.length - 1 ? "1px solid #eff2f9" : "none",
          }}
        >
          <div style={{ flex: 1, fontWeight: 500 }}>{a.label}</div>
          <div
            style={{
              marginRight: 12,
              fontWeight: 600,
              background: a.status === "disconnected" ? "#f96868" : d.bg,
              color: a.status === "disconnected" ? "#fff" : d.color,
              borderRadius: 6,
              padding: "5px 13px",
              fontSize: 14,
              display: "flex",
              alignItems: "center",
              gap: 7
            }}
          >
            {d.icon}
            <span>{d.text}</span>
          </div>
          <div style={{ fontSize: 13, color: "#7c7d9c", minWidth: 98, textAlign: "right" }}>
            Last sync:<br />
            <span style={{ fontWeight: 600 }}>{a.lastSync}</span>
          </div>
        </div>
      );
    })}
  </div>
);

// --- Main Page ---
export const AdminSettingsPage: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>(initialContacts);

  const handleAddContact = (newContact: Omit<Contact, "avatarUrl">) => {
    // Generate a placeholder avatar URL for the new contact
    const newContactWithAvatar = {
      ...newContact,
      avatarUrl: "https://randomuser.me/api/portraits/lego/1.jpg",
    };
    setContacts((prevContacts) => [...prevContacts, newContactWithAvatar]);
  };

  return (
    <div
      style={{
        fontFamily: "Inter, sans-serif",
        minHeight: "100vh",
        background: "#f5f5f8",
        padding: "32px 12px",
        color: "#000",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 32,
        }}
      >
        <h1 style={{ fontWeight: 700, fontSize: 32, margin: 0 }}>
          Admin / Settings
        </h1>
        <Link to="/admin/auditlog">
          <button
            style={{
              padding: "10px 20px",
              background: "#1467fa",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              fontWeight: 500,
              cursor: "pointer",
              boxShadow: "0 2px 8px rgba(20, 103, 250, 0.2)",
              transition: "background 0.2s, box-shadow 0.2s",
            }}
          >
            View Audit Log
          </button>
        </Link>
      </div>

      <DashboardFilterControls />

      {/* Row: Globex Card + Company Info */}
      <div
        style={{
          display: "flex",
          flexWrap: "nowrap",
          gap: 32,
          alignItems: "flex-start",
          overflowX: "auto",
          marginBottom: 32,
        }}
      >
        <CompanyCard contacts={contacts} onAddContact={handleAddContact} />
        <CompanyInfoCard />
      </div>

      {/* Row: Widgets + System Alerts */}
      <div
        style={{
          display: "flex",
          flexWrap: "nowrap",
          gap: 32,
          alignItems: "flex-start",
          overflowX: "auto",
        }}
      >
        <WidgetCustomization />
        <SystemAlerts />
      </div>
    </div>
  );
};

export default AdminSettingsPage;