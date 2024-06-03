import React, { useState, useEffect } from 'react';
import {
    Container, Grid, Select, MenuItem,
    FormControl, InputLabel, Box
} from '@mui/material';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import { LoadingButton } from '@mui/lab';
import { handleMakeRequest } from '../app/RequestNavigator';
import { useNavigate } from 'react-router-dom';
import { TrainModelIcon } from '../icons/TrainModelIcon'

import {
    ModelNameInput, DescriptionInput, TargetColumnSelect, MetricSelect, TrainingStrategySelect, SamplingStrategySelect,
    ModelTypeRadioGroup, UploadFile, DatasetContent, TitleView
} from './ModelFormComponents';

import { trainingStrategyOptions, samplingStrategyOptions, metricsRegressionOptions, metricsclassificationOptions } from './consts'

const ROWS_PER_PAGE = 5; // Set the number of rows per page
const INITIAL_PAGE = 1;

function TrainModel() {
    const [state, setState] = useState({
        modelName: '',
        description: '',
        data: [],
        columns: [],
        targetColumn: '',
        modelType: '',
        columnOptions: {},
        currentPage: 1,
        rowsPerPage: ROWS_PER_PAGE,
        isLoading: false,
        isSubmitting: false,
        datasetError: '', // Error message for dataset
        modelNameError: '', // Error message for modelName
        modelTypeError: '',
        targetColumnError: '',
        fileName: '',
        fileSize: 0,
        metric: '',
        trainingStrategy: 'ensembleModelsFast',
        samplingStrategy: 'dontOversample'
    });

    const navigate = useNavigate();

    const isValidSubmission = () => {
        return !state.datasetError && !state.modelNameError && !state.modelTypeError && !state.targetColumnError;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setState(prev => {
            return { ...prev, [name]: value };
        });
    };

    function updateData(jsonData) {
        setState(prev => ({
            ...prev,
            columns: jsonData[0],
            data: jsonData,
            // fileSize: jsonData.length,
            isLoading: false,
        }));
    }

    const handleRemoveFile = (fileInputRef) => {
        // Ensure that the function can be called with fileInputRef as a parameter
        if (fileInputRef && fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        setState(prev => ({ ...prev, fileName: '', fileSize: 0, data: [], columns: [], columnOptions: {}, targetColumn: '' }));
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

        const validateTargetColumn = () => {
            if (state.data.length > 1 && state.targetColumn.trim() === '') {
                setState(prev => ({ ...prev, targetColumnError: 'Please select a target column.' }));
            } else {
                setState(prev => ({ ...prev, targetColumnError: '' }));
            }
        };

        validateDataset();
        validateModelName();
        validateModelType();
        validateTargetColumn();
    }, [state.data, state.modelName, state.modelType, state.targetColumn]);

    useEffect(() => {
        // Handle column options reset on file name change
        if (state.fileName === '') {
            setState(prev => ({ ...prev, columns: [], columnOptions: {} }));
        } else {
            const initialOptions = state.columns.reduce((options, _, colIndex) => ({
                ...options,
                [colIndex]: 'raw',
            }), {});
            setState(prev => ({ ...prev, columnOptions: initialOptions }));
        }
    }, [state.columns, state.fileName]);

    // Use effect to update the MetricSelect based on model type
    useEffect(() => {
        // Set the default metric based on the initial or updated model type
        const defaultMetric = state.modelType === "regression" ? "r2" : state.modelType === "classification" ? "accuracy" : "";
        setState(prev => ({ ...prev, metric: defaultMetric }));
    }, [state.modelType]);


    const handleChangeRowsPerPage = (event) => {
        setState(prev => ({
            ...prev,
            rowsPerPage: parseInt(event.target.value, 10),
            currentPage: INITIAL_PAGE,
        }));
    };

    const handleChangePage = (event, newPage) => {
        setState(prev => ({ ...prev, currentPage: newPage + 1 })); // plus 1 because MUI uses zero-based index for pages
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
                fileName: state.fileName,
                modelName: state.modelName.trim(),
                description: state.description.trim(),
                dataset: [filteredHeaders, ...filteredRows],
                targetColumn: state.targetColumn,
                modelType: state.modelType,
                trainingStrategy: state.trainingStrategy,
                samplingStrategy: state.samplingStrategy,
                metric: state.metric,
            };

            // Send the data to the server
            const response = await handleMakeRequest(navigate, '/api/trainModel/', 'POST', payload, {}, true); // Adjust the endpoint as necessary
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
        marginTop: '1px', // Adjust the top margin
        marginRight: '16px', // Adjust the right margin
    };

    const gridItemStyles = {
        padding: '8px', // Provides spacing inside each grid item
    };

    return (    
        <Box sx={{ p: 1 }}> {/* Use Box to provide padding around the entire component */}
            <Container maxWidth={false} sx={containerStyles}>
                <TitleView titleText="Train Model" IconComponent={TrainModelIcon} />
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
                            state={state}
                            updateData={updateData}
                            handleRemoveFile={handleRemoveFile}
                            setState={setState}
                            loading={state.isLoading}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <DatasetContent
                            state={state}
                            renderColumnOptions={renderColumnOptions}
                            handleChangePage={handleChangePage}
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
                        <Grid container spacing={2} alignItems="center">
                            <Grid item>
                                <ModelTypeRadioGroup
                                    value={state.modelType}
                                    onChange={handleInputChange}
                                />
                            </Grid>
                            <Grid item xs={2}>
                                <TrainingStrategySelect
                                    trainingStrategies={trainingStrategyOptions}
                                    value={state.trainingStrategy}
                                    onChange={handleInputChange}
                                />
                            </Grid>
                            {state.modelType === "classification" && <Grid item xs={2}>
                                <SamplingStrategySelect
                                    samplingStrategies={samplingStrategyOptions}
                                    value={state.samplingStrategy}
                                    onChange={handleInputChange}
                                />
                            </Grid>}
                            {state.modelType && <Grid item xs={2}>
                                <MetricSelect
                                    metrics={state.modelType === "regression" ? metricsRegressionOptions : state.modelType === "classification" ? metricsclassificationOptions : {}}
                                    value={state.metric}
                                    onChange={handleInputChange}
                                />
                            </Grid>}

                        </Grid>
                    </Grid>
                    <Box sx={{ p: 1 }}>
                        <Container maxWidth={false} sx={{ ...containerStyles }}>
                            {!isValidSubmission() && (
                                <Alert severity="error" sx={{ mb: 1 }}>
                                    <AlertTitle>Please fulfill these requirements!</AlertTitle>
                                    {state.datasetError && <div>{state.datasetError}</div>}
                                    {state.modelNameError && <div>{state.modelNameError}</div>}
                                    {state.modelTypeError && <div>{state.modelTypeError}</div>}
                                    {state.targetColumnError && <div>{state.targetColumnError}</div>}
                                </Alert>
                            )}
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