import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  Alert,
  useWindowDimensions,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export default function OTPVerificationScreen({ navigation, route }) {
  const { phoneNumber } = route.params;
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 768;
  const isLargeScreen = width >= 1024;
  
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(60); // 60 seconds countdown
  const [canResend, setCanResend] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  
  const inputRefs = useRef([]);

  useEffect(() => {
    // Start countdown timer
    const interval = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 1) {
          setCanResend(true);
          clearInterval(interval);
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleOtpChange = (value, index) => {
    // Only allow numbers
    if (value && !/^\d+$/.test(value)) {
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-verify when all digits are entered
    if (newOtp.every(digit => digit !== '') && !isVerifying) {
      handleVerifyOtp(newOtp.join(''));
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = async (otpCode) => {
    setIsVerifying(true);
    
    // Simulate API call
    setTimeout(() => {
      // For demo purposes, accept any 6-digit OTP
      // In production, verify with backend
      if (otpCode.length === 6) {
        // Navigate directly to ChooseLocker screen
        navigation.navigate('ChooseLocker');
      } else {
        Alert.alert('Error', 'Invalid OTP. Please try again.');
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }
      setIsVerifying(false);
    }, 1500);
  };

  const handleResendOtp = () => {
    if (!canResend) return;

    // Reset timer and OTP
    setTimer(60);
    setCanResend(false);
    setOtp(['', '', '', '', '', '']);
    inputRefs.current[0]?.focus();

    // Simulate sending new OTP
    Alert.alert('Success', 'A new verification code has been sent to your phone.');

    // Start countdown again
    const interval = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 1) {
          setCanResend(true);
          clearInterval(interval);
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const maskedPhone = phoneNumber
    ? `${phoneNumber.slice(0, -4).replace(/\d/g, '*')}${phoneNumber.slice(-4)}`
    : '';

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
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
            OTP Verification
          </Text>
        </LinearGradient>

        {/* Content */}
        <View style={[
          styles.content,
          isLargeScreen && { maxWidth: 600, alignSelf: 'center', width: '100%' }
        ]}>
          {/* Icon */}
          <View style={styles.iconContainer}>
            <Ionicons 
              name="mail-outline" 
              size={isSmallScreen ? 70 : 90} 
              color="#4c669f" 
            />
          </View>

          <Text style={[styles.title, { fontSize: isSmallScreen ? 22 : 28 }]}>
            Enter Verification Code
          </Text>
          <Text style={[styles.subtitle, { fontSize: isSmallScreen ? 14 : 16 }]}>
            We've sent a 6-digit code to{'\n'}
            <Text style={styles.phoneText}>{maskedPhone}</Text>
          </Text>

          {/* OTP Input */}
          <View style={[
            styles.otpContainer,
            isLargeScreen && { maxWidth: 400, alignSelf: 'center' }
          ]}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => (inputRefs.current[index] = ref)}
                style={[
                  styles.otpInput,
                  { 
                    width: isSmallScreen ? 45 : 55,
                    height: isSmallScreen ? 50 : 60,
                    fontSize: isSmallScreen ? 20 : 24
                  },
                  digit && styles.otpInputFilled,
                ]}
                keyboardType="number-pad"
                maxLength={1}
                value={digit}
                onChangeText={(value) => handleOtpChange(value, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                selectTextOnFocus
              />
          ))}
        </View>

        {/* Timer */}
        <View style={styles.timerContainer}>
          {!canResend ? (
            <>
              <Ionicons name="time-outline" size={20} color="#4c669f" />
              <Text style={styles.timerText}>
                Code expires in{' '}
                <Text style={styles.timerValue}>{formatTime(timer)}</Text>
              </Text>
            </>
          ) : (
            <Text style={styles.expiredText}>Code expired</Text>
          )}
        </View>

        {/* Resend Button */}
        <TouchableOpacity
          style={[
            styles.resendButton,
            !canResend && styles.resendButtonDisabled,
          ]}
          onPress={handleResendOtp}
          disabled={!canResend}
        >
          <Text
            style={[
              styles.resendButtonText,
              !canResend && styles.resendButtonTextDisabled,
            ]}
          >
            Resend Code
          </Text>
        </TouchableOpacity>

        {/* Verify Button */}
        <TouchableOpacity
          style={styles.verifyButton}
          onPress={() => handleVerifyOtp(otp.join(''))}
          disabled={isVerifying || otp.some(digit => !digit)}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={
              isVerifying || otp.some(digit => !digit)
                ? ['#ccc', '#999']
                : ['#4c669f', '#3b5998']
            }
            style={styles.verifyButtonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.verifyButtonText}>
              {isVerifying ? 'Verifying...' : 'Verify OTP'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Help Text */}
        <Text style={[styles.helpText, { fontSize: isSmallScreen ? 12 : 14 }]}>
          Didn't receive the code?{'\n'}
          Check your phone or wait for the resend option
        </Text>
      </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
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
    marginBottom: 40,
    textAlign: 'center',
    lineHeight: 20,
  },
  phoneText: {
    fontWeight: 'bold',
    color: '#4c669f',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 30,
    gap: 5,
  },
  otpInput: {
    backgroundColor: 'white',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#ddd',
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#333',
  },
  otpInputFilled: {
    borderColor: '#4c669f',
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  timerText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  timerValue: {
    fontWeight: 'bold',
    color: '#4c669f',
  },
  expiredText: {
    fontSize: 14,
    color: '#ff3b30',
    fontWeight: 'bold',
  },
  resendButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  resendButtonDisabled: {
    opacity: 0.5,
  },
  resendButtonText: {
    color: '#4c669f',
    fontSize: 16,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  resendButtonTextDisabled: {
    color: '#999',
  },
  verifyButton: {
    width: '100%',
    marginTop: 10,
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  verifyButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifyButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  helpText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    marginTop: 30,
    lineHeight: 18,
  },
});
