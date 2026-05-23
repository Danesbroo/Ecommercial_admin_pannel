import React, { useEffect, useState } from "react";
import $ from "jquery";
import "dropify/dist/css/dropify.min.css";
import "dropify/dist/js/dropify.min.js";
import Breadcrumb from "../../common/Breadcrumb";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

export default function AddSubCategory() {
  let [category, setCategory] = useState([]);
  const [subCategoryDetails, setSubCategoryDetails] = useState({});
  const [updateIdState, setUpdateIdState] = useState(false);
  let [parentCategoryFilter, setParentCategoryFilter] = useState('');
  const [imagePath, setImagePath] = useState('');
  const params = useParams();
  const updateId = params.id;
  const navigate = useNavigate();

  useEffect(() => {
    axios.post(`${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_CATEGORY_VIEW}`)
      .then((success) => {
        if (success.data._status === true) {
          setCategory(success.data._data);
        } else {
          toast.error(success.data._message);
        }
      })
      .catch((error) => {
        toast.error(error.response?.data?._message || "Something went wrong!");
      });
  }, []);

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

  // Fetching the category list
  const formHandler = (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);

    if (updateId) {
      axios.put(`${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_SUBCATEGORY_UPDATE}/${updateId}`, formData)
        .then((success) => {
          if (success.data._status == true) {
            toast.success(success.data._message);
            navigate('/category/sub-category/view');
          } else {
            toast.error(success.data._message);
          }
        })
        .catch((error) => {
          toast.error(error._message);
        })
    } else {
      axios.post(`${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_SUBCATEGORY_CREATE}`, formData)
        .then((success) => {
          if (success.data._status === true) {
            toast.success(success.data._message);
            navigate('/category/sub-category/view'); // navigate to file into category page

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
      axios.post(import.meta.env.VITE_BASE_URL + import.meta.env.VITE_SUBCATEGORY_DETAILS, {
        id: updateId
      })
        .then((response) => {
          if (response.data._status == true) {
            setSubCategoryDetails(response.data._data)
            setImagePath(response.data._image_path + response.data._data.image);
          } else {
            setSubCategoryDetails('');
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
      <Breadcrumb path={"Sub Category"} link={'/category/sub-category/view'} path2={"Add"} slash={"/"} />
      <div className="w-full min-h-[610px]">
        <div className="max-w-[1220px] mx-auto py-5">
          <h3 className="text-[26px] font-semibold bg-slate-100 py-3 px-4 rounded-t-md border border-slate-400">
            {updateIdState ? "Update Sub Category" : "Add Sub Category"}
          </h3>
          <form onSubmit={formHandler} autoComplete="off" className="border border-t-0 p-3 rounded-b-md border-slate-400">
            <div className="flex flex-wrap sm:flex-nowrap gap-5">
              <div className="w-full sm:w-1/3 order-2 sm:order-1">
                <label
                  htmlFor="categoryImage"
                  className="block text-sm sm:text-md font-medium text-gray-900"
                >
                  Sub Category Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  data-default-file={imagePath}
                  id="image"
                  className="dropify"
                  data-height="230"
                />
              </div>

              <div className="w-full sm:w-2/3 order-1 sm:order-2">
                {/* Parent Category Dropdown */}
                <div className="mb-5">
                  <label className="block text-md font-medium text-gray-900">
                    Parent Category Name
                  </label>
                  <select
                    name="parent_Id"
                    className="border-2 border-gray-300 text-gray-900 mb-6 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
                  >
                    <option value="">Select Category</option>
                    {
                      category.map((v, i) => {
                        return (
                          <option key={i} value={v._id} selected={v._id === subCategoryDetails.parent_Id ? true : false}>
                            {v.name}
                          </option>
                        )
                      })
                    }
                  </select>
                </div>

                <div className="mb-5">
                  <label
                    htmlFor="categoryName"
                    className="block  text-md font-medium text-gray-900"
                  >
                    Category Name
                  </label>
                  <input
                    type="text"
                    defaultValue={subCategoryDetails.name}
                    name="name"
                    id="categoryName"
                    className="text-[19px] border-2 w-full shadow-sm border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block py-2.5 px-3"
                    placeholder="Category Name"
                  />
                </div>
                <div className="mb-5">
                  <label
                    htmlFor="categoryName"
                    className="block  text-md font-medium text-gray-900"
                  >
                    Order
                  </label>
                  <input
                    defaultValue={subCategoryDetails.order}
                    name="order"
                    type="text"
                    id="categoryName"
                    className="text-[19px] border-2 shadow-sm border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 px-3"
                    placeholder="Category Order"
                  />
                </div>

              </div>
              
            </div>
            <button
                type="submit"
                className="focus:outline-none my-5 text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5"
              >
                {updateIdState ? "Update Sub Category" : "Add Sub Category"}
              </button>

          </form>


        </div>
      </div>
    </section>
  );
}
