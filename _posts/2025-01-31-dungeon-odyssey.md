---
layout: post
title: "Dungeon Odyssey: Branch-Based Procedural Dungeons"
date: 2025-01-31
excerpt: "A 3D survival prototype exploring branch-based procedural dungeon generation, replayability, and readable level structure in Unity."
image: /assets/images/dungeon.png
tags:
  - Unity
  - C#
  - Procedural Generation
  - Game Dev
---

Dungeon Odyssey is a 3D survival prototype I built during my third year of Computer Science. The goal was to create a playable dungeon at runtime, place the player inside it, and support a simple survival loop built around exploration, combat, and reaching the exit.

The project began with ideas from Billy McDaniel’s Procedural Dungeons in Unity course, but I pushed the system in my own direction by focusing on branch-based generation, room variation, and verticality. I wanted the dungeon to feel structured rather than completely random, while still producing different layouts across repeated runs.

<figure>
  <img src="/assets/images/dungeon.png" alt="Dungeon Odyssey procedural dungeon scene in Unity">
  <figcaption>Dungeon Odyssey uses procedural generation to build playable dungeon layouts at runtime.</figcaption>
</figure>

## Project overview

Instead of generating a full dungeon layout first and connecting everything afterward, the system grows the dungeon through branches. Each branch places rooms, hallways, stairs, doors, and connecting pieces in sequence. Once the main path has been generated, the system looks for available openings and attempts to create valid side branches.

This made the overall shape of the dungeon easier to control. By adjusting branch length, side-branch chance, and available tile types, I could change how direct, complex, or exploratory each generated layout felt without rewriting the core system.

## Tile pieces and connectors

The dungeon is assembled from seven prefab categories: start, exit, room, hallway, stairs, door, and wall. Each piece uses connector points to define where it can attach to other pieces. When two connectors align correctly, the pieces are joined and both connection points are marked as used.

Any unused connector is closed off with a wall so the player never sees unfinished openings or broken paths. I also used random visual variants for some tile types, which helped the dungeon feel less repetitive even when the underlying structure followed the same generation rules.

One of the more useful additions was stairs. They introduced verticality into the level layout and made the dungeon feel more spatially interesting than a purely flat floor plan.

## Branch-based generation

The branch-based approach became the defining part of the system. Rather than treating dungeon generation as filling a large grid, I treated it more like growing a path network. That made progression easier to shape and gave me more control over the route from the start room to the exit.

It also made the dungeon easier to read from a player perspective. Even though the layout is procedural, the player can still sense the difference between a main route and optional side branches, which helps the level feel more intentional.

## Collision handling

One of the main technical challenges was preventing overlap between generated pieces, especially around intersections, corners, stairs, and larger rooms. Every dungeon piece uses a box collider, and before a placement is finalized the system checks whether that collider overlaps with existing geometry.

If a collision is detected, the candidate piece is discarded and the generator tries another valid option. After several failed attempts, the generator abandons that specific expansion path and continues elsewhere.

This keeps the generator from getting stuck, although it also means some layouts can end up smaller or tighter than expected. That tradeoff was worthwhile because it made the system reliable enough for repeated testing.

## Performance considerations

For small and medium dungeon sizes, generation is fast and practical. Larger dungeons begin to slow down because of the recursive branch logic and the growing number of collision checks required as the layout expands.

To make generation easier to test, I added a user-controlled build speed. That allowed the dungeon to generate slowly for visualization or quickly when I just wanted a finished layout. At maximum speed, generation completes within a few seconds, which would be easy to hide behind a short loading screen in a larger game.

## Gameplay fit

The procedural system was built to support a survival-focused dungeon loop rather than existing only as a technical demo. Enemies, navigation, and the search for the exit all depend on the dungeon being readable enough to explore while still having enough variation to stay interesting.

The roguelike influence was intentionally light, but it helped frame the dungeon as something worth replaying. Even in prototype form, the system produced enough variety to make multiple runs feel meaningfully different.

## What I learned

The biggest lesson from this project was that procedural generation works best when it is constrained in useful ways. Full randomness is rarely the most interesting option. Giving the generator rules around branching, connectors, valid placement, and failure handling made the final layouts more playable and easier to tune.

I also learned how important graceful failure is in generation systems. A procedural tool does not just need to create good results. It also needs to recover cleanly when an ideal placement is not possible.

## Could this become a full game?

I think it could. The system already has a solid foundation, and there is plenty of room to expand it. If I returned to the project, I would first refine the generation logic to reduce edge-case placement failures and make larger dungeons more reliable.

I would also revisit the progression systems around it. The early skill system could be improved, and I would like to add a stronger equipment loop, shops, better combat progression, and more meaningful decision-making between runs.

Even as a prototype, Dungeon Odyssey was a valuable project for exploring how procedural structure, replayability, and gameplay systems can support one another inside a single technical experiment.
