import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import {
    Container, Grid, Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, TextField, Select, MenuItem,
    FormControl, Radio, RadioGroup, InputLabel, FormControlLabel, Typography, TablePagination
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import makeRequest from '../api'

const ROWS_PER_PAGE = 10; // Set the number of rows per page
const INITIAL_PAGE = 1;



function FileUpload() {
    const [modelName, setModelName] = useState('');
    const [data, setData] = useState([]);
    const [columns, setColumns] = useState([]);
    const [targetColumn, setTargetColumn] = useState('');
    const [modelType, setModelType] = useState('');
    const [trainingSpeed, setTrainingSpeed] = useState('fast');
    const [columnOptions, setColumnOptions] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(ROWS_PER_PAGE);
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleModelNameChange = (event) => {
        setModelName(event.target.value);
    };

    const handleFileChange = (e) => {
        const files = e.target.files;
        if (files && files[0]) {
            setIsLoading(true); // Assume you have this state defined for loading
            const file = files[0];
            const reader = new FileReader();
            reader.onload = (evt) => {
                console.log('onload');
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

    useEffect(() => {
        const initialOptions = columns.reduce((options, _, colIndex) => {
            options[colIndex] = 'raw'; // Set default to 'raw' for each column
            return options;
        }, {});

        setColumnOptions(initialOptions);
    }, [columns]);


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

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            // Extract headers and rows from the data
            const [headers, ...rows] = data;

            // Filter columns based on the 'Use column data' option
            const filteredColumnsIndexes = headers.map((_, index) => index).filter(index => columnOptions[index] === 'raw');
            const filteredHeaders = headers.filter((_, index) => filteredColumnsIndexes.includes(index));
            const filteredRows = rows.map(row => row.filter((_, index) => filteredColumnsIndexes.includes(index)));

            // Prepare the payload
            const payload = {
                modelName,
                dataset: [filteredHeaders, ...filteredRows],
                targetColumn,
                modelType,
                trainingSpeed
            };

            // Send the data to the server
            const response = await makeRequest('/api/trainModel/', 'POST', payload, {}, true); // Adjust the endpoint as necessary
            console.log(response.data); // Handle the response as needed
        } catch (error) {
            console.error('Error submitting the data:', error);
        }
        setIsSubmitting(false);
    };


    const renderColumnOptions = (colIndex) => {
        return (
            <FormControl fullWidth size="small" margin="dense">
                <InputLabel id={`select-label-${colIndex}`}>Options</InputLabel>
                <Select
                    sx={{ width: 200 }} // Adjust the width as needed
                    labelId={`select-label-${colIndex}`}
                    id={`select-${colIndex}`}
                    value={columnOptions[colIndex] || 'raw'}
                    label="Options"
                    onChange={(event) => handleOptionChange(colIndex, event)}
                >
                    <MenuItem value={'raw'}>Use column data</MenuItem>
                    {/* TODU: Add encryption logic*/}
                    {/* <MenuItem value={'data_encrypt'}>Encrypt column data</MenuItem>
                    <MenuItem value={'column_name_encrypt'}>Encrypt column name</MenuItem>
                    <MenuItem value={'data_and_column_name_encrypt'}>Encrypt column name and data</MenuItem> */}
                    <MenuItem value={'ignore'}>Don't use column data</MenuItem>
                </Select>
            </FormControl>
        );
    };

    return (
        <Container maxWidth="lg">
            <Typography variant="h4" gutterBottom>
                Train Model
            </Typography>

            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <TextField
                        required
                        id="outlined-required"
                        label="Model Name"
                        onChange={handleModelNameChange}
                    />
                </Grid>
                <Grid item xs={12}>
                    <LoadingButton
                        variant="contained"
                        component="label"
                        loading={isLoading}
                    >
                        Upload File
                        <input
                            type="file"
                            hidden
                            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                            onChange={handleFileChange}
                        />
                    </LoadingButton>
                </Grid>
                <Grid item xs={12}>
                    <TableContainer component={Paper} sx={{ maxHeight: 440, overflow: 'auto' }}>
                        <Table stickyHeader aria-label="sticky table">
                            <TableHead>
                                <TableRow>
                                    {columns.map((col, index) => (
                                        <TableCell key={index}>
                                            <Typography variant="h6">{col}</Typography>
                                            {renderColumnOptions(index)}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {data
                                    .slice(1)
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
                        {data.length > 0 && <TablePagination
                            rowsPerPageOptions={[5, 10, 25]}
                            component="div"
                            count={data.length}
                            rowsPerPage={rowsPerPage}
                            page={currentPage - 1} // Subtract 1 for zero-indexed page prop
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />}
                    </TableContainer>
                </Grid>
                <Grid item xs={12}>
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
                </Grid>

                <Grid item xs={12}>
                    <Grid container spacing={8} alignItems="center">
                        <Grid item>
                            <Typography variant="h6" gutterBottom>
                                Model Type
                            </Typography>
                            <FormControl component="fieldset">
                                <RadioGroup row aria-label="model-type" name="modelType" value={modelType} onChange={handleModelTypeChange}>
                                    <FormControlLabel value="regression" control={<Radio />} label="Regression" />
                                    <FormControlLabel value="classification" control={<Radio />} label="Classification" />
                                </RadioGroup>
                            </FormControl>
                        </Grid>
                        <Grid item>
                            <Typography variant="h6" gutterBottom>
                                Training Speed
                            </Typography>
                            <FormControl component="fieldset">
                                <RadioGroup row aria-label="training-speed" name="trainingSpeed" value={trainingSpeed} onChange={handleTrainingSpeedChange}>
                                    <FormControlLabel value="fast" control={<Radio />} label="Fast Training" />
                                    <FormControlLabel value="slow" control={<Radio />} label="Slow Training But More Accurate" />
                                </RadioGroup>
                            </FormControl>
                        </Grid>
                    </Grid>
                </Grid>

                <Grid item xs={12}>
                    <LoadingButton
                        variant="contained"
                        color="primary"
                        onClick={handleSubmit}
                        loading={isSubmitting}
                    >
                        Submit
                    </LoadingButton>
                </Grid>
            </Grid>
        </Container>
    );
}

export default FileUpload;