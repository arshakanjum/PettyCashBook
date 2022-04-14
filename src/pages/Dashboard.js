import React, { useState, useEffect } from "react";

import CTA from "../components/CTA";
import InfoCard from "../components/Cards/InfoCard";
import ChartCard from "../components/Chart/ChartCard";
import { Doughnut, Bar } from "react-chartjs-2";
import ChartLegend from "../components/Chart/ChartLegend";
import PageTitle from "../components/Typography/PageTitle";

import response from "../utils/demo/tableData";
import {
  TableBody,
  TableContainer,
  Table,
  TableHeader,
  TableCell,
  TableRow,
  TableFooter,
  Avatar,
  Badge,
  Pagination,
} from "@windmill/react-ui";

import {
  doughnutOptions,
  stackedOptions,
  doughnutLegends,
  stackedData,
} from "../utils/demo/chartsData";

function Dashboard() {
  const [page, setPage] = useState(1);
  const [data, setData] = useState([]);

  // pagination setup
  const resultsPerPage = 10;
  const totalResults = response.length;

  // pagination change control
  function onPageChange(p) {
    setPage(p);
  }

  // on page change, load new sliced data
  // here you would make another server request for new data
  useEffect(() => {
    setData(response.slice((page - 1) * resultsPerPage, page * resultsPerPage));
  }, [page]);

  return (
    <>
      {/* <!-- Cards --> */}
      <PageTitle>Dashboard</PageTitle>
      {/* <div className="items-center justify-between p-4 mb-8 text-sm font-semibold text-purple-100 bg-purple-600   shadow-md focus:outline-none focus:shadow-outline-purple">
        Pending Today
        </div> */}

      <div className="flex flex-wrap w-full">
        <div className="w-full px-4 mb-10 xl:w-6/12 xl:mb-0">
          <PageTitle> Pending today</PageTitle>
          <TableContainer>
            <Table>
              <TableHeader className="text-purple-100 bg-primary">
                <tr>
                  <TableCell>Client</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Status</TableCell>
                </tr>
              </TableHeader>
              <TableBody>
                {data.map((user, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <div className="flex items-center text-sm">
                        <Avatar
                          className="hidden mr-3 md:block"
                          src={user.avatar}
                          alt="User image"
                        />
                        <div>
                          <p className="font-semibold">{user.name}</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {user.job}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">QAR {user.amount}</span>
                    </TableCell>
                    <TableCell>
                      <Badge
                        type={user.status == "pending" ? "warning" : "success"}
                      >
                        {user.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <TableFooter>
              <Pagination
                totalResults={totalResults}
                resultsPerPage={resultsPerPage}
                label="Table navigation"
                onChange={onPageChange}
              />
            </TableFooter>
          </TableContainer>
        </div>
        <div className="w-full px-4 xl:w-6/12">
          <PageTitle>Charts</PageTitle>
          <div className="grid gap-6 mb-8 md:grid-rolw-2">
            <ChartCard title="Advance Categories">
              <Doughnut {...doughnutOptions} />
            </ChartCard>

            <ChartCard title="Expense">
              <Bar
                data={stackedData}
                width={null}
                height={null}
                options={stackedOptions}
              />
            </ChartCard>
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
