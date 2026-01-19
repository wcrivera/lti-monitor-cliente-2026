import { createSlice } from '@reduxjs/toolkit';
// import type { PayloadAction } from '@reduxjs/toolkit';


export interface DiapositivaState {
    id: string;
    autor: string;
    diapositivas: Array<{ pagina: number; contenido: string }>;
    activo: boolean;
}

export interface VideoState {
    id: string;
    url: string;
    activo: boolean;
}

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

export interface TemaState {
    id: string
    curso_id: string
    capitulo_id: string
    clase_id: string
    nombre: string
    numero: number
    activo: boolean
    diapositiva: DiapositivaState,
    video: VideoState,
    preguntas: Array<PreguntaState>
}

export interface TemasState {
    temas: Array<TemaState>
    tema: TemaState
    isLoading: boolean
}

const initialState: TemasState = {
    temas: [{
        id: '',
        curso_id: '',
        capitulo_id: '',
        clase_id: '',
        nombre: '',
        numero: 0,
        activo: false,
        diapositiva: {
            id: '',
            autor: '',
            diapositivas: [{ pagina: 0, contenido: '' }],
            activo: false,
        },
        video: {
            id: '',
            url: '',
            activo: false,
        },
        preguntas: [{
            id: '',
            numero: 0,
            enunciado: '',
            solucion: '',
            video: '',
            alternativas: [{ letra: '', texto: '', correcta: false }],
            activo: false,
            score: null
        }]
    },],
    tema: {
        id: '',
        curso_id: '',
        capitulo_id: '',
        clase_id: '',
        nombre: '',
        numero: 0,
        activo: false,
        diapositiva: {
            id: '',
            autor: '',
            diapositivas: [{ pagina: 0, contenido: '' }],
            activo: false,
        },
        video: {
            id: '',
            url: '',
            activo: false,
        },
        preguntas: [{
            id: '',
            numero: 0,
            enunciado: '',
            solucion: '',
            video: '',
            alternativas: [{ letra: '', texto: '', correcta: false }],
            activo: false,
            score: null
        }]
    },
    isLoading: true
}

export const temaSlice = createSlice({
    name: 'temas',
    initialState,
    reducers: {
        setTema: (state, action) => {
            state.tema = action.payload
        },
        setTemas: (state, action) => {
            state.temas = action.payload
        },
        startLoadingTema: (state) => {
            state.isLoading = true;
        },
        endLoadingTema: (state) => {
            state.isLoading = false;
        },
    },
})

// Action creators are generated for each case reducer function
export const {
    setTema,
    setTemas,
    startLoadingTema,
    endLoadingTema
} = temaSlice.actions

