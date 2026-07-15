import { useGetDashboardStatsQuery } from "../api/dashboard.api.js";
import StatsCards from "../components/StatsCards.jsx";
import DashboardCharts from "../components/DashboardCharts.jsx";
import PageHeader from "../../../shared/components/PageHeader.jsx";
import Loader from "../../../shared/components/Loader.jsx";
import ErrorState from "../../../shared/components/ErrorState.jsx";

function Dashboard() {
  const { data: response, isLoading, error, refetch } = useGetDashboardStatsQuery();
  const stats = response?.data;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <PageHeader
        title="Dashboard Overview"
        subtitle="High-level statistics, employment distributions, trending skills, and salary analytics"
      />

      {error ? (
        <ErrorState
          title="Failed to Load Dashboard Stats"
          message={error?.data?.message || "There was a problem loading statistics."}
          onRetry={refetch}
        />
      ) : (
        <>
          {/* Stats Summary Cards (Skeletons shown inside when loading) */}
          <StatsCards stats={stats} isLoading={isLoading} />
          
          {isLoading ? (
            <Loader message="Loading analytics details..." />
          ) : (
            stats && (
              <DashboardCharts
                employmentTypeDistribution={stats.employmentTypeDistribution}
                topCompanies={stats.topCompanies}
                skillsFreq={stats.skillsFreq}
                salaryRanges={stats.salaryRanges}
              />
            )
          )}
        </>
      )}
    </div>
  );
}

export default Dashboard;
