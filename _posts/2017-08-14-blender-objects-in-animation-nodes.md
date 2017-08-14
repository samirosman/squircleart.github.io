---
title: Blender Objects In Animation Nodes
layout: post
category: Animation-Nodes
image: "/images/blender-objects-in-animation-nodes/wall.png"
description: Objects are the building blocks of every scene, the creation and duplication
  of such objects can be automated using Animation Nodes, to make the most out of
  these automations, we have to study blender's objects, and that's what we will be
  doing in this tutorial.
prerequisites:
- text: Basic experience in Blender.
- text: Good knowledge of Animation Nodes.
---

The following section explains the object-data in blender in general, so if you already know how this works, feel free to skip  to the Animation Nodes section.

## What is a Blender Object? 
An object in blender is a container, this container have some properties that are shared between all objects like location, rotation, scale, visibility, pass index and many more.

The container also carry some data called *Object Data*, this data can be:
- A mesh composed of vertices, edges and polygones.
- A curve composed of vertices and handles .
- A text composed of characters.
- And many more.

When you are in *object mode*, anything you edit changes the object properties and not their data, as soon as you enter the *edit mode*, you are now editing the object data and not the objects themselves. So if multiple objects share the same data block, changes to one of them are reflected on all others.

### Example 1

![Example 1](/images/blender-objects-in-animation-nodes/example1.png)

I added new object of type *Mesh*, a mesh data called `Cube` was created and it include the vertices, edges and polygons of a cube. I then duplicated the cube one time (using <kbd>Shift</kbd> + <kbd>D</kbd>), a new *Mesh* object was created and its mesh data became a copy of the original mesh data called `Cube.001`. Changes to the data of one of the objects aren't reflected to the other.

### Example 2

![Example 2](/images/blender-objects-in-animation-nodes/example2.png)

I added new object of type *Mesh*, a mesh data called `Cube` was created and it include the vertices, edges and polygons of a cube. I then **linked** duplicated the cube one time (using <kbd>Alt</kbd> + <kbd>D</kbd>), the new object now contains the same mesh data of the original object and thus changes to the data of one of the objects are reflected to the other object. Notice that the mesh data `Cube` has 2 users now (2 objects that are using it), you see the number of users beside the name of the mesh data.

## Objects In Animation Nodes

There is a single node that can create objects in Animation Nodes and that node is the [Object Instancer Node](https://animation-nodes-manual.readthedocs.io/en/latest/user_guide/nodes/object/object_instancer.html).

Run blender because I want you to try couple of stuff with me. First thing to do is to add an object instancer and disable *Copy From Source* option. The node now lets you choose the type and number of the objects that you want to create.

![Object Instancer](/images/blender-objects-in-animation-nodes/object_instancer.png)

I will be creating 5 objects of type *Mesh*, as soon as I execute the node tree, 5 objects will be created and you can see them under the **Animation Nodes Object Container** which is an empty that is parent to all objects created in Animation Nodes. This parent help AN keep track of and manage objects created in it's node trees. You will also notice that the mesh data of those objects are just empty meshes, and they are waiting for us to fill them with some data.

![Instancer Example 1](/images/blender-objects-in-animation-nodes/instancer_example1.png)

There is a node in Animation Nodes that does exactly what we want, it is the [Mesh Object Output Node](https://animation-nodes-manual.readthedocs.io/en/latest/user_guide/nodes/mesh/mesh_object_output.html) and it simply write the given mesh data to the existing mesh data in the object. So we can do something like that to write the data of an icosphere to all of our 5 objects.

![Instancer Example 2](/images/blender-objects-in-animation-nodes/instancer_example2.png)

The *Mesh Object Output Node* can also edit only one component of the mesh data, for instance, if I am only chaging the vertices locations, then I don't need to write polygons and edge info and thus I can use the *Vertices Only* option:

![Instancer Example 3](/images/blender-objects-in-animation-nodes/instancer_example3.gif)

Alternatively, we could approach the above problem by chaging the mesh data block of each of the newly created objects to an existing one. This can be achieved using the [Copy Object Data Node](https://animation-nodes-manual.readthedocs.io/en/latest/user_guide/nodes/object/copy_object_data.html), the node simply assign the mesh data of the *from* object to the *to* object. Notice that the number of users is now 6 because we have 5 object using it plus the original owner.

![Instancer Example 4](/images/blender-objects-in-animation-nodes/instancer_example4.png)

The above example is actually what the *Object Instancer node* do when the *Copy From Source* option is enabled. And it is also similar to *Linked Duplication* in blender.

![Instancer Example 5](/images/blender-objects-in-animation-nodes/instancer_example5.png)

If you want to copy the transfroms, modifiers and constraints of the objects as well, you can enable the *Copy Full Object* option.

{% include note.html content="Notice that particles systems and physis data are actually modifiers so they are copied as well if Copy Full Object is enabled." %}

If you want to copy the mesh data instead of using it directly you can enable *Deep Copy* option.

## Example1a

![Example 1a](/images/blender-objects-in-animation-nodes/example1a.png)

We sample the locations of the alive particles, then we instance an icosphere and place the instances inplace of the particles. But this is boring, lets do something more exiting.

## Example2a

![Example 2a](/images/blender-objects-in-animation-nodes/example2a.png)

In this example we used a group of objects containing suzanne, cylinder and an icosphere to create a bigger list of objects that contain the previously mentioned objects in random order and amounts. We then used this list as our *from* object in copying the mesh data. Resulting in random object per particle.

{% include note.html content="There is a much more efficient way to do the last two examples but we won't conver them in thus post."%}

## Example3a

![Example 3a](/images/blender-objects-in-animation-nodes/example3a.png)

Of course other type of objects can be used like texts which we can edit their data using the *Text Object Output* node. I encourage you to try the *Curve Object Output* node as well using curve objects.