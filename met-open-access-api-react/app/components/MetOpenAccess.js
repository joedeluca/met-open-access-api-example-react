"use client";

import React, { useState } from "react";
import classNames from "classnames";

function MetOpenAccess() {
  const [data, setData] = useState(null);
  const [searchStr, setSearchStr] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    const response = await fetch(
      "https://collectionapi.metmuseum.org/public/collection/v1/search?isPublicDomain=true&hasImages=true&q=" +
        searchStr
    );
    const data = await response.json();
    fetchArtDetails(data);
  };

  async function fetchArtDetails(data) {
    let art_objects = [];
    console.log(data);
    await Promise.all(
      data.objectIDs.map(async (id) => {
        const response = await fetch(
          `https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`
        );
        const art = await response.json();
        art_objects.push(art);
      })
    ).then(() => {
      setData(art_objects);
      setLoading(false);
    });
  }

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      // 👇 Get input value
      fetchData();
    }
  };

  return (
    <div className='w-full max-w-3xl m-auto'>
      <div className='flex relative'>
        <input
          type='text '
          placeholder='Search The Met'
          className='base-input'
          value={searchStr}
          onChange={(e) => setSearchStr(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <div
          className={classNames("close-x", searchStr ? "visible" : "invisible")}
          tabIndex='0'
          aria-label='Clear'
          role='button'
          onClick={(e) => {
            setSearchStr("");
            setData(null);
          }}
        >
          <span>
            <svg
              focusable='false'
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
            >
              <path d='M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z'></path>
            </svg>
          </span>
        </div>
        <button
          onClick={fetchData}
          className='border-zinc-800 p-3 text-zinc-800 hover:bg-black hover:text-zinc-500 px-5 border'
        >
          &#9166;
        </button>
      </div>
      {data ? (
        <div>
          {data.map((art) => (
            <div class='block md:flex border border-black p-4 my-3'>
              <div>
                <h5 class='art-title'>{art.title}</h5>
                <p class='py-1.5 text-lg md:text-xl lg:text-2xl xl:3xl 2xl:4xl'>
                  {art.objectName}
                </p>
                <p class='py-1.5 text-lg md:text-xl lg:text-2xl xl:3xl 2xl:4xl'>
                  {art.objectDate}
                </p>
                <p class='py-1.5 text-lg md:text-xl lg:text-2xl xl:3xl 2xl:4xl'>
                  {art.artistDisplayBio}
                </p>
              </div>
              <img
                v-if='art.primaryImageSmall'
                src={art.primaryImageSmall}
                width='300'
                class='pt-4 md:pt-0 md:ml-auto w-full md:w-80'
              />
            </div>
          ))}
        </div>
      ) : (
        <p> {loading ? "Loading data..." : ""}</p>
      )}
    </div>
  );
}

export default MetOpenAccess;
