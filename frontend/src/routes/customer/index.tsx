import React, { useState, useMemo } from "react";
import { Table, Card, Select, Row, Col, Input } from "antd";
import {
  PieChart, Pie, Cell, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend,
} from "recharts";

const { Option } = Select;
const { Search } = Input;

// Extended sample customer data
const customers = [
  { id: 1, name: "Acme Corp", stage: "Prospecting", revenue: 50000, lastInteraction: "2025-08-01" },
  { id: 2, name: "Beta LLC", stage: "Negotiation", revenue: 75000, lastInteraction: "2025-07-25" },
  { id: 3, name: "Gamma Inc", stage: "Closed Won", revenue: 120000, lastInteraction: "2025-06-30" },
  { id: 4, name: "Delta Ltd", stage: "Closed Lost", revenue: 0, lastInteraction: "2025-06-15" },
  { id: 5, name: "Epsilon Ltd", stage: "Prospecting", revenue: 43000, lastInteraction: "2025-08-10" },
  { id: 6, name: "Zeta Inc", stage: "Negotiation", revenue: 67000, lastInteraction: "2025-07-30" },
  { id: 7, name: "Eta Solutions", stage: "Closed Won", revenue: 98000, lastInteraction: "2025-07-20" },
  { id: 8, name: "Theta Co", stage: "Prospecting", revenue: 21000, lastInteraction: "2025-08-05" },
];

// Lifecycle distribution data
const lifecycleData = [
  { name: "Prospecting", value: 30 },
  { name: "Negotiation", value: 25 },
  { name: "Closed Won", value: 35 },
  { name: "Closed Lost", value: 10 },
];

// Retention vs churn data
const retentionDataSample = {
  Q1: [
    { month: "Jan", retention: 80, churn: 20 },
    { month: "Feb", retention: 75, churn: 25 },
    { month: "Mar", retention: 70, churn: 30 },
  ],
  Q2: [
    { month: "Apr", retention: 85, churn: 15 },
    { month: "May", retention: 78, churn: 22 },
    { month: "Jun", retention: 73, churn: 27 },
  ],
  Q3: [
    { month: "Jul", retention: 82, churn: 18 },
    { month: "Aug", retention: 76, churn: 24 },
    { month: "Sep", retention: 70, churn: 30 },
  ],
  Q4: [
    { month: "Oct", retention: 88, churn: 12 },
    { month: "Nov", retention: 80, churn: 20 },
    { month: "Dec", retention: 75, churn: 25 },
  ],
} as const;

type QuarterKey = keyof typeof retentionDataSample;

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export const CustomersPage: React.FC = () => {
  const [selectedQuarter, setSelectedQuarter] = useState<QuarterKey>("Q1");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedStage, setSelectedStage] = useState<string | undefined>(undefined);

  const retentionData = useMemo(() => {
    return [...retentionDataSample[selectedQuarter]];
  }, [selectedQuarter]);

  const filteredCustomers = useMemo(() => {
    let filtered = customers;

    if (searchQuery) {
      filtered = filtered.filter(customer =>
        customer.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedStage) {
      filtered = filtered.filter(customer => customer.stage === selectedStage);
    }

    return filtered;
  }, [searchQuery, selectedStage]);

  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Stage", dataIndex: "stage", key: "stage" },
    {
      title: "Revenue",
      dataIndex: "revenue",
      key: "revenue",
      render: (val: number) => `$${val.toLocaleString()}`,
    },
    { title: "Last Interaction", dataIndex: "lastInteraction", key: "lastInteraction" },
  ];

  const stageOptions = [
    "All",
    ...new Set(customers.map(customer => customer.stage)),
  ].map(stage => ({
    label: stage,
    value: stage === "All" ? undefined : stage,
  }));

  return (
    <div style={{ padding: 24 }}>
      {/* Customer List */}
      <Card
        title="Customer List"
        style={{ marginBottom: 24 }}
        extra={
          <div style={{ display: 'flex', gap: 8 }}>
            <Select
              style={{ width: 150 }}
              placeholder="Filter by Stage"
              onChange={(value) => setSelectedStage(value)}
              value={selectedStage}
              allowClear
            >
              {stageOptions.map(option => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
            <Search
              placeholder="Search customers"
              onSearch={setSearchQuery}
              style={{ width: 200 }}
              enterButton
            />
          </div>
        }
      >
        <Table
          dataSource={filteredCustomers}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 5 }}
        />
      </Card>

      <Row gutter={[24, 24]}>
        {/* Lifecycle Distribution */}
        <Col xs={24} lg={12}>
          <Card title="Lifecycle Distribution" style={{ height: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <PieChart width={400} height={300}>
                <Pie
                  data={lifecycleData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {lifecycleData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </div>
          </Card>
        </Col>

        {/* Retention vs Churn */}
        <Col xs={24} lg={12}>
          <Card
            title="Retention vs Churn"
            style={{ height: '100%' }}
            extra={
              <Select
                value={selectedQuarter}
                style={{ width: 120 }}
                onChange={(value: QuarterKey) => setSelectedQuarter(value)}
              >
                <Option value="Q1">Q1</Option>
                <Option value="Q2">Q2</Option>
                <Option value="Q3">Q3</Option>
                <Option value="Q4">Q4</Option>
              </Select>
            }
          >
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <BarChart width={400} height={300} data={retentionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="retention" fill="#0088FE" />
                <Bar dataKey="churn" fill="#FF8042" />
              </BarChart>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default CustomersPage;