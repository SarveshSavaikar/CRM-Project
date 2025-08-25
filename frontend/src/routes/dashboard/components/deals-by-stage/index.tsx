import React from 'react';
import { Card } from 'antd';
import { Column } from '@ant-design/plots';
import { DollarOutlined } from '@ant-design/icons';

export const DealsByStage = () => {
  // Hardcoded data with stage names
  const data = [
    { stage: 'Discovery', value: 80 },
    { stage: 'Proposal', value: 60 },
    { stage: 'Won', value: 40 },
  ];

  const config = {
    data,
    xField: 'stage',
    yField: 'value',
    seriesField: 'stage',
    color: '#52c41a',
    columnStyle: {
      radius: [5, 5, 0, 0],
    },
    legend: undefined,
    label: undefined,
    tooltip: undefined,
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: true,
      },
    },
    yAxis: {
      label: {
        formatter: (v: any) => `${v}`,
      },
    },
    // Increased the height of the graph
    height: 340, 
  };

  return (
    <Card
      // Increased the height of the card
      style={{ height: '460px' }}
      headStyle={{ padding: '8px 16px' }}
      bodyStyle={{ padding: '1rem' }}
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <DollarOutlined style={{ marginRight: '8px' }} />
          <h3 style={{ margin: '0', fontSize: '1rem', fontWeight: 'bold' }}>Deals by Stage</h3>
        </div>
      }
    >
      <Column {...config} />
    </Card>
  );
};

export default DealsByStage;