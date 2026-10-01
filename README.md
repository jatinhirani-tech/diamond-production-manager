# 💎 Diamond Production Manager

A modern, responsive, local-first web application designed specifically for diamond artisans to replace physical paper diaries with precision digital tracking and payroll calculations.

---

## 🌟 Key Features

1. **Daily Diamond Records**:
   - Record individual diamonds with date, weight (carats), shape, optional unique packet ID, and notes.
   - Support for **unlimited diamonds on the same day**.
   - Automatic calculation and display of **Daily Total Carats** per date group.

2. **Executive Dashboard**:
   - Dynamic real-time KPI cards: **Total Diamonds**, **Total Weight (CT)**, **This Month Weight**, and **Current Month Estimated Earnings**.
   - **Today's Production Card** with 1-click drill-down into today's pieces.
   - **Quick Add Form** for fast diamond logging directly from the dashboard.
   - **Monthly Production Bar Chart** showing carat trends over recent months.

3. **Daily Records Ledger (`/records`)**:
   - Chronological grouping by date (newest date first).
   - Instant local search across packet IDs, carats, shapes, notes, and dates.
   - Advanced filters: Diamond shape, Packet ID status (Has Unique ID / No Unique ID), Date filter.
   - Sorting by Newest First, Oldest First, Weight High → Low, Weight Low → High.
   - In-place Edit and custom Delete confirmation modal.

4. **Monthly Summary & Payroll Calculator (`/monthly`)**:
   - Month and Year selector.
   - Prominent **"Calculate Monthly Total"** button aggregating every individual diamond in the selected month.
   - Input for **Price Per Carat (₹)** with real-time recalculation of total earnings (`Total Weight × Price Per Carat`).
   - Formatted in Indian Rupee notation (`₹56,000`, `₹1,25,000`, etc.) and Carats (`CT`).
   - Full daily breakdown table showing dates, piece count, and day totals.
   - **Save Monthly Summary** button to store finalized closures.
   - **Recalculate Month** to sync if past records are ever added or modified.

5. **Monthly History & Lifetime Earnings (`/history`)**:
   - **Lifetime Production** (CT) and **Lifetime Earnings** (₹) KPI cards.
   - Archived cards for each finalized month.
   - Detailed breakdown modal with complete list of dates and diamonds.

6. **Settings & Data Management (`/settings`)**:
   - **Export Backup**: One-click download of all records and monthly summaries as a formatted JSON file.
   - **Import / Restore**: Upload previously saved backups with choice of **Replace** or **Merge**.
   - **Clear All Data**: Permanent wipe with safety confirmation modal.
   - **Demo Data Loader**: 1-click button to load realistic sample diamonds and summaries for demonstration.
   - Storage usage indicator and local data privacy notice.

7. **100% Local & Offline**:
   - Zero servers, zero cloud databases, zero login friction.
   - Stored directly in browser `localStorage`.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm (v9+)

### Installation

```bash
# Clone or navigate to the repository
cd c:\React_Design_Projects\Diomand

# Install dependencies
npm install
```

### Running Development Server

```bash
npm run dev
```
Open `http://localhost:5173/` in your browser.

### Building for Production

```bash
npm run build
```
The optimized production bundle will be generated in `dist/`.

### Previewing Production Build

```bash
npm run preview
```

---

## 📁 Project Structure

```text
src/
├── constants/
│   └── diamondShapes.js       # List of shapes & luxury badge styling
├── utils/
│   ├── calculations.js        # Sums, aggregations, daily/monthly totals, floating-point cleaners
│   ├── formatters.js          # Indian currency (₹), Carats (CT), and date formatters
│   ├── validation.js          # Form field validation & error messages
│   ├── idGenerator.js         # Unique ID generator
│   └── sampleData.js          # Realistic demo records & monthly closures
├── services/
│   └── storageService.js      # Centralized localStorage service (CRUD, import/export)
├── context/
│   └── DiamondContext.jsx     # Global reactive state, toasts, and storage sync
├── components/
│   ├── layout/
│   │   ├── Sidebar.jsx        # Desktop & drawer navigation
│   │   ├── Header.jsx         # Top bar with current date & quick add
│   │   ├── MobileNavigation.jsx # Mobile bottom bar
│   │   └── AppLayout.jsx      # Shell layout wrapper
│   ├── dashboard/
│   │   ├── StatCard.jsx       # KPI metric cards
│   │   ├── TodayProduction.jsx# Today's summary card
│   │   ├── MonthlyChart.jsx   # Responsive monthly carats bar chart
│   │   └── QuickAdd.jsx       # Quick dashboard entry form
│   ├── records/
│   │   ├── RecordCard.jsx     # Individual diamond piece card
│   │   ├── RecordForm.jsx     # Form for adding/editing diamonds
│   │   ├── SearchBar.jsx      # Instant client search bar
│   │   ├── FilterBar.jsx      # Filter and sort controls
│   │   └── DeleteConfirmModal.jsx # Custom confirmation modal
│   ├── monthly/
│   │   ├── MonthlyCalculator.jsx  # Calculation engine & price input
│   │   └── MonthlyHistoryCard.jsx # Archived month card & breakdown modal
│   └── common/
│       ├── Button.jsx         # Touch-friendly button variants
│       ├── Modal.jsx          # Accessible dialog component
│       ├── Toast.jsx          # Floating alert notifications
│       ├── EmptyState.jsx     # Friendly zero-data screens
│       └── Loading.jsx        # Diamond spinner
├── pages/
│   ├── Dashboard.jsx          # Home route (/)
│   ├── DailyRecords.jsx       # Records route (/records)
│   ├── AddDiamond.jsx         # Add diamond route (/add)
│   ├── MonthlySummary.jsx     # Calculator route (/monthly)
│   ├── MonthlyHistory.jsx     # History route (/history)
│   └── Settings.jsx           # Data management (/settings)
├── App.jsx                    # Route mapping
├── main.jsx                   # React root entry
└── index.css                  # Tailwind styles and luxury typography
```

---

## 📊 Data Structure

### Diamond Record
```json
{
  "id": "pkt_sample_103",
  "date": "2026-10-03",
  "weight": 4.5,
  "shape": "Round",
  "hasUniqueId": true,
  "packetId": "PKT003",
  "notes": "Good quality, premium polish",
  "createdAt": "2026-10-03T11:00:00.000Z",
  "updatedAt": "2026-10-03T11:00:00.000Z"
}
```

### Monthly Summary
```json
{
  "id": "2026-10",
  "month": 10,
  "year": 2026,
  "totalDiamonds": 25,
  "totalWeight": 112.0,
  "pricePerCarat": 500,
  "totalAmount": 56000,
  "notes": "October monthly closure completed",
  "savedAt": "2026-10-31T18:30:00.000Z"
}
```
