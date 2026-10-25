---
title: Why Cloudflare is the solution
description: VMs per agent are a waste. A few scratch notes on why I'm betting on V8 isolates with SQLite instead.
slug: why-DO-is-the-solution
date: 2026-10-25
---

> This isn't a blog or any kind of detailed post, just some random thoughts scratched down here.

I believe most factories that build or sell agents will move to Cloudflare going forward.

It might be too early, but it's a good long-term bet to take.

Compute is expensive and was never cheap. Frontier models are getting cheaper though, or at least the cost of a given task keeps dropping as models get more intelligent.

At this rate, the compute needed to run agents will become a bigger part of the bill than the compute used to run the models.

Agent factories, and even personal agents, spin up an agent or VM per request or per user. We used to share one VM across many requests, but an agent's VM can't be shared, because the user's data lives on the VM, not in a database.

If we haven't already, we'll soon realize that a VM is wasted compute, since most of the time we don't fully use the resources we allocated.

What we need is a stateful, isolated, infinitely scalable computer with near-zero cold starts.

Durable Objects are the current answer to this. A persistent computer that sits near the user will cover all of our needs. It's a throwaway computer, the same way serverless functions were.

Over time, as the ecosystem grows, we'll figure out that everything we used to do on a dedicated computer can be done on a special V8 isolates with SQLite attached to it.

So are we ready to move our coding agents over? Maybe not. You might run into a few issues, but if you can figure them out, I believe you'll have a head start.
