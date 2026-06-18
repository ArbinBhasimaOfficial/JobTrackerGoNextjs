'use client';

import { useEffect, useState } from 'react';
import { Application } from '@/types';
import ApplicationForm from '../components/ApplicationForm';

export default function Dashboard() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [editingApp, setEditingApp] = useState<Application | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchApplications = async () => {
    setLoading(true);

    try {
      const query = new URLSearchParams();

      if (search) query.append('search', search);
      if (statusFilter) query.append('status', statusFilter);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/applications?${query.toString()}`
      );

      if (!res.ok) {
        throw new Error('Could not fetch records');
      }

      const data: Application[] = await res.json();
      setApplications(data || []);
      setError('');
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'An unexpected error occurred';

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchApplications();
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [search, statusFilter]);

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this application?')) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/applications/${id}`,
        {
          method: 'DELETE',
        }
      );

      if (!res.ok) {
        throw new Error('Delete failed');
      }

      setApplications((prev) => prev.filter((app) => app.id !== id));
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Delete failed';

      alert(message);
    }
  };

  return (
    <main className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Job Applications Tracker
        </h1>

        <button
          onClick={() => {
            setEditingApp(null);
            setIsModalOpen(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Add Application
        </button>
      </div>

      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by company or title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded-lg p-2 flex-1 outline-none focus:border-blue-500"
        />

        <select
          value={statusFilter}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
            setStatusFilter(e.target.value)
          }
          className="border border-gray-300 rounded-lg p-2 outline-none focus:border-blue-500"
        >
          <option value="">All Statuses</option>
          <option value="Applied">Applied</option>
          <option value="Interviewing">Interviewing</option>
          <option value="Offer">Offer</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      {error && (
        <div className="p-4 mb-4 text-red-700 bg-red-100 rounded-lg">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-10 text-gray-500">
          Loading tracking pipeline...
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Company
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Date Applied
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {applications.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-gray-400">
                    No applications found.
                  </td>
                </tr>
              ) : (
                applications.map((app) => (
                  <tr key={app.id}>
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {app.company_name}
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {app.job_title}
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {app.job_type}
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {app.applied_date.split('T')[0]}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`px-2 inline-flex text-xs font-semibold rounded-full
                        ${
                          app.status === 'Offer'
                            ? 'bg-green-100 text-green-800'
                            : app.status === 'Interviewing'
                            ? 'bg-yellow-100 text-yellow-800'
                            : app.status === 'Rejected'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {app.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => {
                          setEditingApp(app);
                          setIsModalOpen(true);
                        }}
                        className="text-blue-600 hover:text-blue-900 font-medium"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(app.id)}
                        className="text-red-600 hover:text-red-900 font-medium"
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
      )}

      {isModalOpen && (
        <ApplicationForm
          application={editingApp}
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => {
            setIsModalOpen(false);
            fetchApplications();
          }}
        />
      )}
    </main>
  );
}
