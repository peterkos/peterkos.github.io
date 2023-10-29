+++
title = "Ruby Issues"
date  = 2021-12-09
draft = true
+++



```ruby
update xcode command line tools
reinstall rbenv brew
brew update
brew upgrade



fish_add_path /usr/local/opt/ruby/bin
# fish_add_path /usr/local/lib/ruby/gems/3.0.0/bin
# fish_add_path /usr/local/lib/ruby/gems/2.6.6/bin
# fish_add_path /Users/peterkos/.rbenv/versions/2.6.6/lib/ruby/2.6.0/bin
fish_add_path $HOME/.rbenv/shims



fish_add_path $HOME/Downloads/gmakemake/bin


# Uhhhhhhh.... I don't think I need these.
# export SDK_ROOT="$HOME/Desktop/MacOSX10.12.sdk"
# export SDKROOT=(xcrun --sdk macosx --show-sdk-path)
# export OPENSSL_ROOT_DIR=/usr/local/opt/openssl

# Previously needed all of these so `rbenv` could install openssl@1.1, but
# brew was able to do it easily :)
fish_add_path /usr/local/opt/openssl@1.1/bin
# set -gx LDFLAGS "-L/usr/local/opt/openssl@1.1/lib"
# set -gx CPPFLAGS "-I/usr/local/opt/openssl@1.1/include"
# set -gx PKG_CONFIG_PATH "/usr/local/opt/openssl@1.1/lib/pkgconfig"


fish_add_path /usr/local/opt/llvm/bin
set -gx LDFLAGS "-L/usr/local/opt/llvm/lib"
set -gx CPPFLAGS "-I/usr/local/opt/llvm/include"


# Init rbenv, same as `rbenv init`
status --is-interactive; and rbenv init - fish | source



# Complains unless I do it automatically...
# export RUBY_CONFIGURE_OPTS="--with-openssl-dir=(brew --prefix openssl@1.1)"
export RUBY_CONFIGURE_OPTS="--with-openssl-dir=/usr/local/opt/openssl@1.1"




Then mysql2 complains...
1. which zstd
1. cd /usr/local/bin
1. ls -al | grep zstd
1. should be a symlink:
    1. `zstd -> ../Cellar/zstd/1.5.1/bin/zstd`
1. New command with:
    1. openssl cflags
    1. BREW zstd ldflags

gem install mysql2 -v '0.5.3' -- --with-cflags=\"-I/usr/local/opt/openssl@1.1/include\" --with-ldflags=\"-L/usr/local/Cellar/zstd/1.5.1/lib\"


SIKE bundler actually needs to know that info
it doens't matter if the independent mysql2 install works -- because that is independent from the local bundle.



bundle config --local build.mysql2 "--with-cflags=\"-I/usr/local/opt/openssl@1.1/include\" --with-ldflags=\"-L/usr/local/Cellar/zstd/1.5.1/lib\""
bundle install



note: do not set a bundle path :)
    bundle unset path

```