---
title: "The Essence Of Animation Nodes: Preface"
layout: post
image_path: /images/the-essence-of-animation-nodes.png
description:  "We talk about Animation Nodes and get ready to start the tutorial series"
---

## Animation Nodes

**[Animation Nodes](https://github.com/JacquesLucke/animation_nodes)** is a blender addon which was meant to be a node based visual scripting system designed for motion graphics integrated into blender or this is how its creator---**Jacques Lucke**---described it at the time. However, for me, Animation Nodes was and is more than just a system for creating motion graphics.

### Applications

Animation Nodes is a complete **Framework** for creating almost everything in blender. Animation Nodes can be a helpful assistant for artists by providing an interactive and intuitive system for:

* Controling objects' properties in a property driven manner. For instance, controling the location of an object based on its rotation.
* Automating modeling procedure. For instance, distributing hundreds of strawberry's seeds on its own surface.
* Procedural modeling and parametric design. For instance, modeling a rock and randomizing its shape.
* Procedural Animations. For instance, modeling sophisticated animated paths that can be described using a mathematical model.

The previouse applications is as far as artists are concerned. However, some people like TDs such as myself are intersted in more advanced applications and uses for Animation Nodes which yield some intersting tools that artists can use.

**Engineers**, **Scientists**, **Mathematician** and **Students** like to have a *Numerical computing software* such as [Matlab](https://en.wikipedia.org/wiki/MATLAB)  or [Octave](https://en.wikipedia.org/wiki/GNU_Octave)  which is basically a program that provide them with tools to do *Numerical analysis*, *Statistical studies*, *Plotting*, etc.
Being a student myself, I didn't really need any of these programs because Animation Nodes was more than suffecient for my study.

### What can be done?

You might be thinking, **"Animation"** Nodes is a tool to make ... well, animations. And this is a common misconception.

Let me tell you that Animation Nodes is in fact somewhat not capable of doing animations. As we said before Animation Nodes can be used to control objects' properties based on some other properties and we can utilize this to animate, that is, controling objects properties based on time and that we call a **Function of time** .
I am telling you this because I want to change your idea about the capabilities of Animation Nodes and to be more open minded about the possibilities here.

I have been using Animation Nodes for almost 8 months now. And I want you to take my word for it:

>We can create anything and everything in Animation Nodes and the only limitations is the limitation of your imagination and creativity.

However, some of your implementation will run very slow and thus be considred a failed implementations and this is because of python and blender that are slow sometimes. So it is probable that you will spend an hour making the actual implementation and another 11 hours optmizing it.

But let me assure you, we are doing every thing in our disposal to boost the performance of Animation Nodes and there are some ongoing projects to do so.

## The Essence Of Animation Nodes

The essence of Animation Nodes will be a tutorial series of an undefined length to get you going with problem solving using Animation Nodes. And we will do that be giving a handful of examples.

### A bit of history

Artists started complaining that there is no documentation for Animation Nodes as soon as it was released, So we created the documentation ---Half of the [Documentation](https://animation-nodes-manual.readthedocs.io/en/latest/)  is already up and the rest is already done but not yet reviewed or uploaded, but it should be all there by the end of March.
After that till now people started to complain about the lack of tutorials. And there was already lots of tutorials already in:

* [Jacques Lucke's youtube channel](https://www.youtube.com/channel/UC5ABAuGEvBMmau-1xJsNw6w)
* [Jimmy Gunawan blog and youtube channel](blendersushi.blogspot.com)

But that wasn't enough for them either. So in this series I am going to teach you everything you should know to set off on your own and save you a month you would have spended in getting your head around Animation Nodes.

### How I learned it?

Obviously I had to learn the basics somewhere and that was **Jacques's** and **Jimmy's** tutorials, I studied their tutorials for 2 days and set off to learn on my own. I just started creating and creating till I got the hang of it.

You see, The nodes itself doesn't really need an explination. For instance, the **Vector Distance node**:  what do you think it does?
Yep you guessed it, It return the distance between 2 vectors and the inputs are 2 vectors and the output is the distance. But again there is the documentation, so if something wasn't that clear, there is no shame in looking at it.

Some other nodes like the **Barycentric Transformation** node are may be hard to figuer out what it does, but this isn't a lack of information about what the node does, It is a lack of infomation on your side. Because barycentric transformation is a mathematical operator that if you understand you will understand the node, and understanding that operator is as easy as a googling the name. But we also included a small demonstrations and illustrations that explains the underlying mathematical concepts behind nodes.

### What will we be doing?

The actual learning itself lies in the process of trying, failing and gaining experience. And you won't need any documentation or any tutorial to do so. Rather no documntation nor tutorials will give you that knowledge and experience.

Most of what we will be doing is just **creativity** at solving problems. As artists like to think about it, The **harmony** between independent nodes result the inovation and not the individual nodes themselves. So learning what nodes does won't make you better in solving problems.

As I said, we will be giving a lot of examples, and in those examples you might see me using the fundamental nodes to do some operation that can be done easily using an existing node, and this is not because I am reinventing the wheel, I just want you to see the gears and wheels behind those nodes and emphasize on the fact that Animation Nodes doesn't lack "nodes" and you can create everything youself.

### What will you be doing?

Learning what I will teach you in those tutorials isn't going to help you solve problems unless you apply and challenge youself to do some similar or more creative applications.

So every once in a while, you will find some thing like this:

{% include challenge.html content="This is a challenge I give to apply for what you have learned and gain experience." %}

The challenges will be relatively easy and related to the subject we are studying, however, if you couldn't do the challenge yourself, just wait for the implimentation that will be done every once in a while for the previouse challenges.

## Acknowledgement

I want to specificly thank:

* **Jacques Lucke** - The creator of Animation Nodes, I really hope he get to be a blender developer because he will make the software Awesome. (As if he haven't already)
* **Jimmy Gunawan** - A first class noder who helped me when I started and a guy who has the creativity do cool procedural stuff using nodes everyday!
* **Friends** - Who gave me challenges to improve myself

## Getting Ready

Enough talking for now. Lets start making.

Obviously we will need Animation Nodes, Blender and some python modules to do anything.

### Installing Animation Nodes

*  Download and Install blender from [here](https://www.blender.org/download/).

*   Clone Animation Nodes to your blender addons directory:

In linux:

~~~python

cd "Your blender addons directory"
git clone "https://github.com/JacquesLucke/animation_nodes.git"

~~~

{% include note.html content="Make sure to have installed git first ." %}

* Install numpy python module from your package manager or Pip or other methods if you don't have it.

{% include note.html content="At the time of making this series, ANimation nodes 1.6 was used" %}
