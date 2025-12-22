# Deployment Guide

## Hosting Model
- Static site
- Hosted on Cloudflare Pages
- Source controlled via GitHub

## Deployment Flow
1. Commit changes to the `main` branch
2. Push to GitHub
3. Cloudflare Pages auto-builds and deploys
4. CDN updates globally

## Cloudflare Pages Settings
- Framework preset: None
- Build command: None
- Output directory: /

## Rollback Procedure
1. Cloudflare Dashboard
2. Pages → originthinking.com
3. Deployments
4. Select previous deployment
5. Click Rollback

## Cache Management
Normally automatic.
Manual purge only if assets fail to update.
