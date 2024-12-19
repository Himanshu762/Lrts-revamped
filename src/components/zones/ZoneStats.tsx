import React from 'react';
import { Users, Clock, MapPin, Truck, Phone, Map } from 'lucide-react';

const ZoneStats = () => {
  const stats = [
    {
      title: 'Active Zones',
      value: 8,
      icon: MapPin,
      change: 5,
    },
    {
      title: 'Total Rickshaws',
      value: 240,
      icon: Truck,
      change: -3,
    },
    {
      title: 'Average Wait Time (min)',
      value: 4.5,
      icon: Clock,
      change: -0.5,
    },
    {
      title: 'Daily Rides',
      value: 2300,
      icon: Phone,
      change: 100,
    },
    {
      title: 'Active Drivers',
      value: 150,
      icon: Users,
      change: 20,
    },
    {
      title: 'E-Rickshaws (%)',
      value: 45,
      icon: Map,
      change: 10,
    },
  ];

  return (
    <div className="py-12 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase dark:text-indigo-400">System Stats</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Key Metrics of LRTS
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat, index) => (
            <div key={index} className="relative bg-white dark:bg-gray-700 p-6 rounded-lg shadow-lg">
              <div className="absolute top-0 left-0 p-3 bg-indigo-500 rounded-full text-white">
                <stat.icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{stat.title}</h3>
              <p className="mt-2 text-3xl font-bold text-indigo-600 dark:text-indigo-400">{stat.value}</p>
              <p className={`mt-1 text-sm ${stat.change >= 0 ? 'text-green-600' : 'text-red-600'} dark:text-gray-300`}>
                {stat.change >= 0 ? `+${stat.change}` : stat.change}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ZoneStats;