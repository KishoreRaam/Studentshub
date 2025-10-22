
# Student perks homepage

This is a code bundle for Student perks homepage. The original project is available at https://www.figma.com/design/iiSEggyatRkOQhcCWYKzVA/Student-perks-homepage.

## Running the code

Run `npm i` to install the dependencies.

Run `npm run dev` to start the development server.

## Deployment

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn package manager

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Studentshub
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set executable permissions for Vite (Linux/Mac)**
   
   If you encounter permission errors when running Vite, you may need to set executable permissions:
   ```bash
   chmod +x node_modules/.bin/vite
   ```
   
   Or set permissions for all binaries:
   ```bash
   chmod +x node_modules/.bin/*
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```
   
   The application will be available at `http://localhost:3000`

5. **Build for production**
   ```bash
   npm run build
   ```
   
   The production-ready files will be in the `build/` or `dist/` directory.

### Important Notes

- **node_modules**: Ensure `node_modules/` is in `.gitignore` and not committed to the repository
- If you get "command not found" errors for Vite, reinstall dependencies: `rm -rf node_modules && npm install`
- For Windows users: You typically won't need to set executable permissions

### Troubleshooting

- **Permission denied errors**: Run the chmod commands mentioned in step 3
- **Port already in use**: Change the port in `vite.config.ts` or kill the process using port 3000
- **Module not found errors**: Delete `node_modules` and `package-lock.json`, then run `npm install` again
  