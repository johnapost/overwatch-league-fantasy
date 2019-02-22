# Overwatch League Fantasy
[![Codeship Status for johnapost/overwatch-league-fantasy](https://app.codeship.com/projects/8d11a130-d898-0136-0ad9-0ac09399d815/status?branch=master)](https://app.codeship.com/projects/317223)
[![codecov](https://codecov.io/gh/johnapost/overwatch-league-fantasy/branch/develop/graph/badge.svg)](https://codecov.io/gh/johnapost/overwatch-league-fantasy)

## What is this?
This is [https://overwatch-league-fantasy.com](https://overwatch-league-fantasy.com), a custom Overwatch League fantasy system. It's also an opportunity to play with some interesting technologies and challenge my fullstack app building skills. In a phrase, a serverless server-side rendered React app, heh.

## Key technologies
* Firebase Functions (serverless/FaaS architecture)
  * See `src/functions`
  * One function serves the entire app, frontend and backend
  * Separate utility functions for syncing with Overwatch League data
* Firebase Firestore (Cloud-based document data store)
  * Flat(ish) document store without schemas
* NextJS (Server-side rendered React app framework)
  * See `src/app`
  * Makes it easy to create a fullstack React app, and fit it all in one function
* `redux-firestore`
  * No XHR or fetch calls, all data is automatically synced to Firestore through Redux

## Features
* Authentication
  * ~~Sign up~~
  * ~~Login/logout~~
  * Resend verification email
  * Reset password
* Stats
  * ~~Stat scoring~~
  * ~~Sync running stats~~
  * Derive weekly stats
  * Scheduled syncing
* League Management
  * ~~User-created leagues~~
  * Invite links
  * Start/end drafts
  * Customizable stat weights
* Matches
  * Matchmaking
  * Match scoring
  * Side bets
* Drafts
  * ~~Draft chat~~
  * Draft timer
  * Autodraft
* Polished UI
  * ~~Roster stat table~~
  * Roster grid
  * Draft team
  * Draft feedback

## Thanks
* [James Hegedus' NextJS + Firebase Series](https://codeburst.io/next-js-on-cloud-functions-for-firebase-with-firebase-hosting-7911465298f2)
* [Overwatch League](https://overwatchleague.com)
