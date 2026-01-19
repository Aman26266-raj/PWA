import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Platform,
  TextInput,
  Alert,
  useWindowDimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export default function PaymentScreen({ navigation, route }) {
  const { lockerId } = route.params;
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 768;
  const isLargeScreen = width >= 1024;

  const [selectedDuration, setSelectedDuration] = useState(null);
  const [customHours, setCustomHours] = useState('');
  const [paymentMethod, setPaymentMethod] = useState(null);

  const hourlyRate = 2.5;

  const durations = [
    { id: '1', hours: 1, label: '1 Hour' },
    { id: '2', hours: 2, label: '2 Hours' },
    { id: '4', hours: 4, label: '4 Hours' },
    { id: '8', hours: 8, label: '8 Hours' },
    { id: '24', hours: 24, label: '24 Hours' },
    { id: 'custom', hours: 0, label: 'Custom' },
  ];

  const paymentMethods = [
    { id: 'card', label: 'Credit/Debit Card', icon: 'card-outline' },
    { id: 'upi', label: 'UPI', icon: 'phone-portrait-outline' },
    { id: 'wallet', label: 'Wallet', icon: 'wallet-outline' },
  ];

  const calculateTotal = () => {
    if (!selectedDuration) return 0;
    if (selectedDuration === 'custom') {
      const hours = parseInt(customHours) || 0;
      return hours * hourlyRate;
    }
    const duration = durations.find(d => d.id === selectedDuration);
    return duration ? duration.hours * hourlyRate : 0;
  };

  const handlePayment = () => {
    if (!selectedDuration) {
      Alert.alert('Error', 'Please select a duration');
      return;
    }

    if (selectedDuration === 'custom' && (!customHours || parseInt(customHours) <= 0)) {
      Alert.alert('Error', 'Please enter valid hours');
      return;
    }

    if (!paymentMethod) {
      Alert.alert('Error', 'Please select a payment method');
      return;
    }

    const hours = selectedDuration === 'custom' 
      ? parseInt(customHours) 
      : durations.find(d => d.id === selectedDuration)?.hours;

    // Navigate to PIN setup screen
    navigation.navigate('PINSetup', {
      lockerId,
      duration: hours,
      amount: calculateTotal(),
      paymentMethod,
    });
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

          <Text style={[styles.headerTitle, { fontSize: isSmallScreen ? 18 : 22 }]}>
            Choose Duration & Pay
          </Text>
        </LinearGradient>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[
            styles.content,
            isLargeScreen && { maxWidth: 800, alignSelf: 'center', width: '100%' }
          ]}
          showsVerticalScrollIndicator
        >
          {/* LOCKER INFO */}
          <View style={styles.lockerInfoCard}>
            <Ionicons name="cube-outline" size={40} color="#4c669f" />
            <View style={styles.lockerInfoText}>
              <Text style={styles.lockerLabel}>Selected Locker</Text>
              <Text style={styles.lockerNumber}>{lockerId}</Text>
            </View>
            <View style={styles.rateTag}>
              <Text style={styles.rateText}>${hourlyRate}/hr</Text>
            </View>
          </View>

          {/* DURATION SELECTION */}
          <Text style={[styles.sectionTitle, { fontSize: isSmallScreen ? 18 : 20 }]}>
            Select Duration
          </Text>

          <View style={styles.durationGrid}>
            {durations.map((duration) => (
              <TouchableOpacity
                key={duration.id}
                style={[
                  styles.durationCard,
                  selectedDuration === duration.id && styles.durationCardSelected,
                  { width: isSmallScreen ? '48%' : '31%' }
                ]}
                onPress={() => {
                  setSelectedDuration(duration.id);
                  if (duration.id !== 'custom') {
                    setCustomHours('');
                  }
                }}
              >
                <Ionicons 
                  name="time-outline" 
                  size={32} 
                  color={selectedDuration === duration.id ? '#4c669f' : '#666'} 
                />
                <Text style={[
                  styles.durationLabel,
                  selectedDuration === duration.id && styles.durationLabelSelected
                ]}>
                  {duration.label}
                </Text>
                {duration.hours > 0 && (
                  <Text style={styles.durationPrice}>
                    ${(duration.hours * hourlyRate).toFixed(2)}
                  </Text>
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* CUSTOM HOURS INPUT */}
          {selectedDuration === 'custom' && (
            <View style={styles.customInputContainer}>
              <Text style={styles.customLabel}>Enter Hours:</Text>
              <TextInput
                style={styles.customInput}
                placeholder="e.g., 3"
                keyboardType="numeric"
                value={customHours}
                onChangeText={setCustomHours}
                maxLength={3}
              />
            </View>
          )}

          {/* PAYMENT METHOD */}
          <Text style={[styles.sectionTitle, { fontSize: isSmallScreen ? 18 : 20, marginTop: 30 }]}>
            Payment Method
          </Text>

          <View style={styles.paymentMethodsContainer}>
            {paymentMethods.map((method) => (
              <TouchableOpacity
                key={method.id}
                style={[
                  styles.paymentMethodCard,
                  paymentMethod === method.id && styles.paymentMethodSelected
                ]}
                onPress={() => setPaymentMethod(method.id)}
              >
                <Ionicons 
                  name={method.icon} 
                  size={28} 
                  color={paymentMethod === method.id ? '#4c669f' : '#666'} 
                />
                <Text style={[
                  styles.paymentMethodLabel,
                  paymentMethod === method.id && styles.paymentMethodLabelSelected
                ]}>
                  {method.label}
                </Text>
                {paymentMethod === method.id && (
                  <Ionicons name="checkmark-circle" size={24} color="#4c669f" />
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* PRICE SUMMARY */}
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Price Summary</Text>
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Duration</Text>
              <Text style={styles.summaryValue}>
                {selectedDuration === 'custom' && customHours 
                  ? `${customHours} ${parseInt(customHours) === 1 ? 'hour' : 'hours'}`
                  : selectedDuration 
                    ? durations.find(d => d.id === selectedDuration)?.label 
                    : '-'}
              </Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Rate per hour</Text>
              <Text style={styles.summaryValue}>${hourlyRate.toFixed(2)}</Text>
            </View>

            <View style={styles.summaryDivider} />

            <View style={styles.summaryRow}>
              <Text style={styles.summaryTotalLabel}>Total Amount</Text>
              <Text style={styles.summaryTotalValue}>
                ${calculateTotal().toFixed(2)}
              </Text>
            </View>
          </View>

          {/* PAY BUTTON */}
          <TouchableOpacity
            style={[
              styles.payButton,
              (!selectedDuration || !paymentMethod || 
                (selectedDuration === 'custom' && !customHours)) && 
                { opacity: 0.6 }
            ]}
            disabled={
              !selectedDuration || 
              !paymentMethod || 
              (selectedDuration === 'custom' && !customHours)
            }
            onPress={handlePayment}
          >
            <LinearGradient
              colors={
                selectedDuration && paymentMethod && 
                (selectedDuration !== 'custom' || customHours)
                  ? ['#4c669f', '#3b5998']
                  : ['#999', '#777']
              }
              style={styles.payButtonGradient}
            >
              <Text style={styles.payButtonText}>
                Proceed to Pay ${calculateTotal().toFixed(2)}
              </Text>
              <Ionicons name="arrow-forward" size={20} color="white" />
            </LinearGradient>
          </TouchableOpacity>

          <View style={{ height: 40 }} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
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
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  lockerInfoCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 30,
  },
  lockerInfoText: {
    flex: 1,
    marginLeft: 15,
  },
  lockerLabel: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
  },
  lockerNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  rateTag: {
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  rateText: {
    color: '#1565c0',
    fontWeight: '600',
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  durationGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  durationCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e0e0e0',
    minHeight: 120,
    justifyContent: 'center',
  },
  durationCardSelected: {
    borderColor: '#4c669f',
    backgroundColor: '#f0f4ff',
  },
  durationLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#666',
    marginTop: 10,
  },
  durationLabelSelected: {
    color: '#4c669f',
  },
  durationPrice: {
    fontSize: 13,
    color: '#999',
    marginTop: 5,
  },
  customInputContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  customLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginRight: 15,
  },
  customInput: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  paymentMethodsContainer: {
    gap: 12,
    marginBottom: 30,
  },
  paymentMethodCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  paymentMethodSelected: {
    borderColor: '#4c669f',
    backgroundColor: '#f0f4ff',
  },
  paymentMethodLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    flex: 1,
    marginLeft: 15,
  },
  paymentMethodLabelSelected: {
    color: '#4c669f',
  },
  summaryCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 20,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 15,
    color: '#666',
  },
  summaryValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  summaryDivider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 15,
  },
  summaryTotalLabel: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#333',
  },
  summaryTotalValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4c669f',
  },
  payButton: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  payButtonGradient: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    gap: 10,
  },
  payButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
