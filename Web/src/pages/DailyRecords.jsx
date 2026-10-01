import React, { useState, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Plus, BookOpen, Calendar, Gem, ArrowDownUp } from 'lucide-react';
import { useDiamond } from '../context/DiamondContext';
import { groupRecordsByDate } from '../utils/calculations';
import { formatCarat, formatDate, formatNumber } from '../utils/formatters';
import RecordCard from '../components/records/RecordCard';
import RecordForm from '../components/records/RecordForm';
import SearchBar from '../components/records/SearchBar';
import FilterBar from '../components/records/FilterBar';
import DeleteConfirmModal from '../components/records/DeleteConfirmModal';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';
import EmptyState from '../components/common/EmptyState';

export default function DailyRecords() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialDate = searchParams.get('date') || '';

  const { records, updateRecord, deleteRecord } = useDiamond();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [shapeFilter, setShapeFilter] = useState('All');
  const [uniqueIdFilter, setUniqueIdFilter] = useState('All');
  const [depositFilter, setDepositFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState(initialDate);
  const [sortOption, setSortOption] = useState('newest');

  // Modal states for Edit and Delete
  const [editingRecord, setEditingRecord] = useState(null);
  const [deletingRecord, setDeletingRecord] = useState(null);

  // Filter records based on active criteria
  const filteredRecords = useMemo(() => {
    return records.filter((rec) => {
      // Shape filter
      if (shapeFilter !== 'All' && rec.shape !== shapeFilter) {
        return false;
      }

      // Unique ID filter
      if (uniqueIdFilter === 'HasUniqueId' && !rec.hasUniqueId) {
        return false;
      }
      if (uniqueIdFilter === 'NoUniqueId' && rec.hasUniqueId) {
        return false;
      }

      // Deposit status filter
      if (depositFilter === 'Deposited' && !rec.isDeposited) {
        return false;
      }
      if (depositFilter === 'NotDeposited' && rec.isDeposited) {
        return false;
      }

      // Date filter
      if (dateFilter && rec.date !== dateFilter) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const weightMatch = String(rec.weight).includes(q);
        const shapeMatch = (rec.shape || '').toLowerCase().includes(q);
        const packetMatch = (rec.packetId || '').toLowerCase().includes(q);
        const notesMatch = (rec.notes || '').toLowerCase().includes(q);
        const dateMatch = (rec.date || '').toLowerCase().includes(q) || formatDate(rec.date).toLowerCase().includes(q);

        if (!weightMatch && !shapeMatch && !packetMatch && !notesMatch && !dateMatch) {
          return false;
        }
      }

      return true;
    });
  }, [records, shapeFilter, uniqueIdFilter, dateFilter, searchQuery]);

  // Sort filtered records
  const sortedRecords = useMemo(() => {
    const list = [...filteredRecords];
    switch (sortOption) {
      case 'oldest':
        return list.sort((a, b) => a.date.localeCompare(b.date) || (a.createdAt || '').localeCompare(b.createdAt || ''));
      case 'weight_desc':
        return list.sort((a, b) => (b.weight || 0) - (a.weight || 0));
      case 'weight_asc':
        return list.sort((a, b) => (a.weight || 0) - (b.weight || 0));
      case 'newest':
      default:
        return list.sort((a, b) => b.date.localeCompare(a.date) || (b.createdAt || '').localeCompare(a.createdAt || ''));
    }
  }, [filteredRecords, sortOption]);

  // Group by date
  const dateGroups = useMemo(() => {
    // If sorted by weight, we still group or keep sorted list
    if (sortOption.startsWith('weight_')) {
      // Sort individual items within each group or show flat?
      // Prompt says: "Group records by date."
      const groups = groupRecordsByDate(sortedRecords);
      // Sort the records inside each group according to weight
      groups.forEach(g => {
        g.records.sort((a, b) => sortOption === 'weight_desc' ? b.weight - a.weight : a.weight - b.weight);
      });
      return groups;
    }
    if (sortOption === 'oldest') {
      const groups = groupRecordsByDate(sortedRecords);
      return groups.reverse();
    }
    return groupRecordsByDate(sortedRecords);
  }, [sortedRecords, sortOption]);

  const hasActiveFilters = shapeFilter !== 'All' || uniqueIdFilter !== 'All' || depositFilter !== 'All' || dateFilter !== '' || searchQuery !== '';

  const handleResetFilters = () => {
    setShapeFilter('All');
    setUniqueIdFilter('All');
    setDepositFilter('All');
    setDateFilter('');
    setSearchQuery('');
  };

  const handleEditSubmit = (payload) => {
    if (!editingRecord) return;
    updateRecord(editingRecord.id, payload);
    setEditingRecord(null);
  };

  const handleDeleteConfirm = () => {
    if (!deletingRecord) return;
    deleteRecord(deletingRecord.id);
    setDeletingRecord(null);
  };

  const totalFilteredWeight = useMemo(() => {
    return sortedRecords.reduce((sum, r) => sum + (Number(r.weight) || 0), 0);
  }, [sortedRecords]);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <BookOpen className="w-7 h-7 text-indigo-600" />
            <span>Daily Records</span>
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Log of all diamonds grouped by production date with daily totals
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="primary"
            icon={Plus}
            onClick={() => navigate('/add')}
            size="md"
            className="shadow-md"
          >
            Add Diamond
          </Button>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="space-y-3">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          onClear={() => setSearchQuery('')}
        />

        <FilterBar
          shapeFilter={shapeFilter}
          onShapeFilterChange={setShapeFilter}
          uniqueIdFilter={uniqueIdFilter}
          onUniqueIdFilterChange={setUniqueIdFilter}
          depositFilter={depositFilter}
          onDepositFilterChange={setDepositFilter}
          dateFilter={dateFilter}
          onDateFilterChange={setDateFilter}
          sortOption={sortOption}
          onSortOptionChange={setSortOption}
          onResetFilters={handleResetFilters}
          hasActiveFilters={hasActiveFilters}
        />
      </div>

      {/* Summary of current view */}
      <div className="flex items-center justify-between px-2 text-xs text-slate-500 font-medium">
        <span>
          Showing <strong>{formatNumber(sortedRecords.length)}</strong> diamond records
          {dateFilter ? ` on ${formatDate(dateFilter)}` : ''}
        </span>
        <span>
          Filtered Total: <strong className="text-indigo-700 font-mono-numbers">{formatCarat(totalFilteredWeight)}</strong>
        </span>
      </div>

      {/* Records Grouped by Date */}
      {dateGroups.length === 0 ? (
        <EmptyState
          title={hasActiveFilters ? 'No diamonds match your filters' : 'No diamond records yet'}
          description={
            hasActiveFilters
              ? 'Try adjusting your search criteria or resetting filters to see your records.'
              : 'Start by adding your first diamond piece into the production manager.'
          }
          actionText={hasActiveFilters ? 'Reset Filters' : '+ Add First Diamond'}
          onAction={hasActiveFilters ? handleResetFilters : () => navigate('/add')}
        />
      ) : (
        <div className="space-y-8">
          {dateGroups.map((group) => (
            <div
              key={group.date}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-subtle overflow-hidden"
            >
              {/* Prominent Daily Header (Section 12 & 13) */}
              <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-50 via-white to-slate-50 border-b border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-sm">
                    <Calendar className="w-5 h-5 text-sky-300" />
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                      {formatDate(group.date)}
                    </h2>
                    <p className="text-xs text-slate-500">
                      {group.count} {group.count === 1 ? 'Diamond produced' : 'Diamonds produced'}
                    </p>
                  </div>
                </div>

                {/* Prominent Daily Total Banner */}
                <div className="flex items-center gap-3 self-end sm:self-auto bg-indigo-50/80 px-4 py-2 rounded-xl border border-indigo-100">
                  <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider">
                    Daily Total:
                  </span>
                  <span className="text-lg sm:text-xl font-black text-indigo-950 font-mono-numbers">
                    {formatCarat(group.totalWeight)}
                  </span>
                </div>
              </div>

              {/* Diamond Cards Grid for this Date */}
              <div className="p-4 sm:p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 bg-slate-50/30">
                {group.records.map((record) => (
                  <RecordCard
                    key={record.id}
                    record={record}
                    onEdit={setEditingRecord}
                    onDelete={setDeletingRecord}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Record Modal */}
      {editingRecord && (
        <Modal
          isOpen={Boolean(editingRecord)}
          onClose={() => setEditingRecord(null)}
          title="Edit Diamond Record"
          subtitle={`Editing piece crafted on ${formatDate(editingRecord.date)}`}
          maxWidth="max-w-lg"
        >
          <RecordForm
            initialData={editingRecord}
            isEditing={true}
            showAddAnother={false}
            onSubmit={handleEditSubmit}
            onCancel={() => setEditingRecord(null)}
          />
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={Boolean(deletingRecord)}
        onClose={() => setDeletingRecord(null)}
        onConfirm={handleDeleteConfirm}
        record={deletingRecord}
      />
    </div>
  );
}
