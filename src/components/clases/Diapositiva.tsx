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

type Props = {
    curso: CursoState;
    capitulo: CapituloState
    diapositivas: Array<{ pagina: number; contenido: string }>;
};
const Diapositiva = ({ curso, capitulo, diapositivas }: Props) => {

    console.log(diapositivas)
    const deckDivRef = useRef<HTMLDivElement>(null);
    const deckRef = useRef<Reveal.Api | null>(null);
    const isInitializedRef = useRef(false);

    useEffect(() => {
        // Evita re-inicialización en desarrollo (strict mode)
        if (isInitializedRef.current) return;

        if (!deckDivRef.current) return;

        deckRef.current = new Reveal(deckDivRef.current, {
            hash: true,
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
    }, []);

    return (
        <div
            style={{ height: "85vh" }}
            className="reveal"
            ref={deckDivRef}
        >
            <div className="slides">
                {/* Portada */}
                <section
                    data-transition="fade" className="center"
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
                {diapositivas.map((item) => {
                    const { pagina, contenido } = item;
                    return (
                        <section
                            data-transition="fade"
                            data-align="center"
                            style={{ display: "block", textAlign: "justify" }}
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
