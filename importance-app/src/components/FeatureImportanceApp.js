import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ReactECharts from 'echarts-for-react';

const FeatureImportanceApp = () => {
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        // Fetch the data from the FastAPI server
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:8000/readfile/');
                const data = response.data.data;
                setChartData(data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    const generateChartOptions = () => {
        const features = chartData.map(item => item.feature);
        const importances = chartData.map(item => item.importance);

        return {
            title: {
                text: 'Feature Importances',
            },
            tooltip: {},
            grid: {
                left: '10%',
                right: '10%',
                bottom: '10%',
                containLabel: true,
            },
            xAxis: {
                type: 'value',
                name: 'Importance',
            },
            yAxis: {
                type: 'category',
                data: features,
                name: 'Feature',
                axisLabel: {
                    interval: 0, // Ensure all labels are shown
                    formatter: (value) => value, // Display full labels
                },
            },
            series: [
                {
                    data: importances,
                    type: 'bar',
                    itemStyle: {
                        color: '#c23531',
                    },
                    barCategoryGap: '30%', // Controls the space between bars
                },
            ],
        };
    };

    return (
        <div>
            <h1>Feature Importances Chart</h1>
            {chartData.length > 0 ? (
                <ReactECharts
                    option={generateChartOptions()}
                    style={{ height: '600px', width: '100%' }}
                />
            ) : (
                <p>Loading data...</p>
            )}
        </div>
    );
};

export default FeatureImportanceApp;
