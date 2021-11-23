import React, { useState } from 'react';
import api from '../../services/api';
import { Container, Button, Form, FormGroup, Alert, Input } from 'reactstrap';

export default function Register({ history }) {

    //Using useState hook
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');

    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    //Creating method to be used on form submit
    const handleSubmit = async evt => {

        //For preventing browser refresh
        evt.preventDefault();

        if (email !== "" && password !== "" && firstName !== "" && lastName !== "") {
            const response = await api.post('/user/register', { email, password, firstName, lastName });
            const user = response.data.user || false;
            const user_id = response.data.user_id || false;

            if (user && user_id) {
                localStorage.setItem('user', user);
                localStorage.setItem('user', user_id);
                history.push('/')
            } else {
                const { message } = response.data;
                setError(true);
                setErrorMessage(message);
                setTimeout(() => {
                    setError(false)
                    setErrorMessage("")
                }, 2000)
            }
        } else {

            setError(true);
                setErrorMessage("Missing required information");
                setTimeout(() => {
                    setError(false)
                    setErrorMessage("")
                }, 2000)

        }

    }

    return (
        <Container>
            <h2>Register</h2>
            <p><strong>Register</strong> your account.</p>
            <Form onSubmit={handleSubmit}>
                <div className="input-group">
                    <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                        <Input type="text" name="firstName" id="firstName" onChange={evt => setFirstName(evt.target.value)} placeholder="Your First Name" />
                    </FormGroup>
                    <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                        <Input type="text" name="lastName" id="lastName" onChange={evt => setLastName(evt.target.value)} placeholder="Your Last Name" />
                    </FormGroup>
                    <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                        <Input type="email" name="email" id="email" onChange={evt => setEmail(evt.target.value)} placeholder="Your Email" />
                    </FormGroup>
                    <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                        <Input type="password" name="password" id="password" onChange={evt => setPassword(evt.target.value)} placeholder="Your Password" />
                    </FormGroup>
                </div>
                <FormGroup>
                    <Button className="submit-btn">Register</Button>
                </FormGroup>
                <FormGroup>
                    <Button className="secondary-btn" onClick={() => history.push("/login")}>Login</Button>
                </FormGroup>
            </Form>
            {errorMessage ? (
                <Alert className="event-validation" color="danger">Missing required information</Alert>
            ) : ''}
        </Container>
    )
}