// src/pages/admin/AnalyticsDashboard.jsx
import React, { useState, useEffect } from 'react';
import {
  LineChart, 
  BarChart, 
  PieChart, 
  Line, 
  Bar, 
  Pie,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer, 
  Cell, 
  LabelList,
  AreaChart, 
  Area
} from 'recharts';
import {
  Card, 
  CardHeader, 
  CardContent, 
  Grid, 
  Typography,
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  Box
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { format, subDays, parseISO } from 'date-fns';
import { FaChartLine, FaMoneyBillWave, FaShoppingCart, FaUsers, FaUtensils } from 'react-icons/fa';
import AdminSidebar from '../../components/admin/AdminSidebar';
import LoadingSpinner from '../../components/LoadingSpinner';

const AnalyticsDashboard = () => {
  // State for data and filters
  const [timeRange, setTimeRange] = useState('7days');
  const [startDate, setStartDate] = useState(subDays(new Date(), 7));
  const [endDate, setEndDate] = useState(new Date());
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  // Format currency as PKR
  const formatCurrency = (amount) => {
    return `PKR ${Number(amount).toLocaleString()}`;
  };

  // Process data from localStorage
  useEffect(() => {
    try {
      setLoading(true);
      
      // Get data from localStorage
      const orders = JSON.parse(localStorage.getItem('orders')) || [];
      const users = JSON.parse(localStorage.getItem('users')) || [];
      const foodItems = JSON.parse(localStorage.getItem('foodItems')) || [];
      const promotions = JSON.parse(localStorage.getItem('promotions')) || [];

      // Filter data based on selected time range
      const filteredOrders = orders.filter(order => {
        if (!order || !order.createdAt) return false;
        const orderDate = new Date(order.createdAt);
        return orderDate >= startDate && orderDate <= endDate;
      });

      // Calculate metrics
      const calculatedMetrics = {
        totalRevenue: filteredOrders.reduce((sum, order) => sum + (order.total || 0), 0),
        totalOrders: filteredOrders.length,
        totalFoodItems: foodItems.length,
        avgOrderValue: filteredOrders.length > 0 
          ? filteredOrders.reduce((sum, order) => sum + (order.total || 0), 0) / filteredOrders.length 
          : 0,
        newCustomers: users.filter(user => {
          if (!user.createdAt) return false;
          const userDate = new Date(user.createdAt);
          return user.role === 'customer' && userDate >= startDate && userDate <= endDate;
        }).length,
        popularItems: calculatePopularItems(filteredOrders, foodItems),
        revenueTrend: calculateRevenueTrend(filteredOrders),
        orderTrend: calculateOrderTrend(filteredOrders),
        customerAcquisition: calculateCustomerAcquisition(users),
        promotionPerformance: calculatePromotionPerformance(promotions, filteredOrders),
        totalItemsSold: calculateTotalItemsSold(filteredOrders)
      };

      setMetrics(calculatedMetrics);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }, [timeRange, startDate, endDate]);

  // Helper function to calculate total items sold
  const calculateTotalItemsSold = (orders) => {
    return orders.reduce((total, order) => {
      if (!order.items) return total;
      return total + order.items.reduce((sum, item) => sum + (item.quantity || 1), 0);
    }, 0);
  };

  // Helper functions for calculations
  const calculatePopularItems = (orders, foodItems) => {
    const itemCounts = {};
    
    orders.forEach(order => {
      if (!order.items) return;
      order.items.forEach(item => {
        if (!itemCounts[item.id]) itemCounts[item.id] = 0;
        itemCounts[item.id] += item.quantity || 1;
      });
    });

    return Object.entries(itemCounts)
      .map(([id, count]) => {
        const item = foodItems.find(f => f.id === id) || {};
        return {
          id,
          name: item.name || `Item ${id}`,
          count,
          revenue: orders.reduce((sum, order) => {
            if (!order.items) return sum;
            const orderItem = order.items.find(i => i.id === id);
            return sum + (orderItem ? (orderItem.price || 0) * (orderItem.quantity || 1) : 0);
          }, 0)
        };
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  };

  const calculateRevenueTrend = (orders) => {
    const days = {};
    const result = [];
    
    // Group by day
    orders.forEach(order => {
      if (!order.createdAt) return;
      const date = format(new Date(order.createdAt), 'yyyy-MM-dd');
      if (!days[date]) days[date] = 0;
      days[date] += order.total || 0;
    });

    // Convert to array
    for (const [date, revenue] of Object.entries(days)) {
      result.push({ date, revenue });
    }

    // Sort by date
    return result.sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  const calculateOrderTrend = (orders) => {
    const days = {};
    const result = [];
    
    // Group by day
    orders.forEach(order => {
      if (!order.createdAt) return;
      const date = format(new Date(order.createdAt), 'yyyy-MM-dd');
      if (!days[date]) days[date] = 0;
      days[date]++;
    });

    // Convert to array
    for (const [date, count] of Object.entries(days)) {
      result.push({ date, count });
    }

    // Sort by date
    return result.sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  const calculateCustomerAcquisition = (users) => {
    const days = {};
    const result = [];
    
    // Filter customers and group by day
    users
      .filter(user => user.role === 'customer' && user.createdAt)
      .forEach(user => {
        const date = format(new Date(user.createdAt), 'yyyy-MM-dd');
        if (!days[date]) days[date] = 0;
        days[date]++;
      });

    // Convert to array
    for (const [date, count] of Object.entries(days)) {
      result.push({ date, count });
    }

    // Sort by date
    return result.sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  const calculatePromotionPerformance = (promotions, orders) => {
    return promotions.map(promo => {
      const promoOrders = orders.filter(order => 
        order.promotionCode && order.promotionCode === promo.code
      );
      
      return {
        ...promo,
        usageCount: promoOrders.length,
        revenueGenerated: promoOrders.reduce((sum, order) => sum + (order.total || 0), 0)
      };
    }).sort((a, b) => b.usageCount - a.usageCount);
  };

  // Handle time range change
  const handleTimeRangeChange = (e) => {
    const value = e.target.value;
    setTimeRange(value);
    
    switch(value) {
      case '7days':
        setStartDate(subDays(new Date(), 7));
        setEndDate(new Date());
        break;
      case '30days':
        setStartDate(subDays(new Date(), 30));
        setEndDate(new Date());
        break;
      case '90days':
        setStartDate(subDays(new Date(), 90));
        setEndDate(new Date());
        break;
      case 'custom':
        // Let the date pickers handle it
        break;
      default:
        setStartDate(subDays(new Date(), 7));
        setEndDate(new Date());
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <main className="flex-1 lg:ml-64 p-6">
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
          <Typography variant="h4" gutterBottom>
            <FaChartLine className="inline mr-2" />
            Analytics Dashboard
          </Typography>
          
          <FormControl variant="outlined" size="small" style={{ minWidth: 120 }}>
            <InputLabel>Time Range</InputLabel>
            <Select
              value={timeRange}
              onChange={handleTimeRangeChange}
              label="Time Range"
            >
              <MenuItem value="7days">Last 7 Days</MenuItem>
              <MenuItem value="30days">Last 30 Days</MenuItem>
              <MenuItem value="90days">Last 90 Days</MenuItem>
              <MenuItem value="custom">Custom Range</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {timeRange === 'custom' && (
          <Box display="flex" gap={2} mb={4}>
            <DatePicker
              label="Start Date"
              value={startDate}
              onChange={(newValue) => setStartDate(newValue)}
              maxDate={endDate}
            />
            <DatePicker
              label="End Date"
              value={endDate}
              onChange={(newValue) => setEndDate(newValue)}
              minDate={startDate}
              maxDate={new Date()}
            />
          </Box>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner size="lg" />
          </div>
        ) : error ? (
          <div className="p-6 text-red-500">Error: {error}</div>
        ) : !metrics ? (
          <div className="p-6">No data available</div>
        ) : (
          <>
            {/* Key Metrics Cards */}
            <Grid container spacing={3} className="mb-6">
              <Grid item xs={12} sm={6} md={3}>
                <Card className="h-full">
                  <CardContent>
                    <Box display="flex" alignItems="center" mb={1}>
                      <FaMoneyBillWave className="text-blue-500 mr-2" />
                      <Typography color="textSecondary">Total Revenue</Typography>
                    </Box>
                    <Typography variant="h5">
                      {formatCurrency(metrics.totalRevenue)}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {format(startDate, 'MMM d')} - {format(endDate, 'MMM d, yyyy')}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Card className="h-full">
                  <CardContent>
                    <Box display="flex" alignItems="center" mb={1}>
                      <FaShoppingCart className="text-green-500 mr-2" />
                      <Typography color="textSecondary">Total Orders</Typography>
                    </Box>
                    <Typography variant="h5">{metrics.totalOrders}</Typography>
                    <Typography variant="body2">
                      Avg. {formatCurrency(metrics.avgOrderValue)} per order
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Card className="h-full">
                  <CardContent>
                    <Box display="flex" alignItems="center" mb={1}>
                      <FaUsers className="text-orange-500 mr-2" />
                      <Typography color="textSecondary">New Customers</Typography>
                    </Box>
                    <Typography variant="h5">{metrics.newCustomers}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      Customer acquisition
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Card className="h-full">
                  <CardContent>
                    <Box display="flex" alignItems="center" mb={1}>
                      <FaUtensils className="text-purple-500 mr-2" />
                      <Typography color="textSecondary">Food Items</Typography>
                    </Box>
                    <Typography variant="h5">
                      {metrics.totalFoodItems} items
                    </Typography>
                    <Typography variant="body2">
                      {metrics.totalItemsSold} sold
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Revenue Trend Chart */}
            <Card className="mb-6">
              <CardHeader title="Revenue Trend" />
              <CardContent>
                {metrics.revenueTrend.length > 0 ? (
                  <div style={{ height: 400 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={metrics.revenueTrend}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis 
                          label={{ 
                            value: 'Revenue (PKR)', 
                            angle: -90, 
                            position: 'insideLeft',
                            style: { textAnchor: 'middle' } 
                          }}
                        />
                        <Tooltip 
                          formatter={(value) => [formatCurrency(value), 'Revenue']}
                          labelFormatter={(label) => `Date: ${label}`}
                        />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="revenue" 
                          stroke="#8884d8" 
                          strokeWidth={2}
                          dot={{ r: 4 }}
                          activeDot={{ r: 6 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <Typography>No revenue data available for the selected period</Typography>
                )}
              </CardContent>
            </Card>

            {/* Popular Items and Order Trend */}
            <Grid container spacing={3} className="mb-6">
              <Grid item xs={12} md={6}>
                <Card>
                  <CardHeader title="Top Selling Items" />
                  <CardContent>
                    {metrics.popularItems.length > 0 ? (
                      <div style={{ height: 400 }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            layout="vertical"
                            data={metrics.popularItems}
                            margin={{ left: 30 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" />
                            <YAxis dataKey="name" type="category" width={100} />
                            <Tooltip 
                              formatter={(value, name) => 
                                name === 'revenue' 
                                  ? [formatCurrency(value), 'Revenue'] 
                                  : [value, 'Quantity']
                              }
                            />
                            <Bar dataKey="count" fill="#8884d8" name="Quantity Sold">
                              <LabelList dataKey="count" position="right" />
                              {metrics.popularItems.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    ) : (
                      <Typography>No item data available</Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card>
                  <CardHeader title="Order Trend" />
                  <CardContent>
                    {metrics.orderTrend.length > 0 ? (
                      <div style={{ height: 400 }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={metrics.orderTrend}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis 
                              label={{ 
                                value: 'Orders', 
                                angle: -90, 
                                position: 'insideLeft',
                                style: { textAnchor: 'middle' } 
                              }}
                            />
                            <Tooltip />
                            <Area 
                              type="monotone" 
                              dataKey="count" 
                              stroke="#82ca9d" 
                              fill="#82ca9d" 
                              fillOpacity={0.2}
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    ) : (
                      <Typography>No order data available</Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Promotion Performance */}
            {metrics.promotionPerformance.length > 0 && (
              <Card className="mb-6">
                <CardHeader title="Promotion Performance" />
                <CardContent>
                  <div style={{ height: 400 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={metrics.promotionPerformance.slice(0, 5)}
                        layout="vertical"
                        margin={{ left: 100 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis 
                          dataKey="code" 
                          type="category" 
                          width={150}
                          tickFormatter={(value) => value.length > 10 ? `${value.substring(0, 10)}...` : value}
                        />
                        <Tooltip 
                          formatter={(value, name) => 
                            name === 'revenueGenerated' 
                              ? [formatCurrency(value), 'Revenue'] 
                              : [value, 'Usage Count']
                          }
                        />
                        <Legend />
                        <Bar dataKey="usageCount" fill="#FFBB28" name="Usage Count" />
                        <Bar dataKey="revenueGenerated" fill="#00C49F" name="Revenue Generated" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default AnalyticsDashboard;