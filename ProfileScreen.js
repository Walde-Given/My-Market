import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Modal,
  FlatList,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons, Entypo } from '@expo/vector-icons';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

export default function ProfileScreen({ navigation }) {
  const [menuVisible, setMenuVisible] = useState(false);
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState('');
  const [uploads, setUploads] = useState([]);
  const [profilePic, setProfilePic] = useState(null);
  const [contact, setContact] = useState('');

  const loadProfileData = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    setUser(currentUser);

    try {
      const picUri = await AsyncStorage.getItem(`profilePic_${currentUser.uid}`);
      setProfilePic(picUri || null);
    } catch (e) {
      console.error('Error loading profile pic:', e);
    }

    try {
      const contactText = await AsyncStorage.getItem(`contact_${currentUser.uid}`);
      setContact(contactText || '');
    } catch (e) {
      console.error('Error loading contact info:', e);
    }

    try {
      const storedItems = await AsyncStorage.getItem(`uploads_${currentUser.uid}`);
      const userUploads = storedItems ? JSON.parse(storedItems) : [];
      setUploads(userUploads);
    } catch (e) {
      console.error('Error loading uploads:', e);
    }

    try {
      const storedUserName = await AsyncStorage.getItem(`userName_${currentUser.uid}`);
      setUserName(storedUserName || currentUser.displayName || '');
    } catch (e) {
      console.error('Error loading user name:', e);
      setUserName(currentUser.displayName || '');
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadProfileData();
    }, [])
  );

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.replace('Login');
    } catch (error) {
      console.error('Logout error:', error.message);
    }
  };

  const handleToggleSold = async (item) => {
    try {
      const updatedUploads = uploads.map((upload) =>
        upload.id === item.id ? { ...upload, sold: !upload.sold } : upload
      );
      setUploads(updatedUploads);
      await AsyncStorage.setItem(`uploads_${user.uid}`, JSON.stringify(updatedUploads));
    } catch (error) {
      console.error('Error toggling sold status:', error);
    }
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleString([], {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Text>Loading user data...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => setMenuVisible(true)}>
          <Entypo name="menu" size={40} color="#333" />
        </TouchableOpacity>
      </View>

      <Modal
        transparent={true}
        visible={menuVisible}
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableOpacity style={styles.modalOverlay} onPress={() => setMenuVisible(false)}>
          <View style={styles.menuContainer}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                navigation.navigate('EditProfile');
                setMenuVisible(false);
              }}
            >
              <Text style={styles.menuText}>Edit Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                navigation.navigate('Security');
                setMenuVisible(false);
              }}
            >
              <Text style={styles.menuText}>Security</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
              <Text style={styles.menuText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      <ScrollView contentContainerStyle={styles.profileContent} showsVerticalScrollIndicator={false}>
        {profilePic ? (
          <Image source={{ uri: profilePic }} style={styles.profileImage} />
        ) : user.photoURL ? (
          <Image source={{ uri: user.photoURL }} style={styles.profileImage} />
        ) : (
          <View style={styles.profileImageFallback}>
            <Text style={styles.initials}>{userName?.charAt(0).toUpperCase() || '?'}</Text>
          </View>
        )}
        <Text style={styles.name}>{userName || 'User Name'}</Text>
        <Text style={styles.email}>{user.email}</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>User Name</Text>
          <Text style={styles.sectionText}>{userName || 'No name available.'}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Details</Text>
          <Text style={styles.sectionText}>{contact || 'No contact info added.'}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>My Uploads</Text>

          {uploads.length === 0 ? (
            <Text style={styles.sectionText}>No uploads yet.</Text>
          ) : (
            <FlatList
              data={uploads}
              keyExtractor={(item) => item.id.toString()}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <View style={styles.itemContainer}>
                  <View style={styles.imageWrapper}>
                    {item.imageUrl ? (
                      <Image source={{ uri: item.imageUrl }} style={styles.image} />
                    ) : (
                      <View
                        style={[
                          styles.image,
                          { backgroundColor: '#ccc', justifyContent: 'center', alignItems: 'center' },
                        ]}
                      >
                        <Text>No Image</Text>
                      </View>
                    )}
                    {item.sold && (
                      <View style={styles.soldBadge}>
                        <Text style={styles.soldBadgeText}>SOLD</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.itemTitle}>{item.description || 'No description'}</Text>
                  <Text style={styles.itemPrice}>N${item.price || '0'}</Text>
                  <Text style={styles.itemCategory}>{item.category || 'No category'}</Text>
                  <Text style={styles.itemDate}>{formatTimestamp(item.createdAt)}</Text>
                  <TouchableOpacity
                    style={[styles.soldButton, item.sold ? styles.unsoldButton : null]}
                    activeOpacity={0.7}
                    onPress={() => handleToggleSold(item)}
                  >
                    <Text style={styles.soldButtonText}>
                      {item.sold ? 'Unmark as Sold' : 'Mark as Sold'}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            />
          )}
        </View>
      </ScrollView>

      <View style={styles.navBar}>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('Home')}>
          <Ionicons name="home-outline" size={24} color="#fff" />
          <Text style={styles.navLabel}>HOME</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('Category')}>
          <Ionicons name="list-outline" size={24} color="#fff" />
          <Text style={styles.navLabel}>CATEGORY</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('Upload')}>
          <Ionicons name="add-circle-outline" size={24} color="#fff" />
          <Text style={styles.navLabel}>UPLOAD</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('Profile')}>
          <Ionicons name="person-outline" size={24} color="#fff" />
          <Text style={styles.navLabel}>PROFILE</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingTop: 40 },
  topBar: { flexDirection: 'row', justifyContent: 'flex-end', padding: 20 },
  profileContent: {
    alignItems: 'center',
    paddingBottom: 100,
    paddingHorizontal: 15,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#ccc',
    marginBottom: 10,
  },
  profileImageFallback: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#bbb',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  initials: { fontSize: 36, fontWeight: 'bold', color: '#fff' },
  name: { fontSize: 24, fontWeight: 'bold', color: '#333' },
  email: { fontSize: 14, color: '#888', marginBottom: 20 },
  section: {
    width: '100%',
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 10,
    marginTop: 15,
  },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 8, color: '#333' },
  sectionText: { fontSize: 14, color: '#555', lineHeight: 20 },
  itemContainer: {
    padding: 15,
    backgroundColor: '#fff',
    marginBottom: 12,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    position: 'relative',
  },
  imageWrapper: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 350,
    borderRadius: 10,
    marginBottom: 10,
    resizeMode: 'cover',
  },
  soldBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: '#D00000',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    zIndex: 2,
  },
  soldBadgeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  itemTitle: { fontSize: 16, fontWeight: '600', color: '#333' },
  itemPrice: { fontSize: 14, fontWeight: 'bold', color: '#00A898', marginTop: 2 },
  itemCategory: { fontSize: 14, color: '#777', marginTop: 2 },
  itemDate: { fontSize: 12, color: '#999', marginTop: 2 },
  soldButton: {
    marginTop: 10,
    backgroundColor: '#FFB800',
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  unsoldButton: {
    backgroundColor: '#28a745',
  },
  soldButtonText: { color: '#fff', fontWeight: '600' },

  modalOverlay: {
    flex: 1,
    backgroundColor: '#00000080',
    justifyContent: 'flex-start',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  menuContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 10,
  },
  menuItem: {
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  menuText: { fontSize: 16, color: '#333' },

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
    justifyContent: 'center',
    alignItems: 'center',
  },
  navLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 2,
  },
});
