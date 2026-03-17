#!/bin/bash
# Scaffold a new skill folder with the minimum required structure.
# Usage: bash scaffold.sh <skill-name> [--with-references] [--with-scripts] [--with-assets]
#
# Creates skills/<skill-name>/SKILL.md with frontmatter template.
# Optional flags create the corresponding subdirectories.

set -e

SKILL_NAME="$1"
if [ -z "$SKILL_NAME" ]; then
  echo "Usage: bash scaffold.sh <skill-name> [--with-references] [--with-scripts] [--with-assets]"
  exit 1
fi

# Find repo root (look for registry.json)
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../../.." && pwd)"

if [ ! -f "$REPO_ROOT/skills/registry.json" ]; then
  echo "Error: Cannot find skills/registry.json. Run from within the FTDNA repo."
  exit 1
fi

SKILL_DIR="$REPO_ROOT/skills/$SKILL_NAME"

if [ -d "$SKILL_DIR" ]; then
  echo "Error: skills/$SKILL_NAME already exists."
  exit 1
fi

mkdir -p "$SKILL_DIR"

# Create SKILL.md with frontmatter template
cat > "$SKILL_DIR/SKILL.md" << 'TEMPLATE'
---
name: SKILL_NAME_PLACEHOLDER
description: >
  TODO: What this skill does + when to trigger it. Be specific and pushy.
  List trigger phrases, file types, and contexts.
---

# SKILL_NAME_PLACEHOLDER

TODO: Instructions for the model. Start with what to do first.
TEMPLATE

# Replace placeholder with actual name
sed -i "s/SKILL_NAME_PLACEHOLDER/$SKILL_NAME/g" "$SKILL_DIR/SKILL.md"

# Optional subdirectories
for arg in "$@"; do
  case "$arg" in
    --with-references) mkdir -p "$SKILL_DIR/references" ;;
    --with-scripts)    mkdir -p "$SKILL_DIR/scripts" ;;
    --with-assets)     mkdir -p "$SKILL_DIR/assets" ;;
  esac
done

echo "Created skills/$SKILL_NAME/"
ls -la "$SKILL_DIR"
