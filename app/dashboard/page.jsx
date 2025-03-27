"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        router.push("/auth/login");
        return;
      }
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/user`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }
        const userData = await response.json();
        setUser(userData);
        router.push("/home");
      } catch (err) {
        console.error(err);
        localStorage.removeItem("authToken");
        router.push("/auth/login");
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-dvh">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Welcome, {user?.name}</h1>
          <h1 className="text-2xl font-bold">Welcome, {user?.name}</h1>
          <div className="flex space-x-4">
            <Link
              href="/profile"
              className="px-4 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
            >
              View Profile
            </Link>
            <button
              onClick={() => {
                localStorage.removeItem("authToken");
                router.push("/auth/login");
              }}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
            >
              Logout
            </button>
          </div>
        </div>

        {user?.type === "candidate" && <CandidateDashboard user={user} />}

        {user?.type === "hr" && <HRDashboard user={user} />}

        {user?.type === "hrManager" && <HRManagerDashboard user={user} />}
      </div>
    </div>
  );
}

function CandidateDashboard({ user }) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Candidate Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DashboardCard
          title="Job Applications"
          count="0"
          icon="📝"
          description="View and manage your job applications"
        />
        <DashboardCard
          title="Saved Jobs"
          count="0"
          icon="⭐"
          description="Jobs you've saved for later"
        />
        <DashboardCard
          title="Profile Completion"
          count="25%"
          icon="✓"
          description="Complete your profile to attract more recruiters"
        />
      </div>
    </div>
  );
}

function HRDashboard({ user }) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">HR Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DashboardCard
          title="Active Jobs"
          count="0"
          icon="📋"
          description="Jobs you've posted that are currently active"
        />
        <DashboardCard
          title="Candidates"
          count="0"
          icon="👥"
          description="Candidates who applied to your jobs"
        />
        <DashboardCard
          title="Interviews"
          count="0"
          icon="🗓️"
          description="Upcoming interviews with candidates"
        />
      </div>
    </div>
  );
}

function HRManagerDashboard({ user }) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">HR Manager Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DashboardCard
          title="Team Members"
          count="0"
          icon="👥"
          description="HR team members you manage"
        />
        <DashboardCard
          title="Total Jobs"
          count="0"
          icon="📝"
          description="All active jobs across departments"
        />
        <DashboardCard
          title="Analytics"
          count="View"
          icon="📊"
          description="Hiring metrics and department analytics"
        />
      </div>
    </div>
  );
}

function DashboardCard({ title, count, icon, description }) {
  return (
    <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium text-lg text-gray-800">{title}</h3>
          <p className="text-sm text-gray-600 mt-1">{description}</p>
        </div>
        <span className="text-3xl">{icon}</span>
      </div>
      <div className="mt-4">
        <span className="text-2xl font-bold">{count}</span>
      </div>
    </div>
  );
}
