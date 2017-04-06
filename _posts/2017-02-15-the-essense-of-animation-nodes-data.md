---
title: "The Essence Of Animation Nodes: Data"
layout: post
image_path: /images/the-essence-of-animation-nodes.png
description:  "We talk about how data is handled in Animation Nodes"
category: Animation-Nodes
---

We said in the previous tutorial that our node tree will be converted into a python code which can then be executed and this means that AN is some how related to how python works, so we will look at some of the properties of that system.

We will also look at data types and how it is handled in AN.

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

But objects introduced problems as well, and we are going to talk about that later. In fact, I am telling you this because we are going to visit it later and see how objects made our life harder for some projects.

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

### Performance Mode

There is also a feature in AN that allow you to control the copying of data, So for instance, I can prevent a node from copying data even though it met the conditions Jacques described above.

![Performance Mode](/images/the-essence-of-animation-nodes-data/performance.png  "Performance Mode")

I changed to the performance panel and disabled the copying of the input **List** which is our float list for both *Remove nodes*.

Did you notice what happened? The upper *Remove node* didn't copy the data and just edited it directly and removed the number 1. The lower *Remove node* didn't copy the data either and edited the list that was originally edited by the upper node, and the consequences? The lower node has no accurate output since I told it to only remove the number 2 but 1 was removed as well.

It is called performance because when you are not copying you are boosting the performance of the node tree.

But you don't really need such a feature to optimize the performance of your node tree because AN already do that in the background, As Jacques said:[^1]

> You really don't need this. AN should be able to optimize itself in that regard. When you try to optimize performance, you should look somewhere else. I will remove/hide that "feature".

And we will talk about optimizing the node tree in a later tutorial.

***

## Data Types

I think we said enough about data although I wanted to talk about another topic which is **Data Creator and Owner**. The type of objects we create are either Python, Blender or AN objects and treating one as a different one may cause unexpected outcome or may not work at all. But I don't really have much information about that now, so we are going to leave it and visit it later.

Data types are straightforward and don't really need explanation, but if you stumbled upon a data type related problem, visit the documentation. [Here](https://animation-nodes-manual.readthedocs.io/en/latest/dev_guide/socket_types.html) is a list of data types and some of its properties.

There is a special data type I want to talk about though.

### Generic Data Type

Generic data type accept any type of data including lists and can store different types of data in the same list. But here comes the problem of identifying the data when I want to get them. To understand this, lets look at the following example:

![Layered List](/images/the-essence-of-animation-nodes-data/double-lists.png  "Layered List")

As you can see, I created a generic list that contain 2 different lists, then I went on to get the first element of the list which is the integer list.

Now I want to get the first element in the first element of the generic list which is the number 1 in the integer list.
But I can't because every time I plug the element (integer list) into the second get list element node it is like:

**Get Node:** "I want a list so that I get you an element, don't give me a non-list !"

**Me:** "Trust me, it is a list but you can't see it well"

**Get Node:** "No it is not, get me a list"

No matter how hard you try convince it that the input is actually a  list, it just wont listen and that's where the **Convert Node** come to the rescue.

The Convert node is a little cute node that have the ability to convince a node that a data is another type of data, and it is usually used with the generic data type.

That node is a passive node that is usually added automatically in some cased but you can add it from the search menu.

![Convert Node](/images/the-essence-of-animation-nodes-data/convert.png  "Convert Node")

Look how this cutie managed to convince the Get guy that the input was actually a list.

***
***
