# Minecraft Join/Leave Notifiying Discord Bot

This Bot notifies users when a player joins or leaves a minecraft server. It also notifies users when the minecraft server is online/offline.

## Getting started

### Setting up .env

Take a look at the .env.sample of this repository, then create a copy named .env. Fill in all the fields with your respective values.

### Running locally

```bash
npm start
```

### Running On a Server

**Install pm2:**

```bash
npm install pm2 -g
```

**Start your bot with pm2:**

```bash
pm2 start index.js
```

## Roadmap

- [] Implement a way for players to send messages to bot to query server information:
    - [] Get server status
    - [] Get currentOnline players