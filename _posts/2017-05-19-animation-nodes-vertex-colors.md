---
title: Animation Nodes Vertex Colors
layout: post
category: Animation-Nodes
image: "/images/animation-nodes-vertex-colors/wall.png"
description: In this tutorial, I am going to teach you about blender's mesh loops
  and how we can utilize them to write color data to vertex color maps in Animation
  Nodes.
prerequisites:
- text: Good knowledge of Loops in Animation Nodes.
  url: /animation-nodes/the-essence-of-animation-nodes-notes-on-loops.html
- text: Very basic knowledge of python.
---

## Vertex Color

A vertex color map is a color data associated with blender's meshes, render engines can then access those data to render meshs colored .

The "Vertex Color" name is a bit misleading, it should be noted that color data is not per vertex, rather it is per **loop**. A loop is basically a vertex of a polygon, so if a vertex is part of four polygons, it will compose four loops, lets look the following illustration:

![Loops](/images/animation-nodes-vertex-colors/loops.svg)

The above is a mesh with 4 polygons, each polygon has 4 vertices and subsequently 4 loops. I represented loops by colored dots, you notice that each vertex has either 4 loops as blue loops, 2 loops as red loops or a single loop as violet loops.

Below, you see a vertex color map with one of the loops colored blue (The blue loop in polygon 3) and the rest is colored white.

![Single Loop](/images/animation-nodes-vertex-colors/single_loop.png)

There are some advantages of using loops instead of vertices, the main advantage is the ability to color polygons as well as vertices. If we want to color a polygon, we should color all the loops that it includes.

![Polygon](/images/animation-nodes-vertex-colors/polygon_vertex_color.png)

If we want to color a vertex, we should color all the loops that represent the vertex in all polygons (all loops that are represented by the blue dots).

![Vertex](/images/animation-nodes-vertex-colors/vertex_vertex_color.png)

## Python API

Let us now see how we can write the color data to a vertex color map in blender python. As we learned in the [scripts tutorial](/animation-nodes/the-essence-of-animation-nodes-scripts.html), we follow the location of the data in the API till we find it.

Assuming that there is an object called `"Cube"` and it has a vertex color map called `"Map"`, we can define the vertex color map and write to it as follows:

~~~python

map = bpy.data.objects["Cube"].data.vertex_colors['Map']

#Color the first loop blue.
map.data[0].color = (0,0,1)

~~~

{% include note.html content="Notice that it expects a 3D tuple because there is no alpha channel, (red, green, blue)"  %}

Ok, now that you know how to access and write to the vertex color map. Lets make a script that takes a color list that represents the colors in the pattern [[R,G,B], [R,G,B], [R,G,B], ...] and assign them to all loops in order.

~~~python

#Define some arbitrary list of colors
colors = [
	[1,0,0],[1,0,0],[1,0,0],[1,0,0],
	[1,1,0],[1,1,0],[1,1,0],[1,1,0],
	[0,0,1],[0,0,1],[0,0,1],[0,0,1],
	[1,1,0],[1,1,0],[1,1,0],[1,1,0],
	[1,1,0],[1,1,0],[1,1,0],[1,1,0],
	[1,1,0],[1,1,0],[1,1,0],[1,1,0]
	]

#Define the vertex color map
map = bpy.data.objects["Cube"].data.vertex_colors['Map']

#Loop over colors and set them to loops
for i, color in enumerate(colors):
	map.data[i].color = color

~~~

The `for` loop basically loop over the colors in my color list and assign them to loops. The python operator `enumerate` assign the index of of the iterator (color) to the variable `i`. So `i` in the first iteration will be 0, second will be 1, third will be 2, and so on.

Since our color list is a nested list, that is, it is a list that include smaller lists and since AN doesn't support nested lists or multidimensional arrays, we will have to use techniques described in [Converter Node](/animation-nodes/the-essense-of-animation-nodes-data.html#converter-node) and [Vectorized Loop Outputs](/animation-nodes/the-essence-of-animation-nodes-loops.html#example-44c), so make sure yo understand them well before continuing.

## Example 1

![Example 1](/images/animation-nodes-vertex-colors/example1.png)

### Demonstration

The number of loops is $6 \times 4 = 24$ because our mesh is a cube with 6 faces and each face has 4 vertices. I generate some random color (a list of 3 floats) and output it to a generic list after converting it to a generic type using the converter node (This will tell AN not to append list's elements but to append the list as a list object). The output is a nested generic list that contain 24 random color (The output is similar to the `colors` list we define in the code before). Using a script node with the script we wrote above, I output those 24 colors to their corresponding loops.

## Polygon Coloring

![Cube](/images/animation-nodes-vertex-colors/cube.svg)

This is a cube with its vertex indices displayed in blue and polygon indices displayed in red. Loops are ordered in mesh as follows:

- Loops of the first polygon are stored first, loops of the second polygon are stored next, and so on.
- Loops in individual polygons however are sorted from the lowest index to the highest.

An example for the order of the loops in the API is as follows:

$$
\begin{aligned}
\text{loops} = (&(0, 0), (1, 0), (2, 0), (3, 0),\\
                                 &(0, 1), (1, 1), (2, 1), (3, 1),\\
																 &(0, 2), (1, 2), (2, 2), (3, 2),\\
																 &(0, 3), (1, 3), (2, 3), (3, 3),\\
																 & \dots)
\end{aligned}
$$

By $(x, y)$ I mean the loop of vertex $x$ in polygon $y$. Above figure represent the list of loops in order, I put the loops of the same polygon in a row for better visuals. You notice that loops of the first polygon (polygon 0) are stored first while loops of the second polygon (polygon 1) are stored next, and so on. Loops per row or polygon are stored from vertices of the lowest index to the highest, thats why you see the vertex indices $x$ increasing as we go through the list.

If I want to color polygons instead of loops, then all the loops in the same polygon (row) should have the same color. In the example above, if I wanted to color the first polygon red and second polygon green, I will have to generate four red colors followed by four green colors, because each polygon has four vertices and subsequently four loops. But in real life situation, meshes are not always quads so we don't know the number of loops of each polygon, we have to find a more generalized way to color those polygons.

### Implementation

![Polygon Vertex Color Implementation](/images/animation-nodes-vertex-colors/polygon_vertex_color_implementation.png)

#### Random Generator

The random generator loop just generate 6 random colors for each polygon in the cube (which has 6 faces) so that we can use them to test our implementation.

#### Sampler

We said that loops of polygons are stored in the same order of polygons, so loops of the first polygons are first, loops of the second polygon are second and so on. We also said that in order to color a polygon using a solid color, we have to color all its loops with the same color. An example of a color list that color polygons using the conventional representation we used before would be:

$$
\begin{aligned}
\text{loops} = (&C_1, C_1, C_1, C_1,\\
                                 &C_2, C_2, C_2, C_2,\\
																 &C_3, C_3, C_3, C_3,\\
																 &C_4, C_4, C_4, C_4,\\
																 & \dots)
\end{aligned}
$$

Where $C_1, C_2, C_3, \dots$ are colors. You notice that first four loops are colored the same, next four are colored the same and so on. Of course loops per polygons won't be four every time, we will compute the number of loops in a moment.

So it is clear that we will loop over polygons and colors, fill a list with current color where the list length is equal to the number of vertices (loops) of that polygon.

Animation Nodes provide us with polygon indices which include the indices of the vertices in the polygons, so if we computed the length of the polygon indices we will get the number of loops of that polygon since the number of loops is equal to the number of vertices of the polygon.

Go back to the illustration and compare the result of our implementation with it to understand this better.

{% include challenge.html content="Can you set the color of each polygon to its normal or area?" %}

## Vertex Coloring

![Cube](/images/animation-nodes-vertex-colors/cube.svg)

Looking at the illustration again, We see that in order to color a vertex fully, we have to color all the loops that represents the vertex in all the polygons with the same color. So loops $(0,0), (0,1),(0,2)$ should all have the same color.

### Implementation

![Vertex Vertex Color Implementation](/images/animation-nodes-vertex-colors/vertex_vertex_color_implementation.png)

#### Random Generator

Just like the polygon coloring, we generate a list of random colors, but in this case, we generate 8 of them because our cube has 8 vertices.

#### Sampler

Just like the polygon coloring, I loop over polygon indices because it is the only way, since loops are ordered based on polygons.

If you noticed, loops that should be colored the same like $(0,0), (0,2),(0,3)$ all have the same vertex index (the same $x$), but we have the polygon indices which include the indices of the vertices, then if I got the colors at the polygon indices, all my loops of the same vertex will have the same color. Take your time to think about it.

{% include challenge.html content="Can you set the color of each vertex to its normal or location?" %}

***
***

You now know how to deal with loops (not the subprogram) and vertex color maps in Animation Nodes. Future tutorials will make use of what we learned today, so make sure you understand it well.