import React from 'react'
import { createContext,useContext,useState,useEffect } from 'react'
import { useCookies } from 'react-cookie'

const AuthContext=createContext();

export const AuthProvider=({children})=>{
    const [cookies,setCookie,removeCookie]=useCookies(["token"])
    const [user,setUser]=useState(null)
    const [isAuthenticated,setIsAuthenticated]=useState(false);

    useEffect(()=>{
        const token=cookies.token;
        if (token){
            setIsAuthenticated(true)
        }
    },[cookies.token]);

    const login=(token,userData)=>{
        const expireDate=new Date();
        expireDate.setDate(expireDate.getDate()+30);
        setCookie("token",token,{path:"/"})
    }
}