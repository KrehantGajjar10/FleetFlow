// src/pages/Analytics/Analytics.jsx
import React, { useState, useEffect, useRef } from 'react';
import KPIBox from '../../components/KPIBox/KPIBox';
import { fetchAnalyticsData } from '../../services/api';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import './Analytics.css';

const Analytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  
  // 1. Create a reference to the DOM element we want to turn into a PDF
  const reportTemplateRef = useRef(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const analyticsResult = await fetchAnalyticsData();
      setData(analyticsResult);
      setLoading(false);
    };
    loadData();
  }, []);

  // 2. The PDF Generation Logic
  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    try {
      const element = reportTemplateRef.current;
      
      // Capture the element as a high-res canvas (scale: 2 improves text crispness)
      const canvas = await html2canvas(element, { 
        scale: 2,
        backgroundColor: '#f8fafc', // Match our crisp white theme background
        useCORS: true 
      });
      
      const imgData = canvas.toDataURL('image/png');
      
      // Initialize a standard A4 portrait PDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      
      // Calculate height to maintain aspect ratio
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      // Add the image to the PDF and trigger the download
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('FleetFlow_Operational_Report.pdf');
      
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  if (loading) return <div>Loading Analytics Data...</div>;

  return (
    <div className="analytics-container">
      <div className="registry-toolbar" style={{ justifyContent: 'flex-end', marginBottom: '1rem' }}>
        <button 
          className="btn-primary" 
          onClick={handleDownloadPDF}
          disabled={isDownloading}
          style={{ width: 'auto' }} // Override the 100% width from global.css
        >
          {isDownloading ? 'Generating PDF...' : 'Download PDF Report'}
        </button>
      </div>

      {/* 3. Wrap everything we want to capture in this referenced div */}
      <div ref={reportTemplateRef} style={{ padding: '1rem' }}>
        
        {/* Report Header (Only visible in the PDF or at the top of the section) */}
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ color: 'var(--text-main)', fontSize: '1.5rem', marginBottom: '0.5rem' }}>
            Operational Analytics Report
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Generated on: {new Date().toLocaleDateString()}
          </p>
        </div>

        <div className="kpi-grid">
          <KPIBox title="Total Fuel Cost" value={data.kpis.totalFuelCost} />
          <KPIBox title="Fleet ROI" value={data.kpis.fleetROI} />
          <KPIBox title="Utilization Rate" value={data.kpis.utilizationRate} />
        </div>

        <div className="chart-grid">
          <div className="chart-card">
            <div className="chart-title">Fuel Efficiency Trend (km/L)</div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.fuelEfficiencyTrend}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="currentYear" stroke="var(--primary-color)" strokeWidth={3} name="Current" />
                <Line type="monotone" dataKey="target" stroke="var(--text-muted)" strokeDasharray="5 5" name="Target" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card">
            <div className="chart-title">Top 5 Costliest Vehicles</div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.costliestVehicles}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip cursor={{fill: 'rgba(37, 99, 235, 0.05)'}} />
                <Bar dataKey="cost" fill="var(--danger)" radius={[6, 6, 0, 0]} name="Cost (k)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="table-container" style={{ marginTop: '1.5rem' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Month</th>
                <th>Revenue</th>
                <th>Fuel Cost</th>
                <th>Maintenance</th>
                <th>Net Profit</th>
              </tr>
            </thead>
            <tbody>
              {data.financialSummary.map((row) => (
                <tr key={row.id}>
                  <td style={{ fontWeight: '600' }}>{row.month}</td>
                  <td style={{ color: 'var(--success)', fontWeight: '600' }}>{row.revenue}</td>
                  <td>{row.fuelCost}</td>
                  <td>{row.maintenance}</td>
                  <td style={{ fontWeight: '700' }}>{row.netProfit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};

export default Analytics;