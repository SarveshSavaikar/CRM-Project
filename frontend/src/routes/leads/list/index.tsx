import React, { useState } from "react";
import { DndContext, useSensors, useSensor, MouseSensor, TouchSensor, useDroppable, useDraggable, DragEndEvent } from "@dnd-kit/core";


const initialLeads = [
  {
    id: "L001",
    name: "Aidan Smith",
    source: "Website Form",
    assignedTo: "Sarah J.",
    stage: "New",
    notes: "Expressed interest in Enterprise plan after webinar.",
  },
  {
    id: "L002",
    name: "Olivia Chen",
    source: "Referral",
    assignedTo: "Michael B.",
    stage: "Qualified",
    notes: "Referred by current client 'Tech Solutions Inc.'",
  },
  {
    id: "L003",
    name: "Benjamin Davis",
    source: "Cold Call",
    assignedTo: "Sarah J.",
    stage: "Contacted",
    notes: "Followed up after initial cold call. Needs more info on pricing.",
  },
  {
    id: "L004",
    name: "Sophia Rodriguez",
    source: "Marketing Campaign",
    assignedTo: "Michael B.",
    stage: "New",
    notes: "Engaged with 'Spring Promo' email series.",
  },
  {
    id: "L005",
    name: "Ethan Miller",
    source: "Website Form",
    assignedTo: "Sarah J.",
    stage: "Lost",
    notes: "Not a good fit, budget constraints.",
  },
  {
    id: "L006",
    name: "Chloe Wilson",
    source: "Partnership Event",
    assignedTo: "Michael B.",
    stage: "Opportunity",
    notes: "Met at 'Future Tech Summit'. Interested in API integration.",
  },
  {
    id: "L007",
    name: "Daniel Garcia",
    source: "Website Form",
    assignedTo: "Sarah J.",
    stage: "New",
    notes: "Signed up for free trial. Exploring features.",
  },
  {
    id: "L008",
    name: "Mia Martinez",
    source: "Social Media",
    assignedTo: "Michael B.",
    stage: "Contacted",
    notes: "Reached out via LinkedIn. Looking for custom solution.",
  },
  {
    id: "L009",
    name: "Jason Mark",
    source: "Website Form",
    assignedTo: "Sarah J.",
    stage: "Deal / Won",
    notes: "Successfully closed the deal with a 1-year contract.",
  },
];


// Reusable components and styles
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
  height: 'fit-content' as 'fit-content',
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
  position: 'fixed' as 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: 'rgba(0,0,0,0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 100
};
const formModalStyle = {
  background: '#fff',
  padding: '28px',
  borderRadius: '12px',
  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
  width: '550px',
  maxWidth: '90%',
  display: 'flex',
  flexDirection: 'column' as 'column',
  gap: '20px',
};
const formGroupStyle = {
  marginBottom: '0',
  display: 'flex',
  flexDirection: 'column' as 'column',
  gap: '6px',
  flex: 1
};
const labelStyle = {
  fontWeight: 500,
  color: '#49527a',
  fontSize: '14px',
};
const inputStyle = {
  padding: '10px 14px',
  borderRadius: '8px',
  border: '1px solid #dbe4f3',
  fontSize: '15px',
  color: '#49527a',
  background: '#f7fafd',
  width: '100%',
  boxSizing: 'border-box' as 'border-box',
  transition: 'border-color 0.2s, box-shadow 0.2s',
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

// --------------------------- DND-KIT SPECIFIC COMPONENTS ---------------------------
const KanbanColumn = ({ stage, children }: { stage: string; children: React.ReactNode }) => {
  const { setNodeRef, isOver } = useDroppable({ id: stage });
  return (
    <div
      ref={setNodeRef}
      style={{
        ...kanbanColumnStyle,
        background: isOver ? "#e0e7ff" : "#f8fafd",
      }}
    >
      <div style={kanbanHeaderStyle}>
        <span style={{ fontWeight: 600 }}>{stage}</span>
        <span style={kanbanCountStyle}>{React.Children.count(children)}</span>
      </div>
      {children}
    </div>
  );
};
const KanbanCard = ({ lead }: { lead: typeof initialLeads[number] }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
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
      <div style={{ color: "#888fac", fontSize: 13, marginTop: 4 }}>
        Assigned to: {lead.assignedTo}
      </div>
      <div style={{ color: "#636b91", fontSize: 14, marginTop: 8, whiteSpace: "pre-wrap" }}>
        {lead.notes}
      </div>
    </div>
  );
};

// --------------------------- MAIN COMPONENT ---------------------------

export function LeadsListIndex() {
  const [filter, setFilter] = useState("");
  const [isListView, setIsListView] = useState(true); // <--- CHANGED FROM FALSE TO TRUE
  const [source, setSource] = useState("All");
  const [assigned, setAssigned] = useState("All");
  const [sortBy, setSortBy] = useState("None");

  const [leads, setLeads] = useState(initialLeads);
  const [showAddLeadForm, setShowAddLeadForm] = useState(false);
  const [newLeadData, setNewLeadData] = useState({
    name: "",
    source: "",
    assignedTo: "",
    stage: "New",
    notes: "",
  });

  const stages = [ "New", "Contacted", "Qualified", "Opportunity", "Deal / Won", "Lost" ];
  const getLeadsByStage = (stage: string) => leads.filter((lead) => lead.stage === stage);
  const sources = ["All", ...Array.from(new Set(initialLeads.map((l) => l.source)))];
  const assignees = ["All", ...Array.from(new Set(initialLeads.map((l) => l.assignedTo)))];
  const sortOptions = ["None", "Name (A-Z)", "Name (Z-A)", "Stage (A-Z)", "Stage (Z-A)"];
  
  // Filtering and Sorting logic (used in List View)
  const filterLead = (
    lead: typeof initialLeads[number],
    filter: string,
    source: string,
    assigned: string
  ) => {
    let match =
      lead.id.toLowerCase().includes(filter) ||
      lead.name.toLowerCase().includes(filter) ||
      lead.source.toLowerCase().includes(filter) ||
      lead.assignedTo.toLowerCase().includes(filter) ||
      lead.stage.toLowerCase().includes(filter) ||
      lead.notes.toLowerCase().includes(filter);

    if (source && source !== "All" && lead.source !== source) return false;
    if (assigned && assigned !== "All" && lead.assignedTo !== assigned) return false;
    return match;
  };
  const sortLeads = (leads: typeof initialLeads, sortBy: string): typeof initialLeads => {
    const leadsCopy = [...leads];
    switch (sortBy) {
      case "Name (A-Z)": return leadsCopy.sort((a, b) => a.name.localeCompare(b.name));
      case "Name (Z-A)": return leadsCopy.sort((a, b) => b.name.localeCompare(a.name));
      case "Stage (A-Z)": return leadsCopy.sort((a, b) => a.stage.localeCompare(b.stage));
      case "Stage (Z-A)": return leadsCopy.sort((a, b) => b.stage.localeCompare(a.stage));
      default: return leadsCopy;
    }
  };
  let filteredLeads = leads.filter((lead) => filterLead(lead, filter.toLowerCase(), source, assigned));
  filteredLeads = sortLeads(filteredLeads, sortBy);

  // Dnd-kit sensors setup
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { distance: 5 } })
  );

  // --- THIS IS THE LOGIC THAT HANDLES THE DRAG AND DROP STAGE UPDATE ---
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    const activeId = active.id;
    const overId = over?.id;
    if (overId && typeof overId === 'string' && activeId !== overId) {
      setLeads((prevLeads) => {
        const newLeads = prevLeads.map(lead =>
          lead.id === activeId ? { ...lead, stage: overId } : lead
        );
        return newLeads;
      });
    }
  };
  
  const handleAddLead = () => {
    setShowAddLeadForm(true);
  };
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewLeadData(prevData => ({ ...prevData, [name]: value }));
  };
  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newId = `L${(leads.length + 1).toString().padStart(3, '0')}`;
    const newLead = {
      ...newLeadData,
      id: newId,
    };
    setLeads(prevLeads => [...prevLeads, newLead]);
    setShowAddLeadForm(false);
    setNewLeadData({
      name: "",
      source: "",
      assignedTo: "",
      stage: "New",
      notes: "",
    });
  };


  return (
    <div style={{ fontFamily: "Inter, sans-serif", background: "#f4f6fb", minHeight: "100vh", padding: "28px" }}>
      {/* Header and Summary Boxes */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 0 }}>
        <h1 style={{ fontSize: 25, fontWeight: 700, margin: 0, letterSpacing: 0 }}>Leads Management</h1>
        <div style={{ display: "flex", gap: 10 }}>
          <button style={{ display: "flex", alignItems: "center", gap: "7px", borderRadius: 6, border: isListView ? "none" : "1px solid #dbe4f3", background: isListView ? "#1467fa" : "#fff", color: isListView ? "#fff" : "#636b91", fontWeight: 500, fontSize: 15, padding: "8px 18px 8px 15px", cursor: "pointer", boxShadow: isListView ? "0 1px 6px 0 #d0e3fc" : "none", transition: "background 0.15s, color 0.15s", }} onClick={() => setIsListView(true)}>
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none"><rect x="3" y="5" width="14" height="2.2" rx="1" fill={isListView ? "#fff" : "#a8b0c8"} /><rect x="3" y="9" width="14" height="2.2" rx="1" fill={isListView ? "#fff" : "#a8b0c8"} /><rect x="3" y="13" width="14" height="2.2" rx="1" fill={isListView ? "#fff" : "#a8b0c8"} /></svg> List View
          </button>
          <button style={{ display: "flex", alignItems: "center", gap: "7px", borderRadius: 6, border: !isListView ? "none" : "1px solid #dbe4f3", background: !isListView ? "#1467fa" : "#fff", color: !isListView ? "#fff" : "#636b91", fontWeight: 500, fontSize: 15, padding: "8px 18px 8px 15px", cursor: "pointer", boxShadow: !isListView ? "0 1px 6px 0 #d0e3fc" : "none", transition: "background 0.15s, color 0.15s", }} onClick={() => setIsListView(false)}>
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none"><rect x="3" y="5" width="4" height="4" rx="1" fill={!isListView ? "#fff" : "#a8b0c8"} /><rect x="9" y="5" width="4" height="4" rx="1" fill={!isListView ? "#fff" : "#a8b0c8"} /><rect x="15" y="5" width="2" height="4" rx="1" fill={!isListView ? "#fff" : "#a8b0c8"} /><rect x="3" y="11" width="4" height="4" rx="1" fill={!isListView ? "#fff" : "#a8b0c8"} /><rect x="9" y="11" width="4" height="4" rx="1" fill={!isListView ? "#fff" : "#a8b0c8"} /><rect x="15" y="11" width="2" height="4" rx="1" fill={!isListView ? "#fff" : "#a8b0c8"} /></svg> Kanban Board

          </button>
        </div>
      </div>

      <div style={{ display: "flex", gap: 24, margin: "30px 0 23px 0" }}>
        <div style={boxStyle}><div style={{ color: "#888fac", fontSize: 13, marginBottom: 6 }}>Total Leads</div><div style={{ fontWeight: 700, fontSize: 23 }}>{leads.length}</div><div style={{ color: "#0bab64", fontSize: 12, marginTop: 4 }}>+5% from last month</div></div>
        <div style={boxStyle}><div style={{ color: "#888fac", fontSize: 13, marginBottom: 6 }}>New Leads This Month</div><div style={{ fontWeight: 700, fontSize: 23 }}>{leads.filter(l => l.stage === "New").length}</div><div style={{ color: "#0bab64", fontSize: 12, marginTop: 4 }}>Increased by 12%</div></div>
        <div style={boxStyle}><div style={{ color: "#888fac", fontSize: 13, marginBottom: 6 }}>Qualified Leads</div><div style={{ fontWeight: 700, fontSize: 23 }}>{leads.filter((l) => l.stage === "Qualified").length}</div><div style={{ color: "#0bab64", fontSize: 12, marginTop: 4 }}>Up from last week</div></div>
        <div style={boxStyle}><div style={{ color: "#888fac", fontSize: 13, marginBottom: 6 }}>Conversion Rate</div><div style={{ fontWeight: 700, fontSize: 23 }}>{leads.length > 0 ? `${Math.round((leads.filter((l) => l.stage === "Deal / Won").length / leads.length) * 100)}%` : "0%"}</div><div style={{ color: "#fa6a69", fontSize: 12, marginTop: 4 }}>Target: 20%</div></div>
      </div>
      
      {showAddLeadForm && (
        <div style={formContainerStyle}>
          <div style={formModalStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 600, color: '#2d334a' }}>Add New Lead</h2>
                <button onClick={() => setShowAddLeadForm(false)} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#a8b0c8', lineHeight: 1, }}> &times; </button>
            </div>
            <form onSubmit={handleFormSubmit}>
              <div style={{ display: 'flex', gap: 20 }}>
                <div style={formGroupStyle}><label style={labelStyle}>Name</label><input type="text" name="name" value={newLeadData.name} onChange={handleFormChange} required style={inputStyle} /></div>
                <div style={formGroupStyle}><label style={labelStyle}>Source</label><input type="text" name="source" value={newLeadData.source} onChange={handleFormChange} required style={inputStyle} /></div>
              </div>
              <div style={formGroupStyle}><label style={labelStyle}>Assigned To</label><input type="text" name="assignedTo" value={newLeadData.assignedTo} onChange={handleFormChange} required style={inputStyle} /></div>
              <div style={formGroupStyle}><label style={labelStyle}>Stage</label><select name="stage" value={newLeadData.stage} onChange={handleFormChange} style={inputStyle}>{stages.map(s => <option key={s} value={s}>{s}</option>)}</select></div>
              <div style={formGroupStyle}><label style={labelStyle}>Notes</label><textarea name="notes" value={newLeadData.notes} onChange={handleFormChange} style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' as 'vertical' }} /></div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 10 }}><button type="button" onClick={() => setShowAddLeadForm(false)} style={cancelButton}>Cancel</button><button type="submit" style={saveButton}>Add Lead</button></div>
            </form>
          </div>
        </div>
      )}

      
      {isListView ? (
        <div style={{ background: "#fff", borderRadius: 10, boxShadow: "0 1px 6px #f0f1f3", padding: 0, marginTop: 0, overflowX: "auto" }}>
          <div style={{ padding: "16px 18px" }}><div style={{ fontWeight: 600, fontSize: 18, marginBottom: 12 }}>Leads Overview</div>
            <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
              <input placeholder="Filter leads..." value={filter} onChange={(e) => setFilter(e.target.value)} style={{ padding: "8px 12px", borderRadius: 6, border: "1px solid #dbe4f3", fontSize: 15, width: 165, background: "#ffffff" }} />
              <select value={source} onChange={(e) => setSource(e.target.value)} style={{ padding: "8px 12px", border: "1px solid #dbe4f3", borderRadius: 6, background: "#ffffff", fontSize: 15, color: "#636b91", width: 120, minWidth: 80 }}>{sources.map((opt) => (<option key={opt} value={opt}>{opt === "All" ? "Source" : opt}</option>))}</select>
              <select value={assigned} onChange={(e) => setAssigned(e.target.value)} style={{ padding: "8px 12px", border: "1px solid #dbe4f3", borderRadius: 6, background: "#ffffff", fontSize: 15, color: "#636b91", width: 120, minWidth: 80 }}>{assignees.map((opt) => (<option key={opt} value={opt}>{opt === "All" ? "Assigned To" : opt}</option>))}</select>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={{ padding: "8px 12px", border: "1px solid #dbe4f3", borderRadius: 6, background: "#ffffff", fontSize: 15, color: "#636b91", width: 90, minWidth: 60 }}>{sortOptions.map((opt) => (<option key={opt} value={opt}>{opt === "None" ? "Sort" : opt}</option>))}</select>
              <div style={{ flex: 1 }} />
              <button style={{ borderRadius: 4, padding: "8px 16px", background: "#1467fa", color: "#fff", border: "none", fontWeight: 500, fontSize: 15, marginRight: 8, cursor: "pointer", whiteSpace: "nowrap" }} onClick={handleAddLead}>Add New Lead</button>
              <button style={{ borderRadius: 4, padding: "8px 16px", background: "#f7fafd", color: "#5167ad", border: "1px solid #dbe4f3", fontWeight: 500, fontSize: 15, cursor: "pointer", whiteSpace: "nowrap" }}>Export</button>
            </div>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 15 }}>

            <thead>
              <tr style={{ background: "#f8fafd", color: "#7b849a" }}>
                <th style={{ textAlign: "left", padding: "13px 18px" }}>LEAD ID</th>
                <th style={{ textAlign: "left", padding: "13px 8px" }}>NAME</th>
                <th style={{ textAlign: "left", padding: "13px 8px" }}>SOURCE</th>
                <th style={{ textAlign: "left", padding: "13px 8px" }}>ASSIGNED TO</th>
                <th style={{ textAlign: "left", padding: "13px 8px" }}>STAGE</th>
                <th style={{ textAlign: "left", padding: "13px 8px" }}>NOTES</th>

              </tr>
            </thead>
            <tbody>
              {filteredLeads.length > 0 ? (
                filteredLeads.map((lead) => (
                  <tr key={lead.id} style={{ borderBottom: "1px solid #f2f3f7" }}>
                    <td style={{ padding: "14px 18px", fontWeight: 500 }}>{lead.id}</td>
                    <td style={{ padding: "14px 8px" }}>{lead.name}</td>
                    <td style={{ padding: "14px 8px" }}>{lead.source}</td>
                    <td style={{ padding: "14px 8px" }}>{lead.assignedTo}</td>
                    <td style={{ padding: "14px 8px" }}>{lead.stage}</td>
                    <td style={{ padding: "14px 8px", maxWidth: 280 }}>{lead.notes}</td>

                  </tr>
                ))
              ) : (
                <tr><td colSpan={6} style={{ textAlign: "center", padding: "32px 0", color: "#9e9fad", fontSize: 18 }}>No leads found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (

        <DndContext onDragEnd={handleDragEnd} sensors={sensors}>
          <div style={{ display: "flex", gap: "16px", overflowX: "auto", padding: "16px 0" }}>
            {stages.map((stage) => (
              <KanbanColumn key={stage} stage={stage}>
                {getLeadsByStage(stage).map((lead) => (
                  <KanbanCard key={lead.id} lead={lead} />
                ))}
              </KanbanColumn>
            ))}
          </div>
        </DndContext>

      )}
    </div>
  );
}
export default LeadsListIndex;