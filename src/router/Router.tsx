// ============================================================================
// ROUTER - ACTUALIZADO PARA USAR JWT (SIN QUERY PARAMS)
// ============================================================================

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Curso from "../components/curso/Curso";
import Capitulo from "../components/capitulo/Capitulo";
import { hasValidSession } from "../helpers/fetch";
import DebugLogin from "../pages/DebugLogin";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { obtenerUsuario } from "../store/slices/usuario";
import { obtenerCurso } from "../store/slices/curso";
import { obtenerCapitulosCurso, setCapitulo, startLoadingCapitulo } from "../store/slices/capitulo";
import { obtenerClasesCurso } from "../store/slices/clase";

const Router = () => {
    // FASE 1: Ya NO extraemos user_id y course_id de URL
    // Ahora estos datos vienen del JWT que el backend valida

    // Verificar si hay sesión válida
    const hasSession = hasValidSession();

    const dispatch = useDispatch<AppDispatch>();

    const { curso } = useSelector(
        (state: RootState) => state.curso
    );

    const { capitulos } = useSelector(
        (state: RootState) => state.capitulo
    );

    useEffect(() => {
        const courseIdParam = sessionStorage.getItem('lti_course_id');
        const userIdParam = sessionStorage.getItem('lti_user_id');
        dispatch(obtenerUsuario(courseIdParam || "", userIdParam || ""));
        dispatch(obtenerCurso(courseIdParam || ""));
    }, [dispatch]);

    useEffect(() => {
        if (curso.id !== '') {
            dispatch(startLoadingCapitulo());
            dispatch(obtenerCapitulosCurso(curso.id));
            dispatch(obtenerClasesCurso(curso.id));
        }
    }, [dispatch, curso])

    useEffect(() => {
        const lti_chapter_id = sessionStorage.getItem('lti_chapter_id');
        if (lti_chapter_id) {
            const selectedCapitulo = capitulos.find(capitulo => capitulo.id === lti_chapter_id);
            if (selectedCapitulo) {
                dispatch(setCapitulo(selectedCapitulo));
            }
        }
    }, [capitulos, dispatch]);



    if (!hasSession) {
        console.warn('⚠️ No hay sesión JWT válida');
        console.warn('   Por favor, accede desde Canvas LTI');
    }

    // if (isLoadingCurso || isLoadingUsuario || isLoadingCapitulos) {
    //     return (
    //         <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
    //             <div className="text-center">
    //                 <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
    //                 <p className="text-gray-600 text-lg">Cargando el capítulo...</p>
    //             </div>
    //         </div>
    //     );
    // }

    return (
        <BrowserRouter>
            <Routes>
                {/* DEBUG LOGIN (solo desarrollo) */}
                {import.meta.env.VITE_DEV && (
                    <Route path="/debug" element={<DebugLogin />} />
                )}

                {/* CURSO */}
                <Route path="/curso" element={<Curso />} />

                {/* CAPITULO */}
                <Route path="/curso/capitulo" element={<Capitulo />} />

                {/* Redirección por defecto */}
                <Route
                    path="/*"
                    element={
                        import.meta.env.VITE_DEV && !hasSession
                            ? <Navigate to="/debug" replace />
                            : <Navigate to="/curso" replace />
                    }
                />
            </Routes>
        </BrowserRouter>
    )
}

export default Router;

// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import Curso from "../components/curso/Curso";
// import Capitulo from "../components/capitulo/Capitulo";

// const Router = () => {

//     const params = new URLSearchParams(window.location.search);
//     const course_id = params.get('course_id');
//     const user_id = params.get('user_id');

//     return (
//         <BrowserRouter>
//             <Routes>
//                 {/* CURSO */}
//                 <Route path="/curso" element={<Curso />} />
//                 {/* CAPITULO */}
//                 <Route path="/curso/capitulo" element={<Capitulo />} />

//                 {/* Redirección */}
//                 <Route path="/*" element={<Navigate to={`/curso?user_id=${user_id}&course_id=${course_id}`} replace />} />
//             </Routes>
//         </BrowserRouter>
//     )
// }

// export default Router