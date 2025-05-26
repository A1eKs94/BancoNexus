const express = require("express");
const cors = require("cors");

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

require("./database");

const User = require("./models/User");
const Cuenta = require("./models/Cuenta");
const Transaccion = require("./models/Transaccion");

app.get("/", (req, res) => {
  res.redirect("http://localhost:5173");
});
// -------------------- CLIENTE --------------------

app.post("/cliente", async (req, res) => {
  const user = new User(req.body);
  await user.save();
  res.status(201).send(user);
});

app.get("/clientes", async (req, res) => {
  try {
    const clientes = await User.find();
    res.send(clientes);
  } catch (error) {
    res.status(500).send({ message: "Error al obtener clientes", error });
  }
});

app.get("/clientes/:id", async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).send({ message: "Cliente no encontrado" });
  res.send(user);
});

// -------------------- CUENTA --------------------

app.post("/cuenta", async (req, res) => {
  const cuenta = new Cuenta(req.body);
  await cuenta.save();
  res.status(201).send(cuenta);
  res.send("No se pudo crear la cuenta.");
});

app.get("/cuentas", async (req, res) => {
  try {
    const cuentas = await Cuenta.find().populate("cliente");
    res.send(cuentas);
  } catch (error) {
    res.status(500).send({ message: "Error al obtener cuentas", error });
  }
});

app.get("/cuenta/:id", async (req, res) => {
  const cuenta = await Cuenta.findById(req.params.id).populate("cliente");
  if (!cuenta) return res.status(404).send({ message: "Cuenta no encontrada" });
  res.send(cuenta);
});

// -------------------- TRANSACCION --------------------

app.post("/transaccion", async (req, res) => {
  try {
    const { cuenta, tipo, cantidad, sucursal } = req.body;

    // Validación opcional
    if (!sucursal) {
      return res.status(400).send({ message: "La sucursal es obligatoria." });
    }

    // Crear transacción con sucursal
    const transaccion = new Transaccion({ cuenta, tipo, cantidad, sucursal });
    await transaccion.save();

    // Obtener la cuenta
    const cuentaDB = await Cuenta.findById(cuenta);
    if (!cuentaDB)
      return res.status(404).send({ message: "Cuenta no encontrada" });

    // Actualizar saldo según tipo
    if (tipo === "deposito") {
      cuentaDB.saldo += cantidad;
    } else if (tipo === "retiro") {
      if (cuentaDB.saldo < cantidad) {
        return res.status(400).send({ message: "Saldo insuficiente" });
      }
      cuentaDB.saldo -= cantidad;
    } else {
      return res.status(400).send({ message: "Tipo de transacción inválido" });
    }

    await cuentaDB.save();

    res.status(201).send(transaccion);
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error al realizar la transacción", error });
  }
});

app.get("/transacciones", async (req, res) => {
  try {
    const transacciones = await Transaccion.find()
      .populate({ path: "cuenta", select: "cuenta" })
      .sort({ fecha: -1 });
    res.send(transacciones);
  } catch (error) {
    res.status(500).send({ message: "Error al obtener transacciones", error });
  }
});

app.get("/transaccion/:id", async (req, res) => {
  const transaccion = await Transaccion.findById(req.params.id).populate(
    "cuenta"
  );
  if (!transaccion)
    return res.status(404).send({ message: "Transacción no encontrada" });
  res.send(transaccion);
});

app.post("/transferencia", async (req, res) => {
  try {
    const { cuentaOrigen, cuentaDestino, monto, sucursal } = req.body;

    const origen = await Cuenta.findOne({ cuenta: cuentaOrigen });
    const destino = await Cuenta.findOne({ cuenta: cuentaDestino });

    if (!origen || !destino) {
      return res
        .status(404)
        .send({ message: "Cuenta origen o destino no encontrada" });
    }

    if (origen.saldo < monto) {
      return res
        .status(400)
        .send({ message: "Saldo insuficiente en cuenta origen" });
    }

    // Actualiza saldos
    origen.saldo -= monto;
    destino.saldo += monto;

    await origen.save();
    await destino.save();

    // Guarda dos transacciones: retiro y depósito
    await Transaccion.create({
      cuenta: origen._id,
      tipo: "transferencia-salida",
      cantidad: monto,
      sucursal,
    });

    await Transaccion.create({
      cuenta: destino._id,
      tipo: "transferencia-entrada",
      cantidad: monto,
      sucursal,
    });

    res.status(201).send({ message: "Transferencia exitosa" });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error al procesar la transferencia", error });
  }
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
