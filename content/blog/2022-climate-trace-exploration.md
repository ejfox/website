---
draft: true
dek: In which
inprogress: true
date: 2022-12-08T10:44:22-05:00
modified: 2024-05-05T21:17:20-04:00
---

#climatechange #data #dataviz

## Climate Trace Exploration Fall 2022

### Data

I downloaded static .csvs from all industries and both USA files from the Climate Trace downloads - I spun those csvs up into my own datasette instance that lets me execute arbitrary sqlite queries on the entire dataset and do things that aren't part of the current API

I also augmented it with data pulled from the API at render-time

With all of the .csv data loaded into a single sqlite file, we can list the available tables like this:

```sql
SELECT 
    name
FROM 
    sqlite_schema
WHERE 
    type ='table' AND 
    name NOT LIKE 'sqlite_%';
```

Which returns

```
name
country_other-onsite-fuel-usage_emissions
country_residential-and-commercial-onsite-fuel-usage_emissions
country_fluorinated-gases_emissions
asset_coal-mining_emissions
asset_oil-and-gas-production-and-transport_emissions
asset_oil-and-gas-production-and-transport_ownership
asset_oil-and-gas-refining_emissions
asset_oil-and-gas-refining_ownership
country_coal-mining_emissions
country_oil-and-gas-production-and-transport_emissions
country_oil-and-gas-refining_emissions
country_other-fossil-fuel-operations_emissions
country_solid-fuel-transformation_emissions
asset_aluminum_emissions
asset_cement_emissions
asset_cement_ownership
asset_steel_emissions
asset_steel_ownership
country_aluminum_emissions
country_cement_emissions
country_chemicals_emissions
country_other-manufacturing_emissions
country_pulp-and-paper_emissions
country_steel_emissions
asset_bauxite-mining_emissions
asset_copper-mining_emissions
asset_iron-mining_emissions
country_bauxite-mining_emissions
country_copper-mining_emissions
country_iron-mining_emissions
country_rock-quarrying_emissions
country_sand-quarrying_emissions
asset_electricity-generation_emissions
asset_electricity-generation_ownership
country_electricity-generation_emissions
country_other-energy-use_emissions
asset_solid-waste-disposal_emissions
asset_solid-waste-disposal_ownership
country_biological-treatment-of-solid-waste-&-biogenic_emissions
country_incineration-and-open-burning-of-waste_emissions
country_solid-waste-disposal_emissions
country_wastewater-treatment-and-discharge_emissions
```

Some things we need to be aware of as we explore this data. Ownership tables do not contain any emissions data, so we will ignore them for now, though we may come back to them later for an additional analysis separately.

Some assets like forests can potentially be large boundaries, and others, like shipping, can have multiple locations over time.

### Metadata

One of the first pieces of analysis we will want to look at is the average emissions for each sector and country.

Since our data is loaded into a single sqlite database, we can write a query that finds the average like so:

```sql
SELECT 'country_other-onsite-fuel-usage_emissions' AS sector, avg(emissions_quantity) AS avg_emissions FROM [country_other-onsite-fuel-usage_emissions] 
UNION ALL 
SELECT 'country_residential-and-commercial-onsite-fuel-usage_emissions' AS sector, avg(emissions_quantity) AS avg_emissions FROM [country_residential-and-commercial-onsite-fuel-usage_emissions] 
UNION ALL 
/* etc... */
```

Now we have a list of the average emissions per sector

|sector                                                          |avg_emissions     |
|----------------------------------------------------------------|------------------|
|country_other-onsite-fuel-usage_emissions                       |626882.7339777576 |
|country_residential-and-commercial-onsite-fuel-usage_emissions  |10570951.531545129|
|country_fluorinated-gases_emissions                             |3192839.1750230007|
|asset_coal-mining_emissions                                     |371276.9529745977 |
|asset_oil-and-gas-production-and-transport_emissions            |5029170.075814316 |
|asset_oil-and-gas-refining_emissions                            |1101387.884806157 |
|country_coal-mining_emissions                                   |3852764.113805118 |
|country_oil-and-gas-production-and-transport_emissions          |26092966.238957137|
|country_oil-and-gas-refining_emissions                          |3065097.9905090285|
|country_other-fossil-fuel-operations_emissions                  |2129103.0373205417|
|country_solid-fuel-transformation_emissions                     |3514164.523526008 |
|asset_aluminum_emissions                                        |79628.80644036894 |
|asset_cement_emissions                                          |41033.81624168514 |
|asset_steel_emissions                                           |120097.63570595099|
|country_aluminum_emissions                                      |4079854.777777778 |
|country_cement_emissions                                        |5485351.7037      |
|country_chemicals_emissions                                     |1321098.3634285715|
|country_other-manufacturing_emissions                           |11157537.936070718|
|country_pulp-and-paper_emissions                                |231644.82230456732|
|country_steel_emissions                                         |5505802.0506      |
|asset_bauxite-mining_emissions                                  |16149.989120612236|
|asset_copper-mining_emissions                                   |144349.83739999996|
|asset_iron-mining_emissions                                     |146237.1213663316 |
|country_bauxite-mining_emissions                                |4114.016553066766 |
|country_copper-mining_emissions                                 |52382.346798686434|
|country_iron-mining_emissions                                   |42571.34123749162 |
|country_rock-quarrying_emissions                                |23430.02041166381 |
|country_sand-quarrying_emissions                                |6747.906171428572 |
|asset_electricity-generation_emissions                          |9279216.822094692 |
|country_electricity-generation_emissions                        |31939702.337169297|
|country_other-energy-use_emissions                              |3716784.7093672394|
|asset_solid-waste-disposal_emissions                            |98716.8908211983  |
|country_biological-treatment-of-solid-waste-&-biogenic_emissions|40626.385040945686|
|country_incineration-and-open-burning-of-waste_emissions        |182798.0458842031 |
|country_solid-waste-disposal_emissions                          |3328791.549443371 |
|country_wastewater-treatment-and-discharge_emissions            |4959122.825384325 |

If you wanted to find the minimum and maximum as well as the average, you could do it like this:

```sql
SELECT 
'asset_coal-mining_emissions' as 'sector',
	avg(emissions_quantity) AS avg_emissions, 
	min(emissions_quantity) AS min_emissions, 
	max(emissions_quantity) AS max_emissions 
	FROM [asset_coal-mining_emissions] 
    WHERE gas is 'co2e_100yr'
```

[Datasette guide to spatialite](https://docs.datasette.io/en/stable/spatialite.html)

To select unique points within a bounding box after the year 2021 from a specific sector:

```sqlite
select
    distinct(asset_id),
    st_astext as 'geom'
FROM [asset_oil-and-gas-refining_emissions] 
where
   within(GeomFromText(geom), PolygonFromText('POLYGON((-127.1825 24.4286, -66.9266 24.4286, -66.9266 49.3845, -127.1825 49.3845, -127.1825 24.4286))'))
   AND date(start_time) >= '2021-01-01'
```

It's getting kind of old writing these super-long queries for every single asset table, so let's combine all of our assets into a single table, while maintaining all their fields.

```sqlite 
CREATE TABLE all_assets_combined AS 
SELECT 
	asset_id AS 'asset_id',
	asset_name, 
	st_astext as 'geom', 
	emissions_quantity AS 'emissions_quantity', 
	start_time AS 'start_time' 
FROM [asset_oil-and-gas-refining_emissions] 
UNION ALL 
SELECT etc... ``` 

Now we can do geospatial queries across all of our assets pretty quickly: 

```sqlite
SELECT asset_id, geom 
FROM all_assets_combined 
WHERE within(GeomFromText(geom), PolygonFromText('POLYGON((-127.1825 24.4286, -66.9266 24.4286, -66.9266 49.3845, -127.1825 49.3845, -127.1825 24.4286))')) 
AND date(start_time) >= '2021-01-01' 
```
