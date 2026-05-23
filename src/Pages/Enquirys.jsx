
import React, { useEffect, useState } from 'react'
// import Breadcrumb from '../../common/Breadcrumb'
import { Link } from 'react-router-dom';
import { MdFilterAltOff, MdModeEdit, MdModeEditOutline } from 'react-icons/md';
import ResponsivePagination from 'react-responsive-pagination';
import 'react-responsive-pagination/themes/classic-light-dark.css';
import { FaFilter } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
// import { MdModeEditOutline } from "react-icons/md";

export default function Enquiry() {
    // let [orderModal, setOrderModal] = useState(false);

    let [activeFilter, setactiveFilter] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState()
    let [enquiry, setEnquiry] = useState([])
    let [nameFilter, setNameFilter] = useState('');
    let [checkedValue, setCheckedValue] = useState([])
    let [apiStatus, setApiStatus] = useState(false);


    useEffect(() => {
        axios.post(import.meta.env.VITE_BASE_URL + import.meta.env.VITE_ENQUIRY_VIEW, { name: nameFilter, page: currentPage })
            .then((success) => {
                if (success.data._status === true) {
                    setEnquiry(success.data._data)
                    setTotalPages(success.data._pagination?.total_page || 1);
                } else {
                    toast.error(success.data._Error_Message[0]);
                }
            })
            .catch((error) => {
                toast.error(error.data._Error_Message[0]);
            });
    }, [apiStatus, nameFilter, currentPage]);

    // checkAll checkbox
    var checkedAll = () => {
        if (enquiry.length != checkedValue.length) {
            var data = [];
            enquiry.forEach((value) => {
                data.push(value._id);
            })
            setCheckedValue([...data]);
        } else {
            setCheckedValue([]);
        }
    }
    // search value from filter
    const searchRecord = (event) => {
        event.preventDefault();
        setNameFilter(event.target.search.value)

    }
    // check single checkbox
    var singleCheck = (id) => {
        if (checkedValue.includes(id)) {
            var data = checkedValue.filter((value) => {
                if (value != id) {
                    return value;
                }
            })
            data = [...data];
            setCheckedValue(data);
        } else {
            const data = [...checkedValue, id];
            setCheckedValue(data);
        }
    }
    const changeStatus = () => {

        if (checkedValue.length > 0) {
            axios.put(
                import.meta.env.VITE_BASE_URL + import.meta.env.VITE_ENQUIRY_CHANGE_STATUS,
                { id: checkedValue }
            )
                .then((response) => {
                    if (response.data._status == true) {
                        toast.success(response.data._message);
                        setApiStatus(!apiStatus);
                        setCheckedValue([]);
                    } else {
                        toast.error(response.data._message);
                    }
                })
                .catch(() => {
                    toast.error('Something went wrong !!');
                })
        } else {
            toast.error('Please select atlest 1 record to change status')
        }
    }
    const deleteFile = () => {

        if (checkedValue.length > 0) {
            if (confirm('Are you Sure you Want to delete !!')) {
                axios.put(import.meta.env.VITE_BASE_URL + import.meta.env.VITE_ENQUIRY_DELETE, { id: checkedValue })
                    .then((response) => {
                        if (response.data._status == true) {
                            toast.success(response.data._message);
                            setApiStatus(!apiStatus);
                            setCheckedValue([]);
                        } else {
                            toast.error(response.data._message);
                        }
                    })
                    .catch(() => {
                        toast.error('Something went wrong !!');
                    })
            }

        } else {
            toast.error('Please select atlest 1 record to delete')
        }
    }
    return (
        <section className="w-full">

            <nav className="flex border-b-2" aria-label="Breadcrumb">
                <ol className="p-3 px-6 inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
                    <li className="inline-flex items-center ">
                        <Link to={"/home"} className="inline-flex items-center text-md font-medium text-gray-700 hover:text-blue-600">
                            Home
                        </Link>
                    </li>
                    <li>
                        <div className="flex items-center">
                            /
                            <Link to={""} className="ms-1 text-md font-medium text-gray-700 hover:text-blue-600 md:ms-2">Enquiry</Link>
                        </div>
                    </li>
                    <li aria-current="page">
                        <div className="flex items-center">
                            /
                            <span className="ms-1 text-md font-medium text-gray-500 md:ms-2">View</span>
                        </div>
                    </li>
                </ol>
            </nav>

            <div className={` rounded-lg border border-gray-300 px-5 py-5 max-w-[1220px] mx-auto mt-10 ${activeFilter ? "hidden" : "block"}`}>

                <form className="flex max-w-sm" onSubmit={searchRecord}>
                    <div className="relative w-full">
                        <input
                            type="text"
                            name='search'
                            id="simple-search"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-2 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="Search User"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="p-2.5 ms-2 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                        <svg
                            className="w-4 h-4"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 20 20"
                        >
                            <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                            />
                        </svg>
                        <span className="sr-only">Search</span>
                    </button>
                </form>


            </div>
            <div className="w-full min-h-[610px]">
                <div className="max-w-[1220px] mx-auto py-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3 bg-slate-100 py-2 sm:py-3 px-3 sm:px-4 rounded-t-md border border-slate-400">

                        {/* Title */}
                        <h3 className="text-[14px] sm:text-[18px] md:text-[22px] lg:text-[26px] font-semibold leading-tight">
                            Contact Enquiry Management
                        </h3>

                        {/* Actions */}
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3">

                            {/* Filter Button */}
                            <div
                                onClick={() => setactiveFilter(!activeFilter)}
                                className="cursor-pointer flex items-center justify-center
               w-8 h-8 sm:w-9 sm:h-9 md:w-[40px] md:h-[40px]
               text-white bg-blue-700 rounded-md sm:rounded-lg"
                            >
                                {activeFilter ? <FaFilter className="text-[14px] sm:text-[16px] md:text-[18px]" /> : <MdFilterAltOff className="text-[14px] sm:text-[16px] md:text-[18px]" />}
                            </div>

                            {/* Change Status */}
                            <button
                                onClick={changeStatus}
                                className="text-white bg-green-700 hover:bg-green-800 font-medium rounded-md
               text-[11px] sm:text-sm
               px-2 py-1 sm:px-3 sm:py-2 md:px-4 md:py-2"
                            >
                                Change Status
                            </button>

                            {/* Delete */}
                            <button
                                onClick={deleteFile}
                                className="text-white bg-red-700 hover:bg-red-800 font-medium rounded-md
               text-[11px] sm:text-sm
               px-2 py-1 sm:px-3 sm:py-2 md:px-4 md:py-2"
                            >
                                Delete
                            </button>

                        </div>

                    </div>
                    <div className="border border-t-0 rounded-b-md border-slate-400">

                        {/* border-2 border-[red] */}
                        <div className="relative overflow-x-auto">


                            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">

                                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                        <tr>
                                            <th scope="col" className="p-4">
                                                <div className="flex items-center">
                                                    <input
                                                        id="checkbox-all-search"
                                                        type="checkbox"
                                                        onClick={checkedAll}
                                                        checked={enquiry.length > 0 && enquiry.length === checkedValue.length}
                                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                                    <label for="checkbox-all-search" className="sr-only">checkbox</label>
                                                </div>
                                            </th>
                                            <th scope="col" className="px-6 py-3 w-[15%]">
                                                User info
                                            </th>
                                            <th scope="col" className=" w-[12%] ">
                                                Subject
                                            </th>

                                            <th scope="col" className=" w-[40%] ">
                                                Message
                                            </th>
                                            <th scope="col" className=" w-[10%] ">
                                                Mobile No
                                            </th>
                                            <th scope="col" className="w-[12%]">
                                                Status
                                            </th>
                                            <th scope="col" className="w-[6%]">
                                                Action
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            enquiry.length > 0
                                                ?
                                                enquiry.map((v, i) => {
                                                    return (
                                                        <tr className="bg-white  dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
                                                            <td className="w-4 p-4">
                                                                <div className="flex items-center">
                                                                    <input
                                                                        id="checkbox-table-search-1" type="checkbox"
                                                                        onClick={() => singleCheck(v._id)}
                                                                        checked={checkedValue.includes(v._id) ? 'checked' : ''}
                                                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                                                    <label for="checkbox-table-search-1" className="sr-only">checkbox</label>
                                                                </div>
                                                            </td>
                                                            <th scope="row" className="px-4 py-4 text-gray-900 whitespace-nowrap dark:text-white">

                                                                <div className="py-4">
                                                                    <div className="text-[14px] font-semibold ">{v.email}</div>

                                                                </div>
                                                            </th>
                                                            <td className=" py-4">
                                                                {v.subject}
                                                            </td>
                                                            <td className=" py-4">
                                                                {v.message}
                                                            </td>
                                                            <td className=" py-4">
                                                                {v.mobile_number}
                                                            </td>
                                                            <td className=" py-4">

                                                                {
                                                                    v.status == 1
                                                                        ?
                                                                        <button type="button" className="text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-1.5 text-center me-2 mb-2">Active</button>
                                                                        :
                                                                        <button type="button" className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-5 py-1.5 text-center me-2 mb-2">Deactive</button>
                                                                }
                                                            </td>
                                                            <td className=" py-4">

                                                                <Link to={""} >
                                                                    <div className="rounded-[50%] w-[40px] h-[40px] flex items-center justify-center text-white bg-blue-700  border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                                                        <MdModeEdit className='text-[18px]' />
                                                                    </div>
                                                                </Link>
                                                            </td>
                                                        </tr>
                                                    )
                                                })
                                                :
                                                <tr>
                                                    <td colSpan={6} className="py-4 text-center font-bold">
                                                        No Record Found
                                                    </td>
                                                </tr>
                                        }

                                    </tbody>
                                </table>
                                {enquiry.length > 0
                                    ?
                                    <div className='py-1 flex flex-row-reverse'>
                                        <ResponsivePagination
                                            current={currentPage}
                                            total={totalPages}
                                            onPageChange={setCurrentPage}
                                        />
                                    </div>
                                    :
                                    ''
                                }
                            </div>


                        </div>

                    </div>
                </div>
            </div>



        </section>
    )
}

