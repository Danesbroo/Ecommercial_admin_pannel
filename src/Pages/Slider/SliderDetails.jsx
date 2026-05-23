import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import $ from "jquery";
import "dropify/dist/css/dropify.min.css";
import "dropify/dist/js/dropify.min.js";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

export default function SliderDetails() {
  const [sliderDetails, setSliderDetails] = useState('');
  const [updateIdState,setUpdateIdState]=useState(false);
  const [imagePath, setImagePath] = useState('');
  const params = useParams();
  const updateId = params.id;
  const navigate = useNavigate();


  useEffect(() => {
    const dropifyElement = $("#image");

    if(dropifyElement.data('dropify')) {
      dropifyElement.data('dropify').destroy();
      dropifyElement.removeData('dropify');
    }
    // update dropify
    dropifyElement.replaceWith(
      `<input type="file" name="image" id="image" className="dropify" data-height="250" data-default-file="${imagePath}" accept="image/*">`
    );
    $("#image").dropify()
  },[imagePath]);

  // Fetching the slider list
    const formHandler = (event) => {
      event.preventDefault();
  
      const formData = new FormData(event.target);
  
      if (updateId) {
        axios.put(`${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_SLIDER_UPDATE}/${updateId}`, formData)
          .then((success) => {
            if (success.data._status == true) {
              toast.success(success.data._message);
              navigate('/slider/view');
            } else {
              toast.error(success.data._message);
            }
          })
          .catch((error) => {
            toast.error(error._message);
          })
      } else {
        axios.post(`${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_SLIDER_CREATE}`, formData)
          .then((success) => {
            if (success.data._status === true) {
              toast.success(success.data._message);
              navigate('/slider/view'); // navigate to file into category page
  
            } else {
              toast.error(success.data._message);
            }
          })
          .catch((error) => {
            toast.error(error.data._message);
          });
      };
    }
  useEffect(() => {
    if (updateId) {
      axios.post(import.meta.env.VITE_BASE_URL + import.meta.env.VITE_SLIDER_DETAILS,{
        id: updateId
      })
        .then((response) => {
          if (response.data._status == true) {
            setSliderDetails(response.data._data)
            setImagePath(response.data._image_path + response.data._data.image);
          } else {
            setSliderDetails('');
          }
        })
        .catch(() => {
          toast.error('Something went wrong !!');
        })
    }
  }, [updateId]);


  // update work
  useEffect(()=>{
    if(updateId==undefined){
      setUpdateIdState(false)
    }
    else{
      setUpdateIdState(true)
    }
  },[updateId])

 

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
              <Link to={"/slider/view"} className="ms-1 text-md font-medium text-gray-700 hover:text-blue-600 md:ms-2">Slider</Link>
            </div>
          </li>
          <li aria-current="page">
            <div className="flex items-center">
              /
              <span className="ms-1 text-md font-medium text-gray-500 md:ms-2">Add</span>
            </div>
          </li>
        </ol>
      </nav>
      <div className="w-full min-h-[610px]">
        <div className="max-w-[1220px] mx-auto py-5">
          <h3 className="text-[26px] font-semibold bg-slate-100 py-3 px-4 rounded-t-md border border-slate-400">
            {updateIdState ? "Update Silder" : "Add Slider"}  
          </h3>
          <form onSubmit={formHandler} autoComplete="off" className="border border-t-0 p-3 rounded-b-md border-slate-400">
            <div className="flex flex-wrap sm:flex-nowrap gap-5">
              <div className="w-full order-2 sm:order-1 sm:w-1/3">
                <label
                  className="block mb-2 text-md font-medium text-gray-900"
                >
                  Choose Image
                </label>
                <input
                  name="image"
                  type="file"
                  id="image"
                  data
                  className="dropify"
                  data-height="250"
                />
              </div>
              <div className="w-full order-1 sm:order-2 sm:w-2/3">
                <div className="mb-5">
                  <label
                    htmlFor="Title"
                    className="block mb-2 text-md font-medium text-gray-900"
                  >
                    Title
                  </label>
                  <input
                    name="name"
                    defaultValue={sliderDetails.name}
                    type="text"
                    id="Title"
                    className="text-[19px] border-2 shadow-sm border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 px-3"
                    placeholder="Title"
                  />
                </div>
                <div className="mb-5">
                  <label
                    htmlFor="order"
                    className="block mb-2 text-md font-medium text-gray-900"
                  >
                    Order
                  </label>
                  <input
                    name="order"
                    type="number"
                    defaultValue={sliderDetails.order}
                    id="order"
                    className="text-[19px] border-2 shadow-sm border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 px-3"
                    placeholder="Order"
                  />
                </div>
              </div>
            </div>
            <button
              type="submit"
              className="focus:outline-none my-5 text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5"
            >
             {updateIdState ? "Update Slider" : "Add Slider"}  
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
