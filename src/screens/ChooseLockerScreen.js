import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  ScrollView,
  Alert,
  useWindowDimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export default function ChooseLockerScreen({ navigation }) {
  const { width } = useWindowDimensions();
  const isLargeScreen = width >= 1024;
  const numColumns = isLargeScreen ? 4 : 3;

  const [selectedLocker, setSelectedLocker] = useState(null);

  /* -------- MOCK DATA (UNCHANGED) -------- */
  const lockers = [
    { id: 'A1', status: 'available' },
    { id: 'A2', status: 'occupied' },
    { id: 'A3', status: 'available' },
    { id: 'A4', status: 'available' },
    { id: 'A5', status: 'available' },
    { id: 'A6', status: 'occupied' },
    { id: 'B1', status: 'available' },
    { id: 'B2', status: 'available' },
    { id: 'B3', status: 'occupied' },
    { id: 'B4', status: 'available' },
    { id: 'B5', status: 'occupied' },
    { id: 'B6', status: 'available' },
  ];

  const handleSelect = locker => {
    if (locker.status === 'occupied') {
      Alert.alert('Unavailable', 'Locker is occupied');
      return;
    }
    setSelectedLocker(locker.id);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* HEADER */}
        <LinearGradient
          colors={['#4c669f', '#3b5998', '#192f6a']}
          style={styles.header}
        >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Choose Your Locker</Text>
        <Text style={styles.headerSubtitle}>$2.00 / hour</Text>
      </LinearGradient>

      {/* SCROLL CONTAINER */}
      <View style={{ flex: 1 }}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={[
            styles.content,
            isLargeScreen && {
              maxWidth: 900,
              alignSelf: 'center',
              width: '100%',
            },
          ]}
          showsVerticalScrollIndicator
        >
          {/* LEGEND */}
          <View style={styles.legend}>
            <Legend color="#4caf50" label="Available" />
            <Legend color="#f44336" label="Occupied" />
            <Legend color="#4c669f" label="Selected" />
          </View>

          {/* LOCKER GRID */}
          <View style={styles.lockerGrid}>
            {lockers.map((item) => {
              const isSelected = selectedLocker === item.id;
              return (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.lockerBox,
                    item.status === 'available' && styles.available,
                    item.status === 'occupied' && styles.occupied,
                    isSelected && styles.selected,
                  ]}
                  disabled={item.status === 'occupied'}
                  onPress={() => handleSelect(item)}
                >
                  <Text style={[styles.lockerText, isSelected && { color: '#fff' }]}>
                    {item.id}
                  </Text>
                  <Text style={[styles.statusText, isSelected && { color: '#fff' }]}>
                    {isSelected ? 'Selected' : item.status}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* SELECTED INFO */}
          {selectedLocker && (
            <View style={styles.selectedInfo}>
              <Ionicons name="checkmark-circle" size={22} color="#4c669f" />
              <Text style={styles.selectedText}>
                Locker {selectedLocker} selected
              </Text>
            </View>
          )}

          {/* CONTINUE BUTTON */}
          <TouchableOpacity
            style={[styles.continueButton, !selectedLocker && { opacity: 0.6 }]}
            disabled={!selectedLocker}
            onPress={() => navigation.navigate('Payment', { lockerId: selectedLocker })}
          >
            <LinearGradient
              colors={
                selectedLocker
                  ? ['#4c669f', '#3b5998']
                  : ['#999', '#777']
              }
              style={styles.continueGradient}
            >
              <Text style={styles.continueText}>Continue</Text>
              <Ionicons name="arrow-forward" size={18} color="white" />
            </LinearGradient>
          </TouchableOpacity>

          {/* EXTRA CONTENT */}
          <View style={styles.infoBox}>
            <Ionicons name="information-circle" size={20} color="#1565c0" />
            <Text style={styles.infoText}>
              You can access your locker anytime using your PIN during the rental
              period.
            </Text>
          </View>

          <View style={{ height: Platform.OS === 'web' ? 120 : 80 }} />
        </ScrollView>
      </View>
      </View>
    </SafeAreaView>
  );
}

/* ---------- LEGEND ---------- */
const Legend = ({ color, label }) => (
  <View style={styles.legendItem}>
    <View style={[styles.legendBox, { backgroundColor: color }]} />
    <Text style={styles.legendText}>{label}</Text>
  </View>
);

/* ---------- STYLES ---------- */
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: { flex: 1, backgroundColor: '#f5f5f5' },

  header: {
    paddingTop: Platform.OS === 'ios' ? 50 : 35,
    paddingBottom: 20,
    alignItems: 'center',
  },

  backButton: {
    position: 'absolute',
    left: 20,
    top: Platform.OS === 'ios' ? 50 : 35,
  },

  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: '700',
  },

  headerSubtitle: {
    color: 'white',
    opacity: 0.9,
    marginTop: 4,
  },

  content: {
    padding: 20,
    paddingBottom: 150,
  },

  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 15,
    marginBottom: 20,
  },

  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendBox: { width: 16, height: 16, borderRadius: 4 },
  legendText: { fontSize: 13, color: '#555' },

  /* -------- GRID STYLES -------- */
  lockerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 15,
    paddingVertical: 10,
  },

  lockerBox: {
    width: '30%',
    aspectRatio: 1,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 90,
    maxHeight: 120,
  },

  available: { borderColor: '#4caf50', backgroundColor: '#e8f5e9' },
  occupied: { borderColor: '#f44336', backgroundColor: '#ffebee', opacity: 0.5 },
  selected: { borderColor: '#4c669f', backgroundColor: '#4c669f' },

  lockerText: { fontSize: 20, fontWeight: '700', color: '#333' },
  statusText: { fontSize: 12, marginTop: 4, color: '#666' },

  selectedInfo: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#e3f2fd',
    borderRadius: 10,
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },

  selectedText: { fontSize: 14, fontWeight: '600', color: '#1565c0' },

  continueButton: {
    marginTop: 20,
    borderRadius: 12,
    overflow: 'hidden',
  },

  continueGradient: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },

  continueText: { color: 'white', fontSize: 16, fontWeight: '700' },

  infoBox: {
    marginTop: 20,
    backgroundColor: '#e3f2fd',
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
    gap: 10,
  },

  infoText: { fontSize: 13, color: '#1565c0', flex: 1 },
});
