---
dek: In which voter data is explored and visualized with javascript and an assemblage of command line tools
type: words
hidden: true
inprogress: false
date: 2020-03-03T04:00:39-05:00
hidetimestamp: false
draft: true
modified: 2024-06-21T10:13:07-04:00
---

## Processing, analyzing and visualizing EAVS data

::table-of-contents

::

EAVS analysis, voters removed exceed election margin

The goal is not only to answer our current question (“How many counties removed more voters than the difference between counties in the last election?”) but to make it easier to answer other, similar questions.

This can be done through writing code, scripts, [makefiles](https://bost.ocks.org/mike/make/), as well as [runbooks](https://en.wikipedia.org/wiki/Runbook) and good documentation.

My goal is to weave the two together here and talk about my process in the hopes that some of it can benefit your process.

### About EAVS

#### States with data aggregated by township

| State | Format    |
| :---- | :-------- |
| CT    | Townships |
| ME    | Townships |
| MA    | Townships |
| NH    | Townships |
| RI    | Townships |
| VT    | Townships |
| WI    | Townships |

### Voter removals

Recently-released data on elections and voter registrations based on a federally-mandated survey reveals an alarming new trend: large percentages of voters in crucial counties are being removed from voter registration records at increasing rates.

_Map of % removal by state / county_

An OSET Institute analysis has discovered TK counties where over TK% of voters have been removed. The median % removed across the country was TK%. That’s a total of TK voters removed across the country between 2016 and 2018.

A further analysis discovered TK% of counties had more voters removed than the difference in the last general election.

_Map of counties where removal > 2016 vote difference_

Voters can be removed from records for a few reasons:

- Disenfranchising criminal conviction
- Mental incapacity
- Death
- Change in residence
- Never eligible: under 18 or noncitizen
- Voter self-requests removal

Many proponents of stricter voting procedures point to potential non-citizen voters. However the Brennan Center reported “out of the 23.5 million votes cast… election officials referred only 30 instances of suspected noncitizen voting, or .0001 percent of the total.”

Some reasons for removal are broad and can cover a variety of situations. Because of this, these removals can happen in error. Two categories in particular deserve additional scrutiny: “Failure to Respond” and “Other / Not Stated”.

_Graphic showing breakdown of reasons for voter removal: ideally sankey, could also be unit chart_

Let’s look at some specific examples. Maricopa County in Arizona, which includes the city of Phoenix had the largest number of voters removed (223,369) by a single county in the EAVS data. Maricopa County was [recently called out in an article by The Hill](https://thehill.com/homenews/state-watch/459832-the-10-counties-that-will-decide-the-2020-election) as one of 10 counties that will decide the 2020 election.

>As partisan politics increasingly break down along urban and rural lines, Arizona Republicans are becoming more nervous. Arizona is the most urbanized state in the Republican column, and its most urban county, Maricopa, shows signs of inching left.
>In 2016, Trump beat Clinton in Maricopa County by just 3 percentage points, a slightly lower margin than his statewide edge. Only one Republican in recent history has won a statewide election without winning Maricopa County.

[ Maricopa-county specific sankey of reasons for voter removal ]

[Purges: A Growing Threat to the Right to Vote](https://www.brennancenter.org/sites/default/files/publications/Purges_Growing_Threat_2018.1.pdf)

>This data and analysis can provide voters, elected officials, and the media a deeper understanding of how elections are run as well as identify trends and emerging challenges. For election officials, it can provide information not only about their own jurisdiction, but about neighboring jurisdictions and insight into best practices they or other jurisdictions may be using. [^1]

>The EAVS gathers data from states at the jurisdictional level. In most states this is at the county level, and some is at the city or township level. States are responsible for collecting this data for all their jurisdictions.[^1]

#### When can a voter be removed?

>The federal law governing purges12 allows a voter’s name to be purged from the voter rolls on the following grounds: (1) disenfranchising criminal conviction; (2) mental incapacity; (3) death; and (4) change in residence. In addition to these criteria, individuals who were never eligible in the first place, such as someone under 18 or a noncitizen, may be removed. Voters may be removed at their own request (even if they remain eligible).[^2]

- Disenfranchising criminal conviction
- Mental incapacity
- Death
- Change in residence
- Never eligible: under 18 or noncitizen
- Voter self-requests removal

>Out of the 23.5 million votes cast in these jurisdictions, election officials referred only 30 instances of suspected noncitizen voting, or .0001 percent of the total.[^2]

>In nine cases brought by private parties since 2012, election officials agreed to undertake more aggressive list maintenance. One of the defendants in these cases was Noxubee County, a poor, rural, majority-Black county in eastern Mississippi that was sued by the American Civil Rights Union (ACRU, not to be confused with the American Civil Liberties Union).
>“They went after minority counties who didn’t have the financial resources to push back,” said Willie M. Miller, the Election Commissioner for Noxubee County’s fourth district.116 As of this writing, the ACRU is suing Starr County and the State of Texas for failing to purge aggressively enough, and the like-minded Judicial Watch has brought litigation in California.

### Using Datasette

### Creating a Makefile

### Get election results by county

- 2016 President
- 2016 Congress
- 2016 Senate
- 2018 Congress
- 2018 Senate

### Do our analysis

- 2016_P_diff
- 2016_C_diff
- 2016_S_diff
- 2018_C_diff
- 2018_S_diff

Go through EAVS data and create the following fields

- total_voters_removed
- voters_removed_ftr – “failure to respond”
- voters_removed_moved
- voters_removed_other

Once those fields are bound to counties, look for counties where:

• Total voters removed exceeds 2016 President vote difference `removed_exceeds_P2016_diff`

• Total voters removed exceeds 2016 Congress vote difference `removed_exceeds_C2016_diff`

• Total voters removed exceeds 2018 Congress vote difference `removed_exceeds_C2018_diff`

Potentially add a new binary field, or make lists of those counties.

### Visualize

### Resources

<https://github.com/mbostock/ndjson-cli>

<https://medium.com/@mbostock/command-line-cartography-part-1-897aa8f8ca2c>

<https://medium.com/@mbostock/command-line-cartography-part-2-c3a82c5c0f3>
