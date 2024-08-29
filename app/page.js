"use client";

import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [data, setData] = useState([
    {
      type: "account",
      name: "account name",
      level: 0,
      brandedDomain: "",
      useBD: false,
      useBDRoot: false,
    },
    {
      type: "folder",
      name: "folder 1",
      level: 1,
      brandedDomain: "",
      useBD: false,
      useBDRoot: false,
    },
    {
      type: "folder",
      name: "folder 2",
      level: 2,
      brandedDomain: "",
      useBD: false,
      useBDRoot: false,
    },
    {
      type: "flipbook",
      name: "flipbook 1",
      level: 3,
      brandedDomain: "",
      useBD: false,
      useBDRoot: false,
    },
    {
      type: "folder",
      name: "folder 3",
      level: 2,
      brandedDomain: "",
      useBD: false,
      useBDRoot: false,
    },
    {
      type: "folder",
      name: "folder 4",
      level: 3,
      brandedDomain: "",
      useBD: false,
      useBDRoot: false,
    },
    {
      type: "flipbook",
      name: "flipbook 2",
      level: 4,
      brandedDomain: "",
      useBD: false,
      useBDRoot: false,
    },
    {
      type: "folder",
      name: "folder 5",
      level: 1,
      brandedDomain: "",
      useBD: false,
      useBDRoot: false,
    },
    {
      type: "flipbook",
      name: "flipbook 3",
      level: 2,
      brandedDomain: "",
      useBD: false,
      useBDRoot: false,
    },
  ]);

  // Function to handle input changes
  const handleInputChange = (index, field, newValue) => {
    // Create a new array with updated data
    const updatedData = data.map((item, i) =>
      i === index ? { ...item, [field]: newValue } : item
    );
    // Update the state
    setData(updatedData);
  };

  const createFolder = (index, level) => {
    // Create a new folder object
    const newFolder = {
      type: "folder",
      name: "new folder",
      level: level + 1,
      brandedDomain: "",
      useBD: false,
      useBDRoot: false,
    };

    // Clone the current data array
    const updatedData = [...data];

    // Define the new index for insertion
    let insertionIndex = index + 1;

    // Find the insertion point
    while (insertionIndex < updatedData.length) {
      const currentItem = updatedData[insertionIndex];

      // If we encounter an item at the same level, check type
      if (currentItem.level === level + 1) {
        // Insert the new folder before any flipbook
        if (currentItem.type === "flipbook") {
          break;
        }
      } else if (currentItem.level <= level) {
        // Break loop if level goes back to the current level or higher
        break;
      }

      insertionIndex++;
    }

    // Insert the new folder
    updatedData.splice(insertionIndex, 0, newFolder);

    // Update the state
    setData(updatedData);
  };

  const createFlipbook = (index, level) => {
    // Create a new flipbook object
    const newFlipbook = {
      type: "flipbook",
      name: "new flipbook",
      level: level + 1,
      brandedDomain: "",
      useBD: false,
      useBDRoot: false,
    };

    // Clone the current data array
    const updatedData = [...data];

    // Define the new index for insertion
    let insertionIndex = index + 1;

    // Loop through the array starting from the index
    while (insertionIndex < updatedData.length) {
      const currentItem = updatedData[insertionIndex];

      // Check if the current item’s level is less than or equal to the level of the new flipbook
      if (currentItem.level <= level) {
        // Stop the loop if we encounter an item with a level less than or equal to the new flipbook's level
        break;
      }

      // Move to the next item
      insertionIndex++;
    }

    // Insert the new flipbook at the calculated index
    updatedData.splice(insertionIndex, 0, newFlipbook);

    // Update the state
    setData(updatedData);
  };

  const deleteElement = (index, level) => {
    // Clone the current data array
    const updatedData = [...data];
  
    // Get the target object based on the index
    const targetObj = updatedData[index];
  
    // Log the target object
    console.log("Target object to delete:", targetObj);
  
    // Check if the target object is of type 'flipbook'
    if (targetObj.type === "flipbook") {
      // Remove the flipbook directly
      updatedData.splice(index, 1);
    } else if (targetObj.type === "folder") {
      // If it's a folder, remove the folder and all its children
      let deleteCount = 1;
  
      // Loop through subsequent items to identify children
      for (let i = index + 1; i < updatedData.length; i++) {
        const currentItem = updatedData[i];
  
        // If the current item's level is greater than the target's level, it's a child
        if (currentItem.level > level) {
          deleteCount++;
        } else {
          // If we encounter an item that is not a child, stop counting
          break;
        }
      }
  
      // Remove the folder and all its children
      updatedData.splice(index, deleteCount);
    }
  
    // Update the state with the modified data array
    setData(updatedData);
  };
  
  

  const getInputWidth = (value) => {
    // Calculate width based on character length (4px per character)
    return `${value.length * 10 + 20}px`;
  };

  function sanitizeUrl(text) {
    // Trim any leading or trailing whitespace
    let sanitizedText = text.trim();
    // Replace spaces with hyphens
    sanitizedText = sanitizedText.replace(/\s+/g, '-');
    // Convert the text to lowercase
    sanitizedText = sanitizedText.toLowerCase();
    return sanitizedText;
  }

  return (
    <div className="grid grid-cols-[100px_1fr] min-w-screen min-h-screen">
      <div className="col-start-1 col-end-2 row-start-1 row-end-3 bg-[#081722]"></div>
      <div
        className="fixed right-0 top-0 h-[60px] w-[calc(100vw-100px)] bg-white"
        style={{
          boxShadow:
            "0 1px 2px 0 rgba(0, 0, 0, 0.2), 0 1px 3px 0 rgba(0, 0, 0, 0.1)",
        }}
      ></div>
      <main className="col-start-2 col-end-3 pt-20 row-start-2 row-end-3 bg-[#F0F1F2] min-w-[calc(100vw-100px)] min-h-screen flex flex-col items-center justify-start py-10 px-6">
        <div className="bg-green flex justify-between w-full">
          <div className="flex items-center">
            <Image
              alt="Flipbook icon"
              src={"/media/flipbook.svg"}
              className="mb-1"
              width={25}
              height={25}
            />
            <h1 className="text-[#303940] text-2xl font-bold mx-2">
              Flipbooks
            </h1>
            <p className="opacity-75 text-xs font-normal  mt-[6px]">
              1 of 1000 flipbooks
            </p>
          </div>
          <div className="flex flex-row">
            <button className="inline-block align-middle mt-1.5 mb-1.5 px-6 py-1.5 border border-[#F0F1F2] rounded-sm bg-white text-[#303940] text-center font-normal text-base leading-6 cursor-pointer select-none">
              Create Folder
            </button>
            <button className="inline-block align-middle mt-1.5 mb-1.5 ml-2 px-6 py-1.5 border border-[#091722] rounded-sm bg-[#091722] text-white text-center font-normal text-base leading-6 cursor-pointer select-none transition-all duration-100 ease-in-out">
              Create Flipbook
            </button>
          </div>
        </div>
        <div
          className="w-full min-h-40 border border-[#F0F1F2] bg-white shadow-md"
          style={{
            boxShadow:
              "0 1px 2px 0 rgba(0, 0, 0, 0.2), 0 1px 3px 0 rgba(0, 0, 0, 0.1)",
          }}
        >
          {data.map((obj, index) => (
            <div
              key={index}
              className="w-full hover:bg-[#D6ECF8] flex justify-end items-end py-2 px-5 group"
            >
              <div
                className="flex items-center"
                style={{ marginLeft: `${obj.level * 24}px` }}
              >
                {obj.type === "folder" && (
                  <>
                    <Image
                      alt="arrow icon"
                      src={"/media/arrow.svg"}
                      width={20}
                      height={20}
                      style={{
                        filter:
                          "invert(48%) sepia(9%) saturate(238%) hue-rotate(164deg) brightness(95%) contrast(84%)",
                      }}
                    />
                    <Image
                      alt="Folder icon"
                      src={"/media/folder.svg"}
                      className="mr-1"
                      width={25}
                      height={25}
                      style={{
                        filter:
                          "invert(19%) sepia(3%) saturate(2638%) hue-rotate(164deg) brightness(103%) contrast(92%)",
                      }}
                    />
                  </>
                )}
                {obj.type === "flipbook" && (
                  <>
                    <Image
                      alt="flipbook icon"
                      src={"/media/flipbook.svg"}
                      className="ml-4 mr-1"
                      width={25}
                      height={25}
                      style={{
                        filter:
                          "invert(19%) sepia(3%) saturate(2638%) hue-rotate(164deg) brightness(103%) contrast(92%)",
                      }}
                    />
                  </>
                )}
                <input
                  type="text"
                  className={`bg-transparent border-0 min-w-4 ${
                    obj.type === "account"
                      ? "font-bold"
                      : "font-light text-[#303940]"
                  }  text-sm`}
                  value={obj.name}
                  onChange={(e) => handleInputChange(index, "name", e.target.value)}
                  style={{ width: getInputWidth(obj.name) }}
                />
                <p>
                index:{index} - level:{obj.level}
              </p>
              </div>
              <div className="flex gap-2 ml-auto">


              <input
                  type="text"
                  className={`hidden group-hover:inline-block bg-transparent border-2 border-black min-w-4 font-bold text-sm`}
                  value={obj.brandedDomain}
                  onChange={(e) => handleInputChange(index, "brandedDomain", e.target.value)}
                  style={{ width: getInputWidth(obj.brandedDomain) }}
                />


                {obj.type !== "flipbook" && (
                  <>
                    <button
                      className="border-none bg-transparent justify-end items-center p-0 m-0 hidden group-hover:flex"
                      onClick={() => createFolder(index, obj.level)}
                    >
                      <Image
                        alt="create folder icon"
                        src={"/media/new-folder.svg"}
                        width={25}
                        height={25}
                        style={{
                          filter:
                            "invert(19%) sepia(3%) saturate(2638%) hue-rotate(164deg) brightness(103%) contrast(92%)",
                        }}
                      />
                    </button>
                    <button
                      className="border-none bg-transparent justify-end items-center p-0 m-0 hidden group-hover:flex"
                      onClick={() => createFlipbook(index, obj.level)}
                    >
                      <Image
                        alt="create folder icon"
                        src={"/media/new-flipbook.svg"}
                        width={25}
                        height={25}
                        style={{
                          filter:
                            "invert(19%) sepia(3%) saturate(2638%) hue-rotate(164deg) brightness(103%) contrast(92%)",
                        }}
                      />
                    </button>
                  </>
                )}
                {obj.type !== "account" && (
                  <button
                    className="border-none bg-transparent justify-end items-center p-0 m-0 hidden group-hover:flex"
                    onClick={() => {
                      deleteElement(index, obj.level);
                    }}
                  >
                    <Image
                      alt="create folder icon"
                      src={"/media/trash.svg"}
                      width={25}
                      height={25}
                      style={{
                        filter:
                          "invert(19%) sepia(3%) saturate(2638%) hue-rotate(164deg) brightness(103%) contrast(92%)",
                      }}
                    />
                  </button>
                )}
                <p className="font-extrabold ml-4">...</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
