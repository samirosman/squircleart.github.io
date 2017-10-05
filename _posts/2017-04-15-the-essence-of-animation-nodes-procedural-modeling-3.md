---
title: 'The Essence Of Animation Nodes: Procedural Modeling 3'
layout: post
category: Animation-Nodes
image: "/images/the-essence-of-animation-nodes-preface/the-essence-of-animation-nodes.png"
description: 'Welcome to this third part of the procedural modeling tutorial in Animation
  Nodes. I am going to give you couple of more examples on low level procedural modeling,
  and the best part about this tutorial is: We are going to make a cupcake!'
prerequisites:
- text: Part 2 of the tutorial.
  url: /animation-nodes/the-essence-of-animation-nodes-procedural-modeling-2.html
next_part: "/animation-nodes/the-essence-of-animation-nodes-mesh-editing.html"
previous_part: "/animation-nodes/the-essence-of-animation-nodes-procedural-modeling-2.html"
---

We learned before how to generate: lines, grids, regular convex shapes, cones, pyramids and regular non-convex shapes. In the following example, we are going to extend the regular convex and non-convex shapes into 3D, So lets get started!

# Generating A Cylinder
If you think about it, A cylinder is just a couple of circles stacked above each other and connected using polygons, if you remember correctly, a grid was also couple of lines stacked above each others, so to make a cylinder we will use the same techniques we used to make the grid.

## Algorithm

We know from the previous tutorial that the equation for the locations of the points of the circle is:

$$
\vec{P} = \begin{bmatrix} r\sin{(2n\pi/m)} \\ r\cos{(2n\pi/m)} \\ 0 \end{bmatrix}
$$

Where $r$ is the radius, $n$ is the index and $m$ is the number of points. This equation will hold for our cylinder but we will slightly edit it.

If I want to create a cylinder that has 3 loops (3 circles stacked over each others) and with 10 points per loop, then the number of vertices of that cylinder is $10 \times 3 = 30$. The $x$ and $y$ location of the vertices for each loop (circle) won't change, this is because of the nature of the trigonometric functions where $\cos 2\pi + \theta = \cos \theta$ and $\sin 2\pi + \theta = \sin \theta$, however, their $z$ location will change, the vertices of the first loop will have a $z$ location of $0$ while the second will have a location slightly higher lets say $1$ and the third will be even higher say $2$.

So we can edit the equation above to implement those changes as follow:

$$
\vec{P} = \begin{bmatrix} r\sin{(2n\pi/m)} \\ r\cos{(2n\pi/m)} \\ \lfloor \frac{n}{m} \rfloor  \end{bmatrix}
$$

The only thing I changed is the $z$ location, instead of being a constant, it will be equal to the floor division of the index $n$ divided by the number of vertices per loop $m$.

Assuming that $m$ = 10, the floor division will be zero for the first ten vertices because $n$ will range between 0 and 9 and since $m=10$ then $n/10$ in that range will result in values that are less than 1 and their floor will be zero. The vertices of the second and third loops will have z locations of 1 and 2 respectively,  the why is similar to the first loop.

If I want the cylinder to have a specific height, then all I have to do is to divide the $z$ location by the number of loops minus one and then multiple it by your height, the why is trivial.

We now have the locations of the circles, so lets investigate their indices and find a suitable equation for the polygon indices.

![Cylinder Algorithm](/images/the-essence-of-animation-nodes-procedural-modeling-3/cylinder.png)

The image above shows a portion of a cylinder, each loop in the circle is composed of 10 points and there is 3 loops. As you may see, the indices of the first circle starts from zero and ends with 9, the second loop starts from 10 and ends with 19, the third starts from 20 and ends with 29.

Think with me, how can we form the polygon indices of this one? Well, as we said, it is similar to the grid we created before, the equation of the indices of the grid was:

$$
\text{index} = (i,i+1,i+m+1,i+m)
$$

Where $m$ is the number of vertices per loop. Try the above equation and you will see that it holds except on the edges. In the grid, we rejected vertices on the edges because they weren't connected to anything, but in the cylinder the vertex at index 9 should be connected to 0,10 and 19 and the vertex at index 19 should be connected to index 10,20 and 29. Go back to indices map if you don't get it.

In the circle, we overcome this edge problem by introducing the modulo operation, Will it work in this case too?

Well, partially, the problem is, $i \bmod m$ will yield 0 for any $x=mn$ where $n= 0,1,2,3, ...$ so if the index was 0,m,2m, ... it will return zero in all of the cases. We generally notice that all the vertices that are above each other (Have same $x,y$ location) yield the same index. So we can't really use it, at least not directly.

What we need is a factor that differentiate between different loops, and we already have it, the $z$ location of the vertex or the floor division which happened to be an integer.

I will turn my equation into:

$$
\text{index} = (i,((i+1) \bmod m)+zm,(((i+1) \bmod m)+(z+1)m),i+m)
$$

Where $i$ is the index, $m$ is the number of vertices per loop and $z$ is the floor division in the location formula. Sorry it got a bit complicated here, but is is easier to break it into two parts. The mod part $(i+1)\bmod m$ which you already know from the circle equation, this is subjected to the problem I describe a moment ago because of the nature of modulo operation. The second part $zm$ is very easy to understand, we just add the height (which is an integer) multiplied by the number of vertices per loop $m$.

For instance, using the old equation and assuming that $m$ is 10, at index 9, $(i+1)\bmod m= (9+1)\bmod 10 = 0$, at index 19, $(i+1)\bmod m= (19+1)\bmod 10 = 0$, So how do we differentiate between both of them, the floor division of 9 is 0, while the floor division of 19 is 1, then if I added the multiple of $m$ and $z$ to the zero we got before, we get the right indices. And the full equation for the second index evaluated at 9 is  $((9+1) \bmod 10)+0 \cdot 10 =0 $ while it is $((19+1) \bmod 10)+1 \cdot 10 =10 $ when evaluated at 19. I hope you got it by now. But if you didn't, wait till we do the implementation to study it further on your own.

Of course we will still reject some points which are the points at the last loop, because they are not connected to anything.

## Implementation

![Cylinder Implementation](/images/the-essence-of-animation-nodes-procedural-modeling-3/cylinder2.png)

![Cylinder Implementation](/images/the-essence-of-animation-nodes-procedural-modeling-3/cylinder3.png)

![Cylinder Implementation](/images/the-essence-of-animation-nodes-procedural-modeling-3/cylinder4.gif)

Nothing new here, just applying the equations above. Our loops just get bigger and bigger every day, right?

## More Features

I could go ahead and add some more features, like controlling the radius as a function of height. You probably know how to do that by now if you have been following my tutorials.

![Cylinder More Features](/images/the-essence-of-animation-nodes-procedural-modeling-3/cylinder5.png)

Which enables me to do this:

![Cylinder More Features](/images/the-essence-of-animation-nodes-procedural-modeling-3/cylinder6.gif)

I could also use the technique we used in the circle to make a regular non convex shape:

![Cylinder More Features](/images/the-essence-of-animation-nodes-procedural-modeling-3/cylinder7.gif)

As we said, trigonometric functions are cyclic and the following equation holds:

$$
\cos{2\pi+\theta} = \cos{\theta}\\
\sin{2\pi+\theta} = \sin{\theta}
$$

So adding a value to $\theta$ will not break the seamlessity of the circles, rather it will offset them radially.

So what I did was add the $z$ location to the angle after multiplying it by a factor, this will offset circles gradually as we go up:

![Cylinder More Features](/images/the-essence-of-animation-nodes-procedural-modeling-3/cylinder8.gif)

Modeling using nodes is fun, isn't it?

Ok, what about the cupcake I told you about? follow me.

![Cupcake](/images/the-essence-of-animation-nodes-procedural-modeling-3/cylinder9.png)

This will be the container of the cupcake. I closed it from below using the setup above, which you already know from the last tutorial. I added some blender modifiers, like solidify, bevel and catmull clark subdivision.

![Cupcake](/images/the-essence-of-animation-nodes-procedural-modeling-3/cylinder10.png)

Then I created the cake itself and closed its top. Catmull clark subdivision as always.

![Cupcake](/images/the-essence-of-animation-nodes-procedural-modeling-3/cylinder11.png)

Then I added the thing you see here, it is the white thing that tastes bad. In this object, I used all the features we implemented above.

![Cupcake](/images/the-essence-of-animation-nodes-procedural-modeling-3/cylinder12.png)

And last but not least, a chocolate stick because we all love chocolate.

# Generating A Pip

Now, I want to use the above implementation to make a pip, that is, a curve will be given which can be procedurally generated or just normally created, then we will give that curve a thickness, much like blender's curve objects, but curves in blender are limited as they can't be used as a boolean object for instance, plus where would be the fun if we just played with some parameters.

First, make sure you fully understand the [Get Spline Samples Node](https://animation-nodes-manual.readthedocs.io/en/latest/user_guide/nodes/spline/get_spline_samples.html) and the [Direction To Rotation Node](https://animation-nodes-manual.readthedocs.io/en/latest/user_guide/nodes/rotation/direction_to_rotation.html) because we will be using them, there are some good examples in the documentation, the guys who wrote it made sure of that.

The algorithm is simple, I will create all the circles in unity position, that is, their z location is zero. Then I am going to transform each of the circles using a transformation matrix which we will generate based on the information given by the *Get Spline Samples Node*. So how do I know which sample info to use for each vertex, we have a factor of loops remember, the floor division tells us which vertex belong to which circle. So to choose the right sample, I will just use the floor division as the index for the *Get Element Node*.


![Pip](/images/the-essence-of-animation-nodes-procedural-modeling-3/pip.png)

The implementation is simple, I sample the right point from the samples list the *Get Spline Samples Node* gave me then I compose a transformation matrix out of the info it gave me and then I transform the vertex based on this transformation matrix.

What will this give us? I am glad you asked:

![Pip](/images/the-essence-of-animation-nodes-procedural-modeling-3/pip2.gif)

We are awesome, aren't we? You can go ahead implement this yourself and try to add more features like using another spline as a taper for the curve.

I think that you got the hang of procedural modeling by now, but there is still a lot of techniques and examples I haven't told you about. So let me know whether you want to move on to another subject or do you want another part of this tutorial series.
