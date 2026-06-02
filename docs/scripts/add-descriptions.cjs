const fs = require("fs");
const path = require("path");

const DOCS_DIR = path.join(__dirname, "..", "docs");

// Get all API files
function getApiFiles() {
  const apiDirs = [
    "spies/api",
    "stubs/api",
    "fakes/api",
    "mocks/api",
    "matchers/api",
    "assertions/api",
    "sandboxes/api",
    "spy-call/api"
  ];

  const files = [];
  for (const dir of apiDirs) {
    const fullPath = path.join(DOCS_DIR, "concepts", dir);
    if (fs.existsSync(fullPath)) {
      const items = fs.readdirSync(fullPath);
      for (const item of items) {
        if (item.endsWith(".md") && !item.startsWith("_")) {
          files.push(path.join(fullPath, item));
        }
      }
    }
  }
  return files;
}

// Extract first meaningful paragraph from content
function extractDescription(content) {
  // Split content into lines
  const lines = content.split("\n");

  // Find first non-empty line after frontmatter
  let inFrontmatter = false;
  let foundFirstPara = false;
  let description = "";

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Track frontmatter
    if (line === "---") {
      if (i === 0) {
        inFrontmatter = true;
        continue;
      }
      inFrontmatter = !inFrontmatter;
      continue;
    }

    if (inFrontmatter) continue;

    // Skip headings
    if (line.startsWith("#")) continue;

    // Skip empty lines
    if (line === "") {
      if (foundFirstPara) break;
      continue;
    }

    // Skip code blocks
    if (line.startsWith("```")) continue;

    // Skip <<< includes
    if (line.startsWith("<<<")) continue;

    // Skip blockquotes (like notes/warnings)
    if (line.startsWith(">")) continue;

    // First meaningful content
    if (!foundFirstPara) {
      // Clean up the line - remove leading # from inline headers
      description = line.replace(/^#\s*/, "").trim();
      foundFirstPara = true;
    } else {
      // Append more content if it's a continuation
      description += " " + line.replace(/^#\s*/, "").trim();
    }

    // Stop after a reasonable description length
    if (description.length > 150) break;
  }

  // Clean up description
  description = description.replace(/\s+/g, " ").trim();

  // Truncate if too long
  if (description.length > 200) {
    description = description.substring(0, 197) + "...";
  }

  return description;
}

// Add description to frontmatter
function addDescription(filePath) {
  const content = fs.readFileSync(filePath, "utf-8");

  // Check if already has description
  if (/^description:\s*/m.test(content)) {
    console.log(
      `  Skipping (already has description): ${path.basename(filePath)}`
    );
    return false;
  }

  const description = extractDescription(content);
  if (!description) {
    console.log(
      `  Warning: Could not extract description for: ${path.basename(filePath)}`
    );
    return false;
  }

  // Check if has title frontmatter
  const hasFrontmatter = content.startsWith("---");

  if (hasFrontmatter) {
    // Insert description after title
    const newContent = content.replace(
      /^(---\ntitle:[^\n]*\n)/,
      "$1description: " + description + "\n"
    );
    fs.writeFileSync(filePath, newContent);
    console.log(`  Updated: ${path.basename(filePath)}`);
    return true;
  } else {
    // Create new frontmatter
    const newContent =
      `---\ntitle: ${path.basename(filePath, ".md")}\ndescription: ${description}\n---\n\n` +
      content;
    fs.writeFileSync(filePath, newContent);
    console.log(`  Created frontmatter: ${path.basename(filePath)}`);
    return true;
  }
}

// Main
console.log("Adding descriptions to API pages...\n");

const files = getApiFiles();
console.log(`Found ${files.length} API files`);

let updated = 0;
for (const file of files) {
  const result = addDescription(file);
  if (result) updated++;
}

console.log(`\nDone. Updated ${updated} files.`);
