---
title: 'Charts In Animation Nodes: Bar Charts'
layout: post
category: Animation-Nodes
image: "/images/charts-in-animation-nodes-bar-charts/wall.png"
description: Bar Charts are essential to representing data in an appealing way. Creating such animations often requires great amount of time and effort, so in this tutorial I am going to teach you how we can automate the creations of such animations.
---

We will start by creating a nice plane to plot our data on. Then we are going to create the bars. Then we are going to animate those bar into nice appealing animations.


### Rectangle Generator

First I am going to make a small utility that basically generates a rectangle based on a position and a dimension vectors. The position vector will define the position of the lower left point of the rectangle while the dimension vector will define the width and height of the rectangle.

![Rectangle Generator](/images/charts-in-animation-nodes-bar-charts/rectangle_generator.png)

The node tree is straight forward and can be understood through this illustration:

![Rectangle Illustration](/images/charts-in-animation-nodes-bar-charts/rectangle_illustration.svg)

If I add the dimension vector to the location vector, I get the location of the upper right point, if I only add the x value (Multiply the y by zero then add), I get the lower right point and finally if I add the y value only (multiply the x by zero and add) I get the position of the upper left point.

## Bars Plane

Lets use the rectangle subprogram we created to make 2 axis as follows:

![Bar Plane Axis A](/images/charts-in-animation-nodes-bar-charts/bar_plane_axis_a.png)

I assumed that the origin of the plane is at $(2,2)$, so you will see us using the number 2 a lot.

Then I am going to replicate some smaller *rectangles* along the y axis as follows:

![Bar Plane Axis B](/images/charts-in-animation-nodes-bar-charts/bar_plane_axis_b.png)

Notice that the dimension vector has a negative width which is a way to tell it to make the rectangle expand in the negative x direction and thus make its origin at the lower right point. The previous step allows us to define the x location of the dashes as just 2 which is our plane's origin x location. For the y location, it will be ranging between 2 which is our plane's origin y location and some bigger number, that number is equal to:

$$
O_y + H - D_h
$$

Where $O_y$ is the y location of the plane's origin, $H$ is the height of the y axis and $D_h$ is the height of the dashes. The addition is trivial but to understand why we subtracted $D_h$ you have to look at this illustration:

![Gap Illustration](/images/charts-in-animation-nodes-bar-charts/gap_illustration.svg)

The addition will position the last dash at the very top of the y axis, however, the origin is at the lower right point of the dash and thus the dash is a bit higher than the y axis leaving us with a gap at the top, to fix this we just subtract the height of the dash, simple as that.

{% include note.html content="Notice that we are using just a translation matrix because scale and rotation doesn't change at all." %}

Now I am going to create the numbers that we will put on our y axis, I will just assume it is some percentage scale.

![Bar Plane Axis C](/images/charts-in-animation-nodes-bar-charts/bar_plane_axis_c.png)

The loop is pretty simple, I take each integer and I add `%` at the end.
Now, we are going to create empty text objects and fill them with the output of the previous loop. Then we are going to position them just as we did with the small rectangles.

![Bar Plane Axis D](/images/charts-in-animation-nodes-bar-charts/bar_plane_axis_d.png)

The y location of the texts is just like the dashes, the x axis will equal to:

$$
O_x - D_w
$$

Where $O_x$ is the x location of the plane's origin and $D_w$ the width of the dashes, this equation works because we set the origin to be at the right using the `RIGHT` horizontal align option in the text object. You may subtract some arbitrary scalar to act as a further offset to the x location.

As for the horizontal axis, we will create it as soon as we get some data because it varies a lot.

Our final plane looks like this:

![Final bar Plane](/images/charts-in-animation-nodes-bar-charts/bar_plane_final.png)

## Data

Lets say our data represents the interests a bank provides from 2013 to 2017 and we will get it in a form of a text block like this:

~~~

2013 : 3
2014 : 2
2015 : 3
2016 : 5
2017 : 9

~~~

We are required to parse this file in order to get the data, so lets do this.

![Bar Parser](/images/charts-in-animation-nodes-bar-charts/bar_parser.png)

Thankfully, the data is very easy to parse. We separate the file by lines, then we split each line using the separator `:` (With 2 spaces on both sides), the first text include the year and the second text include the percentage of the corresponding year, the years should be left as texts because they will just be text objects, the percentages however are going to be used as actual numbers, so we have to parse them using the *Parse Number Node* .

## Bars

Now that we have the years as texts, we can go ahead and assign them to text object as we did before as follows:

![Bar Years](/images/charts-in-animation-nodes-bar-charts/bar_years.png)

We did this multiple times before so no need to explain it.

The workflow of creating the bars is very similar to how we created the small rectangles, you already know how to position the bars because we did it multiple times before. For the scale, we will set the height and width to unity and control them using the scale of the transformation matrices (If I set the x scale to 2, it is like I set the width to 2 directly). The y scale will obviously be the percentages we extracted before.

![Bar Years](/images/charts-in-animation-nodes-bar-charts/bar_bars.png)

By adding bars, we get out full diagram and it looks like this:

![Bars](/images/charts-in-animation-nodes-bar-charts/bars_final.png)


## Automations

This process is just about creating inputs and making calculations explicit, so, you can skip it if you like and do the automations yourself.

### Automating The Plane

Here are the procedures I took in order to make the automation:

1. Make input nodes for every free variable and we connect them, for instance, width of the axis is shared between the dashes, y axis and x axis so we can use a single input for that
2. We assumed before that the origin of the plane was at $(2,2)$, we create a vector for that and use it instead.
3. For dashes y location range node, the end value can be calculated explicitly using the equation we described above.

![Bar Automation A](/images/charts-in-animation-nodes-bar-charts/bar_automation_a.png)

### Automating Percentages

Same as before, we are going to use the information we have as follows:

1. The number of text object and amounts in the range nodes should be connected to the Amount input.
2. We are going to change the type of range node that define the location into *Start/Step* where the step is equal to $\frac{A_h}{n-1}$ where $A_h$ is the height of the y axis and $n$ is the number of percentages or dashes. The why is obvious.

![Bar Automation B](/images/charts-in-animation-nodes-bar-charts/bar_automation_b.png)

### Automating Bars

What I did is as follows:

1. We introduce a free variable called *Graph Margin* and it controles a margin within the graph to avoid crowding it. The starting point of the texts will be the x location of the origin plus the margin while the stop will be the the x location of the origin plus the length of the x axis minus the graph margin.

![Bar Automation C](/images/charts-in-animation-nodes-bar-charts/bar_automation_c.png)

And now we have a fully customizable and flexible node tree for creating bar diagrams. As you may see, it is now just a matter of adding data and playing with some variables.

![Bar Automation](/images/charts-in-animation-nodes-bar-charts/bar_automation.gif)

## Animation

### Animating Plane

We will first animate both axis easily by controlling their width and height as follows:

![Animating Axis](/images/charts-in-animation-nodes-bar-charts/animate_bar_plane_axis.png)


Then we will animate the scale of the dashes and percentages using a single [Delay Falloff Node](https://animation-nodes-manual.readthedocs.io/en/latest/user_guide/nodes/falloff/delay_falloff.html), I marked the new nodes in red to understand this better:

![Animating Axis](/images/charts-in-animation-nodes-bar-charts/animate_bar_plane_dashes.png)

Previous steps yields this result (With some value tuning):

![Animating Plane](/images/charts-in-animation-nodes-bar-charts/animate_bar_plane.gif)

### Animating Bars

We use another [Delay Falloff Node](https://animation-nodes-manual.readthedocs.io/en/latest/user_guide/nodes/falloff/delay_falloff.html) for the years and bars to get:

![Animating Bars](/images/charts-in-animation-nodes-bar-charts/animate_bars.gif)

Now, what if I am making that animation as a part of a video and I want to control at which frame does each bar appear (may be because I want to talk about each bar a bit?) Well, that is very easy to do in AN. The offset parameter in  the [Delay Falloff Node](https://animation-nodes-manual.readthedocs.io/en/latest/user_guide/nodes/falloff/delay_falloff.html) does exactly that:

![Animation Offset](/images/charts-in-animation-nodes-bar-charts/animation_offset.png)

As you may see, I create an integer list, the first integer represent the time at which the animation of the first bar will start, the second represent the time at which the animation of the second bar will start, and so on. The divide node is essential to defining the frames because offsets is affected by the *Delay* input, so we have to divide by the *Delay* value in order to define frames in an absolute manner.
We can of course define those start frames in the text file and parse them as we did with the years and percentages.

We can of course use traditional animation where all bars raise at once as follows:

![Bar Traditional Animation](/images/charts-in-animation-nodes-bar-charts/bar_traditional_animation.gif)

If you can't understand why this works, please read [Introduction To Animation](https://squircleart.github.io/animation-nodes/the-essence-of-animation-nodes-animation.html) and [Value Remapping](https://squircleart.github.io/math/value-remapping.html) posts.

Going back to the falloff animation, the animation of the bar doesn't look nice at all, I realized that this is because bars are of different size and they all raise with the same duration, this means that some bars will rise faster than others, to fix this we will have to go low level and make our own falloff.

### Bars Advanced Animation

Here is what we want to achieve, the first bar should start rising at frame zero and its animation duration should be a scalar multiple of its percentage, the second bar should start rising as soon as the first stop rising (Possibly before, we will discuss this at the end) and its animation duration should also be equal to a scalar multiple of its percentage, and so on. That way, large bars will take more time to rise than smaller bars.

To compute the starting time of each bar, we will use something called **Recrusive Addition**, that is, each bar's starting frame should be the sum of the animation durations of each of the bars preceding it, but we know that the animation durations are in fact the the percentages of the bars or scalar multiples of them, then the starting frame of each bar is defined as the sum of the percentages of all the preceding bars. Lets do the implementation.

![Recrusive Addition](/images/charts-in-animation-nodes-bar-charts/recrusive_addition.png)

I loop over the percentages (Which I will assume it to be $(3, 2, 3, 4, \cdots)$), I have a parameter which is reassigned to its value plus the current value each iteration. And I append the values of the parameter to an integer list.
At the first iteration, the parameter is equal to zero (By default) so the first element in the output list is zero, we reassign the parameter to be its value plus the percentage so its new value becomes $0+3=3$, at the second iteration the parameter is equal to 3 so the second element of the list is equal to 3, we reassign the parameter to be $3+2=5$, at the third iteration the parameter is equal to 5 and so the third element of the output list is 5, we reassign it to be $5+3=8$ and so on. You can test it by hand to see that this is in fact working.

The rest of the node tree is just the traditional animation example, except the duration is also the scalar multiple of the percentage and not some constant:

![Advanced Animation A](/images/charts-in-animation-nodes-bar-charts/bar_advanced_animation_a.png)

{% include challenge.html content="Can you edit the node tree so that animations starts a bit before the preceding animations finish?" %}

Do you remembere the offset parameter in the falloff node? if you want to implement some thing like that in our new node tree, you can just subtract the offset list from the current frame, easy as that.

And our animation now looks like this:

![Advanced Animation](/images/charts-in-animation-nodes-bar-charts/bar_advanced_animation.gif)

It still doesn't look that nice to me, so I am going to do one last thing and that is, changing the animation interpolation from sinusoidal to **Back** with *End Easing* resulting in animation:

![Advanced Animation](/images/charts-in-animation-nodes-bar-charts/final_bar_animation.gif)

Which is relatively good so I will end this tutorial here.
