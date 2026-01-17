import { createSlice } from '@reduxjs/toolkit';
// import type { PayloadAction } from '@reduxjs/toolkit';

export interface AyudantiaState {
    id: string
    curso_id: string
    capitulo_id: string
    numero: number;
    enunciado: string;
    solucion: string;
    video: string;
    ejercicio: { enunciado: string; alternativas: [{ letra: string; texto: string; correcta: boolean }] };
}

export interface AyudantiasState {
    ayudantia: AyudantiaState
    ayudantias: Array<AyudantiaState>
    isLoading: boolean
}

const initialState: AyudantiasState = {
    ayudantias: [{ id: "", curso_id: "", capitulo_id: "", numero: 0, enunciado: '', solucion: '', video: '', ejercicio: { enunciado: '', alternativas: [{ letra: '', texto: '', correcta: false }] } }],
    ayudantia: { id: "", curso_id: "", capitulo_id: "", numero: 0, enunciado: '', solucion: '', video: '', ejercicio: { enunciado: '', alternativas: [{ letra: '', texto: '', correcta: false }] } },
    isLoading: true
}

export const ayudantiaSlice = createSlice({
    name: 'ayudantias',
    initialState,
    reducers: {
        setAyudantia: (state, action) => {
            state.ayudantia = action.payload
        },
        setAyudantias: (state, action) => {
            state.ayudantias = action.payload
        },
        startLoadingAyudantia: (state) => {
            state.isLoading = true;
        },
        endLoadingAyudantia: (state) => {
            state.isLoading = false;
        },
    },
})

// Action creators are generated for each case reducer function
export const {
    setAyudantia,
    setAyudantias,
    startLoadingAyudantia,
    endLoadingAyudantia
} = ayudantiaSlice.actions

