# Refactor Long Functions for Maintainability

## Issue Type
Code Quality / Refactoring

## Priority
🟡 Medium

## Description
Several functions exceed 100 lines, making them difficult to understand, test, and maintain.

## Long Functions Identified
1. `strelka_ui/blueprints/strelka.py:525` - `view()` function (132 lines)
2. The `view()` function handles pagination, filtering, sorting, and query building in one large block

## Why This Matters
- **Reduced Readability:** Hard to understand flow
- **Testing Difficulty:** Hard to test all paths
- **Maintenance Burden:** Changes risk breaking multiple concerns
- **Code Reuse:** Logic can't be reused elsewhere
- **Cognitive Load:** Too much to hold in mind at once

## Example: Refactor `view()` Function

### Current Structure (Simplified)
```python
@strelka.route("/scans", methods=["GET"])
@auth_required
def view(user: User) -> Tuple[Dict[str, any], int]:
    # Parse request parameters (10 lines)
    # Build base query (5 lines)
    # Apply user filter (10 lines)
    # Apply search filter (30 lines)
    # Apply excluded submitters (10 lines)
    # Build sort cases (40 lines)
    # Apply sorting (10 lines)
    # Paginate (5 lines)
    # Format results (10 lines)
    # Return response (2 lines)
```

### Refactored Structure
```python
# strelka_ui/services/submission_query.py
from dataclasses import dataclass
from typing import List, Optional

@dataclass
class SubmissionQueryParams:
    """Parameters for submission query"""
    page: int = 1
    per_page: int = 10
    just_mine: bool = False
    search_query: str = ""
    sort_field: str = "submitted_at"
    sort_order: str = "descend"
    excluded_submitters: List[str] = None

class SubmissionQueryBuilder:
    """Builds and executes submission queries"""
    
    def __init__(self, user: User):
        self.user = user
        self.base_query = self._build_base_query()
    
    def _build_base_query(self):
        """Build base query with joins"""
        return FileSubmission.query.options(
            defer("strelka_response")
        ).join(User).options(
            joinedload(FileSubmission.user)
        )
    
    def apply_user_filter(self, just_mine: bool):
        """Filter by user if requested"""
        if just_mine:
            self.base_query = self.base_query.filter(
                FileSubmission.submitted_by_user_id == self.user.id
            )
        return self
    
    def apply_search_filter(self, search_query: str):
        """Apply search across multiple fields"""
        if not search_query:
            return self
        
        filters = self._build_search_filters(search_query)
        self.base_query = self.base_query.filter(or_(*filters))
        return self
    
    def apply_excluded_submitters(self, excluded: List[str]):
        """Exclude certain submitters"""
        if excluded:
            self.base_query = self.base_query.filter(
                ~User.user_cn.in_(excluded)
            )
        return self
    
    def apply_sorting(self, field: str, order: str):
        """Apply sorting logic"""
        sort_cases = self._get_sort_cases()
        if field in sort_cases:
            expr = sort_cases[field]
            if order == "ascend":
                self.base_query = self.base_query.order_by(expr.asc())
            else:
                self.base_query = self.base_query.order_by(expr.desc())
        return self
    
    def paginate(self, page: int, per_page: int):
        """Execute query with pagination"""
        return self.base_query.paginate(
            page=page,
            per_page=per_page,
            error_out=False
        )
    
    def _get_sort_cases(self):
        """Get sort case expressions"""
        return {
            "submitted_at": FileSubmission.submitted_at,
            "file_name": FileSubmission.file_name,
            "file_size": FileSubmission.file_size,
            # ... other cases ...
        }
    
    def _build_search_filters(self, query: str):
        """Build list of search filter conditions"""
        return [
            FileSubmission.file_name.ilike(f"%{query}%"),
            FileSubmission.submitted_description.ilike(f"%{query}%"),
            User.user_cn.ilike(f"%{query}%"),
            # ... other conditions ...
        ]

# In blueprints/strelka.py
@strelka.route("/scans", methods=["GET"])
@auth_required
def view(user: User) -> Tuple[Dict[str, any], int]:
    """Returns paginated list of submissions"""
    # Parse parameters
    params = SubmissionQueryParams(
        page=request.args.get("page", 1, type=int),
        per_page=request.args.get("per_page", 10, type=int),
        just_mine=request.args.get("just_mine", False, type=bool),
        search_query=request.args.get("search", "", type=str),
        sort_field=request.args.get("sortField", "submitted_at", type=str),
        sort_order=request.args.get("sortOrder", "descend", type=str),
        excluded_submitters=request.args.get("exclude_submitters", "").split(",")
    )
    
    # Build and execute query
    builder = SubmissionQueryBuilder(user)
    result = (builder
        .apply_user_filter(params.just_mine)
        .apply_search_filter(params.search_query)
        .apply_excluded_submitters(params.excluded_submitters)
        .apply_sorting(params.sort_field, params.sort_order)
        .paginate(params.page, params.per_page))
    
    # Format response
    return jsonify({
        "page": result.page,
        "pages": result.pages,
        "per_page": result.per_page,
        "total": result.total,
        "items": [submissions_to_json(s) for s in result.items]
    }), 200
```

## Benefits of Refactoring
1. **Testability:** Can test each method independently
2. **Reusability:** Query builder can be used in other endpoints
3. **Readability:** Each method has single responsibility
4. **Maintainability:** Changes to search don't affect sorting
5. **Documentation:** Method names document intent

## Refactoring Steps
1. Extract query building to service class
2. Extract parameter parsing to dataclass
3. Extract sort cases to separate method
4. Extract search filters to separate method
5. Write unit tests for each method
6. Refactor main function to use new structure
7. Verify integration tests pass

## Testing Strategy
```python
# tests/services/test_submission_query.py
class TestSubmissionQueryBuilder:
    def test_apply_user_filter(self):
        """Test user filtering works"""
        builder = SubmissionQueryBuilder(user)
        builder.apply_user_filter(just_mine=True)
        # Assert query contains user filter
    
    def test_apply_search_filter(self):
        """Test search filtering works"""
        builder = SubmissionQueryBuilder(user)
        builder.apply_search_filter("test.exe")
        # Assert query contains search conditions
    
    def test_sorting(self):
        """Test sorting works correctly"""
        builder = SubmissionQueryBuilder(user)
        builder.apply_sorting("file_size", "descend")
        # Assert query ordered correctly
```

## Labels
`refactoring`, `code-quality`, `enhancement`
