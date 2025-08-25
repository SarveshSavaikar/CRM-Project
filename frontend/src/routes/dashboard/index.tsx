// src/routes/dashboard/index.tsx
import { useCustom } from "@refinedev/core";
import { Col, Row } from "antd";

import type { DashboardTotalCountsQuery } from "@/graphql/types";

import {
  DealsByStage,
  DashboardDealsChart,
  DashboardLatestActivities,
  DashboardTotalCountCard,
  TaskActivityTracker,
  Generate,
  CompaniesMapCard,
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
      {/* ===== Top Stats - Updated to 4 columns ===== */}
      <Row gutter={[32, 32]}>
        <Col xs={24} sm={24} xl={6}> {/* ✅ Changed xl={8} to xl={6} for 4 columns */}
          <DashboardTotalCountCard
            resource="companies"
            isLoading={isLoading}
            totalCount={data?.data.companies.totalCount}
          />
        </Col>
        <Col xs={24} sm={24} xl={6}> {/* ✅ Changed xl={8} to xl={6} */}
          <DashboardTotalCountCard
            resource="contacts"
            isLoading={isLoading}
            totalCount={data?.data.contacts.totalCount}
          />
        </Col>
        <Col xs={24} sm={24} xl={6}> {/* ✅ Changed xl={8} to xl={6} */}
          <DashboardTotalCountCard
            resource="deals"
            isLoading={isLoading}
            totalCount={data?.data.deals.totalCount}
          />
        </Col>
        <Col xs={24} sm={24} xl={6}> {/* ✅ New column for conversion rate */}
          <DashboardTotalCountCard
            resource="conversionRate"
            isLoading={isLoading}
          />
        </Col>
      </Row>

      {/* ===== Calendar + Deals Chart ===== */}
      <Row gutter={[32, 32]} style={{ marginTop: "32px" }}>
        <Col xs={24} sm={24} xl={8} style={{ height: "460px" }}>
          <DealsByStage />
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