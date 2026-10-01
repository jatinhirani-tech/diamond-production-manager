import React, { useState, useEffect } from 'react';
import { Calendar, Tag, FileText, Check, Plus, AlertCircle } from 'lucide-react';
import { DIAMOND_SHAPES } from '../../constants/diamondShapes';
import { getTodayDateString } from '../../utils/formatters';
import { validateDiamondRecord } from '../../utils/validation';
import Button from '../common/Button';

export default function RecordForm({
  initialData,
  onSubmit,
  onCancel,
  isEditing = false,
  showAddAnother = true,
}) {
  const [formData, setFormData] = useState({
    date: getTodayDateString(),
    weight: '',
    shape: 'Round',
    hasUniqueId: false,
    packetId: '',
    notes: '',
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        date: initialData.date || getTodayDateString(),
        weight: initialData.weight !== undefined ? String(initialData.weight) : '',
        shape: initialData.shape || 'Round',
        hasUniqueId: Boolean(initialData.hasUniqueId),
        packetId: initialData.packetId || '',
        notes: initialData.notes || '',
      });
    }
  }, [initialData]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const handleSubmit = (e, andAddAnother = false) => {
    if (e) e.preventDefault();

    const { isValid, errors: validationErrors } = validateDiamondRecord(formData);
    if (!isValid) {
      setErrors(validationErrors);
      setTouched({
        date: true,
        weight: true,
        shape: true,
        hasUniqueId: true,
        packetId: true,
      });
      return;
    }

    const payload = {
      ...formData,
      weight: parseFloat(formData.weight),
      packetId: formData.hasUniqueId ? formData.packetId.trim() : null,
      notes: formData.notes.trim(),
    };

    onSubmit(payload, andAddAnother);

    if (andAddAnother) {
      // Keep date and shape for convenience, clear weight, packetId, notes
      setFormData(prev => ({
        ...prev,
        weight: '',
        packetId: '',
        notes: '',
      }));
      setTouched({});
      setErrors({});
    }
  };

  return (
    <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-6">
      {/* Date Field */}
      <div>
        <label className="block text-sm font-bold text-slate-800 mb-1.5 flex items-center justify-between">
          <span>Production Date <span className="text-rose-500">*</span></span>
          <span className="text-xs text-slate-400 font-normal">When diamond was crafted</span>
        </label>
        <div className="relative">
          <input
            type="date"
            value={formData.date}
            onChange={(e) => handleChange('date', e.target.value)}
            onBlur={() => handleBlur('date')}
            className={`w-full rounded-xl border px-4 py-3 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
              touched.date && errors.date
                ? 'border-rose-300 bg-rose-50/20'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          />
        </div>
        {touched.date && errors.date && (
          <p className="mt-1 text-xs text-rose-500 flex items-center gap-1 font-medium">
            <AlertCircle className="w-3.5 h-3.5" /> {errors.date}
          </p>
        )}
      </div>

      {/* Weight & Shape Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Diamond Weight */}
        <div>
          <label className="block text-sm font-bold text-slate-800 mb-1.5 flex items-center justify-between">
            <span>Diamond Weight <span className="text-rose-500">*</span></span>
            <span className="text-xs text-indigo-600 font-semibold">In Carats (CT)</span>
          </label>
          <div className="relative">
            <input
              type="number"
              step="any"
              min="0.001"
              placeholder="e.g. 4.50"
              value={formData.weight}
              onChange={(e) => handleChange('weight', e.target.value)}
              onBlur={() => handleBlur('weight')}
              autoFocus={!isEditing}
              className={`w-full rounded-xl border px-4 py-3 text-base font-bold text-slate-900 font-mono-numbers focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
                touched.weight && errors.weight
                  ? 'border-rose-300 bg-rose-50/20'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            />
            <div className="absolute right-3.5 top-3.5 px-2 py-0.5 rounded bg-slate-100 text-xs font-black text-slate-600 pointer-events-none">
              CT
            </div>
          </div>
          {touched.weight && errors.weight && (
            <p className="mt-1 text-xs text-rose-500 flex items-center gap-1 font-medium">
              <AlertCircle className="w-3.5 h-3.5" /> {errors.weight}
            </p>
          )}
        </div>

        {/* Diamond Shape */}
        <div>
          <label className="block text-sm font-bold text-slate-800 mb-1.5">
            Diamond Shape <span className="text-rose-500">*</span>
          </label>
          <select
            value={formData.shape}
            onChange={(e) => handleChange('shape', e.target.value)}
            onBlur={() => handleBlur('shape')}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 hover:border-slate-300 transition-all"
          >
            {DIAMOND_SHAPES.map((shape) => (
              <option key={shape} value={shape}>
                {shape}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Unique Packet ID Toggle Section */}
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
        <label className="block text-sm font-bold text-slate-800">
          Does this packet have a unique ID?
        </label>
        
        <div className="grid grid-cols-2 gap-3 max-w-xs">
          <button
            type="button"
            onClick={() => handleChange('hasUniqueId', true)}
            className={`py-2.5 px-4 rounded-xl text-sm font-bold border transition-all flex items-center justify-center gap-2 ${
              formData.hasUniqueId
                ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            {formData.hasUniqueId && <Check className="w-4 h-4 text-emerald-400" />}
            <span>Yes</span>
          </button>
          
          <button
            type="button"
            onClick={() => {
              handleChange('hasUniqueId', false);
              handleChange('packetId', '');
            }}
            className={`py-2.5 px-4 rounded-xl text-sm font-bold border transition-all flex items-center justify-center gap-2 ${
              !formData.hasUniqueId
                ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            {!formData.hasUniqueId && <Check className="w-4 h-4 text-emerald-400" />}
            <span>No</span>
          </button>
        </div>

        {/* Packet ID input shown only if Yes */}
        {formData.hasUniqueId && (
          <div className="mt-3 pt-3 border-t border-slate-200/80 animate-fadeIn">
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-slate-400" />
              <span>Packet ID <span className="text-rose-500">*</span></span>
            </label>
            <input
              type="text"
              placeholder="e.g. PKT-00125 or PKT003"
              value={formData.packetId}
              onChange={(e) => handleChange('packetId', e.target.value)}
              onBlur={() => handleBlur('packetId')}
              className={`w-full rounded-xl border px-3.5 py-2.5 text-sm font-semibold text-slate-800 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
                touched.packetId && errors.packetId
                  ? 'border-rose-300 bg-rose-50/20'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            />
            {touched.packetId && errors.packetId && (
              <p className="mt-1 text-xs text-rose-500 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5" /> {errors.packetId}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Notes Field */}
      <div>
        <label className="block text-sm font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
          <FileText className="w-4 h-4 text-slate-400" />
          <span>Notes (Optional)</span>
        </label>
        <textarea
          rows={3}
          placeholder="e.g. Good quality, Customer XYZ, Urgent order, Special instructions..."
          value={formData.notes}
          onChange={(e) => handleChange('notes', e.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 hover:border-slate-300 transition-all resize-y"
        />
      </div>

      {/* Action Buttons */}
      <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-end gap-3">
        {onCancel && (
          <Button
            variant="secondary"
            onClick={onCancel}
            size="lg"
            fullWidth={false}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
        )}

        {showAddAnother && !isEditing && (
          <Button
            type="button"
            variant="secondary"
            onClick={(e) => handleSubmit(e, true)}
            size="lg"
            icon={Plus}
            className="w-full sm:w-auto border-indigo-200 text-indigo-700 hover:bg-indigo-50"
          >
            Save & Add Another
          </Button>
        )}

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full sm:w-auto shadow-md"
        >
          {isEditing ? 'Update Record' : 'Save Diamond'}
        </Button>
      </div>
    </form>
  );
}
