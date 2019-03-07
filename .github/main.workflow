workflow "Run tests" {
  on = "push"
  resolves = ["lint", "test"]
}

action "install" {
  uses = "actions/npm"
  args = "ci"
  env = {
    PUPPETEER_SKIP_CHROMIUM_DOWNLOAD = "true"
  }
}

action "lint" {
  needs = "install"
  uses = "actions/npm"
  args = "run lint"
}

action "test-esm-bundle" {
  needs = "install"
  uses = "actions/npm"
  args = "run test-esm-bundle"
}

action "test-node" {
  needs = "install"
  uses = "actions/npm"
  args = "run test-node"
}
