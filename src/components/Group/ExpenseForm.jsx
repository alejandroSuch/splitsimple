import { useState } from 'react';
import { addExpense } from '../../services/expenses';
import './ExpenseForm.css';

const ExpenseForm = ({ groupId, onSuccess }) => {
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    paidBy: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!formData.description || !formData.amount || !formData.paidBy) {
      setError('Por favor completa todos los campos');
      setLoading(false);
      return;
    }

    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      setError('El monto debe ser un número mayor a 0');
      setLoading(false);
      return;
    }

    try {
      await addExpense(groupId, {
        description: formData.description.trim(),
        amount: amount,
        paidBy: formData.paidBy.trim()
      });

      setFormData({
        description: '',
        amount: '',
        paidBy: ''
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error('Error adding expense:', err);
      setError('Error al agregar el gasto. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="expense-form">
      <div className="form-group">
        <label htmlFor="description">Descripción</label>
        <input
          type="text"
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Ej: Cena restaurante"
          maxLength={100}
          disabled={loading}
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="amount">Monto (€)</label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="0.00"
            step="0.01"
            min="0"
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="paidBy">Pagado por</label>
          <input
            type="text"
            id="paidBy"
            name="paidBy"
            value={formData.paidBy}
            onChange={handleChange}
            placeholder="Nombre"
            maxLength={50}
            disabled={loading}
          />
        </div>
      </div>

      {error && <p className="form-error">{error}</p>}

      <button type="submit" disabled={loading} className="btn-submit">
        {loading ? 'Agregando...' : 'Agregar Gasto'}
      </button>
    </form>
  );
};

export default ExpenseForm;
