import React from "react";
import {
  DndContext,
  type DragEndEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

type Props = {
  onDragEnd: (event: DragEndEvent) => void;
};

export const KanbanBoard = ({
  onDragEnd,
  children,
}: React.PropsWithChildren<Props>) => {
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 5,
    },
  });
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      distance: 5,
    },
  });

  const sensors = useSensors(mouseSensor, touchSensor);

  const handleDragEnd = (event: DragEndEvent) => {
    if (event.over === null) {
      return;
    }

    onDragEnd(event);
  };

  return (
    <DndContext onDragEnd={handleDragEnd} sensors={sensors}>
      <KanbanBoardContainer>
        {children}
      </KanbanBoardContainer>
    </DndContext>
  );
};

export const KanbanBoardContainer = ({ children }: React.PropsWithChildren) => {
  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        // The following two lines enable the main page vertical scrollbar
        // and allow content to be pushed down the page, while the inner div
        // handles the horizontal scroll for the columns.
        minHeight: "100vh", 
        overflowY: "auto",
      }}
    >
      <div
        style={{
          flex: 1,
          display: "flex",
          padding: "32px",
          overflowX: "auto", // This is the key change: only this div scrolls horizontally
          overflowY: "hidden", // Prevents a double vertical scrollbar
        }}
      >
        {children}
      </div>
    </div>
  );
};