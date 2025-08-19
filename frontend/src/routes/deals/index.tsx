import React, { useState, CSSProperties } from "react";
import { Card, Modal, Form, Input, Button } from "antd";
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
  value: string;
  leadName: string;
  expectedClose: string;
};

type Stage = {
  id: string;
  title: string;
  deals: Deal[];
};

// --- Initial Data ---
const initialStages: Stage[] = [
  {
    id: "stage-1",
    title: "Prospecting",
    deals: [
      { id: "deal-1", value: "$5000", leadName: "Acme Corp", expectedClose: "2025-09-15" },
      { id: "deal-2", value: "$3000", leadName: "Beta Inc", expectedClose: "2025-09-25" },
    ],
  },
  {
    id: "stage-2",
    title: "Negotiation",
    deals: [
      { id: "deal-3", value: "$8000", leadName: "Charlie LLC", expectedClose: "2025-10-01" },
    ],
  },
  {
    id: "stage-3",
    title: "Closed Won",
    deals: [
      { id: "deal-4", value: "$12000", leadName: "Delta Ltd", expectedClose: "2025-10-05" },
    ],
  },
];

// --- Sortable Card Component with visual feedback ---
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
    border: "1px solid #dcdfe6", // Lighter, more subtle border
    borderRadius: 6,
    padding: "16px 14px",
    marginBottom: 10,
    minHeight: 60,
    display: "flex",
    flexDirection: "column",
    gap: 2,
    opacity: isDragging ? 0.5 : 1,
    transitionDuration: "0.15s",
  };
  
  const hoverStyle: CSSProperties = {
    background: "#f8f9fa", // Subtle background change on hover
    border: "1px solid #c9d8e5",
  };

  return (
    <div
      ref={setNodeRef}
      style={{ ...style, ...(!isDragging ? hoverStyle : {}) }} 
      {...attributes}
      {...listeners}
    >
      <span style={{ fontWeight: 600, fontSize: 14, color: "#2c3e50" }}>{deal.leadName}</span>
      <span style={{ color: "#34495e", fontWeight: 700, fontSize: 13 }}>{deal.value}</span>
      <span style={{ color: "#7f8c8d", fontSize: 12 }}>
        Close: {deal.expectedClose}
      </span>
    </div>
  );
};

// --- Droppable Stage Component ---
const DroppableStage = ({ stageId, children, title, dealCount, onAddDeal }: { stageId: string, children: React.ReactNode, title: string, dealCount: number, onAddDeal: (stageId: string) => void }) => {
  const { setNodeRef } = useDroppable({
    id: stageId,
  });

  return (
    <div
      ref={setNodeRef}
      style={{
        background: "#ebecf0", // Typical Kanban board column background
        borderRadius: 8,
        padding: "12px",
        minWidth: 280,
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        border: "1px solid #dfe1e6",
      }}
    >
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        marginBottom: "12px",
      }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <h3 style={{
            fontWeight: 700, margin: 0,
            fontSize: 16, color: "#2c3e50"
          }}>{title}</h3>
          <span
            style={{
              backgroundColor: "#d1e5ff",
              color: "#3498db",
              padding: "2px 8px",
              borderRadius: 12,
              fontSize: 12,
              fontWeight: 600,
              marginLeft: 8,
            }}
          >
            {dealCount}
          </span>
        </div>
        <Button
          type="text"
          shape="circle"
          onClick={() => onAddDeal(stageId)}
          icon={<PlusCircleOutlined />}
          style={{
            color: "#3498db",
            fontSize: 20,
            transition: "color 0.2s",
          }}
        />
      </div>
      <div style={{ flex: 1 }}>
        {children}
        {dealCount === 0 && (
          <div
            style={{
              color: "#aaa",
              textAlign: "center",
              fontStyle: "italic",
              marginTop: "4em",
              fontSize: 14.2,
            }}
          >
            Drag deals here or click `+` to add one.
          </div>
        )}
      </div>
    </div>
  );
};

// --- DealsPage Component ---
export const DealsPage: React.FC = () => {
  const [stages, setStages] = useState<Stage[]>(initialStages);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentStageId, setCurrentStageId] = useState<string | null>(null);
  const [form] = Form.useForm();
  const sensors = useSensors(useSensor(PointerSensor));

  const [activeDeal, setActiveDeal] = useState<Deal | null>(null);

  const findStage = (dealId: string) => {
    return stages.find(stage => stage.deals.some(deal => deal.id === dealId));
  };

  const findDeal = (dealId: string) => {
    const allDeals = stages.flatMap(stage => stage.deals);
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

    const activeStage = findStage(activeDealId);
    const overStage = stages.find(stage => stage.id === overId) || findStage(overId);

    if (!activeStage || !overStage) return;

    const dealToMove = findDeal(activeDealId);
    if (!dealToMove) return;

    // Case 1: Dragging within the same stage
    if (activeStage.id === overStage.id) {
        setStages(prevStages => {
            const newStages = [...prevStages];
            const stageIndex = newStages.findIndex(stage => stage.id === activeStage.id);
            const deals = [...newStages[stageIndex].deals];
            const oldIndex = deals.findIndex(deal => deal.id === activeDealId);
            const newIndex = deals.findIndex(deal => deal.id === overId);
            
            if (oldIndex !== newIndex) {
                const newDeals = arrayMove(deals, oldIndex, newIndex);
                newStages[stageIndex] = { ...newStages[stageIndex], deals: newDeals };
            }
            return newStages;
        });
    }
    // Case 2: Dragging between different stages
    else {
        setStages(prevStages => {
            const newStages = [...prevStages];
            const oldStageIndex = newStages.findIndex(stage => stage.id === activeStage.id);
            const newStageIndex = newStages.findIndex(stage => stage.id === overStage.id);
            
            newStages[oldStageIndex] = {
                ...newStages[oldStageIndex],
                deals: newStages[oldStageIndex].deals.filter(d => d.id !== activeDealId),
            };

            const overDealIndex = newStages[newStageIndex].deals.findIndex(d => d.id === overId);
            
            if (overDealIndex !== -1) {
                newStages[newStageIndex] = {
                    ...newStages[newStageIndex],
                    deals: [
                        ...newStages[newStageIndex].deals.slice(0, overDealIndex),
                        dealToMove,
                        ...newStages[newStageIndex].deals.slice(overDealIndex)
                    ],
                };
            } else {
                newStages[newStageIndex] = {
                    ...newStages[newStageIndex],
                    deals: [...newStages[newStageIndex].deals, dealToMove],
                };
            }
            return newStages;
        });
    }
  };

  const handleAddClick = (stageId: string) => {
    setCurrentStageId(stageId);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    form.resetFields();
    setCurrentStageId(null);
  };

  const handleFormSubmit = (values: { leadName: string; value: string; expectedClose: string }) => {
    if (!currentStageId) return;

    setStages(prevStages => {
      const newStages = [...prevStages];
      const stageIndex = newStages.findIndex(stage => stage.id === currentStageId);
      if (stageIndex === -1) return prevStages;

      const newDeal: Deal = {
        id: `deal-${Date.now()}`,
        ...values,
      };

      newStages[stageIndex].deals = [...newStages[stageIndex].deals, newDeal];
      return newStages;
    });

    handleModalClose();
  };

  const totalForecast = stages
    .flatMap((stage) => stage.deals)
    .reduce((sum, deal) => sum + parseFloat(deal.value.replace(/[^0-9.-]+/g, "")), 0);

  return (
    <div
      style={{
        fontFamily: "Inter, sans-serif",
        minHeight: "100vh",
        background: "#f7f9fc",
        padding: "36px 28px",
        color: "#2c3e50",
        overflowX: "hidden",
      }}
    >
      <h1 style={{
        fontWeight: 700,
        fontSize: 28,
        marginBottom: 16,
        color: "#1d293f",
      }}>Deals Pipeline</h1>

      {/* Simplified Forecast Card */}
      <Card
        style={{
          marginBottom: 32,
          borderRadius: 8,
          boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
          border: "1px solid #dfe1e6",
          background: "#fff",
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <h3 style={{
            margin: 0,
            fontSize: 16,
            fontWeight: 600,
            color: "#34495e",
            letterSpacing: ".01em"
          }}>
            Total Forecasted Revenue
          </h3>
          <span style={{
            fontSize: 24,
            fontWeight: 800,
            marginLeft: 8,
            color: "#1467fa",
          }}>
            ${totalForecast.toLocaleString()}
          </span>
        </div>
      </Card>
      
      <div style={{
        display: "flex",
        gap: 16,
        overflowX: "auto",
        paddingBottom: "16px",
      }}>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          {stages.map((stage) => {
            return (
              <DroppableStage
                key={stage.id}
                stageId={stage.id}
                title={stage.title}
                dealCount={stage.deals.length}
                onAddDeal={handleAddClick}
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
                <span style={{ fontWeight: 700, fontSize: 15, color: "#1d293f" }}>{activeDeal.leadName}</span>
                <span style={{ color: "#34495e", fontWeight: 600, fontSize: 14 }}>{activeDeal.value}</span>
                <span style={{ color: "#6c7a89", fontSize: 13 }}>
                  Close: {activeDeal.expectedClose}
                </span>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>

      <Modal
        title="Add New Deal"
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
            name="leadName"
            label="Lead Name"
            rules={[{ required: true, message: 'Please enter the lead name!' }]}
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
            name="expectedClose"
            label="Expected Close Date"
            rules={[{ required: true, message: 'Please enter the expected close date!' }]}
          >
            <Input type="date" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: '100%', background: "#1467fa" }}>
              Add Deal
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DealsPage;