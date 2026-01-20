import React, { useState, useRef } from 'react';
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
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';

export default function PINSetupScreen({ navigation, route }) {
  const { lockerId, duration, amount, paymentMethod } = route.params;
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 768;
  const isLargeScreen = width >= 1024;

  const [pin, setPin] = useState(['', '', '', '']);
  const [confirmPin, setConfirmPin] = useState(['', '', '', '']);
  const [step, setStep] = useState(1); // 1 = create PIN, 2 = confirm PIN
  const [isProcessing, setIsProcessing] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const [animationType, setAnimationType] = useState('success'); // 'success' or 'error'

  const pinRefs = useRef([]);
  const confirmPinRefs = useRef([]);

  const handlePinChange = (value, index, isPinConfirm = false) => {
    if (value && !/^\d+$/.test(value)) return;

    const currentPin = isPinConfirm ? [...confirmPin] : [...pin];
    const currentRefs = isPinConfirm ? confirmPinRefs : pinRefs;
    const setCurrentPin = isPinConfirm ? setConfirmPin : setPin;

    if (value) {
      currentPin[index] = value.slice(-1);
      setCurrentPin(currentPin);
      
      if (index < 3) {
        currentRefs.current[index + 1]?.focus();
      }
    } else {
      currentPin[index] = '';
      setCurrentPin(currentPin);
    }
  };

  const handleKeyPress = (e, index, isPinConfirm = false) => {
    const currentPin = isPinConfirm ? confirmPin : pin;
    const currentRefs = isPinConfirm ? confirmPinRefs : pinRefs;
    const setCurrentPin = isPinConfirm ? setConfirmPin : setPin;

    if (e.nativeEvent.key === 'Backspace') {
      if (currentPin[index] === '' && index > 0) {
        currentRefs.current[index - 1]?.focus();
        const newPin = [...currentPin];
        newPin[index - 1] = '';
        setCurrentPin(newPin);
      }
    }
  };

  const handleContinue = () => {
    const pinString = pin.join('');
    
    if (pinString.length !== 4) {
      Alert.alert('Error', 'Please enter a 4-digit PIN');
      return;
    }

    if (step === 1) {
      // Show success animation for PIN creation
      setAnimationType('success');
      setShowAnimation(true);
      
      setTimeout(() => {
        setShowAnimation(false);
        setStep(2);
        setTimeout(() => {
          confirmPinRefs.current[0]?.focus();
        }, 100);
      }, 1500);
    } else {
      const confirmPinString = confirmPin.join('');
      
      if (confirmPinString !== pinString) {
        // Show error animation for PIN mismatch
        setAnimationType('error');
        setShowAnimation(true);
        
        setTimeout(() => {
          setShowAnimation(false);
          setConfirmPin(['', '', '', '']);
          confirmPinRefs.current[0]?.focus();
        }, 2000);
        return;
      }

      // Show success animation for PIN confirmation
      setAnimationType('success');
      setShowAnimation(true);
      
      setTimeout(() => {
        setShowAnimation(false);
        handleActivateLocker(pinString);
      }, 1500);
    }
  };

  const handleActivateLocker = async (pinCode) => {
    setIsProcessing(true);

    // Simulate payment and locker activation
    setTimeout(() => {
      setIsProcessing(false);
      
      // Navigate to success screen
      navigation.navigate('Success', {
        lockerId,
        duration,
        amount,
        pin: pinCode,
        rentalStartTime: new Date().toISOString(),
      });
    }, 2000);
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
            disabled={isProcessing}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>

          <Text style={[styles.headerTitle, { fontSize: isSmallScreen ? 18 : 22 }]}>
            Setup PIN
          </Text>
        </LinearGradient>

        <ScrollView
          contentContainerStyle={[
            styles.content,
            isLargeScreen && { maxWidth: 600, alignSelf: 'center', width: '100%' }
          ]}
          showsVerticalScrollIndicator={false}
        >
          {/* ICON */}
          <View style={styles.iconContainer}>
            <Ionicons 
              name={step === 1 ? "key-outline" : "shield-checkmark-outline"} 
              size={isSmallScreen ? 70 : 90} 
              color="#4c669f" 
            />
          </View>

          {/* TITLE */}
          <Text style={[styles.title, { fontSize: isSmallScreen ? 24 : 28 }]}>
            {step === 1 ? 'Create Your PIN' : 'Confirm Your PIN'}
          </Text>
          
          <Text style={[styles.subtitle, { fontSize: isSmallScreen ? 14 : 16 }]}>
            {step === 1 
              ? 'Enter a 4-digit PIN to secure your locker'
              : 'Re-enter your PIN to confirm'}
          </Text>

          {/* LOCKER INFO BANNER */}
          <View style={styles.infoBanner}>
            <View style={styles.infoRow}>
              <Ionicons name="cube" size={20} color="#4c669f" />
              <Text style={styles.infoLabel}>Locker:</Text>
              <Text style={styles.infoValue}>{lockerId}</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="time" size={20} color="#4c669f" />
              <Text style={styles.infoLabel}>Duration:</Text>
              <Text style={styles.infoValue}>{duration}h</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="cash" size={20} color="#4c669f" />
              <Text style={styles.infoLabel}>Amount:</Text>
              <Text style={styles.infoValue}>${amount.toFixed(2)}</Text>
            </View>
          </View>

          {/* PIN INPUT */}
          <View style={styles.pinContainer}>
            {(step === 1 ? pin : confirmPin).map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => {
                  if (step === 1) {
                    pinRefs.current[index] = ref;
                  } else {
                    confirmPinRefs.current[index] = ref;
                  }
                }}
                style={[
                  styles.pinInput,
                  { 
                    width: isSmallScreen ? 55 : 65,
                    height: isSmallScreen ? 60 : 70,
                    fontSize: isSmallScreen ? 24 : 28
                  },
                  digit && styles.pinInputFilled,
                ]}
                keyboardType="numeric"
                maxLength={1}
                value={digit}
                onChangeText={(value) => handlePinChange(value, index, step === 2)}
                onKeyPress={(e) => handleKeyPress(e, index, step === 2)}
                secureTextEntry
                selectTextOnFocus
                editable={!isProcessing}
              />
            ))}
          </View>

          {/* SECURITY NOTE */}
          <View style={styles.securityNote}>
            <Ionicons name="information-circle" size={20} color="#ff9800" />
            <Text style={styles.securityText}>
              Remember this PIN. You'll need it to open your locker.
            </Text>
          </View>

          {/* CONTINUE BUTTON */}
          <TouchableOpacity
            style={[
              styles.continueButton,
              ((step === 1 && pin.some(d => !d)) || 
               (step === 2 && confirmPin.some(d => !d)) ||
               isProcessing) && { opacity: 0.6 }
            ]}
            disabled={
              (step === 1 && pin.some(d => !d)) || 
              (step === 2 && confirmPin.some(d => !d)) ||
              isProcessing
            }
            onPress={handleContinue}
          >
            <LinearGradient
              colors={
                ((step === 1 && !pin.some(d => !d)) || 
                 (step === 2 && !confirmPin.some(d => !d))) && !isProcessing
                  ? ['#4c669f', '#3b5998']
                  : ['#999', '#777']
              }
              style={styles.continueGradient}
            >
              <Text style={styles.continueText}>
                {isProcessing 
                  ? 'Processing...' 
                  : step === 1 
                    ? 'Continue' 
                    : 'Activate Locker'}
              </Text>
              {!isProcessing && (
                <Ionicons name="arrow-forward" size={20} color="white" />
              )}
            </LinearGradient>
          </TouchableOpacity>

          {step === 2 && !isProcessing && (
            <TouchableOpacity
              style={styles.backToCreateButton}
              onPress={() => {
                setStep(1);
                setConfirmPin(['', '', '', '']);
                setTimeout(() => {
                  pinRefs.current[0]?.focus();
                }, 300);
              }}
            >
              <Text style={styles.backToCreateText}>← Back to create PIN</Text>
            </TouchableOpacity>
          )}
        </ScrollView>

        {/* Animation Modal */}
        <Modal
          visible={showAnimation}
          transparent
          animationType="fade"
        >
          <View style={styles.animationModal}>
            <View style={styles.animationContainer}>
              <LottieView
                source={
                  animationType === 'success'
                    ? require('../../assets/success.json')
                    : require('../../assets/error.json')
                }
                autoPlay
                loop={false}
                style={styles.lottie}
              />
              <Text style={[
                styles.animationText,
                animationType === 'error' && styles.animationTextError
              ]}>
                {animationType === 'success' 
                  ? step === 1 ? 'PIN Created!' : 'PIN Confirmed!' 
                  : 'PINs Don\'t Match'}
              </Text>
              {animationType === 'error' && (
                <Text style={styles.animationSubtext}>
                  Please try again
                </Text>
              )}
            </View>
          </View>
        </Modal>
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
  content: {
    flexGrow: 1,
    padding: 30,
    alignItems: 'center',
  },
  iconContainer: {
    marginTop: 30,
    marginBottom: 30,
    backgroundColor: '#e8f0ff',
    borderRadius: 80,
    padding: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  infoBanner: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  infoLabel: {
    fontSize: 15,
    color: '#666',
    marginLeft: 5,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 'auto',
  },
  pinContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    width: '100%',
    marginBottom: 30,
  },
  pinInput: {
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ddd',
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#333',
  },
  pinInputFilled: {
    borderColor: '#4c669f',
  },
  securityNote: {
    flexDirection: 'row',
    backgroundColor: '#fff3e0',
    padding: 15,
    borderRadius: 10,
    width: '100%',
    marginBottom: 30,
    gap: 10,
    alignItems: 'center',
  },
  securityText: {
    flex: 1,
    fontSize: 13,
    color: '#e65100',
    lineHeight: 18,
  },
  continueButton: {
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  continueGradient: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    gap: 10,
  },
  continueText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  backToCreateButton: {
    marginTop: 20,
    paddingVertical: 10,
  },
  backToCreateText: {
    color: '#4c669f',
    fontSize: 15,
    fontWeight: '600',
  },
  animationModal: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  animationContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    width: '80%',
    maxWidth: 300,
  },
  lottie: {
    width: 150,
    height: 150,
  },
  animationText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4c669f',
    marginTop: 10,
  },
  animationTextError: {
    color: '#ff3b30',
  },
  animationSubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
    textAlign: 'center',
  },
});
