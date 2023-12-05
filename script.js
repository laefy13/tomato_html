import { client } from "https://cdn.jsdelivr.net/npm/@gradio/client@0.8.2/dist/index.min.js";

function uploadImage(image_) {
  return new Promise((resolve, reject) => {
    const input =
      document.getElementById("imageInput");
    const file = input.files[0];

    const confidence = document.getElementById(
      "confidence_in"
    );
    const classification =
      document.getElementById(
        "classification_in"
      );
    // const previewImage = document.getElementById('previewImage');
    const outputImage = document.getElementById(
      "outputImage"
    );
    const formData = new FormData();
    formData.append("image", file);

    let imageUrl;

    fetch(
      "https://api.imgbb.com/1/upload?expiration=30&key=7cbbdced6035920192277675516a2f49",
      {
        method: "POST",
        body: formData,
      }
    )
      .then((response) => response.json())
      .then((data) => {
        imageUrl = data.data.url;
        resolve(imageUrl);
      })
      .catch((error) => {
        console.error(
          "Error uploading image:",
          error
        );

        confidence.value = "Error!";
        classification.value = "Error!";
        outputImage.src = "error.png";
        reject(error);
      });
  });
}

async function predict() {
  const confidence = document.getElementById(
    "confidence_in"
  );
  const classification = document.getElementById(
    "classification_in"
  );
  // const previewImage = document.getElementById('previewImage');
  const outputImage = document.getElementById(
    "outputImage"
  );
  confidence.value = "Loading...";
  classification.value = "Loading...";
  outputImage.src = "loading.gif";
  const imageInput =
    document.getElementById("imageInput");
  const segmentCheckbox =
    document.getElementById("segment_in");

  const file = imageInput.files[0];
  console.log(file);
  const url = await uploadImage(file);
  if (!file) {
    alert("Please select an image");
    return;
  }

  const app = await client(
    "https://laefy-tomato.hf.space/--replicas/9bw79/"
  );

  const result = await app
    .predict("/main_1", [
      url,
      segmentCheckbox.checked,
      true,
    ])
    .catch((error) => {
      confidence.value = "Error!";
      classification.value = "Error!";
      outputImage.src = "error.png";
    });
  console.log(result);
  console.log(result.data);
  console.log(result.data[2].url);
  classification.value = result.data[0];
  confidence.value = result.data[1];
  // previewImage.src = result.data[3].url
  outputImage.src = result.data[2].url;
}

document
  .getElementById("generate-button")
  .addEventListener("click", predict);

document.addEventListener(
  "DOMContentLoaded",
  function () {
    const imageInput =
      document.getElementById("imageInput");
    const previewImage = document.getElementById(
      "previewImage"
    );

    imageInput.addEventListener(
      "change",
      function () {
        const file = this.files[0];

        if (file) {
          const reader = new FileReader();

          reader.onload = function (e) {
            previewImage.src = e.target.result;
          };

          reader.readAsDataURL(file);
        } else {
          previewImage.src = "upload.png";
        }
      }
    );
  }
);
