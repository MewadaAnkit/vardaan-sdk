# NPM Publishing Guide for HEAL SDK

Follow these steps to publish `@heal/sdk` to the NPM registry.

---

## 1. Prerequisites
*   An account on [npmjs.com](https://www.npmjs.com/).
*   If using a scoped name (e.g., `@heal/sdk`), ensure you have created an organization named `heal` on NPM or change the name in `package.json` to something unique like `heal-sdk-ankit`.

---

## 2. Prepare the Code
Before publishing, ensure the code is compiled to JavaScript.
```bash
cd heal-sdk
npm run build
```
This will create a `dist` folder which contains the code users will actually download.

---

## 3. Login to NPM
Run this in your terminal and follow the instructions to log in.
```bash
npm login
```

---

## 4. Publish
If you are using a scoped name starting with `@`, you must add the `--access public` flag (handled automatically if `publishConfig` is in `package.json`).

```bash
npm publish
```

---

## 5. Updates & Versioning
Every time you want to push an update, you **must** change the version number in `package.json`.
*   **Patch** (Bug fixes): `npm version patch` (1.0.0 -> 1.0.1)
*   **Minor** (New features): `npm version minor` (1.0.0 -> 1.1.0)
*   **Major** (Breaking changes): `npm version major` (1.0.0 -> 2.0.0)

Then run `npm publish` again.

---

## 🚦 Verification
After publishing, others can install it using:
```bash
npm install @heal/sdk
```
*(Or whatever name you chose in package.json)*
