import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  Alert,
  useWindowDimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export default function MobileVerificationScreen({ navigation }) {
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 768;
  const isLargeScreen = width >= 1024;
  
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+1');
  const [errors, setErrors] = useState({});

  const validatePhoneNumber = (number) => {
    // Remove all non-digit characters
    const cleaned = number.replace(/\D/g, '');
    
    // Check if it's a valid length (10 digits for US)
    if (cleaned.length < 10 || cleaned.length > 15) {
      return false;
    }
    
    // Basic pattern matching
    const phonePattern = /^[0-9]{10,15}$/;
    return phonePattern.test(cleaned);
  };

  const formatPhoneNumber = (text) => {
    // Remove all non-digit characters
    const cleaned = text.replace(/\D/g, '');
    
    // Format as (XXX) XXX-XXXX for US numbers
    if (cleaned.length <= 3) {
      return cleaned;
    } else if (cleaned.length <= 6) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
    } else {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
    }
  };

  const handlePhoneChange = (text) => {
    const formatted = formatPhoneNumber(text);
    setPhoneNumber(formatted);
    
    // Clear error when user starts typing
    if (errors.phone) {
      setErrors({ ...errors, phone: '' });
    }
  };

  const handleSendVerification = () => {
    // Validate phone number
    const cleaned = phoneNumber.replace(/\D/g, '');
    
    if (!phoneNumber.trim()) {
      setErrors({ phone: 'Phone number is required' });
      return;
    }
    
    if (!validatePhoneNumber(cleaned)) {
      setErrors({ phone: 'Please enter a valid phone number' });
      return;
    }

    // Clear errors
    setErrors({});
    
    // Navigate to OTP screen
    navigation.navigate('OTPVerification', {
      phoneNumber: `${countryCode}${cleaned}`,
    });
  };

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
            Mobile Verification
          </Text>
        </LinearGradient>

        {/* Content */}
        <View style={[
          styles.content,
          isLargeScreen && { maxWidth: 500, alignSelf: 'center', width: '100%' }
        ]}>
          {/* Phone Icon */}
          <View style={styles.iconContainer}>
            <Ionicons 
              name="phone-portrait-outline" 
              size={isSmallScreen ? 70 : 90} 
              color="#4c669f" 
            />
          </View>

          <Text style={[styles.title, { fontSize: isSmallScreen ? 22 : 28 }]}>
            Enter Your Mobile Number
          </Text>
          <Text style={[styles.subtitle, { fontSize: isSmallScreen ? 14 : 16 }]}>
            We'll send you a verification code
          </Text>

          {/* Phone Input Section */}
          <View style={styles.inputContainer}>
            <View style={styles.countryCodeContainer}>
              <Text style={styles.countryCode}>{countryCode}</Text>
              <Ionicons name="chevron-down" size={16} color="#666" />
            </View>
            
            <View style={styles.phoneInputWrapper}>
              <TextInput
                style={[styles.phoneInput, errors.phone && styles.inputError]}
                placeholder="(123) 456-7890"
                placeholderTextColor="#999"
                keyboardType="phone-pad"
                value={phoneNumber}
                onChangeText={handlePhoneChange}
                maxLength={14}
                autoFocus
              />
            </View>
          </View>

          {errors.phone && (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle" size={16} color="#ff3b30" />
              <Text style={styles.errorText}>{errors.phone}</Text>
            </View>
          )}

          {/* Send Verification Button */}
          <TouchableOpacity
            style={styles.sendButton}
            onPress={handleSendVerification}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#4c669f', '#3b5998']}
              style={styles.sendButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.sendButtonText}>Send Verification Code</Text>
              <Ionicons name="arrow-forward" size={20} color="white" />
            </LinearGradient>
          </TouchableOpacity>

          {/* Terms and Privacy */}
          <Text style={styles.termsText}>
            By continuing, you agree to our{' '}
            <Text style={styles.termsLink}>Terms and Conditions</Text>
            {' '}and{' '}
            <Text style={styles.termsLink}>Privacy Policy</Text>
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
  },
  inputContainer: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: 10,
  },
  countryCodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 15,
    borderRadius: 10,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  countryCode: {
    fontSize: 16,
    color: '#333',
    marginRight: 5,
  },
  phoneInputWrapper: {
    flex: 1,
  },
  phoneInput: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderRadius: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  inputError: {
    borderColor: '#ff3b30',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginTop: 5,
    marginBottom: 10,
  },
  errorText: {
    color: '#ff3b30',
    fontSize: 14,
    marginLeft: 5,
  },
  sendButton: {
    width: '100%',
    marginTop: 30,
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
  sendButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  sendButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
  },
  termsText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 30,
    lineHeight: 18,
  },
  termsLink: {
    color: '#4c669f',
    fontWeight: '600',
  },
});
