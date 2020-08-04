import serve from "rollup-plugin-serve";

// rollup can help us bundle ES6 module code
export default {
  input: "./src/single-spa.js",
  output: {
    file: "./lib/umd/single-spa.js",
    format: "umd",
    name: "singleSpa",
    sourcemap: true,
  },
  plugins: [
    serve({
      openPage: "./index.html",
      contentBase: "",
      port: 3000,
    }),
  ],
};
