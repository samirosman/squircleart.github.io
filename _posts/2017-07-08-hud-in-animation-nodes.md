---
title: HUD In Animation Nodes
layout: post
category: Animation-Nodes
image: "/images/hud-in-animation-nodes/wall.png"
description: In this tutorial, we will be creating some HUD elements procedurally
  in Animation Nodes. This procedural non-destructive approach allows the creation
  of highly customizable elements.
---

In this tutorial, we will be creating some HUD elements procedurally in Animation Nodes. This procedural non-destructive approach allows the creation of highly customizable elements.

I won't explain anything in details, so experience with AN is required.

## Example 1

For starter, lets create some nice background for our elements.

I add a circle and replicate it along the vertices of a grid, see [Replicate Mesh Data](http://animation-nodes-manual.readthedocs.io/en/an2/user_guide/nodes/mesh/replicate_mesh_data.html) node.

![Example 1 a](/images/hud-in-animation-nodes/example1a.png)

Then I replicate a thin rectangle along the centers of the edges of the same grid. I also make sure it is pointing in the direction of the edges of the grid, see [Direction To Rotation](http://animation-nodes-manual.readthedocs.io/en/an2/user_guide/nodes/rotation/direction_to_rotation.html) node.

![Example 1 b](/images/hud-in-animation-nodes/example1b.png)

The length and width of the lines can be controlled using the X and Y distances of the grid used as a source of replication.

## Example 2

Having created a nice background, lets make our first element. HUD usually include radially distributed objects. Using the same replication technique, we can replicate meshes around a circle. The matrices for the circle can be generated using the [Distribute Matrix](http://animation-nodes-manual.readthedocs.io/en/an2/user_guide/nodes/matrix/distribute_matrices.html) node.

![Example 2 a](/images/hud-in-animation-nodes/example2a.gif)

Matter of fact, the distribute matrix node lets us define a segment of a circle only, if animated, we can get some nice HUD style animation.

![Example 2 b](/images/hud-in-animation-nodes/example2b.gif)

Moreover, I can replicate the output mesh again around a circle resulting:

![Example 2 c](/images/hud-in-animation-nodes/example2c.gif)

Alternatively, we can animate and slice the list of matrices used in replication to get a nice placement animation effect.

![Example 2 d](/images/hud-in-animation-nodes/example2d.gif)

## Example 3

I already showed you how we can create a [circle](https://squircleart.github.io/animation-nodes/the-essence-of-animation-nodes-procedural-modeling-2.html) and a [cylinder](https://squircleart.github.io/animation-nodes/the-essence-of-animation-nodes-procedural-modeling-3.html) (Read them first as the following example dependent on them), what we are going to create here is a circle with a hole, it can be created using two loops vertices connected to each other, but a cylinder is in fact two loops of vertices connected together except the loops are stacked above each other in the cylinder while they are not stacked but rather of different radius in the circle. Applying the equations for the [cylinder](https://squircleart.github.io/animation-nodes/the-essence-of-animation-nodes-procedural-modeling-3.html) we can create:

![Example 3 a](/images/hud-in-animation-nodes/example3a.png)

The only difference between it and the cylinder is that the loops are only different in radius while the z location is exactly the same.

Couple of things to put in mind:

1. We won't connect the last edge to the first edge, that's why we subtracted 1 from the number of vertices, so that the last and first edges are on the same location. We aren't connecting the last and first edges because we will be animating the circles so we can't have them joined.
2. We had to introduce a modulo operator (In the cylinder we didn't), in essence, if the angle range is $2\pi$ (It forms a whole circle), a modulo won't make any difference because sine and cosine are periodic functions and thus $\cos{( 2\pi n \theta )}=\cos{(\theta)} \  \forall \  n \in \mathbb{Z}$ and the same apply for sine function. This is not the case in our example because it won't always be a full circle and the above equation won't hold.

Subsequently (to the first point), the polygon indices equation simplifies to:

$$
\text{index} = (i,i+1,i+m+1,i+m)
$$

Where $i$ is the index and $m$ is the number of vertices.

![Example 3 b](/images/hud-in-animation-nodes/example3b.png)

The segment input can be similarly animated resulting:

![Example 3 c](/images/hud-in-animation-nodes/example3c.gif)

Now, by instancing it and randomizing its inputs and wiggling its rotation, we get:

![Example 3 d](/images/hud-in-animation-nodes/example3d.gif)

## Example 4

HUD includes lots of waveforms, those waveforms are sometimes associated with sounds, so lets create something in that sense.

We will create a circle as we learned in the [circle](https://squircleart.github.io/animation-nodes/the-essence-of-animation-nodes-procedural-modeling-2.html) article, and we will set the radius to a wiggle float which when animated produces:

![Example 4 a](/images/hud-in-animation-nodes/example4a.gif)

To make this more interesting, I will create multiple spline with varying radius and with some small offset. To offset vertices, I generate a list of random elements, those elements are either $-x$ or $x$ where $x$ is an arbitrary constant. I then simply add those values multiplies by the index of the current iteration resulting in larger offset as the index increases. As for the radius of the splines, I simply set it to the index non unformly remapped to the some arbitrary interval based on what the user think looks the best.

![Example 4 b](/images/hud-in-animation-nodes/example4b.gif)

## Example 5

Now lets do something that is related to music. Similar to the previous examples, I will replicate a thin rectangle around a circle, but I will scale the matrices based on the intensities of the frequencies of the input sound.

![Example 5 a](/images/hud-in-animation-nodes/example5a.gif)

## Example 6

Coming back to the circle example, we want to uniformly distribute circle segments around a circle, how can we do this? Well, lets look at this illustration:

![Illustration](/images/hud-in-animation-nodes/illustration.svg)

The user should define a number of segments $n$ and a gap angle $x$. We can compute the angle $y$ based on the equation:

$$y = \frac{2\pi -nx}{n}$$

Because there is $n$ number of gaps and $n$ number of segments. Then the segment input is $\frac{y}{2\pi}$ because our segment input is defined in a normalized interval. Ok, after we defined their length, we should rotate each of them with some angle equal to $y+x$ than the previous one, and our node tree becomes:

![Example 6 a](/images/hud-in-animation-nodes/example6a.gif)

And of course it can be animated as before.

## Example 7

Another common element is the closest points connections, that's is, drawing connections between close points. To make it more interesting, I will do two things:

1. Wiggle points' locations so that we get nice animation.
2. Make sure no points exist in the center making a circular hollow shape of connections as you may see below.

To make sure no points exist in the center, I am going to use a simple trick, we normalize the location vector of the points resulting in a unit vector pointing to the point from the center, let that vector be $\vec{V}$, if we added $\alpha \vec{V}$ to the original location vector where $\alpha$ is some arbitrary scalar, it will move it away from the center guaranteeing that the point location is at least $\alpha$ unit away from the center and thus creating a hole. The only exception to this rule is if the point is at $(0,0,0)$ because then the normalized vector will be also  $(0,0,0)$ for all $\alpha$, This can be fixed using some simple if statement, however we won't use it because the probability that the vector is a zero vector is infinitesimal. Moreover, the amplitude of the random generator has to be less in z axis than in x and y because if they were the same, we will get a hollow sphere and not a hollow circle.

Applying the rules above:

![Example 7 a](/images/hud-in-animation-nodes/example7a.gif)

And of course we can put some spheres in place of points:

![Example 7 b](/images/hud-in-animation-nodes/example7b.png)

## Final Example

Our final example will be about combining all we did so far in a short animation. I invite you to make your own short animation and share it with me, I only made a still image because rendering a whole animation is very expensive for my computer, let me know if you want the node tree to render an animation out of it.

Here is my example:

![Final Example](/images/hud-in-animation-nodes/wall.png)
