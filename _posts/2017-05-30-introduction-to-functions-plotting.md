---
title: Introduction To Functions Plotting
layout: post
category: Shading
image: "/images/introduction-to-functions-plotting/wall.png"
description: Procedural drawing and texturing is all about plotting and editing mathematical functions, in this tutorial, we are going to learn how to plot all sorts of mathematical functions in blender.
---

We will be using concepts learned in the [Introduction To Texture Mapping](https://squircleart.github.io/shading/introduction-to-texture-mapping.html) and [Value Remapping](https://squircleart.github.io/math/value-remapping.html) posts, so make sure you understand them first.

## Explicit Functions

An explicit function is just a single variable function as:

$$

y = f(x)

$$

Where $f(x)$ is any expression that include the variable $x$ such as $x^2, \sin{x}, \log{x}$. We basically want to plot that function on a 2D space which is usually an image, when I say that I want to plot the function $y=x^2$, then I want to color all the pixels that their $y$ location is equal to square their $x$ location. The previous equation can be written in an implicit form as $x^2-y=0$ and I say I want to color all the pixels that square their $x$ location minus their $y$ location is equal to zero.  Let us look at this equation applied:

![Example 1](/images/introduction-to-functions-plotting/example1.png)

Notice that I got absolute the result so that you can see the zero line clearly. You may already see the parabola as the pixels with values equal to zero, this zero line is sometimes called the **Isoline** which is the line formed from the points in space that satisfy the relation. We also notice that pixels that are closer to that line have low values and pixels that are further away have larger values so we may define the values of the pixels as the distance to the isoline (This however is wrong and will be discussed later on).

So in order to get the actual line and not the "field" you see above, we basically sample the pixels with values equal to zero, however this won't work, to see why, look at the following plots for the function $y=x$:

![Visualization](/images/introduction-to-functions-plotting/visualization.svg)

In the above plots we color the pixels that their $x$ location is equal to their $y$ location red, each plot is plotted in an image with different resolution. The first image is $4 \times 4$ and we can see the isoline clearly, the second is $5 \times 5$ and we can still see the isoline clearly, the third is $8 \times 8$ and we can see the isoline but it got smaller, and as we increase the resolution of the image, the isoline becomes smaller and smaller till we can no longer see it. That problem amplifies even more when a non linear function such as $x^2$ is used because it may result in values that are not in the domain of the image, for instance, if the pixel had an $x$ location of $0.1$ and the the image was $10 \times 10$, $y$ will be $0.01$ and it is not in the domain of the $10 \times 10$ image.

In order to solve such problem, we include values that are not that far from the isoline as well, resulting in a thicker line:

![Example 2](/images/introduction-to-functions-plotting/example2.png)

Since there is an absolute value node and a less than value node, then all the pixels that satisfy the inequality $x^2-y<\epsilon$ where $\epsilon$ is an arbitrary small value that define the thickness of the line are colored white.

However, we notice that the line is more thick when $x$ is smaller and it gets thiner as $x$ increases. This is because the rate of change of $y$ is not constant and so some values converge to the isoline faster than other. This can be analysed by computing the first derivative of the function which is $\frac{d}{dx} x^2=2x$ and it tells me that the rate of change of the values is double the value of $x$ and thats why the larger the $x$ gets the quicker the value converge to the isoline and the thiner the line gets.

To solve this problem, it was proposed that we compute the actual distance to the isoline resulting in a distance field, then we use the $<\epsilon$ as we did before. This was proposed by the awesome Inigo Quilez in his article [Distance Estimation To Implicits](http://iquilezles.org/www/articles/distance/distance.htm) where he derived an equation to estimate the distances to the isoline. For 1D functions like the ones we are using now, the implicit distance function is as follow:

$$

d(x,y) = \frac{\vert f(x) - y \vert}{\sqrt{1+ f^\prime (x)^2}}

$$

The numerator is the implicit function we used before, the only unknown is the $f^\prime (x)$ which is the first derivative of the function. Given the function $x^2$ its distance function will be:

$$

d(x,y) = \frac{\vert x^2 - y \vert}{\sqrt{1+ (2x)^2}}

$$

And using it to plot will produce the following result:

![Example 3](/images/introduction-to-functions-plotting/example3.png)

Look how nice this uniform thickness parabola is.

Lets look at another example which is the function $y=\sin{x}$, its derivative is $\cos{x}$ so its distance estimation function is:

$$

d(x,y) = \frac{\vert \cos {x} - y \vert}{\sqrt{1+ (\sin {x})^2}}

$$

![Example 4](/images/introduction-to-functions-plotting/example4.png)

### Big Epsilon Errors

 It should be noted that $\epsilon$ should not be too large because it was assumed to be small in the derivation of the distance estimation function. Here is the function $e^x$ plotted with small and high epsilon to demonstrate the effect of high epsilons:

 ![High Epsilon](/images/introduction-to-functions-plotting/high_epsilon.gif)

 Some functions are affected more than other because of their nature, so you can always experiment and determine the limit for the epsilon value.

## Implicit Functions

A 2D implicit function is a function $f(x,y)=0$ and it is the most widely used function ever. An example for such function is the implicit function of a circle at the center with radius 1  $x^2+y^2-1=0$. It should be noted that explicit functions can be expressed implicitly as we did above but not every implicit function can be expressed explicitly, notice that such function can not be expressed explicitly because of the square on both $x$ and $y$ which translate to ambiguity in the sign of the variable. So lets look at the plot of that function:

![Example 5](/images/introduction-to-functions-plotting/example5.png)

We instantly see the isoline as a circle. In fact one should note that the resulted field is in fact square the distance to the isoline because the equation of the distance from the center to some other point is $\sqrt{x^2+y^2}$ which is simply our implicit equation without the square root. So we don't actually have to do anything to make the isoline uniform in thickness, and the resulted plot is as follows:

![Example 6](/images/introduction-to-functions-plotting/example6.png)

Now lets look at more complicated function which is an implicit function of a heart:

$$

x^2+\left(\frac{5y}{4}-\sqrt{|x|}\right)^2-1.3= 0

$$

When applied it produce such field:

![Example 7](/images/introduction-to-functions-plotting/example7.png)

You can clearly see the heart through the isoline, but if we attempted to generate a line out of this, we would get non uniform thickness. So we use the technique describe in the Distance Estimation article again, in the case of such implicit function, the distance estimation function is defined as:

$$

d(x, y)=\frac{\vert f(x) \vert}{\vert \nabla f(x) \vert}

$$

Simply it tells us to divide absolute the function by the magnitude of the gradient of the function.  The gradient of the function denoted by $\nabla f(x)$ is the sum of the partial derivative of the function $(\frac{\partial{f}}{\partial{x}}i+\frac{\partial{f}}{\partial{y}}j)$ where $i,j$ are the fundamental vectors of the space. And the magnitude of that gradient is equal to $\sqrt{(\frac{\partial{f}}{\partial{x}})^2+(\frac{\partial{f}}{\partial{y}})^2}$ so our equation becomes:

$$

d(x, y)=\frac{\vert f(x) \vert}{\sqrt{(\frac{\partial{f}}{\partial{x}})^2+(\frac{\partial{f}}{\partial{y}})^2}}

$$

Ok, so lets compute the partial derivatives of the equation of the heart:

$$

\frac{\partial f}{\partial x} = 2x - \frac{x(1.25y- \sqrt{\vert x \vert})}{\vert x \vert ^\frac{3}{2}}\\
\frac{\partial f}{\partial y} = 2.5(1.25y - \sqrt{\vert x \vert})

$$

And by substituting $\frac{\partial f}{\partial x}$ and $\frac{\partial f}{\partial y}$ in the distance estimation equation we get our heart:

![Example 8](/images/introduction-to-functions-plotting/example8.png)

Notice that a high $\epsilon$ would cause big problems in the middle and thats because of the nature of the equation of the heart.

## Polar Equations

So far we have been dealing with rectangular coordinates, now we are going to plot in polar coordinates. A polar equation is something like $r = \sin(\theta)$ which is in explicit form, we can also define polar equations implicitly such as this:

$$

f(r, \theta) = r- \frac{\sin{3 \theta+2r^2}}{2}

$$

We are going to plot it in rectangular coordinates by converting it to rectangular first. One can easily convert between the polar implicit equation and a rectangular implicit equation by replacing the $r$ with $\sqrt{x^2+y^2}$ and $\theta$ by $\arctan{\frac{y}{x}}$, so lets try to plot this equation .... wait, blender doesn't have a signed arctangent operator, developers though it would be a good idea to leave input B in the math node free instead of using it to make an atan2 operator (Ridiculous !) . So we have to compute arctangent manually using this equation:

$$

\text {atan2} (y,x)={\begin{cases}\arctan \left({\frac {y}{x}}\right)&{\text{if }}x>0,\\
{\frac {\pi }{2}}-\arctan \left({\frac {x}{y}}\right)&{\text{if }}y>0,\\
-{\frac {\pi }{2}}-\arctan \left({\frac {x}{y}}\right)&{\text{if }}y<0,\\
\arctan \left({\frac {y}{x}}\right)\pm \pi &{\text{if }}x<0,\\
{\text{undefined}}&{\text{if }}x=0{\text{ and }}y=0.\end{cases}}

$$

Actually, we don't, blender already computed this equation in another node which is the gradient node in the radial option only it was divided by $2\pi$ so we have to multiply it by $2\pi$ again. Ok, lets plot this function:

![Example 9](/images/introduction-to-functions-plotting/example9.png)

And of course, this won't have uniform thickness so we have to use that distance estimation function again. However, instead of computing the gradients ourselves, I want to show you another method, we are going to use a numerical approximation which we discussed in the [Normal Map Generation](https://squircleart.github.io/shading/normal-map-generation.html#computing-the-partial-derivation) post. So we group our function and use the central finite difference method to evaluate the partial derivatives.

![Example 10](/images/introduction-to-functions-plotting/example10.png)

This is of course an approximation which is less accurate than computing the actual gradient however it skip us the process of differentiating big functions.

You are now familiar with the most important types of functions and know how to plot them, next posts will be on how we can make our own function in order to draw whatever we want using maths, stay tuned.
