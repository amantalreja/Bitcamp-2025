import React, { useState, useEffect } from 'react';
import './Table.css';

function Table({ data: initialData }) {
  // Use the passed JSON data as initial state
  const [data, setData] = useState(initialData);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  // Update state if parent component data changes
  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  // Helper function: format number with commas
  const formatNumber = (value) => {
    return typeof value === 'number' ? value.toLocaleString() : value;
  };

  const sortTable = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }

    const sortedData = [...data].sort((a, b) => {
      if (typeof a[key] === 'string') {
        return direction === 'asc'
          ? a[key].localeCompare(b[key])
          : b[key].localeCompare(a[key]);
      } else {
        return direction === 'asc'
          ? a[key] - b[key]
          : b[key] - a[key];
      }
    });

    setData(sortedData);
    setSortConfig({ key, direction });
  };

  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th onClick={() => sortTable('merchantName')}>Merchant Name</th>
            <th onClick={() => sortTable('numberOfDisputes')}>Number of Disputes</th>
            <th onClick={() => sortTable('deniedPercentage')}>Denied Dispute %</th>
            <th onClick={() => sortTable('totalTransactions')}>Total Transactions</th>
            <th onClick={() => sortTable('disputeRate')}>Dispute Rate (%)</th>
            <th onClick={() => sortTable('avgResolutionTime')}>Avg Resolution Time</th>
            <th onClick={() => sortTable('merchantCategory')}>Merchant Category</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              <td>{row.merchantName}</td>
              <td>{formatNumber(row.numberOfDisputes)}</td>
              <td style={{ color: row.deniedPercentage > 50 ? 'red' : 'inherit' }}>
                {row.deniedPercentage}%
              </td>
              <td>{formatNumber(row.totalTransactions)}</td>
              <td>{row.disputeRate}%</td>
              <td>{row.avgResolutionTime}</td>
              <td>{row.merchantCategory}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
