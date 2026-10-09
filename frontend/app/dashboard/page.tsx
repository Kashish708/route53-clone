// import Link from 'next/link';

// export default function Dashboard() {
//   return (
//     <div className="flex h-screen bg-gray-100">
//       <aside className="w-64 bg-slate-800 text-white flex flex-col">
//         <div className="p-4 text-xl font-bold border-b border-slate-700">AWS Clone</div>
//         <nav className="flex-1 p-4 space-y-2">
//           <Link href="/zones" className="block px-4 py-2 text-slate-300 hover:bg-slate-700 rounded">Hosted Zones</Link>
//           <Link href="/dashboard" className="block px-4 py-2 bg-blue-600 rounded text-white">Dashboard</Link>
//           <Link href="/traffic-policies" className="block px-4 py-2 text-slate-300 hover:bg-slate-700 rounded">Traffic Policies</Link>
//         </nav>
//       </aside>
//       <main className="flex-1 p-8 flex items-center justify-center">
//         <h1 className="text-3xl font-bold text-gray-500">Dashboard - Coming Soon</h1>
//       </main>
//     </div>
//   );
// }


"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Dashboard() {
  const [stats, setStats] = useState({ totalZones: 0, totalRecords: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/zones/`);
        if (res.ok) {
          const zones = await res.json();
          const zoneArray = Array.isArray(zones) ? zones : [];
          const totalZ = zoneArray.length;
          const totalR = zoneArray.reduce((acc: number, z: any) => acc + (z.records?.length || 0), 0);
          setStats({ totalZones: totalZ, totalRecords: totalR });
        }
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchDashboardData();
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-64 bg-[#1f2937] text-white flex flex-col">
        <div className="p-4 text-lg font-bold border-b border-gray-700">AWS Clone</div>
        <nav className="flex-1 overflow-y-auto">
          <ul className="p-2 space-y-1">
            <li><Link href="/zones" className="block px-4 py-2 text-gray-300 hover:bg-gray-800 rounded">Hosted Zones</Link></li>
            <li><Link href="/dashboard" className="block px-4 py-2 bg-blue-600 rounded">Dashboard</Link></li>
            <li><Link href="/traffic-policies" className="block px-4 py-2 text-gray-300 hover:bg-gray-800 rounded">Traffic Policies</Link></li>
          </ul>
        </nav>
      </div>

      <div className="flex-1 overflow-y-auto bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Route 53 Dashboard</h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded border border-gray-200 shadow-sm">
              <h3 className="text-sm font-medium text-gray-500 uppercase">Hosted Zones</h3>
              <p className="text-3xl font-bold text-gray-900 mt-2">{loading ? "..." : stats.totalZones}</p>
            </div>
            <div className="bg-white p-6 rounded border border-gray-200 shadow-sm">
              <h3 className="text-sm font-medium text-gray-500 uppercase">Total DNS Records</h3>
              <p className="text-3xl font-bold text-gray-900 mt-2">{loading ? "..." : stats.totalRecords}</p>
            </div>
            <div className="bg-white p-6 rounded border border-gray-200 shadow-sm">
              <h3 className="text-sm font-medium text-gray-500 uppercase">API Status</h3>
              <p className="text-lg font-semibold text-green-600 mt-3 flex items-center">
                <span className="w-3 h-3 bg-green-500 rounded-full inline-block mr-2 animate-pulse"></span> Connected
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
