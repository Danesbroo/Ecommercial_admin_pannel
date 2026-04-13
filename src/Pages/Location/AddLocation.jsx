

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

export default function AddLocation() {
  const [country, setCountry] = useState([]);
  const [countryDetails, setCountryDetails] = useState('');
  const [updateIdState, setUpdateIdState] = useState(false)
  const params = useParams();
  const updateId = params.id;
  const navigate = useNavigate();
  
  // Fetching the country list
  const formHandler = (event) => {
    event.preventDefault();
    const data = {
      name: event.target.name.value,
      order: event.target.order.value,
    }

    if (updateId) {      
      axios.put(`${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_COUNTRY_UPDATE}/${updateId}`, data)     
      .then((success) => {
        if (success.data._status == true) {
          toast.success(success.data._message);
          navigate('/country/view');
        } else {
          toast.error(success.data._message);
        }
      })
      .catch((error) => {
        toast.error(error.data._message);
      })
    } else {
      axios.post(import.meta.env.VITE_BASE_URL + import.meta.env.VITE_COUNTRY_CREATE, data)
        .then((success) => {
          if (success.data._status === true) {
            toast.success(success.data._message);
            navigate('/country/view'); // navigate to file into country page

          } else {
            toast.error(success.data._Error_Message[0]);
          }
        })
        .catch((error) => {
          toast.error(error.data._message);
        });
    };
  }
  
useEffect(() => {
  if (updateId) {
    axios.post(import.meta.env.VITE_BASE_URL + import.meta.env.VITE_COUNTRY_DETAILS,{
      id: updateId
    })
      .then((response) => {
        if (response.data._status == true) {
          setCountryDetails(response.data._data)
        } else {
          setCountryDetails('');
        }
      })
      .catch(() => {
        toast.error('Something went wrong !!');
      })
  }
}, [updateId]);

  const {

    formState: { errors },
  } = useForm();
  // update work
  
  useEffect(() => {
    if (updateId == undefined) {
      setUpdateIdState(false)
    }
    else {
      setUpdateIdState(true)
    }
  }, [updateId])

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
              <Link to={"/country/view"} className="ms-1 text-md font-medium text-gray-700 hover:text-blue-600 md:ms-2">Country</Link>
            </div>
          </li>
          <li aria-current="page">
            <div className="flex items-center">
              /
              <span className="ms-1 text-md font-medium text-gray-500 md:ms-2"> {updateIdState ? "Update" : "Add"}</span>
            </div>
          </li>
        </ol>
      </nav>

      <div className="w-full min-h-[610px]">
        <div className="max-w-[1220px] mx-auto py-5">
          <h3 className="text-[26px] font-semibold bg-slate-100 py-3 px-4 rounded-t-md border border-slate-400">
            {updateId ? "Update Country" : "Add Country"}
          </h3>
          <form onSubmit={formHandler} autoComplete="off" className="border border-t-0 p-3 rounded-b-md border-slate-400">

          <div className="">
                <div className="mb-5">
                  <label
                    htmlFor="Name"
                    className="block  text-md font-medium text-gray-900"
                  >
                    Category Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    defaultValue={countryDetails.name}
                    required
                    id="Name"
                    className="text-[19px] border-2 shadow-sm border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 px-3"
                    placeholder="Material Name"
                  />
                </div>
                <div className="mb-5">
                  <label
                    htmlFor="order"
                    className="block  text-md font-medium text-gray-900"
                  >
                    Order
                  </label>
                  <input
                    name="order"
                    type="number"
                    defaultValue={countryDetails.order}
                    required
                    id="order"
                    className="text-[19px] border-2 shadow-sm border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 px-3"
                    placeholder="Order"
                  />
                </div>
              </div>

            <button
              type="submit"
              className="focus:outline-none my-5 text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5"
            >
              {updateId ? "Update Country" : "Add Country"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
