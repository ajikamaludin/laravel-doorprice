# Doorprice App

Sebuah aplikasi untuk menajemen doorprize berbagai event dibuat dengan laravel, inertiajs dan tailwindcss

## Support me

<a href="https://trakteer.id/ajikamaludin" target="_blank"><img id="wse-buttons-preview" src="https://cdn.trakteer.id/images/embed/trbtn-blue-2.png" height="40" style="border:0px;height:40px;" alt="Trakteer Saya"></a>

## Requirements

-   PHP 8.1 or latest
-   Node 16+ or latest

## How to run

prepare env

```bash
cp .env.example .env # configure app for laravel
touch database/database.sqlite # if you use .env.example with default sqlite database
composer install
npm install
```

use php server

```bash
php artisan migrate --seed # create table for db and seed data
php artisan key:gen
php artisan ser #keep run to dev
```

compile asset

```bash
npm run dev # compiling asset for development # keep run for dev
```

<hr/>

easy way

```bash
docker compose up -d
```

## Default User

```bash
username : admin
password : password
```

## Compile Assets ( to prod )

```bash
npm run build
```

## Screenshot

![](screenshot1.gif?raw=true)

<hr/>
<hr/>

# Other

```bash
# rsync
rsync -arP -e 'ssh -p 225' --exclude=node_modules --exclude=.git --exclude=public/hot --exclude=public/uploads --exclude=database/database.sqlite --exclude=.env . arm@ajikamaludin.id:/home/arm/projects/www/doorprize
#zip
zip --exclude='*.git*' --exclude='*node_modules*' -r doorprize.zip .
```
