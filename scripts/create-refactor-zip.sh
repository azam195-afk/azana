#!/usr/bin/env bash
set -euo pipefail

# AZANA DESIGN refactor packager
# Runs from anywhere inside this repository and creates a downloadable ZIP
# containing the production-ready refactored website, excluding Git metadata,
# previous ZIP outputs, dependency folders, caches, and OS/editor junk.

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
OUTPUT_DIR="${PROJECT_ROOT}/dist"
ZIP_NAME="azana-refactor-production.zip"
ZIP_PATH="${OUTPUT_DIR}/${ZIP_NAME}"
MANIFEST_PATH="${OUTPUT_DIR}/azana-refactor-manifest.txt"

mkdir -p "${OUTPUT_DIR}"
rm -f "${ZIP_PATH}" "${MANIFEST_PATH}"

cd "${PROJECT_ROOT}"

EXCLUDES=(
  ".git/*"
  "dist/*"
  "node_modules/*"
  ".DS_Store"
  "Thumbs.db"
  "*.log"
  "*.tmp"
)

printf 'Creating %s\n' "${ZIP_PATH}"

if command -v zip >/dev/null 2>&1; then
  ZIP_ARGS=(-r -9 "${ZIP_PATH}" .)
  for pattern in "${EXCLUDES[@]}"; do
    ZIP_ARGS+=(-x "${pattern}")
  done
  zip "${ZIP_ARGS[@]}" >/dev/null
else
  python3 - <<'PY'
from pathlib import Path
from zipfile import ZIP_DEFLATED, ZipFile
import fnmatch

root = Path.cwd()
zip_path = root / 'dist' / 'azana-refactor-production.zip'
excludes = ['.git/*', 'dist/*', 'node_modules/*', '.DS_Store', 'Thumbs.db', '*.log', '*.tmp']

def is_excluded(path: Path) -> bool:
    rel = path.relative_to(root).as_posix()
    return any(fnmatch.fnmatch(rel, pattern) for pattern in excludes)

with ZipFile(zip_path, 'w', ZIP_DEFLATED, compresslevel=9) as archive:
    for path in sorted(root.rglob('*')):
        if path.is_file() and not is_excluded(path):
            archive.write(path, path.relative_to(root).as_posix())
PY
fi

if command -v sha256sum >/dev/null 2>&1; then
  sha256sum "${ZIP_PATH}" > "${MANIFEST_PATH}"
elif command -v shasum >/dev/null 2>&1; then
  shasum -a 256 "${ZIP_PATH}" > "${MANIFEST_PATH}"
else
  python3 - <<'PY'
from hashlib import sha256
from pathlib import Path
zip_path = Path('dist/azana-refactor-production.zip')
print(f"{sha256(zip_path.read_bytes()).hexdigest()}  {zip_path}", file=Path('dist/azana-refactor-manifest.txt').open('w'))
PY
fi

printf 'Done. ZIP: %s\n' "${ZIP_PATH}"
printf 'SHA256 manifest: %s\n' "${MANIFEST_PATH}"
