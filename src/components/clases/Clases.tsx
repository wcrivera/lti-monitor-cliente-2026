import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
// import { BloqueState } from '../../store/slices/bloque';

import { VideoPlayer } from '../ui/Video';
import Question from './Question';
import Latex from 'react-latex-next';
import { BookOpenText, Calculator, GraduationCap, Video } from 'lucide-react';
import { Button } from '../ui/Button';
import { ClaseState } from '../../store/slices/clase';
import { useCanvasResize } from '../../hooks/useCanvasResize';
import Diapositiva from './Diapositiva';
import { Modal } from '../ui/Modal';
import { DiapositivaState, PreguntaState, VideoState } from '../../store/slices/tema';


const Clases = () => {

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
    const [modalQuiz, setModalQuiz] = useState<PreguntaState & { isOpen: boolean }>({ id: "", numero: 0, enunciado: "", solucion: "", video: "", alternativas: [] as { letra: string; texto: string; correcta: boolean }[], activo: false, isOpen: false });
    const [modalDiapositiva, setModalDiapositiva] = useState<DiapositivaState & { isOpen: boolean }>({ id: '', autor: '', diapositivas: [{ pagina: 0, contenido: '' }], activo: false, isOpen: false });

    useEffect(() => {
        const clasesFiltradas = clases.filter(item => item.capitulo_id === capitulo.id);
        setClasesCapitulo(clasesFiltradas);
    }, [clases, capitulo.id])

    const handleModalDiapositiva = (diapositiva: DiapositivaState) => {
        if (diapositiva.id !== '') {
            setModalDiapositiva({
                ...diapositiva,
                isOpen: true
            });
        }
    }

    const handleModalQuiz = (pregunta: PreguntaState) => {
        if (pregunta.id !== '') {
            setModalQuiz({
                ...pregunta,
                isOpen: true
            });
        }
    }

    return (
        <>
            {
                modalDiapositiva.isOpen &&
                <Modal
                    isOpen={modalDiapositiva.isOpen}
                    onClose={() => setModalDiapositiva({ id: '', autor: '', diapositivas: [{ pagina: 0, contenido: '' }], activo: false, isOpen: false })}
                    title={`Capítulo: ${capitulo.nombre}`}
                    size="full"
                    className='bg-[#f7f3de]'
                    fullContent



                >

                    <Diapositiva
                        curso={curso}
                        capitulo={capitulo}
                        diapositivas={modalDiapositiva.diapositivas}
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
                    onClose={() => setModalQuiz({ id: "", numero: 0, enunciado: "", solucion: "", video: "", alternativas: [], activo: false, isOpen: false })}
                    // title={"Ejercicio: " + modalQuiz.titulo}
                    size="xl"
                    className='background-chapter-600'

                    closeOnEscape={false}
                    closeOnClickOutside={false}
                    showCloseButton={false}
                    fullContent
                >
                    <Question pregunta={modalQuiz} setModalQuiz={setModalQuiz} />
                </Modal>
            }

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
                                                        <Button
                                                            // onClick={() => setModalQuiz({ content_id: actividades.length > 2 ? actividades[2].content_id : 0, titulo: tema.title, isOpen: true })}
                                                            onClick={() => handleModalQuiz(tema.preguntas[0])}
                                                            icon={Calculator}
                                                            variant="primary"
                                                            size="sm"
                                                            disabled={tema.preguntas[0].id === ""}
                                                        />
                                                        <div className="ml-3 text-sm text-chapter-600">Ejercicio</div>
                                                    </div>
                                                </div>
                                                <div className="w-full lg:w-2/5 sm:w-1/2 p-2 flex justify-end ">
                                                    {/* {
                                                        (score && score.id !== 0) ? (score.score === 0 ? (
                                                            <CircleX className="text-red-500" />
                                                        ) : (
                                                            <CircleCheck className="text-green-500" />
                                                        )) : (
                                                            <Circle className="text-gray-500" />
                                                        )
                                                    } */}
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