import React, { useEffect, useState } from 'react'
import Breadcrumb from '../../common/Breadcrumb'
import { Link } from 'react-router-dom'
import { MdFilterAltOff, MdModeEdit } from 'react-icons/md'
import ResponsivePagination from 'react-responsive-pagination';
import 'react-responsive-pagination/themes/classic-light-dark.css';
import { FaFilter } from 'react-icons/fa'
import axios from 'axios'
import { toast } from 'react-toastify'

export default function ViewCategory() {
  let [activeFilter, setactiveFilter] = useState(true);
  let [category, setCategory] = useState([])
  let [nameFilter, setNameFilter] = useState('');
  let [checkedValue, setCheckedValue] = useState([])
  let [apiStatus, setApiStatus] = useState(false);
  let [imagePath, setImagePath] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState()


  useEffect(() => {
    axios
      .post(
        `${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_CATEGORY_VIEW}`,
        { name: nameFilter, page: currentPage}
      )
      .then((success) => {
        if (success.data._status === true) {
          setCategory(success.data._data)
          setTotalPages(success.data._pagination?.total_page || 1);
          setImagePath(success.data._image_path);
        } else {
          toast.error(success.data._message);
        }
      })
      .catch((error) => {
        toast.error(error.response?.data?._message || "Something went wrong!");
      });
  }, [apiStatus, nameFilter, currentPage]);


  // checkAll checkbox
  var checkedAll = () => {
    if (category.length !== checkedValue.length) {
      let data = category.map((value) => value._id);
      setCheckedValue(data);
    } else {
      setCheckedValue([]);
    }
  }

  // search value from filter
  const searchRecord = (event) => {
    event.preventDefault();
    setNameFilter(event.target.search.value)
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
          `${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_CATEGORY_CHANGE_STATUS}`,
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
            `${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_CATEGORY_DELETE}`,
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
    <>
      <Breadcrumb path={"Category"} link={"/category/view"} path2={"View"} slash={"/"} />
      <div className="w-full h-[610px]">
        <div className="max-w-[1220px] mx-auto py-2">

          {/* Filter Box */}
          <div className={`rounded-lg border border-gray-300 px-5 py-5 max-w-[1220px] mx-auto mt-10 ${activeFilter ? "hidden" : "block"}`}>
            <form className="flex max-w-sm" onSubmit={searchRecord}>
              <div className="relative w-full">
                <input
                  type="text"
                  name='search'
                  id="simple-search"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-2 p-2.5"
                  placeholder="Search Name"
                  required
                />
              </div>
              <button
                type="submit"
                className="p-2.5 ms-2 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800"
              >
                Search
              </button>
            </form>
          </div>

          {/* Table */}
          <div className="w-full min-h-[610px]">
            <div className="max-w-[1220px] mx-auto py-5">
              <div className='flex item-center flex-wrap sm:flex-nowrap gap-y-2 justify-between bg-slate-100 py-3 px-4 rounded-t-md border border-slate-400'>
                <h3 className="text-[16px] sm:text-[20px] md:text-[26px] font-semibold">View Category</h3>
                <div className='flex justify-between '>
                  <div
                    onClick={() => setactiveFilter(!activeFilter)}
                    className="cursor-pointer mx-3 rounded-full w-[40px] h-[40px] flex items-center justify-center text-white bg-blue-700 hover:bg-blue-800"
                  >
                    {activeFilter ? <FaFilter className='text-[18px]' /> : <MdFilterAltOff className='text-[18px]' />}
                  </div>

                  <button
                    type="button"
                    onClick={changeStatus}
                    className="text-white bg-green-700 hover:bg-green-800 rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
                  >
                    Change Status
                  </button>

                  <button
                    onClick={deleteFile}
                    type="button"
                    className="text-white bg-red-700 hover:bg-red-800 rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
                  >
                    Delete
                  </button>
                </div>
              </div>

              <div className="border border-t-0 rounded-b-md border-slate-400">
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                  <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                      <tr>
                        <th scope="col" className="p-4">
                          <input
                            type="checkbox"
                            onChange={checkedAll}
                            checked={category.length > 0 && category.length === checkedValue.length}
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded"
                          />
                        </th>
                        <th className="px-6 py-3">Category Name</th>
                        <th className="px-6 py-3">Image</th>
                        <th className="px-6 py-3">Order</th>
                        <th className="px-6 py-3">Status</th>
                        <th className="px-6 py-3">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {category.length > 0 ? (
                        category.map((v, i) => (
                          <tr key={i} className="bg-white border-b hover:bg-gray-50">
                            <td className="w-4 p-4">
                              <input
                                type="checkbox"
                                onChange={() => singleCheck(v._id)}
                                checked={checkedValue.includes(v._id)}
                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded"
                              />
                            </td>
                            <td className="px-6 py-4">{v.name}</td>
                            <th scope="col" class=" w-[12%] ">
                              {
                                v.image !== '' ?
                                  <img class="w-10 h-10 rounded-full" src={imagePath + v.image} alt="Jese image" />
                                  :
                                  "N/A"

                              }
                            </th>
                            <td className="px-6 py-4">{v.order}</td>
                            <td className="px-6 py-4">
                              {
                                v.status == 1
                                  ?
                                  <button type="button" class="text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-1.5 text-center me-2 mb-2">Active</button>
                                  :
                                  <button type="button" class="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-5 py-1.5 text-center me-2 mb-2">Deactive</button>
                              }
                            </td>
                            <td className="px-6 py-4">
                              <Link to={`/category/update/${v._id}`}>
                                <div className="rounded-full w-[40px] h-[40px] flex items-center justify-center text-white bg-blue-700 hover:bg-blue-800">
                                  <MdModeEdit className='text-[18px]' />
                                </div>
                              </Link>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="py-4 text-center font-bold">
                            No Record Found
                          </td>
                        </tr>
                      )}
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
      </div>
    </>
  )
}
