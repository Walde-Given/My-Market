import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

export default function HomeScreen({ navigation }) {
  const [uploads, setUploads] = useState([]);

  const fetchAllUploads = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const uploadKeys = keys.filter((key) => key.startsWith('uploads_'));

      let allUploads = [];

      for (const key of uploadKeys) {
        const storedItems = await AsyncStorage.getItem(key);
        const userUploads = storedItems ? JSON.parse(storedItems) : [];
        allUploads = allUploads.concat(userUploads);
      }

      // Filter out sold items here:
      const filteredUploads = allUploads.filter(item => !item.sold);

      const sorted = filteredUploads.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      setUploads(sorted);
    } catch (error) {
      console.error('Error loading uploads:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchAllUploads();
    }, [])
  );

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
  };

  const RenderItem = ({ item }) => {
    const [profilePic, setProfilePic] = useState(null);
    const [contact, setContact] = useState('');
    const [name, setName] = useState(''); // added state for user name

    useEffect(() => {
      const loadProfile = async () => {
        try {
          const pic = await AsyncStorage.getItem(`profilePic_${item.userId}`);
          const contactInfo = await AsyncStorage.getItem(`contact_${item.userId}`);
          const userName = await AsyncStorage.getItem(`userName_${item.userId}`); // <-- fixed key here
          if (pic) setProfilePic(pic);
          if (contactInfo) setContact(contactInfo);
          if (userName) setName(userName);
        } catch (error) {
          console.error('Failed to load profile info:', error);
        }
      };
      loadProfile();
    }, []);

    return (
      <View style={styles.itemContainer}>
        <View style={styles.floatingOverlay}>
          {profilePic ? (
            <Image source={{ uri: profilePic }} style={styles.profilePic} />
          ) : (
            <View style={styles.profilePicPlaceholder}>
              <Text style={{ color: '#888', fontSize: 14 }}>No Pic</Text>
            </View>
          )}
          {/* Display user name */}
          <Text style={{ fontWeight: 'bold', fontSize: 16, color: '#333', marginBottom: 4 }}>
            {name || 'No Name'}
          </Text>
          <Text style={styles.contactText}>{contact || 'No Contact'}</Text>
        </View>

        {item.imageUrl && (
          <Image source={{ uri: item.imageUrl }} style={styles.image} />
        )}
        <Text style={styles.itemTitle}>
          {item.description}{' '}
          {item.sold && <Text style={styles.soldLabel}>[SOLD]</Text>}
        </Text>
        <Text style={styles.itemPrice}>N${item.price}</Text>
        <Text style={styles.itemCategory}>{item.category}</Text>
        <Text style={styles.itemDate}>{formatDate(item.createdAt)}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.title}>Welcome to MY MARKET™️</Text>
      </View>

      <FlatList
        data={uploads}
        keyExtractor={(item, index) => item.id || index.toString()}
        contentContainerStyle={{ paddingBottom: 120 }}
        renderItem={({ item }) => <RenderItem item={item} />}
      />

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
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 30,
    marginTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  itemContainer: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 350,
    borderRadius: 10,
    marginBottom: 10,
    resizeMode: 'cover',
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  itemPrice: {
    fontSize: 16,
    color: '#888',
  },
  itemCategory: {
    fontSize: 14,
    color: '#666',
  },
  itemDate: {
    fontSize: 12,
    color: '#aaa',
    marginTop: 5,
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
  floatingOverlay: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#ffffffcc',
    borderRadius: 15,
    padding: 12,
    alignItems: 'center',
    zIndex: 10,
    elevation: 5,
  },
  profilePic: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 8,
    backgroundColor: '#ccc',
  },
  profilePicPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  contactText: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
    maxWidth: 120,
  },
  soldLabel: {
    color: 'red',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
