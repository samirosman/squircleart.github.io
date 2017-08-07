---
title: 'The Essence Of Animation Nodes: Scripts'
layout: post
category: Animation-Nodes
image: "/images/the-essence-of-animation-nodes.png"
description: In this tutorial, I am going to introduce you to script nodes in Animation
  Nodes and Blender Python API.
prerequisites:
- text: Basic knowledge of Animation Nodes.
  url: https://squircleart.github.io/animation-nodes/the-essense-of-animation-nodes-the-system.html
- text: Very Basic knowledge of python.
---

You don't have to know python in order to understand this tutorial, however, it is recommended that you know the basics like I do.

# Script Node

Animation Nodes contains a lot of nodes, some nodes process data like *Math* nodes and some others communicates with blender like *Object Transform Output* which tells blender objects are located. More sophisticated node trees can be created using those fundamental nodes that AN provides.

However, you may encounter a situation where you need a feature(node) that is not in Animation Nodes already and you can't create it using provided nodes (Such situations is usually when you try to communicate with blender), you have couple of options:

- You can contact the developer to see if it can be added in a future release. You can do that through [Github issues](https://github.com/JacquesLucke/animation_nodes/issues/new).
-  You may create a new node, the process of creating new node is described in the [documentation](http://animation-nodes-manual.readthedocs.io/en/an2/dev_guide/index.html).
-  You may use the script node, which enables you to write python scripts and execute it as a subprogram.

## Example 6.1

![Example1](/images/the-essence-of-animation-nodes-scripts/example_6.1.png)

### Demonstration

Just like any subprogram, script node has inputs and outputs which are defined on the same node. When I add an input, a variable is created with its value, so in this example, it is like we wrote this script:

~~~python

x= 1
y= 2

~~~

Consequently, input names follow the same rules as Python, that is, the name should start with a letter or an underscore, it can't start with numbers or you will get a fatal error. You can't name it like python operators, for instance, it can't be named `if` or `while`.

The script node will then return the values of the variable `result` which I defined as `x+y`, so the script basically add two numbers and return the result.

# Python API

There exist a python API (Application Programming Interface) that lets you communicate with blender, it can be found [here](https://docs.blender.org/api/2.78b/). To be able to understand the API, lets open the console and see what the `bpy` module contains. Using auto complete, blender lists possible choices. `bpy` includes:

~~~python

bpy.
	app
	context
	data
	ops
	path
	props
	types
	utils

~~~

When it comes to Animation Nodes, we are only interested in `data` and may be `context` for some limited cases:

- **data** include all the data in the blend file, you can use it to access and write data to blender. For instance, you can write and read pixel data of an image.
- **context** include data that is represented in current working area. It is access only, you can't write using it. For instance, selected objects are data that is defined in the 3D viewport. Those data are subjected to context limitations, so sometimes you won't be able to access this data unless you are in the right area. Also, it should only be used when you don't plan to run this script during rendering as this can lead to problems.

Having chosen `data`, lets see what it contains:

~~~python

py.data.
	actions
	armatures
	brushes
	cameras
	curves
	fonts
	grease_pencil
	groups
	images
	objects
	...

~~~

As you may see, we have all the data types, but we are mostly interested in `objects` as it include all the data of our objects, `objects` lists all objects in the blend file, you can choose or sample an object by its name or index as follows:

~~~python

bpy.data.objects[0]
bpy.data.objects['Cube']

~~~

Both of them sample the first object which is named "Cube". The object includes:

~~~python

bpy.data.objects['Cube'].
	color
	active_material
	constraints
	dimensions
	location
	matrix_world
	...

~~~

And if I want to sample the color of the object and store it in a variable, I could just write the following code:

~~~python

color = bpy.data.objects['Cube'].color
#Since "color" include RGBA channels:
color[0]   #Red value
color[1]   #Green value
color[2]   #Blue value
color[3]   #Alpha value

~~~

You probably get it by now, to access some data, we carefully follow its location in the `data` section of the API.

## Example 6.2

![Example2](/images/the-essence-of-animation-nodes-scripts/example_6.2.gif)

### Demonstration

Scripts node are not always needed, if your script can be written inline, then use the expression node directly.

{% include note.html content="Notice that the output of the node is not actually a color data type, so I disabled auto type correction and output it as if it was a color after the output was converted to a color. This is a bad practice, but it works sometimes." %}

## Example 6.3a

![Example3a](/images/the-essence-of-animation-nodes-scripts/example_6.3a.png)

~~~python

Image = bpy.data.images["AN_Image"]
Image.pixels = Pixels

~~~

### Demonstration

In this example, I am writing pixel info to an image. Blender accepts the pixel info as a list of floats with the pattern RGBARGBARGBA.... it means the first float is the red value if the first pixel, second is green for the first pixel, third is blue for the first pixel, fourth is the alpha for the first pixel, fifth is the red value for second pixel, and so on. So, the node expects a float list with length $W \times H \times 4$ where $W,H$ are the width and height of the image respectively.

I generated a list of floats that goes from zero to one with 40000 float because my image is $100 \times 100$. This will produce some kind of vertical-horizontal gradient, but lets do something more useful.

{% include note.html content="Notice that we didn't have to import the bpy, that's because it is imported already along with some other modules." %}

## Example 6.3b

![Example3b](/images/the-essence-of-animation-nodes-scripts/example_6.3b.png)
![Example3b](/images/the-essence-of-animation-nodes-scripts/example_6.3b.gif)

~~~python

Image = bpy.data.images["AN_Image"]
Image.generated_width = Width
Image.generated_height = Height
Image.pixels = Pixels

~~~

### Demonstration

In this example, I made it possible to change the width and height of the image. I also created a loop that compute a spherical gradient, which is created as follows:

- Compute the coordinates of each pixel using what we learned from the [procedural modeling tutorial](https://squircleart.github.io/animation-nodes/the-essence-of-animation-nodes-procedural-modeling.html#algorithm-1).
- Remape the domain into the range of $$[-1,1]$$ in both axis.
- Use pythagoras theorem to compute the gradient.
- Create a list with the distance in first three elements and 1 in the forth. Because we want to keep alpha at 1 and the result to be a greyscale image for the gradient.

{% include challenge.html content="Can you get the pixel info from another image, edit those info somehow and then write pixels back to an image?" %}