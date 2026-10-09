

"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Record {
  id: string;
  name: string;
  type?: string;
  record_type?: string;
  value: string;
  ttl: number;
}

export default function ZoneDetails() {
  const [zoneIdStr, setZoneIdStr] = useState<string>("");
  const [zoneName, setZoneName] = useState<string>("Loading...");
  const [records, setRecords] = useState<Record[]>([]);
  const [loading, setLoading] = useState(true);

  // Form state matching your UI
  const [recordName, setRecordName] = useState('');
  const [recordType, setRecordType] = useState('A');
  const [recordValue, setRecordValue] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const pathSegments = window.location.pathname.split('/').filter(Boolean);
    const id = pathSegments[pathSegments.length - 1];
    if (id && id !== 'zones') {
      setZoneIdStr(id);
    }
  }, []);

  useEffect(() => {
    if (!zoneIdStr) return;

    async function fetchZoneDetails() {
      try {
        setLoading(true);
        const zoneRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/zones/${zoneIdStr}`);
        if (zoneRes.ok) {
          const zoneData = await zoneRes.json();
          if (zoneData && zoneData.name) {
            setZoneName(zoneData.name);
          }
        }

        const recordsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/zones/${zoneIdStr}/records/`);
        if (recordsRes.ok) {
          const text = await recordsRes.text();
          if (text) {
            try {
              const recordsData = JSON.parse(text);
              setRecords(Array.isArray(recordsData) ? recordsData : []);
            } catch (e) {
              setRecords([]);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching zone details:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchZoneDetails();
  }, [zoneIdStr]);

  const handleAddRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recordName || !recordValue || !zoneIdStr) return;

    setSubmitting(true);
    try {
      const fullRecordName = recordName.includes(zoneName) 
        ? recordName 
        : `${recordName}.${zoneName}`;
      
      const payload = {
        name: fullRecordName,
        type: recordType,           
        record_type: recordType,    // <--- THIS FIXES THE 422 ERROR FROM YOUR SCREENSHOT
        value: recordValue,
        ttl: 300,                   
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/zones/${zoneIdStr}/records/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const newRecord = await response.json();
        setRecords([...records, newRecord]);
        setRecordName('');
        setRecordValue('');
      } else {
        const errText = await response.text();
        alert(`Failed to add record: ${errText}`);
      }
    } catch (error) {
      console.error('Error adding record:', error);
      alert('An error occurred while adding the record.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteRecord = async (recordId: string) => {
    if (!zoneIdStr) return;
    if (!confirm('Are you sure you want to delete this record?')) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/zones/${zoneIdStr}/records/${recordId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setRecords(records.filter(r => r.id !== recordId));
      } else {
        alert('Failed to delete record');
      }
    } catch (error) {
      console.error('Error deleting record:', error);
      alert('An error occurred while deleting the record.');
    }
  };

  if (!zoneIdStr) {
    return <div className="flex h-screen items-center justify-center bg-gray-100">Loading...</div>;
  }

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      <aside className="w-64 bg-[#1f2937] text-white flex flex-col">
        <div className="p-4 text-xl font-bold border-b border-gray-700">AWS Clone</div>
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/zones" className="block px-4 py-2 bg-blue-600 rounded text-white">Hosted Zones</Link>
          <Link href="/dashboard" className="block px-4 py-2 text-gray-300 hover:bg-gray-800 rounded">Dashboard</Link>
          <Link href="/traffic-policies" className="block px-4 py-2 text-gray-300 hover:bg-gray-800 rounded">Traffic Policies</Link>
        </nav>
      </aside>

      <main className="flex-1 overflow-y-auto p-8 bg-white">
        <div className="max-w-5xl mx-auto">
          <Link href="/zones" className="text-blue-500 hover:underline mb-6 inline-block">
            &larr; Back to Hosted zones
          </Link>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-6">{zoneName} - Records</h2>

          <div className="bg-white rounded border border-gray-200 shadow-sm p-6 mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Quick create record</h3>
            <form onSubmit={handleAddRecord} className="flex flex-col md:flex-row gap-4 items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Record name</label>
                <div className="flex items-center gap-2">
                  <input 
                    type="text" 
                    required 
                    value={recordName} 
                    onChange={(e) => setRecordName(e.target.value)} 
                    className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500" 
                    placeholder="subdomain" 
                  />
                  <span className="text-gray-500 text-sm whitespace-nowrap">.{zoneName}</span>
                </div>
              </div>
              
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Record type</label>
                <select 
                  value={recordType} 
                  onChange={(e) => setRecordType(e.target.value)} 
                  className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="A">A - Routes traffic to an IPv4</option>
                  <option value="AAAA">AAAA - Routes traffic to an IPv6</option>
                  <option value="CNAME">CNAME - Routes traffic to another domain</option>
                  <option value="TXT">TXT - Text record</option>
                </select>
              </div>
              
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Value</label>
                <input 
                  type="text" 
                  required 
                  value={recordValue} 
                  onChange={(e) => setRecordValue(e.target.value)} 
                  className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500" 
                  placeholder="192.0.2.1" 
                />
              </div>
              
              <div>
                <button 
                  type="submit" 
                  disabled={submitting} 
                  className="bg-[#ec7211] text-white px-6 py-2 rounded font-medium hover:bg-[#d5660f] disabled:opacity-50"
                >
                  {submitting ? 'Adding...' : 'Add Record'}
                </button>
              </div>
            </form>
          </div>

          <div className="bg-white rounded border border-gray-200 overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200 text-sm text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 font-medium text-gray-500 uppercase tracking-wider">Record name</th>
                  <th className="px-6 py-3 font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 font-medium text-gray-500 uppercase tracking-wider">Value</th>
                  <th className="px-6 py-3 font-medium text-gray-500 uppercase tracking-wider">TTL</th>
                  <th className="px-6 py-3 font-medium text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-500">Loading records...</td></tr>
                ) : records.length === 0 ? (
                  <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-500">No records found for this hosted zone.</td></tr>
                ) : (
                  records.map((record) => (
                    <tr key={record.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-gray-900">{record.name}</td>
                      <td className="px-6 py-4 text-gray-500 font-medium">
                        {/* THIS FIXES THE BLANK TYPE COLUMN IN YOUR TABLE */}
                        {record.type || record.record_type || 'Unknown'}
                      </td>
                      <td className="px-6 py-4 text-gray-500">{record.value}</td>
                      <td className="px-6 py-4 text-gray-500">{record.ttl}</td>
                      <td className="px-6 py-4 text-sm font-medium">
                        <button onClick={() => handleDeleteRecord(record.id)} className="text-red-600 hover:text-red-900">
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
