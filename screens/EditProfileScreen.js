import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { auth } from '../firebase/config';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function EditProfileScreen({ navigation }) {
  const user = auth.currentUser;

  const [userName, setUserName] = useState('');
  const [contact, setContact] = useState('');
  const [profilePic, setProfilePic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;

    const loadData = async () => {
      try {
        const storedUserName = await AsyncStorage.getItem(`userName_${user.uid}`);
        if (storedUserName) setUserName(storedUserName);

        const contactText = await AsyncStorage.getItem(`contact_${user.uid}`);
        if (contactText) setContact(contactText);

        const picUri = await AsyncStorage.getItem(`profilePic_${user.uid}`);
        if (picUri) setProfilePic(picUri);
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert(
        'Permission required',
        'You need to allow access to photos to update profile picture.'
      );
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
      allowsEditing: true,
      aspect: [1, 1],
    });

    if (!pickerResult.canceled) {
      setProfilePic(pickerResult.assets[0].uri);
    }
  };

  const handleSave = async () => {
    if (saving) return;
    setSaving(true);

    try {
      await AsyncStorage.setItem(`userName_${user.uid}`, userName);
      await AsyncStorage.setItem(`contact_${user.uid}`, contact);

      if (profilePic) {
        await AsyncStorage.setItem(`profilePic_${user.uid}`, profilePic);
      } else {
        await AsyncStorage.removeItem(`profilePic_${user.uid}`);
      }

      Alert.alert('Success', 'Profile updated!');
      navigation.goBack(); // Go back to Profile screen
    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert('Error', 'Failed to save profile. Try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00A898" />
        <Text>Loading profile data...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.label}>Profile Picture</Text>
      <TouchableOpacity style={styles.profilePicContainer} onPress={pickImage}>
        {profilePic ? (
          <Image source={{ uri: profilePic }} style={styles.profilePic} />
        ) : (
          <View style={styles.profilePicPlaceholder}>
            <Text style={styles.profilePicPlaceholderText}>Select Image</Text>
          </View>
        )}
      </TouchableOpacity>

      <Text style={styles.label}>User Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your name"
        value={userName}
        onChangeText={setUserName}
      />

      <Text style={styles.label}>Contact Details</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter contact details (phone, address, etc.)"
        value={contact}
        onChangeText={setContact}
      />

      <Text style={styles.label}>Email (cannot change)</Text>
      <View style={[styles.input, styles.disabledInput]}>
        <Text>{user.email}</Text>
      </View>

      <TouchableOpacity
        style={[styles.saveButton, saving && { opacity: 0.6 }]}
        onPress={handleSave}
        disabled={saving}
      >
        <Text style={styles.saveButtonText}>{saving ? 'Saving...' : 'Save Changes'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
    marginVertical: 10,
    color: '#333',
  },
  profilePicContainer: {
    alignSelf: 'center',
    marginBottom: 20,
  },
  profilePic: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#ccc',
  },
  profilePicPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profilePicPlaceholderText: {
    color: '#888',
  },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    color: '#333',
  },
  disabledInput: {
    backgroundColor: '#eee',
    justifyContent: 'center',
  },
  saveButton: {
    backgroundColor: '#00A898',
    marginTop: 30,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
