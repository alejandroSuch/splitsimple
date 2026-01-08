import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { getUserData } from '../../services/expenses';
import Header from '../Layout/Header';
import CreateGroup from './CreateGroup';
import './Dashboard.css';

const Dashboard = () => {
  const { user, userData, logout } = useAuth();
  const [refreshKey, setRefreshKey] = useState(0);
  const [currentUserData, setCurrentUserData] = useState(userData);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const data = await getUserData(user.uid);
        setCurrentUserData(data);
      }
    };
    fetchUserData();
  }, [user, refreshKey]);

  const handleGroupCreated = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleGoToGroup = () => {
    if (currentUserData?.activeGroupId) {
      navigate(`/group/${currentUserData.activeGroupId}`);
    }
  };

  return (
    <div className="dashboard-container">
      <Header user={user} onLogout={logout} />

      <div className="dashboard-content">
        <div className="dashboard-card">
          <h2>Mi Grupo de Gastos</h2>

          {currentUserData?.activeGroupId ? (
            <div className="active-group">
              <p className="group-status">✓ Tienes un grupo activo</p>
              <button onClick={handleGoToGroup} className="btn-primary">
                Ver mi grupo
              </button>
            </div>
          ) : (
            <CreateGroup userId={user?.uid} onGroupCreated={handleGroupCreated} />
          )}

          <div className="info-box">
            <h3>ℹ️ Información</h3>
            <ul>
              <li>Solo puedes tener 1 grupo activo a la vez</li>
              <li>Comparte el link del grupo con tus amigos</li>
              <li>Cualquiera con el link puede agregar gastos</li>
              <li>Los grupos se eliminan automáticamente después de 90 días sin actividad</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
