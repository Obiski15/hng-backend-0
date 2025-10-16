# CatFact Profile API

A simple RESTful API built with **Node.js** and **Express** that returns my profile information along with a random cat fact fetched from the public [Cat Facts API](https://catfact.ninja/fact).

## Complete Project Overview

This repository contains everything you need to run the **CatFact Profile API**.  
All setup steps, dependencies, and configuration are included below.

### Installation Instructions

1. **Clone the repository:**

   ```bash
   git clone https://github.com/Obiski15/hng-backend-0.git
   cd hng-backend-0
   ```

2. **Install dependencies:**

   ```bash
   pnpm install
   ```

3. **Create environment file:**
   In the root directory create a .env file with the following content:

   ```bash
   PORT=3000
   ```

4. **Start the server:**

   ```bash
   pnpm run dev
   ```

### Example Response

When you visit `http://localhost:3000/me`, you’ll receive a JSON response like:

```json
{
  "status": "success",
  "user": {
    "email": "obiski15@example.com",
    "name": "Emmanuel Obi",
    "stack": "Node.js / Express"
  },
  "timestamp": "2025-10-15T09:45:00.000Z",
  "fact": "Cats sleep for 70% of their lives."
}
```
