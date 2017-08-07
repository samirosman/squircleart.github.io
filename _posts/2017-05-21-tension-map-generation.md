---
title: Tension Map Generation
layout: post
category: Animation-Nodes
image: "/images/tension-map-generation/wall.png"
description: In this tutorial, I am going to teach how to generate tension maps in blender using Animation Nodes.
---

A tension map is a map that represents the change of the density of a mesh. The change of density is usually defined as the change of areas of polygons during deformation or the change of the lengths of the edges during deformation.

The tension maps we will be creating will be computed per polygons or vertices and will be stored in vertex color maps in blender, as a result, it is mostly practically useless because vertex color maps in blender are interpolated badly. However, you make use of it indirectly as you may see in future posts.


## Vertex Colors

The following implementation will make an intensive use of vertex colors, so make sure you read and fully understand the [Animation Nodes Vertex Colors](https://squircleart.github.io/animation-nodes/animation-nodes-vertex-colors.html) tutorial.

### Recap

Writing color data list `Colors` to input `Object` that has a vertex color map `Map` is done using the following script:

~~~python

map = Object.data.vertex_colors[Map]

for i, color in enumerate(Colors):
	map.data[i].color = color

~~~

Generating the loops color list `Colors` from the vertex color list `Vertex Colors` for the mesh with polygon indices `Polygon Indices` is done using such loop:

![Recap 1](/images/tension-map-generation/recap_1.png)

Generating the loops color list `Colors` from the polygon color list `Polygon Colors` for the mesh with polygon indices `Polygon Indices` is done using such loop:

![Recap 2](/images/tension-map-generation/recap_2.png)

# Polygon Tension

We will first look at computing tension maps for polygons as it is trivial.

## Algorithm

Let us assume that we want to compute the tension map for a rigged mesh. The bones of the rig when posed deform the mesh and thus result in tension in some places and relaxations in others relative to the mesh's initial state. The rigging is introduced in blender as a modifier called **Armature** modifier, if the modifier is disabled the mesh will return to its initial state. So, I could just compare the mesh data with and without the modifier enabled to get my tension map.

There is two main ways to compare mesh data in order to investigate tension. The method we will be looking at now  is done by comparing the areas of the polygons before and after deformation. Which is really simple, so we will move to implementation directly.

## Implementation

![Polygon Tension Node Tree](/images/tension-map-generation/polygon_tension_node_tree.png)

1. Get the local areas of polygons for the mesh with and without *Use Modifiers* enabled. This will get us the areas of polygons before and after deformation.
2. Loop over both areas, subtracting them to get $\Delta {A}$
3. Compose a generic list that represent the color $(\Delta {A}, -\Delta {A}, 0)$, if the area decreased, it will have a high red value, if it increased, it will have a high green value.
4. Input the result color list into the **Polygon Sampler** to get the color per loop rather than polygons.
5. Input the resulted color list to the script node **AN_SV** to write the color data to the vertex color map `Tension Map`.

{% include note.html content="Notice that negative values are clamped in vertex color maps, thats why we included $-\Delta {A}$ in the green channel." %}

Now by posing the bones we see the result:

![Polygon Tension Result](/images/tension-map-generation/polygon_tension_node_tree.gif)

We notice that the vertex color isn't smooth because it is per polygon thats why we are not going to use this method.

# Vertex Tension

Vertex based computation of tension maps is the solution for smoother result, however, its implementation is more sophisticated and slower. In fact, my first implementation took 8 seconds to run compared to 0.02 seconds for the polygon method, after couple of more implementation and couple of more hours, I managed to cut that time to 0.08 and even 0.05 when using caching.

## Algorithm

Instead of comparing areas of polygons, we will compare lengths of edges of each vertex, that is, each vertex compose edges which have lengths, we will compare the lengths of those edges and write the data to the vertices.

The main problem in this implementation is finding the edges that each vertex compose. The most efficient way I found (let me know if you have a better method) is to make an operational loop that compute the indices of the edges that compose each vertex in advance. The algorithm is pretty simple but its implementation may be new to you, here is the algorithm:

1. Create a list of empty lists of length `n` where `n` is the number of vertices of the mesh.
2. Loop over the the edge indices of the mesh and do the following:
	- For each index in the edge indices do the following:
		4. Get the empty list at that index.
		5. Append the iteration index to that list.
6. Output the empty list. (Which got filled)

The algorithm is pretty much self explanatory. If the edge indices include an index of a vertex, then this edge is composed of the vertex and it should be added to the empty list that represent that vertex, when I say it should be added I mean its index which is the loop index since we are looping over edge indices. The empty lists will be gradually filled with indices of the edges till each of them fully contain all the indices of the edges that compose the vertex at the same index as itself.

We now have a list that contain the indices of the edges of each vertex, the rest of the algorithm is as follow:

- Loop over the the output list of the previous algorithm and do the following:
	2. Get the lengths of the edges with modifiers disabled at the iterator's list indices and sum them.
	3. Get the lengths of the edges with modifiers enabled at the iterator's list indices and sum them.
	4. Compute $\Delta L$.
	5. Compose a generic list that represent the color $(\Delta {L}, -\Delta {L}, 0)$, if the total length decreased, it will have a high red value, if it increased, it will have a high green value.

Now that you have a good idea of the algorithm, lets move on to the implementation.

## Implementation

![Vertex Tension Node Tree](/images/tension-map-generation/vertex_tension_node_tree.png)

To compute the edge lengths, we use the *Edge Info* node. To create an empty list with `n` number of empty list we use the following list comprehension:

~~~python

[[] for _ in range(n)]

#If n = 5, then the result will be:
[[], [], [], [], []]

~~~

The `_` is usually used in programming when the variable isn't used which is the case here.

Notice that in the **Edges Of Vertices** subprogram, we are using the append nodes as actual appenders, which means we won't use their output, the output of the list is the input empty list after elements were appended to it.

Notice that one can cache the result of the **Edges Of Vertices** subprogram because it is constant for all states of deformation of the mesh. This will speed things up.

Notice that I didn't compute the lengths of the edges inside the loop because the *Edge Info* node is a C level node that execute very fast, so we make use of it.

And the result is a smooth looking tension map:


![Polygon Tension Result](/images/tension-map-generation/vertex_tension_node_tree.gif)

On my PC, it is running at 0.05s for a mesh of 1,120 polygon. Which is pretty reasonable relative to my previous experiments.

There is a third method I want to show you though, that method is an intermediate method between polygons and vertices tension, that is, we use polygon areas of polygons that compose the vertex instead of edge lengths that composed the vertex. The result of such node tree is slightly better than the previous method.

# Vertex-Polygon Tension

This method is exactly the same as the previous method except we have polygon indices instead of edge indices. So the only difference will be in the classifier and the appending process which will be automated. Since it is pretty similar, I won't explain it, here is the node tree:

![Polygon-Vertex Tension Node Tree](/images/tension-map-generation/vertex_polygon_tension_node_tree.png)

# Comparison

![All Three](/images/tension-map-generation/wall.png)

Those are all three algorithms, Polygon, Vertex, Vertex-Polygon from left to right. The Vertex-Polygon method is smoothest at high deltas while Vertex method is smoothest at small deltas. Use a combination of both if you want, if you have a better method, please share with me.
