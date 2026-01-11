## 2024-08-01 - Command Injection in ytdlpService.js
**Vulnerability:** Critical command injection vulnerability in `ytdlpService.js`. User-controlled input (e.g., `videoId`, `query`, `playlistId`) is directly concatenated into a shell command executed by `child_process.exec`.
**Learning:** The service did not sanitize or validate input from `musicController.js`, trusting it implicitly. The lack of parameterized queries or a safer execution method for external commands created this vulnerability.
**Prevention:** Always use safer alternatives like `child_process.execFile` or `spawn` with an array of arguments, which prevents shell interpretation of user input. All user-provided input for commands must be strictly validated and sanitized.
