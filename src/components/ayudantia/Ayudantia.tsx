import { BookOpenText, Calculator, CheckCircle, Users, Video, XCircle } from 'lucide-react'
import { AyudantiaState, setAyudantia } from '../../store/slices/ayudantia'
import { Button } from '../ui/Button'
import Latex from 'react-latex-next'
import { AppDispatch } from '../../store'
import { useDispatch } from 'react-redux'
import { Modal } from '../ui/Test/Modal'
import { useState } from 'react'

type Props = {
    ayudantia: AyudantiaState
    index: number
    setModalVideo: (modal: { isOpen: boolean }) => void
    setmodalSolucion: (modal: { isOpen: boolean }) => void
    setModalQuiz: (modal: { isOpen: boolean }) => void
}

const Ayudantia = ({ ayudantia, index, setModalVideo, setmodalSolucion, setModalQuiz }: Props) => {

    const dispatch = useDispatch<AppDispatch>();

    const handleSolucion = () => {
        dispatch(setAyudantia(ayudantia));
        setmodalSolucion({ isOpen: true })
    }

    const handleVideo = () => {
        dispatch(setAyudantia(ayudantia));
        setModalVideo({ isOpen: true })
    }

    const handleQuiz = () => {
        dispatch(setAyudantia(ayudantia));
        setModalQuiz({ isOpen: true })
    }

    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    
        const handleConfirm = (): void => {
            alert('¡Confirmado!');
            setIsModalOpen(false);
        };

    return (
        <>

            <div className="bg-gray-100 min-h-screen flex items-center justify-center p-4">
            <button
                onClick={() => setIsModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition duration-200"
            >
                Abrir Modal
            </button>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Título del Modal"
                onConfirm={handleConfirm}
                confirmText="Aceptar"
                cancelText="Cerrar"
            >
                <p className="text-gray-600">
                    El modal se cierra al hacer clic en el botón X, en el botón Cerrar, o al hacer clic fuera del contenido.
                </p>
            </Modal>
        </div>
            <div className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow-sm border border-gray-300 mb-4">
                <div className="p-4 sm:px-6">
                    <div className="flex items-center">
                        <div className="w-12 h-12 bg-gray-500 rounded-full flex items-center justify-center mr-4">
                            <Users className="text-white" />
                        </div>
                        <div>
                            <p className="text-md font-medium text-gray-400">Ayudantía</p>
                            <p className="text-sm text-chapter-600">Ejercicio {index + 1}</p>
                        </div>
                        <div className="justify-end flex-grow flex">
                            <div className="flex flex-wrap justify-end items-center">
                                <div className="flex items-center mr-2">
                                    <Button
                                        disabled={ayudantia.solucion === ''}
                                        onClick={handleSolucion}
                                        icon={BookOpenText}
                                        variant="warning"
                                        size="sm"
                                    />
                                </div>
                                <div className="flex items-center mr-2">
                                    <Button
                                        disabled={ayudantia.video === ''}
                                        onClick={handleVideo}
                                        icon={Video}
                                        variant="danger"
                                        size="sm"
                                    />
                                </div>
                                <div className="flex items-center">
                                    <div className="relative">
                                        <Button
                                            onClick={handleQuiz}
                                            icon={Calculator}
                                            variant="primary"
                                            size="sm"
                                            disabled={ayudantia.ejercicio.enunciado === ""}
                                        />
                                        {
                                            ayudantia.score === 1 && <CheckCircle className="absolute -top-2 -right-2 w-6 h-6 text-green-500 bg-white rounded-full" />
                                        }
                                        {
                                            ayudantia.score === 0 && <XCircle className="absolute -top-2 -right-2 w-6 h-6 text-red-500 bg-white rounded-full" />
                                        }
                                    </div>
                                    <div className="ml-3 text-sm text-chapter-600">Ejercicio</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="p-4 sm:px-6 border-t border-gray-200">
                    <p className="text-md font-light"><Latex>{ayudantia.enunciado}</Latex></p>
                </div>
            </div>

        </>
    )
}

export default Ayudantia