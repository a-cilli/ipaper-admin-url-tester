"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import React, { Fragment } from "react";

export default function Home() {
  const [data, setData] = useState([
    {
      type: "account",
      name: "account name",
      level: 0,
      brandedDomain: "",
      useBD: false,
      useBDRoot: false,
      open: true,
    },
  ]);

  const [activeObj, setActiveObj] = useState(null);

  const [showUrl, setShowUrl] = useState(true);

  const [flipbookAmmont, setFlipbookAmmount] = useState(0);

  useEffect(() => {
    // Count the number of flipbook objects in the data array
    const count = data.filter((item) => item.type === "flipbook").length;

    // Update the flipbookAmmount state with the count
    setFlipbookAmmount(count);
  }, [data]);

  const handleToggleOpen = (index) => {
    setActiveObj(null)
    // Clone the current data array
    const updatedData = [...data];

    // Toggle the 'open' property of the selected item
    updatedData[index] = {
      ...updatedData[index],
      open: !updatedData[index].open,
    };

    // Update the state with the modified data array
    setData(updatedData);
  };

  const checkedOpen = (index, level) => {
    let currentLevel = level; // Initialize with the level passed

    for (let i = index - 1; i >= 0; i--) {
      const currentObj = data[i];

      // Check if the currentObj is a direct parent
      if (currentObj.level === currentLevel - 1) {
        // If parent is closed, hide this element
        if (!currentObj.open) {
          return "hidden";
        }
        // Update the level for the next iteration
        currentLevel--;
      }
    }

    // If no ancestor with open === false is found
    return "flex";
  };

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
      open: true,
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
      setActiveObj(null);
    }

    // Update the state with the modified data array
    setData(updatedData);
  };

  const toggleUseBD = (index) => {
    const updatedData = data.map((item, i) => {
      if (i === index) {
        const updatedUseBD = !item.useBD;
        return {
          ...item,
          useBD: updatedUseBD,
          brandedDomain: updatedUseBD ? item.brandedDomain : "",
          useBDRoot: updatedUseBD ? item.useBDRoot : false,
        };
      }
      return item;
    });
    setData(updatedData);
  };

  const toggleUseBDRoot = (index) => {
    const updatedData = data.map((item, i) =>
      i === index ? { ...item, useBDRoot: !item.useBDRoot } : item
    );
    setData(updatedData);
  };

  const addPreviousUrls = (index, currentLevel) => {
  let urlSpans = [];
  let foundBrandedDomain = false;
  let level = currentLevel; // Initialize with the level passed

  // Loop backwards from the provided index
  for (let i = index - 1; i >= 0; i--) {
    const currentObj = data[i];

    // Skip if the element has a level equal to or greater than the current level
    if (currentObj.level >= level) continue;

    // Decrease level to match the parent hierarchy
    level--;

    // If we've found a branded domain, break the loop
    if (foundBrandedDomain) break;

    // If !useBDRoot, also add the sanitized name
    if (!currentObj.useBDRoot && currentObj.useBD) {
      let nameSpan = (
        <span
          key={`name-${i}-${currentObj.id}`} // Ensure unique key
          className={`${
            currentObj.type === "account"
              ? "text-orange-600"
              : currentObj.type === "folder"
              ? "text-green-600"
              : "text-blue-600"
          }`}
        >
          {`/${sanitizeUrl(currentObj.name)}`}
        </span>
      );
      urlSpans.unshift(nameSpan);
    }

    if (currentObj.useBD) {
      // Create a branded domain span
      let span = (
        <span key={`branded-${i}-${currentObj.id}`} className="text-blue-600">
          {`https://${sanitizeUrl(currentObj.brandedDomain)}`}
        </span>
      );
      urlSpans.unshift(span);

      foundBrandedDomain = true; // Branded domain found, no need to keep looping
    } else if (currentObj.type === "account") {
      // Special case for "account" type when loop reaches it
      let accountSpan;
      if (currentObj.useBD) {
        accountSpan = (
          <React.Fragment key={`fragment-${Math.random()}`}>
            <span key={`account-branded-${i}-${currentObj.id}`}>
              {`https://${sanitizeUrl(currentObj.brandedDomain)}`}
            </span>
            {!currentObj.useBDRoot && (
              <span
                key={`account-name-${i}-${currentObj.id}`}
                className="text-orange-600"
              >
                {`/${sanitizeUrl(currentObj.name)}`}
              </span>
            )}
          </React.Fragment>
        );
      } else {
        accountSpan = (
          <React.Fragment key={`fragment-${Math.random()}`}>
            <span key={`account-viewer-${i}-${currentObj.id}`}>
              {"https://viewer.ipaper.io/"}
            </span>
            <span
              key={`account-name-${i}-${currentObj.id}`}
              className="text-orange-600"
            >
              {sanitizeUrl(currentObj.name)}
            </span>
          </React.Fragment>
        );
      }
      urlSpans.unshift(accountSpan);
      break; // End loop after processing account
    } else {
      // For non-branded items, use green sanitized name span
      let nameSpan = (
        <span
          key={`non-branded-${i}-${currentObj.id}`}
          className="text-green-600"
        >
          {`/${sanitizeUrl(currentObj.name)}`}
        </span>
      );
      urlSpans.unshift(nameSpan);
    }
  }

  return urlSpans;
};


  const getInputWidth = (value) => {
    // Calculate width based on character length (4px per character)
    return `${value.length * 10 + 20}px`;
  };

  function sanitizeUrl(text) {
    // Trim any leading or trailing whitespace
    let sanitizedText = text.trim();
    // Replace spaces with hyphens
    sanitizedText = sanitizedText.replace(/\s+/g, "-");
    // Convert the text to lowercase
    sanitizedText = sanitizedText.toLowerCase();
    return sanitizedText;
  }

  const clearData = () => {
    setData([
      {
        type: "account",
        name: "account name",
        level: 0,
        brandedDomain: "",
        useBD: false,
        useBDRoot: false,
        active: false,
      },
    ]);
  };

  const toggleActiveElement = (index) => {
    if (index === activeObj) {
      setActiveObj(null);
    } else {
      setActiveObj(index);
    }
  };

  return (
    <div className="grid grid-cols-[100px_1fr] min-w-screen min-h-screen">
      <div className="col-start-1 col-end-2 row-start-1 row-end-3 bg-[#081722] flex justify-start items-start">
        <Image
          src={"/media/sidebar-btn.png"}
          alt="sidebar buttons"
  
          width={100}
          height={443}
        />
      </div>
      <div
        className="fixed right-0 top-0 h-[60px] w-[calc(100vw-100px)] bg-white flex justify-end"
        style={{
          boxShadow:
            "0 1px 2px 0 rgba(0, 0, 0, 0.2), 0 1px 3px 0 rgba(0, 0, 0, 0.1)",
        }}
      >
        <Image
          src={"/media/navbar-btn.png"}
          alt="navbar buttons"
          width={349}
          height={60}
        />
      </div>
      <main className="col-start-2 col-end-3 pt-20 row-start-2 row-end-3 bg-[#F0F1F2] min-w-[calc(100vw-100px)] min-h-screen flex flex-col items-center justify-start py-10 px-6">
        <div className="bg-[#D6ECF8] flex justify-between w-full p-4">
          <p>
            This is a demo that emulates the admin panel of iPaper. None of the
            functionalities shown here can be performed in the actual iPaper
            interface.
          </p>
        </div>
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
              {flipbookAmmont} of 1000 flipbooks
            </p>
          </div>
          <div className="flex flex-row">
            <button
              className="inline-block align-middle mt-1.5 mb-1.5 px-6 py-1.5 border border-[#F0F1F2] rounded-sm bg-white text-[#303940] text-center font-normal text-base leading-6 cursor-pointer select-none"
              onClick={() => clearData()}
            >
              Clear Panel
            </button>
            <button
              className="inline-block align-middle mt-1.5 mb-1.5 ml-2 px-6 py-1.5 border border-[#091722] rounded-sm bg-[#091722] text-white text-center font-normal text-base leading-6 cursor-pointer select-none transition-all duration-100 ease-in-out"
              onClick={() => setShowUrl(!showUrl)}
            >
              {showUrl ? "Hide URLs" : "Show URLs"}
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
              className={`w-full relative  ${checkedOpen(index, obj.level)} ${
                index === activeObj && "bg-[#D6ECF8]"
              } hover:bg-[#D6ECF8] flex justify-end items-end py-2 px-5 group`}
            >
              <div
                className="flex items-center"
                style={{ marginLeft: `${obj.level * 24}px` }}
              >
                {obj.type === "folder" && (
                  <React.Fragment key={`fragment-${Math.random()}`}>
                    <button
                      className="flex border-none bg-none items-center"
                      onClick={() => handleToggleOpen(index)}
                    >
                      <div className="w-5 h-5 relative ">
                        <Image
                          alt="arrow icon"
                          src={"/media/arrow.svg"}
                          width={20}
                          height={20}
                          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                            ${
                              data[index + 1] &&
                              data[index + 1].level === obj.level + 1
                                ? "opacity-100"
                                : "opacity-0"
                            }
                            ${obj.open ? "rotate-0" : "-rotate-90"}
                          `}
                          style={{
                            filter:
                              "invert(48%) sepia(9%) saturate(238%) hue-rotate(164deg) brightness(95%) contrast(84%)",
                          }}
                        />
                      </div>

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
                    </button>
                  </React.Fragment>
                )}
                {obj.type === "flipbook" && (
                  <React.Fragment key={`fragment-${Math.random()}`}>
                    <Image
                      alt="flipbook icon"
                      src={"/media/flipbook.svg"}
                      className="ml-[22px] mr-1"
                      width={25}
                      height={25}
                      style={{
                        filter:
                          "invert(19%) sepia(3%) saturate(2638%) hue-rotate(164deg) brightness(103%) contrast(92%)",
                      }}
                    />
                  </React.Fragment>
                )}
                <input
                  type="text"
                  className={`bg-transparent border-0 min-w-4 ${
                    obj.type === "account"
                      ? "font-bold"
                      : "font-light text-[#303940]"
                  }  text-sm`}
                  value={obj.name}
                  onChange={(e) =>
                    handleInputChange(index, "name", e.target.value)
                  }
                  style={{ width: getInputWidth(obj.name) }}
                />
                <div className={`${showUrl ? "flex" : "hidden"}`}>
                  {obj.type === "account" ? (
                    <p className="text-blue-600 text-xs">
                      {obj.useBD ? (
                        <React.Fragment key={`fragment-${Math.random()}`}>
                          {`https://${sanitizeUrl(obj.brandedDomain)}`}
                          {!obj.useBDRoot && (
                            <span className="text-orange-600">{`/${sanitizeUrl(
                              obj.name
                            )}`}</span>
                          )}
                        </React.Fragment>
                      ) : (
                        <React.Fragment key={`fragment-${Math.random()}`}>
                          {"https://viewer.ipaper.io/"}
                          <span className="text-orange-600">
                            {sanitizeUrl(obj.name)}
                          </span>
                        </React.Fragment>
                      )}
                    </p>
                  ) : (
                    <p className="text-blue-600 text-xs">
                      {obj.useBD ? (
                        <React.Fragment key={`fragment-${Math.random()}`}>
                          {`https://${sanitizeUrl(obj.brandedDomain)}`}
                          {!obj.useBDRoot && (
                            <span
                              className={`${
                                obj.type === "folder"
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}
                            >{`/${sanitizeUrl(obj.name)}`}</span>
                          )}
                        </React.Fragment>
                      ) : (
                        <React.Fragment key={`fragment-${Math.random()}`}>
                          {addPreviousUrls(index, obj.level)}
                          <span
                            className={`${
                              obj.type === "folder"
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            /{sanitizeUrl(obj.name)}
                          </span>
                        </React.Fragment>
                      )}
                    </p>
                  )}
                </div>
              </div>
              <div
                className={`${
                  index === activeObj ? "flex" : "hidden"
                } justify-end gap-2 ml-auto absolute right-12 min-w-[25vw] top-0 py-2 px-5 bg-[#D6ECF8] z-10`}
              >
                <label
                  className={`${obj.useBD ? "flex" : "hidden"} cursor-pointer`}
                >
                  <input
                    type="checkbox"
                    checked={obj.useBDRoot}
                    onChange={() => toggleUseBDRoot(index)}
                    className="hidden"
                  />
                  <p>Enable Domain Root</p>
                  <Image
                    alt="Folder icon"
                    src={
                      obj.useBDRoot
                        ? "/media/checkbox-checked.svg"
                        : "/media/checkbox.svg"
                    }
                    className="ml-1"
                    width={15}
                    height={15}
                    style={{
                      filter:
                        "invert(19%) sepia(3%) saturate(2638%) hue-rotate(164deg) brightness(103%) contrast(92%)",
                    }}
                  />
                </label>
                <input
                  type="text"
                  className={`${
                    obj.useBD ? "inline-block" : "hidden"
                  } min-w-48 bg-transparent border-2 border-black  font-bold text-sm`}
                  value={obj.brandedDomain}
                  placeholder="Add Branded domain URL"
                  onChange={(e) =>
                    handleInputChange(index, "brandedDomain", e.target.value)
                  }
                  style={{ width: getInputWidth(obj.brandedDomain) }}
                />
                <label className={`flex cursor-pointer`}>
                  <input
                    type="checkbox"
                    checked={obj.useBD}
                    onChange={() => toggleUseBD(index)}
                    className="hidden"
                  />
                  <p>Use branded domain</p>
                  <Image
                    alt="Folder icon"
                    src={
                      obj.useBD
                        ? "/media/checkbox-checked.svg"
                        : "/media/checkbox.svg"
                    }
                    className="ml-1"
                    width={15}
                    height={15}
                    style={{
                      filter:
                        "invert(19%) sepia(3%) saturate(2638%) hue-rotate(164deg) brightness(103%) contrast(92%)",
                    }}
                  />
                </label>
                {obj.type !== "flipbook" && (
                  <React.Fragment key={`fragment-${Math.random()}`}>
                    <button
                      className={`border-none bg-transparent justify-end items-center p-0 m-0 flex`}
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
                      className={`border-none bg-transparent justify-end items-center p-0 m-0 flex`}
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
                  </React.Fragment>
                )}
                {obj.type !== "account" && (
                  <button
                    className={`border-none bg-transparent justify-end items-center p-0 m-0 flex`}
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
              </div>
              <button
                className="ml-auto font-extrabold border-none bg-transparent"
                onClick={() => toggleActiveElement(index)}
              >
                ...
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
