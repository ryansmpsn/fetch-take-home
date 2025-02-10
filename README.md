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

2. Add and ensure you have the proper variables in your `.env` file use the `.env.example` file for reference.

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

## Usage

When you run the application, you'll see a login page. You can enter any name and email you like, just make sure they're in the correct format!
After log in, you will be taken to the search page with a list of dogs.
You can then filter by breed, city, or age.
You can also sort by breed, name, or age.
You can click that heart on any dog to add the dog to your favorites.
After you've selected your favorites, you can visit the favorites page to review your selections.
You can remove favorites, undo removed favorites, and generate a match.

## Known issues

### Login issue: Authentication may not work properly due to your browser’s cross-site tracking prevention feature. To resolve this:

- Disable the cross-site tracking prevention setting in your browser.
- Alternatively, ensure the frontend and backend are hosted on the same domain.
