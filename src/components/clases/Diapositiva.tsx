import { useEffect, useRef } from "react";
// LaTeX
import Latex from "react-latex-next";
// reveal
import Reveal from "reveal.js";
// logo
import logo from "../../img/logo_matuc.png";
import "../../css/math.css";
import "../../css/diapositivas.css";
// css
import "reveal.js/dist/reveal.css";
import { CursoState } from "../../store/slices/curso";
import { CapituloState } from "../../store/slices/capitulo";
import { RootState } from "../../store";
import { useSelector } from "react-redux";

type Props = {
    curso: CursoState;
    capitulo: CapituloState
};
const Diapositiva = ({ curso, capitulo }: Props) => {

    const { diapositiva } = useSelector(
        (state: RootState) => state.diapositiva
    );
    
    const deckDivRef = useRef<HTMLDivElement>(null);
    const deckRef = useRef<Reveal.Api | null>(null);
    const isInitializedRef = useRef(false);

    useEffect(() => {
        // Evita re-inicialización en desarrollo (strict mode)
        if (isInitializedRef.current) return;

        if (!deckDivRef.current) return;

        deckRef.current = new Reveal(deckDivRef.current, {
            hash: false,
            controlsLayout: "edges",
            center: false,
            backgroundTransition: "slide",
            transition: "fade",
            margin: 0.0,
            width: 1280,
            height: 800,
            minScale: 0.2,
            maxScale: 2.0,

        });

        deckRef.current.initialize().then(() => {
            isInitializedRef.current = true;
            console.log("Reveal.js initialized");
        });

        return () => {
            try {
                if (deckRef.current) {
                    deckRef.current.destroy();
                    deckRef.current = null;
                    isInitializedRef.current = false;
                }
            } catch (e) {
                console.warn("Reveal.js destroy failed:", e);
            }
        };
    }, [isInitializedRef, deckDivRef, deckRef, diapositiva]);

    // console.log(deckDivRef.current?.clientHeight, deckDivRef.current?.clientWidth, isInitializedRef) 

    // console.log(deckRef.current)

    return (
        <div
            style={{ width: "100%", height: "650px", backgroundColor: "#f7f3de"}}
            className="reveal"
            ref={deckDivRef}
        >
            <div className="slides">
                {/* Portada */}
                <section
                    data-transition="fade" className="center"
                    style={{padding: "20px"}}
                >
                    <div className="grid grid-cols-9 gap-4">
                        <div className="col-span-5">
                            <h1>{curso.nombre}</h1>
                            <h5>{capitulo.nombre}</h5>
                        </div>
                        <div className="col-span-4">
                            <img
                                src={logo}
                                alt="Logo MATUC"
                                style={{ width: "100%", marginLeft: "auto", marginRight: "0px" }}
                            />
                        </div>
                    </div>
                </section>

                {/* Diapositivas */}
                {diapositiva.diapositivas.map((item) => {
                    const { pagina, contenido } = item;
                    return (
                        <section
                            data-transition="fade"
                            data-align="center"
                            style={{ display: "block", textAlign: "justify", padding: "20px" }}
                            key={pagina}
                        >
                            <Latex>{contenido}</Latex>
                        </section>
                    );
                })}
            </div>
        </div>
    );
};

export default Diapositiva;
