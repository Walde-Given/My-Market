import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function FilteredItems({ route, navigation }) {
  const { category } = route.params;
  const [uploads, setUploads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAllUploads = async () => {
      try {
        const keys = await AsyncStorage.getAllKeys();
        const uploadKeys = keys.filter((key) => key.startsWith('uploads_'));

        const allUploadsArrays = await AsyncStorage.multiGet(uploadKeys);
        const allUploads = allUploadsArrays.reduce((acc, [, value]) => {
          if (!value) return acc;
          const userUploads = JSON.parse(value);
          return acc.concat(userUploads);
        }, []);

        const filtered = allUploads.filter(
          (item) =>
            item.category &&
            item.category.toUpperCase() === category.toUpperCase() &&
            !item.sold
        );

        setUploads(filtered);
      } catch (e) {
        console.error('Error loading uploads:', e);
      } finally {
        setLoading(false);
      }
    };

    loadAllUploads();
  }, [category]);

  const SellerInfo = ({ userId }) => {
    const [profilePic, setProfilePic] = useState(null);
    const [contact, setContact] = useState('');
    const [name, setName] = useState('');

    useEffect(() => {
      const loadProfile = async () => {
        try {
          const pic = await AsyncStorage.getItem(`profilePic_${userId}`);
          const contactInfo = await AsyncStorage.getItem(`contact_${userId}`);
          const userName = await AsyncStorage.getItem(`userName_${userId}`);
          if (pic) setProfilePic(pic);
          if (contactInfo) setContact(contactInfo);
          if (userName) setName(userName);
        } catch (error) {
          console.error('Failed to load profile info:', error);
        }
      };
      loadProfile();
    }, [userId]);

    return (
      <View style={styles.floatingOverlay}>
        {profilePic ? (
          <Image source={{ uri: profilePic }} style={styles.profilePic} />
        ) : (
          <View style={styles.profilePicPlaceholder}>
            <Text style={{ color: '#888', fontSize: 14 }}>No Pic</Text>
          </View>
        )}
        <Text style={styles.sellerName}>{name || 'No Name'}</Text>
        <Text style={styles.contactText}>{contact || 'No Contact'}</Text>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#00A898" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>

      <Text style={styles.heading}>Items in {category}</Text>

      {uploads.length === 0 ? (
        <View style={styles.center}>
          <Text style={{ fontSize: 18 }}>
            No available items in {category} category.
          </Text>
        </View>
      ) : (
        <FlatList
          data={uploads}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.itemContainer}>
              <SellerInfo userId={item.userId} />

              {item.imageUrl && (
                <Image source={{ uri: item.imageUrl }} style={styles.image} />
              )}
              <Text style={styles.description}>
                {item.description || 'No description'}
              </Text>
              <Text style={styles.price}>Price: N${item.price || '0'}</Text>

              {(item.contactPhone || item.contactEmail || item.phone || item.email) && (
                <View style={{ marginTop: 5 }}>
                  {item.contactPhone && (
                    <Text style={styles.contactText}>Phone: {item.contactPhone}</Text>
                  )}
                  {item.contactEmail && (
                    <Text style={styles.contactText}>Email: {item.contactEmail}</Text>
                  )}
                  {!item.contactPhone && item.phone && (
                    <Text style={styles.contactText}>Phone: {item.phone}</Text>
                  )}
                  {!item.contactEmail && item.email && (
                    <Text style={styles.contactText}>Email: {item.email}</Text>
                  )}
                </View>
              )}
            </View>
          )}
          contentContainerStyle={{ paddingBottom: 30 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    paddingBottom: 100,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#00A898',
    textAlign: 'center',
  },
  backButton: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#00A898',
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  backButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  itemContainer: {
    backgroundColor: '#f5f5f5',
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 350,
    borderRadius: 15,
    marginBottom: 15,
    resizeMode: 'cover',
  },
  description: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  price: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  contactText: {
    fontSize: 14,
    color: '#444',
    textAlign: 'center',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  sellerName: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
    textAlign: 'center',
  },
});
