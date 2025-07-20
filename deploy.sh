#!/bin/bash

# Health Meter CRM Deployment Script for DigitalOcean
# This script automates the deployment process

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running as root
if [[ $EUID -eq 0 ]]; then
    print_warning "Running as root. Consider creating a non-root user for better security."
fi

# Check if required commands exist
check_requirements() {
    print_status "Checking requirements..."
    
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    
    if ! command -v git &> /dev/null; then
        print_error "Git is not installed. Please install Git first."
        exit 1
    fi
    
    print_status "All requirements satisfied ✓"
}

# Generate secure passwords
generate_passwords() {
    print_status "Generating secure passwords..."
    
    DB_PASSWORD=$(openssl rand -base64 32 | tr -d '/+=' | head -c 32)
    JWT_SECRET=$(openssl rand -base64 64 | tr -d '/+=' | head -c 64)
    
    print_status "Passwords generated ✓"
}

# Setup environment file
setup_environment() {
    print_status "Setting up environment variables..."
    
    if [ ! -f .env ]; then
        cp .env.example .env
        
        # Replace placeholders with generated values
        sed -i "s/your_secure_database_password_here/$DB_PASSWORD/" .env
        sed -i "s/your_super_secret_jwt_key_minimum_64_characters_long/$JWT_SECRET/" .env
        
        print_status "Environment file created ✓"
        print_warning "Please edit .env file to set your domain name and other configurations"
    else
        print_warning ".env file already exists. Skipping..."
    fi
}

# Build and start containers
deploy_application() {
    print_status "Building and starting containers..."
    
    # Stop any existing containers
    docker-compose down 2>/dev/null || true
    
    # Build containers
    if [ "$1" = "production" ]; then
        print_status "Deploying in production mode..."
        docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
    else
        print_status "Deploying in development mode..."
        docker-compose up -d --build
    fi
    
    print_status "Containers started ✓"
}

# Check container health
check_health() {
    print_status "Checking container health..."
    
    sleep 10  # Wait for containers to start
    
    # Check if containers are running
    if docker-compose ps | grep -q "Up"; then
        print_status "Containers are running ✓"
    else
        print_error "Some containers failed to start"
        docker-compose logs
        exit 1
    fi
    
    # Check backend health endpoint
    print_status "Waiting for backend to be ready..."
    for i in {1..30}; do
        if curl -f http://localhost:5000/health &>/dev/null; then
            print_status "Backend is healthy ✓"
            break
        fi
        
        if [ $i -eq 30 ]; then
            print_error "Backend health check failed"
            docker-compose logs backend
            exit 1
        fi
        
        sleep 2
    done
    
    # Check frontend
    if curl -f http://localhost:3000 &>/dev/null; then
        print_status "Frontend is accessible ✓"
    else
        print_warning "Frontend might not be ready yet"
    fi
}

# Display deployment information
show_deployment_info() {
    print_status "Deployment completed successfully! 🎉"
    echo
    echo "=== Deployment Information ==="
    echo "Frontend URL: http://$(hostname -I | awk '{print $1}'):3000"
    echo "Backend API: http://$(hostname -I | awk '{print $1}'):5000"
    echo "Health Check: http://$(hostname -I | awk '{print $1}'):5000/health"
    echo
    echo "=== Next Steps ==="
    echo "1. Configure your domain DNS to point to this server"
    echo "2. Set up Nginx Proxy Manager at http://$(hostname -I | awk '{print $1}'):81"
    echo "3. Configure SSL certificates through Nginx Proxy Manager"
    echo "4. Update .env file with your domain configuration"
    echo
    echo "=== Useful Commands ==="
    echo "View logs: docker-compose logs -f"
    echo "Restart services: docker-compose restart"
    echo "Stop services: docker-compose down"
    echo "Update application: git pull && docker-compose up -d --build"
    echo
    echo "=== Security Notice ==="
    echo "Database password: $DB_PASSWORD"
    echo "JWT Secret: $JWT_SECRET"
    echo "Please save these credentials securely!"
}

# Backup function
create_backup() {
    print_status "Creating backup..."
    
    BACKUP_DIR="./backups"
    DATE=$(date +%Y%m%d_%H%M%S)
    mkdir -p $BACKUP_DIR
    
    # Database backup
    if docker-compose ps database | grep -q "Up"; then
        docker-compose exec -T database pg_dump -U hmcrm hm_crm > $BACKUP_DIR/db_backup_$DATE.sql
        print_status "Database backup created: $BACKUP_DIR/db_backup_$DATE.sql"
    fi
    
    # Application backup
    tar -czf $BACKUP_DIR/app_backup_$DATE.tar.gz \
        --exclude=node_modules \
        --exclude=.git \
        --exclude=dist \
        --exclude=backups \
        .
    
    print_status "Application backup created: $BACKUP_DIR/app_backup_$DATE.tar.gz"
}

# Main function
main() {
    echo "🚀 Health Meter CRM Deployment Script"
    echo "======================================"
    
    case "$1" in
        "backup")
            create_backup
            ;;
        "production"|"prod")
            check_requirements
            generate_passwords
            setup_environment
            deploy_application "production"
            check_health
            show_deployment_info
            ;;
        "development"|"dev"|"")
            check_requirements
            generate_passwords
            setup_environment
            deploy_application "development"
            check_health
            show_deployment_info
            ;;
        "health")
            check_health
            ;;
        *)
            echo "Usage: $0 [production|development|backup|health]"
            echo "  production   - Deploy in production mode"
            echo "  development  - Deploy in development mode (default)"
            echo "  backup       - Create backup of database and application"
            echo "  health       - Check application health"
            exit 1
            ;;
    esac
}

# Run main function with all arguments
main "$@"