import React, { useEffect, useState } from 'react'
import $ from "jquery";
import "dropify/dist/css/dropify.min.css";
import "dropify/dist/js/dropify.min.js";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function AddProduct() {

  const [product, setProduct] = useState([]);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [subSubCategory, setSubSubCategory] = useState([]);
  const [color, setColor] = useState([]);
  const [material, setMaterial] = useState([]);
  const [productDetails, setProductDetails] = useState('');
  const [updateIdState, setUpdateIdState] = useState(false);
  const [imagePath, setImagePath] = useState('');
  const params = useParams();
  const updateId = params.id;
  const navigate = useNavigate();

  useEffect(() => {
    axios.post(import.meta.env.VITE_BASE_URL + import.meta.env.VITE_COLOR_VIEW)
      .then((success) => {
        if (success.data._status === true) {
          setColor(success.data._data)
        } else {
          toast.error(success.data._Error_Message[0]);
        }
      })
      .catch((error) => {
        toast.error(error.data._Error_Message[0]);
      });
  }, []);

  useEffect(() => {
    axios.post(import.meta.env.VITE_BASE_URL + import.meta.env.VITE_MATERIAL_VIEW)
      .then((success) => {
        if (success.data._status === true) {
          setMaterial(success.data._data)
        } else {
          toast.error(success.data._Error_Message[0]);
        }
      })
      .catch((error) => {
        toast.error(error.data._Error_Message[0]);
      });
  }, []);

  useEffect(() => {
    axios
      .post(
        `${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_CATEGORY_VIEW}`)
      .then((success) => {
        if (success.data._status === true) {
          setCategory(success.data._data)
        } else {
          toast.error(success.data._message);
        }
      })
      .catch((error) => {
        toast.error(error.response?.data?._message || "Something went wrong!");
      });
  }, []);

  const changeParentCategory = (e) => {
    let parentId = e.target.value;
    axios.post(import.meta.env.VITE_BASE_URL + import.meta.env.VITE_SUBCATEGORY_VIEW, { parent_Id: parentId })
      .then((success) => {
        if (success.data._status === true) {
          setSubCategory(success.data._data)
        } else {
          toast.error(success.data._Error_Message[0]);
        }
      })
      .catch((error) => {
        toast.error(error.data._Error_Message[0]);
      });
  } 

  const changeSubCategory = (e) => {
    let subId = e.target.value;
    axios.post(import.meta.env.VITE_BASE_URL + import.meta.env.VITE_SUB_SUB_CATEGORY_VIEW, { parent_Id: subId })
      .then((success) => {
        if (success.data._status === true) {
          setSubSubCategory(success.data._data)
        } else {
          toast.error(success.data._Error_Message[0]);
        }
      })
      .catch((error) => {
        toast.error(error.data._Error_Message[0]);
      });
  }

  useEffect(() => {
    const dropifyElement = $("#image");

    if (dropifyElement.data('dropify')) {
      dropifyElement.data('dropify').destroy();
      dropifyElement.removeData('dropify');
    }
    // update dropify
    dropifyElement.replaceWith(
      `<input type="file" name="image" id="image" class="dropify" data-height="250" data-default-file="${imagePath}" accept="image/*" multiple = 'multiple'>`
    );
    $("#image").dropify()
  }, [imagePath]);


  useEffect(() => {
    const dropifyElement = $("#images");

    if (dropifyElement.data('dropify')) {
      dropifyElement.data('dropify').destroy();
      dropifyElement.removeData('dropify');
    }
    // update dropify
    dropifyElement.replaceWith(
      `<input type="file" name="images" id="images" class="dropify" data-height="250" data-default-file="" accept="image/*" multiple = 'multiple'>`
    );
    $("#images").dropify()
  }, [imagePath]);

  const formHandler = (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);

    if (updateId) {
      axios.put(`${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_PRODUCT_UPDATE}/${updateId}`, formData)
        .then((success) => {
          if (success.data._status == true) {
            toast.success(success.data._message);
            navigate('/product/view');
          } else {
            toast.error(success.data._message);
          }
        })
        .catch((error) => {
          toast.error(error._message);
        })
    } else {
      axios.post(`${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_PRODUCT_CREATE}`, formData)
        .then((success) => {
          if (success.data._status === true) {
            toast.success(success.data._message);
            navigate('/product/view'); // navigate to file into category page

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
      axios.post(import.meta.env.VITE_BASE_URL + import.meta.env.VITE_PRODUCT_DETAILS, {
        id: updateId
      })
        .then((response) => {
          if (response.data._status == true) {
            setProductDetails(response.data._data)
            setValue(response.data._data.long_description || '')// to set default value of text editor
            setImagePath(response.data._image_path + response.data._data.image);
          } else {
            setProductDetails('');
          }
        })
        .catch(() => {
          toast.error('Something went wrong !!');
        })
    }
  }, [updateId]);


  const [value, setValue] = useState(productDetails.long_description || ""); //text editor value we can't get directly like event.target.value that's why we have to store setvalue which record the value of text editor and store in state
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
              <Link to={"/product/view"} className="ms-1 text-md font-medium text-gray-700 hover:text-blue-600 md:ms-2">Product</Link>
            </div>
          </li>
          <li aria-current="page">
            <div className="flex items-center">
              /
              <span className="ms-1 text-md font-medium text-gray-500 md:ms-2">{updateIdState ? "Update" : "Add"}</span>
            </div>
          </li>
        </ol>
      </nav>
      <div className='w-full px-6 py-6  '>

        <form onSubmit={formHandler}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-[10px] ">
            {/* for left */}
            <div className="for-images order-3 sm:order-1 ">

              <div className="">
                <label
                  htmlFor="ProductImage"
                  className="block  text-md font-medium text-gray-900 text-[#76838f]"
                >
                  Product Image
                </label>
                <input
                  type="file"
                  id="image"
                  name='image'
                  data-default-file={imagePath}
                  className="dropify"
                  data-height="230"
                  multiple='multiple'
                />
              </div>

              <div className="py-5">
                <label
                  htmlFor="GalleryImage"
                  className="block  text-md font-medium text-gray-900 text-[#76838f]"
                >
                  Gallery Image
                </label>
                <input
                  type="file"
                  id="images"
                  name='images'
                  className="dropify"
                  data-height="230"
                  multiple='multiple'
                />
              </div>
            </div>

            {/* for midd */}
            <div className="middle order-1 sm:order-2">

              <div className="mb-5">
                <label
                  htmlFor="Prodct_Name"
                  className="block  text-md font-medium text-gray-900 text-[#76838f]"
                >
                  Product Name
                </label>
                <input
                  defaultValue={productDetails.name}
                  name='name'
                  type="text"
                  className="text-[19px] border-2 shadow-sm border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 px-3"
                  placeholder='Prodct Name'
                />
              </div>
              <div className="mb-5">
                <label
                  htmlFor="categoryName"
                  className="block  text-md font-medium text-gray-900 text-[#76838f]"
                >
                  Select Meterial
                </label>
                <select
                  name='material_ids'
                  className="text-[19px] text-[#76838f] border-2 shadow-sm border-gray-300 text-gray-900 text-sm rounded-lg block w-full py-2.5 px-3">
                  <option value="">Nothing Selected</option>
                  {
                    material.map((item, i) => {
                      return (
                        <option value={item._id} key={i} selected={productDetails?.material_ids?.includes(item._id) ? 'selected' : ''}  >{item.name}</option>
                      )
                    })
                  }

                </select>
              </div>
              <div className="mb-5">
                <label
                  htmlFor="categoryName"
                  className="block  text-md font-medium text-gray-900 text-[#76838f]"
                >
                  Select Parent Category
                </label>
                <select
                  name='parent_category_ids' // we declear this name because which is in schema
                  onChange={changeParentCategory}
                  className="text-[19px] text-[#76838f] border-2 shadow-sm border-gray-300 text-gray-900 text-sm rounded-lg block w-full py-2.5 px-3">
                  <option value="">Nothing Selected</option>

                  {
                    category.map((item, i) => {
                      return (
                        <option value={item._id} key={i} selected={productDetails?.parent_category_ids?.includes(item._id) ? 'selected' : ''} >{item.name}</option>
                      )
                    })
                  }
                </select>
              </div>

              <div className="mb-5">
                <label
                  htmlFor="categoryName"
                  className="block  text-md font-medium text-gray-900 text-[#76838f]"
                >
                  Select Sub Category
                </label>
                <select
                  name='sub_category_ids[]'
                  // multiple = 'multiple' if we want to select multiple option
                  onChange={changeSubCategory}
                  className="text-[19px] text-[#76838f] border-2 shadow-sm border-gray-300 text-gray-900 text-sm rounded-lg block w-full py-2.5 px-3">
                  <option value="">Select Category</option>
                  {
                    subCategory.map((item, i) => {
                      return (
                        <option value={item._id} key={i} selected={productDetails?.sub_category_ids?.includes(item._id) ? 'selected' : ''}>{item.name}</option>
                      )
                    })
                  }
                </select>
              </div>
              <div className="mb-5">
                <label
                  htmlFor="categoryName"
                  className="block  text-md font-medium text-gray-900 text-[#76838f]"
                >
                  Select Sub Sub Category
                </label>
                <select
                  name='sub_sub_category_ids'
                  className="text-[19px] text-[#76838f] border-2 shadow-sm border-gray-300 text-gray-900 text-sm rounded-lg block w-full py-2.5 px-3">
                  <option value="">Nothing Selected</option>
                  {
                    subSubCategory.map((item, i) => {
                      return (
                        <option value={item._id} key={i} selected={productDetails?.sub_sub_category_ids?.includes(item._id) ? 'selected' : ''} >{item.name}</option>
                      )
                    })
                  }

                </select>
              </div>

              <div className="mb-5">
                <label
                  htmlFor="categoryName"
                  className="block  text-md font-medium text-gray-900 text-[#76838f]"
                >
                  Actual Price
                </label>
                <input
                  defaultValue={productDetails.actual_price}
                  type="text"
                  name='actual_price'
                  className="text-[19px] border-2 shadow-sm border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 px-3"
                  placeholder='Actual Price'
                />
              </div>
              <div className="mb-5">
                <label
                  htmlFor="categoryName"
                  className="block  text-md font-medium text-gray-900 text-[#76838f]"
                >
                  Trending
                </label>
                <select
                  name='is_trending'
                  className="text-[19px] text-[#76838f] border-2 shadow-sm border-gray-300 text-gray-900 text-sm rounded-lg block w-full py-2.5 px-3">
                  <option value="">Nothing Selected</option>
                  <option value="1" selected={productDetails.is_trending == 1 ? 'selected' : ''}>Yes</option>
                  <option value="0" selected={productDetails.is_trending == 0 ? 'selected' : ''}>No</option>
                </select>
              </div>
              <div className="mb-5">
                <label
                  htmlFor="categoryName"
                  className="block  text-md font-medium text-gray-900 text-[#76838f]"
                >
                  New Arrival
                </label>
                <select
                  name='is_new_arrival'
                  className="text-[19px] text-[#76838f] border-2 shadow-sm border-gray-300 text-gray-900 text-sm rounded-lg block w-full py-2.5 px-3">
                  <option value="">Nothing Selected</option>
                  <option value="1" selected={productDetails.is_new_arrival == 1 ? 'selected' : ''}>Yes</option>
                  <option value="0" selected={productDetails.is_new_arrival == 0 ? 'selected' : ''}>No</option>
                </select>
              </div>
              <div className="mb-5">
                <label
                  htmlFor="categoryName"
                  className="block  text-md font-medium text-gray-900 text-[#76838f]"
                >
                  Stocks
                </label>
                <input
                  type="text"
                  defaultValue={productDetails.stock}
                  name='stock'
                  className="text-[19px] border-2 shadow-sm border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 px-3"
                  placeholder='Total In Stocks'
                />
              </div>
              <div className="mb-5">
                <label
                  htmlFor="categoryName"
                  className="block  text-md font-medium text-gray-900 text-[#76838f]"
                >
                  Product Dimension
                </label>
                <input
                  defaultValue={productDetails.product_dimension}
                  type="text"
                  name='product_dimension'
                  className="text-[19px] border-2 shadow-sm border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 px-3"
                  placeholder='Enter Product Dimension'
                />
              </div>

            </div>

            {/* for right */}
            <div className="right-items order-2 sm:order-3">
              <div className="mb-5">
                <label
                  htmlFor="categoryName"
                  className="block  text-md font-medium text-gray-900 text-[#76838f]"
                >
                  Product Code
                </label>
                <input
                  type="text"
                  defaultValue={productDetails.product_code}
                  name='product_code'
                  className="text-[19px] border-2 shadow-sm border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 px-3"
                  placeholder='Enter Product code'
                />
              </div>
              <div className="mb-5">
                <label
                  htmlFor="categoryName"
                  className="block  text-md font-medium text-gray-900 text-[#76838f]"
                >
                  Select Color
                </label>
                <select
                  name='color_ids'
                  className="text-[19px] text-[#76838f] border-2 shadow-sm border-gray-300 text-gray-900 text-sm rounded-lg block w-full py-2.5 px-3">
                  <option value="">Nothing Selected</option>

                  {
                    color.map((item, i) => {
                      return (
                        <option value={item._id} key={i} selected={productDetails?.color_ids?.includes(item._id) ? 'selected' : ''}>{item.name}</option>
                      )
                    })
                  }
                </select>
              </div>
              <div className="mb-5">
                <label
                  htmlFor="categoryName"
                  className="block  text-md font-medium text-gray-900 text-[#76838f]"
                >
                  Is Featured
                </label>
                <select
                  name='is_featured'
                  className="text-[19px] text-[#76838f] border-2 shadow-sm border-gray-300 text-gray-900 text-sm rounded-lg block w-full py-2.5 px-3">
                  <option value="">Nothing Selected</option>
                  <option value="1" selected={productDetails.is_featured == 1 ? 'selected' : ''}>Yes</option>
                  <option value="0" selected={productDetails.is_featured == 0 ? 'selected' : ''}>No</option>

                </select>
              </div>

              <div className="mb-5">
                <label
                  htmlFor="categoryName"
                  className="block  text-md font-medium text-gray-900 text-[#76838f]"
                >
                  Is Best Selling
                </label>
                <select
                  name='is_best_selling'
                  className="text-[19px] text-[#76838f] border-2 shadow-sm border-gray-300 text-gray-900 text-sm rounded-lg block w-full py-2.5 px-3">
                  <option value="">Nothing Selected</option>
                  <option value="1" selected={productDetails.is_best_selling == 1 ? 'selected' : ''}>Yes</option>
                  <option value="0" selected={productDetails.is_best_selling == 0 ? 'selected' : ''}>No</option>
                </select>
              </div>

              <div className="mb-5">
                <label
                  htmlFor="categoryName"
                  className="block  text-md font-medium text-gray-900 text-[#76838f]"
                >
                  Is Upsell
                </label>
                <select
                  name='is_up_sell'
                  className="text-[19px] text-[#76838f] border-2 shadow-sm border-gray-300 text-gray-900 text-sm rounded-lg block w-full py-2.5 px-3">
                  <option value="">Nothing Selected</option>
                  <option value="1" selected={productDetails.is_up_sell == 1 ? 'selected' : ''}>Yes</option>
                  <option value="0" selected={productDetails.is_up_sell == 0 ? 'selected' : ''}>No</option>
                </select>
              </div>
              <div className="mb-5">
                <label
                  htmlFor="categoryName"
                  className="block  text-md font-medium text-gray-900 text-[#76838f]"
                >
                  On Sale
                </label>
                <select
                  name='is_on_sell'
                  className="text-[19px] text-[#76838f] border-2 shadow-sm border-gray-300 text-gray-900 text-sm rounded-lg block w-full py-2.5 px-3">
                  <option value="">Nothing Selected</option>
                  <option value="1" selected={productDetails.is_on_sell == 1 ? 'selected' : ''}>Yes</option>
                  <option value="0" selected={productDetails.is_on_sell == 0 ? 'selected' : ''}>No</option>
                </select>
              </div>
              <div className="mb-5">
                <label
                  htmlFor="categoryName"
                  className="block  text-md font-medium text-gray-900 text-[#76838f]"
                >
                  Top Rated
                </label>
                <select
                  name='is_top_rated'
                  className="text-[19px] text-[#76838f] border-2 shadow-sm border-gray-300 text-gray-900 text-sm rounded-lg block w-full py-2.5 px-3">
                  <option value="">Nothing Selected</option>
                  <option value="1" selected={productDetails.is_top_rated == 1 ? 'selected' : ''}>Yes</option>
                  <option value="0" selected={productDetails.is_top_rated == 0 ? 'selected' : ''}>No</option>
                </select>
              </div>
              <div className="mb-5">
                <label
                  htmlFor="categoryName"
                  className="block  text-md font-medium text-gray-900 text-[#76838f]"
                >
                  Online Store
                </label>
                <select
                  name='is_online_store'
                  className="text-[19px] text-[#76838f] border-2 shadow-sm border-gray-300 text-gray-900 text-sm rounded-lg block w-full py-2.5 px-3">
                  <option value="">Nothing Selected</option>
                  <option value="1" selected={productDetails.is_online_store == 1 ? 'selected' : ''}>Yes</option>
                  <option value="0" selected={productDetails.is_online_store == 0 ? 'selected' : ''}>No</option>
                </select>
              </div>
              <div className="mb-5">
                <label
                  htmlFor="categoryName"
                  className="block  text-md font-medium text-gray-900 text-[#76838f]"
                >
                  Sale Price
                </label>
                <input
                  defaultValue={productDetails.sale_price}
                  type="text"
                  name='sale_price'
                  className="text-[19px] border-2 shadow-sm border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 px-3"
                  placeholder=' Sale Price'
                />
              </div>

              <div className="mb-5">
                <label
                  htmlFor="categoryName"
                  className="block  text-md font-medium text-gray-900 text-[#76838f]"
                >
                  Order
                </label>
                <input
                  defaultValue={productDetails.order}
                  type="text"
                  name='order'
                  className="text-[19px] border-2 shadow-sm border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 px-3"
                  placeholder='Order'
                />
              </div>
              <div className="mb-5">
                <label
                  htmlFor="categoryName"
                  className="block  text-md font-medium text-gray-900 text-[#76838f]"
                >
                  Estimate Shipping Time
                </label>
                <input
                  type="text"
                  defaultValue={productDetails.estimate_delevery_days}
                  name='estimate_delevery_days'
                  className="text-[19px] border-2 shadow-sm border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 px-3"
                  placeholder='Estimate Shipping Time'
                />
              </div>

            </div>
          </div>

          <div className='py-[10px]'>
            <label
              htmlFor="categoryImage"
              className="block  text-md font-medium text-gray-900 text-[#76838f]"
            >
              Short Description
            </label>
            <textarea
              defaultValue={productDetails.short_description}
              name='short_description'
              className="text-[19px] border-2 shadow-sm border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full px-3"
              placeholder='Short Description'
            >
            </textarea>

          </div>
          <div className='py-[20px]'>
            <label
              htmlFor="long_description"
              className="block text-md font-medium text-gray-900 text-[#76838f]"
            >
              Long Description
            </label>
            <ReactQuill
              theme="snow"
              value={value}   // controlled input
              onChange={setValue}
              className='h-[100px] sm:h-[200px]'
            />
          </div>

          {/* hidden input now tracks the same state */}
          <input type="hidden" value={value} name="long_description" />

          <button class=" mt-10 text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 ">
            {updateIdState ? "Update Product " : "Add Product"}
          </button>

        </form>

      </div>
    </section>
  )
}

