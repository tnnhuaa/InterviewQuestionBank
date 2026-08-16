const requiredModules = [
  "../src/app.js",
  "../src/config/environment.js",
  "../src/modules/system/status.routes.js",
];

await Promise.all(requiredModules.map((modulePath) => import(modulePath)));
console.log("Backend build validation passed");
