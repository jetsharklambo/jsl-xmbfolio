#!/usr/bin/env node

/**
 * Generate Blog Posts Index
 *
 * This script reads all markdown files from the blog/ directory,
 * parses their frontmatter and content, and generates a JSON file
 * with all blog post data for fast client-side loading.
 */

const fs = require('fs');
const path = require('path');

// Configuration
const BLOG_DIR = path.join(__dirname, '..', 'blog');
const OUTPUT_FILE = path.join(__dirname, '..', 'blog-posts.json');
const GITHUB_REPO = 'jetsharklambo/jsl-xmbfolio';
const GITHUB_BRANCH = 'main';

/**
 * Parse frontmatter from markdown content
 */
function parseFrontmatter(content) {
    const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
    const match = content.match(frontmatterRegex);

    if (!match) {
        return { frontmatter: {}, body: content };
    }

    const frontmatterText = match[1];
    const body = match[2];
    const frontmatter = {};

    // Parse YAML-like frontmatter
    frontmatterText.split('\n').forEach(line => {
        const colonIndex = line.indexOf(':');
        if (colonIndex > 0) {
            const key = line.substring(0, colonIndex).trim();
            const value = line.substring(colonIndex + 1).trim().replace(/^["']|["']$/g, '');
            frontmatter[key] = value;
        }
    });

    return { frontmatter, body };
}

/**
 * Generate GitHub URL for a blog post file
 */
function generateGithubUrl(filename) {
    return `https://github.com/${GITHUB_REPO}/blob/${GITHUB_BRANCH}/blog/${filename}`;
}

/**
 * Extract first heading and generate anchor
 */
function extractFirstHeadingAnchor(markdownContent) {
    const headingRegex = /^#+\s+(.+)$/m;
    const match = markdownContent.match(headingRegex);

    if (!match) {
        return null;
    }

    const headingText = match[1];
    const anchor = headingText
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/^-|-$/g, '');

    return `#${anchor}`;
}

/**
 * Process a single markdown file
 */
function processMarkdownFile(filename) {
    const filePath = path.join(BLOG_DIR, filename);

    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const { frontmatter, body } = parseFrontmatter(content);

        const githubUrl = generateGithubUrl(filename);
        const anchor = extractFirstHeadingAnchor(body);

        return {
            filename: filename,
            title: frontmatter.title || 'Untitled Post',
            date: frontmatter.date || '2024-01-01',
            excerpt: frontmatter.excerpt || '',
            content: body,
            githubUrl: githubUrl,
            githubUrlWithAnchor: anchor ? `${githubUrl}${anchor}` : githubUrl
        };
    } catch (error) {
        console.error(`Error processing ${filename}:`, error.message);
        return null;
    }
}

/**
 * Main function
 */
function generateBlogIndex() {
    console.log('🚀 Generating blog posts index...');
    console.log(`📂 Reading from: ${BLOG_DIR}`);

    // Check if blog directory exists
    if (!fs.existsSync(BLOG_DIR)) {
        console.error(`❌ Blog directory not found: ${BLOG_DIR}`);
        process.exit(1);
    }

    // Read all files from blog directory
    const files = fs.readdirSync(BLOG_DIR);

    // Filter for markdown files
    const markdownFiles = files.filter(file =>
        file.endsWith('.md') || file.endsWith('.markdown')
    );

    console.log(`📄 Found ${markdownFiles.length} markdown files`);

    // Process each markdown file
    const posts = markdownFiles
        .map(processMarkdownFile)
        .filter(post => post !== null)
        .sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by date, newest first

    // Generate output JSON
    const output = {
        generated: new Date().toISOString(),
        count: posts.length,
        posts: posts
    };

    // Write to output file
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2), 'utf8');

    console.log(`✅ Successfully generated ${OUTPUT_FILE}`);
    console.log(`📊 Processed ${posts.length} blog posts`);
    console.log('');
    console.log('Posts:');
    posts.forEach(post => {
        console.log(`  - ${post.title} (${post.date})`);
    });
}

// Run the script
try {
    generateBlogIndex();
} catch (error) {
    console.error('❌ Fatal error:', error);
    process.exit(1);
}
