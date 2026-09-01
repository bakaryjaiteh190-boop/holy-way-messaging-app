import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  FlatList,
  Alert,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Todo = {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
  dueDate?: string;
  priority: 'low' | 'medium' | 'high';
};

type FilterType = 'all' | 'active' | 'completed';

const STORAGE_KEY = '@holy_way_todos';

export default function TodoScreen() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoText, setNewTodoText] = useState('');
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>('all');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [showCompleted, setShowCompleted] = useState(true);

  useEffect(() => {
    loadTodos();
  }, []);

  async function loadTodos() {
    try {
      setLoading(true);
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsedTodos = JSON.parse(stored);
        setTodos(parsedTodos);
      }
    } catch (error) {
      console.error('Error loading todos:', error);
      Alert.alert('Error', 'Failed to load todos');
    } finally {
      setLoading(false);
    }
  }

  async function saveTodos(updatedTodos: Todo[]) {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTodos));
      setTodos(updatedTodos);
    } catch (error) {
      console.error('Error saving todos:', error);
      Alert.alert('Error', 'Failed to save todos');
    }
  }

  function addTodo() {
    if (!newTodoText.trim()) {
      Alert.alert('Error', 'Please enter a todo');
      return;
    }

    const newTodo: Todo = {
      id: `${Date.now()}-${Math.random()}`,
      text: newTodoText.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
      priority,
    };

    const updatedTodos = [newTodo, ...todos];
    saveTodos(updatedTodos);
    setNewTodoText('');
    setPriority('medium');
  }

  function toggleTodo(id: string) {
    const updatedTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    saveTodos(updatedTodos);
  }

  function deleteTodo(id: string) {
    Alert.alert('Delete Todo', 'Are you sure you want to delete this todo?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          const updatedTodos = todos.filter((todo) => todo.id !== id);
          saveTodos(updatedTodos);
        },
      },
    ]);
  }

  function editTodo(id: string, newText: string) {
    if (!newText.trim()) {
      Alert.alert('Error', 'Todo text cannot be empty');
      return;
    }
    const updatedTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, text: newText.trim() } : todo
    );
    saveTodos(updatedTodos);
  }

  function clearCompleted() {
    Alert.alert(
      'Clear Completed',
      'Are you sure you want to delete all completed todos?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            const updatedTodos = todos.filter((todo) => !todo.completed);
            saveTodos(updatedTodos);
          },
        },
      ]
    );
  }

  function getFilteredTodos() {
    let filtered = todos;

    if (filter === 'active') {
      filtered = todos.filter((todo) => !todo.completed);
    } else if (filter === 'completed') {
      filtered = todos.filter((todo) => todo.completed);
    }

    return filtered;
  }

  function getPriorityColor(priority: string) {
    switch (priority) {
      case 'high':
        return '#dc2626';
      case 'medium':
        return '#f59e0b';
      case 'low':
        return '#10b981';
      default:
        return '#6b7280';
    }
  }

  const filteredTodos = getFilteredTodos();
  const completedCount = todos.filter((t) => t.completed).length;
  const activeCount = todos.filter((t) => !t.completed).length;

  function renderTodo({ item }: { item: Todo }) {
    return (
      <View style={styles.todoItem}>
        <Pressable
          style={styles.checkbox}
          onPress={() => toggleTodo(item.id)}
        >
          <Text style={styles.checkboxText}>
            {item.completed ? '✓' : ''}
          </Text>
        </Pressable>

        <View style={styles.todoContent}>
          <View style={styles.todoTextContainer}>
            <Text
              style={[
                styles.todoText,
                item.completed && styles.todoTextCompleted,
              ]}
            >
              {item.text}
            </Text>
            {item.priority && (
              <View
                style={[
                  styles.priorityBadge,
                  { backgroundColor: getPriorityColor(item.priority) },
                ]}
              >
                <Text style={styles.priorityText}>{item.priority}</Text>
              </View>
            )}
          </View>
          <Text style={styles.todoDate}>
            {new Date(item.createdAt).toLocaleDateString()}
          </Text>
        </View>

        <Pressable
          style={styles.deleteButton}
          onPress={() => deleteTodo(item.id)}
        >
          <Text style={styles.deleteIcon}>✕</Text>
        </Pressable>
      </View>
    );
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <ActivityIndicator size="large" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>✓ Todo List</Text>
        <Text style={styles.subtitle}>Stay organized and productive</Text>
      </View>

      {/* Stats */}
      <View style={styles.stats}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{todos.length}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: '#10b981' }]}>
            {activeCount}
          </Text>
          <Text style={styles.statLabel}>Active</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: '#6b7280' }]}>
            {completedCount}
          </Text>
          <Text style={styles.statLabel}>Done</Text>
        </View>
      </View>

      {/* Input Section */}
      <View style={styles.inputSection}>
        <TextInput
          style={styles.input}
          placeholder="Add a new todo..."
          placeholderTextColor="#999"
          value={newTodoText}
          onChangeText={setNewTodoText}
          onSubmitEditing={addTodo}
        />
        <View style={styles.prioritySelector}>
          {(['low', 'medium', 'high'] as const).map((p) => (
            <Pressable
              key={p}
              style={[
                styles.priorityButton,
                priority === p && styles.priorityButtonActive,
                { borderColor: getPriorityColor(p) },
              ]}
              onPress={() => setPriority(p)}
            >
              <Text
                style={[
                  styles.priorityButtonText,
                  priority === p && styles.priorityButtonTextActive,
                ]}
              >
                {p.charAt(0).toUpperCase()}
              </Text>
            </Pressable>
          ))}
        </View>
        <Pressable style={styles.addButton} onPress={addTodo}>
          <Text style={styles.addButtonText}>+</Text>
        </Pressable>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterTabs}>
        {(['all', 'active', 'completed'] as const).map((f) => (
          <Pressable
            key={f}
            style={[
              styles.filterTab,
              filter === f && styles.filterTabActive,
            ]}
            onPress={() => setFilter(f)}
          >
            <Text
              style={[
                styles.filterTabText,
                filter === f && styles.filterTabTextActive,
              ]}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Todos List */}
      {filteredTodos.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>🗑️</Text>
          <Text style={styles.emptyText}>
            {filter === 'completed'
              ? 'No completed todos yet'
              : filter === 'active'
              ? 'No active todos'
              : 'No todos yet'}
          </Text>
          <Text style={styles.emptySubtext}>
            {todos.length === 0
              ? 'Add your first todo to get started!'
              : 'Great job staying organized!'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredTodos}
          keyExtractor={(item) => item.id}
          renderItem={renderTodo}
          contentContainerStyle={styles.todosList}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Clear Completed Button */}
      {completedCount > 0 && (
        <View style={styles.footer}>
          <Pressable
            style={styles.clearButton}
            onPress={clearCompleted}
          >
            <Text style={styles.clearButtonText}>🗑️ Clear Completed</Text>
          </Pressable>
        </View>
      )}
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
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#f9f9f9',
    marginHorizontal: 20,
    borderRadius: 12,
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111',
  },
  statLabel: {
    fontSize: 11,
    color: '#999',
    marginTop: 4,
  },
  inputSection: {
    paddingHorizontal: 20,
    paddingBottom: 12,
    gap: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#111',
    backgroundColor: '#f9f9f9',
  },
  prioritySelector: {
    flexDirection: 'row',
    gap: 8,
  },
  priorityButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1.5,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  priorityButtonActive: {
    backgroundColor: '#111',
  },
  priorityButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  priorityButtonTextActive: {
    color: '#fff',
  },
  addButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#111',
    borderRadius: 10,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
  },
  filterTabs: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 12,
    gap: 8,
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
  },
  filterTabActive: {
    backgroundColor: '#111',
  },
  filterTabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
  },
  filterTabTextActive: {
    color: '#fff',
  },
  todosList: {
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  todoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 8,
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e8e8e8',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    backgroundColor: '#fff',
  },
  checkboxText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#10b981',
  },
  todoContent: {
    flex: 1,
  },
  todoTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 8,
  },
  todoText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: '#111',
  },
  todoTextCompleted: {
    color: '#999',
    textDecorationLine: 'line-through',
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#fff',
    textTransform: 'uppercase',
  },
  todoDate: {
    fontSize: 11,
    color: '#999',
  },
  deleteButton: {
    width: 28,
    height: 28,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  deleteIcon: {
    fontSize: 18,
    color: '#dc2626',
    fontWeight: '700',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
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
    textAlign: 'center',
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#e8e8e8',
  },
  clearButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#fee2e2',
    borderRadius: 10,
    alignItems: 'center',
  },
  clearButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#dc2626',
  },
});
