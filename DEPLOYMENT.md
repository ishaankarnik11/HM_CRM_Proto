# Health Meter CRM - DigitalOcean Deployment Guide

This guide will help you deploy the Health Meter CRM application on a DigitalOcean droplet using Docker containers and Nginx Proxy Manager.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [DigitalOcean Droplet Setup](#digitalocean-droplet-setup)
3. [Application Architecture](#application-architecture)
4. [Docker Configuration](#docker-configuration)
5. [Database Setup](#database-setup)
6. [Nginx Proxy Manager Configuration](#nginx-proxy-manager-configuration)
7. [SSL/HTTPS Setup](#sslhttps-setup)
8. [Deployment Steps](#deployment-steps)
9. [Environment Variables](#environment-variables)
10. [Monitoring & Maintenance](#monitoring--maintenance)
11. [Troubleshooting](#troubleshooting)

## Prerequisites

- DigitalOcean account
- Domain name (optional but recommended)
- Basic knowledge of Docker and Linux commands
- SSH access to your droplet

## DigitalOcean Droplet Setup

### Recommended Droplet Specifications
- **OS**: Ubuntu 22.04 LTS
- **Size**: 
  - Development: 2 GB RAM, 1 vCPU, 50 GB SSD ($12/month)
  - Production: 4 GB RAM, 2 vCPUs, 80 GB SSD ($24/month)
- **Region**: Choose closest to your users

### Initial Server Setup

1. **Create and access your droplet:**
```bash
ssh root@your_droplet_ip
```

2. **Update the system:**
```bash
apt update && apt upgrade -y
```

3. **Install Docker:**
```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Install Docker Compose
apt install docker-compose -y

# Start Docker service
systemctl start docker
systemctl enable docker
```

4. **Create a non-root user (optional but recommended):**
```bash
adduser hmcrm
usermod -aG sudo hmcrm
usermod -aG docker hmcrm
su - hmcrm
```

5. **Install additional tools:**
```bash
apt install git nginx certbot python3-certbot-nginx -y
```

## Application Architecture

```
┌─────────────────────────────────────────────────────┐
│                 DigitalOcean Droplet                │
├─────────────────────────────────────────────────────┤
│  ┌─────────────────┐    ┌────────────────────────┐  │
│  │ Nginx Proxy     │    │   Health Meter CRM     │  │
│  │ Manager         │────│   Frontend (React)     │  │
│  │ (Port 80/443)   │    │   (Port 3000)          │  │
│  └─────────────────┘    └────────────────────────┘  │
│                                                     │
│  ┌─────────────────────────────────────────────────┐ │
│  │   Backend API (Node.js/Express)                 │ │
│  │   (Port 5000)                                   │ │
│  └─────────────────────────────────────────────────┘ │
│                                                     │
│  ┌─────────────────────────────────────────────────┐ │
│  │   Database (PostgreSQL/MySQL)                   │ │
│  │   (Port 5432/3306)                             │ │
│  └─────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────┘
```

## Docker Configuration

### Project Structure
```
HM_CRM_Proto/
├── frontend/
│   ├── Dockerfile
│   └── ... (React app files)
├── backend/
│   ├── Dockerfile
│   └── ... (API files)
├── docker-compose.yml
├── docker-compose.prod.yml
├── .env
├── .env.production
└── nginx/
    └── nginx.conf
```

## Database Setup

Since your current application uses mock data, we'll create a backend API to serve the data and optionally add a database for persistence.

### Option 1: Continue with Mock Data (Simpler)
Keep using the existing mock data service with a simple Node.js API wrapper.

### Option 2: Add Real Database (Recommended for Production)
Add PostgreSQL for data persistence.

## Deployment Steps

### Step 1: Prepare Your Droplet

1. **Clone your repository:**
```bash
cd /home/hmcrm  # or your preferred directory
git clone https://github.com/ishaankarnik11/HM_CRM_Proto.git
cd HM_CRM_Proto
```

2. **Set up environment variables:**
```bash
# Copy the example environment file
cp .env.example .env

# Edit the environment file with your values
nano .env
```

**Important Environment Variables to Set:**
```bash
# Generate a secure database password
DB_PASSWORD=$(openssl rand -base64 32)

# Generate a secure JWT secret
JWT_SECRET=$(openssl rand -base64 64)

# Set your domain name
REACT_APP_API_URL=https://api.yourdomain.com/api
FRONTEND_URL=https://yourdomain.com
```

### Step 2: Build and Deploy with Docker

1. **Build the containers:**
```bash
# For development
docker-compose up -d

# For production (recommended)
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

2. **Verify the deployment:**
```bash
# Check container status
docker-compose ps

# Check logs
docker-compose logs -f frontend
docker-compose logs -f backend
docker-compose logs -f database
```

3. **Initialize the database (if using PostgreSQL):**
```bash
# Access the database container
docker-compose exec database psql -U hmcrm -d hm_crm

# Create initial tables (optional - backend uses mock data by default)
\dt
\q
```

### Step 3: Configure Nginx Proxy Manager

1. **Access Nginx Proxy Manager:**
   - Open your browser and go to `http://your_droplet_ip:81`
   - Default login: `admin@example.com` / `changeme`

2. **Add a new Proxy Host:**
   - **Domain Names:** `yourdomain.com www.yourdomain.com`
   - **Scheme:** `http`
   - **Forward Hostname/IP:** `your_droplet_ip`
   - **Forward Port:** `3000`
   - **Cache Assets:** ✅ (checked)
   - **Block Common Exploits:** ✅ (checked)
   - **Websockets Support:** ✅ (checked)

3. **Add API Proxy Host:**
   - **Domain Names:** `api.yourdomain.com`
   - **Scheme:** `http`
   - **Forward Hostname/IP:** `your_droplet_ip`
   - **Forward Port:** `5000`
   - **Cache Assets:** ❌ (unchecked)
   - **Block Common Exploits:** ✅ (checked)

### Step 4: SSL/HTTPS Setup

1. **In Nginx Proxy Manager, for each proxy host:**
   - Go to the **SSL** tab
   - **SSL Certificate:** Request a new SSL Certificate
   - **Email:** your-email@domain.com
   - **Use a DNS Challenge:** No (use HTTP challenge)
   - **Agree to Let's Encrypt Terms:** ✅
   - **Save**

2. **Force SSL redirect:**
   - **Force SSL:** ✅ (checked)
   - **HTTP/2 Support:** ✅ (checked)
   - **HSTS Enabled:** ✅ (checked)

## Environment Variables

Create a `.env` file in your project root:

```bash
# Database Configuration
DB_NAME=hm_crm
DB_USER=hmcrm
DB_PASSWORD=your_secure_database_password_here
DB_HOST=database
DB_PORT=5432

# Backend Configuration
NODE_ENV=production
JWT_SECRET=your_super_secret_jwt_key_minimum_64_characters_long
API_PORT=5000

# Frontend Configuration
REACT_APP_API_URL=https://api.yourdomain.com/api
FRONTEND_URL=https://yourdomain.com

# Security
CORS_ORIGIN=https://yourdomain.com
```

## Application URLs

After deployment, your application will be available at:

- **Frontend:** `https://yourdomain.com`
- **Backend API:** `https://api.yourdomain.com`
- **Health Check:** `https://api.yourdomain.com/health`
- **Nginx Proxy Manager:** `http://your_droplet_ip:81`

## Monitoring & Maintenance

### Health Checks

1. **Check application health:**
```bash
# Frontend health
curl -f https://yourdomain.com

# Backend health
curl -f https://api.yourdomain.com/health

# Database connection
docker-compose exec backend npm run db:check
```

2. **Monitor resources:**
```bash
# Container stats
docker stats

# Disk usage
df -h

# Memory usage
free -h
```

### Log Management

1. **View application logs:**
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f frontend
docker-compose logs -f backend
docker-compose logs -f database
```

2. **Log rotation (automatic with docker-compose.prod.yml):**
   - Logs are automatically rotated
   - Max size: 10MB per file
   - Max files: 3 per container

### Backup & Recovery

1. **Database backup:**
```bash
# Create backup script
cat > backup.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/home/hmcrm/backups"
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR

# Database backup
docker-compose exec -T database pg_dump -U hmcrm hm_crm > $BACKUP_DIR/db_backup_$DATE.sql

# Keep only last 7 days of backups
find $BACKUP_DIR -name "db_backup_*.sql" -mtime +7 -delete

echo "Backup completed: $BACKUP_DIR/db_backup_$DATE.sql"
EOF

chmod +x backup.sh
```

2. **Automated backup (crontab):**
```bash
# Edit crontab
crontab -e

# Add daily backup at 2 AM
0 2 * * * /home/hmcrm/HM_CRM_Proto/backup.sh >> /home/hmcrm/backup.log 2>&1
```

### Updates & Maintenance

1. **Update application:**
```bash
cd /home/hmcrm/HM_CRM_Proto

# Pull latest changes
git pull origin main

# Rebuild and restart containers
docker-compose down
docker-compose build --no-cache
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

2. **Update system packages:**
```bash
apt update && apt upgrade -y
docker system prune -f
```

## Troubleshooting

### Common Issues

1. **Container won't start:**
```bash
# Check logs
docker-compose logs container_name

# Check resource usage
docker stats
free -h
df -h
```

2. **Database connection issues:**
```bash
# Check database container
docker-compose exec database pg_isready -U hmcrm

# Check backend logs
docker-compose logs backend | grep -i database
```

3. **SSL certificate issues:**
   - Ensure your domain points to your droplet IP
   - Check DNS propagation: `nslookup yourdomain.com`
   - Verify ports 80 and 443 are open

4. **Out of disk space:**
```bash
# Clean Docker images and containers
docker system prune -a

# Check large files
du -sh /* | sort -rh
```

### Performance Optimization

1. **Enable Gzip compression** (already configured in nginx.conf)

2. **Optimize database:**
```bash
# Database maintenance
docker-compose exec database psql -U hmcrm -d hm_crm -c "VACUUM ANALYZE;"
```

3. **Monitor memory usage:**
```bash
# Add memory limits in docker-compose.prod.yml (already configured)
```

### Security Considerations

1. **Regular updates:**
   - Update Docker images monthly
   - Update system packages weekly
   - Monitor security advisories

2. **Firewall configuration:**
```bash
# Install UFW
apt install ufw

# Configure firewall
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow 80
ufw allow 443
ufw allow 81  # For Nginx Proxy Manager admin
ufw enable
```

3. **Change default passwords:**
   - Update Nginx Proxy Manager admin password
   - Use strong database passwords
   - Rotate JWT secrets periodically

## Support

For issues with the deployment:

1. Check the troubleshooting section above
2. Review application logs: `docker-compose logs`
3. Verify environment variables in `.env` file
4. Ensure domain DNS is properly configured
5. Check firewall and security group settings

## Cost Estimation

**Monthly costs on DigitalOcean:**

- **Development Droplet:** $12/month (2GB RAM, 1 vCPU)
- **Production Droplet:** $24/month (4GB RAM, 2 vCPUs)
- **Domain (optional):** $12-15/year
- **Backup Storage:** ~$1-2/month

**Total estimated cost:** $13-26/month depending on your needs.
