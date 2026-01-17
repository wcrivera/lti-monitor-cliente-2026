import { fetchConToken } from "../../../helpers/fetch";
import { AppDispatch } from "../../store";

import {
  endLoadingEjercicio,
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
