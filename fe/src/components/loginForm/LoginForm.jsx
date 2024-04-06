import React, {useState} from 'react';
import AxiosClient from "../../client/client";
import {useNavigate} from "react-router-dom";

const LoginForm = ({ toggleForm }) => {
    const [formData, setFormData] = useState({})

    const client = new AxiosClient();
    const navigate = useNavigate()

    const onSubmit = async (e) => {
        e.preventDefault()
        const response = await client.post('/login', formData)
        console.log(response.token)
        if (response.token) {
            localStorage.setItem('auth', JSON.stringify(response.token))
            setTimeout(() => {
                navigate('/home')
            },1500)
        }
    }

    const onChangeInput = (e) => {
        const {name, value} = e.target
        setFormData({
            ...formData,
            [name]: value
        })
    }

    return (
        <form
            onSubmit={onSubmit}
            className="card-body cardbody-color p-lg-5">
            <div className="text-center">
                <img
                    src="https://picsum.photos/340/340"
                    className="img-fluid profile-image-pic img-thumbnail rounded-circle my-3"
                    width="200px"
                    alt="profile"
                />
            </div>

            <div className="mb-3">
                <input
                    onChange={onChangeInput}
                    type="email"
                    className="form-control"
                    name="email"
                    aria-describedby="emailHelp"
                    placeholder="Inserisci la tua email..."
                />
            </div>

            <div className="mb-3">
                <input
                    onChange={onChangeInput}
                    type="password"
                    className="form-control"
                    name="password"
                    placeholder="Inserisci la tua password"
                />
            </div>

            <div className="text-center">
                <button
                    type="submit"
                    className="btn btn-primary px-5 mb-5 w-100"
                >
                    Login
                </button>
            </div>

            <div
                onClick={() => toggleForm()}
                id="emailHelp"
                className="form-text text-center mb-5 text-dark"
            >
                Non sei registrato?
                <a href="#" className="text-dark fw-bold ms-1">
                    Registrati ora!
                </a>
            </div>
        </form>
    );
};

export default LoginForm;
