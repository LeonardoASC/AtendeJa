export const imprimirComprovanteEntrada = (
    { placa, tipo, entrada, id },
    callback = () => { }
) => {
    const html = `
      <div style="width:200px;font-family:monospace;font-size:12px;text-align:center;padding:10px;">
        <h4 style="font-size:8px;font-weight:100;margin:0;">Previdência Social dos Servidores de Montes Claros</h4>
        <h1 style="font-size:14px;font-weight:bold;margin:8px 0;">Estacionamento Shopping Popular Mário Ribeiro da Silveira</h1>
  
        <div style="margin-bottom:8px;font-size:8px;">
          Endereço: Praça Dr. Carlos Versiani<br/>
          Centro, Montes Claros ‑ MG, 39400‑612
        </div>
  
        <div style="font-size:8px;margin-bottom:12px;">
          Não nos responsabilizamos por objetos deixados.<br/>
          Funcionamento: seg a sex ‑ 08:00 às 18:00
        </div>
  
        <div style="margin-bottom:12px;">
          <div style="font-size:24px;font-weight:bold;">${placa}</div>
          <div style="text-transform:capitalize;">${tipo}</div>
        </div>
  
        <div style="font-size:11px;margin-bottom:18px;">
          <strong>Entrada:</strong><br/> ${entrada}
        </div>
  
        <!-- Código de barras -->
        <svg id="barcode" style="margin:0 auto"></svg>
  
        <div style="border-top:1px dashed #000;padding-top:6px;font-size:11px;margin-top:18px;">
          Guarde este comprovante para liberação
        </div>
      </div>
    `;

    setTimeout(() => {
        const win = window.open('', '', 'width=400,height=600');

        win.document.write(`
        <html>
          <head>
            <title>Comprovante</title>
            <style>
              @page { size: 58mm auto; margin: 0; }
              body { margin: 0; padding: 0; font-family: monospace; }
            </style>
            <!-- JsBarcode CDN (±7 kB) -->
            <script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.5/dist/JsBarcode.all.min.js"></script>
          </head>
          <body>${html}
            <script>
              window.onload = function () {
                JsBarcode("#barcode", "${id}", {
                  format: "CODE128",
                  displayValue: false,
                  height: 40,
                  margin: 0,
                });
                window.print();
                window.close();
              };
            </script>
          </body>
        </html>
      `);

        win.document.close();
        win.focus();
        callback();
    }, 200);
};
