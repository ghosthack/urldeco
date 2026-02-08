# Cloudflare Pages Deployment Guide

This guide explains how to deploy any static site to Cloudflare Pages using Wrangler CLI.

## Prerequisites

1. **Node.js** installed (18+ recommended)
2. **Cloudflare account** (free tier works fine)
3. **Wrangler CLI** installed:
   ```bash
   npm install -g wrangler
   # or
   npx wrangler --version
   ```

## Initial Setup

### 1. Authenticate with Cloudflare

```bash
npx wrangler login
```

This opens a browser window to authorize Wrangler to access your Cloudflare account.

### 2. Create wrangler.toml

Create a `wrangler.toml` file in your project root:

```toml
name = "your-project-name"
compatibility_date = "2024-02-08"
pages_build_output_dir = "dist"
```

**Important fields:**
- `name`: Your project name (must be unique across Cloudflare)
- `pages_build_output_dir`: Directory containing your built static files (e.g., `dist`, `build`, `public`)
- `compatibility_date`: Use today's date or a recent date

### 3. Create the Pages Project

```bash
npx wrangler pages project create your-project-name --production-branch=main
```

**Notes:**
- Replace `your-project-name` with your desired project name
- Replace `main` with your default branch name if different (e.g., `master`)
- Project name must be unique across all Cloudflare Pages

## Deployment

### Build your project

```bash
npm run build
# or
yarn build
# or your build command
```

### Deploy to Cloudflare Pages

```bash
npx wrangler pages deploy dist --project-name=your-project-name
```

**Options:**
- `dist`: Your build output directory
- `--project-name`: Must match the name used when creating the project
- `--commit-dirty=true`: Skip the "uncommitted changes" warning

## Complete Example Workflow

```bash
# 1. Login (one-time setup)
npx wrangler login

# 2. Create wrangler.toml (one-time setup)
echo 'name = "my-app"
compatibility_date = "2024-02-08"
pages_build_output_dir = "dist"' > wrangler.toml

# 3. Create project (one-time setup)
npx wrangler pages project create my-app --production-branch=main

# 4. Build and deploy (repeat as needed)
npm run build
npx wrangler pages deploy dist --project-name=my-app
```

## Common Issues & Solutions

### Issue: "Project not found"
**Solution:** Create the project first:
```bash
npx wrangler pages project create your-project-name --production-branch=main
```

### Issue: "Missing pages_build_output_dir field"
**Solution:** Update your `wrangler.toml`:
```toml
pages_build_output_dir = "dist"
```

### Issue: "Configuration file does not support 'build'"
**Solution:** Remove the `[build]` section from `wrangler.toml`. For Pages, build locally first, then deploy.

### Issue: Permission denied / Not authenticated
**Solution:** Login again:
```bash
npx wrangler login
```

### Issue: "Must specify a production branch"
**Solution:** Add `--production-branch` flag:
```bash
npx wrangler pages project create name --production-branch=main
```

## Using with Different Cloudflare Accounts

If you need to switch accounts:

1. **Logout from current account:**
   ```bash
   npx wrangler logout
   ```

2. **Login to new account:**
   ```bash
   npx wrangler login
   ```

3. **Or use API Token (CI/CD):**
   ```bash
   export CLOUDFLARE_API_TOKEN=your_token_here
   npx wrangler pages deploy dist --project-name=your-project
   ```

   Create token at: https://dash.cloudflare.com/profile/api-tokens
   - Template: "Cloudflare Pages"
   - Permissions: Zone:Read, Account:Read, Pages:Edit

## Git Integration (Optional)

For automatic deployments on git push:

1. Go to https://dash.cloudflare.com
2. Navigate to Pages → your project
3. Click "Connect to Git"
4. Authorize GitHub/GitLab
5. Select repository and configure build settings:
   - Build command: `npm run build`
   - Build output directory: `dist`

## Useful Commands

```bash
# Check wrangler version
npx wrangler --version

# View current user info
npx wrangler whoami

# List all Pages projects
npx wrangler pages project list

# Delete a project
npx wrangler pages project delete your-project-name

# View deployment logs
npx wrangler pages deployment list --project-name=your-project-name
```

## Resources

- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
- [Wrangler CLI Docs](https://developers.cloudflare.com/workers/wrangler/)
- [Create API Token](https://dash.cloudflare.com/profile/api-tokens)

---

**Quick Reference for this project:**
```bash
npm run build
npx wrangler pages deploy dist --project-name=urldeco
```
