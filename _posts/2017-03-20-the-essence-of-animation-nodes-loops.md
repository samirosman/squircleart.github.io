---
title: 'The Essence Of Animation Nodes: Loops'
layout: post
image: "/images/the-essence-of-animation-nodes-preface/the-essence-of-animation-nodes.png"
description: Loops are one of the available subprograms in Animation Nodes and by
  far the most useful as it gives you the ability to iterate over multiple object
  or do an operation multiple times. So we shall look into them in this tutorial.
category: Animation-Nodes
prerequisites:
- text: Basic knowledge of the system of Animation Nodes.
  url: /animation-nodes/the-essense-of-animation-nodes-the-system.html
---

AN has a special set of nodes called **Subprograms**. Your node tree is a program that do something, subprograms are smaller programs inside your main program that can be created one time and get used multiple times.

There are 3 Subprograms:

- Groups
- Loops
- Scripts

Groups are straightforward and are very easy to use, lets look at them first to understand subprograms better and to warm up.

# Groups
Groups are functions that takes an input and returns an output. It is always a good practice to use groups when you want to apply the same node tree multiple times because this will improve performance and make your node tree more organized.

## Example 4.1

I want to create a function (group) that takes a file path and tells me whether it is of an image or not. So I go ahead and create that group.

![Creating A Group](/images/the-essence-of-animation-nodes-loops/create_group.png)

You see that there are 2 nodes that define the group, the *input group node* which you can add from the subprograms panel  and the *group output node* which can be added from within the *group input node*.

I added a single parameter which will be my file path, and a single output which will be a string that returns "Image" if the file was an image and "Not An Image" if it isn't, then I performed a series of operations to determine the type of the file.

I can determine the type of the file by looking at its formate, if it was a "png" or a "jpg" then it is an image and if not then it isn't. So all I need to get is the formate of the file.

Below is an explanation for the process, I wrote it as a Pseudocode to be an exercise for you mind.

```python

#Let the path be "SquircleArt/AN/Loops/file.png"
path = "SquircleArt/AN/Loops/file.png"

#First Split Node.
list = path.split("/")
["SquircleArt", "AN", "Loops", "file.png"]

#I only care about the last element so I get it.
file_name = list[-1]
#-1 means last element

#Second Split Node.
list = file_name.split(".")
["file", "png"]

#I only care about the last element so I get it.
formate = list[-1]

#Here is how inline if statments are formated:
expression_if_true if condition else expression_if_false

#Return "Image" if the formate is png or jpg
"Image" if formate == "png" or formate == "jpg" else "Not An Image"

```

{% include note.html content="Make sure to enable Negative Indicies in the advanced node setting of the get element node, as it is disabled by default." %}

Creating the group doesn't execute it and now, it is like it doesn't exist. To actually use it, we have to invoke (trigger) it using the *Invoke subprogram node* which you can add from the subprograms panel.

![Invoking A Group](/images/the-essence-of-animation-nodes-loops/invoke_group.png)

So you see that having had 3 paths to check, I didn't have to add the whole node tree for each of them, this made my node tree more organized and even faster, the execution time for this was 0.05ms, hadn't I used groups, it would have been 0.055ms.

# Loops
Loops run fixed number of times running the node tree they contain. Loops are a little bit harder to use but once you use them for once, they will be very easy.

## Example 4.2a

![Example 4.2a](/images/the-essence-of-animation-nodes-loops/example_4.2a.png)

### Explanation

There are 2 default inputs for any loop, one of them is **Index**. As we said, loops run fixed number of times, in this case it is 5 times that is defined by the input parameter *Iterations*. Each run has its own index that starts from zero and ends with $n-1$ where $n$ is the number of iterations.

In the above example, I added a generator output which is a float list. At each iteration (run) I basically append the index value to that float list. And the output list? It contains the indices of all iterations which as we said, ranges from zero to the number of iterations minus one.

## Example 4.2b

![Example 4.2b](/images/the-essence-of-animation-nodes-loops/example_4.2b.gif)

### Explanation

The second default input is **Iterations** and it is the number of times the loop will run, in this case, it is just the number of input iterations.

The above example show the node tree required to plot a power function in the interval of $[0,1]$.

At each iteration I evaluate the power function at the index and compose a vector with the index and the function. Each vector in the output vector list represents a point that satisfy the relation $y=x^p$ where $p$ is the power parameter.

Using the index directly as the domain of the function isn't something you would do; because the index starts from zero and ends with 99 and that is a very large domain to plot the function at. And that's where the iteration input come, I divided by the number of iterations to remap the domain to be in the range of $[0,1]$.

{% include challenge.html content="Something isn't right about the above node tree, If I were to decrease the number of iterations ---And thus decrease the number of points that form the curve--- it wouldn't look in the domain of [0,1]. Why is that? Can you fix it?" %}

## Example 4.2c

![Example 4.2c](/images/the-essence-of-animation-nodes-loops/example_4.2c.png)

### Explanation

In this example, I edited the domain to be $[-2,2]$. This is done by some simple arithmetics.

$$
\begin{aligned}
\text{Original domain} &= [0,99]\\
[0,99] \cdot \frac{1}{99} &= [0,1]\\
[0,1] - 0.5 &= [-0.5,0.5]\\
[-0.5,0.5] \cdot 4 &= [-2,2]
\end{aligned}
$$

Above, I made an assumption that the number of iterations is equal to 99, but in fact, it is 100. This is related to the challenge above, so go back to solve it if you didn't.

---

We have looked at examples where we used the loop to return a list of data, but loops can be used to do something as well.

---

## Example 4.3a

![Example 4.3a](/images/the-essence-of-animation-nodes-loops/example_4.3a.gif)

### Explanation

In this example, two things changed, I am no longer controlling the number of iterations and I did not output anything.

We saw that there is a default parameter called Iterations that we can use to control the number of iterations of the loop. Another way to do it is by using a list of data as an iterator, In this case, the number of iterations will be the length of the list and there will be an extra input of the same data type as the iterator list. At the first iteration (at index zero), the extra input will be the first element of the iterator list, at the second iteration (at index one), the extra input will be the second element, ...

In the example above, I computed the vector that we generated before and used it as the location of each object in my iterator list. We notice that there is no output for the loop, it is a loop that perform and not output.

## Example 4.3b

![Example 4.3b](/images/the-essence-of-animation-nodes-loops/example_4.3b.png)

### Explanation

The above examples takes 2 list and return the maximum element wise.

Multiple list iterators can be used, if they aren't equal in length, the lowest length will be the number of iterations and subsequently, the length of the output list will be the lowest length.

## Example 4.4a

![Example 4.4a](/images/the-essence-of-animation-nodes-loops/example_4.4a.png)

### Explanation

There is a hidden input for generators, it is called the **Condition**. Basically, the generator node asks the condition input every iteration "Should I append the input data to the output list?", The condition responds by saying True (yes include it!) or False (Don't include it).

The above examples shows a program that returns all the numbers that are divisible by 3, in other words, it returns the index iff its remainder in the euclidean division by 3 is zero.

## Example 4.4b

![Example 4.4b](/images/the-essence-of-animation-nodes-loops/example_4.4b.png)

### Explanation

Outputs are vectorized, meaning you can append multiple elements to the output list by plugging in a list that contains the elements. In the above example, I create a list of index and iteration inputs and append them both. The result is a flat list that contains the first three indices each followed by the number of iterations which is equal to 3.

## Example 4.4c

![Example 4.4c](/images/the-essence-of-animation-nodes-loops/example_4.4c.png)

### Explanation

If my output was a generic list and I wanted to append the list as a list object and not append its individual elements, I should convert the list to a generic data type first.

# Parameters

You might know by now that we can add parameters to our loop like the power parameter in [Example 4.3a](/animation-nodes/the-essence-of-animation-nodes-loops.html#example-43a). Parameters are just values that you can use in the loop and the user can define them in the Invoke node. Well, parameters are more complicated than this.

I added 3 parameters: Vector, Quaternion and a Float.

![Parameters](/images/the-essence-of-animation-nodes-loops/parameters.png)

Looking at their options, we see that it has 4:

- **Input** - If this options is enabled, the parameter will be visible as an input in the Invoke node. We see that both Float and Vector are included while quaternion isn't because I disabled it.
- **Output** - If this option is enabled, the parameter will be included in the outputs of the Invoke node. We see that both vector and quaternion are outputs because I enabled this option for them. Why would we output what we input? we will understand this better when we look at the **Reassign option**.
- **Copy** - If this option is enabled, the object will be copied at each iteration. Go back to the [Data article](/animation-nodes/the-essense-of-animation-nodes-data.html) to understand this better.
- **Reassign** - We will look at this option now.

## Example 4.5a

![Example 4.5a](/images/the-essence-of-animation-nodes-loops/example_4.5a.png)

### Explanation

We created two loops in this example, the "Random Numbers" is trivial. The "Largest" loop is designed to return the largest number in the iterator list. This is done using the **Reassign Input** feature.

The reassign input let you change the value of a parameter, in this case, it is my Float parameter. You can add a reassign by pressing the reassign button in the parameter options.

What I did here is basically tell Animation Node to assign the value of the current iterator to the float parameter iff it was larger than the original value of the parameter. So what happens here is as follow: For each float in the iterator, if it is larger than the current value of the float parameter, change the parameter to be the current iterator. By the end of the loop, the value of float parameter will be the largest value in the iterator list; because there is no other value larger than it. Take you time to think about this.

Since the float parameter is just a placeholder and its value doesn't matter, we can disable its input option. And since we want to get its final value, we enable its output option.

{% include note.html content="The initial value of the float parameter actually matters, if it was larger than the largest element in the list, it will never be replaced by any of the values in the list. I didn't care much about this because I were the one who created the float list using the other loop which has a range of [0,1]. To fix this, we could inject the parameter with a very low initial value." %}

{% include challenge.html content="Can you come up with a better method to fix the problem in the note?" %}

{%  include challenge.html content="Can you make a loop that find the closest point to a given point in a list of discrete points?" %}

## Example 4.5b

![Example 4.5b](/images/the-essence-of-animation-nodes-loops/example_4.5b.gif)

### Explanation

They call this "The Random Walk", we start with a vector, add a random vector to it and then add the result to a vector list, reassign the initial vector parameter to be the new vector location and repeat. By doing this, we get a random path created by that initial vector to reach the final point.

{% include challenge.html content="Something is wrong with my loop, it doesn't start at the point (0,0,0) even though my initial vector is (0,0,0). What did I do wrong? How can I fix it?" %}

## Example 4.6

![Example 4.6](/images/the-essence-of-animation-nodes-loops/example_4.6.png)

### Explanation

The last feature we will be looking at is the **Break Condition**. It is yet another neat feature of loops in Animation Nodes. You can add a break condition from the loop properties menu.

The break condition node asks its input "Should I continue the loop or should I end it forever?". If its inputs says True (Carry on!) it will continue the loop normally, if it is False (End it !) it will end the loop and do no more.

The above example shows a loop that generate a list of length Length that starts by Start. The way to do it is to append the index iff it is in between Start and Start+Length. However, this is extremely inefficient, I know that after index become Start+Length I won't include any elements, then why carry on the loop till the end, we break it as soon as we reach Start+Length!

This feature enable us to use Loops as while loops, that is, by setting the iterations to infinitely large number and then break whenever we want. However, do not ever do that ! While loops are contagious and you should never use them. If your break condition was just little bit off, your CPU will process for ever.

***
This is all you need to know about loops. Loops were the missing piece and the limiting factor in my tutorials, but now that we know about them. Our tutorials will only get more exiting and enjoyable as well as harder of course. So stay tuned.