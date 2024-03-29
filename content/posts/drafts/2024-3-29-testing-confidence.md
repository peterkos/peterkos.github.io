+++
title = "Write Less Tests to Build Confidence"
date = 2024-03-29
draft = true
+++


# Some Thoughts On Testing

*“Code coverage, 80%!”* is often the mantra we hear. It has a balanced philosophy: achieving 100% code coverage is unlikely (as not all code is easily testable), and ensures that enough of the codebase is tested that bug-bashing confidence is, well, 80%.

However, every measure ceases to become good once targeted. Try turning on an >=80% CI step, and watch in frustration as the needle bounces at 78.9%. Or 74%. The error may even be from *previous* PRs (whose untested sum was not quite below 80%), but the newly-failed PR is on the line.

Does that sound contrived? Well, it is! So let’s build a more coherent argument versus relying on cherry-picked experiences the author has had very vivid dreams/hallucinations about, but have certainly not occurred in reality.

## What’s the point of testing?

***To build confidence!***
Tests are not a “sake of best practice”, and I believe treating them as such robs them of their primary benefit. The sweet air of a green checkmark is a calling to you. It sings that your newly-added/deleted/modified code maintains functionality, and — if you added tests — that *your* code is itself protected with that same grace. Rip out that ViewModel from 3 years ago. Why not? Because it will break something? Well, the tests passed. Tests passing indicate it **won’t** break something. The hypothetical fear of "might" break has been proven to be false.

Unless.

Unless the tests aren’t covering the right thing. Unless the tests didn’t hit that one teeny code path that trips unexpectedly, because it was only a small % of code, and we weren’t searching for 100% coverage. Unless the tests *looked* like they covered functionality, but — much like a calculator that compiles, but says `2+2 = orange`— the logical result is not enforced: only the rough semantics of types, names, and patterns are enforced.

We’re also human (as of writing). Even if we figured out a perfect system, a bit of wiggle room would be good alongside the entropy of being human (as of writing). We need a measure of reliability. A measure of “when are we confident enough in our testing”.
![](CleanShot%202024-03-28%20at%2023.57.14.png)

Oh. I did say that.

## Oh, I did say that.

Let’s try a new framework instead. Something something proving the contrapositive.
![](CleanShot%202024-03-29%20at%2000.07.32.png)


**Test Priority**
1. Test the high-business-value paths
   1. Auth, billing, support, etc.
2. Test risky/complicated code, or requirements that are tricky to grok
3. <A free category to allocate depending on your team’s time budget>

Otherwise — and stick with me here — *don’t test it*.

This gives us a very interesting flow of responsibility. Let’s look at some scenarios:


![](CleanShot%202024-03-29%20at%2000.21.56.png)![](CleanShot%202024-03-29%20at%2000.24.02.png)![](CleanShot%202024-03-29%20at%2000.25.32.png)

And there it is.

Writing tests in priority of value results in tests that are inherently valuable. A test — “extra work” that isn’t tech debt or a new feature — is never wasted, as it is applied based on the **inherent risk** of that code failing. Conversely, tests now enforce confidence for domains that require it. While it might be nice to catch UI imperfections in CI/CD, that confidence is only needed if the risk of it breaking is high enough.

In less words: write tests, a.k.a. build confidence, in the parts that matter. You now don’t have to worry about breaking the parts that matter. And don’t worry about the parts that don’t matter :)

(
