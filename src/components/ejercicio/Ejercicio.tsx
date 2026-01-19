import { BookOpenText, Calculator, CheckCircle, Pencil, Video, XCircle } from 'lucide-react'
import { Button } from '../ui/Button'
import Latex from 'react-latex-next'
import { EjercicioState, setEjercicio } from '../../store/slices/ejercicio'
import { AppDispatch } from '../../store'
import { useDispatch } from 'react-redux'

type Props = {
    ejercicio: EjercicioState
    index: number
    setModalVideo: (modal: { isOpen: boolean }) => void
    setmodalSolucion: (modal: { isOpen: boolean }) => void
    setModalQuiz: (modal: { isOpen: boolean }) => void
}

const Ejercicio = ({ ejercicio, index, setModalVideo, setmodalSolucion, setModalQuiz }: Props) => {

    const dispatch = useDispatch<AppDispatch>();

    const handleSolucion = () => {
        dispatch(setEjercicio(ejercicio));
        setmodalSolucion({ isOpen: true })
    }

    const handleVideo = () => {
        dispatch(setEjercicio(ejercicio));
        setModalVideo({ isOpen: true })
    }

    const handleQuiz = () => {
        dispatch(setEjercicio(ejercicio));
        setModalQuiz({ isOpen: true })
    }
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
                                        disabled={ejercicio.solucion === '' || ejercicio.solucion === null || ejercicio.solucion === undefined}
                                        onClick={handleSolucion}
                                        icon={BookOpenText}
                                        variant="warning"
                                        size="sm"
                                    />
                                </div>
                                <div className="flex items-center mr-2">
                                    <Button
                                        disabled={ejercicio.video === '' || ejercicio.video === null || ejercicio.video === undefined}
                                        onClick={handleVideo}
                                        icon={Video}
                                        variant="danger"
                                        size="sm"
                                    />
                                </div>
                                <div className="flex items-center">
                                    <div className="relative">
                                        <Button
                                            // onClick={() => setModalQuiz({ content_id: actividades.length > 2 ? actividades[2].content_id : 0, titulo: tema.title, isOpen: true })}
                                            onClick={handleQuiz}
                                            icon={Calculator}
                                            variant="primary"
                                            size="sm"
                                            disabled={
                                                ejercicio.enunciado === ""}
                                        />
                                        {
                                            ejercicio.score === 1 && <CheckCircle className="absolute -top-2 -right-2 w-6 h-6 text-green-500 bg-white rounded-full" />
                                        }
                                        {
                                            ejercicio.score === 0 && <XCircle className="absolute -top-2 -right-2 w-6 h-6 text-red-500 bg-white rounded-full" />
                                        }
                                    </div>
                                    <div className="ml-3 text-sm text-chapter-600">Ejercicio</div>
                                </div>
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