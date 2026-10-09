import Link from 'next/link';

export default function Dashboard() {
  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-slate-800 text-white flex flex-col">
        <div className="p-4 text-xl font-bold border-b border-slate-700">AWS Clone</div>
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/zones" className="block px-4 py-2 text-slate-300 hover:bg-slate-700 rounded">Hosted Zones</Link>
          <Link href="/dashboard" className="block px-4 py-2 bg-blue-600 rounded text-white">Dashboard</Link>
          <Link href="/traffic-policies" className="block px-4 py-2 text-slate-300 hover:bg-slate-700 rounded">Traffic Policies</Link>
        </nav>
      </aside>
      <main className="flex-1 p-8 flex items-center justify-center">
        <h1 className="text-3xl font-bold text-gray-500">Dashboard - Coming Soon</h1>
      </main>
    </div>
  );
}


