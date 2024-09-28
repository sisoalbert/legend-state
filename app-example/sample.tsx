// Define the structure of a Todo item and the Todo store
export interface Todo {
  id: string; // Unique identifier for each Todo
  text: string; // The text of the Todo
  completed: boolean; // Whether the Todo is marked as completed or not
}

export interface TodoStore {
  todos: Todo[]; // Array of all Todo items
  newTodoText: string; // Text for creating a new Todo item
}

// App.tsx
import React from "react";
import {
  SafeAreaView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Text,
  View,
} from "react-native";
import { observable, computed } from "@legendapp/state"; // State management
import { observer, useObservable } from "@legendapp/state/react"; // React bindings for state management
import Icon from "@expo/vector-icons/MaterialIcons"; // Icon set from Expo

// Create an observable store to hold todos and new todo text
const todosStore = observable<TodoStore>({
  todos: [], // Initialize with an empty todo list
  newTodoText: "", // Initialize with empty new todo text
});

// Computed value to count how many todos are completed
const completedCount = computed(
  () => todosStore.todos.get().filter((todo) => todo.completed).length
);

// Component for rendering each Todo item
const TodoItem: React.FC<{ todo: Todo }> = observer(({ todo }) => (
  <View style={styles.todoItem}>
    {/* Touchable icon to mark todo as completed/uncompleted */}
    <TouchableOpacity onPress={() => (todo.completed = !todo.completed)}>
      <Icon
        name={todo.completed ? "check-box" : "check-box-outline-blank"} // Switch icon based on completion status
        size={24}
        color={todo.completed ? "#4CAF50" : "#757575"} // Green for completed, grey for not
      />
    </TouchableOpacity>

    {/* Display the todo text, apply strike-through if completed */}
    <Text style={[styles.todoText, todo.completed && styles.completedTodo]}>
      {todo.text}
    </Text>

    {/* Button to delete the todo */}
    <TouchableOpacity
      onPress={() => {
        // Remove the todo from the list by filtering it out
        todosStore.todos.set((todos) => todos.filter((t) => t.id !== todo.id));
      }}
    >
      <Icon name="delete" size={24} color="#F44336" /> {/* Red delete icon */}
    </TouchableOpacity>
  </View>
));

// Main application component
const App: React.FC = observer(() => {
  const newTodoText = useObservable(""); // Observable for handling input text for new todos

  // Function to add a new todo to the list
  const addTodo = () => {
    if (newTodoText.get().trim()) {
      // Check if there's any non-empty text
      todosStore.todos.push({
        id: Date.now().toString(), // Generate a unique id based on current timestamp
        text: newTodoText.get(), // Get the text from the input field
        completed: false, // Initialize the todo as not completed
      });
      newTodoText.set(""); // Clear the input field after adding
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Title of the app */}
      <Text style={styles.title}>Todo App</Text>

      {/* Input field and add button for new todos */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newTodoText.get()} // Bind the input value to the observable state
          onChangeText={newTodoText.set} // Update state when input changes
          placeholder="Enter new todo" // Placeholder text for input
        />
        <TouchableOpacity style={styles.addButton} onPress={addTodo}>
          <Icon name="add" size={24} color="#FFFFFF" /> {/* Add icon */}
        </TouchableOpacity>
      </View>

      {/* List of todos */}
      <FlatList
        data={todosStore.todos.get()} // Get the current list of todos from state
        renderItem={({ item }) => <TodoItem todo={item} />} // Render each todo item
        keyExtractor={(item) => item.id}
        // Use the todo id as the key for efficient rendering
      />

      {/* Display the number of completed todos */}
      <Text style={styles.stats}>
        Completed: {completedCount.get()} / {todosStore.todos.get().length}{" "}
        {/* Show completed vs total */}
      </Text>
    </SafeAreaView>
  );
});

// Styles for the components
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5", // Light background color
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    marginRight: 10,
    borderRadius: 5,
  },
  addButton: {
    backgroundColor: "#2196F3", // Blue background for the add button
    borderRadius: 5,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  todoItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd", // Light border between todos
  },
  todoText: {
    flex: 1,
    marginLeft: 10, // Space between icon and text
  },
  completedTodo: {
    textDecorationLine: "line-through", // Strike-through for completed todos
    color: "#888", // Grey color for completed todos
  },
  stats: {
    marginTop: 20,
    textAlign: "center",
  },
});

export default App;
