"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';

interface Record {
  name: string;
  record_type: string; // <-- Fixed to match backend
  value: string;
  ttl: number;
}

export default function DigTool() {
  const [zones, setZones] = useState<any[]>([]);
  const [selectedZone, setSelectedZone] = useState('');
  const [queryType, setQueryType] = useState('A');
  const [queryResult, setQueryResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/zones/`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setZones(data);
      })
      .catch(() => toast.error('Failed to load zones for query tool'));
  }, []);

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedZone) {
      toast.error('Please select a hosted zone.');
      return;
    }

    setLoading(true);
    setQueryResult(null);

    try {
      const zoneObj = zones.find(z => z.id.toString() === selectedZone);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/zones/${selectedZone}/records/`);
      if (res.ok) {
        const records: Record[] = await res.json();
        const matches = records.filter(r => r.record_type === queryType); // <-- Fixed filter logic

        setTimeout(() => {
          if (matches.length > 0) {
            let output = `;; DiG simulation for ${zoneObj?.name} (${queryType})\n`;
            output += `;; Got answer:\n\n`;
            matches.forEach(m => {
              output += `${m.name}.\t${m.ttl}\tIN\t${m.record_type}\t${m.value}\n`; // <-- Fixed output display
            });
            setQueryResult(output);
            toast.success('Query resolved successfully!');
          } else {
            setQueryResult(`;; Status: NXDOMAIN\n;; No ${queryType} records found for ${zoneObj?.name}`);
            toast.warning('No matching records found.');
          }
          setLoading(false);
        }, 600); 
      }
    } catch (err) {
      toast.error('Lookup failed.');
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-64 bg-[#1f2937] text-white flex flex-col">
        <div className="p-4 text-lg font-bold border-b border-gray-700">AWS Clone</div>
        <nav className="flex-1 overflow-y-auto">
          <ul className="p-2 space-y-1">
            <li><Link href="/zones" className="block px-4 py-2 text-gray-300 hover:bg-gray-800 rounded">Hosted Zones</Link></li>
            <li><Link href="/dashboard" className="block px-4 py-2 text-gray-300 hover:bg-gray-800 rounded">Dashboard</Link></li>
            <li><Link href="/traffic-policies" className="block px-4 py-2 text-gray-300 hover:bg-gray-800 rounded">Traffic Policies</Link></li>
            <li><Link href="/query" className="block px-4 py-2 bg-blue-600 rounded">DNS Lookup Tool</Link></li>
          </ul>
        </nav>
      </div>

      <div className="flex-1 overflow-y-auto bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">DNS Lookup Utility (Dig Simulator)</h1>
          <p className="text-sm text-gray-600 mb-6">Test and resolve active DNS records hosted on your platform.</p>

          <div className="bg-white rounded border border-gray-200 shadow-sm p-6 mb-6">
            <form onSubmit={handleLookup} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Hosted Zone</label>
                <select value={selectedZone} onChange={e => setSelectedZone(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500">
                  <option value="">-- Choose Zone --</option>
                  {zones.map(z => (
                    <option key={z.id} value={z.id}>{z.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Record Type</label>
                <select value={queryType} onChange={e => setQueryType(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500">
                  <option value="A">A</option>
                  <option value="AAAA">AAAA</option>
                  <option value="CNAME">CNAME</option>
                  <option value="TXT">TXT</option>
                </select>
              </div>

              <div>
                <button type="submit" disabled={loading} className="w-full bg-[#ec7211] text-white px-4 py-2 rounded font-medium hover:bg-[#d5660f] shadow-sm disabled:opacity-55">
                  {loading ? 'Resolving...' : 'Run Dig Query'}
                </button>
              </div>
            </form>
          </div>

          {queryResult && (
            <div className="bg-[#1e1e1e] text-green-400 font-mono p-5 rounded shadow-inner text-sm whitespace-pre-wrap border border-gray-800">
              {queryResult}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
