import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { auth } from '../firebase/config';
import {
  updateEmail,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from 'firebase/auth';

export default function SecurityScreen({ navigation }) {
  const user = auth.currentUser;
  const [currentPassword, setCurrentPassword] = useState('');
  const [newEmail, setNewEmail] = useState(user?.email || '');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Your existing functions...

  const reauthenticate = async () => {
    if (!user || !currentPassword) {
      Alert.alert('Error', 'User or password missing');
      return false;
    }
    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    try {
      await reauthenticateWithCredential(user, credential);
      return true;
    } catch (error) {
      Alert.alert('Reauthentication failed', error.message);
      return false;
    }
  };

  const handleUpdate = async () => {
    if (!currentPassword) {
      Alert.alert('Missing Info', 'Enter your current password to proceed');
      return;
    }
    const emailChanged = newEmail.trim() !== '' && newEmail.trim() !== user.email;
    const passwordChanged = newPassword.trim() !== '';
    if (!emailChanged && !passwordChanged) {
      Alert.alert('No Changes', 'Nothing new to update');
      return;
    }
    setLoading(true);
    const ok = await reauthenticate();
    if (!ok) {
      setLoading(false);
      return;
    }
    try {
      if (emailChanged) {
        await updateEmail(user, newEmail.trim());
      }
      if (passwordChanged) {
        await updatePassword(user, newPassword.trim());
      }
      Alert.alert('Success', 'Info updated. Please log in again.');
      await auth.signOut();
      navigation.replace('Login');
    } catch (err) {
      Alert.alert('Update failed', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* BACK BUTTON */}
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.header}>Security Settings</Text>

      <Text style={styles.label}>Current Password *</Text>
      <TextInput
        value={currentPassword}
        onChangeText={setCurrentPassword}
        placeholder="Enter current password"
        secureTextEntry
        style={styles.input}
      />

      <Text style={styles.label}>New Email</Text>
      <TextInput
        value={newEmail}
        onChangeText={setNewEmail}
        placeholder="Enter new email"
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
      />

      <Text style={styles.label}>New Password</Text>
      <TextInput
        value={newPassword}
        onChangeText={setNewPassword}
        placeholder="Enter new password"
        secureTextEntry
        style={styles.input}
      />

      <TouchableOpacity
        style={[styles.button, loading && { backgroundColor: '#aaa' }]}
        onPress={handleUpdate}
        disabled={loading}
      >
        <Text style={styles.buttonText}>{loading ? 'Updating...' : 'Update & Log Out'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  backButton: {
    marginBottom: 10,
  },
  backButtonText: {
    fontSize: 16,
    color: '#007B7F',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#222',
  },
  label: {
    fontSize: 16,
    marginBottom: 6,
    color: '#444',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007B7F',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
