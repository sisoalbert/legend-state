export interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

export interface TodoStore {
  todos: Todo[];
  newTodoText: string;
}

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
import { observable, computed } from "@legendapp/state";
import { observer, useObservable } from "@legendapp/state/react";
import Icon from "@expo/vector-icons/MaterialIcons";

const todosStore = observable<TodoStore>({
  todos: [],
  newTodoText: "",
});

const completedCount = computed(
  () => todosStore.todos.get().filter((todo) => todo.completed).length
);

const TodoItem: React.FC<{ todo: Todo }> = observer(({ todo }) => (
  <View style={styles.todoItem}>
    <TouchableOpacity
      onPress={() => {
        // Use Legend-State's set method to update the completed status
        todosStore.todos.set((todos) =>
          todos.map((t) =>
            t.id === todo.id ? { ...t, completed: !t.completed } : t
          )
        );
      }}
    >
      <Icon
        name={todo.completed ? "check-box" : "check-box-outline-blank"}
        size={24}
        color={todo.completed ? "#4CAF50" : "#757575"}
      />
    </TouchableOpacity>
    <Text style={[styles.todoText, todo.completed && styles.completedTodo]}>
      {todo.text}
    </Text>
    <TouchableOpacity
      onPress={() => {
        todosStore.todos.set((todos) => todos.filter((t) => t.id !== todo.id));
      }}
    >
      <Icon name="delete" size={24} color="#F44336" />
    </TouchableOpacity>
  </View>
));

const App: React.FC = observer(() => {
  const newTodoText = useObservable("");

  const addTodo = () => {
    if (newTodoText.get().trim()) {
      todosStore.todos.push({
        id: Date.now().toString(),
        text: newTodoText.get(),
        completed: false,
      });
      newTodoText.set("");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Todo App</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newTodoText.get()}
          onChangeText={newTodoText.set}
          placeholder="Enter new todo"
        />
        <TouchableOpacity style={styles.addButton} onPress={addTodo}>
          <Icon name="add" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={todosStore.todos.get()}
        renderItem={({ item }) => <TodoItem todo={item} />}
        keyExtractor={(item) => item.id}
      />
      <Text style={styles.stats}>
        Completed: {completedCount.get()} / {todosStore.todos.get().length}
      </Text>
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
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
    backgroundColor: "#2196F3",
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
    borderBottomColor: "#ddd",
  },
  todoText: {
    flex: 1,
    marginLeft: 10,
  },
  completedTodo: {
    textDecorationLine: "line-through",
    color: "#888",
  },
  stats: {
    marginTop: 20,
    textAlign: "center",
  },
});

export default App;
