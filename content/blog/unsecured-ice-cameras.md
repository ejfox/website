---
dek: In which the author attempts and fails to find interesting unsecured webcams near known ICE facilities
type: words
hidden: false
inprogress: false
date: 2019-03-24T04:00:39-04:00
hidetimestamp: false
modified: 2024-06-21T10:13:37-04:00
---

## Attempting to find unsecured ICE cameras

A friend DMs me on Twitter:

>yo, you know how security cameras are sometimes open feeds on the internet?
>is there any chance ICE fucked up in this very specific way at a facility?

That sounds very plausible. Let’s give it a try. [Webcam scanning with Shodan](https://www.vice.com/en_us/article/59vm4x/tool-exposed-cameras-map-shodan-python-github) is a pretty well-known technique at this point. I’m not very familiar with it, so it’s time to learn.

::table-of-contents

::

### First idea: IP ranges

With cursory knowledge, it seemed like the best approach would be to feed Shodan an IP range for the state of Texas (or other Mexico-border states) and then look through the resulting webcams by hand for anything that looks like a prison, holding facility, or government institution.

To do this, first you would need to find [IP ranges for the state of Texas](https://www.xmyip.com/ip-addresses/united--states/texas)

The first thing that jumps out to me is El Paso, home to the [ICE El Paso Processing Center](https://www.ice.gov/detention-facility/el-paso-processing-center) where a [Honduran migrant died in late May](https://www.nbcnews.com/news/latino/honduran-man-dies-ice-custody-texas-facility-n1025526).

>El Paso: 12.162.129.0 - 12.162.129.255

### Better idea: query by latitude and longitude

But then I started doing more research on how to use shodan, and found a great guide:

[How to Find Vulnerable Webcams Across the Globe Using Shodan](https://null-byte.wonderhowto.com/how-to/hack-like-pro-find-vulnerable-webcams-across-globe-using-shodan-0154830/)

>Shodan even enables us to be very specific in searching for web-enabled devices. In some cases, we can specify the longitude and latitude of the devices we want to find.
>In this case, we will be looking for WebcamXP cameras at the longitude and latitude (-37.81, 144.96) of the city of Melbourne, Australia. When we search, we get a list of every WebcamXP at those coordinates on the globe. We must use the keyword geo followed by the longitude and latitude.
>`webcamxp geo: -37.81,144.96`

Oh! I don’t need to use IP ranges at all. I can just feed [latitudes and longitudes](https://en.wikipedia.org/wiki/Geo-fence) directly into my searches.

Now, we need a geocoded list of every ICE facility. Luckily, [I’ve already done that](https://trackingice.com/wiki/List_of_holding_facilities) based on data released in response to a FOIA from Immigrant Justice. This data is hosted on a [wikipedia-style site](https://trackingice.com) I created for open source information related to ICE.

This [excellent resource on manipulating CSVs with the command line](https://bconnelly.net/posts/working_with_csvs_on_the_command_line/) teaches us:

>Specific columns can also be easily extracted from CSVs. For example, if we wanted to extract columns 2, 4, 5, and 6 from input.csv:
>`cut -d , -f 2,4-6 input.csv`

[How do you use CSV lines as command parameters?](https://unix.stackexchange.com/questions/41598/using-csv-line-as-command-parameters)

## Shodan CLI

The first [example in the Shodan CLI](https://cli.shodan.io/) documentation is `shodan count microsoft iis 6.0` which returns `5310594`

What we want to do is go through our list of ICE facilities and do shodan scans of their longitude/latitude.

Using the shodan CLI, it should be possible to automate this a bit.

Basically we want to parse our CSV of every facility, pull out the latitude and longitude of that facility, feed that to shodan, run our search, and save the results to a file where we can go back and look for any results (anything besides a 0).

We want our results to look something like this:

| lat | lng | results |
| :-- | :-- | :------ |
| 0.0 | 0.0 | 0       |
| 0.0 | 0.0 | 0       |
| 0.0 | 0.0 | 0       |
| 0.0 | 0.0 | **1**   |
| 0.0 | 0.0 | 0       |

[This article](https://null-byte.wonderhowto.com/how-to/hack-like-pro-find-vulnerable-webcams-across-globe-using-shodan-0154830/), helpfully, gives us a list of webcam brands to search for:

- ACTi
- Axis
- Cisco
- Grandstream
- IQinVision
- Mobotix
- Panasonic
- Samsung Electronics
- Samsung Techwin
- Sony
- TRENDnet
- Toshiba
- Vivotek
- WebcamXP

—

Unfortunately I did not find anything. After running through all of these manufacturers and a number of locations, then combing through the results by hand, I did not locate any unsecured webcams of interest to this particular search.

## Additional Resources

[List of webcam default usernames / passwords](https://www.a1securitycameras.com/technical-support/default-username-passwords-ip-addresses-for-surveillance-cameras/)
