

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function CategoryScreen({ navigation }) {
  const categories = ['FOOD', 'CLOTHES', 'GADGETS', 'FURNITURE'];

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Select a Category</Text>

      <View style={styles.grid}>
        {categories.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.categoryBox}
            onPress={() => navigation.navigate('FilteredItems', { category: item })}
          >
            <Text style={styles.categoryText}>{item}</Text>
          </TouchableOpacity>
        ))}
      </View>

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
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryBox: {
    backgroundColor: '#00A898',
    width: '47%',
    aspectRatio: 1,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  categoryText: {
    color: '#fff',
    fontSize: 16,
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
