import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import {
    Container, Grid, Select, MenuItem,
    FormControl, InputLabel, Box
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import makeRequest from '../api';

import {
    ModelNameInput, DescriptionInput, TargetColumnSelect,
    ModelTypeRadioGroup, TrainingSpeedRadioGroup, UploadFile, DatasetContent, TitleView
} from './ModelFormComponents';

const ROWS_PER_PAGE = 10; // Set the number of rows per page
const INITIAL_PAGE = 1;


function TrainModel() {
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
        datasetError: '', // Error message for dataset
        modelNameError: '', // Error message for modelName
        modelTypeError: '',
    });

    const validateDataset = () => {
        if (state.data.length <= 1) {
            setState(prev => ({ ...prev, datasetError: 'Please upload a dataset file.' }));
        } else {
            setState(prev => ({ ...prev, datasetError: '' }));
        }
    };

    const validateModelName = () => {
        if (state.modelName.trim() === '') {
            setState(prev => ({ ...prev, modelNameError: 'Please enter a model name.' }));
        } else {
            setState(prev => ({ ...prev, modelNameError: '' }));
        }
    };

    const validateModelType = () => {
        if (state.modelType.trim() === '') {
            setState(prev => ({ ...prev, modelTypeError: 'Please select a model type.' }));
        } else {
            setState(prev => ({ ...prev, modelTypeError: '' }));
        }
    };
    const isValidSubmission = () => {
        return !state.datasetError  && !state.modelNameError && !state.modelTypeError;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setState(prev => ({ ...prev, [name]: value }));
    };

    function updateData(jsonData) {
        setState(prev => ({
            ...prev,
            columns: jsonData[0],
            data: jsonData,
            isLoading: false,
        }));
    }

    const handleFileChange = (updateStateCallback) => (e) => {
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
                    // Call the updateStateCallback with jsonData.
                    updateStateCallback(jsonData);
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
        validateDataset();
        validateModelName();
        validateModelType();
        const initialOptions = state.columns.reduce((options, _, colIndex) => ({
            ...options,
            [colIndex]: 'raw',
        }), {});
        setState(prev => ({ ...prev, columnOptions: initialOptions }));
    }, [state.data, state.modelName, state.modelType, state.columns]);


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
                <TitleView titleText="Train Model">
                </TitleView>
                <Grid container spacing={3}>
                    <Grid item xs={2} sx={gridItemStyles}>
                        <ModelNameInput
                            value={state.modelName}
                            onChange={handleInputChange}
                        />
                    </Grid>
                    <Grid item xs={4} sx={gridItemStyles}>
                        <DescriptionInput
                            label="Description"
                            value={state.description}
                            onChange={handleInputChange}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <UploadFile
                            // onChange={handleFileChange(updateDataState)}
                            updateData={updateData}
                            setState={setState}
                            loading={state.isLoading}
                        >
                        </UploadFile>
                    </Grid>
                    <Grid item xs={12}>
                        <DatasetContent
                            state={state}
                            renderColumnOptions={renderColumnOptions}
                            handleChangePage={renderColumnOptions}
                            handleChangeRowsPerPage={handleChangeRowsPerPage}
                        >
                        </DatasetContent>
                    </Grid>
                    {state.data.length > 0 && <Grid item xs={2}>
                        <TargetColumnSelect
                            columns={state.columns}
                            value={state.targetColumn}
                            onChange={handleInputChange}
                        />
                    </Grid>}
                    <Grid item xs={12}>
                        <Grid container spacing={8} alignItems="center">
                            <Grid item>
                                <ModelTypeRadioGroup
                                    value={state.modelType}
                                    onChange={handleInputChange}
                                />
                            </Grid>
                            <Grid item>
                                <TrainingSpeedRadioGroup
                                    value={state.trainingSpeed}
                                    onChange={handleInputChange}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Box sx={{ p: 4 }}>
                        <Container maxWidth={false} sx={containerStyles}>
                            {state.datasetError && <div>{state.datasetError}</div>}
                            {state.modelNameError && <div>{state.modelNameError}</div>}
                            {state.modelTypeError && <div>{state.modelTypeError}</div>}
                            <Grid container spacing={3}>
                                {/* ... */}
                            </Grid>
                        </Container>
                    </Box>
                    <Grid item xs={12}>
                        <LoadingButton
                            variant="contained"
                            color="primary"
                            onClick={handleSubmit}
                            loading={state.isSubmitting}
                        disabled={!isValidSubmission()}
                        >
                            Submit
                        </LoadingButton>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}

export default TrainModel;