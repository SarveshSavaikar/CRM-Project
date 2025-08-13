import React, { useState } from "react";

// Dummy Leads Data
const initialLeads = [
  {
    id: 'L001',
    name: 'Aidan Smith',
    source: 'Website Form',
    status: { label: 'New', color: '#2979ff' },
    assignedTo: 'Sarah J.',
    stage: 'Discovery',
    notes: 'Expressed interest in Enterprise plan after webinar.',
  },
  {
    id: 'L002',
    name: 'Olivia Chen',
    source: 'Referral',
    status: { label: 'Qualified', color: '#34a853' },
    assignedTo: 'Michael B.',
    stage: 'Proposal',
    notes: "Referred by current client 'Tech Solutions Inc.'",
  },
  {
    id: 'L003',
    name: 'Benjamin Davis',
    source: 'Cold Call',
    status: { label: 'Contacted', color: '#4285f4' },
    assignedTo: 'Sarah J.',
    stage: 'Negotiation',
    notes: 'Followed up after initial cold call. Needs more info on pricing.',
  },
  {
    id: 'L004',
    name: 'Sophia Rodriguez',
    source: 'Marketing Campaign',
    status: { label: 'New', color: '#2979ff' },
    assignedTo: 'Michael B.',
    stage: 'Discovery',
    notes: "Engaged with 'Spring Promo' email series.",
  },
  {
    id: 'L005',
    name: 'Ethan Miller',
    source: 'Website Form',
    status: { label: 'Disqualified', color: '#ea4335' },
    assignedTo: 'Sarah J.',
    stage: 'Closed Lost',
    notes: 'Not a good fit, budget constraints.',
  },
  {
    id: 'L006',
    name: 'Chloe Wilson',
    source: 'Partnership Event',
    status: { label: 'Qualified', color: '#34a853' },
    assignedTo: 'Michael B.',
    stage: 'Proposal',
    notes: "Met at 'Future Tech Summit'. Interested in API integration.",
  },
  {
    id: 'L007',
    name: 'Daniel Garcia',
    source: 'Website Form',
    status: { label: 'New', color: '#2979ff' },
    assignedTo: 'Sarah J.',
    stage: 'Discovery',
    notes: 'Signed up for free trial. Exploring features.',
  },
  {
    id: 'L008',
    name: 'Mia Martinez',
    source: 'Social Media',
    status: { label: 'Contacted', color: '#4285f4' },
    assignedTo: 'Michael B.',
    stage: 'Negotiation',
    notes: 'Reached out via LinkedIn. Looking for custom solution.',
  },
];

// Status pill
export function Pill({ color, label }: { color: string; label: string }) {
  return (
    <span
      style={{
        background: color,
        color: '#fff',
        borderRadius: 14,
        fontSize: 13,
        padding: '2px 14px',
        fontWeight: 500,
        marginLeft: 4,
        lineHeight: 1.4,
        display: 'inline-block'
      }}
    >
      {label}
    </span>
  );
}

export const boxStyle: React.CSSProperties = {
  borderRadius: 8,
  padding: 16,
  background: '#fff',
  boxShadow: '0 1px 6px 0 #f0f1f3',
  minWidth: 185,
  flex: 1,
};

// Filtering
const filterLead = (
  lead: typeof initialLeads[number],
  filter: string,
  source: string,
  status: string,
  assigned: string
) => {
  let match =
    lead.id.toLowerCase().includes(filter) ||
    lead.name.toLowerCase().includes(filter) ||
    lead.source.toLowerCase().includes(filter) ||
    lead.assignedTo.toLowerCase().includes(filter) ||
    lead.stage.toLowerCase().includes(filter) ||
    lead.notes.toLowerCase().includes(filter) ||
    lead.status.label.toLowerCase().includes(filter);

  if (source && source !== "All" && lead.source !== source) return false;
  if (status && status !== "All" && lead.status.label !== status) return false;
  if (assigned && assigned !== "All" && lead.assignedTo !== assigned) return false;

  return match;
};

const sources = ["All", ...Array.from(new Set(initialLeads.map(l => l.source)))];
const statuses = ["All", ...Array.from(new Set(initialLeads.map(l => l.status.label)))];
const assignees = ["All", ...Array.from(new Set(initialLeads.map(l => l.assignedTo)))];
const sortOptions = [
  "None",
  "Name (A-Z)",
  "Name (Z-A)",
  "Stage (A-Z)",
  "Stage (Z-A)",
];

const sortLeads = (
  leads: typeof initialLeads,
  sortBy: string
): typeof initialLeads => {
  const leadsCopy = [...leads];
  switch (sortBy) {
    case "Name (A-Z)":
      return leadsCopy.sort((a, b) => a.name.localeCompare(b.name));
    case "Name (Z-A)":
      return leadsCopy.sort((a, b) => b.name.localeCompare(a.name));
    case "Stage (A-Z)":
      return leadsCopy.sort((a, b) => a.stage.localeCompare(b.stage));
    case "Stage (Z-A)":
      return leadsCopy.sort((a, b) => b.stage.localeCompare(a.stage));
    default:
      return leadsCopy;
  }
};

export function LeadsListIndex() {
  const [filter, setFilter] = useState("");
  const [isListView, setIsListView] = useState(true);
  const [source, setSource] = useState("All");
  const [status, setStatus] = useState("All");
  const [assigned, setAssigned] = useState("All");
  const [sortBy, setSortBy] = useState("None");

  let filteredLeads = initialLeads.filter((lead) =>
    filterLead(lead, filter.toLowerCase(), source, status, assigned),
  );
  filteredLeads = sortLeads(filteredLeads, sortBy);

  return (
    <div
      style={{
        fontFamily: 'Inter, sans-serif',
        background: '#f4f6fb',
        minHeight: '100vh',
        padding: '28px',
      }}
    >
      {/* Header + View Toggles */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 0,
      }}>
        <h1
          style={{
            fontSize: 25,
            fontWeight: 700,
            margin: 0,
            letterSpacing: 0,
          }}
        >
          Leads Management
        </h1>
        <div style={{ display: "flex", gap: 10 }}>
          <button
            style={{
              display: "flex",
              alignItems: "center",
              gap: '7px',
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
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
              <rect x="3" y="5" width="14" height="2.2" rx="1" fill={isListView ? "#fff" : "#a8b0c8"} />
              <rect x="3" y="9" width="14" height="2.2" rx="1" fill={isListView ? "#fff" : "#a8b0c8"} />
              <rect x="3" y="13" width="14" height="2.2" rx="1" fill={isListView ? "#fff" : "#a8b0c8"} />
            </svg>
            List View
          </button>
          <button
            style={{
              display: "flex",
              alignItems: "center",
              gap: '7px',
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
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
              <rect x="3" y="5" width="4" height="4" rx="1" fill={!isListView ? "#fff" : "#a8b0c8"} />
              <rect x="9" y="5" width="4" height="4" rx="1" fill={!isListView ? "#fff" : "#a8b0c8"} />
              <rect x="15" y="5" width="2" height="4" rx="1" fill={!isListView ? "#fff" : "#a8b0c8"} />
              <rect x="3" y="11" width="4" height="4" rx="1" fill={!isListView ? "#fff" : "#a8b0c8"} />
              <rect x="9" y="11" width="4" height="4" rx="1" fill={!isListView ? "#fff" : "#a8b0c8"} />
              <rect x="15" y="11" width="2" height="4" rx="1" fill={!isListView ? "#fff" : "#a8b0c8"} />
            </svg>
            Kanban Board
          </button>
        </div>
      </div>

      {/* Stats Ribbon */}
      <div style={{ display: 'flex', gap: 24, margin: '30px 0 23px 0' }}>
        <div style={boxStyle}>
          <div style={{ color: '#888fac', fontSize: 13, marginBottom: 6 }}>
            Total Leads
          </div>
          <div style={{ fontWeight: 700, fontSize: 23 }}>{initialLeads.length}</div>
          <div style={{ color: '#0bab64', fontSize: 12, marginTop: 4 }}>
            +5% from last month
          </div>
        </div>
        <div style={boxStyle}>
          <div style={{ color: '#888fac', fontSize: 13, marginBottom: 6 }}>
            New Leads This Month
          </div>
          <div style={{ fontWeight: 700, fontSize: 23 }}>7</div>
          <div style={{ color: '#0bab64', fontSize: 12, marginTop: 4 }}>
            Increased by 12%
          </div>
        </div>
        <div style={boxStyle}>
          <div style={{ color: '#888fac', fontSize: 13, marginBottom: 6 }}>
            Qualified Leads
          </div>
          <div style={{ fontWeight: 700, fontSize: 23 }}>
            {initialLeads.filter((l) => l.status.label === "Qualified").length}
          </div>
          <div style={{ color: '#0bab64', fontSize: 12, marginTop: 4 }}>
            Up from last week
          </div>
        </div>
        <div style={boxStyle}>
          <div style={{ color: '#888fac', fontSize: 13, marginBottom: 6 }}>
            Conversion Rate
          </div>
          <div style={{ fontWeight: 700, fontSize: 23 }}>
            {Math.round(
              (initialLeads.filter((l) => l.status.label === "Qualified").length /
                initialLeads.length) *
                100
            )}%
          </div>
          <div style={{ color: '#fa6a69', fontSize: 12, marginTop: 4 }}>
            Target: 20%
          </div>
        </div>
      </div>

      {isListView ? (
        <div
          style={{
            background: '#fff',
            borderRadius: 10,
            boxShadow: '0 1px 6px #f0f1f3',
            padding: 0,
            marginTop: 0,
            overflowX: 'auto',
          }}
        >
          {/* Unified Header and Filter/Action Bar */}
          <div
            style={{
              padding: "16px 18px",
            }}
          >
            <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 12 }}>Leads Overview</div>
            
            {/* Filter and Action Buttons */}
            <div
              style={{
                display: "flex",
                gap: 10,
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <input
                placeholder="Filter leads..."
                value={filter}
                onChange={e => setFilter(e.target.value)}
                style={{
                  padding: '8px 12px',
                  borderRadius: 6,
                  border: '1px solid #dbe4f3',
                  fontSize: 15,
                  width: 165,
                  background: "#ffffff"
                }}
              />
              <select
                value={source}
                onChange={e => setSource(e.target.value)}
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
                {sources.map(opt =>
                  <option key={opt} value={opt}>{opt === "All" ? "Source" : opt}</option>
                )}
              </select>
              <select
                value={status}
                onChange={e => setStatus(e.target.value)}
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
                {statuses.map(opt =>
                  <option key={opt} value={opt}>{opt === "All" ? "Status" : opt}</option>
                )}
              </select>
              <select
                value={assigned}
                onChange={e => setAssigned(e.target.value)}
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
                {assignees.map(opt =>
                  <option key={opt} value={opt}>{opt === "All" ? "Assigned To" : opt}</option>
                )}
              </select>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
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
                {sortOptions.map(opt => <option key={opt} value={opt}>{opt === "None" ? "Sort" : opt}</option>)}
              </select>

              <div style={{ flex: 1 }} />

              <button
                style={{
                  borderRadius: 4,
                  padding: '8px 16px',
                  background: '#1467fa',
                  color: '#fff',
                  border: 'none',
                  fontWeight: 500,
                  fontSize: 15,
                  marginRight: 8,
                  cursor: "pointer",
                  whiteSpace: "nowrap"
                }}
              >
                Add New Lead
              </button>
              <button
                style={{
                  borderRadius: 4,
                  padding: '8px 16px',
                  background: '#f7fafd',
                  color: '#5167ad',
                  border: '1px solid #dbe4f3',
                  fontWeight: 500,
                  fontSize: 15,
                  cursor: "pointer",
                  whiteSpace: "nowrap"
                }}
              >
                Export
              </button>
            </div>
          </div>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: 15,
            }}
          >
            <thead>
              <tr style={{ background: '#f8fafd', color: '#7b849a' }}>
                <th style={{ textAlign: 'left', padding: '13px 18px' }}>LEAD ID</th>
                <th style={{ textAlign: 'left', padding: '13px 8px' }}>NAME</th>
                <th style={{ textAlign: 'left', padding: '13px 8px' }}>SOURCE</th>
                <th style={{ textAlign: 'left', padding: '13px 8px' }}>STATUS</th>
                <th style={{ textAlign: 'left', padding: '13px 8px' }}>ASSIGNED TO</th>
                <th style={{ textAlign: 'left', padding: '13px 8px' }}>STAGE</th>
                <th style={{ textAlign: 'left', padding: '13px 8px' }}>NOTES</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.length > 0 ? (
                filteredLeads.map((lead) => (
                  <tr key={lead.id} style={{ borderBottom: '1px solid #f2f3f7' }}>
                    <td style={{ padding: '14px 18px', fontWeight: 500 }}>{lead.id}</td>
                    <td style={{ padding: '14px 8px' }}>{lead.name}</td>
                    <td style={{ padding: '14px 8px' }}>{lead.source}</td>
                    <td style={{ padding: '14px 8px' }}>
                      <Pill color={lead.status.color} label={lead.status.label} />
                    </td>
                    <td style={{ padding: '14px 8px' }}>{lead.assignedTo}</td>
                    <td style={{ padding: '14px 8px' }}>{lead.stage}</td>
                    <td style={{ padding: '14px 8px', maxWidth: 280 }}>{lead.notes}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} style={{ textAlign: "center", padding: "32px 0", color: "#9e9fad", fontSize: 18 }}>
                    No leads found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div
          style={{
            background: '#fff',
            borderRadius: 10,
            boxShadow: '0 1px 6px #f0f1f3',
            padding: 36,
            marginTop: 0,
            height: 330,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 22,
            color: "#969bb2",
          }}
        >
          Kanban Board view coming soon.
        </div>
      )}
    </div>
  );
}

export default LeadsListIndex;