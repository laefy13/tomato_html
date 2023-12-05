import { client } from "https://cdn.jsdelivr.net/npm/@gradio/client@0.1.4/dist/index.min.js";
// Function to handle predictions
async function predict() {
  const imageInput =
    document.getElementById("imageInput");
  const segmentCheckbox =
    document.getElementById("segment_in");

  // Get the selected image file
  const file = imageInput.files[0];
  if (!file) {
    alert("Please select an image");
    return;
  }

  // Convert the image file to a Blob
  const imageData = await readFileAsBlob(file);
  console.log(imageData);

  // Gradio client setup
  const app = await client(
    "https://laefy-tomato.hf.space/--replicas/jvqrg/"
  );

  // Perform prediction
  const result = await app.predict("/main", [
    imageData, // Image blob
    segmentCheckbox.checked, // Checkbox value
  ]);

  // Display the result
  document.getElementById(
    "result"
  ).innerHTML = `<pre>${JSON.stringify(
    result.data,
    null,
    2
  )}</pre>`;
}

// Event listener for the prediction button
document
  .getElementById("generate-button")
  .addEventListener("click", predict);

// Function to convert file to Blob
async function readFileAsBlob(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target.result;
      const byteString = atob(
        dataUrl.split(",")[1]
      );
      const mimeString = dataUrl
        .split(",")[0]
        .split(":")[1]
        .split(";")[0];
      const arrayBuffer = new ArrayBuffer(
        byteString.length
      );
      const intArray = new Uint8Array(
        arrayBuffer
      );

      for (
        let i = 0;
        i < byteString.length;
        i++
      ) {
        intArray[i] = byteString.charCodeAt(i);
      }

      const blob = new Blob([intArray], {
        type: mimeString,
      });
      resolve(blob);
    };

    reader.readAsDataURL(file);
  });
}
