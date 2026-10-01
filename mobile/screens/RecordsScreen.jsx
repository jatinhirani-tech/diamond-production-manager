import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useDiamond } from '../context/DiamondContext';
import { groupRecordsByDate, calculateTotalWeight } from '../utils/calculations';
import { formatCarat, formatDate, formatNumber } from '../utils/formatters';
import RecordCard from '../components/records/RecordCard';
import SearchBar from '../components/records/SearchBar';
import FilterModal from '../components/records/FilterModal';
import DeleteConfirmModal from '../components/records/DeleteConfirmModal';
import EmptyState from '../components/common/EmptyState';
import { COLORS, SHADOWS, FONTS } from '../constants/theme';

export default function RecordsScreen({ navigation, route }) {
  const initialDate = route.params?.date || '';
  const { records, deleteRecord } = useDiamond();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [depositFilter, setDepositFilter] = useState('All');
  const [shapeFilter, setShapeFilter] = useState('All');
  const [uniqueIdFilter, setUniqueIdFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState(initialDate);
  const [sortOption, setSortOption] = useState('newest');

  // Modals
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [deletingRecord, setDeletingRecord] = useState(null);

  // Filter records
  const filteredRecords = useMemo(() => {
    return records.filter((rec) => {
      // Deposit Status Filter
      if (depositFilter === 'Deposited' && !rec.isDeposited) return false;
      if (depositFilter === 'NotDeposited' && rec.isDeposited) return false;

      // Shape
      if (shapeFilter !== 'All' && rec.shape !== shapeFilter) return false;

      // Unique ID
      const hasId = rec.hasPacketId !== undefined ? rec.hasPacketId : rec.hasUniqueId;
      if (uniqueIdFilter === 'HasUniqueId' && !hasId) return false;
      if (uniqueIdFilter === 'NoUniqueId' && hasId) return false;

      // Date
      if (dateFilter && rec.date !== dateFilter) return false;

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const weightMatch = String(rec.weight).includes(q);
        const shapeMatch = (rec.shape || '').toLowerCase().includes(q);
        const packetMatch = (rec.packetId || '').toLowerCase().includes(q);
        const notesMatch = (rec.notes || '').toLowerCase().includes(q);
        const dateMatch =
          (rec.date || '').toLowerCase().includes(q) ||
          formatDate(rec.date).toLowerCase().includes(q);

        if (!weightMatch && !shapeMatch && !packetMatch && !notesMatch && !dateMatch) {
          return false;
        }
      }

      return true;
    });
  }, [records, shapeFilter, uniqueIdFilter, dateFilter, searchQuery]);

  // Sort records
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
    const groups = groupRecordsByDate(sortedRecords);
    if (sortOption === 'oldest') {
      return groups.reverse();
    }
    if (sortOption.startsWith('weight_')) {
      groups.forEach((g) => {
        g.records.sort((a, b) =>
          sortOption === 'weight_desc' ? b.weight - a.weight : a.weight - b.weight
        );
      });
    }
    return groups;
  }, [sortedRecords, sortOption]);

  const hasActiveFilters =
    depositFilter !== 'All' ||
    shapeFilter !== 'All' ||
    uniqueIdFilter !== 'All' ||
    dateFilter !== '' ||
    sortOption !== 'newest';

  const handleResetFilters = () => {
    setDepositFilter('All');
    setShapeFilter('All');
    setUniqueIdFilter('All');
    setDateFilter('');
    setSortOption('newest');
    setSearchQuery('');
  };

  const totalFilteredWeight = useMemo(() => {
    return sortedRecords.reduce((sum, r) => sum + (Number(r.weight) || 0), 0);
  }, [sortedRecords]);

  // Render a date group
  const renderDateGroup = ({ item }) => {
    return (
      <View style={styles.groupCard}>
        {/* Prominent Daily Header (Section 10 & 13) */}
        <View style={styles.groupHeader}>
          <View style={styles.dateCol}>
            <Text style={styles.groupDate}>{formatDate(item.date).toUpperCase()}</Text>
            <Text style={styles.groupPieces}>
              {item.count} {item.count === 1 ? 'Diamond produced' : 'Diamonds produced'}
            </Text>
          </View>
          <View style={styles.dailyTotalBadge}>
            <Text style={styles.dailyTotalLabel}>DAILY TOTAL</Text>
            <Text style={styles.dailyTotalVal}>{formatCarat(item.totalWeight)}</Text>
          </View>
        </View>

        {/* Diamond items in this date group */}
        <View style={styles.groupItems}>
          {item.records.map((rec) => (
            <RecordCard
              key={rec.id}
              record={rec}
              onEdit={(r) => navigation.navigate('EditDiamond', { record: r })}
              onDelete={(r) => setDeletingRecord(r)}
            />
          ))}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {/* Top Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Daily Records</Text>
          <Text style={styles.subtitle}>Grouped by production date with daily totals</Text>
        </View>

        <TouchableOpacity
          onPress={() => navigation.navigate('Add')}
          style={styles.addBtn}
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={20} color={COLORS.white} />
          <Text style={styles.addBtnText}>Add</Text>
        </TouchableOpacity>
      </View>

      {/* Main Content Area */}
      <View style={styles.content}>
        {/* Search Bar */}
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          onClear={() => setSearchQuery('')}
          onFilterPress={() => setShowFilterModal(true)}
          hasActiveFilters={hasActiveFilters}
        />

        {/* Active Filter Strip */}
        <View style={styles.filterSummary}>
          <Text style={styles.summaryText}>
            Showing <Text style={styles.boldText}>{formatNumber(sortedRecords.length)}</Text> diamonds
          </Text>
          <Text style={styles.summaryText}>
            Total: <Text style={styles.weightText}>{formatCarat(totalFilteredWeight)}</Text>
          </Text>
        </View>

        {/* Date Grouped FlatList */}
        <FlatList
          data={dateGroups}
          keyExtractor={(item) => item.date}
          renderItem={renderDateGroup}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <EmptyState
              title={hasActiveFilters || searchQuery ? 'No diamonds match filters' : 'No records yet'}
              description={
                hasActiveFilters || searchQuery
                  ? 'Try clearing or changing your search criteria.'
                  : 'Start by recording your first diamond piece in the production diary.'
              }
              actionTitle={hasActiveFilters || searchQuery ? 'Reset Filters' : '+ Add Diamond'}
              onAction={
                hasActiveFilters || searchQuery ? handleResetFilters : () => navigation.navigate('Add')
              }
            />
          }
        />
      </View>

      {/* Filter Bottom Sheet */}
      <FilterModal
        visible={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        depositFilter={depositFilter}
        setDepositFilter={setDepositFilter}
        shapeFilter={shapeFilter}
        setShapeFilter={setShapeFilter}
        uniqueIdFilter={uniqueIdFilter}
        setUniqueIdFilter={setUniqueIdFilter}
        sortOption={sortOption}
        setSortOption={setSortOption}
        onReset={handleResetFilters}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        visible={Boolean(deletingRecord)}
        onClose={() => setDeletingRecord(null)}
        onConfirm={() => {
          if (deletingRecord) deleteRecord(deletingRecord.id);
        }}
        record={deletingRecord}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.card,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  title: {
    fontSize: 20,
    color: COLORS.primary,
    ...FONTS.black,
  },
  subtitle: {
    fontSize: 11,
    color: COLORS.muted,
    marginTop: 2,
    ...FONTS.medium,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 12,
    gap: 4,
  },
  addBtnText: {
    color: COLORS.white,
    fontSize: 13,
    ...FONTS.bold,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  filterSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 4,
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 11,
    color: COLORS.muted,
  },
  boldText: {
    color: COLORS.primary,
    ...FONTS.bold,
  },
  weightText: {
    color: COLORS.diamond,
    ...FONTS.black,
  },
  listContainer: {
    paddingBottom: 90,
  },
  groupCard: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    marginBottom: 16,
    overflow: 'hidden',
    ...SHADOWS.subtle,
  },
  groupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.divider,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.cardBorder,
  },
  dateCol: {
    flex: 1,
  },
  groupDate: {
    fontSize: 14,
    color: COLORS.primary,
    ...FONTS.black,
    letterSpacing: 0.3,
  },
  groupPieces: {
    fontSize: 11,
    color: COLORS.muted,
    marginTop: 2,
    ...FONTS.medium,
  },
  dailyTotalBadge: {
    backgroundColor: COLORS.diamondBg,
    borderWidth: 1,
    borderColor: COLORS.diamondBorder,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
    alignItems: 'flex-end',
  },
  dailyTotalLabel: {
    fontSize: 9,
    color: COLORS.diamond,
    ...FONTS.bold,
    letterSpacing: 0.5,
  },
  dailyTotalVal: {
    fontSize: 16,
    color: COLORS.primary,
    ...FONTS.black,
    marginTop: 1,
  },
  groupItems: {
    padding: 12,
  },
});
