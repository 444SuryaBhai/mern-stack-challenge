import React, { useEffect, useState } from "react";

import { Transaction } from "../../utils/types/types";
import { fetchTransactions, getMetricsData } from "../../services/http-repository-service";
import Loader from "../loader/Loader";
import Table from "../data-table/DataTable";
import './ProductList.css';
import Chart from "../chart/Chart";

const ProductList: React.FC = () => {
    const columns = [
        { label: "Image", accessor: 'image' },
        { label: "ID", accessor: "id" },
        { label: "Title", accessor: "title" },
        { label: "Description", accessor: "description" },
        { label: "Price", accessor: "price" },
        { label: "DateSale", accessor: "dateOfSale" },
        { label: "Sold", accessor: 'sold' }
    ];

    const months = [
        { monthName: 'January', monthValue: 1 },
        { monthName: 'February', monthValue: 2 },
        { monthName: 'March', monthValue: 3 },
        { monthName: 'April', monthValue: 4 },
        { monthName: 'May', monthValue: 5 },
        { monthName: 'June', monthValue: 6 },
        { monthName: 'July', monthValue: 7 },
        { monthName: 'August', monthValue: 8 },
        { monthName: 'September', monthValue: 9 },
        { monthName: 'October', monthValue: 10 },
        { monthName: 'November', monthValue: 11 },
        { monthName: 'December', monthValue: 12 },
    ];

    const handleMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedMonth(Number(event.target.value));

    };

    const [isLoading, setLoading] = useState<boolean>(false);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [selectedMonth, setSelectedMonth] = useState<number | any>(null);
    const [pieChartLabels, setPieChartLabels] = useState<string[]>([]);
    const [pieChartData, setPieChartData] = useState<number[]>([]);
    const [barcharLabels, setBarcharLabels] = useState<string[]>([]);
    const [barchartData, setBarcharData] = useState<number[]>([])
    const [statistics, setStatistics] = useState<any>();

    useEffect(() => {
        loadTransactions("", 1, 20);
        loadChartsData();
    }, []);

    useEffect(() => {
        loadTransactions(searchQuery, 1, 20, selectedMonth);
        loadChartsData(selectedMonth);
    }, [selectedMonth])

    const loadTransactions = async (search?: string, page?: number, pageFor?: number, month?: number) => {
        setLoading(true);
        try {
            const data = await fetchTransactions(search, page, pageFor, month);
            const updatedData: any = data.map((item: Transaction) => { return { ...item, sold: item?.sold.toString() } })
            setTransactions(updatedData);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.error("Failed to get transaction", error);
        }
    }

    const getChartsDataSeperately = (data: any) => {
        let statistics = data?.statistics;
        setStatistics(statistics);
        let pie_chart_labels = data?.pieChart?.map((item: any) => { return item?._id });
        setPieChartLabels(pie_chart_labels);
        let pie_chart_data = data?.pieChart?.map((item: any) => { return item?.count });
        setPieChartData(pie_chart_data);
        let bar_chart_labels = data?.barChart?.map((item: any) => { return item?.range });
        setBarcharLabels(bar_chart_labels);
        let bar_chart_data = data?.barChart?.map((item: any) => { return item?.count });
        setBarcharData(bar_chart_data);
    }

    const loadChartsData = async (month?: number) => {
        try {
            if (month && month > 0) {
                const data = await getMetricsData(month);
                getChartsDataSeperately(data);
            } else {
                const data: any = await getMetricsData();
                getChartsDataSeperately(data);
            }
        } catch (error) {
            setLoading(false);
            console.error("Failed to get transaction", error);
        }
    }

    return (
        <div className="p-3">
            <Loader isLoading={isLoading} />
            <h1>Transaction Management</h1>
            <div className="d-flex align-items-end justify-content-between w-100 mb-2">
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => { loadTransactions(e.target.value, 1, 20, selectedMonth); setSearchQuery(e.target.value) }}
                    className="table-search"
                />
                <div className="month-dropdown-container" title="Select Month to get data">
                    <label htmlFor="month">Select Month: </label>
                    <select id="month" value={selectedMonth} onChange={handleMonthChange}>
                        <option key="" value="" selected={false}>Month</option>

                        {months.map((month) => (
                            <option key={month.monthValue} value={month.monthValue}>
                                {month.monthName}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            {/* Charts */}
            <div className="charts w-100">
                <div className="col-4" style={{ height: '200px' }}>
                    <Chart type='bar' labels={barcharLabels} cdata={barchartData} />
                </div>
                <div className="col-4" style={{ height: '200px' }}>
                    <Chart type='pie' labels={pieChartLabels} cdata={pieChartData} />
                </div>
                <div className="stats col-3" style={{ height: '200px' }}>
                    <p><b>Total Sale :</b> {statistics?.totalSaleAmount}</p>
                    <p><b>Total Sold Item :</b> {statistics?.totalSoldItems}</p>
                    <p><b>Total Not Sold Item :</b> {statistics?.totalNotSoldItems}</p>
                </div>
            </div>
            {/* Table */}
            <Table data={transactions} columns={columns} rowsPerPage={5} />
        </div>
    );
};

export default ProductList;