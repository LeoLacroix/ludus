import React, { useState, useEffect } from 'react'
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  TextInput,
  Alert,
  SafeAreaView,
  Image,
  StatusBar,
  Dimensions
} from 'react-native'
import * as Location from 'expo-location'

const { width, height } = Dimensions.get('window')

// Sample board games data
const BOARD_GAMES = [
  { id: 1, name: 'Settlers of Catan', image: 'catan-image.jpg', color: '#FF6B6B' },
  { id: 2, name: 'Ticket to Ride', image: '🚂', color: '#4ECDC4' },
  { id: 3, name: 'Azul', image: '🔷', color: '#45B7D1' },
  { id: 4, name: 'Splendor', image: '💎', color: '#96CEB4' },
  { id: 5, name: 'King of Tokyo', image: '🦖', color: '#FECA57' },
  { id: 6, name: 'Wingspan', image: '🦅', color: '#FF9FF3' },
  { id: 7, name: 'Pandemic', image: '🌍', color: '#54A0FF' },
  { id: 8, name: 'Monopoly', image: '🏠', color: '#5F27CD' },
  { id: 9, name: 'Scrabble', image: '📝', color: '#00D2D3' },
  { id: 10, name: 'Chess', image: '♟️', color: '#FF6348' },
  { id: 11, name: 'Risk', image: '⚔️', color: '#C44569' },
  { id: 12, name: 'Clue', image: '🔍', color: '#F8B500' }
]

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('welcome')
  const [userInfo, setUserInfo] = useState({
    email: '',
    password: '',
    name: '',
    age: '',
    favoriteGames: []
  })
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('home')

  // Welcome Screen
  const WelcomeScreen = () => (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2196F3" />
      <View style={styles.welcomeContainer}>
        <View style={styles.welcomeContent}>
          <Text style={styles.welcomeTitle}>Welcome to</Text>
          <Text style={styles.ludusTitle}>Ludus!</Text>
          <Text style={styles.welcomeSubtitle}>
            Connect with board game enthusiasts near you
          </Text>
          <View style={styles.gameIconsContainer}>
            <Text style={styles.gameIcon}>🎲</Text>
            <Text style={styles.gameIcon}>♟️</Text>
            <Text style={styles.gameIcon}>🃏</Text>
          </View>
        </View>
        
        <TouchableOpacity 
          style={styles.nextButton}
          onPress={() => setCurrentScreen('auth')}
        >
          <Text style={styles.nextButtonText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )

  // Authentication Screen
  const AuthScreen = () => (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
      <View style={styles.screenContainer}>
        <View style={styles.header}>
          <Text style={styles.screenTitle}>Create Account</Text>
          <Text style={styles.screenSubtitle}>Join the Ludus community</Text>
        </View>

        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="Email address"
            value={userInfo.email}
            onChangeText={(text) => setUserInfo({...userInfo, email: text})}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={userInfo.password}
            onChangeText={(text) => setUserInfo({...userInfo, password: text})}
            secureTextEntry
          />
        </View>

        <TouchableOpacity 
          style={[styles.nextButton, !userInfo.email || !userInfo.password ? styles.nextButtonDisabled : null]}
          onPress={() => {
            if (userInfo.email && userInfo.password) {
              setCurrentScreen('profile')
            } else {
              Alert.alert('Error', 'Please fill in all fields')
            }
          }}
          disabled={!userInfo.email || !userInfo.password}
        >
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )

  // Profile Setup Screen
  const ProfileScreen = () => (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
      <View style={styles.screenContainer}>
        <View style={styles.header}>
          <Text style={styles.screenTitle}>Tell us about yourself</Text>
          <Text style={styles.screenSubtitle}>Help others get to know you</Text>
        </View>

        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="Your name"
            value={userInfo.name}
            onChangeText={(text) => setUserInfo({...userInfo, name: text})}
          />
          
          <TextInput
            style={styles.input}
            placeholder="Age"
            value={userInfo.age}
            onChangeText={(text) => setUserInfo({...userInfo, age: text})}
            keyboardType="numeric"
          />
        </View>

        <TouchableOpacity 
          style={[styles.nextButton, !userInfo.name || !userInfo.age ? styles.nextButtonDisabled : null]}
          onPress={() => {
            if (userInfo.name && userInfo.age) {
              setCurrentScreen('games')
            } else {
              Alert.alert('Error', 'Please fill in all fields')
            }
          }}
          disabled={!userInfo.name || !userInfo.age}
        >
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )

  // Game Selection Screen
  const GameSelectionScreen = () => {
    const filteredGames = BOARD_GAMES.filter(game =>
      game.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const toggleGameSelection = (gameId) => {
      const isSelected = userInfo.favoriteGames.includes(gameId)
      const updatedGames = isSelected
        ? userInfo.favoriteGames.filter(id => id !== gameId)
        : [...userInfo.favoriteGames, gameId]
      
      setUserInfo({...userInfo, favoriteGames: updatedGames})
    }

    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
        <View style={styles.screenContainer}>
          <View style={styles.header}>
            <Text style={styles.screenTitle}>Choose your favorite games</Text>
            <Text style={styles.screenSubtitle}>Select games you love to play</Text>
          </View>

          <TextInput
            style={styles.searchInput}
            placeholder="Search games..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />

          <ScrollView style={styles.gamesContainer} showsVerticalScrollIndicator={false}>
            <View style={styles.gamesGrid}>
              {filteredGames.map((game) => {
                const isSelected = userInfo.favoriteGames.includes(game.id)
                return (
                  <TouchableOpacity
                    key={game.id}
                    style={[
                      styles.gameCard,
                      { backgroundColor: game.color },
                      isSelected && styles.gameCardSelected
                    ]}
                    onPress={() => toggleGameSelection(game.id)}
                  >
                    <Text style={styles.gameEmoji}>{game.image}</Text>
                    <Text style={styles.gameName}>{game.name}</Text>
                    {isSelected && (
                      <View style={styles.selectedIndicator}>
                        <Text style={styles.checkmark}>✓</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                )
              })}
            </View>
          </ScrollView>

          <TouchableOpacity 
            style={styles.nextButton}
            onPress={() => setCurrentScreen('home')}
          >
            <Text style={styles.nextButtonText}>
              {userInfo.favoriteGames.length > 0 ? `Continue (${userInfo.favoriteGames.length} selected)` : 'Skip for now'}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    )
  }

  // Home Screen with Tabs
  const HomeScreen = () => (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
      <View style={styles.homeContainer}>
        {/* Header */}
        <View style={styles.homeHeader}>
          <Text style={styles.homeTitle}>Welcome back, {userInfo.name}!</Text>
          <Text style={styles.homeSubtitle}>Ready to play some games?</Text>
        </View>

        {/* Main Content Area */}
        <View style={styles.homeContent}>
          {activeTab === 'home' && (
            <View style={styles.tabContent}>
              <Text style={styles.placeholderText}>🎲 Home Tab</Text>
              <Text style={styles.placeholderSubtext}>Game meetups will appear here</Text>
            </View>
          )}

          {activeTab === 'discover' && (
            <View style={styles.tabContent}>
              <Text style={styles.placeholderText}>🔍 Discover Tab</Text>
              <Text style={styles.placeholderSubtext}>Find new games and players</Text>
            </View>
          )}

          {activeTab === 'create' && (
            <View style={styles.tabContent}>
              <Text style={styles.placeholderText}>➕ Create Tab</Text>
              <Text style={styles.placeholderSubtext}>Host a game meetup</Text>
            </View>
          )}

          {activeTab === 'messages' && (
            <View style={styles.tabContent}>
              <Text style={styles.placeholderText}>💬 Messages Tab</Text>
              <Text style={styles.placeholderSubtext}>Chat with other players</Text>
            </View>
          )}

          {activeTab === 'profile' && (
            <View style={styles.tabContent}>
              <Text style={styles.placeholderText}>👤 Profile Tab</Text>
              <Text style={styles.placeholderSubtext}>Manage your account</Text>
              <Text style={styles.userInfo}>Email: {userInfo.email}</Text>
              <Text style={styles.userInfo}>Age: {userInfo.age}</Text>
              <Text style={styles.userInfo}>Favorite Games: {userInfo.favoriteGames.length}</Text>
            </View>
          )}
        </View>

        {/* Bottom Tabs */}
        <View style={styles.tabBar}>
          {[
            { key: 'home', icon: '🏠', label: 'Home' },
            { key: 'discover', icon: '🔍', label: 'Discover' },
            { key: 'create', icon: '➕', label: 'Create' },
            { key: 'messages', icon: '💬', label: 'Messages' },
            { key: 'profile', icon: '👤', label: 'Profile' }
          ].map((tab) => (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tab, activeTab === tab.key && styles.activeTab]}
              onPress={() => setActiveTab(tab.key)}
            >
              <Text style={[styles.tabIcon, activeTab === tab.key && styles.activeTabIcon]}>
                {tab.icon}
              </Text>
              <Text style={[styles.tabLabel, activeTab === tab.key && styles.activeTabLabel]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </SafeAreaView>
  )

  // Main render logic
  switch (currentScreen) {
    case 'welcome':
      return <WelcomeScreen />
    case 'auth':
      return <AuthScreen />
    case 'profile':
      return <ProfileScreen />
    case 'games':
      return <GameSelectionScreen />
    case 'home':
      return <HomeScreen />
    default:
      return <WelcomeScreen />
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  
  // Welcome Screen Styles
  welcomeContainer: {
    flex: 1,
    backgroundColor: '#2196F3',
    justifyContent: 'space-between',
    padding: 20,
  },
  welcomeContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeTitle: {
    fontSize: 32,
    color: 'white',
    marginBottom: 10,
  },
  ludusTitle: {
    fontSize: 48,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
  },
  welcomeSubtitle: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
    opacity: 0.9,
    marginBottom: 40,
  },
  gameIconsContainer: {
    flexDirection: 'row',
    gap: 20,
  },
  gameIcon: {
    fontSize: 40,
  },
  
  // General Screen Styles
  screenContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 40,
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  screenSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  
  // Form Styles
  formContainer: {
    flex: 1,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    marginBottom: 20,
    borderRadius: 10,
    fontSize: 16,
    backgroundColor: 'white',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    marginBottom: 20,
    borderRadius: 10,
    fontSize: 16,
    backgroundColor: 'white',
    marginHorizontal: 0,
  },
  
  // Button Styles
  nextButton: {
    backgroundColor: '#2196F3',
    padding: 18,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  nextButtonDisabled: {
    backgroundColor: '#ccc',
  },
  nextButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  
  // Game Selection Styles
  gamesContainer: {
    flex: 1,
  },
  gamesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
    paddingBottom: 20,
  },
  gameCard: {
    width: (width - 60) / 2,
    aspectRatio: 1,
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  gameCardSelected: {
    borderWidth: 3,
    borderColor: '#2196F3',
  },
  gameEmoji: {
    fontSize: 40,
    marginBottom: 10,
  },
  gameName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  selectedIndicator: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#2196F3',
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  
  // Home Screen Styles
  homeContainer: {
    flex: 1,
  },
  homeHeader: {
    backgroundColor: 'white',
    padding: 20,
    alignItems: 'center',
  },
  homeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  homeSubtitle: {
    fontSize: 16,
    color: '#666',
  },
  homeContent: {
    flex: 1,
    padding: 20,
  },
  
  // Tab Styles
  tabContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    fontSize: 32,
    marginBottom: 10,
  },
  placeholderSubtext: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  userInfo: {
    fontSize: 14,
    color: '#333',
    marginTop: 10,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingTop: 10,
    paddingBottom: 25,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  activeTab: {
    // No additional styling needed, handled by text color
  },
  tabIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  activeTabIcon: {
    // Emoji doesn't change color
  },
  tabLabel: {
    fontSize: 12,
    color: '#666',
  },
  activeTabLabel: {
    color: '#2196F3',
    fontWeight: 'bold',
  },
})