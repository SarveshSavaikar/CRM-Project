import React from "react";

import {
  type HttpError,
  useCustom,
  useList,
  useNavigation,
  useUpdate,
} from "@refinedev/core";
import type { GetFieldsFromList } from "@refinedev/nestjs-query";

import type { DragEndEvent } from "@dnd-kit/core";

// import type { TaskUpdateInput } from "@/graphql/schema.types";
import type { TasksQuery, TaskStagesQuery } from "@/graphql/types";

import { KanbanAddCardButton, KanbanOpenCalendarButton } from "../components";
import { KanbanBoard, KanbanBoardContainer } from "./kanban/board";
import { ProjectCardMemo, ProjectCardSkeleton } from "./kanban/card";
import { KanbanColumn, KanbanColumnSkeleton } from "./kanban/column";
import { KanbanItem } from "./kanban/item";
import {
  TASK_STAGES_QUERY,
  TASKS_QUERY,
  UPDATE_TASK_STAGE_MUTATION,
} from "./queries";
import { useQueryClient } from "@tanstack/react-query";
// import { queryClient } from "./refineClient";
import { useInvalidate } from "@refinedev/core";



interface TaskUpdateInput {
  title?: string;
  description?: string;
  due_date?: string;
  priority?: string;
  stageid?: number | null;
  status?: string;
  user_id?: number;
  opportunity_id?: number;
}

type Task = GetFieldsFromList<TasksQuery>;
type TaskStage = GetFieldsFromList<TaskStagesQuery> & { tasks: Task[] };

export const TasksListPage = ({ children }: React.PropsWithChildren) => {
  const { replace } = useNavigation();
  const invalidate = useInvalidate();
  const queryClient = useQueryClient();


  // const { data: stages, isLoading: isLoadingStages } = useList<TaskStage>({
  //   resource: "taskStages",
  //   filters: [
  //     {
  //       field: "title",
  //       operator: "in",
  //       value: ["TODO", "IN PROGRESS", "IN REVIEW", "DONE"],
  //     },
  //   ],
  //   sorters: [
  //     {
  //       field: "createdAt",
  //       order: "asc",
  //     },
  //   ],
  //   meta: {
  //     gqlQuery: TASK_STAGES_QUERY,
  //   },
  // });
  const { data: stages, isLoading: isLoadingStages } = useCustom<{ data: any[] }>({
    url: "/taskStages/",
    method: "get",
  })

  console.log("stages: ", stages)
  // const { data: tasks, isLoading: isLoadingTasks } = useList<
  //   GetFieldsFromList<TasksQuery>
  // >({
  //   resource: "tasks",
  //   sorters: [
  //     {
  //       field: "dueDate",
  //       order: "asc",
  //     },
  //   ],
  //   queryOptions: {
  //     enabled: !!stages,
  //   },
  //   pagination: {
  //     mode: "off",
  //   },
  //   meta: {
  //     gqlQuery: TASKS_QUERY,
  //   },
  // });
  const { data: tasks, isLoading: isLoadingTasks } = useCustom<{
    [x: string]: any; data: any[]
  }>({
    url: "/tasks/",
    method: "get",
  })
  console.log("task : ", tasks)
  // group tasks by stage
  // it's convert Task[] to TaskStage[] (group by stage) for kanban
  // uses `stages` and `tasks` from useList hooks
  const taskStages = React.useMemo(() => {
    if (!tasks?.data || !stages?.data) {
      return { unassignedStage: [], columns: [] };
    }

    const unassignedStage = tasks.data.data?.filter(
      (task) => task.stageid === null
    );

    const grouped: TaskStage[] = stages.data.data.map((stage) => ({
      ...stage,
      tasks: tasks.data?.filter(
        (task: { stageid: number }) => task.stageid === stage.id
      ),
    }));
    console.log("Grouped ", grouped)
    return {
      unassignedStage,
      columns: grouped,
    };
  }, [tasks, stages]);

  const { mutate: updateTask } = useUpdate<
    any,              // response type
    HttpError,        // error type
    Partial<TaskUpdateInput> // variables type
  >({
    resource: "tasks",  // refine will call /tasks/:id
    mutationMode: "pessimistic",
    successNotification: false,
    meta: {
      // Override the method to use PATCH instead of default PUT
      method: "patch",
    },

  });

  const handleOnDragEnd = (event: DragEndEvent) => {
    const stageId = Number(event.over?.id); // convert to number
    const taskId = Number(event.active.id);
    const taskStageId = event.active.data.current?.stageid;

    if (taskStageId === stageId) return;
    console.log(queryClient.getQueryCache().getAll().map(q => q.queryKey));

    queryClient.setQueryData(["data", "default", "custom", { url: "/tasks/", method: "get" }], (oldData: any) => {
      if (!oldData) return oldData;
      console.log("Oldata ", oldData)
      return {
        ...oldData,
        data: oldData.data.map((task: any) =>
          task.id === taskId ? { ...task, stageid: stageId } : task
        ),
      };
    });

    updateTask(
      {
        id: taskId,
        values: { stageid: stageId },
      },
      {
        onSuccess: () => {
          // Refetch tasks after update
          invalidate({ resource: "tasks", invalidates: ["list"] });
        },
      }
    );
  };

  const handleAddCard = (args: { stageId: string }) => {
    const path =
      args.stageId === "unassigned"
        ? "/tasks/new"
        : `/tasks/new?stageId=${args.stageId}`;

    replace(path);
  };

  const isLoading = isLoadingTasks || isLoadingStages;

  if (isLoading) return <PageSkeleton />;

  return (
    <>
      {/* ✅ Added calendar button above the board */}
      <div style={{ display: "flex", gap: "8px", margin: "8px 66px" }}>
        <KanbanOpenCalendarButton />
      </div>

      <KanbanBoardContainer>
        <KanbanBoard onDragEnd={handleOnDragEnd}>
          {/* <KanbanColumn
            id={"1"}
            title={"unassigned"}
            count={taskStages?.unassignedStage?.length || 0}
            onAddClick={() => handleAddCard({ stageId: "unassigned" })}
          >
            {taskStages.unassignedStage?.map((task) => {
              return (
                <KanbanItem
                  key={task.id}
                  id={task.id}
                  data={{ ...task, stageId: "unassigned" }}
                >
                  <ProjectCardMemo
                    {...task}
                    dueDate={task.dueDate || undefined}
                  />
                </KanbanItem>
              );
            })}
            {!taskStages.unassignedStage?.length && (
              <KanbanAddCardButton
                onClick={() => handleAddCard({ stageId: "unassigned" })}
              />
            )}
          </KanbanColumn>   */}
          {taskStages.columns?.map((column) => {
            console.log("Showing columns", column.tasks?.length)
            return (
              <KanbanColumn
                key={column.id}
                id={column.id}
                title={column.title}
                count={column.tasks?.length}
                onAddClick={() => handleAddCard({ stageId: column.id })}
              >
                {isLoading && <ProjectCardSkeleton />}
                {isLoading && console.log("Emo")}

                {!isLoading &&
                  column.tasks?.map((task) => {
                    console.log("Task.id = ", task)
                    return (
                      <KanbanItem key={task.id} id={task.id} data={task}>
                        <ProjectCardMemo
                          {...task}
                          dueDate={task['due_date'] || "02-Sep"}
                          users={[
                            {
                              id: task["user_id"]?.toString() || "0",
                              name: task["user_name"] || "Unknown User",
                              avatarUrl: task["user_avatar"] || undefined,
                            },
                          ]}
                        />
                      </KanbanItem>
                    );
                  })}
                {!column.tasks?.length && (
                  <KanbanAddCardButton
                    onClick={() =>
                      handleAddCard({
                        stageId: column.id,
                      })
                    }
                  />
                )}
              </KanbanColumn>
            );
          })}
        </KanbanBoard>
      </KanbanBoardContainer>
      {children}
    </>
  );
};

const PageSkeleton = () => {
  const columnCount = 6;
  const itemCount = 4;

  return (
    <KanbanBoardContainer>
      {Array.from({ length: columnCount }).map((_, index) => {
        return (
          <KanbanColumnSkeleton key={index}>
            {Array.from({ length: itemCount }).map((_, index) => {
              return <ProjectCardSkeleton key={index} />;
            })}
          </KanbanColumnSkeleton>
        );
      })}
    </KanbanBoardContainer>
  );
};