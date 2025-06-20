import React from 'react';

/**
 * Gera o HTML completo do ticket – DOCTYPE, <html>, CSS inline e <script> print
 * A ideia é poder convertê-lo em string (ReactDOMServer) e mandar para a nova janela.
 */
export default function ImpressaoTicket({ codigo, tipo, cpf, created_at }) {
    return (
        <html lang="pt-BR">
            <head>
                <meta charSet="utf-8" />
                <title>{codigo}</title>
                <style>{`
                    @page   { margin: 0 }
                    body    { margin: 0; background:#FFF6D2; font-family: monospace; color:#1f2937 }
                    .ticket { position:relative; width:300px; margin:0 auto;
                              padding:24px; box-sizing:border-box;
                              border:6px solid #d9bf4f; }
                    .serri  { position:absolute; left:0; right:0; height:12px;
                              background-repeat:repeat-x;
                              background-image:radial-gradient(circle,transparent 4px,#FFF6D2 5px); }
                    .serri.top { top:-12px } .serri.bot { bottom:-12px }
                    h1      { font-size:48px; margin:0 0 24px; font-weight:800; text-align:center }
                    .divider{ border-top:1px dashed #d9bf4f; margin:24px 0 }
                    .label  { font-size:14px; font-weight:600; text-align:center }
                    .value  { font-size:20px; text-align:center }
                    footer  { font-size:12px; text-align:center; margin-top:24px }
                `}</style>
            </head>

            <body>
                <div className="ticket">
                    <div className="serri top" />
                    <header style={{ textAlign: 'center', marginBottom: 24 }}>
                        <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: 2 }}>PREVMOC</div>
                        <div style={{ fontSize: 12 }}>Sistema de atendimento e Ticket Virtual</div>
                    </header>

                    <h1>{codigo}</h1>

                    <div className="divider" />

                    <div className="label">SERVIÇO</div>
                    <div className="value">{tipo}</div>

                    <div style={{ height: 16 }} />

                    <div className="label">CPF</div>
                    <div className="value">{cpf}</div>

                    <div style={{ marginTop: 20, textAlign: 'center', fontSize: 14 }}>{created_at}</div>

                    <div className="divider" />

                    <footer>Guarde este ticket até o atendimento</footer>
                    <div className="serri bot" />
                </div>

                <script dangerouslySetInnerHTML={{ __html: 'window.print();window.close();' }} />
            </body>
        </html>
    );
}
