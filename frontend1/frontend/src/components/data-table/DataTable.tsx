import { useState, useMemo } from "react";

import "./DataTable.css";
import { TableProps } from "../../utils/types/types";
import ButtonField from "../button/ButtonField";

const Table = ({ data, columns, rowsPerPage = 5 }: TableProps) => {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [sortConfig, setSortConfig] = useState<any>({
        key: null,
        direction: "descending", // Default sort direction
    });

    // Sort data based on column and direction
    const sortedData = useMemo(() => {
        if (!sortConfig.key) return data;

        return [...data].sort((a: any, b: any) => {
            const aValue = a[sortConfig.key];
            const bValue = b[sortConfig.key];

            if (aValue < bValue) return sortConfig.direction === "ascending" ? -1 : 1;
            if (aValue > bValue) return sortConfig.direction === "ascending" ? 1 : -1;
            return 0;
        });
    }, [data, sortConfig]);

    // Paginate data
    const paginatedData: any = useMemo(() => {
        const startIndex = (currentPage - 1) * rowsPerPage;
        return sortedData.slice(startIndex, startIndex + rowsPerPage);
    }, [sortedData, currentPage, rowsPerPage]);

    const handleSort = (key: any) => {
        setSortConfig((prev: any) => ({
            key,
            direction: prev.key === key && prev.direction === "ascending" ? "descending" : "ascending",
        }));
    };

    const totalPages = Math.ceil(sortedData.length / rowsPerPage);

    return (
        <div className="table-container">
            <table className="custom-table" style={{ fontSize: '13px' }}>
                <thead>
                    <tr>
                        {columns.map((col: any) => (
                            <th key={col.accessor} onClick={() => handleSort(col.accessor)} style={{ minWidth: '80px' }}>
                                <div>{col.label}
                                    <span className="sort-icon">
                                        {sortConfig.key === col.accessor
                                            ? sortConfig.direction === "ascending"
                                                ? " 🔼"
                                                : " 🔽"
                                            : " 🔽"} {/* Default sort icon */}
                                    </span>
                                </div>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {Array.isArray(paginatedData) && paginatedData.length > 0 ? (
                        paginatedData.map((row: any, rowIndex: number) => (
                            <tr key={rowIndex}>
                                {columns.map((col: any) => (
                                    <td key={col.accessor}>
                                        {col.accessor === "image" ? <img src={row[col.accessor]} alt='image' style={{ height: '40px' }} /> : row[col.accessor]}
                                    </td>
                                ))}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={columns.length}>No data available</td>
                        </tr>
                    )}

                </tbody>
            </table>

            <div className="pagination">
                <ButtonField
                    label="Previous"
                    handleClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    type={'button'}
                    isDisabled={currentPage === 1}
                />
                <span>
                    Page {currentPage} of {totalPages}
                </span>
                <ButtonField
                    label="Next"
                    handleClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    type={'button'}
                    isDisabled={currentPage === totalPages}
                />
            </div>
        </div>
    );
};

export default Table;