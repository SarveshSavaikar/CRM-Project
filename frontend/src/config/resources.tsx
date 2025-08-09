import type { IResourceItem } from "@refinedev/core";

import {
  DashboardOutlined,
  ProjectOutlined,
  ShopOutlined,
  UsergroupAddOutlined,
  DollarOutlined,
  NotificationOutlined,
  GlobalOutlined,
  SettingOutlined,
} from "@ant-design/icons";

export const resources: IResourceItem[] = [
  // Existing - Keep As Is
  {
    name: "dashboard",
    list: "/",
    meta: {
      label: "Dashboard",
      icon: <DashboardOutlined />,
    },
  },
  
  {
    name: "tasks",
    list: "/tasks",
    create: "/tasks/new",
    edit: "/tasks/edit/:id",
    meta: {
      label: "Tasks",
      icon: <ProjectOutlined />,
    },
  },

  // New Additions
  {
    name: "leads",
    list: "/leads",
    create: "/leads/new",
    edit: "/leads/edit/:id",
    show: "/leads/:id",
    meta: {
      label: "Leads",
      icon: <UsergroupAddOutlined />,
    },
  },
  {
    name: "deals",
    list: "/deals",
    create: "/deals/new",
    edit: "/deals/edit/:id",
    show: "/deals/:id",
    meta: {
      label: "Deals",
      icon: <DollarOutlined />,
    },
  },
  {
    name: "campaigns",
    list: "/campaigns",
    create: "/campaigns/new",
    edit: "/campaigns/edit/:id",
    show: "/campaigns/:id",
    meta: {
      label: "Campaigns",
      icon: <NotificationOutlined />,
    },
  },
  {
    name: "geo-insights",
    list: "/geo-insights",
    meta: {
      label: "Geo Insights",
      icon: <GlobalOutlined />,
    },
  },
  {
    name: "admin",
    list: "/admin",
    meta: {
      label: "Admin / Settings",
      icon: <SettingOutlined />,
    },
  },
];
