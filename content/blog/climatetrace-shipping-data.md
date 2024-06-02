---
date: 2022-10-18T13:41:18-04:00
type: words
hidden: true
inprogress: true
dek: In which…
modified: 2022-12-23T09:14:08-05:00
---

#climatechange #dataviz 

# Climate Trace: Shipping Data

[[toc]]

## Metadata

2.41GB .csv file `asset-shipping.csv`

```bash
❯ wc -l asset-shipping.csv
 11643105 asset-shipping.csv
 ```

 11,643,105 lines in the .csv and 27 columns for each row. 

 ```bash
 ❯ csvcut -n asset-shipping.csv
  1: start_date
  2: end_date
  3: asset_identifier
  4: asset_name
  5: iso3_country
  6: location
  7: type
  8: capacity
  9: capacity_factor
 10: activity
 11: CO2_emissions_factor
 12: CH4_emissions_factor
 13: N2O_emissions_factor
 14: other_gas_emissions_factor
 15: CO2_emissions
 16: CH4_emissions
 17: N2O_emissions
 18: other_gas_emissions
 19: total_CO2e_100yrGWP
 20: total_CO2e_20yrGWP
 21: other1
 22: other2
 23: other3
 24: other4
 25: other5
 26: other6
 27: other7
 ```

We can convert this to a sqlite database for further analysis with datasette. Because our data is so large, we need to create a `settings.json`[^1] that lets queries take longer and return more rows. 

```sql
select distinct asset_identifier from [asset-shipping]
```

Which returns 48,112 unique ships.

## Data Analysis

### Which ship has the most emissions?
```sql
SELECT asset_name, asset_identifier, iso3_country, SUM(CO2_emissions) AS CO2_emissions
FROM [asset-shipping]
GROUP BY asset_identifier
ORDER BY CO2_emissions DESC
LIMIT 10;
```

**Name**: Orient

**Identifier**: 9061617

**Country**: RUS

**CO2_emissions**: 69420075.10475922

### Where does that ship travel?

First we grab all the data we have available for that unique_identifier:

```sql
select rowid, start_date, end_date, asset_identifier, asset_name, iso3_country, location, type, capacity, capacity_factor, activity, CO2_emissions_factor, CH4_emissions_factor, N2O_emissions_factor, other_gas_emissions_factor, CO2_emissions, CH4_emissions, N2O_emissions, other_gas_emissions, total_CO2e_100yrGWP, total_CO2e_20yrGWP, other1, other2, other3, other4, other5, other6, other7 from [asset-shipping] where "asset_identifier" = 9061617 
```

Each row has a `location` that looks like `Point((132.011448333333 43.0765933333333))` which is a latitude and longitude. Ideally we want to turn all these points into a line so we can see the path of the ship over time. 

## Ship History & Emissions Visualization

So lets turn our data and our newly-created aggregations into visualizations we can look at. Our goal is to find some recommendations for how to integrate this shipping data into a global map of emissions. 

### Points

The simplest thing that we can do is draw a circle for each point in a ship's history.

### Lines

We can also chain together our points to form a line that shows the entire route the ship took in the data we have available.

### Points + Arrows

It might be easier to read the directionality of the route if you add arrows and curve the lines slightly.

### Animation

Another way to take a ship's history and make it understandable is to introduce animation, where the location of the ship is played out through time.

#### Animated Points

You could simply animate the points the ship was recorded at as circles.

#### Animated Lines

Or you could draw a line over time to reflect where the boat has traveled. 

#### One ship vs Many ships

So far we've only looked at the history for a single ship, what if we look at all of the ships for a particular industry?

#### Multi-ship points

#### Multi-ship lines

### Heatmap
#### Heatmap for a ship
#### Heatmap for all ships in an industry

#### Particles
