---
title: 'The Essence Of Animation Nodes: Procedural Modeling'
layout: post
category: Animation-Nodes
image: "/images/the-essence-of-animation-nodes.png"
description: In this tutorial, I am going to teach you the basics of low level procedural
  modeling and we are going to apply using Animation Nodes.
prerequisites:
- text: Good knowledge of Loops in Animation Nodes.
  url: https://squircleart.github.io/animation-nodes/the-essence-of-animation-nodes-notes-on-loops.html
- text: Basic knowledge of arithmetics and vectors.
---

We can divide procedural modeling into two categories:

1. **Low Level**: We create objects from scratch by generating vertices locations and the connections between them, this process require some creativity,  fun and is the one we will be looking at in this tutorial.
2. **High Level**: We start by simple objects like geometrical primitives and arrange them in such a way to create more advanced and complicated shapes, this process is fairly simple and usually used when it come to procedural modeling.

Of course there is modeling using math either by defined parametric equations or through implicitly defined equations. But we won't look at any of them now, however I may explain some of the concepts in a later tutorial.

This topic is hard to explain because it need a good mathematical imagination which most people don't have, so please excuse me if I haven't explained it clear enough. I really encourage you to debug every node and every step to better understand it.

# First Polygon
You probably know that any object is composed multiple elements including:

- **Vertices**: They are represented by 3D vectors that define their location.
- **Edges** : They  are represented by a list of 2 integers where the first integer is the index of the first vertex and the second is the index of the second vertex.
- **Polygons**: They are represented by a list of integers where each integer define the index of one of the vertices that compose the polygon.

Animation Nodes gives us couple of nodes which we can use to create an object:

![AN Nodes](\images\the-essence-of-animation-nodes-procedural-modeling\an_nodes.png)

You can check the documentation for each of them if you don't know what they do , but they are pretty much self explanatory.

### Vertices

![2 Vertices](\images\the-essence-of-animation-nodes-procedural-modeling\vertices.png)

Here I create 2 vectors which are $0.2$ units apart, then I use them to create an object. In that case, they represent 2 vertices that are $0.2$ units apart.

### An Edge
![Edge](\images\the-essence-of-animation-nodes-procedural-modeling\edge.png)

Here I add edges information and connect the 2 vertices. There is a single edge index that contain $(0,1)$ which are the indices of the only available vertices.

### A Polygon

![Polygon](\images\the-essence-of-animation-nodes-procedural-modeling\polygon.png)

Here I removed the edge and added a polygon info. I basically told it to connect the vertices with indices $(0,1,2)$ which are the indices of the only available vertices. Minimum number of vertices to create a polygon is 3 (A triangle) but there really isn't a maximum amount.

Order of indices matters of course, even if it was just a triangle.

![Order Matters](\images\the-essence-of-animation-nodes-procedural-modeling\order_matters.png)

Here I revered the list resulting in inverting the normal (Because cross product it used to compute normals).

# Generate A Line
Lets suppose that we have 2 points and we want to generate a line with a specific number of vertices between them, should I add every point manually? No ! We use a loop.

## Algorithm
The algorithm is pretty simple, Having the two input points $A$ and $B$, I can compute a vector $\vec{AB}$ by subtracting $B$ from $A$, lets call it $\vec{D}$, we like to compute vectors instead of using discrete points because they are easier to deal with. See first and second figures:

![Line Algorithm](\images\the-essence-of-animation-nodes-procedural-modeling\line.svg)

Then I am going to multiply that vector by some scalar so that its tip is at the second vertex in the line, such scalar is basically the reciprocal of the number of points between the 2 points plus one, so we multiple $\vec{D}$ by $\frac{1}{n+1}$ where $n$ is the number of points between the starting and ending point, lets call it $\vec{D_n}$,  we shall see why I did that in a moment. See orange vector in the third figure.

Ok, so how do I compute the points locations using what we just computed? Well, it is very simple, we are going to use such an equation:

$$
\vec{P} = \vec{A} + \vec{D_n}\cdot t
$$

Where $t$ is an integer that runs between 0 and $n+1$ where $n$ is the number of points between the starting point and ending point. Lets try this equation.

At $t=0$ we get:

$$
\vec{P} = \vec{A} + \vec{D_n}\cdot 0 = \vec{A}
$$

Which is our starting point, At $t=1$ we get:

$$
\vec{P} = \vec{A} + \vec{D_n}\cdot 1 = \vec{A} + \vec{D_n}
$$

Which is the second point as we saw before, At $t=2$ we get:

$$
\vec{P} = \vec{A} + \vec{D_n}\cdot 2
$$

Which is the third point, and so on till $t=n+1$ which is the point $B$:

![Line Algorithm](\images\the-essence-of-animation-nodes-procedural-modeling\line2.svg)

Ok, now we have our vertices locations, we should now connect them using edge indices, which is pretty easy to do.

If $n$ is equal to four, means we have 4 vertices between the starting and ending point, then their indices exist in $[0,n+1]$ because we are counting both the starting and ending point:

![Line Algorithm](\images\the-essence-of-animation-nodes-procedural-modeling\line3.svg)

So how do we get edge indices, we can use this simple equation:

$$
\text{index} = (i,i+1)
$$

where $i$ ranges between $0$ and $n$. Using the above equation we get:

$$
[(0,1),(1,2),(2,3),(3,4),(4,5)]
$$

Which if we compared to the image above, it is exactly what we want.

## Implementation

![Line Implementation](\images\the-essence-of-animation-nodes-procedural-modeling\line4.png)

I added 2 empties and got their location to use as my starting and ending point then I input them to a group that does some stuff and return me the vector list and edge indices, then it combine those data into a mesh data block then it output it to an object. Lets look at the gears behind this group.

![Line Implementation](\images\the-essence-of-animation-nodes-procedural-modeling\line5.png)

In this group, I compute $\vec{D}$ and $\vec{D_n}$ using the equations we define above, I then input them to a magical loop that return me the vertices locations and edge indices. Notice that the number of iterations is $n+2$ because I am including the starting and ending point. Now lets look at the magical loop.

![Line Implementation](\images\the-essence-of-animation-nodes-procedural-modeling\line6.png)

This is the loop that compute the vertices location and the edges incides. It basically applied the equation we saw before:

$$
\vec{P} = \vec{A} + \vec{D_n}\cdot t
$$

Where $t$ is the index in this case. It also used the equation of the edge indices:

$$
\text{index} = (i,i+1)
$$

Where $i$ is the index, but we encounter a problem here, $i$ is suppose to range between $0$ and $n$ while our index range between $0$ and $n+1$ and we can't really change that domain. So what I did was add a condition for the Edge Indices output, I told it to return the output if and only if $i+1$ isn't equal to the number of iterations which is equal to $n$, so I am basically telling it not to include the last indices which it was suppose to compute. If you can't understand how loops work, go back to my tutorial on loops.

And here is the outcome of our work:

![Line Final](\images\the-essence-of-animation-nodes-procedural-modeling\line7.gif)

# Generate A Grid
I basically want to generate a grid if I know its width and its height, by width and height I just mean the number of vertices in both x and y direction.

## Algorithm

First, I want to compute the location of the vertices, putting in mind that we want a function that takes an integer (Index of the vertex) and return a vector (Its location). There is a very simple way to do this, lets look at this equation:

$$
\vec{v} = \begin{bmatrix} i \mod w \\ \lfloor {i/w} \rfloor \\ 0 \end{bmatrix}
$$

Where $i$ is the index of the vertex which ranges between $0$ and $(W \cdot H)-1$ where $W$ and $H$ are the width and height of the grid.

To make a grid that is $W \times H$ , the number of points we will need is ... $W \cdot H$ so this is our number of iterations, but indices starts from zero so thats why $i$ ranges between zero and  $(W \cdot H)-1$. Lets try some values of $i$ assuming that the width is $5$.

At $i = 0$, we get:

$$
\vec{v} = \begin{bmatrix} 0 \mod 5 \\ \lfloor {0/5} \rfloor \\ 0 \end{bmatrix} = \begin{bmatrix} 0 \\ 0 \\ 0 \end{bmatrix}
$$

At $i = 1$, we get:

$$
\vec{v} = \begin{bmatrix} 1 \mod 5 \\ \lfloor {1/5} \rfloor \\ 0 \end{bmatrix} = \begin{bmatrix} 1 \\ 0 \\ 0 \end{bmatrix}
$$

At $i = 2$, we get:

$$
\vec{v} = \begin{bmatrix} 2 \mod 5 \\ \lfloor {2/5} \rfloor \\ 0 \end{bmatrix} = \begin{bmatrix} 2 \\ 0 \\ 0 \end{bmatrix}
$$

If we keep inputing values that is between $0$ and $4$ we just get $x=i$ and $y=0$ because if you think about it, the remainder of $i/5$ is just the pattern $[0,1,2,3,4,01,2,3,4,0,1,2,3,4, ... ]$ while the floor division is the integer without its fraction, but since we divided $i$ by $5$ then all the values between $0$ and $4$ will just be zero and the floor division produce the pattern $[0,0,0,0,0,1,1,1,1,1,2,2,2,2,2, ... ]$. Look at this illustration to understand it better:

![Grid Algorithm](\images\the-essence-of-animation-nodes-procedural-modeling\grid.gif)

You may have noticed by now that the height does not contribute to this equation, well, no, the height contributed very early when we used it to compute the number of points, If you think about it, the above gif could have continues increasing the height of the grid forever, but I limited it to a specific number of vertices and thats what height do, except it will continue the row it started since it is an integer.

Ok we computed the vertices locations, How do we compute their polygon indices? lets look at their indices first:

![Grid Algorithm](\images\the-essence-of-animation-nodes-procedural-modeling\grid2.png)

We want the polygons to be clean quads so we have to sample 4 points for each polygon. An example would be the indices $(0,1,6,5)$ or $(1,2,7,6)$, you probably know the pattern by now, we can describe it as follow:

$$
\text{index} = (i,i+1,i+w+1,i+w)
$$

Where $i$ is the index of the vertex and $w$ is the width. Go ahead and try this equation, compare it with the results we got above and with the drawing above.

If you did try it, you would have noticed that some points just fail when we try to compute their indices, and you probably noticed that those points are at the right edge like $(4,9,14,19,24)$ or at the top edge like $(20,21,22,23,24)$ So we just have to make sure not to include those points in our indices output.

We computed both the the locations and indices, lets move to implementation.

## Implementation

![Grid Implementation](\images\the-essence-of-animation-nodes-procedural-modeling\grid3.png)

Added a group with width and height, inside the group I subtracted 1 from both and handed them to a magical loop then multiplied them and used it as the magical loop iterations. You will see why I needed this subtraction now. Lets look at the loop:

![Grid Implementation](\images\the-essence-of-animation-nodes-procedural-modeling\grid4.png)

It just apply the equations we described above, the modulo and floor division to get the location and the edge indices by basic arithmetics. The only extra thing here is the condition, I basically told the loop not to output the indices if and only if the x location was not equal to the width minus 1 AND the y location was not equal to the height minus 1. And that is it, we have our grid!

Lets look at the results:

![Grid Final](\images\the-essence-of-animation-nodes-procedural-modeling\grid5.gif)

So far we have been setting the z location to zero, but we can just put any value we want. I can for instance control it by a 2D distance function:

![Grid Final](\images\the-essence-of-animation-nodes-procedural-modeling\grid6.gif)

{% include challenge.html content="Can you create the above example using what we learned so far?" %}

Or I could use a F2-F1 Voronoi diagram to compute the z location:

![Grid Final](\images\the-essence-of-animation-nodes-procedural-modeling\grid7.png)

I will make a full tutorial about voronoi diagrams in the future and I will teach you how to make custom 2D,3D and 4D diagrams from scratch. But for now, you can just use blender's limited mathutils noise function:

```python

import mathutils
mathutils.noise.noise(Vector,Index)
# Where Vector is your vector and Index is just an integer
# that ranges between 0 and 8 which define the noise type.

```

I was planning to give you tens of examples but the post became too full just after 2 examples, So I will have to split this tutorial into multiple parts, So stay tuned for the next part !