import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const URI = 'http://localhost:2000/due/'; // Base URI

// Thunks para operaciones asíncronas
export const fetchDuenos = createAsyncThunk('due/fetchDuenos', async () => {
    const response = await axios.get(`${URI}getAllDue`); // Concatenar la ruta específica
    console.log(response);
    return response.data.info; // Suponiendo que la respuesta tiene un campo 'info'
});

// Crear dueño (manejo de la promesa)
export const createDueno = createAsyncThunk('due/createDueno', async (dueno, { rejectWithValue }) => {
    try {
        const response = await axios.post(`${URI}insDue`, dueno); // POST a 'insDue'
        
        // Revisar si la respuesta del backend contiene el campo necesario
        if (response.data && response.data.success) {
            return response.data; // Responder con la data de éxito
        } else {
            throw new Error('Respuesta inesperada del servidor');
        }
    } catch (error) {
        console.error('Error en la solicitud POST:', error);
        return rejectWithValue(error.message || 'Error desconocido al crear el dueño');
    }
});

export const updateDueno = createAsyncThunk('due/updateDueno', async (dueno) => {
    const response = await axios.put(`${URI}${dueno._id}`, dueno); // PUT con ID
    return response.data;
});

export const deleteDueno = createAsyncThunk('due/deleteDueno', async (id) => {
    await axios.delete(`${URI}${id}`); // DELETE con ID
    return id;
});


// Reducer en el slice
const duenosSlice = createSlice({
    name: 'duenos',
    initialState: {
        duenos: [],
        status: 'idle',
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchDuenos.fulfilled, (state, action) => {
                state.duenos = action.payload;
                state.status = 'succeeded';
            })
            .addCase(createDueno.fulfilled, (state, action) => {
                state.duenos.push(action.payload);  // Aquí agregas el nuevo dueno al estado local
                state.status = 'succeeded';
            })
            .addCase(updateDueno.fulfilled, (state, action) => {
                console.log('Acción cumplida (updateDueno):', action.payload); // Depuración
                const index = state.duenos.findIndex(dueno => dueno._id === action.payload._id);
                if (index !== -1) {
                    state.duenos[index] = action.payload;
                }
            })
            .addCase(deleteDueno.fulfilled, (state, action) => {
                state.duenos = state.duenos.filter(dueno => dueno._id !== action.payload);
            });
    },
});

export default duenosSlice.reducer;
