import { createSlice } from "@reduxjs/toolkit";
// import type { PayloadAction } from '@reduxjs/toolkit';

export interface EjercicioState {
  id: string;
  curso_id: string;
  modulo_id: string;
  numero: number;
  multiple: { estado: boolean; columnas: number };
  enunciado: string;
  nota: string;
  activo: boolean;
}

export interface EjerciciosState {
  ejercicio: EjercicioState;
  ejercicios: Array<EjercicioState>;
  isLoading: boolean;
}

const initialState: EjerciciosState = {
  ejercicio: {
    id: "",
    curso_id: "",
    modulo_id: "",
    numero: 0,
    multiple: { estado: false, columnas: 0 },
    enunciado: "",
    nota: "",
    activo: false,
  },
  ejercicios: [{
    id: "",
    curso_id: "",
    modulo_id: "",
    numero: 0,
    multiple: { estado: false, columnas: 0 },
    enunciado: "",
    nota: "",
    activo: false,
  }],
  isLoading: true,
};

export const ejercicioSlice = createSlice({
  name: "ejercicios",
  initialState,
  reducers: {
    setEjercicio: (state, action) => {
      state.ejercicio = action.payload;
    },
    setEjercicios: (state, action) => {
      state.ejercicios = action.payload;
    },
    startLoadingEjercicio: (state) => {
      state.isLoading = true;
    },
    endLoadingEjercicio: (state) => {
      state.isLoading = false;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setEjercicio,
  setEjercicios,
  startLoadingEjercicio,
  endLoadingEjercicio,
} = ejercicioSlice.actions;
