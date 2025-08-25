// src/routes/dashboard/index.tsx
import { useCustom } from "@refinedev/core";
import type { CustomResponse } from "@refinedev/core";
import { Col, Row } from "antd";

import type { DashboardTotalCountsQuery } from "@/graphql/types";

import {

  DealsByStage,

  //InboxPreview,

  DashboardDealsChart,
  DashboardLatestActivities,
  DashboardTotalCountCard,
  TaskActivityTracker,
  Generate,
  CompaniesMapCard,
} from "./components";

import { DASHBOARD_TOTAL_COUNTS_QUERY } from "./queries";

export const DashboardPage = () => {
  // const { data, isLoading } = useCustom<DashboardTotalCountsQuery>({
  //   url: "",
  //   method: "get",
  //   meta: { gqlQuery: DASHBOARD_TOTAL_COUNTS_QUERY },
  // });
  const { data: leadsCount, isLoading: isLeadLoading } = useCustom<{ count: number}>({
    url: "/leads/",
    method: "get",
    queryOptions: {
    select: (response) => ({
      ...response,
      data: { count: (response.data as unknown as any[]).length }, // wrap the number
    }),
  },
  });
  console.log(leadsCount)

  const { data: dealsCount, isLoading: isDealsLoading } = useCustom<{ count: number }>({
    url: "/opportunities/",
    method: "get",
    queryOptions: {
      select: (response): CustomResponse<{ count: number }> => ({
        ...response, // keeps fields like "status", "headers"
        data: { count: (response.data as unknown as any[]).length }, // replace array with count
      }),
    },
  });

  const { data: monthDealsCount, isLoading: isMonthDealsCountLoadding } = useCustom<{ count: number}>(
    {
      url: "/opportunities/last-30-days",
      method: "get",
      queryOptions: {
        select: (response): CustomResponse<{ count: number }> => ({
          ...response,
          data: { count: (response.data as unknown as any[]).length},
        })
      }
    }
  );


  return (
    <div className="page-container">
      {/* ===== Top Stats - Updated to 4 columns ===== */}
      <Row gutter={[32, 32]}>
        <Col xs={24} sm={24} xl={6}> {/* ✅ Changed xl={8} to xl={6} for 4 columns */}
          <DashboardTotalCountCard
            resource="lead"
            isLoading={isLeadLoading}
            totalCount={leadsCount?.data.count}
          // totalCount={10}
          />
        </Col>
        <Col xs={24} sm={24} xl={6}> {/* ✅ Changed xl={8} to xl={6} */}
          <DashboardTotalCountCard
            resource="monthDeals"
            isLoading={isMonthDealsCountLoadding}
            totalCount={monthDealsCount?.data.count}
            // totalCount={10}
          />
        </Col>
        <Col xs={24} sm={24} xl={6}> {/* ✅ Changed xl={8} to xl={6} */}
          <DashboardTotalCountCard
            resource="deals"
            isLoading={isDealsLoading}
            totalCount={dealsCount?.data.count}
          />
        </Col>
        <Col xs={24} sm={24} xl={6}> {/* ✅ New column for conversion rate */}
          <DashboardTotalCountCard
            resource="conversionRate"
            isLoading={false}
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
          {/* <DashboardLatestActivities /> */}
        </Col>
      </Row>

      {/* ===== Task Activity Tracker ===== */}
      <Row gutter={[32, 32]} style={{ marginTop: "32px" }}>
        <Col xs={24}>
          {/* <TaskActivityTracker /> */}
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