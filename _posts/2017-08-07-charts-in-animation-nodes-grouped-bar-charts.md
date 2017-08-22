---
title: 'Charts In Animation Nodes: Grouped Bar Charts'
layout: post
category: Animation-Nodes
image: "/images/charts-in-animation-nodes-grouped-bar-charts/wall.png"
description: In this second tutorial in the Charts In Animation Nodes tutorial series,
  we will create, automate and animate grouped bar charts.
prerequisites:
- text: Bar Charts in Animation Nodes tutorial.
  url: /animation-nodes/charts-in-animation-nodes-bar-charts.html
- text: Experience in Animation Nodes.
---

We are going to use the same plane we created in the bar charts tutorial with some slight modification, so lets head to data parsing and grouped bars creation directly.

## Data

Lets say we are comparing 5 GPUs in some game displaying their minimum, maximum and average frame rate, then our data may be like this:

~~~

GPU 1 : 147, 169, 28
GPU 2 : 154, 90, 58
GPU 3 : 165, 129, 82
GPU 4 : 158, 110, 30
GPU 5 : 175, 140, 69

~~~

The parsing process will also be similar to the way we parsed the data in the bar charts tutorial.

![Grouped Bars Parser](/images/charts-in-animation-nodes-grouped-bar-charts/grouped_bars_parser.png)

After we split the line using the separator `:`, we end up with two texts, one that include the name and one that include the *fps* separated by `,` so we split again using the separator `,` to get individual *fps*, then we parse them and append them to an output integer list. You will see why we didn't classify them into separate list in a moment. You will also notice that I added an *output* parameter which is assigned to the length of the second split. For the example above, the parameter will be equal to `3` because we have minimum, maximum and average.

We now have the data parsed and ready to be used.

## Grouped Bars

If you remember correctly, what we did in the previous tutorial is replicate a unity square along the x axis (using a range node) and then scale it according to its corresponding parsed value. In order to make a grouped bar chart, we have to replicate two times, one time to form each group (Which will contain 3 bars ) and another time to take each group and replicate it for each GPU. But if we replicated the group, we won't be able to control the scale of each element of the group individually. So the answer is simple, instead of replicating the group itself, we will replicate its transformation matrices and then use those matrices to replicate the bars giving us the ability to control each bar independently, if you don't understand this, no worries, you will understand in a moment.

The distribute matrices node can be used to create a certain amount of matrices arranged in a line, we will use it to locate bars within each group where the size controls the spaces between them:

![Distribute Matrices Node](/images/charts-in-animation-nodes-grouped-bar-charts/distribute_matrices_node.png)

The replicate matrices node can then be used to replicate those matrices along the x axis using the translation vector we created in the previous tutorial using the range node.

![Replicat Matrices Node](/images/charts-in-animation-nodes-grouped-bar-charts/replicate_matrices_node.png)

Those matrices can then be multiplied by scaling transformation matrices that contain the values we parsed in the y values where the x value is just some arbitrary variable that controles the width of the bars. That's why we appended the parsed values without classification, because matrices are flat and not grouped or classified.

![Scaling Matrices](/images/charts-in-animation-nodes-grouped-bar-charts/grouped_bars_scaling.png)

The resulted matrices can in turn be used to replicate the unity square to make the bars:

![Replicating](/images/charts-in-animation-nodes-grouped-bar-charts/replicate_rectangle.png)

There is something we have to take care of though, lets say our y scale will range between 0 and 182 and the length of the y axis is 9. If we used the parsed data directly we will get very high bars, you probably know what to do by now. We normalize the *fps* by dividing by 182 and then multiply by the y axis length putting the bars in their right scale. And the result is already usable:

![Grouped Bars Final Red](/images/charts-in-animation-nodes-grouped-bar-charts/grouped_bars_red.png)

Now I am going to do something I haven't told you about before and that is, giving different colors to our bars. I will add 3 materials which are red, blue and yellow, I want to assign the first material to the first bar of each group, second to second and third to third. Animation nodes let us define the material of each polygon easily using the *Material indices* input in the *Mesh Object Output node* . The material indices input is an integer list with length equal to the number of polygons in the mesh. The first integer is the index of the material of the first polygon, second integer is the index of the material of the second polygon and so on. So for our case, we need the indices to be $(0, 1, 2, 0, 1, 2, \cdots)$, this finite sequence can be easily achieved using the rule:

$$
T_i = i \bmod 3 \quad \forall \quad i < n
$$

Where $n$ is the number of polygons in the mesh, resulting:

![Material Indices](/images/charts-in-animation-nodes-grouped-bar-charts/material_indices.png)

Giving a result:

![Grouped Bars Final](/images/charts-in-animation-nodes-grouped-bar-charts/grouped_bars_final.png)

And that's it, we have our grouped bars chart, same automations we did in the previous tutorial applies here so no need to explain it.

## Animation

If we used the same node trees we did in the previouse tutorial, we will get an already nice animation:

![Grouped Bars Final Animation](/images/charts-in-animation-nodes-grouped-bar-charts/grouped_bars_final_animation.gif)

One might need to edit this animation such that all bars within each group rise at the same time and this can easily be achieved by using a transformation matrix instead of a translation vector in the replicate matrix node matrix where the y scale of the transformation matrix will be controlled using the same falloff you used before.

![Animate Groups](/images/charts-in-animation-nodes-grouped-bar-charts/animate_groups.png)

Giving the animation:

![Grouped Bars Final Animation 2](/images/charts-in-animation-nodes-grouped-bar-charts/grouped_bars_final_animation_2.gif)

{% include challenge.html content="There is another method to achieve the previous animation using falloffs, can you find it?" %}

I think that that's it when it comes to bar charts, stay tuned for next type of charts we will be creating.