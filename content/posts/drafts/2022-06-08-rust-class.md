+++
title = "Learning Rust: Academia Edition"
date = 2022-06-08
draft = true
+++


## Background

Before I start, it's worth noting that I'm a really lucky student. I was able to take AP CS in high school, CS classes across 2 schools (thanks, transfer!). I've also been neck-deep in software for a while: I taught myself ObjC, Swift, and web dev in high school. Rust-wise, I'd been following [Bryan Cantril][0]'s talks for a while, as well as the ever-loved [Jon Gjengset][1]. I made a [small contribution][2] to Rustlings, and worked on [a side project][3].

This all means that entering CSCI 541, "Advanced Programming Skills Rust" last semester, I already had an innate fear of the borrow checker, and an understanding that Rust was going to be difficult in ways I didn't expect, but also a real want to learn Rust.

## Class Overview

My professor, Prof Matthew Fluet (Hi, if you're reading!) is a fantastic PL professor with a true passion for teaching. PL, of course, raising a small, lambda-shaped warning flag in my head[^1] that this course might be more functional-oriented than most would teach. (Which, given Rust's powerful closures, is not a bad perspective to bring.)

The course layout was structured in three basic blocks:
1. An intro section, covering mutability, the borrow checker, and daily Rust-isms
1. A deep dive into Fn's, iterators, async, and channels
1. Unsafe, etc., and a group project

Each topic was (mostly) matched to a corresponding assignment. But before I get into that, I want to discuss the inherent limitations of classroom language-learning.

## Academia vs. Stack-overlflowia

The best part about learning a language on your own is not the freedom of picking the easy topics. Rather, it's the necessity of solving the hard problems one at a time.

When I was working on [calcdnd][3], I had organic questions:
- _What's the struct syntax?_
- _How do I represent kinda-sorta-global state?_
- _I need some parsing... oh, `match` is cool._
- _How do I save stuff to disk? `serde!` Oh crap, and read it again? `... serde!`_

And most importantly (as with any self-taught method), questions were either in two buckets: _why is this happening_, or _how do I get X to happen_ -- with no knowledge of the "right" way to do something, so long as it works.

The condition of academia is that you don't get to choose this pace. Most constructs are presented as fact, most problems framed carefully. You only have so much time before the next cumulative assignment is due. This means that what constitutes a "hard" or "confusing" topic can vary day-to-day. Programming languages in particular are difficult to teach for this reason: half the class might have used Haskell, so passing closures around is second-nature, and yet the other half may use C, where hyper-specific datatypes are the norm -- but both groups might struggle with the opposite paradigm.

> At UW, I taught a six-week workshop on _Intro to iOS_ with the club [Dubstech][4][^2]. Some questions were predictable: "how do you do X like in Java", "why is the for loop werid". But other times, there's always someone who asked a left-field question: "Is Swift statically typed, or dynamic?". I mean, statically typed, sure. But after two workshops on the _super_ intro stuff, it was a blunt reminder that I had to be extremely careful not to tip the scales too far towards the beginners, or too far away towards those with a deep background.

> Similarly, when I went to visit my high school, my old math teacher pulled me aside to give me a notable quote: "Half this
class is ahead of chapter 15, the other half is behind chapter 15. I don't know who's left with me!"

The other issue at hand is correctness. Idiomatics aside, assignments can have hidden roadblocks for certain implementations, in a way that "real-world" problems tend to not have. This is especially challenging for a Rust class, as this limitation is in Rust itself, re: ownership.

Lectures and concepts aside, how did this translate into assignments?


## Assignments and Assessments

These were _rigorous_.

This was both the best and worst part of the class for me. I struggled with the brevity of platforms like Rustlings and Exercism, so at first the longer assignments were welcomed. But in the balance between assessing specific Rust features (how well can you write a closure, how idiomatic can you make a `trait`), and embracing the assignment's context, some things were lost in translation.

Let's take the assignment I had to write, as an assignment-writing assignment[^3]. It was a music theory analyzer (much like [this old project][5]), so, given a `Vec<Vec<Note>>`, it looks for common partwriting rules. I'd hazard that most people reading this have no clue what voice-leading or leading tone resolution are, but that's the issue. It's context to give the assignment something more than just `Implement fooBar() send baz` -- a tradeoff that, if framed well, takes on the air of a long-form math problem. The context is a fun, exciting way to think about the implication of your code, and you might learn something along the way. But, if there's too much reliance on the context, the assignment feels more like "how good are you at music theory" instead of "how well can you parse strings".

Some of our assignments, in my opinion, definitely strayed a little too far into the theoretical instead of focusing more on the inherent Rust features. And sometimes, they were really hard to validate, due to use of macros to generate many, many test permutations.

But maybe that was inevitable?

Rust is a _systems_ programming language, where most intro CS assignments are now impressively challenging (re: doubly linked lists, graph traversal). It's like turning on a higher difficulty setting in a game, and the level 1 is suddenly permadeath, and the fun achievements are more draining than anything else. This difficulty is a necessary part of working [bare-metal][6], [on-prem][7], [fearlessly][8]. Rust programmers bite the bullet of the borrow checker because it gives us guarantees that make the incredibly-complex _just_ complex, yet the incredibly-simple, complex, sometimes. Yet those trying to learn the language are striving for a motivation that doesn't quite exist yet in the classroom setting.

In the classroom, ideally, the goal is to become comfortable in the theoretical and practical parts of the language. (It's why I was really excited to take this class over learning it on my own.) Theoretical problems are difficult to address in the same way a "real-world" problem eloquently describes a solution -- especially in academia, where as CS majors we've had to write graph traversals and string processing for _years_, and suddenly that muscle-memory doesn't work anymore[^5].

The Rust team, to their credit, is trying to address this -- the first tenant of the [Rust 2024 roadmap][11] is to flatten the learning curve. It's a difficult language that's equally hard to teach, and that might be another challenge we may just need to accept.

TODO: transition here?


## The joys of the class

Oh my _god_, we went in-depth.

Right before our Tues/Thurs lectures, I was in an _Intro to parallel systems_ class (200-level), and immediately after, I went to my _Distributed algorithms_ class (700-level). A "sandwich of curiosity", as my friends put it. A "concern", as my therapist remarked.

This gave me enough perspective to understand concepts like async/await[^4], but also the rigor of "okay, let's spend two days proving the distributed MST algorithm".

In lecture, we really took the time to understand why Rust behaves the way it does. The best example I can give is when we went over Futures. Our professor essentially reimplemented them from scratch to expose how their internal state machine works. We constantly had discussions about whether a `Fn` or `FnOnce` was better, or why X pattern is more useful than Y pattern.

Also, the assignment-writing and [blog post][9]


## Looking to the Future<>

Personally, I really want to keep doing more Rust. I've started [another side project][10], and can't wait to meet more Rustaceans at my fulltime job soon.

However, the semester was definitely a real drain on me personally, for other reasons. I wish I had the energy and time while I was taking the class to delve deeper into it.











 ^^TODO: 2

[0]: https://www.youtube.com/watch?v=LjFM8vw3pbU
[1]: https://www.youtube.com/c/JonGjengset/videos
[2]: https://google.com
[3]: https://github.com/peterkos/calcdnd
[4]: https://dubstech.info
[5]: https://peterkos.github.io/partwriter
[6]: https://google.com/SCI5
[7]: https://google.com/OXIDE
[8]: https://google.com/FEARLESS_CONCURRENCY
[9]: https://peterkos.me/rust-const-generics
[10]: https://github.com/peterkos/rolex
[11]: https://blog.rust-lang.org/inside-rust/2022/04/04/lang-roadmap-2024.html


[^1]: Perhaps a camel, or the caps lock key, or a multicolored lambda for you.

[^2]: We also snuck into CES, but that's a story for another time.

[^3]: Yo dawg, I heard you like writing assignments, so I turned in a quine that crashed the CS server again.

[^4]: Even though I did 2 internships as an iOS dev, due to the nature of older codebases, we couldn't use Swift's async/await syntax. I then had the pleasure of learning async/await twice: once in C#, and another in Rust.

[^5]: I feel like most people new to Rust struggle with this in three ways: once with the borrow checker, once with strings, and once trying to implement a self-referential data structure. I almost wish there was a guide for "coming from X programming language", where in big bold letters, it says _"hey! you're really not going to have a good time with X or Y"_. I knew that because I've already watched some old RustConf talks, and read enough ~~whining~~ eloquent comments on Hacker News. But most might not.

