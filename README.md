# String Analyzer Service

A simple RESTful API thats analyzes text strings, computes their properties, and stores them for retrieval or filtering.


## Features

- Compute string length, word count, and unique characters  
- Check if a string is a palindrome  
- Generate SHA-256 hash for unique ID  
- Return character frequency map  
- Supports filtering and natural language queries  


## Setup

```
git clone https://github.com/Obiski15/hng-backend-1.git
cd hng-backend-1
pnpm install
```

## Create a .env file
```
PORT=8000
```

## Run the app
```
pnpm run dev
```

## Endpoints

### Analyze and store a string
POST /strings

### Get a specific string
GET /strings/:value

### Get all strings with filters
GET /strings?is_palindrome=true&min_length=5

### Filter using natural language query
GET /strings/filter-by-natural-language?query=all%20single%20word%20palindromic%20strings

### Delete a string
DELETE /strings/:value

