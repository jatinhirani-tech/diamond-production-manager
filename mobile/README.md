# 💎 Diamond Production Manager — Native Mobile App (iOS & Android)

A complete, production-ready **Native Mobile Application** built with **React Native** and **Expo** based on the Diamond Production Manager web app.

---

## 📱 Platforms Supported

* **iOS** (iPhone & iPad with safe area support)
* **Android** (Phone & Tablet with hardware back button & safe area support)
* **Web Preview** (Direct browser testing via `npx expo start --web`)

---

## 🛠 Technology Stack

* **React Native** (`0.86.3`)
* **Expo SDK** (`57.0.26`)
* **@react-navigation/bottom-tabs** & **@react-navigation/native-stack**
* **@react-native-async-storage/async-storage** (100% offline, local persistence)
* **@react-native-community/datetimepicker** (Native iOS & Android date selection)
* **expo-sharing** & **expo-file-system** (JSON data export)
* **expo-document-picker** (JSON data restore/import)
* **@expo/vector-icons** (Feather, Ionicons, MaterialCommunityIcons)
* **react-native-safe-area-context** & **react-native-screens**

> **Zero Cloud Dependencies**: 100% offline-ready. No MongoDB, Firebase, Supabase, backend APIs, or external authentication.

---

## 🚀 Running the Mobile Application

### 1. Navigate to the `mobile/` directory:

```bash
cd mobile
```

### 2. Install dependencies (if not already installed):

```bash
npm install
```

### 3. Start the Expo development server:

```bash
npx expo start
```

* **Android Device / Emulator**: Press `a` or run `npx expo run:android`
* **iOS Simulator (macOS)**: Press `i` or run `npx expo run:ios`
* **Physical Phone**: Scan the QR code using the **Expo Go** app (available on Google Play Store & Apple App Store)
* **Web Preview**: Press `w` or run `npx expo start --web`

---

## 📂 Mobile Project Structure

```text
mobile/
├── App.js                         # Root entry with SafeAreaProvider & DiamondProvider
├── app.json                       # Expo configuration (name, bundleId, splash, icons)
├── package.json                   # Mobile dependencies
├── assets/                        # App icons and splash screen assets
├── constants/
│   ├── theme.js                   # Luxury color palette, elevations, and typography
│   └── diamondShapes.js           # 11 industry shapes & badge color styling
├── services/
│   └── storageService.js          # Centralized AsyncStorage service (CRUD, export/import)
├── context/
│   └── DiamondContext.js          # Reactive global state, toasts, and storage sync
├── utils/
│   ├── calculations.js            # Business logic (sums, daily/monthly totals, floating-point cleaner)
│   ├── formatters.js              # Indian currency (₹), CT weight, and date formatters
│   ├── validation.js              # Form validation for weight, shape, packet ID, rate
│   ├── idGenerator.js             # Collision-resistant ID generator
│   └── sampleData.js              # Demonstration dataset matching web app
├── components/
│   ├── common/
│   │   ├── Button.jsx             # Luxury touch-friendly button variants
│   │   ├── Card.jsx               # Elevated card container
│   │   ├── Header.jsx             # Safe-area aware screen header
│   │   ├── Modal.jsx              # Native-safe dialog & bottom sheet component
│   │   ├── Toast.jsx              # Floating mobile feedback notification
│   │   └── EmptyState.jsx         # Zero-data screen placeholder
│   ├── dashboard/
│   │   ├── StatCard.jsx           # Dashboard KPI cards
│   │   ├── TodayProductionCard.jsx# Dark luxury today's production card
│   │   └── MonthlyProductionChart.jsx # Responsive monthly weight bar chart
│   ├── records/
│   │   ├── RecordCard.jsx         # Individual diamond piece card
│   │   ├── SearchBar.jsx          # Search bar with filter trigger
│   │   ├── FilterModal.jsx        # Filter & sort bottom sheet
│   │   └── DeleteConfirmModal.jsx # Deletion confirmation dialog
│   └── monthly/
│       ├── MonthlyHistoryCard.jsx # Historical month card with sync alert
│       └── MonthDetailsModal.jsx  # Daily breakdown bottom sheet
├── screens/
│   ├── DashboardScreen.jsx        # Dashboard overview tab
│   ├── RecordsScreen.jsx          # Daily records ledger tab (grouped by date)
│   ├── AddDiamondScreen.jsx       # Add diamond tab (center prominent button)
│   ├── EditDiamondScreen.jsx      # Edit diamond modal screen
│   ├── MonthlySummaryScreen.jsx   # Monthly payroll & rate calculator tab
│   ├── MonthlyHistoryScreen.jsx   # Archived months & lifetime totals screen
│   └── SettingsScreen.jsx         # Storage, backup, import/export, and wipe
└── navigation/
    └── AppNavigator.jsx           # Bottom tabs & native stack navigator
```

---

## 💎 Features & Parity with Web App

| Feature | Web App | Mobile App |
| :--- | :--- | :--- |
| **Local Storage** | Browser `localStorage` | Device `AsyncStorage` |
| **Offline-Only** | Yes | Yes (100% offline) |
| **Multiple Pieces/Day** | Yes | Yes |
| **Daily Totals** | Prominent daily headers | Prominent daily headers |
| **Calculations** | Shared formulas | Identical formulas (`cleanFloat`) |
| **Price Per Carat** | Dynamic live ₹ updates | Dynamic live ₹ updates |
| **Indian Currency** | `Intl.NumberFormat('en-IN')` | `Intl.NumberFormat('en-IN')` with fallback |
| **JSON Export/Import** | Web file download/upload | `expo-sharing` & `expo-document-picker` |
| **Sync Alert** | Yes | Yes ("Sync" badge on modified months) |
| **Lifetime Stats** | Total CT & Total ₹ | Total CT & Total ₹ |
