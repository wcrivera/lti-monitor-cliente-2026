import { createSlice } from '@reduxjs/toolkit';
// import type { PayloadAction } from '@reduxjs/toolkit';

export interface PreguntaState {
    id: string;
    numero: number;
    enunciado: string;
    solucion: string;
    video: string;
    alternativas: Array<{ letra: string; texto: string; correcta: boolean }>;
    score: null | number;
    activo: boolean;
}

export interface PreguntasState {
    pregunta: PreguntaState
    preguntas: Array<PreguntaState>
    isLoading: boolean
}

const initialState: PreguntasState = {
    pregunta: {
        id: '',
        numero: 0,
        enunciado: '',
        solucion: '',
        video: '',
        alternativas: [{ letra: 'A', texto: '', correcta: false }, { letra: 'B', texto: '', correcta: false }, { letra: 'C', texto: '', correcta: false }, { letra: 'D', texto: '', correcta: false }],
        score: null,
        activo: false
    },
    preguntas: [{
        id: '',
        numero: 0,
        enunciado: '',
        solucion: '',
        video: '',
        alternativas: [{ letra: 'A', texto: '', correcta: false }, { letra: 'B', texto: '', correcta: false }, { letra: 'C', texto: '', correcta: false }, { letra: 'D', texto: '', correcta: false }],
        score: null,
        activo: false
    }],
    isLoading: true
}

export const preguntaSlice = createSlice({
    name: 'preguntas',
    initialState,
    reducers: {
        setPregunta: (state, action) => {
            state.pregunta = action.payload
        },
        setPreguntas: (state, action) => {
            state.preguntas = action.payload
        },
        startLoadingPregunta: (state) => {
            state.isLoading = true;
        },
        endLoadingPregunta: (state) => {
            state.isLoading = false;
        },
    },
})

// Action creators are generated for each case reducer function
export const {
    setPregunta,
    setPreguntas,
    startLoadingPregunta,
    endLoadingPregunta
} = preguntaSlice.actions

