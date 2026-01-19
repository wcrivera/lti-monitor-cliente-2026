import { useState } from 'react';
import Latex from 'react-latex-next';
import { Circle, CircleCheck, CircleX, Target, } from 'lucide-react';
import { Button } from '../ui/Button';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { crearScoreAyudantia } from '../../store/slices/ayudantia';

const Question = () => {

    const dispatch = useDispatch<AppDispatch>();

    const { ayudantia } = useSelector(
        (state: RootState) => state.ayudantia
    );

    const [alternativa, setAlternativa] = useState({ letra: '', texto: '', correcta: false });

    const [loading, setLoading] = useState(false);

    const handleSendAnswer = async () => {
        setLoading(true);
        dispatch(crearScoreAyudantia(ayudantia.id, alternativa.correcta ? 1 : 0))
    }

    return (
        <>
            <div className='flex justify-start items-center border-b border-gray-200'>
                <div className="py-6 pl-6 pr-2">
                    {
                        ayudantia.score === null &&
                        <Circle className="text-gray-500" />
                    }
                    {
                        ayudantia.score === 1 &&
                        <CircleCheck className="text-green-500" />
                    }
                    {
                        ayudantia.score === 0 &&
                        <CircleX className="text-red-500" />
                    }
                </div>
                <div className="py-6 font-bold text-chapter-600">
                    Pregunta {ayudantia.numero}
                </div>
            </div>

            <div className="pb-10 pt-6 px-6 border-b border-gray-200">
                <Latex>{ayudantia.ejercicio.enunciado}</Latex>
            </div>


            {
                ayudantia.ejercicio.alternativas.map((item) => {
                    return (
                        <div key={item.letra} className=" border-b border-gray-200">
                            <div className="p-6 flex items-center py-4 hover:bg-gray-50" >
                                <div className="w-6 h-6 flex items-center justify-center mr-4">
                                    <Button
                                        onClick={() => setAlternativa({ letra: item.letra, texto: item.texto, correcta: item.correcta })}
                                        disabled={loading || ayudantia.score !== null}
                                        icon={item.letra === alternativa.letra ? Target : Circle}
                                        variant="ghost"
                                        size="sm"
                                        rounded
                                    />
                                </div>
                                <div className="text-chapter-600">
                                    <Latex>{item.texto}</Latex>
                                </div>
                            </div>

                        </div>
                    )
                })
            }

            <div className='p-4 flex justify-end'>
                <Button
                    disabled={alternativa.letra === '' || loading}
                    onClick={handleSendAnswer}
                    variant="primary"
                    size="sm"
                    rounded
                >
                    Entregar
                </Button>
            </div>
        </>
    )
}

export default Question