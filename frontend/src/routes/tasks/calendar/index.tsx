import React, { useState } from "react";
import { Card, Modal, Radio, Row, Col, Button } from "antd";
import {
  Calendar,
  momentLocalizer,
  Views,
  type View,
} from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useNavigation } from "@refinedev/core";

const localizer = momentLocalizer(moment);

type MyEvent = {
  id: string;
  title: string;
  start: Date;
  end: Date;
  category?: string;
};

// Custom toolbar component
const CustomToolbar = (
  toolbar: any & { view: View; onView: (view: View) => void }
) => {
  return (
    <div
      style={{
        marginBottom: 16,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Radio.Group buttonStyle="solid">
        <Radio.Button onClick={() => toolbar.onNavigate("TODAY")}>
          Today
        </Radio.Button>
        <Radio.Button onClick={() => toolbar.onNavigate("PREV")}>
          Back
        </Radio.Button>
        <Radio.Button onClick={() => toolbar.onNavigate("NEXT")}>
          Next
        </Radio.Button>
      </Radio.Group>
      <span style={{ fontWeight: 600 }}>{toolbar.label}</span>
      <Radio.Group
        value={toolbar.view}
        onChange={(e) => toolbar.onView(e.target.value)}
        buttonStyle="solid"
      >
        <Radio.Button value={Views.MONTH}>Month</Radio.Button>
        <Radio.Button value={Views.WEEK}>Week</Radio.Button>
        <Radio.Button value={Views.DAY}>Day</Radio.Button>
        <Radio.Button value={Views.AGENDA}>List</Radio.Button>
      </Radio.Group>
    </div>
  );
};

export const TasksCalendarPage: React.FC = () => {
  const { push } = useNavigation();
  const [view, setView] = useState<View>(Views.MONTH);

  // Static example events (no dueDate filtering)
  const events: MyEvent[] = [
    {
      id: "1",
      title: "Sample Event 1",
      start: new Date(),
      end: new Date(),
      category: "General",
    },
    {
      id: "2",
      title: "Sample Event 2",
      start: new Date(new Date().setDate(new Date().getDate() + 2)),
      end: new Date(new Date().setDate(new Date().getDate() + 2)),
      category: "General",
    },
  ];

  const eventStyleGetter = () => ({
    style: {
      backgroundColor: "#377afd",
      borderRadius: "8px",
      color: "#fff",
      border: "none",
      padding: 6,
      fontWeight: 600,
    },
  });

  return (
    <Row style={{ minHeight: "100vh" }}>
      <Col flex="auto" style={{ margin: 18 }}>
        <Card
          style={{
            minHeight: 600,
            borderRadius: 16,
            background: "#fff",
            border: "1px solid #eee",
          }}
          bodyStyle={{ padding: 20 }}
        >
          <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 10 }}>
            Tasks Calendar
          </div>
          <Button
            type="primary"
            style={{ marginBottom: 16 }}
            onClick={() => push("/tasks")}
          >
            View Tasks
          </Button>
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            views={["month", "week", "day", "agenda"]}
            view={view}
            onView={(newView) => setView(newView)}
            style={{ height: 570, background: "#fff" }}
            eventPropGetter={eventStyleGetter}
            onSelectEvent={(ev: MyEvent) =>
              Modal.info({
                title: ev.title,
              })
            }
            components={{
              toolbar: (props) => (
                <CustomToolbar {...props} view={view} onView={setView} />
              ),
            }}
          />
        </Card>
      </Col>
    </Row>
  );
};

export default TasksCalendarPage;