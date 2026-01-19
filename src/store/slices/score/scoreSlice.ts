import { createSlice } from '@reduxjs/toolkit';
// import type { PayloadAction } from '@reduxjs/toolkit';

export interface ScoreState {
    id: string
    curso_id: string
    ejercicio_id: string
    usuario_id: string
    score: null | number
}

export interface ScoresState {
    score: ScoreState
    scores: Array<ScoreState>
    isLoading: boolean
}

const initialState: ScoresState = {
    score: { id: '', curso_id: '', ejercicio_id: '', usuario_id: '', score: null },
    scores: [{ id: '', curso_id: '', ejercicio_id: '', usuario_id: '', score: null }],
    isLoading: false
}

export const scoreSlice = createSlice({
    name: 'scores',
    initialState,
    reducers: {
        setScore: (state, action) => {
            state.score = action.payload
        },
        setScores: (state, action) => {
            state.scores = action.payload
        },
        startLoadingScore: (state) => {
            state.isLoading = true;
        },
        endLoadingScore: (state) => {
            state.isLoading = false;
        },
    },
})

// Action creators are generated for each case reducer function
export const {
    setScore,
    setScores,
    startLoadingScore,
    endLoadingScore
} = scoreSlice.actions

