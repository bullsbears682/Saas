# 🔧 Troubleshooting Guide - ProposalPro

## 🚨 Common Issues & Solutions

### **"App Doesn't Load" / White Screen**

#### **Cause 1: Missing Environment Variables**
**Symptoms**: White screen, Firebase errors in console
**Solution**:
```bash
# Create .env file in proposal-generator directory
cp .env.example .env

# Either configure Firebase OR leave empty for demo mode
# Demo mode works perfectly for testing PDF generation
```

#### **Cause 2: Build Errors**
**Symptoms**: Build fails, TypeScript errors
**Solution**:
```bash
cd proposal-generator
npm install  # Reinstall dependencies
npm run build  # Check for specific errors
```

#### **Cause 3: Port Already in Use**
**Symptoms**: "Something is already running on port 3000"
**Solution**:
```bash
# Kill existing process
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3001 npm start
```

---

## 🔥 Firebase Setup Issues

### **"Firebase Not Configured" Error**
**This is normal!** The app runs in **Demo Mode** without Firebase.

**Demo Mode Features**:
- ✅ Full PDF generation with professional styling
- ✅ All templates and features work
- ✅ Subscription simulation (localStorage)
- ✅ Complete UI testing
- ❌ No user accounts or proposal saving

**To Enable Full Features**:
1. Set up Firebase project (see `BUSINESS_SETUP.md`)
2. Add environment variables to `.env`
3. Restart the application

### **Firebase Auth Domain Errors**
```bash
# Make sure your domain is added to Firebase Console
# Go to Authentication > Settings > Authorized domains
# Add: localhost, your-domain.com, your-netlify-app.netlify.app
```

---

## 🌐 Deployment Issues

### **Netlify 404 Errors**
**Cause**: SPA routing not configured
**Solution**: Already fixed with `_redirects` and `netlify.toml`

### **Environment Variables Not Working**
**Netlify Solution**:
1. Go to Site Settings > Environment Variables
2. Add all `REACT_APP_*` variables
3. Redeploy

**Vercel Solution**:
1. Go to Project Settings > Environment Variables  
2. Add variables for Production environment
3. Redeploy

### **Build Fails on Deployment**
**Common Causes**:
```bash
# Missing dependencies
npm install

# TypeScript errors
npm run build  # Check locally first

# Memory issues (rare)
# Increase Node memory in netlify.toml:
# [build.environment]
# NODE_OPTIONS = "--max_old_space_size=4096"
```

---

## 📱 Browser Compatibility

### **PDF Generation Not Working**
**Cause**: Browser compatibility with jsPDF
**Solution**: Use modern browsers (Chrome 90+, Firefox 88+, Safari 14+)

### **Styling Issues**
**Cause**: CSS Grid/Flexbox support
**Solution**: Update browser or add polyfills

---

## 🔍 Debugging Steps

### **1. Check Console Errors**
```javascript
// Open browser dev tools (F12)
// Look for red errors in Console tab
// Common errors and solutions:

// "Firebase: No Firebase App" → Normal in demo mode
// "Module not found" → Run npm install
// "Cannot read property" → Check data structure
```

### **2. Test PDF Generation**
```bash
# Load sample data and generate PDF
# If this works, the core functionality is fine
# Issues are likely with auth/database only
```

### **3. Check Network Tab**
```javascript
// Look for failed requests
// 404s → Check API endpoints
// CORS errors → Check Firebase configuration
// 500s → Check server logs
```

---

## 🚀 Performance Issues

### **Slow PDF Generation**
**Cause**: Complex styling and large PDFs
**Solutions**:
- Use simpler templates for large proposals
- Generate PDFs in chunks for very long content
- Consider server-side generation for enterprise

### **Large Bundle Size**
**Current**: ~329KB (very reasonable for a full SaaS)
**If needed**:
```bash
# Analyze bundle
npm install -g webpack-bundle-analyzer
npx webpack-bundle-analyzer build/static/js/*.js
```

---

## 💡 Quick Fixes

### **App Won't Start**
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
npm start
```

### **Styling Broken**
```bash
# Check CSS imports
# Verify App.css and index.css are imported
# Clear browser cache (Ctrl+F5)
```

### **PDFs Not Downloading**
```bash
# Check browser popup blocker
# Try different browser
# Check console for jsPDF errors
```

---

## 🎯 Testing Checklist

Before reporting issues, verify:

- [ ] **Basic Loading**: App loads without errors
- [ ] **PDF Generation**: Can generate and download PDFs
- [ ] **Template Selection**: Can switch between templates
- [ ] **Form Validation**: Required fields work properly
- [ ] **Responsive Design**: Works on mobile/tablet
- [ ] **Demo Mode**: Shows demo notice when Firebase not configured

---

## 📞 Getting Help

### **Self-Diagnosis**
1. Check this troubleshooting guide first
2. Look at browser console errors
3. Verify environment configuration
4. Test in incognito/private mode

### **Common Solutions**
- **90% of issues**: Missing environment variables or dependencies
- **Clear browser cache**: Often fixes styling issues
- **Restart development server**: Fixes many hot-reload issues
- **Check Firebase quotas**: Free tier has limits

### **Still Having Issues?**
1. Check `BUSINESS_SETUP.md` for detailed configuration
2. Verify all dependencies are installed
3. Test in different browser
4. Check Firebase/Stripe dashboard for errors

---

## ✅ **Current Status: WORKING**

Your app is now configured to:
- ✅ **Load properly** in both demo and production modes
- ✅ **Handle missing Firebase** gracefully with demo mode
- ✅ **Generate PDFs** with professional styling
- ✅ **Work on Netlify** with proper deployment configuration
- ✅ **Provide clear feedback** when features aren't configured

**The app should now load perfectly!** 🚀

If you're still having issues, it might be:
1. Browser cache (try Ctrl+F5 or incognito mode)
2. Network connectivity 
3. Netlify deployment still processing (wait 2-3 minutes)

**Test the latest version on your Netlify URL now!** ✨