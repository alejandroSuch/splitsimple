/**
 * Calcula quién debe dinero a quién
 * @param {Array} expenses - Array de gastos
 * @returns {Object} { balances, transactions, totalExpenses, sharePerPerson }
 */
export function calculateBalances(expenses) {
  if (!expenses || expenses.length === 0) {
    return {
      balances: {},
      transactions: [],
      totalExpenses: 0,
      sharePerPerson: 0
    };
  }

  // 1. Calcular balance neto por persona (cuánto pagó cada uno)
  const netBalances = {};

  expenses.forEach(expense => {
    const { paidBy, amount } = expense;

    // Quien pagó tiene saldo positivo
    if (!netBalances[paidBy]) {
      netBalances[paidBy] = 0;
    }
    netBalances[paidBy] += parseFloat(amount);
  });

  // 2. Calcular cuánto debe cada uno (dividir total entre todos)
  const totalExpenses = expenses.reduce((sum, e) => sum + parseFloat(e.amount), 0);
  const people = Object.keys(netBalances);
  const sharePerPerson = totalExpenses / people.length;

  // 3. Calcular balance final (cuánto pagaron - cuánto deben)
  const finalBalances = {};
  people.forEach(person => {
    finalBalances[person] = netBalances[person] - sharePerPerson;
  });

  // 4. Generar transacciones óptimas
  const transactions = minimizeTransactions(finalBalances);

  return {
    balances: finalBalances,
    transactions,
    totalExpenses,
    sharePerPerson
  };
}

/**
 * Minimiza el número de transacciones necesarias
 * Algoritmo greedy para emparejar deudores con acreedores
 */
function minimizeTransactions(balances) {
  const transactions = [];

  // Separar deudores y acreedores
  const debtors = [];
  const creditors = [];

  Object.entries(balances).forEach(([person, balance]) => {
    if (balance < -0.01) {
      // Debe dinero
      debtors.push({ person, amount: Math.abs(balance) });
    } else if (balance > 0.01) {
      // Le deben dinero
      creditors.push({ person, amount: balance });
    }
  });

  // Algoritmo greedy para minimizar transacciones
  let i = 0, j = 0;

  while (i < debtors.length && j < creditors.length) {
    const debtor = debtors[i];
    const creditor = creditors[j];

    const amount = Math.min(debtor.amount, creditor.amount);

    if (amount > 0.01) {
      transactions.push({
        from: debtor.person,
        to: creditor.person,
        amount: parseFloat(amount.toFixed(2))
      });
    }

    debtor.amount -= amount;
    creditor.amount -= amount;

    if (debtor.amount < 0.01) i++;
    if (creditor.amount < 0.01) j++;
  }

  return transactions;
}

/**
 * Formatea un monto de dinero
 */
export function formatCurrency(amount) {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount);
}
