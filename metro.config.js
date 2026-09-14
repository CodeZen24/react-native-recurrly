const { getDefaultConfig } = require("expo/metro-config");
const { withNativewind } = require("nativewind/metro");
const path = require("path");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Apply NativeWind FIRST so its settings are the base
const finalConfig = withNativewind(config);

// ── Clerk fix: resolve package.json `exports` subpaths ─────────────────────
// Metro does not honour the `exports` field by default.
// @clerk/shared uses subpath exports like /loadClerkJsScript, /react, /keys.
finalConfig.resolver.unstable_enablePackageExports = true;

// ── Clerk fix: map un-hoisted nested packages ───────────────────────────────
// npm nested @clerk/react + @clerk/shared inside @clerk/expo/node_modules
// instead of hoisting them. Explicitly map them so Metro can find them.
finalConfig.resolver.extraNodeModules = {
  ...(finalConfig.resolver.extraNodeModules ?? {}),
  "@clerk/react": path.resolve(
    __dirname,
    "node_modules/@clerk/expo/node_modules/@clerk/react"
  ),
  "@clerk/shared": path.resolve(
    __dirname,
    "node_modules/@clerk/expo/node_modules/@clerk/shared"
  ),
};

module.exports = finalConfig;