import { configureStore } from '@reduxjs/toolkit';
import duenosReducer from './features/duenosSlice';

const store = configureStore({
    reducer: {
        duenos: duenosReducer, // Aquí se agregan los reducers
    },
});

export default store;
