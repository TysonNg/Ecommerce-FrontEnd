"use client";
import Image from "next/image";
import { useState } from "react";

interface ChangeStateProps {
  product_description: string;
  product_thumb: string;
  product_images: string[];
  product_name: string;
}

export const ChangeStateAtDetailPage = (props: ChangeStateProps) => {
  const { product_description, product_thumb, product_images, product_name } =
    props;
  const [state, setState] = useState("Description");
  const changeReviewState = () => {
    if (state === "Description") setState("Reviews");
  };

  const changeDescriptionState = () => {
    if (state === "Reviews") setState("Description");
  };

  const renderByState = () => {
    if (state === "Description") {
      return (
        <div className={`w-full max-w-[350px] xs:max-w-[500px] sm:max-w-[800px] lg:max-w-[1200px] pt-10`}>
          <h1 className="pb-20 text-3xl font-bold">More about the product</h1>
          <div className="relative w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] lg:w-[900px] lg:h-[900px] 2xl:w-[1200px] 2xl:h-[1200px]">
            <Image src={product_thumb} alt={product_description} fill />
          </div>
          <div className="grid w-full grid-cols-12 py-20 ">
            <h2 className="col-span-6 text-2xl font-bold text-nowrap pr-60 underline underline-offset-8 decoration-[#0573f0] ">
              Product&apos;s Features
            </h2>

            <div className="w-full col-span-6 description">
              {product_description}
            </div>
          </div>
          <div className="relative w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] lg:w-[900px] lg:h-[900px] 2xl:w-[1200px] 2xl:h-[1200px]">
            <Image
              src={
                product_images.length === 1 ? product_thumb : product_images[1]
              }
              alt={product_description}
              fill
            />
          </div>
        </div>
      );
    }
    return (
      <div className={``}>
        <p className="text-sm text-[#7A7A7A] pt-5">There are no reviews yet.</p>
        <form action="">
          <div
            className={`flex flex-col gap-1 border border-[#dce3e5] p-5 mt-5 bg-[#f7f7f7]`}
          >
            <p>Be the first to review &quot; {product_name} &quot;</p>
            <p className="text-sm text-[#7A7A7A]">
              Your email address will not be published.Required fields are
              marked*
            </p>
            <div className="pt-3">
              <div className="text-[#3d3c3c]">Your rating*</div>
              <div>
                <p className="pt-3 text-[#3d3c3c]">Your review*</p>
                <textarea className=" w-full h-20 border border-[#dce3e5] caret-black p-2 pt-1 " />
              </div>
              <div className="flex flex-row grid-cols-6 pt-5">
                <div className="w-full col-span-3 pr-5 ">
                  <p className="text-[#3d3c3c]">Name*</p>
                  <input
                    className="w-full h-10 caret-black p-2 border border-[#dce3e5]"
                    type="text "
                  />
                </div>
                <div className="w-full col-span-3 pr-5">
                  <p className="text-[#3d3c3c]">Email*</p>
                  <input
                    className="w-full h-10 caret-black p-2 border border-[#dce3e5]"
                    type="text"
                  />
                </div>
              </div>
              <div className="flex flex-row gap-2 pt-5">
                <input type="checkbox" />{" "}
                <p>
                  Save my name, email, and website in this browser for the next
                  time I comment
                </p>
              </div>
              <div className="pt-5">
                <button className="px-5 py-2 text-white bg-black cursor-pointer hover:opacity-80 active:opacity-100 ">
                  Submit
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  };
  return (
    <div
      className={`w-full max-w-[500px] sm:max-w-[800px] lg:max-w-[1200px] mx-auto my-0`}
    >
      <div className="btn-box">
        <span className="flex gap-5 border-t-1 border-[#dce3e5] text-sm">
          <button
            className={`${
              state === "Description" ? "border-t-3" : ""
            } border-[#0573f0] cursor-pointer`}
            onClick={changeDescriptionState}
          >
            Descriptions
          </button>
          <button
            className={`${
              state === "Description" ? "" : "border-t-3"
            } border-[#0573f0] cursor-pointer`}
            onClick={changeReviewState}
          >
            Reviews
          </button>
        </span>
      </div>
      {renderByState()}
    </div>
  );
};
