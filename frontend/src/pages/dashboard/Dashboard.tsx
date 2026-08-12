import { useEffect, useState } from "react";
import axios from "axios";
import StatCard from "../../components/dashboard/StatCard";

import { getDashboard } from "../../api/dashboard.api";

import { useAppSelector } from "../../app/hooks";

import RecentCustomers from "../../components/dashboard/RecentCustomers";
import RecentStockMovements from "../../components/dashboard/RecentStockMovements";
import RecentChallans from "../../components/dashboard/RecentChallans";

const Dashboard = () => {
  const user = useAppSelector((state) => state.auth.user);

  const [dashboard, setDashboard] = useState<any>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getDashboard();

        setDashboard(response.dashboard);
      } catch (error) {
        console.error(error);

        setError(
          axios.isAxiosError(error)
            ? error.response?.data?.message || "Failed to load dashboard"
            : "Failed to load dashboard",
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="rounded-xl border bg-white p-10 text-center">
        <p className="text-sm text-gray-500">Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6">
        <p className="font-medium text-red-800">Unable to load dashboard</p>

        <p className="mt-1 text-sm text-red-600">{error}</p>
      </div>
    );
  }

  if (!dashboard) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}

      <div>
        <p className="text-sm text-gray-500">Welcome back</p>

        <h1 className="mt-1 text-2xl font-bold text-gray-900">{user?.name}</h1>

        <p className="mt-1 text-sm text-gray-500">
          Here's an overview of your operations.
        </p>
      </div>

      {/* Dashboard content will go here */}
      {dashboard.role === "ADMIN" && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              label="Total Customers"
              value={dashboard.stats.totalCustomers}
            />

            <StatCard
              label="Total Products"
              value={dashboard.stats.totalProducts}
            />

            <StatCard
              label="Low Stock"
              value={dashboard.stats.lowStockProducts}
              description="Products requiring attention"
            />

            <StatCard
              label="Total Challans"
              value={dashboard.stats.totalChallans}
            />
          </div>
        </>
      )}

      {dashboard.role === "SALES" && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <StatCard
            label="Total Customers"
            value={dashboard.stats.totalCustomers}
          />

          <StatCard
            label="Lead Customers"
            value={dashboard.stats.leadCustomers}
          />

          <StatCard
            label="Upcoming Follow-ups"
            value={dashboard.stats.upcomingFollowUps}
          />
        </div>
      )}

      {dashboard.role === "WAREHOUSE" && (
        <div className="grid gap-4 sm:grid-cols-2">
          <StatCard
            label="Total Products"
            value={dashboard.stats.totalProducts}
          />

          <StatCard
            label="Low Stock"
            value={dashboard.stats.lowStockProducts}
            description="Products requiring attention"
          />
        </div>
      )}

      {dashboard.role === "ACCOUNTS" && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Total Challans"
            value={dashboard.stats.totalChallans}
          />

          <StatCard label="Draft" value={dashboard.stats.draftChallans} />

          <StatCard
            label="Confirmed"
            value={dashboard.stats.confirmedChallans}
          />

          <StatCard
            label="Cancelled"
            value={dashboard.stats.cancelledChallans}
          />
        </div>
      )}

      {dashboard.role === "ADMIN" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <RecentCustomers customers={dashboard.recentCustomers} />

          <RecentStockMovements movements={dashboard.recentStockMovements} />

          <RecentChallans challans={dashboard.recentChallans} />
        </div>
      )}

      {dashboard.role === "SALES" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <RecentCustomers customers={dashboard.recentCustomers} />

          <RecentChallans challans={dashboard.recentChallans} />
        </div>
      )}

      {dashboard.role === "WAREHOUSE" && (
        <RecentStockMovements movements={dashboard.recentStockMovements} />
      )}

      {dashboard.role === "ACCOUNTS" && (
        <RecentChallans challans={dashboard.recentChallans} />
      )}
    </div>
  );
};

export default Dashboard;
