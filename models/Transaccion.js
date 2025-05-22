const mongoose = require("mongoose");

const transaccionSchema = new mongoose.Schema({
  cuenta: { type: mongoose.Schema.Types.ObjectId, ref: "Cuentas" },
  tipo: String, // 'deposito' o 'retiro'
  cantidad: Number,
  fecha: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Transaccions", transaccionSchema);
