import React from 'react';
import { MapPin, Bike, Clock, TrendingUp, Users, Building2, Battery } from 'lucide-react';
import { BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar, LineChart, Line } from 'recharts';

const ZoneStats: React.FC = () => {
  const stats = [
    {
      name: 'Active Zones',
      value: '25',
      icon: MapPin,
      change: '+3 this month',
      changeType: 'increase',
      color: 'indigo',
    },
    {
      name: 'Total Rickshaws',
      value: '199',
      icon: Bike,
      change: '+15 this week',
      changeType: 'increase',
      color: 'green',
    },
    {
      name: 'Avg. Wait Time',
      value: '2.8 min',
      icon: Clock,
      change: '-0.5 min from last week',
      changeType: 'decrease',
      color: 'blue',
    },
    {
      name: 'Daily Rides',
      value: '3.2k',
      icon: TrendingUp,
      change: '+18% this month',
      changeType: 'increase',
      color: 'purple',
    },
    {
      name: 'Active Drivers',
      value: '180',
      icon: Users,
      change: '+8 this week',
      changeType: 'increase',
      color: 'pink',
    },
    {
      name: 'Connected Landmarks',
      value: '102',
      icon: Building2,
      change: '+5 this month',
      changeType: 'increase',
      color: 'yellow',
    },
    {
      name: 'E-Rickshaws',
      value: '85%',
      icon: Battery,
      change: '+5% this quarter',
      changeType: 'increase',
      color: 'teal',
    },
  ];

  const data = [
    { name: 'Zone 1', rickshaws: 30, waitTime: 2 },
    { name: 'Zone 2', rickshaws: 45, waitTime: 3 },
    { name: 'Zone 3', rickshaws: 20, waitTime: 1.5 },
    { name: 'Zone 4', rickshaws: 50, waitTime: 2.5 },
  ];

  const tooltipStyles = {
    backgroundColor: '#1F2937', // Dark gray background for readability
    color: '#FFFFFF',          // White text for contrast
    borderRadius: '8px',       // Rounded corners
    padding: '10px',           // Padding inside the tooltip
    border: '1px solid #333',  // Subtle border for clarity
  };

  return (
    <div className="px-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4"
          >
            <div className="flex items-center">
              <div
                className={`p-3 rounded-full bg-${stat.color}-100 dark:bg-${stat.color}-900`}
              >
                <stat.icon
                  className={`h-6 w-6 text-${stat.color}-600 dark:text-${stat.color}-400`}
                />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                  {stat.name}
                </h3>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </p>
                <p
                  className={`text-sm ${
                    stat.changeType === 'increase'
                      ? 'text-green-500 dark:text-green-400'
                      : 'text-red-500 dark:text-red-400'
                  }`}
                >
                  {stat.change}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ZoneStats;
