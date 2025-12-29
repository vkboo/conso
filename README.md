# Conso

A minimal frontend service that loads npm packages into browser console via URL parameters for quick debugging.

## Usage

```
https://console.codingfor.fun?moment           # Load latest moment
https://console.codingfor.fun?moment=2.30.1    # Load specific version
https://console.codingfor.fun?moment&lodash    # Load multiple packages
```

## Local Development

```bash
# Using any static server
npx serve .

# Or Python
python3 -m http.server 8080
```

Then visit `http://localhost:8080?moment` to test.

## Deployment

Pure static project, deploy anywhere:
- Vercel
- Netlify
- GitHub Pages
- Cloudflare Pages

## How It Works

- Packages loaded from [jsDelivr CDN](https://www.jsdelivr.com/)
- No CORS issues (jsDelivr has CORS enabled by default)
- Minimal footprint, fast loading
