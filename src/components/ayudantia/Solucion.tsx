import Latex from 'react-latex-next'
import { RootState } from '../../store';
import { useSelector } from 'react-redux';

const Solucion = () => {

    const { ayudantia } = useSelector(
        (state: RootState) => state.ayudantia
    );

    return (
        <>
            <div className='flex justify-start items-center border-b border-gray-200'>
                <div className="p-6 font-bold text-chapter-600">
                    Solución
                </div>
            </div>

            <div className="pb-10 pt-6 px-6 border-b border-gray-200">
                <Latex>{ayudantia.solucion}</Latex>
            </div>
        </>
    )
}

export default Solucion