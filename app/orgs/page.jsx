'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '../../components/ui/card';
import { 
  BarChart, 
  CalendarDays, 
  FileText, 
  Users 
} from 'lucide-react';

export default function OrganizationDashboard() {
  const [dashboardData, setDashboardData] = useState({
    activeJobPostings: 12,
    applicants: 143,
    upcomingInterviews: 8,
    averageTimeToHire: 21, // days
  });

  // In a real application, you would fetch this data from your API
  // useEffect(() => {
  //   const fetchDashboardData = async () => {
  //     const response = await fetch('/api/org-dashboard');
  //     const data = await response.json();
  //     setDashboardData(data);
  //   };
  //   fetchDashboardData();
  // }, []);

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Organization Dashboard</h1>
      
      {/* Quick Navigation */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Quick Navigation</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Link href="/orgs/jobs" className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg flex items-center gap-3">
            <FileText /> Manage Job Postings
          </Link>
          <Link href="/orgs/applicants" className="p-4 bg-green-50 hover:bg-green-100 rounded-lg flex items-center gap-3">
            <Users /> View Applicants
          </Link>
          <Link href="/orgs/interviews" className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg flex items-center gap-3">
            <CalendarDays /> Schedule Interviews
          </Link>
          <Link href="/orgs/analytics" className="p-4 bg-amber-50 hover:bg-amber-100 rounded-lg flex items-center gap-3">
            <BarChart /> Analytics
          </Link>
        </div>
      </div>
      
      {/* Dashboard Metrics */}
      <h2 className="text-xl font-semibold mb-4">Key Metrics</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Job Postings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{dashboardData.activeJobPostings}</div>
            <p className="text-sm text-muted-foreground mt-2">
              <span className="text-green-500">+2</span> from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Applicants</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{dashboardData.applicants}</div>
            <p className="text-sm text-muted-foreground mt-2">
              <span className="text-green-500">+23</span> from last week
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Upcoming Interviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{dashboardData.upcomingInterviews}</div>
            <p className="text-sm text-muted-foreground mt-2">
              Next one in 2 days
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Time to Hire</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{dashboardData.averageTimeToHire} days</div>
            <p className="text-sm text-muted-foreground mt-2">
              <span className="text-red-500">+3</span> from target
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
      <Card className="mb-8">
        <CardContent className="pt-6">
          <ul className="space-y-4">
            <li className="flex justify-between items-center border-b pb-2">
              <div>
                <p className="font-medium">Senior Developer position updated</p>
                <p className="text-sm text-muted-foreground">Experience requirement changed from 5 to 3 years</p>
              </div>
              <span className="text-sm text-muted-foreground">2 hours ago</span>
            </li>
            <li className="flex justify-between items-center border-b pb-2">
              <div>
                <p className="font-medium">New application received</p>
                <p className="text-sm text-muted-foreground">John Doe applied for UX Designer</p>
              </div>
              <span className="text-sm text-muted-foreground">Yesterday</span>
            </li>
            <li className="flex justify-between items-center">
              <div>
                <p className="font-medium">Interview scheduled</p>
                <p className="text-sm text-muted-foreground">with Sarah Smith for Marketing Manager</p>
              </div>
              <span className="text-sm text-muted-foreground">2 days ago</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}