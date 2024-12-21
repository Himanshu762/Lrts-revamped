import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { useClerk } from "@clerk/clerk-react";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || "",
  import.meta.env.VITE_SUPABASE_ANON_KEY || ""
);

interface PaymentGatewayProps {
  passDetails: { title: string; price: string; homeZone: string; destinationZone: string };
  onClose: () => void;
}

const PaymentGateway: React.FC<PaymentGatewayProps> = ({ passDetails, onClose }) => {
  const navigate = useNavigate();
  const { user } = useClerk();
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);

  const handlePayment = async () => {
    setIsPaymentProcessing(true);

    try {
      const passSecret = uuidv4();

      const { error } = await supabase.from("passes").insert([
        {
          user_id: user?.id, // Now accepted as text
          name: user?.fullName || "Unknown User",
          email: user?.primaryEmailAddress?.emailAddress || "No Email",
          pass_type: passDetails.title,
          price: passDetails.price,
          home_zone: passDetails.homeZone,
          destination_zone: passDetails.destinationZone,
          pass_secret: uuidv4(),
        },
      ]);

      if (error) {
        console.error("Failed to save pass details:", error);
        alert("Payment failed. Please try again.");
        setIsPaymentProcessing(false);
        return;
      }

      // Navigate to passes page after successful payment
      navigate("/passes", { state: { success: true } });
    } catch (err) {
      console.error("Payment error:", err);
      alert("An unexpected error occurred. Please try again.");
    } finally {
      setIsPaymentProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-96">
        <h3 className="text-lg font-bold mb-4">Payment Gateway</h3>
        <div className="mb-4">
          <p>
            <strong>Pass:</strong> {passDetails.title}
          </p>
          <p>
            <strong>Price:</strong> ₹{passDetails.price}
          </p>
          <p>
            <strong>Home Zone:</strong> {passDetails.homeZone}
          </p>
          <p>
            <strong>Destination Zone:</strong> {passDetails.destinationZone}
          </p>
        </div>
        <button
          onClick={handlePayment}
          className={`w-full py-2 px-4 rounded mb-2 ${
            isPaymentProcessing ? "bg-gray-400" : "bg-blue-500 text-white"
          }`}
          disabled={isPaymentProcessing}
        >
          {isPaymentProcessing ? "Processing Payment..." : "Pay Now"}
        </button>
        <button
          onClick={onClose}
          className="w-full py-2 px-4 bg-gray-300 dark:bg-gray-600 text-black dark:text-white rounded"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default PaymentGateway;