---
title: Introduction To Mathematical Drawing
layout: post
category: Shading
image: "/images/introduction-to-mathematical-drawing/wall.png"
description: We previously learned how to plot function to generate shapes provided
  we have the equation for it. In this tutorial, we are going to learn to create our
  own functions to draw shapes and patterns.
---

We previously learned how to plot function to generate shapes provided we have the equation for it. In this tutorial, we are going to learn to create our own functions to draw shapes and patterns.

It is recommend that you read [Introduction To Texture Mapping](https://squircleart.github.io/shading/introduction-to-texture-mapping.html) , [Value Remapping](https://squircleart.github.io/math/value-remapping.html) and  [Introduction To Functions Plotting](https://squircleart.github.io/shading/introduction-to-functions-plotting.html) first because this post highly depend on it.

## Generating Heart Function

![Heart](/images/introduction-to-mathematical-drawing/heart.svg)

A heart is a famous curve and it makes a perfect example for us because it has sharp corners, round edges and pinches. There are multiple ways to do this and usually you have two approaches to solve this problem:

1. Combine multiple simple known functions. For instance, one might notice that the top half of the heart is two circles and the lower half is a triangle with some slight deformation, since we know the equations of circles and triangles, we could compute every one separatly and then combine them. This is the easier approach and it is not the most efficient so we are not going to use it.
2. Find the closest known shape to you and iteratively deform it till you get the desired shape. For instance, the heart is kinda round, so I choose the closest shape I know, for me it is a circle, I then notice that the top middle of the heart is indented inward so I somehow deform the circle in order to get the indentation and so on. This is the most efficient method but also the hardest. Artists may love this method because it is just about creative thinking.

So lets start making the heart using the second approach !

### Step 1

Find the closest known shape to you. I know multiple shapes that can come in handy, but let us use a circle. You should know the implicit function of the circle by now.

![Step1](/images/introduction-to-mathematical-drawing/step1.png)

Ok, step one was very easy, lets move on.

### Step 2

Create the upper indentation. Those deformation in functions can be done by distorting the coordinates plane of our drawing. We know that in order to translate a point, we have to add a vector to it, well, the indentation can be made by translating the points in the middle a bit downward (Or possibly translate the surrounding upward), that is, for the later, we should subtract from the y coordinates an $f(x)$ that is small as $x$ is small and gradually increases. Well, we are describing the most known function in the universe, it is $f(x)=x$, as $x$ increases $f(x)$ increases. However,  negative $x$ would render $f(x)$ negative as well which would render our subtraction an addition, and our points will move in the other direction and our heart is symmetrical so we don't want that. To fix this, we have to make sure $f(x)$ is always positive, and I happened to know the function that guarantee this, it is $f(x)=\vert x \vert$. Now, we want to have some more control over this function, we want to define how much we translate by, so lets introduce a scalar $\alpha$ that defines the slope of the linear function we have, that is, $f(x)= \alpha \vert x \vert$. So lets try this out.

![Step2](/images/introduction-to-mathematical-drawing/step2.png)

Lucky we are, the lower part moved up as well creating a sharp corner. If we didn't want this to happen, we would have tuned down the values of the lower part so that it doesn't get affected as well. Notice that I added some value at the end to translate the whole heart down just to center it.

### Step 3

We said that our second approach is iterative, so we have to constantly improve what we did in the previous step. The biggest problem I want to solve is the non roundness of the upper part of the heart. Since our equation was linear, the result isn't too round. To fix this, we have to edit our equation a bit to make it more smooth and not so linear. What do you think? How should we handle this? I happened to know a function that takes a linear function and makes it round, that function is the square root !

![Square Root](/images/introduction-to-mathematical-drawing/square_root.svg)

$f(x) = x$ is displayed in blue and $f(x)= \sqrt{x}$ is displayed in red. Notice that square root function is not real at negative domain, so we should always put it after the absolute value function, we want it to be symetrical anyway. Trying that we get.

![Step 3](/images/introduction-to-mathematical-drawing/step3.png)

Look how it started to take a heart shape! I am generally satisfied with the result, I don't know what else to be done. May be we can scale it down a bit in $y$.

### Step 4

Scalling is multiplication, so lets scale the heart in $y$ by multiplying it by $1.15$ for instance.

![Step 4](/images/introduction-to-mathematical-drawing/step4.png)

Now I think it is perfect ! Our final equation will be:

$$

x^2+( 1.15(y - 0.6 \sqrt{\vert x \vert})+0.2 ) - 0.65 = 0

$$

## Generating A Round Rectangle

Lets say we want to draw a round rectangle to act as a button in a UI we are making. We want to come up with a function that describe the round rectangle.

One might use the Squircle equation which is just the circle equation but its powers are 4s instead of 2s. A generalization for the circles and squircles is called the **Superellipse** which is defined as:

$$

\left \vert {\frac {x}{a}}\right \vert ^{n}+\left \vert {\frac {y}{b}}\right \vert ^{n}=1,

$$

Where $a$, $b$ are scalling factors for the superellipse and $n$ is a positive number. Try to plot a squircle and you will notice that it doesn't look nice, it is not a really a round corner rectangle. So lets find a real function that describe it.

### Step 1

Find the closest known shape. Well, since my corners are actually quarters of a circle, then I will say the closest shape I know is the circle. Notice that I didn't choose a rectangle because it is hard to round sharp edges but it is not hard to sharpen round edges. So I draw a circle.

![2 Step1](/images/introduction-to-mathematical-drawing/2step1.png)

Notice that I haven't use any inequality operation yet because I want you to observe what happens to the distance field we have as we proceed.

### Step 2

This step and the next one may be hard to grasp at first, but it can be understood and used in the future as an essential technique of drawing. I am going to absolute the $x$ and $y$ coordinates, this doesn't change anything because $x^2 = \vert x^2 \vert$.

![2 Step2a](/images/introduction-to-mathematical-drawing/2step2a.png)

Now I am going to subtract some value from it.

![2 Step2b](/images/introduction-to-mathematical-drawing/2step2b.png)

Lets assume that our circle was of radius $0.5$ then (before doing what we just did) the point that belonged to the circle that had the highest $y$ value is the point at location $(0, 0.5)$, a round rectangle would have the same value as this point for every point that belong to the upper edge of it including the end points of that line which was the original point with the highest $y$ value before the circle split into four. What we did is making sure that every point in that upper edge has the same value as the original point. The value we subtracted is simply the length of the edge. And the same apply for the rest of the edges where edges at the right and left are a result of the subtraction in the $y$ axis and not the $x$. Lets try this then.

![2 Step2c](/images/introduction-to-mathematical-drawing/2step2c.png)

This doesn't look good, why is resulted values different even though we saw they were all black? lets fix that in the next step.

### Step 3

When we subtracted some values became negative but they were rendered black anyway, what we have to do is to make sure negative values are replaced with zero. This can be done by the clamp option or a maximum operation. So lets check clamp.

![2 Step3](/images/introduction-to-mathematical-drawing/2step3.png)

And so, the radius of the corners is the radius of the circle, the length of the horizontal edges is controled by the subtraction in the $x$ and the vertical edges in $y$.

And our final equation becomes:

$$

(\text{max}(\vert x \vert- l_1, 0))^2-(\text{max}(\vert y \vert- l_2, 0))^2-r^2=0

$$

Where $r$ is the radius and $l_1, l_2$ are the horizontal and vertical lengths respectively.

In a future tutorial, I am going to tell you how we can do some shading for that shape to make a UI ready button.

## Generating Waves

Lets make a cartoon looking waves. Following the steps as before.

### Step 1

I will first create a rectangle which will act as the base for my sea of wave.

![3 Step1](/images/introduction-to-mathematical-drawing/3step1.png)

### Step 2

Waves are just alternating an upward displacement and an inward displacement. So we will need a function that describe this repeated displacement and add it to our coordinates plane.

The function we want is just the modulo arithmetic which we use multiple times before so no need to explain it.

![3 Step2a](/images/introduction-to-mathematical-drawing/3step2a.png)

Adding this function to our rectangles gives:

![3 Step2b](/images/introduction-to-mathematical-drawing/3step2b.png)

Which is too sharp for a wave.

### Step 3

We previously used a technique that can smooth those sharp edges, that ism using a square root function:

![3 Step3a](/images/introduction-to-mathematical-drawing/3step3a.png)

But this gives some bad results. So, I want to tell you about another function that we can use for smoothing. This awesome function renders a linear function smooth as a circle (literally), you probably know it by now. It is the function:

$$

\sqrt{1-x^2}

$$

or you might know it by this form:

$$

\sin^2{\theta} = {\sqrt{1-\cos^2{\theta}}}

$$

If you know your unit circle then you would know that $\sin{\theta}$ is the $y$ location of the point at angle $\theta$ while it have an $x$ location of $\cos{\theta}$. What we did is relating both of them using the pythagorean trigonometric identity getting the equation above. Of course our domain has to be relevant to the identity being $x \in [0, \pi/2]$. Appling the equation above with the right domain gives:

![3 Step3b](/images/introduction-to-mathematical-drawing/3step3b.png)

***

So far we have been adding values to deform shapes but we could do some other stuff like multiplying them or possibly both.

## Generating Spiky Circle

To demonstrate multiplication, lets look at the example where we want to generate a spiky circle.

### Step 1

Start with a circle !

### Step 2

Spikes are much like the waves we did, but they are radially distributed, so we shall use another coordinate system, that is, the polar coordinates. Applying the modulo function to the angle of the polar system instead of the $x$ of the rectangular coordinates would yield:

![4 Step1a](/images/introduction-to-mathematical-drawing/4step1a.png)

Ok, we previously added that to our function, thats because translation happens along the $y$ axix which is the fundumental axis of the space, so of course it worn't work in polar, we could convert our translation from rectangular to polar coordinates (which I will show you at the end) or we could use multiplication. Multiplication happens relative to the origin of the same which is the center of the circle, so our translations will happen along the vector going from the point to the center of the circle which is what we want. Lets try that.

![4 Step1a](/images/introduction-to-mathematical-drawing/4step1b.png)

Notice that before multiplying, I remaped the values to another smaller interval closer to zero. Because in addition, zero is the additive idenity while in multiplication, one is the multiplicative identity so I want values to range around one not zero.

### Step 2 (Alternative Method)

Our initial step 2 made use of multiplication in rectangular coordinates. Another method would make use of the polar system. A circle in polar system have a constant $r$ for every $\theta$, what we can do is slightly edit $r$ based on $\theta$. We already have the $\theta$ function so lets just use it as $r$.

![4 Step1a](/images/introduction-to-mathematical-drawing/4step1b2.png)

Nice results we got here. Initial method can be reproduced by remapping the $\theta$ function.

I hope you learned something today. I think it is time to end this post and carry on in another. Stay tuned.