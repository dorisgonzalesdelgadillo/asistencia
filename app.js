/* ============================================================
   app.js - Funciones globales del proyecto
============================================================ */

// =============================
// Evitar doble lectura en scanear.html con mensaje
window.__lastScan = null;
window.__evitarDobleScan = function(decodedText, statusEl) {
  if (window.__lastScan === decodedText) {
    statusEl.textContent = "⚠ Este QR ya fue escaneado. No se puede registrar doble.";
    return false; // no permitir escanear de nuevo
  }
  window.__lastScan = decodedText;
  return true; // permitir escaneo
};

// =============================
// Generar QR (generar.html)
// =============================
window.__generateQRCode = async function(text) {
  try {
    return await QRCode.toDataURL(text, { errorCorrectionLevel: 'H', width: 300, margin: 2 });
  } catch (err) {
    console.error("Error generando QR:", err);
    alert("Hubo un error al generar el QR.");
    return null;
  }
};

// =============================
// Enviar datos a Google Sheets (scanear.html)
// =============================
window.__enviarARegistro = async function(rowObj, statusEl, html5QrCode) {
  // ⚠️ Cambia esta URL por la tuya
  const SHEET_ENDPOINT_URL = "https://script.google.com/macros/s/AKfycbzTRAPBi5BEXsvj5tQBYfA4h5GiKS7ai8zh124p4_WEFRl7FNxNvMmn6AQ_BkWMkkcJ0w/exec";

  statusEl.textContent = 'Enviando registro...';

  try {
    await fetch(SHEET_ENDPOINT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(rowObj)
    });

    statusEl.textContent = `✔ Registrado: ${rowObj.dni} - ${rowObj.nombre} ${rowObj.apellidos}`;

  } catch (err) {
    statusEl.textContent = "Error al enviar a Google Sheets: " + err;
  } finally {
    // Esperar un momento y reanudar lector
    setTimeout(() => {
      statusEl.textContent = "Esperando escaneo...";
      html5QrCode.resume();
    }, 1500);
  }
};
