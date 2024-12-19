//context to manage auth state

import axios from 'axios';
import { createContext, useContext, useState } from 'react'
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [authstate, setauthstate] = useState({
        isauthenticated: false,
        user: null,
    });

    const login = async (credentials) => {
        // safety net for demo purposes

        if (credentials.email === 'seabass' && credentials.password === 'letmein') {
            setauthstate({
                isauthenticated: true,
                user: {
                    userid: 1,
                    firstname: 'Seabass',
                    lastname: 'Houng',
                    email: 'seabass@gmail',
                    profileimg: 'img.png',
                    isadmin: false,
                    createdat: '2021-10-10',

                },
            });
        } else if (credentials.email === 'win' && credentials.password === 'letmein') {
            setauthstate({
                isauthenticated: true,
                user: {
                    userid: 1,
                    firstname: 'Winnie',
                    lastname: 'Houng',
                    email: '18whoung@gmail',
                    profileimg: 'img.png',
                    isadmin: true,
                    createdat: '2021-10-10',

                },
            });
        }

        //api call
        try {
            const res = await axios.post('http://localhost:8080/auth/login', credentials, {
                headers: { 'Content-Type': 'application/json' }
            });
            if (res.status === 200) {
                const token = res.data.token;
                localStorage.setItem('token', token);
                const email = credentials.email;
                const userres = await axios.get(`http://localhost:8080/users/email?email=${email}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (userres.status === 200) {
                    const userdata = userres.data;
                    setauthstate({
                        isauthenticated: true,
                        user: {
                            userid: userdata.id,
                            firstname: userdata.firstName,
                            lastname: userdata.lastName,
                            email: userdata.email,
                            isadmin: userdata.type === 'ADMIN',
                            profileimg: userdata.profileImageUrl,
                        }
                    });
                    console.log(userdata);
                }
            }
        } catch (err) {
            alert(err.response?.data?.message || 'an error happened');
        }

    };
    const logout = (navigate) => {
        setauthstate({
            isauthenticated: false,
            user: null,
        });
        navigate("/");
    }
    return (
        <AuthContext.Provider value={{ authstate, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// export const useAuth = () => useContext(AuthContext);
export const useAuth = () => useContext(AuthContext);

