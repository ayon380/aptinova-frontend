'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card';
import { BarChart, LineChart, PieChart, Download, FileSpreadsheet, FilePieChart } from 'lucide-react';

export default function AnalyticsPage() {
  const [timeFrame, setTimeFrame] = useState('month');

  const handleExportReport = (reportType) => {
    // This would connect to your backend to generate a report
    console.log(`Exporting ${reportType} report`);
    // In a real application, this would trigger a download
    alert(`${reportType} report would download here`);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Analytics & Reports</h1>
        <div className="flex gap-3">
          <select 
            value={timeFrame} 
            onChange={(e) => setTimeFrame(e.target.value)}
            className="border rounded-md px-3 py-2"
          >
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="quarter">Last Quarter</option>
            <option value="year">Last Year</option>
          </select>
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-4">Hiring Metrics</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Average Time to Hire</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">21 days</div>
            <p className="text-sm text-muted-foreground mt-2">
              <span className="text-green-500">-2 days</span> from previous {timeFrame}
            </p>
            <div className="h-36 mt-4 flex items-center justify-center text-gray-400">
              <LineChart size={120} />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Applications per Job</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">24.5</div>
            <p className="text-sm text-muted-foreground mt-2">
              <span className="text-green-500">+3.2</span> from previous {timeFrame}
            </p>
            <div className="h-36 mt-4 flex items-center justify-center text-gray-400">
              <BarChart size={120} />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Source Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">LinkedIn: 45%</div>
            <p className="text-sm text-muted-foreground mt-2">
              Indeed: 30%, Direct: 15%, Other: 10%
            </p>
            <div className="h-36 mt-4 flex items-center justify-center text-gray-400">
              <PieChart size={120} />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Interview to Offer Ratio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">18%</div>
            <p className="text-sm text-muted-foreground mt-2">
              <span className="text-red-500">-2%</span> from target
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Offer Acceptance Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">82%</div>
            <p className="text-sm text-muted-foreground mt-2">
              <span className="text-green-500">+5%</span> from previous {timeFrame}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Cost per Hire</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">$4,250</div>
            <p className="text-sm text-muted-foreground mt-2">
              <span className="text-red-500">+$250</span> from target
            </p>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-xl font-semibold mb-4">Available Reports</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="cursor-pointer hover:bg-slate-50 transition-colors" 
          onClick={() => handleExportReport('Recruitment Funnel')}>
          <CardContent className="flex items-center justify-between pt-6">
            <div>
              <h3 className="font-medium">Recruitment Funnel</h3>
              <p className="text-sm text-muted-foreground">
                Applications → Interviews → Offers → Hires
              </p>
            </div>
            <FileSpreadsheet className="text-blue-500" />
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:bg-slate-50 transition-colors" 
          onClick={() => handleExportReport('Time Analysis')}>
          <CardContent className="flex items-center justify-between pt-6">
            <div>
              <h3 className="font-medium">Time Analysis</h3>
              <p className="text-sm text-muted-foreground">
                Review, interview, and decision timeframes
              </p>
            </div>
            <FilePieChart className="text-green-500" />
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:bg-slate-50 transition-colors" 
          onClick={() => handleExportReport('Source Effectiveness')}>
          <CardContent className="flex items-center justify-between pt-6">
            <div>
              <h3 className="font-medium">Source Effectiveness</h3>
              <p className="text-sm text-muted-foreground">
                Quality of candidates by application source
              </p>
            </div>
            <Download className="text-purple-500" />
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h3 className="text-lg font-medium mb-2">Custom Reports</h3>
        <p className="mb-4">Need a specific report not listed above? Our team can generate custom analytics based on your requirements.</p>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
          Request Custom Report
        </button>
      </div>
    </div>
  );
}