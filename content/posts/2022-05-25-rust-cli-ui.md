+++
title = "The Pain of Rust CLUI Development"
date  = "2022-05-25"
draft = true
+++

_(Sorry about the "CLUI"... CLI UI seemed too verbose.)_

I've been an iOS developer since around Swift came out, working on hobby projects, internships, and (very soon!) a fulltime gig. Just within the iOS ecosystem, there's been many paradigms and paradigm shifts: MVC -> MVVM/VIPER, UIKit -> SwiftUI, Catalyst.

With every shift came a question that Medium.com seemed to believe was its divine right to answer: are any of these frameworks worth it? We would always have Apple (or whatever [@twostraws](https://twitter.com/twostraws/) cooks up) to attempt new ideas. So, we don't need to worry if they will actually exist.

This is the bigger problem that the Rust community suffers from. [Are We Gui Yet][2] shows us \~30 projects that attempt to make a GUI for Rust. Sure, the ownership model prevents certain patterns from being used fearlessly[^1], but the bigger problem is that there isn't a universal framework in the first place.

I came across this issue when using [tui-rs][3]. There's a main update view,





[1]: https://twitter.com/twostraws/
[2]: https://www.areweguiyet.com/
[3]: https://github.com/fdehau/tui-rs/


[^1]: The example of trying to use a generic in a trait bound comes to mind. Since generics are evaluated at compile time, and trait bounds are evaluated at runtime, it's impossible to mix the two. The delegate pattern can fall apart in this case, where a trait like `EventHandler` can't be applied to a struct with generic patramters :(