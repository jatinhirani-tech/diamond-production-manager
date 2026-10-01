import React from 'react';
import { View, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import DashboardScreen from '../screens/DashboardScreen';
import RecordsScreen from '../screens/RecordsScreen';
import AddDiamondScreen from '../screens/AddDiamondScreen';
import EditDiamondScreen from '../screens/EditDiamondScreen';
import MonthlySummaryScreen from '../screens/MonthlySummaryScreen';
import MonthlyHistoryScreen from '../screens/MonthlyHistoryScreen';
import SettingsScreen from '../screens/SettingsScreen';
import { COLORS, SHADOWS, FONTS } from '../constants/theme';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Custom Center "Add" Button for the Tab Bar
function CustomTabBarButton({ children, onPress }) {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      style={styles.customAddWrapper}
      onPress={onPress}
    >
      <View style={styles.customAddButton}>
        {children}
      </View>
    </TouchableOpacity>
  );
}

function MainTabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="DashboardTab"
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: COLORS.diamond,
        tabBarInactiveTintColor: COLORS.subtle,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
      }}
    >
      {/* 1. Dashboard Tab */}
      <Tab.Screen
        name="DashboardTab"
        component={DashboardScreen}
        options={{
          tabBarLabel: 'Dashboard',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'grid' : 'grid-outline'}
              size={20}
              color={color}
            />
          ),
        }}
      />

      {/* 2. Records Tab */}
      <Tab.Screen
        name="RecordsTab"
        component={RecordsScreen}
        options={{
          tabBarLabel: 'Records',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'book' : 'book-outline'}
              size={20}
              color={color}
            />
          ),
        }}
      />

      {/* 3. Add Diamond Tab (Center Prominent Button) */}
      <Tab.Screen
        name="AddTab"
        component={AddDiamondScreen}
        options={{
          tabBarLabel: '',
          tabBarButton: (props) => (
            <CustomTabBarButton {...props}>
              <Ionicons name="add" size={28} color={COLORS.white} />
            </CustomTabBarButton>
          ),
        }}
      />

      {/* 4. Monthly Summary Tab */}
      <Tab.Screen
        name="MonthlyTab"
        component={MonthlySummaryScreen}
        options={{
          tabBarLabel: 'Monthly',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'calculator' : 'calculator-outline'}
              size={20}
              color={color}
            />
          ),
        }}
      />

      {/* 5. Settings Tab */}
      <Tab.Screen
        name="SettingsTab"
        component={SettingsScreen}
        options={{
          tabBarLabel: 'Settings',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'settings' : 'settings-outline'}
              size={20}
              color={color}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="MainTabs" component={MainTabNavigator} />
        <Stack.Screen
          name="EditDiamond"
          component={EditDiamondScreen}
          options={{
            presentation: 'modal',
            animation: 'slide_from_bottom',
          }}
        />
        <Stack.Screen name="History" component={MonthlyHistoryScreen} />
        <Stack.Screen name="Records" component={RecordsScreen} />
        <Stack.Screen name="Monthly" component={MonthlySummaryScreen} />
        <Stack.Screen name="Add" component={AddDiamondScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.card,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
    height: Platform.OS === 'ios' ? 84 : 64,
    paddingTop: 8,
    paddingBottom: Platform.OS === 'ios' ? 26 : 8,
    ...SHADOWS.premium,
  },
  tabBarLabel: {
    fontSize: 11,
    ...FONTS.semibold,
    marginTop: 2,
  },
  customAddWrapper: {
    top: -18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  customAddButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: COLORS.background,
    ...SHADOWS.premium,
  },
});
