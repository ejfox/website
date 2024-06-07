---
dek: In which we put words into space and then explore the constellations they create
inprogress: true
date: 2023-07-16T16:34:14-04:00
modified: 2023-07-17T20:29:11-04:00
tags: programming howto machinelearning
---

# Getting started with embeddings in JS

[pgvector: Embeddings and vector similarity](https://supabase.com/docs/guides/database/extensions/pgvector)

[Storing OpenAI embeddings in Postgres with pgvector](https://supabase.com/blog/openai-embeddings-postgres-vector)

```js
async function memoryToEmbedding(memory) {
  const embedding = openai.createEmbedding({
    model: 'text-embedding-ada-002',
    input: memory,
  });
  return embedding;
}
```

```js
const title = 'First post!'
const body = 'Hello world!'

// Generate a vector using OpenAI
const embeddingResponse = await openai.createEmbedding({
  model: 'text-embedding-ada-002',
  input: body,
})

const [{ embedding }] = embeddingResponse.data.data

// Store the vector in Postgres
const { data, error } = await supabase.from('posts').insert({
  title,
  body,
  embedding,
})
```


Need to create `match_documents` function: [Database Functions | Supabase Docs](https://supabase.com/docs/guides/database/functions)

[Storing OpenAI embeddings in Postgres with pgvector](https://supabase.com/blog/openai-embeddings-postgres-vector)

```sql
create or replace function match_documents (
  query_embedding vector(1536),
  match_threshold float,
  match_count int
)
returns table (
  id bigint,
  content text,
  similarity float
)
language sql stable
as $$
  select
    documents.id,
    documents.content,
    1 - (documents.embedding <=> query_embedding) as similarity
  from documents
  where 1 - (documents.embedding <=> query_embedding) > match_threshold
  order by similarity desc
  limit match_count;
$$;
```




> pgvector introduces 3 new operators that can be used to calculate similarity:
	- `<->` Euclidean distance
	- `<#>` Negative inner product
	- `<=>` Cosine distance

```js
async function getRelevantMemories(queryString, limit = 5) {
  // turn the queryString into an embedding
  const embeddingResponse = await openai.createEmbedding({
    model: 'text-embedding-ada-002',
    input: queryString.toString(),
  })

  const [{ embedding }] = embeddingResponse.data.data

  // query the database for the most relevant memories
  const { data, error } = await supabase.rpc('match_documents', { 
    query_embedding: embedding,
    match_threshold: 0.78,
    match_count: limit
  });

  if (error) {
    console.error("Error fetching relevant user memory:", error);
    return null;
  }

  return data
}
```

[GitHub - ejfox/coachartie_discord](https://github.com/ejfox/coachartie_discord)
