import { createSlice } from '@reduxjs/toolkit';
// import type { PayloadAction } from '@reduxjs/toolkit';

export interface TemaState {
    id: string
    curso_id: string
    capitulo_id: string
    clase_id: string
    nombre: string
    numero: number
    activo: boolean
    diapositiva: {
        id: string;
        autor: string;
        diapositivas: [{ pagina: number; contenido: string }];
        activo: boolean;
    },
    videos: {
        id: string;
        url: string;
        activo: boolean;
    },
    preguntas: {
        id: string;
        numero: number;
        enunciado: string;
        solucion: string;
        video: string;
        alternativas: [{ letra: string; texto: string; correcta: boolean }];
        activo: boolean;
    }
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
        videos: {
            id: '',
            url: '',
            activo: false,
        },
        preguntas: {
            id: '',
            numero: 0,
            enunciado: '',
            solucion: '',
            video: '',
            alternativas: [{ letra: '', texto: '', correcta: false }],
            activo: false,
        }
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
        videos: {
            id: '',
            url: '',
            activo: false,
        },
        preguntas: {
            id: '',
            numero: 0,
            enunciado: '',
            solucion: '',
            video: '',
            alternativas: [{ letra: '', texto: '', correcta: false }],
            activo: false,
        }
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

