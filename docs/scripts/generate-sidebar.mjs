import fs from "fs";
import path from "path";

const API_DIR = "concepts";
const GUIDES_DIR = "guides";

const SECTIONS = [
  "spies",
  "stubs",
  "fakes",
  "mocks",
  "matchers",
  "assertions",
  "sandboxes",
  "spy-call",
  "fake-timers"
];

function extractApiItems(indexPath) {
  const content = fs.readFileSync(indexPath, "utf-8");
  const methods = [];
  const properties = [];

  // Build a map of reference links (e.g., [add-behavior]: ./add-behavior)
  const refLinks = {};
  const refMatches = content.matchAll(/^\[([^\]]+)\]:\s*(.+)$/gm);
  for (const match of refMatches) {
    refLinks[match[1]] = match[2];
  }

  const lines = content.split("\n");
  let currentSection = null;

  for (const line of lines) {
    // Handle different header formats
    if (line.match(/^##?\s*Methods/)) {
      currentSection = "methods";
      continue;
    }
    if (line.match(/^##?\s*Properties/)) {
      currentSection = "properties";
      continue;
    }
    if (line.startsWith("## ") && currentSection) {
      currentSection = null;
      continue;
    }

    if (currentSection) {
      // Match inline links: - [`methodName`](./method-name)
      let linkMatch = line.match(/^\- \[`?([^\]`]+)`?\]\(\.\/([^)]+)\)/);
      if (linkMatch) {
        const text = linkMatch[1];
        const link = `/concepts/${indexPath.split("/")[1]}/api/${linkMatch[2]}`;
        if (currentSection === "methods") {
          methods.push({ text, link });
        } else if (currentSection === "properties") {
          properties.push({ text, link });
        }
        continue;
      }

      // Match reference links: - [`methodName`][method-name]
      linkMatch = line.match(/^\- \[`?([^\]`]+)`?\]\[([^\]]+)\]/);
      if (linkMatch && refLinks[linkMatch[2]]) {
        const text = linkMatch[1];
        const refPath = refLinks[linkMatch[2]];
        const link = `/concepts/${indexPath.split("/")[1]}/api/${refPath.replace(/^\.\//, "")}`;
        if (currentSection === "methods") {
          methods.push({ text, link });
        } else if (currentSection === "properties") {
          properties.push({ text, link });
        }
      }
    }
  }

  // If no methods/properties found (e.g., matchers has flat list), extract all links
  if (methods.length === 0 && properties.length === 0) {
    for (const line of lines) {
      // Inline links
      let linkMatch = line.match(/^\- \[`?([^\]`]+)`?\]\(\.\/([^)]+)\)/);
      if (linkMatch) {
        const text = linkMatch[1];
        const link = `/concepts/${indexPath.split("/")[1]}/api/${linkMatch[2]}`;
        methods.push({ text, link });
        continue;
      }
      // Reference links
      linkMatch = line.match(/^\- \[`?([^\]`]+)`?\]\[([^\]]+)\]/);
      if (linkMatch && refLinks[linkMatch[2]]) {
        const text = linkMatch[1];
        const refPath = refLinks[linkMatch[2]];
        const link = `/concepts/${indexPath.split("/")[1]}/api/${refPath.replace(/^\.\//, "")}`;
        methods.push({ text, link });
      }
    }
  }

  return { methods, properties };
}

function getConceptDisplayName(section) {
  const displayNames = {
    spies: "Spies",
    stubs: "Stubs",
    fakes: "Fakes",
    mocks: "Mocks",
    matchers: "Matchers",
    assertions: "Assertions",
    sandboxes: "Sandboxes",
    "spy-call": "Spy Calls",
    "fake-timers": "Fake Timers"
  };
  return (
    displayNames[section] || section.charAt(0).toUpperCase() + section.slice(1)
  );
}

function kebabToCamel(str) {
  return str.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
}

function generateSidebar() {
  const sidebar = {};

  // Sidebar for intro pages (e.g., /concepts/spies/)
  for (const section of SECTIONS) {
    const introPath = path.join(API_DIR, section, "index.md");
    const apiIndexPath = path.join(API_DIR, section, "api", "index.md");

    if (fs.existsSync(introPath)) {
      // Start with just the API section - the concept header will link to the index
      let sectionItems = [];

      // If API index exists, extract methods/properties and add as collapsible section
      if (fs.existsSync(apiIndexPath)) {
        const { methods, properties } = extractApiItems(apiIndexPath);
        const apiItems = [];

        if (methods.length > 0) {
          apiItems.push({
            text: "Methods",
            collapsed: false,
            items: methods
          });
        }

        if (properties.length > 0) {
          apiItems.push({
            text: "Properties",
            collapsed: false,
            items: properties
          });
        }

        if (apiItems.length > 0) {
          sectionItems.push({
            text: "API",
            collapsed: false,
            items: apiItems
          });
        }
      } else {
        // Fallback: simple API link
        sectionItems.push({
          text: "API",
          link: `/concepts/${section}/api`,
          collapsed: false
        });
      }

      // Create a flat list for prev/next navigation to work correctly
      // Use trailing slash in link to match sidebar key exactly
      const conceptItems = [
        {
          text: "Overview",
          link: `/concepts/${section}/`
        }
      ];

      // Check for error-handling.md in fakes section
      if (section === "fakes") {
        const errorHandlingPath = path.join(
          API_DIR,
          section,
          "error-handling.md"
        );
        if (fs.existsSync(errorHandlingPath)) {
          conceptItems.push({
            text: "Error Handling",
            link: `/concepts/${section}/error-handling`
          });
        }
      }

      conceptItems.push(...sectionItems);

      const flatItems = [
        {
          text: getConceptDisplayName(section),
          items: conceptItems
        }
      ];

      sidebar[`/concepts/${section}/`] = flatItems;
    }
  }

  // NOTE: The /concepts/{section}/ sidebar covers both intro pages and individual
  // API method pages. The /concepts/{section}/api/ entries were removed to avoid
  // conflicts with VitePress sidebar matching.
  // fake-timers: check for api/ directory with individual pages
  const fakeTimersRootDir = path.join(API_DIR, "fake-timers");

  // Check for files in root (new structure: files directly in fake-timers/)
  const rootFiles = fs
    .readdirSync(fakeTimersRootDir)
    .filter((f) => f.endsWith(".md") && !f.startsWith("_"));
  if (rootFiles.length > 0) {
    // Sort to put use-fake-timers first, then alphabetically
    rootFiles.sort((a, b) => {
      if (a === "use-fake-timers.md") return -1;
      if (b === "use-fake-timers.md") return 1;
      return a.localeCompare(b);
    });

    // Start with just the API section - the concept header will link to the index
    let sectionItems = [];

    // Add use-fake-timers as first item after Introduction
    if (rootFiles.includes("use-fake-timers.md")) {
      sectionItems.push({
        text: "useFakeTimers",
        link: "/concepts/fake-timers/use-fake-timers",
        collapsed: false
      });
    }

    // Add remaining items in API collapsible section (exclude index.md - it's the intro)
    const remainingItems = rootFiles.filter(
      (f) => f !== "use-fake-timers.md" && f !== "index.md"
    );
    if (remainingItems.length > 0) {
      const apiItems = remainingItems.map((f) => {
        const name = f.replace(".md", "");
        return {
          text: kebabToCamel(name),
          link: `/concepts/fake-timers/${name}`
        };
      });
      sectionItems.push({
        text: "API",
        collapsed: false,
        items: apiItems
      });
    }

    // Create flat structure for prev/next navigation
    sidebar["/concepts/fake-timers/"] = [
      {
        text: "Fake Timers",
        items: [
          {
            text: "Overview",
            link: "/concepts/fake-timers/"
          },
          ...sectionItems
        ]
      }
    ];
  }

  // Guides sidebar
  if (fs.existsSync(GUIDES_DIR)) {
    const guideItems = [];

    // How-to sub-directory (first)
    const howToDir = path.join(GUIDES_DIR, "how-to");
    if (fs.existsSync(howToDir)) {
      const howToFiles = fs
        .readdirSync(howToDir)
        .filter((f) => f.endsWith(".md") && f !== "index.md")
        .sort();

      const howToDisplayNames = {
        "stub-dependency": "Stub a dependency",
        "link-seams-commonjs": "Link seams (CommonJS)",
        "stub-esm": "Stub ES module imports",
        "fake-timers-async": "Async functions with fake timers",
        "typescript-swc": "TypeScript and SWC",
      };

      const howToItems = howToFiles.map((f) => {
        const name = f.replace(".md", "");
        return {
          text: howToDisplayNames[name] || name.charAt(0).toUpperCase() + name.slice(1).replace(/-/g, " "),
          link: `/guides/how-to/${name}`
        };
      });

      guideItems.push({
        text: "How-to articles",
        collapsed: false,
        items: [
          { text: "Overview", link: "/guides/how-to/" },
          ...howToItems
        ]
      });
    }

    // Top-level guide pages in specified order
    const topLevelOrder = ["faq", "migration", "external-resources"];
    const topLevelDisplayNames = {
      faq: "FAQ",
      migration: "Migration",
      "external-resources": "External resources",
    };

    for (const name of topLevelOrder) {
      if (fs.existsSync(path.join(GUIDES_DIR, `${name}.md`))) {
        guideItems.push({
          text: topLevelDisplayNames[name],
          link: `/guides/${name}`
        });
      }
    }

    sidebar["/guides/"] = [
      {
        text: "Guides",
        items: guideItems
      }
    ];
  }

  // Utils and Promises: single pages at root level
  if (fs.existsSync(path.join(API_DIR, "utils.md"))) {
    sidebar["/concepts/utils/"] = [
      {
        text: "Utils",
        items: [
          {
            text: "Overview",
            link: "/concepts/utils/"
          }
        ]
      }
    ];
  }

  if (fs.existsSync(path.join(API_DIR, "promises.md"))) {
    sidebar["/concepts/promises/"] = [
      {
        text: "Promises",
        items: [
          {
            text: "Overview",
            link: "/concepts/promises/"
          }
        ]
      }
    ];
  }

  return sidebar;
}

const sidebar = generateSidebar();
const output = `// Auto-generated by scripts/generate-sidebar.mjs
// Do not edit manually

export default ${JSON.stringify(sidebar, null, 2)}
`;

fs.writeFileSync(".vitepress/sidebar.mjs", output, "utf-8");
console.log("Sidebar generated!");

// Print summary
console.log("\nSidebar sections:");
for (const [key, value] of Object.entries(sidebar)) {
  const methodCount =
    value.find((v) => v.text === "Methods")?.items.length || 0;
  const propCount =
    value.find((v) => v.text === "Properties")?.items.length || 0;
  console.log(`  ${key}: ${methodCount} methods, ${propCount} properties`);
}
