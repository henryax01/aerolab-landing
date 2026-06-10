import { useCallback, useEffect, useRef, useState } from 'react';
import * as faceapi from '@vladmandic/face-api';
import { FaCamera, FaStop, FaSpinner } from 'react-icons/fa';
import useFaceModels from '../../hooks/useFaceModels.jsx';
import usePageMeta from '../../hooks/usePageMeta.jsx';

export const pageMetadata = {
  path: '/face-demo',
  label: 'Demo Facial IA',
  category: 'general',
  minRoleLevel: 0,
  maxRoleLevel: Infinity,
  order: 10,
  locations: [],
  description: 'Demo de reconocimiento facial en tiempo real con IA',
  icon: 'FaUserCircle',
  isSearchable: true,
};

const EXPRESSION_LABELS = {
  neutral: 'Neutral',
  happy: 'Feliz 😊',
  sad: 'Triste 😢',
  angry: 'Enojado 😠',
  fearful: 'Asustado 😨',
  disgusted: 'Disgustado 🤢',
  surprised: 'Sorprendido 😲',
};

export default function FaceDemo() {
  usePageMeta('face-demo', pageMetadata.path);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const rafRef = useRef(null);
  const { ready, error: modelError } = useFaceModels();
  const [running, setRunning] = useState(false);
  const [stats, setStats] = useState(null);
  const [cameraError, setCameraError] = useState(null);

  const stopDetection = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    const canvas = canvasRef.current;
    if (canvas) canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    setRunning(false);
    setStats(null);
  }, []);

  useEffect(() => () => stopDetection(), [stopDetection]);

  const startDetection = useCallback(async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user', width: 640, height: 480 } });
      streamRef.current = stream;
      const video = videoRef.current;
      video.srcObject = stream;
      await video.play();
      setRunning(true);

      const detect = async () => {
        if (!videoRef.current || !canvasRef.current) return;
        const detections = await faceapi
          .detectAllFaces(video, new faceapi.SsdMobilenetv1Options({ minConfidence: 0.5 }))
          .withFaceLandmarks()
          .withFaceExpressions()
          .withAgeAndGender();

        const canvas = canvasRef.current;
        const dims = { width: video.videoWidth, height: video.videoHeight };
        faceapi.matchDimensions(canvas, dims);
        const resized = faceapi.resizeResults(detections, dims);

        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        faceapi.draw.drawDetections(canvas, resized);
        faceapi.draw.drawFaceLandmarks(canvas, resized);

        if (detections.length > 0) {
          const d = detections[0];
          const topExpr = Object.entries(d.expressions).reduce((a, b) => (b[1] > a[1] ? b : a));
          setStats({
            faces: detections.length,
            age: Math.round(d.age),
            gender: d.gender === 'male' ? 'Hombre' : 'Mujer',
            genderConf: Math.round(d.genderProbability * 100),
            expression: EXPRESSION_LABELS[topExpr[0]] ?? topExpr[0],
            exprConf: Math.round(topExpr[1] * 100),
          });
        } else {
          setStats(null);
        }

        rafRef.current = requestAnimationFrame(detect);
      };

      rafRef.current = requestAnimationFrame(detect);
    } catch {
      setCameraError('No se pudo acceder a la cámara. Verifica los permisos del navegador.');
    }
  }, []);

  return (
    <div className="bg-light-background text-light-text-primary dark:bg-dark-background dark:text-dark-text-primary">
      <section className="mx-auto max-w-4xl px-4 py-16 text-center">
        <span className="inline-block rounded-full bg-light-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-light-accent dark:bg-dark-accent/10 dark:text-dark-accent">
          IA en tiempo real
        </span>
        <h1 className="mt-3 text-4xl font-extrabold tracking-tight">Demo de Reconocimiento Facial</h1>
        <p className="mx-auto mt-3 max-w-xl text-light-text-secondary dark:text-dark-text-secondary">
          Detecta rostros, expresiones, edad y género directo en tu navegador — sin enviar datos a ningún servidor.
        </p>
      </section>

      <section className="mx-auto max-w-5xl px-4 pb-20">
        <div className="grid gap-6 lg:grid-cols-[3fr_2fr] items-start">
          <div className="relative overflow-hidden rounded-2xl border border-light-border bg-black shadow-lg dark:border-dark-border">
            <video
              ref={videoRef}
              muted
              playsInline
              className="w-full object-cover scale-x-[-1]"
              style={{ minHeight: '320px' }}
            />
            <canvas
              ref={canvasRef}
              className="absolute inset-0 w-full h-full scale-x-[-1]"
            />
            {!running && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                <p className="text-white/60 text-sm">Cámara inactiva</p>
              </div>
            )}
          </div>

          <div className="space-y-4">
            {modelError && (
              <p className="rounded-lg bg-light-error/10 px-4 py-3 text-sm text-light-error dark:bg-dark-error/10 dark:text-dark-error">
                {modelError}
              </p>
            )}
            {cameraError && (
              <p className="rounded-lg bg-light-error/10 px-4 py-3 text-sm text-light-error dark:bg-dark-error/10 dark:text-dark-error">
                {cameraError}
              </p>
            )}

            {!ready && !modelError && (
              <div className="flex items-center gap-2 rounded-lg border border-light-border bg-light-surface px-4 py-3 text-sm dark:border-dark-border dark:bg-dark-surface">
                <FaSpinner className="animate-spin text-light-accent dark:text-dark-accent" aria-hidden="true" />
                <span>Cargando modelos de IA (~5s la primera vez)...</span>
              </div>
            )}

            {stats ? (
              <div className="rounded-xl border border-light-border bg-light-surface p-5 dark:border-dark-border dark:bg-dark-surface space-y-3">
                <h2 className="font-semibold text-sm uppercase tracking-wide text-light-text-secondary dark:text-dark-text-secondary">
                  Análisis en vivo
                </h2>
                {[
                  { label: 'Rostros detectados', value: stats.faces },
                  { label: 'Edad estimada', value: `~${stats.age} años` },
                  { label: 'Género', value: `${stats.gender} (${stats.genderConf}%)` },
                  { label: 'Expresión', value: `${stats.expression} (${stats.exprConf}%)` },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between gap-4">
                    <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary">{label}</span>
                    <span className="text-sm font-semibold">{value}</span>
                  </div>
                ))}
              </div>
            ) : running ? (
              <div className="rounded-xl border border-light-border bg-light-surface px-5 py-8 text-center text-sm text-light-text-secondary dark:border-dark-border dark:bg-dark-surface dark:text-dark-text-secondary">
                Buscando rostros...
              </div>
            ) : null}

            <button
              type="button"
              onClick={running ? stopDetection : startDetection}
              disabled={!ready}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-light-accent px-5 py-3 font-semibold text-white transition-colors hover:opacity-90 disabled:opacity-50 dark:bg-dark-accent"
            >
              {running ? <FaStop aria-hidden="true" /> : <FaCamera aria-hidden="true" />}
              {running ? 'Detener cámara' : 'Iniciar detección'}
            </button>

            <p className="text-xs text-center text-light-text-secondary dark:text-dark-text-secondary">
              Todo el procesamiento ocurre localmente en tu dispositivo. No se envía ninguna imagen al servidor.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
