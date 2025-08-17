import { BrowserRouter, Outlet, Route, Routes } from "react-router";
import { RefineThemes, useNotificationProvider } from "@refinedev/antd";
import { Authenticated, ErrorComponent, Refine } from "@refinedev/core";
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

import {
  CompanyCreatePage,
  CompanyEditPage,
  CompanyListPage,
  DashboardPage,
  LoginPage,
  TasksCreatePage,
  TasksEditPage,
  TasksListPage,
  TasksCalendarPage,
  LeadsListIndex,
  GeoInsightsPage,
  CampaignAnalyticsDashboard,
  AdminSettingsPage,
  AuditLog,
  DealsPage,
  CustomersPage,
  RegisterPage,
  InboxIndex, // 👈 Imported the InboxIndex component
} from "@/routes";

import "@refinedev/antd/dist/reset.css";

const App = () => {
  return (
    <BrowserRouter>
      <ConfigProvider theme={RefineThemes.Blue}>
        <AntdApp>

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
                    // 👈 CHANGE THIS LINE
                    // When not authenticated, navigate to the register page.
                    fallback={<CatchAllNavigate to="/register" />}
                  >
                    <Layout>
                      <Outlet />
                    </Layout>
                  </Authenticated>
                }
              >
                <Route index element={<DashboardPage />} />

                {/* Tasks */}
                <Route path="/tasks">
                  <Route index element={<TasksListPage />} />
                  <Route path="new" element={<TasksCreatePage />} />
                  <Route path="edit/:id" element={<TasksEditPage />} />
                  <Route path="calendar" element={<TasksCalendarPage />} />
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

                {/* 👈 New Route for Inbox */}
                <Route path="/inbox">
                  <Route index element={<InboxIndex />} />
                </Route>
                {/* --------------------------- */}
                
                {/* Customers */}
                <Route path="/customers">
                  <Route index element={<CustomersPage />} />
                </Route>

                {/* Deals */}
                <Route path="/deals">
                  <Route index element={<DealsPage />} />
                </Route>

                {/* Admin Settings & Audit Log Custom Routes */}
                <Route path="/admin">
                  <Route index element={<AdminSettingsPage />} />
                  <Route path="auditlog" element={<AuditLog />} />
                </Route>
                
                {/* 404 Fallback */}
                <Route path="*" element={<ErrorComponent />} />
              </Route>

              {/* Auth route (login & register) */}
              <Route
                element={
                  <Authenticated key="authenticated-auth" fallback={<Outlet />}>
                    <NavigateToResource resource="dashboard" />
                  </Authenticated>
                }
              >
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
              </Route>
            </Routes>
            <UnsavedChangesNotifier />
            <DocumentTitleHandler />
          </Refine>
        </AntdApp>
      </ConfigProvider>
    </BrowserRouter>
  );
};

export default App;