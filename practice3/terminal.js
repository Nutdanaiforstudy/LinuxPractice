// Simple Linux terminal simulator for ITCS254 practice.
(function () {
  const termDiv = document.getElementById("terminal");
  const termInput = document.getElementById("term-input");
  const promptSpan = document.getElementById("prompt");

  function makeDir() {
    return { type: "dir", children: Object.create(null) };
  }
  function makeFile(content = "") {
    return { type: "file", content: content };
  }

  // Build a small virtual filesystem
  const root = makeDir();
  root.children["home"] = makeDir();
  root.children["etc"] = makeDir();
  root.children["var"] = makeDir();
  root.children["tmp"] = makeDir();
  root.children["dev"] = makeDir();
  root.children["proc"] = makeDir();

  root.children["home"].children["student"] = makeDir();
  root.children["home"].children["student"].children["lab1"] = makeDir();

  // Sample text/log files
  root.children["var"].children["log"] = makeDir();
  root.children["var"].children["log"].children["syslog"] = makeFile(
    "Jan  1 10:10:01 ubuntu systemd[1]: Started Session 1 of user student.\n" +
    "Jan  1 10:12:03 ubuntu sshd[1001]: Accepted password for student from 10.0.0.5 port 54321 ssh2\n"
  );
  root.children["etc"].children["passwd"] = makeFile(
    "root:x:0:0:root:/root:/bin/bash\n" +
    "student:x:1000:1000:Student User:/home/student:/bin/bash\n"
  );
  root.children["etc"].children["shadow"] = makeFile(
    "root:*:19000:0:99999:7:::\n" +
    "student:$6$SALT$hashhashhash:19000:0:99999:7:::\n"
  );

  root.children["home"].children["student"].children["notes.txt"] = makeFile(
    "Linux exam topics: users, permissions, text tools, networking, scripting, security, system administration.\n"
  );

  let cwdParts = ["home", "student"];

  function pathString(parts) {
    return "/" + (parts.length ? parts.join("/") : "");
  }

  function setPrompt() {
    promptSpan.textContent = "student@ubuntu:" +
      (cwdParts.length === 2 && cwdParts[0] === "home" && cwdParts[1] === "student" ? "~" : pathString(cwdParts)) +
      "$";
  }

  function printLine(text) {
    const div = document.createElement("div");
    div.className = "term-line";
    div.textContent = text || "";
    termDiv.appendChild(div);
    termDiv.scrollTop = termDiv.scrollHeight;
  }

  function resolvePath(path, baseParts) {
    let parts;
    if (!path || path === ".") {
      parts = baseParts.slice();
    } else if (path.startsWith("/")) {
      parts = path.split("/").filter(Boolean);
    } else {
      parts = baseParts.concat(path.split("/").filter(Boolean));
    }
    const clean = [];
    for (const p of parts) {
      if (p === "." || p === "") continue;
      if (p === "..") {
        if (clean.length) clean.pop();
      } else {
        clean.push(p);
      }
    }
    let node = root;
    for (let i = 0; i < clean.length; i++) {
      const segment = clean[i];
      const child = node.children[segment];
      if (!child) {
        return { parent: node, name: segment, node: null, parts: clean };
      }
      if (child.type === "dir") {
        node = child;
      } else if (i === clean.length - 1) {
        return { parent: node, name: segment, node: child, parts: clean };
      } else {
        return { parent: node, name: segment, node: null, parts: clean };
      }
    }
    return { parent: node, name: null, node: node, parts: clean };
  }

  function getCwdNode() {
    let node = root;
    for (const p of cwdParts) {
      node = node.children[p];
      if (!node || node.type !== "dir") break;
    }
    return node || root;
  }

  function cmd_pwd() {
    return pathString(cwdParts);
  }

  function cmd_ls(args) {
    const target = args[0] || ".";
    const res = resolvePath(target, cwdParts);
    if (!res.node) {
      return "ls: cannot access '" + target + "': No such file or directory";
    }
    if (res.node.type === "file") {
      return res.name;
    }
    const names = Object.keys(res.node.children).sort();
    return names.join("  ");
  }

  function cmd_cd(args) {
    const target = args[0];
    if (!target) {
      cwdParts = ["home", "student"];
      return "";
    }
    const res = resolvePath(target, cwdParts);
    if (!res.node || res.node.type !== "dir") {
      return "bash: cd: " + target + ": No such file or directory";
    }
    cwdParts = res.parts;
    setPrompt();
    return "";
  }

  function cmd_mkdir(args) {
    const name = args[0];
    if (!name) return "mkdir: missing operand";
    const res = resolvePath(name, cwdParts);
    if (res.node) return "mkdir: cannot create directory '" + name + "': File exists";
    if (!res.parent || res.parent.type !== "dir") {
      return "mkdir: cannot create directory '" + name + "': No such file or directory";
    }
    res.parent.children[res.name] = makeDir();
    return "";
  }

  function lookupFile(name, createIfMissing) {
    const res = resolvePath(name, cwdParts);
    if (res.node && res.node.type === "file") return res.node;
    if (!res.node && createIfMissing) {
      if (!res.parent || res.parent.type !== "dir") return null;
      res.parent.children[res.name] = makeFile("");
      return res.parent.children[res.name];
    }
    return null;
  }

  function cmd_touch(args) {
    const name = args[0];
    if (!name) return "touch: missing file operand";
    const res = resolvePath(name, cwdParts);
    if (!res.node) {
      if (!res.parent || res.parent.type !== "dir") {
        return "touch: cannot touch '" + name + "': No such file or directory";
      }
      res.parent.children[res.name] = makeFile("");
      return "";
    }
    if (res.node.type === "dir") {
      return "touch: cannot touch '" + name + "': Is a directory";
    }
    return "";
  }

  function cmd_cat(args) {
    if (!args[0]) return "cat: missing file operand";
    const file = lookupFile(args[0], false);
    if (!file) return "cat: " + args[0] + ": No such file";
    return file.content || "";
  }

  function cmd_echo(args) {
    return args.join(" ");
  }

  function cmd_rm(args) {
    const name = args[0];
    if (!name) return "rm: missing operand";
    const res = resolvePath(name, cwdParts);
    if (!res.node) return "rm: cannot remove '" + name + "': No such file or directory";
    if (res.node.type === "dir") return "rm: refusing to remove directory in simulator (use files only)";
    delete res.parent.children[res.name];
    return "";
  }

  function cmd_whoami() {
    return "student";
  }

  function cmd_id() {
    return "uid=1000(student) gid=1000(student) groups=1000(student),27(sudo)";
  }

  function cmd_groups() {
    return "student sudo";
  }

  function cmd_chmod(args) {
    if (args.length < 2) return "usage: chmod MODE FILE";
    const mode = args[0];
    const file = lookupFile(args[1], false);
    if (!file) return "chmod: cannot access '" + args[1] + "': No such file";
    return "(simulator) chmod " + mode + " " + args[1] + " applied.";
  }

  function cmd_head(args) {
    if (!args[0]) return "usage: head FILE";
    const file = lookupFile(args[0], false);
    if (!file) return "head: cannot open '" + args[0] + "': No such file";
    const lines = (file.content || "").split("\n").slice(0, 10);
    return lines.join("\n");
  }

  function cmd_tail(args) {
    if (!args[0]) return "usage: tail FILE";
    const file = lookupFile(args[0], false);
    if (!file) return "tail: cannot open '" + args[0] + "': No such file";
    const arr = (file.content || "").split("\n");
    const lines = arr.slice(Math.max(0, arr.length - 10));
    return lines.join("\n");
  }

  function cmd_grep(args) {
    if (args.length < 2) return "usage: grep PATTERN FILE";
    const pattern = args[0];
    const file = lookupFile(args[1], false);
    if (!file) return "grep: " + args[1] + ": No such file";
    const out = [];
    const re = new RegExp(pattern);
    (file.content || "").split("\n").forEach(function (line) {
      if (re.test(line)) out.push(line);
    });
    return out.join("\n");
  }

  function cmd_ping(args) {
    const host = args[0] || "8.8.8.8";
    return "PING " + host + " (demo):\n64 bytes from " + host + ": icmp_seq=1 ttl=64 time=12.3 ms\n64 bytes from " + host + ": icmp_seq=2 ttl=64 time=11.8 ms\n--- " + host + " ping statistics (simulated) ---";
  }

  function cmd_ip(args) {
    const sub = args[0] || "";
    if (sub === "addr" || sub === "a") {
      return "1: lo: <LOOPBACK> mtu 65536\n    inet 127.0.0.1/8 scope host lo\n2: eth0: <UP> mtu 1500\n    inet 10.0.0.10/24 brd 10.0.0.255 scope global eth0";
    }
    if (sub === "route") {
      return "default via 10.0.0.1 dev eth0\n10.0.0.0/24 dev eth0 proto kernel scope link src 10.0.0.10";
    }
    return "Usage: ip addr | ip route (simulated)";
  }

  function cmd_wget(args) {
    const url = args[0] || "http://example.com/file.txt";
    return "wget: downloading " + url + " ...\n(simulated transfer complete; file not really stored)";
  }

  function cmd_curl(args) {
    const url = args[0] || "http://example.com";
    return "curl output from " + url + " (simulated):\n<html><body><h1>Demo page</h1></body></html>";
  }

  function cmd_sudo(args) {
    if (!args.length) return "usage: sudo COMMAND";
    return "student is not really root in this simulator.\n(simulated sudo) Would run: " + args.join(" ");
  }

  function cmd_df() {
    return "Filesystem      Size  Used Avail Use% Mounted on\n/dev/sda1        30G  3.0G   25G  11% /\n/dev/sda2        46M  8.0M   25M  19% /boot";
  }

  function cmd_du(args) {
    const target = args[0] || ".";
    return "Simulated disk usage for " + target + ":\n1.0M\t" + pathString(cwdParts);
  }

  function cmd_top() {
    return "top - 10:10:10 (simulated) up 1 day,  2:03,  1 user,  load average: 0.00, 0.01, 0.05\n" +
           "PID  USER     PR  NI  VIRT  RES  SHR S  %CPU %MEM TIME+ COMMAND\n" +
           "1000 student   20   0  100m  10m  5m  S   0.3  0.2  0:01 bash\n" +
           "1001 student   20   0  120m  12m  6m  R   0.7  0.3  0:02 terminal-sim";
  }

  function cmd_ps() {
    return "  PID TTY          TIME CMD\n 1000 pts/0    00:00:01 bash\n 1001 pts/0    00:00:02 terminal-sim";
  }

  function cmd_systemctl(args) {
    const sub = args[0] || "status";
    const svc = args[1] || "apache2.service";
    if (sub === "status") {
      return svc + " - (simulated) active (running)";
    }
    if (sub === "start" || sub === "stop" || sub === "restart" || sub === "enable") {
      return "(simulated) systemctl " + sub + " " + svc + " succeeded.";
    }
    return "Usage: systemctl status|start|stop|restart|enable SERVICE (simulated)";
  }

  function cmd_help() {
    return [
      "Supported commands in this simulator:",
      "  pwd, ls, cd, mkdir, touch, rm",
      "  cat, echo, head, tail, grep",
      "  whoami, id, groups, chmod",
      "  ping, ip addr, ip route, wget, curl",
      "  sudo, df, du, top, ps, systemctl",
      "  clear, help",
      "",
      "Use these to complete the tasks shown above the terminal."
    ].join("\n");
  }

  function handleCommand(line) {
    const raw = line;
    const trimmed = raw.trim();
    if (!trimmed) return;
    printLine(promptSpan.textContent + " " + raw);

    const parts = trimmed.split(/\s+/);
    const cmd = parts[0];
    const args = parts.slice(1);

    let out = "";
    switch (cmd) {
      case "pwd": out = cmd_pwd(); break;
      case "ls": out = cmd_ls(args); break;
      case "cd": out = cmd_cd(args); break;
      case "mkdir": out = cmd_mkdir(args); break;
      case "touch": out = cmd_touch(args); break;
      case "cat": out = cmd_cat(args); break;
      case "echo": out = cmd_echo(args); break;
      case "rm": out = cmd_rm(args); break;
      case "whoami": out = cmd_whoami(); break;
      case "id": out = cmd_id(); break;
      case "groups": out = cmd_groups(); break;
      case "chmod": out = cmd_chmod(args); break;
      case "head": out = cmd_head(args); break;
      case "tail": out = cmd_tail(args); break;
      case "grep": out = cmd_grep(args); break;
      case "ping": out = cmd_ping(args); break;
      case "ip": out = cmd_ip(args); break;
      case "wget": out = cmd_wget(args); break;
      case "curl": out = cmd_curl(args); break;
      case "sudo": out = cmd_sudo(args); break;
      case "df": out = cmd_df(); break;
      case "du": out = cmd_du(args); break;
      case "top": out = cmd_top(); break;
      case "ps": out = cmd_ps(); break;
      case "systemctl": out = cmd_systemctl(args); break;
      case "clear":
        termDiv.innerHTML = "";
        return;
      case "help": out = cmd_help(); break;
      default:
        out = cmd + ": command not found in simulator (type 'help' to see available commands)";
    }
    if (out) {
      printLine(out);
    }
  }

  const history = [];
  let historyIndex = -1;

  termInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      const value = termInput.value;
      termInput.value = "";
      history.push(value);
      historyIndex = history.length;
      handleCommand(value);
      e.preventDefault();
    } else if (e.key === "ArrowUp") {
      if (history.length && historyIndex > 0) {
        historyIndex--;
        termInput.value = history[historyIndex];
        setTimeout(function () {
          termInput.setSelectionRange(termInput.value.length, termInput.value.length);
        }, 0);
      }
      e.preventDefault();
    } else if (e.key === "ArrowDown") {
      if (history.length && historyIndex < history.length - 1) {
        historyIndex++;
        termInput.value = history[historyIndex];
      } else {
        historyIndex = history.length;
        termInput.value = "";
      }
      e.preventDefault();
    }
  });

  function init() {
    setPrompt();
    printLine("Welcome to the ITCS254 Linux terminal simulator.");
    printLine("Type 'help' for a list of supported commands.");
  }

  init();
})();