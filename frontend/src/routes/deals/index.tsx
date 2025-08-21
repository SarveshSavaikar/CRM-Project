import React, { useState, useMemo, CSSProperties, useEffect } from "react";
import { Card, Modal, Form, Input, Button, Table, Select } from "antd";
import {
    DndContext,
    closestCorners,
    useSensors,
    useSensor,
    PointerSensor,
    DragEndEvent,
    useDroppable,
    DragStartEvent,
    DragOverlay,
} from "@dnd-kit/core";
import {
    SortableContext,
    arrayMove,
    useSortable,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { PlusCircleOutlined } from "@ant-design/icons";

// --- Types ---
type Deal = {
    id: string;
    dealName: string;
    linkedLead: string;
    value: string;
    closeDate: string;
    salesRep: string;
    stageId: string; // Added to simplify deal updates
};

type Stage = {
    id: string;
    title: string;
    deals: Deal[];
};

// --- Initial Data ---
const initialDeals: Deal[] = [
    { id: "deal-1", dealName: "Tech Solutions Project", linkedLead: "Innovate Corp", value: "$50,000", closeDate: "2024-07-15", salesRep: "John Doe", stageId: "stage-1" },
    { id: "deal-2", dealName: "Software Upgrade", linkedLead: "Global Dynamics", value: "$15,000", closeDate: "2024-07-22", salesRep: "Jane Smith", stageId: "stage-1" },
    { id: "deal-5", dealName: "New CRM Integration", linkedLead: "Nexus Innovations", value: "$30,000", closeDate: "2024-08-01", salesRep: "John Doe", stageId: "stage-1" },
    { id: "deal-3", dealName: "Annual Contract Renewal", linkedLead: "Quantum Systems", value: "$120,000", closeDate: "2024-06-30", salesRep: "Jane Smith", stageId: "stage-2" },
    { id: "deal-4", dealName: "Enterprise License Expansion", linkedLead: "DataStream Solutions", value: "$75,000", closeDate: "2024-07-10", salesRep: "John Doe", stageId: "stage-2" },
    { id: "deal-6", dealName: "Consulting Services", linkedLead: "Prime Ventures", value: "$25,000", closeDate: "2024-05-20", salesRep: "Jane Smith", stageId: "stage-3" },
    { id: "deal-7", dealName: "Cloud Migration", linkedLead: "Apex Industries", value: "$90,000", closeDate: "2024-05-28", salesRep: "John Doe", stageId: "stage-3" },
];

const initialStagesConfig: Stage[] = [
    { id: "stage-1", title: "Opportunity", deals: [] },
    { id: "stage-2", title: "Negotiation", deals: [] },
    { id: "stage-3", title: "Closed", deals: [] },
];

// --- Sortable Card Component ---
const SortableDealCard = ({ deal, isDragging }: { deal: Deal, isDragging: boolean }) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
        id: deal.id,
    });

    const style: CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 10 : 'auto',
        cursor: "grab",
        background: "#fff",
        border: "1px solid #dcdfe6",
        borderRadius: 6,
        padding: "16px",
        marginBottom: 10,
        minHeight: 60,
        display: "flex",
        flexDirection: "column",
        gap: 2,
        opacity: isDragging ? 0.5 : 1,
        transitionDuration: "0.15s",
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
        >
            <span style={{ fontWeight: 600, fontSize: 14, color: "#2c3e50" }}>{deal.dealName}</span>
            <span style={{ fontSize: 13, color: "#7f8c8d" }}>Linked Lead: {deal.linkedLead}</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#34495e" }}>Value: {deal.value}</span>
            <span style={{ fontSize: 13, color: "#7f8c8d" }}>
                Close Date: {deal.closeDate}
            </span>
        </div>
    );
};

// --- Droppable Stage Component ---
const DroppableStage = ({ stageId, children, title, dealCount }: { stageId: string, children: React.ReactNode, title: string, dealCount: number }) => {
    const { setNodeRef } = useDroppable({
        id: stageId,
    });

    return (
        <div
            ref={setNodeRef}
            style={{
                background: "#f8f9fa",
                borderRadius: 8,
                padding: "16px",
                minWidth: 320,
                flexShrink: 0,
                display: "flex",
                flexDirection: "column",
                border: "1px solid #dfe1e6",
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            }}
        >
            <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                marginBottom: "16px",
            }}>
                <div style={{ display: "flex", alignItems: "center" }}>
                    <h3 style={{
                        fontWeight: 600, margin: 0,
                        fontSize: 18, color: "#1d293f"
                    }}>{title}</h3>
                    <span
                        style={{
                            backgroundColor: "#e0e7f7",
                            color: "#386fe3",
                            padding: "2px 8px",
                            borderRadius: 12,
                            fontSize: 14,
                            fontWeight: 600,
                            marginLeft: 10,
                        }}
                    >
                        {dealCount}
                    </span>
                </div>
            </div>
            <div style={{ flex: 1 }}>
                {children}
            </div>
        </div>
    );
};

// --- DealsPage Component ---
export const DealsPage: React.FC = () => {
    const [allDeals, setAllDeals] = useState<Deal[]>(initialDeals);
    const [salesRepFilter, setSalesRepFilter] = useState('All Sales Reps');
    const [dateFilter, setDateFilter] = useState('Any Date');
    const [valueFilter, setValueFilter] = useState('Any Value');

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();
    const sensors = useSensors(useSensor(PointerSensor));
    const [activeDeal, setActiveDeal] = useState<Deal | null>(null);

    // Filter Logic
    const filteredStages = useMemo(() => {
        const filterByDate = (deal: Deal) => {
            if (dateFilter === 'Any Date') return true;
            const today = new Date();
            const closeDate = new Date(deal.closeDate);

            if (dateFilter === 'This Week') {
                const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
                const endOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 6));
                return closeDate >= startOfWeek && closeDate <= endOfWeek;
            }
            if (dateFilter === 'This Month') {
                const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
                const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
                return closeDate >= startOfMonth && closeDate <= endOfMonth;
            }
            if (dateFilter === 'Next Month') {
                const startOfNextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
                const endOfNextMonth = new Date(today.getFullYear(), today.getMonth() + 2, 0);
                return closeDate >= startOfNextMonth && closeDate <= endOfNextMonth;
            }
            return true;
        };

        const filterByValue = (deal: Deal) => {
            if (valueFilter === 'Any Value') return true;
            const numericValue = parseFloat(deal.value.replace(/[^0-9.-]+/g, ""));
            if (valueFilter === '0-50k') return numericValue > 0 && numericValue <= 50000;
            if (valueFilter === '50-100k') return numericValue > 50000 && numericValue <= 100000;
            if (valueFilter === '100k+') return numericValue > 100000;
            return true;
        };

        const filteredDeals = allDeals.filter(deal => {
            const repMatch = salesRepFilter === 'All Sales Reps' || deal.salesRep === salesRepFilter;
            const dateMatch = filterByDate(deal);
            const valueMatch = filterByValue(deal);
            return repMatch && dateMatch && valueMatch;
        });

        const newStages = initialStagesConfig.map(stage => ({
            ...stage,
            deals: filteredDeals.filter(deal => deal.stageId === stage.id)
        }));

        return newStages;
    }, [allDeals, salesRepFilter, dateFilter, valueFilter]);

    // Drag and Drop Logic
    const findDeal = (dealId: string) => {
        return allDeals.find(deal => deal.id === dealId);
    };

    const handleDragStart = (event: DragStartEvent) => {
        const activeId = event.active.id as string;
        const deal = findDeal(activeId);
        if (deal) {
            setActiveDeal(deal);
        }
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveDeal(null);

        if (!over) return;

        const activeDealId = active.id as string;
        const overId = over.id as string;
        const dealToMove = findDeal(activeDealId);

        if (!dealToMove) return;

        const newAllDeals = [...allDeals];
        const oldIndex = newAllDeals.findIndex(d => d.id === activeDealId);
        const newStage = initialStagesConfig.find(stage => stage.id === overId) || initialStagesConfig.find(stage => stage.id === findDeal(overId)?.stageId);

        if (newStage) {
            newAllDeals[oldIndex].stageId = newStage.id;
        }

        setAllDeals(newAllDeals);
    };


    const handleAddClick = () => {
        setIsModalVisible(true);
    };

    const handleModalClose = () => {
        setIsModalVisible(false);
        form.resetFields();
    };

    const handleFormSubmit = (values: { dealName: string; linkedLead: string; value: string; closeDate: string }) => {
        const newDeal: Deal = {
            id: `deal-${Date.now()}`,
            ...values,
            salesRep: 'John Doe',
            stageId: 'stage-1', // Default to the first stage
        };
        setAllDeals(prevDeals => [newDeal, ...prevDeals]);
        handleModalClose();
    };

    const recentDeals = filteredStages.flatMap(stage => stage.deals.map(deal => ({
        ...deal,
        stage: stage.title,
        lastUpdated: "2 hours ago"
    }))).slice(0, 5);

    const tableColumns = [
        { title: 'Deal Name', dataIndex: 'dealName', key: 'dealName' },
        { title: 'Stage', dataIndex: 'stage', key: 'stage' },
        { title: 'Value', dataIndex: 'value', key: 'value' },
        { title: 'Last Updated', dataIndex: 'lastUpdated', key: 'lastUpdated' },
    ];

    const salesRepOptions = [
        { value: 'All Sales Reps', label: 'All Sales Reps' },
        { value: 'John Doe', label: 'John Doe' },
        { value: 'Jane Smith', label: 'Jane Smith' },
    ];

    const dateOptions = [
        { value: 'Any Date', label: 'Any Date' },
        { value: 'This Week', label: 'This Week' },
        { value: 'This Month', label: 'This Month' },
        { value: 'Next Month', label: 'Next Month' },
    ];

    const valueOptions = [
        { value: 'Any Value', label: 'Any Value' },
        { value: '0-50k', label: '$0 - $50k' },
        { value: '50-100k', label: '$50k - $100k' },
        { value: '100k+', label: 'Over $100k' },
    ];

    return (
        <div style={{
            fontFamily: "Inter, sans-serif",
            background: "#f0f2f5",
            padding: "24px 32px",
        }}>
            {/* --- Top Bar: Deals Overview --- */}
            <div style={{ marginBottom: "24px" }}>
                <h1 style={{
                    fontWeight: 600,
                    fontSize: 24,
                    color: "#2c3e50",
                    margin: 0,
                }}>Deals Overview</h1>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: "16px" }}>
                    <div style={{ display: 'flex', gap: "12px", alignItems: 'center' }}>
                        <Select
                            value={salesRepFilter}
                            onChange={setSalesRepFilter}
                            style={{ width: 160 }}
                            options={salesRepOptions}
                        />
                        <Select
                            value={dateFilter}
                            onChange={setDateFilter}
                            style={{ width: 120 }}
                            options={dateOptions}
                        />
                        <Select
                            value={valueFilter}
                            onChange={setValueFilter}
                            style={{ width: 120 }}
                            options={valueOptions}
                        />
                    </div>
                    <Button type="primary" size="large" onClick={handleAddClick} style={{ borderRadius: 6, background: "#386fe3", fontWeight: 600 }}>
                        <PlusCircleOutlined style={{ marginRight: 8 }} /> Create New Deal
                    </Button>
                </div>
            </div>

            <hr/>

            {/* --- Sales Pipeline (Kanban Board) --- */}
            <h2 style={{
                fontWeight: 600,
                fontSize: 20,
                color: "#2c3e50",
                marginTop: "32px",
                marginBottom: "24px",
            }}>Sales Pipeline</h2>
            <div style={{
                display: "flex",
                gap: 24,
                overflowX: "auto",
                paddingBottom: "16px",
            }}>
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCorners}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                >
                    {filteredStages.map((stage) => {
                        return (
                            <DroppableStage
                                key={stage.id}
                                stageId={stage.id}
                                title={stage.title}
                                dealCount={stage.deals.length}
                            >
                                <SortableContext
                                    items={stage.deals.map((deal) => deal.id)}
                                    strategy={verticalListSortingStrategy}
                                >
                                    {stage.deals.map((deal) => (
                                        <SortableDealCard key={deal.id} deal={deal} isDragging={deal.id === activeDeal?.id} />
                                    ))}
                                </SortableContext>
                            </DroppableStage>
                        );
                    })}
                    <DragOverlay>
                        {activeDeal ? (
                            <div style={{
                                cursor: "grabbing",
                                background: "#fff",
                                border: "1px solid #e7ebf6",
                                borderRadius: 10,
                                padding: "18px 16px",
                                boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
                                transform: "rotate(2deg)",
                                minHeight: 62,
                                display: "flex",
                                flexDirection: "column",
                                gap: 2,
                            }}>
                                <span style={{ fontWeight: 700, fontSize: 15, color: "#1d293f" }}>{activeDeal.dealName}</span>
                                <span style={{ color: "#34495e", fontWeight: 600, fontSize: 14 }}>{activeDeal.value}</span>
                                <span style={{ color: "#6c7a89", fontSize: 13 }}>
                                    Close: {activeDeal.closeDate}
                                </span>
                            </div>
                        ) : null}
                    </DragOverlay>
                </DndContext>
            </div>

            <hr/>

            {/* --- Pipeline Distribution Chart --- */}
            <Card style={{ marginTop: "40px", borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    {/* Placeholder for Donut Chart */}
                    <div style={{
                        width: '120px',
                        height: '120px',
                        borderRadius: '50%',
                        background: 'conic-gradient(#386fe3 0 35%, #599cff 35% 70%, #90d3fe 70% 100%)',
                        marginRight: 24,
                        position: 'relative',
                    }}>
                        <div style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: '80px',
                            height: '80px',
                            background: 'white',
                            borderRadius: '50%',
                        }}></div>
                    </div>
                    <div>
                        <h3 style={{ fontWeight: 600, fontSize: 18, margin: 0 }}>Deal Stage Breakdown</h3>
                        <p style={{ color: '#7f8c8d', fontSize: 14, margin: '8px 0 0 0' }}>Current distribution of deals across different stages in your sales pipeline. Focus on moving deals from Opportunity to Closed.</p>
                        <div style={{ display: 'flex', flexDirection: 'column', marginTop: 16, fontSize: 14 }}>
                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
                                <span style={{ display: 'inline-block', width: 10, height: 10, backgroundColor: '#386fe3', borderRadius: '50%', marginRight: 8 }}></span>
                                <span>Opportunity</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
                                <span style={{ display: 'inline-block', width: 10, height: 10, backgroundColor: '#599cff', borderRadius: '50%', marginRight: 8 }}></span>
                                <span>Negotiation</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <span style={{ display: 'inline-block', width: 10, height: 10, backgroundColor: '#90d3fe', borderRadius: '50%', marginRight: 8 }}></span>
                                <span>Closed</span>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>

            <hr/>

            {/* --- Recent Deal Activity Table --- */}
            <h2 style={{
                fontWeight: 600,
                fontSize: 20,
                color: "#2c3e50",
                marginTop: "40px",
                marginBottom: "24px",
            }}>Recent Deal Activity</h2>
            <Table
                dataSource={recentDeals}
                columns={tableColumns}
                pagination={false}
                rowKey="id"
            />

            {/* --- Modal for adding a new deal --- */}
            <Modal
                title="Create New Deal"
                open={isModalVisible}
                onCancel={handleModalClose}
                footer={null}
                style={{ top: 20 }}
            >
                <Form
                    form={form}
                    onFinish={handleFormSubmit}
                    layout="vertical"
                >
                    <Form.Item
                        name="dealName"
                        label="Deal Name"
                        rules={[{ required: true, message: 'Please enter the deal name!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="linkedLead"
                        label="Linked Lead"
                        rules={[{ required: true, message: 'Please enter the linked lead!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="value"
                        label="Value"
                        rules={[{ required: true, message: 'Please enter the value!' }]}
                    >
                        <Input prefix="$" />
                    </Form.Item>
                    <Form.Item
                        name="closeDate"
                        label="Close Date"
                        rules={[{ required: true, message: 'Please enter the close date!' }]}
                    >
                        <Input type="date" />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" style={{ width: '100%', background: "#386fe3", fontWeight: 600 }}>
                            Create Deal
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default DealsPage;