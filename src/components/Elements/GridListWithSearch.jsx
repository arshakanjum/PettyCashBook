import React, { useEffect, useState } from "react";
import { RiSearchLine } from "react-icons/ri";

import PageTitle from "../Typography/PageTitle";
function AddCard() {
  return <div className="flex flex-row items-center justify-start "></div>;
}

export default function GridListWithSearch(props) {
  const [filteredList, setFilteredList] = useState(props.items);
  const [selected, setSelected] = useState(null);
  const [showAddCard, setShowAddCard] = useState(false);
  const handleFilterSet = (event) => {
    if (!Number(event.target.value.length) && event.target.value.length < 3) {
      setFilteredList(props.items);
      return;
    }
    var val = [];
    if (!Array.isArray(props.searchField)) {
      props.searchField = [props.searchField];
    }

    props.searchField.map((field) => {
      props.items.filter((item) => {
        var split = field.split(".");

        var v = item;
        for (var i = 0; i < split.length; i++) {
          v = v[split[i]];
        }
        if (v.toLowerCase().includes(event.target.value.toLowerCase())) {
          val.push(item);
        }
      });
    });
    setFilteredList(val);
  };
  useEffect(() => {
    setFilteredList(props.items);
  }, [props.items]);

  return (
    <>
      <div className="flex w-full flex-col">
      <div className="inline-flex items-center justify-between w-full">
        <PageTitle>
          {props.Title }
        </PageTitle>
        <div>
          <div className="input-group justify-self-end">
          {props.create ? (
              <div className="dropdown dropdown-end ">
                <label tabindex="0" className="mr-2 btn">
                  Create New
                </label>
                <div
                  tabindex="0"
                  className="mt-4 border-2 shadow-md dropdown-content card bg-primary text-primary-content"
                >
                  <div className="card-body">{props.createCard()}</div>
                </div>
              </div>
            ) : null}
            <input
              type="text"
              onKeyUp={handleFilterSet}
              placeholder="Search…"
              className="input input-bordered"
            ></input>
            <button className="btn btn-square">
              <RiSearchLine />
            </button>
          </div>
        </div>
      </div>
        <div className="flex flex-wrap">
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
