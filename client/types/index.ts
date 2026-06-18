export interface Application {
  id: number;
  company_name: string;
  job_title: string;
  job_type: 'Internship' | 'Full-time' | 'Part-time';
  status: 'Applied' | 'Interviewing' | 'Offer' | 'Rejected';
  applied_date: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface ApplicationInput {
  company_name: string;
  job_title: string;
  job_type: string;
  status: string;
  applied_date: string;
  notes: string;
}
