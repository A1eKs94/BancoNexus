import React, { useEffect, useState } from 'react';
import { Table, Alert } from 'react-bootstrap';
import { obtenerTransacciones } from '../api';

const HistorialTransacciones = () => {
  const [transacciones, setTransacciones] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargarTransacciones = async () => {
      try {
        const data = await obtenerTransacciones();
        setTransacciones(data);
      } catch (err) {
        setError("Error al cargar transacciones.");
        console.error(err);
      }
    };
    cargarTransacciones();
  }, []);

  return (
    <div className="mt-4">
      <h3>Historial de Transacciones</h3>
      {error && <Alert variant="danger">{error}</Alert>}
      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Tipo</th>
            <th>Número de Cuenta</th>
            <th>Monto</th>
            <th>Sucursal</th>
          </tr>
        </thead>
        <tbody>
          {transacciones.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center">
                No hay transacciones registradas.
              </td>
            </tr>
          ) : (
            transacciones.map((tx) => (
              <tr key={tx._id}>
                <td>{new Date(tx.fecha).toLocaleString()}</td>
                <td>{tx.tipo.charAt(0).toUpperCase() + tx.tipo.slice(1)}</td>
                <td>{tx.cuenta?.cuenta || "N/A"}</td>
                <td>${tx.cantidad}</td>
                <td>{tx.sucursal || "Desconocida"}</td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default HistorialTransacciones;
