import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

const PLAN_MAP = {
  'c9f4ff8e-2c39-4a81-b6d7-d8a8e61a167c': 'starter',
  'bf88084c-5bbb-4717-a969-f10f52e4222e': 'pro',
  'ccd56926-2843-40f7-b3fc-d9d7f8dfcd55': 'expert',
}

export const config = {
  api: {
    bodyParser: false,
  },
}

async function getRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = []
    req.on('data', chunk => chunks.push(chunk))
    req.on('end', () => resolve(Buffer.concat(chunks)))
    req.on('error', reject)
  })
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const rawBody = await getRawBody(req)
    const secret = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET
    const signature = req.headers['x-signature']

    const hmac = crypto.createHmac('sha256', secret)
    const digest = hmac.update(rawBody).digest('hex')

    if (signature !== digest) {
      console.error('Invalid signature', { signature, digest })
      return res.status(401).json({ error: 'Invalid signature' })
    }

    const event = req.headers['x-event-name']
    const data = JSON.parse(rawBody.toString())

    console.log('Webhook event:', event)

    if (event === 'subscription_created' || event === 'subscription_updated') {
      const email = data.data?.attributes?.user_email
      const variantId = String(data.data?.attributes?.variant_id || '')
      const status = data.data?.attributes?.status
      const endsAt = data.data?.attributes?.ends_at

      const plan = PLAN_MAP[variantId] || 'starter'
      const activePlan = status === 'active' ? plan : 'free'

      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email)
        .single()

      if (profile) {
        await supabase
          .from('profiles')
          .update({ plan: activePlan, plan_expires_at: endsAt })
          .eq('id', profile.id)

        console.log('Plan updated:', activePlan, 'for:', email)
      }
    }

    if (event === 'subscription_cancelled' || event === 'subscription_expired') {
      const email = data.data?.attributes?.user_email

      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email)
        .single()

      if (profile) {
        await supabase
          .from('profiles')
          .update({ plan: 'free' })
          .eq('id', profile.id)
      }
    }

    return res.status(200).json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return res.status(500).json({ error: error.message })
  }
}
