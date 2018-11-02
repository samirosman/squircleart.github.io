---
title: 'The Essence Of Animation Nodes: Preface'
layout: post
image: "/images/the-essence-of-animation-nodes-preface/the-essence-of-animation-nodes.png"
description: In this first part of the series, we will talk about Animation Nodes
  and get ready for the tutorial series.
category: Animation-Nodes
next_part: "/animation-nodes/the-essense-of-animation-nodes-the-system.html"
---

## Animation Nodes

**[Animation Nodes](https://github.com/JacquesLucke/animation_nodes)** is a blender addon which was meant to be a node based visual scripting system designed for motion graphics integrated into blender, or this is how its creator--**Jacques Lucke**--described it at the time. However, for me, Animation Nodes was and is more than just a system for creating motion graphics.

Animation Nodes is often denoted using the two upper case letters "AN" so don't get confused if I used this notation throughout my posts.

### Applications

Animation Nodes is a complete **Framework** for creating almost everything in blender. Animation Nodes can be a helpful assistant for artists by providing an interactive and intuitive system for:

- Controlling objects' properties in a property driven manner. For instance, controlling the location of an object based on its rotation.
- Automating modeling procedures. For instance, distributing hundreds of strawberry's seeds on a mesh's surface.
- Procedural modeling and parametric design. For instance, modeling a rock and randomizing its shape.
- Procedural Animations. For instance, modeling sophisticated animated paths that can be described using a mathematical model.

The previous applications is as far as artists are concerned. However, some people like TDs, such as myself, are interested in more advanced applications and uses for Animation Nodes which yields some interesting tools that artists can use.

*Engineers*, *Scientists*, *Mathematicians* and *Students* like to have a *Numerical computing software* such as [Matlab](https://en.wikipedia.org/wiki/MATLAB)  or [Octave](https://en.wikipedia.org/wiki/GNU_Octave)  which is basically a program that provides them with tools to do *Numerical analysis*, *Statistical studies*, *Plotting*, etc.
Being a student myself, I didn't really need any of these programs because Animation Nodes was more than sufficient for my study.

### What can be done?

You might be thinking, "Animation" Nodes is a tool to make ... well, animations, and this is a common misconception.

Let me tell you that Animation Nodes is in fact somewhat not capable of doing animations. As we said, before Animation Nodes can be used to control objects' properties based on some other properties and we can utilize this to animate, that is, controlling objects properties based on time and that we call a **Function of time**.
I am telling you this because I want to change your idea about the capabilities of Animation Nodes so you can be more open minded about the possibilities here.

I have been using Animation Nodes for almost 8 months now. And I want you to take my word for it:

>We can create anything and everything in Animation Nodes and the only limitations is the limitation of your imagination and creativity.

### History of Animation Nodes

Animation Nodes was first release in October 2015 but it hadn't gained its popularity till version `1.6` which was released in Jun 2016. At that point Animation Nodes was fully featured and very useable but it was not very artist friendly. That's when version `2.0` came, this version was a game changer, some parts of Animation Nodes were rewritten in a programming language called *Cython* which resulted in two things:

- General speed up for Animation Nodes which is up to 400x in some nodes.
- Animation Nodes became compiled and operating system specific, which means that you can no longer grab the source from *Github* and expect it to work. You will have to download a build specific for your operating system.

Version `2.0` also introduced high level objects called **Falloffs** and socket vectorization which made Animation Nodes very artist-friendly and easy to use.

Since then, Jacques has been actively developing Animation Nodes making it easier, faster and more efficient.

### Important Links

- [Animation Node's Github Reposatory.](https://github.com/JacquesLucke/animation_nodes)
- [Animation Node's Release Page.](https://github.com/JacquesLucke/animation_nodes/releases)
- [Animation Node's Documentation.](http://animation-nodes-manual.readthedocs.io/en/latest/)

## The Essence Of Animation Nodes

The essence of Animation Nodes will be a tutorial series of an undefined length to get you going with problem solving using Animation Nodes. And we will do that by giving a handful of examples.

In this series I am going to teach you everything you need to know to set off on your own, it should be noted that I won't go into the details of creating something specific, I will just be giving you the essence of it through examples, and by doing that save you a month you would have spent in getting your head around Animation Nodes.

### How I learned AN?

Obviously I had to learn the basics somewhere and that was **Jacques's** and **Jimmy Gunawan's** tutorials, I studied their tutorials for 2 days and set off to learn on my own. I just started creating and creating till I got the hang of it.

There are always two aspects you have to look at when learning a new system, there is the *general knowledge* of the subject which is in our case the basics of mathematics and computer graphics, and there is the the *system specific knowledge*, that is, to know how to operate the system of Animation Nodes. It is essential that you learn both the general and system specific knowledge concurrently, because they mutually improve and support each other.

### What will we be doing?

The actual learning itself lies in the process of trying, failing and gaining experience. And you won't need any documentation or any tutorial to do so. Rather, no documentation nor tutorials will give you that knowledge and experience.

As I said, we will be giving a lot of examples, and in those examples you might see me using the fundamental nodes to do some operations that can be easily done using an existing node, and this is not because I am reinventing the wheel, I just want you to see the gears and wheels behind those nodes and emphasize on the fact that Animation Nodes doesn't lack "nodes" and you can create everything yourself.

## Acknowledgement

I want to specifically thank:

* **Jacques Lucke** - The developer of Animation Nodes and the guy who taught me everything I know about computer science.
* **Jimmy Gunawan** - A first class noder who helped me when I started, and a guy who has the creativity do cool procedural stuff using nodes everyday!
