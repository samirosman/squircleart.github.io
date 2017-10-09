---
title: 'The Essence Of Animation Nodes: The system'
layout: post
image: "/images/the-essence-of-animation-nodes-preface/the-essence-of-animation-nodes.png"
description: We will start this series by explaining the system of AN and the available
  options to control this system including execution routines and possible errors.
category: Animation-Nodes
prerequisites:
- text: Basic knowledge of blender.
next_part: "/animation-nodes/the-essense-of-animation-nodes-data.html"
previous_part: "/animation-nodes/the-essense-of-animation-nodes-preface.html"
---

# Node Trees
Animation Nodes lets you create one or more node trees where you might create a node tree for some purpose and another for some other purpose. Node trees can also share subprogrames which we will explore further on in the series.

Node trees can be added and deleted as follows:

![Adding Node Trees](/images/the-essence-of-animation-nodes-the-system/node-trees.gif)

# Execution

Animation Nodes takes the node tree you created, converts it into code and then run that code.

There are multiple routines AN can follow to execute the node tree and we are going to look at those options now.

![Example](/images/the-essence-of-animation-nodes-the-system/execution.gif)

First, you may noticed that some number is changing very rapidly, and this is the **Execution Time** which is basically the time that AN took to convert and run the node tree and it is usually measured in milliseconds.

## Execution methods:

By default, *Auto Execution* is enabled, which automatically executes the node tree based on specific rules you specify. Those rules are specified in the auto execution panel which include:

#### Always:

It is enabled by default and it constantly and successively runs the node tree in spite of the context and space you are in.

This option is accompanied by a property called **Min Time Difference** which is the slider you see in the panel, it basically defines the time between each two successive executions.

Most of the times, it doesn't make sense to use *Alwayse* because it is not needed. For instance, in the example above, we are adding two numbers that are not changing, meaning the result will alwayse be the same, so we don't really need to execute the node tree successively.

*Alwayse* option has its own uses and we will look at them in a moment.

#### Tree Changed:

This option executes the node tree whenever you add or remove a node to the current node tree. It should be enabled if you want to see the changes you make to the node tree in realtime.

![Tree Changed](/images/the-essence-of-animation-nodes-the-system/tree-changed.gif)

Notice how the time changed (which means AN executes) when I added a new node.

#### Frame Changed:

This option executes the node tree whenever the current frame change. It should be enabled if your node tree depends on the current frame in anyway. That way the node tree updates whenever we playback the animation.

![Time Changed](/images/the-essence-of-animation-nodes-the-system/frame-changed.gif)

Notice how the node tree executes whenever the frame change.

#### Property Changed:

This option executes the node tree whenever you change a value inside a node manually. It should be enabled if you want to see the changes you make to the node tree in realtime.

![Property Changed](/images/the-essence-of-animation-nodes-the-system/property-changed.gif)

Notice how the node tree executes whenever I change a value.

#### Triggers:

Now you might be wondering, what if we wanted to execute the node tree if an external property other than the nodes changes. For instance, the location of an object, its draw options, or even its name.

This can be done using *Triggers*. Triggers are basically "watchers" that watch for a change in some property you specified and they instruct AN to execute the node tree whenever the property they are watching changes.

Lets look at an example where we are to watch for a change in an object's location so that we can get an up to date information about its location using the *Object Transforms Input* node.

![Triggers](/images/the-essence-of-animation-nodes-the-system/triggers.gif)

I added a trigger that watch for a change in an object property, chose the object to watch and typed the **Data Path** for the property I want to watch for, in this case my object was *Cube* and the property data path was `location`.

To get the *data path* for any object property, just hover over it and press <kbd>Shift</kbd>+<kbd>Ctrl</kbd>+<kbd>C</kbd>, this will copy the *ID Data Path* for that property.

Here are some examples on object data paths:

~~~python

location
location.x      #The X location only
rotation
name
pass_index
draw_type     #Maximum draw type.

~~~

Now, what if you want to watch some other property thats isn't of an object. For instance, the strength of the background light.

This can be done by choosing **Scene** instead of **Object** when adding the trigger. But getting the data path for such properties is harder, because you have to define which context the property is in, and the best way to do so is by checking the ID path from the the **data-block** database like so:

![Data Path](/images/the-essence-of-animation-nodes-the-system/data-path.png)

Examples:

```python

render.resolution_x
#Notice that the original one was:
bpy.data.scenes["Scene"].render.resolution_x
#But the first part was omited
#because scene was already defined in the trigger.

#Notice how we defined the group first
#before defining the node the socket.
bpy.data.node_groups["Shader Nodetree"].nodes["Background"].inputs[1]

bpy.data.objects["Cube"].modifiers["Subsurf"].levels

```

### When to use Always?

Consider the scenario where we have tenths of objects transforming with lots of properties changing. Adding triggers to all that will be a tediouse process, in that case we just use *Alwayse*.

Another situation where *Always* is in fact a very good solution is numerical simulations and especially ones that are iterative like solving PDEs where I want to see the simulation in real time and let it run as fast as possible as much as possible.

### Manual Execution:

Last but not least, the **Execute Node Tree** button which just executes the node tree when you press it.

I usually use that while disabling *Auto execution* when I am working on a risky node tree that may return errors or when I am doing an operator that only need to run once.

## Errors

During the execution of the node tree,  AN might encounter some errors, those errors are either fatal or non-fatal.

### Non-fatal Errors:

Those errors are encountered at individual nodes, it doesn't affect the rest of the node tree and it does not stop its execution.

#### Example:

![Non-Fatal Errors](/images/the-essence-of-animation-nodes-the-system/nonfatal-error.png)

Those errors are encountered for obviouse reasons and the node will most certainly tell you what the error is and how to fix it. In the above example it tells you that the axis should be different and not both be set to `z`.

### Fatal Errors:

As the name suggest, those errors are fatal, meaning that they will stop the execution of the whole node tree till they get resolved.

They happen due to an error in the code of the nodes itself, it probably happens when you try to do something with the node that the developers didn't consider, but AN is smart and avoids almost all of those complications.

AN will display a red border, stop executing and tells you to report this bug to the developers. For instance, if you have a syntax error in an expression node while *Debug Mode* is disabled, this will be considiered as a fatal error:

![Fatal Errors](/images/the-essence-of-animation-nodes-the-system/fatal-error.png)

If the error is caused by you (as in the example above), once resolved, press *Retry*  to refresh AN. If you are unsure which node is causing the error, you can try switching to *Monitor Execution* in the *Developer* panel, it will display the name of the node that causes the error, which is the expression node in the example above.

![Fatal Errors](/images/the-essence-of-animation-nodes-the-system/monitor-execution.png)