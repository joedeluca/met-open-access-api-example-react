"use client";

import React, { useState } from "react";

function MetOpenAccess() {
  const [data, setData] = useState(null);
  const [searchStr, setSearchStr] = useState("");

  const fetchData = async () => {
    const response = await fetch(
      "https://collectionapi.metmuseum.org/public/collection/v1/search?isPublicDomain=true&hasImages=true&q=" +
        searchStr
    );
    const data = await response.json();
    setData(data);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      // 👇 Get input value
      fetchData();
    }
  };
  return (
    <div>
      <input
        type='text '
        className='text-black w-full p-4'
        value={searchStr}
        onChange={(e) => setSearchStr(e.target.value)}
        //onChange={(e) => fetchData()}
        onKeyDown={handleKeyDown}
      />
      <h1>searchStr is {searchStr}</h1>
      {data ? (
        <ul>
          {data.objectIDs.map((item) => (
            <li key={item.total}>{item}</li>
          ))}
        </ul>
      ) : (
        <p>Loading data...</p>
      )}
    </div>
  );
}

export default MetOpenAccess;
