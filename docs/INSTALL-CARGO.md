# Installing Cargo

Cargo is the Rust package manager and is installed automatically when you install the Rust toolchain using rustup.

## Step-by-Step Instructions

1. **Install Rust (including Cargo) using rustup**  
   Open your terminal and run the following command:
   ```
   curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
   ```
   Follow the on-screen instructions to complete the installation.

2. **Restart Your Terminal**  
   Once the installation is complete, close and reopen your terminal (or run `source $HOME/.cargo/env`) to update your PATH.

3. **Verify the Installation**  
   Run the following commands to check that Cargo (and Rust) have been installed correctly:
   ```
   cargo --version
   rustc --version
   ```
   You should see version information for both commands.

## Troubleshooting
- If the commands are still not found, ensure that Cargo's bin directory (typically `$HOME/.cargo/bin`) is added to your PATH.
- You can add the following line to your shell configuration file (e.g., `~/.zshrc` or `~/.bashrc`):
  ```
  export PATH="$HOME/.cargo/bin:$PATH"
  ```
  Then reload your shell configuration with `source ~/.zshrc` (or the appropriate file).

For more details, refer to the [official rustup documentation](https://rustup.rs/).

Happy coding!
