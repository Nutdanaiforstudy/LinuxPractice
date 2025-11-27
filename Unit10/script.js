/**
 * Linux Text Tools Practice Lab
 * All logic runs entirely in the browser.
 */

/* ---------- Terminal quiz data ---------- */

const terminalTasks = [
  {
    id: 1,
    description: "View the contents of a file named notes.txt one page at a time.",
    answers: ["less notes.txt", "more notes.txt"]
  },
  {
    id: 2,
    description: "Show the first 5 lines of a file called report.log.",
    answers: ["head -n 5 report.log", "head -5 report.log"]
  },
  {
    id: 3,
    description: "Show the last 10 lines of system.log and keep following new lines as they are added.",
    answers: ["tail -f system.log", "tail -n 10 -f system.log", "tail -f -n 10 system.log"]
  },
  {
    id: 4,
    description: "Replace every occurrence of 'error' with 'warning' in input.txt and show the result on screen.",
    answers: ["sed 's/error/warning/g' input.txt", "sed s/error/warning/g input.txt"]
  },
  {
    id: 5,
    description: "Use sed to save all replacements of 'cat' with 'dog' from pets.txt into newpets.txt.",
    answers: ["sed 's/cat/dog/g' pets.txt > newpets.txt", "sed s/cat/dog/g pets.txt > newpets.txt"]
  },
  {
    id: 6,
    description: "Print only the first field (username) from /etc/passwd, where fields are separated by colons.",
    answers: ["awk -F: '{print $1}' /etc/passwd"]
  },
  {
    id: 7,
    description: "Use grep to show all lines in auth.log that contain the word FAILED (case-insensitive).",
    answers: ["grep -i FAILED auth.log", "grep -i failed auth.log"]
  },
  {
    id: 8,
    description: "Sort the file names.txt alphabetically and remove duplicate lines.",
    answers: ["sort -u names.txt", "sort names.txt | uniq"]
  },
  {
    id: 9,
    description: "Show only lines from data.txt that do NOT contain the word debug.",
    answers: ["grep -v debug data.txt"]
  },
  {
    id: 10,
    description: "Translate all lowercase letters to uppercase from input.txt and print the result.",
    answers: ["tr 'a-z' 'A-Z' < input.txt", "cat input.txt | tr 'a-z' 'A-Z'"]
  },
  {
    id: 11,
    description: "Display only the second and third comma-separated fields from users.csv.",
    answers: ["cut -d ',' -f 2,3 users.csv"]
  },
  {
    id: 12,
    description: "Join two files phone.txt and names.txt on their first field.",
    answers: ["join phone.txt names.txt"]
  },
  {
    id: 13,
    description: "Show all printable strings found inside a binary file app.bin.",
    answers: ["strings app.bin"]
  },
  {
    id: 14,
    description: "Replace /sbin/nologin with /bin/bash in accounts.txt and save the result back into accounts.txt.",
    answers: ["sed -i 's/\\/sbin\\/nologin/\\/bin\\/bash/g' accounts.txt"]
  },
  {
    id: 15,
    description: "Split bigfile.log into smaller files of 500 lines each.",
    answers: ["split -l 500 bigfile.log"]
  }
];

/* ---------- MCQ quiz data (100 questions) ---------- */

const mcqQuestions = [
  {
    q: "What does the command `cat file1 file2` do?",
    options: [
      "Deletes file1 and file2",
      "Concatenates file1 and file2 and prints the result",
      "Copies file1 to file2",
      "Sorts the content of file1 and file2"
    ],
    answer: 1
  },
  {
    q: "Which command is best to create a new file from keyboard input until you press CTRL-D?",
    options: [
      "echo > file.txt",
      "cat > file.txt",
      "touch file.txt",
      "less file.txt"
    ],
    answer: 1
  },
  {
    q: "The command `echo -e \"line1\\nline2\"` will:",
    options: [
      "Print literal characters \\n",
      "Print line1 and line2 on separate lines",
      "Create a new file containing line1 and line2",
      "Do nothing because -e is invalid"
    ],
    answer: 1
  },
  {
    q: "Which command displays the first 10 lines of mylog.txt by default?",
    options: [
      "start mylog.txt",
      "head mylog.txt",
      "top mylog.txt",
      "first mylog.txt"
    ],
    answer: 1
  },
  {
    q: "Which command continuously shows new lines being added to a file?",
    options: [
      "head -f file.txt",
      "tail -f file.txt",
      "more -f file.txt",
      "less -c file.txt"
    ],
    answer: 1
  },
  {
    q: "What is the usual purpose of `less`?",
    options: [
      "Edit a file",
      "Page through the contents of a file interactively",
      "Compile a C program",
      "Monitor CPU usage"
    ],
    answer: 1
  },
  {
    q: "Which command searches for a pattern in a file and prints matching lines?",
    options: [
      "find",
      "sed",
      "grep",
      "cut"
    ],
    answer: 2
  },
  {
    q: "What does the `-i` option usually mean for `grep`?",
    options: [
      "Interactive mode",
      "In-place editing",
      "Ignore case while matching",
      "Include file names only"
    ],
    answer: 2
  },
  {
    q: "The command `grep -v error app.log` will:",
    options: [
      "Show only lines that contain 'error'",
      "Delete all lines that contain 'error'",
      "Show lines that do NOT contain 'error'",
      "Show only the last occurrence of 'error'"
    ],
    answer: 2
  },
  {
    q: "Which command displays all printable strings in a binary file?",
    options: [
      "str",
      "strings",
      "grep -p",
      "printbin"
    ],
    answer: 1
  },
  {
    q: "In `sed 's/foo/bar/' file`, what does `s` stand for?",
    options: [
      "search",
      "start",
      "substitute",
      "skip"
    ],
    answer: 2
  },
  {
    q: "By default, `sed 's/a/b/' file` replaces:",
    options: [
      "All occurrences of a with b on each line",
      "Only the first occurrence of a with b on each line",
      "Only lines that begin with a",
      "Only the last a in the file"
    ],
    answer: 1
  },
  {
    q: "What does the `g` flag mean in `sed 's/foo/bar/g'`?",
    options: [
      "Global: replace all matches on each line",
      "Group: act on matching groups only",
      "Go: run in background",
      "Graphical mode"
    ],
    answer: 0
  },
  {
    q: "Which command uses a script file of sed commands?",
    options: [
      "sed -s script.txt file",
      "sed -f script.txt file",
      "sed -r script.txt file",
      "sed -p script.txt file"
    ],
    answer: 1
  },
  {
    q: "What does `sed -i 's/old/new/g' data.txt` do?",
    options: [
      "Prints replacements but does not touch the file",
      "Edits data.txt in place replacing old with new",
      "Deletes data.txt",
      "Interacts with the user for each replacement"
    ],
    answer: 1
  },
  {
    q: "Which tool is especially good at working with fields and records in text files?",
    options: [
      "sed",
      "awk",
      "grep",
      "strings"
    ],
    answer: 1
  },
  {
    q: "In awk, `$1` usually refers to:",
    options: [
      "The first character in a file",
      "The first command-line argument",
      "The first field on the current line",
      "The first line in the file"
    ],
    answer: 2
  },
  {
    q: "What does `awk -F: '{print $1}' /etc/passwd` print?",
    options: [
      "Usernames",
      "Passwords",
      "Home directories",
      "Shells"
    ],
    answer: 0
  },
  {
    q: "Which command sorts the lines of file.txt in reverse order?",
    options: [
      "sort file.txt",
      "rsort file.txt",
      "sort -r file.txt",
      "sort -reverse file.txt"
    ],
    answer: 2
  },
  {
    q: "Which utility removes only consecutive duplicate lines from input?",
    options: [
      "uniq",
      "sort",
      "cut",
      "wc"
    ],
    answer: 0
  },
  {
    q: "To ensure uniq can remove all duplicates regardless of their position, you usually:",
    options: [
      "Use uniq -a",
      "Use sort first, then pipe to uniq",
      "Use uniq -g",
      "Use wc -u"
    ],
    answer: 1
  },
  {
    q: "Which command sorts and removes duplicates in a single step?",
    options: [
      "sort -d",
      "sort -u",
      "uniq -s",
      "sort -r"
    ],
    answer: 1
  },
  {
    q: "What is the primary purpose of the `paste` command?",
    options: [
      "Join files by a common field",
      "Merge lines from files side by side",
      "Split a large file",
      "Encrypt text"
    ],
    answer: 1
  },
  {
    q: "The `join` command typically:",
    options: [
      "Merges files by matching lines with the same first field",
      "Concatenates files verbatim",
      "Compares files byte by byte",
      "Counts lines common to two files"
    ],
    answer: 0
  },
  {
    q: "What does the `split` command do by default?",
    options: [
      "Splits a file into 100-line segments",
      "Splits a file into 1000-line segments",
      "Splits a file into equal byte chunks",
      "Splits a file into words"
    ],
    answer: 1
  },
  {
    q: "Which of the following is a valid basic regular expression meta-character?",
    options: [
      "&",
      "%",
      ".",
      "#"
    ],
    answer: 2
  },
  {
    q: "In a regular expression, the symbol `^` usually means:",
    options: [
      "Match end of line",
      "Match beginning of line",
      "Match any character",
      "Repeat previous 0 or more times"
    ],
    answer: 1
  },
  {
    q: "In a regular expression, the symbol `$` usually means:",
    options: [
      "End of line",
      "Beginning of line",
      "Start of file",
      "End of file"
    ],
    answer: 0
  },
  {
    q: "The `*` character in a regular expression usually means:",
    options: [
      "Match zero or more repetitions of the previous item",
      "Multiply numbers",
      "Match exactly one character",
      "Ignore the previous token"
    ],
    answer: 0
  },
  {
    q: "Which command counts the number of lines in a file?",
    options: [
      "ccount file.txt",
      "wc -l file.txt",
      "lines file.txt",
      "count -l file.txt"
    ],
    answer: 1
  },
  {
    q: "The command `wc -w` shows:",
    options: [
      "Number of words",
      "Number of lines",
      "Number of bytes",
      "Number of characters in each word"
    ],
    answer: 0
  },
  {
    q: "Which command extracts selected columns from a text file?",
    options: [
      "cut",
      "join",
      "uniq",
      "tr"
    ],
    answer: 0
  },
  {
    q: "In `cut -d ',' -f 2,3 file.csv`, what does `-d ','` specify?",
    options: [
      "The decimal separator",
      "The output format",
      "The field delimiter is a comma",
      "The file encoding"
    ],
    answer: 2
  },
  {
    q: "What is the purpose of the `tr` command?",
    options: [
      "Translate or delete characters",
      "Translate network packets",
      "Trace system calls",
      "Track resource usage"
    ],
    answer: 0
  },
  {
    q: "Which `tr` example converts lowercase to uppercase?",
    options: [
      "tr 'A-Z' 'a-z'",
      "tr 'a-z' 'A-Z'",
      "tr [:upper:] [:lower:]",
      "tr '0-9' 'A-Z'"
    ],
    answer: 1
  },
  {
    q: "What does `tr -d '0-9'` do to its input?",
    options: [
      "Deletes all digits",
      "Deletes all non-digits",
      "Replaces digits with spaces",
      "Counts digits"
    ],
    answer: 0
  },
  {
    q: "What does the `tee` command do?",
    options: [
      "Redirects output to a file only",
      "Displays output and also writes it to a file",
      "Splits a file into two",
      "Edits text interactively"
    ],
    answer: 1
  },
  {
    q: "The pipeline `ls -l | tee files.txt` will:",
    options: [
      "Only save output to files.txt",
      "Only display output on the terminal",
      "Save and display the output at the same time",
      "Delete files.txt"
    ],
    answer: 2
  },
  {
    q: "Which command shows compressed file content page by page?",
    options: [
      "zless file.gz",
      "less file.gz -z",
      "gzip -l file.gz",
      "zcat -p file.gz"
    ],
    answer: 0
  },
  {
    q: "The command `zgrep -i hello file.gz` will:",
    options: [
      "Search case-sensitively inside file.gz",
      "Search case-insensitively inside the compressed file",
      "Uncompress file.gz and remove it",
      "List compression ratio of file.gz"
    ],
    answer: 1
  },
  {
    q: "Which tool is best for comparing two compressed text files?",
    options: [
      "zcmp",
      "zdiff",
      "zgrep",
      "zjoin"
    ],
    answer: 1
  },
  {
    q: "Running `awk '{print $0}' file` will:",
    options: [
      "Print only the first field",
      "Print entire lines of the file",
      "Print the last field",
      "Delete empty lines"
    ],
    answer: 1
  },
  {
    q: "What does `$0` mean in awk?",
    options: [
      "The first argument to awk",
      "The number of fields",
      "The entire current input line",
      "The first word on the command line"
    ],
    answer: 2
  },
  {
    q: "Which command is best suited to join two files by a shared key?",
    options: [
      "paste",
      "join",
      "uniq",
      "head"
    ],
    answer: 1
  },
  {
    q: "What does `grep -C 3 pattern file` show?",
    options: [
      "Only the line numbers with matches",
      "Three context lines before and after each match",
      "The first three matches only",
      "Matches except the first three"
    ],
    answer: 1
  },
  {
    q: "In a regular expression, the pattern `[0-9]` matches:",
    options: [
      "Any letter",
      "Any digit from 0 through 9",
      "Only the number 9",
      "Digits 1 through 8 only"
    ],
    answer: 1
  },
  {
    q: "Which command would you use to see both hexadecimal and ASCII output of a binary file?",
    options: [
      "strings file",
      "xxd file",
      "grep file",
      "head file"
    ],
    answer: 1
  },
  {
    q: "The command `head -n 20 data.txt` is equivalent to:",
    options: [
      "head -c 20 data.txt",
      "head -20 data.txt",
      "tail -n 20 data.txt",
      "less data.txt 20"
    ],
    answer: 1
  },
  {
    q: "Which redirection operator overwrites an existing file?",
    options: [
      ">>",
      "<<<",
      "<>",
      ">"
    ],
    answer: 3
  },
  {
    q: "Which redirection operator appends to an existing file?",
    options: [
      ">",
      ">>",
      "<",
      "|"
    ],
    answer: 1
  },
  {
    q: "What is the effect of `cat file1 file2 > all.txt`?",
    options: [
      "Appends file1 and file2 to all.txt",
      "Overwrites all.txt with file1 and file2 content",
      "Deletes file1 and file2",
      "Copies all.txt into file1 and file2"
    ],
    answer: 1
  },
  {
    q: "Which of the following pipelines makes sense to count distinct sorted values?",
    options: [
      "sort data.txt | wc -l",
      "sort data.txt | uniq | wc -l",
      "uniq data.txt | wc -l",
      "wc -u data.txt"
    ],
    answer: 1
  },
  {
    q: "What does `grep -r pattern dir/` do?",
    options: [
      "Searches only files named pattern",
      "Recursively searches for pattern in dir/ and subdirectories",
      "Removes files that contain pattern",
      "Renames files matching pattern"
    ],
    answer: 1
  },
  {
    q: "If you want to view a compressed file without manually gunzipping it, which command can you use?",
    options: [
      "gunzip -v file.gz",
      "zless file.gz",
      "zip -d file.gz",
      "tar cf file.gz"
    ],
    answer: 1
  },
  {
    q: "What is the main difference between `less` and `cat`?",
    options: [
      "less edits the file, cat does not",
      "less pages through output, cat prints everything at once",
      "cat sorts the file, less does not",
      "cat compresses the file, less expands it"
    ],
    answer: 1
  },
  {
    q: "Which command prints the last 15 lines of logs.txt?",
    options: [
      "tail -n 15 logs.txt",
      "tail -c 15 logs.txt",
      "head -n 15 logs.txt",
      "less -15 logs.txt"
    ],
    answer: 0
  },
  {
    q: "What is a typical use of the `strings` command?",
    options: [
      "To list open files",
      "To find readable text inside executables or binary files",
      "To sort lines alphabetically",
      "To compress text files"
    ],
    answer: 1
  },
  {
    q: "Which command pair is most suitable to check how many times each line occurs in a file?",
    options: [
      "wc then cat",
      "head then tail",
      "sort then uniq -c",
      "grep then wc -l"
    ],
    answer: 2
  },
  {
    q: "What does the pattern `.*` usually match in a regular expression?",
    options: [
      "Nothing at all",
      "Exactly one character",
      "Any sequence of characters, including empty",
      "Only digits"
    ],
    answer: 2
  },
  {
    q: "Which is true about `awk`?",
    options: [
      "It cannot use regular expressions",
      "It is only used for binary data",
      "It is an interpreted programming language for text processing",
      "It only works on CSV files"
    ],
    answer: 2
  },
  {
    q: "What does `cut -c 1-5 file.txt` output?",
    options: [
      "The first 5 fields from each line",
      "The 5th character from each line",
      "Characters 1 through 5 from each line",
      "The first 5 lines of the file"
    ],
    answer: 2
  },
  {
    q: "Which option of `uniq` shows how many times each line occurred?",
    options: [
      "uniq -n",
      "uniq -l",
      "uniq -c",
      "uniq -k"
    ],
    answer: 2
  },
  {
    q: "What does `paste file1 file2` typically do?",
    options: [
      "Merges lines from file1 and file2 side by side with a tab",
      "Appends file2 at the end of file1",
      "Joins file1 and file2 on identical fields",
      "Splits file1 into file2"
    ],
    answer: 0
  },
  {
    q: "Which command can you use to see line, word, and byte counts of multiple files?",
    options: [
      "wordcount",
      "wc",
      "count -a",
      "ls -wc"
    ],
    answer: 1
  },
  {
    q: "The command `grep '^#' config.txt` matches:",
    options: [
      "Lines ending with #",
      "Lines beginning with #",
      "Lines containing at least one # anywhere",
      "Lines with exactly one #"
    ],
    answer: 1
  },
  {
    q: "The command `grep 'foo$' data.txt` matches lines:",
    options: [
      "Starting with foo",
      "Containing foo anywhere",
      "Ending with foo",
      "Not containing foo"
    ],
    answer: 2
  },
  {
    q: "Which command would convert spaces to tabs in text streamed from stdin?",
    options: [
      "tr '\\t' ' '",
      "tr ' ' '\\t'",
      "cut ' ' '\\t'",
      "paste ' ' '\\t'"
    ],
    answer: 1
  },
  {
    q: "Which statement about `sed` is true?",
    options: [
      "It is a line editor that works on streams of text",
      "It can only edit files stored on disk",
      "It always opens a full-screen interface",
      "It is only for binary data"
    ],
    answer: 0
  },
  {
    q: "What does `tail -f /var/log/syslog` help you do?",
    options: [
      "Edit the log file interactively",
      "Monitor new log entries as they are written",
      "Sort syslog entries by time",
      "Search for errors only"
    ],
    answer: 1
  },
  {
    q: "Which tool is part of the standard text utilities used heavily in shell scripting?",
    options: [
      "sed",
      "awk",
      "grep",
      "All of the above"
    ],
    answer: 3
  },
  {
    q: "If you want to see only lines 5 to 10 of a file, which tool combination is reasonable?",
    options: [
      "head -n 10 file | tail -n 6",
      "tail -n 10 file | head -n 6",
      "grep 5-10 file",
      "cut 5-10 file"
    ],
    answer: 0
  },
  {
    q: "What does the `-s` option do in `tr -s`?",
    options: [
      "Shows statistics",
      "Skips spaces",
      "Squashes repeated instances of characters",
      "Sorts output alphabetically"
    ],
    answer: 2
  },
  {
    q: "In a regular expression, the pattern `[A-Za-z]` matches:",
    options: [
      "Any uppercase letter only",
      "Any lowercase letter only",
      "Any letter, uppercase or lowercase",
      "Any digit"
    ],
    answer: 2
  },
  {
    q: "Which command would you use to convert all tabs to spaces in a file?",
    options: [
      "tr '\\t' ' ' < file",
      "cut '\\t' ' ' file",
      "grep '\\t' ' ' file",
      "uniq '\\t' ' ' file"
    ],
    answer: 0
  },
  {
    q: "What is one key difference between `awk` and `sed`?",
    options: [
      "awk is mainly for filtering and reporting based on fields; sed is mainly for editing streams",
      "sed can use regular expressions; awk cannot",
      "awk can edit files in place; sed cannot",
      "sed is interactive, awk is not"
    ],
    answer: 0
  },
  {
    q: "The shell pipeline character `|` is used to:",
    options: [
      "Concatenate two files",
      "Send the output of one command as the input to another",
      "Redirect output to a file",
      "Run commands in parallel"
    ],
    answer: 1
  },
  {
    q: "Which command shows only lines that do not match a pattern when using grep?",
    options: [
      "grep -n",
      "grep -v",
      "grep -r",
      "grep -x"
    ],
    answer: 1
  },
  {
    q: "What does `awk -F',' '{print $2}' file.csv` print?",
    options: [
      "The second line of the file",
      "The second character of each line",
      "The second comma-separated field of each line",
      "The last field of each line"
    ],
    answer: 2
  },
  {
    q: "Which command pair could you use to see the 10 largest files in the current directory by size?",
    options: [
      "ls -l | head",
      "ls -l | sort -k 5 -n | tail -n 10",
      "wc -l | tail -n 10",
      "grep size | head -n 10"
    ],
    answer: 1
  },
  {
    q: "Which statement best describes a regular expression?",
    options: [
      "A command that edits binary files",
      "A pattern that describes a set of strings",
      "A shell built-in for looping",
      "A compression algorithm"
    ],
    answer: 1
  },
  {
    q: "What is the typical default field separator in awk?",
    options: [
      "Comma",
      "Tab only",
      "Any whitespace",
      "Colon"
    ],
    answer: 2
  },
  {
    q: "Which of the following will safely show a long file one page at a time?",
    options: [
      "cat bigfile",
      "less bigfile",
      "wc bigfile",
      "echo bigfile"
    ],
    answer: 1
  },
  {
    q: "What does `grep '^[A-Z]' file` match?",
    options: [
      "Lines that contain at least one uppercase letter",
      "Lines that begin with an uppercase letter",
      "Lines that end with an uppercase letter",
      "Lines that contain no uppercase letters"
    ],
    answer: 1
  },
  {
    q: "Which command prints each distinct line from input along with how many times it appeared?",
    options: [
      "wc -u",
      "sort | uniq -c",
      "uniq -u",
      "grep -c"
    ],
    answer: 1
  },
  {
    q: "What does `grep -E` enable?",
    options: [
      "Encrypted search",
      "Extended regular expressions",
      "Environment variable expansion",
      "Exact matching only"
    ],
    answer: 1
  },
  {
    q: "Which command shows both hidden and non-hidden files in the current directory?",
    options: [
      "ls -a",
      "ls -l",
      "ls -h",
      "ls -R"
    ],
    answer: 0
  },
  {
    q: "Which pipeline would you use to count how many lines in file.txt contain the word 'error'?",
    options: [
      "wc -l error file.txt",
      "grep error file.txt | wc -l",
      "head -n error file.txt",
      "cut -d error file.txt"
    ],
    answer: 1
  },
  {
    q: "What does the `-c` option generally mean in `tr -cd [:print:]`?",
    options: [
      "Convert to lowercase",
      "Complement the set (use all except these)",
      "Count occurrences",
      "Copy without changes"
    ],
    answer: 1
  },
  {
    q: "Which Linux utility is most specialized for counting lines, words, and bytes?",
    options: [
      "wc",
      "grep",
      "sed",
      "awk"
    ],
    answer: 0
  },
  {
    q: "What is the main effect of adding `g` at the end of a sed substitution?",
    options: [
      "Apply the change to every file",
      "Apply the change only once per file",
      "Apply the change to every match in each line",
      "Apply the change only if the line is global"
    ],
    answer: 2
  },
  {
    q: "Which command can remove all empty lines from a file?",
    options: [
      "grep -v '^$' file",
      "awk 'NF > 0' file",
      "sed '/^$/d' file",
      "All of the above"
    ],
    answer: 3
  }
];

/* ---------- Terminal quiz logic ---------- */

let currentTaskIndex = 0;

function normalizeCommand(cmd) {
  return cmd.trim().replace(/\s+/g, " ");
}

function loadTask() {
  const task = terminalTasks[currentTaskIndex];
  const taskText = document.getElementById("task-text");
  const taskProgress = document.getElementById("task-progress");
  const input = document.getElementById("terminal-input");
  const feedback = document.getElementById("terminal-feedback");

  taskText.textContent = task.description;
  taskProgress.textContent = `Task ${currentTaskIndex + 1} of ${terminalTasks.length}`;
  input.value = "";
  feedback.textContent = "";
  feedback.className = "feedback neutral";
}

function appendTerminalLine(text) {
  const out = document.getElementById("terminal-output");
  const div = document.createElement("div");
  div.className = "terminal-line";
  div.textContent = text;
  out.appendChild(div);
  out.scrollTop = out.scrollHeight;
}

function checkTerminalCommand() {
  const input = document.getElementById("terminal-input");
  const feedback = document.getElementById("terminal-feedback");
  const userCmd = normalizeCommand(input.value);
  const task = terminalTasks[currentTaskIndex];

  if (!userCmd) {
    feedback.textContent = "Type a command first.";
    feedback.className = "feedback neutral";
    return;
  }

  appendTerminalLine(`student@linux:~$ ${userCmd}`);

  const isCorrect = task.answers.some(a => normalizeCommand(a) === userCmd);

  if (isCorrect) {
    feedback.textContent = "Correct! Moving to the next task.";
    feedback.className = "feedback correct";
    currentTaskIndex = (currentTaskIndex + 1) % terminalTasks.length;
    setTimeout(loadTask, 900);
  } else {
    feedback.textContent = "Not quite. Think about the exact tool and options needed.";
    feedback.className = "feedback incorrect";
  }
}

function skipTerminalTask() {
  const feedback = document.getElementById("terminal-feedback");
  feedback.textContent = "Task skipped. Try the next one!";
  feedback.className = "feedback neutral";
  currentTaskIndex = (currentTaskIndex + 1) % terminalTasks.length;
  loadTask();
}

/* ---------- MCQ quiz logic ---------- */

let mcqIndex = 0;
let mcqScore = 0;
let mcqAnswered = 0;

function renderMCQ() {
  const qObj = mcqQuestions[mcqIndex];
  const questionEl = document.getElementById("mcq-question");
  const optionsEl = document.getElementById("mcq-options");
  const counterEl = document.getElementById("mcq-counter");
  const scoreEl = document.getElementById("mcq-score");
  const feedback = document.getElementById("mcq-feedback");

  questionEl.textContent = qObj.q;
  counterEl.textContent = `Question ${mcqIndex + 1} of ${mcqQuestions.length}`;
  scoreEl.textContent = `Score: ${mcqScore} / ${mcqAnswered}`;
  feedback.textContent = "";
  feedback.className = "feedback neutral";

  optionsEl.innerHTML = "";
  qObj.options.forEach((opt, idx) => {
    const li = document.createElement("li");
    const btn = document.createElement("button");
    btn.textContent = opt;
    btn.className = "mcq-option-btn";
    btn.addEventListener("click", () => handleMCQAnswer(idx, btn));
    li.appendChild(btn);
    optionsEl.appendChild(li);
  });
}

function handleMCQAnswer(selectedIndex, buttonEl) {
  const qObj = mcqQuestions[mcqIndex];
  const feedback = document.getElementById("mcq-feedback");
  const scoreEl = document.getElementById("mcq-score");
  const optionButtons = document.querySelectorAll(".mcq-option-btn");

  // Prevent multiple answers
  if (Array.from(optionButtons).some(btn => btn.classList.contains("correct") || btn.classList.contains("incorrect"))) {
    return;
  }

  mcqAnswered += 1;

  if (selectedIndex === qObj.answer) {
    mcqScore += 1;
    feedback.textContent = "Nice! That's correct.";
    feedback.className = "feedback correct";
    buttonEl.classList.add("correct");
  } else {
    feedback.textContent = "Not quite. Review the related command and try similar questions.";
    feedback.className = "feedback incorrect";
    buttonEl.classList.add("incorrect");
    // Highlight correct one
    optionButtons[qObj.answer].classList.add("correct");
  }

  scoreEl.textContent = `Score: ${mcqScore} / ${mcqAnswered}`;
}

function nextMCQ() {
  mcqIndex = (mcqIndex + 1) % mcqQuestions.length;
  renderMCQ();
}

function restartMCQ() {
  mcqIndex = 0;
  mcqScore = 0;
  mcqAnswered = 0;
  renderMCQ();
}

/* ---------- Chatbot logic (hint-only) ---------- */

const genericHints = [
  "Break the problem into smaller parts and focus on one step at a time.",
  "Think about which command-line tool is designed exactly for this type of job.",
  "Check the manual page (man) or --help output of the command you are considering.",
  "Ask yourself: do I need to view, search, transform, or summarize the text?",
  "Consider building a pipeline using the | operator so that each tool does a simple task.",
  "If it involves fields or columns, awk or cut might be the tools you want.",
  "For search problems, grep is often the first thing to reach for.",
  "For substitutions across text, sed is usually a strong candidate.",
  "When you need aggregate counts or simple arithmetic on fields, awk can help.",
  "Try the command with a small test file before running it on important data."
];

const keywordHints = [
  {
    keywords: ["sed", "replace", "substitute"],
    hint: "Think about sed's substitution syntax: it uses s/old/new/ with optional flags like g."
  },
  {
    keywords: ["awk", "field", "column"],
    hint: "awk treats each line as a record and splits it into fields like $1, $2, etc. The -F option controls the separator."
  },
  {
    keywords: ["grep", "search", "pattern"],
    hint: "Focus on what pattern you want to match and whether you need regular expressions or simple literal text."
  },
  {
    keywords: ["sort"],
    hint: "sort can order lines alphabetically or numerically, and options like -r and -k control direction and key fields."
  },
  {
    keywords: ["uniq"],
    hint: "uniq only removes consecutive duplicates, so it often works best after sort."
  },
  {
    keywords: ["tr"],
    hint: "tr reads from standard input and maps characters from one set to another, or deletes them with -d."
  },
  {
    keywords: ["wc"],
    hint: "Remember the flags: -l for lines, -w for words, and -c for bytes."
  },
  {
    keywords: ["cut"],
    hint: "cut can use -d to set the delimiter and -f to choose which fields you want."
  },
  {
    keywords: ["pipe", "|"],
    hint: "Pipes connect commands so that the output of one becomes the input of the next, letting each tool stay simple."
  }
];

// Question-specific hints (MCQ)
function getQuestionSpecificHint(qNumber) {
  switch (qNumber) {
    case 9:
      return "For question 9, think about the grep option that inverts the match so you only see lines that do NOT contain a certain word.";
    default:
      return "For that question, reread what it is really asking: is it about viewing, searching, substituting, or counting? Match the question to the command that is built for that job.";
  }
}

// Terminal-task-specific hints (mix of light & medium)
function getTerminalTaskHint(tNumber) {
  switch (tNumber) {
    case 1:
      return "Task 1: You want to read notes.txt comfortably, not dump it all at once. Think of the pager commands that show a screenful at a time.";
    case 2:
      return "Task 2: Use the classic command that prints only the first N lines of a file; here N is 5.";
    case 3:
      return "Task 3: Combine the command that shows the tail of a file with the option that keeps watching for new lines as a log grows.";
    case 4:
      return "Task 4: This is a substitution job. Use sed's s/old/new/ syntax with a flag that affects every match on each line, and target the words 'error' and 'warning'.";
    case 5:
      return "Task 5: Same sed substitution idea as task 4, but this time redirect the output into a new file instead of just printing it.";
    case 6:
      return "Task 6: Since you're pulling just the first colon-separated field from /etc/passwd, think of awk with -F set to ':' and printing $1.";
    case 7:
      return "Task 7: You need all lines containing FAILED but ignoring case. Combine grep with the flag that turns off case sensitivity.";
    case 8:
      return "Task 8: First you need the list in sorted order, and then you must remove duplicates. There is a one-command version, and also a pipeline using sort then uniq.";
    case 9:
      return "Task 9: This is about excluding lines that contain a word. grep has an option that inverts the match so only non-matching lines appear.";
    case 10:
      return "Task 10: Think of the character-translation tool that can map 'a-z' to 'A-Z', reading from input.txt via redirection or a pipe.";
    case 11:
      return "Task 11: You have comma-separated data. Use the column-extraction tool with -d ',' and select only the 2nd and 3rd fields.";
    case 12:
      return "Task 12: You want to combine two files based on the same first field. That's exactly what the join utility is designed for.";
    case 13:
      return "Task 13: When you need to see human-readable snippets inside a binary, use the tool that prints all printable strings from a file.";
    case 14:
      return "Task 14: This is a sed substitution that should permanently update accounts.txt. Think about adding the option that edits the file in place.";
    case 15:
      return "Task 15: There is a utility that splits a file based on line counts; give it an option to use 500 lines per output chunk.";
    default:
      return "For that task, ask what kind of job it is: viewing, searching, substituting, joining, or splitting. Then pick the core text tool that matches.";
  }
}

function getHintForMessage(msg) {
  const lower = msg.toLowerCase();

  // Detect references like "q9", "Q 9", "question 9" (case-insensitive)
  const qMatch = lower.match(/(?:q\s*|question\s*)(\d{1,3})/);
  if (qMatch) {
    const qNumber = parseInt(qMatch[1], 10);
    if (!Number.isNaN(qNumber) && qNumber >= 1 && qNumber <= mcqQuestions.length) {
      return getQuestionSpecificHint(qNumber);
    }
  }

  // Detect terminal task references like "task 3", "terminal 3", "t3", "t 3"
  let tNumber = null;
  const taskMatch = lower.match(/(?:task|problem|terminal)\s*(\d{1,2})/);
  const tShortMatch = lower.match(/\bt\s*(\d{1,2})\b/);

  if (taskMatch) {
    tNumber = parseInt(taskMatch[1], 10);
  } else if (tShortMatch) {
    tNumber = parseInt(tShortMatch[1], 10);
  }

  if (!Number.isNaN(tNumber) && tNumber >= 1 && tNumber <= terminalTasks.length) {
    return getTerminalTaskHint(tNumber);
  }

  // Keyword-based hints (case-insensitive)
  for (const entry of keywordHints) {
    if (entry.keywords.some(k => lower.includes(k))) {
      return entry.hint + " Try to write the command yourself based on that idea.";
    }
  }

  // Fallback generic hint
  const randomGeneric = genericHints[Math.floor(Math.random() * genericHints.length)];
  return randomGeneric + " Use the quiz sections to test your idea after you guess.";
}

function sendChatMessage() {
  const input = document.getElementById("chat-input");
  const chatWindow = document.getElementById("chat-window");
  const text = input.value.trim();
  if (!text) return;

  // user message
  const userDiv = document.createElement("div");
  userDiv.className = "user message";
  userDiv.innerHTML = `<p><strong>You:</strong> ${text}</p>`;
  chatWindow.appendChild(userDiv);

  // bot hint
  const hintText = getHintForMessage(text);
  const botDiv = document.createElement("div");
  botDiv.className = "bot message";
  botDiv.innerHTML = `<p><strong>Bot:</strong> ${hintText}</p>`;
  chatWindow.appendChild(botDiv);

  chatWindow.scrollTop = chatWindow.scrollHeight;
  input.value = "";
}

/* ---------- Tab switching ---------- */

function setupTabs() {
  const buttons = document.querySelectorAll(".tab-button");
  const sections = document.querySelectorAll(".tab-section");

  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      buttons.forEach(b => b.classList.remove("active"));
      sections.forEach(s => s.classList.remove("active"));

      btn.classList.add("active");
      const target = document.getElementById(btn.dataset.target);
      if (target) target.classList.add("active");
    });
  });
}

/* ---------- Init ---------- */

window.addEventListener("DOMContentLoaded", () => {
  setupTabs();

  // Terminal quiz
  document.getElementById("submit-command").addEventListener("click", checkTerminalCommand);
  document.getElementById("skip-command").addEventListener("click", skipTerminalTask);
  document.getElementById("terminal-input").addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      checkTerminalCommand();
    }
  });
  loadTask();

  // MCQ quiz
  document.getElementById("next-question").addEventListener("click", nextMCQ);
  document.getElementById("restart-quiz").addEventListener("click", restartMCQ);
  renderMCQ();

  // Chatbot
  document.getElementById("chat-send").addEventListener("click", sendChatMessage);
  document.getElementById("chat-input").addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendChatMessage();
    }
  });
});
