import React, { useState, useMemo } from 'react';
import api from '../../services/api';
import { Container, Button, Form, FormGroup, Label, Input, Alert, ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import CameraIcon from '../../assets/camera.jpg';
import './events.css';

export default function EventsPage({ history }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [thumbnail, setThumbnail] = useState(null);
    const [sport, setSport] = useState('Sport');
    const [date, setDate] = useState('');

    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);
    const [dropdownOpen, setOpen] = useState(false);

    const toggle = () => setOpen(!dropdownOpen);

    const preview = useMemo(() => {
        return thumbnail ? URL.createObjectURL(thumbnail) : null;
    }, [thumbnail])


    //console.log(title, description, price, sport, date);

    const submitHandler = async (evt) => {
        evt.preventDefault();
        const user_id = localStorage.getItem('user');
        const eventData = new FormData();
        eventData.append("thumbnail", thumbnail);
        eventData.append("sport", sport);
        eventData.append("title", title);
        eventData.append("price", price);
        eventData.append("description", description);
        eventData.append("date", date);

        try {
            if (title !== '' &&
                description !== '' &&
                price !== '' &&
                sport !== '' &&
                date !== '' &&
                thumbnail !== null) {
                await api.post('/event', eventData, { headers: { user_id } });
                setSuccess(true);
                setTimeout(() => {
                    setSuccess(false);
                    history.push("/");
                }, 2000)
            } else {
                setError(true);
                setTimeout(() => {
                    setError(false);
                }, 2000)

            }
        } catch (error) {
            console.log(error)
        }

    }


    return (
        <Container>
            <h1>Create your event</h1>
            <Form onSubmit={submitHandler}>
                <div className="input-group">
                    <FormGroup>
                        <Label>Upload Image: </Label>
                        <Label id="thumbnail" style={{ backgroundImage: `url(${preview})` }} className={thumbnail ? 'has-thumbnail' : ''}>
                            <Input type="file" onChange={(evt) => setThumbnail(evt.target.files[0])} />
                            <img src={CameraIcon} style={{ maxWidth: '50px' }} alt="Upload Icon Img" />
                        </Label>
                    </FormGroup>
                    <FormGroup>
                        <Label>Title: </Label>
                        <Input id="title" type="text" value={title} placeholder={'Event Title'} onChange={(evt) => setTitle(evt.target.value)} />
                    </FormGroup>
                    <FormGroup>
                        <Label>Description: </Label>
                        <Input id="description" type="text" value={description} placeholder={'Event description'} onChange={(evt) => setDescription(evt.target.value)} />
                    </FormGroup>
                    <FormGroup>
                        <Label>Price: </Label>
                        <Input id="price" type="text" value={price} placeholder={'Event price'} onChange={(evt) => setPrice(evt.target.value)} />
                    </FormGroup>
                    <FormGroup>
                        <Label>Date: </Label>
                        <Input id="date" type="date" value={date} placeholder={'Event date'} onChange={(evt) => setDate(evt.target.value)} />
                    </FormGroup>
                    <FormGroup>
                        <ButtonDropdown isOpen={dropdownOpen} toggle={toggle}>
                            <DropdownToggle caret>
                               {sport}
                            </DropdownToggle>
                            <DropdownMenu>
                                <DropdownItem onClick={() => setSport('running')}>running</DropdownItem>
                                <DropdownItem onClick={() => setSport('cycling')}>cycling</DropdownItem>
                                <DropdownItem onClick={() => setSport('swimming')}>swimming</DropdownItem>
                            </DropdownMenu>
                        </ButtonDropdown>
                    </FormGroup>
                </div>
                <FormGroup>
                    <Button type="submit" className="submit-btn">
                        Create Event
                    </Button>
                </FormGroup>
                <FormGroup>
                    <Button type="submit" className="secondary-btn" onClick={() => history.push("/")}>
                        Cancel
                    </Button>
                </FormGroup>
            </Form>
            {error ? (
                <Alert className="event-validation" color="danger">Missing required information</Alert>
            ) : ''}
            {success ? (
                <Alert className="event-validation" color="success">Event created successfully</Alert>
            ) : ''}
        </Container>
    )
}