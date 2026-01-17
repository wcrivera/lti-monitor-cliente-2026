import { BookOpenText, Calculator, Pencil, Video } from 'lucide-react'
import { Button } from '../ui/Button'
import Latex from 'react-latex-next'
import { EjercicioState } from '../../store/slices/ejercicio'

type Props = {
    ejercicio: EjercicioState
    index: number
    // setModalVideo: (modal: { url: string; titulo: string; isOpen: boolean }) => void
    // setModalQuiz: (modal: { content_id: number; titulo: string; isOpen: boolean }) => void
    // setModalDiapositiva: (modal: { content_id: number; titulo: string; url: string; isOpen: boolean }) => void
}

const Ejercicio = ({ ejercicio, index }: Props) => {
    return (
        <>
            <div className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow-sm border border-gray-300 mb-4">
                <div className="p-4 sm:px-6">
                    <div className="flex items-center">
                        <div className="w-12 h-12 bg-gray-500 rounded-full flex items-center justify-center mr-4">
                            <Pencil className="text-white" />
                        </div>
                        <div>
                            <p className="text-md font-medium text-gray-400">Ejercicio</p>
                            <p className="text-sm text-chapter-600">Pregunta {index + 1}</p>
                        </div>
                        <div className="justify-end flex-grow flex">
                            <div className="flex flex-wrap justify-end items-center">
                                <div className="flex items-center mr-2">
                                    <Button
                                        // onClick={() => setModalDiapositiva({ content_id: actividades.length > 0 ? actividades[0].content_id : 0, titulo: tema.title, url: actividades.length > 0 ? actividades[0].external_url : '', isOpen: true })}
                                        icon={BookOpenText}
                                        variant="warning"
                                        size="sm"
                                    />
                                </div>
                                <div className="flex items-center mr-2">
                                    <Button
                                        // onClick={() => setModalVideo({ url: actividades.length > 1 ? actividades[1].title : '', titulo: tema.title, isOpen: true })}
                                        icon={Video}
                                        variant="danger"
                                        size="sm"
                                    />
                                </div>
                                <div className="flex items-center">
                                    <Button
                                        // onClick={() => setModalQuiz({ content_id: actividades.length > 2 ? actividades[2].content_id : 0, titulo: tema.title, isOpen: true })}
                                        icon={Calculator}
                                        variant="primary"
                                        size="sm"
                                    />
                                </div>

                                {/* <div className="w-full lg:w-2/5 sm:w-1/2 p-2 flex justify-end "> */}
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
                </div>
                <div className="p-4 sm:px-6 border-t border-gray-200">
                    <p className="text-md font-light"><Latex>{ejercicio.enunciado}</Latex></p>
                </div>
            </div>

        </>
    )
}

export default Ejercicio