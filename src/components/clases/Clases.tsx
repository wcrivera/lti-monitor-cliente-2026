import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
// import { BloqueState } from '../../store/slices/bloque';

import Modal from '../common/Modal';
import { VideoPlayer } from '../ui/Video';
import Question from './Question';
import Latex from 'react-latex-next';
import { BookOpenText, Calculator, GraduationCap, Video } from 'lucide-react';
import { Button } from '../ui/Button';
import { ClaseState } from '../../store/slices/clase';
import { useCanvasResize } from '../../hooks/useCanvasResize';
import Diapositiva from './Diapositiva';


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
    const [modalVideo, setModalVideo] = useState({ url: "", titulo: "", isOpen: false });
    const [modalQuiz, setModalQuiz] = useState({ content_id: 0, titulo: "", isOpen: false });
    const [modalDiapositiva, setModalDiapositiva] = useState({ id: '', autor: '', diapositivas: [{ pagina: 0, contenido: '' }], activo: false, isOpen: false });

    useEffect(() => {
        const clasesFiltradas = clases.filter(item => item.capitulo_id === capitulo.id);
        setClasesCapitulo(clasesFiltradas);
    }, [clases, capitulo.id])

    const handleModalDiapositiva = (diapositiva: { id: string, autor: string, diapositivas: [{ pagina: number, contenido: string }], activo: boolean }) => {

        console.log(diapositiva)

        if (diapositiva.id !== '') {
            setModalDiapositiva({
                id: diapositiva.id,
                autor: diapositiva.autor,
                diapositivas: diapositiva.diapositivas,
                activo: diapositiva.activo,
                isOpen: true
            });
        }
        // if (diapositivas && diapositivas.diapositivas && diapositivas.diapositivas.length > 0) {
        //     setModalDiapositiva({ diapositivas: diapositivas, isOpen: true });
        // }
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
                    onClose={() => setModalVideo({ url: "", titulo: "", isOpen: false })}
                    title={modalVideo.titulo}
                    size="full"
                    className='background-chapter-600'
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
                    onClose={() => setModalQuiz({ content_id: 0, titulo: "", isOpen: false })}
                    // title={"Ejercicio: " + modalQuiz.titulo}
                    size="full"
                    className='background-chapter-600'
                >
                    <Question content_id={modalQuiz.content_id} />
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
                                                        />
                                                        <div className="ml-3 text-sm text-chapter-600">Diapositiva</div>
                                                    </div>
                                                </div>
                                                <div className="w-full lg:w-1/5 sm:w-1/2 p-2">
                                                    <div className="flex items-center">
                                                        <Button
                                                            // onClick={() => setModalVideo({ url: actividades.length > 1 ? actividades[1].title : '', titulo: tema.title, isOpen: true })}
                                                            icon={Video}
                                                            variant="danger"
                                                            size="sm"
                                                        />
                                                        <div className="ml-3 text-sm text-chapter-600">Video</div>
                                                    </div>
                                                </div>
                                                <div className="w-full lg:w-1/5 sm:w-1/2 p-2">
                                                    <div className="flex items-center">
                                                        <Button
                                                            // onClick={() => setModalQuiz({ content_id: actividades.length > 2 ? actividades[2].content_id : 0, titulo: tema.title, isOpen: true })}
                                                            icon={Calculator}
                                                            variant="primary"
                                                            size="sm"
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