import React, { useState } from 'react';
import api from '../../services/api';
import { Container, Button, Form, FormGroup, Alert, Input } from 'reactstrap';

export default function Login({ history }) {

    //Using useState hook
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState(false);

    //Creating method to be used on form submit
    const handleSubmit = async evt => {

        //For preventing browser refresh
        evt.preventDefault();

        const response = await api.post('/login', { email, password });
        const user_id = response.data.user_id || false;
        const user = response.data.user || false;

        try {
            if (user && user_id) {
                localStorage.setItem('user', user);
                localStorage.setItem('user_id', user_id);
                
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
        } catch (error) {

        }

    }

    return (
        <Container>
            <h2>Login</h2>
            <p><strong>Login</strong> into your account.</p>
            <Form onSubmit={handleSubmit}>
                <div className="input-group">
                    <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                        <Input type="email" name="email" id="email" onChange={evt => setEmail(evt.target.value)} placeholder="Your Email" />
                    </FormGroup>
                    <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                        <Input type="password" name="password" id="password" onChange={evt => setPassword(evt.target.value)} placeholder="Your Password" />
                    </FormGroup>
                </div>
                <FormGroup>
                    <Button className="submit-btn">Login</Button>
                </FormGroup>
                <FormGroup>
                    <Button className="secondary-btn" onClick={() => history.push("/register")}>New Account</Button>
                </FormGroup>
            </Form>
            {errorMessage ? (
                <Alert className="event-validation" color="danger">Missing required information</Alert>
            ) : ''}
        </Container>
    )
}