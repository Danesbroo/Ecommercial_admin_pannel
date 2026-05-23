import React, { useEffect, useState } from 'react'
import Breadcrumb from '../../common/Breadcrumb'
import { Link } from 'react-router-dom';
import { MdFilterAltOff, MdModeEdit, MdModeEditOutline } from 'react-icons/md';
import ResponsivePagination from 'react-responsive-pagination';
import 'react-responsive-pagination/themes/classic-light-dark.css';
import { FaFilter } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function TestimonialView() {

  let [activeFilter, setactiveFilter] = useState(true);
  let [checkedValue, setCheckedValue] = useState([])
  let [testimonial, setTestimonial] = useState([]);
  let [imagePath, setImagePath] = useState('')
  let [nameFilter, setNameFilter] = useState('')
  let [apiStatus, setApiStatus] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState()

  useEffect(() => {
    axios
      .post(
        `${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_TESTIMONIAL_VIEW}`, { name: nameFilter, page: currentPage})
      .then((success) => {
        if (success.data._status === true) {
          setTestimonial(success.data._data)
          setImagePath(success.data._image_path);
          setTotalPages(success.data._pagination?.total_page || 1);
        } else {
          toast.error(success.data._message);
        }
      })
      .catch((error) => {
        toast.error(error.response?.data?._message || "Something went wrong!");
      });
  }, [nameFilter, apiStatus, currentPage]);

  var checkedAll = () => {
    if (testimonial.length !== checkedValue.length) {
      let data = testimonial.map((value) => value._id);
      setCheckedValue(data);
    } else {
      setCheckedValue([]);
    }
  }

  // search value from filter
  const searchName = (event) => {
    setNameFilter(event.target.value)
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
          `${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_TESTIMONIAL_CHANGE_STATUS}`,
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
            `${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_TESTIMONIAL_DELETE}`,
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

      <Breadcrumb path={"testimonial"} link={'/testimonial/view'} path2={"View"} slash={"/"} />

      <div className={` rounded-lg border border-gray-300 px-5 py-5 max-w-[1220px] mx-auto mt-10 ${activeFilter ? "hidden" : "block"}`}>

        <form className="flex max-w-sm">
          <div className="relative w-full">
            <input
              onKeyUp={searchName}
              name='search'
              type="text"
              id="simple-search"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-2 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Search Name"
              required
            />
          </div>
        </form>


      </div>
      <div className="w-full min-h-[610px]">
        <div className="max-w-[1220px] mx-auto py-5">
          <div className='flex item-center flex-wrap sm:flex-nowrap gap-y-2 justify-between bg-slate-100 py-3 px-4 rounded-t-md border border-slate-400'>
            <h3 className="text-[18px] sm:text-[22px] font-semibold" >
              View Testimonial
            </h3>
            <div className='flex justify-between '>
              <div onClick={() => setactiveFilter(!activeFilter)} className="cursor-pointer text-[white] mx-3 rounded-[50%] w-[40px] h-[40px]  mx-3 rounded-[50%] w-[40px] h-[40px] flex items-center justify-center  text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                {activeFilter ? <FaFilter className='text-[18px]' /> : <MdFilterAltOff className='text-[18px]' />}
              </div>

              <button
                onClick={changeStatus}
                type="button"
                className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"> Change Status</button>
              <button
                type="button"
                onClick={deleteFile}
                className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">Delete </button>
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
                            onClick={checkedAll}
                            checked={testimonial.length > 0 && testimonial.length === checkedValue.length}
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                          <label for="checkbox-all-search" className="sr-only">checkbox</label>
                        </div>
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Name
                      </th>
                      <th scope="col" className=" w-[10%] ">
                        Image
                      </th>
                      <th scope="col" className=" w-[15%] ">
                        Designation
                      </th>
                      <th scope="col" className=" w-[8%] ">
                        Rating
                      </th>
                      <th scope="col" className=" w-[8%] ">
                        Order
                      </th>
                      <th scope="col" className="w-[11%]">
                        Status
                      </th>
                      <th scope="col" className="w-[6%]">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      testimonial.length > 0 ? (
                        testimonial.map((v, i) => {
                          return (
                            <tr key={i} className="bg-white  dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
                              <td className="w-4 p-4">
                                <div className="flex items-center">
                                  <input
                                    onClick={singleCheck}
                                    onChange={() => singleCheck(v._id)}
                                    checked={checkedValue.includes(v._id)}
                                    id="checkbox-table-search-1"
                                    type="checkbox"
                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                  <label for="checkbox-table-search-1" className="sr-only">checkbox</label>
                                </div>
                              </td>
                              <th scope="row" className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white">

                                <div className="py-4">
                                  <div className="text-base font-semibold">{v.name}</div>

                                </div>
                              </th>
                              <td className=" py-4">
                                {
                                  v.image !== '' ?
                                    <img className="w-10 h-10 rounded-full" src={imagePath + v.image} alt="Jese image" />
                                    :
                                    "N/A"
                                }
                              </td>
                              <td className=" py-4">
                                {v.designation}
                              </td>
                              <td className=" py-4">
                                {v.rating}
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

                                <Link to={`/testimonial/update/${v._id}`} >
                                  <div className="rounded-[50%] w-[40px] h-[40px] flex items-center justify-center text-white bg-blue-700  border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                    <MdModeEdit className='text-[18px]' />
                                  </div>
                                </Link>
                              </td>
                            </tr>
                          )
                        })

                      )
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
