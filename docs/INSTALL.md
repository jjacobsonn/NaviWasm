# Installing wasm-pack and Rust Toolchain

The error you received indicates that Cargo is missing. wasm-pack requires Cargo, which is installed as part of the Rust toolchain.

## Step 1: Install Rust and Cargo
Run the following command in your terminal:
```
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```
Follow the on-screen instructions to install Rust and Cargo.

## Step 2: Verify Installation
Restart your terminal and run:
```
cargo --version
wasm-pack --version
```
This ensures both Cargo and wasm-pack are installed correctly.

## Step 3: Build the WASM Module
Navigate to `/Users/cjacobson/git/NaviWasm/wasm` and run:
```
wasm-pack build
```
This should compile your WASM module and place the artifacts in `/Users/cjacobson/git/NaviWasm/wasm/pkg`.

For more details, visit the [wasm-pack documentation](https://rustwasm.github.io/wasm-pack/installer/).

Happy coding!
