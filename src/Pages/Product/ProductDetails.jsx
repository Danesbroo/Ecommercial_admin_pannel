import React, { useEffect, useState } from 'react'
import Breadcrumb from '../../common/Breadcrumb'
import $ from "jquery";
import "dropify/dist/css/dropify.min.css";
import "dropify/dist/js/dropify.min.js";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useForm } from 'react-hook-form';

export default function ProductDetails() {

  useEffect(() => {
    $(".dropify").dropify({
      messages: {
        default: "Drag and drop ",
        replace: "Drag and drop ",
        remove: "Remove",
        error: "Oops, something went wrong"
      }
    });
  }, []);

  const [value, setValue] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const onSubmit = (data) => {
    console.log("Form Data:", data);
    // alert("Product Created Successfully!");
  };
  return (
    <section className="w-full">

      <Breadcrumb
        path={"Product"}
        path2={"Product Details"}
        slash={"/"}
      />


      <div className='w-full px-6 py-6  '>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-3 gap-[10px] ">
            {/* for left */}
            <div className="for-images ">

              <div className="">
                <label
                  htmlFor="ProductImage"
                  className="block  text-md font-medium text-gray-900 text-[#76838f]"
                >
                  Product Image
                </label>
                <input
                  type="file"
                  id="ProductImage"
                  className="dropify"
                  data-height="250"
                  {...register("productImage", { required: "Product Image is required" })}
                />
                {errors.productImage && <p className="text-red-500 text-sm">{errors.productImage.message}</p>}


              </div>

              <div className="">
                <label
                  htmlFor="backImage"
                  className="block  text-md font-medium text-gray-900 text-[#76838f]"
                >
                  Back Image
                </label>
                <input
                  type="file"
                  id="backImage"
                  className="dropify"
                  data-height="250"
                  {...register("backImage", { required: "Back Image is required" })}
                />
                 {errors.backImage && <p className="text-red-500 text-sm">{errors.backImage.message}</p>}
              </div>

              <div className="">
                <label
                  htmlFor="GalleryImage"
                  className="block  text-md font-medium text-gray-900 text-[#76838f]"
                >
                  Gallery Image
                </label>
                <input
                  type="file"
                  id="GalleryImage"
                  className="dropify"
                  data-height="250"
                  {...register("GalleryImage", { required: "Gallery Image is required" })}
                />
                 {errors.GalleryImage && <p className="text-red-500 text-sm">{errors.GalleryImage.message}</p>}
              </div>
            </div>

            {/* for midd */}
            <div className="middle">

              <div className="mb-5">
                <label
                  htmlFor="Prodct_Name"
                  className="block  text-md font-medium text-gray-900 text-[#76838f]"
                >
                  Prodct Name
                </label>
                <input
                  type="text"
                  className="text-[19px] border-2 shadow-sm border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 px-3"
                  placeholder='Prodct Name'
                  {...register("Prodct_Name", { required: "Prodct Name is required" })}
                />
                {errors.Prodct_Name && <p className="text-red-500 text-sm">{errors.Prodct_Name.message}</p>}
              </div>

              <div className="mb-5">
                <label
                  htmlFor="categoryName"
                  className="block  text-md font-medium text-gray-900 text-[#76838f]"
                >
                   Select Sub Category
                </label>
                <select  className="text-[19px] text-[#76838f] border-2 shadow-sm border-gray-300 text-gray-900 text-sm rounded-lg block w-full py-2.5 px-3">
                  <option value="">Select Category</option>
                    <option value="mobile">Mobile Phones</option>
                    <option value="laptop">Laptops</option>
                    <option value="men">Men's Wear</option>
                    <option value="women">Women's Wear</option>
                  
                </select>

              </div>

              <div className="mb-5">
                <label
                  htmlFor="categoryName"
                  className="block  text-md font-medium text-gray-900 text-[#76838f]"
                >
                  Select Meterial
                </label>
                <select className="text-[19px] text-[#76838f] border-2 shadow-sm border-gray-300 text-gray-900 text-sm rounded-lg block w-full py-2.5 px-3">
                  <option value="">Nothing Selected</option>
                  <option value="">Neem</option>
                  <option value="">Babbul</option>
                  <option value="">Neem</option>
                  <option value="">Babbul</option>
                  <option value="">Neem</option>
                  <option value="">Babbul</option>
                  <option value="">Neem</option>
                  <option value="">Babbul</option>

                </select>
              </div>

              <div className="mb-5">
                <label
                  htmlFor="categoryName"
                  className="block  text-md font-medium text-gray-900 text-[#76838f]"
                >
                  Select Prodcut Type
                </label>
                <select className="text-[19px] text-[#76838f] border-2 shadow-sm border-gray-300 text-gray-900 text-sm rounded-lg block w-full py-2.5 px-3">
                  <option value="">Nothing Selected</option>
                  <option value="">Featured</option>
                  <option value="">New Arrivals</option>
                  <option value="">Onsale</option>


                </select>
              </div>

              <div className="mb-5">
                <label
                  htmlFor="categoryName"
                  className="block  text-md font-medium text-gray-900 text-[#76838f]"
                >
                  Is Top Rated
                </label>
                <select className="text-[19px] text-[#76838f] border-2 shadow-sm border-gray-300 text-gray-900 text-sm rounded-lg block w-full py-2.5 px-3">
                  <option value="">Nothing Selected</option>
                  <option value="">Yes</option>
                  <option value="">No</option>

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
                  type="text"
                  className="text-[19px] border-2 shadow-sm border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 px-3"
                  placeholder='Actual Price'
                />
              </div>

              <div className="mb-5">
                <label
                  htmlFor="categoryName"
                  className="block  text-md font-medium text-gray-900 text-[#76838f]"
                >
                  Total In Stocks
                </label>
                <input
                  type="text"
                  className="text-[19px] border-2 shadow-sm border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 px-3"
                  placeholder='Total In Stocks'
                />
              </div>



            </div>

            {/* for right */}
            <div className="right-items">
            <div className="mb-5">
                <label
                  htmlFor="categoryName"
                  className="block  text-md font-medium text-gray-900 text-[#76838f]"
                >
                  Select Parent Category
                </label>
                <select className="text-[19px] text-[#76838f] border-2 shadow-sm border-gray-300 text-gray-900 text-sm rounded-lg block w-full py-2.5 px-3">
                  <option value="">Nothing Selected</option>

                  <option value="mobile">Mobile Phones</option>
                  <option value="laptop">Laptops</option>

                  <option value="men">Men's Wear</option>
                  <option value="women">Women's Wear</option>

                </select>
              </div>

              <div className="mb-5">
                <label
                  htmlFor="categoryName"
                  className="block  text-md font-medium text-gray-900 text-[#76838f]"
                >
                  Select Sub Sub Category
                </label>
                <select className="text-[19px] text-[#76838f] border-2 shadow-sm border-gray-300 text-gray-900 text-sm rounded-lg block w-full py-2.5 px-3">
                  <option value="">Nothing Selected</option>

                  <option value="mobile">Mobile Phones</option>
                  <option value="laptop">Laptops</option>

                  <option value="men">Men's Wear</option>
                  <option value="women">Women's Wear</option>

                </select>
              </div>

              <div className="mb-5">
                <label
                  htmlFor="categoryName"
                  className="block  text-md font-medium text-gray-900 text-[#76838f]"
                >
                  Select Color
                </label>
                <select className="text-[19px] text-[#76838f] border-2 shadow-sm border-gray-300 text-gray-900 text-sm rounded-lg block w-full py-2.5 px-3">
                  <option value="">Nothing Selected</option>

                  <option value="">Red</option>
                  <option value="">Blue</option>

                  <option value="">Green</option>
                  <option value="">Gray</option>

                </select>
              </div>

              <div className="mb-5">
                <label
                  htmlFor="categoryName"
                  className="block  text-md font-medium text-gray-900 text-[#76838f]"
                >
                  Is Best Selling
                </label>
                <select className="text-[19px] text-[#76838f] border-2 shadow-sm border-gray-300 text-gray-900 text-sm rounded-lg block w-full py-2.5 px-3">
                  <option value="">Nothing Selected</option>
                  <option value="">Yes</option>
                  <option value="">No</option>

                </select>
              </div>

              <div className="mb-5">
                <label
                  htmlFor="categoryName"
                  className="block  text-md font-medium text-gray-900 text-[#76838f]"
                >
                  Is Upsell
                </label>
                <select className="text-[19px] text-[#76838f] border-2 shadow-sm border-gray-300 text-gray-900 text-sm rounded-lg block w-full py-2.5 px-3">
                  <option value="">Nothing Selected</option>
                  <option value="">Yes</option>
                  <option value="">No</option>

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
                  type="text"
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
                  type="text"
                  className="text-[19px] border-2 shadow-sm border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 px-3"
                  placeholder='Order'
                />
              </div>


            </div>
          </div>

          <div className='py-[40px]'>
            <label
              htmlFor="categoryImage"
              className="block  text-md font-medium text-gray-900 text-[#76838f]"
            >
              Description
            </label>
            <ReactQuill theme="snow" value={value} onChange={setValue} className='h-[200px]' />
          </div>

          <button class=" mt-5 text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 "> Create Product </button>

        </form>

      </div>
    </section>
  )
}
