# Installing wasm-pack

The error "zsh: command not found: wasm-pack" indicates that wasm-pack is not installed on your system. Follow these steps to install it:

## Using Homebrew (recommended)
1. Ensure Homebrew is installed. If not, install it from [https://brew.sh/](https://brew.sh/).
2. Open your terminal and run:
   ```
   brew install wasm-pack
   ```
3. Verify the installation:
   ```
   wasm-pack --version
   ```

## Manual Installation
Alternatively, install wasm-pack via the official installer:
1. Run the following command in your terminal:
   ```
   curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh
   ```
2. Follow any prompts. After installation, verify with:
   ```
   wasm-pack --version
   ```

## Next Steps
After installing wasm-pack, navigate to `/Users/cjacobson/git/NaviWasm/wasm` and run:
```
wasm-pack build
```
This will create the WASM package in `/Users/cjacobson/git/NaviWasm/wasm/pkg`.

For more details, visit the [wasm-pack documentation](https://rustwasm.github.io/wasm-pack/installer/).

Happy coding!
