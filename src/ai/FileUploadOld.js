

import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import {
    Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Button, Select, MenuItem,
    FormControl, Radio, RadioGroup, InputLabel, FormControlLabel, TablePagination
} from '@mui/material';
import { LoadingButton } from '@mui/lab';

const ROWS_PER_PAGE = 10; // Set the number of rows per page
const INITIAL_PAGE = 1;


function FileUploadOLd() {
    ;
    const [data, setData] = useState([]);
    const [columns, setColumns] = useState([]);
    const [targetColumn, setTargetColumn] = useState('');
    const [modelType, setModelType] = useState('');
    const [trainingSpeed, setTrainingSpeed] = useState('fast');
    const [columnOptions, setColumnOptions] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(ROWS_PER_PAGE);

    const [isLoading, setIsLoading] = useState(false); 

    // const handleFileChange = (e) => {
    //     const file = e.target.files[0];
    //     const reader = new FileReader();
    //     reader.onload = (evt) => {
    //         const bstr = evt.target.result;
    //         const wb = XLSX.read(bstr, { type: 'binary' });
    //         const wsname = wb.SheetNames[0];
    //         const ws = wb.Sheets[wsname];
    //         const jsonData = XLSX.utils.sheet_to_json(ws, { header: 1, defval: "" });
    //         if (jsonData.length > 0) {
    //             setColumns(jsonData[0]); // Set column headers
    //             setData(jsonData);
    //         }
    //     };
    //     reader.readAsBinaryString(file);
    // };

    // const handleFileChange = (e) => {
    //     const file = e.target.files[0];
    //     const reader = new FileReader();
    //     reader.onload = (evt) => {
    //         setIsLoading(true);
    //         const bstr = evt.target.result;
    //         const wb = XLSX.read(bstr, { type: 'binary' });
    //         const wsname = wb.SheetNames[0];
    //         const ws = wb.Sheets[wsname];
    //         const jsonData = XLSX.utils.sheet_to_json(ws, { header: 1, defval: "" });
    //         if (jsonData.length > 0) {
    //             setColumns(jsonData[0]); // Set column headers
    //             setData(jsonData);
    //         }
    //         setIsLoading(false);
    //     };
    //     reader.readAsBinaryString(file);
    // };

    const handleFileChange = (e) => {
        console.log('File input changed'); // Check if this gets logged
    
        const files = e.target.files;
        console.log(files); // Check what files contains
    
        if (files && files[0]) {
            setIsLoading(true); // Assume you have this state defined for loading
            const file = files[0];
            const reader = new FileReader();
            reader.onload = (evt) => {
                const bstr = evt.target.result;
                const wb = XLSX.read(bstr, { type: 'binary' });
                const wsname = wb.SheetNames[0];
                const ws = wb.Sheets[wsname];
                const jsonData = XLSX.utils.sheet_to_json(ws, { header: 1, defval: "" });
                if (jsonData.length > 0) {
                    setColumns(jsonData[0]); // Set column headers
                    setData(jsonData);
                }
                setIsLoading(false);
            };
            reader.onerror = (error) => {
                console.error('Error reading file:', error);
                setIsLoading(false);
            };
            reader.readAsBinaryString(file);
        } else {
            console.error('No file selected');
        }
    };

    const handleOptionChange = (colIndex, event) => {
        setColumnOptions({
            ...columnOptions,
            [colIndex]: event.target.value
        });
    };

    const handleChangePage = (event, newPage) => {
        setCurrentPage(newPage + 1);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, ROWS_PER_PAGE));
        setCurrentPage(INITIAL_PAGE);
    };


    const handleTargetColumnChange = (event) => {
        setTargetColumn(event.target.value);
    };

    const handleModelTypeChange = (event) => {
        setModelType(event.target.value);
    };

    const handleTrainingSpeedChange = (event) => {
        setTrainingSpeed(event.target.value);
    };

    const renderColumnOptions = (colIndex) => {
        return (
            <FormControl fullWidth>
                <InputLabel id={`select-label-${colIndex}`}>Options</InputLabel>
                <Select
                    labelId={`select-label-${colIndex}`}
                    id={`select-${colIndex}`}
                    value={columnOptions[colIndex] || ''}
                    label="Options"
                    onChange={(event) => handleOptionChange(colIndex, event)}
                >
                    <MenuItem value={'raw'}>Use this column raw data</MenuItem>
                    <MenuItem value={'data_encrypt'}>Encrypt column data</MenuItem>
                    <MenuItem value={'column_name_encrypt'}>Encrypt column name</MenuItem>
                    <MenuItem value={'data_and_column_name_encrypt'}>Encrypt column name and data</MenuItem>
                    <MenuItem value={'ignore'}>Don't use this column data</MenuItem>
                </Select>
            </FormControl>
        );
    };

    return (
        <div>
            <Button
                variant="contained"
                component="label"
            >
                Upload File
                <input
                    type="file"
                    hidden
                    accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                    onChange={handleFileChange}
                />
            </Button>

            <TableContainer component={Paper} sx={{ maxHeight: 400, overflow: 'auto' }}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            {columns.map((col, index) => (
                                <TableCell key={index}>
                                    {col}
                                    {renderColumnOptions(index)}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data
                            .slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)
                            .map((row, rowIndex) => (
                                <TableRow key={rowIndex}>
                                    {row.map((cell, cellIndex) => (
                                        <TableCell key={cellIndex}>{cell}</TableCell>
                                    ))}
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={data.length}
                    rowsPerPage={rowsPerPage}
                    page={currentPage - 1} // Subtract 1 for zero-indexed page prop
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </TableContainer>

            <FormControl fullWidth>
                <InputLabel id="target-column-label">Target Column</InputLabel>
                <Select
                    labelId="target-column-label"
                    id="target-column-select"
                    value={targetColumn}
                    label="Target Column"
                    onChange={handleTargetColumnChange}
                >
                    {columns.map((col, index) => (
                        <MenuItem key={index} value={col}>{col}</MenuItem>
                    ))}
                </Select>
            </FormControl>
            <div>
                <FormControl component="fieldset">
                    <RadioGroup row aria-label="model-type" name="modelType" value={modelType} onChange={handleModelTypeChange}>
                        <FormControlLabel value="regression" control={<Radio />} label="Regression" />
                        <FormControlLabel value="classification" control={<Radio />} label="Classification" />
                    </RadioGroup>
                </FormControl>
            </div>
            <div>
                <FormControl component="fieldset">
                    <RadioGroup row aria-label="training-speed" name="trainingSpeed" value={trainingSpeed} onChange={handleTrainingSpeedChange}>
                        <FormControlLabel value="fast" control={<Radio />} label="Fast Training" />
                        <FormControlLabel value="slow" control={<Radio />} label="Slow Training" />
                    </RadioGroup>
                </FormControl>
            </div>
        </div>
    );
}

export default FileUploadOLd;
