# Campaign Keeper ![Build Status](https://app.travis-ci.com/Motii1/CampaignKeeper.svg?token=Cyxz2snQqipGxDYfjq5P&branch=master)

## Domain

Web app should be served [here](https://campaignkeeper.herokuapp.com/). If it is not available at this domain, we probably deleted it, because heroku plan we are using no longer permit us to host it :smile:

## Environment

You should create `.env` file inside `backend/` directory. Sample environment is defined in `.env.example` file. Probably the easiest way to define your own development environment is to use the following command inside the `backend/` directory:

```
cp .env.example .env
```

## Local setup

#### Database

We used SQL Server database technology with the support of Redis. To successfully run the application server you need both of this services to be up and running. For development purposes you can easily achieve this by executing the following command in the root directory of the project:

```
docker-compose up -d
```

Due to some problems with SQL Server container start could failed. To fix the issue you need to grant appropriate permissions to `storage/database` directory. The easiest way to do it is to execute `chmod -R 777 storage/` and run `docker-compose` again.

#### Web (frontend and backend)

Firstly you need to install all required packages. To achieve that you should run `npm install` command inside `frontend` and `backend` directories. Then you should start client and server:

```
cd frontend/
npm run start
cd backend/
npm run start:dev:watch
```

#### Mobile

**TODO**

That's it :smile:. The app is now up and running.

## Authors

The app has been developed by [Michał Wójtowicz](https://github.com/maniman303), [Dawid Motak](https://github.com/Motii1), [Przemysław Stasiuk](https://github.com/PrzemyslawStasiuk).
