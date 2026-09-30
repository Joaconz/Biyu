// Fuente única de los casos de prueba de la Entrega 1. Sale de docs/10-catalogo-casos-v1.md
// (68 casos, mismos IDs y oráculos) más 6 casos nuevos para US-66 y US-68, que no tenían ninguno.
// Cada paso lleva su resultado esperado, como en la plantilla "TPO - TC and Defect Template".
// `feliz`: marca de "camino feliz" (columna del ejemplo TaskMaster).
//
// Los pasos están escritos para que una persona los siga en la app sin conocerla: cada uno nombra
// el botón o campo con el texto que se ve en pantalla. Los datos previos que necesita un caso van
// en `pre`, con su recorrido. Los helpers de abajo arman los recorridos que se repiten (registrar un
// gasto, abrir Ajustes, crear una cuenta), así se escriben igual en todos los casos.

// ---------------- Precondiciones comunes ----------------
const SESION = 'Sesión iniciada con el usuario de prueba: en /login, completar "Email" y "Contraseña" y tocar "Entrar". Si aparece la configuración inicial, tocar "Saltear" en sus 4 pasos.'
const API = 'Para la variante API: la anon key del proyecto y el token de sesión del usuario. La llamada se hace fuera de la pantalla (Postman o curl contra /rest/v1, o la consola del navegador con el cliente de Supabase de la app).'
const DOS_USUARIOS = 'Dos usuarios de prueba, A y B, cada uno con sus propios datos cargados, y el token de sesión de cada uno.'
const TC_1250 = 'Tipo de cambio de referencia del mes actual = 1250: en Ajustes → "Tipo de cambio de referencia", elegir el mes actual en "Mes", escribir 1250 en "ARS por USD" y tocar "Guardar tipo de cambio".'
const VISA = 'Cuenta "Visa BBVA" de tipo "Tarjeta de crédito": en Ajustes → "Cuentas", escribir "Visa BBVA" en "Nueva cuenta", elegir "Tarjeta de crédito" en "Tipo" y tocar "Crear cuenta".'

// ---------------- Recorridos que se repiten ----------------
const abrirAjustes = ['Tocar el engranaje "Ajustes" arriba a la derecha (en computadora, "Ajustes" en el menú lateral).', 'Se abre Ajustes con las secciones Categorías, Cuentas y Tipo de cambio de referencia.']
const abrir = (destino, esperado) => [`En la barra de navegación de abajo (en computadora, el menú lateral), tocar "${destino}".`, esperado]
const abrirRegistrar = abrir('Registrar', 'Se abre Registrar en el paso 1/3 ("¿Cuánto?"), con "Gasto" y "ARS" seleccionados y el cursor en el monto.')

/**
 * Registrar un gasto (o ingreso) completo por la pantalla, en los pasos de ADR-024:
 * monto → categoría → detalles → Guardar. `final` reemplaza el resultado esperado del último paso.
 */
function registrar({ tipo = 'Gasto', monto, moneda = 'ARS', tc, categoria = 'Otros', cuenta, cuotas, fecha, nota, guardar = true, final }) {
  const pasos = [abrirRegistrar]
  if (tipo === 'Ingreso') pasos.push(['Tocar "Ingreso".', 'Queda seleccionado "Ingreso".'])
  if (moneda === 'USD') {
    pasos.push(['Tocar "US$".', 'Aparece el campo "Tipo de cambio (ARS por US$)" debajo del monto.'])
  }
  pasos.push([`Escribir ${monto} en el monto.`, 'El monto queda cargado y se habilita "Siguiente".'])
  if (tc) pasos.push([`En "Tipo de cambio (ARS por US$)", borrar el valor y escribir ${tc}.`, 'El campo muestra el valor nuevo.'])
  if (tipo === 'Ingreso') {
    pasos.push(['Tocar "Siguiente".', 'Pasa al paso de detalles, sin elegir categoría (un ingreso no la lleva).'])
  } else {
    pasos.push(['Tocar "Siguiente".', 'Pasa al paso 2/3 ("¿En qué?") con la grilla de categorías.'])
    pasos.push([`Tocar el chip "${categoria}".`, 'Avanza solo al paso 3/3 ("Revisá y guardá").'])
  }
  if (cuenta) pasos.push([`En "Cuenta", tocar "${cuenta}".`, `"${cuenta}" queda marcada.`])
  if (cuotas) pasos.push([`En "Cuotas", tocar "${cuotas}".`, `Debajo aparece la previsualización de las ${cuotas} cuotas.`])
  if (fecha) pasos.push([`En "Fecha", tocar "Otra" y escribir ${fecha} en el campo de fecha.`, 'La fecha queda cargada.'])
  if (nota) pasos.push([`En "Nota (opcional)", escribir "${nota}".`, 'La nota queda cargada.'])
  if (guardar) {
    const boton = tipo === 'Ingreso' ? 'Guardar ingreso' : 'Guardar gasto'
    const aviso = tipo === 'Ingreso' ? 'Ingreso guardado' : 'Gasto guardado'
    pasos.push([`Tocar "${boton}".`, final ?? `Aparece el aviso "${aviso}" y el botón muestra "Guardado".`])
  }
  return pasos
}

/** Crear una cuenta nueva desde /signup; queda en la configuración inicial (US-68). */
function crearCuenta(email, password = 'Clave123!') {
  return [
    ['Abrir la app. En /login, tocar "Crear una cuenta".', 'Se abre "Crear cuenta" con los campos Email, Contraseña y Confirmar contraseña, y la lista de criterios de contraseña.'],
    [`Escribir ${email} en "Email", ${password} en "Contraseña" y otra vez ${password} en "Confirmar contraseña".`, 'Los cinco criterios de contraseña se marcan con ✓; las dos contraseñas se ven enmascaradas.'],
  ]
}
const saltearSetup = ['En la configuración inicial, tocar "Saltear" en cada uno de los 4 pasos.', 'La configuración inicial termina y se abre Registrar.']

export const CASOS = [
  // ---------------- ACC ----------------
  { id: 'CP-ACC-001', titulo: 'Sin sesión, la app redirige al login', funcionalidad: 'Acceso', historias: ['US-48'], trazas: 'FR-02 · NFR-13', tecnica: 'Caso de uso', tipo: 'Positivo', prioridad: 'Alta', feliz: true, automatizable: 'V3',
    pre: ['Navegador sin sesión de Biyu: ventana de incógnito, o en una ventana normal cerrar sesión desde Ajustes → "Cerrar sesión".'], datos: [],
    pasos: [
      ['Escribir la dirección de la app (la raíz, "/") en la barra del navegador y dar Enter.', 'Redirige a /login?next=%2Fregister.'],
      ['Observar la pantalla.', 'Se ve el formulario "Entrar" (Email, Contraseña, botón "Entrar"); no se renderiza nada de /register.'],
    ] },
  { id: 'CP-ACC-002', titulo: 'Una ruta privada abierta sin sesión conserva el destino', funcionalidad: 'Acceso', historias: ['US-48'], trazas: 'FR-02 · C7', tecnica: 'Adivinación de errores', tipo: 'Negativo', prioridad: 'Alta', feliz: false, automatizable: 'Sí',
    pre: ['Navegador sin sesión de Biyu (ventana de incógnito).'], datos: [],
    pasos: [
      ['Escribir en la barra del navegador la dirección de la app seguida de /settings (por ejemplo http://localhost:5180/settings) y dar Enter, sin pasar antes por /login.', 'Redirige a /login?next=%2Fsettings, conservando el destino original.'],
    ] },
  { id: 'CP-ACC-003', titulo: 'Crear una cuenta con email y contraseña válidos', funcionalidad: 'Registro de usuario', historias: ['US-50', 'US-51'], trazas: 'FR-01 · ADR-011', tecnica: 'Caso de uso', tipo: 'Positivo', prioridad: 'Alta', feliz: true, automatizable: 'V3',
    pre: ['Navegador sin sesión de Biyu.', 'Email sin cuenta previa.'], datos: [['Email', 'nueva@test.local (uno nuevo por corrida)'], ['Contraseña', 'Clave123!']],
    pasos: [
      ['Abrir la app. En /login, tocar "Crear una cuenta".', 'Se ve "Crear cuenta" con los criterios de contraseña.'],
      ['Escribir el email en "Email", Clave123! en "Contraseña" y Clave123! en "Confirmar contraseña".', 'Los criterios se marcan como cumplidos; las contraseñas se ven enmascaradas.'],
      ['Tocar "Crear cuenta".', 'Cuenta creada con sesión activa, sin paso de confirmación por email (ADR-011). Se abre la configuración inicial ("¿Para qué vas a usar Biyu?", US-68).'],
      saltearSetup,
      ['Observar la URL.', 'La app queda en /register.'],
    ] },
  { id: 'CP-ACC-004', titulo: 'Contraseñas que no cumplen los criterios se rechazan', funcionalidad: 'Registro de usuario', historias: ['US-50', 'US-67'], trazas: 'FR-01', tecnica: 'Tabla de decisión', tipo: 'Negativo', prioridad: 'Alta', feliz: false, automatizable: 'Sí',
    pre: ['Navegador sin sesión de Biyu.', 'Un email distinto, sin cuenta previa, para cada contraseña.', API], datos: [['(a)', 'abc1234 — 7 caracteres'], ['(b)', 'abcdefgh — solo minúsculas'], ['(c)', '12345678 — solo números'], ['(d)', 'abcd1234 — sin mayúscula ni especial'], ['(e)', 'Abcd123! — cumple los 5 criterios']],
    pasos: [
      ['Abrir la app. En /login, tocar "Crear una cuenta".', 'Se ve "Crear cuenta" con la lista de los 5 criterios, todos con ○ (pendientes).'],
      ['Escribir un email nuevo y la contraseña (a) en "Contraseña" y en "Confirmar contraseña". Tocar "Crear cuenta".', 'Mensaje "Falta que la contraseña cumpla: …" con los criterios que faltan. No se crea la cuenta.'],
      ['Repetir el paso anterior con (b), (c) y (d), cada una con un email nuevo.', 'Cada una se rechaza con un mensaje que dice qué criterio falta. No se crea la cuenta.'],
      ['Repetir con (e) y un email nuevo.', 'Se acepta: la cuenta se crea y se abre la configuración inicial.'],
      ['Variante API: POST /auth/v1/signup con un email nuevo y la contraseña (d), sin pasar por el formulario.', 'Rechazada: FR-01 pide validar también en el servidor.'],
    ] },
  { id: 'CP-ACC-005', titulo: 'No se puede crear una cuenta con un email ya registrado', funcionalidad: 'Registro de usuario', historias: ['US-50'], trazas: 'FR-01', tecnica: 'Adivinación de errores', tipo: 'Negativo', prioridad: 'Alta', feliz: false, automatizable: 'Sí',
    pre: ['Ya existe una cuenta con el email de prueba (la de CP-ACC-003).', 'Navegador sin sesión de Biyu.', API], datos: [['Email', 'el de CP-ACC-003']],
    pasos: [
      ...crearCuenta('el email de CP-ACC-003'),
      ['Tocar "Crear cuenta".', 'Mensaje "Ya existe una cuenta con ese email". No se crea una segunda cuenta y la pantalla sigue en "Crear cuenta".'],
      ['Variante API: POST /auth/v1/signup con el mismo email.', 'Error user_already_exists / email_exists.'],
    ] },
  { id: 'CP-ACC-006', titulo: 'Credenciales inválidas en el login, sin arrastrar el error al signup', funcionalidad: 'Inicio de sesión', historias: ['US-48', 'US-50'], trazas: 'FR-01', tecnica: 'Adivinación de errores', tipo: 'Negativo', prioridad: 'Media', feliz: false, automatizable: 'Sí',
    pre: ['Navegador sin sesión de Biyu.', 'Email sin cuenta, o contraseña incorrecta para una que existe.'], datos: [['Email', 'noexiste@test.local'], ['Contraseña', 'Cualquiera, por ejemplo Clave123!']],
    pasos: [
      ['Abrir la app en /login.', 'Se ve el formulario "Entrar".'],
      ['Escribir noexiste@test.local en "Email" y Clave123! en "Contraseña". Tocar "Entrar".', 'Mensaje "Email o contraseña incorrectos". La pantalla sigue en /login.'],
      ['Sin recargar la página, tocar "Crear una cuenta" (debajo del botón "Entrar").', 'Se abre /signup y el error anterior no aparece.'],
    ] },
  { id: 'CP-ACC-007', titulo: 'Alta sin sesión (confirmación de email activa) no entra a la app', funcionalidad: 'Registro de usuario', historias: ['US-51'], trazas: 'FR-01 · ADR-011', tecnica: 'Adivinación de errores', tipo: 'Límite', prioridad: 'Media', feliz: false, automatizable: 'No',
    pre: ['Hipotético: "Confirm email" activo en Supabase, de modo que signUp() no devuelve sesión. Para simularlo sin tocar el proyecto, interceptar la respuesta de /auth/v1/signup para que llegue sin sesión (por ejemplo con Playwright, como en la ejecución 1).', 'Navegador sin sesión de Biyu.'], datos: [['Email', 'uno nuevo'], ['Contraseña', 'Clave123!']],
    pasos: [
      ...crearCuenta('un email nuevo'),
      ['Tocar "Crear cuenta", con la respuesta de signup llegando sin sesión.', 'No se redirige a una ruta protegida: la pantalla sigue en /signup y muestra "Te creamos la cuenta, pero hace falta confirmar el email antes de entrar."'],
    ] },
  { id: 'CP-ACC-008', titulo: 'Una cuenta nueva tiene el catálogo inicial sembrado', funcionalidad: 'Configuración', historias: ['US-43', 'US-51'], trazas: 'FR-04 · ADR-014', tecnica: 'Caso de uso', tipo: 'Positivo', prioridad: 'Alta', feliz: true, automatizable: 'V3',
    pre: ['Navegador sin sesión de Biyu.', 'Email sin cuenta previa.'], datos: [['Email', 'uno nuevo'], ['Contraseña', 'Clave123!']],
    pasos: [
      ...crearCuenta('un email nuevo'),
      ['Tocar "Crear cuenta".', 'Se abre la configuración inicial.'],
      saltearSetup,
      abrirAjustes,
      ['Revisar las listas "Categorías" y "Cuentas".', 'Están las 8 categorías (Comida y supermercado, Transporte, Servicios, Entretenimiento, Salud, Educación, Indumentaria, Otros) y las 5 cuentas de FR-04 (Tarjeta de crédito, Tarjeta de débito, Efectivo, Cuenta bancaria, Billetera virtual).'],
    ] },
  { id: 'CP-ACC-009', titulo: 'Cerrar sesión y no poder volver con "atrás"', funcionalidad: 'Cierre de sesión', historias: ['US-64'], trazas: 'FR-03', tecnica: 'Caso de uso', tipo: 'Positivo', prioridad: 'Alta', feliz: true, automatizable: 'V3',
    pre: [SESION], datos: [],
    pasos: [
      abrir('Resumen', 'Se abre el Resumen del mes.'),
      abrirAjustes,
      ['Bajar hasta el final de Ajustes y tocar "Cerrar sesión".', 'La sesión se cierra y redirige a /login.'],
      ['Tocar el botón "atrás" del navegador.', 'No se recupera el acceso: cae otra vez en /login.'],
      ['Volver a iniciar sesión y repetir los pasos 2 a 4 partiendo de Registrar y de Movimientos.', 'Mismo resultado desde cada pantalla.'],
    ] },
  { id: 'CP-ACC-010', titulo: 'La sesión persiste al recargar y al reabrir el navegador', funcionalidad: 'Acceso', historias: ['US-49'], trazas: 'FR-03', tecnica: 'Caso de uso', tipo: 'Positivo', prioridad: 'Media', feliz: true, automatizable: 'No',
    pre: [SESION, 'Estar en Registrar (/register).', 'Ventana normal del navegador, no de incógnito (la sesión se guarda en el navegador).'], datos: [],
    pasos: [
      ['Recargar la pestaña (F5 o el botón de recargar).', 'Sigue en /register sin pedir login.'],
      ['Cerrar el navegador por completo, volver a abrirlo y entrar a la misma dirección de la app.', 'La sesión persiste (localStorage): abre Registrar sin pedir login.'],
    ] },
  { id: 'CP-ACC-011', titulo: 'Aislamiento entre usuarios en todas las tablas (par de autorización)', funcionalidad: 'Autorización', historias: ['US-48'], trazas: 'C7 · NFR-13', tecnica: 'Adivinación de errores', tipo: 'Negativo', prioridad: 'Alta', feliz: false, automatizable: 'Sí',
    pre: [DOS_USUARIOS, 'Id de usuario de A (se ve en la tabla auth.users o en el token de A).', API], datos: [['Tablas', 'categories, accounts, fx_rates, transactions, ledger_entries, debts, subscriptions']],
    pasos: [
      ['Con el token de B, consultar cada tabla filtrando por el id de A: GET /rest/v1/<tabla>?user_id=eq.<id de A>.', 'B ve 0 filas de A en categories, accounts, fx_rates, transactions, ledger_entries, debts y subscriptions.'],
      ['Sin token de usuario, solo con la anon key (rol anon), hacer GET /rest/v1/<tabla> para cada tabla.', 'permission denied (42501) en todas.'],
    ] },
  { id: 'CP-ACC-012', titulo: 'Contraseña y confirmación distintas bloquean el alta', funcionalidad: 'Registro de usuario', historias: ['US-66'], trazas: 'FR-01', tecnica: 'Adivinación de errores', tipo: 'Negativo', prioridad: 'Alta', feliz: false, automatizable: 'Sí', nuevo: true,
    pre: ['Navegador sin sesión de Biyu.', 'Email sin cuenta previa.'], datos: [['Contraseña', 'Clave123!'], ['Confirmar contraseña', 'Clave123?']],
    pasos: [
      ['Abrir la app. En /login, tocar "Crear una cuenta".', 'Se abre "Crear cuenta".'],
      ['Escribir un email nuevo en "Email", Clave123! en "Contraseña" y Clave123? en "Confirmar contraseña".', 'Los dos campos se ven enmascarados.'],
      ['Tocar "Crear cuenta".', 'Mensaje "Las contraseñas no son iguales". No se crea la cuenta y la pantalla sigue en "Crear cuenta".'],
    ] },

  // ---------------- CFG ----------------
  { id: 'CP-CFG-001', titulo: 'Crear una categoría con nombre y color', funcionalidad: 'Categorías', historias: ['US-42'], trazas: 'FR-05', tecnica: 'Caso de uso', tipo: 'Positivo', prioridad: 'Alta', feliz: true, automatizable: 'V3',
    pre: [SESION, 'Usuario con categorías sembradas.'], datos: [['Nombre', 'Mascotas']],
    pasos: [
      abrirAjustes,
      ['En la sección "Categorías", bajar hasta el formulario y escribir "Mascotas" en "Nueva categoría".', 'El nombre queda cargado.'],
      ['Tocar un color de la paleta, distinto del primero.', 'El color elegido queda marcado.'],
      ['Tocar "Crear categoría".', 'Aparece en el listado activo con ese nombre y color.'],
    ] },
  { id: 'CP-CFG-002', titulo: 'Renombrar una categoría y cambiarle el color', funcionalidad: 'Categorías', historias: ['US-42'], trazas: 'FR-05', tecnica: 'Caso de uso', tipo: 'Positivo', prioridad: 'Media', feliz: true, automatizable: 'V3',
    pre: [SESION, 'Categoría "Comida y supermercado" activa.'], datos: [['Nombre nuevo', 'Comida']],
    pasos: [
      abrirAjustes,
      ['En "Categorías", tocar el lápiz ("Editar Comida y supermercado") a la derecha de "Comida y supermercado".', 'Se abre la edición en línea, con el nombre, la paleta y los botones "Cancelar" y "Guardar".'],
      ['Borrar el nombre y escribir "Comida". Tocar otro color de la paleta.', 'Se ven el nombre y el color nuevos.'],
      ['Tocar "Guardar".', 'El listado muestra el nombre y el color nuevos, sin crear una fila nueva.'],
    ] },
  { id: 'CP-CFG-003', titulo: 'No se permiten dos categorías activas con el mismo nombre', funcionalidad: 'Categorías', historias: ['US-42'], trazas: 'FR-05', tecnica: 'Adivinación de errores', tipo: 'Negativo', prioridad: 'Media', feliz: false, automatizable: 'Sí',
    pre: [SESION, 'Existe la categoría activa "Salud".', API], datos: [['Nombre', 'Salud']],
    pasos: [
      abrirAjustes,
      ['En "Nueva categoría", escribir "Salud" y tocar "Crear categoría".', 'Rechazado con "Ya existe una categoría activa con ese nombre". La lista no cambia.'],
      ['Variante API: POST /rest/v1/categories con name "Salud" (insert directo a categories con el mismo nombre).', 'Error 23505 (unique_violation).'],
    ] },
  { id: 'CP-CFG-004', titulo: 'Archivar una categoría con historia', funcionalidad: 'Categorías', historias: ['US-44'], trazas: 'FR-05 · C10', tecnica: 'Caso de uso', tipo: 'Positivo', prioridad: 'Alta', feliz: true, automatizable: 'V3',
    pre: [SESION, '"Entretenimiento" con al menos una transacción que la usa: en Registrar, escribir 8000, tocar "Siguiente", tocar "Entretenimiento", escribir "Cine" en "Nota (opcional)" y tocar "Guardar gasto".'], datos: [['Transacción', '$8.000, nota "Cine"']],
    pasos: [
      abrirAjustes,
      ['En "Categorías", tocar el botón de archivar ("Archivar Entretenimiento") a la derecha de "Entretenimiento".', 'Desaparece del listado activo.'],
      ...registrar({ monto: 1000, guardar: false }).slice(0, 3),
      ['Observar la grilla de categorías.', 'No aparece "Entretenimiento".'],
      abrir('Movimientos', 'Se abre Movimientos del mes actual.'),
      ['Buscar la transacción "Cine" de $8.000.', 'Conserva su categoría y la muestra con una marca de archivada.'],
    ] },
  { id: 'CP-CFG-005', titulo: 'Reusar el nombre de una categoría archivada', funcionalidad: 'Categorías', historias: ['US-42', 'US-44'], trazas: 'FR-05', tecnica: 'Tabla de decisión', tipo: 'Límite', prioridad: 'Baja', feliz: false, automatizable: 'Sí',
    pre: [SESION, 'Categoría "Salidas" archivada y ninguna activa con ese nombre: en Ajustes, crear "Salidas" con "Crear categoría" y después tocar "Archivar Salidas".'], datos: [['Nombre', 'Salidas']],
    pasos: [
      abrirAjustes,
      ['En "Nueva categoría", escribir "Salidas" y tocar "Crear categoría".', 'Se permite: "Salidas" aparece en el listado activo (el índice único solo cuenta las activas).'],
    ] },
  { id: 'CP-CFG-006', titulo: 'Crear una cuenta de tarjeta de crédito', funcionalidad: 'Cuentas', historias: ['US-45'], trazas: 'FR-05 · I6', tecnica: 'Caso de uso', tipo: 'Positivo', prioridad: 'Alta', feliz: true, automatizable: 'V3',
    pre: [SESION, 'Usuario con cuentas sembradas y sin una cuenta llamada "Visa BBVA".'], datos: [['Nombre', 'Visa BBVA'], ['Tipo', 'Tarjeta de crédito'], ['Moneda', 'ARS']],
    pasos: [
      abrirAjustes,
      ['En la sección "Cuentas", escribir "Visa BBVA" en "Nueva cuenta".', 'El nombre queda cargado.'],
      ['Abrir el desplegable "Tipo" y elegir "Tarjeta de crédito". Dejar "ARS" en "Moneda".', 'Se ven "Tarjeta de crédito" y "ARS".'],
      ['Tocar "Crear cuenta".', 'Aparece en la lista con el tipo en español ("Tarjeta de crédito").'],
      ...registrar({ monto: 1000, cuenta: 'Visa BBVA', guardar: false }).slice(0, 4),
      ['En "Cuenta", tocar "Visa BBVA".', 'Se ofrece el selector de cuotas (I6): aparece "Cuotas" con los números 1 a 12.'],
    ] },
  { id: 'CP-CFG-007', titulo: 'No se permiten dos cuentas activas con el mismo nombre', funcionalidad: 'Cuentas', historias: ['US-45'], trazas: 'FR-05', tecnica: 'Adivinación de errores', tipo: 'Negativo', prioridad: 'Media', feliz: false, automatizable: 'Sí',
    pre: [SESION, 'Existe la cuenta activa "Efectivo" (sembrada).', API], datos: [['Nombre', 'Efectivo']],
    pasos: [
      abrirAjustes,
      ['En "Cuentas", escribir "Efectivo" en "Nueva cuenta", elegir cualquier "Tipo" y tocar "Crear cuenta".', 'Rechazado con "Ya existe una cuenta activa con ese nombre". La lista no cambia.'],
      ['Variante API: POST /rest/v1/accounts con name "Efectivo" (insert directo a accounts).', 'Error 23505.'],
    ] },
  { id: 'CP-CFG-008', titulo: 'La siembra concurrente no duplica el catálogo', funcionalidad: 'Configuración', historias: ['US-43'], trazas: 'FR-04 · ADR-014', tecnica: 'Adivinación de errores', tipo: 'Límite', prioridad: 'Alta', feliz: false, automatizable: 'No',
    pre: ['Usuario recién creado por API (POST /auth/v1/signup), todavía sin sembrar: no abrió la app nunca.', 'Acceso de lectura a la base local para contar filas.'], datos: [],
    pasos: [
      ['Iniciar sesión con ese usuario y abrir /register en dos pestañas al mismo tiempo (abrir la segunda pestaña antes de que termine de cargar la primera).', 'Las dos cargan el formulario.'],
      ['En la base, contar las categorías y las cuentas del usuario (select count(*) from categories / accounts where user_id = <id>).', 'Exactamente 8 y 5: sin duplicados.'],
    ] },
  { id: 'CP-CFG-009', titulo: 'Cargar y actualizar el tipo de cambio de referencia del mes', funcionalidad: 'Tipo de cambio', historias: ['US-46'], trazas: 'FR-12', tecnica: 'Caso de uso', tipo: 'Positivo', prioridad: 'Alta', feliz: true, automatizable: 'V3',
    pre: [SESION, 'El mes actual sin tipo de cambio cargado.'], datos: [['TC 1', '1250'], ['TC 2', '1300']],
    pasos: [
      abrirAjustes,
      ['En "Tipo de cambio de referencia", elegir el mes actual en "Mes".', 'El mes queda cargado.'],
      ['Escribir 1250 en "ARS por USD" y tocar "Guardar tipo de cambio".', 'Se crea la referencia del mes: aparece en la lista con $ 1.250,00.'],
      ['Con el mismo mes, escribir 1300 en "ARS por USD" y tocar "Guardar tipo de cambio".', 'Se actualiza a 1300, sin duplicar la fila: la lista sigue teniendo una sola fila para ese mes.'],
    ] },
  { id: 'CP-CFG-010', titulo: 'Tipo de cambio de referencia en cero o negativo', funcionalidad: 'Tipo de cambio', historias: ['US-46'], trazas: 'FR-12', tecnica: 'Valores límite', tipo: 'Límite', prioridad: 'Media', feliz: false, automatizable: 'Sí',
    pre: [SESION, API], datos: [['Valores', '0 · -100 · 0,01']],
    pasos: [
      abrirAjustes,
      ['En "Tipo de cambio de referencia", elegir un mes en "Mes", escribir 0 en "ARS por USD" y tocar "Guardar tipo de cambio".', 'Rechazado con "El tipo de cambio debe ser mayor a cero".'],
      ['Repetir con -100.', 'Rechazado con el mismo mensaje.'],
      ['Repetir con 0,01.', 'Aceptado (mínimo válido): aparece en la lista.'],
      ['Variante API: upsert directo a fx_rates (POST /rest/v1/fx_rates) y llamada a la RPC upsert_fx_rate, las dos con 0 y con -100.', 'Rechazados por la base.'],
    ] },
  { id: 'CP-CFG-011', titulo: 'Después de crear la cuenta aparece la configuración inicial', funcionalidad: 'Configuración inicial', historias: ['US-68'], trazas: 'FR-04 · FR-05', tecnica: 'Caso de uso', tipo: 'Positivo', prioridad: 'Alta', feliz: true, automatizable: 'V3', nuevo: true,
    pre: ['Navegador sin sesión de Biyu.', 'Email sin cuenta previa.'], datos: [['Contraseña', 'Clave123!']],
    pasos: [
      ...crearCuenta('un email nuevo'),
      ['Tocar "Crear cuenta".', 'La cuenta se crea.'],
      ['Observar la pantalla siguiente.', 'Se muestra el setup (elementos con data-testid "setup-"), con los pasos "para qué la usás", categorías, cuentas y primer gasto: se ve "¿Para qué vas a usar Biyu?" con 3 opciones, "Continuar" y "Saltear", y una barra de 4 pasos.'],
    ] },
  { id: 'CP-CFG-012', titulo: 'Saltear todo el setup deja la siembra de siempre', funcionalidad: 'Configuración inicial', historias: ['US-68', 'US-43'], trazas: 'FR-04', tecnica: 'Caso de uso', tipo: 'Positivo', prioridad: 'Media', feliz: false, automatizable: 'V3', nuevo: true,
    pre: ['Cuenta recién creada, con el setup a la vista (pasos 1 a 3 de CP-CFG-011).'], datos: [],
    pasos: [
      ['En "¿Para qué vas a usar Biyu?", tocar "Saltear".', 'Pasa al paso "Tus categorías".'],
      ['En "Tus categorías", tocar "Saltear".', 'Pasa al paso "Tus cuentas".'],
      ['En "Tus cuentas", tocar "Saltear".', 'Pasa al paso "Registrá tu primer gasto".'],
      ['En "Registrá tu primer gasto", tocar "Saltear" (al pie).', 'El setup termina y la app abre en Registrar.'],
      abrirAjustes,
      ['Revisar las listas "Categorías" y "Cuentas".', 'Quedan las 8 categorías y 5 cuentas sembradas (US-43).'],
    ] },
  { id: 'CP-CFG-013', titulo: 'Destildar una categoría en el setup la archiva', funcionalidad: 'Configuración inicial', historias: ['US-68'], trazas: 'FR-05 · C10', tecnica: 'Caso de uso', tipo: 'Positivo', prioridad: 'Media', feliz: false, automatizable: 'V3', nuevo: true,
    pre: ['Cuenta recién creada, con el setup a la vista (pasos 1 a 3 de CP-CFG-011).', 'Acceso de lectura a la base local para verificar el archivado.'], datos: [['Categoría', 'Educación']],
    pasos: [
      ['En "¿Para qué vas a usar Biyu?", tocar "Continuar".', 'Pasa al paso "Tus categorías", con las 8 categorías tildadas.'],
      ['Tocar el tilde a la derecha de "Educación" ("Destildar Educación").', '"Educación" desaparece de la lista.'],
      ['Tocar "Continuar".', 'Sigue el siguiente paso ("Tus cuentas").'],
      ['En la base, consultar las categorías del usuario con nombre "Educación" (select name, archived_at from categories where user_id = <id>).', '"Educación" queda archivada, no borrada: la fila existe con archived_at completado.'],
    ] },
  { id: 'CP-CFG-014', titulo: 'La cuenta elegida como predeterminada viene preseleccionada', funcionalidad: 'Configuración inicial', historias: ['US-68', 'US-07'], trazas: 'FR-06', tecnica: 'Caso de uso', tipo: 'Positivo', prioridad: 'Media', feliz: true, automatizable: 'V3', nuevo: true,
    pre: ['Setup en el paso "Tus cuentas" (por ejemplo, seguir CP-CFG-013 hasta el paso 3).'], datos: [['Cuenta', 'Tarjeta de débito'], ['Monto del primer gasto', '1500']],
    pasos: [
      ['Tocar el círculo a la izquierda de "Tarjeta de débito" ("Marcar Tarjeta de débito como predeterminada").', 'El círculo de "Tarjeta de débito" queda marcado.'],
      ['Tocar "Continuar".', 'Se abre el registro guiado ("Registrá tu primer gasto").'],
      ['Escribir 1500 en el monto y tocar "Siguiente".', 'Pasa a la grilla de categorías.'],
      ['Tocar el chip "Otros".', 'Avanza al paso de detalles.'],
      ['Observar la sección "Cuenta".', '"Tarjeta de débito" viene seleccionada.'],
    ] },
  { id: 'CP-CFG-015', titulo: 'El setup no reaparece y se puede reabrir desde Ajustes', funcionalidad: 'Configuración inicial', historias: ['US-68'], trazas: 'FR-04', tecnica: 'Transición de estados', tipo: 'Límite', prioridad: 'Baja', feliz: false, automatizable: 'V3', nuevo: true,
    pre: ['Setup completado o salteado con una cuenta nueva (por ejemplo, al terminar CP-CFG-014 tocar "Saltear" al pie).', 'Email y contraseña de esa cuenta.'], datos: [],
    pasos: [
      abrirAjustes,
      ['Bajar hasta el final y tocar "Cerrar sesión".', 'Se abre /login.'],
      ['Escribir el email y la contraseña de la cuenta y tocar "Entrar".', 'No aparece el setup: abre Registrar.'],
      abrirAjustes,
      ['Tocar "Volver a hacer la configuración inicial".', 'Se muestra de nuevo el setup ("¿Para qué vas a usar Biyu?").'],
    ] },

  // ---------------- REG ----------------
  { id: 'CP-REG-001', titulo: 'El registro es la pantalla de inicio', funcionalidad: 'Registro de transacciones', historias: ['US-01'], trazas: 'FR-06', tecnica: 'Caso de uso', tipo: 'Positivo', prioridad: 'Alta', feliz: true, automatizable: 'V3',
    pre: [SESION], datos: [],
    pasos: [
      ['Escribir la dirección de la app (la raíz, "/") en la barra del navegador y dar Enter.', 'Cae directo en /register, en el paso del monto (paso 1/3, "¿Cuánto?").'],
    ] },
  { id: 'CP-REG-002', titulo: 'La fecha viene precargada con hoy', funcionalidad: 'Registro de transacciones', historias: ['US-03'], trazas: 'FR-06 · C1', tecnica: 'Caso de uso', tipo: 'Positivo', prioridad: 'Media', feliz: true, automatizable: 'Sí',
    pre: [SESION, 'Hoy = 2026-09-28 (fijado como dato, C1).'], datos: [['Monto', '1500']],
    pasos: [
      ...registrar({ monto: 1500, guardar: false }).slice(0, 3),
      ['Tocar el chip "Otros".', 'Avanza al paso de detalles (ADR-024).'],
      ['Observar la sección "Fecha".', 'Precargada con la fecha de hoy: "Hoy" seleccionado y el campo con 28/09/2026.'],
    ] },
  { id: 'CP-REG-003', titulo: 'Tipo "gasto" y moneda ARS por defecto', funcionalidad: 'Registro de transacciones', historias: ['US-04', 'US-05'], trazas: 'FR-06', tecnica: 'Caso de uso', tipo: 'Positivo', prioridad: 'Baja', feliz: true, automatizable: 'Sí',
    pre: [SESION], datos: [],
    pasos: [
      abrirRegistrar,
      ['Observar el selector de tipo (arriba) y el de moneda (junto al monto).', 'Tipo = Gasto; moneda = ARS; no se muestra tipo de cambio.'],
    ] },
  { id: 'CP-REG-004', titulo: 'Elegir la categoría tocando un chip', funcionalidad: 'Registro de transacciones', historias: ['US-06'], trazas: 'FR-06 · I8', tecnica: 'Caso de uso', tipo: 'Positivo', prioridad: 'Media', feliz: true, automatizable: 'Sí',
    pre: [SESION, 'Categorías activas sembradas.'], datos: [['Monto', '2300'], ['Categoría', 'Transporte']],
    pasos: [
      abrirRegistrar,
      ['Escribir 2300 en el monto y tocar "Siguiente".', 'Se ve la grilla de categorías, sin ningún select.'],
      ['Tocar el chip "Transporte".', 'Avanza solo al paso de detalles.'],
      ['Tocar "Guardar gasto".', 'Aparece "Gasto guardado".'],
      abrir('Movimientos', 'Se abre Movimientos del mes actual.'),
      ['Buscar el movimiento de $2.300.', 'La transacción queda con la categoría "Transporte".'],
    ] },
  { id: 'CP-REG-005', titulo: 'Una categoría archivada no se ofrece ni se acepta por API', funcionalidad: 'Registro de transacciones', historias: ['US-06'], trazas: 'FR-06', tecnica: 'Adivinación de errores', tipo: 'Negativo', prioridad: 'Media', feliz: false, automatizable: 'Sí',
    pre: [SESION, 'Categoría "Salidas" archivada (ver la precondición de CP-CFG-005) y su id.', API], datos: [],
    pasos: [
      abrirRegistrar,
      ['Escribir un monto (por ejemplo 1000) y tocar "Siguiente".', 'La grilla no muestra "Salidas".'],
      ['Variante API: POST /rest/v1/rpc/create_transaction con p_category_id = el id de "Salidas" y el resto de los datos válidos.', 'Rechazado: "la categoría no existe, no es tuya o está archivada".'],
    ] },
  { id: 'CP-REG-006', titulo: 'La cuenta viene precargada con la última usada', funcionalidad: 'Registro de transacciones', historias: ['US-07'], trazas: 'FR-06', tecnica: 'Caso de uso', tipo: 'Positivo', prioridad: 'Baja', feliz: true, automatizable: 'Sí',
    pre: [SESION, VISA, 'La última transacción se guardó con "Visa BBVA": registrar un gasto cualquiera eligiendo "Visa BBVA" en "Cuenta".'], datos: [],
    pasos: [
      abrir('Resumen', 'Se abre el Resumen.'),
      ...registrar({ monto: 1000, guardar: false }).slice(0, 4),
      ['Observar la sección "Cuenta".', '"Visa BBVA" viene seleccionada.'],
    ] },
  { id: 'CP-REG-007', titulo: 'Guardar sin nota', funcionalidad: 'Registro de transacciones', historias: ['US-08'], trazas: 'FR-06', tecnica: 'Valores límite', tipo: 'Límite', prioridad: 'Baja', feliz: false, automatizable: 'Sí',
    pre: [SESION, 'Acceso de lectura a la base local.'], datos: [['Monto', '1234']],
    pasos: [
      ...registrar({ monto: 1234, guardar: false }),
      ['Dejar "Nota (opcional)" vacía y tocar "Guardar gasto".', 'Se guarda sin error ("Gasto guardado").'],
      ['En la base, ver la transacción de $1.234.', 'description = null.'],
    ] },
  { id: 'CP-REG-008', titulo: 'Fecha de ayer sí, fecha de mañana no', funcionalidad: 'Registro de transacciones', historias: ['US-09'], trazas: 'FR-06', tecnica: 'Valores límite', tipo: 'Límite', prioridad: 'Media', feliz: false, automatizable: 'Sí',
    pre: [SESION, 'Hoy = 2026-09-28.', API], datos: [['Ayer', '2026-09-27'], ['Mañana', '2026-09-29']],
    pasos: [
      ...registrar({ monto: 1000, guardar: false }),
      ['En "Fecha", tocar "Ayer".', 'La fecha pasa a 27/09/2026.'],
      ['Tocar "Guardar gasto".', 'Se guarda ("Gasto guardado").'],
      ...registrar({ monto: 1000, guardar: false }).slice(1),
      ['En "Fecha", tocar "Otra" y escribir 29/09/2026 (mañana) en el campo de fecha.', 'Rechazado: "La fecha no puede ser futura", y "Guardar gasto" queda deshabilitado.'],
      ['Variante API: POST /rest/v1/rpc/create_transaction con p_occurred_on = mañana y el resto de los datos válidos.', 'Rechazado también en el servidor.'],
    ] },
  { id: 'CP-REG-009', titulo: 'Confirmación y formulario limpio después de guardar', funcionalidad: 'Registro de transacciones', historias: ['US-10'], trazas: 'FR-06', tecnica: 'Caso de uso', tipo: 'Positivo', prioridad: 'Media', feliz: true, automatizable: 'Sí',
    pre: [SESION], datos: [['Monto', '4500'], ['Cuenta', 'Efectivo']],
    pasos: [
      ...registrar({ monto: 4500, cuenta: 'Efectivo', final: 'Confirmación breve ("Gasto guardado").' }),
      ['Esperar un segundo y observar el formulario.', 'Vuelve al paso del monto, vacío.'],
      ['Escribir un monto, tocar "Siguiente" y tocar un chip de categoría.', 'En "Cuenta" viene seleccionada "Efectivo": conserva la última cuenta usada.'],
    ] },
  { id: 'CP-REG-010', titulo: 'Monto vacío, cero o negativo no se guarda', funcionalidad: 'Registro de transacciones', historias: ['US-11'], trazas: 'FR-06 · I4 · C6', tecnica: 'Valores límite', tipo: 'Negativo', prioridad: 'Alta', feliz: false, automatizable: 'Sí',
    pre: [SESION, API], datos: [['Montos', 'vacío · 0 · -500 · 0,01']],
    pasos: [
      abrirRegistrar,
      ['Dejar el monto vacío.', 'Siguiente queda deshabilitado; no se emite ninguna escritura.'],
      ['Escribir 0 en el monto.', 'Siguiente sigue deshabilitado y el campo dice por qué.'],
      ['Borrar y escribir -500.', 'Siguiente sigue deshabilitado; no se emite ninguna escritura.'],
      ['Borrar y escribir 0,01. Tocar "Siguiente", tocar el chip "Otros" y tocar "Guardar gasto".', 'Se acepta (mínimo válido): "Gasto guardado".'],
      ['Variante API: POST /rest/v1/rpc/create_transaction con p_amount "0" y después "-500".', 'Rechazado con 23514 "I4: el monto debe ser mayor a cero".'],
    ] },
  { id: 'CP-REG-011', titulo: 'Monto con tres decimales', funcionalidad: 'Registro de transacciones', historias: ['US-11'], trazas: 'FR-06 · I4', tecnica: 'Valores límite', tipo: 'Límite', prioridad: 'Media', feliz: false, automatizable: 'Sí',
    pre: [SESION], datos: [['Monto', '100,999']],
    pasos: [
      abrirRegistrar,
      ['Escribir 100,999 en el monto.', 'Rechazado en cliente: "El monto admite hasta 2 decimales", y "Siguiente" queda deshabilitado.'],
    ] },
  { id: 'CP-REG-012', titulo: 'Eliminar una transacción la saca del total del mes', funcionalidad: 'Baja lógica', historias: ['US-65'], trazas: 'FR-08 · C10 · I10', tecnica: 'Caso de uso', tipo: 'Positivo', prioridad: 'Alta', feliz: true, automatizable: 'V3',
    pre: [SESION, 'Transacción de $50.000 ARS en el mes actual, sin cuotas, con nota "Campera": en Registrar, escribir 50000, tocar "Siguiente", tocar "Indumentaria", tocar "Efectivo" en "Cuenta", escribir "Campera" en "Nota (opcional)" y tocar "Guardar gasto".', 'Anotar el total del mes que muestra el Resumen.', 'Acceso de lectura a la base local.'], datos: [['Nota', 'Campera']],
    pasos: [
      abrir('Movimientos', 'Se abre Movimientos del mes actual.'),
      ['En el movimiento "Campera", tocar el tacho ("Eliminar Campera").', 'Se abre el diálogo "¿Eliminar transacción?".'],
      ['Tocar "Eliminar".', 'Se cierra el diálogo y aparece "Transacción eliminada".'],
      abrir('Resumen', 'Se abre el Resumen del mes actual.'),
      ['Comparar "Gastado en …" con el total anotado.', 'El total ya no la incluye (I10): bajó $50.000.'],
      ['En la base, ver la transacción "Campera" (select deleted_at from transactions where description = \'Campera\').', 'deleted_at completado: la transacción sigue existiendo, marcada como eliminada.'],
    ] },
  { id: 'CP-REG-013', titulo: 'Eliminar una compra con cuotas en meses cerrados avisa y es retroactivo', funcionalidad: 'Baja lógica', historias: ['US-65', 'US-18'], trazas: 'FR-08 · C10 · I10', tecnica: 'Adivinación de errores', tipo: 'Límite', prioridad: 'Alta', feliz: false, automatizable: 'V3',
    pre: [SESION, VISA, 'Compra de $120.000 en 12 cuotas registrada el 2026-08-15: en Registrar, escribir 120000, tocar "Siguiente", tocar "Otros", tocar "Visa BBVA", tocar "12" en "Cuotas", en "Fecha" tocar "Otra" y escribir 15/08/2026, y tocar "Guardar gasto".', 'Hoy = 2026-10-15 (agosto y septiembre cerrados): fijar la fecha del navegador (por ejemplo con el reloj simulado de Playwright, como en la ejecución 1).'], datos: [],
    pasos: [
      abrir('Movimientos', 'Se abre Movimientos de octubre 2026, con la cuota 3/12.'),
      ['Tocar el tacho del movimiento de la compra ("Eliminar …").', 'Antes de confirmar, avisa que cambian los totales de meses cerrados (2026-08 y 2026-09): "Aviso: Esta transacción tiene imputaciones en meses ya cerrados…", con la lista de meses y el "Total meses cerrados".'],
      ['Tocar "Eliminar".', 'Aparece "Transacción eliminada".'],
      abrir('Resumen', 'Se abre el Resumen de octubre.'),
      ['Tocar "Mes anterior" (la flecha de la izquierda) hasta llegar a agosto 2026, y después pasar a septiembre 2026.', 'Todas las imputaciones dejan de contar, también las de meses cerrados: agosto y septiembre ya no incluyen sus cuotas (si no hay otros movimientos, muestran el estado vacío).'],
    ] },
  { id: 'CP-REG-014', titulo: 'Otro usuario no puede leer ni borrar una transacción ajena', funcionalidad: 'Autorización', historias: ['US-48'], trazas: 'C7', tecnica: 'Adivinación de errores', tipo: 'Negativo', prioridad: 'Alta', feliz: false, automatizable: 'Sí',
    pre: [DOS_USUARIOS, 'Una transacción de A y su id.', API], datos: [],
    pasos: [
      ['Con el token de B, leer esa transacción por id: GET /rest/v1/transactions?id=eq.<id>.', '0 filas.'],
      ['Con el token de B, intentar eliminarla: POST /rest/v1/rpc/delete_transaction con p_transaction_id = <id>.', 'No la encuentra; la transacción de A queda intacta (sigue activa para A).'],
    ] },
  { id: 'CP-REG-015', titulo: 'No se puede escribir en transactions salteando la RPC', funcionalidad: 'Autorización', historias: ['US-11'], trazas: 'C4 · I1 · I1\'', tecnica: 'Adivinación de errores', tipo: 'Negativo', prioridad: 'Alta', feliz: false, automatizable: 'Sí',
    pre: ['Un usuario de prueba y su token de sesión.', API], datos: [],
    pasos: [
      ['Con el token del usuario, hacer POST /rest/v1/transactions con una fila válida (insert directo, sin la RPC).', 'permission denied (42501): toda escritura pasa por create_transaction (C4).'],
      ['Repetir con POST /rest/v1/ledger_entries.', 'permission denied (42501).'],
    ] },
  { id: 'CP-REG-016', titulo: 'El monto toma el foco con teclado numérico', funcionalidad: 'Registro de transacciones', historias: ['US-02'], trazas: 'FR-06 · NFR-07', tecnica: 'Caso de uso', tipo: 'Positivo', prioridad: 'Media', feliz: true, automatizable: 'No',
    pre: [SESION, 'Un celular real (o emulación táctil del navegador).'], datos: [],
    pasos: [
      abrir('Registrar', 'Se abre Registrar.'),
      ['Sin tocar nada, observar el monto y el teclado.', 'El monto ya tiene el foco y el teclado numérico está abierto.'],
    ] },

  // ---------------- CUO ----------------
  { id: 'CP-CUO-001', titulo: 'Compra en 12 cuotas genera 12 imputaciones consecutivas', funcionalidad: 'Cuotas', historias: ['US-12'], trazas: 'FR-09 · I2 · I3', tecnica: 'Caso de uso', tipo: 'Positivo', prioridad: 'Alta', feliz: true, automatizable: 'V3',
    pre: [SESION, VISA, 'Acceso de lectura a la base local.'], datos: [['Monto', '$120.000'], ['Cuotas', '12']],
    pasos: [
      ...registrar({ monto: 120000, cuenta: 'Visa BBVA', cuotas: 12, final: 'Se guarda ("Gasto guardado").' }),
      ['En la base, consultar las imputaciones de la compra (select installment_number, period from ledger_entries where transaction_id = <id> order by 1).', '12 imputaciones numeradas 1 a 12, en meses consecutivos desde el de la compra.'],
    ] },
  { id: 'CP-CUO-002', titulo: 'Previsualización del impacto mensual antes de guardar', funcionalidad: 'Cuotas', historias: ['US-13'], trazas: 'FR-09', tecnica: 'Caso de uso', tipo: 'Positivo', prioridad: 'Alta', feliz: true, automatizable: 'No',
    pre: [SESION, VISA], datos: [['Gasto', '$120.000 en 12 cuotas con fecha 2026-08-15']],
    pasos: [
      ...registrar({ monto: 120000, cuenta: 'Visa BBVA', cuotas: 12, fecha: '15/08/2026', guardar: false }),
      ['Sin tocar "Guardar gasto", leer el recuadro debajo de "Cuotas".', 'Muestra "12 cuotas de $10.000 — de 2026-08 a 2027-07" antes de tocar Guardar (en pantalla: "12 cuotas de $10.000,00 · de ago 2026 a jul 2027").'],
    ] },
  { id: 'CP-CUO-003', titulo: 'Cambiar a una cuenta que no es crédito resetea las cuotas', funcionalidad: 'Cuotas', historias: ['US-14'], trazas: 'I6', tecnica: 'Tabla de decisión', tipo: 'Negativo', prioridad: 'Alta', feliz: false, automatizable: 'Sí',
    pre: [SESION, VISA, API], datos: [['Monto', '60000'], ['Cuotas', '6']],
    pasos: [
      ...registrar({ monto: 60000, cuenta: 'Visa BBVA', cuotas: 6, guardar: false }),
      ['En "Cuenta", tocar "Efectivo".', 'El selector de cuotas desaparece, el valor vuelve a 1 y hay un aviso ("Las cuotas volvieron a 1").'],
      ['Variante API: POST /rest/v1/rpc/create_transaction con p_installments_count = 6 y el id de la cuenta "Efectivo" (tipo cash).', 'Rechazado por I6.'],
    ] },
  { id: 'CP-CUO-004', titulo: 'División exacta: 12 cuotas iguales', funcionalidad: 'Cuotas', historias: ['US-15'], trazas: 'FR-10 · FR-11 · I1 · I1\' · C3', tecnica: 'Valores límite', tipo: 'Positivo', prioridad: 'Alta', feliz: true, automatizable: 'V3',
    pre: [SESION, VISA, 'Acceso de lectura a la base local.'], datos: [['Monto', '$120.000 en 12 cuotas']],
    pasos: [
      ...registrar({ monto: 120000, cuenta: 'Visa BBVA', cuotas: 12, final: 'Se guarda ("Gasto guardado").' }),
      ['En la base, listar los montos de las 12 imputaciones y sumarlos.', '12 imputaciones de exactamente $10.000; suma $120.000,00 (I1).'],
    ] },
  { id: 'CP-CUO-005', titulo: 'El resto lo absorbe la última cuota', funcionalidad: 'Cuotas', historias: ['US-15'], trazas: 'FR-10 · FR-11 · I1 · C3', tecnica: 'Valores límite', tipo: 'Límite', prioridad: 'Alta', feliz: false, automatizable: 'V3',
    pre: [SESION, VISA, 'Acceso de lectura a la base local.'], datos: [['Monto', '$100.000 en 3 cuotas']],
    pasos: [
      ...registrar({ monto: 100000, cuenta: 'Visa BBVA', cuotas: 3, guardar: false }),
      ['Leer la previsualización debajo de "Cuotas".', 'Muestra "3 cuotas de $33.333,33 · de <mes> a <mes>" y debajo "La última es de $33.333,34".'],
      ['Tocar "Guardar gasto".', 'Se guarda ("Gasto guardado").'],
      ['En la base, listar los montos de las 3 imputaciones.', '$33.333,33 + $33.333,33 + $33.333,34 = $100.000,00. El resto va en la última.'],
    ] },
  { id: 'CP-CUO-006', titulo: 'Cantidad de cuotas: 0, 1, 2, 12 y 13', funcionalidad: 'Cuotas', historias: ['US-15', 'US-12'], trazas: 'FR-09', tecnica: 'Tabla de decisión', tipo: 'Límite', prioridad: 'Alta', feliz: false, automatizable: 'Sí',
    pre: [SESION, VISA, API], datos: [['Cuotas', '0 · 1 · 2 · 12 · 13'], ['Monto', '1200']],
    pasos: [
      ...registrar({ monto: 1200, cuenta: 'Visa BBVA', guardar: false }),
      ['Mirar las opciones de "Cuotas".', 'La pantalla ofrece solo 1 a 12: no hay forma de elegir 0 ni 13 desde la UI.'],
      ['Intentar guardar con cada cantidad: 1, 2 y 12 desde la pantalla (tocar el número y "Guardar gasto", repitiendo el registro), y 0 y 13 por API (POST /rest/v1/rpc/create_transaction con p_installments_count = 0 y = 13).', '0 rechazado; 1, 2 y 12 aceptados; 13 rechazado.'],
    ] },
  { id: 'CP-CUO-007', titulo: 'El Resumen separa las cuotas de meses anteriores', funcionalidad: 'Cuotas', historias: ['US-16'], trazas: 'FR-20', tecnica: 'Caso de uso', tipo: 'Positivo', prioridad: 'Media', feliz: true, automatizable: 'V3',
    pre: [SESION, VISA, 'Gasto de $120.000 en 12 cuotas registrado en 2026-08 (como en la precondición de CP-REG-013) y ningún otro gasto en 2026-09.'], datos: [],
    pasos: [
      abrir('Resumen', 'Se abre el Resumen del mes actual.'),
      ['Con "Mes anterior" / "Mes siguiente" (las flechas junto al título), ir a septiembre 2026.', 'La URL termina en ?period=2026-09.'],
      ['Leer "Gastado en septiembre" y "Cuotas de meses anteriores".', 'El total incluye $10.000 y "Cuotas de meses anteriores" muestra $10.000.'],
    ] },
  { id: 'CP-CUO-008', titulo: 'El listado muestra el número de cuota', funcionalidad: 'Cuotas', historias: ['US-17'], trazas: 'FR-20', tecnica: 'Caso de uso', tipo: 'Positivo', prioridad: 'Baja', feliz: true, automatizable: 'Sí',
    pre: [SESION, 'Compra en 12 cuotas de agosto 2026 (como en la precondición de CP-REG-013); en octubre 2026 cae la cuota 3.'], datos: [],
    pasos: [
      abrir('Movimientos', 'Se abre Movimientos del mes actual.'),
      ['Con las flechas junto al título, ir a octubre 2026.', 'Se ve la imputación de la compra.'],
      ['Mirar la fila de la compra.', 'Muestra "3/12" junto a la imputación.'],
    ] },
  { id: 'CP-CUO-009', titulo: 'Borrar una compra en cuotas saca todas sus cuotas', funcionalidad: 'Cuotas', historias: ['US-18'], trazas: 'FR-08 · I10', tecnica: 'Caso de uso', tipo: 'Positivo', prioridad: 'Alta', feliz: true, automatizable: 'V3',
    pre: [SESION, VISA, 'Compra de $120.000 en 12 cuotas con fecha de hoy: registrarla eligiendo "Visa BBVA" y "12" en "Cuotas".', 'Acceso de lectura a la base local.'], datos: [],
    pasos: [
      abrir('Movimientos', 'Se abre Movimientos del mes actual, con la cuota 1/12.'),
      ['Observar la fila de la compra.', 'Solo tiene la opción de eliminar la compra: no existe la opción de borrar una cuota suelta.'],
      ['Tocar el tacho de la compra y, en el diálogo, tocar "Eliminar".', 'Aparece "Transacción eliminada".'],
      ['En el Resumen, pasar con "Mes siguiente" por los meses siguientes; en la base, contar las imputaciones activas de la compra.', 'Las 12 imputaciones dejan de contar en todos los meses, incluidas las futuras.'],
    ] },
  { id: 'CP-CUO-010', titulo: 'En USD, la suma en pesos de las cuotas es exacta', funcionalidad: 'Cuotas', historias: ['US-15'], trazas: 'C2 · I1\'', tecnica: 'Adivinación de errores', tipo: 'Límite', prioridad: 'Media', feliz: false, automatizable: 'Sí',
    pre: [SESION, VISA, 'Acceso de lectura a la base local.'], datos: [['Gasto', 'USD 100 en 3 cuotas con TC 1250,5555']],
    pasos: [
      ...registrar({ monto: 100, moneda: 'USD', tc: '1250,5555', cuenta: 'Visa BBVA', cuotas: 3, final: 'Se guarda ("Gasto guardado").' }),
      ['En la base, sumar amount_ars de las 3 imputaciones y compararlo con amount_ars de la transacción.', 'Es exactamente transactions.amount_ars (I1\'), sin diferencias de un centavo.'],
    ] },
  { id: 'CP-CUO-011', titulo: 'Otro usuario no ve las cuotas de una compra ajena', funcionalidad: 'Autorización', historias: ['US-48'], trazas: 'C7', tecnica: 'Adivinación de errores', tipo: 'Negativo', prioridad: 'Alta', feliz: false, automatizable: 'Sí',
    pre: [DOS_USUARIOS, 'Una compra en cuotas de A y su id.', API], datos: [],
    pasos: [
      ['Con el token de B, consultar las imputaciones de esa compra: GET /rest/v1/ledger_entries?transaction_id=eq.<id>.', '0 filas.'],
    ] },
  { id: 'CP-CUO-012', titulo: 'Un ingreso no admite cuotas aunque la cuenta sea crédito', funcionalidad: 'Cuotas', historias: ['US-12', 'US-14'], trazas: 'I6', tecnica: 'Tabla de decisión', tipo: 'Negativo', prioridad: 'Alta', feliz: false, automatizable: 'Sí',
    pre: [SESION, VISA, API], datos: [['Monto', '50000']],
    pasos: [
      ...registrar({ tipo: 'Ingreso', monto: 50000, cuenta: 'Visa BBVA', guardar: false }),
      ['Observar el paso de detalles.', 'No aparece el selector de cuotas.'],
      ['Variante API: POST /rest/v1/rpc/create_transaction con p_type = "income", p_installments_count = 3 y el id de "Visa BBVA".', 'Rechazado por I6.'],
    ] },
  { id: 'CP-CUO-013', titulo: 'Un fallo a mitad de create_transaction no deja datos parciales', funcionalidad: 'Cuotas', historias: ['US-15'], trazas: 'C4 · I1 · I1\'', tecnica: 'Adivinación de errores', tipo: 'Negativo', prioridad: 'Alta', feliz: false, automatizable: 'Sí',
    pre: ['Un usuario de prueba con la cuenta "Visa BBVA" y su token de sesión.', API, 'Acceso de lectura a la base local.'], datos: [['Llamada', '$0,02 en 3 cuotas (la cuota base da 0)']],
    pasos: [
      ['En la base, contar las filas de transactions y ledger_entries del usuario.', 'Se anotan los dos números.'],
      ['Forzar que create_transaction falle después de insertar la transacción: POST /rest/v1/rpc/create_transaction con p_amount "0.02", p_installments_count = 3 y "Visa BBVA" (la cuota base da 0 y la función falla al generar las imputaciones).', 'La llamada devuelve error.'],
      ['Volver a contar filas de transactions y ledger_entries.', 'Cero filas nuevas en ambas: todo se revierte (C4).'],
    ] },

  // ---------------- MON ----------------
  { id: 'CP-MON-001', titulo: 'Gasto en USD con el tipo de cambio sugerido', funcionalidad: 'Monedas', historias: ['US-19'], trazas: 'FR-12 · I5', tecnica: 'Tabla de decisión', tipo: 'Positivo', prioridad: 'Alta', feliz: true, automatizable: 'V3',
    pre: [SESION, TC_1250, 'Acceso de lectura a la base local.'], datos: [['Monto', 'USD 100']],
    pasos: [
      abrirRegistrar,
      ['Tocar "US$".', 'Aparece "Tipo de cambio (ARS por US$)" con 1250 sugerido.'],
      ['Escribir 100 en el monto, sin tocar el tipo de cambio. Tocar "Siguiente".', 'Pasa a la grilla de categorías.'],
      ['Tocar el chip "Otros" y después "Guardar gasto".', 'Aparece "Gasto guardado".'],
      ['En la base, ver la transacción.', 'Se guarda con fx_rate = 1250 y amount_ars = 125.000.'],
    ] },
  { id: 'CP-MON-002', titulo: 'Tabla de decisión de moneda y tipo de cambio (6 filas)', funcionalidad: 'Monedas', historias: ['US-19'], trazas: 'FR-12 · I5', tecnica: 'Tabla de decisión', tipo: 'Negativo', prioridad: 'Alta', feliz: false, automatizable: 'Sí',
    pre: [SESION, 'Se ejecuta primero sin referencia del mes (filas 5 y 6) y después con 1250 (filas 1 a 4): ver la precondición de CP-MON-001.', API], datos: [['Filas', 'ARS sin TC · ARS con TC · USD con referencia sin override · USD con referencia con override · USD sin referencia sin TC · USD sin referencia con TC']],
    pasos: [
      ['Fila 5 (USD sin referencia, sin TC): en Registrar, tocar "US$" y escribir 100 en el monto, dejando vacío el tipo de cambio.', 'Aviso "No tenés un tipo de cambio configurado para este mes." con "Ir a Ajustes"; "Siguiente" deshabilitado.'],
      ['Fila 6 (USD sin referencia, con TC): escribir 1300 en "Tipo de cambio (ARS por US$)", tocar "Siguiente", tocar "Otros" y "Guardar gasto".', 'Se guarda.'],
      ['Cargar la referencia del mes en 1250 (en Ajustes, como en CP-MON-001).', 'La referencia queda guardada.'],
      ['Fila 1 (ARS sin TC): registrar un gasto en ARS normal. Fila 3 (USD con referencia sin override): tocar "US$", dejar 1250 y guardar. Fila 4 (USD con referencia con override): tocar "US$", cambiar a 1300 y guardar.', 'Se guardan las filas 1, 3 y 4.'],
      ['Fila 2 (ARS con TC): no se puede armar por la pantalla, porque en ARS no aparece el campo de tipo de cambio. Se prueba por API en el paso siguiente.', 'La pantalla no ofrece tipo de cambio en ARS.'],
      ['Variante API: filas 2 (p_currency "ARS" con p_fx_rate) y 5 (p_currency "USD" sin p_fx_rate) contra create_transaction.', 'Se guardan las filas 1, 3, 4 y 6. Se rechazan la 2 (ARS con TC, I5) y la 5 (USD sin ningún TC, con mensaje que pide el tipo de cambio). Mismo rechazo por API (I5).'],
    ] },
  { id: 'CP-MON-003', titulo: 'Pisar el tipo de cambio sugerido', funcionalidad: 'Monedas', historias: ['US-20', 'US-21'], trazas: 'FR-12', tecnica: 'Caso de uso', tipo: 'Positivo', prioridad: 'Media', feliz: true, automatizable: 'Sí',
    pre: [SESION, TC_1250, 'Acceso de lectura a la base local.'], datos: [['TC propio', '1300']],
    pasos: [
      abrirRegistrar,
      ['Tocar "US$".', 'El campo sugiere 1250.'],
      ['Borrar el tipo de cambio y escribir 1300.', 'Aparece "Estás usando un valor distinto al de referencia. Se aplica solo a esta transacción."'],
      ['Escribir 100 en el monto, tocar "Siguiente", tocar "Otros" y "Guardar gasto".', 'Aparece "Gasto guardado".'],
      ['En la base, ver la transacción.', 'Se guarda con fx_rate = 1300.'],
    ] },
  { id: 'CP-MON-004', titulo: 'Cambiar la referencia no altera lo ya guardado', funcionalidad: 'Monedas', historias: ['US-22'], trazas: 'C5 · ADR-002', tecnica: 'Adivinación de errores', tipo: 'Positivo', prioridad: 'Alta', feliz: false, automatizable: 'V3',
    pre: [SESION, 'Gasto de USD 100 guardado con fx_rate = 1250 (amount_ars = 125.000): seguir CP-MON-001.', 'Anotar el total del mes que muestra el Resumen.'], datos: [['Nueva referencia', '1400']],
    pasos: [
      abrirAjustes,
      ['En "Tipo de cambio de referencia", con el mes actual en "Mes", escribir 1400 en "ARS por USD" y tocar "Guardar tipo de cambio".', 'Se guarda: la lista muestra $ 1.400,00 para el mes.'],
      abrir('Movimientos', 'Se abre Movimientos del mes actual.'),
      ['Ver la transacción de USD 100.', 'La transacción sigue valiendo $125.000.'],
      abrir('Resumen', 'Se abre el Resumen del mes actual.'),
      ['Comparar "Gastado en …" con el total anotado.', 'El total no cambia.'],
    ] },
  { id: 'CP-MON-005', titulo: 'El total del mes en pesos incluye lo gastado en dólares', funcionalidad: 'Monedas', historias: ['US-23'], trazas: 'FR-20 · I1\'', tecnica: 'Caso de uso', tipo: 'Positivo', prioridad: 'Alta', feliz: true, automatizable: 'V3',
    pre: ['Usuario nuevo, sin otros gastos en el mes (para que el total sea solo esto). ' + SESION, TC_1250, 'Un gasto de $50.000 ARS: en Registrar, escribir 50000, tocar "Siguiente", tocar "Comida y supermercado", tocar "Efectivo" y "Guardar gasto".', 'Uno de USD 100 a 1250 en el mismo mes: en Registrar, tocar "US$", escribir 100 (el TC sugerido es 1250), tocar "Siguiente", tocar "Transporte" y "Guardar gasto".'], datos: [],
    pasos: [
      abrir('Resumen', 'Se abre el Resumen del mes actual.'),
      ['Leer el total "Gastado en …".', '$175.000 ($50.000 + $125.000).'],
    ] },
  { id: 'CP-MON-006', titulo: 'El gasto en dólares se ve por separado', funcionalidad: 'Monedas', historias: ['US-24'], trazas: 'FR-20', tecnica: 'Caso de uso', tipo: 'Positivo', prioridad: 'Baja', feliz: true, automatizable: 'Sí',
    pre: ['Los datos de CP-MON-005 (gasto de USD 100 en el mes).', SESION], datos: [],
    pasos: [
      abrir('Resumen', 'Se abre el Resumen del mes actual.'),
      ['Mirar la tarjeta verde, debajo del total.', 'Muestra "USD 100" por separado del total en ARS.'],
    ] },
  { id: 'CP-MON-007', titulo: 'Otro usuario no lee ni modifica el tipo de cambio ajeno', funcionalidad: 'Autorización', historias: ['US-48'], trazas: 'C7', tecnica: 'Adivinación de errores', tipo: 'Negativo', prioridad: 'Alta', feliz: false, automatizable: 'Sí',
    pre: [DOS_USUARIOS, 'fx_rates de A para el mes actual (A cargó su referencia en Ajustes).', API], datos: [],
    pasos: [
      ['Con el token de B, leer esa fila: GET /rest/v1/fx_rates?user_id=eq.<id de A>.', '0 filas al leer.'],
      ['Con el token de B, actualizarla: PATCH /rest/v1/fx_rates?user_id=eq.<id de A> con ars_per_usd = 1.', 'El update afecta 0 filas; el tipo de cambio de A no cambia.'],
    ] },

  // ---------------- DAS ----------------
  { id: 'CP-DAS-001', titulo: 'El Resumen abre en el mes actual con su total', funcionalidad: 'Dashboard', historias: ['US-25'], trazas: 'FR-20 · I10', tecnica: 'Caso de uso', tipo: 'Positivo', prioridad: 'Alta', feliz: true, automatizable: 'V3',
    pre: ['Los datos de CP-MON-005 (transacciones en el mes actual).', SESION], datos: [],
    pasos: [
      abrir('Resumen', 'Se abre /dashboard.'),
      ['Sin tocar el selector de mes, leer el título de la tarjeta verde y el total.', 'Muestra el total gastado del mes actual ("Gastado en <mes actual>").'],
    ] },
  { id: 'CP-DAS-002', titulo: 'El mes elegido vive en la URL', funcionalidad: 'Dashboard', historias: ['US-26'], trazas: 'FR-21 · C11', tecnica: 'Caso de uso', tipo: 'Positivo', prioridad: 'Alta', feliz: true, automatizable: 'Sí',
    pre: [SESION], datos: [],
    pasos: [
      ['Escribir en la barra del navegador la dirección de la app seguida de /dashboard?period=2026-09 y dar Enter.', 'Se abre el Resumen de septiembre 2026.'],
      ['Tocar "Mes siguiente" (la flecha de la derecha, junto al título) dos veces.', 'La URL pasa a period=2026-11.'],
    ] },
  { id: 'CP-DAS-003', titulo: 'Período inválido o ausente cae al mes actual', funcionalidad: 'Dashboard', historias: ['US-26'], trazas: 'C11', tecnica: 'Adivinación de errores', tipo: 'Límite', prioridad: 'Media', feliz: false, automatizable: 'Sí',
    pre: [SESION], datos: [],
    pasos: [
      ['Escribir en la barra del navegador la dirección de la app seguida de /dashboard?period=fecha-invalida y dar Enter.', 'Cae al mes actual sin error visible y corrige la URL.'],
      ['Escribir la dirección de la app seguida de /dashboard, sin parámetro, y dar Enter.', 'Ídem.'],
    ] },
  { id: 'CP-DAS-004', titulo: 'Gasto por categoría en barras', funcionalidad: 'Dashboard', historias: ['US-27'], trazas: 'FR-20', tecnica: 'Caso de uso', tipo: 'Positivo', prioridad: 'Media', feliz: true, automatizable: 'Sí',
    pre: ['Usuario nuevo, sin otros gastos en el mes. ' + SESION, 'Gastos en 3 categorías en el mes actual, registrados desde Registrar: Salud $70.000, Comida y supermercado $50.000, Transporte $30.000.'], datos: [],
    pasos: [
      abrir('Resumen', 'Se abre el Resumen del mes actual.'),
      ['Bajar hasta "Por categoría" y mirar el gráfico.', 'Una barra por categoría con su total, ordenadas de mayor a menor.'],
    ] },
  { id: 'CP-DAS-005', titulo: 'Gasto por cuenta', funcionalidad: 'Dashboard', historias: ['US-28'], trazas: 'FR-20', tecnica: 'Caso de uso', tipo: 'Positivo', prioridad: 'Media', feliz: true, automatizable: 'Sí',
    pre: ['Usuario nuevo, sin otros gastos en el mes. ' + SESION, 'Gastos en 2 cuentas en el mes actual, registrados desde Registrar eligiendo la cuenta en "Cuenta": Efectivo $120.000 (en uno o más gastos), Tarjeta de débito $30.000.'], datos: [],
    pasos: [
      abrir('Resumen', 'Se abre el Resumen del mes actual.'),
      ['Bajar hasta "Por cuenta" y leer los totales.', 'Cada total coincide con la suma manual de sus transacciones.'],
    ] },
  { id: 'CP-DAS-006', titulo: 'Ingresos y balance positivo', funcionalidad: 'Dashboard', historias: ['US-29'], trazas: 'FR-20', tecnica: 'Caso de uso', tipo: 'Positivo', prioridad: 'Media', feliz: true, automatizable: 'Sí',
    pre: ['Usuario nuevo, sin otros movimientos en el mes. ' + SESION, 'Gastos por $150.000 en el mes actual (por ejemplo los de CP-DAS-004).', 'Un ingreso de $200.000: en Registrar, tocar "Ingreso", escribir 200000, tocar "Siguiente", tocar "Cuenta bancaria" y "Guardar ingreso".'], datos: [],
    pasos: [
      abrir('Resumen', 'Se abre el Resumen del mes actual.'),
      ['Leer las tarjetas "Ingresos" y "Balance".', 'Ingresos $200.000; balance +$50.000.'],
    ] },
  { id: 'CP-DAS-007', titulo: 'Balance negativo con signo explícito', funcionalidad: 'Dashboard', historias: ['US-29'], trazas: 'FR-20', tecnica: 'Valores límite', tipo: 'Límite', prioridad: 'Baja', feliz: false, automatizable: 'Sí',
    pre: ['Usuario nuevo, sin otros movimientos en el mes. ' + SESION, 'Un gasto de $200.000 (Registrar → 200000 → "Siguiente" → "Servicios" → "Guardar gasto") y un ingreso de $50.000 (Registrar → "Ingreso" → 50000 → "Siguiente" → "Guardar ingreso").'], datos: [],
    pasos: [
      abrir('Resumen', 'Se abre el Resumen del mes actual.'),
      ['Leer la tarjeta "Balance".', '-$150.000, con signo negativo explícito.'],
    ] },
  { id: 'CP-DAS-008', titulo: 'Últimos 10 movimientos con acceso a la lista completa', funcionalidad: 'Dashboard', historias: ['US-31'], trazas: 'FR-20', tecnica: 'Caso de uso', tipo: 'Positivo', prioridad: 'Media', feliz: true, automatizable: 'Sí',
    pre: ['Usuario nuevo. ' + SESION, '15 transacciones en el mes actual, registradas desde Registrar (15 gastos cualquiera, por ejemplo de $1.000 a $15.000).'], datos: [],
    pasos: [
      abrir('Resumen', 'Se abre el Resumen del mes actual.'),
      ['Bajar hasta "Últimos movimientos" y contar las filas.', 'Muestra 10.'],
      ['Tocar "Ver todos".', 'Abre Movimientos del mes con las 15.'],
    ] },
  { id: 'CP-DAS-009', titulo: 'Una cuota heredada no cuenta como día con registro', funcionalidad: 'Dashboard', historias: ['US-32'], trazas: 'FR-20', tecnica: 'Adivinación de errores', tipo: 'Límite', prioridad: 'Baja', feliz: false, automatizable: 'Sí',
    pre: [SESION, 'Compra en 12 cuotas de agosto 2026 (como en la precondición de CP-REG-013); en diciembre 2026 solo cae su cuota.'], datos: [],
    pasos: [
      abrir('Resumen', 'Se abre el Resumen del mes actual.'),
      ['Con "Mes siguiente" (la flecha de la derecha), ir a diciembre 2026.', 'Se ve el Resumen de diciembre, con la cuota de la compra en el total.'],
      ['Leer "días con registro" en la tarjeta verde.', '0 días.'],
    ] },
  { id: 'CP-DAS-010', titulo: 'Mes sin datos: estado vacío con acceso al registro', funcionalidad: 'Dashboard', historias: ['US-33'], trazas: 'FR-20', tecnica: 'Caso de uso', tipo: 'Límite', prioridad: 'Media', feliz: false, automatizable: 'Sí',
    pre: [SESION, 'Un mes sin ninguna transacción (por ejemplo mayo 2026).'], datos: [],
    pasos: [
      abrir('Resumen', 'Se abre el Resumen del mes actual.'),
      ['Con "Mes anterior" (la flecha de la izquierda), ir a ese mes.', 'Mensaje claro y un botón a /register, no un dashboard de ceros: "No tenés movimientos registrados en <mes>." y "Registrar un gasto".'],
      ['Tocar "Registrar un gasto".', 'Se abre Registrar (/register).'],
    ] },
  { id: 'CP-DAS-011', titulo: 'El Resumen de un usuario nunca muestra datos de otro', funcionalidad: 'Autorización', historias: ['US-48'], trazas: 'C7', tecnica: 'Adivinación de errores', tipo: 'Negativo', prioridad: 'Alta', feliz: false, automatizable: 'Sí',
    pre: [DOS_USUARIOS, 'Resumen de A con datos en el mes actual.', API], datos: [],
    pasos: [
      ['Con el token de B, repetir las consultas del Resumen filtrando por A: GET /rest/v1/ledger_entries?user_id=eq.<id de A>&period=eq.<mes actual>.', '0 filas.'],
      ['Con el token de B, hacer la misma consulta sin filtrar por usuario.', 'Solo devuelve filas de B: ninguna de A.'],
    ] },
]
