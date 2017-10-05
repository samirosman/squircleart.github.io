---
title: 'Charts In Animation Nodes: Pie Charts'
layout: post
category: Animation-Nodes
image: "/images/charts-in-animation-nodes-pie-charts/wall.png"
description: In this third tutorial in the Charts In Animation Nodes tutorial series,
  we will create, automate and animate pie charts.
prerequisites:
- text: Grouped Bar Charts.
  url: "/animation-nodes/charts-in-animation-nodes-grouped-bar-charts.html"
- text: HUD In Animation Nodes.
  url: "/animation-nodes/hud-in-animation-nodes.html"
- text: Experience In Animation Nodes.
previous_part: "/animation-nodes/charts-in-animation-nodes-grouped-bar-charts.html"
---

## Utilities

A pie chart is composed of a number of circle sectors, so it is clear that we will need a subprogram to generate a circle sectors. We created a very similar subprogram in our other tutorial about [HUDs In Animation Nodes](/animation-nodes/hud-in-animation-nodes.html#example-3), we will use the same subprogram with a very slight modification, that is, we will define the sector by a start and an end angle just to make it easier to use. The modification is just a simple value remapping so you should be able to do it on your own.

![Circle Sector Generator](/images/charts-in-animation-nodes-pie-charts/circle_sector_generator.gif)

## Data

The data I have represents the number of sessions from each country on my site this month. We parse data just as we learned before:

![parser](/images/charts-in-animation-nodes-pie-charts/parser.png)

Now we have to compute the start and end angle of each sector. Obviously, each sector will have $\Delta \theta$ (Arc Length at constant radius) of:

$$
\frac{2x\pi}{s}
$$

Where $x$ is the parsed value and $s$ is the sum of all parsed values. Now that we have $\Delta \theta$ of each sector, we can go ahead and compute the start and end points using the recursive sum I told you about [before](/animation-nodes/charts-in-animation-nodes-bar-charts.html#bars-advanced-animation).

![Angle Generator](/images/charts-in-animation-nodes-pie-charts/angle_generator.png)

At the first iteration, `Recursive Sum` ( $\rho$ ) is zero and so the start angle of the first sector is zero and the end angle is $\rho+\Delta\theta_i= 0 + \Delta \theta_0 = \Delta \theta_0$ which makes sense, we reassign the $\rho$ to the end angle. At the second iteration, $\rho$ is $\Delta \theta_0$ and so the start angle of the second sector is $\Delta \theta_0$ and end angle is $\rho+\Delta \theta_i= \Delta \theta_0 + \Delta \theta_1$, we reassign the $\rho$ to the end angle, and so on.

{% include challenge.html content="Can you calculate the sum of the parsed data inside the loop?" %}

## Sectors

Now all we have to do is to add some objects and write the mesh data to it.

![Sectors](/images/charts-in-animation-nodes-pie-charts/sectors.png)

I then overwrite all the materials in this render layer with a randomized material to color objects with random different colors.

![Colors](/images/charts-in-animation-nodes-pie-charts/colors.gif)

You can of course set the colors manually which i will do latter based on some nice color pallet.

## Texts

We will now add the names of the countries to the chart. The location of the text objects will be at the center of the arc of each sector, to compute that, we simply get the average of the start and end angles and then compute the location from that angle.

![Texts 1](/images/charts-in-animation-nodes-pie-charts/texts1.png)

This however introduces a problem, the texts are intersecting the sectors, to fix this, we will use the Horizontal and Vertical align options of the texts. If the text has a positive x location then it should be aligned to the `LEFT` and to the `RIGHT` otherwise, if the text has a positive y location then it should be aligned to the `BUTTON` and to the `TOP` otherwise.

![Texts 2](/images/charts-in-animation-nodes-pie-charts/texts2.png)

Which makes texts perfectly aligned.

## Variations

Pie charts can come in a lot of forms, the usual form is the complete circle which we already did. Another form is the hollow circle form and it can be simply done by changing the inner radius.

![Form 2](/images/charts-in-animation-nodes-pie-charts/form2.png)

Or you could change the radius dynamically resulting in:

![Form 3](/images/charts-in-animation-nodes-pie-charts/form3.png)

How about we extend that to 3D using a solidify modifier?

![Form 4](/images/charts-in-animation-nodes-pie-charts/form4.png)

## Animation

Now lets animate those pie charts in a nice appealing way.

### First Method

![Method 1](/images/charts-in-animation-nodes-pie-charts/method1.gif)

This method just animate the start and end angles of each sector  using a simple multiplication.

### Second Method

![Method 2](/images/charts-in-animation-nodes-pie-charts/method2.gif)

This method uses the delay falloff node like we did in the bar charts.

### Third Method

![Method 3](/images/charts-in-animation-nodes-pie-charts/method3.gif)

We can animate the radius as well.

I think that conclude this tutorial because I can't think of any more *creative* things to do. Show me some of your results.
