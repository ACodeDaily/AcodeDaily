#!/bin/bash

# Check if there are any changes to commit
if [[ -z $(git status -s) ]]; then
  echo "No changes to commit."
  exit 0
fi

# Prompt for Gitmoji
echo "Select a Gitmoji:"
gitmoji_list=("✨ New feature" "🐛 Bug fix" "🔧 Maintenance" "📚 Documentation" "✅ Tests" "♻️ Refactor" "🎨 Style" "🔥 Remove" "🚀 Performance" "🏗️  Initial Construction" "🚧 WIP")
for i in "${!gitmoji_list[@]}"; do
  echo "$i. ${gitmoji_list[$i]}"
done

read -p "Enter the number corresponding to the Gitmoji: " gitmoji_number

if [[ ! "$gitmoji_number" =~ ^[0-9]+$ ]] || [ "$gitmoji_number" -lt 0 ] || [ "$gitmoji_number" -ge "${#gitmoji_list[@]}" ]; then
  echo "Invalid selection."
  exit 1
fi

selected_gitmoji="${gitmoji_list[$gitmoji_number]}"

# Prompt for commit message
read -p "Enter commit message: " commit_message

# Commit changes
git add .
git commit -m "$selected_gitmoji $commit_message"
git push origin main
echo "Changes committed and pushed successfully."