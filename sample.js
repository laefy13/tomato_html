import { client } from "https://cdn.jsdelivr.net/npm/@gradio/client@0.8.2/dist/index.min.js";

const response_0 = await fetch("https://raw.githubusercontent.com/gradio-app/gradio/main/test/test_files/bus.png");
const exampleImage = await response_0.blob();
						
const app = await client("http://127.0.0.1:7860/");


const result = await app.predict("/main_1", [		
				"marked_clean.png", // string  in 'image_path' Textbox component		
				true, // boolean  in 'Segment' Checkbox component		
				true, // boolean  in 'Segment' Checkbox component
	]);


  
console.log(result.data);


