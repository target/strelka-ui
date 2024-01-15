# Changelog
Changes to the project will be tracked in this file via the date of change.

## 2024-01-15
- On new releases, user session may be expired required the user to manually log out and log in. This fix aims to resolve that issue by forcing the user to the login page.
- Add a ScanJavascript card to display Javascript scanner details
- Adds some more context to Card headers (IOC count)
- Fixes issue where long YARA descriptions extend outside the bounds of the YARA box.

## 2024-01-11
- Bug fix for files missing types (Dashboard)

## 2024-01-09
- Adding Visual Basic scanner
- Formatting + Bug Fixes
  
## 2023-12-18
- Updated UI
- Updated many / most files / packages
- Added VirusTotal scan / upload support
  
## 2023-11-16
- Transition to Poetry for Python Package Management
- Refinement of HTTP Response Codes
  
## 2023-09-08
- Adding base_url support (Defaults to `/strelkaui/`
- Bug fix for files without YARA matches
- Dependency upgrade (`@adobe/css-tools`)

## 2023-07-10
- Dependency upgrades (`requests`, `grpcio`, `tough-cookie`, `cryptography`)

## 2023-05-16
### Changed
- Added Docker Hub support for repo tags

## 2023-03-22
### Changed
- Added API suppport
- Added functionality to multiple pages
- Updated code with improved formatting / types

## 2023-03-10
### Changed
- Added extracted file support

## 2022-12-19
### Changed
- Removed need to initialize local database. Done automatically now.
- Bug fix for README build badge.
- Bug fix for file view page.

### Added
- Added support for multiple file submissions in Dashboard dropzone.
- Added Strelka server connection status on Dashboard.

## 2022-12-06
### Changed
- Bug fix for when attempting to submit a file.
- Bug fix for when attempting to load a file.

### Added
- Ability to filter by file name and description on Submission page.
 
## 2022-11-15
### Added
- Ability to add description to uploaded files

### Changed
- Changing default docker-compose postgresdb name
- Removing unnecessary directory

## 2022-11-04
### Changed
- Bug fix for issues when loading scanners with uppercase names

## 2022-10-17
### Changed
- Bug fix for issues when loading scanners with digits in name
- Updated documentation

## 2022-09-26
### Changed
- Updated dependencies (dependabot)
- Updated intialization documentation 

## 2022-07-05
### Added
- Project Commit for OpenSource Submission Request
