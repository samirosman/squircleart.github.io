---
title: Value Remapping
layout: post
category: Math
image: "/images/value-remapping/wall.png"
description: Remapping values from an interval to another is one of the most important math concepts you have to be familiar with when it comes to CG, in this tutorial, we are going to discuss and explain values remapping.
---

## What is Value Remapping

Let $X$ be a subset of $\Bbb{R}$ and $p \in X$ then I can describe the point $p$ in terms of the bounds of the interval $X$. For instance, let us assume that $X=[0,4]$ and $p=2$, then I can describe $p$ as the midpoint between the two bounds $0,4$, that is, $p=(0+4)/2=2$.
Now if I give you another interval $Y=[2,4]$, can you give me a $w \in Y$ such that the ratio between the distances from point $p$ to the bounds of the interval $X$ equals the ratio between $w$ and the bounds of interval $Y$, well, since the ratio between the distances between $p$ and both bounds of $X$ is 1 (because it is equidistant) then $w$ has to be equidistant from both bounds of $Y$ to make the ratio 1, then by using the midpoint equation, $w=(2+4)/2=3$.

This is basically what we are trying to do, given two intervals $X$ and $Y$ and point $p \in X$ we want to find the point $w \in Y$ such that the ratio between the distances from point $p$ to the bounds of the interval $X$ equals the ratio between $w$ and the bounds of interval $Y$. This is called **Linear Value Remapping**, non linear remapping will be introduced later on.

## Visualizing Intervals

Before coming up with a general algebric solution to the problem, I want to tell you about a way to visualize such remapping graphically, if one understand the following concepts, he will be able to do such remapping with ease without even knowing the general equation for the problem.

First, If one came up with a continuous function that if evaluated at all the values of the interval $X$ will result in $X^{\prime}$ that satisfy $X=Y$, then it can be proven that $p=w$. If you don't understand this, look at the following visualization:

![Visualization 1](/images/value-remapping/visualization1.svg)

The red box represent all the values of the interval $X$ and the blue box represent all the values of the interval $Y$, if we moved $X$ to the position of $Y$ (This can be done by adding some value to it, in this case we added $12$) and then scaled $X$ to be the same size as $Y$ (this can be done by multiplying by a scalar) then $X$ will be equal to $Y$ since all their values have the same location as shown in the third figure.

Now if there was a particular value $p \in X$, it will experience the same transformation and thus its new location will be the $w$ in our problem and this can be easily proven for linear value remapping. So it is clear that in order to find $w$, we will perform a series of translations (additions) and scaling (multiplication), let us now see how we can find the particular scalars to add and multiply $X$ by in order to get $Y$.

Let $X=[X_1, X_2]$ and $Y=[Y_1, Y_2]$, if we want $X_1$ to be equal to $Y_1$ (As in the second figure of the above illustration) then we will have to add $\alpha$ to all values of $X$ including $X_1$ and $X_2$ where  $\alpha$ is the difference between $X_1$ and $Y_1$ which is equal to  $Y_1 - X_1$, the why is trivial. Now that we have both intervals' starts at the same position, we should scale $X$ to match $Y$, to scale $X$ to match $Y$ we can multiply $X$ by the ratio between the distances between bounds of $X$ and $Y$, that is, we should multiply by:

$$
\frac{\vert Y_2 - Y_1 \vert}{\vert X_2 - X_1 \vert}
$$

So lets try those equations:

![Visualization 2](/images/value-remapping/visualization2.svg)

As you may see, the addition worked well in figure two and now they are aligned. However, when scaling (Multiplying) in figure three, the intervals became the same size yes but it also got shifted since scaling happens relative to the origin of the space or point zero.  So we observe that the order of operations won't work because scaling affect positions. One might say that doing the scaling first then translation would work, it may ... , we computed the translation factor when the interval was at its original location, after scaling, its location changes so our factor is no longer valid, a smart guy would extract a new translation factor based on the scaling factor, but we won't do it that way because of some disadvantages discussed later on.

Let it be known that when I say add or multiply to $X$ I mean adding to all its values including $X_1$ and $X_2$. It should be noted that adding and multiplying to $X$ may be expressed totally by multiplying and adding to the bounds of the interval, for instance, $[X_1, X_2] + 10 = [X_1+ 10, X_2 +10]$, same goes for scalar multiplication.

If you think about it, our only problem is that scaling affects the location of the interval. To eliminate this problem, we are going to add an extra step:

1. Transform the interval $X$ such that $X_1$ be at zero. This can be done by subtracting $X_1$ from $X$ and the why it trivial. We did this because point zero is the only point in $\Bbb{R}$ such that scaling doesn't affect location (Because scaling happens relative to zero and we are at zero!).
2. Scale the interval $X$ to match $Y$ using the factor $\frac{\vert Y_2 - Y_1 \vert}{\vert X_2 - X_1 \vert}$.
3. Add $Y_1$ to the interval $X$ to match their location.

The first step is an intermediate step that terminated the previously discussed problem. In general, transforming an interval to the interval [0,1] first will make every thing easier especially when it comes to non linear remapping. Here is an illustration for the above steps:

![Visualization 3](/images/value-remapping/visualization3.svg)

In figure 2, we moved the interval $X$ such that it start at zero. In figure 3, we scaled the interval not having to worry about location change. In figure 4, we moved the interval to match $Y$. And so our final algebraic equation deduced from the above steps is:

$$
w = \frac{(p - X_1)(\vert Y_2 - Y_1 \vert)}{\vert X_2 - X_1 \vert} + Y_1
$$

## Example

Let $X \subset \Bbb{R}$ where $X=[0,1]$, transform that interval to $Y=[-4,4]$.

### Solution

This can be done by two ways:

- Multiply by $8$ then subtract $4$.

$$
[0,1] \cdot 8 = [0, 8]\\
[0, 8] - 4 = [-4, 4]
$$

- Subtract $0.5$ then multiply by $8$.

$$
[0,1] - 0.5 = [-0.5, 0.5]\\
[-0.5, 0.5] \cdot 8 = [-4, 4]
$$

I cam up with those numbers by imagining the intervals on the real line as follows:

![Visualization 4](/images/value-remapping/visualization4.svg)

First method uses multiplication >>>> addition. Second method uses addition >>>> multiplication. All I have to keep in mind is that scaling is multiplication, addition is translation and scaling happens away from zero.

{% include challenge.html content="Given a $p \in X =0.5$, find $w \in Y$ using both methods and confirm the result by applying the general equation." %}

# Non-Linear Value Remapping

So far we have been considering intervals as subsets of $\Bbb{R}$ and $\Bbb{R}$ has a completeness property that tells us that there is no gaps in those subsets of $\Bbb{R}$, that is, given two real numbers you can always find a real number that is larger than the smallest and smaller that the largest.

We can however define the intervals in some other set like $\Bbb{W}$ which include $[0, 1, 2, 3, \dots]$, $\Bbb{W}$ is actually the most used set in programming as integers are the only numbers to be trusted with loops since floating point numbers are not accurate. So you will probably use $\Bbb{W}$ in most of your work. Furthermore, in programming sets and lists are always discrete (Their values are defined on discrete locations) and finite so we shall call them finite sequences. A sequence is a function of integers that map each integer into $\Bbb{R}$. So lets look at mapping for $\Bbb{W}$.

Mapping can happen from a set to another, so we can map values of a sequence in $\Bbb{W}$ to values of a sequence in $\Bbb{R}$, for instance, the finite sequence $[0,1,2,3,4,5]$ can be remapped to $\Bbb{R}$ or specifically to the range $[0,1]$ by dividing it by $5$ resulting in a sequence $[0, 0.2, 0.4, 0.6, 0.8, 1]$. It should  be noted that the difference between consecutive values is constant making the sequence an arithmetic sequence. If you add a value to the sequence and thus changing its starting value, values will maintain the difference between them, in fact the difference never changes, moreover, if you multiply the sequence by a scalar and thus changing the difference between its elements and possibly the sequence's starting point, values will still maintain a constant difference. That's why I called it linear remapping, because we only add and multiply which keep the uniformity of the sequence intact.

Non-linear remapping is similar to linear remapping when it comes to defining the values of the boundaries of the intervals, however it doesn't represent an arithmetic sequence, that is, the differences between each two consecutive values may change after remapping.

For instance, consider the sequence $X=[0,1,2,3]$ and we want to remap it to an interval $Y=[0,9]$, we could use linear remapping and multiply the sequence by 3 resulting in $X\cdot 3 = [0, 3, 6, 9]$ which satisfy $Y$ since it starts with zero and ends with 9 (Notice that the difference between each two consecutive values is constant and equal to 3). However, we could also use non-linear remapping and square $X$ resulting in $X^2 = [0, 1, 4, 9]$ which also starts at zero and ends with 9 (Notice that the difference between each two consecutive values is not constant).

Ok, what is the general equation for non-linear remapping. Well, there is no equation but there is a general form, if you think about it, there is infinite number of functions that can be considered non linear. The general form is very similar to that of linear remapping buy with extra two steps and it is as follows:

1. Transform the interval $X$ such that $X_1$ be at zero.
2. Scale the interval $X$ such that its length is equal to 1. This can be done by dividing it by $\vert X_2-X_1 \vert$.
3. Evaluate the the interval at $F(x)$ where $F(x)$ is a non linear continuous function with range $[0,1]$.
4. Scale the interval $X$ to match $Y$ using the factor ${\vert Y_2 - Y_1 \vert}$.
5. Add $Y_1$ to the interval $X$ to match their location.

Steps 2 and 3 are the new steps with a slight change in 4. Step 2 makes the scale of $X$ equal to 1, combined with step 1, the resulted interval is in the interval [0,1]. Step 3 will be discussed later on. Step 4 has its factor changed such that we are no longer dividing by ${\vert X_2 - X_1 \vert}$, a smart guy would observe that we already divided by ${\vert X_2 - X_1 \vert}$ in step 2, thats why we multiplied by ${\vert Y_2 - Y_1 \vert}$ alone.

Now to step 3, if the function was $F(X)=x$ then the remapping remains linear because $F(x)$ is a linear function, however, if $F(x)$ was a non linear function like $x^2$ then the result will include values that the differences between consecutive values increases as the value increases. Notice that a function like $x^2$ when evaluated in the domain $[0,1]$ will result in values in the range $[0,1]$ and this is the only condition we have for the function, that is, it should have a range of $[0,1]$. Perhaps it is better to show what this function do:

![Visualization 5](/images/value-remapping/visualization5.svg)

My domain is the arithmetic sequence $[0, 0.1, 0.2 , 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]$ and I am applying the function $F(x)=x^2$ which yielded some values which are dense at the start and more free at the end. Notice that the range of the function is $[0, 1]$ so the function is accepted as a valid function for our algorithm. We are basically taking $F(x)$ and using it as the domain of the next steps. The reason why we want the function to have a range of $[0,1]$ is because of the assumption we made in step 4 that the length is equal to 1.

The domain of the function doesn't have to be $[0,1]$ so step 2 is not always required, for instance, look at the following function:

$$
F(x)= \sin{x}
$$

The sine function has a range of [-1, 1], using what we learned in linear mapping, we can change the range to be $[0,1]$ as follows:

$$
F(x)= \frac{\sin{(x)}+1}{2}
$$

I want the output to start from zero and ends with one covering a half oscillation, but the nearest consecutive trough and crest are at $-\pi/2$ and $\pi/2$, then I can edit my equation to be:

$$
F(x)= \frac{\sin{(x+\frac{\pi}{2})}+1}{2}
$$

Now, to get the first half oscillation that ranges between $[0,1]$, I will have to evaluate the function at the domain $[0, \pi]$. If we plot this function on this domain, we would get:

![Visualization 6](/images/value-remapping/visualization6.svg)

This function is sometimes called the ease-in-out function or simply a sinusoidal function. Since the output is in the range $[0,1]$ then we can use it as a factor for mixing between two states of an object and we would get a smoothly interpolated animation. You are probably familiar with this if you animated before.

And thats it for non linear remapping, You find a function with the range $[0,1]$ or you simply linearly remap its range to that range ! and you follow the steps described above.

Value remapping will come up as a base for almost everything you try to do, so it is important you truly understand it. If you have any thoughts, please let me know.
