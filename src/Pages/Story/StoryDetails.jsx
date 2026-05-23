
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Breadcrumb from "../../common/Breadcrumb";
import $ from "jquery";
import "dropify/dist/css/dropify.min.css";
import "dropify/dist/js/dropify.min.js";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

export default function StoryDetails() {

  let [whyChooseDetails, setWhyChooseDetails] = useState('');
  const [updateIdState, setUpdateIdState] = useState(false);
  const [nameFilter, setNameFilter] = useState('')
  const [imagePath, setImagePath] = useState('');
  const params = useParams();
  const updateId = params.id;
  const navigate = useNavigate();


  const formHandler = (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);

    if (updateId) {
      axios.put(`${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_WHY_CHOOSE_UPDATE}/${updateId}`, formData)
        .then((success) => {
          if (success.data._status == true) {
            toast.success(success.data._message);
            navigate('/why-choose-us/view');
          } else {
            toast.error(success.data._message);
          }
        })
        .catch((error) => {
          toast.error(error._message);
        })
    } else {
      axios.post(`${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_WHY_CHOOSE_CREATE}`, formData)
        .then((success) => {
          if (success.data._status === true) {
            toast.success(success.data._message);
            navigate('/why-choose-us/view'); // navigate to file into category page

          } else {
            toast.error(error.response?.data?._message || "Something went wrong!");

          }
        })
        .catch((error) => {
          toast.error(error.response?.data?._message || "Something went wrong!");

        });
    };
  }
  useEffect(() => {
    const dropifyElement = $("#image");

    if (dropifyElement.data('dropify')) {
      dropifyElement.data('dropify').destroy();
      dropifyElement.removeData('dropify');
    }

    // update dropify
    dropifyElement.replaceWith(
      `<input type="file" name="image" id="image" class="dropify" data-height="250" data-default-file="${imagePath}" accept="image/*">`
    );
    $("#image").dropify()
  }, [imagePath]);

  useEffect(() => {
    if (updateId) {
      axios.post(import.meta.env.VITE_BASE_URL + import.meta.env.VITE_WHY_CHOOSE_DETAILS, {
        id: updateId
      })
        .then((response) => {
          if (response.data._status == true) {
            setWhyChooseDetails(response.data._data)
            setImagePath(response.data._image_path + response.data._data.image);
          } else {
            setWhyChooseDetails('');
          }
        })
        .catch(() => {
          toast.error('Something went wrong !!');
        })
    }
  }, [updateId]);

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
      <Breadcrumb path={"Why Choose Us"} path2={updateIdState ? "Update" : "Add"} link={"/why-choose-us/view"} slash={"/"} />

      <div className="w-full min-h-[610px]">
        <div className="max-w-[1220px] mx-auto py-5">
          <h3 className="text-[22px] sm:text-[26px] font-semibold bg-slate-100 py-3 px-4 rounded-t-md border border-slate-400">
            {updateIdState ? "Update Why Choose Us" : "Add Why Choose Us"}
          </h3>
          <form onSubmit={formHandler} autoComplete="off" className="border border-t-0 p-3 rounded-b-md border-slate-400">
            <div className="flex flex-wrap sm:flex-nowrap gap-5">
              <div className="w-full order-2 sm:order-1 sm:w-1/3">
                <label

                  className="block mb-0 text-md font-medium text-gray-900"
                >
                  Choose Image
                </label>
                <input
                  type="file"
                  id="image"
                  className="dropify"
                  data-height="250"
                />
              </div>
              <div className="w-full order-1 sm:order-2 sm:w-2/3">
                <div className="mb-5">
                  <label
                    htmlFor="Title"
                    className="block  text-md font-medium text-gray-900"
                  >
                    Title
                  </label>
                  <input
                    name="title"
                    type="text"
                    defaultValue={whyChooseDetails.title}
                    id="Title"
                    className="text-[19px] border-2 shadow-sm border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 px-3"
                    placeholder="Title"
                  />
                </div>
                <div className="mb-5">
                  <label
                    htmlFor="order"
                    className="block mb-0 text-md font-medium text-gray-900"
                  >
                    Order
                  </label>
                  <input
                    type="number"
                    id="order"
                    name="order"
                    min="0"
                    max="500"
                    defaultValue={whyChooseDetails?.order ?? ""}
                    className="text-[19px] border-2 shadow-sm border-gray-300 text-gray-900 text-sm rounded-lg 
             focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 px-3"
                    placeholder="Order"
                  />

                </div>
                <div className="mb-5">
                  <label
                    htmlFor="Description"
                    className="block mb-0 text-md font-medium text-gray-900"
                  >
                    Description
                  </label>
                  <textarea
                    name="discription"
                    defaultValue={whyChooseDetails.discription}
                    id="Description"
                    className="text-[19px] resize-none h-[100px] border-2 shadow-sm border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 px-3"
                    placeholder="Description"
                  > </textarea>
                </div>
              </div>
            </div>
            <button
              type="submit"
              className="focus:outline-none my-5 text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5"
            >
              {updateIdState ? "Update Category" : "Add Category"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
