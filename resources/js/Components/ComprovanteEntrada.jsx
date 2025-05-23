import React, { forwardRef } from 'react';

const ComprovanteEntrada = forwardRef(({ placa, tipo, entrada, id }, ref) => {
    return (
        <div
            ref={ref}
            style={{
                width: '200px',
                padding: '10px',
                fontFamily: 'monospace',
                fontSize: '12px',
                textAlign: 'center',
                color: '#000',
                backgroundColor: '#fff',
                margin: 'auto',
            }}
        >
            <h4 style={{ fontSize: '10px', margin: '0' }}>
                Previdência Social dos Servidores de Montes Claros
            </h4>
            <h1 style={{ fontSize: '13px', fontWeight: 'bold', margin: '8px 0' }}>
                Estacionamento Shopping Popular Mário Ribeiro da Silveira
            </h1>
            <div style={{ marginBottom: '8px' }}>
                Endereço: Praça Dr. Carlos Versiani<br />
                Centro, Montes Claros - MG, 39400-612
            </div>
            <div style={{ marginBottom: '12px', fontSize: '11px' }}>
                Não nos responsabilizamos por objetos deixados.<br />
                Funcionamento: seg a sex - 08:00 às 18:00
            </div>
            <div style={{ marginBottom: '12px' }}>
                <div style={{ fontSize: '14px', fontWeight: 'bold' }}>{placa}</div>
                <div style={{ textTransform: 'capitalize' }}>{tipo}</div>
            </div>
            <div style={{ textAlign: 'left', fontSize: '11px', marginBottom: '12px' }}>
                <strong>Entrada:</strong> {entrada}
            </div>
            <div style={{ borderTop: '1px dashed #000', paddingTop: '6px', fontSize: '11px' }}>
                Guarde este comprovante para liberação - id:{id}
            </div>
        </div>
    );
});

export default ComprovanteEntrada;
