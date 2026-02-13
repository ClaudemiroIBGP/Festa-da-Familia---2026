<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1atDv8X3Au26ldKoF2P_HO4bEdZ6flONW

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

---

## Salvar inscrições em Planilha Google (Google Sheets)

Este projeto já envia a inscrição para um endpoint configurado em `.env.local`.

### 1) Criar o endpoint no Google Apps Script

1. Abra um novo projeto em Google Apps Script (script.google.com).
2. Cole o arquivo **`google-apps-script/Code.gs`** deste repositório.
3. Faça o **Deploy** como **Web app**:
   - **Execute as:** você
   - **Who has access:** *Anyone* (ou equivalente)
4. Copie a URL gerada do Web App.

A planilha alvo está configurada no script como:

- Spreadsheet ID: `13X9r_ISAWPG8AXpqKBaBPkfqyfzBJqTnx3Xwjykw41Y`
- Colunas: `id` | `nome` | `telefone` | `Tipo de Pagamento`

### 2) Configurar a URL no front-end

Crie/edite o arquivo `.env.local` na raiz do projeto:

```
VITE_FORM_ENDPOINT="COLE_AQUI_A_URL_DO_WEB_APP"
```

Depois rode:

```
npm install
npm run dev
```

### Observação importante (CORS)

O front envia o payload como **text/plain** (JSON em texto) para evitar bloqueios de CORS/preflight no Web App do Apps Script.
