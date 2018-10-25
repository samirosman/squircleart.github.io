---
title: Normal Map Generation
layout: post
image: "/images/normal-map-generation/wall.png"
description: In this tutorial, we shall understand what a normal map is, derive a
  formula to calculate it from a height function and implement what we learned in
  a small normal map generator for blender.
category: Shading
prerequisites:
- text: Good knowledge of mathematics.
---

Normal maps are essential in the workflow of artists and it is used in a lot of applications especially in the making of game assets, normal maps also have some interesting application that nobody is aware of, or at least not directly.

In this tutorial, we will be looking at means of generating normal maps from height maps, displacement maps or just normal images from the internet. We will learn the concepts of discrete differentiation which we will use to implement our normal map generator, the implementation will be done in blender's compositor and Animation Nodes, but they are very easy to implement anywhere else, so lets get started !

# What Are Normal Maps?

You are probably familiar with normal maps and have used it before, but you may not know what it actually represent or how it work so we will study how they work now.

Normal maps are used to detailing models without having to add more polygons and this is done by altering the rendering workflow and get the render engine into thinking that we have more polygons while in fact we don't.

#### A more formal way to say this is as follows:

The render engine uses triangles' normals in the "formulas" of shading and to add more detailed shading we have to add more triangles and thus more normals.

When a normal map is used, the render engine takes normals from each pixel of the normal map instead of taking it from the triangles of the object , that is of course after the normal map is projected into the surface. So now we can add much more normal information per triangle.

#### Here is an example to understand this better:

I have an object with some triangles and I am applying basic lambertian shading (direct diffuse), the render engine will get the normal for each triangle and compute its color by a simple formula which obviously include normals as a variable.

![Polygons Normals](/images/normal-map-generation/triangle_normals.png  "Polygons Normals")

Now suppose I want to add a circle in the object, I could just add couple more triangles, but then game developers will complain;  because "we increased the poly count and slowed their game" and modelers will complain; because "Now they have to spend more time in editing the topology and adding the circle".

A shading artist will come to the rescue and say that he got us covered, he will make a normal map which include the normal information the render engine need to shade a circle in the object.

And that is what a normal map does, it provide information about normals per pixel and not per triangle and thus allowing more small details to be implemented without too much slow down in games and without more hours spent in modeling or sculpting this details.

![Polygons Normals + Normal Map](/images/normal-map-generation/triangle_normals+normal_map.png  "Polygons Normals + Normal Map")

## Types Of Normal Maps:

There is multiple types of normal maps which are the same in the way that each defines the normals of the shading point but different in the method of doing so.

### World Space Normal Map:

![World Space Normal Map](/images/normal-map-generation/world_space_normal_map.png  "World Space Normal Map")

You can instantly identify this kind of normal map because of its wide range of colors. This normal map is the most basic one, it just tell the render engine where the normals are pointing in the world space and we will see how it does that in a moment.

This kind is faster in rendering because it is straightforward at defining normals compared to the other types, however it has some disadvantages.

Since the normals are defined in the world space, then if the objects rotate, the normals will be pointing in the wrong direction and thus result in an unexpected results especially for directional shading. And because of this, world space normal maps are used only for static object which does not rotate and transform, like buildings in games.

There exist another very similar normal map type called the **Object Space Normal Map** and it simply defines the normals in the local space of the object, so it is better used in objects that transfroms but not deforms.

### Tangent Space Normal Maps:

![Tangent Space Normal Map](/images/normal-map-generation/tangent_space_normal_map.png  "Tangent Space Normal Map")[^1]

[^1]: Normal map image from [Knald](https://docs.knaldtech.com/doku.php?id=normal_maps_knald)

This is probably the map you are familiar with because it the most widely used one.

Tangent Space normal maps define normals relative to the original normal of the triangle, so they don't really define the normal of the shading point rather they rotate the original normal to get the desired normal. That give them the advantage over world space normal maps because they are dynamic, that is, they are not affected by the orientation of the triangles so you can use them in deforming objects like characters.

Now, enough of that, lets get into the point of the tutorial and generate the maps. But to do so, we have to learn how normals---which are vectors are encoded in images---Which is composed of colors.

## Normal Maps Components

A normal is a 3D unit vector. A unit vector because we only care about the direction of that vector and not its magnitude and unit vectors are easier to deal with in calculations.

A 3D vector has 3 components $X$, $Y$ and $Z$ and since image's pixels have 3 channels $R$, $G$ and $B$ we can just go ahead and put the $X$ component in the $R$ channel, $Y$ in $G$ channel and $Z$ in $B$ channel. There is some limitation however in what we just did, a 3D vector can have negative values while images can't and so all our negative values will be clamped and become zeroes. To overcome this limitation, we just compress the positive and negative values into the positive interval $[0,1]$ and this mapping can be done easily by this simple formula:

$$\begin{equation} R = \frac{(\vec{N}_x+1)}{2}\\G = \frac{(\vec{N}_y+1)}{2}\\\label{1} \end{equation}$$

The $Z$ component is always positive because this is a tangent space normal map. So we can encode it directly in the blue channel.

{%include note.html content="Our vector's components can never exceed 1 because they are normalized and thats why I knew which maximum and minimum values to use in my mapping function which are 1,-1."%}

So it is obvious that a vector which point in the original normal direction have the color $(0.5,0.5,1)$ which is zeros in both X and Y and 1 in the Z direction. Recall that the Z axis is aligned with the original normal of the surface so a vector such as the one we just saw is actually the original normal itself without any offset. That is probably why you see tangent space normal maps blueish, because most normal maps are generally pointing in the same direction as the original normal with some small to medium offset in the other 2 axis.

Here is the individual components of the normal map shown above where you can see its $X,Y,Z$ components in order.

![Normal Components](/images/normal-map-generation/normal_components.png  "Normal Components")

Take your time looking at this image and try to figure out what it represents, a white color in the first image represent a vector that is pointing greatly toward the positive x direction while a black color represent a vector pointing in the negative x direction, grey color on the other hand tells us that the vector is neither pointing in the positive or negative x direction (remember that a grey color represents zero in the real scale). The same apply for Y direction of the second image. It is also worth noting that the points in the z component (last image) are mostly white because if you remember correctly, we said that the normal map vectors are generally pointing in the same direction as the original normal. A grey colored points however in the z component is where the other 2 components have a stronger values because the vector is normalized and increasing a component will decrease the others.

Ok, great, now we know what we are supposed to calculate in order to generate a normal map. Let's get into generating it.

# Generating Normal Maps

I have talked about the output but said nothing about the input or the information we have in order to generate the normal map. Generally, we will be making a converter that convert a height map into a normal map. Generating normal maps from colored texture maps does in fact follow the same process of converting a height into normal, that is, the color map is first converted into a greyscale image and then treated as a height map. This is how all normal map generators work, they only differ in the algorithm used to convert color maps to greyscale maps, one can actually find a smart way to convert colors into greyscale based on the the color information and not only the luminosity of the pixel. I won't have anything to do with the color to greyscale conversion in this tutorial because of a simple reason:

> The generation of normal maps from colored images is a cheap pure approximation and I believe that manual conversion is the best option either by image processing or by painting a height map from scratch using the color map as a reference. In fact, height to normal conversion is also an approximation but it a pretty good one and can be relied on. (We will look into methods of decreasing the error in the approximation further on)

## Height Map

In maths, we define a height map as a function $f:R^2 \longrightarrow R$ that describe a surface in $R^3$. Which means that I have a 2d discrete space with a function that map every point in that space to a value that we call the height of that point and we can represent this function in a 3D space as a surface. And so a height map like this distance voronoi diagram which we will be using as an example through out the rest of the tutorial:

![Voronoi](/images/normal-map-generation/Voronoi.png  "Voronoi")

Is represented by the surface:

![Voronoi Surface](/images/normal-map-generation/Voronoi_surface.png  "Voronoi Surface")

As you can see, for every point in $R^2$ we have a value $h$ which represent its position in the $Z$ direction. The point $(2,2)$ or the blue point has a height of 0.2 while the point $(12,11)$ or the orange point has a height of 0.5.

## Computing Normal

To compute a vector that is perpendicular to a surface, all we have to do is get two non-parallel tanget lines to the surface at a point. A tanget line to the surface at a point is a line that touchs the surface at that point. Since a line can be defined by a direction (vector) and a point and since the line touches the surface at a point, then we know our point and can exclusively describe that line by just a vector called the **Tangential Vector**. A good choice for our tangential vectors are the vectors on the $xz$ and $yz$ planes because calculus provide us with easy ways to compute them. The normal is then the cross product of those two vectors normalized.

We can define the vectors as:

$$

\vec{V_{1}} = \begin{bmatrix} 1 \\ 0 \\  \frac{\partial F}{\partial x} \end{bmatrix} \\
\vec{V_{2}} = \begin{bmatrix} 0 \\ 1 \\  \frac{\partial F}{\partial y} \end{bmatrix}

$$

The $\frac{\partial F}{\partial x}$ is called the partial derivative of $F$ with respect to $x$ and is just the slope along the $x$ axis. The $\frac{\partial F}{\partial y}$ is called the partial derivative of $F$ with respect to $y$ and is just the slope along the $y$ axis. We will compute both of them in a moment.

The normal is then equal to:

$$

\vec{V_{1}}  \times \vec{V_{2}} =
\begin{vmatrix}
i & j & k \\
1 & 0 & \frac{\partial F}{\partial x} \\
0 & 1 & \frac{\partial F}{\partial y}
\end{vmatrix} = \begin{bmatrix} -\frac{\partial F}{\partial x} \\ -\frac{\partial F}{\partial y} \\ 1 \end{bmatrix}

$$

Where $i, j, k$ are the fundemental vectors of the space.

By normalizing that, we get the final equation:

{% raw %}
$$\begin{equation}
\boxed{
\vec{N_x} = \frac{-\frac{\partial F}{\partial x}}{\sqrt{{\frac{\partial F}{\partial x}}^2 + {\frac{\partial F}{\partial y}}^2 +1 }} \\
\vec{N_y} = \frac{-\frac{\partial F}{\partial y}}{\sqrt{{\frac{\partial F}{\partial x}}^2 + {\frac{\partial F}{\partial y}}^2 +1 }}\\
\vec{N_z} = \frac{1}{\sqrt{{\frac{\partial F}{\partial x}}^2 + {\frac{\partial F}{\partial y}}^2 +1 }}
}  \label{5}
\end{equation}
$$
{% endraw %}


## Computing The Partial Derivative

We have come up with the equations for our vector components and they all depend on two variables, which are $\frac{\partial F}{\partial x}$ and $\frac{\partial F}{\partial y}$.

The partial derivatives are used to calculate the slope of the surface $F$ (which is the image) with respect to the axis $x$ and the axis $y$.

Calculating those partial derivatives is not like differentiating a nice continuous differentiable function we used to do in school. Our image is a discrete function and thus not continuous and not differentiable and so we have to use some new but easy concepts to calculate the partial derivatives.

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

I will first make a function (a node group) that takes an image and return the $-\frac{\partial F}{\partial x}$ and $-\frac{\partial F}{\partial y}$, and this using the equation $\eqref{9}$:

![Partial Derivatives Function](/images/normal-map-generation/partial_derivative_function.png "Partial Derivatives Function")

To get the value of the pixel next to the pixel I am computing, I translate the the image by -1 in the x axis (Notice that this is the next pixel in the positive direction, the negative sign is there because we are moving the space (image) and not the pixel), to get the pixel on the left, I translate by 1 in the x axis and the same apply for the y derivative.

And by applying the equations from $\eqref{1}$ and $\eqref{5}$ we get our final implementation, which I will not show because it is just applying the equations. You might want to multiply the partial derivatives by some scalar for artistic control.

That's it, now you have a complete procedural normal map generator that you can use.

***
