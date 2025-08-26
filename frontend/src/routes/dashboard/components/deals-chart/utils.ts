import type { GetFieldsFromList } from "@refinedev/nestjs-query";

import dayjs from "dayjs";

import type { DashboardDealsChartQuery } from "@/graphql/types";
import { Result } from "antd";

type DealStage = GetFieldsFromList<DashboardDealsChartQuery>;

type DealAggregate = DealStage["dealsAggregate"][0];

interface MappedDealData {
  timeUnix: number;
  timeText: string;
  value: number;
  state: string;
}

const filterDeal = (deal?: DealAggregate) =>
  deal?.groupBy?.closeDateMonth && deal.groupBy.closeDateYear;

const mapDeals = (
  deals: any[] = [],
  state: string,
): MappedDealData[] => {
  return deals.map((deal) => {


    // # Create a date for the 1st of that month
    // dt = datetime.datetime(closeDateYear, closeDateMonth, 1)

    const date: Date = new Date(deal.close_date);

    const year = date.getFullYear();
    const month = date.getMonth() + 1;

    const formatted = new Intl.DateTimeFormat("en-US", {
      month: "short",
      year: "numeric",
    }).format(date);

    return {
      timeUnix: dayjs(`${year}-${month}-01`).unix(),
      timeText: formatted,
      value: deal.value ?? 0,
      state,
    };
  });
};

export const mapDealsData = (
  dealStages: any[] = [],
): MappedDealData[] => {
  console.log("dealStages", dealStages)
  const won = dealStages.filter((stage) => stage.stage_name === "Closed Won");
  console.log("WON :- ", won)
  const wonDeals = mapDeals(won, "Won");

  const lost = dealStages.filter((stage) => stage['stage_name'] === "Closed Lost");
  console.log("LOST :- ", lost)
  const lostDeals = mapDeals(lost, "Lost");
  const result = [...wonDeals, ...lostDeals].sort((a, b) => a.timeUnix - b.timeUnix)
  console.log("RESULT:- ",result)
  return result;
};
