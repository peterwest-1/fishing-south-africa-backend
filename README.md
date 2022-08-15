# Backend Boilerplate

Server boilerplate using TypeORM TypeGraphQL Apollo Redis GraphQL Postgres.

## To Do

- Add tests

## Installation

- Requires `Redis` and `Postgres`
- Clone repository

```
git clone https://github.com/peterwest-1/backend-boilerplate.git
```

- Change directory

```
cd backend-boilerplate
```

- Install dependancies

```
yarn
```

- Download confired GCS config JSON
-

- Create database and change config in `src/data-source.ts` accordingly
- Start the server

```
yarn dev
```

## Consider changing

- Change ForgotPasswordResolver email to link forgot email on front end

## Usage

## Notes

  <!-- // const defaultCookie = {
  //   maxAge: COOKIE_LENGTH, // 1 year
  //   httpOnly: true,
  //   sameSite: "lax",
  //   secure: __prod__, // cookie only works in https
  // }; -->

## License

[MIT](https://choosealicense.com/licenses/mit/)
