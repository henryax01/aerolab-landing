import { useCallback, useRef, useState } from 'react';
import * as faceapi from '@vladmandic/face-api';
import api from '../utils/api.jsx';

export default function useFaceAuth() {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [status, setStatus] = useState(null);
  const [working, setWorking] = useState(false);

  const startCamera = useCallback(async (videoEl) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      videoEl.srcObject = stream;
      streamRef.current = stream;
      videoRef.current = videoEl;
      await videoEl.play();
    } catch {
      throw new Error('No se pudo acceder a la cámara. Verifica los permisos.');
    }
  }, []);

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
  }, []);

  const detectDescriptor = useCallback(async (videoEl) => {
    const detection = await faceapi
      .detectSingleFace(videoEl, new faceapi.SsdMobilenetv1Options({ minConfidence: 0.5 }))
      .withFaceLandmarks()
      .withFaceDescriptor();
    if (!detection) throw new Error('No se detectó ningún rostro. Asegúrate de estar bien iluminado y frente a la cámara.');
    return Array.from(detection.descriptor);
  }, []);

  const enrollFace = useCallback(async (videoEl, token) => {
    setWorking(true);
    setStatus('Detectando rostro...');
    try {
      const descriptor = await detectDescriptor(videoEl);
      setStatus('Guardando rostro...');
      await api.put('/api/users/me/face-descriptor', { descriptor }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStatus('¡Rostro registrado correctamente!');
      return true;
    } catch (e) {
      setStatus(e.response?.data?.detail ?? e.message);
      return false;
    } finally {
      setWorking(false);
    }
  }, [detectDescriptor]);

  const loginWithFace = useCallback(async (email, videoEl) => {
    setWorking(true);
    setStatus('Detectando rostro...');
    try {
      const descriptor = await detectDescriptor(videoEl);
      setStatus('Verificando identidad...');
      const { data } = await api.post('/api/auth/face-login', { email, descriptor });
      setStatus('¡Acceso concedido!');
      return data;
    } catch (e) {
      const msg = e.response?.data?.detail ?? e.message;
      setStatus(msg);
      throw new Error(msg);
    } finally {
      setWorking(false);
    }
  }, [detectDescriptor]);

  const removeFace = useCallback(async (token) => {
    setWorking(true);
    try {
      await api.delete('/api/users/me/face-descriptor', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStatus('Rostro eliminado.');
      return true;
    } catch (e) {
      setStatus(e.response?.data?.detail ?? e.message);
      return false;
    } finally {
      setWorking(false);
    }
  }, []);

  return { startCamera, stopCamera, enrollFace, loginWithFace, removeFace, status, working };
}
