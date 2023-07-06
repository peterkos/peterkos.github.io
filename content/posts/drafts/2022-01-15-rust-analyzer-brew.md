+++
title = "rust-analyzer homebrew"
date  = 2022-01-15
draft = true
+++

homebrew installs in

```bash
> which rust-analyzer
/usr/local/bin/rust-analyzer
> cd /usr/local/bin
> ls | grep rust-analyzer
rust-analyzer -> ../Cellar/rust-analyzer/2021-12-06/bin/rust-analyzer
```

hmm...

Error states its looking in `~/.cargo/bin`
So let's fake it!

```bash
> cd ~/.cargo/bin
> ln -s /usr/local/bin/rust-analyzer rust-analyzer
```

Restart Sublime Text and it should work!

