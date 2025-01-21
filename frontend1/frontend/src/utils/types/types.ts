

export interface Transaction{
    id:number;
    title:string;
    price:number;
    description:string;
    category:string;
    image:string;
    sold:boolean;
    dateOfSale:string
}

export interface TableProps{
    data:Transaction[],
    columns:any,
    rowsPerPage:number
}

export interface ButtonProps {
    label: string;
    handleClick: () => void;
    type: any;
    isDisabled?: boolean
}