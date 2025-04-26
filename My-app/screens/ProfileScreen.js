

import React, { useState } from 'react'; 
import { View, Text, TouchableOpacity, StyleSheet, Image, Modal } from 'react-native';
import { Ionicons, Entypo } from '@expo/vector-icons';

export default function ProfileScreen({ navigation }) {
  const [menuVisible, setMenuVisible] = useState(false);

  return (
    <View style={styles.container}>
      
      {/* Top Bar with Menu Button */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => setMenuVisible(true)}>
          <Entypo name="menu" size={40} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Floating Mini Menu */}
      <Modal
        transparent={true}
        visible={menuVisible}
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableOpacity style={styles.modalOverlay} onPress={() => setMenuVisible(false)}>
          <View style={styles.menuContainer}>
            {/* Edit Profile - Navigate to EditProfileScreen */}
            <TouchableOpacity 
              style={styles.menuItem} 
              onPress={() => {
                navigation.navigate('EditProfile'); // Navigate to Edit Profile screen
                setMenuVisible(false);
              }}
            >
              <Text style={styles.menuText}>Edit Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => {}}>
              <Text style={styles.menuText}>Security</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => {}}>
              <Text style={styles.menuText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Main Content */}
      <View style={styles.profileContent}>
        <Image 
          source={require('../assets/profilepic.jpg')} 
          style={styles.profileImage}
        />
        <Text style={styles.name}>User Name</Text>
        <Text style={styles.email}>user@example.com</Text>

        {/* About / Bio */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.sectionText}>
            Hello! I'm a passionate seller on MY MARKET™️. I love connecting with buyers and sharing my products.
          </Text>
        </View>

        {/* Contact Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Details</Text>
          <Text style={styles.sectionText}>
            Phone: +264 81 234 5678
            {'\n'}
            Email: user@example.com
          </Text>
        </View>

        {/* Uploaded Items */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>My Uploads</Text>
          <Text style={styles.sectionText}>
            • iPhone 13 Pro Max for sale
            {'\n'}
            • Handmade wooden table
            {'\n'}
            • Fresh farm eggs
          </Text>
        </View>
      </View>

      {/* Floating Bottom Navigation */}
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
    paddingTop: 40,  // Added padding to top to avoid cut-off content
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 20,
  },
  profileContent: {
    alignItems: 'center',
    paddingBottom: 100,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#ccc',
    marginBottom: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  email: {
    fontSize: 14,
    color: '#888',
    marginBottom: 20,
  },
  section: {
    width: '90%',
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 10,
    marginTop: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  sectionText: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  menuContainer: {
    position: 'absolute',
    top: 80,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 10,
  },
  menuItem: {
    paddingVertical: 8,
  },
  menuText: {
    fontSize: 16,
    color: '#333',
  },
});
