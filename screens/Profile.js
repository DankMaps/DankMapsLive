// src/screens/ProfileScreen.js

import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Share,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { Text, Button, Avatar, List } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TopBar from '../components/TopBar';

const ProfileScreen = ({ navigation }) => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [profilePic, setProfilePic] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUserName = await AsyncStorage.getItem('userName');
        const storedEmail = await AsyncStorage.getItem('email');
        const storedProfilePic = await AsyncStorage.getItem('profilePic');

        if (storedUserName) setUserName(storedUserName);
        if (storedEmail) setEmail(storedEmail);
        if (storedProfilePic) setProfilePic(storedProfilePic);
      } catch (error) {
        console.log('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Denied',
        'Camera roll permissions are needed to update your profile picture.'
      );
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.cancelled) {
      setProfilePic(result.uri);
      await AsyncStorage.setItem('profilePic', result.uri);
    }
  };

  const handleSignOut = async () => {
    try {
      await AsyncStorage.clear();
      navigation.replace('Login');
    } catch (error) {
      console.log('Error signing out:', error);
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: 'Check out this awesome app!',
        url: 'https://yourappurl.com',
        title: 'Awesome App',
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share the app.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <TopBar title="Profile" />

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <TouchableOpacity
              onPress={pickImage}
              accessibilityLabel="Change Profile Picture"
              accessibilityRole="button"
            >
              {profilePic ? (
                <Avatar.Image size={90} source={{ uri: profilePic }} />
              ) : (
                <Avatar.Icon size={90} icon="camera" />
              )}
            </TouchableOpacity>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{userName}</Text>
              <Text style={styles.email}>{email}</Text>
            </View>
          </View>

          <Button
            mode="outlined"
            onPress={handleSignOut}
            style={styles.button}
          >
            Sign Out
          </Button>

          <Button
            mode="contained"
            onPress={handleShare}
            style={styles.shareButton}
          >
            Share the App
          </Button>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Terms of Use and Privacy Policy */}
          <List.Section>
            <List.Item
              title="Terms of Use"
              left={(props) => <List.Icon {...props} icon="file-document" />}
              onPress={() => navigation.navigate('TermsOfUse')}
              accessibilityLabel="View Terms of Use"
              accessibilityRole="button"
            />
            <List.Item
              title="Privacy Policy"
              left={(props) => <List.Icon {...props} icon="shield-lock" />}
              onPress={() => navigation.navigate('PrivacyPolicy')}
              accessibilityLabel="View Privacy Policy"
              accessibilityRole="button"
            />
          </List.Section>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    padding: 25,
    paddingTop: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  userInfo: {
    marginLeft: 15,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  email: {
    fontSize: 16,
    color: '#777',
  },
  button: {
    marginTop: 10,
    width: '100%',
    height: 50,
    justifyContent: 'center',
    borderRadius: 10,
  },
  shareButton: {
    marginTop: 15,
    width: '100%',
    height: 50,
    justifyContent: 'center',
    borderRadius: 10,
  },
  divider: {
    marginVertical: 30,
    borderBottomColor: '#ccc',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});

export default ProfileScreen;
