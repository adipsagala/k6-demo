FROM php:fpm-alpine

RUN apk add --no-cache --virtual .build-deps $PHPIZE_DEPS \
    && pecl install redis \
    && docker-php-ext-enable redis \
    && apk del .build-deps \
    && docker-php-ext-install opcache \
    && docker-php-ext-enable opcache

# Tweaked Version: add opcache
# Konfigurasi OPcache
RUN echo "opcache.enable=1" >> /usr/local/etc/php/conf.d/docker-php-ext-opcache.ini \
    && echo "opcache.interned_strings_buffer=8" >> /usr/local/etc/php/conf.d/docker-php-ext-opcache.ini \
    && echo "opcache.max_accelerated_files=10000" >> /usr/local/etc/php/conf.d/docker-php-ext-opcache.ini \
    && echo "opcache.memory_consumption=128" >> /usr/local/etc/php/conf.d/docker-php-ext-opcache.ini \
    && echo "opcache.save_comments=0" >> /usr/local/etc/php/conf.d/docker-php-ext-opcache.ini \
    && echo "opcache.revalidate_freq=2" >> /usr/local/etc/php/conf.d/docker-php-ext-opcache.ini

# Tweaked Version: memory_limit PHP
RUN echo "memory_limit=256M" >> /usr/local/etc/php/conf.d/docker-php-limits.ini
RUN echo "max_execution_time=300" >> /usr/local/etc/php/conf.d/docker-php-limits.ini

WORKDIR /var/www/html

COPY ./app /var/www/html

RUN docker-php-ext-install pdo_mysql
