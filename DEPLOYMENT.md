# Deployment Guide

This guide covers deploying the FHIR Runtime Playground to various hosting platforms.

## Build for Production

```bash
npm run build
```

This creates an optimized production build in the `dist/` directory.

## Deployment Options

### 1. Netlify

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy)

**Via Netlify CLI:**

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build the project
npm run build

# Deploy
netlify deploy --prod --dir=dist
```

**Via Git:**

1. Push your repository to GitHub
2. Connect your repository to Netlify
3. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Deploy

### 2. Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

**Via Vercel CLI:**

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

**Via Git:**

1. Push your repository to GitHub
2. Import project to Vercel
3. Vercel will auto-detect Vite configuration
4. Deploy

### 3. GitHub Pages

**Using GitHub Actions:**

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build
        run: npm run build
        
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

**Manual deployment:**

```bash
# Build
npm run build

# Deploy to gh-pages branch
npx gh-pages -d dist
```

### 4. AWS S3 + CloudFront

```bash
# Build
npm run build

# Upload to S3
aws s3 sync dist/ s3://your-bucket-name --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"
```

### 5. Docker

Create `Dockerfile`:

```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Create `nginx.conf`:

```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
```

Build and run:

```bash
docker build -t fhir-runtime-playground .
docker run -p 8080:80 fhir-runtime-playground
```

## Environment Configuration

This application runs entirely in the browser and requires no environment variables or backend configuration.

## Performance Optimization

The production build includes:
- Code splitting
- Tree shaking
- Minification
- Gzip compression (when served properly)

### Build Size Warning

The build may show a warning about chunk sizes > 500 KB. This is expected due to:
- FHIR specification data
- Monaco Editor
- Mantine UI library

To optimize further, consider:
- Implementing code splitting with dynamic imports
- Lazy loading modules
- Using CDN for large dependencies

## Post-Deployment Verification

After deployment, verify:

1. **All modules load correctly:**
   - Explore tab displays resource trees
   - Validate tab shows 3-column layout
   - Diff tab loads comparison view
   - FHIRPath tab shows Monaco editor

2. **FHIR functionality works:**
   - Resource validation succeeds
   - FHIRPath expressions evaluate
   - Profile comparison displays differences

3. **Assets load properly:**
   - Favicon appears
   - Styles render correctly
   - Monaco editor themes work

## Troubleshooting

### Build Fails

```bash
# Clear cache and rebuild
rm -rf node_modules dist
npm install
npm run build
```

### 404 on Refresh

Configure your hosting platform to redirect all routes to `index.html` (SPA routing).

**Netlify:** Create `public/_redirects`:
```
/*    /index.html   200
```

**Vercel:** Create `vercel.json`:
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

### Large Bundle Size

The application includes FHIR specification data which increases bundle size. This is expected and necessary for offline functionality.

## Security Considerations

- No sensitive data is stored
- All processing happens client-side
- No authentication required
- No external API calls (except loading spec data)

## Monitoring

Consider adding:
- Google Analytics or similar
- Error tracking (Sentry, etc.)
- Performance monitoring

## Support

For deployment issues, please open an issue at:
https://github.com/medxaidev/fhir-runtime-playground/issues
