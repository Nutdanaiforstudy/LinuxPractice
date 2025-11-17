// Very small in‑browser fake Ubuntu + Java terminal.
// Everything is client‑side JavaScript, no server, no real JVM.
// It is designed so students can read/modify the code.

(function () {
  const outputEl = document.getElementById("output");
  const inputEl = document.getElementById("cmdline");
  const promptLabel = document.getElementById("promptLabel");

  // ----- Simple virtual filesystem tree -----
  function makeDir() {
    return { type: "dir", children: Object.create(null) };
  }
  function makeFile(content = "") {
    return { type: "file", content, compiled: false };
  }

  const root = makeDir();
  // /home/student with a starter HelloWorld.java
  root.children["home"] = makeDir();
  root.children["home"].children["student"] = makeDir();
  root.children["tmp"] = makeDir();

  let cwd = ["home", "student"];

  function cwdNode() {
    return resolvePathParts(cwd).node;
  }

  function resolvePath(pathStr, baseParts) {
    let parts;
    if (!pathStr || pathStr === ".") {
      parts = baseParts.slice();
    } else if (pathStr[0] === "/") {
      parts = pathStr.split("/").filter(Boolean);
    } else {
      parts = baseParts.concat(pathStr.split("/").filter(Boolean));
    }

    return resolvePathParts(parts);
  }

  function resolvePathParts(parts) {
    const clean = [];
    for (const p of parts) {
      if (p === "" || p === ".") continue;
      if (p === "..") {
        if (clean.length) clean.pop();
      } else {
        clean.push(p);
      }
    }
    let node = root;
    for (const p of clean) {
      if (!node.children[p] || node.children[p].type !== "dir") {
        if (p === clean[clean.length - 1]) {
          // last element can be file OR dir; just return parent + last
          return { parent: node, name: p, node: node.children[p] || null, parts: clean };
        }
        return { parent: null, name: null, node: null, parts: clean };
      }
      node = node.children[p];
    }
    return { parent: node, name: null, node, parts: clean };
  }

  function pwdString() {
    return "/" + (cwd.length ? cwd.join("/") : "");
  }

  // ----- Output helpers -----
  function appendLine(text = "") {
    outputEl.textContent += text + "\n";
    outputEl.scrollTop = outputEl.scrollHeight;
  }

  function showPrompt(cmd) {
    const prefix = `student@ubuntu:${pwdString()}$ `;
    appendLine(prefix + (cmd || ""));
  }

  function setPromptLabel() {
    promptLabel.textContent = `student@ubuntu:${pwdString()}$ `;
  }

  // ----- Command implementations -----
  function cmd_help() {
    return [
      "Available commands:",
      "  help, clear",
      "  pwd, ls [dir], cd [dir], mkdir <name>",
      "  touch <file>, cat <file>, rm <file>",
      "  nano <file>, vi <file>  (simple popup editor)",
      "  javac <File.java>       (marks file as compiled)",
      "  java <ClassName>        (runs System.out.println lines)",
      "",
      "This is a teaching simulator – not a full Linux or Java environment."
    ].join("\n");
  }

  function cmd_pwd() {
    return pwdString();
  }

  function cmd_ls(args) {
    const targetPath = args[0] || ".";
    const { node, parent, name } = resolvePath(targetPath, cwd);
    if (!node) {
      return `ls: cannot access '${targetPath}': No such file or directory`;
    }
    if (node.type === "file") {
      return name;
    }
    const names = Object.keys(node.children).sort();
    return names.join("  ");
  }

  function cmd_cd(args) {
    const target = args[0];
    if (!target) {
      cwd = ["home", "student"];
      return "";
    }
    const result = resolvePath(target, cwd);
    if (!result.node || result.node.type !== "dir") {
      return `bash: cd: ${target}: No such file or directory`;
    }
    cwd = result.parts;
    setPromptLabel();
    return "";
  }

  function cmd_mkdir(args) {
    const name = args[0];
    if (!name) return "mkdir: missing operand";
    const res = resolvePath(name, cwd);
    if (res.node) return `mkdir: cannot create directory '${name}': File exists`;
    if (!res.parent || res.parent.type !== "dir") {
      return `mkdir: cannot create directory '${name}': No such file or directory`;
    }
    res.parent.children[res.name] = makeDir();
    return "";
  }

  function lookupFile(name, createIfMissing = false) {
    const res = resolvePath(name, cwd);
    if (!res.node && createIfMissing) {
      if (!res.parent || res.parent.type !== "dir") return null;
      res.parent.children[res.name] = makeFile("");
      return res.parent.children[res.name];
    }
    if (!res.node || res.node.type !== "file") return null;
    return res.node;
  }

  function cmd_touch(args) {
    const name = args[0];
    if (!name) return "touch: missing file operand";
    const res = resolvePath(name, cwd);
    if (!res.node) {
      if (!res.parent || res.parent.type !== "dir") {
        return `touch: cannot touch '${name}': No such file or directory`;
      }
      res.parent.children[res.name] = makeFile("");
    } else if (res.node.type === "dir") {
      return `touch: cannot touch '${name}': Is a directory`;
    }
    return "";
  }

  function cmd_cat(args) {
    if (args.length === 0) return "cat: missing file operand";
    const name = args[0];
    const file = lookupFile(name, false);
    if (!file) return `cat: ${name}: No such file`;
    return file.content || "";
  }

  function cmd_rm(args) {
    const name = args[0];
    if (!name) return "rm: missing operand";
    const res = resolvePath(name, cwd);
    if (!res.node) return `rm: cannot remove '${name}': No such file or directory`;
    if (res.node.type === "dir") {
      return "rm: refusing to remove directory in this simulator (use files only)";
    }
    delete res.parent.children[res.name];
    return "";
  }

  function editWithPrompt(filename) {
    const file = lookupFile(filename, true);
    const current = file.content || "";
    const updated = window.prompt(
      `Simple editor for ${filename}\nUse \\n for new lines if needed:`,
      current
    );
    if (updated !== null) {
      file.content = updated;
      file.compiled = false;
      return `${filename} saved.`;
    }
    return "Edit cancelled.";
  }

  function cmd_nano(args) {
    if (!args[0]) return "nano: missing file operand";
    return editWithPrompt(args[0]);
  }

  function cmd_vi(args) {
    if (!args[0]) return "vi: missing file operand";
    return editWithPrompt(args[0]);
  }

  function cmd_javac(args) {
    const name = args[0];
    if (!name) return "javac: file name required, e.g. javac HelloWorld.java";
    const file = lookupFile(name, false);
    if (!file) return `javac: file not found: ${name}`;
    if (!name.endsWith(".java")) {
      return "javac: this simulator only accepts .java source files";
    }
    file.compiled = true;
    // optional: create a fake .class entry
    const parts = name.split("/");
    const base = parts[parts.length - 1].replace(/\.java$/, "");
    const cwdN = cwdNode();
    cwdN.children[base + ".class"] = makeFile("[bytecode created by simulator]");
    return `Compiled ${name} (syntax not really checked – educational only).`;
  }

  function cmd_java(args) {
    const className = args[0];
    if (!className) return "java: class name required, e.g. java HelloWorld";
    const sourceName = className + ".java";
    const file = lookupFile(sourceName, false);
    if (!file) {
      return `Error: could not find ${sourceName} in ${pwdString()}`;
    }
    // Very naive "execution": find System.out.println("...") lines and print the strings.
    const regex = /System\.out\.println\s*\(\s*"(.*?)"\s*\)\s*;/g;
    const lines = [];
    let match;
    while ((match = regex.exec(file.content)) !== null) {
      lines.push(match[1]);
    }
    if (lines.length === 0) {
      return [
        `Running ${className}...`,
        "[No System.out.println(\"...\") lines found – nothing to display.]"
      ].join("\n");
    }
    return lines.join("\n");
  }

  // ----- Command dispatcher -----
  function handleCommand(line) {
    const trimmed = line.trim();
    if (trimmed === "") return;

    const parts = trimmed.split(/\s+/);
    const cmd = parts[0];
    const args = parts.slice(1);

    switch (cmd) {
      case "help":
        appendLine(cmd_help());
        break;
      case "pwd":
        appendLine(cmd_pwd());
        break;
      case "ls":
        appendLine(cmd_ls(args));
        break;
      case "cd":
        appendLine(cmd_cd(args));
        break;
      case "mkdir":
        appendLine(cmd_mkdir(args));
        break;
      case "touch":
        appendLine(cmd_touch(args));
        break;
      case "cat":
        appendLine(cmd_cat(args));
        break;
      case "rm":
        appendLine(cmd_rm(args));
        break;
      case "nano":
        appendLine(cmd_nano(args));
        break;
      case "vi":
        appendLine(cmd_vi(args));
        break;
      case "javac":
        appendLine(cmd_javac(args));
        break;
      case "java":
        appendLine(cmd_java(args));
        break;
      case "clear":
        outputEl.textContent = "";
        break;
      default:
        appendLine(`bash: ${cmd}: command not found (simulator only knows limited commands; type 'help')`);
    }
  }

  // ----- Starter file: HelloWorld.java -----
  (function seedFiles() {
    const home = root.children["home"].children["student"];
    home.children["HelloWorld.java"] = makeFile(
      [
        "public class HelloWorld {",
        "    public static void main(String[] args) {",
        "        System.out.println(\"Hello from the web Java simulator!\");",
        "    }",
        "}"
      ].join("\n")
    );
  })();

  // ----- Input handling -----
  const history = [];
  let historyIndex = -1;

  function onEnter(line) {
    showPrompt(line);
    history.push(line);
    historyIndex = history.length;
    handleCommand(line);
  }

  inputEl.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const value = inputEl.value;
      inputEl.value = "";
      onEnter(value);
    } else if (e.key === "ArrowUp") {
      if (history.length && historyIndex > 0) {
        historyIndex -= 1;
        inputEl.value = history[historyIndex];
        setTimeout(() => inputEl.setSelectionRange(inputEl.value.length, inputEl.value.length), 0);
      }
      e.preventDefault();
    } else if (e.key === "ArrowDown") {
      if (history.length && historyIndex < history.length - 1) {
        historyIndex += 1;
        inputEl.value = history[historyIndex];
      } else {
        historyIndex = history.length;
        inputEl.value = "";
      }
      e.preventDefault();
    }
  });

  // Initial prompt & demo
  appendLine("Welcome to the in‑browser Java & Ubuntu terminal simulator.");
  appendLine("Type 'help' to see supported commands.");
  appendLine("");
  setPromptLabel();
  inputEl.focus();
})();
