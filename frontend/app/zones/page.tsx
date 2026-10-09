"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';

// 1. Strict TypeScript Interfaces
interface DNSRecord {
  id: number;
  name: string;
  record_type: string;
  value: string;
  ttl: number;
}

interface HostedZone {
  id: number;
  name: string;
  description: string;
  records: DNSRecord[];
}

export default function Zones() {
  // 2. State setup using interfaces and loading flags
  const [zones, setZones] = useState<HostedZone[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

  useEffect(() => {
    fetch(`${apiUrl}/zones/`)
      .then(res => res.json())
      .then(data => {
        setZones(data);
        setIsLoading(false); // Turn off loading when data arrives
      })
      .catch(err => {
        console.error("Error fetching zones:", err);
        setIsLoading(false);
      });
      
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'e') {
        e.preventDefault();
        exportToJson();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [apiUrl, zones]); 

  const exportToJson = () => {
    if (zones.length === 0) return alert("No zones to export!");
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(zones, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "route53_hosted_zones.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-slate-800 text-white flex flex-col">
        <div className="p-4 text-xl font-bold border-b border-slate-700">AWS Clone</div>
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/zones" className="block px-4 py-2 bg-blue-600 rounded text-white">Hosted Zones</Link>
          <Link href="/dashboard" className="block px-4 py-2 text-slate-300 hover:bg-slate-700 rounded">Dashboard</Link>
          <Link href="/traffic-policies" className="block px-4 py-2 text-slate-300 hover:bg-slate-700 rounded">Traffic Policies</Link>
        </nav>
      </aside>

      <main className="flex-1 p-8 flex flex-col">
        <div className="bg-[#00297b] text-white px-4 py-2 text-sm mb-6 rounded flex justify-between items-center shadow">
          <span>ℹ️ <strong>Tip:</strong> Press <code>Ctrl + E</code> to quick-export your zones to JSON.</span>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Hosted zones</h1>
          <div className="space-x-3">
            <button onClick={exportToJson} className="bg-white border border-gray-300 text-gray-700 px-4 py-1.5 rounded font-bold text-sm hover:bg-gray-50 shadow-sm transition-colors">
              Export JSON
            </button>
            <button className="bg-[#ec7211] hover:bg-[#eb5f07] text-white px-4 py-1.5 rounded font-bold text-sm shadow-sm transition-colors cursor-not-allowed opacity-80">
              Create hosted zone
            </button>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded shadow-sm overflow-hidden">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 font-semibold text-gray-600">Hosted zone name</th>
                <th className="px-6 py-3 font-semibold text-gray-600">Description</th>
                <th className="px-6 py-3 font-semibold text-gray-600">Record count</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {/* 3. Handle Loading UI in Table */}
              {isLoading ? (
                <tr><td colSpan={3} className="px-6 py-8 text-center text-gray-500 font-medium">Fetching hosted zones from database...</td></tr>
              ) : zones.length === 0 ? (
                <tr><td colSpan={3} className="px-6 py-8 text-center text-gray-500">No hosted zones found.</td></tr>
              ) : (
                zones.map((zone) => (
                  <tr key={zone.id} className="hover:bg-gray-50">
                    <td className="px-6 py-3 font-medium">
                      <Link href={`/zones/${zone.id}`} className="text-[#0073bb] hover:underline">
                        {zone.name}
                      </Link>
                    </td>
                    <td className="px-6 py-3 text-gray-700">{zone.description || '-'}</td>
                    <td className="px-6 py-3 text-gray-700">{zone.records?.length || 0}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}