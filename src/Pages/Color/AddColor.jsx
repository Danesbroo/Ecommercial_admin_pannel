import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

export default function AddColor() {
  const [colorDetails, setColorDetails] = useState({});
  const params = useParams();
  const updateId = params.id;
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  // Fetch color details if updating
  useEffect(() => {
    if (updateId) {
      axios
        .post(
          import.meta.env.VITE_BASE_URL + import.meta.env.VITE_COLOR_DETAILS,
          { id: updateId }
        )
        .then((res) => {
          if (res.data._status) {
            setColorDetails(res.data._data);
            setValue("name", res.data._data.name);
            setValue("code", res.data._data.code);
            setValue("order", res.data._data.order);
          } else {
            toast.error("Failed to load color details.");
          }
        })
        .catch(() => toast.error("Something went wrong while fetching data!"));
    }
  }, [updateId, setValue]);

  // Handle form submit
  const formHandler = (data) => {
    if (updateId) {
      
      // Update color
      axios
        .put(
          `${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_COLOR_UPDATE}/${updateId}`,
          data
        )
        .then((res) => {
          if (res.data._status) {
            toast.success(res.data._message);
            navigate("/color/view");
          } else {
            toast.error(res.data._message);
          }
        })
        .catch(() => toast.error("Error updating color."));
    } else {

      // Create color
      axios
        .post(
          import.meta.env.VITE_BASE_URL + import.meta.env.VITE_COLOR_CREATE,
          data
        )
        .then((res) => {
          if (res.data._status) {
            toast.success(res.data._message);
            navigate("/color/view");
          } else {
            toast.error(res.data._Error_Message?.[0] || "Error creating color");
          }
        })
        .catch(() => toast.error("Error creating color."));
    }
  };

  return (
    <div className="w-full">
      <div className="max-w-[1220px] mx-auto py-5">
        <h3 className="text-[20px] font-semibold bg-slate-100 py-2 px-3 rounded-t-md border border-slate-400">
          {updateId ? "Update Color" : "Add Colors"}
        </h3>

        <form
          className="p-3 border border-t-0 rounded-b-md border-slate-400"
          onSubmit={handleSubmit(formHandler)}
          autoComplete="off"
        >
          {/* Color Name */}
          <div className="mb-5">
            <label className="block text-md font-medium text-gray-900">
              Color Name
            </label>
            <input
              type="text"
              {...register("name", { required: "Color name is required" })}
              defaultValue={colorDetails?.name || ""}
              className="text-[19px] border-2 shadow-sm border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 px-3"
              placeholder="Enter Color Name"
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>

          {/* Color Picker */}
          <div className="my-5">
            <label className="block text-md font-medium text-gray-900">
              Color Picker
            </label>
            <div className="flex items-center gap-3 w-full">
              <input
                type="color"
                {...register("code")}
                defaultValue={colorDetails?.code || "#000000"}
                className="w-full"
              />
            </div>
          </div>

          {/* Color Order */}
          <div className="mb-5">
            <label className="block text-md font-medium text-gray-900">
              Order
            </label>
            <input
              type="number"
              {...register("order")}
              defaultValue={colorDetails?.order || ''}
              className="text-[19px] border-2 shadow-sm border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 px-3"
              placeholder="Enter Order"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="focus:outline-none my-10 text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5"
          >
            {updateId ? "Update Color" : "Add Color"}
          </button>
        </form>
      </div>
    </div>
  );
}
