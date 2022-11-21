# otakudesu-anime-api
this is my first time web scraping, all this data API from https://otakudesu.bid/

# Usage
1. Clone this repository
    ```bash
    git clone https://github.com/RizkyFauziIlmi/otakudesu-anime-api.git
    ```
2. Install dependecies (`yarn` or `npm install`)
    ```bash
    npm install
    ```
3. Start the development environment
    ```bash
    npm run dev or npm run start
    ```
4. visit http://localhost:8000 or another port if you changed it

# Documentation
__API__ __PATH__ = https://otakudesu-anime-api.vercel.app
</br>__ApI__ Version = `v1.0`

## All Ongoing Anime
[pageNumber] = 1-3 (may change depending on the database)
```
/api/v1/ongoing/[page]
```
example : https://otakudesu-anime-api.vercel.app/api/v1/ongoing/1

## All Complete Anime
[page] = 1-46 (may change depending on the database)
```
/api/v1/completed/[page]
```
example : https://otakudesu-anime-api.vercel.app/api/v1/completed/1

## Search Anime
[q] = any string
```
/api/v1/search/[q]
```
example : https://otakudesu-anime-api.vercel.app/api/v1/search/black%20clover

## All Anime List
```
/api/v1/anime-list
```
example : https://otakudesu-anime-api.vercel.app/api/v1/anime-list

## Anime Detail
[endpoint] : String
```
/api/v1/detail/[endpoint]
```
example : https://otakudesu-anime-api.vercel.app/api/v1/detail/chaisaw-sub-indo

## Batch Link
[endpoint] : String
```
/api/v1/batch/[endpoint]
```
example : https://otakudesu-anime-api.vercel.app/api/v1/batch/hakumao-s2-batch-sub-indo/

## Genre List
```
/api/v1/genres
```
example : https://otakudesu-anime-api.vercel.app/api/v1/genres

## Genre Page
[genre] : String
[page] : 1 - ... (depend on genre)
```
/api/v1/genres/[genre]/[page]
```
example : https://otakudesu-anime-api.vercel.app/api/v1/genres/action/1