---
dek: See behind the scenes of election night coverage with Electology, the new tool transforming live data analysis. 
inprogress: true
date: 2022-12-05T18:34:09-05:00
modified: 2024-05-16T14:14:44-04:00
tags:
---

## Unveiling Electology: The Election Analysis Tool You Didn’t Know You Needed

I'm excited to tell you about Electology, my passion project that brings together everything I've learned and wanted to achieve in the realm of election data visualization and analysis. After working at NBC News and creating the app used by Steve Kornacki for live election coverage, I decided to take all the ideas and features I couldn't implement there and build something even better on my own. That's how Electology was born.

Electology has two main components. The first is a touchscreen application designed for TV anchors to use during election nights. This app allows them to show not only live election results but also delve into historical data to tell compelling stories about the elections. What makes this touchscreen app unique is that it uses web technology and powerful data visualization libraries. This means it's fully extensible and can be customized to match the graphic styles of any network, which is a huge plus for major clients like NBC or CBS who have specific styling and colors for their graphics packages.

One of the things I'm really proud of is our ability to create advanced data visualizations. We have everything from swing arrows and scatter plots to bivariate choropleth maps. These unique visualizations help tell intricate stories about election data that other tools just can't match, with visuals that are broadcast-ready at all times.

The second component of Electology is our digital maps, which news outlets can embed directly into their websites. These maps stand out because they offer incredibly high-resolution results, down to the precinct level wherever possible. We also integrate as much historical and demographic data analysis to give crucial context to emerging stories. This level of detail is a key part of accurate analysis and storytelling.

Another core approach is our AI-augmented data-driven sentences. These are text displays that highlight the most important insights in various geographic regions, helping users understand the data better and identify outliers or changes. We've also enhanced these sentences with LLMs to incorporate large datasets of historical and demographic results, providing deeper context and explanations.

We also incorporate a wealth of historical election data from sources like the MIT Media Lab and FEC campaign finance data, alongside demographic data from the Census Bureau. This comprehensive collection of data allows users to analyze trends and patterns without making outright predictions about future outcomes. Instead, we provide a range of analysis tools so users can make their own informed assumptions and predictions.

At Electology, we trust you to get the data. We cut out the fluff and give you direct access to the raw numbers, no middleman.

Electology is about empowering users with the tools and data they need to understand and analyze elections deeply. Whether it's a TV anchor needing to explain what's happening in real-time or a news outlet looking to provide their audience with interactive maps, Electology has something to offer.

I'm constantly refining and improving Electology, and I'm excited about its future. There are always new features and improvements on the horizon, and I'm thrilled to see how it will continue to evolve and help people make sense of election data.

### Touchscreen Application

- **Web Technology**: Uses powerful data visualization libraries like D3 and WebGL for full customization.
- **Broadcast Integration**: Can match any network's graphic style and integrate with broadcast systems like VizRT
- **Advanced Visualizations**: Includes swing arrows, scatter plots, and bivariate choropleth maps.

### Digital Maps

- **High Resolution**: Detailed results down to the precinct level wherever possible
- **Embeddable**: Easy integration into news websites and client content management systems
- **User-Friendly**: A strong emphasis on intuitive design that can accommodate a spectrum of user expertise.

### Data Integration

- **Historical Data**: Election data from the MIT Media Lab and FEC campaign finance data.
- **Demographic Data**: Analyzes trends using Census Bureau data.
- **Performance**: Optimized to handle high-resolution data seamlessly.

### Analysis Tools

- **Custom Analysis**: Tools for users to explore, visualize, and share their own predictions.
- **Data-Driven Sentences**: Reiterates key insights from visualizations automatically, increasing user engagement and approachability

Electology handles the immense scale of historical live and election data with a robust and innovative infrastructure. By leveraging technologies like Netlify Edge functions and CloudFlare workers, we ensure that our processes run efficiently at the edge, significantly reducing latency and improving performance during peak times. We also focus on strategically slicing our datasets across time and geography so we can provide deep analysis while maintaining performance.

One of our key strategies involves building SVGs and serving them as static assets, which allows us to perform computational tasks efficiently on the server and use an image CDN to cache maps. This method ensures consistent and responsive data visualization across devices even under heavy loads, making Electology reliable and fast during critical election moments.

Accuracy and timeliness of data are at the heart of Electology. All year long we are continuously updating precinct boundaries and demographic data by sourcing from various projects and sources. This ongoing effort guarantees that our users always have access to the most current and precise election information. Our commitment to maintaining up-to-date datasets underscores the value we are providing our users, who would otherwise need to be doing this constant upkeep themselves.

Customization and ease of use are central to Electology's design. By utilizing familiar web technologies, we've made the system highly accessible to newsrooms with web development capabilities. We have also created a number of tools that allow for easy integration into OBS, so that you can easily livestream of create videos with a variety of broadcast-friendly realtime data visualizations.

Our modular approach allows for quick adjustments and last-minute changes, essential for the dynamic environment of live news coverage. Our backend producer tool allows you to preset areas of focus, bookmark races and locations, and integrate external data sources like polling and campaign finance into sequential slides, so you can spend your time telling your story instead of clicking around.

Our intuitive user interface caters to a wide range of users, from TV anchors needing quick visualizations to analysts conducting in-depth data explorations.

Regarding data security and privacy, Electology primarily uses public historical and open data sources, minimizing privacy concerns. Our focus is on providing accurate and accessible election data, ensuring that users can trust the information they receive without worrying about sensitive data breaches.

We ensure the accuracy and reduce the bias in our AI-enhanced data-driven sentences through rigorous testing and a controlled approach. By using historical data extensively to validate our models and adopting a Mad Libs-style method where the AI repeats specific data fed to it, we mitigate the risk of inaccuracies and biases. This approach ensures that our users receive factual and reliable information, enhancing their understanding of election data.

While Electology isn't fully open source, we believe in the power of transparency and release portions of our code to the community and work in the open as much as possible. Our primary focus has been on creating the best possible product for our users, and managing a fully open source project would require extensive documentation and maintenance efforts.

We are hoping Electology will stand out in the market by offering a premium, highly detailed product designed with meticulous care. Every aspect of the tool has been thoughtfully considered, making it a luxury product for those who want to really understand election data, regardless of skill level.

Our ethical guidelines emphasize transparency and trust, providing users with direct access to their data without unnecessary summaries or delays, allowing them to draw their own informed conclusions.

Integrating Electology with existing systems is designed to be streamlined and efficient. We've done extensive work to ensure compatibility with common CMS platforms like WordPress and Drupal, making it easy for our clients to incorporate our maps into their workflows. Typically, we can achieve integration within a month.

We made Electology simple and customizable. Whether you're whipping up quick visuals for TV or diving deep into the numbers, Electology's got your back.

We’re all about transparency and precision. We hand you the detailed datasets and powerful tools to uncover the real stories behind the elections.