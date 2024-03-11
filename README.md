# Privasee interview task

This project was created by [Ryan O&#39;Connor](https://oconr.co.uk)

## What's inside?

This Turborepo includes the following packages/apps:

### Apps and Packages

- `web`: a [Next.js](https://nextjs.org/) app
- `api`: a [Express.js](https://expressjs.com/) app
- `ui`: a [shadcn/ui](https://ui.shadcn.com/) components that can be shared between apps
- `eslint-config-custom`: `eslint` configurations (includes `eslint-config-next` and `eslint-config-prettier`)
- `tsconfig`: `tsconfig.json`s used throughout the monorepo

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

### Adding shadcn component

Run the following command:

```sh
npm run ui:add accordion --workspace=ui
```

### Utilities

This Turborepo has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting

### Develop

To develop all apps and packages, run the following command:

```bash
npm run dev
```

## Justifications

When building this project, there were a lot of different approaches that could have been taken that I had to make decisions on due to multiple factors, the main one being the time constraint.

### Front-end framework

The first decision that I made was which front-end framework I should be using. I am most familiar with React based frameworks which resulted in my choice of using Next.js. A major advantage that I saw by going with Next.js is that I could utilise server components and SSR.

### Database

I have familiarity across multiple database platforms, but I tend to go for an approach where I'll use some sort of SQL database (MySQL, PostgreSQL, MariaDB, etc.) with an ORM over the top. In this case, because of the difficulty that it would impose to get that correctly secured within the time frame that I had. This is the main reason that I decided to go with the recommendation of Airtable, as well as this would be my first time using Airtable and I have been wanting to get the change to use it for a long time to see if I could use it for hobby projects going forward.

### Search techniques

When implementing the fuzzy search, there were many different approaches that I could have taken as to the technique that I used. I ended up sticking with a simply fuzzy search implementation due to the time constraint. I knew that I'd be able to create a fuzzy search that worked well within the time that I had, and did take a look at how long it would take to implement other options like those recommended in the brief (semantic search, embeddings, TF*IDF) but came to the conclusion that those would simply be going overboard given the time frame and requirements of the brief. If there had been a need for a more advanced searching technique then I would definitely have taken another approach but this currently just needed a simple way to search the content of a few fields.

### Component library

To save on time, especially when it came to more complicated UI elements such as the data table, I made the decision to use shadcn/ui which provided me with fully customisable components that offered more than enough functionality to create what was required. There were other options when it came to component libraries but none of them offered much support for SSR whereas quite a few of the shadcn/ui components do work directly in server components.

## Future improvements

If I had to redo this task at any point, there would be a few things that I would definitely do differently.

### Database choice

While Airtable as a good choice for this short task, a more long term project would definitely require a dedicated SQL database (my preference would be PostgreSQL). With that approach I would also recommend implementing something like Drizzle ORM and zod to ensure that everything is as type safe as possible, and that when handling data we are able to confirm it matches schemas using zod.

### Monorepo

The only reason for implementing this task as a monorepo is due to it needing to be pulled and started as simply as possible. Usually, I would separate the express server from the Next.js as that would make it much easier to manage but also would give us more options in terms of CI/CD as we wouldn't be reliant on ensuring that each side of project is passing and we could focus on either the front-end or back-end for specifics like hosting as well.

### UX

There are a few instances currently where I would have liked to have the time to properly implement a better UX. My main one is when there is any sort of interaction with buttons, I didn't have time to properly implement any sort of loading state to indicate to the user that the action is actually in process which is essential to providing a good UX.
