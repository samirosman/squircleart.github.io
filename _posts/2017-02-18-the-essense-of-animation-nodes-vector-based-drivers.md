---
title: "The Essence Of Animation Nodes: Vector Based Drivers"
layout: post
image_path: /images/the-essence-of-animation-nodes.png
description:  "We finally start noding and look at vectors that are involved in property drivers"
category: Animation-Nodes
---

We now know the system of AN and we are ready to start make awesome node trees. We said in the preface that AN is used in multiple applications and the first one was drivers, that is, controlling some property by another. And we are going to start by studying that in multiple tutorials to keep them short.

We are going to start by a relatively easy node trees for the ones who haven't used nodes before and step by step go into more advanced node trees. So if you are already familiar with this stuff, don't worry, we will get to more interesting real life applications.

# Vectors

Vectors are one of the most important data types in AN because it is used all over blender to define locations,scales, normals, etc. So we will start by looking at examples where vectors is used.

## Example 1.1a

![Example 1.1a](/images/the-essence-of-animation-nodes-vector-based-drivers/example1.1a.gif  "Example 1.1a")

### Explanation

The simplest example there is, controlling the location of an object by the location of another.

We can call this a linear function, where the domain is the location of the cube and the range is the location of the icosphere.

$$f(x,y,z)=(x,y,z)$$

## Example 1.1b

![Example 1.1b](/images/the-essence-of-animation-nodes-vector-based-drivers/example1.1b.gif  "Example 1.1b")

### Explanation

In this example, we altered the relation so that the location of the icosphere is double the location of the cube, and this is done by using a simple scale vector node.

In this case we changed the rate of change of our function by multiplying the vector by 2.

$$f(x,y,z)=2(x,y,z)$$

{% include note.html content="Notice that the scaling happen away from the origin point of the space, which is the point $(0,0,0)$" %}

## Example 1.1c

![Example 1.1c](/images/the-essence-of-animation-nodes-vector-based-drivers/example1.1c.gif  "Example 1.1c")

### Explanation

In this example we offset the location of the icosphere to be 2 units away in the y direction.

This is done just by adding 2 to the y component:

$$f(x,y,z)= (x,y+2,z)$$

## Example 1.2a

![Example 1.2a](/images/the-essence-of-animation-nodes-vector-based-drivers/example1.2a.gif  "Example 1.2a")

### Explanation

I can control the scale this time instead of the location, but using the location of the cube directly isn't really a good choice because the cube has a location of zero in the other 2 axis and so if we applied that vector to the scale, it will be 1D (zero scale in 2 axis). So I only used the Y location of the object and composed a vector with it in all axis and used it as my scale.

In this case, our function will be like:

$$f(y)=(y,y,y)$$

## Example 1.2b

![Example 1.2b](/images/the-essence-of-animation-nodes-vector-based-drivers/example1.2b.gif  "Example 1.2b")

### Explanation

I didn't really like the previous example because the icosphere scale to zero and if it wasn't symmetrical, it would have been inverted because of the negative values of the y location. So I did some math:

- **Absolute Node:** This will make sure all the values are positive and thus solve the object inverting problem.
- **Add Node:** This will change the range of my function values from $[0, \infty]$ to $[1, \infty]$, remember that there is absolute so negative values are excluded.

## Example 1.3a

![Example 1.3a](/images/the-essence-of-animation-nodes-vector-based-drivers/example1.3a.gif  "Example 1.3a")

### Explanation

We can control the scale based on the distance between the 2 objects and multiply it by 0.3 to decrease the rate.

## Example 1.3b

![Example 1.3b](/images/the-essence-of-animation-nodes-vector-based-drivers/example1.3b.gif  "Example 1.3b")

### Explanation

I wanted to make something more interesting, so I made it alternate in scale every 3 blender units by using the *Modulo Node*. You can think of what modulo do in this example as this: As the value increase Modulo will reset the value to zero every B unit and it start increasing again from zero to the next multiple of B.

{% include note.html content="This is a distance function in 2d space which is not linear, but we will assume its linearity for simplicity." %}

## Example 1.3c

![Example 1.3c](/images/the-essence-of-animation-nodes-vector-based-drivers/example1.3c.gif  "Example 1.3c")

### Explanation

Again, I don't really like the previous example because it goes from the highest point to the lowest (3 to zero) all of a sudden, So I edited it in such a way that it decrease smoothly just as it increased and this is easily done by:

* **Subtracting** half the interval ( $\frac{3}{2}=1.5$ ) from the value. This will offset the function so that half of the values are negative.

* **Absolute** the result to render negative values positive again, but this time, they are inverted in such a way that guaranteed our smooth decreasing.

* **Add** a constant to stop the values from getting near zero.

{% include note.html content="Notice that the maximum value for the scale in example 1.3b is 3 while it is 1.5 in example 1.3c because we divided it by 2, so if you want to restore the original amplitude, just multiply by 2."  %}

Here is a small visualization for what is happening:

$$f(x)=x \bmod 3$$

We see that it jump 3 units at the points 3, 6, 9, ... and that we don't want.

![Figure 1.1](/images/the-essence-of-animation-nodes-vector-based-drivers/figure1.1.svg  "Figure 1.1")

$$f(x)= |x| \bmod 3$$

Notice that I didn't include this step because I didn't have negative values in my domain.

![Figure 1.2](/images/the-essence-of-animation-nodes-vector-based-drivers/figure1.2.svg  "Figure 1.2")

$$f(x)= (|x| \bmod 3)-1.5$$

![Figure 1.3](/images/the-essence-of-animation-nodes-vector-based-drivers/figure1.3.svg  "Figure 1.3")

$$f(x)= |(|x| \bmod 3)-1.5|$$

![Figure 1.4](/images/the-essence-of-animation-nodes-vector-based-drivers/figure1.4.svg  "Figure 1.4")

$$f(x)= |(|x| \bmod 3)-1.5|+0.5$$

This will make sure our object won't go all the way to zero.

![Figure 1.5](/images/the-essence-of-animation-nodes-vector-based-drivers/figure1.5.svg  "Figure 1.5")

One could just use a trigonometric functions to make a completely smooth alternating pattern instead of the linear one we just created.

{% include challenge.html content="Can you use trigonometric functions to make the previous example, it is required that the maxima and minima of your function to match the maxima and minima of the previous example (Make the function alternate at the same frequency of the previouse example.)" %}

# Conclusion:

We didn't do much in this tutorial, but we got a sense of what it is like to do noding and we learned the effects of some math operations on relations:

- Multiplication increase the rate of the relation.
- Addition offset the relation.
- Modulo repeat the relation.
