import { useEffect, useState } from 'react';
import * as faceapi from '@vladmandic/face-api';

const MODEL_URL = '/models';
let modelsLoaded = false;
let loadingPromise = null;

export default function useFaceModels() {
  const [ready, setReady] = useState(modelsLoaded);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (modelsLoaded) { setReady(true); return; }
    if (!loadingPromise) {
      loadingPromise = Promise.all([
        faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
        faceapi.nets.ageGenderNet.loadFromUri(MODEL_URL),
      ]).then(() => { modelsLoaded = true; });
    }
    loadingPromise
      .then(() => setReady(true))
      .catch((e) => setError(e.message ?? 'Error cargando modelos de IA'));
  }, []);

  return { ready, error };
}
