---
title: "The Essence Of Animation Nodes: The system"
layout: post
image_path: /images/the-essence-of-animation-nodes.png
description:  "We look at AN's system and the different execution methods as well as errors"
category: Animation-Nodes
---

We will start this series by explaining the system of AN and the available
options to control this system.

# Execution

Animation Nodes take the node tree you created and convert it to a python code and then run that code to see the result of your node tree.

There is multiple routines and methods AN can follow to run the code and we are going to look at those options now. And that is using this simple example of a node tree that sum 2 integers and display that result.

![Example](/images/the-essence-of-animation-nodes-the-system/execution.gif  "Example")

First, you may have noticed that some numbers are changing very rapidly, and this is the **Execution Time** which is basically the time that AN took to convert and run the node tree and it is usually measured in milliseconds.

## Execution methods:

By default, Auto execution is enabled, which does what it says, it automatically executes the node tree based on a specific rules you specify. and those rules are specified in the panel which include:

### Always:

It is enabled by default and it constantly and successively runs the node tree in spite of the context and space you are in or using.

This option is accompanied by a property called **Min Time Difference** which is the slider you see in the panel, which basically runs the node tree every t second where t is that property.

This option consumes the CPU and thus it slow down every other process that is taking place, and you might notice blender lagging because of this.

It doesn't really make sense to keep running the node tree even if you aren't changing anything in it.
So you really shouldn't be using that node except for some limited situations which is the situation where all other options fails to do the job that it is required to do, and we will give an example for that at the end.

### Tree Changed:

This option will run the node tree whenever you add or remove a node to the current node tree.

And this is probably why you should enable it after disabling **Always** because it is probable that you will need AN to update every time you change your node tree.

![Tree Changed](/images/the-essence-of-animation-nodes-the-system/tree-changed.gif  "Tree Changed")

Notice how the time changed (which means AN runs) when I added another node.

### Frame Changed:

This option runs the node tree whenever the current frame change.

When we get to animating using AN, it is probable that we will need to run the node tree every time the frame changes (Animation is played) because the whole node tree depends on the variable **Current Frame**.

Animation Nodes won't know that the frame changes unless you tell it to watch for frame change and this is done by enabling this option. So make sure to check this option whenever you are animating.

![Time Changed](/images/the-essence-of-animation-nodes-the-system/frame-changed.gif  "Time Changed")

Notice how the node tree runs whenever the frame change.

### Property Changed:

This option runs the node tree whenever you change a value inside a node manually. If you plugged the time info node to one of the inputs and played the animation the node tree won't update because you have to manually edit the inputs.

And this is also probably why you should enable it after disabling **Always** because it is probable that you will need AN to update every time you change a value in the node tree.

![Property Changed](/images/the-essence-of-animation-nodes-the-system/property-changed.gif  "Property Changed")

Notice how the node tree runs whenever I change a value.

### Triggers:

Now you might be wondering, what if we wanted to run the node tree if an external property other than the frame changed. For instance, the location of an object, its draw options, or even its name.

This isn't the situation where you would start using **Always**, there is still another very neat feature we haven't looked at, And that is ... Triggers.

Triggers are basically "watchers" that are hired by you to watch for a change in some property you told them to watch and they don't report to you but rather AN so that it can run whenever they spot a change.

Lets look at an example where we are to watch for a change in an object's location so that we can get an up to date information about its location using the *Object Transforms Input* node.

![Triggers](/images/the-essence-of-animation-nodes-the-system/triggers.gif  "Triggers")

You can see that I added a trigger that watch for a change in an object property and chose the object to watch---Cube---and typed the **Data Path** for the property I want to watch for, in this case it was *"location"*.

To get the data path for any object property, just hover it and press <kbd>Shift</kbd>+<kbd>Ctrl</kbd>+<kbd>C</kbd> which will copy the *ID Data Path* for that property which you can then paste into the field for the data path.

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

This can be done by choosing **Scene** instead of **Object** when adding the trigger. But getting the data path for such properties just got harder, because you have to define which context the property is in, and the best way to do so is by checking the ID path from the the **data-block** data base like so:

![Data Path](/images/the-essence-of-animation-nodes-the-system/data-path.png  "Data Path")

Examples:

~~~python

render.resolution_x
#Notice that the original one was:
bpy.data.scenes["Scene"].render.resolution_x
#But the first part was omited
#because scene was already defined in the trigger.

#Notice how we defined the group first
#before defining the node the socket.
bpy.data.node_groups["Shader Nodetree"].nodes["Background"].inputs[1]

bpy.data.objects["Cube"].modifiers["Subsurf"].levels

~~~

### When to use Always?

Always is what I consider a last resort for most of the applications, when everything fails to make the running at the right time, I use always.

Consider the scenario where we have tenths of objects that we are using the location of each one in our node tree, adding a trigger for every object will be a tedious and inefficient job, So we use **Always** in this situation instead.

Another situation where **Always** is in fact a very good solution is simulations and especially ones that are iterative like PDEs where I want to see the simulation in real time and let it run as fast as possible.

You may also witness some speed up when using **Always** which I have noticed during my work, but I am not entirely sure if this is an actual thing.

### Manual Execution:

Last but not least, the **Execute note tree** button which just run the node tree when you press it.

I usually use that while disabling **Auto execution** when I am working on a risky node tree that may return some fatal errors or when I am doing an operator that only need to run once.

---

You should now be aware of what works the best for you and the project you are working on when it comes to the optimal execution method.

Let's now look at errors that you may encounter while working on your projects.

## Errors

We will divide the errors into couple of types and look at why they are there and how to solve them.

### Non fatal Errors:

Those errors happen at individual nodes and doesn't affect the rest of the tree and it doesn't stop its execution.

#### Example:

![Non fatal Errors](/images/the-essence-of-animation-nodes-the-system/nonfatal-errors.png  "Non fatal Errors")

Most of these errors are just errors caused by nodes for obvious reasons and they are easy to fix. I am guessing you know how to fix that error, don't you?

### fatal Errors:

Those are nightmares, they are designed to wake you at night.

They stop the whole node tree from executing and won't run till you fix them. Some of them even need to restart blender after fixing the problem.

They happen due to an error in the python code of the nodes itself which probably happens when you try to do something with the node that the developers didn't consider, but AN is smart and avoids almost all of those complications. This may also happen when you try to code something yourself that isn't really right.

AN will display a red border and stop executing and tells you to report this bug to the developers, because it is probably is, so report when ever this happens to you.

I don't really have an example now to show you how it happen or how to fix it, but we may encounter some of these on our way. So don't worry, I will show you a fatal error before we finish this series.
