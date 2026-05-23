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

export default function ViewCategory() {
  // let [orderModal, setOrderModal] = useState(false);

  let [category, setCategory] = useState([]);
  let [activeFilter, setactiveFilter] = useState(true);
  let [subCategory, setSubCategory] = useState([])
  let [subSubCategory, setSubSubCategory] = useState([])
  let [parentDetails, setParentDetails] = useState('');
  let [subCategoryDetails, setSubcategoryDetails] = useState('');
  let [checkedValue, setCheckedValue] = useState([])
  let [apiStatus, setApiStatus] = useState(false);
  let [imagePath, setImagePath] = useState('');
  let [nameFilterValue, setNameFilterValue] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState()

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
  }, [parentDetails]);

  useEffect(() => {
    axios
      .post(
        `${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_SUBCATEGORY_VIEW}`)
      .then((success) => {
        if (success.data._status === true) {
          let filteredSubCategories = success.data._data;

          let filtered = filteredSubCategories.filter((item) => {
            if (item.parent_Id._id === parentDetails) {
              return item;
            }

          });
          setSubCategory([...filtered]);

        } else {
          toast.error(success.data._message);
        }
      })
  }, [parentDetails]);

  useEffect(() => {
    axios
      .post(
        `${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_SUB_SUB_CATEGORY_VIEW}`,{ parent_Id: subCategoryDetails, name: nameFilterValue, grandParent_Id: parentDetails, page: currentPage})
      .then((success) => {
        if (success.data._status === true) {
          setSubSubCategory(success.data._data);
          setImagePath(success.data._image_path)
          setTotalPages(success.data._pagination?.total_page || 1);
        } else {
          toast.error(success.data._message);
        }
      })
      .catch((error) => {
        toast.error(error.response?.data?._message || "Something went wrong!");
      });
  }, [subCategory, apiStatus, parentDetails, subCategoryDetails, nameFilterValue, currentPage]);

  var checkedAll = () => {
    if (subSubCategory.length !== checkedValue.length) {
      let data = subSubCategory.map((value) => value._id);
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
  const nameFilter = (event)=>{
    setNameFilterValue(event.target.value)
  }
  const parentNameFilter = (event) => {
    setParentDetails(event.target.value);
  }
  const subCategoryFilter = (event) => {
    setSubcategoryDetails(event.target.value);
  }
  const changeStatus = () => {
    if (checkedValue.length > 0) {
      axios
        .put(
          `${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_SUB_SUB_CATEGORY_CHANGE_STATUS}`,
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
            `${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_SUB_SUB_CATEGORY_DELETE}`,
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

  return (
    <section className="w-full">

      <Breadcrumb path={"Sub Sub Category"} link={'/category/sub-sub-category/view'} path2={"View"} slash={"/"} />

      <div className={`rounded-lg border border-gray-300 px-5 py-5 max-w-[1220px] mx-auto mt-10 ${activeFilter ? "hidden" : "block"}`}>

        <form className="grid grid-cols-[20%__20%_35%_5%] gap-[1%] items-center ">
          <div className="">

            <select
              onChange={parentNameFilter}
              name="parentCatSelectBox"
              className="border  border-gray-300 text-gray-900  text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-3"
            >
              <option value="">Select Parent Category</option>
              {
                category.map((v, i) => (
                  <option key={i} value={v._id}>{v.name}</option>
                ))
              }

            </select>
          </div>
          <div className="">

            <select
              onChange={subCategoryFilter}
              name="subCatSelectBox"
              className="border  border-gray-300 text-gray-900  text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-3"
            >
              <option value="">Select Sub Category</option>
              {
                subCategory.map((v, i) => (
                  <option key={i} value={v._id}>{v.name}</option>
                ))
              }
            </select>
          </div>
          <div className="">
            <input
              onKeyUp={nameFilter}
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
          <div className='flex item-center flex-wrap sm:flex-nowrap gap-y-2 justify-between bg-slate-100 py-3 px-4 rounded-t-md border border-slate-400'>
            <h3 className="text-[16px] sm:text-[20px] md:text-[26px] font-semibold" >
              View Sub Sub Category
            </h3>
            <div className='flex justify-between '>
              <div onClick={() => setactiveFilter(!activeFilter)} className="cursor-pointer text-[white] mx-3 rounded-[50%] w-[40px] h-[40px]  mx-3 rounded-[50%] w-[40px] h-[40px] flex items-center justify-center  text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                {activeFilter ? <FaFilter className='text-[18px]' /> : <MdFilterAltOff className='text-[18px]' />}
              </div>

              <button onClick={changeStatus} disabled={checkedValue.length === 0}  type="button" className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"> Change Status</button>
              <button onClick={deleteFile} disabled={checkedValue.length === 0} type="button" className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">Delete </button>
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
                            onClick={checkedAll}
                            checked={subSubCategory.length === checkedValue.length ? true : false}
                            id="checkbox-all-search"
                            type="checkbox"
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                          <label for="checkbox-all-search" className="sr-only">checkbox</label>
                        </div>
                      </th>

                      <th scope="col" className="text-[10px] sm:text-[14px] px-0 py-3">
                        Parent Category
                      </th>
                      <th scope="col" className="text-[10px] text-wrap sm:text-[14px] px-0 py-3">
                        Sub Category
                      </th>
                      <th scope="col" className="text-[10px] sm:text-[14px] px-0 py-3">
                        Category Name
                      </th>
                      <th scope="col" className="text-[10px] sm:text-[14px] w-[12%] ">
                        Image
                      </th>
                      <th scope="col" className="text-[10px] sm:text-[14px] w-[10%] ">
                        Order
                      </th>
                      <th scope="col" className="text-[10px] sm:text-[14px] w-[10%]  ">
                        Status
                      </th>
                      <th scope="col" className="text-[10px] sm:text-[14px] w-[6%]">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      subSubCategory.length > 0
                        ?
                        subSubCategory.map((v, i) => {
                          return (
                            <tr key={i} className="bg-white  dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
                              <td className="w-4 p-4">
                                <div className="flex items-center">
                                  <input onChange={() => singleCheck(v._id)}
                                    checked={checkedValue.includes(v._id)}
                                    id="checkbox-table-search-1"
                                    type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                  <label for="checkbox-table-search-1" className="sr-only">checkbox</label>
                                </div>
                              </td>
                              <td scope="row" className=" px-6 py-4 text-white font-medium whitespace-nowrap dark:text-white">

                              {v?.grandParent_Id?.name || "N/A"}
                              </td>
                              <td className=" py-4">
                                {v?.parent_Id?.name || "N/A"}
                              </td>
                              <td className=" py-4">
                                {v.name}
                              </td>

                              <td className=" py-4">
                                {
                                  v.image !== '' ?
                                    <img className="w-10 h-10 rounded-full" src={imagePath + v.image} alt="Jese image" />
                                    :
                                    "N/A"
                                }
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
                                <Link to={`/category/sub-sub-category/update/${v._id}`} >
                                  <div className="rounded-[50%] text-white w-[40px] h-[40px] flex items-center justify-center bg-blue-700  border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                    <MdModeEdit className='text-[18px]' />
                                  </div>
                                </Link>
                              </td>
                            </tr>
                          )
                        })
                        :
                        ''
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
