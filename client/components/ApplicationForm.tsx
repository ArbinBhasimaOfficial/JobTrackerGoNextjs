'use client';

import { useState } from 'react';
import { Application, ApplicationInput } from '@/types';

interface FormProps {
  application: Application | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ApplicationForm({ application, onClose, onSuccess }: FormProps) {
  const [form, setForm] = useState<ApplicationInput>({
    company_name: application?.company_name || '',
    job_title: application?.job_title || '',
    job_type: application?.job_type || 'Full-time',
    status: application?.status || 'Applied',
    applied_date: application?.applied_date ? application.applied_date.split('T')[0] : new Date().toISOString().split('T')[0],
    notes: application?.notes || '',
  });

  const [validationError, setValidationError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.company_name.trim().length < 2) {
      setValidationError('Company Name must be at least 2 characters.');
      return;
    }

    const url = application
      ? `http://localhost:8080/applications/${application.id}`
      : 'http://localhost:8080/applications';

    const method = application ? 'PATCH' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error('Failed to save data field validation');
      onSuccess();
      } catch (err: unknown)
      {
        const message =
          err instanceof Error ? err.message : 'Server error';

        setValidationError(message);
      }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6 relative">
        <h2 className="text-xl font-bold mb-4">{application ? 'Edit Application' : 'Add Application'}</h2>

        {validationError && <p className="text-red-600 text-sm mb-3">{validationError}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Company Name *</label>
            <input
              type="text"
              required
              value={form.company_name}
              onChange={(e) => setForm({ ...form, company_name: e.target.value })}
              className="mt-1 w-full border border-gray-300 p-2 rounded-md outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Job Title *</label>
            <input
              type="text"
              required
              value={form.job_title}
              onChange={(e) => setForm({ ...form, job_title: e.target.value })}
              className="mt-1 w-full border border-gray-300 p-2 rounded-md outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Job Type</label>
            <select
              value={form.job_type}
              onChange={(e) => setForm({ ...form, job_type: e.target.value })}
              className="mt-1 w-full border border-gray-300 p-2 rounded-md outline-none"
            >
              <option value="Internship">Internship</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="mt-1 w-full border border-gray-300 p-2 rounded-md outline-none"
            >
              <option value="Applied">Applied</option>
              <option value="Interviewing">Interviewing</option>
              <option value="Offer">Offer</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Applied Date *</label>
            <input
              type="date"
              required
              value={form.applied_date}
              onChange={(e) => setForm({ ...form, applied_date: e.target.value })}
              className="mt-1 w-full border border-gray-300 p-2 rounded-md outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Notes (Optional)</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="mt-1 w-full border border-gray-300 p-2 rounded-md outline-none h-20 resize-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
