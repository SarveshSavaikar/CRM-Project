// src/routes/dashboard/index.tsx
import { useCustom } from "@refinedev/core";
import { Col, Row } from "antd";

import type { DashboardTotalCountsQuery } from "@/graphql/types";

import {
 InboxPreview,
  DashboardDealsChart,
  DashboardLatestActivities,
  DashboardTotalCountCard,
  TaskActivityTracker,
  Generate,           // ✅ combined donut + sales performance
  CompaniesMapCard,   // ✅ interactive companies map
} from "./components";

import { DASHBOARD_TOTAL_COUNTS_QUERY } from "./queries";

export const DashboardPage = () => {
  const { data, isLoading } = useCustom<DashboardTotalCountsQuery>({
    url: "",
    method: "get",
    meta: { gqlQuery: DASHBOARD_TOTAL_COUNTS_QUERY },
  });

  return (
    <div className="page-container">
      {/* ===== Top Stats ===== */}
      <Row gutter={[32, 32]}>
        <Col xs={24} sm={24} xl={8}>
          <DashboardTotalCountCard
            resource="companies"
            isLoading={isLoading}
            totalCount={data?.data.companies.totalCount}
          />
        </Col>
        <Col xs={24} sm={24} xl={8}>
          <DashboardTotalCountCard
            resource="contacts"
            isLoading={isLoading}
            totalCount={data?.data.contacts.totalCount}
          />
        </Col>
        <Col xs={24} sm={24} xl={8}>
          <DashboardTotalCountCard
            resource="deals"
            isLoading={isLoading}
            totalCount={data?.data.deals.totalCount}
          />
        </Col>
      </Row>

      {/* ===== Calendar + Deals Chart ===== */}
      <Row gutter={[32, 32]} style={{ marginTop: "32px" }}>
        <Col xs={24} sm={24} xl={8} style={{ height: "460px" }}>
          <InboxPreview />
        </Col>
        <Col xs={24} sm={24} xl={16} style={{ height: "460px" }}>
          <DashboardDealsChart />
        </Col>
      </Row>

      {/* ===== Latest Activities ===== */}
      <Row gutter={[32, 32]} style={{ marginTop: "32px" }}>
        <Col xs={24}>
          <DashboardLatestActivities />
        </Col>
      </Row>

      {/* ===== Task Activity Tracker ===== */}
      <Row gutter={[32, 32]} style={{ marginTop: "32px" }}>
        <Col xs={24}>
          <TaskActivityTracker />
        </Col>
      </Row>

      <Row gutter={[32, 32]} style={{ marginTop: "32px" }}>
        <Col xs={24}>
          <Generate />
        </Col>
      </Row>

      {/* ===== Companies Map Module ===== */}
      <Row gutter={[32, 32]} style={{ marginTop: "32px" }}>
        <Col xs={24}>
          <CompaniesMapCard />
        </Col>
      </Row>
    </div>
  );
};

export default DashboardPage;
