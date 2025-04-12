//App.jsx

import './Map.css';
import React, { useEffect, useState } from "react";
import * as d3 from 'd3'
import Papa from 'papaparse';
import stateData from "./states.json";

const mapRatio = 0.5
function filterNulls(data) {
    return data.filter(row => row[0] !== null);
}
function loadCSV(filePath) {
    return new Promise((resolve, reject) => {
        Papa.parse(filePath, {
            download: true, // If the file is remote  // Assume the first row contains headers
            dynamicTyping: true, // Automatically infer data types
            complete: (results) => {
                resolve(results.data);  // Resolve with the 2D arra
            },
            error: (error) => {
                reject(error);
                // Reject with the error
            }
        });
    });
}
const margin = {
    top: 10,
    bottom: 10,
    left: 10,
    right: 10
}
const populateAndSortTable = (data, columnIndex, sortOrder) => {
    const tableBody = document.querySelector('tbody');

    // Clear any existing rows
    tableBody.innerHTML = '';

    // Sort the data first
    const sortedData = [...data].sort((a, b) => {
        const valueA = a[columnIndex].toLowerCase();
        const valueB = b[columnIndex].toLowerCase();

        if (sortOrder === 'asc') {
            return valueA < valueB ? -1 : 1;
        } else { // Descending
            return valueA > valueB ? -1 : 1;
        }
    });

    // Create rows and cells (populating the table)
    sortedData.forEach(rowData => {
        const row = tableBody.insertRow();
        rowData.forEach(cellData => {
            const cell = row.insertCell();
            cell.textContent = cellData;
            cell.style.border = '1px solid black';
            cell.style.padding = '8px';
        });
    });
};

const colorScale = ["#B9EDDD", "#87CBB9", "#569DAA", "#577D86"];

function Map({ setInput, setTable2Data}) {
    const[state,setUSstate]=useState('Maryland')
    const [renderOnce, setRenderOnce] = useState(0);
    const [isLoading, setIsLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error state
    const [total,setTotal] =useState([10,20,30,40,50,60,10,20,30,50,40]);
    const some = () => {

        let width = parseInt(d3.select(document.querySelector('.viz')).style('width'))

        let height = width * mapRatio / 1.1
        width = (width - margin.left - margin.right) / 1.1;

        const svg = d3.select('.viz').append('svg')
            .attr('class', 'center-container')
            .attr('height', height + margin.top + margin.bottom)
            .attr('width', width + margin.left + margin.right);

        svg.append('rect')
            .attr('class', 'background center-container')
            .attr('height', height + margin.top + margin.bottom)
            .attr('width', width + margin.left + margin.right)

        // Creating projection, it's best to use 'geoAlbersUsa' projection if you're rendering USA map and for other maps use 'geoMercator'.
        const projection = d3.geoAlbersUsa()
            .translate([width / 2, height / 2])
            .scale(width);

        // Creating path generator fromt the projecttion created above.
        const pathGenerator = d3.geoPath()
            .projection(projection);

        // Creating the container
        const g = svg.append("g")
            .attr('class', 'center-container center-items us-state')
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)

        // Creating state layer on top of counties layer.
        g.append("g")
            .attr("id", "states")
            .selectAll("path")
            .data(stateData.features)
            .enter()
            .append("path")
            .attr("key", feature => {
                return feature.properties.NAME
            })
            .attr("d", pathGenerator)
            .attr("class", "state")
            // Here's an example of what I was saying in my previous comment.
            .attr("fill", colorGenerator)
            .on("click", handleZoom)

        function handleZoom(stateFeature) {
            function filterRowsByFirstColumn(data, value) {
                return data.filter(row => row[0].trim().localeCompare(value.trim())===0&&row[0].trim().length===value.trim().length);
              }
              function calculateColumnSums(data) {
                const columnSums = data.reduce((sums, row) => {
                  for (let i = 0; i < row.length; i++) {
                    sums[i] = (sums[i] || 0) + Number(row[i]);
                  }
                  return sums;
                }, []);

                return columnSums;
              }
            loadCSV('https://raw.githubusercontent.com/amantalreja/Fannnie-Mae-Challenge/main/mortgage-master/src/Disaster_Risk_Summary_Final.csv')
                .then(csvData => {
                 //setInput(filterNulls(csvData)); // Update state with CSV data
                    //populateAndSortTable(filterNulls(csvData),1,'asc'); // Update state with CSV data

                    const give = [
                        ['Row55 - Data 1', 'Row 1 - Data 2', 'Row 1 - Data 3', 'Row 1 - Data 4', 'Row 1 - Data 5', 'Row 1 - Data 6'],
                        ['aow 2 - Data 1', 'tow 2 - Data 2', 'Row 2 - Data 3', 'Row 2 - Data 4', 'Row 2 - Data 5', 'Row 2 - Data 6'],
                        ['aow 2 - Data 1', 'tow 2 - Data 2', 'Row 2 - Data 3', 'Row 2 - Data 4', 'Row 2 - Data 5', 'Row 2 - Data 6'],        // ... more rows with unique values
                    ];
                    setUSstate(stateFeature.target.__data__.properties.NAME);
                    csvData= filterRowsByFirstColumn(filterNulls(csvData),stateFeature.target.__data__.properties.NAME)
                    setTotal(calculateColumnSums(filterNulls(csvData)))

                    setInput(filterNulls(csvData)); // Update state with CSV data

                    populateAndSortTable(filterNulls(csvData), 1, 'asc'); // Update state with CSV data
                })
                .catch(error => {
                    setError(error); // Store the error
                    populateAndSortTable([[[1, 2, 3, 4, 5], [1, 2, 3, 4, 5], [1, 2, 3, 4, 5], [1, 2, 3, 4, 5], [1, 2, 3, 4, 5], [1, 2, 3, 4, 5], [1, 2, 3, 4, 5], [1, 2, 3, 4, 5], [1, 2, 3, 4, 5], [1, 2, 3, 4, 5]]], 1, 'asc');
                    setIsLoading(false);
                    console.log(error)
                });
                // ... more rows with unique values
            // This is how you can access the data of the clicked state.
            console.log(stateFeature.target.__data__.properties.NAME);
        }


    }

    // A random color generator
    useEffect(() => { if (renderOnce === 0) { some(); setRenderOnce(1)}; console.log("MEEE",total) }, [renderOnce, some,total]);
    const colorGenerator = () => {
        return colorScale[Math.floor(Math.random() * 4)]
    }


    return (
        <div style={{textAlign:'center',marginTop: '20px'}}>
            <h1 style={{color:'white'}}> Mortgage Master</h1>
        <div style={{ display: 'flex' }}>
            <div style={{ color: "white", width: "250px" }}>



                <div className="map-info-container">
                    <h1>{state}</h1>
                    <p style={{ color: 'white' }}>Total Disaster Count: </p>
                    <p style={{ color: 'white' }}>Biological <b>{total[2]}</b></p>
                    <p style={{ color: 'white' }}>Drought <b>{total[3]}</b></p>
                    <p style={{ color: 'white' }}>Earthquake <b>{total[4]}</b></p>
                    <p style={{ color: 'white' }}>Fire <b>{total[5]}</b></p>
                    <p style={{ color: 'white' }}>Flood <b>{total[6]}</b></p>
                    <p style={{ color: 'white' }}>Hurricane <b>{total[7]}</b></p>
                    <p style={{ color: 'white' }}>Severe Storm <b>{total[8]}</b></p>
                    <p style={{ color: 'white' }}>Snow Storm <b>{total[9]}</b></p>
                    <p style={{ color: 'white' }}>Tornado <b>{total[10]}</b></p>
                </div>
            </div>
            <div class="viz" style={{ flex: 1 }}></div>

        </div>
        </div>
    );
}

export default Map;
