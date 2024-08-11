import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ReactECharts from 'echarts-for-react';

const FeatureImportanceApp = () => {
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch the data from the FastAPI server
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:8000/readfile/');
                const data = response.data.data;
                setChartData(data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching data:", err);
                setError("Failed to load data");
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Generate chart options
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
                    interval: 0,
                    formatter: (value) => value,
                },
            },
            series: [
                {
                    data: importances,
                    type: 'bar',
                    itemStyle: {
                        color: '#c23531',
                    },
                    barCategoryGap: '20%', // Adjusted space between bars
                    barGap: '10%', // Space between bars in the same category
                },
            ],
        };
    };

    // Set height to be 10 times the base height (e.g., 600px)
    const calculateChartHeight = () => {
        const baseHeight = 600; // Base height in pixels
        return `${baseHeight * 10}px`; // Height 10 times the base height
    };

    return (
        <div>
            <h1>Feature Importances Chart</h1>
            {loading ? (
                <p>Loading data...</p>
            ) : error ? (
                <p>{error}</p>
            ) : (
                <ReactECharts
                    option={generateChartOptions()}
                    style={{ height: calculateChartHeight(), width: '100%' }} // Set the chart height
                />
            )}
        </div>
    );
};

export default FeatureImportanceApp;
