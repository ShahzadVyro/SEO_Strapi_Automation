# SEO Strapi Automation

A MERN-stack web app for creating and managing Strapi CMS Cluster Pages for the Imagine platform (imagine.art).

## What this replaces
Previously, content writers used a Google Docs + Python scripts workflow to publish cluster pages to Strapi. This project replaces that with a proper web UI.

## Stack
- **MongoDB** — draft storage and publish log
- **Express + Node.js** — backend API proxy to Strapi
- **React** — content editor UI
- **Strapi** — headless CMS (existing, unchanged)

## Structure
```
/client        → React frontend
/server        → Node.js + Express backend
/scripts       → Utility scripts (Python CLI tools kept from old project)
```

## Setup
Coming soon.
