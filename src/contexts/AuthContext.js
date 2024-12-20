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
        const isTestUser = (credentials.email === 'seabass' && credentials.password === 'letmein') ||
            (credentials.email === 'win' && credentials.password === 'letmein');

        if (isTestUser) {
            if (credentials.email === 'seabass') {
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
                    }
                });
            } else {
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
                    }
                });
            }
            return;
        }

        const res = await axios.post('http://localhost:8080/auth/login', credentials, {
            headers: { 'Content-Type': 'application/json' }
        });
        console.log('Login response:', res.data);

        if (res.status === 200) {
            const token = res.data.data.token;
            localStorage.setItem('token', token);

            const userres = await axios.get(`http://localhost:8080/users/email`, {
                params: { email: credentials.email },
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (userres.status === 200) {
                const userdata = userres.data.data;
                setauthstate({
                    isauthenticated: true,
                    user: {
                        userid: userdata.id,
                        firstname: userdata.firstName,
                        lastname: userdata.lastName,
                        email: userdata.email,
                        isadmin: userdata.type === 'ADMIN' || userdata.type === 'SUPERADMIN',
                        profileimg: userdata.profileImageUrl,
                    }
                });
                return;
            }
        }
        throw new Error('Login failed');
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

