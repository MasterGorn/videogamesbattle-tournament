#!/bin/bash
cd "$(dirname "$0")" || exit 1
if ! command -v node >/dev/null; then
  echo "Installez Node.js 24 depuis https://nodejs.org puis relancez ce fichier."
  read -r -p "Appuyez sur Entree pour fermer."
  exit 1
fi
echo "Ouvrez http://localhost:3000 dans votre navigateur."
npm start
