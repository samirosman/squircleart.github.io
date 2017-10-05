---
title: 'The Essence Of Animation Nodes: Transformation Matrix'
layout: post
image: "/images/the-essence-of-animation-nodes-preface/the-essence-of-animation-nodes.png"
description: Matrices are one of the data types that you will be using a lot in Animation
  Nodes, So in this tutorial, I will teach you how we can use transfromation matrices.
category: Animation-Nodes
prerequisites:
- text: Good knowledge of the system of Animation Nodes
  url: /animation-nodes/the-essense-of-animation-nodes-the-system.html
next_part: "/animation-nodes/the-essence-of-animation-nodes-animation.html"
previous_part: "/animation-nodes/the-essense-of-animation-nodes-vector-based-drivers.html"
---

We tend to use vectors, eulers and quaternions to represent and control transformations but we really should be using **Transformation Matrices** and you will, after I show you how practical they are. This post won't include any maths or linear algebra, we will just scratch the basic concept of transformation matrices so that you start using them.

I will introduce you to some examples of usage, and it is important that you apply and edit them your own so that you get a sense of what they are, while if you don't, you will struggle now and forever as you use them.

# Transformation Matrix
Matrices are arrays of values that are used in linear algebra to do all sort of things. Matrices are of different dimensions but when it comes to CG and 3D, we tend to use $4\times 4$ matrices or 4 dimensional matrices like this:

$$
\begin{bmatrix}
1 & 0 & 0 & 0 \\
0 & 1 & 0 & 0 \\
0 & 0 & 1 & 0 \\
0 & 0 & 0 & 1
\end{bmatrix}
$$

And that's because of some mathematical concepts called **Homogeneous coordinates** and **Affine Transformations** which basically differentiate between coordinates matrices that define a point and ones that define vectors (directions). But we won't be looking at any of that.

Now, A **Transformation Matrix** is a matrix that when we multiply to a coordinates matrix (A matrix that include the coordinates of an object), it will transform that coordinates matrix in some way based on its contents. If we let $C$ be a coordinates matrix that define an object's location and $M$ be a transformation matrix, then their product is a coordinates matrix $C_n$ that represent the object's new position.

$$
M \times C = C_n
$$

We generally have 3 types of transformation matrices:

- A Translation Matrix.
- A Rotation Matrix.
- A Scale Matrix.

We can combine those transformation matrices together by multiplying them and get a new transformation matrix that include translation, rotation and scaling all together. The great advantages of transformations matrices come from this combination of transformations.

You see, A transformation matrix is really a correlation between translations, rotations and scaling. Lets suppose that we have an object located at some distance away from the origin point of the space in the x direction. There is infinite number of ways we could rotate that object in the z axis, one method would be rotating it around the origin point of the space, that is, point $(0,0)$:

![Rotation Around Center](/images/the-essence-of-animation-nodes-transformation-matrix/rotation_around_center.gif)

We do that easily in the 3D viewport. And we could also use any point in space to rotate around. However, in AN, rotating an object by editing its eulers angle or quaternion won't do that, it will just rotate it in its local space:

![Rotation In local Space](/images/the-essence-of-animation-nodes-transformation-matrix/rotating_locally.gif)

So you notice that a non local rotation change the position of the object as well and not just its orientation. In AN we could do some math to edit the location as well, but that will take time and just make our node tree bigger. AN provided us with matrices so that we use them in these cases, they give more control and are very easy to use if you understand them.

## Matrix Multiplication

Before we start, lets look at some of the properties of matrix multiplication as it will have a great effect on our study.

- Matrix Multiplication is **not commutative** and so $M_1 \times M_2 \neq M_2 \times M_1$. In other words, rotating then translating isn't as translating then rotating:

![Multiplication Order](/images/the-essence-of-animation-nodes-transformation-matrix/multiplication_order.gif)

This is the only property you need to know for now, so lets move on.

## Global Space vs Local Space

When I transform an object, I am really transforming each vertex in it by the same amount, however, blender does that for us in the background and we just say that the object was transformed.

If one were to describe the location of the orange vertex, he could do that in two ways:

- **Global Space** - He would say that the orange vertex is located at $(2,2)$ and this value is relative to the center of the global space(the point $(0,0)$) and it is described in terms of the directions of x and y which I colored red and green respectively.
- **Local Space** - He would say that the orange vertex is located at $(1,1)$ and this values is relative to the center of its local space (somewhere at $(1.6,0.7)$) and it is described in terms of the local directions x and y which are denoted by the red and green arrows. Notice that the square has a side length of 1 so thats why I called it $(1,1)$.

![Global Position vs Local Position](/images/the-essence-of-animation-nodes-transformation-matrix/local_vs_global.png)

Furthermore, if one were to move the orange vertex 1 unit in every direction, he could do that in two ways:

- **Global Space** - He would move it to the location $(3,3)$ which we get by translating the point 1 unit in the global x and 1 unit in the global y.
- **Local Space** - Move it to the location $(2.3,3.3)$ which we get by translating the point 1 unit in the local x and 1 unit in the local y which I marked using unsaturated colors.

![Global Translation vs Local Translation](/images/the-essence-of-animation-nodes-transformation-matrix/local_vs_global_2.png)

{%  include note.html content="Notice that the local space is also affected by the scale of the object, and so if the object was scaled by 2 its translation in the local space will be doubled." %}

We say that the local space of the object is identical to its global space if the object was located at the point $(0,0,0)$ and has an euler rotation of $(0,0,0)$ and a scale of $(1,1,1)$.

## Matrices In AN

Animation Nodes has a matrix data type that is designed to only work as a $4 \times 4$ transformation matrix, so you can't use it for anything else. AN also has a group of nodes that are designed to operate on matrices and we will look at some of them now.

### Object Matrix Input/Output Nodes:

![Input/Output Matrix](/images/the-essence-of-animation-nodes-transformation-matrix/input_output_matrix_nodes.png)

#### Object Matrix Input

This node will return a transformation matrix that represent the object's location ,rotation and scale.
But wait ... we have been saying that a transformation matrix transforms an object, however, we never said anything about a transformation matrix that define the object's location, rotation and scale.

Well, it is really simple, you can think of the object's location, rotation and scale as a transformation of an identity object, that is, assume that there exists an object we call **Identity** and is positioned at $(0,0,0)$ and has an euler angle of $(0,0,0)$ and a scale of $(1,1,1)$, when I describe an object with a transformation matrix $M$ , I am basically saying that our object is the Identity object transformed by the transformation matrix $M$.

#### Object Matrix Output:

This node will take a transformation matrix and set the location, rotation and scale of the input object based on it. The same concept of the *Object Matrix Input node* apply.

### Matrix Multiplication Nodes:

![Matrix Multiplication](/images/the-essence-of-animation-nodes-transformation-matrix/matrix_multiplication_nodes.png)

There are two nodes we can use to do the matrix multiplication and those are the *Math Node* and the *Combine Node*:

- **Math Node** - This node will multiply the input matrices, and of course the order matter as we said before.
- **Combine Matrices** - This node takes a list of matrices and multiply all of them together, in order, so again, the order matters. We will be mostly using this node because it is easier and more organized than using multiple math nodes.

### Matrix Creators

![Matrix Creation](/images/the-essence-of-animation-nodes-transformation-matrix/create_matrix_nodes.png)

There are multiple nodes we can use to create the transformation matrices and they are as follow:

- **Scale, Rotation and Translate Nodes** - They just create a transformation matrix based on their inputs.
- **Compose Matrix Node** - This node is a combination of the previous three (Their Product). It is worth mentioning that the order of multiplication of its individual transformation is reversed, so it is Scaling>Rotation>Translation. We will soon look at why this order is used and and why it matter.

***
Now that you know about transformation matrices and AN nodes, let's get to transforming some objects.

## Example 2.1a

![Example 2.1a](/images/the-essence-of-animation-nodes-transformation-matrix/example_2.1a.gif)

### Explanation

Here, I put my rotation first and my translation second. What happens is that my object gets rotated  around the center of the global space which is also the center of the local space, then it gets translated couple of units in the x direction. When I go back and edit the rotation , the object is still rotating in its local space because it was done first before the translation.

{% include note.html content="All transformation are done around or relative to a single point and it can never be changed and that point being (0,0,0). However, we can fake changing it by what we did in the previous example, so it doesn't matter where our object lie in space, the rotation was done first and thats what matter." %}

## Example 2.1b

![Example 2.1b](/images/the-essence-of-animation-nodes-transformation-matrix/example_2.1b.gif)

### Explanation

Here, I changed the order of the multiplication, where my translation become first. So what happens is that the object gets translated some units in the x axis, then it gets rotated around the center of the world and so its location change as well.

## Example 2.2a

![Example 2.2a](/images/the-essence-of-animation-nodes-transformation-matrix/example_2.2a.gif)

### Explanation

Here, I added an extra translation . So we now have a translation then a rotation then another translation. What happens is a combination between the previous two examples, if you pay attention, the first translation happen in the local space (Increasing x won't move the object in the global x axis rather it will move it in its local x axis which I marked with a red stick) and the second translation is in normal global space.

I really recommend you apply those examples so that you understand them better. So go ahead and play with this example.

## Example 2.2b

![Example 2.2b](/images/the-essence-of-animation-nodes-transformation-matrix/example_2.2b.gif)

### Explanation

I could take advantage of the combination in the previous example and make a combination that rotate the object around a fixed point, or in other words, I made the object orbit around a point (I marked its path with a circle so you can see it better).

You could try to understand it as a local/global transformation as in the previous example but we could also think of it as a sequence of actions, that is, the first translation is the inverse of the last transformation ---An inverse of a translation matrix is a translation in the opposite direction--- so we move the object 2 units in the negative x and y directions and then rotate the object which will rotate around the center of the world (That makes a circle which its center is the center of the world) and then we move the object back to its original place using the last transformation (Which is the inverse of the first, so they are really canceling each others but that is after they affected the rotation).

Thats how you understand matrix transformations, you carefully break it into smaller actions and follow it.

# ID Keys

Let's assume that I have an object and I wanted to move it, what should I do? One might be tempted to think that getting the location of the object through the *Matrix Input node* , multiplying it by a translation transformation matrix and using the *Matrix Output node* to output the new location would work. But this approach won't work, simply because at the next node execution, the new location will become the input location and the object will move forever and ever.

Animation Nodes handled this problem by introducing what is known as an ID key, and based on the documentation:

> ID keys are are values that are set to objects and they are constants unless you update them. An example would be storing the initial transformation of an object in an ID key and then access it for different reasons using the Object ID key node.

You can add an ID key for an object(s) by selecting it and p .... well, just look at this example:

![ID Keys](/images/the-essence-of-animation-nodes-transformation-matrix/id_keys.gif)

Now that we added an ID key to the object, we can access its data through the *Object ID Key node*:

![Object ID Key Node](/images/the-essence-of-animation-nodes-transformation-matrix/id_key_node.png)

And now, instead of getting the location of the object from the *Matrix Input node* , I can get it from that initial transforms key I just added and move the object as we wish.

## Example 2.3a

![Example 2.3a](/images/the-essence-of-animation-nodes-transformation-matrix/example_2.3a.gif)

### Explanation

This example is what is known as parenting, which you have probably used before. All I do is multiply the initial position of the child or the cylinder (In blender the initial position is the position at which the parenting relation was applied) by the transformation matrix of the father or the cube. That way, the child will copy all the transformations that his father does.

## Example 2.3b

![Example 2.3b](/images/the-essence-of-animation-nodes-transformation-matrix/example_2.3b.gif)

### Explanation

Here, I added a rotation matrix before the cubes' transformation matrix, can you guess why I put it before? you got it, because I don't want it to get affected by the location of the cube, in other words, I want it to rotate in the local space of the cube.

{% include note.html content="Since the rotation happen in the local space of the cube, you see that the rotation in y happens around the local y and not the global y" %}

## Example 2.3c

![Example 2.3c](/images/the-essence-of-animation-nodes-transformation-matrix/example_2.3c.gif)

### Explanation

In this example, I added another translation matrix which act as an offset in the local space of the child which is in turn in the local space of the cube.

Are you starting to see how that layered system work?

## Example 2.4a

![Example 2.4a](/images/the-essence-of-animation-nodes-transformation-matrix/example_2.4a.gif)

### Explanation

Lets assume that due to global warming, we no longer have an option to access vertices locations in their global space. If I created a new mesh and filled it with the vertices locations I have, the new mesh will always lie at the center of the global space because locations are defined in local space.

We can however transfer our vertices from the local space to the global space by multiplying it to the transformation matrix of the object. And now everything work fine.

## Example 2.4b

![Example 2.4b](/images/the-essence-of-animation-nodes-transformation-matrix/example_2.4b.gif)

### Explanation

This is how we shear object.

***

# Appendix
In this small section, I will introduce you to the math of one of the examples just to get a feel of what happens behind the scene.

A coordinates matrix looks like this:

$$
\begin{bmatrix}
x \\ y \\ z \\ 1
\end{bmatrix}
$$

Which basically represent the vector or the point $(x,y,z)$, the extra 1 is of homogeneous coordinates.

A translation transformation matrix looks like this:

$$
\begin{bmatrix}
1 & 0 & 0 & \Delta x \\
0 & 1 & 0 & \Delta y \\
0 & 0 & 1 & \Delta z \\
0 & 0 & 0 & 1 \\
\end{bmatrix}
$$

Where $ \Delta x$ is how much we move in x.

When I want to move the point $(1,2,3)$ 2 units in every direction I do the matrix multiplications as follow:

$$
\begin{bmatrix}
1 & 0 & 0 & 2 \\
0 & 1 & 0 & 2 \\
0 & 0 & 1 & 2 \\
0 & 0 & 0 & 1 \\
\end{bmatrix}
\times
\begin{bmatrix}
1 \\ 2 \\ 3 \\ 1
\end{bmatrix}=
\begin{bmatrix}
3 \\ 4 \\ 5 \\ 1
\end{bmatrix}
$$

Notice that matrix multiplication is not elementwise, it is done in a special way.

***

I feel like I have given you enough information to start using matrices your own. And I hope you understood it well. See you in the next topic.
