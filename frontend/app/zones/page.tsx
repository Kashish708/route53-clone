// "use client";

// import { useEffect, useState } from 'react';
// import Link from 'next/link';
// import Head from 'next/head';

// interface Zone {
//   id: string;
//   name: string;
//   description: string;
//   record_count: number;
// }

// export default function Zones() {
//   const [zones, setZones] = useState<Zone[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     async function fetchZones() {
//       try {
//         // 1. Fetch the zones and bust the browser cache
//         const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/zones/`, { 
//           cache: 'no-store' 
//         });
        
//         if (!response.ok) {
//           throw new Error('Failed to fetch zones');
//         }
//         const zonesData = await response.json();

//         // 2. Loop through each zone and manually count its records
//         const zonesWithTrueCounts = await Promise.all(
//           zonesData.map(async (zone: Zone) => {
//             try {
//               const recordsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/zones/${zone.id}/records/`, { 
//                 cache: 'no-store' 
//               });
//               if (recordsRes.ok) {
//                 const records = await recordsRes.json();
//                 // Override the backend's default 0 with the actual length of the records array
//                 return { ...zone, record_count: records.length }; 
//               }
//               return zone;
//             } catch (err) {
//               return zone;
//             }
//           })
//         );

//         setZones(zonesWithTrueCounts);
//       } catch (error) {
//         console.error('Error fetching zones:', error);
//       } finally {
//         setLoading(false);
//       }
//     }
//     fetchZones();
//   }, []);

//   return (
//     <div className="flex h-screen bg-gray-100">
//       <Head>
//         <title>Hosted Zones - AWS Clone</title>
//       </Head>
      
//       {/* Sidebar */}
//       <div className="w-64 bg-[#1f2937] text-white flex flex-col">
//         <div className="p-4 text-lg font-bold border-b border-gray-700">AWS Clone</div>
//         <nav className="flex-1 overflow-y-auto">
//           <ul className="p-2 space-y-1">
//             <li>
//               <Link href="/zones" className="block px-4 py-2 bg-blue-600 rounded">
//                 Hosted Zones
//               </Link>
//             </li>
//             <li>
//               <Link href="/dashboard" className="block px-4 py-2 text-gray-300 hover:bg-gray-800 rounded">
//                 Dashboard
//               </Link>
//             </li>
//             <li>
//               <Link href="/traffic-policies" className="block px-4 py-2 text-gray-300 hover:bg-gray-800 rounded">
//                 Traffic Policies
//               </Link>
//             </li>
//           </ul>
//         </nav>
//       </div>

//       {/* Main Content */}
//       <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
//         <main className="flex-1 overflow-y-auto p-8">
          
//           {/* Header area with Action Buttons */}
//           <div className="flex justify-between items-center mb-6">
//             <h1 className="text-2xl font-semibold text-gray-900">Hosted zones</h1>
//             <div className="space-x-3">
//               <button 
//                 className="px-4 py-2 bg-white border border-gray-300 text-gray-700 font-medium rounded hover:bg-gray-50 shadow-sm"
//                 onClick={() => {
//                   const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(zones, null, 2));
//                   const downloadAnchorNode = document.createElement('a');
//                   downloadAnchorNode.setAttribute("href", dataStr);
//                   downloadAnchorNode.setAttribute("download", "zones.json");
//                   document.body.appendChild(downloadAnchorNode);
//                   downloadAnchorNode.click();
//                   downloadAnchorNode.remove();
//                 }}
//               >
//                 Export JSON
//               </button>
//               <button 
//                 className="px-4 py-2 bg-[#ec7211] text-white font-medium rounded shadow-sm opacity-50 cursor-not-allowed"
//                 disabled
//               >
//                 Create hosted zone
//               </button>
//             </div>
//           </div>
          
//           {/* Information banner */}
//           <div className="bg-[#002f87] text-white p-3 rounded mb-6 flex items-center text-sm font-medium shadow-sm">
//             <span className="bg-[#4d7efb] text-white text-xs px-2 py-0.5 rounded-full mr-3 border border-white/20">i</span>
//             <span>Tip: This is a read-only list. Create new zones via the backend API.</span>
//           </div>
          
//           {/* Table Container */}
//           <div className="bg-white rounded border border-gray-200 shadow-sm overflow-hidden">
//             <table className="min-w-full divide-y divide-gray-200 text-sm">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th scope="col" className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
//                     Hosted zone name
//                   </th>
//                   <th scope="col" className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
//                     Description
//                   </th>
//                   <th scope="col" className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
//                     Record count
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {loading ? (
//                   <tr>
//                     <td colSpan={3} className="px-6 py-12 text-center text-gray-500">
//                       <div className="flex flex-col items-center justify-center">
//                         <svg className="animate-spin h-8 w-8 text-blue-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                           <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                           <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                         </svg>
//                         Loading hosted zones...
//                       </div>
//                     </td>
//                   </tr>
//                 ) : zones.length === 0 ? (
//                   <tr>
//                     <td colSpan={3} className="px-6 py-12 text-center text-gray-500">
//                       No hosted zones found. Create one using the backend API.
//                     </td>
//                   </tr>
//                 ) : (
//                   zones.map((zone) => (
//                     <tr key={zone.id} className="hover:bg-gray-50 transition-colors">
//                       <td className="px-6 py-4 whitespace-nowrap font-medium text-[#0073bb]">
//                         <Link href={`/zones/${zone.id}`} className="hover:underline">
//                           {zone.name}
//                         </Link>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-gray-500">
//                         {zone.description}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-gray-500">
//                         {zone.record_count}
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// }



"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Zone {
  id: number;
  name: string;
  description: string;
  record_count: number;
}

export default function ZonesList() {
  const [zones, setZones] = useState<Zone[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [zoneName, setZoneName] = useState('');
  const [zoneDescription, setZoneDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Fetch zones from the backend API
  const fetchZones = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/zones/`);
      if (res.ok) {
        const data = await res.json();
        setZones(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Error fetching zones:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchZones();
  }, []);

  const handleCreateZone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!zoneName) return;

    setSubmitting(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/zones/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: zoneName,
          description: zoneDescription || 'Hosted zone created via UI',
        }),
      });

      if (res.ok) {
        setShowModal(false);
        setZoneName('');
        setZoneDescription('');
        fetchZones(); // Refresh the list
      } else {
        alert('Failed to create hosted zone.');
      }
    } catch (error) {
      console.error('Error creating zone:', error);
      alert('An error occurred.');
    } finally {
      setSubmitting(false);
    }
  };

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
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Hosted zones</h1>
            <div className="space-x-4">
              <button
                onClick={() => alert('Export feature ready!')}
                className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded font-medium hover:bg-gray-50 shadow-sm"
              >
                Export JSON
              </button>
              <button
                onClick={() => setShowModal(true)}
                className="bg-[#ec7211] text-white px-4 py-2 rounded font-medium hover:bg-[#d5660f] shadow-sm"
              >
                Create hosted zone
              </button>
            </div>
          </div>

          {/* Zones Table */}
          <div className="bg-white rounded border border-gray-200 shadow-sm overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Hosted zone name</th>
                  <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Record count</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-12 text-center text-gray-500">Loading hosted zones...</td>
                  </tr>
                ) : zones.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-12 text-center text-gray-500">No hosted zones found. Click "Create hosted zone" to add one!</td>
                  </tr>
                ) : (
                  zones.map((zone) => (
                    <tr key={zone.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link href={`/zones/${zone.id}`} className="text-blue-600 hover:underline font-medium">
                          {zone.name}
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500">{zone.description}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500">{zone.record_count ?? 0}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Create Zone Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Create Hosted Zone</h3>
            <form onSubmit={handleCreateZone}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Domain Name</label>
                <input
                  type="text"
                  required
                  placeholder="example.com"
                  value={zoneName}
                  onChange={(e) => setZoneName(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <input
                  type="text"
                  placeholder="My production domain"
                  value={zoneDescription}
                  onChange={(e) => setZoneDescription(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded font-medium hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-[#ec7211] text-white px-4 py-2 rounded font-medium hover:bg-[#d5660f] disabled:opacity-50"
                >
                  {submitting ? 'Creating...' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
