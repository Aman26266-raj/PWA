import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Platform,
  Alert,
  useWindowDimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export default function SuccessScreen({ navigation, route }) {
  const { lockerId, duration, amount, pin, rentalStartTime } = route.params;
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 768;
  const isLargeScreen = width >= 1024;

  const [timeRemaining, setTimeRemaining] = useState(duration * 3600); // Convert hours to seconds
  const [showPin, setShowPin] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 0) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDateTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getEndTime = () => {
    const startDate = new Date(rentalStartTime);
    const endDate = new Date(startDate.getTime() + duration * 60 * 60 * 1000);
    return formatDateTime(endDate.toISOString());
  };

  const handleOpenLocker = () => {
    Alert.alert(
      'Open Locker',
      `Use PIN ${pin} to open locker ${lockerId}. The locker door will unlock for 30 seconds.`,
      [
        {
          text: 'Simulate Open',
          onPress: () => {
            Alert.alert('Success', 'Locker opened successfully!');
          },
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleExtendRental = () => {
    Alert.alert(
      'Extend Rental',
      'Would you like to extend your rental period?',
      [
        {
          text: 'Yes',
          onPress: () => {
            // Navigate back to payment screen with extend flag
            navigation.navigate('Payment', { lockerId, isExtending: true });
          },
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleEndRental = () => {
    Alert.alert(
      'End Rental',
      'Are you sure you want to end this rental? Make sure you have retrieved all your items.',
      [
        {
          text: 'Yes, End Rental',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Thank You', 'Your rental has been ended successfully.', [
              {
                text: 'OK',
                onPress: () => navigation.navigate('Home'),
              },
            ]);
          },
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const getProgressPercentage = () => {
    const totalSeconds = duration * 3600;
    return ((totalSeconds - timeRemaining) / totalSeconds) * 100;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* HEADER */}
        <LinearGradient
          colors={['#4caf50', '#45a049', '#388e3c']}
          style={styles.header}
        >
          <Text style={[styles.headerTitle, { fontSize: isSmallScreen ? 18 : 22 }]}>
            Active Rental
          </Text>
          <Ionicons name="checkmark-circle" size={24} color="white" style={styles.headerIcon} />
        </LinearGradient>

        <ScrollView
          contentContainerStyle={[
            styles.content,
            isLargeScreen && { maxWidth: 700, alignSelf: 'center', width: '100%' }
          ]}
          showsVerticalScrollIndicator
        >
          {/* SUCCESS ICON */}
          <View style={styles.successIconContainer}>
            <View style={styles.successIconCircle}>
              <Ionicons name="checkmark" size={isSmallScreen ? 60 : 80} color="white" />
            </View>
          </View>

          <Text style={[styles.successTitle, { fontSize: isSmallScreen ? 22 : 26 }]}>
            Locker Activated!
          </Text>
          <Text style={[styles.successSubtitle, { fontSize: isSmallScreen ? 14 : 16 }]}>
            Your payment was successful
          </Text>

          {/* LOCKER INFO CARD */}
          <View style={styles.lockerCard}>
            <View style={styles.lockerCardHeader}>
              <Ionicons name="cube" size={40} color="#4c669f" />
              <View style={styles.lockerCardHeaderText}>
                <Text style={styles.lockerLabel}>Locker Number</Text>
                <Text style={styles.lockerNumber}>{lockerId}</Text>
              </View>
              <View style={styles.activeTag}>
                <View style={styles.activeIndicator} />
                <Text style={styles.activeText}>Active</Text>
              </View>
            </View>

            <View style={styles.divider} />

            {/* PIN SECTION */}
            <View style={styles.pinSection}>
              <View style={styles.pinHeader}>
                <Ionicons name="key" size={24} color="#4c669f" />
                <Text style={styles.pinLabel}>Your PIN</Text>
              </View>
              <View style={styles.pinDisplay}>
                <Text style={styles.pinText}>
                  {showPin ? pin : '••••'}
                </Text>
                <TouchableOpacity
                  onPress={() => setShowPin(!showPin)}
                  style={styles.eyeButton}
                >
                  <Ionicons 
                    name={showPin ? "eye-off" : "eye"} 
                    size={22} 
                    color="#4c669f" 
                  />
                </TouchableOpacity>
              </View>
              <Text style={styles.pinNote}>
                Use this PIN to open your locker
              </Text>
            </View>
          </View>

          {/* TIME REMAINING CARD */}
          <View style={styles.timeCard}>
            <View style={styles.timeHeader}>
              <Ionicons name="time-outline" size={28} color="#ff9800" />
              <Text style={styles.timeLabel}>Time Remaining</Text>
            </View>
            
            <Text style={styles.timeValue}>{formatTime(timeRemaining)}</Text>
            
            {/* PROGRESS BAR */}
            <View style={styles.progressBarContainer}>
              <View 
                style={[
                  styles.progressBar, 
                  { width: `${getProgressPercentage()}%` }
                ]} 
              />
            </View>

            <View style={styles.timeDetails}>
              <View style={styles.timeDetailRow}>
                <Text style={styles.timeDetailLabel}>Started:</Text>
                <Text style={styles.timeDetailValue}>
                  {formatDateTime(rentalStartTime)}
                </Text>
              </View>
              <View style={styles.timeDetailRow}>
                <Text style={styles.timeDetailLabel}>Ends at:</Text>
                <Text style={styles.timeDetailValue}>{getEndTime()}</Text>
              </View>
            </View>
          </View>

          {/* OPEN LOCKER BUTTON */}
          <TouchableOpacity
            style={styles.openButton}
            onPress={handleOpenLocker}
          >
            <LinearGradient
              colors={['#4caf50', '#45a049']}
              style={styles.openButtonGradient}
            >
              <Ionicons name="lock-open" size={24} color="white" />
              <Text style={styles.openButtonText}>Open Locker</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* ACTION BUTTONS */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.actionButton, styles.extendButton]}
              onPress={handleExtendRental}
            >
              <Ionicons name="time" size={20} color="#4c669f" />
              <Text style={styles.extendButtonText}>Extend Rental</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.endButton]}
              onPress={handleEndRental}
            >
              <Ionicons name="close-circle" size={20} color="#f44336" />
              <Text style={styles.endButtonText}>End Rental</Text>
            </TouchableOpacity>
          </View>

          {/* INSTRUCTIONS */}
          <View style={styles.instructionsCard}>
            <View style={styles.instructionHeader}>
              <Ionicons name="information-circle" size={24} color="#1565c0" />
              <Text style={styles.instructionTitle}>How to Use</Text>
            </View>
            
            <View style={styles.instructionItem}>
              <View style={styles.instructionNumber}>
                <Text style={styles.instructionNumberText}>1</Text>
              </View>
              <Text style={styles.instructionText}>
                Tap "Open Locker" when you're near your locker
              </Text>
            </View>

            <View style={styles.instructionItem}>
              <View style={styles.instructionNumber}>
                <Text style={styles.instructionNumberText}>2</Text>
              </View>
              <Text style={styles.instructionText}>
                Enter your PIN on the locker keypad
              </Text>
            </View>

            <View style={styles.instructionItem}>
              <View style={styles.instructionNumber}>
                <Text style={styles.instructionNumberText}>3</Text>
              </View>
              <Text style={styles.instructionText}>
                The locker will unlock for 30 seconds
              </Text>
            </View>

            <View style={styles.instructionItem}>
              <View style={styles.instructionNumber}>
                <Text style={styles.instructionNumberText}>4</Text>
              </View>
              <Text style={styles.instructionText}>
                Make sure to close the door firmly after use
              </Text>
            </View>
          </View>

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
    justifyContent: 'center',
    flexDirection: 'row',
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerIcon: {
    marginLeft: 10,
  },
  content: {
    padding: 20,
  },
  successIconContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  successIconCircle: {
    backgroundColor: '#4caf50',
    borderRadius: 100,
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4caf50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  successSubtitle: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  lockerCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lockerCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  lockerCardHeaderText: {
    flex: 1,
    marginLeft: 15,
  },
  lockerLabel: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
  },
  lockerNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  activeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8f5e9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  activeIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4caf50',
  },
  activeText: {
    color: '#2e7d32',
    fontWeight: '600',
    fontSize: 13,
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginBottom: 20,
  },
  pinSection: {
    gap: 12,
  },
  pinHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  pinLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  pinDisplay: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 2,
    borderColor: '#4c669f',
  },
  pinText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4c669f',
    letterSpacing: 8,
  },
  eyeButton: {
    padding: 5,
  },
  pinNote: {
    fontSize: 13,
    color: '#666',
    fontStyle: 'italic',
  },
  timeCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  timeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 15,
  },
  timeLabel: {
    fontSize: 17,
    fontWeight: '600',
    color: '#333',
  },
  timeValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#ff9800',
    textAlign: 'center',
    marginVertical: 15,
    fontVariant: ['tabular-nums'],
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 20,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#ff9800',
    borderRadius: 4,
  },
  timeDetails: {
    gap: 10,
  },
  timeDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeDetailLabel: {
    fontSize: 14,
    color: '#666',
  },
  timeDetailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  openButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 15,
    shadowColor: '#4caf50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  openButtonGradient: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 18,
    gap: 12,
  },
  openButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 10,
    gap: 8,
    borderWidth: 2,
  },
  extendButton: {
    backgroundColor: '#e3f2fd',
    borderColor: '#4c669f',
  },
  extendButtonText: {
    color: '#4c669f',
    fontSize: 15,
    fontWeight: '600',
  },
  endButton: {
    backgroundColor: '#ffebee',
    borderColor: '#f44336',
  },
  endButtonText: {
    color: '#f44336',
    fontSize: 15,
    fontWeight: '600',
  },
  instructionsCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  instructionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
  },
  instructionTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#333',
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
    gap: 12,
  },
  instructionNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#e3f2fd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  instructionNumberText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1565c0',
  },
  instructionText: {
    flex: 1,
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    paddingTop: 4,
  },
});
