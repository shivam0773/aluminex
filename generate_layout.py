from pathlib import Path

src = Path("frontend/src")

files = {
    "components/layout/MainLayout.jsx": """export default function MainLayout() {
  return <h1>Main Layout</h1>;
}
""",

    "components/layout/Sidebar.jsx": """export default function Sidebar() {
  return <h1>Sidebar</h1>;
}
""",

    "components/layout/Topbar.jsx": """export default function Topbar() {
  return <h1>Topbar</h1>;
}
""",

    "theme/theme.js": """export const theme = {};
""",

    "theme/colors.js": """export const colors = {};
""",

    "contexts/ThemeContext.jsx": """export default function ThemeContext() {
  return null;
}
""",
}

for relative_path, content in files.items():
    file_path = src / relative_path
    file_path.parent.mkdir(parents=True, exist_ok=True)
    file_path.write_text(content, encoding="utf-8")

print("✅ ALUMINEX Layout Generated Successfully!")