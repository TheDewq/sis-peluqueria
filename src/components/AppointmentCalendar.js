// src/components/AppointmentCalendar.js
import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../services/firebase';
import esLocale from '@fullcalendar/core/locales/es';


const AppointmentCalendar = () => {
  const [eventos, setEventos] = useState([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null); // Nuevo estado para cliente seleccionado

  // Cargar citas desde Firestore
  const obtenerCitas = async () => {
    const coleccionCitas = collection(db, 'citas');
    const citasSnapshot = await getDocs(coleccionCitas);
    const listaCitas = citasSnapshot.docs.map(doc => ({
      id: doc.id,
      title: doc.data().title,
      telefono: doc.data().telefono,
      start: doc.data().start.toDate(),
      end: doc.data().end.toDate(),
    }));
    setEventos(listaCitas);
  };

  useEffect(() => {
    obtenerCitas();
  }, []);

  const horarioDisponible = (start, end) => {
    return !eventos.some(evento =>
      (start >= evento.start && start < evento.end) || (end > evento.start && end <= evento.end)
    );
  };

  const manejarSeleccionFecha = async (selectInfo) => {
    const { start, end } = selectInfo;

    if (!horarioDisponible(start, end)) {
      alert('Este horario ya está ocupado. Por favor elija otro.');
      return;
    }

    let nombre = prompt('Ingrese el nombre del cliente:');
    let telefono = prompt('Ingrese el teléfono del cliente:');

    let calendarApi = selectInfo.view.calendar;
    calendarApi.unselect();

    if (nombre && telefono) {
      try {
        const docRef = await addDoc(collection(db, 'citas'), {
          title: nombre,
          telefono: telefono,
          start,
          end,
        });

        setEventos([...eventos, {
          id: docRef.id,
          title: nombre,
          telefono: telefono,
          start,
          end,
        }]);
        alert('Cita agendada exitosamente.');
      } catch (error) {
        console.error('Error al agregar la cita: ', error);
        alert('Error al agendar la cita.');
      }
    }
  };

  const manejarEdicionCita = async (clickInfo) => {
    let nuevoNombre = prompt('Modificar el nombre del cliente:', clickInfo.event.title);
    let nuevoTelefono = prompt('Modificar el teléfono del cliente:', clickInfo.event.extendedProps.telefono);

    if (nuevoNombre && nuevoTelefono) {
      try {
        const eventoRef = doc(db, 'citas', clickInfo.event.id);
        await updateDoc(eventoRef, { title: nuevoNombre, telefono: nuevoTelefono });

        const eventosActualizados = eventos.map(evento =>
          evento.id === clickInfo.event.id ? { ...evento, title: nuevoNombre, telefono: nuevoTelefono } : evento
        );
        setEventos(eventosActualizados);

        clickInfo.event.setProp('title', nuevoNombre);
        clickInfo.event.setExtendedProp('telefono', nuevoTelefono);
        alert('Cita modificada exitosamente.');
      } catch (error) {
        console.error('Error al actualizar la cita: ', error);
        alert('Error al modificar la cita.');
      }
    }
  };

  const manejarClicEvento = (clickInfo) => {
    // Al hacer clic en un evento, actualizar el cliente seleccionado
    const citasCliente = eventos.filter(evento => evento.title === clickInfo.event.title);
    setClienteSeleccionado(citasCliente); // Pasar todas las citas del cliente

    // Confirmar si desea editar o eliminar la cita
    if (window.confirm(`¿Desea editar la cita de ${clickInfo.event.title}?`)) {
      manejarEdicionCita(clickInfo);
    } else if (window.confirm(`¿Está seguro de eliminar la cita de ${clickInfo.event.title}?`)) {
      manejarEliminarCita(clickInfo);
    }
  };

  const manejarEliminarCita = async (clickInfo) => {
    try {
      await deleteDoc(doc(db, 'citas', clickInfo.event.id));
      setEventos(eventos.filter(evento => evento.id !== clickInfo.event.id));
      clickInfo.event.remove();
      alert('Cita eliminada exitosamente.');
    } catch (error) {
      console.error('Error al eliminar la cita: ', error);
      alert('Error al eliminar la cita.');
    }
  };

  const manejarArrastreCita = async (info) => {
    const { event } = info;
    const nuevoInicio = event.start;
    const nuevoFin = event.end;

    try {
      const eventoRef = doc(db, 'citas', event.id);
      await updateDoc(eventoRef, {
        start: nuevoInicio,
        end: nuevoFin,
      });

      const eventosActualizados = eventos.map(e =>
        e.id === event.id ? { ...e, start: nuevoInicio, end: nuevoFin } : e
      );
      setEventos(eventosActualizados);

      alert('Cita actualizada exitosamente.');
    } catch (error) {
      console.error('Error al actualizar la cita: ', error);
      alert('Error al actualizar la cita.');
    }
  };

  const renderizarEvento = (info) => {
    const { event } = info;

    return (
      <>
        <span>{event.title}</span>
        <span style={{ fontSize: '0.8em', color: 'gray' }}>Tel: {event.extendedProps.telefono}</span>
      </>
    );
  };

  return (
    <div className="contenedor-calendario">
      <h2>Calendario de Citas</h2>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        locales={[esLocale]}
        locale="es"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay',
        }}
        selectable={true}
        selectMirror={true}
        select={manejarSeleccionFecha}
        events={eventos}
        eventClick={manejarClicEvento}
        eventDrop={manejarArrastreCita}
        editable={true}
        businessHours={{
          daysOfWeek: [1, 2, 3, 4, 5, 6], // Lunes a Sábado
          startTime: '07:00',
          endTime: '23:00',
        }}
        eventOverlap={false}
        selectOverlap={false}
        slotMinTime="07:00:00"
        slotMaxTime="23:00:00"
        eventRender={renderizarEvento}
      />
      
    </div>
  );
};

export default AppointmentCalendar;











