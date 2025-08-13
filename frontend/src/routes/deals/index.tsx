import React, { useState, CSSProperties } from "react";
import { Card, Modal, Form, Input, Button } from "antd";
import {
  DndContext,
  closestCenter,
  useSensors,
  useSensor,
  PointerSensor,
  DragEndEvent,
  useDroppable,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

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

// --- Sortable Card Component ---
const SortableDealCard = ({ deal }: { deal: Deal }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: deal.id,
  });

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: "grab",
    background: "#fff", // White inner deal cards
    border: "1px solid #e7ebf6",
    borderRadius: 10,
    padding: "18px 16px",
    marginBottom: 14,
    boxShadow: isDragging ? "0 4px 16px #377afd30" : "0 1.2px 7px #0001",
    minHeight: 62,
    display: "flex",
    flexDirection: "column",
    gap: 2,
    transitionDuration: "0.15s",
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <span style={{ fontWeight: 700, fontSize: 15, color: "#000" }}>{deal.leadName}</span>
      <span style={{ color: "#000", fontWeight: 600, fontSize: 14 }}>{deal.value}</span>
      <span style={{ color: "#000", fontSize: 13 }}>
        Close: {deal.expectedClose}
      </span>
    </div>
  );
};

const DroppableStage = ({ stageId, children }: { stageId: string; children: React.ReactNode }) => {
  const { setNodeRef } = useDroppable({
    id: stageId,
  });

  return (
    <div
      ref={setNodeRef}
      style={{
       
        borderRadius: 14,
        padding: "10px 0 10px 0",
        minWidth: 290,
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        maxHeight: "74vh",
      }}
    >
      {children}
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

  const findStage = (dealId: string) => {
    return stages.find(stage => stage.deals.some(deal => deal.id === dealId));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeDealId = active.id as string;
    const overId = over.id as string;

    // Find the stage of the active deal
    const activeStage = findStage(activeDealId);

    // If the drag target is another deal
    const overStage = findStage(overId);

    // Case 1: Dragging within the same stage
    if (activeStage && overStage && activeStage.id === overStage.id) {
      const deals = [...activeStage.deals];
      const oldIndex = deals.findIndex(deal => deal.id === activeDealId);
      const newIndex = deals.findIndex(deal => deal.id === overId);
      
      const newDeals = arrayMove(deals, oldIndex, newIndex);

      setStages(prevStages =>
        prevStages.map(stage =>
          stage.id === activeStage.id ? { ...stage, deals: newDeals } : stage
        )
      );
    }
    // Case 2: Dragging between different stages
    else if (activeStage && overStage && activeStage.id !== overStage.id) {
      setStages(prevStages => {
        const newStages = [...prevStages];
        const oldStageIndex = newStages.findIndex(stage => stage.id === activeStage.id);
        const newStageIndex = newStages.findIndex(stage => stage.id === overStage.id);
        
        const dealToMove = newStages[oldStageIndex].deals.find(deal => deal.id === activeDealId);
        if (!dealToMove) return prevStages;

        // Find index in the new stage
        const newDealIndex = newStages[newStageIndex].deals.findIndex(deal => deal.id === overId);
        
        // Remove from old stage
        newStages[oldStageIndex].deals = newStages[oldStageIndex].deals.filter(deal => deal.id !== activeDealId);
        
        // Add to new stage
        newStages[newStageIndex].deals.splice(newDealIndex, 0, dealToMove);
        
        return newStages;
      });
    }
    // Case 3: Dragging a deal into an empty stage
    else if (activeStage && !overStage) {
        const emptyStage = stages.find(stage => stage.id === overId);
        if(emptyStage) {
            setStages(prevStages => {
                const newStages = [...prevStages];
                const oldStageIndex = newStages.findIndex(stage => stage.id === activeStage.id);
                const newStageIndex = newStages.findIndex(stage => stage.id === emptyStage.id);
                
                const dealToMove = newStages[oldStageIndex].deals.find(deal => deal.id === activeDealId);
                if (!dealToMove) return prevStages;
                
                // Remove from old stage
                newStages[oldStageIndex].deals = newStages[oldStageIndex].deals.filter(deal => deal.id !== activeDealId);
                
                // Add to new empty stage
                newStages[newStageIndex].deals.push(dealToMove);

                return newStages;
            });
        }
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
        
        padding: "36px 18px",
        color: "#000",
      }}
    >
      <h1 style={{
        fontWeight: 700,
        fontSize: 33,
        marginBottom: 12,
        color: "#000"
      }}>Deals</h1>

      {/* Forecast View */}
      <Card
        style={{
          marginBottom: 26,
          borderRadius: 14,
          boxShadow: "0 2.5px 10px rgba(83,127,231,0.09)",
          border: "1px solid #e9eef8",
          color: "#000"
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          <h3 style={{
            margin: 0,
            fontSize: 18,
            fontWeight: 700,
            color: "#000",
            letterSpacing: ".01em"
          }}>
            Forecasted Revenue
          </h3>
          <span style={{
            fontSize: 25,
            fontWeight: 800,
            marginLeft: 8,
            color: "#000",
            letterSpacing: ".02em"
          }}>
            ${totalForecast.toLocaleString()}
          </span>
        </div>
      </Card>

      {/* Pipeline */}
      <div style={{
        display: "flex",
        gap: 20,
        overflowX: "auto",
        paddingBottom: 2,
      }}>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          {stages.map((stage) => {
            return (
              <DroppableStage key={stage.id} stageId={stage.id}>
                {/* Stage Title, Badge, and Add Button */}
                <div style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  margin: "0 18px 17px 18px"
                }}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <h3 style={{
                      fontWeight: 700, margin: 0,
                      fontSize: 18, color: "#000"
                    }}>{stage.title}</h3>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "#84d8dcff",
                        color: "#000",
                        borderRadius: "50%",
                        width: 26,
                        height: 26,
                        fontSize: 14.5,
                        fontWeight: 700,
                        marginLeft: 7,
                        boxShadow: "0 1.2px 6px #377afd20"
                      }}
                    >
                      {stage.deals.length}
                    </span>
                  </div>
                  <Button
                        type="primary"
                        shape="circle"
                        onClick={() => handleAddClick(stage.id)}
                        style={{
                            background: "#fff",
                            borderColor: "#fff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                           
                            width: 32,
                            height: 32,
                            fontSize: 20,
                            color: "#000", // Change the color of the plus icon to black
                        }}
                        >
                        +
                    </Button>
                </div>
                <div style={{ padding: "0 18px", flex: 1, overflowY: "auto" }}>
                  <SortableContext
                    items={stage.deals.map((deal) => deal.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {stage.deals.length === 0 && (
                      <div
                        style={{
                          color: "#aaa",
                          textAlign: "center",
                          fontStyle: "italic",
                          margin: "2.7em 0",
                          fontSize: 14.2,
                        }}
                      >
                        No deals in this stage.
                      </div>
                    )}
                    {stage.deals.map((deal) => (
                      <SortableDealCard key={deal.id} deal={deal} />
                    ))}
                  </SortableContext>
                </div>
              </DroppableStage>
            );
          })}
        </DndContext>
      </div>

      <Modal
        title="Add New Deal"
        open={isModalVisible}
        onCancel={handleModalClose}
        footer={null}
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
            <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
              Add Deal
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DealsPage;