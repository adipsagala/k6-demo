
# Test App K6 Laravel
Pilih salah satu dari image yang digunakan.
JANGAN SEMUA CONTAINER IMAGES..!!! karena mereka menggunakan port yang sama, kecuali portnya diganti masing-masing ya.

## Macam-macam images:
- 8.2-fpm
- tweaked-8.2-fpm
- tweaked-8.4-fpm-alpine
- tweaked-fpm-alpine
- tweaked-frankenphp

## Build

```
docker compose -f docker-compose-8.2-fpm.yaml build

docker compose -f docker-compose-tweaked-8.2-fpm.yaml build

docker compose -f docker-compose-tweaked-8.4-fpm-alpine.yaml build

docker compose -f docker-compose-tweaked-fpm-alpine.yaml build

docker compose -f docker-compose-tweaked-frankenphp.yaml build
```

## Run

```
docker compose -f docker-compose-8.2-fpm.yaml up -d

docker compose -f docker-compose-tweaked-8.2-fpm.yaml up -d

docker compose -f docker-compose-tweaked-8.4-fpm-alpine.yaml up -d

docker compose -f docker-compose-tweaked-fpm-alpine.yaml up -d

docker compose -f docker-compose-tweaked-frankenphp.yaml up -d
```

## Down
```
docker compose -f docker-compose-8.2-fpm.yaml down

docker compose -f docker-compose-tweaked-8.2-fpm.yaml down

docker compose -f docker-compose-tweaked-8.4-fpm-alpine.yaml down

docker compose -f docker-compose-tweaked-fpm-alpine.yaml down

docker compose -f docker-compose-tweaked-frankenphp.yaml down
```