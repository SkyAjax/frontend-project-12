import React, { useRef } from 'react';
import { Formik } from 'formik';
import {
  Form, Button, Container, Card, Row,
} from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import axios from 'axios';
import routes from '../routes';
import useAuth from '../hooks';

const SignupSchema = Yup.object().shape({
  username: Yup.string()
    .min(2, 'Минимум 2 буквы')
    .max(50, 'Максимум 50 букв')
    .required('Обязательное поле'),
  password: Yup.string().required('Обязательное поле'),
});

const Login = () => {
  const inputRef = useRef(null);
  const auth = useAuth();
  const navigate = useNavigate();
  return (
    <Container className="container-fluid h-100">
      <Row className="justify-content-center align-content-center h-100">
        <div className="col-12 col-md-8 col-xxl-6">
          <Card className="shadow-sm">
            <Card.Body className="p-5">
              <h1>Sign In</h1>
              <Formik
                initialValues={{
                  username: '',
                  password: '',
                }}
                validationSchema={SignupSchema}
                onSubmit={async (values, actions) => {
                  try {
                    const response = await axios.post(routes.loginPath(), values);
                    localStorage.setItem('userId', JSON.stringify(response.data));
                    auth.setUsername(response.data.username);
                    auth.logIn();
                    navigate('/');
                  } catch (e) {
                    actions.setErrors({
                      username: ' ',
                      password: 'Неверные имя пользователя или пароль',
                    });
                    inputRef.current.focus();
                    inputRef.current.select();
                    throw e;
                  }
                }}
              >
                {({
                  handleSubmit, handleChange, values, errors, touched,
                }) => (

                  <Form noValidate onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                      <Form.Label>Username</Form.Label>
                      <Form.Control
                        ref={inputRef}
                        name="username"
                        type="text"
                        placeholder="Username"
                        value={values.username}
                        onChange={handleChange}
                        isInvalid={touched.username && !!errors.username}
                        autoFocus
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.username}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Password</Form.Label>
                      <Form.Control
                        name="password"
                        type="password"
                        placeholder="Password"
                        value={values.password}
                        onChange={handleChange}
                        isInvalid={touched.password && !!errors.password}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.password}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Button variant="primary" type="submit">
                      Submit
                    </Button>
                  </Form>

                )}
              </Formik>
            </Card.Body>
            <Card.Footer className="p-4">
              <div className="text-center">
                {'Don\'t have an account? '}
                <span>
                  <Card.Link>
                    <Link to="/signup">Register</Link>
                  </Card.Link>
                </span>
              </div>
            </Card.Footer>
          </Card>
        </div>
      </Row>
    </Container>
  );
};

export default Login;
