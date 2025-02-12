+++
title = "A Swift Kick in the LSP"
date = 2025-01-09
+++

# Background

This all started because Xcode was too slow.

Every time I opened Xcode, _every time_, it would attempt to resolve packages. Even if no dependencies changed. There was no obvious fix, with various [poke-and-prod](https://forums.developer.apple.com/forums/thread/678974), "raise your right hand and click compile" solutions yielding no results. Alas, we were doomed to wait 1-2 minutes each time Xcode started.

> "But Peter, why not use another editor? Like ~~vim~~ [helix](https://helix-editor.com/)?"

Oh we'll get there.

> "But Peter, why were you restarting Xcode so much?"

We had a large number of engineers, so it made sense to use `xcodegen` to generate our .xcodeproj file and cut down on the number of XML merge conflicts. However, if files were added/removed, we had to [re-run the generation](https://github.com/yonaskolb/XcodeGen/blob/master/Docs/FAQ.md#what-happens-when-i-switch-branches). Since the `.xcodeproj` file is actively read by Xcode while it's open, Xcode needed to be given a polite restart. No issue... except for the very high likelihood that files are added/removed on new branches. Tack on some code reviews, testing feedback, `branch-chris-final`, your own feature branch, and the-one-branch-someone-needed-help-with, and you'll end up with the following:

```fish
# ~/.config/fish/config.fish
alias kx "killall Xcode"
```

So... Xcode is too slow. What are our options?
- Be patient
- Switch to Android
- Use another editor

Patience is a virtue held until one realizes their processor runs at _four billion cycles a second_. Android is green, and I'm colorblind. New editor it is.

> **🚧️ Disclaimer**
>
> I did this around a year ago, circa Swift 5.9. Any code referenced below is pulled from branches around that time (e.g., `sourcekit-lsp/release/5.9`).
>
> For those inclined to replicate this, uh, experiment, it requires a couple preparation steps:
> 1. Use macOS Sonoma (14), and if you need a VM, [Bushel](https://getbushel.app/) is a great tool
> 1. Either [install a custom Swift toolchain](https://www.swift.org/install/macos/package_installer/), or (since we're in a VM), use [`xcodes`](https://github.com/XcodesOrg/xcodes) and install Xcode 15.4, which we can [verify](https://xcodereleases.com/) uses Swift 5.9
> 1. Finally, if following along, use the setup steps _on the 5.9 branch of each project_. The instructions have changed!

# The Language Server Protocol to My Heart

Luckily, the folks at Redmond put down their photocopiers and built [LSP](https://microsoft.github.io/language-server-protocol/). Any editor can hook into some language's backend for autocomplete+formatting, and all it needs to worry about is how to show that information to the user. [SourceKit-LSP](https://github.com/apple/sourcekit-lsp/) enables it to work with Swift! This is a good start.

I've been playing around with [Helix](https://helix-editor.com), so let's fire up a new iOS project in Xcode for Swift/SwiftUI, open it in Helix, aaaand...

```sh
[ERROR] sourcekit-lsp err
        "could not find manifest, or not a SwiftPM package: [...]SwiftFlashlight\n"
[ERROR] sourcekit-lsp err
        "could not open compilation database for
        [...]SwiftDemo/SwiftFlashlight/ContentView.swift\n"
[ERROR] editor error: no such command: 'log-o'
```

Oops. Since sourcekit-lsp [doesn't yet support Xcode projects](https://github.com/apple/sourcekit-lsp/issues/730), we need to create this app as a **Swift Package Manager** (SPM) package.

```sh
> mkdir SwiftFlashlightCore
> cd SwiftFlashlightCore
> swift package init --name "SwiftFlashlightCore"
> ls
Package.swift Sources Tests
> hx .
```

And with some scaffolding...
```swift
// Package.swift
let package = Package(
    name: "SwiftFlashlightCore",
    platforms: [.iOS(.v16)],
    // ...
)

// Sources/SwiftFlashlightCore/SwiftFlashlightCore.swift
public func sayHello() {
    print("Hello, World!")
}
```

Woo! We have autocomplete!

<img src="/post-assets/spm-ios/helix-spm-v1.png" class="half-center" alt="screenshot of helix (the code editor) in terminal of a file, SwiftFlashlightCore.swift. The cursor is inside the parens of the print function, and an autocomplete dropdown of various overloads for print is visible.
The full code:
// The Swift Programming Language
// https://docs.swift.org/swift-book
public func sayHello() {
    print()
}
"/>

We still need Xcode to do code signing, distribution, and not alienate the entire dev team. To solve this, we can make a wrapper Xcode project that imports this SPM package locally. The best part? This lets us modularize our code! Network module, UI module, that sort of thing, with each being a separate SPM package. That'll give us an excuse to continue earing gold medals in editor gymnastics.

To add a local SPM package dependency to an Xcode project:
1. Xcode -> New Project... -> iOS App
1. File -> "Add Package Dependencies"
1. "Add Local...", and navigate to SwiftFlashlightCore from the last step
1. Make sure "SwiftFlashlight" target is selected under "Add To Target"

Now, we can call our package's test function from within Xcode:

```swift
// SwiftFlashlight/ContentView.swift
import SwiftUI
import SwiftFlashlightCore

struct ContentView: View {
    var body: some View {
        Text("Hello, World!")
            .onAppear {
                SwiftFlashlightCore.sayHello()
            }
    }
}
```

# We Need To Go Deeper

Things fell apart when I tried loading the full iOS codebase, dependencies and all. SPM failed to initialize, and the LSP logs were not very helpful. I switched to the more familiar Sublime Text (sorry Helix) and started digging.

The bug didn't appear on all modules of our codebase, or in a standalone `swift package init` project. It was only when we included some dependencies. Entertaining a brief _deus ex machina_, let's cherry-pick one such dependency used from the full project:

```swift,hl_lines=5 12-14 18
// swift-tools-version: 5.9
import PackageDescription
let package = Package(
    name: "ProblemApp",
    platforms: [.iOS(.v16)],
    products: [
        .library(
            name: "ProblemApp",
            targets: ["ProblemApp"]
        ),
    ],
    dependencies: [
        .package(url: "https://github.com/hmlongco/Factory", from: "2.3.1")
    ],
    targets: [
        .target(
            name: "ProblemApp",
            dependencies: ["Factory"]
        ),
        .testTarget(
            name: "ProblemAppTests",
            dependencies: ["ProblemApp"]
        ),
    ]
)
```

If I tried to create this isolated test case _earlier_ in my journey (instead of debugging the full module I saw the errors occur in), I would have discovered something interesting.

```json
// LSP log
[error]: a resolved file is required when automatic dependency resolution is disabled
         and should be placed at [...]/ProblemApp/Package.resolved.
         Running resolver because the following dependencies were added: 'factory'
         (https://github.com/hmlongco/Factory)
```

Following its direction and running `swift build` (to resolve our dependencies) reveals the stone in the sword:

```sh
> swift build
# ...
Working copy of https://github.com/hmlongco/Factory resolved at 2.4.3
error: the library 'ProblemApp' requires macos 10.13, but depends on the product 'Factory' which
requires macos 10.14; consider changing the library 'ProblemApp' to require macos 10.14 or later,
or the product 'Factory' to require macos 10.13 or earlier.
```

The dependency resolution error occurred in `swift build`. Since I **didn't** make that observation at the time, we're going to proceed as past-me did: only aware that this error surfaced in the LSP, and not identically in both the LSP and build system. Granted, I would have needed to get lucky with that _specific_ dependency (more on that later), so it's not the end of the world.

```swift
// LSP logs
error: the library 'ProblemApp' requires macos 10.13,
but depends on the product 'hmlongco/Factory' which requires macos 10.14;  [...]
```

We're seeing a macOS build error, but we specified **iOS** as our platform in the Package.swift. This led to some questions:
1. Where does SourceKit-LSP infer target architecture?
1. Is the LSP rebuilding our package, or is the error in the build system?
1. Why was our iOS platform setting ignored?

# Setup the Debug Environment

My first instinct was to clone SourceKit-LSP and set breakpoints. Surely the problem would reveal itself somewhere down the chain. I did so using Sublime Text. (A stubborn mistake.)

I set Sublime's SourceKit LSP to point to our local clone, not the one on the system toolchain:

```sh
> gh repo clone swiftlang/sourcekit-lsp
> cd sourcekit-lsp
# Need a build first so we can run something
> swift build
> cd .build/arm64-apple-macosx/debug
# Copy the current directory's path to the clipboard
> pwd | pbcopy
```
```json
// LSP-SourceKit.sublime-settings
{
  "enabled": true,
  "command": [
    "[...]/sourcekit-lsp/.build/arm64-apple-macosx/debug/sourcekit-lsp"
  ],
}
```

<details>
    <summary><i>A brief tangent on wrangling LLDB into Sublime Text</i></summary>

To set breakpoints via LLDB, I found [SublimeDebugger](https://github.com/daveleroy/SublimeDebugger), created a Sublime Project around the directory, set a configuration... but it failed to catch on anything.

```json
// sourcekit-lsp.sublime-project
"debugger_configurations":[{
    "type": "lldb",
    "request": "attach",
    "name": "Attach",
    "program": "${folder}/.build/arm64-apple-macosx/debug/sourcekit-lsp",
    "waitFor": true,
    "lldb.library": "/Applications/Xcode.app/Contents/SharedFrameworks/LLDB.framework/Versions/A/LLDB",
    "lldb.verboseLogging": true
}]
```

After about a week (I wish I was kidding), the first culprit was found. This plugin was a wrapper of CodeLLDB, whose [Swift setup docs](https://github.com/vadimcn/codelldb/wiki/Swift) mention to set `lldb.library` manually. But! SublimeDebugger has this [horrific](https://github.com/daveleroy/SublimeDebugger/blob/95b7098d6d432e38b847bd1d42c525186e4e64f8/Debugger.sublime-settings#L57-L58) line in its config, overriding any lldb.library setting to `null` implicitly. Solution: remove the `lldb_library` from the project config, and add it as a plugin config item instead, [file an issue](https://github.com/daveleroy/SublimeDebugger/issues/229), and mark another week of my life spent debugging configuration files.

```json
// Debugger.sublime-settings
{
    "lldb_library": "/Applications/Xcode.app/Contents/SharedFrameworks/LLDB.framework/Versions/A/LLDB",
}
```
</details>

# Where does SourceKit-LSP infer target architecture?

The error we're getting from our LSP log panel in Sublime is below:
```swift
[18:19:38.668] { message: "[info]: using 'Package.resolved' file as lock file" }
[18:19:38.668] { message: "[debug]: loading manifest for 'ProblemApp' v. unknown from db cache" }
[18:19:38.668] { message: "[debug]: loading manifest for 'factory' v. 2.4.3 from db cache" }
[18:19:38.668] {
  message: "[error]: the library 'ProblemAppCore' requires macos 10.13,
             but depends on the product 'Factory' which requires macos 10.14;
             consider changing the library 'ProblemApp' to require macos 10.14 or later,
             or the product 'Factory' to require macos 10.13 or earlier.",
  logName: 'SourceKit-LSP: Indexing'
}
```

A quick folder-wide search for substrings from the log[^1] reveals code from one of its dependencies, Swift Package Manager. I'm tempted to start debugging it from the SPM side of things, but I'm curious if SourceKit-LSP is passing some invalid assertion of state (e.g., an override to the build system's environment, based on what it can statically infer from the Package manifest).

[^1]: An indispensable debugging tool, if I may add.

First we need to verify that SPM is indeed being used. The documentation on the `release/5.9` branch [states](https://github.com/swiftlang/sourcekit-lsp/tree/release/5.9?tab=readme-ov-file#caveats):
> SourceKit-LSP does not update its global index in the background, but instead relies on indexing-while-building to provide data. This only affects global queries like find-references and jump-to-definition.
>   Workaround: build the project to update the index

Documentation is [usually](https://github.com/ra1028/DifferenceKit/issues/152) correct, but let's take a peek at the code to verify:

```swift,hl_lines=8
// Sources/SourceKitLSP/Workspace.swift
convenience public init(rootUri: DocumentURI, buildSetup: BuildSetup, /* ... */) throws {
    var buildSystem: BuildSystem? = nil
    // ...
    if let buildServer = BuildServerBuildSystem(/* ... */) {
        buildSystem = buildServer
    } else if let swiftpm = SwiftPMWorkspace(/* ... */) {
        buildSystem = swiftpm
    }
    // ...
}
```
```swift
// Sources/SKCore/BuildServerBuildSystem.swift

/// A `BuildSystem` based on communicating with a build server.
/// Provides build settings from a build server launched based on a
/// `buildServer.json` configuration file provided in the repo root.
public final class BuildServerBuildSystem { /* ... */ }
```

`BuildServerBuildSystem` is, helpfully, only used when specified -- and indeed, breakpoints validate that we're calling `SwiftPMWorkspace`.

"Wait!" exclaimed past-me.

(I waited.)

"What happens when I try to build this on the command line with SPM? Maybe SPM is parsing our Package manifest wrong? After all, we still need run a build first[^2] to generate a symbol dictionary, from which SourceKit-LSP can do lookups and completions. So let's ignore LSP for now!"

Good point, past-me. I'll allow it.

[^2]: Note: <a href="https://github.com/swiftlang/sourcekit-lsp/blob/main/Documentation/Enable%20Experimental%20Background%20Indexing.md">Starting in Swift 6.1</a>, SourceKit-LSP will have background indexing enabled by default, eliminating the need to perform a build to create project symbols.

# Where does SPM infer target architecture?

```sh
> swift build
error: the library 'testproj' requires macos 10.13,
       but depends on the product 'Factory' which requires macos 10.14; [...]
```

The build system is checking `macOS` versions, even though we only specified `.iOS(.v16)` as a platform! What?!

Turns out, there's this cute snippet in the [SPM docs](https://github.com/apple/swift-package-manager/blob/main/Documentation/PackageDescription.md#supportedplatform):

<div class="note">
    <p><i class="fa-solid fa-angles-right"></i>By default, the Swift Package Manager assigns a predefined minimum deployment version for each supported platforms [sic] unless you configure supported platforms using the platforms API. [...] One exception to this rule is macOS, for which the minimum deployment target version starts from 10.10.</p><br>
    <p>The Swift Package Manager will emit an error if a dependency is not compatible with the top-level package's deployment version. The deployment target of a package's dependencies must be lower than or equal to the top-level package's deployment target version for a particular platform.</p>
</div>

That means our Package.swift actually looks like _this_:

```swift, hl_lines=3
platforms: [
    .iOS(.v16),
    .macOS(.v10_13) // Implicitly added!
],
```

Remember when I said I'd get _quite_ lucky by picking Factory as our dependency of choice for the standalone package?

```swift, hl_lines=5
// Factory's Package.swift
// src: https://github.com/hmlongco/Factory/blob/main/Package.swift
platforms: [
    .iOS(.v11),
    .macOS(.v10_14),
    .tvOS(.v13),
    .watchOS(.v8)
],
```

Our dependency has a higher minimum for macOS (.v10_14) than our package supports (.v10_13)! Yes, yes, this is exactly what the error message said. But we're at a semantic impasse. While I could set something silly, like a `.macOS("v99")`, that would only solve the dependency resolution issue. This is an iOS package, and we only want it to be built for iOS. Maybe we can set this as a flag in SPM? How can we make SPM target iOS, not macOS?

## Get SPM to target iOS, not macOS

Before we wear out our `-` key in Terminal, let's clarify some jargon.

<table>
<tr>
    <td><code>architecture</code></td>
    <td>An instruction set used by the CPU (e.g., arm64, x86)</td>
</tr>
<tr>
    <td><code>host</code></td>
    <td>The system that runs the compiler</td>
</tr>
<tr>
    <td><code>target</code></td>
    <td>The system we want to run our executable on</td>
</tr>
<tr>
    <td><code>toolchain</code>*</td>
    <td>The compiler and supporting cast (linker, standard library, etc.)</td>
</tr>
<tr>
    <td><code>triple</code></td>
    <td><a href="https://github.com/swiftlang/llvm-project/blob/6f784e44b2fa0e018d4c5f31823f0264b7c505f7/llvm/include/llvm/TargetParser/Triple.h#L23-L25" target="_blank">Shorthand</a> for <code>arch-vendor-operating_system-(environment)</code></td>
<tr>
    <td><code>sdk</code></td>
    <td>Code libraries for platform-specific development (UIKit, etc.)</td>
</tr>
</table>

<small>*See [these](https://samwize.com/2022/05/23/how-to-use-a-different-swift-toolchain-in-xcode/) [two](https://oleb.net/2024/swift-toolchains/) articles on configuring a new Swift toolchain.</small>


Our goal is to compile our SPM package with an iOS target from our Mac. While both platforms use ARM, it technically counts as cross-compilation, as `arch(macOS) != arch(iOS)`, so the details (SDK, toolchain) can't be inferred from the surrounding environment.

How do we specify our target? With a `--target` flag, probably. But where? Is `swift build --target ...` enough? Luckily, I've stared at my terminal like it's paint drying for long enough that some of these words start to make sense.

| Command | Description |
|---|---|
| `xcodebuild` | Runs the Xcode build system via the command line |
| `xcrun` | Use the Xcode environment (Swift version, etc.) to proxy commands, or get info |
| `swift build` | Runs the SPM build tool that _invokes_ compiler(s) to build source files |
| `swiftc` | The Swift compiler |


After some `man swift`, `swift -h`, `swift --h`, `swift help -h`, `swift -h | grep help`:

```sh
> swift build \
  --sdk    /path/to/ios/sdk \
  -Xswiftc -target \
  -Xswiftc arm64-apple-ios16 \
  -Xcc     --target=arm64-apple-ios16 \
  -Xcxx    --target=arm64-apple-ios16 \
```

This command tells the Swift compiler and all C/C++ compilers down the chain to set our target to iOS 16. I wasn't sure if the C/C++ compilers needed to be in the loop here, but I'm feeling inclusive (read: desperate to get this working). To find the iOS SDK path, we need to ask the all-seeing, all-knowing, omniscient Xcode[^3].

[^3]: Because [Xcode knows everyone's name-o](https://youtu.be/y8OnoxKotPQ?t=13).

```sh
> xcodebuild -showsdks
iOS SDKs:
	iOS 16.0                -sdk iphoneos16.0
iOS Simulator SDKs:
	Simulator - iOS 16.0    -sdk iphonesimulator16.0
```

```sh
> xcrun --sdk iphonesimulator16.0 --show-sdk-path
/Applications/Xcode.app/Contents/Developer/Platforms/iPhoneSimulator.platform/Developer/SDKs/iPhoneSimulator16.0.sdk
```

> Yes, `xcodebuild` uses a single tick for long parameter names, vs. the POSIX standard of double-tick. Don't ask me why! I only have sarcastic responses.

> I decided to stick with the _simulator_ SDK, even though I couldn't think of a reason the simulator would need nor have a different SDK than a physical device.

Along the way, I also discovered [this neat PR](https://github.com/swiftlang/swift-package-manager/pull/6732) that lets use `--triple` for iOS targets. Let's use that instead, and add our SDK path to `swift build`:

```sh
> swift build \
  --triple arm64-apple-ios-simulator \
  --sdk "$(xcrun --sdk iphonesimulator --show-sdk-path)"
```

```swift
error: the library 'ProblemApp' requires macos 10.13,
but depends on the product 'hmlongco/Factory' which requires macos 10.14;  [...]
```

ARE YOU KIDDING ME.

We set our platform in `Package.swift` to be iOS. We told SPM to compile for iOS. Why was it falling back to macOS? There's got to be a bug with the build system.

<!-- > Later, we'll need to point SourceKit-LSP to use our local copy of SPM, but for now, we're only debugging the SPM <-> Swift compiler link. -->

# The Final Battle: The SPM Codebase

My approach here was simple: trace the execution path from `swift build` down to where the error is being thrown. There's three rough sections to this path:

1. Configuring the build system
1. Starting the build system
1. Initial checks just before running the build system


## Configuring the build system

The main kickoff (post-CLI argument parsing) is a bit hard to follow at first due to some [optimizations](https://github.com/swiftlang/swift-package-manager/pull/3276), but I eventually found a walkable path[^4]:

[^4]: If you try building `release/5.9` branch today, you might run into errors if you're on the latest macOS. The LSP will likely not work (i.e., "jump to definition"), and dependencies might not fully load -- invalidating our tried-and-true "find in all files" debugging strategy, if the result is in a dependency. Remember, that branch was created on macOS 14, so you'd need to be running Swift 5.9, _and_ macOS 14 to build the project and get an LSP running. Make sure to do your code digging in the VM!

```swift
// Sources/swift-build/main.swift
SwiftBuildTool.main()

// Sources/Commands/SwiftBuildTool.swift
public struct SwiftBuildTool: SwiftCommand { /* ... */ }

// Sources/CoreCommands/SwiftCommandState.swift
public protocol SwiftCommand: ParsableCommand, _SwiftCommand { /* ... */ }

// .build/checkouts/swift-argument-parser/Sources/ArgumentParser/Parsable Types
public static func main(_ arguments: [String]?) {
    // ...
    do {
        var command = try parseAsRoot(arguments)
        try command.run()
    } catch {
        exit(withError: error)
    }
}
```

That's a bunch of code to say `X.main()` calls `X.run()`, bringing us to `SwiftBuildTool.run()`:

```swift, hl_lines=3 8
public func run(_ swiftTool: SwiftTool) throws {
    // ...
    let buildSystem = try swiftTool.createBuildSystem(
        explicitProduct: options.product,
        customOutputStream: TSCBasic.stdoutStream
    )
    do {
        try buildSystem.build(subset: subset)
    } catch _ as Diagnostics {
        throw ExitCode.failure
    }
}
```

## A Confession
_At the time_, I didn't start there. Originally, I started at `SwiftBootstrap`, which is a trimmed-down version of `swift-build` to build SPM itself[^5]. It was only through writing this blog post that I discovered this correct code path, through `SwiftBuildTool.run()`. This code path still flows down to two important methods: `createBuildSystem(...)` and `build(...)`, so... does it matter?

<img src="/post-assets/spm-ios/buildentry.png" class="fullwidth" alt="A diagram with two start points: CLI Entry on the left (orange path), Bootstrap Entry on the right (purple path). They indicate code paths that trickle down to the same green BuildOperation.build() function in the bottom center-ish of the diagram. CLI Entry has a path drawn: swift-build, SwiftBuildTool.main(), a side path through SwiftCommand, ParsableCommand, and main(), back to run(), and then SwiftTool.createBuildSystem() before meeting at BuildOperation.build(). Bootstrap Entry has a path drawn: SwiftBootstrap, Builder.build(), createBuildSystem(), before meeting at BuildOperation.build()."/>

[^5]: This is a common concept in compilers: the Swift compiler compiles itself, the Rust compiler compiles itself, and so on. Doesn't make it any less confusing :')

> "But Peter, why didn't you cut this out of the blog post? It doesn't matter! Show us the fix!!!11!11!"

I want this to be as historically-accurate of a debugging tale as possible. It was stressful to juggle an alphabet soup of new jargon and spend _hours_ on things that should have been quick -- setting `$TOOLCHAIN` instead of `$TOOLCHAINS`, or working with the wrong Swift version. Build systems are complex beasts. They require the utmost attention to detail throughout each layer of the process.

I thought -- **even after fixing the bug** -- that my mental model of the system was correct. It was not! The parts that mattered, insofar as calling `BuildOperation.build()`, were correct by chance. But my incorrect entry point didn't come up when I posted my fix for the issue, in 1:1s at work, or countless conversations leading up to this in-depth blog post. It only surfaced through rigorous re-telling and replication of the journey.

Does it matter, though? Not for this bug. It was an input with no influence on the output. For this blog post, it _does_ matter, as I'd be confidently stating a wrong assumption about SPM build system. Or, if I contributed an "Overview of the build system" writeup. Maybe I would have caught it if I kept a more detailed progress log, or if I happened to fix another issue in that area of code. However, I (and the dozen or so people who heard me explain this fix) didn't notice that I'd happen to fall down the right rabbit hole by chance.

This experience, I believe, sheds light on the dual-headed danger and necessity of assumptions in debugging complex systems. It's easy to make assumptions about the behavior. I'd argue it's _necessary_ to make assumptions to survive the information overload, but _dangerous_ to not validate and re-check assumptions over time. I personally find remarkable clarity in creating visuals for my understanding, but how this manifests can vary: a talk, a Markdown doc, a whiteboarding session -- something that surfaces the implicit abstractions in architecture, and stratifies the cognitive understanding of the system from the raw codification of its behavior.

Speaking of system behavior, let's continue with our trace of `swift build`, as past-me did, via `SwiftBootstrap`.

## Configuring the build system, for real this time

<img src="/post-assets/spm-ios/spm-codebase-part1.png" class="overwidth" alt="Diagram showing a code path through five functions. The path starts in SwiftBootstrap.run(), where a Builder object is initialized. A yellow arrow expands the initializer of Builder() to the right to show that there is an assignment (annotated in green) of self.destinationToolchain = hostToolchain, and a comment of 'TODO: Support destinations?'. Back in SwiftBootstrap.run() on the left, the instantiated Builder object is expanded with a yellow loop-de-loop arrow to the right of the `builder.build()` function. That calls `Builder.createBuildSystem()`, expanded below with a yellow arrow. In that function, a bunch of parameters to the `BuildParameters` initializer are annotated with a green line and 'Seems legit...' in green. The function switches over the `buildSystem` variable. In the `.native` case, it creates a plugin script runner, and returns a BuildOperation; further expanded in a popover modal with a yellow arrow, and another annotation 'not gonna worry about this yet...'. The other arm of the buildSystem switch, `.xcode`, is commented out."/>

The `Builder.init()` stuff looks interesting, but I want to dive as deep as I can first before getting too sidetracked. In creating the build system, I verified (via breakpoints) that the target toolchain and target triple were all, _correctly_, iOS. (And of course, we're not building via Xcode, so we ignore that path as well.)

## Starting the build system

Notable is how early this errors out. I set breakpoints earlier and earlier in the `BuildOperation.build()` function before finally getting to `getBuildDescription`. Sure, it's a `try await`, but... why is a getter failing? I'd expect the method name to include `validate` if it's doing validation, vs. an implicit check.

<img src="/post-assets/spm-ios/spm-codebase-part2.png" class="overwidth" alt="Four code blocks. The first is the same Builder.build() function from previous image, but now calling `try await buildSystem.build()`. Below is the BuildOperation.build() function (which *is* a BuildSystem), so it is called here). The bottom two-thirds of the text is greyed out with a green annotation over it: 'Errors out before this point...'. A yellow arrow is drawn from the line immediately above the greyed out portion to the right, expanding on `self.getBuildDescription(subset: subset)`. Most of the code text in that blob is greyed out as well, with a green annotation over it for 'Caching...'. At the end of that block, if the cache succeeds, a green annotation notes 'Cache is good ^_^' on that line. Outside of that block but within the function, `self.plan(subset: subset).description` has a green arrow annotation: 'otherwise, compute what we need to build', and a yellow arrow expanding downward with a loop-de-loop on that plan() call. The only annotation here is a large initializer with ten parameters for `try await BuildPlan()`, and a green annotation: 'Failable init?'."/>

Oh, it's the _plan_ step that is failable. That makes sense. I ignored the caching code for now, as I saw the dependency version error on cached and non-cached builds.

Let's take a closer look at the BuildPlan class then. Maybe we get a clue in there?

## Initial checks just before running the build system

<img src="/post-assets/spm-ios/spm-codebase-part3.png" class="fullwidth" alt="Detailed large snippet of BuildPlan.init(). When creating the ProductBuildDescription and computing build parameters, the ternary for `destination == .host ? toolsBuildParameters : destinationBuildParameters` has a copy edit loupe annotation in green over the first branch, and a green underline and check for the latter branch. Below that, a comment: '// Validate the product dependencies of this target', with a green annotation to the left: 'Looks like our error...'. After a guard statement, the code switches on `dependency`, breaking on `.module` case, and if `.product`, and `buildParameters.triple.isDarwin()` is true, `BuildPlan.validateDeploymentVersionOfProductDependency` is called. The switch statement has a yellow box around it, and that validate function call is underlined in green with an encircled interrobang and arrow."/>

Aha! A function that fails! And one that matches our dependency error!

Luckily, the `buildParameter.triple.isDarwin()` code wasn't an issue: it correctly determined that iOS is Darwin. While this code needed no change, I am obligated to call out Kabir Oberai's PR that [improved non-macOS Darwin triples](https://github.com/swiftlang/swift-package-manager/pull/6732) in _many_ more places throughout SPM. I'm not sure if our build setup would have gotten this far without that code!

## Mount Doom

Here it is.

```swift,hl_lines=9 13
// Sources/Build/BuildPlan.swift
static func validateDeploymentVersionOfProductDependency(
    product: ResolvedProduct,
    forTarget target: ResolvedTarget,
    observabilityScope: ObservabilityScope
) throws {
    // ...
    let productPlatform = product.platforms.getDerived(
        for: .macOS,
        usingXCTest: product.isLinkingXCTest
    )
    let targetPlatform = target.platforms.getDerived(
        for: .macOS,
        usingXCTest: target.type == .test
    )
    // Check if the version requirement is satisfied.
    //
    // If the product's platform version is greater than ours, then it is incompatible.
    if productPlatform.version > targetPlatform.version {
        observabilityScope.emit(.productRequiresHigherPlatformVersion(
            target: target,
            targetPlatform: targetPlatform,
            product: product.name,
            productPlatform: productPlatform
        ))
    }
}
```

For reference, the build error:
```sh
> swift build --triple arm64-apple-ios-simulator \
              --sdk "$(xcrun --sdk iphonesimulator --show-sdk-path)"
# ...
Working copy of https://github.com/hmlongco/Factory resolved at 2.4.3
error: the library 'ProblemApp' requires macos 10.13, but depends on the product 'Factory' which
requires macos 10.14; consider changing the library 'ProblemApp' to require macos 10.14 or later,
or the product 'Factory' to require macos 10.13 or earlier.
```

Our `productPlatform` and `targetPlatform` are **hardcoded** to macOS. That isn't what we want! We didn't _specify_ macOS. We specified _iOS_! This function should read the target platform destination from the CLI arguments -- i.e., the build environment.

> "Why was it hardcoded in the first place?"

A few different groups are involved in Swift development, and new features can be biased toward the contributing authors. For example, Apple initiatives tend to surface from Apple (i.e., features like `@resultBuilder` that foreshadowed essential patterns for SwiftUI), and server-side initiatives tend to surface on GitHub or the Swift Forums. Over the years, Apple's been doing more in the open -- which is _awesome_ -- but this cultural divide can still crop up, like how the first-party Swift version manager, `swiftly`, [didn't support macOS](https://github.com/swiftlang/swiftly/pull/121) for two years(!), as it arose from the server-side camp.

I suspect this `darwin == macOS` business is from something similar. Especially at the start, SPM was likely intended as a saving grace for dependency management in lieu of CocoaPods, not exactly as an Xcode replacement[^6]. Maybe someday it can be, which is why open source is so important: the community can help drive these initiatives that have more localized impact, and **supplement** the existing tooling (Xcode) with alternatives.

[^6]: This hasn't stopped a wide array of far more stubborn people than I to break free from Xcode: [[xcode-build-server](https://github.com/SolaWing/xcode-build-server), [xbase](https://github.com/kkharji/xbase), [CodeEdit](https://github.com/CodeEditApp/CodeEdit), [xcodegen](https://github.com/yonaskolb/XcodeGen/), [tuist](https://tuist.io/)].


## Throw the ring, Frodo

Luckily, it's not hard to un-hardcode `macOS` and inject the target platform. The `BuildPlan` initializer has `buildEnvironment` available to us, so we just need to pass that in:

```swift,hl_lines=16 20
public init(buildParameters: BuildParameters, /* ... */) {
    // ...
    validateDeploymentVersionOfProductDependency(
        // ...
        buildEnvironment: buildParameters.buildEnvironment
    )
}

static func validateDeploymentVersionOfProductDependency(
    // ...
    buildEnvironment: BuildEnvironment,
) throws {
    // Supported platforms are defined at the package (e.g., build environment) level.
    // This will need to become a bit complicated once we have target-level or product-level platform support.
    let productPlatform = product.getSupportedPlatform(
        for: buildEnvironment.platform,
        usingXCTest: product.isLinkingXCTest
    )
    let targetPlatform = target.getSupportedPlatform(
        for: buildEnvironment.platform,
        usingXCTest: target.type == .test
    )
    // ...
}
```

I then [opened a PR](https://github.com/apple/swift-package-manager/pull/6963)! And it got approved! And merged!

# Takeaways

Things were helpful in retrospect:
- A local devlog is immensely helpful for gnarly bugs that span days
- Simple questions ("what is swift build?") are sometimes more revealing than complex ones
- GitHub archaeology (digging through old pull requests) is as helpful of a strategy as ever
- "The first bias is not to change the system but to observe it! Ask questions!" - advice from Bryan Cantrill's [Zebra Talk](https://youtu.be/fE2KDzZaxvE?t=1104) that has profoundly shaped how I approach debugging

And to think this is all from "xcode slow"! Stubbornness pays off sometimes.

(Sometimes.)

_Thanks to [Noah](https://mas.to/@ncb) for proofreading, pre-reading, and suggesting the title._
