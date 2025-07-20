# Quick Start Guide - Health Meter CRM on DigitalOcean

This guide will get your Health Meter CRM application running on DigitalOcean in under 30 minutes.

## Prerequisites
- DigitalOcean account
- Domain name (optional)
- SSH access to your droplet

## Step 1: Create DigitalOcean Droplet

1. **Create a new droplet:**
   - Image: Ubuntu 22.04 LTS
   - Size: Basic plan, $12/month (2GB RAM, 1 vCPU) for development
   - Region: Choose closest to your users
   - Authentication: SSH keys (recommended) or Password
   - Hostname: hm-crm-server

2. **Connect to your droplet:**
```bash
ssh root@your_droplet_ip
```

## Step 2: Quick Deployment

Run this one-liner to install everything automatically:

```bash
curl -fsSL https://raw.githubusercontent.com/ishaankarnik11/HM_CRM_Proto/main/deploy.sh | bash -s production
```

**Or follow manual steps:**

```bash
# Update system
apt update && apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Install Docker Compose
apt install docker-compose git -y

# Clone repository
git clone https://github.com/ishaankarnik11/HM_CRM_Proto.git
cd HM_CRM_Proto

# Make deploy script executable
chmod +x deploy.sh

# Run deployment
./deploy.sh production
```

## Step 3: Configure Nginx Proxy Manager

1. **Install Nginx Proxy Manager** (if not already installed):
```bash
mkdir -p ~/nginx-proxy-manager
cd ~/nginx-proxy-manager

cat > docker-compose.yml << 'EOF'
version: '3'
services:
  app:
    image: 'jc21/nginx-proxy-manager:latest'
    restart: unless-stopped
    ports:
      - '80:80'
      - '81:81'
      - '443:443'
    volumes:
      - ./data:/data
      - ./letsencrypt:/etc/letsencrypt
EOF

docker-compose up -d
```

2. **Access Nginx Proxy Manager:**
   - URL: `http://your_droplet_ip:81`
   - Default login: `admin@example.com` / `changeme`
   - Change the password immediately

3. **Add Proxy Hosts:**

   **Frontend (Main App):**
   - Domain: `yourdomain.com`
   - Forward to: `your_droplet_ip:3000`
   - Enable SSL with Let's Encrypt

   **Backend API:**
   - Domain: `api.yourdomain.com`
   - Forward to: `your_droplet_ip:5000`
   - Enable SSL with Let's Encrypt

## Step 4: Configure DNS

Point your domain to your droplet:
- `yourdomain.com` → `your_droplet_ip`
- `api.yourdomain.com` → `your_droplet_ip`

## Step 5: Test Your Deployment

```bash
# Check container status
docker-compose ps

# Test frontend
curl -I http://your_droplet_ip:3000

# Test backend
curl http://your_droplet_ip:5000/health

# Check logs if needed
docker-compose logs -f frontend
docker-compose logs -f backend
```

## Step 6: Access Your Application

- **Frontend:** `https://yourdomain.com`
- **Backend API:** `https://api.yourdomain.com`
- **Health Check:** `https://api.yourdomain.com/health`

## Default Login Credentials

The application uses mock data, so you can access it directly without authentication. 

## Troubleshooting

### Common Issues:

1. **Port already in use:**
```bash
# Check what's using the port
netstat -tulpn | grep :3000
# Kill the process if needed
sudo kill -9 PID
```

2. **Containers not starting:**
```bash
# Check logs
docker-compose logs
# Restart with fresh build
docker-compose down && docker-compose up -d --build
```

3. **SSL certificate issues:**
   - Ensure DNS is properly configured
   - Wait 5-10 minutes for DNS propagation
   - Check Nginx Proxy Manager logs

4. **Out of disk space:**
```bash
# Clean Docker
docker system prune -a
# Check disk usage
df -h
```

## Backup and Maintenance

### Create backups:
```bash
./deploy.sh backup
```

### Update application:
```bash
git pull origin main
docker-compose down
docker-compose up -d --build
```

### Monitor resources:
```bash
# Container stats
docker stats

# System resources
htop
df -h
```

## Security Checklist

- [ ] Change Nginx Proxy Manager default password
- [ ] Configure firewall (UFW)
- [ ] Set up automatic backups
- [ ] Monitor application logs
- [ ] Keep system updated

## Support

If you encounter issues:
1. Check the logs: `docker-compose logs`
2. Verify environment variables in `.env`
3. Check firewall settings
4. Ensure domain DNS is configured correctly

## Cost Summary

**DigitalOcean Droplet:** $12-24/month
**Domain (optional):** $12-15/year
**Total:** ~$13-26/month

You now have a fully functional Health Meter CRM system running on DigitalOcean! 🎉