import './Map.css';
import React, { useEffect, useState } from "react";
import * as d3 from 'd3';
import stateData from "./states.json";
import sampleData from "./SampleData";  // Import your sample data

const mapRatio = 0.5;
const margin = { top: 0, bottom: 0, left: 0, right: 0 };

// Lookup object for state abbreviations.
const stateAbbreviations = {
  "Alabama": "AL", "Alaska": "AK", "Arizona": "AZ", "Arkansas": "AR",
  "California": "CA", "Colorado": "CO", "Connecticut": "CT", "Delaware": "DE",
  "Florida": "FL", "Georgia": "GA", "Hawaii": "HI", "Idaho": "ID",
  "Illinois": "IL", "Indiana": "IN", "Iowa": "IA", "Kansas": "KS",
  "Kentucky": "KY", "Louisiana": "LA", "Maine": "ME", "Maryland": "MD",
  "Massachusetts": "MA", "Michigan": "MI", "Minnesota": "MN", "Mississippi": "MS",
  "Missouri": "MO", "Montana": "MT", "Nebraska": "NE", "Nevada": "NV",
  "New Hampshire": "NH", "New Jersey": "NJ", "New Mexico": "NM", "New York": "NY",
  "North Carolina": "NC", "North Dakota": "ND", "Ohio": "OH", "Oklahoma": "OK",
  "Oregon": "OR", "Pennsylvania": "PA", "Rhode Island": "RI", "South Carolina": "SC",
  "South Dakota": "SD", "Tennessee": "TN", "Texas": "TX", "Utah": "UT",
  "Vermont": "VT", "Virginia": "VA", "Washington": "WA", "West Virginia": "WV",
  "Wisconsin": "WI", "Wyoming": "WY",
  "Puerto Rico": "PR",
  "District of Columbia": "DC"
};

function Map({ setTableData }) {
  const [selectedState, setSelectedState] = useState('Maryland');
  const [renderOnce, setRenderOnce] = useState(0);
  const [error, setError] = useState(null);
  const [aggregates, setAggregates] = useState({
    totalDisputes: 0,
    totalTransactions: 0,
    merchantCount: 0,
    avgDeniedPercentage: 0,
    aggregateDisputeRate: 0
  });

  const drawMap = () => {
    // --- Compute aggregate dispute rates for each state from sampleData ---
    const stateDisputeRates = {};
    sampleData.forEach(d => {
      const s = d.state;
      if (!stateDisputeRates[s]) {
        stateDisputeRates[s] = { totalDisputes: 0, totalTransactions: 0 };
      }
      stateDisputeRates[s].totalDisputes += d.numberOfDisputes;
      stateDisputeRates[s].totalTransactions += d.totalTransactions;
    });
    for (const s in stateDisputeRates) {
      const totals = stateDisputeRates[s];
      totals.disputeRate = totals.totalTransactions ? totals.totalDisputes / totals.totalTransactions : 0;
    }
    const rates = Object.values(stateDisputeRates).map(d => d.disputeRate);
    const minRate = d3.min(rates);
    const maxRate = d3.max(rates);

    // Custom dark blue scheme:
    // Low dispute: medium dark blue (#2E66B3); High dispute: deep blue (#0D1F33)
    const disputeColorScale = d3.scaleLinear()
      .domain([minRate, maxRate])
      .range(["#2E66B3", "#0D1F33"]);

    // --- Set up the map drawing ---
    let width = parseInt(d3.select(document.querySelector('.viz')).style('width'));
    let height = width * mapRatio;  // Map height based on mapRatio.
    width = width - margin.left - margin.right;

    const svg = d3.select('.viz')
      .append('svg')
      .attr('class', 'center-container')
      .attr('height', height)
      .attr('width', width);

    svg.append('rect')
      .attr('class', 'background center-container')
      .attr('height', height)
      .attr('width', width);

    const projection = d3.geoAlbersUsa()
      .translate([width / 2, height / 2])
      .scale(width);

    const pathGenerator = d3.geoPath().projection(projection);

    const g = svg.append("g")
      .attr('class', 'center-container center-items us-state')
      .attr('transform', `translate(${margin.left},${margin.top})`)
      .attr('width', width)
      .attr('height', height);

    // Draw state paths with fill based on dispute rate.
    g.append("g")
      .attr("id", "states")
      .selectAll("path")
      .data(stateData.features)
      .enter()
      .append("path")
      .attr("key", d => d.properties.NAME)
      .attr("d", pathGenerator)
      .attr("class", "state")
      .attr("fill", d => {
        const stateName = d.properties.NAME;
        return stateDisputeRates[stateName]
          ? disputeColorScale(stateDisputeRates[stateName].disputeRate)
          : "#ccc";
      })
      .on("click", handleZoom);

    // Append abbreviated state labels at the centroid of each state.
    g.selectAll("text")
      .data(stateData.features)
      .enter()
      .append("text")
      .attr("x", d => pathGenerator.centroid(d)[0])
      .attr("y", d => pathGenerator.centroid(d)[1])
      .text(d => stateAbbreviations[d.properties.NAME] || d.properties.NAME)
      .attr("text-anchor", "middle")
      .attr("fill", "#eee")
      .attr("font-size", "14px")
      .attr("pointer-events", "none")  // Allow clicks to pass through text.
      .attr("dy", ".35em");

    // When a state is clicked, update aggregates and table.
    function handleZoom(stateFeature) {
      const clickedState = stateFeature.target.__data__.properties.NAME;
      setSelectedState(clickedState);

      const filteredData = sampleData.filter(
        item => item.state.toLowerCase() === clickedState.toLowerCase()
      );

      const totalDisputes = filteredData.reduce((sum, item) => sum + item.numberOfDisputes, 0);
      const totalTransactions = filteredData.reduce((sum, item) => sum + item.totalTransactions, 0);
      const merchantCount = filteredData.length;
      const sumDeniedWeighted = filteredData.reduce((sum, item) => sum + item.deniedPercentage * item.numberOfDisputes, 0);
      const avgDeniedPercentage = totalDisputes ? sumDeniedWeighted / totalDisputes : 0;
      const aggregateDisputeRate = totalTransactions ? (totalDisputes / totalTransactions) * 100 : 0;

      setAggregates({
        totalDisputes,
        totalTransactions,
        merchantCount,
        avgDeniedPercentage,
        aggregateDisputeRate
      });

      setTableData(filteredData);
      console.log(`Clicked state: ${clickedState}`);
    }
  };

  // Render the map only once.
  useEffect(() => {
    if (renderOnce === 0) {
      drawMap();
      setRenderOnce(1);
    }
  }, [renderOnce]);

  // Load default data for Maryland on mount.
  useEffect(() => {
    if (renderOnce === 1) {
      const defaultState = "Maryland";
      const filteredData = sampleData.filter(
        item => item.state.toLowerCase() === defaultState.toLowerCase()
      );
      const totalDisputes = filteredData.reduce((sum, item) => sum + item.numberOfDisputes, 0);
      const totalTransactions = filteredData.reduce((sum, item) => sum + item.totalTransactions, 0);
      const merchantCount = filteredData.length;
      const sumDeniedWeighted = filteredData.reduce((sum, item) => sum + item.deniedPercentage * item.numberOfDisputes, 0);
      const avgDeniedPercentage = totalDisputes ? sumDeniedWeighted / totalDisputes : 0;
      const aggregateDisputeRate = totalTransactions ? (totalDisputes / totalTransactions) * 100 : 0;
      setAggregates({
        totalDisputes,
        totalTransactions,
        merchantCount,
        avgDeniedPercentage,
        aggregateDisputeRate
      });
      setTableData(filteredData);
    }
  }, [renderOnce, setTableData]);

  const formatNumber = d3.format(",");

  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      <h1 style={{ color: 'white' }}>Mortgage Master</h1>
      <div style={{ display: 'flex', gap: '10px' }}>
        {/* Left info panel with increased width */}
        <div style={{ color: "white", width: "340px", textAlign: 'left', paddingLeft: '10px' }}>
          <div className="map-info-container">
            <h1>{selectedState}</h1>
            <p style={{ margin: '10px 0', color: 'white' }}>
              Total Disputes: <b>{formatNumber(aggregates.totalDisputes)}</b>
            </p>
            <p style={{ margin: '10px 0', color: 'white' }}>
              Total Transactions: <b>{formatNumber(aggregates.totalTransactions)}</b>
            </p>
            <p style={{ margin: '10px 0', color: 'white' }}>
              Merchant Count: <b>{formatNumber(aggregates.merchantCount)}</b>
            </p>
            <p style={{ margin: '10px 0', color: 'white' }}>
              Average Denied Percentage: <b>{aggregates.avgDeniedPercentage.toFixed(1)}%</b>
            </p>
            <p style={{ margin: '10px 0', color: 'white' }}>
              Aggregate Dispute Rate: <b>{aggregates.aggregateDisputeRate.toFixed(1)}%</b>
            </p>
          </div>
        </div>
        <div className="viz" style={{ flex: 1 }}></div>
      </div>
    </div>
  );
}

export default Map;
