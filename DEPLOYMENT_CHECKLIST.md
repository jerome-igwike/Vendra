# ✅ Vercel Deployment Checklist

## Pre-Deployment (Do This First)

### 1. Clean Up Replit Files
```bash
# Remove Replit-specific configurations
rm -f .replit
rm -f replit.md
rm -rf .cache/replit
rm -rf .local/state/replit

# Verify they're removed
ls -la | grep replit
# Should show no results
```

### 2. Verify Git Status
```bash
git status
# Should not show .replit or replit.md

git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

---

## Database Setup

### 3. Create Neon Database
- [ ] Go to https://console.neon.tech
- [ ] Create new project: "Vendra Production"
- [ ] Copy connection string (starts with `postgresql://`)
- [ ] Save it securely (you'll need it next)

### 4. Run Database Migrations
```bash
# Set DATABASE_URL locally
export DATABASE_URL="your-connection-string-here"

# Push schema to database
npm run db:push

# Verify table created
# Check Neon dashboard → SQL Editor → Tables
```

---

## Email Setup

### 5. Configure Resend
- [ ] Go to https://resend.com
- [ ] Create account / Login
- [ ] Verify your domain (or use `onboarding@resend.dev` for testing)
- [ ] Create API key with "Sending access"
- [ ] Copy API key (starts with `re_`)
- [ ] Test send an email from Resend dashboard

---

## Vercel Deployment

### 6. Import Project to Vercel
- [ ] Go to https://vercel.com/new
- [ ] Click "Import Project"
- [ ] Select your Git repository
- [ ] Click "Import"

### 7. Configure Build Settings
```
Framework Preset: Other
Build Command: npm run build
Output Directory: dist/client
Install Command: npm install
Root Directory: ./
```

### 8. Add Environment Variables
Go to Project Settings → Environment Variables, add:

```env
DATABASE_URL
Value: postgresql://user:password@your-neon-host.neon.tech/database?sslmode=require
Environments: Production, Preview, Development

RESEND_API_KEY
Value: re_xxxxxxxxxxxx
Environments: Production, Preview, Development

RESEND_FROM_EMAIL
Value: Vendra <hello@vendra.ng>
Environments: Production, Preview, Development

NODE_ENV
Value: production
Environments: Production only
```

### 9. Deploy
- [ ] Click "Deploy"
- [ ] Wait for build (2-3 minutes)
- [ ] Check deployment logs for errors

---

## Post-Deployment Testing

### 10. Test Homepage
- [ ] Visit `https://your-app.vercel.app`
- [ ] Check that page loads completely
- [ ] Verify design looks correct
- [ ] Test mobile responsive design

### 11. Test Waitlist Form
- [ ] Enter a valid email
- [ ] Click "Join Waitlist"
- [ ] Should see success message
- [ ] Check email inbox for welcome email

### 12. Test API Endpoints
```bash
# Test count endpoint
curl https://your-app.vercel.app/api/waitlist/count
# Should return: {"count": 1}

# Test duplicate email (should fail)
curl -X POST https://your-app.vercel.app/api/waitlist \
  -H "Content-Type: application/json" \
  -d '{"email":"same@email.com"}'
# Should return: {"message":"This email is already on the waitlist"}
```

### 13. Verify Database
- [ ] Go to Neon dashboard
- [ ] Check `waitlist` table
- [ ] Verify email was inserted
- [ ] Confirm `createdAt` timestamp is correct

### 14. Check Email Delivery
- [ ] Open welcome email
- [ ] Verify HTML renders correctly
- [ ] Check branding (logo, colors)
- [ ] Test all links work
- [ ] Verify position number is correct

### 15. Test Error Handling
- [ ] Submit invalid email format
- [ ] Submit duplicate email
- [ ] Submit empty form
- [ ] Verify appropriate error messages

---

## Monitoring Setup

### 16. Enable Vercel Analytics
- [ ] Go to Project Settings → Analytics
- [ ] Enable Web Analytics
- [ ] Enable Speed Insights

### 17. Set Up Alerts
- [ ] Go to Project Settings → Integrations
- [ ] Add error monitoring (optional: Sentry)
- [ ] Configure email notifications for errors

---

## Optional: Custom Domain

### 18. Add Custom Domain
- [ ] Go to Project Settings → Domains
- [ ] Click "Add Domain"
- [ ] Enter your domain: `vendra.ng`
- [ ] Follow DNS configuration instructions
- [ ] Wait for DNS propagation (up to 48 hours)

---

## Performance Checks

### 19. Lighthouse Audit
- [ ] Run Lighthouse in Chrome DevTools
- [ ] Performance score should be 90+
- [ ] Accessibility score should be 90+
- [ ] Best Practices score should be 90+
- [ ] SEO score should be 90+

### 20. Mobile Testing
- [ ] Test on iOS Safari
- [ ] Test on Android Chrome
- [ ] Verify form submission works
- [ ] Check layout doesn't break

---

## Final Verification

### 21. Complete User Flow
- [ ] User visits homepage
- [ ] User reads content
- [ ] User submits email
- [ ] User receives email
- [ ] User sees confirmation message
- [ ] Waitlist count increases

### 22. Monitor Logs
```bash
# Watch Vercel function logs
vercel logs --follow

# Or check in Vercel dashboard
# Project → Deployments → Latest → Functions
```

---

## Success Criteria

✅ Homepage loads in <2 seconds
✅ API endpoints respond in <500ms
✅ Emails deliver within 30 seconds
✅ No console errors
✅ No 404 errors
✅ Mobile responsive
✅ Database writes succeed
✅ Rate limiting works
✅ Error messages are user-friendly
✅ Analytics tracking enabled

---

## Troubleshooting

### Build Fails
- Check Vercel build logs
- Verify all dependencies in package.json
- Ensure Node version is 20.x
- Check for TypeScript errors

### API Returns 404
- Verify `/api` folder exists in deployment
- Check `vercel.json` rewrites
- Ensure serverless functions have correct exports

### Database Connection Fails
- Verify DATABASE_URL is correct
- Check Neon database is active
- Ensure connection string includes `?sslmode=require`
- Test connection from Vercel logs

### Email Not Sending
- Verify RESEND_API_KEY is correct
- Check Resend dashboard for API limits
- Ensure sender email is verified
- Check Vercel function logs for errors

### Environment Variables Not Working
- Ensure variables are added to all environments
- Redeploy after adding new variables
- Check variable names match exactly (case-sensitive)

---

## Support Links

- 📚 Vercel Docs: https://vercel.com/docs
- 🗄️ Neon Docs: https://neon.tech/docs
- 📧 Resend Docs: https://resend.com/docs
- 🔧 Drizzle ORM: https://orm.drizzle.team

---

## 🎉 Deployment Complete!

Once all checklist items are complete, your app is live!

**Next Steps**:
1. Share the URL with stakeholders
2. Monitor analytics and error logs
3. Plan for scaling (upgrade Neon/Resend plans as needed)
4. Set up automated backups for database

**Launch Goals**:
- 100 waitlist signups in first week
- <1% error rate
- >95% email delivery rate
- <2s average page load time

---

**Last Updated**: November 19, 2025
**Status**: Ready for Production Deployment
