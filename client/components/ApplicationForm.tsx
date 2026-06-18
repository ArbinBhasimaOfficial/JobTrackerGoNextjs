'use client';

import { useState } from 'react';
import { Application, ApplicationInput } from '@/types';

interface FormProps {
  application: Application | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ApplicationForm({
  application,
  onClose,
  onSuccess,
}: FormProps) {
  const [form, setForm] = useState<ApplicationInput>({
    company_name: application?.company_name || '',
    job_title: application?.job_title || '',
    job_type: application?.job_type || 'Full-time',
    status: application?.status || 'Applied',
    applied_date: application?.applied_date
      ? application.applied_date.split('T')[0]
      : new Date().toISOString().split('T')[0],
    notes: application?.notes || '',
  });

  const [validationError, setValidationError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (form.company_name.trim().length < 2) {
      setValidationError('Company Name must be at least 2 characters.');
      return;
    }

    const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

    if (!BASE_URL) {
      setValidationError('API URL is not configured');
      return;
    }

    const url = application
      ? `${BASE_URL}/applications/${application.id}`
      : `${BASE_URL}/applications`;

    const method = application ? 'PATCH' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        console.log('Backend error:', data);
        throw new Error(data.error || 'Failed to save application');
      }

      onSuccess();
      onClose();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Server error';

      setValidationError(message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6 relative">
        <h2 className="text-xl font-bold mb-4">
          {application ? 'Edit Application' : 'Add Application'}
        </h2>

        {validationError && (
          <p className="text-red-600 text-sm mb-3">{validationError}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={form.company_name}
            onChange={(e) =>
              setForm({ ...form, company_name: e.target.value })
            }
            placeholder="Company Name"
            className="w-full border p-2 rounded"
          />

          <input
            type="text"
            value={form.job_title}
            onChange={(e) =>
              setForm({ ...form, job_title: e.target.value })
            }
            placeholder="Job Title"
            className="w-full border p-2 rounded"
          />

          <select
            value={form.job_type}
            onChange={(e) =>
              setForm({ ...form, job_type: e.target.value })
            }
            className="w-full border p-2 rounded"
          >
            <option value="Internship">Internship</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
          </select>

          <select
            value={form.status}
            onChange={(e) =>
              setForm({ ...form, status: e.target.value })
            }
            className="w-full border p-2 rounded"
          >
            <option value="Applied">Applied</option>
            <option value="Interviewing">Interviewing</option>
            <option value="Offer">Offer</option>
            <option value="Rejected">Rejected</option>
          </select>

          <input
            type="date"
            value={form.applied_date}
            onChange={(e) =>
              setForm({ ...form, applied_date: e.target.value })
            }
            className="w-full border p-2 rounded"
          />

          <textarea
            value={form.notes}
            onChange={(e) =>
              setForm({ ...form, notes: e.target.value })
            }
            className="w-full border p-2 rounded"
            placeholder="Notes"
          />

          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose}>
              Cancel
            </button>

            <button type="submit" className="bg-blue-600 text-white px-4 py-2">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
