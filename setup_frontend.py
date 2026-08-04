from pathlib import Path

# Root folder
root = Path("frontend/src")

# Folders to create
folders = [
    "assets",
    "components",
    "components/dashboard",
    "components/company",
    "components/common",
    "components/layout",
    "contexts",
    "hooks",
    "layouts",
    "pages",
    "services",
    "theme",
    "utils",
]

# Files to create
files = [
    "pages/Dashboard.jsx",
    "pages/Companies.jsx",
    "pages/CompanyDetails.jsx",
    "pages/Contacts.jsx",
    "pages/Products.jsx",
    "pages/FollowUps.jsx",
    "pages/Settings.jsx",

    "components/layout/Sidebar.jsx",
    "components/layout/Topbar.jsx",
    "components/layout/MainLayout.jsx",

    "services/api.js",
    "services/companyService.js",
]

# Create folders
for folder in folders:
    (root / folder).mkdir(parents=True, exist_ok=True)

# Create files
for file in files:
    path = root / file
    path.touch(exist_ok=True)

print("\n✅ ALUMINEX Frontend Structure Created Successfully!\n")
print("Created folders:")
for folder in folders:
    print(f"📁 {folder}")

print("\nCreated files:")
for file in files:
    print(f"📄 {file}")