import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createGroup } from '../../services/expenses';
import './CreateGroup.css';

const CreateGroup = ({ userId, onGroupCreated }) => {
  const [groupName, setGroupName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const name = groupName.trim() || 'Nuevo Grupo';
      const groupId = await createGroup(userId, name);
      onGroupCreated();
      navigate(`/group/${groupId}`);
    } catch (err) {
      console.error('Error creating group:', err);
      setError('Error al crear el grupo. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-group">
      <p className="create-group-description">
        Crea un nuevo grupo para empezar a compartir gastos
      </p>

      <form onSubmit={handleCreateGroup} className="create-group-form">
        <input
          type="text"
          placeholder="Nombre del grupo (opcional)"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          className="group-name-input"
          maxLength={50}
        />

        <button type="submit" disabled={loading} className="btn-create">
          {loading ? 'Creando...' : '+ Crear Grupo'}
        </button>

        {error && <p className="error-message">{error}</p>}
      </form>
    </div>
  );
};

export default CreateGroup;
