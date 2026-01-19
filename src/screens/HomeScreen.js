import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  SafeAreaView,
  Platform,
  Linking,
  useWindowDimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

export default function HomeScreen({ navigation }) {
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 768;
  const isMediumScreen = width >= 768 && width < 1024;
  const isLargeScreen = width >= 1024;
  
  const lockerLocation = "Downtown Mall, 123 Main Street";
  const hourlyRate = "$2.50";
  const availableLockers = 42;

  const handleDownloadApp = (platform) => {
    if (platform === 'android') {
      // Replace with actual Play Store link
      Linking.openURL('https://play.google.com/store');
    } else if (platform === 'ios') {
      // Replace with actual App Store link
      Linking.openURL('https://apps.apple.com/');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        style={styles.container}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
        showsVerticalScrollIndicator={true}
        bounces={true}
        nestedScrollEnabled={true}
      >
      <LinearGradient
        colors={['#4c669f', '#3b5998', '#192f6a']}
        style={[styles.header, { paddingVertical: isSmallScreen ? 20 : 25 }]}
      >
        <Text style={[styles.locationText, { fontSize: isSmallScreen ? 14 : 16, marginTop: 8 }]}>
          {lockerLocation}
        </Text>
        <Text style={[styles.secureText, { fontSize: isSmallScreen ? 22 : 26, marginTop: 8 }]}>
          SECURE
        </Text>
      </LinearGradient>

      <View style={[
        styles.content,
        isLargeScreen && styles.contentLarge,
        isMediumScreen && styles.contentMedium
      ]}>
        {/* Hourly Rate Section */}
        <View style={[
          styles.infoCard,
          { width: isLargeScreen ? '23%' : isMediumScreen ? '48%' : '47%' }
        ]}>
          <View style={styles.cardIcon}>
            <Ionicons name="time-outline" size={isSmallScreen ? 40 : 50} color="#4c669f" />
          </View>
          <Text style={[styles.cardTitle, { fontSize: isSmallScreen ? 14 : 16 }]}>
            Hourly Rate
          </Text>
          <Text style={[styles.cardValue, { fontSize: isSmallScreen ? 32 : 40 }]}>
            {hourlyRate}
          </Text>
          <Text style={styles.cardSubtext}>per hour</Text>
        </View>

        {/* Available Lockers Section */}
        <TouchableOpacity
          style={[
            styles.infoCard,
            styles.lockerCard,
            { width: isLargeScreen ? '23%' : isMediumScreen ? '48%' : '47%' }
          ]}
          onPress={() => navigation.navigate('MobileVerification')}
          activeOpacity={0.7}
        >
          <View style={styles.cardIcon}>
            <MaterialIcons name="lock-outline" size={isSmallScreen ? 40 : 50} color="#4c669f" />
          </View>
          <Text style={[styles.cardTitle, { fontSize: isSmallScreen ? 14 : 16 }]}>
            Available Lockers
          </Text>
          <Text style={[styles.cardValue, { fontSize: isSmallScreen ? 32 : 40 }]}>
            {availableLockers}
          </Text>
          <Text style={styles.cardSubtext}>Tap to book</Text>
          <View style={styles.tapIndicator}>
            <Ionicons name="arrow-forward-circle" size={28} color="#4c669f" />
          </View>
        </TouchableOpacity>
      </View>

      {/* Download Section */}
      <View style={[styles.downloadSection, isLargeScreen && { maxWidth: 600, alignSelf: 'center' }]}>
        <Text style={[styles.downloadTitle, { fontSize: isSmallScreen ? 20 : 26 }]}>
          Download Our App
        </Text>
        <Text style={styles.downloadSubtitle}>
          Get the best locker booking experience
        </Text>

        <View style={[
          styles.downloadButtons,
          isLargeScreen && { flexDirection: 'row', justifyContent: 'center', gap: 20 }
        ]}>
          <TouchableOpacity
            style={[styles.downloadButton, isLargeScreen && { width: '45%' }]}
            onPress={() => handleDownloadApp('android')}
          >
            <Ionicons name="logo-google-playstore" size={24} color="white" />
            <View style={styles.downloadTextContainer}>
              <Text style={styles.downloadButtonTextSmall}>GET IT ON</Text>
              <Text style={styles.downloadButtonTextLarge}>Google Play</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.downloadButton, isLargeScreen && { width: '45%' }]}
            onPress={() => handleDownloadApp('ios')}
          >
            <Ionicons name="logo-apple" size={24} color="white" />
            <View style={styles.downloadTextContainer}>
              <Text style={styles.downloadButtonTextSmall}>Download on the</Text>
              <Text style={styles.downloadButtonTextLarge}>App Store</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
      </ScrollView>
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
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 50 : 35,
    paddingBottom: 20,
    alignItems: 'center',
  },
  locationText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '500',
  },
  secureText: {
    color: '#FFD700',
    fontWeight: 'bold',
    letterSpacing: 3,
  },
  content: {
    paddingHorizontal: 15,
    paddingTop: 20,
    paddingBottom: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
  },
  contentMedium: {
    paddingHorizontal: 40,
    gap: 15,
  },
  contentLarge: {
    paddingHorizontal: 60,
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
    gap: 20,
  },
  infoCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 6,
    minHeight: 200,
    justifyContent: 'center',
  },
  lockerCard: {
    borderWidth: 2,
    borderColor: '#4c669f',
  },
  cardIcon: {
    marginBottom: 12,
  },
  cardTitle: {
    color: '#666',
    marginBottom: 8,
    textAlign: 'center',
    fontWeight: '500',
  },
  cardValue: {
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  cardSubtext: {
    fontSize: 13,
    color: '#999',
  },
  tapIndicator: {
    position: 'absolute',
    bottom: 12,
    right: 12,
  },
  downloadSection: {
    padding: 20,
    paddingTop: 15,
    paddingBottom: 30,
    alignItems: 'center',
  },
  downloadTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  downloadSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  downloadButtons: {
    width: '100%',
  },
  downloadButton: {
    backgroundColor: '#000',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  downloadTextContainer: {
    marginLeft: 10,
    alignItems: 'flex-start',
  },
  downloadButtonTextSmall: {
    color: 'white',
    fontSize: 10,
  },
  downloadButtonTextLarge: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
