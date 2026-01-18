import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { obtenerQuestionSeccion, startLoadingQuestion } from '../../store/slices/question';
import { useEffect, useState } from 'react';
import Latex from 'react-latex-next';
import { Circle, Target, CircleCheck, CircleX } from 'lucide-react';
import { Button } from '../ui/Button';
import { enviarRespuestasQuiz, setScore } from '../../store/slices/quiz';
import { PreguntaState } from '../../store/slices/tema';

type Props = {
    pregunta: PreguntaState
    setModalQuiz?: (value: React.SetStateAction<PreguntaState & { isOpen: boolean; }>) => void;
    // content_id: number;
}

const Question = ({ pregunta, setModalQuiz }: Props) => {

    console.log(pregunta)

    // const dispatch = useDispatch<AppDispatch>();

    // const { score } = useSelector(
    //     (state: RootState) => state.quiz
    // );

    // const { questions, isLoading } = useSelector(
    //     (state: RootState) => state.question
    // );

    const [alternativa, setAlternativa] = useState({ letra: '', texto: '', correcta: false });


    const [loading, setLoading] = useState(false);

    // useEffect(() => {
    //     const params = new URLSearchParams(window.location.search);
    //     const courseIdParam = params.get('course_id');
    //     // const userIdParam = params.get('user_id');
    //     if (content_id !== 0) {
    //         dispatch(startLoadingQuestion())
    //         dispatch(obtenerQuestionSeccion(courseIdParam || "", content_id.toString()));
    //     }
    // }, [dispatch, content_id])

    // useEffect(() => {
    //     return () => {
    //         dispatch(setScore({ id: 0, name: '', course_id: 0, quiz_id: 0, user_id: 0, score: 0 }));
    //     }
    // }, [dispatch])


    // if (isLoading) {
    //     return (
    //         <div className="min-h-[400px] bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
    //             <div className="text-center">
    //                 <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
    //                 <p className="text-gray-600 text-lg">Cargando la pregunta...</p>
    //             </div>
    //         </div>
    //     );
    // }

    const handleSendAnswer = async () => {
        setLoading(true);
        // const quiz_id = content_id.toString();
        // const question_id = questions[0].assessment_question_id.toString();
        // const answer_id = alternativa.letra.toString();

        // Lógica para enviar la respuesta seleccionada

        // const params = new URLSearchParams(window.location.search);
        // const course_id = params.get('course_id');
        // const user_id = params.get('user_id');
        // dispatch(enviarRespuestasQuiz(user_id || "", course_id || "", quiz_id, question_id, answer_id, alternativa.weight.toString()))
    }

    return (<>
        {/* <div className="p-6 bg-white rounded-lg shadow-md"> */}
        <div className="pb-10 pt-6 px-6 border-b border-gray-200">
            <Latex>{pregunta.enunciado}</Latex>
        </div>


        {
            pregunta.alternativas.map((item) => {
                return (
                    <div key={item.letra} className=" border-b border-gray-200">
                        <div className="p-6 flex items-center py-4 cursor-pointer hover:bg-gray-50" onClick={() => setAlternativa({ letra: item.letra, texto: item.texto, correcta: item.correcta })}>
                            <div className="w-6 h-6 flex items-center justify-center mr-4">
                                <Button
                                    disabled={loading}

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
                        {/* <div className="ml-auto">
                                {
                                    alternativa.letra === alternativa.letra && score.user_id !== 0 && score.score !== 0 &&
                                    <CircleCheck className="text-green-500" />
                                }

                                {
                                    alternativa.letra === alternativa.letra && score.user_id !== 0 && score.score === 0 &&
                                    <CircleX className="text-red-500" />
                                }
                            </div> */}
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
            <Button
                // disabled={alternativa.letra === '' || loading}
                className='ml-2'
                onClick={() => setModalQuiz && setModalQuiz({ id: "", numero: 0, enunciado: "", solucion: "", video: "", alternativas: [], activo: false, isOpen: false })}
                variant="danger"
                size="sm"
                rounded
            >
                Cancelar
            </Button>
        </div>

    </>
    )
}

export default Question