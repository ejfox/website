---
date: 2024-01-10T21:34:32-05:00
modified: 2024-01-10T23:25:27-05:00
---
## Hourly Data Refresh:

• Latest Updates: Lil Fox receives updated data every hour, including new notes, bookmarks, and any other relevant information.

• Constant Cross-Referencing: It continuously cross-references this new data against the identified weekly themes and notes from Obsidian.

## Integrating Things To-Do List:

• Cron Job on Your Computer: You set up a cron job to run a script that uses the Things CLI to export your "Today" to-do list.

• Data Transfer: This script then sends the to-do list to your Supabase instance using curl . The data includes tasks, their priorities, deadlines, and any notes you've attached.

• Lil Fox Accesses To-Do List: Lil Fox regularly accesses this updated to-do list from Supabase.

## Decision Making and Task Prioritization:

• Context-Aware Task Suggestions: Based on the latest hourly data and your to-do list, Lil Fox suggests tasks that align with your ongoing weekly themes or urgent priorities.

• Adaptive Scheduling: It considers your current energy levels (using health data) and interest areas to suggest the most appropriate tasks for the current hour.

## Reporting and Interaction:

• Regular Summaries: Lil Fox provides you with regular summaries, including progress on weekly themes, upcoming tasks, and any newly identified opportunities or insights.

• Interactive Commands: You can interact with Lil Fox using custom commands to request specific information or adjustments in your schedule or task priorities.

## Display on the Foxboard:

• Dynamic Task Module: The Foxboard displays a dynamically updating task module, showing your prioritized tasks for the current hour or day.

• Contextual Links: It links tasks to relevant notes, bookmarks, or highlights, providing a comprehensive view of why a task is relevant now.

Example Workflow:

• 9 AM Check-In: Lil Fox reviews your latest notes and identifies a task in your Things to-do list related to a current theme, say "data visualization."

• Task Suggestion: It suggests working on a specific visualization project, considering your schedule and current energy levels.

• Foxboard Update: The task, along with related notes or bookmarks, is highlighted on the Foxboard.

### Suggesting Motorcycle Rides

1. **Weather Conditional**: Each morning, your system performs a quick weather check. If the conditions are favorable, it flags the day as suitable for a ride.

1. **Time Block Allocation**: Based on your weekly schedule and priorities, the system finds an optimal time block for a motorcycle ride and suggests it to you as a break or as an end-of-day activity.

1. **Ride Rotation and Tracking**: Keep a rotating list of destinations or routes. After each ride, mark the route as completed. Over time, the system learns your preferences and suggests routes accordingly.

1. **Simple Blog Documentation**: Post-ride, the system prompts you to jot down notes or upload pictures, which can be used for a simple blog update.

The goal is for the system to enhance your productivity and joy without becoming a distraction. It should serve as a tool that understands the balance between your work and the activities that recharge you, like your motorcycle rides.

### Anticipating Productivity
1. **Data Ingestion**: Continuously import health data (like activity levels, heart rate, sleep patterns) from your Apple Watch to your Supabase database.
2. **Pattern Analysis**: Implement a machine learning model that analyzes your data to determine your natural rhythms and predict energy peaks and troughs.
3. **Dynamic Adjustment**: The system uses these predictions to suggest 'protein' activities during predicted high-energy periods and 'carb' activities during low-energy periods.
4. **User Feedback**: Incorporate a feedback mechanism where you can confirm or adjust the system’s predictions, improving its accuracy over time.
5. **Seamless Integration**: Connect this with your existing task management and scheduling system to create a cohesive productivity suite.

## Tasks Table

```sql
CREATE TABLE tasks (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    notes TEXT,
    due_date DATE,
    status TEXT,
    creation_date TIMESTAMP,
    completion_date TIMESTAMP,
    tags TEXT,
    list_id TEXT  
);
```

## Calendar table
```sql
create table
  calendar (
    event_id bigint primary key generated always as identity,
    title text not null,
    description text,
    start_date timestamp with time zone,
    end_date timestamp with time zone,
    location text,
    created_at timestamp with time zone default current_timestamp,
    updated_at timestamp with time zone default current_timestamp
  );
```

## Note Snippets table

The purpose of the `note_snippets` table in your Supabase database is to store and manage smaller, manageable sections of your Obsidian notes (markdown files), referred to as "snippets." Each snippet will have an associated vector embedding, enabling advanced functionalities like similarity searches. This approach allows you to leverage the rich content of your notes for data analysis and retrieval in a structured and efficient manner.

```sql
 CREATE TABLE note_snippets (
    snippet_id SERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    source_file TEXT,
    original_created_date TIMESTAMP,
    tags TEXT,
    reference_link TEXT,
    last_updated_at TIMESTAMP,
    snippet_type TEXT,
    author TEXT,
    visibility TEXT,
    associated_project TEXT,
    embedding VECTOR(1536),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

```

## Health Data table

```sql
CREATE TABLE health_data (
    record_id SERIAL PRIMARY KEY,
    date TIMESTAMP NOT NULL,
    metric_type TEXT NOT NULL,
    data JSONB NOT NULL,
    source TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

```

## Bookmarks table
```sql
CREATE TABLE bookmarks (
    id BIGINT GENERATED BY DEFAULT AS IDENTITY,
    embedding VECTOR(1536),
    service_id TEXT NULL,
    created_at TIMESTAMP WITH TIME ZONE NULL DEFAULT now(),
    service_created_at TIMESTAMP WITH TIME ZONE NULL,
    href TEXT NULL,
    title TEXT NULL,
    author TEXT NULL,
    last_accessed TIMESTAMP WITH TIME ZONE NULL,
    thumbnail_url TEXT NULL,
    toread BOOLEAN NULL,
    tags TEXT NULL,
    description TEXT NULL,
    CONSTRAINT bookmarks_pkey PRIMARY KEY (id),
    CONSTRAINT bookmarks_service_id_key UNIQUE (service_id)
) TABLESPACE pg_default;

```

## Messages table
```sql
CREATE TABLE messages (
    message_id SERIAL PRIMARY KEY,
    thread_id INTEGER,
    user_id INTEGER,  -- Optional, for multiple users
    direction TEXT CHECK (direction IN ('inbound', 'outbound')),
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## FoxNotes schema
```sql
CREATE TABLE fox_notes (
    note_id SERIAL PRIMARY KEY,
    user_id INTEGER,  -- Optional, for multiple users
    note_type TEXT CHECK (note_type IN ('reminder', 'reflection', 'plan', 'insight')),
    content TEXT NOT NULL,
    related_to TEXT,  -- Reference to tasks, events, or other items
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    scheduled_for TIMESTAMP,  -- When the note is relevant
    expires_in TIMESTAMP  -- When the note is no longer relevant
);

```