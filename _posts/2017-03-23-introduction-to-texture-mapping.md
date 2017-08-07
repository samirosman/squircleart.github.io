---
title: Introduction To Texture Mapping
layout: post
category: Shading
description: Artists tend to use UVs to perform texture mapping even if it is not
  needed; because this saves them the trouble of doing math. In this tutorial, I am
  going to teach you how texture mapping works aside from UV mapping.
image: "/images/introduction-to-texture-mapping/wall.png"
prerequisites:
- text: Basic knowledge of blender's shading system.
- text: Good knowledge of transformation matrices.
  url: https://squircleart.github.io/animation-nodes/the-essence-of-animation-nodes-transformation-matrix.html
---

Understanding texture mapping won't only benefit you in texture mapping, it will also benefit you in procedural texturing and image processing. So I shall give you a good idea of how texture mapping works and then tell you about some techniques to use when doing texture mapping.

# Coordinates Space
First, I want to to talk about the problem we have in hand, what are we trying to do?

We have an image which is a discrete 2D space composed of some discrete value (pixels), that 2D space is just a small subset of the $R^2$ Euclidean space having a coordinates interval of $[0,1]$ in both X and Y axis, lets look at one such example to understand this better:

![Image Example](/images/introduction-to-texture-mapping/image_example.png)

We have a simple $512 \times 512$ greyscale image on the left and its coordinates space on the right. The first step to understand image coordinates space is to completely forget about colors and to start think of it as vectors. So we see that every pixel in the image space is actually a vector that represent the location of the pixel in the interval $[0,1]$ in both axis. Here is the individual components of the image coordinates space:

![Image Coordinates Space Components](/images/introduction-to-texture-mapping/coordinates_space_components.png)

The image on the right is the x coordinates of each pixel in the image while the image on the right is the y coordinates of every pixel in the image.We saw it before as a fancy colored image because I rendered the vector as an image and so its XYZ components were viewed as the RGB values of an image.

We notice that both component's values are in the range between zero (black) and one (white) because as we said "It is a subset of the $R^2$ Euclidean space having a coordinates interval of $[0,1]$ in both X and Y axis". Notice that I didn't show you the Z component because it doesn't matter, the image is a 2D space composed of X and Y values, Z value can be any value and it still won't matter.

If you still don't get it, sample the value of any pixel in the coordinates space then plot it, you will see that the point location in the plot is at the same location as the pixel you sampled, this tells you that the vector you sampled is the location of the pixel.

***

When I say texture mapping, I usually mean projecting that texture or image to a higher dimensional space. In most of the cases it's the projection of the image---2D space---into a mesh---3D space, So lets look at how mapping is performed.

# Mapping
For our first example, I am going to use a very simple mesh, a plane positioned at the center of the world with a side length of one. I chose a plane because it is actually a 2D subset of of the 3D space, So even though it is 3D, we would actually be perform a 2D to 2D mapping. I wanted to do a 2D to 2D mapping first because it is easier to understand, then after we understand it, we will move on to a 2D to 3D mapping.

## Example 1

![Example 1a](/images/introduction-to-texture-mapping/example_1a.png)

What I did here is very simple, I computed the position of each point in the plane in the global space and then use the image node to map the image to that position space. The image node in cycles is the node responsible for mapping, it takes a vector space and map the input image into that vector space.

So how did the image node do the mapping? Why are we seeing only quarter of the image in the upper right corner? lets look at the position space that we are mapping to:

![Example 1b](/images/introduction-to-texture-mapping/example_1b.png)

We see the X component on the left and the Y component on the right. We notice that both of them ranges from $-0.5$ to $0.5$, why do you think?
Because as we said, our plane is positioned at the center of the world (point $(0,0,0)$) and has a side length of 1, then the center of the plane will have a value of zero in both axis (because it is at the center of the world) and the furthest point to the right will have a value of $0.5$ in the X axis while the furthest point to the left will have a value of $-0.5$ in the X axis thats because the side length is 1 and is divided equally between positive and negative direction ($\frac{1}{2}=0.5$), the same apply to the y axis.

The image node basically looks at each point in that space, sample its vector, go to the image to find the pixel that has the same vector value (coordinates) and finally copy that pixel's value to the point it sampled before. Did you get it? Lets analyse the previous example to understand this better.

The image node goes to every point in lower left corner in the vector space, it found that they have a vector with negative values in both axis, it went to the image to find the pixels with the same coordinates as the vector it sampled, but it didn't find any, our image pixel's coordinates ranges between $[0,1]$ there is no negative values ! Having found no pixels that matches the vector value, it just colored it black.

The same happens with the lower right corner and the upper left corner; because they have negative values in either the X or Y axis, so they are colored black.

The only points that have vectors in the range of our image coordinates are those of the upper right corner, they range from zero to $0.5$ in both axis. And so the image node went to every point in that corner of the vector space, found the pixel that matches its value in the image and replaced it with the pixel's color.

That explains why the only portion of the image showing is the lower left one and why it appear at the upper right corner. Because the only non negative vectors are at the upper right corner and because they only range between zero and $0.5$ in both axis:

![Example 1c](/images/introduction-to-texture-mapping/example_1c.png)

The image above shows the portion of the image that matches the valid portion of the vector space. Which is the leg of the photographer we saw above.

## Example 2

Well how do I display the whole image?

![Example 2a](/images/introduction-to-texture-mapping/example_2a.png)

Since our current valid portion of the vector space ranges between zero and $0.5$ while the non valid portion of the image ranges between $-0.5$ and zero, then adding $0.5$ to the whole image will set the non valid portion to be $[-0.5,0]+0.5=[0,0.5]$ and the valid portion will be $[0,0.5]+0.5=[0.5,1]$ and thus, our whole image will be in range $[0,1]$ which is the exactly the interval of our image coordinates, and so our image get fully displayed.

A smart guy would observe that adding is in fact a translation in affine transformation:

![Example 2b](/images/introduction-to-texture-mapping/example_2b.gif)

Notice that when adding values more than $0.5$, we get an interval that exceeds one and it is out of our image interval and so it is also colored black.

{% include note.html content="Notice that adding a values to a vector should move the vector in the positive direction, but in this case it moves in the negative direction, simply because we are moving the coordinates plane and not the vector and so our translation is reversed. (By vector here, I mean the image's location)" %}

## Example 3

There is multiple ways to handle values that are out of the interval $[0,1]$, but the most popular one and the one you will be using a lot is the **Repeat** method.

![Example 3a](/images/introduction-to-texture-mapping/example_3a.gif)

This method uses the **Modulo** to get values into the range $[0,1]$. Modulo 1 will return the remainder of the euclidean division by 1, but division by 1 will return the whole number with a remainder of its fraction, then $x \mod {1}$ will return the fraction of x and the fraction is always between zero and 1, then we are safe and all our image is in the range $[0,1]$.

Negative values however will also be in the right range, but they will be flipped, try inputting values less than $0.5$ in the above example and observe how the image gets flipped.

{% include challenge.html content="Can you think of a new method to get image at negative values right and not flipped?" %}

## Example 4

Adding to a vector translate it, multiplying by a scalar scales it.

![Example 4a](/images/introduction-to-texture-mapping/example_4a.gif)

We know that if we multiplied a vector by a scalar, it will be scaled, then we can multiple the vector space to scale our image.

{% include note.html content="Notice that multiplying a vector by a scalar that is bigger than 1 should magnify the vector, but in this case it reduces it, simply because we are scaling the coordinates plane and not the vector and so our scaling is reversed. (By vector here, I mean the image)" %}

Multiplying by 5 will change the interval to be [0,5] and most of the image will be black, but then if I followed it by a modulo, we will get a $5 \times 5$ grid of the image. The why is trivial.

![Example 4b](/images/introduction-to-texture-mapping/example_4b.png)

# Mapping Node

![Mapping Node](/images/introduction-to-texture-mapping/mapping_node.png)

This node is absolutely gorgeous! The name is a bit misleading though, it has nothing to do with mapping. This node basically takes a vector and multiply it by a transformation matrix which it generates based on your inputs then it modulo the output and multiply by a max-min mask.

As you can see, it is an all in one node, we can do translation, rotation, scaling, modulo and more. I will assume that you are familiar with transformation matrices and have experience with them, if you don't, check my tutorial on the topic: [The Essence Of Animation Nodes: Transformation Matrix](https://squircleart.github.io/animation-nodes/the-essence-of-animation-nodes-transformation-matrix.html).

There is multiple options in the node:

- **Texture** - This option multiply the input vector by the inverse of the affine transformation matrix generated based on your inputs. And subsequently, the order of multiplication is Translation >> Rotation >> Scale. Do you remember the 2 notes I gave above? I said that your translation and scaling will be reversed because we are editing the space and not the vector, well, this option fix this by taking the inverse of the transformation matrix. So in short, this option operate on the texture itself and not the vector space.
- **Point** - This option multiply the input vector by the affine transformation matrix generated based on your inputs. It is exactly similar to what we did in the previous examples where we had the translation and scaling reversed, and the order of multiplication is Scale >> Rotation >> Translation.
- **Vector** - This option multiply the input vector by the transformation matrix generated based on your inputs. Notice that I have been saying *Affine* in the other 2 options, affine transformation matrices treat the vector as a point that has a location in space and you can edit that vector location, this is done using what is known as homogeneous coordinates, However, non-affine transformations will treat a vector as just a vector that doesn't have a location, in this case, it doesn't make sense to translate a vector. Go ahead, try this option and edit the location, not working, right?
- **Normal** - This option assume that you are editing vectors with unit length, it won't be helpful in texture mapping, so forget about it.

Which option to use? Well, it depend on what you want to use, I would use a combination between texture and point mapping node allowing me to do local-global transformations easily.

## Example 5

Here is an example of the texture mapping node:

![Example 5a](/images/introduction-to-texture-mapping/example_5a.gif)

For more examples, see my tutorial on transformation matrices and try to apply the examples here in the shading system.

You can use multiple mapping node to gain more easier control:

![Example 5b](/images/introduction-to-texture-mapping/example_5b.gif)


## Example 6

I am going to make something really cool now, Instead of using rectangular coordinates as my vector space, I am going to convert it to polar coordinates space while making sure that the polar angle be in the range $[0,1]$ and the polar magnitude or norm be in range $[0,1]$.

First, I am going to compute magnitude or the norm, which is as easy as using pythagorean theorem:

![Example 6a](/images/introduction-to-texture-mapping/example_6a.png)

Then I am going to compute the polar angle, blender doesn't provide use with Atan2 operator, so we will have to implement it ourselves, I choose the [tangent half angle formula](https://en.wikipedia.org/wiki/Tangent_half-angle_formula) method because we already have the norm, and so arctangent is defined as:

$$
2\arctan{(\frac{y}{\sqrt{x^2+y^2}+x})}
$$

After computing this, I add $\pi$ to the negative values (This is done by getting a mask of the negative values using the less than zero node then multiply by $\pi$ then add to the original value) then divide by $\pi$ to get the polar angle in $[0,1]$ range. I should have added $2\pi$ and divided by $2\pi$ but I didn't, this is because I should have multiplied the arctangent by 2 (see the formula above) but I didn't.

![Example 6b](/images/introduction-to-texture-mapping/example_6b.png)

Now composing a vector by the norm and angle, we can see that this mapping produce a very interesting tiny planet effect. I used an equirectangular image instead of the photographer for this example to make the tiny planet example. Here is the result:

![Example 6c](/images/introduction-to-texture-mapping/example_6c.png)

I think it is quite nice. The previous way is the mathematical way to think about it, but you can think of it as a change of shape of the image, Here you see the x and y rectangular channels, they display the image fully if used as the vector space, I can bend them in a way such that they form the tiny planet you see above. And you can actually see that the final channels are very similar to the ones we generated using math.

![Example 6d](/images/introduction-to-texture-mapping/example_6d.gif)

## Example 7

I could translate each row in x by an amount relative to its location in y axis by a node tree like this:

![Example 7a](/images/introduction-to-texture-mapping/example_7a.gif)

## Example 8

I could translate pixels at random direction by random factor by adding a perlin noise. I subtracted $0.5$ from it so that some of the values are negative and thus some pixels get displaced in both directions.

![Example 8a](/images/introduction-to-texture-mapping/example_8a.gif)

## Example 9

We have been using a 2D vector spaces to define the image, but we could just use a 1D vector space to do that as well !

![Example 9a](/images/introduction-to-texture-mapping/example_9a.png)

First, you may notice that I changed the image to a perlin noise, the only difference is that perlin noise is created based on the vector space you provide, so in principle, it is treated exactly as an image.

When I used the norm that we computed before as the x axis and left the y and z untouched, I basically created a 1D perlin noise in a certain axis which is the norm, you can see that the noise change moving away from the center, but it is constant radially; because it's 1D noise and can change in just one axis.

Similarly, I can use the polar angle as my x axis and leave the other 2 axis untouched, this will make the noise change radially by stay constant in the other axis.

![Example 9b](/images/introduction-to-texture-mapping/example_9b.png)

***

I think we saw enough examples on 2D to 2D mapping, lets go 3D !

# Higher Dimensional Mapping

You probably know by now that an image is a 2D space and a 3D model exists in 3D space. We can't just map a 2D space to a 3D space, so what do we do? Well, we can do one of 2 things:

- Convert the 2D space to a 3D space.
- Convert the 3D space to a 2D space.

What would you do? I would choose the 3D to 2D conversion because it is easier as it aim to simplify a higher dimensional space to a lower dimensional one.

Let me give you a warming up example.

## Example 10

What if I rotated the plane we have 90 degree around the x axis? If I tried to use the position vector space as before, I would get this:

![Example 10a](/images/introduction-to-texture-mapping/example_10a.png)

Well, a smart guy would just use the z position as the y component in the vector space, this will display the image normally as before because the plane is still 2D, just with a different orientation.

![Example 10b](/images/introduction-to-texture-mapping/example_10b.png)

## Example 11

Now, what if I replaced the plane by a cylinder of height 1? The mapping will just be an orthogonal (parallel) projection of the image onto the cylinder, resulting in a distortion when approaching the edges.

![Example 11a](/images/introduction-to-texture-mapping/example_11a.png)

A typical solution for this is by using a UV mapping.

![Example 11b](/images/introduction-to-texture-mapping/example_11b.png)

# UV Mapping
UV mapping is the process of simplifying a 3D model into a simple 2D representation.

![UV Map](/images/introduction-to-texture-mapping/uv_map.png)

The above example shows the UV map for the cylinder, we basically flattened the model and described it in a 2D space you see on the right. Since it is now described in 2D space and our image is in 2D space, we can do the mapping as we did before but with using the the UV vector space instead of the position space.

## Example 12

Although UV mapping worked, it isn't really needed. Lets think about this for a minute, the cylinder is a circular object and it is uniform along its hight, then I can mathematically generate a vector space based on the position space that describe that object.

![Example 12a](/images/introduction-to-texture-mapping/example_12a.png)

To define X, I computed the normalized polar angle. For Y, I used the location in Z. I multiplied by $\pi$ because our image is in $1:1$ aspect ratio while the ratio between the height and circumference is $1:2 \pi r = 2 \pi \frac{1}{2} = \pi , 1:\pi$. I won't explain this example further, take your time to understand it if you haven't.

## Example 13

Given a sphere and an earth texture? How do I map the earth texture onto that sphere? Using UV maps? No, from the last example we know that such simple models are better mapped using some simple math. So we do some math.

![Example 13a](/images/introduction-to-texture-mapping/example_13a.png)

This example is pretty similar to the previous one, except it isn't uniform along its hight. Then the X component will be the same using the polar angle. The y component however will need more work. Lets look at this construction to see how we are going to compute the Y component.

![Example 13b](/images/introduction-to-texture-mapping/example_13b.svg)

This is a cross section of the sphere, $Z$ is the Z position of the point on the sphere and the radius of the sphere is $0.5$ then $\theta$ is defined as $\arcsin{\frac{Z}{0.5}}$, but I am going to multiply the radius by 2, then $\theta = \arcsin{Z}$, and it ranges between $-\frac{\pi}{2}$ and $\frac{\pi}{2}$, to get it into the interval $[0,1]$ I add $\frac{\pi}{2}$ then divide by $\pi$. After doing this, I get my vector space to map an earth texture on a sphere.

Notice that this is simplest earth projection method. There is a lot of projection methods like mercator projection which need some more math to be done, but for this tutorial, I think our simple method is fine.

***

I think I have given you enough examples, theories and techniques to start doing your own texture mapping. So go ahead, start practicing and playing with that concept you just learned.