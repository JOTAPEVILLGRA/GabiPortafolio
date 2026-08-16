"use client";

import { FormEvent, useMemo, useState } from "react";

type AppointmentDraft = {
  service: string;
  date: string;
  time: string;
  name: string;
  email: string;
  phone: string;
};

type AppointmentErrors = Partial<Record<keyof AppointmentDraft, string>>;

const initialDraft: AppointmentDraft = {
  service: "",
  date: "",
  time: "",
  name: "",
  email: "",
  phone: "",
};

const services = [
  {
    number: "01",
    title: "Evaluación integral",
    description: "Una revisión completa para comprender tu salud oral y definir un plan claro y personalizado.",
  },
  {
    number: "02",
    title: "Prevención y cuidado",
    description: "Limpiezas, controles y hábitos sostenibles para cuidar tu sonrisa en cada etapa.",
  },
  {
    number: "03",
    title: "Estética consciente",
    description: "Soluciones sutiles que respetan tu expresión, proporciones y bienestar a largo plazo.",
  },
  {
    number: "04",
    title: "Restauración funcional",
    description: "Tratamientos pensados para recuperar comodidad, armonía y confianza al sonreír.",
  },
];

const times = ["09:00", "10:30", "12:00", "15:00", "16:30", "18:00"];

function localToday() {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  return new Date(now.getTime() - offset * 60_000).toISOString().split("T")[0];
}

export default function Home() {
  const [draft, setDraft] = useState<AppointmentDraft>(initialDraft);
  const [errors, setErrors] = useState<AppointmentErrors>({});
  const [confirmed, setConfirmed] = useState(false);
  const today = useMemo(localToday, []);
  const availableDates = useMemo(() => {
    const dates: Array<{ value: string; label: string }> = [];
    const cursor = new Date(`${localToday()}T12:00:00`);
    while (dates.length < 6) {
      const day = cursor.getDay();
      if (day !== 0) {
        dates.push({
          value: cursor.toISOString().split("T")[0],
          label: cursor.toLocaleDateString("es-CL", { weekday: "long", day: "numeric", month: "long" }),
        });
      }
      cursor.setDate(cursor.getDate() + 1);
    }
    return dates;
  }, []);

  function updateField(field: keyof AppointmentDraft, value: string) {
    setDraft((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  function validate() {
    const nextErrors: AppointmentErrors = {};
    if (!draft.service) nextErrors.service = "Elige un tipo de atención.";
    if (!draft.date) nextErrors.date = "Elige una fecha.";
    else if (draft.date < today) nextErrors.date = "La fecha debe ser desde hoy en adelante.";
    if (!draft.time) nextErrors.time = "Elige un horario.";
    if (!draft.name.trim()) nextErrors.name = "Ingresa tu nombre.";
    if (!/^\S+@\S+\.\S+$/.test(draft.email)) nextErrors.email = "Ingresa un correo válido.";
    if (!/^[+\d][\d\s()-]{7,}$/.test(draft.phone)) nextErrors.phone = "Ingresa un teléfono válido.";
    return nextErrors;
  }

  function submitAppointment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validate();
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      const firstInvalid = Object.keys(nextErrors)[0];
      document.getElementById(firstInvalid)?.focus();
      return;
    }
    setConfirmed(true);
  }

  function restart() {
    setDraft(initialDraft);
    setErrors({});
    setConfirmed(false);
  }

  return (
    <main>
      <div className="demo-bar" role="note">
        Sitio demostrativo · Los datos profesionales y de contacto son ficticios
      </div>

      <header className="site-header">
        <a className="brand" href="#inicio" aria-label="Ir al inicio">
          <span>GU</span>
          <strong>Gabriela Urrutia</strong>
        </a>
        <nav aria-label="Navegación principal">
          <a href="#enfoque">Enfoque</a>
          <a href="#servicios">Servicios</a>
          <a href="#experiencia">Experiencia</a>
          <a href="#contacto">Contacto</a>
        </nav>
        <a className="button button-small" href="#agenda">Agendar cita</a>
      </header>

      <section className="hero" id="inicio">
        <div className="hero-copy">
          <p className="eyebrow">Odontología integral · Atención personalizada</p>
          <h1>Una odontología<br />serena, precisa<br /><em>y cercana.</em></h1>
          <p className="hero-lede">
            Cuidar tu sonrisa también es cuidar cómo te sientes. Un enfoque completo,
            claro y humano para acompañarte con confianza.
          </p>
          <div className="hero-actions">
            <a className="button" href="#agenda">Agendar una cita</a>
            <a className="text-link" href="#enfoque">Conocer mi enfoque <span aria-hidden="true">↘</span></a>
          </div>
        </div>
        <figure className="hero-image">
          <img src="/hero-instrumental.png" alt="Manos enguantadas organizando instrumental odontológico sobre una bandeja" />
          <figcaption>Precisión en cada detalle</figcaption>
        </figure>
      </section>

      <section className="trust-strip" aria-label="Principios de atención">
        <span>Atención integral</span><i aria-hidden="true">✦</i>
        <span>Diagnóstico cuidadoso</span><i aria-hidden="true">✦</i>
        <span>Trato cercano</span><i aria-hidden="true">✦</i>
        <span>Planificación clara</span>
      </section>

      <section className="about section" id="enfoque">
        <div className="section-label"><span>01</span> Mi enfoque</div>
        <div className="about-copy">
          <p className="eyebrow">Dra. Gabriela Urrutia</p>
          <h2>Escuchar primero.<br /><em>Cuidar siempre.</em></h2>
          <p className="lead">Creo en una odontología que combina criterio clínico, atención al detalle y una conversación honesta.</p>
          <div className="columns">
            <p>Cada tratamiento comienza entendiendo qué necesitas, qué te preocupa y qué esperas. Sin prisas, sin respuestas estándar.</p>
            <p>El objetivo es construir un plan que tenga sentido para ti: cuidadoso, comprensible y pensado para durar.</p>
          </div>
          <div className="signature">Gabriela Urrutia <small>Odontología integral</small></div>
        </div>
      </section>

      <section className="services section" id="servicios">
        <div className="section-label light"><span>02</span> Servicios</div>
        <div className="services-heading">
          <h2>Cuidado completo,<br /><em>decisiones simples.</em></h2>
          <p>Soluciones integrales para prevenir, recuperar y acompañar tu salud oral con claridad.</p>
        </div>
        <div className="service-grid">
          {services.map((service) => (
            <article className="service-card" key={service.title}>
              <span>{service.number}</span>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
              <a href="#agenda" aria-label={`Agendar ${service.title}`}>Explorar atención <span aria-hidden="true">↗</span></a>
            </article>
          ))}
        </div>
      </section>

      <section className="experience section" id="experiencia">
        <figure className="clinic-image">
          <img src="/consultorio.png" alt="Consultorio dental contemporáneo vacío, luminoso y de tonos cálidos" />
          <span>Imagen ilustrativa generada con IA</span>
        </figure>
        <div className="experience-copy">
          <div className="section-label"><span>03</span> La experiencia</div>
          <h2>Sentirte bien<br />también es parte<br /><em>del tratamiento.</em></h2>
          <div className="experience-list">
            <div><strong>01</strong><p><b>Conversamos</b>Una primera visita para escuchar, revisar y resolver tus dudas.</p></div>
            <div><strong>02</strong><p><b>Planificamos</b>Alternativas claras, prioridades y tiempos que puedas comprender.</p></div>
            <div><strong>03</strong><p><b>Te acompañamos</b>Seguimiento cercano para cuidar cada avance y resultado.</p></div>
          </div>
        </div>
      </section>

      <section className="cases section" aria-labelledby="cases-title">
        <div className="section-label"><span>04</span> Casos conceptuales</div>
        <div className="cases-heading">
          <h2 id="cases-title">Tratamientos pensados<br /><em>para la vida real.</em></h2>
          <p>Ejemplos ilustrativos del tipo de acompañamiento. No representan casos ni resultados clínicos reales.</p>
        </div>
        <div className="case-grid">
          <article><span>Prevención</span><h3>Volver a sentir tranquilidad en cada control</h3><p>Evaluación integral · Higiene · Plan de seguimiento</p></article>
          <article><span>Función</span><h3>Recuperar comodidad para sonreír y disfrutar</h3><p>Diagnóstico · Restauración · Control periódico</p></article>
          <article><span>Estética consciente</span><h3>Armonizar con sutileza, sin perder naturalidad</h3><p>Planificación · Tratamiento conservador · Cuidado</p></article>
        </div>
      </section>

      <section className="testimonial section">
        <div className="quote-mark" aria-hidden="true">“</div>
        <blockquote>
          <p>Por primera vez entendí cada paso del tratamiento y pude decidir con calma. La atención se sintió cuidadosa desde el comienzo.</p>
          <footer>Testimonio ficticio para demostración</footer>
        </blockquote>
      </section>

      <section className="booking section" id="agenda">
        <div className="booking-intro">
          <div className="section-label light"><span>05</span> Agenda</div>
          <h2>Da el primer paso<br /><em>con tranquilidad.</em></h2>
          <p>Completa este flujo demostrativo y descubre cómo sería solicitar una primera cita.</p>
          <div className="booking-note"><span aria-hidden="true">i</span><p><strong>Demostración interactiva</strong>Este formulario no envía ni almacena información.</p></div>
        </div>

        <div className="booking-panel">
          {confirmed ? (
            <div className="confirmation" role="status" aria-live="polite">
              <span className="confirmation-icon" aria-hidden="true">✓</span>
              <p className="eyebrow">Solicitud preparada</p>
              <h3>Gracias, {draft.name.split(" ")[0]}.</h3>
              <p>Esta es una confirmación de demostración. No se ha enviado ni guardado ninguna reserva.</p>
              <dl>
                <div><dt>Atención</dt><dd>{draft.service}</dd></div>
                <div><dt>Fecha</dt><dd>{new Date(`${draft.date}T12:00:00`).toLocaleDateString("es-CL", { day: "numeric", month: "long", year: "numeric" })}</dd></div>
                <div><dt>Horario</dt><dd>{draft.time} hrs</dd></div>
                <div><dt>Contacto</dt><dd>{draft.email}</dd></div>
              </dl>
              <button className="button" type="button" onClick={restart}>Comenzar de nuevo</button>
            </div>
          ) : (
            <form onSubmit={submitAppointment} noValidate>
              <div className="form-heading"><span>01</span><h3>Cuéntanos qué necesitas</h3></div>
              <label htmlFor="service">Tipo de atención</label>
              <select id="service" value={draft.service} onChange={(e) => updateField("service", e.target.value)} aria-invalid={!!errors.service} aria-describedby={errors.service ? "service-error" : undefined}>
                <option value="">Selecciona una opción</option>
                {services.map((service) => <option key={service.title}>{service.title}</option>)}
              </select>
              {errors.service && <span className="field-error" id="service-error">{errors.service}</span>}

              <div className="form-heading"><span>02</span><h3>Elige cuándo venir</h3></div>
              <label htmlFor="date">Fecha preferida</label>
              <select id="date" value={draft.date} onChange={(e) => updateField("date", e.target.value)} aria-invalid={!!errors.date} aria-describedby={errors.date ? "date-error" : undefined}>
                <option value="">Selecciona una fecha disponible</option>
                {availableDates.map((date) => <option value={date.value} key={date.value}>{date.label}</option>)}
              </select>
              {errors.date && <span className="field-error" id="date-error">{errors.date}</span>}
              <fieldset>
                <legend>Horario</legend>
                <div className="time-grid">
                  {times.map((time) => (
                    <label className={draft.time === time ? "selected" : ""} key={time}>
                      <input type="radio" name="time" value={time} checked={draft.time === time} onChange={(e) => updateField("time", e.target.value)} />
                      {time}
                    </label>
                  ))}
                </div>
              </fieldset>
              {errors.time && <span className="field-error">{errors.time}</span>}

              <div className="form-heading"><span>03</span><h3>Tus datos de contacto</h3></div>
              <label htmlFor="name">Nombre completo</label>
              <input id="name" autoComplete="name" value={draft.name} onChange={(e) => updateField("name", e.target.value)} placeholder="Ej. Camila Rojas" aria-invalid={!!errors.name} aria-describedby={errors.name ? "name-error" : undefined} />
              {errors.name && <span className="field-error" id="name-error">{errors.name}</span>}
              <div className="field-row">
                <div><label htmlFor="email">Correo</label><input id="email" type="email" autoComplete="email" value={draft.email} onChange={(e) => updateField("email", e.target.value)} placeholder="nombre@correo.cl" aria-invalid={!!errors.email} />{errors.email && <span className="field-error">{errors.email}</span>}</div>
                <div><label htmlFor="phone">Teléfono</label><input id="phone" type="tel" autoComplete="tel" value={draft.phone} onChange={(e) => updateField("phone", e.target.value)} placeholder="+56 9 1234 5678" aria-invalid={!!errors.phone} />{errors.phone && <span className="field-error">{errors.phone}</span>}</div>
              </div>
              <button className="button submit-button" type="submit">Preparar solicitud <span aria-hidden="true">→</span></button>
              <p className="privacy-note">No se enviarán ni almacenarán los datos ingresados.</p>
            </form>
          )}
        </div>
      </section>

      <footer className="footer" id="contacto">
        <div className="footer-brand"><span>GU</span><h2>Dra. Gabriela Urrutia</h2><p>Odontología integral</p></div>
        <div><h3>Consulta demo</h3><p>Av. Los Castaños 245<br />Providencia, Santiago</p><small>Dirección ficticia</small></div>
        <div><h3>Horarios demo</h3><p>Lun–Vie · 09:00–19:00<br />Sábado · 09:00–13:00</p></div>
        <div><h3>Contacto demo</h3><p>hola@gabrielaurrutia.demo<br />+56 9 0000 0000</p></div>
        <p className="footer-bottom">© 2026 Mockup de portafolio · Todo el contenido de este sitio es demostrativo.</p>
      </footer>
      <a className="mobile-booking" href="#agenda">Agendar cita <span aria-hidden="true">→</span></a>
    </main>
  );
}
