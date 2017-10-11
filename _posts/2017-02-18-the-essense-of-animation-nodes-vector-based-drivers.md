---
title: 'The Essence Of Animation Nodes: Vector Based Drivers'
layout: post
image: "/images/the-essence-of-animation-nodes-preface/the-essence-of-animation-nodes.png"
description: In this part, we will start creating our very first node trees in Animation
  Nodes by learning how to control object's properties based on other properties.
category: Animation-Nodes
prerequisites:
- text: Basic knowledge of the system of Animation Nodes.
  url: "/animation-nodes/the-essense-of-animation-nodes-the-system.html"
- text: Basic knowledge of vectors.
next_part: "/animation-nodes/the-essence-of-animation-nodes-transformation-matrix.html"
previous_part: "/animation-nodes/the-essense-of-animation-nodes-data.html"
---

We said in the preface that AN can be used in multiple applications and the first one was drivers, that is, controlling some property by another. So we are going to study that now.

# Vectors

Vectors are one of the most important data types in AN because it is used all over blender to define locations, scales, normals, etc. 
We will start by giving some examples on vector based drivers.

## Example 1.1a

![Example 1.1a](/images/the-essence-of-animation-nodes-vector-based-drivers/example1.1a.gif)

### Explanation

In this example, we simply copy the location of the square object to the circle. This is done by getting the location of the square using the *Object Transforms Input* node and setting the location of the circle to that location using the *Object Transforms Output* node.

## Example 1.1b

![Example 1.1b](/images/the-essence-of-animation-nodes-vector-based-drivers/example1.1b.gif)

### Explanation

In this example, we not only copy the location, but also scale it by multiplying it by two.  So moving the square two units in the x direction will move the circle four units in the same direction. We will learn more about the math behind transformation soon.

## Example 1.1c

![Example 1.1c](/images/the-essence-of-animation-nodes-vector-based-drivers/example1.1c.gif)

### Explanation

In this example, we not only copy the location, but also offset it by adding a vector to it. By adding two to the x component, we offset the circle by two units in that direction.

## Example 1.2a

![Example 1.2a](/images/the-essence-of-animation-nodes-vector-based-drivers/example1.2a.gif)

### Explanation

In this example, we set the scale of the circle to the x location of the square. The *Vector From Value* node creates a vector with all three components filled with the input value.

## Example 1.2b

![Example 1.2b](/images/the-essence-of-animation-nodes-vector-based-drivers/example1.2b.gif)

### Explanation

In this example, we did two extra steps, that is, we got the absolute of the x location and added one to it. The absolute makes sure all values are positive and that the minimum possible value is zero, when we add one to it, the minimum value will be one and thus our object scale will never go to zero or negative.

## Example 1.3a

![Example 1.3a](/images/the-essence-of-animation-nodes-vector-based-drivers/example1.3a.gif)

### Explanation

In this example, we set the scale of the circle to cosine the x location of the square making its scale go smoothly between negative one and one.

## Example 1.3b

![Example 1.3b](/images/the-essence-of-animation-nodes-vector-based-drivers/example1.3b.gif)

### Explanation

Since the cosine is a periodic function, we can increase its frequency by multiplying its input by some scalar.

## Example 1.4a

![Example 1.4a](/images/the-essence-of-animation-nodes-vector-based-drivers/example1.4a.gif)

### Explanation

In this example, we use the location of the circle as a direction vector to control the rotation of the square using the *[Direction To Rotation](http://animation-nodes-manual.readthedocs.io/en/latest/user_guide/nodes/rotation/direction_to_rotation.html)* node.

## Example 1.4b

![Example 1.4b](/images/the-essence-of-animation-nodes-vector-based-drivers/example1.4b.gif)

### Explanation

In this example, we use the rotation of the square to generate a direction vector which in turn we use to control the location of the circle using the *[Rotation To Direction](http://animation-nodes-manual.readthedocs.io/en/latest/user_guide/nodes/rotation/rotation_to_direction.html)* node.