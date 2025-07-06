# Twitter OAuth Setup Guide

This guide will help you set up Twitter OAuth authentication for the rsdnts application.

## Prerequisites

1. A Twitter Developer Account
2. A Twitter App with OAuth 2.0 enabled

## Step 1: Create a Twitter App

1. Go to [Twitter Developer Portal](https://developer.twitter.com/en/portal/dashboard)
2. Create a new app or use an existing one
3. Enable OAuth 2.0 in your app settings
4. Add the following callback URL: `http://localhost:3000/api/auth/twitter/callback` (for development)
5. Note down your Client ID and Client Secret

## Step 2: Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
# Twitter OAuth Configuration
NEXT_TWITTER_CLIENT_ID=your_twitter_client_id_here
NEXT_TWITTER_CLIENT_SECRET=your_twitter_client_secret_here

# Base URL for your application (optional - defaults to localhost:3000)
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Existing Airtable configuration (keep your existing values)
NEXT_PUBLIC_AIRTABLE_ACCESS_TOKEN=your_airtable_token_here
NEXT_PUBLIC_BASE_ID=your_airtable_base_id_here

# PostHog configuration (keep your existing values)
NEXT_PUBLIC_POSTHOG_KEY=your_posthog_key_here
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

## Step 3: Twitter App Configuration

In your Twitter App settings, make sure to:

1. **App permissions**: Set to "Read" (minimum required)
2. **Type of App**: Set to "Web App, Automated App or Bot"
3. **Callback URLs**: Add `http://localhost:3000/api/auth/twitter/callback`
4. **Website URL**: Add your domain (e.g., `http://localhost:3000`)

## Step 4: Production Setup

For production deployment:

1. Update the callback URL in your Twitter App to your production domain
2. Update `NEXT_PUBLIC_BASE_URL` in your environment variables
3. Ensure your domain is added to the allowed callback URLs in Twitter App settings

## Step 5: Testing

1. Start your development server: `npm run dev`
2. Navigate to `/rsdnts`
3. Click "Login with Twitter"
4. Complete the OAuth flow
5. You should be redirected back and see your Twitter profile information

## Security Notes

- The implementation includes CSRF protection using state parameters
- User sessions are stored in secure HTTP-only cookies
- OAuth state is validated to prevent replay attacks
- All sensitive data is handled server-side

## Troubleshooting

### Common Issues:

1. **"Invalid redirect URI"**: Make sure your callback URL exactly matches what's configured in Twitter App
2. **"State mismatch"**: This is a security feature - try logging in again
3. **"Token exchange failed"**: Check your Client ID and Secret are correct
4. **"User info fetch failed"**: Ensure your app has the correct permissions

### Debug Mode:

To enable debug logging, add this to your `.env.local`:

```env
DEBUG=twitter-oauth:*
```

## API Endpoints

The implementation creates the following API endpoints:

- `GET /api/auth/twitter` - Initiates OAuth flow
- `GET /api/auth/twitter/callback` - Handles OAuth callback
- `GET /api/auth/user` - Gets current user session
- `DELETE /api/auth/user` - Logs out user

## User Data Retrieved

The OAuth flow retrieves the following user information:

- User ID
- Username
- Display name
- Profile image URL
- Verification status
- Follower count
- Following count
- Tweet count

This data is used to display user information and can be used for eligibility verification.
