import axios from 'axios';
import { baseUrl } from '../utils/constants/constants';
import { Transaction } from '../utils/types/types';

export const HttpService = axios.create({
  withCredentials: false,
  baseURL: baseUrl,
});

export const fetchTransactions = async (
  search?: string,  // Optional parameter
  page?: number,    // Optional parameter
  perPage?: number, // Optional parameter
  month?: number    // Optional parameter
): Promise<Transaction[]> => {
  // Start with an empty URLSearchParams
  const queryParams = new URLSearchParams();

  // Conditionally append query parameters if they are provided
  if (search) queryParams.append('search', search);
  if (page) queryParams.append('page', page.toString());
  if (perPage) queryParams.append('perPage', perPage.toString());
  if (month) queryParams.append('month', month.toString());

  // Construct the URL with the query parameters
  const { data } = await HttpService.get<Transaction[]>(`/transactions?${queryParams.toString()}`);

  // Return the array of transactions from the response
  return data;
};

export const getMetricsData = async (month?: number) => {
  // Construct the URL with the query parameters
  const { data } = await HttpService.get<Transaction[]>(`/combined?month=${month}`);

  // Return the array of transactions from the response
  return data;
}