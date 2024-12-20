import React from "react";
import { Dialog } from "@headlessui/react";
import { motion } from "framer-motion";
import { X } from "lucide-react";

interface PaymentGatewayProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: () => void;
}

const PaymentGateway: React.FC<PaymentGatewayProps> = ({
  isOpen,
  onClose,
  onPaymentSuccess,
}) => {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="fixed inset-0 flex items-center justify-center"
      >
        <Dialog.Panel className="w-full max-w-md bg-white rounded-lg shadow-xl p-6 relative">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Payment Header */}
          <div className="text-center mb-4">
            <h2 className="text-lg font-bold text-gray-800">
              Payment Options
            </h2>
          </div>

          {/* Payment Methods */}
          <div className="space-y-4">
            <div className="border rounded-lg p-4 flex items-center justify-between">
              <span>UPI</span>
              <button
                onClick={onPaymentSuccess}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
              >
                Pay ₹999
              </button>
            </div>
            <div className="border rounded-lg p-4 flex items-center justify-between">
              <span>Credit/Debit Card</span>
              <button
                onClick={onPaymentSuccess}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
              >
                Pay ₹999
              </button>
            </div>
            <div className="border rounded-lg p-4 flex items-center justify-between">
              <span>Wallets</span>
              <button
                onClick={onPaymentSuccess}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
              >
                Pay ₹999
              </button>
            </div>
          </div>
        </Dialog.Panel>
      </motion.div>
    </Dialog>
  );
};

export default PaymentGateway;