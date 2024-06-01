const { createClient } = require('@supabase/supabase-js')
const dotenv = require('dotenv')

dotenv.config()

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

export default defineEventHandler(async (event) => {
  // read the number of scraps out of the event body
  const body = await readBody(event)

  const limit = body.limit || 10

  const { data: scraps, error } = await supabase
    .from('scraps')
    .select('*')
    .limit(limit)
    .order('created_at', { ascending: false })

  if (error) {
    return new Response(JSON.stringify(error), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    })
  }

  return new Response(JSON.stringify(scraps), {
    headers: { 'content-type': 'application/json' },
  })
})
