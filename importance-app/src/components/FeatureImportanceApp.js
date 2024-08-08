import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import ReactECharts from 'echarts-for-react';

const FeatureImportanceApp = () => {
    const [chartData, setChartData] = useState([]);

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = (e) => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 });

            // Process the data into the format needed for the chart
            const headers = worksheet[0];
            const rows = worksheet.slice(1);
            
            const features = rows.map(row => row[0]);
            const importances = rows.map(row => row[1]);

            // Sort data by importance
            const sortedData = features.map((feature, index) => ({
                feature,
                importance: importances[index]
            })).sort((a, b) => b.importance - a.importance);

            setChartData(sortedData);
        };

        reader.readAsArrayBuffer(file);
    };

    const generateChartOptions = () => {
        const features = chartData.map(item => item.feature);
        const importances = chartData.map(item => item.importance);

        return {
            title: {
                text: 'Feature Importances',
            },
            tooltip: {},
            xAxis: {
                type: 'category',
                data: features,
            },
            yAxis: {
                type: 'value',
            },
            series: [
                {
                    data: importances,
                    type: 'bar',
                    itemStyle: {
                        color: '#c23531',
                    },
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
                    style={{ height: '400px', width: '100%' }}
                />
            )}
        </div>
    );
};

export default FeatureImportanceApp;
