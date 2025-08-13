import React, { useState, useMemo } from "react";
import { Card, Modal, Radio, Row, Col, Spin, Button } from "antd"; // Added Button to imports
import {
  Calendar,
  momentLocalizer,
  Views,
  type View,
} from "react-big-calendar";
import moment from "moment";
import dayjs from "dayjs";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useList, useNavigation } from "@refinedev/core"; // Added useNavigation to imports
import type { GetFieldsFromList } from "@refinedev/nestjs-query";
import type { TasksQuery } from "@/graphql/types";
import gql from "graphql-tag";
import { CalendarOutlined } from "@ant-design/icons";

// Define the GraphQL query to fetch only necessary fields
const TASKS_QUERY = gql`
  query Tasks {
    tasks {
      nodes {
        id
        title
        dueDate
      }
    }
  }
`;

const localizer = momentLocalizer(moment);

type MyEvent = {
  id: string; // Changed to string to match task id
  title: string;
  start: Date;
  end: Date;
  category: string;
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
  const { push } = useNavigation(); // Get the navigation function
  const [view, setView] = useState<View>(Views.MONTH);

  // Fetch all tasks using the new query
  const { data: tasks, isLoading } = useList<GetFieldsFromList<TasksQuery>>({
    resource: "tasks",
    meta: {
      gqlQuery: TASKS_QUERY,
    },
    pagination: {
      mode: "off",
    },
  });

  // Create calendar events from the fetched tasks
  const events = useMemo(() => {
    if (!tasks?.data) {
      return [];
    }

    return tasks.data
      .filter(task => task.dueDate)
      .map(task => {
        const dueDate = dayjs(task.dueDate as string).toDate();
        return {
          id: task.id,
          title: task.title,
          start: dueDate,
          end: dueDate,
          category: "Task",
        };
      });
  }, [tasks]);

  const eventStyleGetter = (event: MyEvent) => ({
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
    <Row style={{  minHeight: "100vh" }}>
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
          {/* Added the "View Tasks" button */}
          <Button
            type="primary"
            style={{ marginBottom: 16 }}
            onClick={() => push("/tasks")}
          >
            View Tasks
          </Button>
          {isLoading ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 570 }}>
              <Spin size="large" />
            </div>
          ) : (
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
                  content: `Due: ${dayjs(ev.start).format("MMM D, YYYY")}`,
                })
              }
              components={{
                toolbar: (props) => (
                  <CustomToolbar {...props} view={view} onView={setView} />
                ),
              }}
            />
          )}
        </Card>
      </Col>
    </Row>
  );
};

export default TasksCalendarPage;