import { useState } from 'react';
import { deleteExpense } from '../../services/expenses';
import { formatCurrency } from '../../utils/balanceCalculator';
import './ExpenseList.css';

const ExpenseList = ({ expenses, groupId }) => {
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (expenseId) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este gasto?')) {
      return;
    }

    setDeletingId(expenseId);
    try {
      await deleteExpense(groupId, expenseId);
    } catch (err) {
      console.error('Error deleting expense:', err);
      alert('Error al eliminar el gasto. Inténtalo de nuevo.');
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  if (expenses.length === 0) {
    return (
      <div className="empty-state">
        <p>No hay gastos todavía</p>
        <p className="empty-state-hint">Agrega el primer gasto para comenzar</p>
      </div>
    );
  }

  return (
    <div className="expense-list">
      {expenses.map(expense => (
        <div key={expense.id} className="expense-item">
          <div className="expense-info">
            <div className="expense-header">
              <span className="expense-description">{expense.description}</span>
              <span className="expense-amount">{formatCurrency(expense.amount)}</span>
            </div>
            <div className="expense-meta">
              <span className="expense-payer">Pagado por {expense.paidBy}</span>
              <span className="expense-date">{formatDate(expense.createdAt)}</span>
            </div>
          </div>
          <button
            onClick={() => handleDelete(expense.id)}
            disabled={deletingId === expense.id}
            className="btn-delete"
            title="Eliminar gasto"
          >
            {deletingId === expense.id ? '...' : '🗑️'}
          </button>
        </div>
      ))}
    </div>
  );
};

export default ExpenseList;
