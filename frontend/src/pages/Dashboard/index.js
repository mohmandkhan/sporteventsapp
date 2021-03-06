import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import moment from 'moment';
import './dashboard.css'
import { Button, ButtonGroup, Alert } from 'reactstrap';

export default function Dashboard({ history }) {

    const [events, setEvents] = useState([]);
    const user = localStorage.getItem('user');
    const user_id = localStorage.getItem('user_id');
    const [rSelected, setRSelected] = useState(null);
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);


    useEffect(() => {
        getEvents()
    }, [])

    const filterHandler = (query) => {
        setRSelected(null);
        getEvents(query);
    }

    const myEventsHandler = async () => {
        setRSelected('myevents');
        const response = await api.get('/user/events', { headers: { user: user } })
        setEvents(response.data)
    }

    const getEvents = async (filter) => {
        const url = filter ? `/dashboard/${filter}` : '/dashboard'
        const response = await api.get(url, { headers: { user: user } })

        setEvents(response.data)
    }

    const deleteEventHandler = async (eventId) => {
        try {

            await api.delete(`/event/${eventId}`);
            setSuccess(true);
            setTimeout(() => {
                setSuccess(false);
                filterHandler(null);
            }, 2000)

        } catch (error) {
            setError(true);
            setTimeout(() => {
                setError(false);
            }, 2000)
        }
    }

    console.log(events);

    return (
        <>
            <div className="filter-panel">
                Filter:
                <ButtonGroup>
                    <Button color="primary" onClick={() => filterHandler(null)} active={rSelected === null}>All Sports</Button>
                    <Button color="primary" onClick={myEventsHandler} active={rSelected === "myevents"}>My Events</Button>
                    <Button color="primary" onClick={() => filterHandler("running")} active={rSelected === "running"}>Running</Button>
                    <Button color="primary" onClick={() => filterHandler("cycling")} active={rSelected === "cycling"}>Cycling</Button>
                    <Button color="primary" onClick={() => filterHandler("swimming")} active={rSelected === "swimming"}>Swimming</Button>
                </ButtonGroup>
                <Button color="primary" onClick={() => history.push('/events')}>New Event</Button>
            </div>
            <ul className="events-list">
                {events.map(event => (
                    <li key={event._id}>
                        <header style={{ backgroundImage: `url(${event.thumbnail_url})` }}>
                            {event.user === user_id ? <div><Button color="danger" size="sm" onClick={() => deleteEventHandler(event._id)}>Delete</Button></div> : ""}
                        </header>
                        <strong>{event.title}</strong>
                        <span>Event Date: {moment(event.date).format('l')}</span>
                        <span>Event Price: {parseFloat(event.price).toFixed(2)}</span>
                        <span>{event.description}</span>
                        <Button color="primary">Subscribe</Button>
                    </li>
                ))}
            </ul>
            {error ? (
                <Alert className="event-validation" color="danger">Error deleting the event</Alert>
            ) : ''}
            {success ? (
                <Alert className="event-validation" color="success">Event deleted successfully</Alert>
            ) : ''}
        </>
    )
}