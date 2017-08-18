---
title: 'The Essence Of Animation Nodes: Notes On Loops'
layout: post
image: "/images/the-essence-of-animation-nodes-preface/the-essence-of-animation-nodes.png"
description: In this small tutorial, I am going to give you some tips and tricks regarding
  loops in Animation Nodes. I will also try to connect it with what we learned before
  from vector based drivers, animations and such.
category: Animation-Nodes
prerequisites:
- text: Good knowledge of Loops in Animation Nodes.
  url: https://squircleart.github.io/animation-nodes/the-essence-of-animation-nodes-notes-on-loops.html
---

# Tips

## Example 5.1a

![Example 5.1a](/images/the-essence-of-animation-nodes-notes-on-loops/example_5.1a.gif)

### Explanation

In this example, I set the z location of every object in the input iterator list to its own y location, this means that, the far the object become from the origin point in the y axis, the far it goes up.

Now, I want you to change the order of objects in the iterator list, or just randomly shuffle it using the *List Shuffle Node*.

What do you notice? Nothing seems to change, right? That is because there is no factor of order in the loops, it doesn't matter if an object came first or last. Now consider the next example.

## Example 5.1b

![Example 5.1b](/images/the-essence-of-animation-nodes-notes-on-loops/example_5.1b.gif)

### Explanation

In this example, I set the z location of every object in the input iterator list to its index in the list. Remember that the index of the first object in the list is equal to its index in the loop and is equal to zero, the next object is 1, and so on.

Now, Try to shuffle the list. What do you notice? Objects z location is changing, right? Thats because there is a factor of order---The index. If an object came first, its index will be zero and subsequently will its z location, but if it came last, its index will be 3 (because the list has 4 object and indices starts from zero) and subsequently will its z location.

> Order sometimes matter if a factor of order is present.

## Example 5.2a

![Example 5.2a](/images/the-essence-of-animation-nodes-notes-on-loops/example_5.2a.png)

### Explanation

In this example, I made 2 loops that does exactly the same thing, and that is, they return the sequence:

$$[0,1\cdot 10^{0.4},2\cdot 10^{0.4},3\cdot 10^{0.4}, ... , 99999\cdot 10^{0.4}]$$

However, one of them is **Bad** and the other is **Good**. Can you guess the reason why the **Bad** is bad? In the Bad example, I computed the $10^{0.4}$ inside the loop (Thats why it is colored blue) while in the Good example, I computed ${10}^{0.4}$ outside the loop and input it as a parameter. The **Bad** loop took 163ms to run while the **Good** only took 68ms to run. Now you know why it is bad.

The ${10}^{0.4}$ node inside the loop ran 10,000,000 times ! While the ${10}^{0.4}$ outside the loop ran only 100. In both cases, the value was constant at all the runs. So why put it inside a loop and compute it every iteration and every run?

The same apply for other nodes that return constant values, for instance, if you want access to the current time, put the *Time Info Node* outside the loop and plug it as a parameter, don't put it inside the loop.

> Any constant values or nodes should be outside the loop for performance gain.

## Example 5.3a

![Example 5.3a](/images/the-essence-of-animation-nodes-notes-on-loops/example_5.3a.gif)

### Explanation

In this example, I create a new object with mesh data exactly as an Ico sphere but with random offset for its vertices locations. The loop iterate over every vector in the input iterator list and add some random vector to it then return it.

Notice how the index is connected to the *Randome Vector Node* seed input. This ensure different random vector at different iteration.

> Always connect your seeds into the index.

What if we want to include multiple random nodes inside the loop? you would want to have them return different values. In this situation, you could do one of two things:

1. Change the *Node Seed* in the node which is a more general seed, Animation Nodes does that for you automatically though. Try to duplicate a random generator node, you will see that the *Node Seed*  changes automatically.
2. Add the index to a multiple of iterations and plug it as the seed. For instance, if the number of iteration is 15, add a random generator with seed as the index, add another generator with seed as 15+index, add another generator with index as 30+index, and so on. This will ensure different seeds for any random generator at any iteration.

## Example 5.4a

![Example 5.4a](/images/the-essence-of-animation-nodes-notes-on-loops/example_5.4a.gif)

### Explanation

In this example, I used multiple iterator lists to offset verticies along their normals by a random factor. I could just use the location from the *Vertex Info Node* but in the future, Animation Nodes will have normals as a vector list, so get used to it like this.

> If multiple iterators are present, the loop with run n number of times where n is the length of the list with the lowest length.

## Example 5.5a

![Example 5.5a](/images/the-essence-of-animation-nodes-notes-on-loops/example_5.5a.png)

### Explanation

In this example, I made two loops that does the same thing, and that is, return the input list, for no good reason.

In the Get List Element loop, I input the float list as a parameter and not as an iterator, then I used the *Get List Node* to get the float at the current iteration index, it is exactly the same as the other loop except it is more computationally expensive for the extra data access. However, this way will come in handy sometime, so make sure you understand it.

# Vector Based Drivers
We saw before how we can derive some property by another property. Using loops, we can do that for multiple objects automatically.

Go back to [Vector Based Drivers](https://squircleart.github.io/animation-nodes/the-essense-of-animation-nodes-vector-based-drivers.html) tutorial and try to implement all the examples over multiple objects.

## Example 5.6a

![Example 5.6a](/images/the-essence-of-animation-nodes-notes-on-loops/example_5.6a.gif)

### Explanation

We learned before how we can set the scale of an object based on some vector, in this example, I set the scale of those planes to be their distance to the origin point.

However I did couple of more things:

1. I clamped the value of the distance to 1 to avoid overly scaled objects.
2. I divided the vector location by the scale of the empty to act as a scaling factor, that is, as the empty get bigger, division will make the location closer to the origin and thus will have a smaller distant and subsequently a smaller scale. The division happen component wise, and so I can perform a non uniform scaling if I want.

{% include note.html content="Notice how I put the scale of the empty outside the loop because it is constant." %}

# Loops For Artists
Finally, I want to give you an application on loop where artists can actually use it.

First, model a red fruit, pretty simple:

![Red Fruit](/images/the-essence-of-animation-nodes-notes-on-loops/red_fruit.gif)

Then duplicate the selected verticies and make them a separate mesh. And then you apply this node tree.

![Red Fruit Node Tree](/images/the-essence-of-animation-nodes-notes-on-loops/red_fruit_nodetree.png)

Take your time to understand it if you haven't already.