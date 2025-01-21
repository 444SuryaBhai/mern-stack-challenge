import React, { useEffect, useState } from 'react';
import { Chart as PrimeChart } from 'primereact/chart';

const Chart: React.FC<any> = ({ type, labels, cdata }) => {
    const [chartData, setChartData] = useState<any>({});
    const [chartOptions, setChartOptions] = useState<any>({});

    useEffect(() => {
        if (type === 'bar') {
            const barData = {
                labels: labels,
                datasets: [
                    {
                        label: 'Sales',
                        data: cdata,
                        backgroundColor: [
                            'rgba(255, 159, 64, 0.2)',
                            'rgba(75, 192, 192, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(153, 102, 255, 0.2)',
                        ],
                        borderColor: [
                            'rgb(255, 159, 64)',
                            'rgb(75, 192, 192)',
                            'rgb(54, 162, 235)',
                            'rgb(153, 102, 255)',
                        ],
                        borderWidth: 1,
                    },
                ],
            };

            const barOptions = {
                scales: {
                    y: {
                        beginAtZero: true,
                    },
                },
            };

            setChartData(barData);
            setChartOptions(barOptions);
        } else if (type === 'pie') {
            const pieData = {
                labels: labels,
                datasets: [
                    {
                        data: cdata,
                        backgroundColor: [
                            'rgba(255, 159, 64, 0.2)',
                            'rgba(75, 192, 192, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                        ],
                        hoverBackgroundColor: [
                            'rgba(255, 159, 64, 0.4)',
                            'rgba(75, 192, 192, 0.4)',
                            'rgba(54, 162, 235, 0.4)',
                        ],
                    },
                ],
            };

            const pieOptions = {
                plugins: {
                    legend: {
                        position: 'right', // Positions the legend to the right of the chart
                        align: 'center', // Aligns the legend items
                    }
                },
                responsive: true,
                maintainAspectRatio: false, // Allows flexible resizing
            };

            setChartData(pieData);
            setChartOptions(pieOptions);
        }
    }, [type, labels, cdata]); // Re-run the effect if type, labels or cdata change

    return (
        <div className="card" style={{ height: '200px' }}>
            <PrimeChart type={type} data={chartData} options={chartOptions} />
        </div>
    );
};

export default Chart;