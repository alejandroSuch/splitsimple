import { calculateBalances, formatCurrency } from '../../utils/balanceCalculator';
import './Balance.css';

const Balance = ({ expenses }) => {
  const { balances, transactions, totalExpenses, sharePerPerson } = calculateBalances(expenses);

  if (expenses.length === 0) {
    return (
      <div className="balance-container">
        <h2>Balance</h2>
        <div className="empty-balance">
          <p>No hay gastos para calcular</p>
        </div>
      </div>
    );
  }

  const people = Object.keys(balances);

  return (
    <div className="balance-container">
      <h2>Balance</h2>

      <div className="summary-box">
        <div className="summary-item">
          <span className="summary-label">Total gastado:</span>
          <span className="summary-value">{formatCurrency(totalExpenses)}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Por persona:</span>
          <span className="summary-value">{formatCurrency(sharePerPerson)}</span>
        </div>
      </div>

      <div className="balances-section">
        <h3>Estado de cuentas</h3>
        <div className="balance-list">
          {people.map(person => {
            const balance = balances[person];
            const isPositive = balance > 0.01;
            const isNegative = balance < -0.01;

            return (
              <div key={person} className="balance-item">
                <span className="person-name">{person}</span>
                <span className={`balance-amount ${isPositive ? 'positive' : isNegative ? 'negative' : 'neutral'}`}>
                  {isPositive && '+'}
                  {formatCurrency(balance)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {transactions.length > 0 && (
        <div className="transactions-section">
          <h3>Cómo saldar las cuentas</h3>
          <div className="transaction-list">
            {transactions.map((transaction, index) => (
              <div key={index} className="transaction-item">
                <div className="transaction-flow">
                  <span className="from-person">{transaction.from}</span>
                  <span className="arrow">→</span>
                  <span className="to-person">{transaction.to}</span>
                </div>
                <span className="transaction-amount">
                  {formatCurrency(transaction.amount)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {transactions.length === 0 && (
        <div className="all-settled">
          <p>✓ Todas las cuentas están saldadas</p>
        </div>
      )}
    </div>
  );
};

export default Balance;
