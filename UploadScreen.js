import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth } from '../firebase/config'; // Only for user UID

export default function UploadScreen({ navigation }) {
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  // const [contact, setContact] = useState('');  // Removed contact state
  const [image, setImage] = useState(null);
  const categories = ['Food', 'Clothes', 'Gadgets', 'Furniture'];

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.status !== 'granted') {
      alert('Permission to access gallery is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handlePriceChange = (text) => {
    const formattedText = text.replace(/[^0-9.]/g, '');
    setPrice(formattedText);
  };

  const handleUpload = async () => {
    if (!image || !description || !price || !category /* || !contact */) {
      Alert.alert('All fields are required!');
      return;
    }

    try {
      const userId = auth.currentUser?.uid;

      if (!userId) {
        Alert.alert('User not logged in.');
        return;
      }

      const newItem = {
        id: Date.now().toString(),
        description,
        price,
        category,
        // contact,  // Removed contact from upload object
        imageUrl: image,
        createdAt: new Date(),
        userId, // ✅ This line ensures the item includes uploader info
      };

      const storedItems = await AsyncStorage.getItem(`uploads_${userId}`);
      const uploads = storedItems ? JSON.parse(storedItems) : [];

      uploads.push(newItem);

      await AsyncStorage.setItem(`uploads_${userId}`, JSON.stringify(uploads));

      Alert.alert('Upload successful!');
      navigation.navigate('Home');
    } catch (error) {
      console.error('Upload failed:', error.message);
      Alert.alert('Upload failed', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Upload Your Item</Text>

      <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
        {image ? (
          <Image source={{ uri: image }} style={styles.imagePreview} />
        ) : (
          <Text style={styles.imagePickerText}>Pick an Image</Text>
        )}
      </TouchableOpacity>

      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <TextInput
        style={styles.input}
        placeholder="Price (N$)"
        value={price}
        onChangeText={handlePriceChange}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Select Category</Text>
      <View style={styles.categoryTray}>
        {categories.map((item) => (
          <TouchableOpacity
            key={item}
            style={[
              styles.categoryOption,
              category === item && styles.selectedCategory,
            ]}
            onPress={() => setCategory(item)}
          >
            <Text
              style={[
                styles.categoryText,
                category === item && { color: '#fff' },
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Removed the contact input */}

      <TouchableOpacity style={styles.uploadButton} onPress={handleUpload}>
        <Text style={styles.uploadButtonText}>UPLOAD</Text>
      </TouchableOpacity>

      {/* Bottom Nav */}
      <View style={styles.navBar}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate('Home')}
        >
          <Ionicons name="home-outline" size={24} color="#fff" />
          <Text style={styles.navLabel}>HOME</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate('Category')}
        >
          <Ionicons name="list-outline" size={24} color="#fff" />
          <Text style={styles.navLabel}>CATEGORY</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate('Upload')}
        >
          <Ionicons name="add-circle-outline" size={24} color="#fff" />
          <Text style={styles.navLabel}>UPLOAD</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate('Profile')}
        >
          <Ionicons name="person-outline" size={24} color="#fff" />
          <Text style={styles.navLabel}>PROFILE</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 30,
    paddingBottom: 100,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  imagePicker: {
    height: 150,
    backgroundColor: '#eee',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  imagePickerText: {
    color: '#888',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
  },
  textArea: {
    height: 100,
  },
  label: {
    fontSize: 16,
    marginTop: 20,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  categoryTray: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  categoryOption: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginVertical: 5,
  },
  selectedCategory: {
    backgroundColor: '#00A898',
  },
  categoryText: {
    color: '#333',
    fontWeight: 'bold',
  },
  uploadButton: {
    backgroundColor: '#00A898',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  uploadButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  navBar: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#00A898',
    borderRadius: 25,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 10,
  },
  navButton: {
    alignItems: 'center',
  },
  navLabel: {
    color: '#fff',
    fontSize: 12,
    marginTop: 3,
  },
});
