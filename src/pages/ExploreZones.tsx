import React, { useState, useEffect } from 'react';
import ZoneMap from '../components/zones/ZoneMap';
import ZoneStats from '../components/zones/ZoneStats';
import { MapPin, Users, Clock, Shield } from 'lucide-react';
import { BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar, LineChart, Line } from 'recharts';

const ExploreZones: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Detect if dark mode is preferred by the user
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(mediaQuery.matches);

    const handleThemeChange = (e: MediaQueryListEvent) => {
      setIsDarkMode(e.matches);
    };

    mediaQuery.addEventListener('change', handleThemeChange);

    return () => {
      mediaQuery.removeEventListener('change', handleThemeChange);
    };
  }, []);

  // Define the tooltip styles based on the theme
  const tooltipStyles = {
    backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF', // Dark gray for dark mode, white for light mode
    color: isDarkMode ? '#FFFFFF' : '#000000',          // White text for dark mode, black text for light mode
    borderRadius: '8px',                               // Rounded corners
    padding: '10px',                                   // Padding inside the tooltip
    border: isDarkMode ? '1px solid #333' : '1px solid #ddd', // Subtle border based on theme
  };

  const features = [
    {
      icon: MapPin,
      title: 'Strategic Coverage',
      description: 'Zones are strategically placed around metro stations to ensure maximum accessibility.',
    },
    {
      icon: Users,
      title: 'Dedicated Fleet',
      description: 'Each zone has a dedicated fleet of rickshaws to maintain consistent service quality.',
    },
    {
      icon: Clock,
      title: 'Real-time Updates',
      description: 'Get live updates on rickshaw availability and estimated wait times.',
    },
    {
      icon: Shield,
      title: 'Safe Travel',
      description: 'All zones are monitored 24/7 with verified drivers and maintained vehicles.',
    },
  ];

  const data = [
    { name: 'Zone 1', rickshaws: 30, waitTime: 2 },
    { name: 'Zone 2', rickshaws: 45, waitTime: 3 },
    { name: 'Zone 3', rickshaws: 20, waitTime: 1.5 },
    { name: 'Zone 4', rickshaws: 50, waitTime: 2.5 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-r from-white to-blue-100 dark:from-gray-800 dark:to-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl">
            Explore LRTS Zones
          </h1>
          <p className="mt-4 text-xl text-gray-500 dark:text-gray-300 max-w-3xl mx-auto">
            Discover our extensive network of rickshaw service zones around Delhi's metro stations,
            providing convenient last-mile connectivity.
          </p>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">System Overview</h2>
          <ZoneStats />
        </div>

        <div className="mt-16">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Interactive Zone Map
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Click on a zone to see detailed information about rickshaw availability,
              wait times, and landmarks. Use the buttons above to quickly navigate to specific zones.
            </p>
            <ZoneMap />
          </div>
        </div>

        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Zone Features</h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
                <div className="inline-flex items-center justify-center p-3 bg-indigo-100 dark:bg-indigo-900 rounded-lg">
                  <feature.icon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="mt-2 text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Zone Statistics</h2>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 mt-8">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Rickshaws per Zone</h3>
                <BarChart width={500} height={300} data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                <XAxis dataKey="name" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip 
                  contentStyle={tooltipStyles} 
                  wrapperStyle={{ outline: 'none' }} 
                />
                <Legend />
                <Bar dataKey="rickshaws" fill="#8884d8" />
                </BarChart>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Average Wait Time</h3>
                <LineChart width={500} height={300} data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                <XAxis dataKey="name" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip 
                  contentStyle={tooltipStyles} 
                  wrapperStyle={{ outline: 'none' }} 
                  labelStyle={{ color: isDarkMode ? '#FFFFFF' : '#000000' }} // Adjust label styling for light mode
                />
                <Legend />
                <Line type="monotone" dataKey="waitTime" stroke="#82ca9d" />
                </LineChart>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ExploreZones;