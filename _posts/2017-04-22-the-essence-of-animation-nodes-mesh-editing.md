---
title: 'The Essence Of Animation Nodes: Mesh Editing'
layout: post
category: Animation-Nodes
image: "/images/the-essence-of-animation-nodes-preface/the-essence-of-animation-nodes.png"
description: The last couple of tutorials were about procedural modeling. In this
  tutorial, will explore a closely related topic, that is, mesh editing in Animation
  Nodes which is editing the geometry of preexisting meshes.
prerequisites:
- text: Very Good knowledge of Loops in Animation Nodes.
  url: /animation-nodes/the-essence-of-animation-nodes-loops.html
- text: Basic knowledge of the spherical coordinates system.
  url: http://mathworld.wolfram.com/SphericalCoordinates.html
---

I will give you 2 examples, one of them is fairly easy and the other is a bit more hard to do as it requires imagination which you hopefully got by now from the procedural modeling tutorials.

# Equirectangular Projection

In this example, I got a vector image of the earth map :

![Map](https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg)[^1]

[^1]: By Crates (Own work) [GFDL](http://www.gnu.org/copyleft/fdl.html) or [CC BY-SA 4.0-3.0-2.5-2.0-1.0](http://creativecommons.org/licenses/by-sa/4.0-3.0-2.5-2.0-1.0), via Wikimedia Commons

I want to convert it into an actual earth model. Since it is a vector image, I could import it as a curve object and then convert it into a mesh using the *Remesh Modifier*  in blender, but it would still be a 2D object, our job is to take this object and turn it into a sphere, which is pretty easy to do as you will see in a moment.

## Algorithm

Any point in our earth is defined by a longitude and a latitude, mathematicians invented some methods to represent maps on a 2D plane using what is known as a **Map Projection** which is basically a transformation of those longitudes and latitudes info from the surface of the earth which is a sphere (or an ellipsoid) into a 2D plane. There is multiple types of projections, the most widely used one is the **Mercator Projection** because it helps in navigation.

What we want to do is the complete inverse, we have the map in the 2D plane and we want to transform it back to a sphere. To solve this problem, we do the following:

1. Identify the type of the projection used to create the map.
2. Find the projection equations and get its inverse.
3. Transform every vertex in the object based on those equations we extracted.

I got the vector image from *Wikipidia* and it had no information regarding the projection type, so there is no way for us to know which projection was used. However, we can make a guess because accuracy is not essential now. The map has a rectangular shape and lands at the top like Greenland are stretched so I am pretty sure it is an **Equirectangular Projection**.

Equirectangular projections makes use of the spherical coordinates system to perform the projection. So looking for some equations that relate the the spherical coordinates to the cartesian coordinates, we find that the 3D Cartesian coordinates to Spherical coordinates [equations](http://mathworld.wolfram.com/SphericalCoordinates.html) are defined as:

$$

r = \sqrt{x^2+y^2+z^2}\\
\theta = \arctan{\frac{y}{x}}\\
\phi = \arccos{\frac{x}{r}}

$$

Where $r$ is the radius of the sphere, $\theta$ is the longitude which ranges between $[0,2\pi]$ and $\phi$ is the latitude which ranges between $[0,\pi]$. However, we are interested in the inverse transformation, that is, Spherical coordinates to 3D Cartesian coordinates, which is defined as:

$$

x = r\cos{\theta}\sin{\phi}\\
y = r\sin{\theta}\sin{\phi}\\
z = r\cos{\phi}

$$

So now, all we need to do is to make sure that our $\theta$ and $\phi$ are in the right range, that is, $[0,2\pi]$ and $[0,\pi]$ respectively and then we can apply the equations above directly without any problems.

## Implementation

First step is to get the vertices locations and put them in their right range. To remap values to a specific interval assuming their minimum value is zero (which it is), I simply normalize the values (Divide by the maximum value) and multiply it by my new maximum value ($2\pi$ or $\pi$ in this case). In 3D, normalizing the value mean dividing each component by its maximum element wise. So how to I get the maximum value for each component?

We can use the [Get Bounding Box Node](https://animation-nodes-manual.readthedocs.io/en/latest/user_guide/nodes/mesh/get_bounding_box.html#examples-of-usage) to find the maximum value for each of the components, the concept is discussed in details in the documentation, so make sure to read it.

We sample the vertex at index 6 to get the location of the point of intersection of the least upper bound of the mesh in all axis, here is a visualization for that intersection:

![Intersection](/images/the-essence-of-animation-nodes-mesh-editing/map1.png)

After I divide by that location to do the normalization, I multiply by the required maximum value which is $2\pi$ for $\theta$ pr the $x$ and $\pi$ for $\phi$ or the $y$.

Then I apply the equation above to get the x,y,z location of the point:

![Nodes](/images/the-essence-of-animation-nodes-mesh-editing/map2.png)

{% include note.html content="Notice how I I changed the type of the Mesh Object Output Node to Vertices, this option is much faster assuming all you want is to edit the vertices locations. See the documentation for more details."  %}

By adding some thickness to the mesh using the **Solidify Modifier** in blender, we get the earth we wanted:

![Nodes](/images/the-essence-of-animation-nodes-mesh-editing/map3.gif)

The last example was very straightforward, you find a suitable transformation to apply to your vertices and you output them, we were just editing vertices locations. Let us now look at a more interesting example where we add geometry over our original geometry.

# Poke A Mesh

If you are an artists, then you probably know what poke tool does to a polygon. If you don't, look at the following illustration:

![Poke](/images/the-essence-of-animation-nodes-mesh-editing/poke.svg)

Poking happen per polygon and it is an independent process, which means it doesn't depend on anything but the polygon itself. When I poke a polygon, a point is created at its center and the polygon is replaced by multiple triangles connecting each edge to the center vertex. We are aiming to make a tool that does exactly that.

## Algorithm

Since poking is an independent polygon operation, we can loop over every polygon in the mesh and do what we want to do.

Computing the location of the center vertex is fairly simple, I just average the locations of the vertices of the polygon. After I get all the centers of all polygons, I combine the resulted vector list with the original vector list of the vertices. By doing this, my vertices are exactly where they need to be and i won't have to worry about them anymore.

Next step is to compute the new polygon indices that connects every edge with the center vertex forming a triangle. Lets look at one such polygon:

![Poke](/images/the-essence-of-animation-nodes-mesh-editing/poke2.svg)

In the center, I have the center vertex which I computed before, it has an index of $n+i$ where $n$ is the number of vertices of the mesh and $i$ is the index of the polygon that it represent. I got this formula by analysing the vector list we computed before. For instance, the first polygon has an index $i$ equal to zero, if the number of vertices of my mesh is $n$ then the above formula predict the existence of the vector at index $n+i=n+0=n$ and thats is right, if you think about it, the vertices indices ranges between zero and $n-1$, then when I add another vertex (Which is the center of the first polygon), its index will the last index $n-1$ plus one, $n-1+1=n$, the next polygon's center will be at $n+1$ and so on.

Notice that in the above illustration, the indices I gave the vertices are not the actual indices of the vertices, rather they are the indices of their polygon indices when I loop over them. In other words, the indices of my polygon could be any integer, but when I loop over them, each of them takes an indices that ranges between zero and $n-1$ where $n$ is the number of vertices in that polygon.

Ok, how do we compute the new polygon indices, if you read my second [tutorial](/animation-nodes/the-essence-of-animation-nodes-procedural-modeling-2.html) on procedural modeling, you will find that the equations are almost exactly the same for trivial reasons, an so my equations becomes:

$$
\text{index} = (i,i+1\bmod m, i+n)
$$

Where $i$ is the index of the vertex and $m$ is the number of vertices of the polygon and $n$ is the number of vertices of the whole mesh. Go ahead and try this equation in the above example see if it works.

{% include note.html content="It should be noted that the first indices are not the actual indices that should be used as I stated before, they should be used to find the right index of the vertex as you will see in the implementation soon. The third index is in fact the right index and can be used directly." %}

And thats it, we are ready to implement this, so lets do it.

## Implementation

The implementation is a bit twisty, but we are just doing what we describe in the algorithms.

![Implementation](/images/the-essence-of-animation-nodes-mesh-editing/poke3.png)

### Polygon Loop

This loop run $n$ number of times where $n$ is the number of vertices in the polygon. The loop is responsible for retuning the vertices locations of of every vertex in the polygon so that we can use them to compute the center vertex. It is also responsible for generating the new polygon indices.

We have the actual indices of the polygon as an input, we also have the vertices locations as an input. For every loop index, we get the actual index of the vertex by sampling the Indices list and then use that index we got to get the corresponding vector from the vector list, then we return that vector to form a vector list after the loops finishes.

We then use the indices equation to get the right polygon indices. Again, we don't use the loop index itself directly, rather we use it to sample the right index and then use that index. The third index is computed outside the loop so we don't have to worry about it now.

### Mesh Loop

This loop loops over the polygon indices list of the mesh, for each polygon index, we convert it into an integer list so that we can give it to the *Polygon Loop*. Based on the equation above, the center index is just the number of vertices plus the index of the polygon which is the index of the current loop iteration.

After I plug the values into the *Polygon Loop*, I get the vertices list that represent the locations of the vertices of the polygon and average it to get the location of the center index, I also computed the normal of that polygon and add that normal multiplied by a factor to act as an offset for the center vertex along its normal, I then output that vector to form a vector list.

For every polygon, I get multiple new polygons and so the *Polygon Loop* returns me a list of polygon indices list, if I output that directly, I will get a list of lists of polygon indices, blender and AN doesn't like nested lists like that; so to avoid this, I add an empty parameter and reassigned it to be itself combined with the edge indices list of the current iteration, that way I get a nice flat list.

### Result

![result](/images/the-essence-of-animation-nodes-mesh-editing/poke4.gif)

We could in fact, put that setup inside another loop to perform the poking multiple times:

![result](/images/the-essence-of-animation-nodes-mesh-editing/poke5.gif)

{% include challenge.html content="Can you make a Koch Snowflake Fractal the same way we did the poking tool, all you have to do is to apply the method on edges and not polygons." %}

***
***