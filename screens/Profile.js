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
import { Text, Button, Avatar, List, ActivityIndicator } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import TopBar from '../components/TopBar';

// Import auth and storage from your firebase.js file
import { auth, storage } from '../firebase';
import { signOut } from 'firebase/auth';
import { ref, getDownloadURL, uploadBytes } from 'firebase/storage';

const ProfileScreen = ({ navigation }) => {
  const [userName, setUserName] = useState(''); // User's display name
  const [email, setEmail] = useState('');       // User's email
  const [profilePic, setProfilePic] = useState(null); // URL of profile picture
  const [uploading, setUploading] = useState(false);  // Uploading state
  const [loading, setLoading] = useState(true);       // Loading state for profile data

  useEffect(() => {
    const user = auth.currentUser;

    if (user) {
      setUserName(user.displayName || '');
      setEmail(user.email || '');

      // Get profile picture URL from Firebase storage if it exists
      const storageRef = ref(storage, `profilePictures/${user.uid}`);
      getDownloadURL(storageRef)
        .then((url) => {
          setProfilePic(url);
          setLoading(false);
        })
        .catch((error) => {
          console.log('No profile picture found:', error);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
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
      quality: 0.7,
    });

    if (!result.cancelled) {
      setUploading(true);
      try {
        const response = await fetch(result.uri);
        const blob = await response.blob();

        const user = auth.currentUser;
        const storageRef = ref(storage, `profilePictures/${user.uid}`);

        await uploadBytes(storageRef, blob);

        // Get the download URL
        const url = await getDownloadURL(storageRef);

        setProfilePic(url);
        setUploading(false);
        Alert.alert('Success', 'Profile picture updated successfully.');
      } catch (error) {
        console.log('Error uploading image:', error);
        setUploading(false);
        Alert.alert('Error', 'Failed to upload profile picture.');
      }
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigation.replace('Login');
    } catch (error) {
      console.log('Error signing out:', error);
      Alert.alert('Error', 'Failed to sign out. Please try again.');
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

  if (loading) {
    // Show a loading indicator while fetching user data
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2e7d32" />
      </View>
    );
  }

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
              {uploading ? (
                <ActivityIndicator size="large" color="#2e7d32" />
              ) : profilePic ? (
                <Avatar.Image size={100} source={{ uri: profilePic }} />
              ) : (
                <Avatar.Icon size={100} icon="account" />
              )}
            </TouchableOpacity>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{userName}</Text>
              <Text style={styles.email}>{email}</Text>
            </View>
          </View>

          <Button
            mode="contained"
            onPress={handleShare}
            style={styles.shareButton}
            icon="share-variant"
          >
            Share the App
          </Button>

          <Button
            mode="outlined"
            onPress={handleSignOut}
            style={styles.button}
            icon="logout"
          >
            Sign Out
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
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 20,
  },
  userInfo: {
    alignItems: 'center',
    marginTop: 15,
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2e7d32',
  },
  email: {
    fontSize: 16,
    color: '#555',
    marginTop: 5,
  },
  button: {
    marginTop: 20,
    alignSelf: 'center',
    width: '80%',
    borderColor: '#2e7d32',
  },
  shareButton: {
    marginTop: 10,
    alignSelf: 'center',
    width: '80%',
    backgroundColor: '#2e7d32',
  },
  divider: {
    marginVertical: 30,
    borderBottomColor: '#ccc',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ProfileScreen;
