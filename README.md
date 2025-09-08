# Crypto guess app

This is a project built with React + TypeScript + Vite.
It uses ESLint and Prettier rules and vitest + testing library + msw for testing.

## Description

Crypto Guess is a simple and interactive web application where players predict whether the **price of Bitcoin (BTC/USD)** will go up or down in the next minute. The game combines real-time cryptocurrency market data with a fun and competitive scoring system.

Players identify themselves with a **unique username**, which allows them to keep track of their progress.  
If a user leaves the page and comes back later, the application restores the state of their **active bet**, so they can seamlessly continue where they left off.

When a bet is resolved, the player is immediately **notified of the points gained or lost**, making the experience dynamic and engaging.

Additionally, the app features a dedicated **statistics page** where players can review detailed insights into their betting history, including outcomes and performance trends, helping them analyze and improve their prediction strategies.

## Notes

### Crypto BTC price:
- For this prototype, the Bitcoin price is fetched using **polling** instead of a real-time **stream**.
- The ideal implementation should use a backend service that connects to a real-time stream of BTC prices and relays updates to the frontend.
- Since there were issues running the stream locally, it was replaced with polling to keep the project simple and functional for testing purposes.

### Testing
We have implemented both unit and integration tests, though not for the entire codebase. The project includes a solid set of examples that demonstrate how we approach testing in different areas, such as:

- UX components
- General components
- TypeScript utility functions
- Logic within custom hooks
- Complete features (integration tests)

## Tech stack

- React
- CSS Modules
- TypeScript
- Vite
- Vitest
- Testing Library
- MSW
- Material UI
- React Router
- React Intl for translations
- Zustand for global state
- ESLint
- Prettier
- Supabase (DB)
- Netlify

## Remote deployment

The app is deployed using Netlify, 👉 [click here](https://playcrypto.netlify.app/)!

## Local deployment

To be able to run the app, you need to create a `.env` file in the root of the project and add the following variables:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

### Usage

To install dependencies, run:

```
npm install
```

To start the app, run:

```
npm run dev
```

To create a production build, run:

```
npm run build
```

To preview the production build, run:

```
npm run preview
```

To run tests, run:

```
npm run test
```

To sort translation keys, run:

```
npm run sort-translations
```

## Demo video

https://github.com/user-attachments/assets/27731349-7aa5-49f2-a37d-f263befe503e


## App screenshots

<img width="1112" height="926" alt="demo1" src="https://github.com/user-attachments/assets/a832b335-4afd-4d7a-94d6-921671c953ef" />
<img width="1111" height="932" alt="demo2" src="https://github.com/user-attachments/assets/fe4221c8-6835-483e-8dd5-49c492fe4aed" />


