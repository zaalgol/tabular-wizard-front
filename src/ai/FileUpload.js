import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import {
    Container, Grid, Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, TextField, Select, MenuItem,
    FormControl, Radio, RadioGroup, InputLabel, FormControlLabel, Typography, TablePagination, Box
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import makeRequest from '../api'

const ROWS_PER_PAGE = 10; // Set the number of rows per page
const INITIAL_PAGE = 1;



function FileUpload() {
    const [state, setState] = useState({
        modelName: '',
        description: '',
        data: [],
        columns: [],
        targetColumn: '',
        modelType: '',
        trainingSpeed: 'fast',
        columnOptions: {},
        currentPage: 1,
        rowsPerPage: ROWS_PER_PAGE,
        isLoading: false,
        isSubmitting: false,
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setState(prev => ({ ...prev, [name]: value }));
        var v = 0;
    };

    const handleFileChange = (e) => {
        const files = e.target.files;
        if (files && files[0]) {
            setState(prev => ({ ...prev, isLoading: true }));
            const file = files[0];
            const reader = new FileReader();
            reader.onload = (evt) => {
                const bstr = evt.target.result;
                const wb = XLSX.read(bstr, { type: 'binary' });
                const wsname = wb.SheetNames[0];
                const ws = wb.Sheets[wsname];
                const jsonData = XLSX.utils.sheet_to_json(ws, { header: 1, defval: "" });
                if (jsonData.length > 0) {
                    setState(prev => ({
                        ...prev,
                        columns: jsonData[0],
                        data: jsonData,
                        isLoading: false,
                    }));
                }
            };
            reader.onerror = (error) => {
                console.error('Error reading file:', error);
                setState(prev => ({ ...prev, isLoading: false }));
            };
            reader.readAsBinaryString(file);
        } else {
            console.error('No file selected');
        }
    };

    const handleOptionChange = (colIndex, event) => {
        setState(prev => ({
            ...prev,
            columnOptions: {
                ...prev.columnOptions,
                [colIndex]: event.target.value,
            },
        }));
    };

    useEffect(() => {
        const initialOptions = state.columns.reduce((options, _, colIndex) => ({
            ...options,
            [colIndex]: 'raw',
        }), {});
        setState(prev => ({ ...prev, columnOptions: initialOptions }));
    }, [state.columns]);


    const handleChangePage = (event, newPage) => {
        setState(prev => ({ ...prev, currentPage: newPage + 1 }));
    };

    const handleChangeRowsPerPage = (event) => {
        setState(prev => ({
            ...prev,
            rowsPerPage: parseInt(event.target.value, 10),
            currentPage: INITIAL_PAGE,
        }));
    };

    const handleSubmit = async () => {
        setState(prev => ({ ...prev, isSubmitting: true }));
        try {
            // Extract headers and rows from the data
            const [headers, ...rows] = state.data; // Access data using state.data
    
            // Filter columns based on the 'Use column data' option
            const filteredColumnsIndexes = headers.map((_, index) => index).filter(index => state.columnOptions[index] === 'raw'); // Use state.columnOptions
            const filteredHeaders = headers.filter((_, index) => filteredColumnsIndexes.includes(index));
            const filteredRows = rows.map(row => row.filter((_, index) => filteredColumnsIndexes.includes(index)));
    
            // Prepare the payload
            const payload = {
                modelName: state.modelName, // Access using state.modelName
                description: state.description, // Use state.description
                dataset: [filteredHeaders, ...filteredRows],
                targetColumn: state.targetColumn, // Use state.targetColumn
                modelType: state.modelType, // Use state.modelType
                trainingSpeed: state.trainingSpeed, // Use state.trainingSpeed
            };
    
            // Send the data to the server
            const response = await makeRequest('/api/trainModel/', 'POST', payload, {}, true); // Adjust the endpoint as necessary
            console.log(response.data); // Handle the response as needed
        } catch (error) {
            console.error('Error submitting the data:', error);
        }
        setState(prev => ({ ...prev, isSubmitting: false }));
    };


    const renderColumnOptions = (colIndex) => {
        return (
            <FormControl fullWidth size="small" margin="dense">
                <InputLabel id={`select-label-${colIndex}`}>Options</InputLabel>
                <Select
                    sx={{ width: 200 }} // Adjust the width as needed
                    labelId={`select-label-${colIndex}`}
                    id={`select-${colIndex}`}
                    value={state.columnOptions[colIndex] || 'raw'}
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

    // Add custom styling here
    const containerStyles = {
        marginTop: '16px', // Adjust the top margin
        marginRight: '16px', // Adjust the right margin
    };

    const gridItemStyles = {
        padding: '8px', // Provides spacing inside each grid item
    };

    return (
        <Box sx={{ p: 4 }}> {/* Use Box to provide padding around the entire component */}
            <Container maxWidth={false} sx={containerStyles}>
                <Typography variant="h4" gutterBottom>
                    Train Model
                </Typography>
                <Grid container spacing={3}>
                    <Grid item xs={2} sx={gridItemStyles}>
                        <TextField
                            required
                            fullWidth
                            name="modelName"
                            id="outlined-required"
                            label="Model Name"
                            onChange={handleInputChange} />
                    </Grid>
                    <Grid item xs={4} sx={gridItemStyles}>
                        <TextField
                            required
                            fullWidth
                            name="description"
                            id="outlined-required"
                            label="Description"
                            onChange={handleInputChange} />
                    </Grid>
                    <Grid item xs={12}>
                        <LoadingButton
                            variant="contained"
                            component="label"
                            loading={state.isLoading}
                        >
                            Upload File
                            <input
                                type="file"
                                hidden
                                accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                                onChange={handleFileChange} />
                        </LoadingButton>
                    </Grid>
                    <Grid item xs={12}>
                        <TableContainer component={Paper} sx={{ maxHeight: 400, overflow: 'auto' }}>
                            <Table stickyHeader aria-label="sticky table">
                                <TableHead>
                                    <TableRow>
                                        {state.columns.map((col, index) => (
                                            <TableCell key={index}>
                                                <Typography variant="h6">{col}</Typography>
                                                {renderColumnOptions(index)}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {state.data
                                        .slice(1)
                                        .slice((state.currentPage - 1) * state.rowsPerPage, state.currentPage * state.rowsPerPage)
                                        .map((row, rowIndex) => (
                                            <TableRow key={rowIndex}>
                                                {row.map((cell, cellIndex) => (
                                                    <TableCell key={cellIndex}>{cell}</TableCell>
                                                ))}
                                            </TableRow>
                                        ))}
                                </TableBody>
                            </Table>
                            {state.data.length > 0 && <TablePagination
                                rowsPerPageOptions={[5, 10, 25]}
                                component="div"
                                count={state.data.length}
                                rowsPerPage={state.rowsPerPage}
                                page={state.currentPage - 1} // Subtract 1 for zero-indexed page prop
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage} />}
                        </TableContainer>
                    </Grid>
                    <Grid item xs={2}>
                        <FormControl fullWidth>
                            <InputLabel id="target-column-label">Target Column</InputLabel>
                            <Select
                                name="targetColumn"
                                labelId="target-column-label"
                                id="target-column-select"
                                value={state.targetColumn}
                                label="Target Column"
                                onChange={handleInputChange}
                            >
                                {state.columns.map((col, index) => (
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
                                    <RadioGroup row aria-label="model-type" name="modelType" value={state.modelType} onChange={handleInputChange}>
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
                                    <RadioGroup row aria-label="training-speed" name="trainingSpeed" value={state.trainingSpeed} onChange={handleInputChange}>
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
                            loading={state.isSubmitting}
                        >
                            Submit
                        </LoadingButton>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}

export default FileUpload;