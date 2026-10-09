import Link from 'next/link';

export default function Home() {
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
      <main className="flex-1 p-8 flex flex-col items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-700 mb-4">Route 53 Dashboard</h1>
          <p className="text-gray-500">Welcome to the mocked AWS Route53 experience. Navigate to Hosted Zones to manage your DNS.</p>
        </div>
      </main>
    </div>
  );
}