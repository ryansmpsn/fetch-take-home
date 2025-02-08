## Getting Started

Follow these steps to set up and run the project locally.

1. Install Dependencies
   Before running the server, install the required dependencies using your preferred package manager:

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

2. Add and ensure you have the proper variables in your `.env` file

3. Start the Development Server
   Run the following command to start the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

3. Open in Browser
   Once the server is running, open your browser and go to:

🔗 [http://localhost:3000](http://localhost:3000)

Now, you’re ready to start developing! 🚀🔥

## Known issues

### Login issue: Authentication may not work properly due to your browser’s cross-site tracking prevention feature. To resolve this:

- Disable the cross-site tracking prevention setting in your browser.
- Alternatively, ensure the frontend and backend are hosted on the same domain.
