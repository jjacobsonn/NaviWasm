# Installing Tailwind CSS and Framer Motion

Follow these steps in your frontend directory (/Users/cjacobson/git/NaviWasm/frontend):

## 1. Install Tailwind CSS, PostCSS, and Autoprefixer
Run the following command to install Tailwind as a dev dependency:
```
npm install -D tailwindcss postcss autoprefixer
```
Then initialize Tailwind with PostCSS configuration:
```
npx tailwindcss init -p
```
This will create a `tailwind.config.js` and a `postcss.config.js` file in your frontend folder.

## 2. Configure Tailwind
Make sure your Tailwind config includes all your source files, for example:
```javascript
// filepath: /Users/cjacobson/git/NaviWasm/frontend/tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```
Also, import Tailwind’s directives in your CSS:
```css
/* filepath: /Users/cjacobson/git/NaviWasm/frontend/src/index.css */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## 3. Install Framer Motion
Run the following command to install Framer Motion:
```
npm install framer-motion
```

## 4. Verify the Installation
- Ensure your `package.json` lists the new dependencies.
- Import and test Framer Motion in a component (e.g., using a simple `<motion.div>` animation).

After following these steps, your React app should be ready to use Tailwind CSS for styling and Framer Motion for animations.

Happy coding!
