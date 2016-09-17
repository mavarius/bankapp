// MVP
  // DONE: User can add new transactions to account
  // TODO: User can edit transactions
  // DONE: User can delete transactions
  // DONE: User can view account balance
  // DONE: User can make both credit and debit transactions
  // TODO: Balance updates with edit and delete
  // DONE: User can see when transactions were made
// EXTRA FEATURES LEVEL 1
  // ODNE: User can give transactions discriptions
  // TODO: User can view who they paid/received money from
  // TODO: User can sort transactions
  // TODO: User can filter transactions
  // TODO: User can search transactions
  // TODO: Form field validation
  // TODO: Animation
// EXTRA FEATURES LEVEL 2
// TODO: Implement Web Storage
// TODO: User can transfer money between accounts
// TODO: User can view graph of acount timeline

const App = React.createClass({
  getInitialState() {
    return {
      transactions: [],
      currentBalance: 0
    }
  },

  // TRANSACTION ACTION: SAVE
  saveTransaction(transaction) {
    const { transactions } = this.state;

    this.setState({
      transactions: [...transactions, transaction]
    })
  },

  // TRANSACTION ACTION: EDIT
  editTransaction(id) {
    const { transactions } = this.state;
  },

  // TRANSACTION ACTION: DELETE
  deleteTransaction(id) {
    const { transactions } = this.state;

    this.setState({
      transactions: transactions.filter(transaction => transaction.id !== id)
    })
  },

  // HANDLE BALANCE UPDATES
  updateBalance(transactionAmount) {
    const { currentBalance } = this.state;

    let newBalance = parseFloat(currentBalance) + parseFloat(transactionAmount)

    this.setState({
      currentBalance: newBalance
    })
  },

  render() {
    const { transactions, currentBalance } = this.state;

    return (
      <div className="container">
        <div className="row">
          <h1>Banking App</h1>
        </div>
        <div className="row accountSummary">
          <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#transactionFormModal">New Transaction</button>
          <div className="accountBalance">
            <p>Current Balance</p>
            <h2>${currentBalance}</h2>
          </div>
        </div>

        <div className="modal fade" id="transactionFormModal" tabIndex="-1" role="dialog" aria-labelledby="transactionFormModal" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
                <h4 className="modal-title" id="myModalLabel">Transaction Details</h4>
              </div>
              <div className="modal-body">
                <TransactionForm saveTransaction={this.saveTransaction} updateBalance={this.updateBalance} currentBalance={currentBalance}/>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <AccountDetails transactions={transactions} editTransaction={this.editTransaction} deleteTransaction={this.deleteTransaction}/>
        </div>
      </div>
    )
  }
})

const AccountDetails = props => {
  const { transaction, transactions, editTransaction, deleteTransaction } = props;

  return (
    <table className="table">
      <thead>
        <tr>
          <th>Date</th>
          <th>Transaction Details</th>
          <th>Amount</th>
          <th>Account Balance</th>
          <th>Edit</th>
          <th>Delete</th>
        </tr>
      </thead>
      <tbody>
        {transactions.map(transaction => (
          <tr key={transaction.id} id={transaction.id} className="entryID">
            <td className="entryDate">{transaction.date}</td>
            <td className="entryDetails">{transaction.details}</td>
            <td className="entryAmount">${transaction.amount}</td>
            <td className="entryBalance">${transaction.balance}</td>
            <td className="entryEdit"><button onClick={editTransaction.bind(null, transaction.id)} className="btn btn-sm btn-warning">edit</button></td>
            <td className="entryDelete"><button onClick={deleteTransaction.bind(null, transaction.id)} className="btn btn-sm btn-danger">X</button></td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

const TransactionForm = React.createClass({
  submitForm(e) {
    e.preventDefault();

    const { currentBalance } = this.props;

    let { details, amount, balance, credit, debit } = this.refs;

    let newDate = moment().format('MMM DD, YYYY');

    let newID = uuid();

    if (debit.checked) {
      amount.value = parseFloat(amount.value) * -1
    }

    let transaction = {
      id: newID,
      date: newDate,
      details: details.value,
      amount: amount.value,
      balance: currentBalance + parseFloat(amount.value),
      credit: credit.value,
      debit: debit.value
    }

    this.setState

    this.props.saveTransaction(transaction)
    this.props.updateBalance(transaction.amount)
  },

  render() {
    return (
      <form id="transactionForm">
        <div className="form-group row">
          <label htmlFor="trDetails" className="col-sm-2 col-form-label col-form-label-sm">Details</label>
          <div className="col-sm-10">
            <input type="text" ref="details" className="form-control form-control-sm" id="trDetails" placeholder="Hell &amp; Co"/>
          </div>
        </div>
        <div className="form-group row">
          <label htmlFor="trAmount" className="col-sm-2 col-form-label col-form-label-sm">Amount</label>
          <div className="col-sm-10">
            <p>$</p><input type="number" ref="amount" className="form-control form-control-sm" id="trAmount" placeholder="0.00" min="0" step="0.01" required/>
          </div>
        </div>
        <fieldset className="form-group row">
        <div className="form-check">
          <label className="form-check-label">
            <input className="form-check-input" ref="credit" type="radio" name="radios" id="credit"/>
            Credit
          </label>
        </div>
        <div className="form-check">
          <label className="form-check-label">
            <input className="form-check-input" ref="debit" type="radio" name="radios" id="debit"/>
            Debit
          </label>
        </div>
      </fieldset>
        <div className="formButtons">
          <button type="button" id="cancelForm" className="btn btn-default" data-dismiss="modal">Cancel</button>
          <button type="button" onClick={this.submitForm} id="saveForm" className="btn btn-success" data-dismiss="modal">Save</button>
        </div>
      </form>
      )
    }
  })

ReactDOM.render(
  <App/>,
  document.getElementById('root')
)
