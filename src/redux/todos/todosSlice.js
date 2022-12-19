import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios';

export const getTodosAsync = createAsyncThunk('todos/getTodosAync', async () => {
    const res = await fetch('http://localhost:7000/todos');
    return await res.json();
});

export const addTodosAsync = createAsyncThunk('todos/addTodosAync', async (data) => {
    const res = await axios.post('http://localhost:7000/todos', data);
    return  res.data;
});


export const todosSlice = createSlice({
    name: "todos",
    initialState: {
        items: [],
        isLoading: false,
        error: null,
        activeFilter: 'all',
    },
    reducers: {
        toggle: (state, action) => {
            const { id } = action.payload;

            const item = state.items.find((item) => item.id === id);
            item.completed = !item.completed;
        },
        deleteTodo: (state, action) => {
            const id = action.payload;
            const filtered = state.items.filter((item) => item.id !== id);
            state.items = filtered;
        },
        changeActiveFilter: (state, action) => {
            state.activeFilter = action.payload;
        },
        clearCompleted: (state) => {
            const filtered = state.items.filter((item) => item.completed === false);
            state.items = filtered
        },
    },
    extraReducers: {
        //get todos
        [getTodosAsync.pending] : (state, action) => {
            state.isLoading = true;
        },
        [getTodosAsync.fulfilled] : (state, action) => {
            state.items = action.payload;
            state.isLoading = false;
        },
        [getTodosAsync.rejected] : (state, action) => {
            state.isLoading = false;
            state.error = action.error.message;
        },

        //add todo
        [addTodosAsync.fulfilled] : (state, action) => {
            state.items.push(action.payload);
        },
    }
});

export const { toggle, deleteTodo, changeActiveFilter, clearCompleted } = todosSlice.actions;

export const selectTodos = (state) => state.todos.items;

export const selectActiveFilter = (state) => state.todos.activeFilter;

export const selectFilteredTodos = (state) => {
    if (state.todos.activeFilter === 'all') {
        return state.todos.items
    }

    return state.todos.items.filter((todo) => 
        state.todos.activeFilter === 'active' 
        ? todo.completed === false
        : todo.completed === true
    )
}

export default todosSlice.reducer;