
import { fetchConToken } from "../../../helpers/fetch";
import { AppDispatch, RootState } from "../../store";
import { endLoadingScore, setScore } from "../score";

import { endLoadingAyudantia, setAyudantia, setAyudantias } from "./ayudantiaSlice";

export const obtenerAyudantiasCapitulo = (capitulo_id: string) => {

    return async (dispatch: AppDispatch) => {

        try {
            const resp = await fetchConToken(`ayudantia/obtener/${capitulo_id}`);
            const body = await resp.json();

            if (body.ok) {
                const { ayudantias } = body;
                dispatch(setAyudantias(ayudantias));
                dispatch(endLoadingAyudantia());
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

export const crearScoreAyudantia = (ejercicio_id: string, score: number) => {
    return async (dispatch: AppDispatch, getState: () => RootState) => {

        const { ayudantia, ayudantias } = getState().ayudantia;

        try {
            const resp = await fetchConToken(`score/crear`, { ejercicio_id: ejercicio_id, score: score }, "POST");
            const body = await resp.json();

            if (body.ok) {
                const { score } = body;
                const preguntasUpdated = ayudantias.map(t => {
                    return {
                        ...t,
                        score: t.id === ayudantia.id ? score.score : t.score
                    }
                })
                dispatch(endLoadingScore());
                dispatch(setAyudantias(preguntasUpdated));
                dispatch(setAyudantia({ ...ayudantia, score: score.score }));
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