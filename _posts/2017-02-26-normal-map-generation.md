---
title: Normal Map Generation
layout: post
image: /images/normal-map-generation/wall.png
description: In this tutorial, we shall understand what a normal map is, derive a formula to calculate it from a height function and implement what we learned in a small normal map generator
category: Shading
---

Normal maps are essential in the workflow of artists and it is used in a lot of applications especially in the making of game assets, Normal maps also have some interesting application that nobody is aware of, or at least not directly.

In this tutorial, we will be looking at means of generating normal maps from height maps, displacement maps or just normal images from the internet. We will learn the concepts of discrete differentiation which we will use to implement our normal map generator, the implementation will be done in blender's compositor and Animation Nodes, but they are very easy to implement anywhere else, so lets get started !

# What Are Normal Maps?

You are probably familiar with normal maps and have used it before, but you may not know what it actually represent or how it work so we will see how they work now.

Normal maps are used to detailing models without having to add more polygons and this done by altering the rendering workflow and get the render engine into thinking that we have more polygons while in fact we don't.

#### A more formal way to say this is as follow:

The render engine uses triangles' normals in the "formulas" of shading and to add more detailed shading we got to add more triangles and thus more normals.

When a normal map is used, the render engine takes normals from each pixel of the normal map instead of taking it from the triangles of the object , that is of course after the normal map is projected into the surface. So now we can add much more normal information per triangle.

#### Here is an example to understand this better:

I have an object with some triangles and I am applying basic lambertian shading (direct diffuse), the render engine will get the normal for each triangle and compute its color by a simple formula which obviously include normals as a variable.

![Polygons Normals](/images/normal-map-generation/triangle_normals.png  "Polygons Normals")

Now suppose I want to add a circle in the object, I could just add couple more triangles, but then game developers will complain because "we increased the poly count and slowed their game" and modelers will complain because "Now they have to spend more time in editing the topology and adding the circle".

A shading artist will come to the rescue and say that he got us covered, he will make a normal map which include the normal information the render engine need to shade a circle in the object.

And that is what a normal map does, it provide information about normals per pixel and not per triangle and thus allowing more small details to be implemented without too much slow down in games and without more hours spent in modeling or sculpting this details.

![Polygons Normals + Normal Map](/images/normal-map-generation/triangle_normals+normal_map.png  "Polygons Normals + Normal Map")

## Types Of Normal Maps:

There is multiple types of normal maps which are the same in the way that each defines the normals of the shading point but different in the method of doing so.

### World Space Normal Map:

![World Space Normal Map](/images/normal-map-generation/world_space_normal_map.png  "World Space Normal Map")

You can instantly identify this kind of normal map because of its wide range of colors. This normal map is the most basic one, it just tell the render engine where the normals are pointing in the world space and we will see how it does that in a moment.

This kind is faster in rendering because it is straightforward at defining normals compared to the other types, however it has some disadvantages ...

Since the normals are defined in the world space, then if the objects rotate, the normals will be pointing in the wrong direction and thus result in an unexpected results especially for directional shading. And because of this, world space normal maps are used only for static object which does not rotate and transform like buildings in games.

{% include note.html content= "There is another type of map that is similar to the world space normal maps, and that is, object space normal maps. They basically define normals in the object's local space and not in world space. They are subjected to the same limitations as the world space and they are very similar that we can ignore them" %}

### Tangent Space Normal Maps:

![Tangent Space Normal Map](/images/normal-map-generation/tangent_space_normal_map.png  "Tangent Space Normal Map")[^1]

[^1]: Normal map image from [Knald](https://docs.knaldtech.com/doku.php?id=normal_maps_knald)

This is probably the map you are familiar with because it the most widely used one.

Tangent Space normal maps define normals relative to the original normal of the triangle, so they don't really define the normal of the shading point rather they offset that normal to get the desired normal. That give them the advantage over world space normal maps because they are dynamic, that is, they are not affected by the orientation of the object so you can use them in moving objects like weapons in games.

However, Tangent space normal maps are slower because it order to define the normal at any point, it has to be aligned tangently to that point and in order to completely align two 3d spaces, the 3 axis are required for both spaces. **So the z component of the map is aligned with the normal of the triangle**, the x and y components are aligned with the tangent and cotangent of this point (The tangent and cotangent are usually defined by the $U$ and $V$ axis of the UV map respectively).

***

Now, enough of that, lets get into the point of the tutorial and generate the maps.But to do so, we have to learn how normals ---which are vectors--- are encoded in images ---Which is composed of colors.

## Normal Maps Components

A normal is a 3D unit vector. A unit vector because we only care about the direction of that vector and not its magnitude and unit vectors are easier to deal with in calculations.

A 3D vector has 3 components $X$, $Y$ and $Z$ and since image's pixels have 3 channels $R$, $G$ and $B$ we can just go ahead and put the $X$ component in the $R$ channel, $Y$ in $G$ channel and $Z$ in $B$ channel. There is some limitation however in what we just did, a 3D vector can have negative values while images can't and so all our negative values will be clamped and become zeroes. To overcome this limitation, we just compress the positive and negative values into the positive interval $[0,1]$ and this mapping can be done easily by this simple formula:

$$\begin{equation} R = \frac{(\vec{N}_x+1)}{2}\\G = \frac{(\vec{N}_y+1)}{2}\\B = \frac{(\vec{N}_z+1)}{2} \label{1} \end{equation}$$

{%include note.html content="Our vector's components can never exceed 1 because they are normalized and thats why I knew which maximum and minimum values to use in my mapping function which are 1,-1."%}

So it is obvious that a vector which point in the original normal direction have the color $(0.5,0.5,1)$ which is a zeros in both X and Y and 1 in the Z direction. Recall that the Z axis is aligned with the original normal of the surface so a vector such as the one we just saw is actually the original normal itself without any offset. That is probably why you see tangent space normal maps blueish, because most normal maps are generally pointing in the same direction as the original normal with some small to medium offset in the other 2 axis.

Here is the individual components of the normal map shown above where you can see its $X,Y,Z$ components in order.

![Normal Components](/images/normal-map-generation/normal_components.png  "Normal Components")

Take your time looking at this image and try to figure out what it represents, A white color in the first image represent a vector that is pointing greatly toward the positive x direction while a black color represent a vector pointing in the negative x direction, grey color on the other hand tells us that the vector is neither pointing in the positive or negative x direction (remember that a grey color represents zero in the real scale). The same apply for Y direction of the second image. It is also worth noting that the points in the z component (last image) are mostly white because if you remember correctly, we said that the normal map vectors are generally pointing in the same direction as the original normal. A grey colored points however in the z component is where the other 2 components have a stronger values because the vector is normalized and increasing a component will decrease the others.

Ok, great, now we know what we are supposed to calculate in order to generate a normal map. Let's get into generating it.

# Generating Normal Maps

I have talked about the output but said nothing about the input or the information we have in order to generate the normal map. Generally, we will be making a converter that convert a height map into a normal map. Generating normal maps from colored texture maps does in fact follow the same process of converting a height into normal, that is, the color map is first converted into a greyscale image and then treated as a height map. This is how all normal map generators work, they only differ in the algorithm used to convert color maps to greyscale maps, one can actually find a smart way to convert colors into greyscale based on the the color information and not only the luminosity of the pixel. I won't have anything to do with the color to greyscale conversion in this tutorial because of a simple reason:

> The generation of normal maps from colored images is a cheap pure approximation and I believe that manual conversion is the best option either by image processing or by painting a height map from scratch using the color map as a reference. In fact, height to normal conversion is also an approximation but it a pretty good one and can be relied on. (We will look into methods of decreasing the error in the approximation further on)

## Height Map

In maths, we define a height map as a function $f:R^2 \longrightarrow R$ that describe a surface in $R^3$. Which means that I have a 2d discrete space with a function that map every point in that space to a value that we call the height of that point and we can represent this function in a 3D space as a surface. And so a height map like this distance voronoi diagram which We will be using as an example through out the rest of the tutorial:

![Voronoi](/images/normal-map-generation/Voronoi.png  "Voronoi")

Is represented by the surface:

![Voronoi Surface](/images/normal-map-generation/Voronoi_surface.png  "Voronoi Surface")

As you can see, for every point in $R^2$ we have a value $h$ which represent its position in the $Z$ direction. The point $(2,2)$ or the blue point has a height of 0.2 while the point $(12,11)$ or the orange point has a height of 0.5.

## Computing Components

We are now going to derive the formulas for computing the components of our normal map, so get ready for some math.

I am going to simplify the problem of deriving the equations by reducing the function to a single dimension and then generalize it to 2D after we are done.

The diagram below represent a function of a single variable that also map to height values, where height values is on the vertical axis. On this diagram, we draw a normal $\vec{N}$ which is perpendicular to the surface of the function, What I want to to calculate is the $\vec{N_x}$ component of the vector and not the vector itself, so we draw the $\vec{N_x}$ and $\vec{Z_x}$ component of the vector.

![Construction 1](/images/normal-map-generation/construction_1.svg  "Construction 1")

Now, to calculate $N_x$ we could use some trigonometry.

Let the angle between $\vec{N}$ and $\vec{N_x}$ be $\alpha$, then from the triangle formed by $\vec{N}$ and $\vec{N_x}$:

![Construction 2](/images/normal-map-generation/construction_2.svg  "Construction 2")

$$
\begin{equation*}
\cos{\alpha}=\frac{\lVert \vec{N_x} \rVert}{\lVert \vec{N} \rVert}
\end{equation*}
$$

But $\lVert \vec{N} \rVert = 1$ Then :

$$
\begin{equation}
\cos{\alpha} = \lVert \vec{N_x} \rVert \label{2}
\end{equation}
$$

I could then compute the derivative(slope) at that point and get $(\tan{\theta)}$ where $\theta$ is the angle that the tangent line makes with the horizontal axis.

Then the angle between $\vec{N_x}$ and the tangent line would also be $\theta$ because they are alternating angles:

![Construction 3](/images/normal-map-generation/construction_3.svg  "Construction 3")

Since $\vec{N}$ is perpendicular on the tangent line then:

$$
\begin{equation}
\cos{\alpha} = \cos{(90 - \theta)}= \sin{\theta} \label{3}
\end{equation}
$$

Then from $\eqref{2}$ and $\eqref{3}$:

$$
\sin{\theta} = \lVert \vec{N_x} \rVert
$$

At this point, we could just calculate theta from the derivative using the arctangent and then compute the sine from that theta.

$$
\sin{\theta}= \sin{()\arctan{\theta})}
$$

However, to avoid this, we want to find a more direct relation and we can do that using the pythagorean theorem.

$$
\begin{aligned}
{\cos^{2}{\theta}}+{\sin ^{2}{\theta}}&=1 \quad &(\text{Dividing both sides by  } {\sin ^{2} {\theta}}) \\
{\cot ^{2}{\theta}}+1&= {\csc ^{2} {\theta}} \quad &\text{(Taking the reciprocal of both sides)} \\
\frac{1}{\cot^{2} \theta+1} &= \sin ^{2} \theta \\
\sqrt{\frac{1}{\cot^{2} \theta+1}} &= \sin \theta \\
\sqrt{\frac{1}{\tan^{-2} \theta+1}} &= \sin \theta \\
\sqrt{\frac{1}{(\frac{d}{dx})^{-2}+1}} &= \vec{N_x}
\end{aligned}
$$

And there we have it, we have defined $\vec{N_x}$ in terms of only the derivative.

However there is something wrong with our calculation. If you were paying attention, you would have noticed that there is power 2 on the $tan$ which was the variable that tells us which way the $\vec{N_x}$ is pointing (pointing to the negative or positive direction of the x axis) so now we lost the sign and we no longer know which way it is pointing. However this is fairly easy to fix, since the derivative is signed, we can copy the sign from it to our final product, and we can do that very easily by:

$$\begin{equation}
\sqrt{\frac{1}{(\frac{d}{dx})^{-2}+1}} \cdot \frac{\frac{d}{dx}}{\lvert \frac{d}{dx} \rvert} = \vec{N_x} \label{4}
\end{equation}
$$

By doing so, we get our final formula for computing $\vec{N_x}$.

We made it easy for ourselves to get this formula by reducing the dimensions of our function to be one dimensional. When it comes to our original image function which is 2D, all we are going to change is the derivative to be a partial derivation (which is a derivation in higher dimensions, don't worry if you are not familiar with these concepts, we will explain it later). We can follow the same derivation for $\vec{N_y}$ just by changing the x to y and so our final formulas for the $\vec{N_x}$ and $\vec{N_y}$ by using $\eqref{4}$ is:

$$
 \vec{N_x} = \sqrt{\frac{1}{(\frac{\partial F}{\partial x})^{-2}+1}} \cdot \frac{\frac{\partial F}{\partial x}}{\lvert \frac{\partial F}{\partial x} \rvert}\\
 \vec{N_y} = \sqrt{\frac{1}{(\frac{\partial F}{\partial y})^{-2}+1}} \cdot \frac{\frac{\partial F}{\partial y}}{\lvert \frac{\partial F}{\partial y} \rvert}
$$

Now all we have to do is to compute the $\vec{N_z}$ which is very easy to compute, remember that our original vector $\vec{N}$ has a magnitude of 1 which we assumed to get $\eqref{2}$, then :

$$
\sqrt{N_x^2+N_y^2+N_z^2}=1\\
\therefore \vec{N_z} = \sqrt{1-(N_x^2+N_y^2)}
$$

And so the final normal vector components are:

$$\begin{equation}
\boxed{
\vec{N_x} = \sqrt{\frac{1}{(\frac{\partial F}{\partial x})^{-2}+1}} \cdot \frac{\frac{\partial F}{\partial x}}{\lvert \frac{\partial F}{\partial x} \rvert}\\
\vec{N_y} = \sqrt{\frac{1}{(\frac{\partial F}{\partial y})^{-2}+1}} \cdot \frac{\frac{\partial F}{\partial y}}{\lvert \frac{\partial F}{\partial y} \rvert}\\
\vec{N_z} = \sqrt{1-(N_x^2+N_y^2)}
}  \label{5}
\end{equation}
$$

## Computing The Partial Derivation

We have come up with the equations for our vector components and they all depend on two variables, which are $\frac{\partial F}{\partial x}$ and $\frac{\partial F}{\partial y}$.

The partial derivations are used to calculate the slope of the surface $F$ (which is the image) with respect to the axis $x$ and the axis $y$.

Calculating those partial derivations is not like differentiating a nice continuous differentiable function we used to do in school. Our image is a discrete function and thus not continuous and not differentiable and so we have to use some new but easy concepts to calculate the partial derivatives.

Lets study some of these concepts first.

### Forward Finite Difference

Do you remember the formula we used to use in school to calculate the slope of a line by sampling 2 points on it?

$$
\text{Slope} = \frac{\Delta y}{\Delta x} = \frac{y_2 - y_1}{x_2 - x_1}
$$

Well, a discrete function is composed of points (Pixels in our image) and so we could use the previous rule to calculate the partial derivative.

We can write the previous rule in a better form using functions like so:

$$\begin{equation}
\text{Slope} = \frac{F(x+h) - F(x)}{h} \label{6}
\end{equation}
\\
\text{Where h is } x_2 - x_1
$$

It is known that the lower our choice of $h$ the better approximation we would get and since our function is discrete, the lowest possible value of $h$ we can get is $1$ because the nearest pixel to a pixel is the pixel next to it and the difference between their locations is $1$. Then equation $\eqref{6}$ becomes:

$$\begin{equation}
\frac{\partial F}{\partial x} = F(x+1) - F(x) \label{7}
\end{equation}
$$

This tells me that to get the partial derivative at a pixel, all I have to do is to subtract its value $F(x)$ from the value of the pixel next to it $F(x+1)$.

The forward finite difference is usually denoted by:

$$
\Delta_h [f](x)
$$

### Backward Finite Difference

The Backward finite difference is very similar to the forward one, but it sample the point before the point and not the one after it and so equation $\eqref{7}$ becomes:

$$\begin{equation}
\frac{\partial F}{\partial x} = F(x-1) - F(x) \label{8}
\end{equation}
$$

And we usually denote it by:

$$
\nabla_h [f](x)
$$

### Central Finite Difference

The problem about the Forward and Backward difference is that they have a very big error, as the following example illustrate, computing the derivative using both methods produce a very distinct result, they don't even have the same sign!

![Forward vs Backward](/images/normal-map-generation/forward_vs_backward.svg  "Forward vs Backward")

And to solve this problem, Central difference was invented, and it did a great job at approximating the derivative.

Central difference which is usually denoted by $\delta_{h}[f] (x)$ and is defined as:

$$\begin{equation}
\delta_{h}[f](x)=f(x+h)-f(x-h) \label{9}
\end{equation}
$$

This tells me that to compute the derivative of a pixel, I should totally reject its value, and then subtract the previous pixel's value $f(x-h)$ from the next pixel's value $f(x+h)$.

***

Now we know how to approximate $\frac{\partial F}{\partial x}$ and $\frac{\partial F}{\partial y}$ which is all we needed to know to calculate $\vec{N_x}$ and $\vec{N_y}$ using the equations in $\eqref{5}$, So lets open blender and get into implementing our normal map generator!

# Implementation

I needn't tell you how to implement this because you already have the equations and it is pretty much copy and paste. However, I will do it and give you some tips that some people might not know.

### Partial Derivatives

I will first make a function (a node group) that takes an image and return the $\frac{\partial F}{\partial x}$ and $\frac{\partial F}{\partial y}$, and this using the equation $\eqref{9}$:

![Partial Derivatives Function](/images/normal-map-generation/partial_derivative_function.png "Partial Derivatives Function")

To get the value of the pixel next to the pixel I am computing, I translate the the image by -1 in the x axis (Notice that this is the next pixel in the positive direction, the negative sign is there because we are moving the space (image) and not the pixel), to get the pixel on the left, I translate by 1 in the x axis and the same apply for the y derivative.

And by applying the equations from $\eqref{1}$ and $\eqref{5}$ we get our final implementation:

![Compositor Implementation](/images/normal-map-generation/compositor_implementation.png "Compositor Implementation")

I added a value that we multiply to the partial derivatives to increase and decrease the power of the normal map, may be even invert the normal map if negative value.

{% include note.html content="Because of all of these negative powers, you may want to add a very small value to the partial derivatives to avoid zero division errors." %}

That's it, now you have a complete procedural normal map generator that you can use.

***

I think this article is getting a bit long, so I will end it now and make a part 2 another time.
In Part 2, we will look into means of optimizing this setup by using discrete differentiation operators and give an example of usage.

***
***
