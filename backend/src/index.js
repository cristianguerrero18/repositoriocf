import app from "./app.js";



const main = () => { 
  app.listen(app.get("port"));
  console.log(`the company web server ${app.get("port")}`);
    
}

main();