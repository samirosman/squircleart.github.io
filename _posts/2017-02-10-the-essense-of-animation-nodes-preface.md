---
title: 'The Essence Of Animation Nodes: Preface'
layout: post
image: "/images/the-essence-of-animation-nodes-preface/the-essence-of-animation-nodes.png"
description: In this first post in the series, we will talk about Animation Nodes and get ready for the tutorial series.
category: Animation-Nodes
next_part: "/animation-nodes/the-essense-of-animation-nodes-the-system.html"
---

## Animation Nodes

**[Animation Nodes](https://github.com/JacquesLucke/animation_nodes)** is a blender addon which was meant to be a node based visual scripting system designed for motion graphics integrated into blender or this is how its creator---**Jacques Lucke**---described it at the time. However, for me, Animation Nodes was and is more than just a system for creating motion graphics.

### Applications

Animation Nodes is a complete **Framework** for creating almost everything in blender. Animation Nodes can be a helpful assistant for artists by providing an interactive and intuitive system for:

* Controlling objects' properties in a property driven manner. For instance, controlling the location of an object based on its rotation.
* Automating modeling procedure. For instance, distributing hundreds of strawberry's seeds on its own surface.
* Procedural modeling and parametric design. For instance, modeling a rock and randomizing its shape.
* Procedural Animations. For instance, modeling sophisticated animated paths that can be described using a mathematical model.

The previous applications is as far as artists are concerned. However, some people like TDs such as myself are interested in more advanced applications and uses for Animation Nodes which yield some interesting tools that artists can use.

*Engineers*, *Scientists*, *Mathematician* and *Students* like to have a *Numerical computing software* such as [Matlab](https://en.wikipedia.org/wiki/MATLAB)  or [Octave](https://en.wikipedia.org/wiki/GNU_Octave)  which is basically a program that provides them with tools to do *Numerical analysis*, *Statistical studies*, *Plotting*, etc.
Being a student myself, I didn't really need any of these programs because Animation Nodes was more than sufficient for my study.

### What can be done?

You might be thinking, **"Animation"** Nodes is a tool to make ... well, animations. And this is a common misconception.

Let me tell you that Animation Nodes is in fact somewhat not capable of doing animations. As we said before Animation Nodes can be used to control objects' properties based on some other properties and we can utilize this to animate, that is, controlling objects properties based on time and that we call a **Function of time** .
I am telling you this because I want to change your idea about the capabilities of Animation Nodes and to be more open minded about the possibilities here.

I have been using Animation Nodes for almost 8 months now. And I want you to take my word for it:

>We can create anything and everything in Animation Nodes and the only limitations is the limitation of your imagination and creativity.

However, some of your implementation will run very slow and thus be considered a failed implementations and this is because of python and blender that are slow sometimes. So it is probable that you will spend an hour making the actual implementation and another 11 hours optimizing it.

But let me assure you, we are doing every thing in our disposal to boost the performance of Animation Nodes and there are some ongoing projects to do so.

{% include note.html content="Jacques---AN developer--- already boosted the performance of AN in AN 2.0 tremendously. Recent benchmarks found that it is faster by 200x in maths and 400x faster in number generation." %}

## The Essence Of Animation Nodes

The essence of Animation Nodes will be a tutorial series of an undefined length to get you going with problem solving using Animation Nodes. And we will do that be giving a handful of examples.

### A bit of history

Artists started complaining that there is no documentation for Animation Nodes as soon as it was released, So we created the [documentation](animation-nodes-manual.readthedocs.io/en/an2/).
After that till now people started to complain about the lack of tutorials. And there was already lots of tutorials in:

* [Jacques Lucke's youtube channel](https://www.youtube.com/channel/UC5ABAuGEvBMmau-1xJsNw6w)
* [Jimmy Gunawan blog and youtube channel](blendersushi.blogspot.com)

So in this series I am going to teach you everything you should know to set off on your own and save you a month you would have spent in getting your head around Animation Nodes.

### How I learned it?

Obviously I had to learn the basics somewhere and that was **Jacques's** and **Jimmy's** tutorials, I studied their tutorials for 2 days and set off to learn on my own. I just started creating and creating till I got the hang of it.

You see, The nodes itself doesn't really need an explanation. For instance, the **Vector Distance node**:  what do you think it does?
Yep you guessed it, It return the distance between 2 vectors and the inputs are 2 vectors and the output is the distance. But again there is the documentation, so if something wasn't that clear, there is no shame in looking at it.

Some other nodes like the **Barycentric Transformation** node are may be hard to figure out what they does, but this isn't a lack of information about what the node does, It is a lack of information on your side. Because barycentric transformation is a mathematical operator that if you understand you will understand the node, and understanding that operator is as easy as a googling the name. But we also included a small demonstrations and illustrations that explains the underlying mathematical concepts behind nodes.

### What will we be doing?

The actual learning itself lies in the process of trying, failing and gaining experience. And you won't need any documentation or any tutorial to do so. Rather no documentation nor tutorials will give you that knowledge and experience.

Most of what we will be doing is just **creativity** at solving problems. As artists like to think about it, The **harmony** between independent nodes result the innovation and not the individual nodes themselves. So learning what nodes does won't make you better in solving problems.

As I said, we will be giving a lot of examples, and in those examples you might see me using the fundamental nodes to do some operation that can be done easily using an existing node, and this is not because I am reinventing the wheel, I just want you to see the gears and wheels behind those nodes and emphasize on the fact that Animation Nodes doesn't lack "nodes" and you can create everything yourself.

### What will you be doing?

Learning what I will teach you in those tutorials isn't going to help you solve problems unless you apply and challenge yourself to do some similar or more creative applications.

So every once in a while, you will find some thing like this:

{% include challenge.html content="This is a challenge I give to apply for what you have learned and gain experience." %}

## Acknowledgement

I want to specifically thank:

* **Jacques Lucke** - The creator of Animation Nodes, I really hope he get to be a blender developer because he will make the software Awesome. (As if he haven't already)
* **Jimmy Gunawan** - A first class noder who helped me when I started and a guy who has the creativity do cool procedural stuff using nodes everyday!
