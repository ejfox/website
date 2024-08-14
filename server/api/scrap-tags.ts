import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

export default defineEventHandler(async (event) => {
  const supabaseUrl = process.env.SUPABASE_URL || ''
  const supabaseKey = process.env.SUPABASE_KEY || ''
  const supabase = createClient(supabaseUrl, supabaseKey)
  const body = await readBody(event)

  // Get the tags from the request body
  const tags = body?.tags || []

  // console.log('tags', tags)
  const { data: scraps, error } = await supabase
    .from('scraps')
    .select('*', { count: 'exact' })
    // tags column string has the tag in it
    // .like('tags', `%${tags[0]}%`)
    .ilikeAnyOf(
      'tags',
      tags.map((tag: any) => `%${tag}%`),
    )
    // .order('created_at', { ascending: false })
    .limit(20)

  if (error) {
    console.error('error', error)
    return new Response(JSON.stringify({ error }), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    })
  }

  // console.log('scraps', scraps)

  return new Response(JSON.stringify(scraps), {
    headers: { 'content-type': 'application/json' },
  })
})
