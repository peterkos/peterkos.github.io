+++
title = "Umami Devops"
date = 2023-10-23
draft = true
+++

# Local iOS Engineer Attmepts Devops, Chaos Ensues

My blog is pretty simple. It's a static site generator ([Zola](https://www.getzola.org/)), with a customized theme ([apollo](https://github.com/not-matthias/apollo)).

I also wanted to use [umami](https://umami.is/) for analytics. I did it before! It helped me see the ~1.4k views from my [orange website cameo](https://news.ycombinator.com/item?id=31238942), and looked snazzy. However, that was on a waay older version that needed some debugging.

I needed to upgrade Umami from `v1.39`-ish to `v2.4`, which meant re-learning how umami, Railway, postgres, database migrations, and my stress ball worked.

# The initial phase

Railway! Choo choo!

It grew a lot since I last used it. Notably, I got grandfathered in to the base monthly pay-for-use tier -- a change accompanied by one of the [funniest announcement posts I've read](https://blog.railway.app/p/pricing-and-plans-migration-guide-2023).

Where were we?

I had two instances:

```


```







```

had old install of umami, v1.32

context
    v2 needed separate migration script (add link to docs)
    need to run from v1.40 (most recent version before v2)

attempt 0
    setting up all the railway stuff
    hey, free gift!
    tables editor from setapp
    setup dev/prod
    pull old database locally as sql dump (FORESHADOWING)

attmept 1
    checkout latest v2-ish locally
    pull old data in
        tables view dev
        wipe tables
        load old SQL dump
        run `rr yarn build`
    migration issues :(

attempt 2
    checkout tags/v1.40
    do above old data pull again
    migration issues :(
    muck around with prisma

attempt 3
    go back to last running version (v1.32)
    remember i need to run `yarn install` each time
    eyy it works!

attmept 4
    go to v1.38 (eh skip a few before v1.4)
    notice that there were migration fixes in v1.39
    go to v1.39
    migration 02 failed: `created_date_idx`
    eventually realize i passed in `--data-only` when making the SQL dump. whoops.
    manually run the `CREATE INDEX` steps from migration
    `rr yarn prisma migrate resovle --rolled-back "02_add_event_data"`
    run 'er again
    eyy it works!

attempt 5
    go to v1.40
    run v1->v2 migration script
    try deploying
    error: `public.account` table doesnt exist
    realize that it needs v2 now. duh.

attempt 6
    go to v2 latest
    deploy
    WORKS! :)
