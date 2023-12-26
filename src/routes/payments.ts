import { Router } from 'express'

import stripe0 from 'stripe'

const router = Router()
const stripe = new stripe0(
  'sk_test_51ORfVpSCUpMXoqT4LfYlhs6goXNeL3ZZIYZDK1i7rzqg998RR9KqxIxon43LO0dRJMdi3N5uUBwnCNkFEZRfkQFl00L6UoNhBt'
)

router.post('/create-payment-intent', async (req, res) => {
  const { amount, currency } = req.body

  console.log('amount: ', amount)

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 1099,
      currency: 'INR',
      description: 'Software development services',
    })

    res.status(200).json({ clientSecret: paymentIntent.client_secret })
  } catch (error) {
    console.error('Error creating payment intent:', error)
    res.status(500).json({ error: 'Failed to create payment intent' })
  }
})

//implement strip payment gateway

export { router as paymentsRouter }
