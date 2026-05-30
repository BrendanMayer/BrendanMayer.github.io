---
layout: post
title: "Building a Unity Item Registry and Inventory Workflow"
date: 2025-10-08
excerpt: "An editor-tooling experiment in Unity that grew into an item registry, validation system, creation wizard, and runtime inventory workflow."
image: /assets/images/item-registry/item-creation-wizard.png
tags:
  - Unity
  - C#
  - Editor Tools
  - Inventory Systems
---

Over the course of a week, I started experimenting with Unity editor scripting to build a cleaner workflow for creating and managing in-game items. What began as a small quality-of-life idea turned into a full editor extension with its own item registry, validation tools, and a wizard for creating new items with unique IDs.

The original goal was not automation for its own sake. I wanted to design a workflow that reduced repetitive setup, prevented common mistakes, and made item data easier to manage as the project grew. It also became one of the most enjoyable editor-tooling experiments I have worked on.

<figure>
  <img src="/assets/images/item-registry/item-creation-wizard.png" alt="Unity item creation wizard window">
  <figcaption>The Item Creator Wizard turns item setup into a guided editor workflow.</figcaption>
</figure>

## The idea

I needed a better way to manage a growing set of `ItemData` assets, each containing fields like an ID, name, description, and, in some cases, a prefab for placeable objects. Handling all of that manually quickly became tedious. It also made it too easy to create duplicate IDs or inconsistent folder structures.

To solve that, I built an Item Creator Wizard as a custom `EditorWindow`. The wizard handles several steps automatically: it creates the correct folder structure, assigns or checks IDs, generates the asset, and saves everything in the proper location. If the registry asset does not exist yet, it can create that as well.

This turned item creation from a repetitive sequence of manual setup steps into a much more reliable one-click workflow.

## The registry system

Every item needs a unique ID, so the first real problem to solve was ID management. Assigning those values by hand worked at a very small scale, but it was slow, error-prone, and not something I wanted to rely on long term.

I built a dedicated registry asset called `ItemIdRegistry` to track all used item IDs. It is a simple idea, but it removes a lot of human error. When an item is created through the wizard, the system either assigns the next available ID automatically or checks whether the manually entered value is already in use.

If there is a conflict, the tool can prompt the user to switch to the next free ID instead. That small quality-of-life feature makes the workflow smoother and helps prevent overlapping data from slipping into the project unnoticed.

<figure>
  <img src="/assets/images/item-registry/registry-system.png" alt="Unity item registry system diagram">
  <figcaption>The registry keeps item IDs centralized so new assets can be validated before they enter the project.</figcaption>
</figure>

## Validation tools

Once a project has dozens of item assets, small mistakes start to accumulate: incorrect folder names, missing prefabs, mismatched paths, or invalid IDs. Those issues are not dramatic on their own, but they can create a lot of friction later during runtime testing or content integration.

To deal with that, I built an Item Validator that scans through `Assets/Resources/Items` and checks each `ItemData` asset against a set of simple validation rules:

- Folder name matches the item name.
- Each item has a valid non-zero ID.
- Placeable items have prefabs assigned.
- File paths match the expected structure.

The validator outputs problems in a scrollable list. It is intentionally simple, but it is fast, practical, and catches the kinds of issues that would otherwise waste time later.

<figure>
  <img src="/assets/images/item-registry/item-validation.png" alt="Unity editor validation window for item data">
  <figcaption>The validator scans item assets and reports setup issues before they become runtime problems.</figcaption>
</figure>

## Editor utilities

I also added utility actions under `Tools/Items/`. One option rescans and rebuilds the registry, while another opens the registry directly in the inspector. That makes it easier to refresh item IDs after refactors or when bringing in assets from another branch.

<figure>
  <img src="/assets/images/item-registry/tool-window-registry.png" alt="Unity editor menu tools for item registry actions">
  <figcaption>Small editor utilities make the item workflow easier to maintain as the project grows.</figcaption>
</figure>

These tools are small, but that is part of what made the project useful. They are the kind of utilities that make the workflow around a project more stable and less annoying over time.

## Runtime integration

As the editor tools improved, I started integrating them into a broader inventory workflow. I now have a working inventory system that reads item IDs and loads item data dynamically at runtime through a custom debug terminal. I have also extended the same general approach to containers.

This shifted the project from being purely an editor experiment into something that connects directly to gameplay systems. The registry is not just organizing assets in the editor. It is also helping support how those assets are loaded and referenced in play.

## What I learned

Before this, I mostly thought of editor scripting as a way to make small debugging helpers or isolated convenience tools. Working on a more complete workflow changed that. Building tools that integrate directly with Unity’s editor made the whole development process feel more deliberate and scalable.

Features like `MenuItem`, `EditorGUILayout`, and `AssetDatabase` felt much more approachable once I started using them in a real project. More importantly, I could see how even relatively small custom tools can remove a lot of friction from everyday development.

It was also a good reminder that tools do not need to be flashy to be valuable. A small editor window that saves ten clicks per asset can pay for itself very quickly once the project grows.

## What’s next

The next step is improving persistence. I want inventory and container contents to be saved accurately in a bundled save file, which would make the system a better fit for a larger survival or sandbox-style project. That also opens the door to cloud-backed save workflows, including something appropriate for Steam Cloud integration.

Overall, this started as a side experiment and became a useful example of how editor scripting can support both workflow and runtime systems. It made me a lot more interested in building tools, not just game features, and showed how much value there is in improving the development process itself.
