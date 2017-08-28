---
title: Procedural Bookshelf In Animation Nodes
layout: post
category: Animation-Nodes
image: "/images/procedural-bookshelves-in-animation-nodes/wall.png"
description: In this tutorial we shall learn how to make bookshelves procedurally
  in Animation Nodes. We will come up with an algorithm to stack books randomly then
  implement it in Animation Nodes.
prerequisites:
- text: Good Knowledge Of Animation Nodes.
- text: Considerably Good Knowledge Of Trigonometry.
---

High level procedural modeling systems can be created by dynamically instancing, replicating and transforming simple assets to create bigger more sophisticated assets. So the first first step is always to make your assets, in our case, it is **shelves** and **books**.

![Assets](/images/procedural-bookshelves-in-animation-nodes/assets.png)

Shelves are just cuboids so instead, I add their unit primitive which is a cube and scale it as I please in our algorithm to make cuboids.

## Books

### Algorithm

Creating books will require just a bit of math, so get ready for some construction. Here is one possible combination for books stacking to use as an observation material:

![Books 1](/images/procedural-bookshelves-in-animation-nodes/books1.svg)

We notice that each books is either standing or leaning on the one next to it, the ones that are leaning makes an angle $\alpha$ with the shelf and we can divide them into two categories:

1. $\alpha$ of the book is less than $\alpha$ of the next book as the red book. In that case, you will notice that the top of the first book doesn't touch the second book but the bottom of the second book touches the first book. Look at the red and green books to see what I mean.
2. $\alpha$ of the book is more than $\alpha$ of the next book as in the green book. In that case, you will notice that the top of the first book is touching the second book and the the bottom of the second book doesn't touch the the first book.

From that, it is clear what our algorithm is suppose to do:

- For each book:
	1. Choose a random angle $\alpha$ that ranges between $\delta$ and $\frac{\pi}{2}$ where $\delta$ is some arbitrary value that define a static friction coefficient. Notice that I said arbitrary because it really isn't a real coefficient since it depend on both the angle of the book and the one next to it (Which we still haven't computed).
	2. Compute the location of the book along the axis of the shelf from the angle $\alpha$, the angle of the previous book $\theta$ and thickness of the book $\lambda$.

For easier construction we will assume that the shelf is aligned with the x axis and define books' locations as scalars (x locations).

We have $\alpha$, $\theta$, $\lambda$ and $x$ where $x$ is the x location of the previous book. We need to come up with an equation that describe the location of the book in terms of the previously mentioned variables. Lets look at a close up of the green book:

![Books 2](/images/procedural-bookshelves-in-animation-nodes/books2.svg)

Notice that the origin of the book is at the bottom right. Then the location of the second book is equal to $x + d$ where $d$ is the distance between the origins of the books. So all we need to do is to compute $d$.

We remember the **Law of sines** that states:

$$

\frac{\sin{\theta}}{\lambda} = \frac{\sin{\epsilon}}{d}

$$

Then:

$$


d = \frac{\lambda \: {\sin{\epsilon}}}{\sin{\theta}}

$$

But $\epsilon = 180-((90-\alpha)+\theta)$. That is because the green book's corner is a right angle.

Then:

$$

\begin{aligned}
d &= \frac{\lambda \: {\sin{(180-((90-\alpha)+\theta))}}}{\sin{\theta}}\\
&= \frac{\lambda \: {\sin{((90-\alpha)+\theta)}}}{\sin{\theta}}\\
&= \frac{\lambda \: {\sin{(90-(\alpha -\theta))}}}{\sin{\theta}}\\
&= \frac{\lambda \: {\cos{(\alpha -\theta)}}}{\sin{\theta}}
\end{aligned}

$$


We now have a full solution for our first case, lets move on to the second case.


![Books 3](/images/procedural-bookshelves-in-animation-nodes/books3.svg)

We will compute the length $d$ as the sum of two lengths $a$ and $b$, the edge opposite to the angle $\epsilon$ and the edge of the small triangle made by the shelf and the blue book respectively.

We first note that:

$$

\frac{\sin{180 - \alpha}}{h} = \frac{\sin{\alpha}}{h}.

$$

And:

$$

\begin{aligned}
\frac{\sin{\epsilon}}{a} &=  \frac{\sin{(180 - (\theta+(180-\alpha))})}{a} \\
&= \frac{\sin{(\theta+(180-\alpha)})}{a} \\
&= \frac{\sin{(180-(\alpha - \theta))}}{a}\\
&=\frac{\sin{(\alpha - \theta})}{a}.
\end{aligned}

$$

Then by using the law of sines:

$$

\frac{\sin{(\alpha - \theta})}{a} = \frac{\sin{\alpha}}{h}

$$

Then

$$

a = \frac{h \sin{(\alpha - \theta})}{\sin{\alpha}}

$$

And since the small triangle is a right angle triangle:

$$

\sin{(\alpha)} = \frac{\lambda}{b}

$$

Then:

$$

b = \frac{\lambda}{\sin{(\alpha)}}

$$

And finally:

$$

\begin{aligned}
d = a + b &= \frac{h \sin{(\alpha - \theta})}{\sin{(\alpha)}} + \frac{\lambda}{\sin{(\alpha)}} \\
&= \frac{h \sin{(\alpha - \theta}) +\lambda}{\sin{(\alpha)}}
\end{aligned}

$$

Which is our full solution for the second case. Next we test these cases and see if they work and if they don't, correct them.

After testing, we realize we did a big mistake, that is, we assumed that the book is tall enough to be touched by the previous book and so if the book's height was small enough, it won't be touched but, rather its extension will.

We can fix this by changing our angle $\epsilon$ to be the angle between the line connecting the lower right point of the previous book with the upper left point of the book and then use the height of the book in the law of sines. This will however be hard to derive and will require a lot of geometric construction, so we will use another method.

Our new method checks for a condition, if the $y$ location of upper right point of the previous book is less than the left upper point of the book, we use the height of the previous book and the supplementary angle of $\alpha$ in the law of sines just as we did before, if not, we use the height of the book and the angle $\theta$ in the law of sines. We simply use the shortest one of them for the law of sines making sure they are touching.

The $y$ location of the point of the previous book is equal to $h\sin{\theta}$ and the $y$ location of the point of the book is equal to $g\sin{\alpha}+\lambda\cos{\alpha}$ where $g$ is the height of the book. I will leave the proof to the reader.

So our final equation is:

$$

d = \begin{cases}
\begin{cases}
\frac{h \sin{(\alpha - \theta}) +\lambda}{\sin{(\alpha)}} & \sin{\theta} \leq \frac{g\sin{\alpha}+\lambda\cos{\alpha}}{h}\\
\frac{g \sin{(\alpha - \theta})}{\sin{(\theta)}} + \frac{\lambda}{\sin{\alpha}} & \sin{\theta} > \frac{g\sin{\alpha}+\lambda\cos{\alpha}}{h}
\end{cases} & \alpha \geq \theta\\
\frac{\lambda \: {\cos{(\alpha -\theta)}}}{\sin{\theta}} & \alpha < \theta
\end{cases}

$$

Testing again we find that this in fact work. So lets move to implementation.

### Implementation

There really isn't anything special about the implementation, but I am going to talk about it a bit for readers who are not experienced with Animation Nodes.

![Node Tree 1](/images/procedural-bookshelves-in-animation-nodes/nodetree1.png)

This is just the implementation of the piecewise function we described above.

![Node Tree 2](/images/procedural-bookshelves-in-animation-nodes/nodetree2.png)

We make the loop we described at beginning of the algorithm, we generate some random numbers for all our variables like height, width and angles, we create the $h$ and $\alpha$ as parameters and reassign them each iteration. Finally, we add a parameter called `Shelf Length` and a break condition, if the location of the book is bigger than the shelf length we break the loop.

The loop at the top just creates multiple rows. Our implementation yields:

![Final Books](/images/procedural-bookshelves-in-animation-nodes/final_books.png)

## Shelves

We leave theory and implementation of the shelves for the reader for study and practice. Here is what we are aiming at:

![Shleves](/images/procedural-bookshelves-in-animation-nodes/shelves.gif)

## Optimization

Adding the shelves and the books together we notice an issue with the last couple of books.

![Optimization](/images/procedural-bookshelves-in-animation-nodes/optimization.png)

Sometimes they intersect the right wall of the shelves and that is due to our break condition, we asked the break condition to break the loop when the location of the book exceeds the shelf length however we didn't put in consideration that the book is leaning and its top might exceed the shelf length.

To fix this we make a small edit to our break condition, instead of checking if the book's location is larger than the shelf length, we check if the book's location plus $g\cos{(\alpha)}$ is larger than the book shelf minus the max book width. This will give us a small space (That is larger than the max book width) at the end of each shelf which we can manually fix in the higher loop.

Shelves usually ends with books that are standing straight, so we can just go ahead add one or two books that are standing straight. You probably know how to do that by now.

## Final Result

Finally we get out fully automated procedural library generator:

![Final](/images/procedural-bookshelves-in-animation-nodes/final.gif)