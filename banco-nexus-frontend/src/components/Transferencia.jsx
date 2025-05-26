import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';

function Transferencia() {
  const [datos, setDatos] = useState({
    cuentaOrigen: '',
    cuentaDestino: '',
    monto: '',
    fecha: '',
    sucursal: ''
  });

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setDatos({ ...datos, [name]: value });
  };

  const manejarEnvio = (e) => {
    e.preventDefault();
    console.log('Datos de la transferencia:', datos);
    alert('Transferencia realizada correctamente');
    setDatos({
      cuentaOrigen: '',
      cuentaDestino: '',
      monto: '',
      fecha: '',
      sucursal: ''
    });
  };

  return (
    <div className="mt-4">
      <h3>Realizar Transferencia</h3>
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
          <Form.Label>Fecha (automática)</Form.Label>
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
