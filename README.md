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

To build and debug this app first you will need to install latest [Android Studio](https://developer.android.com/studio) and Android SDK 30 (done through IDE). Then you have to install [Flutter](https://flutter.dev/docs/get-started/install), preferably version 2.5.3 (latest stable at the time of writing this document).

Ensure with terminal command `flutter doctor` that Android Toolchain and Android Studio are found by flutter.

Open mobile/CampaignKeeper_mobile in Android Studio, download and set up dependencies by running `flutter pub get` in Studio terminal.

Now you should be able to build the app with `flutter build apk --split-per-abi` or `flutter build apk --debug --split-per-abi`! But what about debug?

Physical device:
- In your phone settings enable USB Debugging (instructions per manufacturer available online).
- Connect device to the computer, allow PC in phone notification.
- In Studio at the top ribbon you should be able to select your device.
- Now just click start, app will be automatically build, installed and run on your phone.

Emulator:
- In Studio choose Tools > AVD Manager (Android Virtual Devices).
- Click `Create Virtual Device` and follow on screen instructions.
- It's preffered to choose device without Play Services support to minimize used space and resources, with SDK >= 29.
- Choose created device at the Studio ribbon, it should run and change device name to `Android SDK built for x86 (mobile)`.
- Run debug.

App run in the emulator should automatically connect to the backend served on the same machine. On physicall device if `AppPrefs.debug` constant is set to `true` prior to login you can long press login button, that will open settings screen. Here you can speciffy your own url used by app, for example IP address of the machine hosting backend in the same local network.

That's it :smile:. The app is now up and running.

## Authors

The app has been developed by [Michał Wójtowicz](https://github.com/maniman303), [Dawid Motak](https://github.com/Motii1), [Przemysław Stasiuk](https://github.com/PrzemyslawStasiuk).
