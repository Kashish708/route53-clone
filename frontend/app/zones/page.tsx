// "use client";

// import { useEffect, useState } from 'react';
// import Link from 'next/link';

// interface Zone {
//   id: number;
//   name: string;
//   description: string;
//   record_count: number;
// }

// export default function ZonesList() {
//   const [zones, setZones] = useState<Zone[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [showModal, setShowModal] = useState(false);
//   const [zoneName, setZoneName] = useState('');
//   const [zoneDescription, setZoneDescription] = useState('');
//   const [submitting, setSubmitting] = useState(false);

//   const fetchZones = async () => {
//     try {
//       setLoading(true);
//       const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/zones/`);
//       if (res.ok) {
//         const data = await res.json();
//         setZones(Array.isArray(data) ? data : []);
//       }
//     } catch (error) {
//       console.error('Error fetching zones:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchZones();
//   }, []);

//   const handleCreateZone = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!zoneName) return;

//     setSubmitting(true);
//     try {
//       const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/zones/`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           name: zoneName,
//           description: zoneDescription || 'Hosted zone created via UI',
//         }),
//       });

//       if (res.ok) {
//         setShowModal(false);
//         setZoneName('');
//         setZoneDescription('');
//         fetchZones();
//       } else {
//         alert('Failed to create hosted zone.');
//       }
//     } catch (error) {
//       console.error('Error creating zone:', error);
//       alert('An error occurred.');
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <div className="flex h-screen bg-gray-100">
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

//       <div className="flex-1 overflow-y-auto bg-gray-50 p-8">
//         <div className="max-w-6xl mx-auto">
//           <div className="flex justify-between items-center mb-6">
//             <h1 className="text-2xl font-bold text-gray-800">Hosted zones</h1>
//             <div className="space-x-4">
//               <button
//                 onClick={() => setShowModal(true)}
//                 className="bg-[#ec7211] text-white px-4 py-2 rounded font-medium hover:bg-[#d5660f] shadow-sm"
//               >
//                 Create hosted zone
//               </button>
//             </div>
//           </div>

//           <div className="bg-white rounded border border-gray-200 shadow-sm overflow-hidden">
//             <table className="min-w-full divide-y divide-gray-200 text-sm">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Hosted zone name</th>
//                   <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Description</th>
//                   <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Record count</th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {loading ? (
//                   <tr><td colSpan={3} className="px-6 py-12 text-center text-gray-500">Loading hosted zones...</td></tr>
//                 ) : zones.length === 0 ? (
//                   <tr><td colSpan={3} className="px-6 py-12 text-center text-gray-500">No hosted zones found.</td></tr>
//                 ) : (
//                   zones.map((zone) => (
//                     <tr key={zone.id} className="hover:bg-gray-50">
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <Link href={`/zones/${zone.id}`} className="text-blue-600 hover:underline font-medium">
//                           {zone.name}
//                         </Link>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-gray-500">{zone.description}</td>
//                       <td className="px-6 py-4 whitespace-nowrap text-gray-500">{zone.record_count ?? 0}</td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>

//       {showModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
//             <h3 className="text-lg font-bold text-gray-900 mb-4">Create Hosted Zone</h3>
//             <form onSubmit={handleCreateZone}>
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Domain Name</label>
//                 <input
//                   type="text"
//                   required
//                   placeholder="example.com"
//                   value={zoneName}
//                   onChange={(e) => setZoneName(e.target.value)}
//                   className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
//                 />
//               </div>
//               <div className="mb-6">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
//                 <input
//                   type="text"
//                   placeholder="My production domain"
//                   value={zoneDescription}
//                   onChange={(e) => setZoneDescription(e.target.value)}
//                   className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
//                 />
//               </div>
//               <div className="flex justify-end space-x-3">
//                 <button
//                   type="button"
//                   onClick={() => setShowModal(false)}
//                   className="bg-gray-200 text-gray-700 px-4 py-2 rounded font-medium hover:bg-gray-300"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   disabled={submitting}
//                   className="bg-[#ec7211] text-white px-4 py-2 rounded font-medium hover:bg-[#d5660f] disabled:opacity-50"
//                 >
//                   {submitting ? 'Creating...' : 'Create'}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }


// "use client";

// import { useEffect, useState } from 'react';
// import Link from 'next/link';

// interface Zone {
//   id: number;
//   name: string;
//   description: string;
//   record_count: number;
// }

// export default function ZonesList() {
//   const [zones, setZones] = useState<Zone[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [showModal, setShowModal] = useState(false);
//   const [zoneName, setZoneName] = useState('');
//   const [zoneDescription, setZoneDescription] = useState('');
//   const [submitting, setSubmitting] = useState(false);

//   const fetchZones = async () => {
//     try {
//       setLoading(true);
//       const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/zones/`);
//       if (res.ok) {
//         const data = await res.json();
//         setZones(Array.isArray(data) ? data : []);
//       }
//     } catch (error) {
//       console.error('Error fetching zones:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchZones();
//   }, []);

//   const handleCreateZone = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!zoneName) return;

//     setSubmitting(true);
//     try {
//       const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/zones/`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           name: zoneName,
//           description: zoneDescription || 'Hosted zone created via UI',
//         }),
//       });

//       if (res.ok) {
//         setShowModal(false);
//         setZoneName('');
//         setZoneDescription('');
//         fetchZones();
//       } else {
//         alert('Failed to create hosted zone.');
//       }
//     } catch (error) {
//       console.error('Error creating zone:', error);
//       alert('An error occurred.');
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const handleDeleteZone = async (zoneId: number) => {
//     if (!confirm('Are you sure you want to delete this hosted zone?')) return;

//     try {
//       const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/zones/${zoneId}`, {
//         method: 'DELETE',
//       });

//       if (res.ok) {
//         setZones(zones.filter(z => z.id !== zoneId));
//       } else {
//         alert('Failed to delete hosted zone.');
//       }
//     } catch (error) {
//       console.error('Error deleting zone:', error);
//       alert('An error occurred.');
//     }
//   };

//   return (
//     <div className="flex h-screen bg-gray-100">
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

//       <div className="flex-1 overflow-y-auto bg-gray-50 p-8">
//         <div className="max-w-6xl mx-auto">
//           <div className="flex justify-between items-center mb-6">
//             <h1 className="text-2xl font-bold text-gray-800">Hosted zones</h1>
//             <div className="space-x-4">
//               <button
//                 onClick={() => setShowModal(true)}
//                 className="bg-[#ec7211] text-white px-4 py-2 rounded font-medium hover:bg-[#d5660f] shadow-sm"
//               >
//                 Create hosted zone
//               </button>
//             </div>
//           </div>

//           <div className="bg-white rounded border border-gray-200 shadow-sm overflow-hidden">
//             <table className="min-w-full divide-y divide-gray-200 text-sm">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Hosted zone name</th>
//                   <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Description</th>
//                   <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Record count</th>
//                   <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Action</th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {loading ? (
//                   <tr><td colSpan={4} className="px-6 py-12 text-center text-gray-500">Loading hosted zones...</td></tr>
//                 ) : zones.length === 0 ? (
//                   <tr><td colSpan={4} className="px-6 py-12 text-center text-gray-500">No hosted zones found.</td></tr>
//                 ) : (
//                   zones.map((zone) => (
//                     <tr key={zone.id} className="hover:bg-gray-50">
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <Link href={`/zones/${zone.id}`} className="text-blue-600 hover:underline font-medium">
//                           {zone.name}
//                         </Link>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-gray-500">{zone.description}</td>
//                       <td className="px-6 py-4 whitespace-nowrap text-gray-500">{zone.record_count ?? 0}</td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                         <button
//                           onClick={() => handleDeleteZone(zone.id)}
//                           className="text-red-600 hover:text-red-900"
//                         >
//                           Delete
//                         </button>
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>

//       {showModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
//             <h3 className="text-lg font-bold text-gray-900 mb-4">Create Hosted Zone</h3>
//             <form onSubmit={handleCreateZone}>
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Domain Name</label>
//                 <input
//                   type="text"
//                   required
//                   placeholder="example.com"
//                   value={zoneName}
//                   onChange={(e) => setZoneName(e.target.value)}
//                   className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
//                 />
//               </div>
//               <div className="mb-6">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
//                 <input
//                   type="text"
//                   placeholder="My production domain"
//                   value={zoneDescription}
//                   onChange={(e) => setZoneDescription(e.target.value)}
//                   className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
//                 />
//               </div>
//               <div className="flex justify-end space-x-3">
//                 <button
//                   type="button"
//                   onClick={() => setShowModal(false)}
//                   className="bg-gray-200 text-gray-700 px-4 py-2 rounded font-medium hover:bg-gray-300"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   disabled={submitting}
//                   className="bg-[#ec7211] text-white px-4 py-2 rounded font-medium hover:bg-[#d5660f] disabled:opacity-50"
//                 >
//                   {submitting ? 'Creating...' : 'Create'}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: zoneName,
          description: zoneDescription || 'Hosted zone created via UI',
        }),
      });

      if (res.ok) {
        setShowModal(false);
        setZoneName('');
        setZoneDescription('');
        fetchZones();
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

  const handleDeleteZone = async (zoneId: number) => {
    if (!confirm('Are you sure you want to delete this hosted zone?')) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/zones/${zoneId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setZones(zones.filter(z => z.id !== zoneId));
      } else {
        alert('Failed to delete hosted zone.');
      }
    } catch (error) {
      console.error('Error deleting zone:', error);
      alert('An error occurred.');
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
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

      <div className="flex-1 overflow-y-auto bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Hosted zones</h1>
            <div className="space-x-4">
              <button
                onClick={() => setShowModal(true)}
                className="bg-[#ec7211] text-white px-4 py-2 rounded font-medium hover:bg-[#d5660f] shadow-sm"
              >
                Create hosted zone
              </button>
            </div>
          </div>

          <div className="bg-white rounded border border-gray-200 shadow-sm overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Hosted zone name</th>
                  <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Record count</th>
                  <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr><td colSpan={4} className="px-6 py-12 text-center text-gray-500">Loading hosted zones...</td></tr>
                ) : zones.length === 0 ? (
                  <tr><td colSpan={4} className="px-6 py-12 text-center text-gray-500">No hosted zones found.</td></tr>
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleDeleteZone(zone.id)}
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
                  className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <input
                  type="text"
                  placeholder="My production domain"
                  value={zoneDescription}
                  onChange={(e) => setZoneDescription(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
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
