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
            !item.sold // Exclude sold items
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
  },
  image: {
    width: '100%',
    height: 350, // Bigger image view
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
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
