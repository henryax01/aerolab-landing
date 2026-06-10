import { useEffect, useState } from 'react';
import { FaUserCircle, FaTrash, FaSpinner } from 'react-icons/fa';
import api from '../../../utils/api.jsx';
import FaceCameraModal from '../../../components/common/FaceCameraModal.jsx';
import useFaceAuth from '../../../hooks/useFaceAuth.jsx';

export default function FaceEnroll({ token }) {
  const [enrolled, setEnrolled] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const { removeFace, working } = useFaceAuth();

  useEffect(() => {
    if (!token) return;
    api.get('/api/users/me/face-enrolled', { headers: { Authorization: `Bearer ${token}` } })
      .then(({ data }) => setEnrolled(data.enrolled))
      .catch(() => setEnrolled(false));
  }, [token]);

  const handleRemove = async () => {
    const ok = await removeFace(token);
    if (ok) setEnrolled(false);
  };

  return (
    <div className="rounded-lg border border-light-border bg-light-surface p-6 dark:border-dark-border dark:bg-dark-surface">
      <div className="flex items-center gap-3">
        <FaUserCircle aria-hidden="true" className="text-2xl text-light-accent dark:text-dark-accent" />
        <h3 className="text-lg font-semibold">Inicio de sesión con rostro</h3>
      </div>

      <p className="mt-2 text-sm text-light-text-secondary dark:text-dark-text-secondary">
        Registra tu rostro una vez para poder iniciar sesión sin contraseña apuntando la cámara.
      </p>

      <div className="mt-4 flex flex-wrap gap-3">
        {enrolled === null ? (
          <FaSpinner className="animate-spin text-light-text-secondary dark:text-dark-text-secondary" />
        ) : enrolled ? (
          <>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-light-success/15 px-3 py-1 text-xs font-semibold text-light-success dark:bg-dark-success/15 dark:text-dark-success">
              ✓ Rostro registrado
            </span>
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="rounded-md border border-light-border px-4 py-1.5 text-sm font-medium transition-colors hover:border-light-accent hover:text-light-accent dark:border-dark-border dark:hover:border-dark-accent dark:hover:text-dark-accent"
            >
              Actualizar rostro
            </button>
            <button
              type="button"
              onClick={handleRemove}
              disabled={working}
              className="flex items-center gap-1.5 rounded-md border border-light-error/40 px-4 py-1.5 text-sm font-medium text-light-error transition-colors hover:bg-light-error/10 disabled:opacity-50 dark:border-dark-error/40 dark:text-dark-error dark:hover:bg-dark-error/10"
            >
              <FaTrash aria-hidden="true" className="text-xs" />
              Eliminar
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="rounded-md bg-light-accent px-4 py-2 text-sm font-semibold text-white transition-colors hover:opacity-90 dark:bg-dark-accent"
          >
            Registrar mi rostro
          </button>
        )}
      </div>

      {showModal && (
        <FaceCameraModal
          mode="enroll"
          token={token}
          onSuccess={() => { setEnrolled(true); setShowModal(false); }}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
