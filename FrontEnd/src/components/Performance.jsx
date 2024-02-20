import React from 'react';
import { Bar } from 'react-chartjs-2';
import styled from 'styled-components';

// Dữ liệu mẫu
const data = {
  labels: ['CPU', 'Memory', 'Disk'],
  datasets: [
    {
      label: '% Usage',
      data: [80, 60, 40], // Thay đổi dữ liệu này tùy theo nhu cầu
      backgroundColor: ['#ff6384', '#36a2eb', '#ffce56'],
    },
  ],
};

// CSS động sử dụng styled-components
const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400px;
  width: 600px;
`;

const ChartContainer = styled.div`
  width: 400px;
`;

const Chart = () => {
  return (
    <Container>
      <ChartContainer>
        <Bar
          data={data}
          options={{
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
                max: 100,
                ticks: {
                  stepSize: 10,
                },
              },
            },
          }}
        />
      </ChartContainer>
    </Container>
  );
};

export default Chart;