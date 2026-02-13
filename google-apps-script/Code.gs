/**
 * Web App (Google Apps Script) para receber inscrições do site e gravar na planilha.
 *
 * Planilha alvo:
 * https://docs.google.com/spreadsheets/d/13X9r_ISAWPG8AXpqKBaBPkfqyfzBJqTnx3Xwjykw41Y/edit
 *
 * Colunas (na aba 1):
 *  A: id
 *  B: nome
 *  C: telefone
 *  D: Tipo de Pagamento
 *
 * Como usar:
 * 1) Cole este arquivo em https://script.google.com (Novo projeto)
 * 2) Implante como "Web app"
 *    - Execute como: você
 *    - Quem tem acesso: "Anyone" (ou "Qualquer pessoa" / "Anyone with the link")
 * 3) Copie a URL do Web App e coloque no .env.local:
 *    VITE_FORM_ENDPOINT="SUA_URL_AQUI"
 */
const SPREADSHEET_ID = '13X9r_ISAWPG8AXpqKBaBPkfqyfzBJqTnx3Xwjykw41Y';

function ensureHeader_(sheet) {
  const values = sheet.getRange(1, 1, 1, 4).getValues()[0];
  const expected = ['id', 'nome', 'telefone', 'Tipo de Pagamento'];
  const isEmpty = values.every(v => v === '' || v === null);
  const matches = expected.every((v, i) => String(values[i] || '').trim().toLowerCase() === v.toLowerCase());
  if (isEmpty || !matches) {
    sheet.getRange(1, 1, 1, 4).setValues([expected]);
    sheet.getRange(1, 1, 1, 4).setFontWeight('bold');
  }
}

function jsonResponse_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Recebe POST com body em texto (JSON string).
 * Do lado do Vite/React, usamos Content-Type text/plain para evitar preflight/CORS.
 */
function doPost(e) {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheets()[0]; // primeira aba
    ensureHeader_(sheet);

    const raw = (e && e.postData && e.postData.contents) ? e.postData.contents : '';
    const data = raw ? JSON.parse(raw) : {};

    const id = String(data.id || '').trim();
    const nome = String(data.name || data.nome || '').trim();
    const telefone = String(data.phone || data.telefone || '').trim();
    const tipoPagamento = String(data.paymentType || data.tipoPagamento || data['Tipo de Pagamento'] || '').trim();

    if (!id || !nome || !telefone || !tipoPagamento) {
      return jsonResponse_({ ok: false, error: 'Campos obrigatórios: id, nome, telefone, Tipo de Pagamento.' });
    }

    sheet.appendRow([id, nome, telefone, tipoPagamento]);

    return jsonResponse_({ ok: true });
  } catch (err) {
    return jsonResponse_({ ok: false, error: String(err) });
  }
}
