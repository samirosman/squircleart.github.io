---
title: Drop Shadow Effect
layout: post
category: Blender
image: "/images/drop-shadow-effect/wall.png"
description: In this tutorial, we are going to learn how to implement a drop shadow and inner shadow effects in blender. Our implementation will be very easy and very similar to photoshop's one.
---

Sometime last year, I published this [product](https://blendermarket.com/products/drop-shadow-and-inner-shadow) and I think it is time you know how I created it.

## Ambient Shadows

I have this round rectangle from my previouse [post](https://squircleart.github.io/shading/introduction-to-mathematical-drawing.html) and I want to drop some shadow from it.

![Shape](/images/drop-shadow-effect/shape.png)

By inverting the colors so that the interior of the shape is black and then bluring it, I get a simple ambient shadows. Then I add the original shape to the shadow to make the interior white again. (Because we can't see the shadows that are directly under the shape)

![Ambient Shadow](/images/drop-shadow-effect/ambient_shadow.png)

By making a colored version of the shape and multiplying the shadow to it, I get some good looking flat icon.

![Ambient Shadow 2](/images/drop-shadow-effect/ambient_shadow2.png)

## Key Shadow

Another type of shadow is the shadows where directional lights are presents, in this case, the shadow is more protruting to the outside in the direction away from the light. Lets implement that.

It turns out, if we just moved the shadow image, we could achieve a key shadow:

![key Shadow](/images/drop-shadow-effect/key_shadow.png)

However, I want a better system to control the direction of the light or shadow. So lets describe the translation in terms of a polar angle and a norm. We are just changing how the user will input data, instead of inputting x, y values, we input an angle and an amount of translation in the direction of that angle. The conversion can be easily done by the following equation:

$$

x = \alpha \cos{\theta}\\
y = \alpha \sin{\theta} \\

$$

Where $\theta$ is the polar angle or the direction of the light and $\alpha$ is how much we translate by. (In physical world, $\alpha$ is the height of the light from the shape, think about it.)

![key Shadow 2](/images/drop-shadow-effect/key_shadow2.png)

One can use an **Erode** node to make the shadow more spread.

![key Shadow 3](/images/drop-shadow-effect/key_shadow3.png)

If you want to use both ambient and key, just multiply them. From all we learned, our final optimized node tree will be:

![key Shadow 4](/images/drop-shadow-effect/key_shadow4.png)

Where the size of the blur node is the blur radius, the two value nodes are the angle and magnitude of the light translation vector.

## Inner Shadow

Inner shadow is exactly the same as the drop shadow effect, except we will be using the shape directnly and not invert it. Because inner shadow simulate a hole in a platform, the shadows will be under the platform and not the hole.

![Inner Shadow](/images/drop-shadow-effect/inner_shadow.png)

Notice that all we did was switching the roles of the original and inverted images. Trying that we get:

![Inner Shadow 2](/images/drop-shadow-effect/inner_shadow2.png)

Neat ! And that's it, I don't think there is more to be done.
