const dom = {
    repoForm: document.getElementById("repo-form"),
    repoInput: document.getElementById("repo-url"),
    exploreButton: document.getElementById("explore-button"),
    globalLoader: document.getElementById("global-loader"),
    statusPill: document.getElementById("status-pill"),
    progressBar: document.getElementById("progress-bar"),
    repoInfo: document.getElementById("repo-info"),
    repoName: document.getElementById("repo-name-display"),
    repoDesc: document.getElementById("repo-desc"),
    repoStars: document.getElementById("repo-stars"),
    repoForks: document.getElementById("repo-forks"),
    repoUpdated: document.getElementById("repo-updated"),
    repoLanguagePill: document.getElementById("repo-language-pill"),
    treeHeader: document.getElementById("tree-header"),
    branchName: document.getElementById("branch-name"),
    fileTree: document.getElementById("file-tree"),
    errorAlert: document.getElementById("error-alert"),
    errorMsg: document.getElementById("error-msg"),
    dismissError: document.getElementById("dismiss-error"),
    welcomeState: document.getElementById("welcome-state"),
    workspaceSurface: document.getElementById("workspace-surface"),
    tabReadme: document.getElementById("tab-readme"),
    tabViewer: document.getElementById("tab-viewer"),
    tabAskAi: document.getElementById("tab-ask-ai"),
    contentLoader: document.getElementById("content-loader"),
    panelReadme: document.getElementById("panel-readme"),
    panelViewer: document.getElementById("panel-viewer"),
    panelAskAi: document.getElementById("panel-ask-ai"),
    readmeContent: document.getElementById("readme-content"),
    viewerFilename: document.getElementById("viewer-filename"),
    viewerSize: document.getElementById("viewer-size"),
    viewerRawLink: document.getElementById("viewer-raw-link"),
    imageViewer: document.getElementById("image-viewer"),
    viewerImage: document.getElementById("viewer-image"),
    codeViewer: document.getElementById("code-viewer"),
    codeContent: document.getElementById("code-content"),
    chatMessages: document.getElementById("chat-messages"),
    chatForm: document.getElementById("chat-form"),
    chatInput: document.getElementById("chat-input"),
    promptChips: Array.from(document.querySelectorAll(".prompt-chip")),
    exampleChips: Array.from(document.querySelectorAll(".example-chip")),
};

const state = {
    owner: "",
    repo: "",
    branch: "",
    repoMeta: null,
    flatTree: [],
    readmeText: "",
    selectedTreeButton: null,
};

const IMAGE_EXTENSIONS = new Set(["png", "jpg", "jpeg", "gif", "svg", "webp", "bmp", "ico", "avif"]);
const LANGUAGE_MAP = {
    js: "javascript",
    jsx: "javascript",
    ts: "typescript",
    tsx: "typescript",
    py: "python",
    rb: "ruby",
    rs: "rust",
    ps1: "powershell",
    yml: "yaml",
};

if (window.marked) {
    marked.use({
        gfm: true,
        breaks: false,
        headerIds: false,
        mangle: false,
    });
}

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

function sanitizeRenderedHtml(html) {
    const template = document.createElement("template");
    template.innerHTML = html;

    template.content.querySelectorAll("script, iframe, object, embed, link, meta, style").forEach((node) => node.remove());

    template.content.querySelectorAll("*").forEach((node) => {
        for (const attr of Array.from(node.attributes)) {
            const name = attr.name.toLowerCase();
            const value = attr.value.trim();
            const isEventHandler = name.startsWith("on");
            const isUnsafeLink = (name === "href" || name === "src") && /^javascript:/i.test(value);

            if (isEventHandler || isUnsafeLink) {
                node.removeAttribute(attr.name);
            }
        }

        if (node.tagName === "A") {
            node.setAttribute("target", "_blank");
            node.setAttribute("rel", "noreferrer noopener");
        }
    });

    return template.innerHTML;
}

function formatDate(dateString) {
    try {
        return new Intl.DateTimeFormat("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        }).format(new Date(dateString));
    } catch (error) {
        return "-";
    }
}

function formatBytes(bytes) {
    if (!bytes) {
        return "0 B";
    }

    const units = ["B", "KB", "MB", "GB"];
    const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
    const value = bytes / (1024 ** index);
    return `${value.toFixed(value >= 10 || index === 0 ? 0 : 1)} ${units[index]}`;
}

function formatNumber(value) {
    return new Intl.NumberFormat("en-US").format(value || 0);
}

function getExtension(name) {
    const dotIndex = name.lastIndexOf(".");
    return dotIndex === -1 ? "" : name.slice(dotIndex + 1).toLowerCase();
}

function isImageFile(name) {
    return IMAGE_EXTENSIONS.has(getExtension(name));
}

function buildApiUrl(pathname) {
    return `https://api.github.com${pathname}`;
}

function encodePath(path) {
    return path
        .split("/")
        .map((segment) => encodeURIComponent(segment))
        .join("/");
}

function parseRepoInput(value) {
    let input = value.trim();

    if (!input) {
        throw new Error("Enter a GitHub repository URL or owner/repo.");
    }

    if (!/^https?:\/\//i.test(input)) {
        input = input.replace(/^github\.com\//i, "");
        input = `https://github.com/${input}`;
    }

    const url = new URL(input);

    if (!["github.com", "www.github.com"].includes(url.hostname)) {
        throw new Error("Use a valid GitHub repository URL.");
    }

    const parts = url.pathname.replace(/\.git$/i, "").split("/").filter(Boolean);

    if (parts.length < 2) {
        throw new Error("Repository input must include both owner and repo.");
    }

    return {
        owner: parts[0],
        repo: parts[1],
    };
}

function setStatus(message, tone = "default") {
    dom.statusPill.textContent = message;
    dom.statusPill.classList.remove("is-busy", "is-success", "is-danger");

    if (tone === "busy") {
        dom.statusPill.classList.add("is-busy");
    } else if (tone === "success") {
        dom.statusPill.classList.add("is-success");
    } else if (tone === "danger") {
        dom.statusPill.classList.add("is-danger");
    }
}

function setGlobalLoading(isLoading) {
    dom.globalLoader.classList.toggle("is-hidden", !isLoading);
    dom.exploreButton.disabled = isLoading;
    dom.exploreButton.textContent = isLoading ? "Inspecting..." : "Inspect Repo";
}

function setContentLoading(isLoading) {
    dom.contentLoader.classList.toggle("is-hidden", !isLoading);
}

function startProgress() {
    dom.progressBar.style.opacity = "1";
    dom.progressBar.style.width = "18%";
}

function updateProgress(value) {
    dom.progressBar.style.opacity = "1";
    dom.progressBar.style.width = `${Math.max(0, Math.min(100, value))}%`;
}

function completeProgress() {
    dom.progressBar.style.width = "100%";
    setTimeout(() => {
        dom.progressBar.style.opacity = "0";
        dom.progressBar.style.width = "0";
    }, 260);
}

function showError(message) {
    dom.errorMsg.textContent = message;
    dom.errorAlert.classList.remove("is-hidden");
    setStatus("Needs attention", "danger");
}

function hideError() {
    dom.errorAlert.classList.add("is-hidden");
}

function emptyTreeState(title, message) {
    dom.fileTree.innerHTML = `
        <div class="empty-block">
            <div class="empty-icon"></div>
            <div>
                <h3>${escapeHtml(title)}</h3>
                <p>${escapeHtml(message)}</p>
            </div>
        </div>
    `;
}

function resetWorkspace() {
    document.body.classList.remove("repo-loaded");
    state.owner = "";
    state.repo = "";
    state.branch = "";
    state.repoMeta = null;
    state.flatTree = [];
    state.readmeText = "";
    state.selectedTreeButton = null;

    dom.repoInfo.classList.add("is-hidden");
    dom.treeHeader.classList.add("is-hidden");
    dom.workspaceSurface.classList.add("is-hidden");
    dom.welcomeState.classList.remove("is-hidden");
    dom.tabViewer.classList.add("is-hidden");
    dom.tabAskAi.classList.add("is-hidden");

    dom.readmeContent.innerHTML = "";
    dom.viewerFilename.textContent = "Select a file from the explorer";
    dom.viewerSize.textContent = "";
    dom.viewerRawLink.href = "#";
    dom.viewerImage.removeAttribute("src");
    dom.codeContent.textContent = "";
    dom.imageViewer.classList.add("is-hidden");
    dom.codeViewer.classList.remove("is-hidden");

    dom.chatMessages.innerHTML = `
        <article class="chat-message analyst">
            <div class="chat-badge">AI</div>
            <div class="chat-body">
                <strong>Ask about the repo.</strong>
                <p>
                    I can answer questions about structure, file counts, technologies, README content, test coverage clues,
                    entry points, and common config files using the repository data already loaded in the page.
                </p>
            </div>
        </article>
    `;

    emptyTreeState("No repository loaded", "Paste a GitHub repo above to unlock the file tree and preview panels.");
}

function activateTab(tabName) {
    const pairs = [
        ["readme", dom.tabReadme, dom.panelReadme],
        ["viewer", dom.tabViewer, dom.panelViewer],
        ["analyst", dom.tabAskAi, dom.panelAskAi],
    ];

    for (const [name, button, panel] of pairs) {
        const active = name === tabName;
        button.classList.toggle("is-active", active);
        panel.classList.toggle("is-hidden", !active);
    }
}

function renderRepoMeta(repoData) {
    dom.repoName.textContent = repoData.full_name;
    dom.repoDesc.textContent = repoData.description || "No description provided for this repository.";
    dom.repoStars.textContent = formatNumber(repoData.stargazers_count);
    dom.repoForks.textContent = formatNumber(repoData.forks_count);
    dom.repoUpdated.textContent = formatDate(repoData.updated_at);
    dom.repoLanguagePill.textContent = repoData.language || "Mixed";
    dom.branchName.textContent = state.branch;

    dom.repoInfo.classList.remove("is-hidden");
    dom.treeHeader.classList.remove("is-hidden");
}

async function fetchJson(url, fallbackMessage) {
    const response = await fetch(url, {
        headers: {
            Accept: "application/vnd.github+json",
        },
    });

    if (!response.ok) {
        if (response.status === 404) {
            throw new Error("Repository not found or it is private.");
        }

        if (response.status === 403) {
            throw new Error("GitHub API rate limit reached. Try again shortly.");
        }

        throw new Error(fallbackMessage || `Request failed with status ${response.status}.`);
    }

    return response.json();
}

function getFileChip(name, type) {
    if (type === "tree") {
        return { label: "DIR", tone: "folder" };
    }

    const ext = getExtension(name);

    if (["js", "jsx", "ts", "tsx", "py", "java", "go", "rb", "rs", "php", "c", "cpp", "cs"].includes(ext)) {
        return { label: ext || "FILE", tone: "script" };
    }

    if (["css", "scss", "sass"].includes(ext)) {
        return { label: ext, tone: "style" };
    }

    if (["md", "txt", "rst"].includes(ext)) {
        return { label: ext || "DOC", tone: "doc" };
    }

    if (["png", "jpg", "jpeg", "svg", "gif", "webp", "ico", "avif"].includes(ext)) {
        return { label: "IMG", tone: "media" };
    }

    if (["json", "yml", "yaml", "xml", "toml", "ini", "lock"].includes(ext)) {
        return { label: ext || "CFG", tone: "data" };
    }

    if (["sh", "bat", "ps1"].includes(ext)) {
        return { label: ext, tone: "shell" };
    }

    return { label: ext ? ext.slice(0, 4) : "FILE", tone: "generic" };
}

function buildVirtualTree(flatTree) {
    const root = { name: "", path: "", type: "tree", children: {} };

    flatTree.forEach((item) => {
        const parts = item.path.split("/");
        let current = root;

        parts.forEach((part, index) => {
            const currentPath = parts.slice(0, index + 1).join("/");

            if (!current.children[part]) {
                current.children[part] = {
                    name: part,
                    path: currentPath,
                    type: index === parts.length - 1 ? item.type : "tree",
                    size: item.size || 0,
                    children: {},
                };
            }

            current = current.children[part];
        });
    });

    return root;
}

function sortTreeNodes(left, right) {
    if (left.type === "tree" && right.type !== "tree") {
        return -1;
    }

    if (left.type !== "tree" && right.type === "tree") {
        return 1;
    }

    return left.name.localeCompare(right.name, undefined, {
        numeric: true,
        sensitivity: "base",
    });
}

function createTreeEntry(node, depth = 0) {
    if (node.type === "tree") {
        const details = document.createElement("details");
        details.className = "tree-group";
        if (depth < 1) {
            details.open = true;
        }

        const summary = document.createElement("summary");
        summary.className = "tree-entry";
        summary.dataset.depth = String(depth);
        summary.style.setProperty("--depth", String(depth));

        const caret = document.createElement("span");
        caret.className = "tree-caret";

        const chip = document.createElement("span");
        chip.className = "node-chip folder";
        chip.textContent = "DIR";

        const label = document.createElement("span");
        label.className = "tree-label";
        label.textContent = node.name;

        summary.append(caret, chip, label);
        details.appendChild(summary);

        Object.values(node.children)
            .sort(sortTreeNodes)
            .forEach((child) => {
                details.appendChild(createTreeEntry(child, depth + 1));
            });

        return details;
    }

    const button = document.createElement("button");
    button.type = "button";
    button.className = "tree-entry tree-file";
    button.dataset.depth = String(depth);
    button.style.setProperty("--depth", String(depth));
    button.dataset.path = node.path;
    button.dataset.name = node.name;
    button.dataset.size = String(node.size || 0);

    const chipMeta = getFileChip(node.name, node.type);

    const spacer = document.createElement("span");
    spacer.className = "tree-caret";
    spacer.style.opacity = "0";

    const chip = document.createElement("span");
    chip.className = `node-chip ${chipMeta.tone}`;
    chip.textContent = chipMeta.label;

    const label = document.createElement("span");
    label.className = "tree-label";
    label.textContent = node.name;

    button.append(spacer, chip, label);
    return button;
}

function renderTree(flatTree) {
    dom.fileTree.innerHTML = "";

    if (!flatTree.length) {
        emptyTreeState("Repository appears empty", "No files were returned for this repository.");
        return;
    }

    const tree = buildVirtualTree(flatTree);
    const fragment = document.createDocumentFragment();

    Object.values(tree.children)
        .sort(sortTreeNodes)
        .forEach((child) => {
            fragment.appendChild(createTreeEntry(child, 0));
        });

    dom.fileTree.appendChild(fragment);
}

async function fetchFileDescriptor(filePath) {
    const url = buildApiUrl(`/repos/${state.owner}/${state.repo}/contents/${encodePath(filePath)}?ref=${encodeURIComponent(state.branch)}`);
    return fetchJson(url, "Unable to fetch file details.");
}

function decodeBase64(content) {
    const binary = atob(content.replace(/\n/g, ""));
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    return new TextDecoder().decode(bytes);
}

async function fetchTextContent(filePath) {
    const descriptor = await fetchFileDescriptor(filePath);

    if (descriptor.encoding === "base64" && descriptor.content) {
        return {
            text: decodeBase64(descriptor.content),
            downloadUrl: descriptor.download_url || "#",
        };
    }

    if (descriptor.download_url) {
        const response = await fetch(descriptor.download_url);
        if (!response.ok) {
            throw new Error("Unable to download file contents.");
        }

        return {
            text: await response.text(),
            downloadUrl: descriptor.download_url,
        };
    }

    throw new Error("This file cannot be rendered in the previewer.");
}

function setActiveTreeFile(button) {
    if (state.selectedTreeButton) {
        state.selectedTreeButton.classList.remove("is-active");
    }

    state.selectedTreeButton = button;
    button.classList.add("is-active");
}

async function openFile(filePath, fileName, fileSize, triggerButton) {
    setActiveTreeFile(triggerButton);
    setContentLoading(true);

    dom.tabViewer.classList.remove("is-hidden");
    dom.viewerFilename.textContent = filePath;
    dom.viewerSize.textContent = fileSize ? formatBytes(fileSize) : "";
    dom.codeContent.className = "";
    dom.codeContent.textContent = "";
    dom.viewerImage.removeAttribute("src");
    dom.viewerRawLink.href = "#";

    activateTab("viewer");

    try {
        if (isImageFile(fileName)) {
            const descriptor = await fetchFileDescriptor(filePath);
            if (!descriptor.download_url) {
                throw new Error("Image preview is not available for this file.");
            }

            dom.viewerRawLink.href = descriptor.download_url;
            dom.codeViewer.classList.add("is-hidden");
            dom.imageViewer.classList.remove("is-hidden");
            dom.viewerImage.src = descriptor.download_url;
            setStatus("Image ready", "success");
            return;
        }

        dom.imageViewer.classList.add("is-hidden");
        dom.codeViewer.classList.remove("is-hidden");

        const { text, downloadUrl } = await fetchTextContent(filePath);
        dom.viewerRawLink.href = downloadUrl;

        if (text.length > 400000) {
            dom.codeContent.textContent = "Preview paused because the file is large. Use the raw link above to inspect it in full.";
            setStatus("Large file opened", "success");
            return;
        }

        dom.codeContent.textContent = text;
        const ext = getExtension(fileName);
        const language = LANGUAGE_MAP[ext] || ext;

        if (window.hljs && language && hljs.getLanguage(language)) {
            dom.codeContent.className = `language-${language}`;
            hljs.highlightElement(dom.codeContent);
        }

        setStatus("File ready", "success");
    } catch (error) {
        dom.imageViewer.classList.add("is-hidden");
        dom.codeViewer.classList.remove("is-hidden");
        dom.codeContent.textContent = `Unable to load file preview.\n${error.message}`;
        setStatus("Preview failed", "danger");
    } finally {
        setContentLoading(false);
    }
}

async function loadReadme() {
    const readmeEntry = state.flatTree.find((item) => item.type === "blob" && /^readme(?:\.[^./]+)?$/i.test(item.path));

    if (!readmeEntry) {
        dom.readmeContent.innerHTML = `
            <div class="empty-block">
                <div class="empty-icon"></div>
                <div>
                    <h3>No README found</h3>
                    <p>This repository does not appear to provide a root README file.</p>
                </div>
            </div>
        `;
        state.readmeText = "";
        return;
    }

    const { text } = await fetchTextContent(readmeEntry.path);
    state.readmeText = text;

    if (/\.(md|markdown)$/i.test(readmeEntry.path) && window.marked) {
        dom.readmeContent.innerHTML = sanitizeRenderedHtml(marked.parse(text));
    } else {
        dom.readmeContent.innerHTML = `<pre>${escapeHtml(text)}</pre>`;
    }

    if (window.hljs) {
        dom.readmeContent.querySelectorAll("pre code").forEach((block) => hljs.highlightElement(block));
    }
}

function seedRepoData(repoMeta, flatTree) {
    state.repoMeta = repoMeta;
    state.flatTree = flatTree;
}

function addChatMessage(role, html) {
    const article = document.createElement("article");
    article.className = `chat-message ${role === "user" ? "user" : "analyst"}`;
    article.innerHTML = `
        <div class="chat-badge">${role === "user" ? "YOU" : "AI"}</div>
        <div class="chat-body">${html}</div>
    `;

    dom.chatMessages.appendChild(article);

    if (window.hljs) {
        article.querySelectorAll("pre code").forEach((block) => hljs.highlightElement(block));
    }

    dom.chatMessages.scrollTop = dom.chatMessages.scrollHeight;
}

function countByExtension(files) {
    const counts = {};

    files.forEach((file) => {
        const ext = getExtension(file.path) || "[no ext]";
        counts[ext] = (counts[ext] || 0) + 1;
    });

    return Object.entries(counts).sort((left, right) => right[1] - left[1]);
}

function analyzeQuery(input) {
    if (!state.repoMeta) {
        return "Load a repository first so I have data to analyze.";
    }

    const query = input.toLowerCase().trim();
    const files = state.flatTree.filter((item) => item.type === "blob");
    const dirs = state.flatTree.filter((item) => item.type === "tree");

    if (/^(files?|all files|list files|show files)$/.test(query)) {
        return [
            `## Repository Files`,
            `- Total files: ${files.length}`,
            `- Total directories: ${dirs.length}`,
            "",
            ...files.slice(0, 24).map((file) => `- \`${file.path}\``),
            files.length > 24 ? `- ...and ${files.length - 24} more` : "",
        ].filter(Boolean).join("\n");
    }

    if (/summar|overview|what does|what is|purpose|describe|plain english|about/.test(query)) {
        const topExtensions = countByExtension(files)
            .slice(0, 5)
            .map(([ext, count]) => `\`${ext}\` (${count})`)
            .join(", ");
        const topFolders = dirs
            .map((dir) => dir.path.split("/")[0])
            .filter((value, index, array) => array.indexOf(value) === index)
            .slice(0, 8)
            .join(", ");

        return [
            `## ${state.repoMeta.full_name}`,
            state.repoMeta.description ? `> ${state.repoMeta.description}` : "",
            "",
            `- Stars: ${formatNumber(state.repoMeta.stargazers_count)}`,
            `- Forks: ${formatNumber(state.repoMeta.forks_count)}`,
            `- Primary language: ${state.repoMeta.language || "Mixed"}`,
            `- Default branch: \`${state.branch}\``,
            `- Total files: ${files.length}`,
            `- Total directories: ${dirs.length}`,
            `- Top file types: ${topExtensions || "No clear file extensions detected"}`,
            `- Top-level folders: ${topFolders || "Mostly root files"}`,
            state.readmeText ? `\nREADME snapshot:\n> ${state.readmeText.split("\n").filter(Boolean).slice(0, 3).join(" ").slice(0, 320)}...` : "",
        ].filter(Boolean).join("\n");
    }

    if (/folder|structure|tree|layout|organize|inside/.test(query)) {
        const topLevel = {};

        state.flatTree.forEach((item) => {
            const root = item.path.split("/")[0];
            if (!topLevel[root]) {
                topLevel[root] = {
                    isDir: item.type === "tree" || item.path.includes("/"),
                    files: 0,
                };
            }

            if (item.type === "blob") {
                topLevel[root].files += 1;
            }
        });

        const lines = Object.entries(topLevel)
            .slice(0, 24)
            .map(([name, info]) => `- ${info.isDir ? "Folder" : "File"}: \`${name}\` (${info.files} file${info.files === 1 ? "" : "s"})`);

        return [`## Repository Structure`, ...lines, "", `Total files: ${files.length}`, `Total directories: ${dirs.length}`].join("\n");
    }

    if (/tech|stack|language|framework|library|dependency|built with|using what/.test(query)) {
        const extCounts = countByExtension(files);
        const map = {
            js: "JavaScript",
            jsx: "React JSX",
            ts: "TypeScript",
            tsx: "React TSX",
            py: "Python",
            java: "Java",
            go: "Go",
            rs: "Rust",
            rb: "Ruby",
            php: "PHP",
            css: "CSS",
            scss: "SCSS",
            html: "HTML",
            vue: "Vue",
            svelte: "Svelte",
            json: "JSON",
            yml: "YAML",
            yaml: "YAML",
            toml: "TOML",
            md: "Markdown",
            sql: "SQL",
            sh: "Shell",
        };

        const lines = extCounts
            .filter(([ext]) => map[ext])
            .slice(0, 14)
            .map(([ext, count]) => `- ${map[ext]}: ${count} file${count === 1 ? "" : "s"} (\`.${ext}\`)`);

        return [
            "## Detected Tech Stack",
            `- Primary language from GitHub: ${state.repoMeta.language || "Not specified"}`,
            ...lines,
        ].join("\n");
    }

    const listMatch = query.match(/list\s+(?:all\s+)?([a-z0-9+#]+)\s+files?/i)
        || query.match(/show\s+(?:all\s+)?([a-z0-9+#]+)\s+files?/i);

    if (listMatch) {
        const ext = listMatch[1].replace(/^\./, "");
        const matches = files.filter((file) => getExtension(file.path) === ext);

        if (!matches.length) {
            return `No \`.${ext}\` files were found in this repository.`;
        }

        return [
            `## .${ext} Files (${matches.length})`,
            ...matches.slice(0, 80).map((file) => `- \`${file.path}\`${file.size ? ` (${formatBytes(file.size)})` : ""}`),
            matches.length > 80 ? `- ...and ${matches.length - 80} more` : "",
        ].filter(Boolean).join("\n");
    }

    if (/how many|count|total|number of/.test(query)) {
        const extLines = countByExtension(files)
            .slice(0, 10)
            .map(([ext, count]) => `- \`.${ext}\`: ${count}`);

        return [
            "## File Counts",
            `- Total files: ${files.length}`,
            `- Total directories: ${dirs.length}`,
            `- Default branch: \`${state.branch}\``,
            "",
            ...extLines,
        ].join("\n");
    }

    if (/large|biggest|largest|heavy|size/.test(query)) {
        const largest = [...files]
            .filter((file) => file.size)
            .sort((left, right) => (right.size || 0) - (left.size || 0))
            .slice(0, 12);

        if (!largest.length) {
            return "No file size information was available.";
        }

        return [
            "## Largest Files",
            ...largest.map((file, index) => `- ${index + 1}. \`${file.path}\` (${formatBytes(file.size)})`),
        ].join("\n");
    }

    if (/readme|documentation|docs/.test(query)) {
        if (!state.readmeText) {
            return "No README content is currently available.";
        }

        return [
            "## README Preview",
            "",
            "```text",
            state.readmeText.split("\n").slice(0, 28).join("\n"),
            "```",
        ].join("\n");
    }

    const fileSearchMatch = query.match(/(?:find|where is|locate|search for)\s+["']?([\w.\-/]+)["']?/i)
        || query.match(/(?:does it have|is there)\s+(?:a |an )?["']?([\w.\-/]+)["']?/i);

    if (fileSearchMatch) {
        const target = fileSearchMatch[1].toLowerCase();
        const matches = state.flatTree.filter((item) => item.path.toLowerCase().includes(target));

        if (!matches.length) {
            return `I could not find anything matching \`${target}\`.`;
        }

        return [
            `## Matches for "${target}"`,
            ...matches.slice(0, 24).map((item) => `- \`${item.path}\` (${item.type})`),
            matches.length > 24 ? `- ...and ${matches.length - 24} more` : "",
        ].filter(Boolean).join("\n");
    }

    if (/license|mit|apache|open source/.test(query)) {
        const licenseFile = files.find((file) => /licen[sc]e/i.test(file.path.split("/").pop()));
        return licenseFile
            ? `A license-related file appears to exist at \`${licenseFile.path}\`.`
            : "I did not detect a license file in this repository.";
    }

    if (/test|spec|coverage|jest|pytest|mocha|vitest/.test(query)) {
        const testFiles = files.filter((file) => /test|spec/i.test(file.path));
        const testDirs = dirs.filter((dir) => /test|spec/i.test(dir.path));

        if (!testFiles.length && !testDirs.length) {
            return "No obvious test files or test directories were detected.";
        }

        return [
            "## Testing Clues",
            `- Test-like files: ${testFiles.length}`,
            `- Test-like directories: ${testDirs.length}`,
            ...testFiles.slice(0, 20).map((file) => `- \`${file.path}\``),
        ].join("\n");
    }

    if (/entry|main|start|run|bootstrap|index/.test(query)) {
        const candidates = [
            "index.js", "main.js", "app.js", "server.js", "index.ts", "main.ts", "index.html",
            "src/index.js", "src/main.js", "src/App.tsx", "src/App.jsx", "main.py", "app.py"
        ];
        const matches = candidates
            .map((candidate) => files.find((file) => file.path === candidate || file.path.endsWith(`/${candidate}`)))
            .filter(Boolean);

        if (!matches.length) {
            return "I did not find a common entry-point filename, so the project may use a custom structure.";
        }

        return [
            "## Possible Entry Points",
            ...matches.map((file) => `- \`${file.path}\``),
        ].join("\n");
    }

    if (/config|setting|setup|env|dotenv/.test(query)) {
        const configNames = [
            ".env", ".env.example", ".env.sample", "package.json", "tsconfig.json", "vite.config.ts", "vite.config.js",
            "webpack.config.js", "next.config.js", "requirements.txt", "pyproject.toml", "Cargo.toml", "go.mod"
        ];

        const matches = files.filter((file) => configNames.includes(file.path.split("/").pop()));

        if (!matches.length) {
            return "No common config files stood out in the repository tree.";
        }

        return [
            "## Configuration Files",
            ...matches.map((file) => `- \`${file.path}\``),
        ].join("\n");
    }

    const keywords = query.split(/\s+/).filter((word) => word.length > 3);
    const keywordMatches = state.flatTree.filter((item) => keywords.some((word) => item.path.toLowerCase().includes(word)));

    if (keywordMatches.length) {
        return [
            "## Related Files",
            ...keywordMatches.slice(0, 25).map((item) => `- \`${item.path}\` (${item.type})`),
            keywordMatches.length > 25 ? `- ...and ${keywordMatches.length - 25} more` : "",
        ].filter(Boolean).join("\n");
    }

    return [
        "I could not map that question to a strong repo signal yet.",
        "",
        "Try one of these:",
        "- Summarize this project",
        "- What is the folder structure?",
        "- What technologies are used?",
        "- List all JavaScript files",
        "- Find package.json",
    ].join("\n");
}

async function exploreRepo(owner, repo) {
    hideError();
    setGlobalLoading(true);
    setStatus("Fetching repository", "busy");
    startProgress();
    resetWorkspace();

    state.owner = owner;
    state.repo = repo;
    dom.repoInput.value = `${owner}/${repo}`;
    emptyTreeState("Loading repository", "Pulling repository metadata and file tree from GitHub...");

    try {
        const repoData = await fetchJson(buildApiUrl(`/repos/${owner}/${repo}`), "Unable to fetch repository metadata.");
        updateProgress(46);

        state.branch = repoData.default_branch || "main";
        renderRepoMeta(repoData);

        const treeData = await fetchJson(
            buildApiUrl(`/repos/${owner}/${repo}/git/trees/${encodeURIComponent(state.branch)}?recursive=1`),
            "Unable to fetch repository file tree."
        );
        updateProgress(74);

        const flatTree = Array.isArray(treeData.tree) ? treeData.tree : [];
        seedRepoData(repoData, flatTree);
        renderTree(flatTree);
        document.body.classList.add("repo-loaded");

        dom.welcomeState.classList.add("is-hidden");
        dom.workspaceSurface.classList.remove("is-hidden");
        dom.tabAskAi.classList.remove("is-hidden");

        setContentLoading(true);
        await loadReadme();
        activateTab("readme");
        updateProgress(92);

        if (treeData.truncated) {
            setStatus("Large repo preview", "success");
            showError("GitHub returned a truncated file tree for this large repository, so some nested files may not appear.");
        } else {
            setStatus("Repository ready", "success");
        }

        completeProgress();
    } catch (error) {
        resetWorkspace();
        showError(error.message);
        completeProgress();
    } finally {
        setContentLoading(false);
        setGlobalLoading(false);
    }
}

dom.repoForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    try {
        const { owner, repo } = parseRepoInput(dom.repoInput.value);
        await exploreRepo(owner, repo);
    } catch (error) {
        showError(error.message);
    }
});

dom.dismissError.addEventListener("click", hideError);

dom.tabReadme.addEventListener("click", () => activateTab("readme"));
dom.tabViewer.addEventListener("click", () => activateTab("viewer"));
dom.tabAskAi.addEventListener("click", () => activateTab("analyst"));

dom.fileTree.addEventListener("click", async (event) => {
    const button = event.target.closest(".tree-file");
    if (!button) {
        return;
    }

    const filePath = button.dataset.path || "";
    const fileName = button.dataset.name || "";
    const fileSize = Number(button.dataset.size || "0");

    await openFile(filePath, fileName, fileSize, button);
});

dom.chatForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const question = dom.chatInput.value.trim();
    if (!question) {
        return;
    }

    dom.chatInput.value = "";
    addChatMessage("user", `<p>${escapeHtml(question)}</p>`);

    const reply = analyzeQuery(question);
    const html = window.marked ? sanitizeRenderedHtml(marked.parse(reply)) : `<pre>${escapeHtml(reply)}</pre>`;
    addChatMessage("analyst", html);
    activateTab("analyst");
});

dom.promptChips.forEach((chip) => {
    chip.addEventListener("click", () => {
        dom.chatInput.value = chip.dataset.prompt || "";
        dom.chatForm.requestSubmit();
    });
});

dom.exampleChips.forEach((chip) => {
    chip.addEventListener("click", () => {
        dom.repoInput.value = chip.dataset.example || "";
        dom.repoForm.requestSubmit();
    });
});

resetWorkspace();
setStatus("Ready");
