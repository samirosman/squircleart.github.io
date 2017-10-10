---
title: 'The Essence Of Animation Nodes: Data'
layout: post
image: "/images/the-essence-of-animation-nodes-preface/the-essence-of-animation-nodes.png"
description: In this part of the series, we will learn how Animation Nodes handles
  data to have a better understanding of how our node trees works.
category: Animation-Nodes
prerequisites:
- text: Basic knowledge of the system of Animation Nodes.
  url: "/animation-nodes/the-essense-of-animation-nodes-the-system.html"
next_part: "/animation-nodes/the-essense-of-animation-nodes-vector-based-drivers.html"
previous_part: "/animation-nodes/the-essense-of-animation-nodes-the-system.html"
---

# AN Data

## Data Types

In Animation Nodes we have a lot of data types, some represents numerical data like *Integers*, *Floats* and *Vectors*, and some represents structures like *Mesh Data*, *KD Trees* and *BVH Trees*. Most of these data types can be grouped into **lists** so we may--for example--have a list of integers.

Nodes have inputs and outputs that we call *Sockets*. Each socket has a specific data type, for instance, math node has float sockets which means it expects and outputs floats. Sockets can be distiguished by colors, for instance, booleans are colored yellow. Lists sockets are of the same colors as their types but are almost transparent.

Some sockets does what is known as **implicit conversions**, that is, it takes a different data type than its type and converts it into its type. For instance, the float socket accepts integers and converts them into floats implicitly, and the converse is true.

Some node dynamically change the type of their sockets according to the type of the input. For instance, the *Get List Element* node accepts any list type and dynamically change the output type based on the list type.

### Vectorized Sockets

A vectorized socket is a socket that accepts individual values as well as lists. A vectorized node is a node that has vectorized sockets and can perform operation on both lists and individual values. To illustrate this, look at the following example:

![Vectorization Example](/images/the-essence-of-animation-nodes-data/vectorization_example.gif)

First, you may notice that the math node has a half transparent socket, which means it is vectorized. If given a float, it adds `5` to it, if given a list of floats, it adds 5 to each float and outputs a list of floats. Most nodes are now vectorized by not all of them.

### Generic Data Type

Generic data type accept any type of data including lists. This is useful when it comes to making nested lists, that is, lists that include lists.

![Generic](/images/the-essence-of-animation-nodes-data/generic.png)

Notice that the generic list contains two float lists.

### Converter Node

Converter node is a node that can convert any data type into any other data type--if possible. It is usually used with the generic data type to convert it to its original data type. For instance, in the previous example where we have nested lists, if we sampled the first element of the generic list, the output will be a generic data while in fact it is a float list, to be able to use the float list in a math node, you have to convert it from generic to a float list. To convert it to a float list we can use the converter node:

![Converter](/images/the-essence-of-animation-nodes-data/convert_node.png)

We first choose the type we want to convert to, which is a float list in this case, then we lock it using the lock button, this will make sure the node won't convert the output data type automatically--because it can if it detects a familiar pattern. Then we use its float list output as we please.