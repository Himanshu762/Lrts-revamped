import React from 'react';

const PassCard = () => {
  const passes = [
    {
      title: 'Basic Pass',
      price: '₹299',
      duration: '1 Month',
      features: ['Access to all zones', '10 rides included'],
      popular: false,
    },
    {
      title: 'Premium Pass',
      price: '₹499',
      duration: '1 Month',
      features: ['Unlimited rides', 'Priority support'],
      popular: true,
    },
    {
      title: 'Family Pass',
      price: '₹799',
      duration: '1 Month',
      features: ['4 members', 'Unlimited rides'],
      popular: false,
    },
  ];

  return (
    <div className="py-12 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase dark:text-indigo-400">Passes</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Choose the Right Pass
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {passes.map((pass, index) => (
            <div key={index} className={`relative bg-white dark:bg-gray-700 p-6 rounded-lg shadow-lg ${pass.popular ? 'border-2 border-indigo-500' : ''}`}>
              {pass.popular && (
                <span className="absolute top-0 right-0 px-3 py-1 text-xs font-semibold text-white bg-indigo-500 rounded-bl-lg">
                  Popular
                </span>
              )}
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{pass.title}</h3>
              <p className="text-xl font-bold text-indigo-600 dark:text-indigo-400">{pass.price}</p>
              <p className="text-sm text-gray-500 dark:text-gray-300">{pass.duration}</p>
              <ul className="mt-4 space-y-2 text-sm text-gray-600 dark:text-gray-300">
                {pass.features.map((feature, i) => (
                  <li key={i} className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-2 text-green-500 dark:text-green-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M16.293 4.293a1 1 0 011.414 1.414L8 14.414 3.293 9.707a1 1 0 111.414-1.414L8 11.586l8.293-8.293z" clipRule="evenodd" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <button className="mt-4 w-full px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 dark:bg-indigo-800 dark:hover:bg-indigo-700">
                Choose This Pass
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PassCard;