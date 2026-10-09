"use client";

import { useEffect, useState, Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

// 1. Rename your original component to act as the inner content
function DNSRecordsContent() {
  const params = useParams();
  const router = useRouter();
  const [zone, setZone] = useState<any>(null);
  const [recordName, setRecordName] = useState('');
  const [recordType, setRecordType] = useState('A');
  const [recordValue, setRecordValue] = useState('');

  const fetchZone = () => {
    fetch(`http://127.0.0.1:8000/zones/`)
      .then(res => res.json())
      .then(data => {
        const currentZone = data.find((z: any) => z.id.toString() === params.id);
        setZone(currentZone);
      });
  };

  useEffect(() => {
    if (params.id) {
      fetchZone();
    }
  }, [params.id]);

  const handleCreateRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch(`http://127.0.0.1:8000/zones/${params.id}/records/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: recordName,
        record_type: recordType,
        value: recordValue,
        ttl: 300
      })
    });
    setRecordName('');
    setRecordValue('');
    fetchZone(); 
  };

  const handleDelete = async (recordId: number) => {
    await fetch(`http://127.0.0.1:8000/records/${recordId}`, { method: 'DELETE' });
    fetchZone();
  };

  if (!zone) return <div className="p-8">Loading...</div>;

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-slate-800 text-white flex flex-col">
        <div className="p-4 text-xl font-bold border-b border-slate-700">AWS Clone</div>
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/zones" className="block px-4 py-2 bg-blue-600 rounded text-white">Hosted Zones</Link>
          <Link href="/dashboard" className="block px-4 py-2 text-slate-300 hover:bg-slate-700 rounded">Dashboard</Link>
        </nav>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        <button onClick={() => router.push('/zones')} className="text-blue-600 mb-4 hover:underline">
          &larr; Back to Hosted zones
        </button>
        <h1 className="text-2xl font-bold mb-6 text-gray-900">{zone.name} - Records</h1>

        <div className="bg-white p-6 border border-gray-200 rounded shadow-sm mb-8">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Quick create record</h2>
          <form onSubmit={handleCreateRecord} className="flex gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Record name</label>
              <div className="flex items-center">
                <input required type="text" value={recordName} onChange={e => setRecordName(e.target.value)} className="border rounded p-2 text-sm text-black" placeholder="subdomain" />
                <span className="ml-2 text-gray-500">.{zone.name}</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Record type</label>
              <select value={recordType} onChange={e => setRecordType(e.target.value)} className="border rounded p-2 text-sm text-black">
                <option value="A">A - Routes traffic to an IPv4</option>
                <option value="AAAA">AAAA - Routes traffic to an IPv6</option>
                <option value="CNAME">CNAME - Routes traffic to another domain</option>
                <option value="TXT">TXT - Text record</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Value</label>
              <input required type="text" value={recordValue} onChange={e => setRecordValue(e.target.value)} className="border rounded p-2 w-full text-sm text-black" placeholder="192.0.2.1" />
            </div>
            <button type="submit" className="bg-[#ec7211] hover:bg-[#eb5f07] text-white px-4 py-2 rounded font-bold text-sm">
              Add Record
            </button>
          </form>
        </div>

        <div className="bg-white border border-gray-200 rounded shadow-sm overflow-hidden">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 font-semibold text-gray-600">Record name</th>
                <th className="px-6 py-3 font-semibold text-gray-600">Type</th>
                <th className="px-6 py-3 font-semibold text-gray-600">Value</th>
                <th className="px-6 py-3 font-semibold text-gray-600">TTL</th>
                <th className="px-6 py-3 font-semibold text-gray-600">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {zone.records?.length === 0 && (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">No records found.</td></tr>
              )}
              {zone.records?.map((record: any) => (
                <tr key={record.id} className="hover:bg-gray-50">
                  <td className="px-6 py-3 font-medium text-gray-900">{record.name}.{zone.name}</td>
                  <td className="px-6 py-3 text-gray-700">{record.record_type}</td>
                  <td className="px-6 py-3 text-gray-700">{record.value}</td>
                  <td className="px-6 py-3 text-gray-700">{record.ttl}</td>
                  <td className="px-6 py-3">
                    <button onClick={() => handleDelete(record.id)} className="text-red-600 hover:underline">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

// 2. Export a parent component that wraps the content in a Suspense boundary
export default function DNSRecords() {
  return (
    <Suspense fallback={<div className="p-8">Loading page...</div>}>
      <DNSRecordsContent />
    </Suspense>
  );
}