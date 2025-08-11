import { BrowserRouter, Outlet, Route, Routes } from "react-router";
import { RefineThemes, useNotificationProvider } from "@refinedev/antd";
import { Authenticated, ErrorComponent, Refine } from "@refinedev/core";
import { DevtoolsPanel, DevtoolsProvider } from "@refinedev/devtools";
import routerProvider, {
  CatchAllNavigate,
  DocumentTitleHandler,
  NavigateToResource,
  UnsavedChangesNotifier,
} from "@refinedev/react-router";
import { App as AntdApp, ConfigProvider } from "antd";

import { Layout } from "@/components";
import { resources } from "@/config/resources";
import { authProvider, dataProvider, liveProvider } from "@/providers";

// Make sure AdminSettingsPage is exported in src/routes/index.ts!
import {
  CompanyCreatePage,
  CompanyEditPage,
  CompanyListPage,
  DashboardPage,
  LoginPage,
  TasksCreatePage,
  TasksEditPage,
  TasksListPage,
  LeadsListIndex,
  GeoInsightsPage,
  CampaignAnalyticsDashboard,
  AdminSettingsPage, // <-- This must be valid and re-exported from the barrel!
} from "@/routes";

import "@refinedev/antd/dist/reset.css";

const App = () => {
  return (
    <BrowserRouter>
      <ConfigProvider theme={RefineThemes.Blue}>
        <AntdApp>
          <DevtoolsProvider>
            <Refine
              routerProvider={routerProvider}
              dataProvider={dataProvider}
              liveProvider={liveProvider}
              notificationProvider={useNotificationProvider}
              authProvider={authProvider}
              resources={resources}
              options={{
                syncWithLocation: true,
                warnWhenUnsavedChanges: true,
                liveMode: "auto",
                useNewQueryKeys: true,
              }}
            >
              <Routes>
                {/* Protected Layout */}
                <Route
                  element={
                    <Authenticated
                      key="authenticated-layout"
                      fallback={<CatchAllNavigate to="/login" />}
                    >
                      <Layout>
                        <Outlet />
                      </Layout>
                    </Authenticated>
                  }
                >
                  <Route index element={<DashboardPage />} />

                  {/* Tasks */}
                  <Route
                    path="/tasks"
                    element={
                      <TasksListPage>
                        <Outlet />
                      </TasksListPage>
                    }
                  >
                    <Route path="new" element={<TasksCreatePage />} />
                    <Route path="edit/:id" element={<TasksEditPage />} />
                  </Route>

                  {/* Companies */}
                  <Route path="/companies">
                    <Route index element={<CompanyListPage />} />
                    <Route path="new" element={<CompanyCreatePage />} />
                    <Route path="edit/:id" element={<CompanyEditPage />} />
                  </Route>

                  {/* Leads */}
                  <Route path="/leads">
                    <Route index element={<LeadsListIndex />} />
                  </Route>

                  {/* GeoInsights */}
                  <Route path="/geo-insights">
                    <Route index element={<GeoInsightsPage />} />
                  </Route>

                  {/* Campaigns */}
                  <Route path="/campaigns">
                    <Route index element={<CampaignAnalyticsDashboard />} />
                  </Route>

                  {/* ------ Admin Settings (NEW) ------ */}
                  <Route path="/admin">
                    <Route index element={<AdminSettingsPage />} />
                  </Route>
                  {/* --------------------------------- */}

                  {/* 404 Fallback */}
                  <Route path="*" element={<ErrorComponent />} />
                </Route>

                {/* Auth route (login) */}
                <Route
                  element={
                    <Authenticated key="authenticated-auth" fallback={<Outlet />}>
                      <NavigateToResource resource="dashboard" />
                    </Authenticated>
                  }
                >
                  <Route path="/login" element={<LoginPage />} />
                </Route>
              </Routes>
              <UnsavedChangesNotifier />
              <DocumentTitleHandler />
            </Refine>
            <DevtoolsPanel />
          </DevtoolsProvider>
        </AntdApp>
      </ConfigProvider>
    </BrowserRouter>
  );
};

export default App;
