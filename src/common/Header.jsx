import React, { useEffect, useState } from 'react'
import { RiProfileFill } from 'react-icons/ri'
import { Link, useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'; //  Cookie import
import babuxora from '../../public/babuxora.jpeg' // logo import
import { use } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function Header() {
    const navigate = useNavigate(); // useNavigate for logout
    const [companyId, setCompanyId] = useState('')
    useEffect(() => {
        axios.post(`${import.meta.env.VITE_BASE_URL}company/view`)
        .then((response) => {
            setCompanyId(response.data._data[0]._id);
        })
        .catch((error) => {
             toast.error("Error fetching company ID");     });
    }, [])
    //  Logout function
    const Quit = () => {
        Cookies.remove("token");    // remove token from cookies
        navigate("/");              // redirect to login page
    }
    

    return (
        <header className='border-b-2'>
            <nav className="bg-white border-gray-200 px-4 lg:px-6 py-2.5">
                <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
                    <div className="flex items-center">
                        <svg fill="currentColor" className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M0 96C0 78.3 14.3 64 32 64l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 128C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 288c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32L32 448c-17.7 0-32-14.3-32-32s14.3-32 32-32l384 0c17.7 0 32 14.3 32 32z" /></svg>
                        <span className="self-center text-xl ms-5 text-slate-500 font-semibold whitespace-nowrap">Dashboard</span>
                    </div>
                    <div className="flex items-center lg:order-2">
                        <figure className='relative group w-12 h-12 cursor-pointer rounded-full'>
                            <img className="w-12 h-12 rounded-full object-cover" src={babuxora} alt='logo' />
                                
                            <HeadDropDown Quit={Quit} companyId={companyId} /> 
                        
                        </figure>
                    </div>
                </div>
            </nav>
        </header>
    )
}

function HeadDropDown({ Quit, companyId}) { // here is headDropdown is another function so quit should send through props
    return (
        <div className="absolute z-50 right-1 top-7 mt-2 hidden group-hover:block p-4">
            <div className="w-48 text-gray-900 bg-white border border-gray-200 rounded-lg shadow-2xl ">
                <Link to={"/profile"} >
                    <button type="button" className="relative inline-flex items-center w-full px-4 py-1.5 text-sm font-medium border-b border-gray-200 rounded-t-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 ">
                        <svg className="w-4 h-4 me-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
                        </svg>
                        Profile
                    </button>
                </Link>

                <Link to={`/company-profile/${companyId}`} >
                    <button type="button" className="relative inline-flex items-center w-full px-4 py-1.5 text-sm font-medium border-b border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 ">
                        <RiProfileFill className='mr-[10px] font-bold' />
                        Company Profile
                    </button>
                </Link>

                <button 
                    type="button" 
                    onClick={Quit} 
                    className="relative inline-flex items-center w-full px-4 py-3 text-sm font-medium border-t border-black rounded-b-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 ">
                    <svg fill="currentColor" className="w-4 h-4 me-2.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M144 144l0 48 160 0 0-48c0-44.2-35.8-80-80-80s-80 35.8-80 80zM80 192l0-48C80 64.5 144.5 0 224 0s144 64.5 144 144l0 48 16 0c35.3 0 64 28.7 64 64l0 192c0 35.3-28.7 64-64 64L64 512c-35.3 0-64-28.7-64-64L0 256c0-35.3 28.7-64 64-64l16 0z" /></svg>
                    Logout 
                </button>
            </div>
        </div>
    )
}
