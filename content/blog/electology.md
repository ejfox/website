---
date: 2024-01-10T14:17:50-05:00
modified: 2024-01-16T10:28:40-05:00
---

## MVP Plan

### Phase 1: Project Setup
- **Initialize the Database**: Set up your database server and create the initial database.
- **Define the Schema**: Based on the previously discussed design, create the tables (`elections`, `geo_units`, `candidates`, `results`) in the database.
- **Prepare Development Environment**: Set up your local development environment with the necessary tools and access to the database.

### Phase 2: Election Data Compilation

Gather data for all geographic units (states, counties, districts, precincts) and race types (Presidential, Congressional, etc.) for the 2020 election. Reliable sources may include:

- Official state election websites
- The Federal Election Commission (FEC)
- The MIT Election Data and Science Lab
- Other reputable election data aggregators
- Collect state-level data, including names and FIPS codes.
- Populate the `geo_units` table with state data, ensuring each state has a unique `GeoUnitID`.
- Collect data for congressional districts and counties.
- Populate the `geo_units` table with this data, assigning each a unique `GeoUnitID` and the appropriate `ParentID`.
- Gather metadata for the 2020 elections, focusing on dates, types, and levels of races.
- Input this data into the `elections` table, creating a record for each 2020 election event.
- Compile a list of candidates for each 2020 race, including their party affiliations.
- Add candidate information to the `candidates` table.

#### Data Ingestion

Develop scripts or use manual data entry to populate the tables with 2020 election data. The process will involve:

- Creating `ElectionID` entries for each type of race in the 2020 election.
- Filling the `candidates` table with all candidates who participated in the 2020 election races.
- Inserting detailed results into the `results` table for each race, candidate, and geographic unit.

#### Populating the `geo_units` table

To create the `geo_units` table, start by gathering state data from the U.S. Census Bureau, including state names and FIPS codes. Transform this data by assigning a unique `GeoUnitID` to each state and populating the relevant fields in your table. Since states are the top-level geographic unit, their `ParentID` can be left null.

Next, obtain congressional district data, which includes district numbers and associated state FIPS codes. When transforming this data, generate a `GeoUnitID` for each district and use the state data you've already entered into the `geo_units` table to assign the correct `ParentID`.

Similarly, download county-level data with county names and FIPS codes. Assign a `GeoUnitID` to each county and set the `ParentID` to the row ID of the state it belongs to, which you can reference by the state FIPS code.

Load the state data into the `geo_units` table first, followed by the congressional district and county data. As you load the district and county data, ensure that each entry's `ParentID` correctly points to the state's row ID in the table.

After loading the data, check that all hierarchical relationships are correct, and create indexes on key columns like `GeoUnitID` and `ParentID` to optimize query performance. This process will give you a robust `geo_units` table that reflects the geographic hierarchy from largest to smallest units, facilitating accurate and efficient data retrieval for your election visualization platform.

### Phase 4: Results Data Entry
- **Results Recording**:
  - Obtain the election results for each race in the 2020 elections.
  - Enter the results into the `results` table, linking each record to the corresponding `elections` and `geo_units` entries.

### Phase 5: Data Verification and Testing
- **Data Integrity Checks**:
  - Conduct thorough checks to ensure the accuracy and consistency of the data across all tables.
  - Validate the data against official sources to confirm its correctness.
- **Query Testing**:
  - Write and execute various queries to test data retrieval, ensuring that the results are as expected.
  - Optimize queries and add necessary indexes to improve performance.

### Phase 6: Documentation
- Document the entire process, including data sources, schema decisions, and any custom scripts or tools developed.
- Create a README file with setup instructions and an overview of the database structure.

### Phase 7: MVP Feature Development

Develop the core features of your application that will use the data. This may include:

- A map visualization for geographic units, colored by the winning party.
- Sidebar or detailed views showing candidate results, vote counts, and percentages.
- Filters to view different race types and levels (e.g., Presidential, Congressional).

---

## Tables

### Elections Table (`elections`)

**Fields**:

- `ElectionID` (String): A unique, human-readable composite key that combines the date, type, and category of the election (e.g., '2020-11-03-P-G' for a Presidential General election on November 3, 2020).
- `ElectionType` (String): The type of election (e.g., Presidential, Congressional, Senatorial, Gubernatorial, Ballot Initiative).
- `ElectionLevel` (String): The level of government (Federal, State, Local).
- `ElectionYear` (Integer): The year the election took place.
- `ElectionDate` (Date): The specific date of the election.
- `IsPrimary` (Boolean): Indicates whether the election is a primary.
- `WinnerParty` (String): The party of the winning candidate.
- `TotalVotes` (Integer): The total number of votes cast in the election.
- `VoterTurnoutPercentage` (Float): The percentage of eligible voters who participated in the election.
- `MarginOfVictory` (Float): The percentage point difference between the winner and the runner-up.
- `LeadingCandidate` (String): The name or ID of the leading candidate.

### Example Schema Creation SQL (for SQLite)

```sql
create table
  public.electology__elections (
    electionid text not null,
    electiontype text null,
    electionlevel text null,
    electionyear integer null,
    electiondate date null,
    isprimary boolean null,
    winnerparty text null,
    totalvotes integer null,
    voterturnoutpercentage real null,
    marginofvictory real null,
    leadingcandidate text null,
    constraint electology__elections_pkey primary key (electionid)
  ) tablespace pg_default;
```

This schema will support quick access to key information for visualizations and insights, like the winning party and voter turnout, while maintaining a detailed and comprehensive record of each election.

### Finalized Geographic Units Table (`geo_units`)

**Fields**:

- `GeoUnitID` (String): A unique identifier for each geographic unit. This could be a combination of FIPS code and unit type for higher precision.
- `Name` (String): The name of the geographic unit (e.g., Alabama, Autauga County, a specific township).
- `Type` (Enum): An enumerated type representing the category of the geographic unit. Allowed values: State, County, District, Precinct, Township.
- `FIPSCode` (String): The detailed FIPS code for the unit. It's stored as a string to preserve any leading zeros and extended to provide greater precision.
- `ParentID` (String, optional): A reference to the parent geographic unit, if applicable (e.g., linking a county to its state).

### Example Schema Creation SQL (for SQLite)

```sql
CREATE TABLE electology__geo_units (
    GeoUnitID TEXT PRIMARY KEY,
    Name TEXT,
    Type TEXT CHECK(Type IN ('State', 'County', 'District', 'Precinct', 'Township')),
    FIPSCode TEXT,
    ParentID TEXT
);
```


### Candidates Table (`candidates`)

**Fields**:

- `CandidateID` (String): A unique identifier for each candidate.
- `Name` (String): The most commonly recognized name of the candidate.
- `AKAs` (Text): Alternate names or common variations of the candidate's name.
- `PartyAffiliations` (Text): A JSON array storing the candidate's party affiliations over the years.
- `ActivePartyAffiliation` (String): The current or most recent party affiliation of the candidate.
- `FirstElectionYear` (Integer): The first year the candidate ran for an election.
- `FirstElectionState` (String): The state where the candidate first ran for election.
- - `CampaignFinanceSummary` (Text): A JSON field to store key financial information about the candidate's campaign.
- `LastElectionWinMargin` (Float, optional): The margin of victory in the candidate's last election win.
- `Birthday` (Date): The candidate's date of birth.
- `HeadshotURL` (String): A URL to an image of the candidate's headshot.

**Example JSON Structure for `CampaignFinanceSummary`**:

```json
{
  "totalReceipts": 87647.99,
  "totalDisbursements": 79252.8,
  "cashOnHand": 8395.19,
  "debtOwed": 25000,
  "coverageEndDate": "2023-09-30"
}
```

**Example Schema Creation SQL (for SQLite)**:

```sql
CREATE TABLE electology__candidates (
    CandidateID TEXT PRIMARY KEY,
    Name TEXT,
    AKAs TEXT,
    PartyAffiliations TEXT,
    ActivePartyAffiliation TEXT,
    FirstElectionYear INTEGER,
    FirstElectionState TEXT,
    CampaignFinanceSummary TEXT,
    LastElectionWinMargin REAL,
    Birthday DATE,
    HeadshotURL TEXT
);
```

### Results Table (`results`)

**Fields**:

- `ResultID` (String): A unique identifier for each election result entry.
- `ElectionID` (String): A reference to the `ElectionID` in the `elections` table.
- `GeoUnitID` (String): A reference to the `GeoUnitID` in the `geo_units` table.
- `GeoUnitType` (String) The type of geo unit (county, state, precinct, etc)
- `CandidateID` (String): A reference to the `CandidateID` in the `candidates` table.
- `VoteCount` (Integer): The number of votes received by the candidate in this geographic unit for this election.
- `TotalVotes` (Integer): The total number of votes cast in this geographic unit for this election.
- `VoteBreakdown` (Text, optional): A JSON field to store the breakdown of votes by method (e.g., in-person, mail-in, early voting), if available.

**Example JSON Structure for `VoteBreakdown`**:

```json
{
  "inPerson": 5000,
  "mailIn": 3000,
  "earlyVoting": 2000
}
```

**Example Schema Creation SQL (for SQLite)**:

```sql
CREATE TABLE electology__results (
    ResultID TEXT PRIMARY KEY,
    ElectionID TEXT,
    GeoUnitID TEXT,
    GeoUnitType TEXT,
    CandidateID TEXT,
    VoteCount INTEGER,
    TotalVotes INTEGER,
    VoteBreakdown TEXT
);
```

### Precinct Results Table (`precinct_results`)

**Fields**:

- `PrecinctResultID` (String): A unique identifier for each precinct result entry, possibly a UUID or a combination of other fields.
- `ElectionID` (String): A reference to the `ElectionID` in the `elections` table. This ID should be constructed consistently across both tables.
- `PrecinctID` (String): A unique identifier for the precinct, which could be a combination of `state_fips`, `county_fips`, and `precinct`.
- `CountyFIPS` (String): The FIPS code for the county.
- `JurisdictionFIPS` (String): The FIPS code for the jurisdiction, if different from the county.
- `ParentGeoUnitID` (String): A reference to the `GeoUnitID` in the `geo_units` table, which could be the county or district FIPS code.
- `CandidateID` (String): A reference to the `CandidateID` in the `candidates` table.
- `Votes` (Integer): The number of votes received by the candidate in this precinct.
- `Office` (String): The office for which the election is held (e.g., "US HOUSE").
- `District` (String): The district number for the election, if applicable.
- `PartyDetailed` (String): The detailed party affiliation of the candidate.
- `PartySimplified` (String): The simplified party affiliation of the candidate.
- `Mode` (String): The mode of voting (e.g., "TOTAL" for total votes, "ABSENTEE" for absentee votes).
- `Year` (Integer): The year the election took place.

**Partitioning**:

- The table can be partitioned by `Year` and `State` to improve query performance.

**Indexing**:

- Create indexes on frequently queried columns such as `ElectionID`, `PrecinctID`, `ParentGeoUnitID`, and `CandidateID`.
- A composite index on (`Year`, `State`) could be beneficial for queries that span multiple precincts within a state for a given year.

**Example Schema Creation SQL (for PostgreSQL with Partitioning)**:

```sql
CREATE TABLE electology__precinct_results (
    PrecinctResultID TEXT NOT NULL,
    ElectionID TEXT NOT NULL REFERENCES elections(ElectionID),
    PrecinctID TEXT NOT NULL,
    CountyFIPS TEXT NOT NULL,
    JurisdictionFIPS TEXT,
    ParentGeoUnitID TEXT NOT NULL REFERENCES geo_units(GeoUnitID),
    CandidateID TEXT NOT NULL REFERENCES candidates(CandidateID),
    Votes INTEGER NOT NULL,
    Office TEXT NOT NULL,
    District TEXT,
    PartyDetailed TEXT,
    PartySimplified TEXT,
    Mode TEXT NOT NULL,
    Year INTEGER NOT NULL
) PARTITION BY RANGE (Year);

-- Create partitions for each year (example for the year 2020)
CREATE TABLE precinct_results_2020 PARTITION OF precinct_results
FOR VALUES FROM (2020) TO (2021);

-- Add indexes to the partitioned table
CREATE INDEX idx_precinct_results_year_state ON precinct_results_2020 (Year, State);
CREATE INDEX idx_precinct_results_electionid ON precinct_results_2020 (ElectionID);
-- Additional indexes as needed...
```

### Live Results Table (`live_results`)

**Fields**:

- `LiveResultID` (String): A unique identifier for each entry. This could be a combination of the `ElectionID`, `GeoUnitID`, and a timestamp or sequence number to ensure uniqueness.
- `ElectionID` (String): A reference to the `ElectionID` in the `elections` table.
- `GeoUnitID` (String): A reference to the `GeoUnitID` in the `geo_units` table.
- `CandidateID` (String): A reference to the `CandidateID` in the `candidates` table.
- `VoteCount` (Integer): The most recent count of votes received by the candidate in this geographic unit for this election.
- `TotalVotes` (Integer): The most recent total number of votes cast in this geographic unit for this election.
- `VoteBreakdown` (Text, optional): A JSON field to store the breakdown of votes by method, if available.
- `Timestamp` (DateTime): The timestamp of the latest update, to track the recency of the data.

**Handling Conflicting or Duplicative Data**:

- **Timestamps**: By including a `Timestamp` field, you can ensure that you're always working with the most recent data.
- **Data Integrity Checks**: Implement logic in your data ingestion pipeline to check for conflicts or duplicates. This could involve comparing the timestamp and vote counts to ensure new data is indeed more recent and different from the existing data.
- **Data Update Strategy**: Define a strategy for updating the `live_results` table. This could be an "upsert" operation, where new data either updates existing rows (if they exist for the same `ElectionID`, `GeoUnitID`, and `CandidateID`) or inserts new rows.

**Example Schema Creation SQL (for SQLite)**:

```sql
CREATE TABLE electology__live_results (
    LiveResultID TEXT PRIMARY KEY,
    ElectionID TEXT,
    GeoUnitID TEXT,
    CandidateID TEXT,
    VoteCount INTEGER,
    TotalVotes INTEGER,
    VoteBreakdown TEXT,
    Timestamp DATETIME
);
```


### Parties Table (`parties`) with Historical Consideration

**Fields**:

- `PartyID` (String): A unique identifier for each political party.
- `Name` (String): The full name of the political party.
- `Abbreviation` (String): A short abbreviation for the party.
- `ColorCode` (String): A color identifier for the party, suitable for light mode UI.
- `ColorCodeDark` (String): A color identifier for the party, suitable for dark mode UI.
- `HistoricalInfo` (Text, optional): A JSON field to store key historical information about the party. This could include major ideological shifts, mergers, or rebranding events.

**Suggested JSON Structure for `HistoricalInfo`**:

```json
{
  "majorEvents": [
    {"year": 1960, "event": "Ideological shift towards..."},
    {"year": 1990, "event": "Merged with..."}
  ]
}
```

**Example Schema Creation SQL (for SQLite)**:

```sql
CREATE TABLE electology__parties (
    PartyID TEXT PRIMARY KEY,
    Name TEXT,
    Abbreviation TEXT,
    ColorCode TEXT,
    ColorCodeDark TEXT,
    HistoricalInfo TEXT
);
```

**Handling Historical Party Information**:

- The `HistoricalInfo` field can be a JSON array to store major historical events or shifts relevant to the party. This approach offers flexibility and allows for capturing essential historical milestones without excessive detail.
- By using JSON, we keep the table structure simple and avoid overloading it with numerous columns for historical details, aligning with the goal of minimal yet effective data storage.

### Election Events Table (`election_events`)

**Fields**:

- `EventID` (String): A unique identifier for each event.
- `ElectionID` (String): A reference to the `ElectionID` in the `elections` table, indicating which election the event is associated with.
- `EventType` (String): The type of event (e.g., Debate, Registration Deadline, Early Voting Start).
- `EventDate` (Date): The date (and possibly time) when the event occurs.
- `EventDescription` (Text): A brief description of the event.
- `Location` (String, optional): The location where the event is taking place, if applicable.
- `URL` (String, optional): A URL to a webpage with more information about the event.
- `ImpactLevel` (String, optional): An assessment of the event's expected impact on the election (e.g., High, Medium, Low).
- `CandidateIDs` (Text): A list of `CandidateID`s involved in the event, stored as a delimited string or a JSON array.

**Example Schema Creation SQL (for SQLite)**:

```sql
CREATE TABLE electology__election_events (
    EventID TEXT PRIMARY KEY,
    ElectionID TEXT,
    lat FLOAT,
    lng FLOAT,
    EventType TEXT,
    EventDate DATE,
    EventDescription TEXT,
    Location TEXT,
    URL TEXT,
    ImpactLevel TEXT,
    CandidateIDs TEXT -- This field can store a comma-separated list or a JSON array of CandidateIDs
);
```


## Importing MIT Historical Election Data

## Candidate Data

FEC Candidates for election years: <https://www.fec.gov/data/browse-data/?tab=candidates>

**Candidates Table (`candidates`)**:

- `CandidateID`: Directly from `Cand_Id`.
- `Name`: Directly from `Cand_Name`.
- `PartyAffiliations`: Derived from `Cand_Party_Affiliation`.
- `ActivePartyAffiliation`: Directly from `Cand_Party_Affiliation`.
- `FirstElectionYear`: Derived from the `year` portion of `Cand_Id` or an external source.
- `FirstElectionState`: Directly from `Cand_Office_St`.
- `Birthday`: Not available in the FEC data; would need an external source.
- `HeadshotURL`: Could be constructed from `Link_Image`.

```sql
create table
  electology__candidates (
    CandidateID bigint primary key generated always as identity,
    name text,
    PartyAffiliations text,
    ActivePartyAffiliation text,
    FirstElectionYear int,
    FirstElectionState text,
    Birthday date,
    HeadshotURL text
  );
```


### Presidential County Data 2000-2020

|**year**|**state**|**state_po**|**county_name**|**county_fips**|**office**|**candidate**|**party**|**candidatevotes**|**totalvotes**|**version**|**mode**|
|---|---|---|---|---|---|---|---|---|---|---|---|
|**2000**|ALABAMA|AL|AUTAUGA|1001|US PRESIDENT|AL GORE|DEMOCRAT|4942|17208|20220315|TOTAL|
|**2000**|ALABAMA|AL|AUTAUGA|1001|US PRESIDENT|GEORGE W. BUSH|REPUBLICAN|11993|17208|20220315|TOTAL|
|**2000**|ALABAMA|AL|AUTAUGA|1001|US PRESIDENT|RALPH NADER|GREEN|160|17208|20220315|TOTAL|
|**2000**|ALABAMA|AL|AUTAUGA|1001|US PRESIDENT|OTHER|OTHER|113|17208|20220315|TOTAL|

1. **Elections Table (`elections`)**:
   - `ElectionID`: Constructed from the `year`, `office`, and `state_po` fields.
   - `ElectionType`: Derived from the `office` field (e.g., "US PRESIDENT" becomes "Presidential").
   - `ElectionLevel`: "Federal" for presidential elections.
   - `ElectionYear`: Directly from the `year` field.
   - `ElectionDate`: You'll need an external source for the exact date, as it's not in the CSV.
   - Other fields like `IsPrimary`, `WinnerParty`, etc., would need additional logic or data sources.

2. **Geographic Units Table (`geo_units`)**:
   - `GeoUnitID`: Constructed from `county_fips`.
   - `Name`: From `county_name`.
   - `Type`: "County" for these records.
   - `FIPSCode`: Directly from `county_fips`.
   - `ParentID`: Constructed from `state_po`.

3. **Candidates Table (`candidates`)**:
   - `CandidateID`: Constructed from `candidate` and `year` or a unique identifier.
   - `Name`: Directly from `candidate`.
   - Other fields would require additional data sources.

4. **Results Table (`results`)**:
   - `ResultID`: A unique identifier, possibly a UUID or a combination of other fields.
   - `ElectionID`: Reference the constructed `ElectionID` from the `elections` table.
   - `GeoUnitID`: Reference the `GeoUnitID` from the `geo_units` table.
   - `CandidateID`: Reference the `CandidateID` from the `candidates` table.
   - `VoteCount`: Directly from `candidatevotes`.
   - `TotalVotes`: Directly from `totalvotes`.

5. **Parties Table (`parties`)**:
   - `PartyID`: Constructed from `party` or a unique identifier.
   - `Name`: Directly from `party`.
   - `Abbreviation`: May need to be manually mapped based on `party`.
   - `ColorCode` and `ColorCodeDark`: May need to be manually set based on `party`.

### Congressional Elections Data 1976-2022
1. **Elections Table (`elections`)**:
   - `ElectionID`: Constructed from the `year`, `state_po`, `office`, and `district` fields.
   - `ElectionType`: Derived from the `office` field (e.g., "US HOUSE" becomes "House of Representatives").
   - `ElectionLevel`: "Federal" for congressional elections.
   - `ElectionYear`: Directly from the `year` field.
   - `ElectionDate`: You'll need an external source for the exact date, as it's not in the CSV.
   - Other fields like `IsPrimary`, `WinnerParty`, etc., would need additional logic or data sources.

2. **Geographic Units Table (`geo_units`)**:
   - `GeoUnitID`: Constructed from `state_fips` and `district`.
   - `Name`: Constructed from `state` and `district` (e.g., "Alabama District 1").
   - `Type`: "District" for these records.
   - `FIPSCode`: Constructed from `state_fips` and `district`.
   - `ParentID`: Constructed from `state_po`.

3. **Candidates Table (`candidates`)**:
   - `CandidateID`: Constructed from `candidate`, `year`, and `district` or a unique identifier.
   - `Name`: Directly from `candidate`.
   - Other fields would require additional data sources.

4. **Results Table (`results`)**:
   - `ResultID`: A unique identifier, possibly a UUID or a combination of other fields.
   - `ElectionID`: Reference the constructed `ElectionID` from the `elections` table.
   - `GeoUnitID`: Reference the `GeoUnitID` from the `geo_units` table.
   - `CandidateID`: Reference the `CandidateID` from the `candidates` table.
   - `VoteCount`: Directly from `candidatevotes`.
   - `TotalVotes`: Directly from `totalvotes`.

5. **Parties Table (`parties`)**:
   - `PartyID`: Constructed from `party` or a unique identifier.
   - `Name`: Directly from `party`.
   - `Abbreviation`: May need to be manually mapped based on `party`.
   - `ColorCode` and `ColorCodeDark`: May need to be manually set based on `party`.


## Ingest Scripts

### Script 1: `ingest_states.js`
- **Purpose**: To ingest state-level geographic data into the `geo_units` table.
- **Functionality**:
  - Read state data from a source file or API.
  - Transform the data to match the `geo_units` schema.
  - Insert state data into the database, setting `Type` as "State" and leaving `ParentID` null.

### Script 2: `ingest_districts.js`
- **Purpose**: To ingest congressional district data into the `geo_units` table.
- **Functionality**:
  - Read district data, including state associations and district numbers.
  - Transform the data to include a `GeoUnitID` and the correct `ParentID` referencing the state.
  - Insert district data into the database, setting `Type` as "District".

### Script 3: `ingest_counties.js`
- **Purpose**: To ingest county-level geographic data into the `geo_units` table.
- **Functionality**:
  - Read county data, including names and FIPS codes.
  - Transform the data to include a `GeoUnitID` and the correct `ParentID` referencing the state.
  - Insert county data into the database, setting `Type` as "County".

### Script 4: `ingest_elections.js`
- **Purpose**: To ingest election metadata for the 2020 elections into the `elections` table.
- **Functionality**:
  - Read election metadata from a source file or API.
  - Transform the data to match the `elections` schema, excluding winner and margin fields.
  - Insert election metadata into the database.

### Script 5: `ingest_candidates.js`
- **Purpose**: To ingest candidate data for the 2020 elections into the `candidates` table.
- **Functionality**:
  - Read candidate data, including names, party affiliations, and election participation.
  - Transform the data to match the `candidates` schema.
  - Insert candidate data into the database.

### Script 6: `ingest_results.js`
- **Purpose**: To ingest election results data for the 2020 elections into the `results` table.
- **Functionality**:
  - Read results data for each race and candidate.
  - Transform the data to include references to the correct `ElectionID`, `GeoUnitID`, and `CandidateID`.
  - Insert results data into the database.

### Script 7: `verify_data.js`
- **Purpose**: To perform data integrity checks and ensure accuracy.
- **Functionality**:
  - Run queries to check for consistency and accuracy across the `geo_units`, `elections`, `candidates`, and `results` tables.
  - Report any discrepancies or issues for review and correction.

### Script 8: `update_winners.js` (To be run after initial ingestion)
- **Purpose**: To update the `elections` table with winner and margin data.
- **Functionality**:
  - Read winner and margin data from a reliable source.
  - Transform the data to match the `elections` schema.
  - Update the `elections` table with the new data.

---

## Execution Plan

### Day 1: Geographic Units and Elections Data

#### 10:00 AM - 11:00 AM: Project Initialization
- Set up the project repository and version control.
- Create a `package.json` file and install necessary Node.js packages.
- Write a basic README with an overview of the project's purpose and structure.

#### 11:00 AM - 12:00 PM: Database Setup
- Connect to your database and create the `geo_units`, `elections`, `candidates`, and `results` tables according to your schema.
- Test the connection and table creation scripts to ensure they work as expected.

#### 12:00 PM - 1:00 PM: Ingest States Data (`ingest_states.js`)
- Write the `ingest_states.js` script to read, transform, and load state data into the `geo_units` table.
- Run the script with a subset of data to test and debug.

#### 1:00 PM - 2:00 PM: Lunch Break
- Take a well-deserved break to rest and recharge.

#### 2:00 PM - 3:00 PM: Ingest Congressional Districts Data (`ingest_districts.js`)
- Write the `ingest_districts.js` script to handle congressional district data.
- Ensure the script assigns the correct `ParentID` to each district, linking it to its state.

#### 3:00 PM - 4:00 PM: Ingest Counties Data (`ingest_counties.js`)
- Write the `ingest_counties.js` script to process and insert county data into the `geo_units` table.
- Test the script with a few counties to verify the `ParentID` linkage and data accuracy.

#### 4:00 PM - 5:00 PM: Ingest Elections Metadata (`ingest_elections.js`)
- Develop the `ingest_elections.js` script to populate the `elections` table with the 2020 election metadata.
- Run the script to load data and check for correct insertion.

#### 5:00 PM - 6:00 PM: Review and Documentation
- Review the work completed so far, ensuring that all scripts are functioning as expected.
- Document the processes, including any issues encountered and how they were resolved.

### Day 2: Candidates, Results Data, Verification, and Visualization

#### 10:00 AM - 11:00 AM: Ingest Candidates Data (`ingest_candidates.js`)
- Create and run the `ingest_candidates.js` script to add candidate information to the `candidates` table.

#### 11:00 AM - 1:00 PM: Ingest Results Data (`ingest_results.js`)
- Write and execute the `ingest_results.js` script to input results data into the `results` table.

#### 1:00 PM - 2:00 PM: Lunch Break
- Take a break to recharge for the afternoon's tasks.

#### 2:00 PM - 3:30 PM: Data Verification (`verify_data.js`)
- Develop and run the `verify_data.js` script to perform data integrity checks across all tables.

#### 3:30 PM - 4:30 PM: Front-End Integration
- Coordinate with the front-end team to ensure they can query the backend for the necessary data.
- Assist with any API endpoints or data format adjustments needed for visualization.

#### 4:30 PM - 5:30 PM: Map Visualization
- Work with the front-end team to implement map visualizations for states, congressional districts, and counties.
- Test the visualizations with the ingested data to ensure accuracy and performance.

#### 5:30 PM - 6:00 PM: Review and Wrap-Up
- Review the visualizations to confirm that they are displaying the correct information.
- Make any necessary tweaks based on the test results.
- Document the visualization integration process and any outstanding issues.