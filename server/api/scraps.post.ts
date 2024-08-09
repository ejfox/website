import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

export default defineEventHandler(async (event) => {
  const supabaseUrl = process.env.SUPABASE_URL || ''
  const supabaseKey = process.env.SUPABASE_KEY || ''
  const supabase = createClient(supabaseUrl, supabaseKey)
  const body = await readBody(event)
  const page = body?.page || 1
  const pageSize = body?.pageSize || 20
  const offset = (page - 1) * pageSize

  const {
    data: scraps,
    error,
    count,
  } = await supabase
    .from('scraps')
    .select('*', { count: 'exact' })
    .range(offset, offset + pageSize - 1)
    .order('created_at', { ascending: false })

  if (error) {
    return new Response(JSON.stringify(error), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    })
  }

  return new Response(JSON.stringify({ scraps, count }), {
    headers: { 'content-type': 'application/json' },
  })
})
