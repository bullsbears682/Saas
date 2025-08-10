# Proposal Generator SaaS

A professional proposal generator for freelancers and small businesses.

## 🚀 Live Demo

This repository contains the complete Proposal Generator application in the `proposal-generator` directory.

## 📁 Project Structure

```
/
├── proposal-generator/     # Main React application
│   ├── src/               # Source code
│   ├── public/            # Public assets
│   ├── README.md          # Detailed documentation
│   └── package.json       # Dependencies
├── netlify.toml           # Netlify configuration
└── _redirects             # SPA routing rules
```

## 🔧 Netlify Deployment

This project is configured for Netlify deployment:

- **Base directory**: `proposal-generator`
- **Build command**: `npm install && npm run build`
- **Publish directory**: `proposal-generator/build`

### Quick Deploy Steps:

1. Connect this repository to Netlify
2. Netlify will auto-detect settings from `netlify.toml`
3. Deploy automatically

### Manual Deploy:

```bash
cd proposal-generator
npm install
npm run build
# Upload the 'build' folder to Netlify
```

## 📖 Documentation

For complete documentation, setup instructions, and usage guide, see:
- [`proposal-generator/README.md`](./proposal-generator/README.md) - Full documentation
- [`proposal-generator/GETTING_STARTED.md`](./proposal-generator/GETTING_STARTED.md) - Quick start guide
- [`proposal-generator/DEPLOYMENT.md`](./proposal-generator/DEPLOYMENT.md) - Deployment guide

## ✨ Features

- Multi-step proposal form
- Professional PDF generation
- Custom branding and logos
- Responsive design
- TypeScript support
- Form validation

## 🛠️ Tech Stack

- React 18 + TypeScript
- React Hook Form
- jsPDF for PDF generation
- Modern CSS styling

---

**Ready to create professional proposals!** 🎯