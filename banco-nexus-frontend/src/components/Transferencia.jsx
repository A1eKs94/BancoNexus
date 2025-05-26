import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';

function Transferencia() {
  const [datos, setDatos] = useState({
    cuentaOrigen: '',
    cuentaDestino: '',
    monto: '',
    sucursal: ''
  });

  const [mensaje, setMensaje] = useState(null);
  const [error, setError] = useState(null);

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setDatos({ ...datos, [name]: value });
  };

  const manejarEnvio = async (e) => {
    e.preventDefault();
    setMensaje(null);
    setError(null);

    try {
      const respuesta = await fetch('http://localhost:3000/transferencia', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cuentaOrigen: datos.cuentaOrigen,
          cuentaDestino: datos.cuentaDestino,
          monto: parseFloat(datos.monto),
          sucursal: datos.sucursal
        })
      });

      const resultado = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(resultado.message || 'Error en la transferencia');
      }

      setMensaje('Transferencia realizada correctamente');
      setDatos({
        cuentaOrigen: '',
        cuentaDestino: '',
        monto: '',
        sucursal: ''
      });
    } catch (err) {
      setError('❌ ' + err.message);
    }
  };

  return (
    <div className="mt-4">
      <h3>Realizar Transferencia</h3>

      {mensaje && <Alert variant="success">{mensaje}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={manejarEnvio}>
        <Form.Group className="mb-3">
          <Form.Label>Número de cuenta origen</Form.Label>
          <Form.Control
            type="text"
            name="cuentaOrigen"
            value={datos.cuentaOrigen}
            onChange={manejarCambio}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Número de cuenta destino</Form.Label>
          <Form.Control
            type="text"
            name="cuentaDestino"
            value={datos.cuentaDestino}
            onChange={manejarCambio}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Monto</Form.Label>
          <Form.Control
            type="number"
            name="monto"
            value={datos.monto}
            onChange={manejarCambio}
            required
            min="1"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Sucursal</Form.Label>
          <Form.Select
            name="sucursal"
            value={datos.sucursal}
            onChange={manejarCambio}
            required
          >
            <option value="">Selecciona una sucursal</option>
            <option value="CDMX">CDMX</option>
            <option value="GDL">GDL</option>
            <option value="MTY">Monterrey</option>
            <option value="QRO">Querétaro</option>
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Fecha actual</Form.Label>
          <Form.Control
            type="text"
            value={new Date().toLocaleString()}
            disabled
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Transferir
        </Button>
      </Form>
    </div>
  );
}

export default Transferencia;
