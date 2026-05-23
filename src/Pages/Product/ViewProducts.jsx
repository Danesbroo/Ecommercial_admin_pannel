import React, { useEffect, useState } from 'react'
import Breadcrumb from '../../common/Breadcrumb'
import { Link } from 'react-router-dom';
import { MdFilterAltOff, MdModeEdit, MdModeEditOutline } from 'react-icons/md';
import ResponsivePagination from 'react-responsive-pagination';
import 'react-responsive-pagination/themes/classic-light-dark.css';
import { FaFilter } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
// import { MdModeEditOutline } from "react-icons/md";

export default function ViewProducts() {
  let [category, setCategory] = useState([]);
  let [products, setProducts] = useState([])
  let [activeFilter, setactiveFilter] = useState(true);
  let [nameFilter, setNameFilter] = useState('');
  let [checkedValue, setCheckedValue] = useState([])
  let [apiStatus, setApiStatus] = useState(false);
  let [imagePath, setImagePath] = useState('');
  let [nameFilterValue, setNameFilterValue] = useState('');
  let [parentCategoryFilter, setParentCategoryFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState()

  useEffect(() => {
    axios.post(`${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_CATEGORY_VIEW}`)
      .then((success) => {
        if (success.data._status === true) {
          setImagePath(success.data.image)
          setCategory(success.data._data);
          
          
        } else {
          toast.error(success.data._message);
        }
      })
      .catch((error) => {
        toast.error(error.response?.data?._message || "Something went wrong!");
      });
  }, [currentPage]);

  useEffect(() => {
    axios
      .post(
        `${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_PRODUCT_VIEW}`,
        { name: nameFilterValue, parent_category_ids: parentCategoryFilter,page: currentPage }
      )
      .then((success) => {
        if (success.data._status === true) {
          setTotalPages(success.data._pagination?.total_pages || 1);
          // Build full image URLs here
          const fullData = success.data._data.map(item => ({...item, 
            image: success.data._image_path + item.image   // ✅ join base + filename

          }));
          setProducts(fullData);
          setTotalPages(success.data._pagination?.total_pages || 1);
        } else {
          toast.error(success.data._message);
        }
      })
      .catch((error) => {
        toast.error(error.response?.data?._message || "Something went wrong!");
      });
  }, [apiStatus, parentCategoryFilter, nameFilterValue, currentPage]);


  // checkAll checkbox
  var checkedAll = () => {
    if (products.length !== checkedValue.length) {
      let data = products.map((value) => value._id);
      setCheckedValue(data);
    } else {
      setCheckedValue([]);
    }
  }


  // check single checkbox
  var singleCheck = (id) => {
    if (checkedValue.includes(id)) {
      setCheckedValue(checkedValue.filter((value) => value !== id));
    } else {
      setCheckedValue([...checkedValue, id]);
    }
  }

  const changeStatus = () => {
    if (checkedValue.length > 0) {
      axios
        .put(
          `${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_PRODUCT_CHANGE_STATUS}`,
          { id: checkedValue }
        )
        .then((response) => {
          if (response.data._status === true) {
            toast.success(response.data._message);
            setApiStatus(!apiStatus);
            setCheckedValue([]);
          } else {
            toast.error(response.data._message);
          }
        })
        .catch((error) => {
          toast.error(error.response?.data?._message || "Something went wrong!");
        })
    } else {
      toast.error('Please select at least 1 record to change status')
    }
  }
  const deleteFile = () => {
    if (checkedValue.length > 0) {
      if (confirm('Are you sure you want to delete?')) {
        axios
          .put(
            `${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_PRODUCT_DELETE}`,
            { id: checkedValue }
          )
          .then((response) => {
            if (response.data._status === true) {
              toast.success(response.data._message);
              setApiStatus(!apiStatus);
              setCheckedValue([]);
            } else {
              toast.error(response.data._message);
            }
          })
          .catch((error) => {
            toast.error(error.response?.data?._message || "Something went wrong!");
          })
      }
    } else {
      toast.error('Please select at least 1 record to delete')
    }
  }
  const filterValue = (event) => {
    setParentCategoryFilter(event.target.value);
  }
  const filterKeyValue = (event) => {
    setNameFilterValue(event.target.value);
  }

  return (
    <section className="w-full">

      <Breadcrumb path={"Products"} link={'/products/view'} path2={"View"} slash={"/"} />

      <div className={`rounded-lg border border-gray-300 px-5 py-5 max-w-[1220px] mx-auto mt-10 ${activeFilter ? "hidden" : "block"}`}>

        <form className="grid grid-cols-[40%_35%_5%] gap-[1%] items-center ">
          <div className="">

            <select
              onChange={filterValue}
              name="parentCatSelectBox"
              className="border  border-gray-300 text-gray-900  text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-3"
            >
              <option value="">Select Parent Category</option>
              {
                category.map((v, i) => {
                  return (
                    <option key={i} value={v._id}>
                      {v.name}
                    </option>
                  )
                })
              }

            </select>
          </div>
          <div className="">
            <input
              onKeyUp={filterKeyValue}
              type="text"
              id="simple-search"
              className="border  border-gray-300 text-gray-900  text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-3"
              placeholder="Search  name..."
              required
            />
          </div>
        </form>

      </div>
      <div className="w-full min-h-[610px]">
        <div className="max-w-[1220px] mx-auto py-5">
          <div className='flex item-center justify-between bg-slate-100 py-3 px-2 rounded-t-md border border-slate-400'>
            <h3 className="text-[16px] sm:text-[20px] md:text-[26px] font-semibold" >
              View Products
            </h3>
            <div className='flex justify-between '>
              <div onClick={() => setactiveFilter(!activeFilter)} className="cursor-pointer text-[white] mx-3 rounded-[50%] w-[40px] h-[40px]  mx-3 rounded-[50%] w-[40px] h-[40px] flex items-center justify-center  text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                {activeFilter ? <FaFilter className='text-[18px]' /> : <MdFilterAltOff className='text-[18px]' />}
              </div>

              <button onClick={changeStatus} type="button" className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-2 sm:px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"> Change Status</button>
              <button onClick={deleteFile} type="button" className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-2 sm:px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">Delete </button>
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
                            onChange={checkedAll}
                            checked={products.length > 0 && products.length === checkedValue.length}
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                          <label for="checkbox-all-search" className="sr-only">checkbox</label>
                        </div>
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Parent Category Name
                      </th>
                      <th scope="col" className="px-0 py-3">
                        Product Name
                      </th>
                      <th scope="col" className=" w-[12%] ">
                        Product Code
                      </th>
                      <th scope="col" className=" w-[12%] ">
                        Actual Price
                      </th>
                      <th scope="col" className=" w-[12%] ">
                        Sales Price
                      </th>
                      <th scope="col" className=" w-[10%] ">
                        Order
                      </th>
                      <th scope="col" className="w-[10%]  ">
                        Status
                      </th>
                      <th scope="col" className="w-[6%]">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      products.length > 0
                        ?
                        products.map((v, i) => {
                          return (
                            <tr className="bg-white  dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
                              <td className="w-4 p-4">
                                <div className="flex items-center">
                                  <input id="checkbox-table-search-1"
                                    type="checkbox"
                                    onChange={() => singleCheck(v._id)}
                                    checked={checkedValue.includes(v._id)}
                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                  <label for="checkbox-table-search-1" className="sr-only">checkbox</label>
                                </div>
                              </td>
                              <td scope="row" className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white">

                                <div className=" flex py-4">
                                  {
                                    v.parent_category_ids && v.parent_category_ids.length > 0
                                      ? v.parent_category_ids.map((item, index) => (
                                        <div key={index} className="flex items-center">
                                          <span>{item.name}</span>
                                          {index !== v.parent_category_ids.length - 1 && (
                                            <span className="mx-2 text-gray-400">{">"}</span>
                                          )}
                                        </div>
                                      ))
                                      : 'N/A'
                                  }
                                </div>
                              </td>
                              <td className=" py-4">
                                {v.name}
                              </td>
                              {v.product_code}
                              <td className="py-4">
                                {v.actual_price}
                              </td>

                              <td className=" py-4">
                                {v.sale_price}
                              </td>
                              <td className=" py-4">
                                {v.order}
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

                                <Link to={`/product/update/${v._id}`} >
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
                <div className='py-1 flex flex-row-reverse'>
                    <ResponsivePagination
                      current={currentPage}
                      total={totalPages}
                      onPageChange={setCurrentPage}
                    />
                  </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}
