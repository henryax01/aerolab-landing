import { useCallback, useEffect, useRef, useState } from 'react';
import { FaTimes, FaCamera, FaSpinner } from 'react-icons/fa';
import useFaceModels from '../../hooks/useFaceModels.jsx';
import useFaceAuth from '../../hooks/useFaceAuth.jsx';

export default function FaceCameraModal({ mode, email, token, onSuccess, onClose }) {
  const videoRef = useRef(null);
  const [cameraReady, setCameraReady] = useState(false);
  const { ready: modelsReady, error: modelError } = useFaceModels();
  const { startCamera, stopCamera, enrollFace, loginWithFace, status, working } = useFaceAuth();

  useEffect(() => {
    if (!modelsReady || !videoRef.current) return;
    startCamera(videoRef.current)
      .then(() => setCameraReady(true))
      .catch(() => {});
    return () => stopCamera();
  }, [modelsReady, startCamera, stopCamera]);

  const handleCapture = useCallback(async () => {
    if (!videoRef.current || working) return;
    let result;
    if (mode === 'enroll') {
      result = await enrollFace(videoRef.current, token);
      if (result) setTimeout(onSuccess, 800);
    } else {
      try {
        result = await loginWithFace(email, videoRef.current);
        setTimeout(() => onSuccess(result), 800);
      } catch {}
    }
  }, [mode, email, token, enrollFace, loginWithFace, onSuccess, working]);

  const isSuccess = status?.includes('correctamente') || status?.includes('concedido');
  const isError = status && !isSuccess && !status.includes('Detectando') && !status.includes('Guardando') && !status.includes('Verificando');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-light-border bg-light-surface shadow-2xl dark:border-dark-border dark:bg-dark-surface">
        <div className="flex items-center justify-between border-b border-light-border bg-light-accent px-5 py-4 dark:border-dark-border dark:bg-dark-accent">
          <p className="font-semibold text-white">
            {mode === 'enroll' ? 'Registrar mi rostro' : 'Iniciar sesión con rostro'}
          </p>
          <button type="button" onClick={onClose} className="text-white/70 transition-colors hover:text-white">
            <FaTimes aria-hidden="true" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {modelError && (
            <p className="rounded-lg bg-light-error/10 px-3 py-2 text-sm text-light-error dark:bg-dark-error/10 dark:text-dark-error">
              {modelError}
            </p>
          )}

          {!modelsReady && !modelError && (
            <div className="flex items-center gap-2 text-sm text-light-text-secondary dark:text-dark-text-secondary">
              <FaSpinner className="animate-spin" aria-hidden="true" />
              Cargando modelos de IA ({mode === 'enroll' ? '~5s la primera vez' : '~5s'})...
            </div>
          )}

          <div className="relative overflow-hidden rounded-xl bg-black aspect-video">
            <video
              ref={videoRef}
              muted
              playsInline
              className="h-full w-full object-cover scale-x-[-1]"
            />
            {!cameraReady && modelsReady && (
              <div className="absolute inset-0 flex items-center justify-center text-white/60 text-sm">
                <FaSpinner className="animate-spin mr-2" /> Iniciando cámara...
              </div>
            )}
            {cameraReady && (
              <div className="absolute inset-0 border-2 border-light-accent/40 rounded-xl pointer-events-none">
                <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-light-accent rounded-tl" />
                <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-light-accent rounded-tr" />
                <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-light-accent rounded-bl" />
                <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-light-accent rounded-br" />
              </div>
            )}
          </div>

          {status && (
            <p className={`text-sm text-center font-medium ${isSuccess ? 'text-light-success dark:text-dark-success' : isError ? 'text-light-error dark:text-dark-error' : 'text-light-text-secondary dark:text-dark-text-secondary'}`}>
              {status}
            </p>
          )}

          <p className="text-xs text-center text-light-text-secondary dark:text-dark-text-secondary">
            Colócate frente a la cámara con buena iluminación
          </p>

          <button
            type="button"
            onClick={handleCapture}
            disabled={!cameraReady || working || !!isSuccess}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-light-accent px-5 py-2.5 font-semibold text-white transition-colors hover:opacity-90 disabled:opacity-50 dark:bg-dark-accent"
          >
            {working ? <FaSpinner className="animate-spin" aria-hidden="true" /> : <FaCamera aria-hidden="true" />}
            {working ? 'Procesando...' : mode === 'enroll' ? 'Capturar y guardar' : 'Identificarme'}
          </button>
        </div>
      </div>
    </div>
  );
}
