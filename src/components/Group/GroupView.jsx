import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useExpenses } from '../../hooks/useExpenses';
import { getGroup, closeGroup } from '../../services/expenses';
import Header from '../Layout/Header';
import ShareLink from '../Layout/ShareLink';
import ExpenseForm from './ExpenseForm';
import ExpenseList from './ExpenseList';
import Balance from './Balance';
import './GroupView.css';

const GroupView = () => {
  const { groupId } = useParams();
  const { user, logout } = useAuth();
  const { expenses, loading } = useExpenses(groupId);
  const [group, setGroup] = useState(null);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGroup = async () => {
      const groupData = await getGroup(groupId);
      setGroup(groupData);
    };
    fetchGroup();
  }, [groupId]);

  const handleCloseGroup = async () => {
    if (window.confirm('¿Estás seguro de que quieres cerrar este grupo? Podrás crear uno nuevo.')) {
      await closeGroup(user.uid, groupId);
      navigate('/dashboard');
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <p>Cargando...</p>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="error-container">
        <h2>Grupo no encontrado</h2>
        <p>Este grupo no existe o ha sido eliminado.</p>
      </div>
    );
  }

  return (
    <div className="group-view-container">
      <Header user={user} onLogout={logout} showBackButton />

      <div className="group-content">
        <div className="group-header">
          <div className="group-title">
            <h1>{group.name || 'Grupo de Gastos'}</h1>
            <ShareLink groupId={groupId} />
          </div>

          {user && group.creatorId === user.uid && (
            <button onClick={handleCloseGroup} className="btn-close-group">
              Cerrar Grupo
            </button>
          )}
        </div>

        <div className="group-grid">
          <div className="expenses-section">
            <div className="section-header">
              <h2>Gastos</h2>
              <button
                onClick={() => setShowExpenseForm(!showExpenseForm)}
                className="btn-add-expense"
              >
                {showExpenseForm ? '− Cancelar' : '+ Agregar Gasto'}
              </button>
            </div>

            {showExpenseForm && (
              <ExpenseForm
                groupId={groupId}
                onSuccess={() => setShowExpenseForm(false)}
              />
            )}

            <ExpenseList
              expenses={expenses}
              groupId={groupId}
            />
          </div>

          <div className="balance-section">
            <Balance expenses={expenses} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupView;
