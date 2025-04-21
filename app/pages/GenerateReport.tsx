import React, { useState } from 'react';
import axios from 'axios';

const GenerateReport: React.FC = () => {
  const [columns, setColumns] = useState<string[]>([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [format, setFormat] = useState('pdf');
  const [fontSize, setFontSize] = useState(10);
  const [lineSpacing, setLineSpacing] = useState(20);
  const [includeHeaders, setIncludeHeaders] = useState(true);
  const [reportTitle, setReportTitle] = useState('Driver Report');
  const [fileUrl, setFileUrl] = useState('');

  const availableColumns = [
    'DriverID',
    'Name',
    'TotalPoints',
    'Infractions',
    'DateJoined',
    'CompanyID'
  ];

  const handleColumnToggle = (col: string) => {
    setColumns(prev =>
      prev.includes(col) ? prev.filter(c => c !== col) : [...prev, col]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      format,
      reportTitle,
      columns,
      filters: {
        StartDate: startDate,
        EndDate: endDate
      },
      sortBy: 'TotalPoints DESC',
      layout: {
        fontSize: Number(fontSize),
        lineSpacing: Number(lineSpacing),
        includeHeaders,
        pageSize: [612, 792]
      }
    };

    try {
      const res = await axios.post(
        'https://xyoottz426.execute-api.us-east-1.amazonaws.com/api/generate-report',
        payload
      );

      if (res.data?.path) {
        setFileUrl(res.data.path); // full EC2 URL returned from backend
      } else {
        console.warn('No path in response:', res.data);
      }
    } catch (err) {
      console.error('Failed to generate report', err);
      alert('Error generating report. See console for details.');
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Generate Custom Report</h2>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 shadow-md rounded-xl">
        <div>
          <label className="font-medium">Report Title:</label>
          <input
            type="text"
            className="border w-full p-2 rounded mt-1"
            value={reportTitle}
            onChange={(e) => setReportTitle(e.target.value)}
          />
        </div>

        <div>
          <label className="font-medium">Select Columns:</label>
          <div className="grid grid-cols-2 gap-2 mt-1">
            {availableColumns.map((col) => (
              <label key={col} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={columns.includes(col)}
                  onChange={() => handleColumnToggle(col)}
                />
                <span>{col}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex gap-4">
          <div>
            <label className="font-medium">Start Date:</label>
            <input
              type="date"
              className="border p-2 rounded w-full"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div>
            <label className="font-medium">End Date:</label>
            <input
              type="date"
              className="border p-2 rounded w-full"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="font-medium">Report Format:</label>
          <select
            className="border w-full p-2 rounded mt-1"
            value={format}
            onChange={(e) => setFormat(e.target.value)}
          >
            <option value="pdf">PDF</option>
            <option value="csv">CSV</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="font-medium">Font Size:</label>
            <input
              type="number"
              min="6"
              className="border w-full p-2 rounded"
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
            />
          </div>
          <div>
            <label className="font-medium">Line Spacing:</label>
            <input
              type="number"
              min="10"
              className="border w-full p-2 rounded"
              value={lineSpacing}
              onChange={(e) => setLineSpacing(Number(e.target.value))}
            />
          </div>
        </div>

        <div>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={includeHeaders}
              onChange={() => setIncludeHeaders(!includeHeaders)}
            />
            <span>Include Header</span>
          </label>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Generate Report
        </button>
      </form>

      {fileUrl && (
        <div className="mt-4">
          <p className="text-green-600">Report generated successfully!</p>
          <a
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-blue-600"
          >
            Download Report
          </a>
        </div>
      )}
    </div>
  );
};

export default GenerateReport;
