import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, CreditCard, X } from 'lucide-react';
import clsx from 'clsx';

interface PassFeature {
  text: string;
  included: boolean;
}

interface PassCardProps {
  title: string;
  price: string;
  duration: string;
  features: PassFeature[];
  popular?: boolean;
}

const PassCard: React.FC<PassCardProps> = ({
  title,
  price,
  duration,
  features,
  popular,
}) => {
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  const handlePaymentSuccess = () => {
    setIsPaymentOpen(false);
    alert('Payment Successful! Your pass has been activated.');
  };

  return (
    <>
      <motion.div
        whileHover={{ translateY: -5 }}
        className={clsx(
          'relative overflow-hidden rounded-2xl',
          'bg-gradient-to-br from-white to-blue-100 dark:from-gray-800 dark:to-blue-900',
          'animate-gradient-x',
          popular && 'ring-2 ring-blue-300 dark:ring-blue-500'
        )}
      >
        {popular && (
          <div className="absolute top-0 right-0 bg-gradient-to-r from-pink-300 to-purple-300 dark:from-pink-600 dark:to-purple-600 text-white px-4 py-1 rounded-bl-lg text-sm font-medium">
            Popular
          </div>
        )}

        <div className="p-6 space-y-6">
          {/* Header Section */}
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
                {title}
              </h3>
              <div className="mt-2">
                <span className="text-4xl font-extrabold text-gray-800 dark:text-white">
                  ₹{price}
                </span>{' '}
                <span className="text-lg text-gray-500 dark:text-gray-400">
                  /{duration}
                </span>
              </div>
            </div>
            <CreditCard className="w-10 h-10 text-gray-500 dark:text-gray-400" />
          </div>

          {/* SVG & Info Section */}
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8">
              <svg viewBox="0 0 32 32" className="text-gray-500 dark:text-gray-400">
                <circle cx="18" cy="18" r="16" fill="none" stroke="currentColor" strokeWidth="2" />
                <text
                  x="16"
                  y="20"
                  textAnchor="middle"
                  fill="currentColor"
                  fontSize="12"
                  fontFamily="sans-serif"
                >
                  LRTS
                </text>
              </svg>
            </div>
            <div className="text-gray-500 dark:text-gray-400 font-mono">
              •••• •••• •••• {Math.floor(Math.random() * 9000) + 1000}
            </div>
          </div>

          {/* Features Section */}
          <ul className="space-y-3">
            {features.map((feature, index) => (
              <li key={index} className="flex items-center space-x-3">
                <div
                  className={clsx(
                    'flex-shrink-0 h-5 w-5 rounded-full flex items-center justify-center',
                    feature.included
                      ? 'bg-blue-300 dark:bg-blue-500'
                      : 'bg-gray-300 dark:bg-gray-700'
                  )}
                >
                  <Check
                    className={clsx(
                      'h-3 w-3',
                      feature.included
                        ? 'text-white'
                        : 'text-gray-400 dark:text-gray-500'
                    )}
                  />
                </div>
                <span
                  className={clsx(
                    'text-sm',
                    feature.included
                      ? 'text-gray-800 dark:text-white'
                      : 'text-gray-400 dark:text-gray-500 line-through'
                  )}
                >
                  {feature.text}
                </span>
              </li>
            ))}
          </ul>

          {/* Button Section */}
          <button
            onClick={() => setIsPaymentOpen(true)}
            className={clsx(
              'w-full py-3 px-4 rounded-lg font-medium transition-colors duration-200',
              'bg-blue-300 hover:bg-blue-400 text-white dark:bg-blue-500 dark:hover:bg-blue-600'
            )}
          >
            Get Started
          </button>
        </div>
      </motion.div>

      {/* Payment Modal */}
      {isPaymentOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-lg relative">
            {/* Close Button */}
            <button
              onClick={() => setIsPaymentOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
              Complete Your Payment
            </h2>

            {/* Payment Options */}
            <div className="space-y-4">
              <button
                onClick={handlePaymentSuccess}
                className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
              >
                Pay with UPI
              </button>
              <button
                onClick={handlePaymentSuccess}
                className="w-full py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg"
              >
                Pay with Card
              </button>
              <button
                onClick={handlePaymentSuccess}
                className="w-full py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg"
              >
                Pay with Wallet
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

<style jsx>{`
  @keyframes gradient-x {
    0% {
      background-position: 0% 50%;
    }
    100% {
      background-position: 100% 50%;
    }
  }
  .animate-gradient-x {
    background-size: 200% 200%;
    animation: gradient-x 5s ease infinite;
  }
`}</style>;

export default PassCard;