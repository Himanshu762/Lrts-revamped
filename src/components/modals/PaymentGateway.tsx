import React, { useState } from "react";
import { useRouter } from "next/router";
import { v4 as uuidv4 } from "uuid";
import { useClerk } from "@clerk/clerk-react"; // For user authentication
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

interface PaymentGatewayProps {
  passDetails: { title: string; price: string; homeZone: string; destinationZone: string };
  onClose: () => void;
}

const PaymentGateway: React.FC<PaymentGatewayProps> = ({ passDetails, onClose }) => {
  const router = useRouter();
  const { user } = useClerk(); // Fetch Clerk user details
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);

  const handlePayment = async () => {
    setIsPaymentProcessing(true);

    // Simulate payment processing delay
    setTimeout(async () => {
      // Save pass details to Supabase
      const passSecret = uuidv4(); // Generate a unique pass identifier
      const { error } = await supabase.from("passes").insert([
        {
          user_id: user?.id,
          name: user?.fullName || "Unknown User",
          email: user?.primaryEmailAddress?.emailAddress || "No Email",
          pass_type: passDetails.title,
          price: passDetails.price,
          home_zone: passDetails.homeZone,
          destination_zone: passDetails.destinationZone,
          pass_secret: passSecret,
        },
      ]);

      if (error) {
        console.error("Failed to save pass details:", error);
      }

      // Redirect back to PassesPage
      router.push("/passes");
    }, 2000); // Simulate 2-second payment delay
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
          className="w-full py-2 px-4 bg-blue-500 text-white rounded mb-2"
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