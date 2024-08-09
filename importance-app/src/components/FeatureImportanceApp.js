import React, { useState } from 'react';
import axios from 'axios';
import ReactECharts from 'echarts-for-react';

const FeatureImportanceApp = () => {
    const [chartData, setChartData] = useState([]);

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post('http://localhost:8000/uploadfile/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            // Process the data into the format needed for the chart
            const data = response.data.data;
            setChartData(data);
        } catch (error) {
            console.error("Error uploading file:", error);
        }
    };

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
            <h1>Upload Excel to Plot Feature Importances</h1>
            <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
            {chartData.length > 0 && (
                <ReactECharts
                    option={generateChartOptions()}
                    style={{ height: '600px', width: '100%' }}
                />
            )}
        </div>
    );
};

export default FeatureImportanceApp;
