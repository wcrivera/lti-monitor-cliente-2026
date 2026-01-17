import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { useCanvasResize } from "../../hooks/useCanvasResize";
import { useEffect } from "react";
import Ejercicio from "./Ejercicio";
import { obtenerEjerciciosCapitulo } from "../../store/slices/ejercicio";

const Ejercicios = () => {

    const dispatch = useDispatch<AppDispatch>();

    const { capitulo } = useSelector((state: RootState) => state.capitulo);
    const { ejercicios } = useSelector((state: RootState) => state.ejercicio);

    useCanvasResize([capitulo, ejercicios]);

    useEffect(() => {
        if (capitulo.id) {
            dispatch(obtenerEjerciciosCapitulo(capitulo.id));
        }
    }, [dispatch, capitulo.id])

    return (
        <>
            {
                ejercicios.map((item, index) => {
                    return (
                        <Ejercicio ejercicio={item} index={index} key={item.id} />
                    )
                })
            }
        </>
    )
}

export default Ejercicios