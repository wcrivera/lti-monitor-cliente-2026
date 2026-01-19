import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
// import { BloqueState } from '../../store/slices/bloque';

import { VideoPlayer } from '../ui/Video';
import Question from './Question';
import Latex from 'react-latex-next';
import { BookOpenText, Calculator, CheckCircle, GraduationCap, Video, XCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { ClaseState } from '../../store/slices/clase';
import { useCanvasResize } from '../../hooks/useCanvasResize';
import Diapositiva from './Diapositiva';
import { Modal } from '../ui/Modal';
import { DiapositivaState, PreguntaState, VideoState } from '../../store/slices/tema';
import { setDiapositiva } from '../../store/slices/diapositiva';
import { setPregunta } from '../../store/slices/pregunta';

const Clases = () => {

    const dispatch = useDispatch<AppDispatch>();

    const { curso } = useSelector(
        (state: RootState) => state.curso
    );

    const { capitulo } = useSelector(
        (state: RootState) => state.capitulo
    );

    const { clases } = useSelector(
        (state: RootState) => state.clase
    );

    const { temas } = useSelector(
        (state: RootState) => state.tema
    );

    useCanvasResize([capitulo, temas, clases]);

    const [clasesCapitulo, setClasesCapitulo] = useState<Array<ClaseState>>([{ id: '', curso_id: '', capitulo_id: '', nombre: '', numero: 0, activo: false }]);
    const [modalVideo, setModalVideo] = useState<VideoState & { isOpen: boolean }>({ id: '', url: '', activo: false, isOpen: false });
    // const [modalQuiz, setModalQuiz] = useState<PreguntaState & { isOpen: boolean }>({ id: "", numero: 0, enunciado: "", solucion: "", video: "", alternativas: [], score: null, activo: false, isOpen: false });

    const [modalDiapositiva, setModalDiapositiva] = useState<{ isOpen: boolean }>({ isOpen: false });
    const [modalQuiz, setModalQuiz] = useState<{ isOpen: boolean }>({ isOpen: false });

    const [correctas, setCorrectas] = useState(0);
    const [incorrectas, setIncorrectas] = useState(0);
    const [nulas, setNulas] = useState(0);

    useEffect(() => {
        const clasesFiltradas = clases.filter(item => item.capitulo_id === capitulo.id);
        setClasesCapitulo(clasesFiltradas);
    }, [clases, capitulo.id])

    const handleModalDiapositiva = (diapositiva: DiapositivaState) => {
        if (diapositiva.id !== '') {
            dispatch(setDiapositiva(diapositiva));
            setModalDiapositiva({ isOpen: true });
        }
    }

    const handleModalQuiz = (pregunta: PreguntaState) => {
        if (pregunta.id !== '') {
            dispatch(setPregunta(pregunta));
            setModalQuiz({ isOpen: true });
        }
    }

    useEffect(() => {
        const correctas = temas.map(tema => tema.preguntas.map(p => p.score)).flat().filter(elemento => elemento === 1).length
        const incorrectas = temas.map(tema => tema.preguntas.map(p => p.score)).flat().filter(elemento => elemento === 0).length
        const nulas = temas.map(tema => tema.preguntas.map(p => p.score)).flat().filter(elemento => elemento === null).length

        setCorrectas(correctas);
        setIncorrectas(incorrectas);
        setNulas(nulas);
    }, [temas])

    return (
        <>
            {
                modalDiapositiva.isOpen &&
                <Modal
                    isOpen={modalDiapositiva.isOpen}
                    onClose={() => setModalDiapositiva({ isOpen: false })}
                    title={`Capítulo: ${capitulo.nombre}`}
                    size="full"
                    className='bg-[#f7f3de]'
                    fullContent



                >
                    <Diapositiva
                        curso={curso}
                        capitulo={capitulo}
                    />
                </Modal>
            }

            {
                modalVideo.isOpen &&
                <Modal
                    isOpen={modalVideo.isOpen}
                    onClose={() => setModalVideo({ id: '', url: '', activo: false, isOpen: false })}
                    size="full"
                    fullContent
                >
                    <VideoPlayer
                        url={modalVideo.url}
                        aspectRatio="21:9"
                        lazy={false}
                        showInfo={false}
                        vimeoOptions={{
                            fullscreen: true,
                            color: 'FF6B6B',
                            title: true,
                            byline: true,
                            portrait: true,
                        }}
                    />
                </Modal>
            }

            {
                modalQuiz.isOpen &&
                <Modal
                    isOpen={modalQuiz.isOpen}
                    onClose={() => setModalQuiz({ isOpen: false })}
                    size="xl"
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
                clasesCapitulo.map((clase, index) => {
                    const temasClase = temas.filter(tema => tema.clase_id === clase.id);
                    return (
                        <div key={clase.id} className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow-sm border border-gray-300 mb-4">
                            <div className="p-4 sm:px-6">
                                <div className="flex items-center">
                                    <div className="w-12 h-12 bg-gray-500 rounded-full flex items-center justify-center mr-4">
                                        <GraduationCap className="text-white" />
                                    </div>
                                    <div>
                                        <p className="text-md font-medium text-gray-400">Clase {index + 1}</p>
                                        <p className="text-sm text-chapter-600"><Latex>{clase.nombre}</Latex></p>
                                    </div>
                                </div>
                            </div>

                            {
                                temasClase.map((tema) => {
                                    return (
                                        <div key={tema.id} className="p-4 sm:px-6 border-t border-gray-200">
                                            <p className="text-sm text-chapter-600">{tema.nombre}</p>
                                            <div className="flex flex-wrap justify-start items-center">
                                                <div className="w-full lg:w-1/5 sm:w-1/2 p-2">
                                                    <div className="flex items-center">
                                                        <Button
                                                            onClick={() => handleModalDiapositiva(tema.diapositiva)}
                                                            icon={BookOpenText}
                                                            variant="warning"
                                                            size="sm"
                                                            disabled={tema.diapositiva.id === ""}
                                                        />
                                                        <div className="ml-3 text-sm text-chapter-600">Diapositiva</div>
                                                    </div>
                                                </div>
                                                <div className="w-full lg:w-1/5 sm:w-1/2 p-2">
                                                    <div className="flex items-center">
                                                        <Button
                                                            onClick={() => setModalVideo({ id: tema.video.id, url: tema.video.url, activo: tema.video.activo, isOpen: true })}
                                                            icon={Video}
                                                            variant="danger"
                                                            size="sm"
                                                            disabled={tema.video.id === ""}
                                                        />
                                                        <div className="ml-3 text-sm text-chapter-600">Video</div>
                                                    </div>
                                                </div>
                                                <div className="w-full lg:w-1/5 sm:w-1/2 p-2">
                                                    <div className="flex items-center">
                                                        <div className="relative">
                                                            <Button
                                                                // onClick={() => setModalQuiz({ content_id: actividades.length > 2 ? actividades[2].content_id : 0, titulo: tema.title, isOpen: true })}
                                                                onClick={() => handleModalQuiz(tema.preguntas[0])}
                                                                icon={Calculator}
                                                                variant="primary"
                                                                size="sm"
                                                                disabled={tema.preguntas[0].id === ""}
                                                            />
                                                            {
                                                                tema.preguntas[0].score === 1 && <CheckCircle className="absolute -top-2 -right-2 w-6 h-6 text-green-500 bg-white rounded-full" />
                                                            }
                                                            {
                                                                tema.preguntas[0].score === 0 && <XCircle className="absolute -top-2 -right-2 w-6 h-6 text-red-500 bg-white rounded-full" />
                                                            }
                                                        </div>
                                                        <div className="ml-3 text-sm text-chapter-600">Ejercicio</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    )
                })
            }
        </>
    )
}

export default Clases