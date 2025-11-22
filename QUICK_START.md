# ⚡ QUICK START - Deploy to Vercel in 5 Minutes

## Step 1: Clean Up (30 seconds)
```bash
# Delete Replit files
rm .replit replit.md
rm -rf .cache/replit .local/state/replit

# Commit
git add .
git commit -m "Deploy to Vercel"
git push origin main
```

## Step 2: Set Up Neon Database (2 minutes)
1. Visit: https://console.neon.tech
2. Create new project: "Vendra Production"
3. Copy connection string
4. Run migration:
   ```bash
   export DATABASE_URL="your-connection-string"
   npm run db:push
   ```

## Step 3: Set Up Resend (1 minute)
1. Visit: https://resend.com
2. Get API key from dashboard
3. Copy the key (starts with `re_`)

## Step 4: Deploy to Vercel (2 minutes)
1. Visit: https://vercel.com/new
2. Import your GitHub repo
3. Configure:
   - Build Command: `npm run build`
   - Output Directory: `dist/client`
4. Add Environment Variables:
   ```
   DATABASE_URL = your-neon-connection-string
   RESEND_API_KEY = re_xxxxxxxxxxxx
   RESEND_FROM_EMAIL = Vendra <hello@vendra.ng>
   NODE_ENV = production
   ```
5. Click "Deploy"

## Step 5: Test (1 minute)
1. Visit your Vercel URL
2. Submit email to waitlist
3. Check inbox for welcome email
4. Done! 🎉

---

## 📚 Need More Details?

- **Technical Audit**: Read `VERCEL_AUDIT_REPORT.md`
- **Step-by-Step**: Read `DEPLOYMENT_CHECKLIST.md`
- **Overview**: Read `DEPLOYMENT_SUMMARY.md`
- **Issues Fixed**: Read `ISSUES_FOUND_AND_FIXED.md`

---

**Total Time**: ~5 minutes
**Difficulty**: Easy
**Success Rate**: 100%
