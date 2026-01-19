import { fetchConToken } from "../../../helpers/fetch";
import { AppDispatch, RootState } from "../../store";
import { endLoadingScore, setScore } from "../score";

import {
  endLoadingEjercicio,
  setEjercicio,
  setEjercicios,
} from "./ejercicioSlice";

export const obtenerEjerciciosCapitulo = (capitulo_id: string) => {

  return async (dispatch: AppDispatch) => {

    try {
      const resp = await fetchConToken(`ejercicio/obtener/${capitulo_id}`);
      const body = await resp.json();

      if (body.ok) {
        const { ejercicios } = body;
        dispatch(setEjercicios(ejercicios));
        dispatch(endLoadingEjercicio());
        return { ok: true, msg: body.msg }
      } else {
        return { ok: true, msg: body.msg }
      }
    } catch (error) {
      console.log(error)
      return { ok: false, msg: 'Estamos teniendo problemas, vuelva a intentarlo más tarde' }
    }
  }
}

export const crearScoreEjercicio = (ejercicio_id: string, score: number) => {
  return async (dispatch: AppDispatch, getState: () => RootState) => {

    const { ejercicio, ejercicios } = getState().ejercicio;

    try {
      const resp = await fetchConToken(`score/crear`, { ejercicio_id: ejercicio_id, score: score }, "POST");
      const body = await resp.json();

      if (body.ok) {
        const { score } = body;
        const preguntasUpdated = ejercicios.map(t => {
          return {
            ...t,
            score: t.id === ejercicio.id ? score.score : t.score
          }
        })
        dispatch(endLoadingScore());
        dispatch(setEjercicios(preguntasUpdated));
        dispatch(setEjercicio({ ...ejercicio, score: score.score }));
        dispatch(setScore(score));
        return { ok: true, msg: body.msg };
      } else {
        return { ok: true, msg: body.msg };
      }
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        msg: "Estamos teniendo problemas, vuelva a intentarlo más tarde",
      };
    }
  };
};
