---
title: 'The Essence Of Animation Nodes:  Animation'
layout: post
image_path: "/images/the-essence-of-animation-nodes.png"
description: Animation Nodes is a master when it comes to animation in blender. So
  we shall give some examples on animating using AN, we shall look a fcurves and interpolations
  as well.
category: Animation-Nodes
---

Animation Nodes is a master when it comes to animation in blender, not because of the  nodes that are related to animation, but because of the freedom AN gives you while animating is really up to you.

In this tutorial, I am going to give you some examples on modifying existing animations to create a more advanced and realistic animations as well as creating animations from scratch.

# Blender Animation
First, I am going to have a look at the representation of animations in blender. And to do this, I am going to look at this simple example of an object changing position in 60 frame.

![Blender Animation](/images/the-essence-of-animation-nodes-animation/blender_animation.gif)

You may notice that I am actually animating an empty which I parented suzanne to, artists tend to call that a proxy. I used a proxy to do the animation for some reasons we will look at in a moment.

If you have some experience with animating, you might know that a basic animation like that can be achieve by inserting couple of keyframes that define the location of the object at some discrete time. Blender takes those discrete time locations and interpolate between them to get a smooth running animation.

Blender create something called an **FCurve** out of that interpolation which is basically a function of time domain that describe the change of some value in the scene, in the case above, the values of the scene are the x,y and z locations of the empty.

![Graph Editor](/images/the-essence-of-animation-nodes-animation/graph_editor.png)

The image above is screenshot of the graph editor. It displays all the FCurves in the scene.

We can read the Fcurves as follow:

- By looking at the Fcurve of the y location (Green), we see that it is a constant function which is always zero, and that's true, our object never changed its position in the y axis.
- By looking at the Fcurve of the x location (Red), we see that the objects moves from the zero point and rushes in the positive x direction then rushes back into the negative x direction then it goes back to the zero point. You can actually see that this is what happens to the object from the first image.
- By looking at the Fcurve of the z location (Blue), we see that it a very simply increase followed by a slight change in velocity then a simple decrease. And you can see that this is what happens to the object in the first image.

# AN FCurves
Animation Nodes provided us with couple of nodes that can access blender's animation data, and those are:

![Example 3.1a](/images/the-essence-of-animation-nodes-animation/nodes_overview.png)

- **Time Info** - It returns the current frame, it is a float because of subframes that are used in some applications like cycles motion blur.
- **FCurves From Object** - It returns a list of all fcurves in the object, in the case of the previous example, it will return 3 Fcurves (x,y and z locations Fcurves).
- **Evaluate Fcurve** - We said that fcurves are functions of time domain, well this node evaluate that function at the input time.

Now, I am going to do something nice with those nodes, I will first remove the parenting relation between suzanne and the empty that has the animation data, that way, suzanne won't move when the empty move. And then I am going to do some noding.

## Example 3.1a

![Example 3.1a](/images/the-essence-of-animation-nodes-animation/example_3.1a.gif)

### Explanation

I got the fcurves from the empty, got the 3 fcurves it has using the *Get Element* node, evaluated each fcurve at the current frame and composed a vector which I then used as the location of suzanne. And voila, suzanne is moving just as before.

The concept of the node tree is pretty simple, since the x,y and z fcurves are functions of the time domain, I can just evaluate them at the current frame to get the current value of each location channel.

I hope some of you are starting to see the possibilities here.

## Example 3.1b

![Example 3.1b](/images/the-essence-of-animation-nodes-animation/example_3.1b.gif)

### Explanation

Remember that fcurves are continuous functions even though our frames were discrete. Being continuous, we can operate on it anyway we want! Here, I multiplied the current frame by $\frac{1}{2}$ and the animation got slowed down.

## Example 3.1c

![Example 3.1c](/images/the-essence-of-animation-nodes-animation/example_3.1c.gif)

### Explanation

Fcurves are functions that have a domain of $R$. Being defined in negative values, we can subtract from the current frame 20 and the evaluation from $[-20,0]$ will return zero and so our object will be at zero for the first 20 frames and start moving after the frame 20. And of course addition will start the animation earlier.

{% include note.html content="We see that multiplication increase or decrease the speed of the animation while addition offset the animation." %}

## Example 3.1d

![Example 3.1d](/images/the-essence-of-animation-nodes-animation/example_3.1d.gif)

### Explanation

I can use modulus arithmetic to repeat the animation every 30 frame. We used this technique in [Example 1.3b](https://squircleart.github.io/animation-nodes/the-essense-of-animation-nodes-vector-based-drivers.html#example-13b) if you remember correctly.

{% include challenge.html content="Can you edit the previous example to achieve forward-backward repetitions?"%}

Here is the result of my solution to the challenge, show me yours:

![Example 3.1d](/images/the-essence-of-animation-nodes-animation/challenge.gif)

If you find it hard to make the previous challenge, check [Example 1.3c](https://squircleart.github.io/animation-nodes/the-essense-of-animation-nodes-vector-based-drivers.html#example-13c) It uses the same algorithm required to achieve this effect.

***

So far we have been editing the domain of the function, we can edit the output (range) of the function as well!

***

## Example 3.2a

![Example 3.2a](/images/the-essence-of-animation-nodes-animation/example_3.2a.gif)

### Explanation

I could multiply the x channel by 2 and thus the object will move twice as far in x direction.

## Example 3.2b

![Example 3.2b](/images/the-essence-of-animation-nodes-animation/example_3.2b.gif)

### Explanation

I could add 2 to the z channel and thus the object will be above the empty by 2 units at any instance.

## Example 3.2c

![Example 3.2c](/images/the-essence-of-animation-nodes-animation/example_3.2c.gif)

### Explanation

You thinking what I am thinking? yes, we could add some perlin noise to the location of the object, perlin noise is also a function of time so everything goes seamlessly.

***

Now you might be thinking, I could do that in the graph editor using modifiers, and this is true. However, I am just giving you an introduction by simple examples, real life applications will be more advanced. Lets look at another more advanced example.

***

## Example 3.2d

![Example 3.2d](/images/the-essence-of-animation-nodes-animation/example_3.2d.png)
![Example 3.2d](/images/the-essence-of-animation-nodes-animation/example_3.2d.gif)

### Explanation

In this example, I wanted to control the amount of noise by the velocity of the object. Cars vibrate more when they go faster ,right? Well ... old cars with bad aerodynamics only.

Unfortunately, blender doesn't allow us to compute the derivatives of the fcurve and subsequently doesn't AN (The first derivative of an fcurve is the velocity of the object). However, we could make a group that approximate the derivative by sampling another point that is short distance away from the current time and subtract the original point from it then dividing by the same amount we added which is 0.1 in this case.

Then I just used the gradient as my amplitude for the perlin noise.

# Interpolations
Interpolations are very similar to fcurves, they are functions as well, but we can explicitly define them from within the node editor without animating any objects. Interpolation is a misleading name, simply because they are not interpolations except for the *Interpolation From Curve Mapping Node*  which kinda interpolate your input points,but still. Looks like we are stuck with that name forever though.

Animation Nodes provide us with couple of nodes to create interpolations (well ... functions), and those are:

![Interpolations](/images/the-essence-of-animation-nodes-animation/interpolations.png)

Just like fcurves, we can evaluate those functions using the evaluate node, we can convert fcurves into interpolations, we can create functions from a preset like exponential functions and sinusoidal functions and we can create a function based on a spline interpolation of some discrete points using the*Interpolation From Curve Mapping Node* .

Lets look at some examples of interpolations.

## Example 3.3a

![Example 3.3a](/images/the-essence-of-animation-nodes-animation/example_3.3a.gif)

### Explanation

I created an interpolation which looks like a $t^2$ and then evaluated the interpolation at the current time which I used as the input time for the fcurve evaluation just as before.

Notice that I divided by 60 before evaluating the interpolation and then multiplied by 60 after. This is because my interpolation is defined in the domain $[0,1]$ and so I divided by the length of the animation (60 in this case) to get it into that range, then I multiplied by 6o to restore it to the original range.

Looking at the animation, we can see the result of our node tree. The animation starts slowly then rushes at the end.

We can predict that result by differentiating our function (to get the velocity), and so $\frac{d}{dt} t^2 = 2t$ and we see that as the time increase the velocity increases.

## Example 3.3b

![Example 3.3b](/images/the-essence-of-animation-nodes-animation/example_3.3b.gif)

### Explanation

Yes, using the inverse of the linear function will reverse the animation.

## Example 3.3c

![Example 3.3c](/images/the-essence-of-animation-nodes-animation/example_3.3c.gif)

### Explanation

Going all the way up then all the way down, this will complete the animation in half the time then go back in reverse in the other half. 

Playing with this is real fun, right?

## Example 3.3d

![Example 3.3d](/images/the-essence-of-animation-nodes-animation/example_3.3d.gif)

### Explanation

As we said before, fcurves and interpolations are basically function, so we can just go ahead and use interpolations alone.

In this case, the output of the evaluate node is the range so multiplying by 8 will set the final location of the object to 8.

## Example 3.4a

![Example 3.4a](/images/the-essence-of-animation-nodes-animation/example_3.4a.gif)

### Explanation

A standard sine wave with time domain.

## Animation Nodes
Animation nodes provide us with some nodes to ease the making of animation, those nodes are the *Mix*, *Repeat* and *Delay* nodes.

![Animation Nodes](/images/the-essence-of-animation-nodes-animation/animation_nodes.png)

- **Delay** - This node subtract the delay from the time. Why does it exist when we can just use the subtract node? well, tell an artist to delay the animation (as we did in [example 3.1c](https://squircleart.github.io/animation-nodes/the-essense-of-animation-nodes-animation.html#example-31c) ) by using the *Delay* node, Ok. Now tell him to delay the animation using a subtract node, what? ... exactly.
- **Repeat** - This node is the modulus arithmetic of the time by the repeat rate, why not just use a math node? you got the point. The node however have another option called **Ping Pong** which is equivalent to what we did in [Example 1.3c](https://squircleart.github.io/animation-nodes/the-essense-of-animation-nodes-vector-based-drivers.html#example-13c).
- **Mix** - The mix nodes mixes between 2 values by some factor which is usually time. The factor is divided by the duration which is equivalent to what we did in [example 3.1c](https://squircleart.github.io/animation-nodes/the-essense-of-animation-nodes-animation.html#example-33a). The node can mix between floats,vectors,eulers,quaternions, matrices and colors. Mixing between non floats is so sophisticated that even I won't be able to do it, so we are going to leave it for a dedicated tutorial.

## Example 3.4b

![Example 3.4b](/images/the-essence-of-animation-nodes-animation/example_3.4b.gif)

### Explanation

This is the last example we will be giving in this tutorial. And I want you to try to understand it yourself. We are basically trying to create a rotation of a camera around an object.

There is multiple ways we could create this animation, one way would be to use transformation matrices. But I used some other way.

{% include challenge.html content="Can you recreate the above example using another method?" %}

Here are some concepts to understand the example:

The parametric equation of the circle is:

$$
x = r \cos \theta \\
y = r \sin \theta
$$

Where $\theta \in [0,2 \pi]$ and $r$ is the radius of the circle.

Check the [Direction to Rotation Node](https://animation-nodes-manual.readthedocs.io/en/latest/user_guide/nodes/rotation/direction_to_rotation.html) docs.


