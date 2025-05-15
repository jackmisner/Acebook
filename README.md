## 🏗️ Project Structure

This repo contains two applications:

- A frontend React App
- A backend api server

These two applications will communicate through HTTP requests, and need to be
run separately.

## 🚀 Quickstart

### 📥 Install Node.js

If you haven't already, make sure you have node and NVM installed.

1. Install Node Version Manager (NVM)
   ```
   brew install nvm
   ```
   Then follow the instructions to update your `~/.bash_profile`.
2. Open a new terminal
3. Install the latest version of [Node.js](https://nodejs.org/en/), (`24.0.2` at
   time of writing).
   ```
   nvm install 24
   ```

### 🛠️ Set up the project

1. Fork this repository
2. Clone the fork to your local machine
3. Install dependencies for both the `frontend` and `api` applications:
   ```
   cd frontend
   npm install
   cd ../api
   npm install
   ```
5. Install an ESLint plugin for your editor, for example
   [ESLint for VSCode](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
6. Install MongoDB
   ```
   brew tap mongodb/brew
   brew install mongodb-community@6.0
   ```
   _Note:_ If you see a message that says
   `If you need to have mongodb-community@6.0 first in your PATH, run:`, follow
   the instruction. Restart your terminal after this.
7. Start MongoDB

   ```
   brew services start mongodb-community@6.0
   ```

### ⚙️ Setting up environment variables

You will need to create two `.env` files, one in the frontend and one in the api.

#### Frontend

Create a file `frontend/.env` with the following contents:

```
VITE_BACKEND_URL="http://localhost:3000"
```

#### Backend

Create a file `api/.env` with the following contents:

```
MONGODB_URL="mongodb://0.0.0.0/acebook"
NODE_ENV="development"
JWT_SECRET="secret"
```

## 🏃‍♂️ Running the Application

1. Start the server application (in the `api` directory) in dev mode:

```
; cd api
; npm run dev
```

2. Start the front end application (in the `frontend` directory)

In a new terminal session...

```
; cd frontend
; npm run dev
```

You should now be able to open your browser and go to
`http://localhost:5173/signup` to create a new user.

Then, after signing up, you should be able to log in by going to
`http://localhost:5173/login`.

## 👥 Contributors
- [@jackmisner](https://github.com/jackmisner)
- [@amritpalc](https://github.com/AmritpalC)
- [@aysinakpinar](https://github.com/aysinakpinar)
- [@Michal-P-1](https://github.com/Michal-P-1)
- [@AMcGill3](https://github.com/AMcGill3)
- [@zameermohamed](https://github.com/zameermohamed)
- [@ziaxgit](https://github.com/ziaxgit)
