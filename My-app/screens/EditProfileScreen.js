

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Platform } from 'react-native';

export default function EditProfileScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [about, setAbout] = useState('');
  const [contact, setContact] = useState('');

  // Save updated profile information and navigate back to Profile screen
  const handleSave = () => {
    // Log the updated details for now (you can later save these in Firebase or another backend)
    console.log('Profile updated:', { username, about, contact });

    // After saving, navigate back to Profile screen
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={styles.innerContainer}>
          <Text style={styles.heading}>Edit Profile</Text>

          <TextInput
            style={styles.input}
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
          />

          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="About"
            value={about}
            onChangeText={setAbout}
            multiline
          />

          <TextInput
            style={styles.input}
            placeholder="Contact Details"
            value={contact}
            onChangeText={setContact}
          />

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>SAVE</Text>
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 60, // Increased padding to ensure no cut-off at top
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
  },
  textArea: {
    height: 100,
  },
  saveButton: {
    backgroundColor: '#00A898',  // Consistent color
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  saveButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
