import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Breadcrumb from "../../common/Breadcrumb";
import $ from "jquery";
import "dropify/dist/css/dropify.min.css";
import "dropify/dist/js/dropify.min.js";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

export default function TestimonialAdd() {
  const [testimonialDetails, setTestimonialDetails] = useState('');
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
        axios.put(`${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_TESTIMONIAL_UPDATE}/${updateId}`, formData)
          .then((success) => {
            if (success.data._status == true) {
              toast.success(success.data._message);
              navigate('/testimonial/view');
            } else {
              toast.error(success.data._message);
            }
          })
          .catch((error) => {
            toast.error(error._message);
          })
      } else {
        axios.post(`${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_TESTIMONIAL_CREATE}`, formData)
          .then((success) => {
            if (success.data._status === true) {
              toast.success(success.data._message);
              navigate('/testimonial/view'); // navigate to file into category page
  
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
      axios.post(import.meta.env.VITE_BASE_URL + import.meta.env.VITE_TESTIMONIAL_DETAILS,{
        id: updateId
      })
        .then((response) => {
          if (response.data._status == true) {
            setTestimonialDetails(response.data._data)
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
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = (data) => {
        console.log(data);
    };

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
            <Breadcrumb path={"testimonial"} path2={updateIdState ? "Update" : "Add"} slash={"/"} />
            <div className="w-full min-h-[610px]">
                <div className="max-w-[1220px] mx-auto py-5">
                    <h3 className="text-[26px] font-semibold bg-slate-100 py-3 px-4 rounded-t-md border border-slate-400">
                        {updateIdState ? "Update Testimonial" : "Add Testimonial"}
                    </h3>
                    <form onSubmit={formHandler} autoComplete="off" className="border border-t-0 p-3 rounded-b-md border-slate-400">
                        <div className="flex gap-5">
                            <div className="w-1/3">
                                <label

                                    className="block  text-md font-medium text-gray-900"
                                >
                                    Choose Image
                                </label>
                                <input
                                    name="image"
                                    type="file"
                                    id="image"
                                    className="dropify"
                                    data-height="250"
                                />
                            </div>
                            <div className="w-2/3">
                                <div className="mb-5">
                                    <label
                                        htmlFor="Title"
                                        className="block mb-1 text-md font-medium text-gray-900"
                                    >
                                        Name
                                    </label>
                                    <input
                                        name="name"
                                        type="text"
                                        defaultValue={testimonialDetails.name}
                                        id="Name"
                                        className="text-[19px] border-2 shadow-sm border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 px-3"
                                        placeholder="Name"
                                    />
                                </div>
                                <div className="mb-5">
                                    <label
                                        htmlFor="Designation"
                                        className="block mb-1 text-md font-medium text-gray-900"
                                    >
                                        Designation
                                    </label>
                                    <input
                                        name="designation"
                                        defaultValue={testimonialDetails.designation}
                                        type="text"
                                        id="Designation"
                                        className="text-[19px] border-2 shadow-sm border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 px-3"
                                        placeholder="Designation"
                                    />
                                </div>
                                <div className="mb-5">
                                    <label
                                        htmlFor="Rating"
                                        className="block mb-1 text-md font-medium text-gray-900"
                                    >
                                        Rating
                                    </label>
                                    <input
                                        name="rating"
                                        defaultValue={testimonialDetails.rating}
                                        type="number"
                                        id="Rating"
                                        className="text-[19px] border-2 shadow-sm border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 px-3"
                                        placeholder="Rating"
                                    />
                                </div>
                                <div className="mb-5">
                                    <label
                                        htmlFor="Order"
                                        className="block mb-1 text-md font-medium text-gray-900"
                                    >
                                        Order
                                    </label>
                                    <input
                                        name="order"
                                        defaultValue={testimonialDetails.order}
                                        type="number"
                                        id="Order"
                                        className="text-[19px] border-2 shadow-sm border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 px-3"
                                        placeholder="Order"
                                    />
                                </div>
                                <div className="mb-5">
                                    <label
                                        htmlFor="Message"
                                        className="block mb-1 text-md font-medium text-gray-900"
                                    >
                                        Message
                                    </label>
                                    <textarea
                                        name="message"
                                        defaultValue={testimonialDetails.message}
                                        id="Message"
                                        className="text-[19px] resize-none h-[100px] border-2 shadow-sm border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 px-3"
                                        placeholder="Message"
                                    > </textarea>
                                </div>
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="focus:outline-none my-5 text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5"
                        >
                            {updateIdState ? "Update Testimonial" : "Add Testimonial"}
                        </button>
                    </form>
                </div>
            </div>
        </section>
    )
}
