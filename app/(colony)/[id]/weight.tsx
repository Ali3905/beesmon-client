import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  useColorScheme,
  ActivityIndicator,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DarkTheme, LightTheme } from '@/theme';
import { useLocalSearchParams } from 'expo-router';
import { useColonyById } from '@/hooks/useColony';

// const SENSORS = [
//   { id: 1, name: 'Weight Frame 1', currentWeight: 473, location: 'Located inside at frame No. 5' },
//   { id: 2, name: 'Weight Frame 2', currentWeight: 473, location: 'Located inside at frame No. 5' },
// ];

const WeightCard = ({ sensor }) => {
  // const [maxWeight, setMaxWeight] = useState(500);

  const scheme = useColorScheme();
  const theme = scheme === "dark" ? DarkTheme : LightTheme;

  return (
    <View style={[styles.card, { borderColor: theme.purple }]}>
      <View style={styles.cardHeader}>
        <MaterialCommunityIcons name="thermometer" size={20} color="#6B3FA0" />
        <Text style={styles.cardTitle}>{sensor?.name} </Text>
      </View>

      <View style={styles.alertRow}>
        <Text style={styles.alertLabel} numberOfLines={1}>Max Weight Set (grams):</Text>

        <View style={styles.tempControls}>

          <Text style={styles.minMaxLabel}>MAX</Text>
          <View style={styles.spinnerContainer}>
            <Text style={styles.spinnerValue}>{sensor.max_value}</Text>
            {/* <View style={styles.spinnerButtons}>
              <TouchableOpacity onPress={() => setMaxTemp(v => v + 1)} style={styles.spinnerBtn}>
                <Ionicons name="caret-up" size={10} color="#6B3FA0" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setMaxTemp(v => v - 1)} style={styles.spinnerBtn}>
                <Ionicons name="caret-down" size={10} color="#6B3FA0" />
              </TouchableOpacity>
            </View> */}
          </View>
        </View>
      </View>

      <View style={styles.tempRow}>
        <Text style={styles.currentTempLabel}>
          Current Weight:
          <Text style={styles.currentTempValue}>{sensor.currentWeight} (grams)</Text>
        </Text>
        <TouchableOpacity style={styles.graphButton}>
          <Text style={styles.graphButtonText}>Graph</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.divider} />
      <Text style={styles.locationText}>{sensor.location}</Text>
    </View>
  );
};

export default function HiveTemperatureScreen() {

  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: colony, isLoading, isError } = useColonyById(id);

  const sensors = colony?.controller?.sensor?.filter(
    (sensor) => sensor.type === "weight"
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />

      {isLoading ? (
        <ActivityIndicator />
      ) : isError ? (
        <Text>Error</Text>
      ) : (
        <View style={styles.outerContainer}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {sensors?.length === 0 ? (
              <Text style={styles.emptyText}>
                No weight sensors available.
              </Text>
            ) : (
              sensors?.map((sensor) => (
                <WeightCard key={sensor.id} sensor={sensor} />
              ))
            )}
          </ScrollView>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#F5A623',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 14,
  },
  backButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.5,
  },
  outerContainer: {
    flex: 1,
    // borderWidth: 2,
    // borderColor: '#6BB5F5',
    margin: 8,
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  scrollContent: {
    padding: 12,
    gap: 12,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    padding: 14,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    marginBottom: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#222',
  },
  alertRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    gap: 8,
  },
  alertLabel: {
    fontSize: 13,
    color: '#E8534A',
    fontWeight: '600',
    // width: 70,
  },
  tempControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  minMaxLabel: {
    fontSize: 12,
    color: '#555',
    fontWeight: '600',
  },
  spinnerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 3,
    gap: 4,
  },
  spinnerValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
    minWidth: 20,
    textAlign: 'center',
  },
  spinnerButtons: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  spinnerBtn: {
    padding: 1,
  },
  tempRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  currentTempLabel: {
    fontSize: 13,
    color: '#444',
    fontWeight: '500',
  },
  currentTempValue: {
    color: '#27AE60',
    fontWeight: '700',
  },
  graphButton: {
    backgroundColor: '#6B3FA0',
    paddingHorizontal: 18,
    paddingVertical: 6,
    borderRadius: 20,
  },
  graphButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginBottom: 8,
  },
  locationText: {
    fontSize: 12,
    color: '#999',
  },
  tabBar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 4,
    paddingVertical: 6,
    borderRadius: 20,
  },
  tabItemActive: {
    backgroundColor: '#EDE7F6',
  },
  tabLabel: {
    fontSize: 13,
    color: '#6B3FA0',
    fontWeight: '600',
  },
});