---
dek: "In which"
inprogress: true
date: "2023-12-04T05:48:38.000Z"
modified: "2023-12-18T00:11:27.000Z"
tags: null
hidden: true
draft: true
---
## Using LLMs to create a verb-based graph database



---

ROBOT

To build a graph database of current events and people from news headlines using LLMs and Neo4j, follow these steps:

Collect Headlines: Aggregate news headlines from various sources using web scraping or APIs.

Process Headlines with LLMs: Use an LLM to process the headlines, identifying nouns (entities) and verbs (relationships) within the text.

Construct Graph Schema: Design your Neo4j schema based on the entities and relationships you intend to track, such as Person, Event, Location, Action.

Create Nodes and Relationships: Map each noun to a node and each verb to a relationship in Neo4j. For instance, "President speaks at the conference" would result in nodes for the Person (President) and the Event (conference), connected by the Action (speaks).

Populate the Database: Write scripts or use Neo4j ETL tools to input your processed data into the database.

Query and Analyze Data: Utilize Neo4j's Cypher query language to explore the graph, identify trends, and gain insights.

---

**LLM Prompt**

Given the news headline, identify the main entities (such as people, organizations, locations) and the actions (verbs) that connect these entities. Construct a Neo4j Cypher query that represents the relationships between these entities as nodes and verbs as relationship types. Focus on positivity, acts of creation and collaboration over negativity.  If a headline contains multiple relationships, try to encompass the one that is the central theme of the headline. Be as specific, but succinct as possible. Avoid adjectives and adverbs in your descriptions. 

Consider this headline as an example:

"Acme Corp acquires innovative startup Speedy Solutions amid market expansion efforts"

For this headline, the entities would be 'Acme Corp' and 'Speedy Solutions', and the verb would be 'acquires'. The Cypher query would look like:

CREATE (ac:Entity {name: "Acme Corp"})-[:ACQUIRES]->(ss:Entity {name: "Speedy Solutions"})

Now, use the same methodology to convert the following headline into a Neo4j query:

"Newly elected mayor pledges to improve public transportation infrastructure"

Remember to:

- Distinguish between entities and actions.

- Ensure entities are properly labeled as nodes.

- Represent the action verb as a relationship between the nodes.

- Maintain the integrity of the original information from the headline.

Use these verbs:

Create - To represent the act of bringing something into existence or starting something new.

Destroy - For stories involving the end or removal of something.

Collaborate - To capture joint efforts, partnerships, teamwork, or alliances.

Compete - For instances of rivalry, contests, or striving to gain something.

Support - Representing acts of assisting, backing, or advocating.

Oppose - For conflicts, resistance, or disagreements.

Attack - For aggressive actions, whether physical, verbal, or cyber.

Influence - Covering actions of persuasion, inspiration, or manipulation.

Transform - To depict significant changes, conversions, or developments.

Discover - For findings, revelations, or new understanding.

Move - A flexible verb for physical relocation, emotional impact, or progression in narratives.

Interact - Catch all for any other types of interactions

Respond with a Cypher query that encompasses this headline:

---

```js
const { createClient } = require('@supabase/supabase-js');
const neo4j = require('neo4j-driver');

// Supabase setup
const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseKey = 'YOUR_SUPABASE_KEY';
const supabase = createClient(supabaseUrl, supabaseKey);

// Neo4j setup
const neo4jUrl = 'YOUR_NEO4J_URL';
const neo4jUser = 'YOUR_NEO4J_USER';
const neo4jPassword = 'YOUR_NEO4J_PASSWORD';
const driver = neo4j.driver(neo4jUrl, neo4j.auth.basic(neo4jUser, neo4jPassword));
const session = driver.session();

async function fetchHeadlines() {
let { data, error } = await supabase
.from('headlines')
.select('*');

if (error) {
    console.error('Error fetching headlines:', error);
    return;
}

return data;


}

function translateToCypher(headline) {
// Implement the LLM logic here. Placeholder query for demonstration:
return MERGE (n:Headline {text: "${headline.headline_text}"}) ON CREATE SET n.scrapeDate = datetime("${headline.scrape_date}") ;
}

async function processHeadlines() {
const headlines = await fetchHeadlines();
if (!headlines) return;

for (const headline of headlines) {
    const cypherQuery = translateToCypher(headline);
    await session.run(cypherQuery);
}


}

processHeadlines()
.then(() => {
console.log('Headlines processed successfully');
session.close();
driver.close();
})
.catch((error) => {
console.error('Error processing headlines:', error);
session.close();
driver.close();
});

```