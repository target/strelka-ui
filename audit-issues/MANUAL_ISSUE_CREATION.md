# Manual GitHub Issue Creation Guide

If you don't have GitHub CLI or prefer to create issues manually, follow this guide.

## Step-by-Step Process

### 1. Navigate to GitHub Issues
Go to: https://github.com/target/strelka-ui/issues

### 2. Click "New Issue"

### 3. For Each Issue File

Open the issue file (e.g., `SECURITY-001-add-security-headers.md`) and:

#### Copy the Title
- First line of the file (without the `#`)
- Example: "Add Security Headers to Flask Application"

#### Copy the Body
- Everything from the file EXCEPT the first line
- Include all sections: Description, Location, Solution, etc.

#### Add Labels
Based on the issue prefix:

| Prefix | Labels to Add |
|--------|---------------|
| SECURITY-* | `security`, `audit` |
| BEST-* | `enhancement`, `best-practice`, `audit` |
| QUALITY-* | `code-quality`, `refactoring`, `audit` |
| MAINT-* | `maintenance`, `technical-debt`, `audit` |
| DOC-* | `documentation`, `audit` |

**Additional Labels:**
- Add `good-first-issue` if mentioned in the file
- Add `bug` if it's fixing incorrect behavior

#### Set Priority
Based on the "Priority" section in the issue:
- 🔴 High → P0 or "high priority" label
- 🟡 Medium → P1 or "medium priority" label  
- 🟢 Low → P2 or "low priority" label

### 4. Assign (Optional)
- Assign to yourself if you plan to work on it
- Leave unassigned for team to pick up

### 5. Link to Milestone (Optional)
If you have milestones like "Security Hardening" or "Q1 2024", link appropriately.

---

## Issue Creation Checklist

For each of the 14 issue files:

- [ ] SECURITY-001-add-security-headers.md
  - Labels: `security`, `audit`, `good-first-issue`
  - Priority: High
  
- [ ] SECURITY-002-timezone-aware-datetime.md
  - Labels: `security`, `bug`, `audit`, `technical-debt`
  - Priority: High
  
- [ ] SECURITY-003-cryptographic-random.md
  - Labels: `security`, `bug`, `audit`, `good-first-issue`
  - Priority: High
  
- [ ] SECURITY-004-exception-handling.md
  - Labels: `security`, `code-quality`, `audit`, `refactoring`
  - Priority: Medium
  
- [ ] SECURITY-005-file-path-validation.md
  - Labels: `security`, `audit`, `enhancement`
  - Priority: Medium
  
- [ ] BEST-001-rate-limiting.md
  - Labels: `security`, `enhancement`, `audit`
  - Priority: Medium
  
- [ ] BEST-006-add-unit-tests.md
  - Labels: `testing`, `technical-debt`, `audit`, `enhancement`
  - Priority: High
  
- [ ] BEST-009-cors-configuration.md
  - Labels: `security`, `configuration`, `audit`, `enhancement`
  - Priority: Medium
  
- [ ] QUALITY-001-remove-commented-code.md
  - Labels: `code-quality`, `technical-debt`, `audit`, `good-first-issue`
  - Priority: Low-Medium
  
- [ ] QUALITY-002-refactor-long-functions.md
  - Labels: `refactoring`, `code-quality`, `audit`, `enhancement`
  - Priority: Medium
  
- [ ] MAINT-002-remove-duplicate-function.md
  - Labels: `code-quality`, `refactoring`, `audit`, `good-first-issue`
  - Priority: Low
  
- [ ] MAINT-004-extract-virustotal-constants.md
  - Labels: `refactoring`, `code-quality`, `audit`, `enhancement`
  - Priority: Low
  
- [ ] DOC-001-enhance-readme.md
  - Labels: `documentation`, `audit`, `enhancement`, `good-first-issue`
  - Priority: Low

---

## Tips

1. **Start with High Priority** - Create SECURITY and BEST issues first
2. **Group Similar Issues** - Create all SECURITY issues together
3. **Use Templates** - Copy/paste labels to save time
4. **Reference the Audit** - Mention "From codebase audit" in comments
5. **Link Issues** - Reference related issues (e.g., "Related to #123")

---

## Batch Creation

If creating many issues:

1. Open multiple browser tabs
2. Pre-fill title and labels in notepad
3. Copy/paste efficiently
4. Use browser's back button after creating each

---

## Estimated Time

- Per issue: ~2-3 minutes
- All 14 issues: ~30-45 minutes

---

## After Creating Issues

1. Review the issue list
2. Add to project board if using one
3. Assign initial issues to team members
4. Schedule sprint planning to prioritize
5. Link issues in the audit PR description

---

## Questions?

- See `README.md` for implementation guidance
- See `AUDIT_REPORT.md` for full context
- Each issue file has detailed solutions
