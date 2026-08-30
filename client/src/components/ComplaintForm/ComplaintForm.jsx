import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, AlertCircle, HelpCircle, Image as ImageIcon } from 'lucide-react';
import api from '../../services/api.js';

const CATEGORIES = [
  'Classroom',
  'Laboratory',
  'Hostel',
  'Wi-Fi / Internet',
  'Infrastructure',
  'Transportation',
  'Cleanliness',
  'Other'
];

export const ComplaintForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    location: '',
    imageUrl: '',
  });

  const [loading, setLoading] = useState(false);
  const [suggestingCategory, setSuggestingCategory] = useState(false);
  const [error, setError] = useState('');
  
  // Duplicate check warning state
  const [duplicateWarning, setDuplicateWarning] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Trigger AI category suggestion on description field blur
  const handleDescriptionBlur = async () => {
    if (formData.description.trim().length < 10 || formData.category) return;
    
    setSuggestingCategory(true);
    try {
      const { data } = await api.post('/ai/categorize', { description: formData.description });
      if (data.category) {
        setFormData(prev => ({ ...prev, category: data.category }));
      }
    } catch (err) {
      console.log('Failed to suggest category', err.message);
    } finally {
      setSuggestingCategory(false);
    }
  };

  const handleSubmit = async (e, skipDup = false) => {
    if (e) e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = {
        ...formData,
        skipDuplicateCheck: skipDup
      };

      const { data } = await api.post('/complaints', payload);
      
      if (data.isDuplicateWarning) {
        // Show duplicate check modal
        setDuplicateWarning(data.duplicateDetails);
        setLoading(false);
        return;
      }

      // If successful, navigate to student complaints list
      navigate('/student/complaints');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit complaint. Please check your connection.');
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-5">
        {error && (
          <div className="flex items-center space-x-2 rounded-xl border border-red-800/60 bg-red-950/20 p-4 text-xs font-semibold text-red-400">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}

        {/* Title */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-400">Complaint Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="Brief name for the problem (e.g. WiFi Router Not Powering On)"
            className="w-full rounded-xl border border-slate-800 bg-[#0d1324] px-4 py-3 text-sm text-slate-100 placeholder-slate-600 focus:border-brand-500 focus:outline-none transition-colors"
          />
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-400">Detailed Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            onBlur={handleDescriptionBlur}
            required
            rows={4}
            placeholder="Explain the problem in detail. (AI will automatically categorize your issue based on this)"
            className="w-full rounded-xl border border-slate-800 bg-[#0d1324] px-4 py-3 text-sm text-slate-100 placeholder-slate-600 focus:border-brand-500 focus:outline-none transition-colors"
          />
          {suggestingCategory && (
            <span className="flex items-center text-[10px] font-semibold text-brand-400 animate-pulse mt-1">
              <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
              AI is suggesting the best category...
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {/* Category */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-400">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-slate-800 bg-[#0d1324] px-4 py-3 text-sm text-slate-100 focus:border-brand-500 focus:outline-none transition-colors"
            >
              <option value="" disabled>Select category</option>
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Location */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-400">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              placeholder="e.g. Main Block - Room 204"
              className="w-full rounded-xl border border-slate-800 bg-[#0d1324] px-4 py-3 text-sm text-slate-100 placeholder-slate-600 focus:border-brand-500 focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* Image Attachment (URL) */}
        <div className="space-y-1.5">
          <div className="flex items-center space-x-1.5">
            <ImageIcon className="h-4 w-4 text-slate-500" />
            <label className="text-xs font-semibold text-slate-400">Attached Image (URL)</label>
          </div>
          <input
            type="url"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            placeholder="Paste a direct image link (e.g. http://example.com/image.jpg)"
            className="w-full rounded-xl border border-slate-800 bg-[#0d1324] px-4 py-3 text-sm text-slate-100 placeholder-slate-600 focus:border-brand-500 focus:outline-none transition-colors"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand-600/20 hover:from-brand-500 hover:to-brand-400 focus:outline-none disabled:opacity-50 transition-all duration-300"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            'Submit Complaint'
          )}
        </button>
      </form>

      {/* Duplicate Warning Dialog Modal */}
      {duplicateWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-[#0f172a] p-6 shadow-2xl">
            <div className="flex items-start space-x-3">
              <div className="rounded-full bg-amber-950/40 p-2 text-amber-500">
                <AlertCircle className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-slate-100 font-display">
                  Potential Duplicate Complaint
                </h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  A similar active complaint has already been submitted at this location.
                </p>

                <div className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-3.5 mt-3 space-y-1 text-xs">
                  <p className="font-semibold text-slate-300">
                    ID: <span className="font-mono text-brand-400">{duplicateWarning.complaintId}</span>
                  </p>
                  <p className="text-slate-400">Title: <span className="text-slate-300 font-medium">{duplicateWarning.title}</span></p>
                  <p className="text-slate-400">Status: <span className="text-amber-400 font-medium">{duplicateWarning.status}</span></p>
                </div>

                <p className="text-xs text-slate-400 mt-3 font-semibold">
                  Do you still wish to submit this new complaint?
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setDuplicateWarning(null);
                  setLoading(false);
                }}
                className="rounded-xl border border-slate-800 px-4 py-2.5 text-xs font-semibold text-slate-400 hover:bg-slate-900 transition-colors"
              >
                No, Cancel
              </button>
              <button
                onClick={() => {
                  setDuplicateWarning(null);
                  handleSubmit(null, true); // submit skipping warning
                }}
                className="rounded-xl bg-brand-600 px-4 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-brand-500 transition-colors"
              >
                Yes, Submit Anyway
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default ComplaintForm;
