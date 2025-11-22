Vercel Deployment Guide for Vendra
This guide will help you deploy the Vendra landing page to Vercel.

Prerequisites
A Vercel account
A Neon database (PostgreSQL)
A Resend account for email functionality
Git repository (GitHub, GitLab, or Bitbucket)
Environment Variables
Before deploying, you'll need to set up the following environment variables in your Vercel project:

Required Variables
DATABASE_URL - Your Neon PostgreSQL connection string

Format: postgresql://user:password@host/database?sslmode=require
Get this from your Neon dashboard at https://console.neon.tech
RESEND_API_KEY - Your Resend API key

Get this from your Resend dashboard at https://resend.com/api-keys
Create an API key with sending permissions
NODE_ENV - Set to production

Optional Variables
RESEND_FROM_EMAIL - The sender email address for welcome emails
Default: Vendra <hello@vendra.ng>
Must be a verified domain in your Resend account
Format: Your Name <email@yourdomain.com>
Deployment Steps
Option 1: Deploy via Vercel Dashboard
Push your code to GitHub

git add .
git commit -m "Prepare for Vercel deployment"
git push origin main

Import to Vercel

Go to Vercel Dashboard
Click "Add New" → "Project"
Import your GitHub repository
Select the repository containing Vendra
Configure Build Settings The project uses a custom build configuration:

Build Command: npm run build (builds both frontend and backend)
Output Directory: Leave as default or dist
Install Command: npm install
Root Directory: ./
Note: The vercel.json file is configured to handle both static assets and API routes automatically.

Add Environment Variables

In the project settings, go to "Environment Variables"
Add all required variables listed above
Make sure to add them for Production, Preview, and Development
Deploy

Click "Deploy"
Wait for the build to complete (usually 2-3 minutes)
Option 2: Deploy via Vercel CLI
Install Vercel CLI

npm install -g vercel

Login to Vercel

vercel login

Deploy

vercel

Add Environment Variables

vercel env add DATABASE_URL
vercel env add RESEND_API_KEY
vercel env add NODE_ENV
vercel env add RESEND_FROM_EMAIL  # Optional

Deploy to Production

vercel --prod

Database Setup
Create Neon Database

Go to Neon Dashboard
Create a new project
Copy the connection string
Run Database Migrations

npm run db:push

Post-Deployment Checklist
 Test the waitlist signup functionality
 Verify email notifications are being sent
 Check that the waitlist count is updating correctly
 Test on mobile devices
 Verify all links work correctly
 Check that the progress bar updates properly
 Test error handling (duplicate emails, invalid emails)
Custom Domain Setup (Optional)
Go to your Vercel project settings
Navigate to "Domains"
Add your custom domain (e.g., vendra.ng)
Follow Vercel's DNS configuration instructions
Wait for DNS propagation (can take up to 48 hours)
Monitoring
After deployment, monitor:

Analytics: Check Vercel Analytics for traffic insights
Logs: Monitor function logs in Vercel dashboard for errors
Database: Monitor Neon dashboard for database performance
Troubleshooting
Build Fails
Check that all dependencies are in package.json
Verify Node version compatibility (use Node 20)
Check build logs for specific errors
Database Connection Issues
Verify DATABASE_URL is correctly formatted
Ensure Neon database is active
Check firewall/IP restrictions
Email Not Sending
Verify RESEND_API_KEY is correct
Check Resend dashboard for API limits
Verify email sender is verified in Resend
Support
For deployment issues:

Vercel Documentation: https://vercel.com/docs
Neon Documentation: https://neon.tech/docs
Resend Documentation: https://resend.com/docs
Production Optimization Tips
Enable Vercel Analytics for user insights
Set up monitoring with Vercel's built-in tools
Configure caching for optimal performance
Enable compression for faster load times
Set up preview deployments for testing before production
Launch Date: Q1 2026
Target: 100 waitlist signups in first week
Success Metrics: Track conversion rate, email open rates, and user engagement
