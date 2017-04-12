---
title: 'The Essence Of Animation Nodes: Procedural Modeling 2'
layout: post
category: Animation-Nodes
image_path: "/images/the-essence-of-animation-nodes.png"
description: In this second part of the procedural modeling in Animation Node tutorial
  series, I am going to give you couple of more examples on low level procedural modeling.
---

In this second part of the procedural modeling in Animation Node tutorial series, I am going to give you couple of more examples on low level procedural modeling. If you haven't read the first tutorial, I recommend you read it first [Here](https://squircleart.github.io/animation-nodes/the-essence-of-animation-nodes-procedural-modeling.html).

We learned before how we can make a line and a grid which are really the simplest objects you can create, we are now going to level up and create more complicated objects.

# Generate A Circle

Circles are also one of the easiest objects we can create due to its mathematical nature. So lets create a circle.

## Algorithm

We will first compute the vertices locations, and this can be done easily if you know your math, but in case you don't, here is a small illustration.

Let the circle be of radius $r$ and number of vertices $m$, those vertices are evenly distributed over the circle and so we see that the locations we want to compute are the intersection of those blue lines with the circle of radius $r$ :

![Circle Algorithm](/images/the-essence-of-animation-nodes-procedural-modeling-2/circle.svg)

The zero line makes an angle zero with the $x$ axis, the first line makes an angle $ \theta = 2\pi/m$ with the $x$ axis, the second line makes an angle $2(2\pi/m)$ with the $x$ axis, third makes an angle $3(2\pi/m)$ with the $x$ axis. All of this lines have the same length which is $r$, so it is intuitive to describe every line with just the angle it makes with the $x$ axis.

Then the location of the point on the circle for every line is $\alpha \vec{i}+\delta \vec{j}$ where $\vec{i}$ and $\vec{j}$ are the fundamental vectors of the space and $\alpha$ and $\delta$ are the distances along the $x$ and $y$ axis which you can see as the red and green lines respectively above.

Trigonometry tells us that:

$$
\sin{\theta} = \frac{\alpha}{r} \\
\cos{\theta} = \frac{\delta}{r}
$$

But we have $r$ and $\theta$, then:

$$
\alpha = r\sin{\theta} \\
\delta = r\cos{\theta}
$$

And so the location of the nth point is equal to:

$$
\vec{P} = \begin{bmatrix} r\sin{(2n\pi/m)} \\ r\cos{(2n\pi/m)} \\ 0 \end{bmatrix}
$$

Where $r$ is the radius of the circle, $m$ is the number of vertices of the circle and $n$ is the index of the vertex which ranges between $0$ and $m-1$.

Ok, we now have our vertices locations, we should now compute their edge indices. Looking at the vertices indices, we notice that they are almost exactly as the indices of the line:

![Circle Algorithm](/images/the-essence-of-animation-nodes-procedural-modeling-2/circle2.svg)

So the equations of the line holds:

$$
\text{index} = (i,i+1)
$$

However, in the line example, we rejected the last index because the last point in the line wasn't connected to any point. But in the circle, we want the last vertex to be connected to the first vertex, $(9,0)$ in the image above. We can solve this problem by introducing this new equation:

$$
\text{index} = (i,i+1\pmod m)
$$

Where $m$ is the number of vertices, to see how this work, let us assume that $m$ is equal to 10, then $i$ ranges between $0$ and $9$, the indices will be exactly as the old equation except for the last one. It will be $(9,9+1 \pmod 10) = (9,10 \pmod 10) = (9,0)$ and this is exactly what we want, the last vertex to be connected to the first vertex.

## Implementation

The implementation is as easy as using the equations above:

![Circle Implementation](/images/the-essence-of-animation-nodes-procedural-modeling-2/circle3.png)

Producing .... a circle:

![Circle Implementation](/images/the-essence-of-animation-nodes-procedural-modeling-2/circle4.gif)

We can go a little bit further and do something like this:

![Circle Implementation](/images/the-essence-of-animation-nodes-procedural-modeling-2/circle5.png)

I am now switching between 2 radii, the condition for the switching is checking if the index mod 2 is equal to zero, in other words, it return True if the index is even and False otherwise. Can you imagine what this would do?

![Circle Implementation](/images/the-essence-of-animation-nodes-procedural-modeling-2/circle6.gif)

Not sure if a star is standardized in someway, but this setup will give you the ability to make all starts you want.

# Generate Closed Circle

The last example showed the creation of a circle, but it was just couple of edges, we now want to close it and make it somewhat solid.

To do so, we can use multiple methods, but the easiest method is the **Triangle Fan** method, which you are probably familiar with. If you don't know, it is just about connecting every edge to a vertex in the center of the circle forming triangles.

## Algorithm

We already generated the vertices locations, except the center vertex, but we don't have to worry about it because we can append it to our vector list manually, it is just one point.

When it comes to polygon indices, it will be exactly as before, except we will be adding another index to the edge indices forming a polygon indices with our original edge plus the center vertex. If you look at the vertices map for 10 vertices circle:

![Closed Circle Algorithm](/images/the-essence-of-animation-nodes-procedural-modeling-2/closed_circle.svg)

We see that the index of the middle vertex is actually $m$ which is the number of vertices. So all we need to do now is to add this index to every indices we have. For instance, we have the edge indices $(0,1)$ it becomes the polygon indices $(0,1,m)=(0,1,10)$ Simple as that.

## Implementation

Again, all I had to do is to change the edge indices to a polygon indices with the new center vertex index which is the number of iterations ($m$) in this case. Then I appended a new vector to represent my center vertex location.

![Closed Circle Implementation](/images/the-essence-of-animation-nodes-procedural-modeling-2/closed_circle2.png)

Which produces this:

![Closed Circle Implementation](/images/the-essence-of-animation-nodes-procedural-modeling-2/closed_circle3.gif)

We are starting to make some cool stuff, don't you think?

Further more, If I positioned the center somewhere high, I would get a pyramid or a cone, I could also close its base by adding another polygon indices that is $(0,1,2, .... , m-1)$ if you don't know why that works, you should probably double check the indices illustration above.

![Closed Circle Implementation](/images/the-essence-of-animation-nodes-procedural-modeling-2/closed_circle4.png)

Producing:

![Closed Circle Implementation](/images/the-essence-of-animation-nodes-procedural-modeling-2/closed_circle5.gif)

By now you should have a good idea of what should be done in order to do procedural modeling. But till now, we have been playing around, creating some basic and simple shapes. So we are not done at all. We still have a lot to learn, more objects to create and fun time ahead.

I will keep the tutorials short so you don't get board, so stay tuned for the next part of the tutorial!





