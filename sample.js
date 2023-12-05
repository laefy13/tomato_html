import { client } from "https://cdn.jsdelivr.net/npm/@gradio/client@0.8.2/dist/index.min.js";

const response_0 = await fetch(
  "https://raw.githubusercontent.com/gradio-app/gradio/main/test/test_files/bus.png"
);
const exampleImage = await response_0.blob();

const app = await client(
  "https://laefy-tomato.hf.space/--replicas/jvqrg/"
);
const result = await app.predict("/main", [
  exampleImage, // blob in 'Input Image' Image component
  true, // boolean  in 'Segment' Checkbox component
]);

console.log(result.data);

document
  .getElementById("generate-button")
  .addEventListener("click", predict);
