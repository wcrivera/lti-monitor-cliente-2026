import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
// import { useCanvasResize } from "../../hooks/useCanvasResize";
import { useEffect, useState } from "react";
import { obtenerAyudantiasCapitulo } from "../../store/slices/ayudantia";
import Ayudantia from "./Ayudantia";
import { Modal } from '../ui/Modal';
import Solucion from "./Solucion";
import Video from "./Video";
import Question from "./Question";

const Ayudantias = () => {

    const dispatch = useDispatch<AppDispatch>();

    const { capitulo } = useSelector((state: RootState) => state.capitulo);
    const { ayudantias } = useSelector((state: RootState) => state.ayudantia);

    // useCanvasResize([capitulo, ayudantias]);

    const [modalSolucion, setmodalSolucion] = useState({ isOpen: false });
    const [modalVideo, setModalVideo] = useState({ isOpen: false });
    const [modalQuiz, setModalQuiz] = useState({ isOpen: false });

    const [correctas, setCorrectas] = useState(0);
    const [incorrectas, setIncorrectas] = useState(0);
    const [nulas, setNulas] = useState(0);

    useEffect(() => {
        if (capitulo.id) {
            dispatch(obtenerAyudantiasCapitulo(capitulo.id));
        }
    }, [dispatch, capitulo.id])

    useEffect(() => {
        const correctas = ayudantias.filter(ayudantia => ayudantia.score === 1).length
        const incorrectas = ayudantias.filter(ayudantia => ayudantia.score === 0).length
        const nulas = ayudantias.filter(ayudantia => ayudantia.score === null).length

        setCorrectas(correctas);
        setIncorrectas(incorrectas);
        setNulas(nulas);
    }, [ayudantias])

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
                ayudantias.map((item, index) => {
                    return (
                        <Ayudantia
                            key={item.id}
                            ayudantia={item}
                            index={index}
                            setmodalSolucion={setmodalSolucion}
                            setModalVideo={setModalVideo}
                            setModalQuiz={setModalQuiz}
                        />
                    )
                })
            }
        </>
    )
}

export default Ayudantias