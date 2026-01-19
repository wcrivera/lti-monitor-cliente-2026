import { fetchConToken } from "../../../helpers/fetch";
import { AppDispatch, RootState } from "../../store";
import { setPregunta } from "../pregunta";
import { setTemas } from "../tema";

import { endLoadingScore, setScore } from "./scoreSlice";


export const crearScore = (ejercicio_id: string, score: number) => {
  return async (dispatch: AppDispatch, getState: () => RootState) => {

    const { temas } = getState().tema;
    const { pregunta } = getState().pregunta;

    try {
      const resp = await fetchConToken(`score/crear`, { ejercicio_id: ejercicio_id, score: score }, "POST");
      const body = await resp.json();

      if (body.ok) {
        const { score } = body;
        const preguntasUpdated = temas.map(t => {
          return {
            ...t,
            preguntas: t.preguntas.map(p => {
              if (p.id === ejercicio_id) {
                return {
                  ...p,
                  score: score.score
                }
              } else {
                return p;
              }
            })
          }
        })
        dispatch(endLoadingScore());
        dispatch(setTemas(preguntasUpdated));
        dispatch(setPregunta({...pregunta, score: score.score }));
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