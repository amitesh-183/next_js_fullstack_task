"use client";

import { useEffect, useState } from "react";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaFileAlt,
  FaUser,
} from "react-icons/fa";
import axios from "axios";
import { useSession } from "next-auth/react";

const Profile = () => {
  const { data: session } = useSession();
  const [stats, setStats] = useState({
    totalRequests: 0,
    approvedRequests: 0,
    rejectedRequests: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get("/api/profile/stats");
        setStats(response.data);
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Profile Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="bg-gradient-to-r from-blue-400 to-blue-600 text-white p-6 rounded-lg shadow-md flex items-center">
          <FaFileAlt className="text-3xl mr-4" />
          <div>
            <h2 className="text-xl font-semibold">Total Requests</h2>
            <p className="text-2xl">{stats.totalRequests}</p>
          </div>
        </div>
        <div className="bg-gradient-to-r from-green-400 to-green-600 text-white p-6 rounded-lg shadow-md flex items-center">
          <FaCheckCircle className="text-3xl mr-4" />
          <div>
            <h2 className="text-xl font-semibold">Approved Requests</h2>
            <p className="text-2xl">{stats.approvedRequests}</p>
          </div>
        </div>
        <div className="bg-gradient-to-r from-red-400 to-red-600 text-white p-6 rounded-lg shadow-md flex items-center">
          <FaTimesCircle className="text-3xl mr-4" />
          <div>
            <h2 className="text-xl font-semibold">Rejected Requests</h2>
            <p className="text-2xl">{stats.rejectedRequests}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
