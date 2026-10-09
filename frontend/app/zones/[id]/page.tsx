"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Record {
  id: string;
  name: string;
  type: string;
  value: string;
  ttl: number;
}

// Satisfy Next.js App Router static generation for dynamic routes
export function generateStaticParams() {
  return [{ id: '0' }, { id: '1' }, { id: '2' }, { id: '3' }];
}

export default function ZoneDetails() {
  const [zoneIdStr, setZoneIdStr] = useState<string>("");
  const [zoneName, setZoneName] = useState<string>("Loading...");
  const [records, setRecords] = useState<Record[]>([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [recordName, setRecordName] = useState('');
  const [recordType, setRecordType] = useState('A');
  const [recordValue, setRecordValue] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Extract ID directly from window location safely on the client side
  useEffect(() => {
    const pathSegments = window.location.pathname.split('/');
    const idFromPath = pathSegments[pathSegments.length - 1];
    if (idFromPath) {
      setZoneIdStr(idFromPath);
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
          setZoneName(zoneData.name);
        } else {
          setZoneName("Unknown Zone");
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
          } else {
            setRecords([]);
          }
        } else {
          setRecords([]);
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
      const fullRecordName = `${recordName}.${zoneName}`;
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/zones/${zoneIdStr}/records/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: fullRecordName,
          type: recordType,
          value: recordValue,
          ttl: 300,
        }),
      });

      if (response.ok) {
        const newRecord = await response.json();
        setRecords([...records, newRecord]);
        setRecordName('');
        setRecordValue('');
      } else {
        alert('Failed to add record.');
      }
    } catch (error) {
      console.error('Error adding record:', error);
      alert('An error occurred.');
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
    }
  };

  if (!zoneIdStr) {
    return (
      <div className="flex h-screen bg-gray-100 items-center justify-center">
        <div className="text-gray-500 text-xl font-medium animate-pulse">Loading Zone...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-[#1f2937] text-white flex flex-col">
        <div className="p-4 text-lg font-bold border-b border-gray-700">AWS Clone</div>
        <nav className="flex-1 overflow-y-auto">
          <ul className="p-2 space-y-1">
            <li>
              <Link href="/zones" className="block px-4 py-2 bg-blue-600 rounded">
                Hosted Zones
              </Link>
            </li>
            <li>
              <Link href="/dashboard" className="block px-4 py-2 text-gray-300 hover:bg-gray-800 rounded">
                Dashboard
              </Link>
            </li>
            <li>
              <Link href="/traffic-policies" className="block px-4 py-2 text-gray-300 hover:bg-gray-800 rounded">
                Traffic Policies
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto bg-gray-50 p-8">
        <div className="max-w-5xl mx-auto">
          <Link href="/zones" className="text-blue-600 hover:underline mb-6 inline-block">
            &larr; Back to Hosted zones
          </Link>
          
          <h2 className="text-2xl font-bold text-gray-800 mb-6">{zoneName} - Records</h2>

          {/* Create Record Form */}
          <div className="bg-white rounded border border-gray-200 shadow-sm p-6 mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Quick create record</h3>
            <form onSubmit={handleAddRecord} className="flex items-end space-x-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Record name</label>
                <div className="flex items-center">
                  <input
                    type="text"
                    required
                    value={recordName}
                    onChange={(e) => setRecordName(e.target.value)}
                    className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="subdomain"
                  />
                  <span className="ml-2 text-gray-500 text-sm">.{zoneName}</span>
                </div>
              </div>
              
              <div className="w-64">
                <label className="block text-sm font-medium text-gray-700 mb-1">Record type</label>
                <select
                  value={recordType}
                  onChange={(e) => setRecordType(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="A">A - Routes traffic to an IPv4</option>
                  <option value="AAAA">AAAA - Routes traffic to an IPv6</option>
                  <option value="CNAME">CNAME - Routes traffic to another domain</option>
                  <option value="TXT">TXT - Text values</option>
                </select>
              </div>

              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Value</label>
                <input
                  type="text"
                  required
                  value={recordValue}
                  onChange={(e) => setRecordValue(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder={recordType === 'A' ? '192.0.2.1' : 'example.com'}
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="bg-[#ec7211] text-white px-6 py-2 rounded font-medium shadow-sm hover:bg-[#d5660f] disabled:opacity-50"
              >
                {submitting ? 'Adding...' : 'Add Record'}
              </button>
            </form>
          </div>

          {/* Records Table */}
          <div className="bg-white rounded border border-gray-200 shadow-sm overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                    Record name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                    Value
                  </th>
                  <th scope="col" className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                      <div className="flex flex-col items-center justify-center">
                        <svg className="animate-spin h-8 w-8 text-blue-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Loading records...
                      </div>
                    </td>
                  </tr>
                ) : records.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                      No records found for this hosted zone.
                    </td>
                  </tr>
                ) : (
                  records.map((record) => (
                    <tr key={record.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                        {record.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                        {record.type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                        {record.value}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                        {record.ttl}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleDeleteRecord(record.id)}
                          className="text-red-600 hover:text-red-900"
                        >
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
      </div>
    </div>
  );
}
