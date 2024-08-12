import React, { useEffect, useState } from 'react';
import axios from 'axios';
import * as d3 from 'd3';

const FeatureImportanceApp = () => {
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [topN, setTopN] = useState(10);  // New state to control how many top features to display

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

    useEffect(() => {
        if (!loading && !error) {
            // Clear previous chart
            d3.select('#chart').selectAll('*').remove();

            // Set up SVG and margins
            const margin = { top: 20, right: 30, bottom: 40, left: 180 };
            const width = 960 - margin.left - margin.right;
            const height = topN * 30 + margin.top + margin.bottom;

            const svg = d3.select('#chart')
                .append('svg')
                .attr('width', width + margin.left + margin.right)
                .attr('height', height + margin.top + margin.bottom)
                .append('g')
                .attr('transform', `translate(${margin.left},${margin.top})`);

            // Sort data and slice the top N features
            const sortedData = [...chartData].sort((a, b) => b.importance - a.importance).slice(0, topN);

            // Set up scales
            const x = d3.scaleLinear()
                .domain([0, d3.max(sortedData, d => d.importance)])
                .range([0, width]);

            const y = d3.scaleBand()
                .domain(sortedData.map(d => d.feature))
                .range([0, height - margin.top - margin.bottom])
                .padding(0.1);

            // Add X axis
            svg.append('g')
                .attr('transform', `translate(0,${height - margin.top - margin.bottom})`)
                .call(d3.axisBottom(x).ticks(5));

            // Add Y axis
            svg.append('g')
                .call(d3.axisLeft(y));

            // Add bars
            svg.selectAll('rect')
                .data(sortedData)
                .enter()
                .append('rect')
                .attr('x', 0)
                .attr('y', d => y(d.feature))
                .attr('width', d => x(d.importance))
                .attr('height', y.bandwidth())
                .attr('fill', '#c23531');
        }
    }, [chartData, loading, error, topN]);

    const handleSliderChange = (event) => {
        setTopN(event.target.value);
    };

    return (
        <div>
            <h1>Feature Importances Chart</h1>
            <label htmlFor="topNSlider">Display Top N Features: {topN}</label>
            <input 
                type="range" 
                id="topNSlider" 
                min="1" 
                max={chartData.length} 
                value={topN} 
                onChange={handleSliderChange} 
                style={{ width: '100%' }}
            />
            {loading ? (
                <p>Loading data...</p>
            ) : error ? (
                <p>{error}</p>
            ) : (
                <div id="chart"></div>
            )}
        </div>
    );
};

export default FeatureImportanceApp;
