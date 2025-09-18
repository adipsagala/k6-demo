FROM dunglas/frankenphp:latest

# Install dependencies and PHP extensions
RUN apt-get update && apt-get install -y \
    zip unzip curl libpng-dev libonig-dev libxml2-dev libzip-dev \
    default-mysql-client \
    autoconf g++ make \
    && pecl install redis \
    && docker-php-ext-enable redis \
    && docker-php-ext-install pdo_mysql opcache \
    && docker-php-ext-enable opcache pdo_mysql \
    && rm -rf /var/lib/apt/lists/*

# Tweaked Version: add opcache
# Configure OPcache
RUN echo "opcache.enable=1" >> /usr/local/etc/php/conf.d/docker-php-ext-opcache.ini \
    && echo "opcache.interned_strings_buffer=8" >> /usr/local/etc/php/conf.d/docker-php-ext-opcache.ini \
    && echo "opcache.max_accelerated_files=10000" >> /usr/local/etc/php/conf.d/docker-php-ext-opcache.ini \
    && echo "opcache.memory_consumption=256" >> /usr/local/etc/php/conf.d/docker-php-ext-opcache.ini \
    && echo "opcache.save_comments=0" >> /usr/local/etc/php/conf.d/docker-php-ext-opcache.ini \
    && echo "opcache.revalidate_freq=2" >> /usr/local/etc/php/conf.d/docker-php-ext-opcache.ini

# Configure PHP limits
RUN echo "memory_limit=256M" >> /usr/local/etc/php/conf.d/docker-php-limits.ini \
    && echo "max_execution_time=300" >> /usr/local/etc/php/conf.d/docker-php-limits.ini

WORKDIR /var/www/html

ENV SERVER_NAME=":80"

# Copy application files
COPY ./app /var/www/html

# Set permissions
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache \
    && chmod -R 755 /var/www/html/storage /var/www/html/bootstrap/cache

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set up Laravel
RUN cp .env.example .env \
    && composer install --no-dev --optimize-autoloader \
    && php artisan key:generate
