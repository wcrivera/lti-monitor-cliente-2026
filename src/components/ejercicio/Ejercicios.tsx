import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { useCanvasResize } from "../../hooks/useCanvasResize";
import { useEffect, useState } from "react";
import Ejercicio from "./Ejercicio";
import { obtenerEjerciciosCapitulo } from "../../store/slices/ejercicio";
import { Modal } from "../ui/Modal";
import Solucion from "./Solucion";
import Video from "./Video";
import Question from "./Question";

const Ejercicios = () => {

    const dispatch = useDispatch<AppDispatch>();

    const { capitulo } = useSelector((state: RootState) => state.capitulo);
    const { ejercicios } = useSelector((state: RootState) => state.ejercicio);

    const [correctas, setCorrectas] = useState(0);
    const [incorrectas, setIncorrectas] = useState(0);
    const [nulas, setNulas] = useState(0);

    const [modalSolucion, setmodalSolucion] = useState({ isOpen: false });
    const [modalVideo, setModalVideo] = useState({ isOpen: false });
    const [modalQuiz, setModalQuiz] = useState({ isOpen: false });

    useCanvasResize([capitulo, ejercicios]);

    useEffect(() => {
        if (capitulo.id) {
            dispatch(obtenerEjerciciosCapitulo(capitulo.id));
        }
    }, [dispatch, capitulo.id])

    useEffect(() => {
        const correctas = ejercicios.filter(ayudantia => ayudantia.score === 1).length
        const incorrectas = ejercicios.filter(ayudantia => ayudantia.score === 0).length
        const nulas = ejercicios.filter(ayudantia => ayudantia.score === null).length

        setCorrectas(correctas);
        setIncorrectas(incorrectas);
        setNulas(nulas);
    }, [ejercicios])

    return (
        <>
            {
                modalSolucion.isOpen &&
                <Modal
                    isOpen={modalSolucion.isOpen}
                    onClose={() => setmodalSolucion({ isOpen: false })}
                    size="full"
                    fullContent
                >
                    <Solucion />
                </Modal>
            }

            {
                modalVideo.isOpen &&
                <Modal
                    isOpen={modalVideo.isOpen}
                    onClose={() => setModalVideo({ isOpen: false })}
                    size="full"
                    fullContent
                >
                    <Video />
                </Modal>
            }

            {
                modalQuiz.isOpen &&
                <Modal
                    isOpen={modalQuiz.isOpen}
                    onClose={() => setModalQuiz({ isOpen: false })}
                    size="full"
                    fullContent
                >
                    <Question />
                </Modal>
            }

            <div className='flex items-center justify-center mb-4 flex-wrap'>
                <div className="rounded-lg bg-green-600 shadow-md border border-gray-300 mb-2 mr-2 p-2" style={{ width: 100 }}>
                    <div className="text-2xl text-center font-bold text-white">{correctas}</div>
                    <div className="text-sm text-white text-center">
                        Correctas
                    </div>
                </div>
                <div className="rounded-lg bg-red-600 shadow-md border border-gray-300 mb-2 mr-2 p-2" style={{ width: 100 }}>
                    <div className="text-2xl text-center font-bold text-white">{incorrectas}</div>
                    <div className="text-sm text-white text-center">
                        Incorrectas
                    </div>
                </div>
                <div className="rounded-lg bg-blue-600 shadow-md border border-gray-300 mb-2 mr-2 p-2" style={{ width: 100 }}>
                    <div className="text-2xl text-center font-bold text-white">{nulas}</div>
                    <div className="text-sm text-white text-center">
                        Pendientes
                    </div>
                </div>
            </div>
            {
                ejercicios.map((item, index) => {
                    return (
                        <Ejercicio ejercicio={item} index={index} key={item.id} setmodalSolucion={setmodalSolucion}
                            setModalVideo={setModalVideo}
                            setModalQuiz={setModalQuiz}/>
                    )
                })
            }
        </>
    )
}

export default Ejercicios