// ============================================================================
// DEBUG PAGE - FRONTEND
// frontend/src/pages/DebugLogin.tsx
// ============================================================================

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const DebugLogin = () => {
    const [userId, setUserId] = useState('13656');
    const [courseId, setCourseId] = useState('104914');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Listener para recibir token via postMessage
    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (event.origin !== 'http://localhost:3001') return;

            if (event.data?.type === 'INJECT_JWT') {
                const { token, userId, courseId } = event.data;

                sessionStorage.setItem('lti_token', token);
                sessionStorage.setItem('lti_user_id', userId);
                sessionStorage.setItem('lti_course_id', courseId);

                console.log('✅ JWT inyectado via postMessage');
                navigate('/curso');
            }
        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, [navigate]);

    const handleLogin = async () => {
        setLoading(true);
        setError('');

        try {
            const response = await fetch(
                `http://localhost:3001/api/debug/token?user_id=${userId}&course_id=${courseId}`
            );

            const data = await response.json();

            if (data.ok) {
                // Guardar en sessionStorage
                sessionStorage.setItem('lti_token', data.token);
                sessionStorage.setItem('lti_user_id', data.userId);
                sessionStorage.setItem('lti_course_id', data.courseId);

                console.log('✅ JWT guardado en sessionStorage');
                console.log('   User ID:', data.userId);
                console.log('   Course ID:', data.courseId);
                console.log('   Expira en:', data.expiresIn);

                // Redirigir al curso
                navigate('/curso');
            } else {
                setError(data.error || 'Error desconocido');
            }
        } catch (err) {
            setError('Error conectando con backend: ' + (err as Error).message);
            console.error('❌ Error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        }}>
            <div style={{
                background: 'white',
                padding: '40px',
                borderRadius: '10px',
                boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
                maxWidth: '400px',
                width: '100%'
            }}>
                <h1 style={{ margin: '0 0 10px', fontSize: '24px', color: '#333' }}>
                    🐛 Debug Login
                </h1>
                <p style={{ margin: '0 0 30px', color: '#666', fontSize: '14px' }}>
                    Solo para desarrollo local
                </p>

                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', fontSize: '14px' }}>
                        User ID:
                    </label>
                    <input
                        type="text"
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '10px',
                            border: '1px solid #ddd',
                            borderRadius: '5px',
                            fontSize: '14px',
                            boxSizing: 'border-box'
                        }}
                    />
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', fontSize: '14px' }}>
                        Course ID:
                    </label>
                    <input
                        type="text"
                        value={courseId}
                        onChange={(e) => setCourseId(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '10px',
                            border: '1px solid #ddd',
                            borderRadius: '5px',
                            fontSize: '14px',
                            boxSizing: 'border-box'
                        }}
                    />
                </div>

                {error && (
                    <div style={{
                        padding: '10px',
                        background: '#fee',
                        border: '1px solid #fcc',
                        borderRadius: '5px',
                        marginBottom: '20px',
                        color: '#c33',
                        fontSize: '14px'
                    }}>
                        {error}
                    </div>
                )}

                <button
                    onClick={handleLogin}
                    disabled={loading}
                    style={{
                        width: '100%',
                        padding: '12px',
                        background: loading ? '#ccc' : '#667eea',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        fontSize: '16px',
                        fontWeight: '500',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        transition: 'background 0.2s'
                    }}
                >
                    {loading ? '⏳ Generando JWT...' : '🔐 Generar JWT e Iniciar'}
                </button>

                <div style={{
                    marginTop: '20px',
                    padding: '15px',
                    background: '#f5f5f5',
                    borderRadius: '5px',
                    fontSize: '12px',
                    color: '#666'
                }}>
                    <strong>💡 Tip:</strong> El JWT expira en 2 horas. Si ves errores 401, vuelve aquí para generar uno nuevo.
                </div>
            </div>
        </div>
    );
};

export default DebugLogin;