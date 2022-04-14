import React, { useEffect, useState } from "react";
import { GrFormAdd } from "react-icons/gr";
function AddCard() {
  return <div className="flex flex-row items-center justify-start "></div>;
}

export default function GridListWithSearch(props) {
  const [filteredList, setFilteredList] = useState(props.items);
  const [selected, setSelected] = useState(null);
  useEffect(() => {
    setFilteredList(props.items);
  }, [props.items]);
  if (selected) {
    return (
      <>
        <div
          className={
            "self-end max-w-xs w-full flex border-2 card card-compact hover:text-neutral-content hover:bg-neutral-focus hover:shadow-lg bg-neutral text-neutral-content"
          }
        >
          <div
            className="flex flex-row items-center justify-center card-body"
            onClick={() => {
              setSelected(null);
            }}
          >
            <div>
              <p className="text-sm font-semibold ">{selected.Name}</p>
              <p className="text-sm ">{selected.Address}</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="flex flex-col">
        <div class="flex justify-self-end self-end pb-2 form-control">
          <div class="input-group">
            {props.create ? (
              <button class="btn btn-neutral col-span-full">Create New</button>
            ) : null}
            <input
              type="text"
              onKeyUp={(event) => {
                const searchTerm = event.target.value;
                const filteredList = props.items.filter((item) => {
                  return item[props.searchField]
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase());
                });
                setFilteredList(filteredList);
              }}
              placeholder="Search…"
              class="input input-bordered"
            />
            <button class="btn btn-square">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          {filteredList.map((item) => props.children(item, props.setSelected))}
        </div>
        <AddCard />
      </div>
    </>
  );
}

GridListWithSearch.defaultProps = {
  items: [],
  create: true,
  children: null,
};
