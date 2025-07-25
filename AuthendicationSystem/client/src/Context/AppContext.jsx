import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";


export const AppContent = createContext()

export const AppContextProvider = (props)=>{

    axios.defaults.withCredentials= true;
    const navigate = useNavigate();
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState(null);

    const getAuthState = async ()=>{
        try{
            const {data} = await axios.get(backendUrl+'/api/user/is-auth')
            if(data.success ){
                setIsLoggedIn(true);
                // getUserData();
            }

        }catch(error){
            toast.error(error.message);
        }
    };
   

    const getUserData = async ()=>{
        
        try{
            const {data} = await axios.get(backendUrl+'/api/user/data')
            data.success ? setUserData(data.userData): toast.error(data.message)
        }catch(error){
            toast.error(error.message);
        }
    }
    useEffect(() => {
        if (isLoggedIn) {
            getUserData();
        }
    }, [isLoggedIn]);

    useEffect(()=>{
        getAuthState();
    },[])


    const value = {
        backendUrl,
        isLoggedIn,
        setIsLoggedIn,
        userData, setUserData,
        getUserData,
        navigate,
        

    }

    return (
        <AppContent.Provider value={value}>
            {props.children}
        </AppContent.Provider>
    )
}