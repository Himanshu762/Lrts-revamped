import React, { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { motion } from "framer-motion";
import { CreditCard } from "lucide-react";
import clsx from "clsx";
import { useClerk } from "@clerk/clerk-react";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || "",
  import.meta.env.VITE_SUPABASE_ANON_KEY || ""
);

interface Pass {
  pass_secret: string;
  pass_type: string;
  price: string;
  home_zone: string;
  destination_zone: string;
  email: string;
  payment_mode: string;
}

interface UserPassesProps {
  passes: Array<{
    // define your pass properties here based on your database schema
    id: number;
    email: string;
    // ... other pass properties
  }>;
}

const UserPasses: React.FC<UserPassesProps> = ({ passes }) => {
  return (
    <div>
      {passes.map((pass) => (
        // Render each pass details
      ))}
    </div>
  );
};

export default UserPasses;