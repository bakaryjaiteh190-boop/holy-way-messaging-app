import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  ScrollView,
  Alert,
} from 'react-native';

type Joke = {
  id: string;
  setup: string;
  delivery: string;
  type: 'single' | 'twopart';
  category: string;
  rating?: number;
};

export default function JokeGeneratorScreen() {
  const [joke, setJoke] = useState<Joke | null>(null);
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState<Joke[]>([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [jokesHistory, setJokesHistory] = useState<Joke[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('Any');

  const categories = ['Any', 'General', 'Programming', 'Knock-knock', 'Dark', 'Spooky'];

  useEffect(() => {
    fetchJoke();
  }, []);

  async function fetchJoke() {
    setLoading(true);
    try {
      let url = 'https://v2.jokeapi.dev/joke/';

      // Build category filter
      if (selectedCategory === 'Any') {
        url += 'Any';
      } else if (selectedCategory === 'Knock-knock') {
        url += 'Knock-Knock';
      } else {
        url += selectedCategory;
      }

      // Add query parameters
      url += '?format=json&safe-mode';

      const response = await fetch(url);
      const data = await response.json();

      if (data.error) {
        Alert.alert('Error', 'Failed to fetch joke. Please try again.');
        return;
      }

      const jokeData: Joke = {
        id: `${Date.now()}-${Math.random()}`,
        setup: data.setup || data.joke || '',
        delivery: data.delivery || '',
        type: data.type,
        category: data.category,
        rating: data.rating,
      };

      setJoke(jokeData);
      setJokesHistory((prev) => [jokeData, ...prev].slice(0, 20));
    } catch (error) {
      console.error('Error fetching joke:', error);
      Alert.alert('Error', 'Failed to fetch joke. Please check your internet connection.');
    } finally {
      setLoading(false);
    }
  }

  function toggleFavorite(jokeToFav: Joke) {
    setFavorites((prev) => {
      const isFavorite = prev.some((fav) => fav.id === jokeToFav.id);
      if (isFavorite) {
        return prev.filter((fav) => fav.id !== jokeToFav.id);
      } else {
        return [jokeToFav, ...prev];
      }
    });
  }

  function isFavorite(jokeToCheck: Joke): boolean {
    return favorites.some((fav) => fav.id === jokeToCheck.id);
  }

  function shareJoke() {
    if (!joke) return;
    const jokeText =
      joke.type === 'twopart'
        ? `${joke.setup}\n\n${joke.delivery}`
        : joke.setup;
    Alert.alert('Share Joke', `Here's the joke to share:\n\n${jokeText}`);
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>😂 Joke Generator</Text>
        <Text style={styles.subtitle}>Get random jokes from JokeAPI</Text>
      </View>

      {!showFavorites ? (
        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Category Selector */}
          <View style={styles.categoryContainer}>
            <Text style={styles.categoryLabel}>Category:</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoryScroll}
            >
              {categories.map((cat) => (
                <Pressable
                  key={cat}
                  style={[
                    styles.categoryButton,
                    selectedCategory === cat && styles.categoryButtonActive,
                  ]}
                  onPress={() => setSelectedCategory(cat)}
                >
                  <Text
                    style={[
                      styles.categoryButtonText,
                      selectedCategory === cat && styles.categoryButtonTextActive,
                    ]}
                  >
                    {cat}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>

          {/* Joke Display */}
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#111" />
              <Text style={styles.loadingText}>Fetching a funny joke...</Text>
            </View>
          ) : joke ? (
            <View style={styles.jokeCard}>
              <View style={styles.jokeHeader}>
                <Text style={styles.categoryTag}>{joke.category}</Text>
                <Pressable onPress={() => toggleFavorite(joke)}>
                  <Text style={styles.favoriteIcon}>
                    {isFavorite(joke) ? '❤️' : '🤍'}
                  </Text>
                </Pressable>
              </View>

              <View style={styles.jokeContent}>
                <Text style={styles.setupText}>{joke.setup}</Text>
                {joke.type === 'twopart' && joke.delivery && (
                  <>
                    <View style={styles.divider} />
                    <Text style={styles.deliveryText}>{joke.delivery}</Text>
                  </>
                )}
              </View>

              <View style={styles.jokeFooter}>
                <Pressable
                  style={styles.shareButton}
                  onPress={shareJoke}
                >
                  <Text style={styles.shareButtonText}>📤 Share</Text>
                </Pressable>
              </View>
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>🤔</Text>
              <Text style={styles.emptyText}>No joke loaded</Text>
              <Text style={styles.emptySubtext}>Tap the button below to get started!</Text>
            </View>
          )}

          {/* Recent Jokes */}
          {jokesHistory.length > 1 && (
            <View style={styles.historySection}>
              <Text style={styles.historyTitle}>Recent Jokes</Text>
              {jokesHistory.slice(1, 4).map((historyJoke) => (
                <Pressable
                  key={historyJoke.id}
                  style={styles.historyItem}
                  onPress={() => setJoke(historyJoke)}
                >
                  <Text style={styles.historyItemText} numberOfLines={2}>
                    {historyJoke.type === 'twopart'
                      ? historyJoke.setup
                      : historyJoke.setup}
                  </Text>
                  <Text style={styles.historyItemArrow}>→</Text>
                </Pressable>
              ))}
            </View>
          )}
        </ScrollView>
      ) : (
        /* Favorites View */
        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {favorites.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>🤍</Text>
              <Text style={styles.emptyText}>No favorites yet</Text>
              <Text style={styles.emptySubtext}>Add jokes to your favorites!</Text>
            </View>
          ) : (
            <View>
              <Text style={styles.favoritesCount}>
                {favorites.length} favorite{favorites.length !== 1 ? 's' : ''}
              </Text>
              {favorites.map((favJoke) => (
                <View key={favJoke.id} style={styles.jokeCard}>
                  <View style={styles.jokeHeader}>
                    <Text style={styles.categoryTag}>{favJoke.category}</Text>
                    <Pressable onPress={() => toggleFavorite(favJoke)}>
                      <Text style={styles.favoriteIcon}>❤️</Text>
                    </Pressable>
                  </View>

                  <View style={styles.jokeContent}>
                    <Text style={styles.setupText}>{favJoke.setup}</Text>
                    {favJoke.type === 'twopart' && favJoke.delivery && (
                      <>
                        <View style={styles.divider} />
                        <Text style={styles.deliveryText}>{favJoke.delivery}</Text>
                      </>
                    )}
                  </View>
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      )}

      {/* Bottom Controls */}
      <View style={styles.footer}>
        <Pressable
          style={styles.favoritesToggle}
          onPress={() => setShowFavorites(!showFavorites)}
        >
          <Text style={styles.favoritesToggleText}>
            {showFavorites ? '← Back' : `❤️ Favorites (${favorites.length})`}
          </Text>
        </Pressable>

        {!showFavorites && (
          <Pressable
            style={[styles.getJokeButton, loading && styles.getJokeButtonDisabled]}
            onPress={fetchJoke}
            disabled={loading}
          >
            <Text style={styles.getJokeButtonText}>
              {loading ? '⏳ Loading...' : '😂 Get Another Joke'}
            </Text>
          </Pressable>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  contentContainer: {
    paddingVertical: 12,
    paddingBottom: 20,
  },
  categoryContainer: {
    marginBottom: 16,
  },
  categoryLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111',
    marginBottom: 8,
  },
  categoryScroll: {
    gap: 8,
    paddingRight: 20,
  },
  categoryButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  categoryButtonActive: {
    backgroundColor: '#111',
    borderColor: '#111',
  },
  categoryButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
  },
  categoryButtonTextActive: {
    color: '#fff',
  },
  loadingContainer: {
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#666',
  },
  jokeCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e8e8e8',
  },
  jokeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  categoryTag: {
    fontSize: 11,
    fontWeight: '700',
    color: '#fff',
    backgroundColor: '#111',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  favoriteIcon: {
    fontSize: 24,
  },
  jokeContent: {
    marginBottom: 16,
  },
  setupText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111',
    lineHeight: 24,
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 12,
  },
  deliveryText: {
    fontSize: 16,
    color: '#555',
    fontStyle: 'italic',
    lineHeight: 24,
  },
  jokeFooter: {
    alignItems: 'flex-end',
  },
  shareButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#111',
  },
  shareButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13,
  },
  historySection: {
    marginTop: 24,
  },
  historyTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111',
    marginBottom: 12,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    marginBottom: 8,
  },
  historyItemText: {
    flex: 1,
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
  },
  historyItemArrow: {
    fontSize: 18,
    color: '#999',
    marginLeft: 12,
  },
  emptyState: {
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111',
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
  },
  favoritesCount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 12,
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#e8e8e8',
    gap: 10,
  },
  favoritesToggle: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
  },
  favoritesToggleText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111',
  },
  getJokeButton: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: '#111',
    alignItems: 'center',
  },
  getJokeButtonDisabled: {
    opacity: 0.6,
  },
  getJokeButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
  },
});
