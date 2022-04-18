import React, { useContext, useEffect, useState } from "react";
import {
  collection,
  getDocs,
  getFirestore,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { useFirebaseApp } from "reactfire";
import {
  useTable,
  useSortBy,
  useGroupBy,
  useExpanded,
  useFlexLayout,
} from "react-table";
import {
  AiFillCaretDown,
  AiFillCaretRight,
  AiOutlineSortAscending,
  AiOutlineSortDescending,
} from "react-icons/ai";
import { RiSearchLine } from "react-icons/ri";
import styled from "styled-components";
import NumberFormat from "react-number-format";
import { InvoiceContext } from "../../context/InvoiceContext";
import PageTitle from "../Typography/PageTitle";
import { set } from "date-fns";

const Styles = styled.div`
  /* This is required to make the table full-width */
  display: block;
  max-width: 100%;

  /* This will make the table scrollable when it gets too small */
  .tableWrap {
    display: block;

    max-width: 100%;
    overflow-x: scroll;
    overflow-y: hidden;
    border-bottom: 1px solid black;
  }

  table {
    /* Make sure the inner table is always as wide as needed */
    width: 100%;
    border-spacing: 0;

    tr {
      :last-child {
        td {
          border-bottom: 1px solid black;
        }
      }
    }

    th,
    td {
      margin: 0;
      padding: 0.5rem;
      border-bottom: 0px solid black;
      border-right: 0px solid black;

      /* The secret sauce */
      /* Each cell should grow equally */
      width: 1%;
      /* But "collapsed" cells should be as small as possible */
      &.collapse {
        width: 0.0000000001%;
      }

      :last-child {
        border-right: 0;
      }
    }
  }

  .pagination {
    padding: 0.5rem;
  }
`;
const getLeafColumns = function (rootColumns) {
  return rootColumns.reduce((leafColumns, column) => {
    if (column.columns) {
      return [...leafColumns, ...getLeafColumns(column.columns)];
    } else {
      return [...leafColumns, column];
    }
  }, []);
};
export default function DataTable(props) {
  const [loading, setLoading] = useState(false);
  const [unpaid, setUnpaid] = useState(props.Invoices ?? []);
  const [selected, setSelected] = useState({});
  const db = getFirestore(useFirebaseApp());
  const invoiceRef = collection(db, "Invoices");
  const [search, setSearch] = useState("");
  const { invoiceState, setInvoiceState } = useContext(InvoiceContext);
  var q;
  q = query(
    invoiceRef,
    where("IsPaid", "==", false),
    orderBy("createdAt", "desc")
  );
  useEffect(() => {
    const fetchUnpaid = async () => {
      setLoading(true);
      const snapshot = await getDocs(q);
      snapshot.forEach((doc) => {
        var data = doc.data();
        data = { Date: data.Date.toDate(), ...data };
        data.id = doc.id;

        setUnpaid((prev) => [...prev, data]);
      });
      setLoading(false);
    };
    if (!props.Invoices) {
      fetchUnpaid();
    }
  }, []);
  const onViewInvoice = (row) => {
    setInvoiceState(row);
    props.showInvoice();
  };
  const data = React.useMemo(
    () =>
      unpaid
        .map((item, idx) => ({
          Name: item.Customer.Name,
          Amount: item.Amount,
          InvoiceNumber: item.InvoiceNumber,
          id: item.id,
          Invoice: { ...item, isEditable: false },
        }))
        .filter((item) => {
          if (search.length >= 3) {
            return item.Name.toLowerCase().includes(search.toLowerCase());
          } else return true;
        }),
    [unpaid, search]
  );
  const columns = React.useMemo(
    () => [
      {
        disableGroupBy: true,
        Header: "#",
        maxWidth: 50,
        accessor: "InvoiceNumber", // accessor is the "key" in the data
      },
      {
        Header: "Customer",
        minWidth: 50,
        width: 50,
        accessor: "Name", // accessor is the "key" in the data
      },
      {
        disableGroupBy: true,
        Header: "Amount",
        accessor: "Amount",
        aggregate: "sum",
        maxWidth: 50,
        Cell: (props) => (
          <NumberFormat
            thousandsGroupStyle="thousand"
            value={props.value}
            prefix="QAR "
            decimalSeparator="."
            displayType="text"
            type="text"
            thousandSeparator={true}
            allowNegative={true}
          />
        ),
        Aggregated: ({ value }) => (
          <NumberFormat
            thousandsGroupStyle="thousand"
            value={value}
            prefix="QAR "
            decimalSeparator="."
            displayType="text"
            type="text"
            thousandSeparator={true}
            allowNegative={true}
          />
        ),
        Footer: (info) => {
          // Only calculate total visits if rows change
          const total = React.useMemo(
            () =>
              info.rows.reduce(
                (sum, row) => Number(row.values.Amount) + sum,
                0
              ),
            [info.rows]
          );

          return <>Total: {total}</>;
        },
      },
      {
        Header: () => {},
        width: 50,
        accessor: "Invoice",
        Cell: ({ value }) => (
          <div className="flex justify-around">
            <button
              onClick={() => onViewInvoice(value)}
              className="btn btn-sm "
            >
              View Invoice
            </button>
          </div>
        ),
      },
    ],
    []
  );
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    footerGroups,
    setGroupBy,
    state: { groupBy, expanded },
  } = useTable(
    { columns, data },
    useGroupBy,
    useSortBy,
    useExpanded,
    useFlexLayout
  );
  return (
    <div>
      <div className="inline-flex items-center justify-between w-full">
        <PageTitle>
          {props.Title} ({unpaid.length})
        </PageTitle>
        <div>
          <div className="input-group justify-self-end">
            <input
              type="text"
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search…"
              className="input input-bordered"
            ></input>
            <button className="btn btn-square">
              <RiSearchLine />
            </button>
          </div>
        </div>
      </div>
      <div className="flex items-center m-2 ">
        <label className="w-1/4 max-w-xs input-group input-group-xs input-group-vertical ">
          <span>Group By</span>

          <select
            value={groupBy[0]}
            onChange={(e) => {
              setGroupBy([e.target.value]);
            }}
            className="max-w-xs select select-ghost select-xs"
          >
            <option value="">None</option>
            {getLeafColumns(columns).map((column) => (
              <option key={column.accessor} value={column.accessor}>
                {column.Header}
              </option>
            ))}
          </select>
        </label>
      </div>
      <Styles>
        <table className="table" {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  // Add the sorting props to control sorting. For this example
                  // we can add them into the header props
                  <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                    <div className="inline-flex">
                      {column.render("Header")}
                      {/* Add a sort direction indicator */}
                      <span>
                        {column.isSorted ? (
                          column.isSortedDesc ? (
                            <AiOutlineSortAscending size={"1rem"} />
                          ) : (
                            <AiOutlineSortDescending size={"1rem"} />
                          )
                        ) : (
                          ""
                        )}
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row, i) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    return (
                      <td {...cell.getCellProps()}>
                        {cell.isGrouped ? (
                          // If it's a grouped cell, add an expander and row count
                          <div className="inline-flex items-center">
                            <span {...row.getToggleRowExpandedProps()}>
                              {row.isExpanded ? (
                                <AiFillCaretDown />
                              ) : (
                                <AiFillCaretRight />
                              )}
                            </span>
                            {cell.render("Cell")} ({row.subRows.length})
                          </div>
                        ) : cell.isAggregated ? (
                          // If the cell is aggregated, use the Aggregated
                          // renderer for cell
                          cell.render("Aggregated")
                        ) : cell.isPlaceholder ? null : ( // For cells with repeated values, render null
                          // Otherwise, just render the regular cell
                          cell.render("Cell")
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            {footerGroups.map((group) => (
              <tr {...group.getFooterGroupProps()}>
                {group.headers.map((column) => (
                  <td {...column.getFooterProps()}>
                    {column.render("Footer")}
                  </td>
                ))}
              </tr>
            ))}
          </tfoot>
        </table>
      </Styles>
    </div>
  );
}
