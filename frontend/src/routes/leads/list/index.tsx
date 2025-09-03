import React, { useEffect, useState } from "react";
import {
  DndContext,
  useSensors,
  useSensor,
  MouseSensor,
  TouchSensor,
  useDroppable,
  useDraggable,
  DragEndEvent,
} from "@dnd-kit/core";
import { HttpError, useCreate, useList } from "@refinedev/core";

// --- DUMMY LEADS DATA with updated 'status' values ---

const initialLeads: Lead[] = [
  {
    id: 1,
    name: "Aidan Smith",
    email: "aidan.smith@example.com",
    phone: "9876543210",
    source: "Web Form",
    status: "Open",
    score: 80,
    team_id: 1,
    user_id: 2,
    user_name: "Sarah J.",
    team_name: "Sales Team",
  },
  {
    id: 2,
    name: "Olivia Chen",
    email: "olivia.chen@example.com",
    phone: "9123456780",
    source: "Referral",
    status: "In Progress",
    score: 70,
    team_id: 2,
    user_id: 3,
    user_name: "Michael B.",
    team_name: "Growth Team",
  },
  {
    id: 3,
    name: "Benjamin Davis",
    email: "benjamin.davis@example.com",
    phone: "9988776655",
    source: "Cold Call",
    status: "In Progress",
    score: 65,
    team_id: 1,
    user_id: 2,
    user_name: "Sarah J.",
    team_name: "Sales Team",
  },
  {
    id: 4,
    name: "Sophia Rodriguez",
    email: "sophia.rodriguez@example.com",
    phone: "9001122334",
    source: "Marketing Campaign",
    status: "Open",
    score: 60,
    team_id: 2,
    user_id: 3,
    user_name: "Michael B.",
    team_name: "Growth Team",
  },
  {
    id: 5,
    name: "Ethan Miller",
    email: "ethan.miller@example.com",
    phone: "9112233445",
    source: "Web Form",
    status: "Lost",
    score: 40,
    team_id: 1,
    user_id: 2,
    user_name: "Sarah J.",
    team_name: "Sales Team",
  },
  {
    id: 6,
    name: "Chloe Wilson",
    email: "chloe.wilson@example.com",
    phone: "9223344556",
    source: "Partnership Event",
    status: "In Progress",
    score: 75,
    team_id: 2,
    user_id: 3,
    user_name: "Michael B.",
    team_name: "Growth Team",
  },
  {
    id: 7,
    name: "Daniel Garcia",
    email: "daniel.garcia@example.com",
    phone: "9334455667",
    source: "Web Form",
    status: "Open",
    score: 55,
    team_id: 1,
    user_id: 2,
    user_name: "Sarah J.",
    team_name: "Sales Team",
  },
  {
    id: 8,
    name: "Mia Martinez",
    email: "mia.martinez@example.com",
    phone: "9445566778",
    source: "Social Media",
    status: "In Progress",
    score: 68,
    team_id: 2,
    user_id: 3,
    user_name: "Michael B.",
    team_name: "Growth Team",
  },
  {
    id: 9,
    name: "Jason Mark",
    email: "jason.mark@example.com",
    phone: "9556677889",
    source: "Web Form",
    status: "Converted",
    score: 90,
    team_id: 1,
    user_id: 2,
    user_name: "Sarah J.",
    team_name: "Sales Team",
  },
];

// --- STYLING CONSTANTS & REUSABLE COMPONENTS ---
const boxStyle = {
  borderRadius: 8,
  padding: 16,
  background: "#fff",
  boxShadow: "0 1px 6px 0 #f0f1f3",
  minWidth: 185,
  flex: 1,
};

const kanbanColumnStyle = {
  minWidth: 300,
  maxWidth: 350,
  borderRadius: 8,
  padding: 16,
  boxShadow: "0 1px 6px 0 #f0f1f3",
  flexShrink: 0,
  height: "fit-content" as "fit-content",
};

const kanbanHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 16,
  fontSize: 16,
  color: "#49527a",
};

const kanbanCountStyle = {
  background: "#e0e7ff",
  color: "#3858c1",
  padding: "4px 8px",
  borderRadius: 12,
  fontSize: 13,
  fontWeight: 500,
};

const kanbanCardStyle = {
  padding: 16,
  marginBottom: 10,
  borderRadius: 6,
  boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
  transition: "background 0.2s",
  border: "1px solid #dbe4f3",
  cursor: "grab",
  background: "#fff",
};

const formContainerStyle = {
  position: "fixed" as "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: "rgba(0,0,0,0.5)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
};

const formModalStyle = {
  background: "#fff",
  padding: "20px",
  borderRadius: "12px",
  boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
  width: "950px",
  maxWidth: "95%",
  display: "flex",
  flexDirection: "column" as "column",
  gap: "15px",
  pointerEvents: "auto" as "auto",
};

const formGroupStyle = {
  marginBottom: "0",
  display: "flex",
  flexDirection: "column" as "column",
  gap: "6px",
  flex: 1,
};

const labelStyle = {
  fontWeight: 500,
  color: "#49527a",
  fontSize: "12px",
};

const inputStyle = {
  padding: "8px 10px",
  borderRadius: "8px",
  border: "1px solid #dbe4f3",
  fontSize: "13px",
  color: "#49527a",
  background: "#f7fafd",
  width: "100%",
  boxSizing: "border-box" as "border-box",
  transition: "border-color 0.2s, box-shadow 0.2s",
};

const cancelButton = {
  padding: "10px 20px",
  background: "#f0f2f7",
  color: "#636b91",
  border: "none",
  borderRadius: "8px",
  fontWeight: 500,
  cursor: "pointer",
  transition: "background 0.2s",
};
const saveButton = {
  padding: "10px 20px",
  background: "#1467fa",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  fontWeight: 500,
  cursor: "pointer",
  boxShadow: "0 2px 8px rgba(20, 103, 250, 0.2)",
  transition: "background 0.2s, box-shadow 0.2s",
};

// Kanban Card Component (draggable)
const KanbanCard = ({ lead }: { lead: (typeof initialLeads)[number] }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: lead.id,
      data: { type: "Lead", lead },
    });
  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        opacity: isDragging ? 0.5 : 1,
      }
    : undefined;
  return (
    <div
      ref={setNodeRef}
      style={{ ...kanbanCardStyle, ...style }}
      {...listeners}
      {...attributes}
    >
            <div style={{ fontWeight: 600, fontSize: 16 }}>{lead.name}</div>   
       {" "}
      <div style={{ color: "#888fac", fontSize: 13, marginTop: 4 }}>
                Assigned to: {lead.user_name}     {" "}
      </div>
           {" "}
      <div
        style={{
          color: "#636b91",
          fontSize: 14,
          marginTop: 8,
          whiteSpace: "pre-wrap",
        }}
      >
        {/*         {lead.notes}     {" "} */}
      </div>
         {" "}
    </div>
  );
};

// Kanban Column Component (droppable)
const KanbanColumn = ({
  stage,
  children,
}: {
  stage: string;
  children: React.ReactNode;
}) => {
  const { setNodeRef, isOver } = useDroppable({ id: stage });
  return (
    <div
      ref={setNodeRef}
      style={{
        ...kanbanColumnStyle,
        background: isOver ? "#fff" : "#fff",
      }}
    >
           {" "}
      <div style={kanbanHeaderStyle}>
                <span style={{ fontWeight: 600 }}>{stage}</span>       {" "}
        <span style={kanbanCountStyle}>{React.Children.count(children)}</span> 
           {" "}
      </div>
            {children}   {" "}
    </div>
  );
};

interface LeadFormData {
  name: string;
  email: string;
  phone: string;
  source: string;
  status: string;
  score: number;
  team_id?: number;
  user_id?: number;
  user_name: string;
  team_name: string;
  city: string;
  region: string;
}

// --- MAIN COMPONENT: LeadsListIndex ---
export function LeadsListIndex() {
  // State Hooks
  const [filter, setFilter] = useState("");
  const [isListView, setIsListView] = useState(true);
  const [source, setSource] = useState("All");
  const [assigned, setAssigned] = useState("All");
  const [sortBy, setSortBy] = useState("None");
  const [stageFilter, setStageFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [showAddLeadForm, setShowAddLeadForm] = useState(false);
  const [newLeadData, setNewLeadData] = useState<LeadFormData>({
    name: "",
    email: "",
    phone: "",
    source: "",
    status: "Open",
    score: 0,
    team_id: undefined,
    user_id: undefined,
    user_name: "",
    team_name: "",
    city: "",
    region: "",
  });

  const { data, isLoading, isError } = useList<Lead>({
    resource: "leads",
  });

  useEffect(() => {
    if (data?.data) {
      setLeads(data.data);
    }
  }, [data]);
  // useEffect(() => {
  //   fetch("http://localhost:8000/leads/")
  //     .then((res) => res.json())
  //     .then((data) => {
  //       console.log(data);
  //       setLeads(data);
  //     })
  //     .catch((err) => {
  //       // handle error, e.g. show notification
  //       setLeads([]);
  //     });
  // }, []);

  // Data for Select Inputs
  const stages = [
    "New",
    "Contacted",
    "Qualified",
    "Opportunity",
    "Deal / Won",
    "Lost",
  ];
  const statuses = ["Open", "In Progress", "Converted", "Lost"];
  const leadSources = [
    "Website",
    "Web Form",
    "Referral",
    "Cold Call",
    "Marketing Campaign",
    "Partnership Event",
    "Social Media",
    "Other",
  ];
  // const assignees = ["Sarah J.", "Michael B.", "Peter G.", "Lisa R."];
  const { data: assigneesData, isLoading: isLoadingAssignees } = useList({
    resource: "users?role=Sales%20Rep",
  });

  const assignees = assigneesData?.data?.map((user) => user) || [];
  const { data: teamsData, isLoading: isLoadingTeams } = useList({
    resource: "teams",
  });

  const teams = teamsData?.data?.map((team) => team) || [];
  const sources = ["All", ...leadSources];
  const assigneesFilter = [
    "All",
    ...Array.from(new Set(initialLeads.map((l) => l.user_name))),
  ];
  const sortOptions = ["None", "Name (A-Z)", "Name (Z-A)"]; // Filtering and Sorting Logic
  const getLeadsByStage = (stage: string) =>
    leads.filter((lead) => lead.status === stage);
  const filterLead = (
    lead: Lead,
    filter: string,
    source: string,
    assigned: string,
    stageFilter: string,
    statusFilter: string,
  ) => {
    let match =
      lead.name.toLowerCase().includes(filter) ||
      lead.source.toLowerCase().includes(filter) ||
      (lead.user_name ?? "").toLowerCase().includes(filter) ||
      lead.status.toLowerCase().includes(filter);
    if (source && source !== "All" && lead.source !== source) return false;
    if (assigned && assigned !== "All" && lead.user_name !== assigned)
      return false;
    if (stageFilter && stageFilter !== "All" && lead.status !== stageFilter)
      return false;
    if (statusFilter && statusFilter !== "All" && lead.status !== statusFilter)
      return false;

    return match;
  };
  const sortLeads = (leads: Lead[], sortBy: string): Lead[] => {
    const leadsCopy = [...leads];
    switch (sortBy) {
      case "Name (A-Z)":
        return leadsCopy.sort((a, b) => a.name.localeCompare(b.name));
      case "Name (Z-A)":
        return leadsCopy.sort((a, b) => b.name.localeCompare(a.name));
      default:
        return leadsCopy;
    }
  };

  let filteredLeads = leads.filter((lead) =>
    filterLead(
      lead,
      filter.toLowerCase(),
      source,
      assigned,
      stageFilter,
      statusFilter,
    ),
  );
  filteredLeads = sortLeads(filteredLeads, sortBy);

  // Dnd-kit sensors setup
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { distance: 5 } }),
  );

  // Dnd-kit Drag End Handler
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    const activeId = active.id;
    const overId = over?.id;
    if (overId && typeof overId === "string" && activeId !== overId) {
      setLeads((prevLeads) => {
        const newLeads = prevLeads.map((lead) =>
          lead.id === activeId ? { ...lead, status: overId } : lead,
        );
        return newLeads;
      });
    }
  };

  // Add Lead Form Handlers
  const handleAddLead = () => {
    setShowAddLeadForm(true);
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "user_id") {
      // Find the selected user object
      const selectedUser = assignees.find((a) => a.id === Number(value));
      setNewLeadData((prevData) => ({
        ...prevData,
        user_id: Number(value), 
        user_name: selectedUser ? selectedUser.name : "",
      }));
    } else if (name === "team_id") {
      // Find the selected user object
      const selectedTeam = teams.find((t) => t.id === Number(value));
      console.log("User\n", selectedTeam);
      setNewLeadData((prevData) => ({
        ...prevData,
        team_id: Number(value), 
        team_name: selectedTeam ? selectedTeam.name : "",
      }));
    } else {
      setNewLeadData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
    console.log(newLeadData);
  };

  const { 
    mutate: createLead, 
    isLoading: isLoadingCreate, 
    isError: isCreateError, 
    error 
  } = useCreate<Lead, HttpError>();

  
  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newId = leads.length > 0 ? Math.max(...leads.map((l) => l.id)) + 1 : 1;

    const newLead: Lead = {
      ...newLeadData,
      id: newId,
      score: Number(newLeadData.score) || 0,
      team_id: newLeadData.team_id ? Number(newLeadData.team_id) : undefined,
      user_id: newLeadData.user_id ? Number(newLeadData.user_id) : undefined,
    };

    createLead(
      {
        resource: "leads/create-lead",
        values: newLead,
      },
      {
        onSuccess: (data) => {
          console.log("Created Lead:", data?.data);
          setLeads((prevLeads) => [...prevLeads, data.data]);
          setShowAddLeadForm(false);

          // reset form
          setNewLeadData({
            name: "",
            email: "",
            phone: "",
            source: "",
            status: "Open",
            score: 0,
            team_id: undefined,
            user_id: undefined,
            user_name: "",
            team_name: "",
            city: "",
            region: "",
          });
        },
        onError: (err) => {
          console.error("Error creating lead:", err);
        },
      }
    );
  };

  return (
    <div
      style={{
        fontFamily: "Inter, sans-serif",
        minHeight: "100vh",
        padding: "28px",
      }}
    >
            {/* Header and Summary Boxes */}     {" "}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 0,
        }}
      >
               {" "}
        <h1
          style={{ fontSize: 25, fontWeight: 700, margin: 0, letterSpacing: 0 }}
        >
          Leads Management
        </h1>
               {" "}
        <div style={{ display: "flex", gap: 10 }}>
                   {" "}
          <button
            style={{
              display: "flex",
              alignItems: "center",
              gap: "7px",
              borderRadius: 6,
              border: isListView ? "none" : "1px solid #dbe4f3",
              background: isListView ? "#1467fa" : "#fff",
              color: isListView ? "#fff" : "#636b91",
              fontWeight: 500,
              fontSize: 15,
              padding: "8px 18px 8px 15px",
              cursor: "pointer",
              boxShadow: isListView ? "0 1px 6px 0 #d0e3fc" : "none",
              transition: "background 0.15s, color 0.15s",
            }}
            onClick={() => setIsListView(true)}
          >
                       {" "}
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
              <rect
                x="3"
                y="5"
                width="14"
                height="2.2"
                rx="1"
                fill={isListView ? "#fff" : "#a8b0c8"}
              />
              <rect
                x="3"
                y="9"
                width="14"
                height="2.2"
                rx="1"
                fill={isListView ? "#fff" : "#a8b0c8"}
              />
              <rect
                x="3"
                y="13"
                width="14"
                height="2.2"
                rx="1"
                fill={isListView ? "#fff" : "#a8b0c8"}
              />
            </svg>{" "}
            List View          {" "}
          </button>
                   {" "}
          <button
            style={{
              display: "flex",
              alignItems: "center",
              gap: "7px",
              borderRadius: 6,
              border: !isListView ? "none" : "1px solid #dbe4f3",
              background: !isListView ? "#1467fa" : "#fff",
              color: !isListView ? "#fff" : "#636b91",
              fontWeight: 500,
              fontSize: 15,
              padding: "8px 18px 8px 15px",
              cursor: "pointer",
              boxShadow: !isListView ? "0 1px 6px 0 #d0e3fc" : "none",
              transition: "background 0.15s, color 0.15s",
            }}
            onClick={() => setIsListView(false)}
          >
                       {" "}
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
              <rect
                x="3"
                y="5"
                width="4"
                height="4"
                rx="1"
                fill={!isListView ? "#fff" : "#a8b0c8"}
              />
              <rect
                x="9"
                y="5"
                width="4"
                height="4"
                rx="1"
                fill={!isListView ? "#fff" : "#a8b0c8"}
              />
              <rect
                x="15"
                y="5"
                width="2"
                height="4"
                rx="1"
                fill={!isListView ? "#fff" : "#a8b0c8"}
              />
              <rect
                x="3"
                y="11"
                width="4"
                height="4"
                rx="1"
                fill={!isListView ? "#fff" : "#a8b0c8"}
              />
              <rect
                x="9"
                y="11"
                width="4"
                height="4"
                rx="1"
                fill={!isListView ? "#fff" : "#a8b0c8"}
              />
              <rect
                x="15"
                y="11"
                width="2"
                height="4"
                rx="1"
                fill={!isListView ? "#fff" : "#a8b0c8"}
              />
            </svg>{" "}
            Kanban Board          {" "}
          </button>
                 {" "}
        </div>
             {" "}
      </div>
           {" "}
      <div style={{ display: "flex", gap: 24, margin: "30px 0 23px 0" }}>
               {" "}
        <div style={boxStyle}>
          <div style={{ color: "#888fac", fontSize: 13, marginBottom: 6 }}>
            Total Leads
          </div>
          <div style={{ fontWeight: 700, fontSize: 23 }}>{leads.length}</div>
          <div style={{ color: "#0bab64", fontSize: 12, marginTop: 4 }}>
            +5% from last month
          </div>
        </div>
               {" "}
        <div style={boxStyle}>
          <div style={{ color: "#888fac", fontSize: 13, marginBottom: 6 }}>
            New Leads This Month
          </div>
          <div style={{ fontWeight: 700, fontSize: 23 }}>
            {leads.filter((l) => l.status === "New").length}
          </div>
          <div style={{ color: "#0bab64", fontSize: 12, marginTop: 4 }}>
            Increased by 12%
          </div>
        </div>
               {" "}
        <div style={boxStyle}>
          <div style={{ color: "#888fac", fontSize: 13, marginBottom: 6 }}>
            Qualified Leads
          </div>
          <div style={{ fontWeight: 700, fontSize: 23 }}>
            {leads.filter((l) => l.status === "Qualified").length}
          </div>
          <div style={{ color: "#0bab64", fontSize: 12, marginTop: 4 }}>
            Up from last week
          </div>
        </div>
               {" "}
        <div style={boxStyle}>
          <div style={{ color: "#888fac", fontSize: 13, marginBottom: 6 }}>
            Conversion Rate
          </div>
          <div style={{ fontWeight: 700, fontSize: 23 }}>
            {leads.length > 0
              ? `${Math.round(
                  (leads.filter((l) => l.status === "Deal / Won").length /
                    leads.length) *
                    100,
                )}%`
              : "0%"}
          </div>
          <div style={{ color: "#fa6a69", fontSize: 12, marginTop: 4 }}>
            Target: 20%
          </div>
        </div>
               {" "}
      </div>
                 {" "}
      {showAddLeadForm && (
        <div style={formContainerStyle}>
                   {" "}
          <div style={formModalStyle}>
                       {" "}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "10px",
              }}
            >
                           {" "}
              <h2
                style={{
                  margin: 0,
                  fontSize: "18px",
                  fontWeight: 600,
                  color: "#2d334a",
                }}
              >
                Add New Lead
              </h2>
                           {" "}
              <button
                onClick={() => setShowAddLeadForm(false)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "24px",
                  cursor: "pointer",
                  color: "#a8b0c8",
                  lineHeight: 1,
                }}
              >
                {" "}
                &times;{" "}
              </button>
                         {" "}
            </div>
                       {" "}
            <form onSubmit={handleFormSubmit}>
                            {/* Lead Information Section */}             {" "}
              <div>
                               {" "}
                <h3
                  style={{
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "#49527a",
                    marginBottom: "8px",
                  }}
                >
                  Lead Information
                </h3>
                               {" "}
                <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                                   {" "}
                  <div
                    style={{ ...formGroupStyle, flexBasis: "calc(33% - 5px)" }}
                  >
                                       {" "}
                    <label style={labelStyle}>*Full Name</label>               
                       {" "}
                    <input
                      type="text"
                      name="name"
                      value={newLeadData.name}
                      onChange={handleFormChange}
                      required
                      style={inputStyle}
                    />
                                     {" "}
                  </div>
                                   {" "}
                  {/* <div
                    style={{ ...formGroupStyle, flexBasis: "calc(33% - 5px)" }}
                  >
                                        <label style={labelStyle}>*Title</label>
                                       {" "}
                    <input
                      type="text"
                      name="title"
                      // value={newLeadData.title}
                      onChange={handleFormChange}
                      required
                      style={inputStyle}
                    />
                                     {" "}
                  </div> */}
                                   {" "}
                  <div
                    style={{ ...formGroupStyle, flexBasis: "calc(33% - 5px)" }}
                  >
                                       {" "}
                    <label style={labelStyle}>*Email Address</label>           
                           {" "}
                    <input
                      type="email"
                      name="email"
                      value={newLeadData.email}
                      onChange={handleFormChange}
                      required
                      style={inputStyle}
                    />
                                     {" "}
                  </div>
                                   {" "}
                  <div
                    style={{ ...formGroupStyle, flexBasis: "calc(33% - 5px)" }}
                  >
                                       {" "}
                    <label style={labelStyle}>*Phone No.</label>               
                       {" "}
                    <input
                      type="tel"
                      name="phone"
                      value={newLeadData.phone}
                      onChange={handleFormChange}
                      required
                      style={inputStyle}
                    />
                                     {" "}
                  </div>
                                   {" "}
                  <div
                    style={{ ...formGroupStyle, flexBasis: "calc(33% - 5px)" }}
                  >
                                       {" "}
                    <label style={labelStyle}>*Company</label>                 
                     {" "}
                    <input
                      type="text"
                      name="company"
                      // value={newLeadData.company}
                      onChange={handleFormChange}
                      required
                      style={inputStyle}
                    />
                                     {" "}
                  </div>
                                   {" "}
                  {/* <div
                    style={{ ...formGroupStyle, flexBasis: "calc(33% - 5px)" }}
                  >
                                       {" "}
                    <label style={labelStyle}>*Designation</label>             
                         {" "}
                    <input
                      type="text"
                      name="designation"
                      // value={newLeadData.designation}
                      onChange={handleFormChange}
                      required
                      style={inputStyle}
                    />
                                     {" "}
                  </div> */}
                                 {" "}
                </div>
                             {" "}
              </div>
                            {/* Additional Information Section */}             {" "}
              <div>
                               {" "}
                <h3
                  style={{
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "#49527a",
                    marginBottom: "8px",
                  }}
                >
                  Additional Information
                </h3>
                               {" "}
                <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                                   {" "}
                  <div
                    style={{ ...formGroupStyle, flexBasis: "calc(33% - 5px)" }}
                  >
                                       {" "}
                    <label style={labelStyle}>*Lead Source</label>             
                         {" "}
                    <select
                      name="source"
                      value={newLeadData.source}
                      onChange={handleFormChange}
                      required
                      style={inputStyle}
                    >
                                           {" "}
                      <option value="">Select a source</option>                 
                         {" "}
                      {leadSources.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                                         {" "}
                    </select>
                                     {" "}
                  </div>
                                   {" "}
                  <div
                    style={{ ...formGroupStyle, flexBasis: "calc(33% - 5px)" }}
                  >
                                       {" "}
                    <label style={labelStyle}>*Lead Status</label>             
                         {" "}
                    <select
                      name="status"
                      value={newLeadData.status}
                      onChange={handleFormChange}
                      required
                      style={inputStyle}
                    >
                                           {" "}
                      {statuses.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                                         {" "}
                    </select>
                                     {" "}
                  </div>
                                   {" "}
                  <div
                    style={{ ...formGroupStyle, flexBasis: "calc(33% - 5px)" }}
                  >
                                       {" "}
                    <label style={labelStyle}>*Assigned To</label>             
                         {" "}
                    <select
                      name="user_id"
                      value={newLeadData.user_id}
                      onChange={handleFormChange}
                      required
                      style={inputStyle}
                    >
                                           {" "}
                      <option value="">Select an agent</option>                 
                         {" "}
                      {assignees.map((a) => (
                        <option key={"user-"+a.id} value={a.id}>
                          {a.name}
                        </option>
                      ))}
                                         {" "}
                    </select>
                                     {" "}
                  </div>
                                   {" "}
                  <div
                    style={{ ...formGroupStyle, flexBasis: "calc(33% - 5px)" }}
                  >
                                       {" "}
                    <label style={labelStyle}>*Team</label>             
                         {" "}
                    <select
                      name="team_id"
                      value={newLeadData.team_id}
                      onChange={handleFormChange}
                      required
                      style={inputStyle}
                    >
                                           {" "}
                      <option value="">Select a team</option>                 
                         {" "}
                      {teams.map((t) => (
                        <option key={"team-"+t.id} value={t.id}>
                          {t.name}
                        </option>
                      ))}
                                         {" "}
                    </select>
                                     {" "}
                  </div>
                                   {" "}
                  {/* <div
                    style={{ ...formGroupStyle, flexBasis: "calc(33% - 5px)" }}
                  >
                                       {" "}
                    <label style={labelStyle}>*Service Interest</label>         
                             {" "}
                    <input
                      type="text"
                      name="serviceInterest"
                      // value={newLeadData.serviceInterest}
                      onChange={handleFormChange}
                      required
                      style={inputStyle}
                    />
                                     {" "}
                  </div> */}
                                   {" "}
                  <div
                    style={{ ...formGroupStyle, flexBasis: "calc(33% - 5px)" }}
                  >
                                        <label style={labelStyle}>*City</label> 
                                     {" "}
                    <input
                      type="text"
                      name="city"
                      value={newLeadData.city}
                      onChange={handleFormChange}
                      required
                      style={inputStyle}
                    />
                                     {" "}
                  </div>
                                   {" "}
                  <div
                    style={{ ...formGroupStyle, flexBasis: "calc(33% - 5px)" }}
                  >
                                       {" "}
                    <label style={labelStyle}>*Region</label>
                    <input
                      type="text"
                      name="region"
                      value={newLeadData.region}
                      onChange={handleFormChange}
                      required
                      style={inputStyle}
                    />
                                     {" "}
                  </div>
                                   {" "}
                  {/* <div style={{ ...formGroupStyle, flexBasis: "100%" }}>
                                       {" "}
                    <label style={labelStyle}>*Description</label>             
                         {" "}
                    <textarea
                      name="description"
                      // value={newLeadData.description}
                      onChange={handleFormChange}
                      required
                      style={{
                        ...inputStyle,
                        minHeight: "80px",
                        resize: "vertical" as "vertical",
                      }}
                    />
                                     {" "}
                  </div> */}
                                 {" "}
                </div>
                             {" "}
              </div>
                           {" "}
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 10,
                  marginTop: 15,
                }}
              >
                               {" "}
                <button
                  type="button"
                  onClick={() => setShowAddLeadForm(false)}
                  style={cancelButton}
                >
                  Cancel
                </button>
                               {" "}
                <button type="submit" style={saveButton}>
                  Save
                </button>
                             {" "}
              </div>
                         {" "}
            </form>
                     {" "}
          </div>
                 {" "}
        </div>
      )}
                 {" "}
      {isListView ? (
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
                   {" "}
          <div style={{ padding: "16px 18px" }}>
                        {/* Combined Row 1: Heading, and Action buttons */}     
                 {" "}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 15,
              }}
            >
                           {" "}
              <div style={{ fontWeight: 600, fontSize: 18 }}>
                Leads Overview
              </div>
                           {" "}
              <div
                style={{
                  display: "flex",
                  gap: 10,
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                               {" "}
                <button
                  style={{
                    borderRadius: 4,
                    padding: "8px 16px",
                    background: "#1467fa",
                    color: "#fff",
                    border: "none",
                    fontWeight: 500,
                    fontSize: 15,
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                  }}
                  onClick={handleAddLead}
                >
                  Add New Lead
                </button>
                               {" "}
                <button
                  style={{
                    borderRadius: 4,
                    padding: "8px 16px",
                    background: "#f7fafd",
                    color: "#5167ad",
                    border: "1px solid #dbe4f3",
                    fontWeight: 500,
                    fontSize: 15,
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                  }}
                >
                  Export
                </button>
                             {" "}
              </div>
                         {" "}
            </div>
                        {/* Row 2: Filters and Search/Sort */}           {" "}
            <div
              style={{
                display: "flex",
                gap: 10,
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
                           {" "}
              <select
                value={source}
                onChange={(e) => setSource(e.target.value)}
                style={{
                  padding: "8px 12px",
                  border: "1px solid #dbe4f3",
                  borderRadius: 6,
                  background: "#ffffff",
                  fontSize: 15,
                  color: "#636b91",
                  width: 120,
                  minWidth: 80,
                }}
              >
                {sources.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt === "All" ? "Source" : opt}
                  </option>
                ))}
              </select>
                           {" "}
              <select
                value={assigned}
                onChange={(e) => setAssigned(e.target.value)}
                style={{
                  padding: "8px 12px",
                  border: "1px solid #dbe4f3",
                  borderRadius: 6,
                  background: "#ffffff",
                  fontSize: 15,
                  color: "#636b91",
                  width: 120,
                  minWidth: 80,
                }}
              >
                {assigneesFilter.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt === "All" ? "Assigned To" : opt}
                  </option>
                ))}
              </select>
                           {" "}
              <select
                value={stageFilter}
                onChange={(e) => setStageFilter(e.target.value)}
                style={{
                  padding: "8px 12px",
                  border: "1px solid #dbe4f3",
                  borderRadius: 6,
                  background: "#ffffff",
                  fontSize: 15,
                  color: "#636b91",
                  width: 120,
                  minWidth: 80,
                }}
              >
                <option value="All">Stage</option>
                {stages.map((stage) => (
                  <option key={stage} value={stage}>
                    {stage}
                  </option>
                ))}
              </select>
                           {" "}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{
                  padding: "8px 12px",
                  border: "1px solid #dbe4f3",
                  borderRadius: 6,
                  background: "#ffffff",
                  fontSize: 15,
                  color: "#636b91",
                  width: 120,
                  minWidth: 80,
                }}
              >
                <option value="All">Status</option>
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
                           {" "}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  padding: "8px 12px",
                  border: "1px solid #dbe4f3",
                  borderRadius: 6,
                  background: "#ffffff",
                  fontSize: 15,
                  color: "#636b91",
                  width: 90,
                  minWidth: 60,
                }}
              >
                {sortOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt === "None" ? "Sort" : opt}
                  </option>
                ))}
              </select>
                           {" "}
              <div
                style={{
                  position: "relative",
                  flexGrow: 1,
                  minWidth: 200,
                  maxWidth: 300,
                  display: "inline-block",
                }}
              >
                               {" "}
                <svg
                  style={{
                    position: "absolute",
                    left: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                  }}
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#636b91"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                                    <circle cx="11" cy="11" r="8"></circle>     
                             {" "}
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>           
                     {" "}
                </svg>
                               {" "}
                <input
                  placeholder="Filter leads..."
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  style={{
                    padding: "8px 12px 8px 36px",
                    borderRadius: 6,
                    border: "1px solid #dbe4f3",
                    fontSize: 15,
                    width: "100%",
                    boxSizing: "border-box",
                    background: "#ffffff",
                  }}
                />
                             {" "}
              </div>
                         {" "}
            </div>
                     {" "}
          </div>
                   {" "}
          <table
            style={{ width: "100%", borderCollapse: "collapse", fontSize: 15 }}
          >
                       {" "}
            <thead>
                           {" "}
              <tr style={{ background: "#f8fafd", color: "#7b849a" }}>
                               {" "}
                <th style={{ textAlign: "left", padding: "13px 18px" }}>
                  LEAD ID
                </th>
                               {" "}
                <th style={{ textAlign: "left", padding: "13px 8px" }}>NAME</th>
                               {" "}
                <th style={{ textAlign: "left", padding: "13px 8px" }}>
                  SOURCE
                </th>
                               {" "}
                <th style={{ textAlign: "left", padding: "13px 8px" }}>
                  ASSIGNED TO
                </th>
                               {" "}
                <th style={{ textAlign: "left", padding: "13px 8px" }}>TEAM</th>
                               {" "}
                <th style={{ textAlign: "left", padding: "13px 8px" }}>
                  STAGE
                </th>
                               {" "}
                <th style={{ textAlign: "left", padding: "13px 8px" }}>
                  EMAIL
                </th>
                             {" "}
                <th style={{ textAlign: "left", padding: "13px 8px" }}>
                  PHONE
                </th>
                             {" "}
                <th style={{ textAlign: "left", padding: "13px 8px" }}>
                  SCORE
                </th>
                             {" "}
              </tr>
                         {" "}
            </thead>
                       {" "}
            <tbody>
                           {" "}
              {filteredLeads.length > 0 ? (
                filteredLeads.map((lead) => (
                  <tr
                    key={lead.id}
                    style={{ borderBottom: "1px solid #f2f3f7" }}
                  >
                                       {" "}
                    <td style={{ padding: "14px 18px", fontWeight: 500 }}>
                      {lead.id}
                    </td>
                                       {" "}
                    <td style={{ padding: "14px 8px" }}>{lead.name}</td>       
                               {" "}
                    <td style={{ padding: "14px 8px" }}>{lead.source}</td>     
                                 {" "}
                    <td style={{ padding: "14px 8px" }}>
                      {lead.user_name ?? ""}
                    </td>
                                 {" "}
                    <td style={{ padding: "14px 8px" }}>
                      {lead.team_name ?? ""}
                    </td>
                               {" "}
                    <td style={{ padding: "14px 8px" }}>{lead.status}</td>     
                                 {" "}
                    <td style={{ padding: "14px 8px" }}>{lead.email}</td>       
                          <td style={{ padding: "14px 8px" }}>{lead.phone}</td> 
                               {" "}
                    <td style={{ padding: "14px 8px" }}>{lead.score}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    style={{
                      textAlign: "center",
                      padding: "32px 0",
                      color: "#9e9fad",
                      fontSize: 18,
                    }}
                  >
                    No leads found.
                  </td>
                </tr>
              )}
                         {" "}
            </tbody>
                     {" "}
          </table>
                 {" "}
        </div>
      ) : (
        <DndContext onDragEnd={handleDragEnd} sensors={sensors}>
                   {" "}
          <div
            style={{
              display: "flex",
              gap: "16px",
              overflowX: "auto",
              padding: "16px 0",
            }}
          >
                       {" "}
            {stages.map((stage) => (
              <KanbanColumn key={stage} stage={stage}>
                               {" "}
                {getLeadsByStage(stage).map((lead) => (
                  <KanbanCard key={lead.id} lead={lead} />
                ))}
                             {" "}
              </KanbanColumn>
            ))}
                     {" "}
          </div>
                 {" "}
        </DndContext>
      )}
         {" "}
    </div>
  );
}
export default LeadsListIndex;

type Lead = {
  id: number;
  name: string;
  email: string;
  phone?: string;
  source: string;
  status: string;
  score: number;
  team_id?: number;
  user_id?: number;
  user_name?: string;
  team_name?: string;
};
