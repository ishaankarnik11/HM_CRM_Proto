import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Shield, 
  Clock, 
  Wallet,
  Upload,
  UserPlus,
  FileBarChart,
  TrendingUp,
  TrendingDown
} from "lucide-react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useDashboardSummary } from "@/hooks/useEligibilityQueries";
import { useNavigate } from "react-router-dom";

const EligibilityDashboard = () => {
  const { data: dashboardData, isLoading } = useDashboardSummary();
  const navigate = useNavigate();

  const summaryCards = [
    {
      title: "Total Employees",
      value: dashboardData?.totalEmployees.toLocaleString() || "1,247",
      change: "+23",
      changeType: "increase",
      icon: Users,
      color: "bg-blue-500"
    },
    {
      title: "Active Eligibilities", 
      value: dashboardData?.activeEligibilities.toLocaleString() || "1,156",
      change: "+18",
      changeType: "increase",
      icon: Shield,
      color: "bg-green-500"
    },
    {
      title: "Pending Validations",
      value: dashboardData?.pendingValidations.toString() || "23",
      change: "-5",
      changeType: "decrease", 
      icon: Clock,
      color: "bg-orange-500"
    },
    {
      title: "OPD Wallet Balance",
      value: `₹${(dashboardData?.totalOpdWallet / 100000).toFixed(1)}L` || "₹24.6L",
      change: "+₹2.1L",
      changeType: "increase",
      icon: Wallet,
      color: "bg-purple-500"
    }
  ];

  // Prepare chart data
  const pieChartData = dashboardData ? [
    { name: 'Active', value: dashboardData.eligibilityStatusDistribution.Active, color: '#10B981' },
    { name: 'Inactive', value: dashboardData.eligibilityStatusDistribution.Inactive, color: '#6B7280' },
    { name: 'Pending', value: dashboardData.eligibilityStatusDistribution.Pending, color: '#F59E0B' },
    { name: 'Suspended', value: dashboardData.eligibilityStatusDistribution.Suspended, color: '#EF4444' }
  ] : [];

  const barChartData = dashboardData?.opdWalletByCorporate || [];

  const quickActions = [
    { label: "Upload Employees", icon: Upload, href: "/eligibility/upload" },
    { label: "Create Benefit Group", icon: UserPlus, href: "/eligibility/benefit-groups" },
    { label: "Generate Reports", icon: FileBarChart, href: "/eligibility/reports" }
  ];

  const recentActivities = [
    {
      id: 1,
      action: "Employee enrolled",
      details: "Rajesh Verma (RAYMOND1000) enrolled in Premium benefit group",
      timestamp: "2 hours ago",
      type: "enrollment"
    },
    {
      id: 2,
      action: "Benefit group updated",
      details: "Executive benefit group updated with new OPD limits",
      timestamp: "4 hours ago", 
      type: "update"
    },
    {
      id: 3,
      action: "Bulk upload completed",
      details: "45 employees from Tech Innovations Corp successfully uploaded",
      timestamp: "6 hours ago",
      type: "upload"
    },
    {
      id: 4,
      action: "Eligibility validated",
      details: "Kavya Mishra eligibility validated for Annual Health Check",
      timestamp: "8 hours ago",
      type: "validation"
    },
    {
      id: 5,
      action: "OPD wallet credited",
      details: "₹15,000 credited to Suresh Iyer's OPD wallet",
      timestamp: "1 day ago",
      type: "wallet"
    }
  ];

  const getActivityTypeColor = (type: string) => {
    switch (type) {
      case "enrollment": return "bg-green-100 text-green-800";
      case "update": return "bg-blue-100 text-blue-800";
      case "upload": return "bg-purple-100 text-purple-800";
      case "validation": return "bg-orange-100 text-orange-800";
      case "wallet": return "bg-indigo-100 text-indigo-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {summaryCards.map((card, index) => {
          const Icon = card.icon;
          const isIncrease = card.changeType === "increase";
          
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {card.title}
                </CardTitle>
                <div className={`p-2 rounded-full ${card.color}`}>
                  <Icon className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{card.value}</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  {isIncrease ? (
                    <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                  ) : (
                    <TrendingDown className="mr-1 h-3 w-3 text-red-500" />
                  )}
                  <span className={isIncrease ? "text-green-500" : "text-red-500"}>
                    {card.change}
                  </span>
                  <span className="ml-1">from last month</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Commonly used eligibility management actions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Button 
                  key={index} 
                  variant="outline" 
                  className="h-auto p-4 w-full"
                  onClick={() => navigate(action.href)}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  {action.label}
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity Feed */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Latest eligibility management activities across the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <Badge 
                  variant="secondary" 
                  className={`${getActivityTypeColor(activity.type)} capitalize`}
                >
                  {activity.type}
                </Badge>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    {activity.action}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {activity.details}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {activity.timestamp}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Eligibility Status Distribution Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Eligibility Status Distribution</CardTitle>
            <CardDescription>
              Breakdown of employee eligibility statuses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* OPD Wallet by Corporate Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>OPD Wallet by Corporate</CardTitle>
            <CardDescription>
              Total OPD wallet balance across different corporates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barChartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="corporate" 
                    angle={-45}
                    textAnchor="end"
                    height={100}
                    interval={0}
                  />
                  <YAxis 
                    tickFormatter={(value) => `₹${(value / 100000).toFixed(1)}L`}
                  />
                  <Tooltip 
                    formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Wallet Balance']}
                    labelStyle={{ color: '#374151' }}
                  />
                  <Bar dataKey="totalWallet" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EligibilityDashboard;