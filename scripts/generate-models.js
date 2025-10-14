const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");

// Path configuration
const swaggerPath = path.resolve(__dirname, "../doc/swagger_v1.yaml"); 
const finalOutputPath = path.resolve(__dirname, "../src/models/dto");
const tempOutputPath = path.resolve(__dirname, "../temp-dto");

// Generate files in temporary location
const command = `openapi-generator-cli generate -i ${swaggerPath} -g typescript-fetch -o ${tempOutputPath} --global-property=models --additional-properties=supportsES6=true,modelPackage=""`;

exec(command, (error, stdout, stderr) => {
  if (error) {
    console.error(`\nError executing OpenAPI Generator: ${error.message}`);
    return;
  }

  // Ensure target directory exists
  if (!fs.existsSync(finalOutputPath)) {
    fs.mkdirSync(finalOutputPath, { recursive: true });
  }

  // Move files from temp/models to final dto folder and clean up imports
  const sourceDir = path.join(tempOutputPath, "models");
  if (fs.existsSync(sourceDir)) {
    const files = fs.readdirSync(sourceDir);
    files.forEach(file => {
      const sourcePath = path.join(sourceDir, file);
      const destPath = path.join(finalOutputPath, file);
      
      // Read and clean up the file content
      let content = fs.readFileSync(sourcePath, 'utf8');
      content = content.replace(/import[\s\S]*?from ['"]\.\.\/runtime['"];?\n?/g, '');
      
      // Write the cleaned content to the destination
      fs.writeFileSync(destPath, content);
    });
  }

  // Cleanup temporary directory
  fs.rmSync(tempOutputPath, { recursive: true, force: true });
  console.log(`DTO Models generated successfully in ${finalOutputPath}`);
});