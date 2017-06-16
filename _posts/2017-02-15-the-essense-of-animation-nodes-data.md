---
title: 'The Essence Of Animation Nodes: Data'
layout: post
image: "/images/the-essence-of-animation-nodes.png"
description: We talk about how data is handled in Animation Nodes
category: Animation-Nodes
---

We said in the previous tutorial that our node tree will be converted into a python code which can then be executed and this means that AN is some how related to how python works, so we will look at some of the properties of that system. We will also look at data types and how it is handled in AN.

# AN Data

Let's look at a very basic example on creating and manipulating data in animation nodes ... Creating a vector, scaling it by factor then debugging the result.

![Simple Example](/images/the-essence-of-animation-nodes-data/basic-example.png  "Simple Example")

## Creating Data

In the above example, the node I used to create the data is the *Combine Vector Node* which basically creates a vector out of xyz values.

When I created a vector, AN stored it in the computer **memory** so that I can access it later.

You might be tempted to think that a vector is just a list of floats or bits stored in a location in the memory, like C does it. However it isn't.

Python (Which AN is built on) is an **Object Oriented Programming Language** and subsequently is AN. But what is objects?

### Objects

In the old days of programming, programmers and programming languages were more concerned about the actions and operations that can be applied to data, however that changed when OOP was introduced.

OOP concentrated on the data itself and tried to model data as a real life objects that have properties and abilities, and the concept of objects was then introduced which made programs more efficient, easier to program and easier to understand.

#### The Vector Object

The vector we just created is an object that has some properties and some abilities. For instance, that vector is limited to a 3 dimensional space (A property), that vector can be added to another vector (An ability).

***

## Editing Data

Now that we have a data in memory, we can go ahead and edit this data. In the example above, I used the *Vector Math Node* to edit that vector.

Every **Data Type** has a group of nodes that can edit it and they are nicely organized in the **add menu**.

### Copying Data

Lets look at another example where we created a list of floats and shuffled it.

![Copy Data Example](/images/the-essence-of-animation-nodes-data/copy-data-example.png  "Copy Data Example")

Just like the other example, we created the data using the *Create Float List* node and edit it using the *Shuffle List* node. But what If I wanted to shuffle the same list again but with a different seed?

![Copy Data Example 2](/images/the-essence-of-animation-nodes-data/copy-data-example_2.png  "Copy Data Example 2")

Well it is very easy to do, but something is happening here that you can't see.

When I shuffled the list with the first node, I edited the list that is stored in memory, but when I added another shuffle node ---There is now 2 connections coming out of the create node--- AN **copied** the list and stored it to keep the data intact for other users (Nodes).

You see, AN spot where copies are needed and copied them to keep your data intact, Jacques said:[^1]

[^1]: [Jacques explanation for data copy and performance mode ](http://blender.stackexchange.com/questions/65147/performance-mode-for-animation-nodes-addon#answers)

> The input data will only be copied when it is used by multiple nodes **AND** at least one of the nodes that uses the data modifies it.

There is a feature in AN that let you visualize data copies and that is **Color Mode** which you can change from the **Developer Panel** in the tools menu. By changing that to **Needed copied** the nodes that copy data will be colored in red:

![Color Mode](/images/the-essence-of-animation-nodes-data/color-mode.png  "Color Mode")

You can see that the upper Create node is colored in red and that is because there is 2 nodes editing its data and thus it copied the data to keep it intact for the other user.

## Data Types

Data types are straightforward and don't really need explanation, but if you stumbled upon a data type related problem, visit the documentation. [Here](https://animation-nodes-manual.readthedocs.io/en/latest/dev_guide/socket_types.html) is a list of data types and some of its properties.

There is a special data type I want to talk about though.

### Generic Data Type

Generic data type accept any type of data including lists. This is useful when it comes to making nested lists, that is, lists that include lists.

![Generic](/images/the-essence-of-animation-nodes-data/generic.png)

Notice that the generic list contains two float lists.

### Converter Node

Converter node is a little node that can convert any data type into any other data type. It is usually used with the generic data type to convert it to its original data type. So in the previous example, if we sampled the first element, the output will be a generic data, to be able to use the float list in a math node, you have to convert it from generic to a float list. To convert it to a float list we can use the converter node:

![Converter](/images/the-essence-of-animation-nodes-data/convert_node.png)

We first choose the type we want to convert to, which in this case was a float list, then we lock it using the lock button, this will make sure the node won't convert the output data type automatically because it can. Then we use its float list output as we please.

***
***
