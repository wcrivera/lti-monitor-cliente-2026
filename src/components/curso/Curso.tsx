// src/components/curso/Curso.tsx
// ============================================================================
// COMPONENTE CURSO - CON AUTO-RESIZE
// ============================================================================

import { GraduationCap, Book, NewspaperIcon } from 'lucide-react';
import { Tabs } from '../../components/ui/Tabs';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import Capitulos from '../../components/capitulo/Capitulos';

// ⭐ IMPORTAR EL HOOK
import { useCanvasResize } from '../../hooks/useCanvasResize';

const Curso = () => {
    const { isLoading: isLoadingUsuario } = useSelector(
        (state: RootState) => state.usuario
    );

    const { curso, isLoading: isLoadingCurso } = useSelector(
        (state: RootState) => state.curso
    );

    // ⭐ USAR EL HOOK PARA AUTO-RESIZE
    // Se ejecuta cuando cambie el curso (y por ende la altura del contenido)
    useCanvasResize([curso, isLoadingCurso, isLoadingUsuario]);

    return (
        <div className="min-h-screen p-1">
            <Tabs
                titulo={curso.nombre}
                tabs={[
                    {
                        id: 'capitulos',
                        label: 'Capítulos',
                        icon: GraduationCap,
                        content: <Capitulos />,
                    },
                    {
                        id: 'clases',
                        label: 'Anuncios',
                        icon: NewspaperIcon,
                        content: <div>Contenido de Ejercicio</div>,
                    },
                    {
                        id: 'ayudantias',
                        label: 'Material Docente',
                        icon: Book,
                        content: <div>Contenido de Ejercicio</div>,
                    },
                    {
                        id: 'ejercicios',
                        label: 'Notas',
                        icon: GraduationCap,
                        content: <div>Contenido de Ejercicio</div>,
                    },
                ]}
                defaultTab="capitulos"
                className='bg-chapter-500 shadow-sm p-5 rounded-lg mb-6'
            />
        </div>
    );
};

export default Curso;