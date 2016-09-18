// MVP
  // DONE: User can add new transactions to account
  // DONE: User can edit transactions
  // FIXME: First Letter of edit goes live
  // DONE: User can delete transactions
  // DONE: User can view account balance
  // DONE: User can make both credit and debit transactions
  // TODO: Balance updates with edit and delete
  // DONE: User can see when transactions were made
// EXTRA FEATURES LEVEL 1
  // DONE: User can give transactions discriptions
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
      currentBalance: 0,
      currentlyEditing: {},
      toUpdateWith: {
        details: "",
        amount: "",
        debit: false
      }
    }
  },

  // TRANSACTION ACTION: SAVE
  saveTransaction(transaction) {
    const { transactions, currentlyEditing } = this.state;

    let current = [];
    current = transactions.filter(transaction => transaction.id === currentlyEditing.id)

    let update = [];

    if (current.length === 0) {
      update = [...transactions, transaction]
    } else {
      update = transactions.map((item) => {
        if (transaction.id === item.id) {
          return transaction
        } else {
          return item
        }
      })
    }

    let total = this.updateBalance(update)

    this.setState({
      transactions: update,
      currentBalance: total,
      currentlyEditing: {},
      toUpdateWith: {
        details: "",
        amount: "",
        debit: false}
    })
  },

  // TRANSACTION ACTION: DELETE
  deleteTransaction(id) {
    const { transactions } = this.state;

    this.setState({
      transactions: transactions.filter(transaction => transaction.id !== id)
    })
  },

  updateForm(event) {
    const { toUpdateWith } = this.state;
    event.preventDefault();

    let key = event.target.name;
    let value = event.target.value;
    toUpdateWith[key] = value;

    let toUpdate = Object.assign({}, this.props.currentlyEditing, toUpdateWith);

    this.setState({
      toUpdateWith: toUpdate
    });
  },

  cancelForm(event) {
    this.setState({
      currentlyEditing: {},
      toUpdateWith: {
        details: "",
        amount: "",
        debit: false
      }
    })
  },

  // TRANSACTION ACTION: EDIT
  editTransaction(id) {
    const { transactions, toUpdateWith, currentlyEditing } = this.state;

    let current = transactions.filter(transaction => transaction.id === id)

    this.setState({
      currentlyEditing: current[0],
      toUpdateWith: current[0]
    })
  },

  // HANDLE BALANCE UPDATES
  updateBalance(updatedArray) {
    let total = 0;

    total = updatedArray.reduce((acc, curr) => {
      if (curr.debit) {
        return (parseFloat(curr.amount)*-1)+acc
      } else {
        return parseFloat(curr.amount)+acc
      }
    }, 0)

    console.log('total: ',total);
    return total
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
                <TransactionForm updateForm={this.updateForm} cancelForm={this.cancelForm} currentlyEditing={this.state.currentlyEditing} toUpdateWith={this.state.toUpdateWith} saveTransaction={this.saveTransaction} editTransaction={this.editTransaction} updateBalance={this.updateBalance} currentBalance={currentBalance}/>
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
            <td className="entryEdit"><button onClick={editTransaction.bind(null, transaction.id)} className="btn btn-sm btn-warning" data-toggle="modal" data-target="#transactionFormModal">edit</button></td>
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

    const { currentBalance, transactions, currentlyEditing } = this.props;

    let { details, amount, debit } = this.refs;
    let transaction = {};

    if (!currentlyEditing.id) {
      let newDate = moment().format('MMM DD');
      let newID = uuid();

      transaction = {
        id: newID,
        date: newDate,
        details: details.value,
        amount: amount.value,
        debit: debit.checked
      }
    } else {
      transaction = {
        id: currentlyEditing.id,
        date: currentlyEditing.date,
        details: details.value,
        amount: amount.value,
        debit: debit.checked
      }
    }

    this.props.saveTransaction(transaction)
  },

  render() {
    let details, amount, debit, credit;
    // console.log("this.props.currentlyEditing: ", this.props.currentlyEditing);
    if (this.props.toUpdateWith) {
      details = this.props.toUpdateWith.details;
      amount = this.props.toUpdateWith.amount;
      debit = this.props.toUpdateWith.debit;
      credit = this.props.toUpdateWith.credit;
    }
    // console.log('toUpdateWith: ', this.props.toUpdateWith);

    return (
      <form id="transactionForm">

        <div className="form-group row">
          <label htmlFor="trDetails" className="col-sm-2 col-form-label">Details</label>
          <div className="col-sm-10">
            <input type="text" ref="details" value={details} name="details" onChange={this.props.updateForm} className="form-control form-control-sm" id="trDetails" placeholder="Hell &amp; Co"/>
          </div>
        </div>

        <div className="form-group row">
          <label htmlFor="trAmount" className="col-sm-2 col-form-label col-form-label-sm">Amount</label>
          <div className="col-sm-10">
            <input type="number" ref="amount" value={amount} name="amount" onChange={this.props.updateForm} className="form-control form-control-sm" id="trAmount" placeholder="0.00" min="0" step="0.01" required/>
          </div>
        </div>

        <fieldset className="form-group">
          <div className="btn-group" data-toggle="buttons">
            <label className="btn btn-primary active">
              credit<input className="form-check-input" ref="credit" value={credit} name="credit" onChange={this.props.updateForm} type="radio" name="radios" id="credit"/>
            </label>
            <label className="btn btn-primary">
              debit<input className="form-check-input" ref="debit" value={debit} name="debit" onChange={this.props.updateForm} type="radio" name="radios" id="debit"/>
            </label>
          </div>
        </fieldset>

        <div className="formButtons">
          <button type="button" onClick={this.props.cancelForm} className="btn btn-default" data-dismiss="modal">Cancel</button>
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
