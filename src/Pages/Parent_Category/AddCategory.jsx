import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Breadcrumb from "../../common/Breadcrumb";
import $ from "jquery";
import "dropify/dist/css/dropify.min.css";
import "dropify/dist/js/dropify.min.js";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

export default function AddCategory() {


  const [categoryDetails, setCategoryDetails] = useState('');
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
      `<input type="file" name="image" id="image" class="dropify" data-height="250" data-default-file="${imagePath}" accept="image/*">`
    );
    $("#image").dropify()
  },[imagePath]);

  // Fetching the category list
    const formHandler = (event) => {
      event.preventDefault();
  
      const formData = new FormData(event.target);
  
      if (updateId) {
        axios.put(`${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_CATEGORY_UPDATE}/${updateId}`, formData)
          .then((success) => {
            if (success.data._status == true) {
              toast.success(success.data._message);
              navigate('/category/view');
            } else {
              toast.error(success.data._message);
            }
          })
          .catch((error) => {
            toast.error(error._message);
          })
      } else {
        axios.post(`${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_CATEGORY_CREATE}`, formData)
          .then((success) => {
            if (success.data._status === true) {
              toast.success(success.data._message);
              navigate('/category/view'); // navigate to file into category page
  
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
      axios.post(import.meta.env.VITE_BASE_URL + import.meta.env.VITE_CATEGORY_DETAILS,{
        id: updateId
      })
        .then((response) => {
          if (response.data._status == true) {
            setCategoryDetails(response.data._data)
            setImagePath(response.data._image_path + response.data._data.image);
          } else {
            setCategoryDetails('');
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

  const onSubmit = (data) => {
    console.log(data);
  };

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
                  <Link to={"/category/view"} className="ms-1 text-md font-medium text-gray-700 hover:text-blue-600 md:ms-2">Category</Link>
                </div>
              </li>
              <li aria-current="page">
                <div className="flex items-center">
                  /
                  <span className="ms-1 text-md font-medium text-gray-500 md:ms-2">{updateId ? "Update" : "Add"}</span>
                </div>
              </li>
            </ol>
          </nav>
      
      
      <div className="w-full min-h-[610px]">
        <div className="max-w-[1220px] mx-auto py-5">
          <h3 className="text-[26px] font-semibold bg-slate-100 py-3 px-4 rounded-t-md border border-slate-400">
            {updateId ? "Update Category" : "Add Category"}  
          </h3>
          <form onSubmit={formHandler} autoComplete="off" className="border border-t-0 p-3 rounded-b-md border-slate-400">
            <div className="flex flex-wrap sm:flex-nowrap gap-5">
              <div className="w-full order-2 sm:order-none sm:w-1/3">
                <label
                  
                  className="block  text-md font-medium text-gray-900"
                >
                  Category Image
                </label>
                <input
                  type="file"
                  name="image"
                  data-default-file={imagePath}
                  accept="image/*"
                  id="image"
                  className="dropify"
                  data-height="250"
                />
              </div>
              <div className="w-full order-1 sm:order-none sm:w-2/3">
                <div className="mb-5">
                  <label
                    htmlFor="categoryName"
                    className="block  text-md font-medium text-gray-900"
                  >
                    Category Name
                  </label>
                  <input
                    type="text"
                    defaultValue={categoryDetails.name}
                    name="name"
                    id="categoryName"
                    className="text-[19px] border-2 shadow-sm border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 px-3"
                    placeholder="Category Name"
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
                    type="number"
                    defaultValue={categoryDetails.order}
                    id="order"
                    name="order"
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
             {updateId ? "Update Category" : "Add Category"}  
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
