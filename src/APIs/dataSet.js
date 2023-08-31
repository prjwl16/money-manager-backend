let Prompt
let Completion

Prompt = 'I bought tomatoes of 50 rs today.'
Completion = { amount: 50, currency: 'INR', particular: 'tomato', date: '09-08-2023', errors: [] }

Prompt = 'spent 1000 on movie tickets yesterday.'
Completion = {
  amount: 1000,
  currency: 'INR',
  action: 'expense',
  particular: 'movie tickets',
  date: '08-08-2023',
  errors: [],
}

Prompt = 'had pizza 3 days ago.'
Completion = {
  amount: null,
  currency: null,
  action: 'expense',
  particular: 'pizza',
  date: '06-08-2023',
  errors: [{ field: 'amount', error: 'amount is missing' }],
}

Prompt = 'bought pair of jeans'
Completion = {
  amount: null,
  currency: null,
  action: 'expense',
  particular: 'pair of jeans',
  date: null,
  errors: [
    { field: 'amount', error: 'amount is missing' },
    { field: 'currency', error: 'currency is missing' },
    { field: 'date', error: 'date is missing' },
  ],
}

Prompt = 'Spent 3k on flight tickets'
Completion = {
  amount: 3000,
  currency: 'INR',
  action: 'expense',
  particular: 'flight ticket',
  date: null,
  errors: [{ field: 'date', error: 'date is missing' }],
}

Prompt = 'received 3k refund on flight tickets'
Completion = {
  amount: 3000,
  currency: 'INR',
  action: 'refund',
  particular: 'flight ticket',
  date: null,
  errors: [{ field: 'date', error: 'date is missing' }],
}

Prompt = 'received my salary 30k yesterday'
Completion = { amount: 30000, currency: 'INR', action: 'income', particular: 'salary', date: '08-08-2023', errors: [] }

Prompt = 'received my salary 30k yesterday'
Completion = { amount: 30000, currency: 'INR', action: 'income', particular: 'salary', date: '08-08-2023', errors: [] }

console.log('prompt: ', prompt)
console.log('Completion: ', Completion)
