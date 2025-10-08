#!/bin/bash
# Script to create GitHub issues from audit issue files
# Requires GitHub CLI (gh) to be installed and authenticated

set -e

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

echo "🔍 Creating GitHub issues from audit findings..."
echo ""

# Array to track created issues
declare -a created_issues

# Function to extract title from markdown file
get_title() {
    head -n 1 "$1" | sed 's/# //'
}

# Function to determine labels based on filename
get_labels() {
    local filename="$1"
    local labels=""
    
    if [[ $filename == SECURITY-* ]]; then
        labels="security,audit"
    elif [[ $filename == BEST-* ]]; then
        labels="enhancement,best-practice,audit"
    elif [[ $filename == QUALITY-* ]]; then
        labels="code-quality,refactoring,audit"
    elif [[ $filename == MAINT-* ]]; then
        labels="maintenance,technical-debt,audit"
    elif [[ $filename == DOC-* ]]; then
        labels="documentation,audit"
    elif [[ $filename == PERF-* ]]; then
        labels="performance,audit"
    fi
    
    # Add good-first-issue label if mentioned in file
    if grep -q "good first issue" "$1"; then
        labels="${labels},good-first-issue"
    fi
    
    echo "$labels"
}

# Function to extract priority
get_priority() {
    local content=$(cat "$1")
    if echo "$content" | grep -q "Priority.*High"; then
        echo "P0"
    elif echo "$content" | grep -q "Priority.*Medium"; then
        echo "P1"
    else
        echo "P2"
    fi
}

# Process each issue file
for file in SECURITY-*.md BEST-*.md QUALITY-*.md MAINT-*.md DOC-*.md PERF-*.md; do
    # Skip if no files match pattern
    [[ -e "$file" ]] || continue
    
    title=$(get_title "$file")
    labels=$(get_labels "$file")
    priority=$(get_priority "$file")
    
    echo "📝 Creating issue: $title"
    echo "   Labels: $labels"
    echo "   Priority: $priority"
    
    # Create the issue
    issue_url=$(gh issue create \
        --title "$title" \
        --body-file "$file" \
        --label "$labels" \
        2>&1)
    
    if [ $? -eq 0 ]; then
        echo "   ✅ Created: $issue_url"
        created_issues+=("$title")
    else
        echo "   ❌ Failed to create issue"
        echo "   Error: $issue_url"
    fi
    
    echo ""
    
    # Be nice to the API
    sleep 1
done

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✨ Summary"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Created ${#created_issues[@]} issues:"
for issue in "${created_issues[@]}"; do
    echo "  • $issue"
done
echo ""
echo "🎉 Done! View issues at:"
echo "   https://github.com/target/strelka-ui/issues"
