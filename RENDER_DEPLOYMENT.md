# Ainm API - Render Deployment Guide

## Prerequisites
- GitHub repository with your Ainm.API code
- Render account
- Neon database (already set up)

## Step 1: Configure Neon Database

1. Go to your Neon dashboard
2. Get your connection details:
   - **Host**: `your-project.neon.tech`
   - **Database**: `ainm_production`
   - **Username**: Your Neon username
   - **Password**: Your Neon password
   - **Port**: `5432`
3. Note down the connection string format:
   ```
   Host=your-project.neon.tech;Database=ainm_production;Username=your-username;Password=your-password;Port=5432;SSL Mode=Require
   ```

## Step 2: Deploy the API

1. Go to your Render dashboard
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure the service:

### Build Settings:
- **Build Command**: `docker build -f Ainm.API/Dockerfile -t ainm-api .`
- **Start Command**: `docker run -p 10000:8080 ainm-api`

### Environment Variables:
```
ASPNETCORE_ENVIRONMENT=Production
ASPNETCORE_URLS=http://+:8080
ConnectionStrings__DefaultConnection=Host=your-project.neon.tech;Database=ainm_production;Username=your-neon-username;Password=your-neon-password;Port=5432;SSL Mode=Require
Jwt__Key=your-super-secret-jwt-key-here-make-it-very-long-and-secure
Jwt__Issuer=Ainm.API
EmailSettings__SendGridApiKey=your-sendgrid-api-key
EmailSettings__FromEmail=noreply@ainm.com
EmailSettings__FromName=Ainm
```

### Advanced Settings:
- **Dockerfile Path**: `Ainm.API/Dockerfile`
- **Docker Context**: `.`
- **Port**: `8080`

## Step 3: Update Frontend Environment

Update your React app's environment variables:
```env
REACT_APP_API_URL=https://your-render-app-name.onrender.com
```

## Step 4: Configure CORS

The API is already configured for CORS with your Netlify domain. If you need to add more domains, update the CORS policy in `Program.cs`.

## Step 5: Database Migration

The API will automatically run migrations on startup, so your database will be set up with all the necessary tables and seeded with baby names.

## Troubleshooting

### Common Issues:

1. **Build Fails**: Make sure the Dockerfile is in the correct location
2. **Database Connection**: Verify your PostgreSQL connection string
3. **CORS Issues**: Check that your frontend domain is in the CORS policy
4. **JWT Issues**: Ensure your JWT key is the same in both frontend and backend

### Logs:
- Check Render logs for any startup errors
- Verify database connection in the logs
- Check if migrations ran successfully

## Security Notes:

1. **Change default passwords** in production
2. **Use strong JWT keys** (at least 32 characters)
3. **Enable HTTPS** (Render provides this automatically)
4. **Regularly update dependencies**

## Monitoring:

- Use Render's built-in monitoring
- Set up alerts for downtime
- Monitor database performance
- Check API response times
