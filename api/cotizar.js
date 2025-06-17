export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { nombre, cc, marca, valor, ciudad, modelo } = req.body;

  function getBaseRate(valor) {
    if (valor < 25000000) return 0.036118;
    if (valor <= 40000000) return 0.0335;
    return 0.031;
  }

  function getFactor(ciudad, modelo) {
    const anio = new Date().getFullYear();
    const antiguedad = anio - modelo;
    const tabla = {
      Bogota: [0.9966, 1.0552, 1.072, 1.1139, 1.1558, 1.248],
      Medellin: [1.0486, 1.1073, 1.124, 1.1659, 1.2078, 1.3],
      Resto: [1.0, 1.0587, 1.0755, 1.1174, 1.1593, 1.2515],
    };
    const index = antiguedad <= 0 ? 0 : antiguedad <= 2 ? 1 : antiguedad <= 4 ? 2 : antiguedad <= 6 ? 3 : antiguedad <= 8 ? 4 : 5;
    return tabla[ciudad]?.[index] || 1;
  }

  const tasa = getBaseRate(valor);
  const factor = getFactor(ciudad, modelo);
  const prima = valor * tasa * factor;

  res.status(200).json({ prima });
}