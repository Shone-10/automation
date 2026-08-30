import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import ComplaintForm from '../../components/ComplaintForm/ComplaintForm.jsx';

export const NewComplaint = () => {
  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center space-x-1.5 text-xs text-slate-500">
        <ChevronLeft className="h-4.5 w-4.5" />
        <Link to="/student/dashboard" className="hover:text-slate-300">Dashboard</Link>
        <span>/</span>
        <Link to="/student/complaints" className="hover:text-slate-300">My Complaints</Link>
        <span>/</span>
        <span className="text-slate-400">New Submission</span>
      </div>

      <div>
        <h2 className="text-xl font-bold tracking-tight text-white font-display">Submit New Complaint</h2>
        <p className="text-xs text-slate-400 mt-1">
          Provide issue details and location to file a ticket. AI will assist with categorization.
        </p>
      </div>

      <div className="glass-card rounded-2xl p-6 sm:p-8">
        <ComplaintForm />
      </div>
    </div>
  );
};
export default NewComplaint;
