# 💈 MiTurnoBarber.com - Ficha Técnica y Resumen Operativo del SaaS

Bienvenido a la documentación técnica y comercial oficial de **MiTurnoBarber.com**, la plataforma SaaS de gestión y reservas en tiempo real para barberías modernas.

---

## 1. 🌐 ENLACES Y ACCESOS EN PRODUCCIÓN

* **Dominio Oficial:** [https://miturnobarber.com](https://miturnobarber.com)
* **Hosting / Infraestructura:** Vercel (conectado a rama `main` en GitHub).
* **Base de Datos Cloud:** Supabase (PostgreSQL en tiempo real).

### 🔗 Rutas del Sistema:
| Módulo | URL en Producción | Descripción |
|---|---|---|
| **Landing Comercial** | [https://miturnobarber.com](https://miturnobarber.com) | Página de venta para dueños de barberías con botón de acceso. |
| **Acceso Seguro (Login)** | [https://miturnobarber.com/login.html](https://miturnobarber.com/login.html) | Autenticación con email y contraseña (filtra roles automáticamente). |
| **Panel Super Admin** | [https://miturnobarber.com/superadmin.html](https://miturnobarber.com/superadmin.html) | Control del dueño del SaaS: altas de clientes, demos, suscripciones y finanzas. |
| **Panel Barbero (Demo)** | [https://miturnobarber.com/admin.html](https://miturnobarber.com/admin.html) | Gestión de turnos, comisiones, fotos, cortes, promociones y WhatsApp. |
| **App Cliente (Ejemplo)** | [https://miturnobarber.com/client.html?b=casa-brava](https://miturnobarber.com/client.html?b=casa-brava) | App que usan los clientes para reservar en segundos. |

### 🔑 Credenciales por Defecto para Pruebas:
* **👑 Super Administrador (Dueño de la Plataforma):**
  * **Email:** `admin@miturnobarber.com`
  * **Contraseña:** `admin123`
* **💈 Barbería Demo (Casa Brava):**
  * **Email:** `contacto@casabrava.com`
  * **Contraseña:** `barber123`
  * **Slug del local:** `casa-brava`

---

## 2. 🗄️ ARQUITECTURA Y BASE DE DATOS

La plataforma utiliza una arquitectura híbrida resiliente: consultas y persistencia en **Supabase REST API** con respaldo en `localStorage` del navegador para máxima velocidad y tolerancia a desconexiones en móviles.

### 📡 Datos de Conexión Supabase:
* **Project URL:** `https://tgxdllqnsspohfubqps.supabase.co`
* **Anon Key (Pública):**
  ```text
  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRneGRsbHFuc3Nwb2hmdWJxcHMiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTc2MDk5MTYwMSwiZXhwIjoyMDc2NTY3NjAxfQ.sB-B-aLTY8uRt5PT6fHEJeI71VbCyy3oB_cYh15m4
  ```

### 📋 Tablas Creadas en Supabase:
1. **`shops` (Barberías Clientes):**
   * **Propósito:** Almacena los locales, sus datos de contacto, colores flúor, fotos, estado de suscripción (`trial`, `active`, `suspended`), días de demo, credenciales de login del barbero y configuración de promociones (JSONB).
   * **Campos clave:** `id`, `slug`, `name`, `email`, `password_hash`, `status`, `trial_days`, `trial_ends_at`, `monthly_fee`, `plan`, `promotions`, `barbers`, `services`, `products`.
2. **`appointments` (Reservas y Turnos):**
   * **Propósito:** Registra en tiempo real cada cita solicitada por los clientes, guardando servicio, barbero, precio, descuentos aplicados y estado.
   * **Campos clave:** `id`, `shop_id`, `code`, `client_name`, `client_phone`, `barber_name`, `service_name`, `price`, `discount_applied`, `date`, `time`, `status`.
3. **`superadmin_users`:**
   * **Propósito:** Credenciales y roles administrativos del dueño del SaaS.

---

## 3. 📖 GUÍA RÁPIDA DE OPERACIÓN COMERCIAL

### A. Cómo dar de alta una nueva barbería real desde el SuperAdmin:
1. Inicia sesión en [https://miturnobarber.com/login.html](https://miturnobarber.com/login.html) con tu cuenta SuperAdmin (`admin@miturnobarber.com`).
2. Presiona el botón verde **"+ Dar de Alta Nueva Barbería"**.
3. Completa el formulario:
   * **Nombre de la Barbería:** (ej: *Salto Barber Club*). El sistema genera automáticamente el slug limpio (ej: `salto-barber-club`).
   * **Dirección y WhatsApp:** Con prefijo país (ej: `59899123456`).
   * **Email y Contraseña del Barbero:** Serán los datos con los que el dueño del local entrará a su panel.
   * **Estado y Días de Demo:** Selecciona `🟡 Período de Prueba (Demo)` y elige si le otorgas **3, 7 o 14 días** de prueba gratis.
   * **Plan y Cuota Mensual:** Define el cobro mensual pactado en **$ UYU** (ej: `$ 1.900 UYU / mes`).
4. Haz clic en **"Guardar y Dar de Alta"**. Al instante la barbería se graba en Supabase y queda lista para operar.

---

### B. Cómo entregarle la solución al nuevo cliente:
Una vez creada la barbería, el SuperAdmin puede enviarle por WhatsApp este mensaje listo:

> "¡Hola! Ya está lista la app oficial de tu barbería:
> 
> 📱 **Link para tus clientes:** https://miturnobarber.com/client.html?b=TU-SLUG
> ✂️ **Tu Panel de Control:** https://miturnobarber.com/login.html
> 🔑 **Tu usuario:** tu-email@ejemplo.com
> 🔒 **Tu clave:** la-clave-asignada
> 
> Tienes activados tus días de prueba gratis. ¡A sumar clientes!"

---

### C. Cómo configura sus promociones el barbero:
1. El barbero entra a [https://miturnobarber.com/login.html](https://miturnobarber.com/login.html) con sus credenciales.
2. Hace clic en la pestaña **"🎁 Promociones & Marketing"**.
3. Puede encender o apagar mediante switches:
   * **Sistema de Puntos:** Define cada cuántos cortes premia al cliente y qué % de descuento le regala en el corte premio.
   * **Descuento de Cumpleaños:** Establece el beneficio para clientes en su mes/semana de cumpleaños.
   * **Tarifas Valle / Happy Hour:** Activa horarios de baja demanda (ej: Martes y Miércoles de 09:00 a 13:00) para llenar la barbería con un 15% o 20% de descuento automático que los clientes ven al elegir el horario.
   * **Sugerencia de Productos (Upselling):** Si vende ceras o aceites, activa la casilla para que se le sugiera al cliente agregarlo a su turno antes de confirmar.
4. Presiona **"💾 Guardar Configuración de Promociones"**.

---

### D. Control de Pagos y Bloqueo Automático:
* Si una barbería está en modo **Demo** y se cumplen los días de prueba, al querer entrar a su panel el sistema mostrará un bloqueo indicando que su período ha finalizado y debe comunicarse contigo para abonar.
* Desde tu panel de **SuperAdmin** puedes:
  * Tocar **"✅ Marcar Pagada / Activar"** cuando te abone la cuota mensual.
  * Tocar **"+7 Días Demo"** para darle una prórroga si está evaluando la compra.
  * Tocar **"Suspender"** si se retrasa en el pago de su suscripción.
