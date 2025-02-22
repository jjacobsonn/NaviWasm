# Node OpenSSL Legacy Provider Workaround

When starting the development server with Node.js v17 or newer, you may encounter errors like:

```
Error: error:0308010C:digital envelope routines::unsupported
```

This happens due to changes in OpenSSL 3 used by recent Node versions. A recommended workaround is to set the environment variable to use the legacy provider.

## How To Apply the Workaround

### Option 1: Set Environment Variable in Terminal
Before running your development server, run:
```
export NODE_OPTIONS=--openssl-legacy-provider
npm start
```

### Option 2: Update package.json
In your frontend/package.json, modify the "start" script as follows:
```json
"scripts": {
  "start": "NODE_OPTIONS=--openssl-legacy-provider react-scripts start",
  "build": "react-scripts build"
}
```

With this change, simply running `npm start` will apply the workaround.

## Note
This is a temporary solution until all dependencies (such as webpack/react-scripts) fully support OpenSSL 3. Alternatively, you can use Node.js v16 LTS which does not have this issue.

Happy coding!
